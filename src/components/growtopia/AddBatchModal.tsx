"use client";

import React, { useState } from 'react';
import { GtSeed, HarvestBatch } from '@/types/gamevault';
import { GROWTOPIA_SEEDS } from '@/lib/mock-seeds';
import { StorageEngine } from '@/lib/storage';
import { X, Sprout, Globe, Hash, Clock, Gem, Sparkles, Plus } from 'lucide-react';

interface AddBatchModalProps {
  onClose: () => void;
  onSuccess: () => void;
  preSelectedSeed?: GtSeed;
}

export const AddBatchModal: React.FC<AddBatchModalProps> = ({
  onClose,
  onSuccess,
  preSelectedSeed,
}) => {
  const farmableSeeds = GROWTOPIA_SEEDS.filter((s) => s.category === 'FARMABLE');
  const [selectedSeedId, setSelectedSeedId] = useState<string>(
    preSelectedSeed?.id || farmableSeeds[0]?.id || ''
  );
  const [worldName, setWorldName] = useState('');
  const [treeCount, setTreeCount] = useState<number>(2640); // 1 Full World default
  const [notes, setNotes] = useState('');

  const selectedSeed = GROWTOPIA_SEEDS.find((s) => s.id === selectedSeedId) || farmableSeeds[0];

  const estimatedGems = Math.round(treeCount * (selectedSeed?.gemYieldPerTree || 10));
  const estimatedSeeds = Math.round(treeCount * (selectedSeed?.seedDropRate || 1.05));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!worldName) {
      alert('Mohon masukkan nama World Growtopia Anda!');
      return;
    }

    const now = new Date();
    const readyDate = new Date(now.getTime() + (selectedSeed.growthTimeSeconds * 1000));

    const newBatch: HarvestBatch = {
      id: `batch-${Date.now().toString().slice(-6)}`,
      seedId: selectedSeed.id,
      seedName: selectedSeed.name,
      worldName: worldName.toUpperCase(),
      treeCount: Number(treeCount) || 100,
      plantedAt: now.toISOString(),
      readyAt: readyDate.toISOString(),
      status: 'GROWING',
      estimatedGems,
      estimatedSeeds,
      notes: notes || `Batch pohon ${selectedSeed.name}`,
    };

    const currentBatches = StorageEngine.getBatches();
    StorageEngine.saveBatches([newBatch, ...currentBatches]);

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Catat Panen Pohon Baru</h3>
              <p className="text-xs text-slate-400">Aktifkan countdown alarm panen & estimasi gems</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm text-slate-200">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Pilih Bibit Pohon *</label>
            <select
              value={selectedSeedId}
              onChange={(e) => setSelectedSeedId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              {farmableSeeds.map((seed) => (
                <option key={seed.id} value={seed.id}>
                  {seed.name} (Tumbuh: {seed.growthTimeString} — ~{seed.gemYieldPerTree} Gems/Tree)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-cyan-400" /> Nama World Tanam *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: FARMER99 / CHANDFARM"
              value={worldName}
              onChange={(e) => setWorldName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white uppercase font-mono font-bold placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-emerald-400" /> Jumlah Pohon Ditanam
              </label>
              <div className="flex gap-1.5">
                {[500, 1000, 2640].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setTreeCount(count)}
                    className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-mono transition"
                  >
                    {count === 2640 ? '1 Full World' : `${count}`}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              min="1"
              required
              value={treeCount}
              onChange={(e) => setTreeCount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Forecast Box */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
              Kalkulasi Hasil Panen Otomatis:
            </span>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Gem className="h-3.5 w-3.5 text-amber-400" /> Estimasi Perolehan Gems
              </span>
              <span className="font-mono font-bold text-amber-400">
                +{estimatedGems.toLocaleString('id-ID')} Gems
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Estimasi Bibit Balik
              </span>
              <span className="font-mono font-bold text-emerald-400">
                ~{estimatedSeeds.toLocaleString('id-ID')} Seeds ({Math.round(((estimatedSeeds - treeCount) / treeCount) * 100)}% profit bibit)
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-cyan-400" /> Durasi Pertumbuhan
              </span>
              <span className="font-mono text-cyan-400">{selectedSeed.growthTimeString}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Catatan Khusus (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: Menggunakan Tractor, tanam hari Kamis"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Mulai Countdown Panen</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
