"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { GrowtopiaMatrixView } from '@/components/growtopia/GrowtopiaMatrixView';
import { RobloxSuiteView } from '@/components/roblox/RobloxSuiteView';
import { TradeArbitrageView } from '@/components/arbitrage/TradeArbitrageView';
import { DiscordWebhookView } from '@/components/discord/DiscordWebhookView';
import { GachaSimulatorView } from '@/components/gacha/GachaSimulatorView';
import { StorageEngine } from '@/lib/storage';
import { HarvestBatch } from '@/types/gamevault';
import { Wheat, Coins, ArrowLeftRight, Bot, Dice5 } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'growtopia' | 'roblox' | 'arbitrage' | 'discord' | 'gacha'>('growtopia');
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
      <div className="flex lg:hidden overflow-x-auto p-2 bg-slate-900/90 border-b border-slate-800 gap-1.5 text-xs">
        <button
          onClick={() => setActiveTab('growtopia')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition ${
            activeTab === 'growtopia' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 bg-slate-950'
          }`}
        >
          Growtopia
        </button>
        <button
          onClick={() => setActiveTab('roblox')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition ${
            activeTab === 'roblox' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 bg-slate-950'
          }`}
        >
          Roblox DevEx
        </button>
        <button
          onClick={() => setActiveTab('arbitrage')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition ${
            activeTab === 'arbitrage' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 bg-slate-950'
          }`}
        >
          Arbitrage
        </button>
        <button
          onClick={() => setActiveTab('discord')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition ${
            activeTab === 'discord' ? 'bg-indigo-500 text-white' : 'text-slate-400 bg-slate-950'
          }`}
        >
          Discord Bot
        </button>
        <button
          onClick={() => setActiveTab('gacha')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition ${
            activeTab === 'gacha' ? 'bg-purple-500 text-white' : 'text-slate-400 bg-slate-950'
          }`}
        >
          Loot Gacha
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {activeTab === 'growtopia' && (
          <GrowtopiaMatrixView batches={batches} onRefresh={loadData} />
        )}
        {activeTab === 'roblox' && <RobloxSuiteView />}
        {activeTab === 'arbitrage' && <TradeArbitrageView />}
        {activeTab === 'discord' && <DiscordWebhookView />}
        {activeTab === 'gacha' && <GachaSimulatorView />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p className="font-bold text-slate-400">GAMEVAULT & METAFORGE OS v2.0 — ALL MODULES ACTIVE</p>
        <p className="mt-1">Universal Gaming Economy Suite & Discord Webhook Bot Studio.</p>
      </footer>
    </div>
  );
}
