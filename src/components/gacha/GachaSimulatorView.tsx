"use client";

import React, { useState } from 'react';
import { 
  Dice5, 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  Package, 
  Gem, 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  Trash2,
  Coins
} from 'lucide-react';
import { GachaItem } from '@/types/gamevault';
import confetti from 'canvas-confetti';

const GACHA_POOL: GachaItem[] = [
  // Legendary (2%)
  { id: 'leg-1', name: 'Rayman 1000 Gloves', tier: 'LEGENDARY', valueWl: 3600, description: 'Sarung tangan legendaris untuk menghancurkan 3 blok sekaligus.' },
  { id: 'leg-2', name: 'Magplant 5000 Remote', tier: 'LEGENDARY', valueWl: 2850, description: 'Menghisap 5000 bibit/blok otomatis ke dalam mesin BFG.' },
  { id: 'leg-3', name: 'Ring of Force (One-Ring)', tier: 'LEGENDARY', valueWl: 1500, description: 'Cincin super langka dari Carnival dengan kekuatan tinju jarak jauh.' },

  // Epic (8%)
  { id: 'epic-1', name: 'Da Vinci Wings', tier: 'EPIC', valueWl: 450, description: 'Sayap mahakarya Leonardo da Vinci dengan efek melayang lambat.' },
  { id: 'epic-2', name: 'Golden Pickaxe', tier: 'EPIC', valueWl: 320, description: 'Kapak emas klasik berkilau dengan kecepatan hancur +10%.' },
  { id: 'epic-3', name: 'Growscan 9000', tier: 'EPIC', valueWl: 280, description: 'Detektor radar scan seluruh world untuk mencari item tersembunyi.' },

  // Rare (20%)
  { id: 'rare-1', name: 'Phoenix Wings', tier: 'RARE', valueWl: 95, description: 'Sayap api burung phoenix abadi.' },
  { id: 'rare-2', name: 'Diamond Ring', tier: 'RARE', valueWl: 65, description: 'Cincin berlian murni untuk hadiah pernikahan in-game.' },
  { id: 'rare-3', name: 'Focused Eyes', tier: 'RARE', valueWl: 45, description: 'Mata fokus menyala merah untuk efek intimidasi lawan.' },

  // Common (70%)
  { id: 'com-1', name: 'Laser Grid Seed Pack (200x)', tier: 'COMMON', valueWl: 5, description: 'Paket bibit L-Grid siap tanam 1 blok.' },
  { id: 'com-2', name: 'Pepper Tree Seed Pack (200x)', tier: 'COMMON', valueWl: 3, description: 'Paket bibit pepper harian siap tanam.' },
  { id: 'com-3', name: 'Small Lock Pack (10x)', tier: 'COMMON', valueWl: 1, description: 'Kunci pengaman area kecil klasik.' },
];

