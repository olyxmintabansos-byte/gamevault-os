"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Sparkles, 
  Plus, 
  Search, 
  Calculator, 
  ShieldCheck, 
  Filter, 
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { ArbitrageItem } from '@/types/gamevault';
import { StorageEngine } from '@/lib/storage';

export const TradeArbitrageView: React.FC = () => {
  const [items, setItems] = useState<ArbitrageItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState<'ALL' | 'GROWTOPIA' | 'ROBLOX' | 'STEAM'>('ALL');

  // Simulator State
  const [selectedItem, setSelectedItem] = useState<ArbitrageItem | null>(null);
  const [simCapital, setSimCapital] = useState<number>(1000);

  // Add Item Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGame, setNewGame] = useState<'GROWTOPIA' | 'ROBLOX' | 'STEAM'>('GROWTOPIA');
  const [newBuyLoc, setNewBuyLoc] = useState('');
  const [newBuyPrice, setNewBuyPrice] = useState<number>(100);
  const [newSellLoc, setNewSellLoc] = useState('');
  const [newSellPrice, setNewSellPrice] = useState<number>(120);
  const [newTax, setNewTax] = useState<number>(0);
  const [newUnit, setNewUnit] = useState('DL');

  useEffect(() => {
    const list = StorageEngine.getArbitrage();
    setItems(list);
    if (list.length > 0) setSelectedItem(list[0]);
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesGame = gameFilter === 'ALL' || item.game === gameFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(term) ||
      item.buyLocation.toLowerCase().includes(term) ||
      item.sellLocation.toLowerCase().includes(term);
    return matchesGame && matchesSearch;
  });

  // Simulator Calculations
  const activeSimItem = selectedItem || items[0];
  const unitsCanBuy = activeSimItem && activeSimItem.buyPrice > 0 ? Math.floor(simCapital / activeSimItem.buyPrice) : 0;
  const totalCost = unitsCanBuy * (activeSimItem?.buyPrice || 0);
  const grossProceeds = unitsCanBuy * (activeSimItem?.sellPrice || 0);
  const taxCut = Math.round(grossProceeds * ((activeSimItem?.taxRatePercent || 0) / 100));
  const netProceeds = grossProceeds - taxCut;
  const netProfit = netProceeds - totalCost;
  const roiPercent = totalCost > 0 ? ((netProfit / totalCost) * 100).toFixed(1) : '0.0';

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newItem: ArbitrageItem = {
      id: `arb-${Date.now().toString().slice(-6)}`,
      name: newName,
      game: newGame,
      buyLocation: newBuyLoc || 'Pasar Beli Murah',
      buyPrice: Number(newBuyPrice) || 1,
      sellLocation: newSellLoc || 'Pasar Jual Tinggi',
      sellPrice: Number(newSellPrice) || 1,
      taxRatePercent: Number(newTax) || 0,
      unitName: newUnit || 'DL',
      trend: 'BULLISH',
      weeklyChangePercent: 3.5,
      notes: 'Peluang arbitrase custom pengguna',
    };

    const updated = [newItem, ...items];
    StorageEngine.saveArbitrage(updated);
    setItems(updated);
    setIsAddOpen(false);
    setNewName('');
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    StorageEngine.saveArbitrage(updated);
    setItems(updated);
    if (selectedItem?.id === id) setSelectedItem(updated[0] || null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-cyan-950/40">
            <ArrowLeftRight className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Dynamic Trade Value & Arbitrage Checker</h3>
            <p className="text-xs text-slate-400">
              Deteksi selisih spread harga jual-beli antar world/pasar virtual (Beli murah di World A, Jual mahal di World B).
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/40 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Peluang Arbitrase</span>
        </button>
      </div>

      {/* Simulator Section */}
      {activeSimItem && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white">
                  Kalkulator Simulasi Arbitrase Modal: <span className="text-cyan-400">{activeSimItem.name}</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Hitung perolehan profit bersih setelah dipotong biaya transaksi atau pajak platform.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950 text-emerald-400 border border-emerald-500/30 font-mono">
              Margin Spread: +{((activeSimItem.sellPrice - activeSimItem.buyPrice) * (1 - activeSimItem.taxRatePercent / 100)).toFixed(1)} {activeSimItem.unitName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Modal Dagang Anda ({activeSimItem.unitName})
                </label>
                <input
                  type="number"
                  step="10"
                  value={simCapital}
                  onChange={(e) => setSimCapital(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:outline-none focus:border-cyan-500"
                />
                <div className="flex gap-2 mt-2">
                  {[500, 1000, 5000, 10000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSimCapital(v)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-mono border border-slate-800 transition"
                    >
                      {v.toLocaleString('id-ID')} {activeSimItem.unitName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Tempat Beli (Pasar A)</span>
                  <span className="font-semibold text-white">{activeSimItem.buyLocation}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tempat Jual (Pasar B)</span>
                  <span className="font-semibold text-white">{activeSimItem.sellLocation}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Volume yang Dapat Dibeli</span>
                  <span className="font-mono text-cyan-400 font-bold">{unitsCanBuy} Unit</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/30 flex flex-col justify-between space-y-4">
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Biaya Beli Modal</span>
                  <span className="font-mono font-bold text-white">
                    {totalCost.toLocaleString('id-ID')} {activeSimItem.unitName}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Penjualan Bersih (Net Resell)</span>
                  <span className="font-mono font-bold text-slate-200">
                    {netProceeds.toLocaleString('id-ID')} {activeSimItem.unitName}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-emerald-400 font-extrabold text-sm">PROFIT BERSIH SPREAD:</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    +{netProfit.toLocaleString('id-ID')} {activeSimItem.unitName}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ROI Return: +{roiPercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Arbitrage Opportunities Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {['ALL', 'GROWTOPIA', 'ROBLOX'].map((tab) => (
              <button
                key={tab}
                onClick={() => setGameFilter(tab as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  gameFilter === tab
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Cari item arbitrase..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Nama Item Virtual</th>
                  <th className="py-3 px-4">Beli Di (Pasar A)</th>
                  <th className="py-3 px-4">Jual Di (Pasar B)</th>
                  <th className="py-3 px-4">Spread Margin Bersih</th>
                  <th className="py-3 px-4">Tren 7 Hari</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredItems.map((item) => {
                  const netSell = item.sellPrice * (1 - item.taxRatePercent / 100);
                  const spread = netSell - item.buyPrice;
                  const roi = ((spread / item.buyPrice) * 100).toFixed(1);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`hover:bg-slate-850/60 transition cursor-pointer ${
                        selectedItem?.id === item.id ? 'bg-cyan-950/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{item.name}</div>
                        <span className="text-[10px] font-bold uppercase text-cyan-400 font-mono">
                          {item.game}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-300 font-medium">{item.buyLocation}</div>
                        <div className="font-mono text-emerald-400 font-bold">
                          {item.buyPrice.toLocaleString('id-ID')} {item.unitName}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-300 font-medium">{item.sellLocation}</div>
                        <div className="font-mono text-cyan-400 font-bold">
                          {item.sellPrice.toLocaleString('id-ID')} {item.unitName}
                          {item.taxRatePercent > 0 && (
                            <span className="text-[10px] text-slate-500 ml-1">(-{item.taxRatePercent}% Pajak)</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-black text-sm text-emerald-400">
                          +{spread.toLocaleString('id-ID')} {item.unitName}
                        </div>
                        <span className="text-[10px] text-emerald-400/80 font-mono">
                          ROI: +{roi}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            item.trend === 'BULLISH'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : item.trend === 'BEARISH'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.trend === 'BULLISH' && <TrendingUp className="h-3 w-3" />}
                          {item.trend === 'BEARISH' && <TrendingDown className="h-3 w-3" />}
                          <span>{item.weeklyChangePercent > 0 ? `+${item.weeklyChangePercent}%` : `${item.weeklyChangePercent}%`}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id);
                          }}
                          className="p-1.5 text-slate-600 hover:text-rose-400 transition"
                          title="Hapus Peluang"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Arbitrage Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white">Catat Peluang Arbitrase Baru</h4>
            <form onSubmit={handleAddItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nama Item Virtual *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Laser Grid / Rayman"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Platform Game</label>
                  <select
                    value={newGame}
                    onChange={(e) => setNewGame(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="GROWTOPIA">Growtopia</option>
                    <option value="ROBLOX">Roblox</option>
                    <option value="STEAM">Steam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Satuan Nilai</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="DL / WL / Robux"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Lokasi Beli (Pasar A)</label>
                  <input
                    type="text"
                    placeholder="World BUY..."
                    value={newBuyLoc}
                    onChange={(e) => setNewBuyLoc(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Harga Beli</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newBuyPrice}
                    onChange={(e) => setNewBuyPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Lokasi Jual (Pasar B)</label>
                  <input
                    type="text"
                    placeholder="World SELL..."
                    value={newSellLoc}
                    onChange={(e) => setNewSellLoc(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Harga Jual</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newSellPrice}
                    onChange={(e) => setNewSellPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Pajak / Potongan Platform (%)</label>
                <input
                  type="number"
                  value={newTax}
                  onChange={(e) => setNewTax(Number(e.target.value))}
                  placeholder="0 untuk Growtopia, 30 untuk Roblox"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition"
                >
                  Simpan Peluang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
