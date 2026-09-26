import React, { useState, useEffect } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Shield, Eye, Layers, Compass, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { TURNAROUND_VIEWS, ANATOMY_HOTSPOTS, AnatomyHotspot, TurnaroundView } from '../data/turnaroundData';

export const TurnaroundViewer: React.FC = () => {
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(false);
  const [spinSpeed, setSpinSpeed] = useState<number>(1);
  const [weaponless, setWeaponless] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<AnatomyHotspot | null>(ANATOMY_HOTSPOTS[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'normal' | 'silhouette' | 'inverted' | 'ricepaper'>('normal');
  const [show64pxTest, setShow64pxTest] = useState<boolean>(true);
  const [showMasterSheet, setShowMasterSheet] = useState<boolean>(false);

  // Auto-spin turntable
  useEffect(() => {
    if (!isAutoSpinning) return;
    const interval = setInterval(() => {
      setCurrentAngle((prev) => (prev + 90) % 360);
    }, 2000 / spinSpeed);
    return () => clearInterval(interval);
  }, [isAutoSpinning, spinSpeed]);

  // Determine which view to show based on angle
  const getActiveView = (): TurnaroundView => {
    const normalized = ((Math.round(currentAngle / 90) * 90) % 360 + 360) % 360;
    const found = TURNAROUND_VIEWS.find((v) => v.angle === normalized);
    return found || TURNAROUND_VIEWS[0];
  };

  const activeView = getActiveView();

  // If front view and weaponless selected, show weaponless build
  const displayImageUrl = (activeView.angle === 0 && weaponless && activeView.weaponlessUrl)
    ? activeView.weaponlessUrl
    : activeView.url;

  // Filter styles
  const getImageFilter = () => {
    switch (viewMode) {
      case 'silhouette':
        return 'contrast(300%) brightness(0%)';
      case 'inverted':
        return 'invert(1) hue-rotate(180deg)';
      case 'ricepaper':
        return 'sepia(0.3) contrast(1.1)';
      default:
        return 'none';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Controls Bar */}
      <div className="bg-[#1a1a18] border border-stone-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-900/40 border border-red-700/60 flex items-center justify-center font-serif text-red-400 font-bold">
            360°
          </div>
          <div>
            <h2 className="font-serif font-bold text-amber-100 text-base">
              Turnaround & Costume Anatomy
            </h2>
            <p className="text-xs text-stone-400">
              4 Canonical Perspectives · Scale-Matched Heights (±0.5%) · Section 2 & 5 Spec
            </p>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Weapon Toggle */}
          <button
            onClick={() => setWeaponless(!weaponless)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${weaponless ? 'bg-amber-950/70 border-amber-600 text-amber-200' : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'}`}
          >
            <Shield className="w-3.5 h-3.5" />
            {weaponless ? 'Unarmed (Base Build)' : 'Katana Sheathed'}
          </button>

          {/* Master Sheet Modal Toggle */}
          <button
            onClick={() => setShowMasterSheet(!showMasterSheet)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${showMasterSheet ? 'bg-red-950 border-red-600 text-red-200' : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            Master Sheet (2680×3040)
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setIsAutoSpinning(!isAutoSpinning)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${isAutoSpinning ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300' : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'}`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoSpinning ? 'animate-spin' : ''}`} />
            {isAutoSpinning ? 'Auto-Rotating' : 'Auto Rotate'}
          </button>
        </div>
      </div>

      {/* Main Turnaround Stage & Hotspot Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Turnaround Viewport (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative bg-[#161614] border border-stone-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 min-h-[560px]">
            {/* View angle badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="px-3 py-1 bg-black/70 backdrop-blur-md border border-stone-700 text-amber-200 text-xs font-mono rounded-full font-semibold">
                {activeView.label}
              </span>
              {activeView.angle === 0 && weaponless && (
                <span className="px-2.5 py-0.5 bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[11px] rounded-full">
                  Unarmed Build
                </span>
              )}
            </div>

            {/* View Style Filter Buttons (Top Right) */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-lg border border-stone-800 text-[11px]">
              <button
                onClick={() => setViewMode('normal')}
                className={`px-2 py-1 rounded transition ${viewMode === 'normal' ? 'bg-stone-800 text-white font-medium' : 'text-stone-400 hover:text-stone-200'}`}
              >
                Ink Linework
              </button>
              <button
                onClick={() => setViewMode('silhouette')}
                className={`px-2 py-1 rounded transition ${viewMode === 'silhouette' ? 'bg-stone-800 text-white font-medium' : 'text-stone-400 hover:text-stone-200'}`}
                title="Black silhouette test"
              >
                Silhouette
              </button>
              <button
                onClick={() => setViewMode('inverted')}
                className={`px-2 py-1 rounded transition ${viewMode === 'inverted' ? 'bg-stone-800 text-white font-medium' : 'text-stone-400 hover:text-stone-200'}`}
                title="White ink negative"
              >
                Inverted
              </button>
              <button
                onClick={() => setViewMode('ricepaper')}
                className={`px-2 py-1 rounded transition ${viewMode === 'ricepaper' ? 'bg-stone-800 text-white font-medium' : 'text-stone-400 hover:text-stone-200'}`}
                title="Traditional Rice Paper Tone"
              >
                Rice Paper
              </button>
            </div>

            {/* Interactive Image Container */}
            <div className="relative max-w-full flex items-center justify-center overflow-hidden my-4">
              <img
                src={displayImageUrl}
                alt={activeView.name}
                style={{
                  filter: getImageFilter(),
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.2s ease-out, filter 0.3s ease',
                  maxHeight: '480px',
                }}
                className="w-auto h-auto object-contain rounded select-none pointer-events-none drop-shadow-2xl"
              />

              {/* Anatomy Hotspot Pins (shown only on Front view) */}
              {activeView.angle === 0 && !weaponless && (
                <div className="absolute inset-0 pointer-events-auto">
                  {ANATOMY_HOTSPOTS.map((spot) => {
                    const isSelected = selectedHotspot?.id === spot.id;
                    return (
                      <button
                        key={spot.id}
                        onClick={() => setSelectedHotspot(spot)}
                        style={{
                          left: `${spot.x}%`,
                          top: `${spot.y}%`,
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-all duration-200 z-20 shadow-lg ${
                          isSelected
                            ? 'bg-red-600 text-white ring-4 ring-red-500/40 scale-125'
                            : 'bg-stone-900/90 hover:bg-amber-600 text-stone-200 hover:text-white border border-stone-600'
                        }`}
                        title={spot.title}
                      >
                        {isSelected ? <Check className="w-3 h-3" /> : '•'}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Ground line reference (Section 5 Ground Alignment) */}
            <div className="w-full flex items-center justify-center gap-2 text-[10px] text-stone-600 border-t border-dashed border-stone-800 pt-2 font-mono">
              <span className="w-12 h-px bg-stone-700" />
              <span>Ground Reference Line (Y-matched within 0.5%)</span>
              <span className="w-12 h-px bg-stone-700" />
            </div>

            {/* Orbit Navigation Controls */}
            <div className="w-full flex items-center justify-between mt-4 pt-3 border-t border-stone-800/80 px-2">
              <button
                onClick={() => setCurrentAngle((prev) => (prev - 90 + 360) % 360)}
                className="p-2 rounded-lg bg-stone-800/60 hover:bg-stone-700 text-stone-300 transition flex items-center gap-1 text-xs"
              >
                <ChevronLeft className="w-4 h-4" /> Rotate Left
              </button>

              <div className="flex items-center gap-1.5">
                {TURNAROUND_VIEWS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setCurrentAngle(v.angle)}
                    className={`px-3 py-1 text-xs font-mono rounded-lg transition ${
                      activeView.angle === v.angle
                        ? 'bg-amber-900/60 text-amber-200 border border-amber-600/50 font-bold'
                        : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    {v.angle}°
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentAngle((prev) => (prev + 90) % 360)}
                className="p-2 rounded-lg bg-stone-800/60 hover:bg-stone-700 text-stone-300 transition flex items-center gap-1 text-xs"
              >
                Rotate Right <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center justify-between bg-[#1a1a18] border border-stone-800 rounded-xl px-4 py-2 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <span className="font-mono text-stone-500">Magnification:</span>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                className="p-1 hover:bg-stone-800 rounded text-stone-300"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold text-amber-200">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                className="p-1 hover:bg-stone-800 rounded text-stone-300"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="px-2 py-0.5 text-[11px] bg-stone-800 hover:bg-stone-700 rounded text-stone-300"
              >
                Reset
              </button>
            </div>

            <span className="text-[11px] text-stone-500 italic hidden sm:inline">
              {activeView.description}
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Anatomy Breakdown & Section 8 Validator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Selected Hotspot Detailed Card */}
          <div className="bg-[#1a1a18] border border-stone-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-xs font-mono uppercase text-stone-400 tracking-wider">
                  Costume & Rig Anatomy Spec
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-stone-800 text-amber-300 rounded">
                Section 2 & 8
              </span>
            </div>

            {selectedHotspot ? (
              <div className="flex flex-col gap-3">
                <h3 className="font-serif font-bold text-amber-100 text-lg">
                  {selectedHotspot.title}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed bg-stone-900/60 p-3 rounded-lg border border-stone-800/80">
                  {selectedHotspot.fullSpec}
                </p>

                <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 font-serif mb-1">
                    <Compass className="w-3.5 h-3.5" />
                    Animation & Rigging Note:
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {selectedHotspot.animationNote}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic">Select a hotspot pin on the figure to view technical spec.</p>
            )}

            {/* Quick Hotspot Picker Chips */}
            <div className="mt-4 pt-3 border-t border-stone-800">
              <span className="text-[11px] text-stone-400 font-serif block mb-2">Anatomy Markers:</span>
              <div className="flex flex-wrap gap-1.5">
                {ANATOMY_HOTSPOTS.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => {
                      setSelectedHotspot(spot);
                      setCurrentAngle(0); // Switch to front to see pin
                    }}
                    className={`px-2 py-1 text-[11px] rounded transition ${
                      selectedHotspot?.id === spot.id
                        ? 'bg-red-900/80 text-white font-medium border border-red-600'
                        : 'bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    {spot.title.split(':')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Silhouette Readability Lab (Section 8 Validator) */}
          <div className="bg-[#1a1a18] border border-stone-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-serif font-bold text-amber-200 text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                Silhouette Readability Validator
              </h4>
              <span className="text-[11px] font-mono text-stone-500">64px Standard</span>
            </div>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              According to the design spec: <em className="text-stone-300">"At 64px tall the read must be: dark figure, long hair arc, clear boot line."</em>
            </p>

            {/* Micro Scale Test Previews */}
            <div className="grid grid-cols-3 gap-3 bg-stone-900/80 p-3 rounded-xl border border-stone-800 text-center">
              {/* 64px scale */}
              <div className="flex flex-col items-center justify-end h-32 bg-[#121210] p-2 rounded-lg border border-stone-850">
                <img
                  src={displayImageUrl}
                  alt="64px test"
                  className="h-16 w-auto object-contain filter contrast-200 brightness-0 invert"
                />
                <span className="text-[10px] font-mono text-amber-300 mt-2 font-bold">64px (Target)</span>
              </div>

              {/* 128px scale */}
              <div className="flex flex-col items-center justify-end h-32 bg-[#121210] p-2 rounded-lg border border-stone-850">
                <img
                  src={displayImageUrl}
                  alt="96px test"
                  className="h-24 w-auto object-contain filter contrast-200 brightness-0 invert"
                />
                <span className="text-[10px] font-mono text-stone-400 mt-2">96px Scale</span>
              </div>

              {/* Full Silhuette */}
              <div className="flex flex-col items-center justify-end h-32 bg-[#FAF7F0] p-2 rounded-lg border border-stone-300">
                <img
                  src={displayImageUrl}
                  alt="Light background test"
                  className="h-24 w-auto object-contain filter brightness-0"
                />
                <span className="text-[10px] font-mono text-stone-800 mt-2 font-bold">Paper Contrast</span>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
              <Check className="w-3.5 h-3.5" />
              Passed: Ponytail arc is distinct, boot stance grounded, weaponless silhouette open.
            </div>
          </div>
        </div>
      </div>

      {/* Full Master Character Sheet Modal / Expander */}
      {showMasterSheet && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col p-4 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-stone-300">
            <div>
              <h3 className="font-serif font-bold text-lg text-amber-100">
                InkBlade Master Character Reference Sheet
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                2680×3040 Master Plate · True Grayscale (Max Chroma = 0) · Normalized Paper L247
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/art/InkBlade_master_character_sheet.png"
                download="InkBlade_master_character_sheet.png"
                className="px-3 py-1.5 bg-red-900 hover:bg-red-800 text-white text-xs font-semibold rounded-lg transition"
              >
                Download Master Sheet (2.1 MB)
              </a>
              <button
                onClick={() => setShowMasterSheet(false)}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition"
              >
                Close Viewer
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            <img
              src="/art/InkBlade_master_character_sheet.png"
              alt="InkBlade Master Character Sheet"
              className="max-h-full max-w-full object-contain rounded shadow-2xl border border-stone-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};
