#!/usr/bin/env python3
"""Split pose-sheet images into one transparent PNG per figure.

Pipeline (per sheet):
  1. White paper -> transparency. Alpha is derived per pixel from luminance:
     L >= threshold -> alpha 0, L <= black point -> 255, linear between, so soft
     pencil edges stay semi-transparent. RGB values are copied unchanged
     (no recolouring); output is RGBA.
  2. Figure detection: binary-close the alpha mask so each figure's strokes
     merge, label connected components, drop specks < --min-area px.
  3. Figures that physically touch (blade tips, ponytails) merge into one
     component, so each figure's dense core is found with a heavy blur and a
     merged components are split between those cores along the raw strokes
     (geodesically where strokes truly touch). Seeded
     parts are "bodies"; seedless components are "islands". An island is
     kept only if its box overlaps/touches a body's box; it is then
     attached to that body. Unattached fragments are discarded. Each figure
     crop keeps only its own pixels (neighbours' strokes that intrude into the
     box are made transparent), then is trimmed with --pad px of padding.
  4. Figures are ordered top row left->right, then the next row, and saved as
     <sheet>_NN.png, plus a poses.json manifest {sheet: [{file, box}]}.
  5. Per-sheet counts are printed, with a warning when a sheet yields fewer
     figures than expected (or a component looks like merged figures).

Usage:
  python3 tools/split_poses.py                       # ./input -> ./poses
  python3 tools/split_poses.py -i art/poses -o poses
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

# Expected figures per sheet, matched by substring of the file stem.
EXPECTED = {"movement": 16, "attack": 15, "defence": 12, "defense": 12, "sword": 15}


def expected_for(stem: str) -> int | None:
    for key, n in EXPECTED.items():
        if key in stem.lower():
            return n
    return None


def luminance_alpha(rgb: np.ndarray, threshold: float, black: float | None) -> tuple[np.ndarray, float]:
    """Rec.601 luminance -> alpha. L >= threshold -> 0 (paper), L <= black
    point -> 255 (solid ink), linear ramp in between (soft pencil edges).
    black=None picks the 2nd percentile of the sheet's ink luminance, so the
    darkest strokes are fully opaque."""
    lum = rgb[..., 0] * 0.299 + rgb[..., 1] * 0.587 + rgb[..., 2] * 0.114
    if black is None:
        ink = lum[lum < threshold]
        black = float(np.percentile(ink, 2)) if ink.size else 0.0
    black = min(black, threshold - 1)
    alpha = (threshold - lum) / (threshold - black) * 255.0
    return np.clip(np.rint(alpha), 0, 255).astype(np.uint8), black


def disk(radius: int) -> np.ndarray:
    y, x = np.ogrid[-radius:radius + 1, -radius:radius + 1]
    return x * x + y * y <= radius * radius


def boxes_touch(a, b, gap: int) -> bool:
    """a, b = (y0, y1, x0, x1) half-open. True if they overlap within `gap`."""
    return not (a[1] + gap <= b[0] or b[1] + gap <= a[0] or
                a[3] + gap <= b[2] or b[3] + gap <= a[2])


def geodesic_grow(mask: np.ndarray, markers: np.ndarray) -> np.ndarray:
    """Geodesic Voronoi: grow integer markers 1px at a time, only through
    `mask`, until every reachable mask pixel is claimed. Pixels are thereby
    given to the seed with the shortest path *along the ink*, so a ponytail or
    blade stays with the body it is attached to."""
    lab = np.where(mask, markers, 0).astype(np.int32)
    st = np.ones((3, 3), bool)
    while True:
        free = mask & (lab == 0)
        if not free.any():
            break
        grown = ndi.grey_dilation(lab, footprint=st)
        claim = free & (grown > 0)
        if not claim.any():
            break
        lab[claim] = grown[claim]
    return lab


def split_group(ink: np.ndarray, seeds: np.ndarray, seed_ids: list[int]) -> np.ndarray:
    """Split one merged group of figures. Returns int map (0 = none, k = figure k).

    Works on the raw strokes (no closing): each raw stroke piece that contains
    one seed belongs to that figure; a piece holding several seeds (strokes
    that really touch) is divided geodesically; seedless pieces (detached
    hair tips, blade segments, motion lines) join the nearest assigned ink."""
    out = np.zeros(ink.shape, np.int32)
    seed_map = np.zeros(ink.shape, np.int32)
    for k, sid in enumerate(seed_ids, start=1):
        seed_map[seeds == sid] = k
    raw, _ = ndi.label(ink, structure=np.ones((3, 3), bool))
    pending = []
    for ri, sl in enumerate(ndi.find_objects(raw), start=1):
        if sl is None:
            continue
        piece = raw[sl] == ri
        ks = [v for v in np.unique(seed_map[sl][piece]) if v]
        if not ks:
            pending.append((sl, piece))
        elif len(ks) == 1:
            out[sl][piece] = ks[0]
        else:
            grown = geodesic_grow(piece, seed_map[sl] * piece)
            out[sl][piece] = grown[piece]
    assigned = out > 0
    if pending and assigned.any():
        _, (iy, ix) = ndi.distance_transform_edt(~assigned, return_indices=True)
        nearest = out[iy, ix]
        for sl, piece in pending:
            out[sl][piece] = nearest[sl][piece]
    return out


def reading_order(figs: list[dict]) -> list[dict]:
    """Group into rows by vertical centre, then sort each row left->right."""
    if not figs:
        return figs
    heights = [f["bbox"][1] - f["bbox"][0] for f in figs]
    row_tol = 0.5 * float(np.median(heights))
    figs = sorted(figs, key=lambda f: f["cy"])
    rows, current = [], [figs[0]]
    for f in figs[1:]:
        row_cy = np.mean([g["cy"] for g in current])
        if f["cy"] - row_cy > row_tol:
            rows.append(current)
            current = [f]
        else:
            current.append(f)
    rows.append(current)
    ordered = []
    for row in rows:
        ordered.extend(sorted(row, key=lambda f: f["cx"]))
    return ordered


def process_sheet(path: Path, out_dir: Path, args) -> tuple[list[dict], list[str]]:
    warnings: list[str] = []
    rgb = np.asarray(Image.open(path).convert("RGB"))
    h, w = rgb.shape[:2]
    alpha, black = luminance_alpha(rgb.astype(np.float32), args.threshold, args.black)

    # --- 2. component labelling on the closed alpha mask -------------------
    ink = alpha > 0
    closed = ndi.binary_closing(ink, structure=disk(args.close), iterations=1,
                                border_value=0)
    closed = ndi.binary_fill_holes(closed) | ink
    cc, n = ndi.label(closed, structure=np.ones((3, 3), bool))
    if n == 0:
        return [], [f"{path.name}: no ink found"]

    # Figure seeds: a heavy blur keeps the dense torso/leg mass of each figure
    # but washes out thin blades, hair tips and motion lines, so every figure
    # yields exactly one blob even where figures touch each other.
    a01 = alpha.astype(np.float32) / 255.0
    density = ndi.gaussian_filter(a01, args.seed_sigma)
    seeds, n_seeds = ndi.label(density > args.seed_thresh)
    if n_seeds:
        s_area = ndi.sum_labels(np.ones_like(seeds), seeds, np.arange(1, n_seeds + 1))
        for i, ar in enumerate(s_area, start=1):
            if ar < args.seed_min_area:
                seeds[seeds == i] = 0
    # Build a per-part label map: a closed component containing k seeds is
    # split into k parts (see split_group); seedless components stay whole.
    parts = np.zeros_like(cc)
    comps = []
    next_id = 1
    split_count = 0
    for ci, sl in enumerate(ndi.find_objects(cc), start=1):
        if sl is None:
            continue
        in_cc = cc[sl] == ci
        area = int(in_cc.sum())
        if area < args.min_area:
            continue
        s_ids = [v for v in np.unique(seeds[sl][in_cc]) if v]
        if len(s_ids) <= 1:
            parts[sl][in_cc] = next_id
            comps.append({"label": next_id, "area": area, "seeded": bool(s_ids)})
            next_id += 1
            continue
        split_count += 1
        sub = split_group(ink[sl] & in_cc, seeds[sl], s_ids)
        for k in range(1, len(s_ids) + 1):
            m = sub == k
            if not m.any():
                continue
            parts[sl][m] = next_id
            comps.append({"label": next_id, "area": int(m.sum()), "seeded": True})
            next_id += 1
    labels = parts
    if not comps:
        return [], [f"{path.name}: nothing above min-area"]
    for c, sl in zip(comps, ndi.find_objects(labels, max_label=next_id - 1)):
        c["bbox"] = (sl[0].start, sl[0].stop, sl[1].start, sl[1].stop)

    # --- 3. bodies (seeded parts) vs islands (detached fragments) ---------
    expected = expected_for(path.stem)
    comps.sort(key=lambda c: c["area"], reverse=True)
    bodies = [c for c in comps if c["seeded"]]
    if args.max_figures:
        bodies = bodies[:args.max_figures]
    body_labels = {c["label"] for c in bodies}
    islands = [c for c in comps if c["label"] not in body_labels]

    for b in bodies:
        b["members"] = [b["label"]]
        b["ubox"] = list(b["bbox"])
    dropped = 0
    for isl in islands:
        hits = [b for b in bodies if boxes_touch(isl["bbox"], b["bbox"], args.touch_gap)]
        if not hits:
            dropped += 1
            continue
        # attach to the body whose box overlaps it most
        def overlap(b):
            y0 = max(isl["bbox"][0], b["bbox"][0]); y1 = min(isl["bbox"][1], b["bbox"][1])
            x0 = max(isl["bbox"][2], b["bbox"][2]); x1 = min(isl["bbox"][3], b["bbox"][3])
            return max(0, y1 - y0) * max(0, x1 - x0)
        host = max(hits, key=overlap)
        host["members"].append(isl["label"])
        ub, ib = host["ubox"], isl["bbox"]
        host["ubox"] = [min(ub[0], ib[0]), max(ub[1], ib[1]), min(ub[2], ib[2]), max(ub[3], ib[3])]

    median_body = float(np.median([b["area"] for b in bodies]))
    for b in bodies:
        b["cy"] = (b["bbox"][0] + b["bbox"][1]) / 2
        b["cx"] = (b["bbox"][2] + b["bbox"][3]) / 2
        if b["area"] > args.merge_factor * median_body:
            warnings.append(f"{path.name}: component at x={int(b['cx'])},y={int(b['cy'])} is "
                            f"{b['area'] / median_body:.1f}x median size - possibly merged figures")

    # --- 4. crop, mask to own pixels, trim, save ---------------------------
    rgba_full = np.dstack([rgb, alpha])
    ordered = reading_order(bodies)
    manifest = []
    for idx, b in enumerate(ordered, start=1):
        y0, y1, x0, x1 = b["ubox"]
        own = np.isin(labels[y0:y1, x0:x1], b["members"])
        crop = rgba_full[y0:y1, x0:x1].copy()
        crop[..., 3] = np.where(own, crop[..., 3], 0)
        # re-trim to the actual non-transparent pixels, then pad
        ys, xs = np.nonzero(crop[..., 3])
        ty0, ty1, tx0, tx1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        gy0 = max(0, y0 + ty0 - args.pad); gy1 = min(h, y0 + ty1 + args.pad)
        gx0 = max(0, x0 + tx0 - args.pad); gx1 = min(w, x0 + tx1 + args.pad)
        out = np.zeros((gy1 - gy0, gx1 - gx0, 4), np.uint8)
        # (padding may extend past the sheet edge -> keep it transparent)
        out_h = (y0 + ty1) - (y0 + ty0)
        out_w = (x0 + tx1) - (x0 + tx0)
        oy = (y0 + ty0) - gy0
        ox = (x0 + tx0) - gx0
        out[oy:oy + out_h, ox:ox + out_w] = crop[ty0:ty1, tx0:tx1]
        name = f"{path.stem}_{idx:02d}.png"
        Image.fromarray(out, "RGBA").save(out_dir / name, optimize=True)
        manifest.append({"file": name, "box": [int(gx0), int(gy0), int(gx1), int(gy1)]})

    kept = len(manifest)
    msg = f"{path.name}: kept {kept} figure(s)"
    if expected is not None:
        msg += f" (expected {expected})"
    if islands:
        msg += f"; {len(islands) - dropped} fragment(s) attached, {dropped} detached dropped"
    if split_count:
        msg += f"; {split_count} touching group(s) split"
    print(msg)
    if expected is not None and kept < expected:
        warnings.append(f"{path.name}: only {kept} figures, expected {expected}")
    if expected is not None and kept > expected:
        warnings.append(f"{path.name}: {kept} figures, more than the {expected} expected "
                        f"(the sheet may really contain extra figures - check)")
    return manifest, warnings


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("-i", "--input", default="input", type=Path)
    ap.add_argument("-o", "--output", default="poses", type=Path)
    ap.add_argument("--threshold", type=float, default=238, help="luminance at/above which paper is fully transparent")
    ap.add_argument("--black", type=float, default=None, help="luminance at/below which ink is fully opaque (default: auto, 2nd pct of ink)")
    ap.add_argument("--close", type=int, default=9, help="closing disk radius (px) to join strokes")
    ap.add_argument("--min-area", type=int, default=1800, help="discard components smaller than this (px)")
    ap.add_argument("--seed-sigma", type=float, default=18, help="blur sigma for per-figure seed detection")
    ap.add_argument("--seed-thresh", type=float, default=0.45, help="blurred-density threshold for seeds (0-1)")
    ap.add_argument("--seed-min-area", type=int, default=300, help="ignore seed blobs smaller than this (px)")
    ap.add_argument("--max-figures", type=int, default=0, help="keep at most N largest figures (0 = no cap)")
    ap.add_argument("--touch-gap", type=int, default=4, help="px slack when testing island/body box contact")
    ap.add_argument("--merge-factor", type=float, default=2.2, help="warn when a figure is this many x the median area")
    ap.add_argument("--pad", type=int, default=9, help="transparent padding around each crop (px)")
    args = ap.parse_args()

    sheets = sorted(p for p in args.input.glob("*") if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"})
    if not sheets:
        print(f"no sheet images found in {args.input}/", file=sys.stderr)
        return 1
    args.output.mkdir(parents=True, exist_ok=True)
    for old in args.output.glob("*.png"):
        if re.search(r"_\d{2}\.png$", old.name):
            old.unlink()

    manifest, warnings = {}, []
    for sheet in sheets:
        entries, warns = process_sheet(sheet, args.output, args)
        manifest[sheet.stem] = entries
        warnings += warns
    (args.output / "poses.json").write_text(json.dumps(manifest, indent=2) + "\n")
    total = sum(len(v) for v in manifest.values())
    print(f"wrote {total} pose PNGs + poses.json to {args.output}/")
    for w in warnings:
        print(f"WARNING: {w}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
