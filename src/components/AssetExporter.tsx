import React, { useState, useRef, useEffect } from 'react';
import { Download, Package, FileCode, Image as ImageIcon, Grid, Check, Sparkles, Layers } from 'lucide-react';
import { INKBLADE_POSES, SHEET_NAMES } from '../data/posesData';

export const AssetExporter: React.FC = () => {
  const [atlasCategory, setAtlasCategory] = useState<string>('all');
  const [atlasCols, setAtlasCols] = useState<number>(8);
  const [atlasPadding, setAtlasPadding] = useState<number>(8);
  const [atlasBg, setAtlasBg] = useState<'transparent' | 'dark' | 'ricepaper'>('transparent');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedAtlasUrl, setGeneratedAtlasUrl] = useState<string | null>(null);
  const [generatedMeta, setGeneratedMeta] = useState<any | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Filter poses for atlas
  const posesForAtlas = INKBLADE_POSES.filter((p) => {
    if (atlasCategory === 'all') return true;
    return p.sheet === atlasCategory;
  });

  // Generate composite sprite atlas
  const generateAtlas = async () => {
    setIsGenerating(true);

    try {
      const poses = posesForAtlas;
      const count = poses.length;
      const cols = Math.min(atlasCols, count);
      const rows = Math.ceil(count / cols);

      // Target normalized cell size
      const cellW = 160;
      const cellH = 220;
      const pad = atlasPadding;

      const totalW = cols * (cellW + pad * 2);
      const totalH = rows * (cellH + pad * 2);

      const canvas = document.createElement('canvas');
      canvas.width = totalW;
      canvas.height = totalH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background
      if (atlasBg === 'dark') {
        ctx.fillStyle = '#141412';
        ctx.fillRect(0, 0, totalW, totalH);
      } else if (atlasBg === 'ricepaper') {
        ctx.fillStyle = '#f7f5ed';
        ctx.fillRect(0, 0, totalW, totalH);
      } else {
        ctx.clearRect(0, 0, totalW, totalH);
      }

      const framesMeta: Record<string, any> = {};

      for (let i = 0; i < count; i++) {
        const pose = poses[i];
        const row = Math.floor(i / cols);
        const col = i % cols;

        const cellX = col * (cellW + pad * 2) + pad;
        const cellY = row * (cellH + pad * 2) + pad;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = pose.url;

        await new Promise((res) => {
          img.onload = res;
          img.onerror = res;
        });

        // Fit into cell keeping aspect ratio, anchored to bottom
        const aspect = img.width / img.height;
        let drawH = cellH;
        let drawW = drawH * aspect;
        if (drawW > cellW) {
          drawW = cellW;
          drawH = drawW / aspect;
        }

        const drawX = cellX + (cellW - drawW) / 2;
        const drawY = cellY + (cellH - drawH);

        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        framesMeta[pose.file] = {
          frame: { x: Math.round(drawX), y: Math.round(drawY), w: Math.round(drawW), h: Math.round(drawH) },
          rotated: false,
          trimmed: false,
          spriteSourceSize: { x: 0, y: 0, w: Math.round(drawW), h: Math.round(drawH) },
          sourceSize: { w: Math.round(drawW), h: Math.round(drawH) },
          sheetBox: pose.box,
          category: pose.category,
          action: pose.combatAction,
        };
      }

      const dataUrl = canvas.toDataURL('image/png');
      setGeneratedAtlasUrl(dataUrl);

      const atlasJson = {
        meta: {
          app: 'InkBlade Sprite Atlas Studio',
          version: '1.0',
          image: 'inkblade_atlas.png',
          format: 'RGBA8888',
          size: { w: totalW, h: totalH },
          scale: 1,
        },
        frames: framesMeta,
      };
      setGeneratedMeta(atlasJson);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Initial generation
  useEffect(() => {
    generateAtlas();
  }, [atlasCategory, atlasCols, atlasPadding, atlasBg]);

  const downloadAtlasPng = () => {
    if (!generatedAtlasUrl) return;
    const link = document.createElement('a');
    link.href = generatedAtlasUrl;
    link.download = `inkblade_atlas_${atlasCategory}.png`;
    link.click();
  };

  const downloadAtlasJson = () => {
    if (!generatedMeta) return;
    const blob = new Blob([JSON.stringify(generatedMeta, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inkblade_atlas_${atlasCategory}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadManifestJson = () => {
    fetch('/poses/poses.json')
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'poses.json';
        link.click();
        URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-[#1a1a18] border border-stone-800 rounded-xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-950/70 border border-red-700/60 flex items-center justify-center text-red-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-amber-100 text-base">
              Asset Kit & Sprite Atlas Exporter
            </h2>
            <p className="text-xs text-stone-400">
              Direct Production Downloads · Unity / Godot / Phaser Sprite Sheet Generator
            </p>
          </div>
        </div>

        <button
          onClick={downloadManifestJson}
          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-850 text-amber-300 rounded-lg text-xs font-mono border border-stone-800 flex items-center gap-1.5 transition"
        >
          <FileCode className="w-3.5 h-3.5" />
          Download poses.json Manifest
        </button>
      </div>

      {/* Production Deliverables Grid */}
      <div className="bg-[#1a1a18] border border-stone-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-serif font-bold text-amber-200 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-red-500" />
          Production-Ready Master Assets
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {[
            {
              title: 'Master Character Reference Sheet',
              desc: 'All 4 views assembled plate, 2680×3040 px, normalized paper L247.',
              file: 'art/InkBlade_master_character_sheet.png',
              size: '2.1 MB',
            },
            {
              title: 'Turnaround Views Bundle',
              desc: 'Front, Right Profile, Back, and Left Profile scale-matched views.',
              file: 'art/views/01_front.png',
              size: '2.0 MB total',
            },
            {
              title: 'Weaponless Base Build',
              desc: 'Front view without katana for rigging multi-weapon arsenal.',
              file: 'art/views/01_front_no_weapon.png',
              size: '517 KB',
            },
            {
              title: '01. Movement Sheet',
              desc: '17 poses: stances, walk, run, dash, jump, fall, roll, recovery.',
              file: 'art/poses/01_movement_sheet.png',
              size: '1.5 MB',
            },
            {
              title: '02. Attack Sheet',
              desc: '15 poses: jabs, crosses, palm strikes, roundhouse kicks, sweeps.',
              file: 'art/poses/02_attack_sheet.png',
              size: '1.6 MB',
            },
            {
              title: '03. Defence Sheet',
              desc: '12 poses: blocks, parries, dodges, knockback, knockdown, get-up.',
              file: 'art/poses/03_defence_sheet.png',
              size: '1.4 MB',
            },
            {
              title: '04. Katana Forms Sheet',
              desc: '15 poses: iaido draw, slashes, jodan guard, tsuki thrust, sheathing.',
              file: 'art/poses/04_sword_sheet.png',
              size: '1.5 MB',
            },
            {
              title: '59 Transparent Cutouts & Manifest',
              desc: 'Individual alpha cutouts + coordinates metadata manifest.',
              file: 'poses/poses.json',
              size: '7.6 KB',
            },
          ].map((asset, i) => (
            <div
              key={i}
              className="bg-stone-900/60 p-3.5 rounded-xl border border-stone-800 flex flex-col justify-between gap-3 hover:border-stone-700 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-stone-200">{asset.title}</h4>
                  <span className="text-[10px] font-mono text-stone-500 whitespace-nowrap">{asset.size}</span>
                </div>
                <p className="text-stone-400 text-[11px] leading-relaxed">{asset.desc}</p>
              </div>

              <a
                href={`/${asset.file}`}
                download
                className="w-full py-1.5 bg-stone-850 hover:bg-stone-750 text-stone-300 hover:text-white rounded-lg text-center font-medium text-xs flex items-center justify-center gap-1.5 border border-stone-750 transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                Download File
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Sprite Atlas Generator Tool */}
      <div className="bg-[#1a1a18] border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-stone-800">
          <div>
            <h3 className="text-sm font-serif font-bold text-amber-200 flex items-center gap-2">
              <Grid className="w-4 h-4 text-emerald-400" />
              Custom 2D Sprite Atlas Generator
            </h3>
            <p className="text-xs text-stone-400">
              Compile transparent cutouts into a single game-ready atlas texture with matching JSON coordinate atlas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadAtlasPng}
              disabled={!generatedAtlasUrl || isGenerating}
              className="px-3 py-1.5 bg-red-900 hover:bg-red-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Download Atlas PNG
            </button>
            <button
              onClick={downloadAtlasJson}
              disabled={!generatedMeta || isGenerating}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-amber-300 rounded-lg text-xs font-semibold border border-stone-800 flex items-center gap-1.5 transition"
            >
              <FileCode className="w-3.5 h-3.5" />
              Atlas JSON (Godot/Unity)
            </button>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-stone-900/60 p-3 rounded-xl border border-stone-800">
          <div>
            <label className="text-stone-400 font-serif block mb-1">Source Poses Category:</label>
            <select
              value={atlasCategory}
              onChange={(e) => setAtlasCategory(e.target.value)}
              className="w-full bg-stone-850 border border-stone-750 text-stone-200 rounded-lg p-1.5 focus:outline-none"
            >
              <option value="all">All Poses (59 Figures)</option>
              {SHEET_NAMES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.count} Poses)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-stone-400 font-serif block mb-1">Grid Columns: ({atlasCols})</label>
            <input
              type="range"
              min="3"
              max="12"
              value={atlasCols}
              onChange={(e) => setAtlasCols(parseInt(e.target.value))}
              className="w-full accent-red-600 h-1.5 bg-stone-800 rounded-lg cursor-pointer mt-2"
            />
          </div>

          <div>
            <label className="text-stone-400 font-serif block mb-1">Padding / Bleed: ({atlasPadding}px)</label>
            <input
              type="range"
              min="0"
              max="24"
              value={atlasPadding}
              onChange={(e) => setAtlasPadding(parseInt(e.target.value))}
              className="w-full accent-red-600 h-1.5 bg-stone-800 rounded-lg cursor-pointer mt-2"
            />
          </div>

          <div>
            <label className="text-stone-400 font-serif block mb-1">Background Tone:</label>
            <select
              value={atlasBg}
              onChange={(e) => setAtlasBg(e.target.value as any)}
              className="w-full bg-stone-850 border border-stone-750 text-stone-200 rounded-lg p-1.5 focus:outline-none"
            >
              <option value="transparent">Transparent Alpha</option>
              <option value="dark">Dark Charcoal (#141412)</option>
              <option value="ricepaper">Rice Paper (#F7F5ED)</option>
            </select>
          </div>
        </div>

        {/* Live Atlas Preview Canvas / Image */}
        <div className="relative bg-[#121210] border border-stone-800 rounded-xl p-4 overflow-auto max-h-[500px] flex items-center justify-center">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-2 py-12 text-stone-400 text-xs font-serif">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              Stitching Atlas Sprites...
            </div>
          ) : generatedAtlasUrl ? (
            <img
              src={generatedAtlasUrl}
              alt="Generated Sprite Atlas Preview"
              className="max-w-full h-auto object-contain rounded shadow"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
