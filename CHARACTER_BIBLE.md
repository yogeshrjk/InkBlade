# InkBlade — Character Bible

**Asset type:** Master character reference sheet (2D fighting game)
**Art direction:** hand-drawn ink · graphite · charcoal · monochrome
**Status:** design-locked turnaround, ready for rigging and frame-by-frame animation

---

## 1. The character

An original young adult East-Asian male martial-arts warrior, age ~22. **Not** a copy of any
existing property — an original design built to the supplied art direction.

| Attribute | Spec |
|---|---|
| Build | Athletic, lean, powerful. Broad shoulders, narrow waist, long limbs. |
| Height | 7.5 heads tall |
| Anatomy | Realistic — correct joint placement, readable muscle planes, no exaggeration |
| Face | Angular, high cheekbones, straight nose with defined bridge, thin straight brows, narrow calm eyes tilted slightly down at the outer corners, relaxed mouth, clean unmarked skin |
| Expression | Calm, disciplined, level gaze. No beard, scars or wounds. |
| Hair | Long, thick, straight jet-black. Bound **high on the crown** into a single warrior ponytail, cord-wrapped at the base. Ponytail is at least one head-length and sweeps outward in a bold arc. Several loose strands fall across the forehead and down beside both cheeks to chest level. |

### Hair is the signature
The ponytail is the character's silhouette landmark. It is deliberately long enough to carry
secondary animation — it should trail, whip and settle one to two frames behind the head on
every turn, dash and attack. The loose strands are the secondary layer beneath that.

---

## 2. Costume — built for animation

Every garment is a **separate layer** so it can be animated independently.

1. **Inner shirt** — light-toned, short standing collar visible at the throat
2. **Crossover training tunic** — dark, wide diagonal placket (left over right), short standing collar
3. **Sleeves** — generous and wide, gathered and bound **below the elbow** by cloth wraps
4. **Forearm wraps** — bound cloth on both forearms
5. **Waist sash** — wide, wrapped three times, low flat knot at front-left, one narrow tail hanging over the thigh
6. **Tunic hem** — reaches mid-thigh with deep side and centre splits
7. **Under-panel** — second shorter layer beneath the hem
8. **Fighting pants** — loose, tapered, clear knee and shin folds
9. **Boots** — mid-calf, dark uppers, folded cloth cuff, instep strap, low heel, rounded toe, cloth wraps crossing the shin

The silhouette stays agile and unarmored. Fabric fold lines are drawn in, so cloth can be
animated as secondary motion rather than a rigid shell.

---

## 3. Hands, arms and legs — the multi-weapon rule

The base character must read clearly **unarmed**. In every view the arms hang clear of the
tunic and all five fingers are distinct.

The same rig therefore supports:

| Weapon | Grip | Notes |
|---|---|---|
| Unarmed | open palm / closed fist | base state — see `art/views/01_front_no_weapon.png` |
| Wooden staff | two-hand | sleeves bound below elbow keep wrists free |
| Katana | two-hand | draw/noto from the left-hip scabbard |
| Bow | three-finger Mediterranean | forearm wraps stay clear of the string |

No weapon is baked into the body. The turnaround shows the katana **sheathed only**, so the
weaponless build is a straight variant rather than a re-draw.

---

## 4. The katana

Simple, elegant, realistic, unornamented — it must never dominate the figure.

- Worn at the **left hip**, edge up, thrust through the sash
- Angled down and back at roughly 40°
- Plain dark lacquered scabbard, gentle curve, rounded end cap
- Small round iron tsuba, plain ring
- Hilt wrapped in a simple lozenge criss-cross, plain pommel cap
- Thin braided cord knotted against the sash

Because the scabbard follows the sash-line, it reads correctly from every angle: front (hilt
across the belly, tip past the left thigh), profiles (near side = full hilt + scabbard; far
side = scabbard tip behind the rear leg), and back (scabbard across the left hip).

---

## 5. Turnaround

Printed reading order: **Front · Right profile** (top row), **Back · Left profile** (bottom row).

- Neutral standing martial-arts stance in all four views
- Identical proportions, face, hairstyle, clothing, belt, boots, weapon and scale
- Full body head-to-feet, nothing cropped, figure centred
- Figure heights normalised to within 0.5% of each other; ground line matched

