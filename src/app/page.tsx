"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { GrowtopiaMatrixView } from '@/components/growtopia/GrowtopiaMatrixView';
import { RobloxTeaserView } from '@/components/teasers/RobloxTeaserView';
import { DiscordTeaserView } from '@/components/teasers/DiscordTeaserView';
import { GachaTeaserView } from '@/components/teasers/GachaTeaserView';
import { StorageEngine } from '@/lib/storage';
import { HarvestBatch } from '@/types/gamevault';
import { Wheat, Coins, Bot, Dice5 } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'growtopia' | 'roblox' | 'discord' | 'gacha'>('growtopia');
  const [batches, setBatches] = useState<HarvestBatch[]>([]);

  const loadData = () => {
    setBatches(StorageEngine.getBatches());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('gamevault_batches_updated', loadData);
    return () => window.removeEventListener('gamevault_batches_updated', loadData);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReset={loadData}
      />

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden overflow-x-auto p-2 bg-slate-900/90 border-b border-slate-800 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('growtopia')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${
            activeTab === 'growtopia' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
          }`}
        >
          Growtopia
        </button>
        <button
          onClick={() => setActiveTab('roblox')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${
            activeTab === 'roblox' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
          }`}
        >
          Roblox DevEx
        </button>
        <button
          onClick={() => setActiveTab('discord')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${
            activeTab === 'discord' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
          }`}
        >
          Discord Bot
        </button>
        <button
          onClick={() => setActiveTab('gacha')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${
            activeTab === 'gacha' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
          }`}
        >
          Gacha
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {activeTab === 'growtopia' && (
          <GrowtopiaMatrixView batches={batches} onRefresh={loadData} />
        )}
        {activeTab === 'roblox' && <RobloxTeaserView />}
        {activeTab === 'discord' && <DiscordTeaserView />}
        {activeTab === 'gacha' && <GachaTeaserView />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p className="font-bold text-slate-400">GAMEVAULT & METAFORGE OS v1.0</p>
        <p className="mt-1">Universal Gaming Economy Suite & Discord Webhook Bot Studio.</p>
      </footer>
    </div>
  );
}
