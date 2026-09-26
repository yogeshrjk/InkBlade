# InkBlade · 墨刃

**Master 2D Fighting Game Character Reference System & Interactive Combat Dojo**

[![Art Direction](https://img.shields.io/badge/Art%20Direction-Hand--Drawn%20Ink%20%C2%B7%20Monochrome-black)](CHARACTER_BIBLE.md)
[![Status](https://img.shields.io/badge/Status-Design--Locked%20Master%20Kit-red)](CHARACTER_BIBLE.md)
[![Sprites](https://img.shields.io/badge/Sprites-59%20Transparent%20Cutouts-emerald)](poses/poses.json)

---

## Overview

**InkBlade** is an original East-Asian martial arts warrior character crafted specifically for 2D fighting games, action platformers, and frame-by-frame animation. The art direction follows a traditional **sumi-e (水墨画)** aesthetic: hand-drawn ink, graphite, charcoal shading, and true zero-chroma monochrome washes on off-white rice paper.

This repository contains the complete design-locked character turnaround, transparent pose cutouts, technical specifications, Python synthesis tools, and a full-featured web application.

---

## Web Application Features

The included web application provides a comprehensive suite of tools for game developers, animators, and martial arts fans:

### 1. 🎮 The Dojo (Interactive 2D Combat Sandbox)
- **Playable Character Engine**: Full physics and animation state machine utilizing the 59 hand-drawn transparent cutouts.
- **Move Set**:
  - *Locomotion*: Idle breathing, forward advance, backward spacing, airborne leap, impact landing, tactical ground roll (with invulnerability frames).
  - *Unarmed Combos*: Lead snap jab, rear cross, internal iron palm thrust, high roundhouse kick (Mawashi-geri), and low dragon leg sweep.
  - *Katana Forms*: Iaido quick-draw, horizontal cleave (Ichimonji), two-handed piercing thrust (Tsuki), and spinning cyclone cleave.
  - *Defensive Mechanics*: High guard, crossed iron block, and timed **Parry** window that deflects attacks with a metallic spark and freezes the opponent in hitstun.
  - *Ultimate*: **墨痕一闪 (Black Ink Flash)** — slow-motion dash cleave with calligraphy brush splash trails.
- **Opponent Modes**:
  - *Practice Straw Dummy*: Wobble physics, combo counter, total damage readout, and frame advantage data.
  - *Shadow Ink Warrior*: Dynamic sparring AI with Novice and Sensei difficulty modes, counter-attacks, blocks, and jump spacing.
- **Frame Data Inspector**: Real-time overlay showing red active hitboxes, green hurtboxes, startup/active/recovery frame counts, and frame advantage.
- **Procedural Sound Engine**: Web Audio API synthesizer for katana slashes, clash clangs, punch impacts, footfalls, taiko drums, and ambient bamboo forest wind.

### 2. 🔄 360° Turnaround & Costume Anatomy
- **4 Perspective Orbit**: Scale-matched 0° Front, 90° Right Profile, 180° Back, and 270° Left Profile views.
- **Multi-Weapon Rule Toggle**: Switch between Katana Sheathed and Unarmed (Weaponless Base Build) to inspect the open rig silhouette.
- **10 Interactive Anatomy Hotspots**:
  - High crown ponytail landmark (3–4 bone chain)
  - Disciplined gaze & facial anatomy (22yo warrior)
  - 8 independent costume layers (inner shirt, crossover tunic, gathered sleeves, forearm wraps, triple-wrapped sash, split tunic hem, fighting pants, wrapped boots).
- **Silhouette Readability Lab (Section 8 Validator)**:
  - Micro-scale validator testing readability at 64px, 96px, and 128px scales.
  - Contrast filters: Ink Linework, Pure Black Silhouette, Inverted White Ink, and Warm Rice Paper.
- **Master Plate Expander**: High-resolution viewer for the 2680×3040 master turnaround plate.

### 3. 🎬 Animation Sequencer & Sprite Studio
- **59-Pose Library**: Categorized by Movement (17), Attacks (15), Defence (12), and Katana Forms (15) with bounding boxes and dimensions.
- **Timeline Sequencer**:
  - Pre-loaded animations: Walk Cycle, Sprint Dash, Aerial Leap & Roll, 3-Hit Strike Combo, Kicking Form, Iaido Quick-Draw, Katana Cyclone, and Knockdown & Kip-Up.
  - Add, remove, duplicate, and reorder frames on an interactive timeline.
  - Variable playback speed (2–24 FPS), loop modes (Loop, Ping-Pong, Once), and **Onion Skinning** ghost frames.
- **Export Capabilities**:
  - *Export Sprite Strip PNG*: Stitches the active sequence into a horizontal sprite strip ready for game engines.
  - *Export JSON Clip*: Frame timings, duration, bounding boxes, and metadata.

### 4. 📜 Character Bible & Master Spec
- Full interactive editorial viewer containing all 8 sections of `CHARACTER_BIBLE.md`:
  1. Character Anatomy & Silhouette Landmark
  2. Independent Costume Layers
  3. Multi-Weapon Rig Rule (Unarmed, Staff, Katana, Bow)
  4. Katana Design & Sash Integration
  5. Scale-Matched Turnaround Norms
  6. Sumi-e Ink Style Guide & Zero-Chroma Rule
  7. Secondary Motion & Bone Chain Dynamics
  8. Technical Image Processing Pipeline

### 5. 📦 Asset Exporter & Custom Atlas Generator
- **Production Downloads**: Direct 1-click access to master sheets, high-res views, and manifest files.
- **Custom 2D Sprite Atlas Generator**:
  - Compile cutouts into a single sprite sheet with customizable columns, padding, and background tone (Transparent, Dark Charcoal, Rice Paper).
  - Generates matching JSON atlas descriptor compatible with Unity, Godot, Phaser, and PixiJS.

---

## Quick Start

### Web Application

```bash
# Install dependencies
npm install

# Start Vite development server (binds to 0.0.0.0:5173)
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```

### Python Asset Processing Tools

```bash
# Rebuild the 2680x3040 master turnaround sheet
python3 tools/build_master_sheet.py

# Split pose sheets into per-figure transparent PNG cutouts
python3 -m venv .venv && .venv/bin/pip install numpy scipy pillow
.venv/bin/python tools/split_poses.py -i art/poses -o poses
```

---

## Controls Cheat Sheet (Combat Dojo)

| Input | Action |
|---|---|
| `A` / `D` (or Arrows) | Walk Forward / Backward |
| `Space` / `W` | Jump / Aerial Leap |
| `Shift` | Tactical Ground Roll (i-Frames) |
| `J` | Light Punch Combo (Jab → Cross → Iron Palm) |
| `K` | High Roundhouse Kick (Mawashi-geri) |
| `S + K` | Low Dragon Leg Sweep |
| `U` | Katana Slash (Ichimonji Cleave) |
| `W + U` | Spinning Cyclone Cleave |
| `S + U` | Two-Handed Piercing Thrust (Tsuki) |
| `L` (Instant) | Timed Parry (Deflects & freezes attacker) |
| `L` (Hold) | Crossed Arm Iron Guard |
| `I` | 墨痕一闪 Black Ink Flash (Requires 50% Ink) |

---

## License

Art assets and character design specifications © Yogesh Rajak.
Code is provided under the ISC License.
