export interface TurnaroundView {
  id: string;
  name: string;
  angle: number; // 0, 90, 180, 270
  label: string;
  url: string;
  weaponlessUrl?: string;
  width: number;
  height: number;
  description: string;
}

export interface AnatomyHotspot {
  id: string;
  title: string;
  category: 'landmark' | 'clothing' | 'weapon' | 'anatomy';
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  shortDesc: string;
  fullSpec: string;
  animationNote: string;
}

export const TURNAROUND_VIEWS: TurnaroundView[] = [
  {
    id: 'front',
    name: 'Front View',
    angle: 0,
    label: '0° Front',
    url: '/art/views/01_front.png',
    weaponlessUrl: '/art/views/01_front_no_weapon.png',
    width: 970,
    height: 1178,
    description: 'Front neutral standing martial-arts stance. Hilt crosses belly, scabbard tip extends past left thigh.'
  },
  {
    id: 'right_profile',
    name: 'Right Profile',
    angle: 90,
    label: '90° Right Profile',
    url: '/art/views/02_right_profile.png',
    width: 869,
    height: 1183,
    description: 'Far side profile showing katana scabbard tip behind rear leg and full ponytail arc.'
  },
  {
    id: 'back',
    name: 'Back View',
    angle: 180,
    label: '180° Back',
    url: '/art/views/03_back.png',
    width: 1059,
    height: 1180,
    description: 'Back view revealing shoulder blade musculature, scabbard angled across left hip, and hair root tie.'
  },
  {
    id: 'left_profile',
    name: 'Left Profile',
    angle: 270,
    label: '270° Left Profile',
    url: '/art/views/04_left_profile.png',
    width: 967,
    height: 1177,
    description: 'Near side profile displaying full hilt, iron tsuba, cord wrapping, and sash knot.'
  }
];

export const ANATOMY_HOTSPOTS: AnatomyHotspot[] = [
  {
    id: 'ponytail',
    title: 'High Crown Ponytail (Silhouette Landmark)',
    category: 'landmark',
    x: 62,
    y: 11,
    shortDesc: 'Signature silhouette feature, bound high on crown, bold trailing arc.',
    fullSpec: 'Bound high on the crown into a single warrior ponytail, cord-wrapped at base. Ponytail is at least one head-length and sweeps outward in a bold arc. Several loose strands fall across forehead and beside cheeks.',
    animationNote: '3–4 bone chain. Leads one frame behind head rotation; overshoots and settles on stops. Must read clearly at 64px scale.'
  },
  {
    id: 'face',
    title: 'Facial Anatomy & Disciplined Gaze',
    category: 'anatomy',
    x: 35,
    y: 17,
    shortDesc: 'Angular, high cheekbones, calm level gaze, unmarked skin.',
    fullSpec: 'Young adult East-Asian male, age ~22. Straight nose with defined bridge, thin straight brows, narrow calm eyes tilted slightly down at outer corners, relaxed mouth. No beard, scars or wounds.',
    animationNote: 'Calm discipline stays constant. Linework is fine and razor-sharp to maintain readability at high speed.'
  },
  {
    id: 'collar',
    title: 'Layer 1: Inner Shirt Collar',
    category: 'clothing',
    x: 34,
    y: 25,
    shortDesc: 'Light-toned short standing collar visible at throat.',
    fullSpec: 'Base costume layer. Light-toned fabric creates strong contrast against the darker crossover tunic, drawing the eye upward to the face.',
    animationNote: 'Rigged as separate cloth mesh layer beneath tunic.'
  },
  {
    id: 'tunic',
    title: 'Layer 2: Crossover Training Tunic',
    category: 'clothing',
    x: 35,
    y: 34,
    shortDesc: 'Dark wide diagonal placket (left over right), standing collar.',
    fullSpec: 'Athletic cut allowing full shoulder rotation. Dark tone provides dominant mass for the combat silhouette.',
    animationNote: 'Diagonal seam line serves as visual anchor during torso twists and turns.'
  },
  {
    id: 'sleeves',
    title: 'Layer 3: Bound Wide Sleeves',
    category: 'clothing',
    x: 19,
    y: 46,
    shortDesc: 'Generous sleeves bound below elbow by cloth wraps.',
    fullSpec: 'Generous and wide cloth gathered and securely bound below elbow. Keeps wrists completely free to satisfy multi-weapon rules (unarmed, katana, wooden staff, bow).',
    animationNote: 'Bind below elbow is the primary pivot; free sleeve cloth flares and trails secondary motion from that point.'
  },
  {
    id: 'katana',
    title: 'Layer 4: Katana & Sash Mount',
    category: 'weapon',
    x: 44,
    y: 45,
    shortDesc: 'Left hip, edge up, 40° downward angle, round iron tsuba.',
    fullSpec: 'Simple, elegant, unornamented. Thrust through waist sash at left hip, angled down and back at 40°. Plain dark lacquered scabbard, small round iron tsuba, lozenge criss-cross wrapped hilt, thin braided cord.',
    animationNote: 'Because scabbard follows sash-line, it reads correctly from all 4 views. Katana is sheathed in turnaround, supporting weaponless variant without redrawing.'
  },
  {
    id: 'sash',
    title: 'Layer 5: Triple-Wrapped Waist Sash',
    category: 'clothing',
    x: 42,
    y: 54,
    shortDesc: 'Wide sash wrapped 3 times, low flat knot, hanging tail.',
    fullSpec: 'Wide cloth wrapped tightly three times around waist, low flat knot at front-left, one narrow tail hanging over the left thigh.',
    animationNote: 'Sash tail follows hips with opposite phase to the ponytail on turns (anti-phase dynamic balance).'
  },
  {
    id: 'hem',
    title: 'Layer 6: Split Tunic Hem & Under-Panel',
    category: 'clothing',
    x: 32,
    y: 63,
    shortDesc: 'Mid-thigh length with deep side and center splits.',
    fullSpec: 'Tunic hem reaches mid-thigh with deep side and center splits, with a second shorter under-panel beneath. Unhindered leg extension for high kicks.',
    animationNote: 'Deforms dynamically on high kicks (e.g. Roundhouse Mawashi-geri); side splits keep legs from merging into silhouette.'
  },
  {
    id: 'pants',
    title: 'Layer 7: Loose Fighting Pants',
    category: 'clothing',
    x: 28,
    y: 75,
    shortDesc: 'Loose, tapered fit with clear knee and shin folds.',
    fullSpec: 'Athletic martial arts trousers tapered down towards the boots. Fabric fold lines provide visual depth and volume.',
    animationNote: 'Knee folds compress and expand on crouching, jumping, and deep horse stances.'
  },
  {
    id: 'boots',
    title: 'Layer 8: Mid-Calf Wrapped Boots',
    category: 'clothing',
    x: 24,
    y: 91,
    shortDesc: 'Folded cuff, instep strap, low heel, shin cloth wraps.',
    fullSpec: 'Mid-calf dark uppers, folded cloth cuff, instep strap, low heel, rounded toe, cloth wraps crossing the shin.',
    animationNote: 'Clear boot line essential for 64px silhouette readability and ground-line alignment.'
  }
];
