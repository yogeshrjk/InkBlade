#!/usr/bin/env python3
"""
InkBlade - Master Character Sheet builder.

Takes the four rendered turnaround views, normalises them to a strict
grayscale ink palette (black / grey / off-white paper), matches figure
scale and ground line across all views, and assembles a clean 2x2
master character reference sheet with no labels, borders or grids.

Usage:  python3 tools/build_master_sheet.py
"""

import os
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIEWS_DIR = os.path.join(ROOT, "art", "turnaround")
OUT_SHEET = os.path.join(ROOT, "art", "InkBlade_master_character_sheet.png")
OUT_CLEAN_DIR = os.path.join(ROOT, "art", "views")

# Reading order of the sheet (the requested turnaround order).
VIEWS = [
    "01_front.png",
    "02_right_profile.png",
    "03_back.png",
    "04_left_profile.png",
]

# --- Target look -----------------------------------------------------------
PAPER = 247.0     # off-white paper value every view is normalised to
BLACK_PT = 18.0   # gentle black point lift for punch, keeps midtones open
TARGET_H = 1140   # figure height (px) on the master sheet
CELL_W = 1340     # sheet cell width
CELL_H = 1520     # sheet cell height
INK_THR = 190     # ink / paper separation threshold
UPSCALE_BLUR = 0.4  # gaussian radius to soften nearest-neighbour scaling


def ink_mask(a, thr=INK_THR):
    """Denoised ink mask: drops isolated speckle from the paper texture."""
    m = a < thr
    m[:, m.sum(axis=0) < 3] = False
    m[m.sum(axis=1) < 3, :] = False
    return m


def normalise(a):
    """
    Unify the paper tone across views, then apply a gentle black-point lift.

    Deliberately light-touch: the ink washes and dry-brush midtones carry the
    artwork, so the dark end must stay open rather than being crushed to black.
    """
    paper = float(np.median(a[a > 200]))
    if paper < 1:
        return a
    out = a * (PAPER / paper)
    out = (out - BLACK_PT) * (255.0 / (255.0 - BLACK_PT))
    return np.clip(out, 0, 255)


def analyse(a):
    """Figure bbox, ground line, and standing axis from the feet band."""
    m = ink_mask(a)
    ys = np.where(m.any(axis=1))[0]
    xs = np.where(m.any(axis=0))[0]
    top, bot = int(ys[0]), int(ys[-1])
    left, right = int(xs[0]), int(xs[-1])

    h = bot - top
    foot = m[bot - max(12, int(h * 0.06)):bot + 1]
    cols = foot.sum(axis=0).astype(np.float64)
    cx = float((np.arange(len(cols)) * cols).sum() / max(cols.sum(), 1))
    return dict(top=top, bot=bot, left=left, right=right, axis=cx)


def main():
    os.makedirs(OUT_CLEAN_DIR, exist_ok=True)
    sheet = Image.new("L", (CELL_W * 2, CELL_H * 2), int(PAPER))
    report = []

    for i, name in enumerate(VIEWS):
        src = os.path.join(VIEWS_DIR, name)
        im = Image.open(src).convert("L")
        a = np.asarray(im).astype(np.float32)

        a = normalise(a)
        info = analyse(a)

        fig_h = info["bot"] - info["top"] + 1
        scale = TARGET_H / fig_h

        # Crop around the figure with generous padding so the figure never
        # touches the crop edge, then scale to the common target height.
        pad_x = 90
        x0 = max(0, info["left"] - pad_x)
        x1 = min(a.shape[1], info["right"] + pad_x + 1)
        y0 = max(0, info["top"] - 40)
        y1 = min(a.shape[0], info["bot"] + 41)

        crop = Image.fromarray(a[y0:y1, x0:x1].astype(np.uint8), "L")
        nw = max(1, int(round(crop.width * scale)))
        nh = max(1, int(round(crop.height * scale)))
        crop_s = crop.resize((nw, nh), Image.LANCZOS)
        crop_s = crop_s.filter(ImageFilter.GaussianBlur(UPSCALE_BLUR))

        # Figure position inside the scaled crop, expressed from its bottom.
        fig_bottom_in_crop = int(round((info["bot"] - y0) * scale))
        axis_in_crop = int(round((info["axis"] - x0) * scale))

        # Ground line: figure feet sit this far above the cell bottom.
        ground_y = CELL_H - 210
        cell_x = (i % 2) * CELL_W
        cell_y = (i // 2) * CELL_H

        paste_x = cell_x + CELL_W // 2 - axis_in_crop
        paste_y = cell_y + ground_y - fig_bottom_in_crop

        sheet.paste(crop_s, (paste_x, paste_y))
        report.append((name, fig_h, scale, paste_x, paste_y, nh))

        # Also emit the individual normalised, scale-matched view.
        crop_s.save(os.path.join(OUT_CLEAN_DIR, name))

    sheet.save(OUT_SHEET)

    # Weaponless variant: same normalisation, so it sits in the same palette.
    src = os.path.join(ROOT, "art", "weaponless", "01_front_no_weapon.png")
    if os.path.exists(src):
        a = normalise(np.asarray(Image.open(src).convert("L")).astype(np.float32))
        out = os.path.join(OUT_CLEAN_DIR, "01_front_no_weapon.png")
        Image.fromarray(a.astype(np.uint8), "L").save(out)
        print(f"weaponless     -> {out}")

    print(f"master sheet -> {OUT_SHEET}  ({sheet.width}x{sheet.height})")
    for name, fh, sc, px, py, nh in report:
        print(f"  {name:26s} src_h={fh}  scale={sc:.3f}  paste=({px},{py})  out_h={nh}")


if __name__ == "__main__":
    main()
