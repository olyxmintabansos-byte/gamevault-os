import { GtSeed, HarvestBatch, VaultSettings } from '@/types/gamevault';

export const GROWTOPIA_SEEDS: GtSeed[] = [
  {
    id: 'seed-chandelier',
    name: 'Chandelier',
    tier: 6,
    rarity: 70,
    growthTimeSeconds: 7 * 86400 + 2 * 3600, // 7d 2h
    growthTimeString: '7 Hari 2 Jam',
    gemYieldPerTree: 18.5,
    seedDropRate: 1.06,
    category: 'FARMABLE',
    spliceRecipe: {
      seedA: 'Crystal Block',
      seedB: 'Lava',
    },
    baseColor: 'from-amber-400 to-yellow-500',
    description: 'Pohon farmable kelas berat dengan hasil gems tertinggi per siklus harvest. Favorit para master farmer.',
  },
  {
    id: 'seed-laser-grid',
    name: 'Laser Grid',
    tier: 5,
    rarity: 50,
    growthTimeSeconds: 3 * 86400 + 2 * 3600, // 3d 2h
    growthTimeString: '3 Hari 2 Jam',
    gemYieldPerTree: 11.2,
    seedDropRate: 1.07,
    category: 'FARMABLE',
    spliceRecipe: {
      seedA: 'Glass Block',
      seedB: 'Carbon Wall',
    },
    baseColor: 'from-cyan-400 to-blue-600',
    description: 'Farmable paling stabil dan populer di pasar Growtopia. Siklus panen cepat 3 hari dengan rasio bibit balik tinggi.',
  },
  {
    id: 'seed-pepper-tree',
    name: 'Pepper Tree',
    tier: 4,
    rarity: 32,
    growthTimeSeconds: 1 * 86400 + 8 * 3600, // 1d 8h
    growthTimeString: '1 Hari 8 Jam',
    gemYieldPerTree: 5.8,
    seedDropRate: 1.08,
    category: 'FARMABLE',
    spliceRecipe: {
      seedA: 'Red Block',
      seedB: 'Rock',
    },
    baseColor: 'from-rose-500 to-red-600',
    description: 'Pohon farmable harian yang ideal untuk rotasi cepat harian dan farming gems pemula hingga menengah.',
  },
  {
    id: 'seed-fish-tank',
    name: 'Fish Tank',
    tier: 3,
    rarity: 24,
    growthTimeSeconds: 16 * 3600, // 16h
    growthTimeString: '16 Jam',
    gemYieldPerTree: 3.4,
    seedDropRate: 1.09,
    category: 'FARMABLE',
    spliceRecipe: {
      seedA: 'Water',
      seedB: 'Glass Block',
    },
    baseColor: 'from-teal-400 to-cyan-500',
    description: 'Pohon siklus cepat under 24 jam. Sangat mudah dipecahkan dan menghasilkan banyak gems harian.',
  },
  {
    id: 'seed-magic-bell',
    name: 'Magic Bell',
    tier: 4,
    rarity: 35,
    growthTimeSeconds: 1 * 86400 + 12 * 3600, // 1d 12h
    growthTimeString: '1 Hari 12 Jam',
    gemYieldPerTree: 6.4,
    seedDropRate: 1.08,
    category: 'FARMABLE',
    spliceRecipe: {
      seedA: 'Glass Block',
      seedB: 'Yellow Block',
    },
    baseColor: 'from-yellow-300 to-amber-400',
    description: 'Tanaman farmable alternatif dengan visual suara lonceng magis dan drop gems konstan.',
  },
  {
    id: 'seed-venus-guytrap',
    name: 'Venus Guytrap',
    tier: 4,
    rarity: 36,
    growthTimeSeconds: 1 * 86400 + 18 * 3600, // 1d 18h
    growthTimeString: '1 Hari 18 Jam',
    gemYieldPerTree: 6.9,
    seedDropRate: 1.07,
    category: 'FARMABLE',
    spliceRecipe: {
      seedA: 'Daisy',
      seedB: 'Dragon Gate',
    },
    baseColor: 'from-emerald-400 to-green-600',
    description: 'Pohon karnivora unik. Memberikan gems melimpah dan exp farming tinggi saat dipanen.',
  },
  {
    id: 'seed-pinball-bumper',
    name: 'Pinball Bumper',
    tier: 4,
    rarity: 30,
    growthTimeSeconds: 1 * 86400 + 4 * 3600, // 1d 4h
    growthTimeString: '1 Hari 4 Jam',
    gemYieldPerTree: 5.2,
    seedDropRate: 1.08,
    category: 'FARMABLE',
    spliceRecipe: {
      seedA: 'Steel',
      seedB: 'Glass Block',
    },
    baseColor: 'from-purple-400 to-indigo-600',
    description: 'Blok bouncing klasik. Efisien untuk farming gems dan populer untuk pembangunan arena arcade parkour.',
  },
  {
    id: 'seed-crystal-block',
    name: 'Crystal Block',
    tier: 5,
    rarity: 52,
    growthTimeSeconds: 3 * 86400 + 6 * 3600, // 3d 6h
    growthTimeString: '3 Hari 6 Jam',
    gemYieldPerTree: 12.0,
    seedDropRate: 1.05,
    category: 'BUILDING',
    spliceRecipe: {
      seedA: 'Glass Block',
      seedB: 'Portcullis',
    },
    baseColor: 'from-sky-300 to-blue-400',
    description: 'Induk bibit utama untuk persilangan pohon Chandelier.',
  },
  {
    id: 'seed-glass-block',
    name: 'Glass Block',
    tier: 2,
    rarity: 16,
    growthTimeSeconds: 3 * 3600 + 40 * 60, // 3h 40m
    growthTimeString: '3 Jam 40 Menit',
    gemYieldPerTree: 1.4,
    seedDropRate: 1.10,
    category: 'BUILDING',
    spliceRecipe: {
      seedA: 'Rock',
      seedB: 'Water',
    },
    baseColor: 'from-blue-200 to-cyan-300',
    description: 'Bahan dasar persilangan serbaguna untuk hampir semua farmable tier menengah.',
  },
];

