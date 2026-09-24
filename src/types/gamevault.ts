export type GtCategory = 'FARMABLE' | 'BUILDING' | 'SPECIAL' | 'CONSUMABLE';

export interface GtSeed {
  id: string;
  name: string;
  tier: number;
  rarity: number;
  growthTimeSeconds: number; // in seconds
  growthTimeString: string;
  gemYieldPerTree: number; // avg gems per harvested tree
  seedDropRate: number; // avg seeds returned per tree
  category: GtCategory;
  spliceRecipe: {
    seedA: string;
    seedB: string;
  } | null;
  baseColor: string;
  description: string;
}

export interface HarvestBatch {
  id: string;
  seedId: string;
  seedName: string;
  worldName: string;
  treeCount: number;
  plantedAt: string; // ISO date
  readyAt: string; // ISO date
  status: 'GROWING' | 'READY' | 'HARVESTED';
  estimatedGems: number;
  estimatedSeeds: number;
  notes?: string;
  webhookSent?: boolean;
}

export interface WebhookConfig {
  webhookUrl: string;
  botName: string;
  avatarUrl: string;
  autoPingHarvest: boolean;
}

export interface VaultSettings {
  soundEnabled: boolean;
  growtopiaDiscordWebhook?: string;
  robloxDevExRateUsd: number; // $0.0035 per Robux standard
  usdToIdrRate: number; // e.g. 16250 IDR per USD
}

export type RobloxAssetType = 'CLASSIC_CLOTHING' | 'UGC_ACCESSORY' | 'GAMEPASS' | 'DEV_PRODUCT';

export interface ArbitrageItem {
  id: string;
  name: string;
  game: 'GROWTOPIA' | 'ROBLOX' | 'STEAM';
  buyLocation: string; // e.g. "World BUYGEMS / Trade Hangout"
  buyPrice: number;
  sellLocation: string; // e.g. "World SELLGEMS / Rolimon's"
  sellPrice: number;
  taxRatePercent: number; // 0% or 30%
  unitName: string; // "WL", "DL", "Robux"
  trend: 'BULLISH' | 'BEARISH' | 'STABLE';
  weeklyChangePercent: number;
  notes?: string;
}

export interface DevExGoal {
  id: string;
  title: string;
  targetRobux: number;
  currentRobux: number;
  createdAt: string;
}
