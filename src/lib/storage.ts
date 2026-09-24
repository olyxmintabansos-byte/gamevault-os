import { HarvestBatch, VaultSettings, ArbitrageItem, DevExGoal } from '@/types/gamevault';
import { INITIAL_HARVEST_BATCHES, DEFAULT_VAULT_SETTINGS } from './mock-seeds';
import { INITIAL_ARBITRAGE_ITEMS, INITIAL_DEVEX_GOALS } from './mock-arbitrage';

const STORAGE_KEYS = {
  BATCHES: 'gamevault_batches_v1',
  SETTINGS: 'gamevault_settings_v1',
  ARBITRAGE: 'gamevault_arbitrage_v1',
  DEVEX_GOALS: 'gamevault_devex_goals_v1',
};

export const StorageEngine = {
  getBatches(): HarvestBatch[] {
    if (typeof window === 'undefined') return INITIAL_HARVEST_BATCHES;
    const raw = localStorage.getItem(STORAGE_KEYS.BATCHES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(INITIAL_HARVEST_BATCHES));
      return INITIAL_HARVEST_BATCHES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_HARVEST_BATCHES;
    }
  },

  saveBatches(batches: HarvestBatch[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
    window.dispatchEvent(new Event('gamevault_batches_updated'));
  },

  getSettings(): VaultSettings {
    if (typeof window === 'undefined') return DEFAULT_VAULT_SETTINGS;
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_VAULT_SETTINGS));
      return DEFAULT_VAULT_SETTINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_VAULT_SETTINGS;
    }
  },

  saveSettings(settings: VaultSettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new Event('gamevault_settings_updated'));
  },

  getArbitrage(): ArbitrageItem[] {
    if (typeof window === 'undefined') return INITIAL_ARBITRAGE_ITEMS;
    const raw = localStorage.getItem(STORAGE_KEYS.ARBITRAGE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ARBITRAGE, JSON.stringify(INITIAL_ARBITRAGE_ITEMS));
      return INITIAL_ARBITRAGE_ITEMS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ARBITRAGE_ITEMS;
    }
  },

  saveArbitrage(items: ArbitrageItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ARBITRAGE, JSON.stringify(items));
    window.dispatchEvent(new Event('gamevault_arbitrage_updated'));
  },

  getDevExGoals(): DevExGoal[] {
    if (typeof window === 'undefined') return INITIAL_DEVEX_GOALS;
    const raw = localStorage.getItem(STORAGE_KEYS.DEVEX_GOALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DEVEX_GOALS, JSON.stringify(INITIAL_DEVEX_GOALS));
      return INITIAL_DEVEX_GOALS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEVEX_GOALS;
    }
  },

  saveDevExGoals(goals: DevExGoal[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.DEVEX_GOALS, JSON.stringify(goals));
    window.dispatchEvent(new Event('gamevault_devex_goals_updated'));
  },

  resetAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(INITIAL_HARVEST_BATCHES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_VAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.ARBITRAGE, JSON.stringify(INITIAL_ARBITRAGE_ITEMS));
    localStorage.setItem(STORAGE_KEYS.DEVEX_GOALS, JSON.stringify(INITIAL_DEVEX_GOALS));
    window.location.reload();
  },
};
