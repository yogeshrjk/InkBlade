export interface AnimationSequence {
  id: string;
  name: string;
  category: 'locomotion' | 'combat' | 'sword' | 'defence';
  description: string;
  defaultFps: number;
  frameFiles: string[];
}

export const PRESET_SEQUENCES: AnimationSequence[] = [
  {
    id: 'seq_walk',
    name: 'Martial Walk Cycle',
    category: 'locomotion',
    description: 'Measured, disciplined martial gait keeping center of gravity low and stable.',
    defaultFps: 8,
    frameFiles: [
      '01_movement_sheet_01.png',
      '01_movement_sheet_03.png',
      '01_movement_sheet_04.png',
      '01_movement_sheet_05.png',
      '01_movement_sheet_02.png'
    ]
  },
  {
    id: 'seq_sprint',
    name: 'Tactical Sprint & Low Dash',
    category: 'locomotion',
    description: 'High velocity sprint and low glide dash with ponytail whipping back in aerodynamic arc.',
    defaultFps: 10,
    frameFiles: [
      '01_movement_sheet_07.png',
      '01_movement_sheet_08.png',
      '01_movement_sheet_09.png',
      '01_movement_sheet_08.png'
    ]
  },
  {
    id: 'seq_jump_roll',
    name: 'Aerial Leap & Ground Roll',
    category: 'locomotion',
    description: 'Vertical ascent, peak hover, impact compression landing, and seamless tactical roll reset.',
    defaultFps: 9,
    frameFiles: [
      '01_movement_sheet_10.png',
      '01_movement_sheet_11.png',
      '01_movement_sheet_12.png',
      '01_movement_sheet_13.png',
      '01_movement_sheet_14.png',
      '01_movement_sheet_15.png',
      '01_movement_sheet_16.png',
      '01_movement_sheet_17.png'
    ]
  },
  {
    id: 'seq_unarmed_combo',
    name: '3-Hit Striking Combo',
    category: 'combat',
    description: 'Rapid hand-to-hand sequence: Lead snap jab, rear power cross, and open iron palm thrust.',
    defaultFps: 9,
    frameFiles: [
      '01_movement_sheet_01.png',
      '02_attack_sheet_01.png',
      '02_attack_sheet_02.png',
      '02_attack_sheet_03.png',
      '02_attack_sheet_05.png',
      '01_movement_sheet_01.png'
    ]
  },
  {
    id: 'seq_kicks',
    name: 'Martial Arts Kicking Form',
    category: 'combat',
    description: 'Dynamic kicking chain showing full limb extension and split-hem costume deformation.',
    defaultFps: 8,
    frameFiles: [
      '02_attack_sheet_06.png',
      '02_attack_sheet_07.png',
      '02_attack_sheet_08.png',
      '02_attack_sheet_09.png',
      '02_attack_sheet_10.png',
      '02_attack_sheet_11.png',
      '01_movement_sheet_01.png'
    ]
  },
  {
    id: 'seq_iaido',
    name: 'Iaido Quick-Draw & Sheathe (Noto)',
    category: 'sword',
    description: 'Classic single-motion draw, cleaving horizontal slash, blood cleanse, and formal resheathing.',
    defaultFps: 7,
    frameFiles: [
      '04_sword_sheet_01.png',
      '04_sword_sheet_02.png',
      '04_sword_sheet_03.png',
      '04_sword_sheet_07.png',
      '04_sword_sheet_13.png',
      '04_sword_sheet_14.png',
      '04_sword_sheet_15.png'
    ]
  },
  {
    id: 'seq_blade_whirl',
    name: 'Katana Forms & Cyclone Cleave',
    category: 'sword',
    description: 'Fluid sword transitions: Mid-guard to descending cut, upward diagonal slash, and 360° whirlwind.',
    defaultFps: 8,
    frameFiles: [
      '04_sword_sheet_04.png',
      '04_sword_sheet_05.png',
      '04_sword_sheet_06.png',
      '04_sword_sheet_10.png',
      '04_sword_sheet_11.png',
      '04_sword_sheet_04.png'
    ]
  },
  {
    id: 'seq_knockdown',
    name: 'Heavy Knockdown & Kip-Up Recovery',
    category: 'defence',
    description: 'Heavy kinetic impact reaction, skidding tumble, prone grounding, and dynamic spring recovery.',
    defaultFps: 7,
    frameFiles: [
      '03_defence_sheet_08.png',
      '03_defence_sheet_09.png',
      '03_defence_sheet_10.png',
      '03_defence_sheet_11.png',
      '03_defence_sheet_12.png',
      '01_movement_sheet_17.png'
    ]
  }
];
