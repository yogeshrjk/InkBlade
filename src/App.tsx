import React, { useState } from 'react';
import { Swords, RotateCcw, Film, BookOpen, Package, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { CombatDojo } from './components/CombatDojo';
import { TurnaroundViewer } from './components/TurnaroundViewer';
import { SpriteStudio } from './components/SpriteStudio';
import { CharacterBibleReader } from './components/CharacterBibleReader';
import { AssetExporter } from './components/AssetExporter';
import { soundEngine } from './utils/soundEngine';

type ActiveTab = 'dojo' | 'turnaround' | 'studio' | 'bible' | 'exporter';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dojo');
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  const [isAmbient, setIsAmbient] = useState<boolean>(false);

  const handleMuteToggle = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleAmbientToggle = () => {
    const active = soundEngine.toggleAmbient();
    setIsAmbient(active);
  };

  return (
    <div className="min-h-screen bg-[#121210] text-[#e4e2d8] flex flex-col selection:bg-red-900 selection:text-white">
      {/* Top Sumi-e Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#171715]/95 backdrop-blur-md border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            {/* Cinnabar Seal Stamp */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-700 to-red-900 border border-red-500/80 flex items-center justify-center shadow-lg shadow-red-950/60 select-none">
              <span className="font-serif font-black text-white text-lg tracking-tighter">墨刃</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-black text-lg tracking-wide text-amber-100 uppercase">
                  InkBlade
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-stone-800 text-stone-400 border border-stone-700 rounded-full font-medium">
                  v1.0 Asset Kit
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                2D Martial Arts Character System · Hand-Drawn Ink & Graphite
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#121210] p-1 rounded-xl border border-stone-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('dojo')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'dojo'
                  ? 'bg-red-900/90 text-white shadow font-semibold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              Combat Dojo
            </button>

            <button
              onClick={() => setActiveTab('turnaround')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'turnaround'
                  ? 'bg-red-900/90 text-white shadow font-semibold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              360° Turnaround
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'studio'
                  ? 'bg-red-900/90 text-white shadow font-semibold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Sprite Studio
            </button>

            <button
              onClick={() => setActiveTab('bible')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'bible'
                  ? 'bg-red-900/90 text-white shadow font-semibold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Character Bible
            </button>

            <button
              onClick={() => setActiveTab('exporter')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'exporter'
                  ? 'bg-red-900/90 text-white shadow font-semibold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Asset Exporter
            </button>
          </nav>

          {/* Quick Header Tools (Sound & Links) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAmbientToggle}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition ${
                isAmbient
                  ? 'bg-amber-950/70 border-amber-600/60 text-amber-300'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="Toggle Ambient Bamboo Wind"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px]">Wind Ambiance</span>
            </button>

            <button
              onClick={handleMuteToggle}
              className="p-2 rounded-lg bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800 transition"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around bg-[#121210] border-t border-stone-850 py-1.5 px-2 text-xs">
          <button
            onClick={() => setActiveTab('dojo')}
            className={`px-2 py-1 rounded flex flex-col items-center ${activeTab === 'dojo' ? 'text-amber-200 font-bold' : 'text-stone-400'}`}
          >
            <Swords className="w-4 h-4" />
            <span className="text-[10px]">Dojo</span>
          </button>
          <button
            onClick={() => setActiveTab('turnaround')}
            className={`px-2 py-1 rounded flex flex-col items-center ${activeTab === 'turnaround' ? 'text-amber-200 font-bold' : 'text-stone-400'}`}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-[10px]">360°</span>
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-2 py-1 rounded flex flex-col items-center ${activeTab === 'studio' ? 'text-amber-200 font-bold' : 'text-stone-400'}`}
          >
            <Film className="w-4 h-4" />
            <span className="text-[10px]">Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('bible')}
            className={`px-2 py-1 rounded flex flex-col items-center ${activeTab === 'bible' ? 'text-amber-200 font-bold' : 'text-stone-400'}`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px]">Bible</span>
          </button>
          <button
            onClick={() => setActiveTab('exporter')}
            className={`px-2 py-1 rounded flex flex-col items-center ${activeTab === 'exporter' ? 'text-amber-200 font-bold' : 'text-stone-400'}`}
          >
            <Package className="w-4 h-4" />
            <span className="text-[10px]">Export</span>
          </button>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dojo' && <CombatDojo />}
        {activeTab === 'turnaround' && <TurnaroundViewer />}
        {activeTab === 'studio' && <SpriteStudio />}
        {activeTab === 'bible' && <CharacterBibleReader />}
        {activeTab === 'exporter' && <AssetExporter />}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-stone-800/80 bg-[#151513] py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-400">InkBlade · 墨刃</span>
            <span>—</span>
            <span>Master 2D Fighting Game Character Reference & Asset Pipeline</span>
          </div>

          <div className="flex items-center gap-6 text-stone-400">
            <span>59 Sprite Cutouts</span>
            <span>4 Turnaround Views</span>
            <span>Zero-Chroma Art Direction</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
