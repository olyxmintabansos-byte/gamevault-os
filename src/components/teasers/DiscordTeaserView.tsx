"use client";

import React, { useState } from 'react';
import { Bot, Send, CheckCircle2, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';

export const DiscordTeaserView: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [botName, setBotName] = useState('GameVault Alarm Bot');
  const [statusMsg, setStatusMsg] = useState<{ type: 'idle' | 'success' | 'error'; text: string }>({
    type: 'idle',
    text: '',
  });

  const handleTestWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      setStatusMsg({
        type: 'error',
        text: 'Format URL Webhook tidak valid! Harus berawalan https://discord.com/api/webhooks/...',
      });
      return;
    }

    try {
      setStatusMsg({ type: 'idle', text: 'Mengirim test embed ke Discord...' });
      const payload = {
        username: botName || 'GameVault Alarm Bot',
        avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop',
        embeds: [
          {
            title: '🌾 [GameVault Alert] Panen Pohon Chandelier Siap!',
            description: 'Pohon di world **CHANDFARM** telah matang dan siap dipanen!\n\nPerkiraan hasil: **+48.840 Gems** (~24 World Locks).',
            color: 3407718, // Emerald color code
            fields: [
              { name: 'World', value: 'CHANDFARM', inline: true },
              { name: 'Jumlah Pohon', value: '2.640 Trees', inline: true },
              { name: 'Status', value: 'READY TO HARVEST', inline: true },
            ],
            footer: {
              text: 'GameVault OS • Universal Gaming Economy Suite',
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatusMsg({
          type: 'success',
          text: '✅ Berhasil! Pesan embed GameVault telah terkirim ke channel Discord Anda!',
        });
      } else {
        setStatusMsg({
          type: 'error',
          text: `Gagal mengirim (HTTP ${res.status}). Pastikan webhook URL aktif dan tidak diblokir CORS.`,
        });
      }
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: `Error saat fetch client-side: ${err.message || 'Network error / CORS blocker'}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Discord Webhook Automation Studio</h3>
            <p className="text-xs text-slate-400">
              Integrasi webhook 100% client-side dari browser untuk mengirimkan notifikasi alarm panen dan laporan profit.
            </p>
          </div>
        </div>

        <form onSubmit={handleTestWebhook} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Discord Webhook URL *
            </label>
            <input
              type="url"
              required
              placeholder="https://discord.com/api/webhooks/1234567890/abcdefgh..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Nama Bot Pengirim (Custom Username)
            </label>
            <input
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

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

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold text-xs shadow-lg shadow-indigo-950/40 transition"
          >
            <Send className="h-4 w-4" />
            <span>Kirim Test Ping Webhook ke Discord</span>
          </button>
        </form>
      </div>
    </div>
  );
};
