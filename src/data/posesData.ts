// Auto-generated InkBlade poses data manifest
export interface PoseData {
  id: string;
  index: number;
  file: string;
  url: string;
  sheet: string;
  category: 'movement' | 'attack' | 'defence' | 'sword';
  name: string;
  description: string;
  tags: string[];
  combatAction: string;
  box: [number, number, number, number]; // [x0, y0, x1, y1]
  width: number;
  height: number;
}

export const INKBLADE_POSES: PoseData[] = [
  {
    "id": "pose_01",
    "index": 1,
    "file": "01_movement_sheet_01.png",
    "url": "/poses/01_movement_sheet_01.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Combat Ready Stance",
    "description": "Neutral martial arts stance with sheathed katana, balanced weight, ready posture.",
    "tags": [
      "idle",
      "stance",
      "neutral",
      "guard"
    ],
    "combatAction": "idle",
    "box": [
      68,
      12,
      244,
      289
    ],
    "width": 176,
    "height": 277
  },
  {
    "id": "pose_02",
    "index": 2,
    "file": "01_movement_sheet_02.png",
    "url": "/poses/01_movement_sheet_02.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Weight Shift & Focus",
    "description": "Slight weight shift to the back foot, torso angled, surveying the opponent.",
    "tags": [
      "idle",
      "stance",
      "focus"
    ],
    "combatAction": "idle_shift",
    "box": [
      259,
      15,
      448,
      288
    ],
    "width": 189,
    "height": 273
  },
  {
    "id": "pose_03",
    "index": 3,
    "file": "01_movement_sheet_03.png",
    "url": "/poses/01_movement_sheet_03.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Walking Stride: Heel Strike",
    "description": "Forward movement stride, leading heel making contact with the floor.",
    "tags": [
      "walk",
      "forward",
      "locomotion"
    ],
    "combatAction": "walk_1",
    "box": [
      477,
      17,
      668,
      290
    ],
    "width": 191,
    "height": 273
  },
  {
    "id": "pose_04",
    "index": 4,
    "file": "01_movement_sheet_04.png",
    "url": "/poses/01_movement_sheet_04.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Walking Stride: Mid-Pass",
    "description": "Passing phase of the walk cycle, center of mass moving smoothly.",
    "tags": [
      "walk",
      "forward",
      "passing"
    ],
    "combatAction": "walk_2",
    "box": [
      698,
      18,
      892,
      290
    ],
    "width": 194,
    "height": 272
  },
  {
    "id": "pose_05",
    "index": 5,
    "file": "01_movement_sheet_05.png",
    "url": "/poses/01_movement_sheet_05.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Walking Stride: Push-Off",
    "description": "Trailing foot pushes off, hip advances, arms swinging subtly.",
    "tags": [
      "walk",
      "forward",
      "push"
    ],
    "combatAction": "walk_3",
    "box": [
      920,
      13,
      1114,
      289
    ],
    "width": 194,
    "height": 276
  },
  {
    "id": "pose_06",
    "index": 6,
    "file": "01_movement_sheet_06.png",
    "url": "/poses/01_movement_sheet_06.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Deep Horse Stance (Kiba-dachi)",
    "description": "Low, grounded martial arts horse stance with wide base for stability.",
    "tags": [
      "stance",
      "low",
      "grounded",
      "horse"
    ],
    "combatAction": "low_stance",
    "box": [
      1132,
      12,
      1312,
      286
    ],
    "width": 180,
    "height": 274
  },
  {
    "id": "pose_07",
    "index": 7,
    "file": "01_movement_sheet_07.png",
    "url": "/poses/01_movement_sheet_07.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Sprint Initiation",
    "description": "Explosive forward lean from stationary stance to initiate rapid sprint.",
    "tags": [
      "sprint",
      "dash",
      "start"
    ],
    "combatAction": "sprint_start",
    "box": [
      40,
      276,
      215,
      531
    ],
    "width": 175,
    "height": 255
  },
  {
    "id": "pose_08",
    "index": 8,
    "file": "01_movement_sheet_08.png",
    "url": "/poses/01_movement_sheet_08.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "High-Speed Sprint Stride",
    "description": "Full extension sprint stride with trailing ponytail whipping back.",
    "tags": [
      "sprint",
      "run",
      "dash",
      "fast"
    ],
    "combatAction": "sprint_1",
    "box": [
      283,
      283,
      482,
      529
    ],
    "width": 199,
    "height": 246
  },
  {
    "id": "pose_09",
    "index": 9,
    "file": "01_movement_sheet_09.png",
    "url": "/poses/01_movement_sheet_09.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Low Ground Dash",
    "description": "Low-profile tactical dash closing distance beneath high attacks.",
    "tags": [
      "dash",
      "glide",
      "low",
      "rush"
    ],
    "combatAction": "dash_rush",
    "box": [
      558,
      293,
      799,
      517
    ],
    "width": 241,
    "height": 224
  },
  {
    "id": "pose_10",
    "index": 10,
    "file": "01_movement_sheet_10.png",
    "url": "/poses/01_movement_sheet_10.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Jump Compression (Crouch)",
    "description": "Deep knee bend compressing kinetic energy before vertical leaping.",
    "tags": [
      "jump",
      "anticipation",
      "crouch"
    ],
    "combatAction": "jump_crouch",
    "box": [
      855,
      285,
      1045,
      529
    ],
    "width": 190,
    "height": 244
  },
  {
    "id": "pose_11",
    "index": 11,
    "file": "01_movement_sheet_11.png",
    "url": "/poses/01_movement_sheet_11.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Airborne Ascension",
    "description": "Upward vertical leap with hair trailing downward, rising into air.",
    "tags": [
      "jump",
      "airborne",
      "ascend",
      "leap"
    ],
    "combatAction": "jump_up",
    "box": [
      1089,
      293,
      1346,
      524
    ],
    "width": 257,
    "height": 231
  },
  {
    "id": "pose_12",
    "index": 12,
    "file": "01_movement_sheet_12.png",
    "url": "/poses/01_movement_sheet_12.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Apex Airborne Pause",
    "description": "Suspended at peak jump height, surveying target from above.",
    "tags": [
      "jump",
      "apex",
      "air",
      "float"
    ],
    "combatAction": "jump_apex",
    "box": [
      42,
      525,
      238,
      759
    ],
    "width": 196,
    "height": 234
  },
  {
    "id": "pose_13",
    "index": 13,
    "file": "01_movement_sheet_13.png",
    "url": "/poses/01_movement_sheet_13.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Aerial Dive Deceleration",
    "description": "Descending towards earth with feet aligned for impact absorption.",
    "tags": [
      "jump",
      "fall",
      "descend"
    ],
    "combatAction": "jump_fall",
    "box": [
      261,
      561,
      469,
      757
    ],
    "width": 208,
    "height": 196
  },
  {
    "id": "pose_14",
    "index": 14,
    "file": "01_movement_sheet_14.png",
    "url": "/poses/01_movement_sheet_14.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Impact Landing Crouch",
    "description": "Three-point contact landing absorbing momentum into the ground.",
    "tags": [
      "landing",
      "impact",
      "crouch"
    ],
    "combatAction": "land_crouch",
    "box": [
      499,
      499,
      668,
      724
    ],
    "width": 169,
    "height": 225
  },
  {
    "id": "pose_15",
    "index": 15,
    "file": "01_movement_sheet_15.png",
    "url": "/poses/01_movement_sheet_15.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Tactical Ground Roll",
    "description": "Shoulder roll dispersing kinetic energy across canvas.",
    "tags": [
      "roll",
      "tumble",
      "recovery",
      "evade"
    ],
    "combatAction": "roll_forward",
    "box": [
      688,
      522,
      951,
      714
    ],
    "width": 263,
    "height": 192
  },
  {
    "id": "pose_16",
    "index": 16,
    "file": "01_movement_sheet_16.png",
    "url": "/poses/01_movement_sheet_16.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Low Squat Reset",
    "description": "Low recovery squat rising from roll with eyes fixed forward.",
    "tags": [
      "recovery",
      "crouch",
      "reset"
    ],
    "combatAction": "roll_recover",
    "box": [
      952,
      546,
      1121,
      753
    ],
    "width": 169,
    "height": 207
  },
  {
    "id": "pose_17",
    "index": 17,
    "file": "01_movement_sheet_17.png",
    "url": "/poses/01_movement_sheet_17.png",
    "sheet": "01_movement_sheet",
    "category": "movement",
    "name": "Rising Return to Guard",
    "description": "Extending legs to return seamlessly back to combat ready stance.",
    "tags": [
      "recover",
      "stand",
      "guard"
    ],
    "combatAction": "return_guard",
    "box": [
      1146,
      548,
      1340,
      753
    ],
    "width": 194,
    "height": 205
  },
  {
    "id": "pose_18",
    "index": 18,
    "file": "02_attack_sheet_01.png",
    "url": "/poses/02_attack_sheet_01.png",
    "sheet": "02_attack_sheet",
    "category": "attack",
    "name": "Lead Snap Jab",
    "description": "Quick unarmed jab from the lead hand, testing opponent reaction.",
    "tags": [
      "punch",
      "jab",
      "light",
      "unarmed"
    ],
    "combatAction": "light_1",
    "box": [
      29,
      18,
      229,
      270
    ],
    "width": 200,
    "height": 252
  },
  {
    "id": "pose_19",
    "index": 19,
    "file": "02_attack_sheet_02.png",
    "url": "/poses/02_attack_sheet_02.png",
    "sheet": "02_attack_sheet",
    "category": "attack",
    "name": "Rear Cross Strike",
    "description": "Rotational straight punch powered through the hips and rear foot.",
    "tags": [
      "punch",
      "cross",
      "heavy",
      "unarmed"
    ],
    "combatAction": "light_2",
    "box": [
      305,
      17,
      515,
      269
    ],
    "width": 210,
    "height": 252
  },
  {
    "id": "pose_20",
    "index": 20,
    "file": "02_attack_sheet_03.png",
    "url": "/poses/02_attack_sheet_03.png",
    "sheet": "02_attack_sheet",
    "category": "attack",
    "name": "Iron Palm Thrust",
    "description": "Open-palm internal strike aimed at the chest sternum.",
    "tags": [
      "palm",
      "strike",
      "thrust",
      "unarmed"
    ],
    "combatAction": "light_3",
    "box": [
      584,
      19,
      780,
      266
    ],
    "width": 196,
    "height": 247
  },
  {
    "id": "pose_21",
    "index": 21,
    "file": "02_attack_sheet_04.png",
    "url": "/poses/02_attack_sheet_04.png",
    "sheet": "02_attack_sheet",
    "category": "attack",
    "name": "Lunging Spear Hand",
    "description": "Deep forward lunge with piercing spear hand fingers.",
    "tags": [
      "spear",
      "lunge",
      "pierce",
      "unarmed"
    ],
    "combatAction": "lunge_strike",
    "box": [
      771,
      14,
      1080,
      270
    ],
    "width": 309,
    "height": 256
  },
  {
    "id": "pose_22",
    "index": 22,
    "file": "02_attack_sheet_05.png",
    "url": "/poses/02_attack_sheet_05.png",
    "sheet": "02_attack_sheet",
    "category": "attack",
    "name": "Flying Knee Strike",
    "description": "Explosive forward leaping knee smash targeting midsection.",
    "tags": [
      "knee",
      "flying",
      "heavy",
      "unarmed"
    ],
    "combatAction": "knee_strike",
    "box": [
      1035,
      35,
      1338,
      268
    ],
    "width": 303,
    "height": 233
  },
  {
    "id": "pose_23",
    "index": 23,
    "file": "02_attack_sheet_06.png",
    "url": "/poses/02_attack_sheet_06.png",
    "sheet": "02_attack_sheet",
    "category": "attack",
    "name": "Chambered Front Kick",
    "description": "Raising knee to chest in tight chamber preparation for kick.",
    "tags": [
      "kick",
      "chamber",
      "preparation"
    ],
    "combatAction": "kick_prep",
    "box": [
      41,
      265,
      235,
      525
    ],
    "width": 194,
    "height": 260
  },
  {
    "id": "pose_24",
    "index": 24,
    "file": "02_attack_sheet_07.png",
    "url": "/poses/02_attack_sheet_07.png",
    "sheet": "02_attack_sheet",
    "category": "attack",
    "name": "Snap Front Kick (Mae-geri)",
    "description": "Crisp linear front snap kick targeting solar plexus.",
    "tags": [
      "kick",
      "front",
      "snap",
      "mae-geri"
    ],
    "combatAction": "front_kick",
    "box": [
      319,
      271,
      504,
      522
    ],
    "width": 185,
    "height": 251
  },
  {
    "id": "pose_25",
    "index": 25,
    "file": "02_attack_sheet_08.png",
    "url": "/poses/02_attack_sheet_08.png",
    "sheet": "02_attack_sheet",
    "category": "attack",
    "name": "Side Kick Chamber",
    "description": "Torso rotated sideways with heel aligned toward target.",
    "tags": [
      "kick",
      "side",
      "chamber"
    ],
    "combatAction": "side_kick_prep",
    "box": [
      588,
      274,
      782,
      518
    ],
    "width": 194,
    "height": 244
  },
  {
    "id": "pose_26",
    "index": 26,
    "file": "02_attack_sheet_09.png",
    "url": "/poses/02_attack_sheet_09.png",
    "sheet": "02_attack_sheet",
    "category": "attack",
    "name": "Full Penetrating Side Kick (Yoko-geri)",
    "description": "Horizontal thrust side kick driving through opponent defense.",
    "tags": [
      "kick",
      "side",
      "yoko-geri",
      "heavy"
    ],
    "combatAction": "side_kick",
    "box": [
      817,
      271,
      1070,
      520
    ],
    "width": 253,
    "height": 249
  },
  {
    "id": "pose_27",
    "index": 27,
    "file": "02_attack_sheet_10.png",
    "url": "/poses/02_attack_sheet_10.png",
    "sheet": "02_attack_sheet",
    "category": "attack",
    "name": "High Roundhouse Kick (Mawashi-geri)",
    "description": "High arc rotational kick whipping ponytail across the silhouette.",
    "tags": [
      "kick",
      "roundhouse",
      "high",
      "mawashi"
    ],
    "combatAction": "roundhouse_kick",
    "box": [
      1083,
      276,
      1348,
      520
    ],
    "width": 265,
    "height": 244
  },
  {
    "id": "pose_28",
    "index": 28,
    "file": "02_attack_sheet_11.png",
    "url": "/poses/02_attack_sheet_11.png",
    "sheet": "02_attack_sheet",
    "category": "attack",
    "name": "Spinning Crescent Kick",
    "description": "Full 360-degree rotational spinning hook/crescent kick.",
    "tags": [
      "kick",
      "spin",
      "crescent",
      "combo"
    ],
    "combatAction": "spin_kick",
    "box": [
      27,
      521,
      249,
      760
    ],
    "width": 222,
    "height": 239
  },
  {
    "id": "pose_29",
    "index": 29,
    "file": "02_attack_sheet_12.png",
    "url": "/poses/02_attack_sheet_12.png",
    "sheet": "02_attack_sheet",
    "category": "attack",
    "name": "Low Dragon Sweep",
    "description": "Ground-sweeping low leg sweep to break opponent balance.",
    "tags": [
      "kick",
      "sweep",
      "low",
      "takedown"
    ],
    "combatAction": "low_sweep",
    "box": [
      287,
      558,
      531,
      748
    ],
    "width": 244,
    "height": 190
  },
  {
    "id": "pose_30",
    "index": 30,
    "file": "02_attack_sheet_13.png",
    "url": "/poses/02_attack_sheet_13.png",
    "sheet": "02_attack_sheet",
    "category": "attack",
    "name": "Rising Dragon Uppercut",
    "description": "Ascending fist uppercut lifting opponent into the air.",
    "tags": [
      "uppercut",
      "rising",
      "launch",
      "punch"
    ],
    "combatAction": "uppercut",
    "box": [
      578,
      522,
      802,
      764
    ],
    "width": 224,
    "height": 242
  },
  {
    "id": "pose_31",
    "index": 31,
    "file": "02_attack_sheet_14.png",
    "url": "/poses/02_attack_sheet_14.png",
    "sheet": "02_attack_sheet",
    "category": "attack",
    "name": "Short Elbow Smash",
    "description": "Close-quarters devastating elbow strike pivoting with the shoulder.",
    "tags": [
      "elbow",
      "smash",
      "close",
      "heavy"
    ],
    "combatAction": "elbow_smash",
    "box": [
      858,
      515,
      1053,
      765
    ],
    "width": 195,
    "height": 250
  },
  {
    "id": "pose_32",
    "index": 32,
    "file": "02_attack_sheet_15.png",
    "url": "/poses/02_attack_sheet_15.png",
    "sheet": "02_attack_sheet",
    "category": "attack",
    "name": "Twin Fist Symmetrical Strike",
    "description": "Simultaneous double punch focusing power into center mass.",
    "tags": [
      "fist",
      "double",
      "strike",
      "power"
    ],
    "combatAction": "double_punch",
    "box": [
      1086,
      523,
      1308,
      715
    ],
    "width": 222,
    "height": 192
  },
  {
    "id": "pose_33",
    "index": 33,
    "file": "03_defence_sheet_01.png",
    "url": "/poses/03_defence_sheet_01.png",
    "sheet": "03_defence_sheet",
    "category": "defence",
    "name": "High Forearm Guard",
    "description": "Upward forearm deflection blocking overhead weapon strikes.",
    "tags": [
      "block",
      "high",
      "guard",
      "defend"
    ],
    "combatAction": "block_high",
    "box": [
      83,
      17,
      275,
      263
    ],
    "width": 192,
    "height": 246
  },
  {
    "id": "pose_34",
    "index": 34,
    "file": "03_defence_sheet_02.png",
    "url": "/poses/03_defence_sheet_02.png",
    "sheet": "03_defence_sheet",
    "category": "defence",
    "name": "Inward Parry Sweep",
    "description": "Diagonal wrist/forearm sweep deflecting linear thrusts outward.",
    "tags": [
      "parry",
      "deflect",
      "counter"
    ],
    "combatAction": "parry_in",
    "box": [
      425,
      5,
      604,
      263
    ],
    "width": 179,
    "height": 258
  },
  {
    "id": "pose_35",
    "index": 35,
    "file": "03_defence_sheet_03.png",
    "url": "/poses/03_defence_sheet_03.png",
    "sheet": "03_defence_sheet",
    "category": "defence",
    "name": "Crossed Arm Iron Guard (Juji-uke)",
    "description": "Forearms crossed at chest level forming an impenetrable wedge.",
    "tags": [
      "guard",
      "cross",
      "iron",
      "defend"
    ],
    "combatAction": "block_cross",
    "box": [
      750,
      24,
      960,
      262
    ],
    "width": 210,
    "height": 238
  },
  {
    "id": "pose_36",
    "index": 36,
    "file": "03_defence_sheet_04.png",
    "url": "/poses/03_defence_sheet_04.png",
    "sheet": "03_defence_sheet",
    "category": "defence",
    "name": "Low Deflection Sweep (Gedan-barai)",
    "description": "Downward sweeping block deflecting kicks and low stabs.",
    "tags": [
      "block",
      "low",
      "sweep",
      "defend"
    ],
    "combatAction": "block_low",
    "box": [
      1099,
      18,
      1307,
      264
    ],
    "width": 208,
    "height": 246
  },
  {
    "id": "pose_37",
    "index": 37,
    "file": "03_defence_sheet_05.png",
    "url": "/poses/03_defence_sheet_05.png",
    "sheet": "03_defence_sheet",
    "category": "defence",
    "name": "Evasive Back Sway",
    "description": "Upper torso leaning back out of reach of incoming horizontal blade.",
    "tags": [
      "evade",
      "sway",
      "dodge"
    ],
    "combatAction": "dodge_back",
    "box": [
      61,
      267,
      270,
      515
    ],
    "width": 209,
    "height": 248
  },
  {
    "id": "pose_38",
    "index": 38,
    "file": "03_defence_sheet_06.png",
    "url": "/poses/03_defence_sheet_06.png",
    "sheet": "03_defence_sheet",
    "category": "defence",
    "name": "Slip Step Flank Evade",
    "description": "Pivoting lateral slip stepping outside opponent attack vector.",
    "tags": [
      "slip",
      "dodge",
      "flank",
      "evade"
    ],
    "combatAction": "dodge_side",
    "box": [
      409,
      275,
      630,
      514
    ],
    "width": 221,
    "height": 239
  },
  {
    "id": "pose_39",
    "index": 39,
    "file": "03_defence_sheet_07.png",
    "url": "/poses/03_defence_sheet_07.png",
    "sheet": "03_defence_sheet",
    "category": "defence",
    "name": "Light Hit Flinch",
    "description": "Torso recoiling slightly from light strike impact.",
    "tags": [
      "hit",
      "flinch",
      "recoil",
      "light"
    ],
    "combatAction": "hit_light",
    "box": [
      742,
      266,
      956,
      514
    ],
    "width": 214,
    "height": 248
  },
  {
    "id": "pose_40",
    "index": 40,
    "file": "03_defence_sheet_08.png",
    "url": "/poses/03_defence_sheet_08.png",
    "sheet": "03_defence_sheet",
    "category": "defence",
    "name": "Heavy Stagger Recoil",
    "description": "Head and torso snapped back under heavy kinetic impact.",
    "tags": [
      "hit",
      "stagger",
      "heavy",
      "recoil"
    ],
    "combatAction": "hit_heavy",
    "box": [
      1084,
      273,
      1320,
      512
    ],
    "width": 236,
    "height": 239
  },
  {
    "id": "pose_41",
    "index": 41,
    "file": "03_defence_sheet_09.png",
    "url": "/poses/03_defence_sheet_09.png",
    "sheet": "03_defence_sheet",
    "category": "defence",
    "name": "Knockback Skidding Slide",
    "description": "Feet sliding backwards across canvas absorbing high-momentum push.",
    "tags": [
      "knockback",
      "slide",
      "pushed"
    ],
    "combatAction": "knockback_slide",
    "box": [
      65,
      515,
      281,
      757
    ],
    "width": 216,
    "height": 242
  },
  {
    "id": "pose_42",
    "index": 42,
    "file": "03_defence_sheet_10.png",
    "url": "/poses/03_defence_sheet_10.png",
    "sheet": "03_defence_sheet",
    "category": "defence",
    "name": "Airborne Tumble Fall",
    "description": "Lifted off feet and rotating mid-air from unblocked launcher.",
    "tags": [
      "fall",
      "tumble",
      "airborne",
      "hit"
    ],
    "combatAction": "air_tumble",
    "box": [
      400,
      521,
      611,
      757
    ],
    "width": 211,
    "height": 236
  },
  {
    "id": "pose_43",
    "index": 43,
    "file": "03_defence_sheet_11.png",
    "url": "/poses/03_defence_sheet_11.png",
    "sheet": "03_defence_sheet",
    "category": "defence",
    "name": "Ground Knockdown (Prone)",
    "description": "Flat on back on the canvas with katana lying parallel.",
    "tags": [
      "knockdown",
      "down",
      "prone",
      "ground"
    ],
    "combatAction": "knockdown",
    "box": [
      706,
      653,
      1011,
      764
    ],
    "width": 305,
    "height": 111
  },
  {
    "id": "pose_44",
    "index": 44,
    "file": "03_defence_sheet_12.png",
    "url": "/poses/03_defence_sheet_12.png",
    "sheet": "03_defence_sheet",
    "category": "defence",
    "name": "Tactical Kip-Up Recovery",
    "description": "Explosive spring from ground back to feet, regaining guard.",
    "tags": [
      "getup",
      "kipup",
      "recovery",
      "stand"
    ],
    "combatAction": "kip_up",
    "box": [
      1096,
      549,
      1298,
      760
    ],
    "width": 202,
    "height": 211
  },
  {
    "id": "pose_45",
    "index": 45,
    "file": "04_sword_sheet_01.png",
    "url": "/poses/04_sword_sheet_01.png",
    "sheet": "04_sword_sheet",
    "category": "sword",
    "name": "Iaido Rest (Hand on Hilt)",
    "description": "Calm zanshin posture with left hand steadying scabbard, right on hilt.",
    "tags": [
      "katana",
      "iaido",
      "stance",
      "hilt"
    ],
    "combatAction": "sword_rest",
    "box": [
      66,
      12,
      247,
      297
    ],
    "width": 181,
    "height": 285
  },
  {
    "id": "pose_46",
    "index": 46,
    "file": "04_sword_sheet_02.png",
    "url": "/poses/04_sword_sheet_02.png",
    "sheet": "04_sword_sheet",
    "category": "sword",
    "name": "Overhead Two-Hand Guard (Jodan-no-Kamae)",
    "description": "Both hands gripping hilt above head in aggressive offensive stance.",
    "tags": [
      "katana",
      "jodan",
      "guard",
      "overhead"
    ],
    "combatAction": "sword_jodan",
    "box": [
      267,
      12,
      481,
      294
    ],
    "width": 214,
    "height": 282
  },
  {
    "id": "pose_47",
    "index": 47,
    "file": "04_sword_sheet_03.png",
    "url": "/poses/04_sword_sheet_03.png",
    "sheet": "04_sword_sheet",
    "category": "sword",
    "name": "Horizontal Cleave Slash (Ichimonji)",
    "description": "Full horizontal sword sweep with trailing ponytail and extended reach.",
    "tags": [
      "katana",
      "slash",
      "horizontal",
      "cleave"
    ],
    "combatAction": "sword_slash_1",
    "box": [
      547,
      23,
      898,
      280
    ],
    "width": 351,
    "height": 257
  },
  {
    "id": "pose_48",
    "index": 48,
    "file": "04_sword_sheet_04.png",
    "url": "/poses/04_sword_sheet_04.png",
    "sheet": "04_sword_sheet",
    "category": "sword",
    "name": "Mid-Level Forward Guard (Chudan-no-Kamae)",
    "description": "Classic centerline katana guard pointing blade directly at opponent throat.",
    "tags": [
      "katana",
      "chudan",
      "guard",
      "centerline"
    ],
    "combatAction": "sword_chudan",
    "box": [
      808,
      33,
      1075,
      285
    ],
    "width": 267,
    "height": 252
  },
  {
    "id": "pose_49",
    "index": 49,
    "file": "04_sword_sheet_05.png",
    "url": "/poses/04_sword_sheet_05.png",
    "sheet": "04_sword_sheet",
    "category": "sword",
    "name": "Descending Vertical Cleave (Kiri-oroshi)",
    "description": "Devastating overhead downward cut splitting through center guard.",
    "tags": [
      "katana",
      "slash",
      "vertical",
      "down"
    ],
    "combatAction": "sword_slash_2",
    "box": [
      1138,
      15,
      1342,
      285
    ],
    "width": 204,
    "height": 270
  },
  {
    "id": "pose_50",
    "index": 50,
    "file": "04_sword_sheet_06.png",
    "url": "/poses/04_sword_sheet_06.png",
    "sheet": "04_sword_sheet",
    "category": "sword",
    "name": "Ascending Diagonal Slash (Kesa-giri)",
    "description": "Upward diagonal sword draw cleaving from hip to opposite shoulder.",
    "tags": [
      "katana",
      "slash",
      "diagonal",
      "kesa"
    ],
    "combatAction": "sword_slash_3",
    "box": [
      45,
      275,
      244,
      527
    ],
    "width": 199,
    "height": 252
  },
  {
    "id": "pose_51",
    "index": 51,
    "file": "04_sword_sheet_07.png",
    "url": "/poses/04_sword_sheet_07.png",
    "sheet": "04_sword_sheet",
    "category": "sword",
    "name": "Two-Handed Piercing Thrust (Tsuki)",
    "description": "Straight linear blade thrust focusing entire body weight onto tip.",
    "tags": [
      "katana",
      "thrust",
      "pierce",
      "tsuki"
    ],
    "combatAction": "sword_thrust",
    "box": [
      314,
      271,
      588,
      521
    ],
    "width": 274,
    "height": 250
  },
  {
    "id": "pose_52",
    "index": 52,
    "file": "04_sword_sheet_08.png",
    "url": "/poses/04_sword_sheet_08.png",
    "sheet": "04_sword_sheet",
    "category": "sword",
    "name": "Reverse Blade Deflection (Hiki-uke)",
    "description": "Using flat of blade at 45 degrees to deflect and guide strike away.",
    "tags": [
      "katana",
      "parry",
      "deflect",
      "guard"
    ],
    "combatAction": "sword_parry",
    "box": [
      623,
      273,
      821,
      522
    ],
    "width": 198,
    "height": 249
  },
  {
    "id": "pose_53",
    "index": 53,
    "file": "04_sword_sheet_09.png",
    "url": "/poses/04_sword_sheet_09.png",
    "sheet": "04_sword_sheet",
    "category": "sword",
    "name": "Low Ground Guard (Gedan-no-Kamae)",
    "description": "Blade tip lowered toward ground inviting high attack before counter.",
    "tags": [
      "katana",
      "gedan",
      "guard",
      "low"
    ],
    "combatAction": "sword_gedan",
    "box": [
      866,
      260,
      1029,
      526
    ],
    "width": 163,
    "height": 266
  },
  {
    "id": "pose_54",
    "index": 54,
    "file": "04_sword_sheet_10.png",
    "url": "/poses/04_sword_sheet_10.png",
    "sheet": "04_sword_sheet",
    "category": "sword",
    "name": "Spinning Cyclone Slash",
    "description": "Full rotational 360-degree whirlwind cleave striking all around.",
    "tags": [
      "katana",
      "spin",
      "cyclone",
      "aoe"
    ],
    "combatAction": "sword_cyclone",
    "box": [
      1060,
      274,
      1321,
      524
    ],
    "width": 261,
    "height": 250
  },
  {
    "id": "pose_55",
    "index": 55,
    "file": "04_sword_sheet_11.png",
    "url": "/poses/04_sword_sheet_11.png",
    "sheet": "04_sword_sheet",
    "category": "sword",
    "name": "Extended Lunge Pierce",
    "description": "Deep lunging forward strike with long ponytail streaming behind.",
    "tags": [
      "katana",
      "lunge",
      "pierce",
      "reach"
    ],
    "combatAction": "sword_lunge",
    "box": [
      37,
      523,
      358,
      758
    ],
    "width": 321,
    "height": 235
  },
  {
    "id": "pose_56",
    "index": 56,
    "file": "04_sword_sheet_12.png",
    "url": "/poses/04_sword_sheet_12.png",
    "sheet": "04_sword_sheet",
    "category": "sword",
    "name": "Crossed Scabbard & Blade Parry",
    "description": "Defensive crossed lock catching opponent weapon between blade and scabbard.",
    "tags": [
      "katana",
      "lock",
      "parry",
      "dual"
    ],
    "combatAction": "sword_cross_parry",
    "box": [
      386,
      499,
      595,
      764
    ],
    "width": 209,
    "height": 265
  },
  {
    "id": "pose_57",
    "index": 57,
    "file": "04_sword_sheet_13.png",
    "url": "/poses/04_sword_sheet_13.png",
    "sheet": "04_sword_sheet",
    "category": "sword",
    "name": "Blade Flick Blood Cleansing (Chiburui)",
    "description": "Sharp snapping flick of the wrist shedding ink/dew from the blade.",
    "tags": [
      "katana",
      "chiburui",
      "cleanse",
      "ritual"
    ],
    "combatAction": "sword_chiburui",
    "box": [
      689,
      492,
      849,
      766
    ],
    "width": 160,
    "height": 274
  },
  {
    "id": "pose_58",
    "index": 58,
    "file": "04_sword_sheet_14.png",
    "url": "/poses/04_sword_sheet_14.png",
    "sheet": "04_sword_sheet",
    "category": "sword",
    "name": "Resheathing Alignment (Noto)",
    "description": "Precise tactile insertion of katana tip back into scabbard mouth.",
    "tags": [
      "katana",
      "noto",
      "sheathe",
      "focus"
    ],
    "combatAction": "sword_noto",
    "box": [
      944,
      490,
      1118,
      766
    ],
    "width": 174,
    "height": 276
  },
  {
    "id": "pose_59",
    "index": 59,
    "file": "04_sword_sheet_15.png",
    "url": "/poses/04_sword_sheet_15.png",
    "sheet": "04_sword_sheet",
    "category": "sword",
    "name": "Sheathed Zanshin Calm",
    "description": "Final click of tsuba against scabbard, returning to total stillness.",
    "tags": [
      "katana",
      "sheathed",
      "calm",
      "zanshin"
    ],
    "combatAction": "sword_zanshin",
    "box": [
      1128,
      487,
      1331,
      765
    ],
    "width": 203,
    "height": 278
  }
];

export const SHEET_NAMES = [
  { id: '01_movement_sheet', name: 'Movement', count: 17, description: 'Stances, walk, run, dash, jump, fall, get-up' },
  { id: '02_attack_sheet', name: 'Attacks', count: 15, description: 'Punches, strikes, kicks, sweeps, uppercuts' },
  { id: '03_defence_sheet', name: 'Defence', count: 12, description: 'Blocks, parries, dodges, knockback, knockdown, get-up' },
  { id: '04_sword_sheet', name: 'Katana Forms', count: 15, description: 'Guards, parries, slashes, thrusts, draw, sheathe' },
];
