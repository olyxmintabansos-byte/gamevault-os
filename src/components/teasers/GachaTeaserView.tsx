"use client";

import React, { useState } from 'react';
import { Dice5, Sparkles, Trophy, RotateCcw, Package } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GachaItem {
  id: string;
  name: string;
  tier: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  valueWl: number;
}

const GACHA_POOL: GachaItem[] = [
  { id: '1', name: 'Rayman 1000 Gloves', tier: 'LEGENDARY', valueWl: 3500 },
  { id: '2', name: 'Magplant 5000 Remote', tier: 'LEGENDARY', valueWl: 2800 },
  { id: '3', name: 'Da Vinci Wings', tier: 'EPIC', valueWl: 450 },
  { id: '4', name: 'Golden Pickaxe', tier: 'EPIC', valueWl: 300 },
  { id: '5', name: 'Phoenix Wings', tier: 'RARE', valueWl: 95 },
  { id: '6', name: 'Diamond Ring', tier: 'RARE', valueWl: 60 },
  { id: '7', name: 'Laser Grid Pack (200x)', tier: 'COMMON', valueWl: 5 },
  { id: '8', name: 'Pepper Tree Pack (200x)', tier: 'COMMON', valueWl: 3 },
  { id: '9', name: 'Small Lock Pack (10x)', tier: 'COMMON', valueWl: 1 },
];

export const GachaTeaserView: React.FC = () => {
  const [inventory, setInventory] = useState<GachaItem[]>([]);
  const [pityCounter, setPityCounter] = useState(0);
  const [lastPull, setLastPull] = useState<GachaItem | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollGacha = () => {
    setIsRolling(true);

    setTimeout(() => {
      let rolledItem: GachaItem;
      const nextPity = pityCounter + 1;

      // Check Pity (guarantee Legendary at 50)
      if (nextPity >= 50) {
        const legendaries = GACHA_POOL.filter((i) => i.tier === 'LEGENDARY');
        rolledItem = legendaries[Math.floor(Math.random() * legendaries.length)];
        setPityCounter(0);
      } else {
        const rand = Math.random() * 100;
        if (rand < 2) {
          // 2% Legendary
          const legendaries = GACHA_POOL.filter((i) => i.tier === 'LEGENDARY');
          rolledItem = legendaries[Math.floor(Math.random() * legendaries.length)];
          setPityCounter(0);
        } else if (rand < 10) {
          // 8% Epic
          const epics = GACHA_POOL.filter((i) => i.tier === 'EPIC');
          rolledItem = epics[Math.floor(Math.random() * epics.length)];
          setPityCounter(nextPity);
        } else if (rand < 30) {
          // 20% Rare
          const rares = GACHA_POOL.filter((i) => i.tier === 'RARE');
          rolledItem = rares[Math.floor(Math.random() * rares.length)];
          setPityCounter(nextPity);
        } else {
          // 70% Common
          const commons = GACHA_POOL.filter((i) => i.tier === 'COMMON');
          rolledItem = commons[Math.floor(Math.random() * commons.length)];
          setPityCounter(nextPity);
        }
      }

      setLastPull(rolledItem);
      setInventory((prev) => [rolledItem, ...prev]);
      setIsRolling(false);

      if (rolledItem.tier === 'LEGENDARY' || rolledItem.tier === 'EPIC') {
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 },
          });
        } catch {}
      }
    }, 400);
  };

  const totalVaultValue = inventory.reduce((sum, item) => sum + item.valueWl, 0);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Dice5 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Mystery Loot Box & Gacha Simulator</h3>
              <p className="text-xs text-slate-400">
                Simulator gacha probabilitas nyata: Common (70%), Rare (20%), Epic (8%), Legendary (2%). Pity System aktif.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase block">Pity Counter</span>
            <span className="font-mono font-bold text-amber-400 text-sm">
              {pityCounter} / 50 Pity
            </span>
          </div>
        </div>

        {/* Gacha Stage */}
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center flex flex-col items-center justify-center space-y-4">
          <div className="h-28 w-28 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-1 flex items-center justify-center shadow-2xl shadow-purple-950/60 animate-pulse">
            <div className="h-full w-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Package className="h-12 w-12 text-purple-400" />
            </div>
          </div>

          {lastPull && (
            <div className="animate-in fade-in zoom-in duration-300">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  lastPull.tier === 'LEGENDARY'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : lastPull.tier === 'EPIC'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                    : lastPull.tier === 'RARE'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {lastPull.tier}
              </span>
              <h4 className="text-xl font-black text-white mt-1.5">{lastPull.name}</h4>
              <p className="text-xs font-mono text-emerald-400">Valuasi: ~{lastPull.valueWl} World Locks</p>
            </div>
          )}

          <button
            onClick={rollGacha}
            disabled={isRolling}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-extrabold text-sm shadow-xl shadow-purple-950/50 transition disabled:opacity-50"
          >
            {isRolling ? 'Membuka Peti...' : 'Buka Mystery Box (1x Pull)'}
          </button>
        </div>

        {/* Inventory Bag */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Tas Inventori Hasil Gacha ({inventory.length} Item)</span>
            <span className="font-mono text-emerald-400 font-bold">
              Total Valuasi: ~{totalVaultValue.toLocaleString('id-ID')} World Locks
            </span>
          </div>

          {inventory.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {inventory.slice(0, 12).map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">{item.tier}</span>
                  <span className="font-bold text-white text-xs block truncate mt-0.5">{item.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">+{item.valueWl} WL</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