export const GachaSimulatorView: React.FC = () => {
  const [inventory, setInventory] = useState<GachaItem[]>([]);
  const [pityCounter, setPityCounter] = useState<number>(0);
  const [lastPulls, setLastPulls] = useState<GachaItem[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [tierFilter, setTierFilter] = useState<'ALL' | 'LEGENDARY' | 'EPIC' | 'RARE' | 'COMMON'>('ALL');

  const pullSingle = (currentPity: number): { item: GachaItem; nextPity: number } => {
    const nextP = currentPity + 1;
    const legendaries = GACHA_POOL.filter((i) => i.tier === 'LEGENDARY');
    const epics = GACHA_POOL.filter((i) => i.tier === 'EPIC');
    const rares = GACHA_POOL.filter((i) => i.tier === 'RARE');
    const commons = GACHA_POOL.filter((i) => i.tier === 'COMMON');

    // Guaranteed Pity at 50
    if (nextP >= 50) {
      const item = legendaries[Math.floor(Math.random() * legendaries.length)];
      return { item, nextPity: 0 };
    }

    const rand = Math.random() * 100;
    if (rand < 2) {
      // 2% Legendary
      const item = legendaries[Math.floor(Math.random() * legendaries.length)];
      return { item, nextPity: 0 };
    } else if (rand < 10) {
      // 8% Epic
      const item = epics[Math.floor(Math.random() * epics.length)];
      return { item, nextPity: nextP };
    } else if (rand < 30) {
      // 20% Rare
      const item = rares[Math.floor(Math.random() * rares.length)];
      return { item, nextPity: nextP };
    } else {
      // 70% Common
      const item = commons[Math.floor(Math.random() * commons.length)];
      return { item, nextPity: nextP };
    }
  };

  const handlePull = (count: 1 | 10 | 50) => {
    setIsRolling(true);

    setTimeout(() => {
      const results: GachaItem[] = [];
      let currentP = pityCounter;

      for (let i = 0; i < count; i++) {
        const { item, nextPity } = pullSingle(currentP);
        results.push(item);
        currentP = nextPity;
      }

      setPityCounter(currentP);
      setLastPulls(results);
      setInventory((prev) => [...results, ...prev]);
      setIsRolling(false);

      const hasLegendary = results.some((r) => r.tier === 'LEGENDARY');
      const hasEpic = results.some((r) => r.tier === 'EPIC');

      if (hasLegendary) {
        try {
          confetti({
            particleCount: 160,
            spread: 90,
            origin: { y: 0.5 },
          });
        } catch {}
      } else if (hasEpic) {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {}
      }
    }, 350);
  };

  const handleSellCommons = () => {
    const commonsCount = inventory.filter((i) => i.tier === 'COMMON').length;
    if (commonsCount === 0) return;
    setInventory((prev) => prev.filter((i) => i.tier !== 'COMMON'));
  };

  const filteredInventory = inventory.filter((item) => {
    if (tierFilter === 'ALL') return true;
    return item.tier === tierFilter;
  });

  const totalVaultValueWl = inventory.reduce((sum, item) => sum + item.valueWl, 0);
  const totalLegendaries = inventory.filter((i) => i.tier === 'LEGENDARY').length;
  const totalEpics = inventory.filter((i) => i.tier === 'EPIC').length;

  return (
    <div className="space-y-6">
      {/* Header & Rates */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white font-black shadow-lg shadow-purple-950/40">
            <Dice5 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Mystery Loot Box & Gacha Simulator</h3>
            <p className="text-xs text-slate-400">
              Mesin gacha probabilitas nyata dengan Hard Pity System: Jaminan Legendary di tarikan ke-50!
            </p>
          </div>
        </div>

        {/* Pity Indicator */}
        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-right">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Hard Pity Counter</span>
          <span className="font-mono font-black text-amber-400 text-base">
            {pityCounter} / 50 Pity
          </span>
        </div>
      </div>

      {/* Main Gacha Box Stage */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Rates Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono">
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Legendary: 2%
          </span>
          <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
            Epic: 8%
          </span>
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Rare: 20%
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            Common: 70%
          </span>
        </div>

        {/* Central Box Icon */}
        <div className="h-32 w-32 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-1 flex items-center justify-center shadow-2xl shadow-purple-950/60 animate-pulse">
          <div className="h-full w-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <Package className="h-16 w-16 text-purple-400" />
          </div>
        </div>

        {/* Pull Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => handlePull(1)}
            disabled={isRolling}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 transition active:scale-95 disabled:opacity-50"
          >
            Buka 1x Peti
          </button>
          <button
            onClick={() => handlePull(10)}
            disabled={isRolling}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-black text-xs shadow-xl shadow-purple-950/50 transition active:scale-95 disabled:opacity-50"
          >
            ⚡ Buka 10x Pulls (Hemat Waktu)
          </button>
          <button
            onClick={() => handlePull(50)}
            disabled={isRolling}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-xl shadow-amber-950/40 transition active:scale-95 disabled:opacity-50"
          >
            🔥 50x Mega Pull (Jaminan Legendary Pity!)
          </button>
        </div>

        {/* Last Pull Reveal Results */}
        {lastPulls.length > 0 && (
          <div className="w-full pt-4 border-t border-slate-800/80 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Hasil Tarikan Terakhir ({lastPulls.length} Item Didapatkan):
            </span>

            <div className="flex flex-wrap justify-center gap-2.5 max-h-56 overflow-y-auto p-2">
              {lastPulls.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center w-36 text-center animate-in fade-in zoom-in duration-200 ${
                    item.tier === 'LEGENDARY'
                      ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/50'
                      : item.tier === 'EPIC'
                      ? 'bg-purple-950/40 border-purple-500/50'
                      : item.tier === 'RARE'
                      ? 'bg-cyan-950/30 border-cyan-500/40'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      item.tier === 'LEGENDARY'
                        ? 'bg-amber-500 text-slate-950'
                        : item.tier === 'EPIC'
                        ? 'bg-purple-500 text-white'
                        : item.tier === 'RARE'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.tier}
                  </span>
                  <span className="font-bold text-white text-xs mt-2 truncate w-full">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1">
                    ~{item.valueWl} WL
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inventory & Statistics */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-emerald-400" />
              <span>Inventori Peti Anda ({inventory.length} Item)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Total Valuasi Kas Tas: <strong className="text-emerald-400 font-mono font-black">~{totalVaultValueWl.toLocaleString('id-ID')} World Locks</strong> (Setara {(totalVaultValueWl / 100).toFixed(1)} DL)
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSellCommons}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Jual Semua Common (Bersihkan Tas)
            </button>
            <button
              onClick={() => {
                if (confirm('Kosongkan seluruh inventori hasil gacha?')) setInventory([]);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition"
              title="Reset Tas"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 flex-wrap text-xs">
          {['ALL', 'LEGENDARY', 'EPIC', 'RARE', 'COMMON'].map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t as any)}
              className={`px-3 py-1 rounded-xl transition ${
                tierFilter === t
                  ? 'bg-purple-500 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {t} ({t === 'ALL' ? inventory.length : inventory.filter((i) => i.tier === t).length})
            </button>
          ))}
        </div>

        {/* Grid of items */}
        {filteredInventory.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-950/50 border border-slate-800 text-slate-500 text-xs">
            Tidak ada item gacha dalam kategori ini. Buka peti di atas untuk mengoleksi item langka!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredInventory.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between text-center space-y-2 hover:border-slate-700 transition"
              >
                <div>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block ${
                      item.tier === 'LEGENDARY'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : item.tier === 'EPIC'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : item.tier === 'RARE'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.tier}
                  </span>
                  <span className="font-bold text-white text-xs block truncate mt-1.5">
                    {item.name}
                  </span>
                </div>

                <div className="text-[11px] font-mono font-bold text-emerald-400">
                  +{item.valueWl} WL
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