---

## 6. Ink style guide

**Line weight**

| Element | Treatment |
|---|---|
| Silhouette, major shadows, clothing edges, attack direction | thick expressive brush strokes |
| Facial detail, hair, cloth folds, anatomy detail | thin fine lines |
| Movement areas | loose ink strokes, dry-brush tips |

Linework is intentionally **not** mathematically clean — slight hand-drawn imperfection is
part of the look.

**Tone** — black · dark grey · light grey · white paper only.
Cross-hatching, ink washes, charcoal shading, brush shadows and subtle graphite texture.
Strong light/dark contrast, face kept readable, no over-rendering.

**Silhouette** must stay legible at small game resolution — the costume reads as one dark
mass with a long hair landmark.

**Colour:** none. All delivered files are true grayscale (max chroma = 0). No blue, purple,
green, yellow, orange, bright red, or coloured lighting. Paper is clean off-white.
Special effects are added by the engine, not baked into the art.

**Excluded from all files:** text, labels, CJK characters, stamps, seals, signatures, logos,
watermarks, UI, borders, grid lines, frames, ink splashes, blood, wounds, gore.

---

## 7. Files

| File | Purpose |
|---|---|
| `art/InkBlade_master_character_sheet.png` | 2680×3040 master sheet, all four views |
| `art/views/01_front.png` | scale-matched front |
| `art/views/02_right_profile.png` | scale-matched right profile |
| `art/views/03_back.png` | scale-matched back |
| `art/views/04_left_profile.png` | scale-matched left profile |
| `art/views/01_front_no_weapon.png` | **base build** — no katana, open silhouette |
| `art/turnaround/*.png` | original full-resolution renders |
| `art/weaponless/*.png` | original full-resolution weaponless render |
| `tools/build_master_sheet.py` | rebuilds the sheet + normalised views |
| `art/poses/01_movement_sheet.png` | pose sheet — movement (stances, walk, run, dash, jump, fall, get-up) |
| `art/poses/02_attack_sheet.png` | pose sheet — attacks (punches, strikes, sword thrusts, kicks) |
| `art/poses/03_defence_sheet.png` | pose sheet — defence (blocks, parries, dodges, knockback, knockdown, get-up), solo |
| `art/poses/04_sword_sheet.png` | pose sheet — katana (guards, parries, slashes, draw, sheathe, rest) |
| `poses/<sheet>_NN.png` | one transparent RGBA cut-out per figure, NN = reading order (59 total) |
| `poses/poses.json` | manifest `{sheet: [{file, box:[x0,y0,x1,y1]}]}`, box in sheet pixels |
| `tools/split_poses.py` | splits pose sheets into per-figure transparent PNGs |

Rebuild:

```bash
python3 tools/build_master_sheet.py
```

Split pose sheets into per-figure cut-outs:

```bash
python3 -m venv .venv && .venv/bin/pip install numpy scipy pillow
.venv/bin/python tools/split_poses.py -i art/poses -o poses   # defaults: -i input -o poses
```

Alpha comes from luminance (paper ≥ L238 → transparent, darkest ink → opaque, grays
semi-transparent); RGB is copied untouched. Figures that touch on the sheet are separated
along their strokes, so blades and ponytails stay with the right body.

The build script unifies paper tone across views, applies a gentle black-point lift that
keeps the ink washes open, matches figure scale to a common height, aligns the ground line,
and assembles the plate. It does not redraw or filter the linework.

---

## 8. Animation notes

- **Ponytail** — 3–4 bone chain. Leads one frame behind head rotation; overshoots and settles on stops.
- **Loose strands** — 1–2 bone chain each, follow the ponytail with more lag and softer damping.
- **Waist sash tail** — follows the hips, opposite phase to the ponytail on turns.
- **Tunic hem and side splits** — deform on leg lift; keep the side splits readable so legs do not merge into the cloth.
- **Wide sleeves** — bind below the elbow is the pivot; the free sleeve cloth flares from there.
- **Silhouette check** — at 64 px tall the read must be: dark figure, long hair arc, clear boot line.
