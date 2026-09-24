"use client";

import React, { useState } from 'react';
import { Coins, Calculator, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';

export const RobloxTeaserView: React.FC = () => {
  const [grossRobux, setGrossRobux] = useState<number>(100000);
  const devExRateUsd = 0.0035; // standard Roblox DevEx rate: $350 per 100k Robux
  const usdToIdr = 16250;

  const marketplaceTax = Math.round(grossRobux * 0.3);
  const netRobux = grossRobux - marketplaceTax;

  const grossUsd = (grossRobux * devExRateUsd).toFixed(2);
  const netUsd = (netRobux * devExRateUsd).toFixed(2);
  const netIdr = Math.round(Number(netUsd) * usdToIdr);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Roblox Marketplace 30% Tax & DevEx Suite</h3>
            <p className="text-xs text-slate-400">
              Kalkulator potongan komisi UGC / Gamepass 30% dan konversi kas Developer Exchange ke USD & Rupiah.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Nilai Penjualan Robux Kotor (Gross Robux)
              </label>
              <input
                type="number"
                step="1000"
                value={grossRobux}
                onChange={(e) => setGrossRobux(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              />
              <div className="flex gap-2 mt-2">
                {[50000, 100000, 250000, 1000000].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setGrossRobux(r)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-[10px] text-slate-300 font-mono transition"
                  >
                    {r.toLocaleString('id-ID')} R$
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Pajak Marketplace Roblox (30%)</span>
                <span className="font-mono text-rose-400">-{marketplaceTax.toLocaleString('id-ID')} R$</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Robux Bersih Diterima (70%)</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {netRobux.toLocaleString('id-ID')} R$
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 border border-amber-500/30 space-y-4 flex flex-col justify-between">
            <div className="space-y-3 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Estimasi Pencairan DevEx (Developer Exchange):
              </span>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Valuasi DevEx USD (Rate: $0.0035/R$)</span>
                <span className="font-mono font-extrabold text-base text-amber-300">
                  ${netUsd} USD
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Setara Rupiah IDR (Kurs: Rp {usdToIdr.toLocaleString('id-ID')})</span>
                <span className="font-mono font-black text-lg text-emerald-400">
                  Rp {netIdr.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                DevEx minimal 30.000 Robux bersih, akun terverifikasi Roblox Premium, dan berusia 13+ tahun.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
