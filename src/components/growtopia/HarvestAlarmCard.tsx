"use client";

import React, { useState, useEffect } from 'react';
import { HarvestBatch } from '@/types/gamevault';
import { GROWTOPIA_SEEDS } from '@/lib/mock-seeds';
import { StorageEngine } from '@/lib/storage';
import { 
  Clock, 
  Gem, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  RotateCcw 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HarvestAlarmCardProps {
  batch: HarvestBatch;
  onRefresh: () => void;
}

export const HarvestAlarmCard: React.FC<HarvestAlarmCardProps> = ({ batch, onRefresh }) => {
  const seedInfo = GROWTOPIA_SEEDS.find((s) => s.id === batch.seedId || s.name === batch.seedName);
  const [timeLeftString, setTimeLeftString] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(batch.status === 'READY');

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const readyTime = new Date(batch.readyAt).getTime();
      const plantedTime = new Date(batch.plantedAt).getTime();
      const totalDuration = readyTime - plantedTime;
      const elapsed = now - plantedTime;

      const progress = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
      setProgressPercent(progress);

      const diff = readyTime - now;

      if (diff <= 0) {
        setTimeLeftString('00:00:00 (SIAP PANEN)');
        setIsReady(true);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeftString(`${days}h ${hours}j ${minutes}m ${seconds}s`);
        } else {
          setTimeLeftString(
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
          );
        }
        setIsReady(false);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [batch.readyAt, batch.plantedAt]);

  const handleHarvest = () => {
    // Fire Confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Fallback
    }

    const currentBatches = StorageEngine.getBatches();
    const updated = currentBatches.filter((b) => b.id !== batch.id);
    StorageEngine.saveBatches(updated);
    onRefresh();
  };

  const handleDelete = () => {
    if (confirm(`Hapus batch panen "${batch.seedName}" di world ${batch.worldName}?`)) {
      const currentBatches = StorageEngine.getBatches();
      const updated = currentBatches.filter((b) => b.id !== batch.id);
      StorageEngine.saveBatches(updated);
      onRefresh();
    }
  };

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        isReady
          ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Background Accent glow */}
      {isReady && (
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
      )}

      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`h-9 w-9 rounded-xl bg-gradient-to-tr ${
                seedInfo?.baseColor || 'from-emerald-500 to-teal-500'
              } flex items-center justify-center text-slate-950 font-black text-xs shadow-md`}
            >
              {batch.seedName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">{batch.seedName}</h4>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                <Globe className="h-3 w-3 text-cyan-400" />
                <span className="font-mono font-bold text-cyan-300">{batch.worldName}</span>
                <span>•</span>
                <span>{batch.treeCount.toLocaleString('id-ID')} Pohon</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
              isReady
                ? 'bg-emerald-500 text-slate-950 animate-bounce'
                : 'bg-slate-800 text-cyan-400 border border-slate-700 font-mono'
            }`}
          >
            {isReady ? <Sparkles className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            {isReady ? 'READY' : 'GROWING'}
          </span>
        </div>

        {/* Live Timer Clock Display */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-0.5">
            {isReady ? 'WAKTU PANEN TIBA' : 'SISA WAKTU TUMBUH'}
          </span>
          <div
            className={`text-lg font-black font-mono tracking-tight ${
              isReady ? 'text-emerald-400 animate-pulse' : 'text-slate-100'
            }`}
          >
            {timeLeftString}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2.5">
            <div
              className={`h-full transition-all duration-1000 ${
                isReady
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
            <span>Ditanam</span>
            <span>{progressPercent}% Matang</span>
            <span>Siap Panen</span>
          </div>
        </div>

        {/* Estimates */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono">
            <Gem className="h-3.5 w-3.5" />
            <span className="font-bold">+{batch.estimatedGems.toLocaleString('id-ID')}</span>
            <span className="text-[10px] text-slate-400">Gems</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-bold">~{batch.estimatedSeeds.toLocaleString('id-ID')}</span>
            <span className="text-[10px] text-slate-400">Seeds</span>
          </div>
        </div>

        {batch.notes && (
          <p className="text-[11px] text-slate-400 italic mt-2 line-clamp-1">
            "{batch.notes}"
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        {isReady ? (
          <button
            onClick={handleHarvest}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Klaim Panen (Harvested!)</span>
          </button>
        ) : (
          <div className="text-[11px] text-slate-500 font-mono">
            Pohon sedang berbuah...
          </div>
        )}

        <button
          onClick={handleDelete}
          title="Hapus / Batalkan Alarm"
          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 border border-slate-700 transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
