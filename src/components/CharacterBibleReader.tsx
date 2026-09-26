import React, { useState } from 'react';
import { BookOpen, Scissors, Shield, Compass, Palette, Film, Terminal, Check, Copy } from 'lucide-react';

interface BibleSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const CharacterBibleReader: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('character');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sections: BibleSection[] = [
    {
      id: 'character',
      title: '1. The Character & Landmark',
      icon: <Compass className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-amber-100 mb-2">Design Concept & Core Spec</h3>
            <p className="text-stone-300 leading-relaxed text-sm">
              An original young adult East-Asian male martial-arts warrior, age ~22. <strong className="text-amber-200">Not</strong> a copy of any existing property — an original design built to the supplied hand-drawn ink art direction.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 font-mono">
                  <th className="py-2 px-3">Attribute</th>
                  <th className="py-2 px-3">Specification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-300">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-amber-200">Build</td>
                  <td className="py-2.5 px-3">Athletic, lean, powerful. Broad shoulders, narrow waist, long limbs.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-amber-200">Height Proportions</td>
                  <td className="py-2.5 px-3"><strong>7.5 heads tall</strong> (heroic human proportion)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-amber-200">Anatomy</td>
                  <td className="py-2.5 px-3">Realistic — correct joint placement, readable muscle planes, no exaggeration.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-amber-200">Face & Expression</td>
                  <td className="py-2.5 px-3">Angular, high cheekbones, straight nose with defined bridge, thin straight brows, narrow calm eyes tilted slightly down at outer corners, relaxed mouth, clean unmarked skin. Calm, disciplined, level gaze. No scars or wounds.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-amber-200">Hair Landmark</td>
                  <td className="py-2.5 px-3">Long, thick, straight jet-black. Bound <strong>high on the crown</strong> into a single warrior ponytail, cord-wrapped at the base. At least one head-length, sweeps outward in a bold arc. Loose strands fall across forehead and down beside cheeks to chest.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4">
            <h4 className="font-serif font-bold text-amber-200 text-sm mb-1">Hair is the Silhouette Landmark</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              The ponytail is the character's signature silhouette identifier. It is deliberately long enough to carry secondary animation — trailing, whipping and settling 1–2 frames behind head movement on every turn, dash, and strike.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'costume',
      title: '2. Costume Layers (Built for Animation)',
      icon: <Scissors className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-amber-100 mb-2">Independent Costume Separation</h3>
            <p className="text-stone-300 leading-relaxed text-sm">
              Every garment is designed as a <strong>separate layer</strong> so it can deform and animate independently in 2D bone rigs and frame-by-frame animation without rigid intersection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { num: 1, name: 'Inner shirt', desc: 'Light-toned, short standing collar visible at throat' },
              { num: 2, name: 'Crossover training tunic', desc: 'Dark, wide diagonal placket (left over right), short standing collar' },
              { num: 3, name: 'Sleeves', desc: 'Generous and wide, gathered and bound below the elbow by cloth wraps' },
              { num: 4, name: 'Forearm wraps', desc: 'Bound cloth on both forearms (provides protection & wrist clearance)' },
              { num: 5, name: 'Waist sash', desc: 'Wide, wrapped three times, low flat knot at front-left, one narrow tail hanging over thigh' },
              { num: 6, name: 'Tunic hem', desc: 'Reaches mid-thigh with deep side and centre splits for kicking mobility' },
              { num: 7, name: 'Under-panel', desc: 'Second shorter layer beneath the hem for depth' },
              { num: 8, name: 'Fighting pants', desc: 'Loose, tapered, clear knee and shin folds' },
              { num: 9, name: 'Boots', desc: 'Mid-calf, dark uppers, folded cloth cuff, instep strap, low heel, shin cloth wraps' },
            ].map((layer) => (
              <div key={layer.num} className="bg-stone-900/60 p-3 rounded-lg border border-stone-800">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-red-900/60 text-red-300 flex items-center justify-center font-mono font-bold text-[10px]">
                    {layer.num}
                  </span>
                  <span className="font-semibold text-stone-200">{layer.name}</span>
                </div>
                <p className="text-stone-400 pl-7">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'weapon_rule',
      title: '3. Multi-Weapon Rig Rule & Katana',
      icon: <Shield className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-amber-100 mb-2">The Multi-Weapon Rig Architecture</h3>
            <p className="text-stone-300 leading-relaxed text-sm">
              The base character must read clearly <strong>unarmed</strong>. In every view the arms hang clear of the tunic and all five fingers are distinct. The same rig supports 4 distinct fighting states:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 font-mono">
                  <th className="py-2 px-3">Weapon</th>
                  <th className="py-2 px-3">Grip Form</th>
                  <th className="py-2 px-3">Rigging Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-300">
                <tr>
                  <td className="py-2 px-3 font-semibold text-amber-200">Unarmed</td>
                  <td className="py-2 px-3">Open palm / closed fist</td>
                  <td className="py-2 px-3">Base state — see <code>art/views/01_front_no_weapon.png</code></td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-amber-200">Wooden staff (Bo)</td>
                  <td className="py-2 px-3">Two-hand versatile grip</td>
                  <td className="py-2 px-3">Sleeves bound below elbow keep wrists completely free</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-amber-200">Katana</td>
                  <td className="py-2 px-3">Two-hand / one-hand draw</td>
                  <td className="py-2 px-3">Draw / noto from the left-hip scabbard</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-amber-200">Bow (Yumi)</td>
                  <td className="py-2 px-3">Three-finger Mediterranean</td>
                  <td className="py-2 px-3">Forearm wraps stay clear of string release</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 space-y-2">
            <h4 className="font-serif font-bold text-amber-200 text-sm">Katana Specifications</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Simple, elegant, realistic, unornamented — it must never dominate the figure.
            </p>
            <ul className="text-xs text-stone-400 list-disc list-inside space-y-1">
              <li>Worn at the <strong>left hip</strong>, cutting edge up, thrust through the sash</li>
              <li>Angled down and back at roughly <strong>40°</strong></li>
              <li>Plain dark lacquered scabbard, gentle curve, rounded end cap</li>
              <li>Small round iron tsuba, plain ring</li>
              <li>Hilt wrapped in simple lozenge criss-cross, plain pommel cap</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'style_guide',
      title: '4. Sumi-e Ink Style Guide',
      icon: <Palette className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-amber-100 mb-2">Art Direction & Line Weights</h3>
            <p className="text-stone-300 leading-relaxed text-sm">
              Hand-drawn ink, graphite, charcoal, and monochrome washes. Linework is intentionally <em>not</em> mathematically clean — slight hand-drawn brush imperfection is part of the living sumi-e aesthetic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-stone-900/70 p-3 rounded-lg border border-stone-800">
              <span className="font-bold text-amber-300 block mb-1">Thick Brush Strokes</span>
              <p className="text-stone-400">Silhouette perimeter, major cast shadows, clothing outer edges, attack vectors.</p>
            </div>
            <div className="bg-stone-900/70 p-3 rounded-lg border border-stone-800">
              <span className="font-bold text-amber-300 block mb-1">Thin Fine Lines</span>
              <p className="text-stone-400">Facial anatomy, hair strands, fabric fold lines, weapon rim detailing.</p>
            </div>
            <div className="bg-stone-900/70 p-3 rounded-lg border border-stone-800">
              <span className="font-bold text-amber-300 block mb-1">Loose Ink & Dry-Brush</span>
              <p className="text-stone-400">Movement zones, dynamic ponytail tips, trailing motion trails.</p>
            </div>
          </div>

          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 space-y-2">
            <h4 className="font-serif font-bold text-amber-200 text-sm">Strict Zero-Chroma Rule</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              <strong>Colour: none.</strong> All delivered assets are true grayscale (max chroma = 0). No blue, purple, green, yellow, orange, bright red, or coloured lighting. Special effects (slashes, fire, blood) are added at runtime by the game engine, not baked into the character sprites.
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              <strong>Excluded from all files:</strong> text, labels, CJK characters, stamps, watermarks, UI borders, grid lines, wounds, gore.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'animation',
      title: '5. Secondary Motion & Bone Chains',
      icon: <Film className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-amber-100 mb-2">Animation Secondary Dynamics</h3>
            <p className="text-stone-300 leading-relaxed text-sm">
              Key kinematic specifications for 2D skeleton rigging (Spine 2D, DragonBones, Unity 2D Animation):
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-stone-900/60 p-3.5 rounded-lg border border-stone-800">
              <strong className="text-amber-200 block mb-1">Ponytail (3–4 Bone Chain)</strong>
              <p className="text-stone-400">
                Leads one frame behind head rotation; overshoots and settles on sudden stops. Must create a clear whipping arc during rapid dashes and spins.
              </p>
            </div>
            <div className="bg-stone-900/60 p-3.5 rounded-lg border border-stone-800">
              <strong className="text-amber-200 block mb-1">Loose Hair Strands (1–2 Bone Chain each)</strong>
              <p className="text-stone-400">
                Follow the main ponytail motion with additional lag and softer damping factor.
              </p>
            </div>
            <div className="bg-stone-900/60 p-3.5 rounded-lg border border-stone-800">
              <strong className="text-amber-200 block mb-1">Waist Sash Tail (Anti-Phase Balance)</strong>
              <p className="text-stone-400">
                Follows hip sway, moving in opposite phase to the ponytail on turns to balance rotational momentum visually.
              </p>
            </div>
            <div className="bg-stone-900/60 p-3.5 rounded-lg border border-stone-800">
              <strong className="text-amber-200 block mb-1">Tunic Hem & Side Splits</strong>
              <p className="text-stone-400">
                Deform on high leg lifts; keep the side splits readable so legs never merge into the dark tunic cloth mass.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pipeline',
      title: '6. Technical Build Pipeline',
      icon: <Terminal className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-amber-100 mb-2">Python Image Processing Pipeline</h3>
            <p className="text-stone-300 leading-relaxed text-sm">
              The repo includes two production-grade image synthesis tools: <code>tools/build_master_sheet.py</code> and <code>tools/split_poses.py</code>.
            </p>
          </div>

          <div className="bg-[#121210] p-4 rounded-xl border border-stone-800 font-mono text-xs">
            <div className="flex justify-between items-center text-stone-400 mb-2 border-b border-stone-800 pb-2">
              <span>CLI Pipeline Execution</span>
              <button
                onClick={() => copyToClipboard('python3 tools/build_master_sheet.py\npython3 tools/split_poses.py -i art/poses -o poses', 'cli')}
                className="flex items-center gap-1 hover:text-white"
              >
                {copiedKey === 'cli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'cli' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="text-stone-300 overflow-x-auto">
{`# 1. Normalise turnaround views & assemble 2680x3040 master plate:
python3 tools/build_master_sheet.py

# 2. Split pose sheets into transparent RGBA cut-outs with luminance alpha:
python3 -m venv .venv && .venv/bin/pip install numpy scipy pillow
.venv/bin/python tools/split_poses.py -i art/poses -o poses`}
            </pre>
          </div>

          <div className="bg-stone-900/70 p-4 rounded-xl border border-stone-800 text-xs text-stone-300 space-y-2">
            <h4 className="font-serif font-bold text-amber-200">Luminance-Based Alpha & Geodesic Voronoi</h4>
            <p className="text-stone-400 leading-relaxed">
              Paper (L ≥ 238) becomes 0% alpha (transparent), solid ink (L ≤ black point) is 100% opaque, and intermediate grays stay semi-transparent for authentic graphite textures. Connected figures are separated geodesically along their ink strokes so katana blades and ponytails remain attached to their respective bodies.
            </p>
          </div>
        </div>
      )
    }
  ];

  const activeSection = sections.find((s) => s.id === activeTab) || sections[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-[#1a1a18] border border-stone-800 rounded-xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-950/70 border border-amber-700/60 flex items-center justify-center text-amber-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-amber-100 text-base">
              InkBlade Character Bible & Specification
            </h2>
            <p className="text-xs text-stone-400">
              Design-Locked Master Documentation for 2D Fighting Game Production
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Sidebar (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-1.5">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-3 text-xs font-medium ${
                activeTab === sec.id
                  ? 'bg-stone-800 border-amber-500/80 text-amber-200 font-semibold shadow'
                  : 'bg-[#181816] hover:bg-stone-850 text-stone-400 hover:text-stone-200 border-stone-800'
              }`}
            >
              <span className={`p-1.5 rounded-lg ${activeTab === sec.id ? 'bg-amber-950 text-amber-300' : 'bg-stone-900 text-stone-500'}`}>
                {sec.icon}
              </span>
              <span>{sec.title}</span>
            </button>
          ))}
        </div>

        {/* Content Viewer (8 cols) */}
        <div className="md:col-span-8 bg-[#1a1a18] border border-stone-800 rounded-2xl p-6 shadow-xl min-h-[480px]">
          {activeSection.content}
        </div>
      </div>
    </div>
  );
};
