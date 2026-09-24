"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Copy, 
  Wheat, 
  Coins, 
  ArrowLeftRight, 
  Clock, 
  ExternalLink,
  Code,
  RotateCcw
} from 'lucide-react';
import { WebhookHistoryEntry } from '@/types/gamevault';
import { StorageEngine } from '@/lib/storage';

export const DiscordWebhookView: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [botName, setBotName] = useState('GameVault Alarm Bot');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop'
  );

  // Preset Template Selection
  const [template, setTemplate] = useState<'HARVEST' | 'ARBITRAGE' | 'DEVEX' | 'CUSTOM'>('HARVEST');

  // Embed Fields State
  const [embedTitle, setEmbedTitle] = useState('🌾 [Alarm Panen] Pohon Chandelier Matang!');
  const [embedDesc, setEmbedDesc] = useState(
    'Pohon di world **CHAND_VAULT** telah matang sempurna dan siap dipanen!\n\nEstimasi hasil panen: **+48.840 Gems** (~24 World Locks).'
  );
  const [embedColor, setEmbedColor] = useState('#10b981'); // Emerald hex
  const [fields, setFields] = useState<Array<{ name: string; value: string; inline: boolean }>>([
    { name: 'World Name', value: 'CHAND_VAULT', inline: true },
    { name: 'Total Pohon', value: '2.640 Trees', inline: true },
    { name: 'Status', value: 'READY TO HARVEST', inline: true },
  ]);

  const [statusMsg, setStatusMsg] = useState<{ type: 'idle' | 'success' | 'error'; text: string }>({
    type: 'idle',
    text: '',
  });

  const [history, setHistory] = useState<WebhookHistoryEntry[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('gamevault_webhook_history');
    if (raw) {
      try {
        setHistory(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const saveHistory = (entry: WebhookHistoryEntry) => {
    const updated = [entry, ...history.slice(0, 9)];
    setHistory(updated);
    localStorage.setItem('gamevault_webhook_history', JSON.stringify(updated));
  };

  const handleApplyTemplate = (type: 'HARVEST' | 'ARBITRAGE' | 'DEVEX' | 'CUSTOM') => {
    setTemplate(type);
    if (type === 'HARVEST') {
      setEmbedTitle('🌾 [Alarm Panen] Pohon Chandelier Matang!');
      setEmbedDesc(
        'Pohon di world **CHAND_VAULT** telah matang sempurna dan siap dipanen!\n\nEstimasi perolehan: **+48.840 Gems** (~24 World Locks).'
      );
      setEmbedColor('#10b981');
      setFields([
        { name: 'World Name', value: 'CHAND_VAULT', inline: true },
        { name: 'Total Pohon', value: '2.640 Trees', inline: true },
        { name: 'Status', value: 'READY TO HARVEST', inline: true },
      ]);
    } else if (type === 'ARBITRAGE') {
      setEmbedTitle('📈 [Trade Alert] Peluang Arbitrase Margin Tinggi!');
      setEmbedDesc(
        'Terdeteksi selisih spread harga menguntungkan untuk item **Rayman 1000 Gloves** antara pasar borongan dan retail.'
      );
      setEmbedColor('#06b6d4'); // Cyan
      setFields([
        { name: 'Beli di (Pasar A)', value: 'BUYRAYMAN (3.400 DL)', inline: true },
        { name: 'Jual di (Pasar B)', value: 'SELLRAYMAN (3.680 DL)', inline: true },
        { name: 'Spread Bersih', value: '+280 DL (+8.2% ROI)', inline: true },
      ]);
    } else if (type === 'DEVEX') {
      setEmbedTitle('🪙 [Roblox DevEx] Milestone 100.000 Robux Tercapai!');
      setEmbedDesc(
        'Saldo hasil penjualan gamepass studio telah menembus batas pencairan resmi Developer Exchange!'
      );
      setEmbedColor('#f59e0b'); // Amber
      setFields([
        { name: 'Saldo Bersih', value: '100.000 Robux', inline: true },
        { name: 'Valuasi USD', value: '$350.00 USD', inline: true },
        { name: 'Kurs Rupiah', value: 'Rp 5.687.500 IDR', inline: true },
      ]);
    }
  };

  const constructPayload = () => {
    // Hex to integer color
    const hexNum = parseInt(embedColor.replace('#', ''), 16) || 3407718;

    return {
      username: botName || 'GameVault Alarm Bot',
      avatar_url: avatarUrl,
      embeds: [
        {
          title: embedTitle,
          description: embedDesc,
          color: hexNum,
          fields: fields,
          footer: {
            text: 'GameVault OS • Universal Gaming Economy Suite',
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };
  };

  const handleSendWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      setStatusMsg({
        type: 'error',
        text: 'Format URL Webhook tidak valid! Harus berawalan https://discord.com/api/webhooks/...',
      });
      return;
    }

    try {
      setStatusMsg({ type: 'idle', text: 'Mengirim embed ke Discord...' });
      const payload = constructPayload();

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatusMsg({
          type: 'success',
          text: '✅ Sukses! Notifikasi embed GameVault telah masuk ke channel Discord Anda!',
        });
        saveHistory({
          id: `wh-${Date.now()}`,
          title: embedTitle,
          status: 'SUCCESS',
          sentAt: new Date().toLocaleTimeString('id-ID'),
          botName,
          details: `Kirim ke Discord Webhook`,
        });
      } else {
        setStatusMsg({
          type: 'error',
          text: `Gagal mengirim (HTTP ${res.status}). Pastikan URL Webhook masih aktif dan valid.`,
        });
        saveHistory({
          id: `wh-${Date.now()}`,
          title: embedTitle,
          status: 'FAILED',
          sentAt: new Date().toLocaleTimeString('id-ID'),
          botName,
          details: `Error HTTP ${res.status}`,
        });
      }
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: `Error saat fetch client-side: ${err.message || 'CORS / Network blocker'}. Anda juga bisa menyalin JSON payload di bawah.`,
      });
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(constructPayload(), null, 2));
    alert('JSON Payload Webhook berhasil disalin ke clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black shadow-lg shadow-indigo-950/40">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Discord Webhook Automation Studio</h3>
            <p className="text-xs text-slate-400">
              Integrasi pesan bot Discord 100% client-side dari browser untuk alarm panen, notifikasi trade, dan milestone kas DevEx.
            </p>
          </div>
        </div>

        {/* Template Quick Selectors */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
          <button
            onClick={() => handleApplyTemplate('HARVEST')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
              template === 'HARVEST' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wheat className="h-3.5 w-3.5" />
            <span>Panen Game</span>
          </button>
          <button
            onClick={() => handleApplyTemplate('ARBITRAGE')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
              template === 'ARBITRAGE' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span>Arbitrase</span>
          </button>
          <button
            onClick={() => handleApplyTemplate('DEVEX')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
              template === 'DEVEX' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="h-3.5 w-3.5" />
            <span>DevEx Cash</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Configuration */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Code className="h-4 w-4" /> 1. Konfigurasi Endpoint & Parameter Embed
          </h4>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              URL Webhook Discord Channel *
            </label>
            <input
              type="url"
              required
              placeholder="https://discord.com/api/webhooks/1234567890/abcdefg..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Nama Bot Pengirim</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Warna Garis Embed (Hex)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={embedColor}
                  onChange={(e) => setEmbedColor(e.target.value)}
                  className="h-9 w-12 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={embedColor}
                  onChange={(e) => setEmbedColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Judul Embed Pesan</label>
            <input
              type="text"
              value={embedTitle}
              onChange={(e) => setEmbedTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Deskripsi Pesan (Markdown)</label>
            <textarea
              rows={3}
              value={embedDesc}
              onChange={(e) => setEmbedDesc(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Feedback Status */}
          {statusMsg.text && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Dispatch Action */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={handleSendWebhook}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40 transition"
            >
              <Send className="h-4 w-4" />
              <span>Kirim Notifikasi ke Discord Sekarang</span>
            </button>

            <button
              type="button"
              onClick={handleCopyJson}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy JSON</span>
            </button>
          </div>
        </div>

        {/* Right Preview: Live Discord UI Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#313338] border border-slate-700/60 shadow-2xl space-y-3 font-sans">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Pratinjau Pesan Discord (Live Mock Preview):
            </span>

            {/* Discord Message Layout */}
            <div className="flex items-start gap-3 pt-2">
              <img
                src={avatarUrl}
                alt="Bot Avatar"
                className="h-10 w-10 rounded-full object-cover shrink-0"
              />

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{botName}</span>
                  <span className="px-1 py-0.2 rounded bg-[#5865f2] text-white text-[9px] font-bold uppercase">
                    BOT
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Hari ini pukul 12:45</span>
                </div>

                {/* Discord Embed Container */}
                <div
                  className="rounded-lg bg-[#2b2d31] p-4 text-xs space-y-2.5 border-l-4 shadow-md"
                  style={{ borderLeftColor: embedColor }}
                >
                  <h5 className="font-bold text-white text-sm hover:underline cursor-pointer">
                    {embedTitle}
                  </h5>

                  <p className="text-slate-300 text-xs whitespace-pre-line leading-relaxed">
                    {embedDesc}
                  </p>

                  {/* Embed Fields */}
                  {fields.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/60">
                      {fields.map((f, idx) => (
                        <div key={idx}>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">
                            {f.name}
                          </span>
                          <span className="text-xs font-semibold text-white block mt-0.5">
                            {f.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-[9px] text-slate-500 pt-1 font-mono flex items-center justify-between">
                    <span>GameVault OS • Universal Gaming Economy Suite</span>
                    <span>12:45 WIB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History Card */}
          {history.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-400 block text-[10px] uppercase">
                Riwayat Pengiriman Webhook Terakhir:
              </span>
              <div className="space-y-1.5">
                {history.slice(0, 3).map((h) => (
                  <div
                    key={h.id}
                    className="p-2 rounded-xl bg-slate-950 flex items-center justify-between text-[11px]"
                  >
                    <span className="truncate max-w-[200px] text-slate-200">{h.title}</span>
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                        h.status === 'SUCCESS' ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'
                      }`}
                    >
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
