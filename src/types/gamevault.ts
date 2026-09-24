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
    seedA: string; // seed name or id
    seedB: string;
  } | null;
  baseColor: string; // Tailwind color class or hex
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
  usdToIdrRate: number; // e.g. 16200 IDR per USD
}