export const INITIAL_HARVEST_BATCHES: HarvestBatch[] = [
  {
    id: 'batch-01',
    seedId: 'seed-laser-grid',
    seedName: 'Laser Grid',
    worldName: 'FARM_GRID_99',
    treeCount: 2640, // 1 Full World
    plantedAt: new Date(Date.now() - 2.5 * 86400 * 1000).toISOString(),
    readyAt: new Date(Date.now() + 14 * 3600 * 1000).toISOString(), // ~14h remaining
    status: 'GROWING',
    estimatedGems: 29568,
    estimatedSeeds: 2824,
    notes: 'Rotasi mingguan World 1 dengan Tractor + Harvester',
  },
  {
    id: 'batch-02',
    seedId: 'seed-pepper-tree',
    seedName: 'Pepper Tree',
    worldName: 'DAILY_PEPPER',
    treeCount: 1500,
    plantedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    readyAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // Ready now!
    status: 'READY',
    estimatedGems: 8700,
    estimatedSeeds: 1620,
    notes: 'Siap panen hari ini! Dapatkan minimal 8.700 gems',
  },
  {
    id: 'batch-03',
    seedId: 'seed-chandelier',
    seedName: 'Chandelier',
    worldName: 'CHAND_VAULT',
    treeCount: 2640,
    plantedAt: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
    readyAt: new Date(Date.now() + 3.1 * 86400 * 1000).toISOString(),
    status: 'GROWING',
    estimatedGems: 48840,
    estimatedSeeds: 2798,
    notes: 'Pohon Sultan, estimasi panen hari Minggu sore',
  },
];

export const DEFAULT_VAULT_SETTINGS: VaultSettings = {
  soundEnabled: true,
  growtopiaDiscordWebhook: '',
  robloxDevExRateUsd: 0.0035,
  usdToIdrRate: 16250,
};
