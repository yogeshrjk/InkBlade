import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Download, Plus, Trash2, Copy, MoveLeft, MoveRight, Film, Grid, Search, Filter, Sparkles, Check } from 'lucide-react';
import { INKBLADE_POSES, PoseData, SHEET_NAMES } from '../data/posesData';
import { PRESET_SEQUENCES, AnimationSequence } from '../data/sequencesData';

export const SpriteStudio: React.FC = () => {
  // Timeline sequence state
  const [timelineFrames, setTimelineFrames] = useState<string[]>(PRESET_SEQUENCES[0].frameFiles);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(8);
  const [loopMode, setLoopMode] = useState<'loop' | 'pingpong' | 'once'>('loop');
  const [pingPongForward, setPingPongForward] = useState<boolean>(true);
  const [onionSkinning, setOnionSkinning] = useState<boolean>(true);
  const [alignMode, setAlignMode] = useState<'ground' | 'center'>('ground');
  const [canvasBg, setCanvasBg] = useState<'dark' | 'ricepaper' | 'transparent'>('dark');

  // Pose Library filter state
  const [selectedSheet, setSelectedSheet] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPoseForInspect, setSelectedPoseForInspect] = useState<PoseData>(INKBLADE_POSES[0]);

  // Export state
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying || timelineFrames.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => {
        if (loopMode === 'loop') {
          return (prev + 1) % timelineFrames.length;
        } else if (loopMode === 'once') {
          if (prev >= timelineFrames.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        } else {
          // Ping-pong
          if (pingPongForward) {
            if (prev >= timelineFrames.length - 1) {
              setPingPongForward(false);
              return Math.max(0, prev - 1);
            }
            return prev + 1;
          } else {
            if (prev <= 0) {
              setPingPongForward(true);
              return Math.min(timelineFrames.length - 1, 1);
            }
            return prev - 1;
          }
        }
      });
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [isPlaying, fps, timelineFrames.length, loopMode, pingPongForward]);

  // Filter poses in library
  const filteredPoses = INKBLADE_POSES.filter((pose) => {
    const matchesSheet = selectedSheet === 'all' || pose.sheet === selectedSheet;
    const matchesQuery =
      searchQuery === '' ||
      pose.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pose.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pose.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pose.file.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSheet && matchesQuery;
  });

  // Timeline operations
  const addPoseToTimeline = (file: string) => {
    setTimelineFrames((prev) => [...prev, file]);
    setExportNotice(`Added pose to timeline`);
    setTimeout(() => setExportNotice(null), 1500);
  };

  const removeFrameAt = (index: number) => {
    if (timelineFrames.length <= 1) return;
    setTimelineFrames((prev) => prev.filter((_, i) => i !== index));
    if (currentFrameIndex >= timelineFrames.length - 1) {
      setCurrentFrameIndex(Math.max(0, timelineFrames.length - 2));
    }
  };

  const duplicateFrameAt = (index: number) => {
    setTimelineFrames((prev) => {
      const next = [...prev];
      next.splice(index, 0, prev[index]);
      return next;
    });
  };

  const moveFrame = (from: number, to: number) => {
    if (to < 0 || to >= timelineFrames.length) return;
    setTimelineFrames((prev) => {
      const next = [...prev];
      const item = next.splice(from, 1)[0];
      next.splice(to, 0, item);
      return next;
    });
    setCurrentFrameIndex(to);
  };

  const loadPresetSequence = (seq: AnimationSequence) => {
    setTimelineFrames([...seq.frameFiles]);
    setFps(seq.defaultFps);
    setCurrentFrameIndex(0);
    setIsPlaying(true);
  };

  // Export Sprite Strip PNG
  const exportSpriteStrip = async () => {
    setIsExporting(true);
    setExportNotice('Rendering Sprite Strip...');

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const loadedImgs: HTMLImageElement[] = [];
      for (const file of timelineFrames) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = `/poses/${file}`;
        await new Promise((res) => {
          img.onload = res;
          img.onerror = res;
        });
        loadedImgs.push(img);
      }

      // Height target: 280px per frame
      const frameHeight = 280;
      const frameWidths = loadedImgs.map((img) => Math.round(frameHeight * (img.width / img.height)));
      const totalWidth = frameWidths.reduce((a, b) => a + b, 0);

      canvas.width = totalWidth;
      canvas.height = frameHeight;

      if (canvasBg === 'dark') {
        ctx.fillStyle = '#141412';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (canvasBg === 'ricepaper') {
        ctx.fillStyle = '#f7f5ed';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      let curX = 0;
      loadedImgs.forEach((img, i) => {
        const w = frameWidths[i];
        ctx.drawImage(img, curX, 0, w, frameHeight);
        curX += w;
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `inkblade_strip_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setExportNotice('Sprite Strip downloaded successfully!');
      setTimeout(() => setExportNotice(null), 2500);
    } catch (e) {
      setExportNotice('Export error');
    } finally {
      setIsExporting(false);
    }
  };

  // Export JSON Animation Definition
  const exportJsonManifest = () => {
    const data = {
      character: 'InkBlade',
      animation: 'custom_sequence',
      fps,
      frameCount: timelineFrames.length,
      loop: loopMode,
      frames: timelineFrames.map((f, idx) => {
        const pose = INKBLADE_POSES.find((p) => p.file === f);
        return {
          frameIndex: idx,
          file: f,
          name: pose?.name || f,
          category: pose?.category || 'combat',
          durationMs: Math.round(1000 / fps),
          box: pose?.box || [0, 0, 0, 0],
          width: pose?.width || 0,
          height: pose?.height || 0,
        };
      }),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inkblade_animation_clip.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Get current active pose object
  const activeFrameFile = timelineFrames[currentFrameIndex] || timelineFrames[0];
  const activePose = INKBLADE_POSES.find((p) => p.file === activeFrameFile);
  const previousFrameFile = timelineFrames[(currentFrameIndex - 1 + timelineFrames.length) % timelineFrames.length];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Presets Bar */}
      <div className="bg-[#1a1a18] border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-950/70 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-amber-100 text-base">
              Animation Sequencer & Sprite Studio
            </h2>
            <p className="text-xs text-stone-400">
              59 Transparent Hand-Drawn Ink Cutouts · Onion Skinning · Frame-by-Frame Timeline
            </p>
          </div>
        </div>

        {/* Preset Sequences Dropdown */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-stone-400 font-serif">Preset Sequences:</span>
          <div className="flex gap-1.5 flex-wrap">
            {PRESET_SEQUENCES.map((seq) => (
              <button
                key={seq.id}
                onClick={() => loadPresetSequence(seq)}
                className="px-2.5 py-1 text-xs bg-stone-900 hover:bg-stone-850 hover:text-amber-200 border border-stone-800 rounded-lg text-stone-300 transition"
              >
                {seq.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Animation Player & Timeline (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Stage Viewport */}
          <div
            className={`relative rounded-2xl border border-stone-800 overflow-hidden flex flex-col items-center justify-center p-6 min-h-[440px] shadow-2xl transition-colors duration-200 ${
              canvasBg === 'dark'
                ? 'bg-[#141412]'
                : canvasBg === 'ricepaper'
                ? 'bg-[#f7f5ed]'
                : 'bg-transparent border-dashed'
            }`}
          >
            {/* Viewport Info Overlay (Top Left) */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              <span className="px-3 py-1 bg-black/75 backdrop-blur-md border border-stone-700 text-amber-200 text-xs font-mono rounded-full font-bold">
                Frame {currentFrameIndex + 1} / {timelineFrames.length}
              </span>
              <span className="px-2.5 py-0.5 bg-stone-900/80 backdrop-blur-md border border-stone-800 text-stone-400 text-[11px] rounded-full font-mono">
                {activePose?.name || activeFrameFile}
              </span>
            </div>

            {/* Canvas Background & Onion Skin Controls (Top Right) */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10 bg-black/75 backdrop-blur-md p-1 rounded-lg border border-stone-800 text-xs">
              <button
                onClick={() => setOnionSkinning(!onionSkinning)}
                className={`px-2 py-0.5 rounded transition ${onionSkinning ? 'bg-amber-900/70 text-amber-200 border border-amber-600/50' : 'text-stone-400 hover:text-stone-200'}`}
                title="Toggle previous frame ghosting"
              >
                Onion Skin
              </button>
              <div className="w-px h-3 bg-stone-700 mx-0.5" />
              <button
                onClick={() => setCanvasBg(canvasBg === 'dark' ? 'ricepaper' : 'dark')}
                className="px-2 py-0.5 text-stone-300 hover:text-white rounded"
              >
                {canvasBg === 'dark' ? 'Rice Paper' : 'Dark Canvas'}
              </button>
            </div>

            {/* Animation Render Stage */}
            <div className="relative h-72 w-full flex items-end justify-center pb-6">
              {/* Onion skinning ghost (previous frame) */}
              {onionSkinning && timelineFrames.length > 1 && (
                <img
                  src={`/poses/${previousFrameFile}`}
                  alt="Onion skin"
                  className="absolute bottom-6 max-h-64 w-auto object-contain pointer-events-none select-none opacity-20 filter contrast-125 hue-rotate-180"
                />
              )}

              {/* Active frame image */}
              <img
                src={`/poses/${activeFrameFile}`}
                alt={activePose?.name || 'Active Frame'}
                className="relative bottom-0 max-h-64 w-auto object-contain select-none drop-shadow-xl"
              />
            </div>

            {/* Ground alignment guide line */}
            <div className="w-full flex items-center justify-center gap-2 text-[10px] text-stone-600 border-t border-dashed border-stone-800 pt-2 font-mono">
              <span className="w-16 h-px bg-stone-700" />
              <span>Canvas Ground Line Anchor</span>
              <span className="w-16 h-px bg-stone-700" />
            </div>

            {/* Playback Controls Toolbar */}
            <div className="w-full flex items-center justify-between mt-4 pt-3 border-t border-stone-800/80 px-2 text-stone-300">
              {/* Play / Step buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentFrameIndex((prev) => (prev - 1 + timelineFrames.length) % timelineFrames.length);
                  }}
                  className="p-1.5 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-300"
                  title="Step Backward"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-1.5 bg-red-900 hover:bg-red-800 text-white rounded-lg flex items-center gap-1.5 font-semibold text-xs transition"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentFrameIndex((prev) => (prev + 1) % timelineFrames.length);
                  }}
                  className="p-1.5 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-300"
                  title="Step Forward"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* FPS Speed Slider */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 font-mono">Speed:</span>
                <input
                  type="range"
                  min="2"
                  max="24"
                  value={fps}
                  onChange={(e) => setFps(parseInt(e.target.value))}
                  className="w-24 accent-red-600 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-amber-200 w-12 text-right">
                  {fps} FPS
                </span>
              </div>

              {/* Loop Mode Selector */}
              <button
                onClick={() => {
                  if (loopMode === 'loop') setLoopMode('pingpong');
                  else if (loopMode === 'pingpong') setLoopMode('once');
                  else setLoopMode('loop');
                }}
                className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 rounded-lg text-xs font-mono flex items-center gap-1 text-stone-300"
                title="Change Loop Mode"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span className="capitalize">{loopMode}</span>
              </button>
            </div>
          </div>

          {/* Interactive Timeline Track */}
          <div className="bg-[#1a1a18] border border-stone-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
                <Film className="w-4 h-4 text-red-500" />
                Sequence Frames ({timelineFrames.length} items)
              </span>

              {/* Export actions */}
              <div className="flex items-center gap-2">
                {exportNotice && (
                  <span className="text-xs text-emerald-400 font-medium animate-pulse">
                    {exportNotice}
                  </span>
                )}
                <button
                  onClick={exportSpriteStrip}
                  disabled={isExporting}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg flex items-center gap-1 border border-stone-700 transition"
                  title="Render and download full stitched PNG strip"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Sprite Strip
                </button>
                <button
                  onClick={exportJsonManifest}
                  className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-medium rounded-lg border border-stone-800 transition"
                  title="Download game-ready JSON clip data"
                >
                  JSON Clip
                </button>
              </div>
            </div>

            {/* Frame Chips Strip */}
            <div className="flex gap-2 overflow-x-auto pb-3 pt-1">
              {timelineFrames.map((file, idx) => {
                const isCurrent = idx === currentFrameIndex;
                const pose = INKBLADE_POSES.find((p) => p.file === file);

                return (
                  <div
                    key={`${file}-${idx}`}
                    className={`flex-shrink-0 flex flex-col items-center bg-stone-900 rounded-xl p-1.5 border transition-all duration-150 group relative ${
                      isCurrent
                        ? 'border-red-500 ring-2 ring-red-500/40 bg-stone-850 scale-105'
                        : 'border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {/* Frame thumbnail */}
                    <button
                      onClick={() => {
                        setCurrentFrameIndex(idx);
                        setIsPlaying(false);
                      }}
                      className="w-16 h-20 flex items-center justify-center p-1"
                    >
                      <img
                        src={`/poses/${file}`}
                        alt={pose?.name || file}
                        className="max-h-full max-w-full object-contain"
                      />
                    </button>

                    {/* Frame badge */}
                    <span className="text-[10px] font-mono text-stone-400 font-semibold mt-1">
                      #{idx + 1}
                    </span>

                    {/* Hover Actions (Reorder, duplicate, remove) */}
                    <div className="absolute -top-2 -right-1 hidden group-hover:flex items-center gap-0.5 bg-black/90 p-0.5 rounded shadow z-20">
                      <button
                        onClick={() => moveFrame(idx, idx - 1)}
                        className="p-1 hover:text-white text-stone-400"
                        title="Move left"
                      >
                        <MoveLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => duplicateFrameAt(idx)}
                        className="p-1 hover:text-white text-stone-400"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFrameAt(idx)}
                        className="p-1 hover:text-red-400 text-stone-400"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveFrame(idx, idx + 1)}
                        className="p-1 hover:text-white text-stone-400"
                        title="Move right"
                      >
                        <MoveRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: 59 Poses Library & Inspector (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Pose Filter & Search Bar */}
          <div className="bg-[#1a1a18] border border-stone-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-amber-400" />
                Pose Cut-Out Library ({filteredPoses.length} / 59)
              </span>
              <span className="text-[11px] font-mono text-stone-400">Click "+" to add to timeline</span>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setSelectedSheet('all')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedSheet === 'all'
                    ? 'bg-red-900/80 text-white border border-red-700'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                All (59)
              </button>
              {SHEET_NAMES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSheet(s.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                    selectedSheet === s.id
                      ? 'bg-red-900/80 text-white border border-red-700'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  {s.name} ({s.count})
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, action (e.g. thrust, kick, roll)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-red-600"
              />
            </div>

            {/* Poses Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredPoses.map((pose) => (
                <div
                  key={pose.id}
                  onClick={() => setSelectedPoseForInspect(pose)}
                  className={`relative flex flex-col items-center justify-between p-1.5 rounded-lg border cursor-pointer transition group ${
                    selectedPoseForInspect?.id === pose.id
                      ? 'bg-stone-850 border-amber-500'
                      : 'bg-stone-900 hover:bg-stone-850 border-stone-800'
                  }`}
                >
                  <img
                    src={pose.url}
                    alt={pose.name}
                    className="h-16 w-auto object-contain my-1 select-none"
                  />
                  <span className="text-[10px] font-mono text-stone-400 truncate w-full text-center">
                    {pose.name.split(' ')[0]}
                  </span>

                  {/* Add to timeline button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addPoseToTimeline(pose.file);
                    }}
                    className="absolute top-1 right-1 p-1 bg-stone-800 hover:bg-red-700 text-stone-300 hover:text-white rounded shadow opacity-80 group-hover:opacity-100 transition"
                    title="Add to animation timeline"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Pose Metadata Inspector */}
          {selectedPoseForInspect && (
            <div className="bg-[#1a1a18] border border-stone-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-serif font-bold text-amber-200 text-sm">
                  {selectedPoseForInspect.name}
                </h4>
                <a
                  href={selectedPoseForInspect.url}
                  download={selectedPoseForInspect.file}
                  className="text-xs text-stone-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                >
                  <Download className="w-3 h-3" /> Download PNG
                </a>
              </div>
              <p className="text-xs text-stone-300 mb-3">{selectedPoseForInspect.description}</p>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-stone-400 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                <div>
                  <span className="text-stone-500 block">FILE</span>
                  <span className="text-stone-200">{selectedPoseForInspect.file}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">DIMENSIONS</span>
                  <span className="text-stone-200">
                    {selectedPoseForInspect.width} × {selectedPoseForInspect.height} px
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">SHEET BOX</span>
                  <span className="text-stone-200">
                    [{selectedPoseForInspect.box.join(', ')}]
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">CATEGORY</span>
                  <span className="text-amber-300 uppercase">{selectedPoseForInspect.category}</span>
                </div>
              </div>

              <button
                onClick={() => addPoseToTimeline(selectedPoseForInspect.file)}
                className="w-full mt-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition border border-stone-700"
              >
                <Plus className="w-3.5 h-3.5 text-red-500" />
                Add "{selectedPoseForInspect.name}" to Active Timeline
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
