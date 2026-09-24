"use client";

import React, { useState } from 'react';
import { GtSeed, HarvestBatch } from '@/types/gamevault';
import { GROWTOPIA_SEEDS } from '@/lib/mock-seeds';
import { 
  Sprout, 
  GitFork, 
  Clock, 
  Gem, 
  Sparkles, 
  Plus, 
  Search, 
  Calculator, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Coins
} from 'lucide-react';
import { HarvestAlarmCard } from './HarvestAlarmCard';
import { SeedSpliceModal } from './SeedSpliceModal';
import { AddBatchModal } from './AddBatchModal';

interface GrowtopiaMatrixViewProps {
  batches: HarvestBatch[];
  onRefresh: () => void;
}

export const GrowtopiaMatrixView: React.FC<GrowtopiaMatrixViewProps> = ({ batches, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'FARMABLE' | 'BUILDING'>('ALL');
  const [inspectingSeed, setInspectingSeed] = useState<GtSeed | null>(null);
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [targetSeedForBatch, setTargetSeedForBatch] = useState<GtSeed | undefined>();

  // Calculator State
  const [calcSeedId, setCalcSeedId] = useState('seed-chandelier');
  const [calcTreeCount, setCalcTreeCount] = useState<number>(2640);

  const calcSeed = GROWTOPIA_SEEDS.find((s) => s.id === calcSeedId) || GROWTOPIA_SEEDS[0];
  const calcTotalGems = Math.round(calcTreeCount * calcSeed.gemYieldPerTree);
  const calcTotalSeeds = Math.round(calcTreeCount * calcSeed.seedDropRate);
  const calcProfitSeeds = calcTotalSeeds - calcTreeCount;
  // Diamond Lock estimate (approx 200,000 gems = 1 DL or 2,000 gems = 1 World Lock)
  const calcWorldLocks = Math.floor(calcTotalGems / 2000);
  const calcDiamondLocks = (calcWorldLocks / 100).toFixed(2);

  const filteredSeeds = GROWTOPIA_SEEDS.filter((seed) => {
    const matchesCategory = selectedCategory === 'ALL' || seed.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      seed.name.toLowerCase().includes(term) ||
      seed.description.toLowerCase().includes(term) ||
      (seed.spliceRecipe &&
        (seed.spliceRecipe.seedA.toLowerCase().includes(term) ||
          seed.spliceRecipe.seedB.toLowerCase().includes(term)));
    return matchesCategory && matchesSearch;
  });

  const totalActiveTrees = batches.reduce((sum, b) => sum + b.treeCount, 0);
  const totalPotentialGems = batches.reduce((sum, b) => sum + b.estimatedGems, 0);

  return (
    <div className="space-y-8">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Pohon Sedang Tumbuh</span>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
              {totalActiveTrees.toLocaleString('id-ID')} Pohon
            </div>
            <div className="text-[11px] text-emerald-400/70 mt-0.5">{batches.length} Farm World Aktif</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sprout className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Potensi Gems Panen Berjalan</span>
            <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
              +{totalPotentialGems.toLocaleString('id-ID')} Gems
            </div>
            <div className="text-[11px] text-amber-400/70 mt-0.5">
              Setara ~{(totalPotentialGems / 2000).toFixed(1)} World Locks (WL)
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Gem className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Database Bibit & Splicing</span>
            <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">
              {GROWTOPIA_SEEDS.length} Bibit Terdaftar
            </div>
            <div className="text-[11px] text-cyan-400/70 mt-0.5">Silsilah Pohon Persilangan Otomatis</div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <GitFork className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Section 1: Active Harvest Alarm Timers */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-400" />
              <span>Alarm Panen & Countdown Siklus Kebun</span>
            </h3>
            <p className="text-xs text-slate-400">
              Timer hitung mundur real-time dengan alarm panen otomatis saat pohon matang.
            </p>
          </div>

          <button
            onClick={() => {
              setTargetSeedForBatch(undefined);
              setIsAddBatchOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/40 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Catat Batch Panen Baru</span>
          </button>
        </div>

        {batches.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <Sprout className="h-10 w-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Belum ada alarm panen aktif</p>
            <p className="text-xs text-slate-500 mt-1">
              Pilih bibit di bawah atau klik "Catat Batch Panen Baru" untuk mengaktifkan countdown timer.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map((batch) => (
              <HarvestAlarmCard key={batch.id} batch={batch} onRefresh={onRefresh} />
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Interactive Yield & Profit Calculator */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Kalkulator Simulasi Panen & Profit Gems</h3>
            <p className="text-xs text-slate-400">Simulasikan perolehan gems dan pertumbuhan bibit per siklus farming</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Pilih Bibit Pohon</label>
              <select
                value={calcSeedId}
                onChange={(e) => setCalcSeedId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium text-xs focus:outline-none focus:border-cyan-500"
              >
                {GROWTOPIA_SEEDS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Tier {s.tier} — {s.growthTimeString})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 text-xs text-slate-400">
                <span>Jumlah Pohon Ditanam</span>
                <span className="font-mono font-bold text-white">{calcTreeCount.toLocaleString('id-ID')} Trees</span>
              </div>
              <input
                type="range"
                min="100"
                max="5280"
                step="50"
                value={calcTreeCount}
                onChange={(e) => setCalcTreeCount(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span onClick={() => setCalcTreeCount(500)} className="cursor-pointer hover:text-white">500</span>
                <span onClick={() => setCalcTreeCount(1000)} className="cursor-pointer hover:text-white">1.000</span>
                <span onClick={() => setCalcTreeCount(2640)} className="cursor-pointer hover:text-emerald-400 font-bold">2.640 (1 World)</span>
                <span onClick={() => setCalcTreeCount(5280)} className="cursor-pointer hover:text-white">5.280 (2 Worlds)</span>
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/30 flex flex-col justify-between space-y-4">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Gem className="h-4 w-4 text-amber-400" /> Estimasi Total Gems
                </span>
                <span className="text-lg font-black font-mono text-amber-400">
                  +{calcTotalGems.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-400" /> Estimasi Bibit Balik
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  ~{calcTotalSeeds.toLocaleString('id-ID')} Seeds (+{calcProfitSeeds} bibit baru)
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Coins className="h-4 w-4 text-cyan-400" /> Konversi Valuasi Lock
                </span>
                <span className="font-mono font-bold text-cyan-300">
                  ~{calcWorldLocks} WL / {calcDiamondLocks} Diamond Locks (DL)
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-500" /> Waktu Tunggu Panen
                </span>
                <span className="font-mono font-bold text-slate-200">{calcSeed.growthTimeString}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setTargetSeedForBatch(calcSeed);
                setIsAddBatchOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Simpan Simulasi Ini ke Alarm Panen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Seed & Splicing Matrix Catalog */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <GitFork className="h-5 w-5 text-cyan-400" />
              <span>Katalog Bibit & Splicing Tree Explorer</span>
            </h3>
            <p className="text-xs text-slate-400">
              Klik bibit apa saja untuk membuka diagram persilangan pohon induk dan detail farmable.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1 rounded-lg transition ${
                  selectedCategory === 'ALL'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedCategory('FARMABLE')}
                className={`px-3 py-1 rounded-lg transition ${
                  selectedCategory === 'FARMABLE'
                    ? 'bg-emerald-950 text-emerald-400 font-bold border border-emerald-800/60'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Farmables
              </button>
              <button
                onClick={() => setSelectedCategory('BUILDING')}
                className={`px-3 py-1 rounded-lg transition ${
                  selectedCategory === 'BUILDING'
                    ? 'bg-cyan-950 text-cyan-400 font-bold border border-cyan-800/60'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Building
              </button>
            </div>

            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Cari bibit / resep..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Seed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSeeds.map((seed) => (
            <div
              key={seed.id}
              onClick={() => setInspectingSeed(seed)}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/60 transition cursor-pointer flex flex-col justify-between space-y-3 group shadow-lg shadow-black/20"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-9 w-9 rounded-xl bg-gradient-to-tr ${seed.baseColor} flex items-center justify-center text-slate-950 font-black text-xs shadow-md`}
                    >
                      <Sprout className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                        {seed.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Tier {seed.tier} (Rarity {seed.rarity})
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-cyan-400 border border-slate-800 font-mono">
                    {seed.growthTimeString}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mt-2.5">
                  {seed.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                {seed.spliceRecipe ? (
                  <span className="text-emerald-400/80 flex items-center gap-1 font-mono">
                    <GitFork className="h-3 w-3" />
                    {seed.spliceRecipe.seedA} + {seed.spliceRecipe.seedB}
                  </span>
                ) : (
                  <span className="text-slate-500 italic">Base Seed</span>
                )}

                <span className="text-amber-400 font-mono font-bold">
                  ~{seed.gemYieldPerTree} Gems
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Splicing Modal */}
      {inspectingSeed && (
        <SeedSpliceModal
          seed={inspectingSeed}
          onClose={() => setInspectingSeed(null)}
          onSelectSeed={(s) => setInspectingSeed(s)}
        />
      )}

      {/* Add Batch Modal */}
      {isAddBatchOpen && (
        <AddBatchModal
          onClose={() => setIsAddBatchOpen(false)}
          onSuccess={onRefresh}
          preSelectedSeed={targetSeedForBatch}
        />
      )}
    </div>
  );
};
