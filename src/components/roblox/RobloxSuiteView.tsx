"use client";

import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  DollarSign, 
  Calculator, 
  ShieldCheck, 
  TrendingUp, 
  Target, 
  Plus, 
  Sparkles, 
  Users, 
  ArrowRight,
  Flame,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { DevExGoal } from '@/types/gamevault';
import { StorageEngine } from '@/lib/storage';

export const RobloxSuiteView: React.FC = () => {
  const [subTab, setSubTab] = useState<'calculator' | 'devex_goals' | 'forecaster'>('calculator');

  // Calculator State
  const [calcMode, setCalcMode] = useState<'GROSS_TO_NET' | 'TARGET_NET'>('GROSS_TO_NET');
  const [grossInput, setGrossInput] = useState<number>(100000);
  const [targetNetInput, setTargetNetInput] = useState<number>(70000);
  const [assetType, setAssetType] = useState<'GAMEPASS' | 'CLASSIC_CLOTHES' | 'UGC_3D'>('GAMEPASS');
  const [hasW8Ben, setHasW8Ben] = useState<boolean>(true); // Indo-US Tax Treaty

  // Exchange rates
  const devExRateUsd = 0.0035; // Standard $350 per 100,000 Robux
  const usdToIdr = 16250;

  // Forecaster State
  const [dau, setDau] = useState<number>(5000);
  const [conversionRate, setConversionRate] = useState<number>(2.5);
  const [avgSpendRobux, setAvgSpendRobux] = useState<number>(150);

  // DevEx Goals State
  const [goals, setGoals] = useState<DevExGoal[]>([]);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState<number>(100000);
  const [newGoalCurrent, setNewGoalCurrent] = useState<number>(50000);

  useEffect(() => {
    setGoals(StorageEngine.getDevExGoals());
  }, []);

  // Compute Tax & Payout
  let activeGross = grossInput;
  let activeNet = Math.round(grossInput * 0.7);

  if (calcMode === 'TARGET_NET') {
    activeNet = targetNetInput;
    activeGross = Math.ceil(targetNetInput / 0.7);
  }

  const taxCut = activeGross - activeNet;
  const rawUsd = activeNet * devExRateUsd;
  const usTaxWithholding = hasW8Ben ? 0 : rawUsd * 0.3; // 30% IRS if no treaty
  const finalUsd = rawUsd - usTaxWithholding;
  const finalIdr = Math.round(finalUsd * usdToIdr);

  // Forecaster Calculations
  const dailyPayers = Math.round(dau * (conversionRate / 100));
  const dailyGrossRobux = dailyPayers * avgSpendRobux;
  const dailyNetRobux = Math.round(dailyGrossRobux * 0.7);
  const monthlyNetRobux = dailyNetRobux * 30;
  const monthlyUsd = (monthlyNetRobux * devExRateUsd).toFixed(2);
  const monthlyIdr = Math.round(Number(monthlyUsd) * usdToIdr);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle) return;

    const newG: DevExGoal = {
      id: `goal-${Date.now().toString().slice(-6)}`,
      title: newGoalTitle,
      targetRobux: Number(newGoalTarget) || 100000,
      currentRobux: Number(newGoalCurrent) || 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newG, ...goals];
    StorageEngine.saveDevExGoals(updated);
    setGoals(updated);
    setIsAddGoalOpen(false);
    setNewGoalTitle('');
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    StorageEngine.saveDevExGoals(updated);
    setGoals(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-950/40">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Roblox Marketplace 30% Tax & DevEx Suite</h3>
            <p className="text-xs text-slate-400">
              Kalkulator potongan komisi 30%, penetapan harga jual, proyeksi omzet DAU, dan konversi kas DevEx ke IDR.
            </p>
          </div>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setSubTab('calculator')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              subTab === 'calculator'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kalkulator Pajak & Kurs
          </button>
          <button
            onClick={() => setSubTab('devex_goals')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              subTab === 'devex_goals'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Target Pencairan ({goals.length})
          </button>
          <button
            onClick={() => setSubTab('forecaster')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              subTab === 'forecaster'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Proyeksi DAU Gamepass
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Tax & Net Calculator */}
      {subTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Calculator className="h-4 w-4" /> Mode Kalkulasi
              </span>

              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setCalcMode('GROSS_TO_NET')}
                  className={`px-3 py-1 rounded-lg transition font-medium ${
                    calcMode === 'GROSS_TO_NET' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  Harga Jual Kotor
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode('TARGET_NET')}
                  className={`px-3 py-1 rounded-lg transition font-medium ${
                    calcMode === 'TARGET_NET' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  Target Robux Bersih
                </button>
              </div>
            </div>

            {/* Input field */}
            {calcMode === 'GROSS_TO_NET' ? (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Harga Jual Produk / Gamepass di Marketplace (R$)
                </label>
                <input
                  type="number"
                  step="100"
                  value={grossInput}
                  onChange={(e) => setGrossInput(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-base font-bold focus:outline-none focus:border-amber-500"
                />
                <div className="flex gap-2 mt-2">
                  {[10000, 50000, 100000, 500000].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setGrossInput(r)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-mono border border-slate-800 transition"
                    >
                      {r.toLocaleString('id-ID')} R$
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Berapa Robux Bersih yang Ingin Anda Terima di Kantong? (R$)
                </label>
                <input
                  type="number"
                  step="100"
                  value={targetNetInput}
                  onChange={(e) => setTargetNetInput(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-base font-bold focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-emerald-400 mt-1.5 font-mono">
                  💡 Untuk dapat {targetNetInput.toLocaleString('id-ID')} R$, Anda harus memasang harga <strong>{activeGross.toLocaleString('id-ID')} R$</strong> di toko.
                </p>
              </div>
            )}

            {/* Breakdown Card */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Harga Jual di Katalog Pembeli (Gross)</span>
                <span className="font-mono text-white font-bold">{activeGross.toLocaleString('id-ID')} R$</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>Potongan Pajak Marketplace Roblox (30%)</span>
                <span className="font-mono">-{taxCut.toLocaleString('id-ID')} R$</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-emerald-400 font-bold text-sm">
                <span>Robux Bersih Diterima Kreator (70%)</span>
                <span className="font-mono font-black">{activeNet.toLocaleString('id-ID')} R$</span>
              </div>
            </div>

            {/* Tax Treaty Toggle */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-xs block">Tax Treaty Form W-8BEN (Indonesia - US)</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Bebas potongan pajak US IRS (0% withholding) untuk kreator asal Indonesia.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHasW8Ben(!hasW8Ben)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  hasW8Ben
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {hasW8Ben ? 'W-8BEN Aktif (0%)' : 'Tanpa Treaty (30%)'}
              </button>
            </div>
          </div>

          {/* Right Payout Box */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/40 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> Estimasi Pencairan Kas DevEx
              </span>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                    Total Valuasi Dolar Amerika (USD)
                  </span>
                  <div className="text-3xl font-black text-amber-300 font-mono mt-1">
                    ${finalUsd.toFixed(2)} USD
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Rate standar Roblox: $0.0035 / Robux
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                    Pencairan Rekening Bank Lokal (IDR)
                  </span>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                    Rp {finalIdr.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Kurs estimasi BCA/Mandiri: Rp {usdToIdr.toLocaleString('id-ID')} / USD
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Syarat Validasi DevEx Resmi:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[10px]">
                <li>Minimal saldo kas 30.000 Robux hasil penjualan yang sah (Earned Robux).</li>
                <li>Akun terdaftar langganan Roblox Premium aktif.</li>
                <li>Verifikasi identitas KTP/Paspor via Persona ID portal.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: DevEx Milestones & Goals */}
      {subTab === 'devex_goals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-400" />
                <span>Target Tabungan & Pencairan DevEx</span>
              </h4>
              <p className="text-xs text-slate-400">Pantau progres akumulasi Robux untuk target pencairan gaji bulanan</p>
            </div>

            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Target Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const progressPercent = Math.min(100, Math.round((goal.currentRobux / goal.targetRobux) * 100));
              const remainingRobux = Math.max(0, goal.targetRobux - goal.currentRobux);
              const targetUsd = (goal.targetRobux * devExRateUsd).toFixed(0);
              const targetIdr = Math.round(Number(targetUsd) * usdToIdr);

              return (
                <div
                  key={goal.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h5 className="font-extrabold text-sm text-white">{goal.title}</h5>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">Dibuat: {goal.createdAt}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-slate-600 hover:text-rose-400 p-1 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Progres Akumulasi</span>
                        <span className="font-mono font-bold text-amber-400">
                          {goal.currentRobux.toLocaleString('id-ID')} / {goal.targetRobux.toLocaleString('id-ID')} R$ ({progressPercent}%)
                        </span>
                      </div>

                      {/* Bar */}
                      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Target Kas IDR</span>
                      <span className="font-mono font-bold text-emerald-400">
                        Rp {targetIdr.toLocaleString('id-ID')} (${targetUsd})
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase">Sisa Kebutuhan</span>
                      <span className="font-mono text-slate-300">
                        {remainingRobux.toLocaleString('id-ID')} R$
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Goal Modal */}
          {isAddGoalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                <h4 className="text-base font-bold text-white">Tambah Target Pencairan DevEx</h4>
                <form onSubmit={handleAddGoal} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Nama Target / Milestone *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Beli Laptop Baru / Gaji Bulan November"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Target Total Robux (R$)</label>
                    <input
                      type="number"
                      step="1000"
                      required
                      value={newGoalTarget}
                      onChange={(e) => setNewGoalTarget(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Robux yang Sudah Terkumpul Saat Ini (R$)</label>
                    <input
                      type="number"
                      step="1000"
                      value={newGoalCurrent}
                      onChange={(e) => setNewGoalCurrent(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddGoalOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
                    >
                      Simpan Target
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: DAU Forecaster */}
      {subTab === 'forecaster' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Simulator Pendapatan DAU Game & UGC</h4>
              <p className="text-xs text-slate-400">
                Hitung proyeksi pendapatan studio game Anda berdasarkan jumlah pemain harian aktif dan tingkat konversi berbayar.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Daily Active Users (DAU) Pemain Game
                </label>
                <input
                  type="number"
                  step="500"
                  value={dau}
                  onChange={(e) => setDau(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Tingkat Konversi Pembeli (%)</span>
                  <span className="font-mono font-bold text-white">{conversionRate}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.1"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <span className="text-[10px] text-slate-500 font-mono">Standar industri game Roblox: 1.5% - 3.5%</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Rata-rata Belanja per Pembeli (R$)
                </label>
                <input
                  type="number"
                  step="25"
                  value={avgSpendRobux}
                  onChange={(e) => setAvgSpendRobux(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Projected Outputs */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">Pembeli Aktif / Hari</span>
                  <span className="text-xl font-black text-white font-mono mt-1 block">
                    {dailyPayers.toLocaleString('id-ID')} Pemain
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">Net Robux / Hari</span>
                  <span className="text-xl font-black text-amber-400 font-mono mt-1 block">
                    +{dailyNetRobux.toLocaleString('id-ID')} R$
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">Net Robux / Bulan</span>
                  <span className="text-xl font-black text-emerald-400 font-mono mt-1 block">
                    +{monthlyNetRobux.toLocaleString('id-ID')} R$
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    PROYEKSI GAJI BERSIH BULANAN KREATIF:
                  </span>
                  <span className="text-2xl font-black text-white font-mono mt-0.5 block">
                    Rp {monthlyIdr.toLocaleString('id-ID')} / Bulan
                  </span>
                </div>
                <div className="text-right font-mono text-xs text-amber-300 font-bold">
                  (${monthlyUsd} USD)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
