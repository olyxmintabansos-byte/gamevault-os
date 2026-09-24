"use client";

import React, { useEffect, useState } from 'react';
import { 
  Gamepad2, 
  RotateCcw, 
  Sparkles, 
  Wheat, 
  Coins, 
  ArrowLeftRight,
  Bot, 
  Dice5,
  Volume2,
  VolumeX
} from 'lucide-react';
import { StorageEngine } from '@/lib/storage';

interface NavbarProps {
  activeTab: 'growtopia' | 'roblox' | 'arbitrage' | 'discord' | 'gacha';
  onTabChange: (tab: 'growtopia' | 'roblox' | 'arbitrage' | 'discord' | 'gacha') => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onReset }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const settings = StorageEngine.getSettings();
    setSoundEnabled(settings.soundEnabled);
  }, []);

  const toggleSound = () => {
    const settings = StorageEngine.getSettings();
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    StorageEngine.saveSettings(updated);
    setSoundEnabled(updated.soundEnabled);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 px-4 py-1.5 text-center text-[11px] font-medium text-slate-300 border-b border-slate-800/80 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>GameVault OS v1.2 — Universal Gaming Economy Suite & Discord Webhook Dispatcher</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 p-0.5 shadow-lg shadow-emerald-950/50">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-white">GAMEVAULT</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-1.5 py-0.5 rounded">
                MetaForge OS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none">Gaming Economics & Webhook Bot Studio</p>
          </div>
        </div>

        {/* Center Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-slate-800">
          <button
            onClick={() => onTabChange('growtopia')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'growtopia'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Wheat className="h-3.5 w-3.5" />
            <span>Growtopia Matrix</span>
          </button>

          <button
            onClick={() => onTabChange('roblox')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'roblox'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Coins className="h-3.5 w-3.5" />
            <span>Roblox DevEx</span>
          </button>

          <button
            onClick={() => onTabChange('arbitrage')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'arbitrage'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span>Market Arbitrage</span>
          </button>

          <button
            onClick={() => onTabChange('discord')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'discord'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Discord Bot</span>
          </button>

          <button
            onClick={() => onTabChange('gacha')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'gacha'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Dice5 className="h-3.5 w-3.5" />
            <span>Loot Gacha</span>
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={soundEnabled ? "Audio Alarm Aktif" : "Audio Alarm Mute"}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
          </button>

          <button
            onClick={() => {
              if (confirm('Reset seluruh data GameVault ke demo default?')) {
                StorageEngine.resetAll();
              }
            }}
            title="Reset Data Demo"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
