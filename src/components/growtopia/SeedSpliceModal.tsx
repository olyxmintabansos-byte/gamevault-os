"use client";

import React from 'react';
import { GtSeed } from '@/types/gamevault';
import { GROWTOPIA_SEEDS } from '@/lib/mock-seeds';
import { X, GitFork, Clock, Gem, Sparkles, Sprout, ArrowRight } from 'lucide-react';

interface SeedSpliceModalProps {
  seed: GtSeed;
  onClose: () => void;
  onSelectSeed: (seed: GtSeed) => void;
}

export const SeedSpliceModal: React.FC<SeedSpliceModalProps> = ({ seed, onClose, onSelectSeed }) => {
  const parentA = seed.spliceRecipe ? GROWTOPIA_SEEDS.find((s) => s.name === seed.spliceRecipe?.seedA) : null;
  const parentB = seed.spliceRecipe ? GROWTOPIA_SEEDS.find((s) => s.name === seed.spliceRecipe?.seedB) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${seed.baseColor} flex items-center justify-center text-slate-950 font-black shadow-lg`}>
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{seed.name} Seed</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
                  Tier {seed.tier} (Rarity {seed.rarity})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{seed.category} Matrix</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-slate-200">
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            {seed.description}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block flex items-center justify-center gap-1">
                <Clock className="h-3 w-3 text-cyan-400" /> Waktu Tumbuh
              </span>
              <span className="font-mono font-bold text-white text-xs mt-1 block">
                {seed.growthTimeString}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block flex items-center justify-center gap-1">
                <Gem className="h-3 w-3 text-amber-400" /> Hasil Gems / Tree
              </span>
              <span className="font-mono font-bold text-amber-400 text-xs mt-1 block">
                ~{seed.gemYieldPerTree} Gems
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3 text-emerald-400" /> Return Bibit
              </span>
              <span className="font-mono font-bold text-emerald-400 text-xs mt-1 block">
                {seed.seedDropRate}x (+{Math.round((seed.seedDropRate - 1) * 100)}%)
              </span>
            </div>
          </div>

          {/* Splicing Recipe Tree */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <GitFork className="h-4 w-4" /> Pohon Resep Persilangan (Splicing Tree)
            </h4>

            {seed.spliceRecipe ? (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                {/* Parent A */}
                <div
                  onClick={() => parentA && onSelectSeed(parentA)}
                  className={`p-3 rounded-xl border border-slate-800 bg-slate-900 w-full sm:w-36 ${
                    parentA ? 'cursor-pointer hover:border-emerald-500 transition' : 'opacity-70'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 block mb-1">Bibit Induk 1</span>
                  <span className="font-bold text-white text-xs block">{seed.spliceRecipe.seedA}</span>
                  {parentA && (
                    <span className="text-[9px] text-emerald-400 font-mono">Tier {parentA.tier}</span>
                  )}
                </div>

                <span className="text-xl font-black text-slate-600">+</span>

                {/* Parent B */}
                <div
                  onClick={() => parentB && onSelectSeed(parentB)}
                  className={`p-3 rounded-xl border border-slate-800 bg-slate-900 w-full sm:w-36 ${
                    parentB ? 'cursor-pointer hover:border-emerald-500 transition' : 'opacity-70'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 block mb-1">Bibit Induk 2</span>
                  <span className="font-bold text-white text-xs block">{seed.spliceRecipe.seedB}</span>
                  {parentB && (
                    <span className="text-[9px] text-emerald-400 font-mono">Tier {parentB.tier}</span>
                  )}
                </div>

                <ArrowRight className="h-5 w-5 text-emerald-400 hidden sm:block" />

                {/* Target Result */}
                <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 w-full sm:w-36">
                  <span className="text-[10px] text-emerald-400 font-bold block mb-1">HASIL SPLICE</span>
                  <span className="font-black text-white text-xs block">{seed.name}</span>
                  <span className="text-[9px] text-emerald-300 font-mono">{seed.growthTimeString}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500">
                Bibit ini merupakan bibit dasar (Base Seed) dan tidak dapat dibuat dari persilangan lain.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Tutup Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
