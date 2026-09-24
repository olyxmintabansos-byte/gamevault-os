import { HarvestBatch, VaultSettings } from '@/types/gamevault';
import { INITIAL_HARVEST_BATCHES, DEFAULT_VAULT_SETTINGS } from './mock-seeds';

const STORAGE_KEYS = {
  BATCHES: 'gamevault_batches_v1',
  SETTINGS: 'gamevault_settings_v1',
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

  resetAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(INITIAL_HARVEST_BATCHES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_VAULT_SETTINGS));
    window.location.reload();
  },
};
