/**
 * 《方块世界 · 农场经营与交易》完整游戏核心引擎 V3.5
 */

// ==========================================
// 1. 基础配置字典
// ==========================================
const SEASONS = ['春', '夏', '秋', '冬'];
const WEATHERS = [
    { name: '晴朗', icon: '☀️', waterLoss: 18, growthMod: 1.05, rain: 0, pestRisk: 0.12 },
    { name: '多云', icon: '⛅', waterLoss: 10, growthMod: 1.0, rain: 0, pestRisk: 0.08 },
    { name: '阴雨', icon: '🌧️', waterLoss: 0, growthMod: 0.95, rain: 25, pestRisk: 0.05 },
    { name: '暴雨', icon: '⛈️', waterLoss: 0, growthMod: 0.85, rain: 60, pestRisk: 0.02 },
    { name: '干旱', icon: '🏜️', waterLoss: 30, growthMod: 0.70, rain: 0, pestRisk: 0.25 }
];

// 作物字典 (含标准图标)
const CROPS_CONFIG = {
    wheat: {
        id: 'wheat',
        name: '小麦',
        icon: '🌾',
        seedCost: 15,
        baseGrowthRate: 20,
        baseYield: 45,
        basePrice: 14.0,
        suitableSeasons: ['春', '秋'],
        waterNeed: 40,
        fertilizerNeed: 40,
        spoilDays: 45,
        color: '#d08770'
    },
    corn: {
        id: 'corn',
        name: '玉米',
        icon: '🌽',
        seedCost: 25,
        baseGrowthRate: 16,
        baseYield: 60,
        basePrice: 18.0,
        suitableSeasons: ['夏', '秋'],
        waterNeed: 50,
        fertilizerNeed: 50,
        spoilDays: 35,
        color: '#ebcb8b'
    },
    tomato: {
        id: 'tomato',
        name: '番茄',
        icon: '🍅',
        seedCost: 35,
        baseGrowthRate: 22,
        baseYield: 35,
        basePrice: 24.0,
        suitableSeasons: ['春', '夏'],
        waterNeed: 65,
        fertilizerNeed: 45,
        spoilDays: 14,
        color: '#bf616a'
    },
    strawberry: {
        id: 'strawberry',
        name: '草莓',
        icon: '🍓',
        seedCost: 60,
        baseGrowthRate: 14,
        baseYield: 22,
        basePrice: 52.0,
        suitableSeasons: ['春', '冬'],
        waterNeed: 60,
        fertilizerNeed: 70,
        spoilDays: 8,
        color: '#b48ead'
    },
    potato: {
        id: 'potato',
        name: '土豆',
        icon: '🥔',
        seedCost: 18,
        baseGrowthRate: 18,
        baseYield: 70,
        basePrice: 11.0,
        suitableSeasons: ['春', '秋', '冬'],
        waterNeed: 35,
        fertilizerNeed: 30,
        spoilDays: 60,
        color: '#d8dee9'
    }
,
    rice: { id:'rice', name:'水稻', icon:'🍚', seedCost:20, baseGrowthRate:15, baseYield:75, basePrice:16, suitableSeasons:['夏','秋'], waterNeed:70, fertilizerNeed:55, spoilDays:50, color:'#a3be8c' },
    soybean: { id:'soybean', name:'大豆', icon:'🫘', seedCost:22, baseGrowthRate:17, baseYield:55, basePrice:20, suitableSeasons:['夏','秋'], waterNeed:45, fertilizerNeed:50, spoilDays:70, color:'#d8dee9' },
    carrot: { id:'carrot', name:'胡萝卜', icon:'🥕', seedCost:16, baseGrowthRate:21, baseYield:50, basePrice:19, suitableSeasons:['春','秋','冬'], waterNeed:45, fertilizerNeed:35, spoilDays:35, color:'#d08770' },
    cucumber: { id:'cucumber', name:'黄瓜', icon:'🥒', seedCost:24, baseGrowthRate:23, baseYield:42, basePrice:23, suitableSeasons:['春','夏'], waterNeed:65, fertilizerNeed:45, spoilDays:12, color:'#a3be8c' },
    onion: { id:'onion', name:'洋葱', icon:'🧅', seedCost:17, baseGrowthRate:18, baseYield:58, basePrice:18, suitableSeasons:['春','秋'], waterNeed:40, fertilizerNeed:40, spoilDays:55, color:'#b48ead' },
    cabbage: { id:'cabbage', name:'卷心菜', icon:'🥬', seedCost:21, baseGrowthRate:16, baseYield:65, basePrice:21, suitableSeasons:['春','秋','冬'], waterNeed:55, fertilizerNeed:45, spoilDays:30, color:'#8fbcbb' },
    pumpkin: { id:'pumpkin', name:'南瓜', icon:'🎃', seedCost:28, baseGrowthRate:13, baseYield:90, basePrice:26, suitableSeasons:['夏','秋'], waterNeed:50, fertilizerNeed:55, spoilDays:90, color:'#d08770' },
    apple: { id:'apple', name:'苹果', icon:'🍎', seedCost:75, baseGrowthRate:10, baseYield:38, basePrice:65, suitableSeasons:['春','秋'], waterNeed:50, fertilizerNeed:60, spoilDays:25, color:'#bf616a' },
    grape: { id:'grape', name:'葡萄', icon:'🍇', seedCost:70, baseGrowthRate:12, baseYield:34, basePrice:72, suitableSeasons:['夏','秋'], waterNeed:55, fertilizerNeed:60, spoilDays:18, color:'#5e548e' },
    cotton: { id:'cotton', name:'棉花', icon:'🌿', seedCost:30, baseGrowthRate:14, baseYield:48, basePrice:38, suitableSeasons:['夏','秋'], waterNeed:45, fertilizerNeed:50, spoilDays:180, color:'#eceff4' },
    chili: { id:'chili', name:'辣椒', icon:'🌶️', seedCost:32, baseGrowthRate:20, baseYield:30, basePrice:46, suitableSeasons:['夏','秋'], waterNeed:60, fertilizerNeed:50, spoilDays:20, color:'#bf616a' },
    tea: { id:'tea', name:'茶叶', icon:'🍃', seedCost:85, baseGrowthRate:9, baseYield:25, basePrice:95, suitableSeasons:['春','秋'], waterNeed:55, fertilizerNeed:65, spoilDays:120, color:'#a3be8c' }
};

// 农副深加工字典
const PROCESSED_GOODS_CONFIG = {
    flour:{id:'flour',name:'优质面粉',icon:'🥡',input:{wheat:20},processDays:1,outputYield:18,basePrice:28,spoilDays:90},
    bread:{id:'bread',name:'烘焙面包',icon:'🍞',input:{flour:15},processDays:1,outputYield:15,basePrice:48,spoilDays:10},
    ketchup:{id:'ketchup',name:'浓缩番茄酱',icon:'🥫',input:{tomato:25},processDays:2,outputYield:20,basePrice:55,spoilDays:120},
    jam:{id:'jam',name:'手工草莓果酱',icon:'🍯',input:{strawberry:15},processDays:2,outputYield:12,basePrice:120,spoilDays:120},
    rice_flour:{id:'rice_flour',name:'精米粉',icon:'🥣',input:{rice:22},processDays:1,outputYield:19,basePrice:40,spoilDays:120},
    tofu:{id:'tofu',name:'鲜豆腐',icon:'🧈',input:{soybean:18},processDays:1,outputYield:16,basePrice:58,spoilDays:7},
    soy_oil:{id:'soy_oil',name:'大豆油',icon:'🫗',input:{soybean:28},processDays:2,outputYield:10,basePrice:110,spoilDays:180},
    cornmeal:{id:'cornmeal',name:'玉米粉',icon:'🌽',input:{corn:25},processDays:1,outputYield:22,basePrice:42,spoilDays:120},
    chips:{id:'chips',name:'香脆薯片',icon:'🥔',input:{potato:30},processDays:2,outputYield:20,basePrice:72,spoilDays:60},
    pickle:{id:'pickle',name:'酸黄瓜罐头',icon:'🥒',input:{cucumber:24},processDays:2,outputYield:18,basePrice:68,spoilDays:150},
    onion_powder:{id:'onion_powder',name:'洋葱粉',icon:'🧅',input:{onion:30},processDays:2,outputYield:12,basePrice:88,spoilDays:240},
    canned_veg:{id:'canned_veg',name:'精品什锦蔬菜罐头',icon:'🥫',input:{cabbage:20,carrot:15,onion:10},processDays:3,outputYield:35,basePrice:135,spoilDays:240},
    pumpkin_puree:{id:'pumpkin_puree',name:'南瓜泥',icon:'🥣',input:{pumpkin:30},processDays:2,outputYield:24,basePrice:82,spoilDays:120},
    apple_juice:{id:'apple_juice',name:'鲜榨苹果汁',icon:'🧃',input:{apple:25},processDays:2,outputYield:20,basePrice:145,spoilDays:30},
    grape_juice:{id:'grape_juice',name:'葡萄汁',icon:'🍇',input:{grape:24},processDays:2,outputYield:18,basePrice:165,spoilDays:30},
    chili_sauce:{id:'chili_sauce',name:'辣椒酱',icon:'🌶️',input:{chili:22},processDays:2,outputYield:16,basePrice:125,spoilDays:180},
    cotton_fabric:{id:'cotton_fabric',name:'精纺棉布',icon:'🧵',input:{cotton:28},processDays:3,outputYield:20,basePrice:190,spoilDays:365},
    tea_pack:{id:'tea_pack',name:'精品茶叶礼盒',icon:'🍵',input:{tea:20},processDays:3,outputYield:12,basePrice:260,spoilDays:365},
    veggie_crate:{id:'veggie_crate',name:'精品蔬菜礼盒',icon:'🥗',input:{cabbage:12,carrot:10,cucumber:8},processDays:2,outputYield:24,basePrice:120,spoilDays:20}
};

// 杂货特许商店道具与种子字典
const SUPPLIES_CONFIG = {
    tools: [
        { id: 'water_bucket', name: '高能灌溉水剂', icon: '🪣', price: 6, desc: '用于灌溉地块 (+40%土壤水分)', itemType: 'tool' },
        { id: 'fertilizer_pack', name: '有机复合营养肥', icon: '🧪', price: 25, desc: '用于地块追肥 (+35土壤肥力)', itemType: 'tool' },
        { id: 'weed_tool', name: '强效除草制剂', icon: '🌿', price: 10, desc: '拔除杂草消除争养惩罚', itemType: 'tool' },
        { id: 'pest_spray', name: '生物广谱植保液', icon: '🧴', price: 18, desc: '扑灭虫害避免品质减产', itemType: 'tool' }
    ],
    seeds: [
        { id: 'seed_wheat', cropId: 'wheat', name: '小麦良种', icon: '🌾', price: 15, desc: '春秋季适宜，生长稳健', itemType: 'seed' },
        { id: 'seed_corn', cropId: 'corn', name: '玉米良种', icon: '🌽', price: 25, desc: '夏秋适宜，单季产量极高', itemType: 'seed' },
        { id: 'seed_tomato', cropId: 'tomato', name: '番茄良种', icon: '🍅', price: 35, desc: '水肥要求高，周期短溢价佳', itemType: 'seed' },
        { id: 'seed_strawberry', cropId: 'strawberry', name: '红颜草莓良种', icon: '🍓', price: 60, desc: '高附加值精品作物', itemType: 'seed' },
        { id: 'seed_potato', cropId: 'potato', name: '脱毒土豆种薯', icon: '🥔', price: 18, desc: '耐寒耐旱，长久储藏首选', itemType: 'seed' },
        { id: 'seed_rice', cropId: 'rice', name: '水稻良种', icon: '🍚', price: 20, desc: '新品种，可参与更丰富的产业链经营', itemType: 'seed' },
        { id: 'seed_soybean', cropId: 'soybean', name: '大豆良种', icon: '🫘', price: 22, desc: '新品种，可参与更丰富的产业链经营', itemType: 'seed' },
        { id: 'seed_carrot', cropId: 'carrot', name: '胡萝卜良种', icon: '🥕', price: 16, desc: '新品种，可参与更丰富的产业链经营', itemType: 'seed' },
        { id: 'seed_cucumber', cropId: 'cucumber', name: '黄瓜良种', icon: '🥒', price: 24, desc: '新品种，可参与更丰富的产业链经营', itemType: 'seed' },
        { id: 'seed_onion', cropId: 'onion', name: '洋葱良种', icon: '🧅', price: 17, desc: '新品种，可参与更丰富的产业链经营', itemType: 'seed' },
        { id: 'seed_cabbage', cropId: 'cabbage', name: '卷心菜良种', icon: '🥬', price: 21, desc: '新品种，可参与更丰富的产业链经营', itemType: 'seed' },
        { id: 'seed_pumpkin', cropId: 'pumpkin', name: '南瓜良种', icon: '🎃', price: 28, desc: '新品种，可参与更丰富的产业链经营', itemType: 'seed' },
        { id: 'seed_apple', cropId: 'apple', name: '苹果良种', icon: '🍎', price: 75, desc: '新品种，可参与更丰富的产业链经营', itemType: 'seed' },
        { id: 'seed_grape', cropId: 'grape', name: '葡萄良种', icon: '🍇', price: 70, desc: '新品种，可参与更丰富的产业链经营', itemType: 'seed' },
        { id: 'seed_cotton', cropId: 'cotton', name: '棉花良种', icon: '🌿', price: 30, desc: '新品种，可参与更丰富的产业链经营', itemType: 'seed' },
        { id: 'seed_chili', cropId: 'chili', name: '辣椒良种', icon: '🌶️', price: 32, desc: '新品种，可参与更丰富的产业链经营', itemType: 'seed' },
        { id: 'seed_tea', cropId: 'tea', name: '茶叶良种', icon: '🍃', price: 85, desc: '新品种，可参与更丰富的产业链经营', itemType: 'seed' }
    ]
};

// 交易市场配置
const MARKETS_CONFIG = [
    {
        id: 'local',
        name: '本地农贸集市',
        description: '价格平稳，成交量越大对价格影响越明显',
        volatility: 0.08,
        transportCostRate: 0.0,
        bookLevels: 10,
        depthScale: 0.55,   // 挂单量较小
        spreadScale: 1.15,
        crossImpact: 0.35   // 对其他市场传导强度
    },
    {
        id: 'city',
        name: '省城大宗批发大市场',
        description: '需求体量大，供需价格弹性适中，收取5%运费',
        volatility: 0.16,
        transportCostRate: 0.05,
        bookLevels: 10,
        depthScale: 1.35,   // 深度厚
        spreadScale: 0.9,
        crossImpact: 0.7
    },
    {
        id: 'port',
        name: '远洋国际商贸物产港',
        description: '全球事件驱动，价格剧烈震荡，成交冲击明显，收取15%远洋运费',
        volatility: 0.28,
        transportCostRate: 0.15,
        bookLevels: 10,
        depthScale: 1.0,
        spreadScale: 1.35,  // 价差更宽
        crossImpact: 0.85
    },
    {
        id: 'factory',
        name: '绿色深加工产业园',
        description: '加工企业需求驱动，品质越高溢价越明显，收取4%运费',
        volatility: 0.10,
        transportCostRate: 0.04,
        bookLevels: 10,
        depthScale: 0.8,
        spreadScale: 1.0,
        crossImpact: 0.5
    }
];

// 扩建升级配置 (分类：land/warehouse/automation)
const UPGRADES_CONFIG = [
    // 农田扩建：从32块起步，最终可扩到1000块
    { id: 'land_expand_1', category: 'land', name: '第二期良田建设 (+40地块)', cost: 2500, value: 40, unlocked: false },
    { id: 'land_expand_2', category: 'land', name: '第三期规模化农场 (+40地块)', cost: 6500, value: 40, unlocked: false },
    { id: 'land_expand_3', category: 'land', name: '标准化农业园区 (+40地块)', cost: 12000, value: 40, unlocked: false },
    { id: 'land_expand_4', category: 'land', name: '机械化农场一期 (+40地块)', cost: 22000, value: 40, unlocked: false },
    { id: 'land_expand_5', category: 'land', name: '机械化农场二期 (+40地块)', cost: 38000, value: 40, unlocked: false },
    { id: 'land_expand_6', category: 'land', name: '智慧农业基地 (+40地块)', cost: 60000, value: 40, unlocked: false },
    { id: 'land_expand_7', category: 'land', name: '区域农业综合体 (+100地块)', cost: 100000, value: 100, unlocked: false },
    { id: 'land_expand_8', category: 'land', name: '现代农业示范区 (+100地块)', cost: 160000, value: 100, unlocked: false },
    { id: 'land_expand_9', category: 'land', name: '大型农业产业园 (+100地块)', cost: 260000, value: 100, unlocked: false },
    { id: 'land_expand_10', category: 'land', name: '国家现代农场一期 (+100地块)', cost: 420000, value: 100, unlocked: false },
    { id: 'land_expand_11', category: 'land', name: '国家现代农场二期 (+100地块)', cost: 680000, value: 100, unlocked: false },
    { id: 'land_expand_12', category: 'land', name: '超大型农业基地 (+100地块)', cost: 1100000, value: 100, unlocked: false },
    { id: 'land_expand_13', category: 'land', name: '全国农业供应中心 (+100地块)', cost: 1800000, value: 100, unlocked: false },
    { id: 'land_expand_14', category: 'land', name: '超级农业集团核心农场 (+28地块)', cost: 3000000, value: 28, unlocked: false },

    // 深加工厂等级：生产线、批量、速度和产能一起成长
    { id: 'workshop_level_2', category: 'automation', name: '加工厂 Lv.2（+1产线、单批×2、速度+10%）', cost: 9000, workshopLevel: 2, unlocked: false },
    { id: 'workshop_level_3', category: 'automation', name: '加工厂 Lv.3（+1产线、单批×3、速度+15%）', cost: 18000, workshopLevel: 3, unlocked: false },
    { id: 'workshop_level_4', category: 'automation', name: '加工厂 Lv.4（+1产线、单批×4、速度+20%）', cost: 35000, workshopLevel: 4, unlocked: false },
    { id: 'workshop_level_5', category: 'automation', name: '加工厂 Lv.5（+1产线、单批×6、速度+25%）', cost: 70000, workshopLevel: 5, unlocked: false },
    { id: 'workshop_level_6', category: 'automation', name: '加工厂 Lv.6（+1产线、单批×8、速度+30%）', cost: 140000, workshopLevel: 6, unlocked: false },
    { id: 'workshop_level_7', category: 'automation', name: '加工厂 Lv.7（+2产线、单批×10、速度+35%）', cost: 280000, workshopLevel: 7, unlocked: false },
    { id: 'workshop_level_8', category: 'automation', name: '加工厂 Lv.8（+2产线、单批×14、速度+40%）', cost: 550000, workshopLevel: 8, unlocked: false },

    // 仓库扩建
    { id: 'wh_expand_1', category: 'warehouse', name: '仓储扩容 I (+600kg, +6格)', cost: 2000, value: { weight: 600, slots: 6 }, unlocked: false },
    { id: 'wh_expand_2', category: 'warehouse', name: '仓储扩容 II (+1500kg, +12格)', cost: 5500, value: { weight: 1500, slots: 12 }, unlocked: false },
    { id: 'wh_expand_3', category: 'warehouse', name: '大型综合立体库 (+4000kg, +20格)', cost: 14000, value: { weight: 4000, slots: 20 }, unlocked: false },
    { id: 'wh_expand_4', category: 'warehouse', name: '区域配送中心 (+10000kg, +25格)', cost: 30000, value: { weight: 10000, slots: 25 }, unlocked: false },
    { id: 'wh_expand_5', category: 'warehouse', name: '现代化粮食仓储园 (+25000kg, +35格)', cost: 65000, value: { weight: 25000, slots: 35 }, unlocked: false },
    { id: 'wh_expand_6', category: 'warehouse', name: '大型农产品物流仓 (+50000kg, +45格)', cost: 130000, value: { weight: 50000, slots: 45 }, unlocked: false },
    { id: 'wh_expand_7', category: 'warehouse', name: '省级冷链仓储基地 (+100000kg, +60格)', cost: 260000, value: { weight: 100000, slots: 60 }, unlocked: false },
    { id: 'wh_expand_8', category: 'warehouse', name: '国家级综合仓储中心 (+180000kg, +80格)', cost: 520000, value: { weight: 180000, slots: 80 }, unlocked: false },
    { id: 'wh_expand_9', category: 'warehouse', name: '超大型农产物流枢纽 (+300000kg, +100格)', cost: 1100000, value: { weight: 300000, slots: 100 }, unlocked: false },
    { id: 'wh_expand_10', category: 'warehouse', name: '全国农业供应链总仓 (+328300kg, +120格)', cost: 2200000, value: { weight: 328300, slots: 120 }, unlocked: false },
    { id: 'cold_storage', category: 'warehouse', name: '恒温保鲜冷库 (减少70%品质衰变损耗)', cost: 6000, value: 0.7, unlocked: false },

    // 自动化四项常规工人
    { id: 'auto_water', category: 'automation', name: '智能灌溉工人 (蓝色小人·消耗🪣水剂)', cost: 3500, workerType: 'water', unlocked: false },
    { id: 'auto_weed', category: 'automation', name: '全自动除草工人 (绿色小人·消耗🌿除草剂)', cost: 3000, workerType: 'weed', unlocked: false },
    { id: 'auto_fertilize', category: 'automation', name: '智能配方施肥工人 (橙色小人·消耗🧪肥料)', cost: 5000, workerType: 'fertilize', unlocked: false },
    { id: 'auto_pest', category: 'automation', name: '智能植保除虫工人 (红色小人·消耗🧴农药)', cost: 4500, workerType: 'pest', unlocked: false },

    // 自动种植小人 (1 - 5)
    { id: 'planter_worker_1', category: 'automation', name: '自动种植小人 #1 (紫色·策略播种)', cost: 4000, workerType: 'planter', planterIndex: 1, unlocked: false },
    { id: 'planter_worker_2', category: 'automation', name: '自动种植小人 #2 (紫色·策略播种)', cost: 7000, workerType: 'planter', planterIndex: 2, unlocked: false },
    { id: 'planter_worker_3', category: 'automation', name: '自动种植小人 #3 (紫色·策略播种)', cost: 12000, workerType: 'planter', planterIndex: 3, unlocked: false },
    { id: 'planter_worker_4', category: 'automation', name: '自动种植小人 #4 (紫色·策略播种)', cost: 18000, workerType: 'planter', planterIndex: 4, unlocked: false },
    { id: 'planter_worker_5', category: 'automation', name: '自动种植小人 #5 (紫色·策略播种)', cost: 25000, workerType: 'planter', planterIndex: 5, unlocked: false },

    // 自动收割小人 (1 - 5)
    { id: 'harvester_worker_1', category: 'automation', name: '自动收割小人 #1 (金黄·巡查成熟采收)', cost: 4500, workerType: 'harvester', harvesterIndex: 1, unlocked: false },
    { id: 'harvester_worker_2', category: 'automation', name: '自动收割小人 #2 (金黄·巡查成熟采收)', cost: 8000, workerType: 'harvester', harvesterIndex: 2, unlocked: false },
    { id: 'harvester_worker_3', category: 'automation', name: '自动收割小人 #3 (金黄·巡查成熟采收)', cost: 13500, workerType: 'harvester', harvesterIndex: 3, unlocked: false },
    { id: 'harvester_worker_4', category: 'automation', name: '自动收割小人 #4 (金黄·巡查成熟采收)', cost: 20000, workerType: 'harvester', harvesterIndex: 4, unlocked: false },
    { id: 'harvester_worker_5', category: 'automation', name: '自动收割小人 #5 (金黄·巡查成熟采收)', cost: 28000, workerType: 'harvester', harvesterIndex: 5, unlocked: false },

    // 设施基建
    { id: 'greenhouse', category: 'automation', name: '智能高透光温室系统 (免疫反季节负修正)', cost: 12000, unlocked: false },
    { id: 'workshop_expand', category: 'automation', name: '深加工生产线扩建 (+1加工槽位)', cost: 4500, unlocked: false }
];

// ==========================================
// 2. 游戏核心状态引擎
// ==========================================
class GameEngine {
    constructor() {
        this.saveVersion = 5.0;
        this.dayDurationRealSec = 30;
        this.multiAgentMarket = null;
        this.currentSpotKlineInterval = '1s';
        this.currentFutKlineInterval = '1s';
        this._lastChartDrawKey = '';
        this.timerInterval = null;
        this.animFrameId = null;
        this.canvas = null;
        this.ctx = null;
        this.selectedPlotIndex = -1;
        this.currentExpansionSubTab = 'land';
        this.currentSuppliesTab = 'tools';
        this.currentConfiguringPlanterIndex = null;
        this.currentConfiguringHarvesterIndex = null;
        this.currentSpotCategory = 'agri';
        this.currentSpotProductId = { agri: 'wheat', goods: null };
        this.currentFutureProductId = 'wheat';
        this.farmPage = 0;
        this.farmPageSize = 48;
        this.isAdminUnlocked = false;
        this.plotLayout = [];

        // 动态自动化工人队列
        this.workers = [];

        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            time: {
                year: 1,
                seasonIndex: 0,
                day: 1,
                hour: 8,
                minute: 0,
                totalDaysPassed: 1,
                lastRealTimestamp: Date.now()
            },
            cash: 5000,
            weather: WEATHERS[0],
            weatherForecast: [WEATHERS[0], WEATHERS[1], WEATHERS[2]],
            plots: this.createInitialPlots(1000, 8),
            warehouse: {
                maxWeight: 600,
                maxSlots: 14,
                capacityUpgradeCap: 1000000,
                items: [
                    { id: 'init_item_1', cropId: 'water_bucket', quantity: 20, qualityScore: 80, qualityGrade: '标准', storedDay: 1, reservedForContract: 0 },
                    { id: 'init_item_2', cropId: 'fertilizer_pack', quantity: 10, qualityScore: 80, qualityGrade: '标准', storedDay: 1, reservedForContract: 0 },
                    { id: 'init_item_3', cropId: 'weed_tool', quantity: 15, qualityScore: 80, qualityGrade: '标准', storedDay: 1, reservedForContract: 0 },
                    { id: 'init_item_4', cropId: 'pest_spray', quantity: 10, qualityScore: 80, qualityGrade: '标准', storedDay: 1, reservedForContract: 0 },
                    { id: 'init_seed_1', cropId: 'seed_wheat', quantity: 12, qualityScore: 80, qualityGrade: '标准', storedDay: 1, reservedForContract: 0 },
                    { id: 'init_seed_2', cropId: 'seed_corn', quantity: 8, qualityScore: 80, qualityGrade: '标准', storedDay: 1, reservedForContract: 0 }
                ]
            },
            markets: this.createInitialMarkets(),
            futures: {
                available: [],
                holdings: [],
                quotes: {},
                positions: [],
                cashSettlement: 0
            },
            orders: [],
            workshop: {
                level: 1,
                maxSlots: 1,
                batchSize: 1,
                speedMultiplier: 1,
                efficiency: 1,
                runningLines: []
            },
            upgrades: JSON.parse(JSON.stringify(UPGRADES_CONFIG)),
            // 工人等级与管辖策略
            workerUpgrades: {
                water: { level: 1 },
                weed: { level: 1 },
                fertilize: { level: 1 },
                pest: { level: 1 },
                planter_1: { level: 1, assignedCrop: 'wheat', assignedRows: 'all' },
                planter_2: { level: 1, assignedCrop: 'corn', assignedRows: 'all' },
                planter_3: { level: 1, assignedCrop: 'tomato', assignedRows: 'all' },
                planter_4: { level: 1, assignedCrop: 'strawberry', assignedRows: 'all' },
                planter_5: { level: 1, assignedCrop: 'potato', assignedRows: 'all' },
                harvester_1: { level: 1, assignedRows: 'all' },
                harvester_2: { level: 1, assignedRows: 'all' },
                harvester_3: { level: 1, assignedRows: 'all' },
                harvester_4: { level: 1, assignedRows: 'all' },
                harvester_5: { level: 1, assignedRows: 'all' }
            },
            finance: {
                totalRevenue: 0,
                totalExpense: 0,
                yesterdayStorageCost: 0
            },
            logs: [],
            news: [],
            marketFactors: {},
            progression: { level: 1, xp: 0, xpToNext: 500, daily: { harvested: 0, sold: 0, processed: 0, orders: 0 }, lifetime: { harvested: 0, sold: 0, processed: 0, orders: 0, upgrades: 0 }, dailyTasks: [], achievements: [], event: null }
        };
    }

    createInitialPlots(total, initialUnlocked) {
        const plots = [];
        for (let i = 0; i < total; i++) {
            plots.push({
                id: i,
                unlocked: i < initialUnlocked,
                crop: null,
                soilFertility: 80,
                soilWater: 60,
                weeds: 0,
                pests: 0,
                consecutiveCropsCount: 0,
                lastHarvestedCropId: null
            });
        }
        return plots;
    }

    isSupplyItem(itemId) {
        return !!SUPPLIES_CONFIG.tools.find(x => x.id === itemId) || !!SUPPLIES_CONFIG.seeds.find(x => x.id === itemId);
    }

    getSupplyDef(itemId) {
        return SUPPLIES_CONFIG.tools.find(x => x.id === itemId) || SUPPLIES_CONFIG.seeds.find(x => x.id === itemId) || null;
    }

    getMarketProductConfig(prodId) {
        return CROPS_CONFIG[prodId] || PROCESSED_GOODS_CONFIG[prodId] || this.getSupplyDef(prodId);
    }

    getAllMarketProductIds() {
        return Object.keys(CROPS_CONFIG).concat(Object.keys(PROCESSED_GOODS_CONFIG), SUPPLIES_CONFIG.tools.map(x => x.id), SUPPLIES_CONFIG.seeds.map(x => x.id));
    }

    getMarketCategory(prodId) {
        return CROPS_CONFIG[prodId] ? 'agri' : 'goods';
    }

    getMarketUnit(prodId) {
        return this.isSupplyItem(prodId) ? '件' : 'kg';
    }

    createInitialMarkets() {
        const data = {};
        const allProducts = this.getAllMarketProductIds();

        MARKETS_CONFIG.forEach(m => {
            data[m.id] = {
                klineHistory: {},
                currentPrices: {},
                yesterdayPrices: {},
                quotasLeft: {},
                status: {},
                demandPressure: {},
                supplyPressure: {},
                dailyBuyVolume: {},
                dailySellVolume: {},
                rejectReason: {},
                trendBias: {},
                volatilityBoost: {}
            };

            allProducts.forEach(prodId => {
                const cfg = this.getMarketProductConfig(prodId);
                const base = cfg.basePrice || cfg.price;
                const klines = [];
                let prevClose = base;

                for (let d = 30; d >= 1; d--) {
                    const open = prevClose;
                    const changePercent = (Math.random() - 0.49) * (m.volatility * 1.5);
                    const close = parseFloat(Math.max(2.0, open * (1 + changePercent)).toFixed(1));
                    const high = parseFloat((Math.max(open, close) + Math.random() * (open * 0.05)).toFixed(1));
                    const low = parseFloat(Math.max(1.0, Math.min(open, close) - Math.random() * (open * 0.05)).toFixed(1));

                    klines.push({ open, high, low, close, day: 31 - d });
                    prevClose = close;
                }

                data[m.id].klineHistory[prodId] = klines;
                data[m.id].currentPrices[prodId] = prevClose;
                data[m.id].marketCategory = data[m.id].marketCategory || {};
                data[m.id].marketCategory[prodId] = this.getMarketCategory(prodId);
                data[m.id].yesterdayPrices[prodId] = klines[klines.length - 2].close;
                data[m.id].quotasLeft[prodId] = Infinity;
                data[m.id].demandPressure[prodId] = 0;
                data[m.id].supplyPressure[prodId] = 0;
                data[m.id].dailyBuyVolume[prodId] = 0;
                data[m.id].dailySellVolume[prodId] = 0;
                data[m.id].status[prodId] = 'normal';
                data[m.id].rejectReason[prodId] = '正常流通收购中';
                data[m.id].trendBias[prodId] = 0;
                data[m.id].volatilityBoost[prodId] = 1;
            });
        });
        return data;
    }

    // ==========================================
    // 3. 游戏主循环生命周期
    // ==========================================
    init() {
        this.loadGame();
        if(!this.state.futures.quotes || Object.keys(this.state.futures.quotes).length===0) this.generateDailyFuturesContracts();
        this.checkOfflineProgress();
        this.setupCanvas();
        this.rebuildWorkers();
        this.bindEvents();
        this.updateUI();

        // 100ms 刷新一次显示/决策，实际游戏日流逝速度仍由 dayDurationRealSec 控制（默认30秒=1游戏日）
        const tickRateMs = 100;
        this.timerInterval = setInterval(() => {
            this.tick(tickRateMs / 1000);
        }, tickRateMs);

        let lastFrameTime = performance.now();
        const loop = (now) => {
            const dt = (now - lastFrameTime) / 1000;
            lastFrameTime = now;
            this.updateWorkers(dt);
            this.renderCanvas();
            this.animFrameId = requestAnimationFrame(loop);
        };
        this.animFrameId = requestAnimationFrame(loop);

        if (this.state.futures.available.length === 0) {
            this.generateDailyFuturesContracts();
        }
        if (this.state.orders.length === 0) {
            this.generateDailyOrders();
        }

        // 初始化多智能体虚拟交易市场（纯浏览器本地运行）
        try {
            this.multiAgentMarket = new MultiAgentMarket(this);
            this.multiAgentMarket.bootstrap(16); // 每市场约16个Agent，含做市商
            this.restoreLocalMarketRuntime();
            this.addLog('多智能体市场引擎已启动：' + this.multiAgentMarket.agents.length + ' 个虚拟交易者。');
        } catch (e) {
            console.warn('MultiAgentMarket init failed', e);
            this.addLog('多智能体市场引擎启动失败，回退为原价格引擎。');
        }
        this.addLog('方块农场引擎就绪：本地浏览器存档已激活。');
    }

    tick(secondsElapsed) {
        // 保持真实时间流逝速度不变：1 游戏日 = dayDurationRealSec 秒
        const minutesPerSecond = (24 * 60) / this.dayDurationRealSec;
        // 用浮点累计，避免 100ms 时 floor 导致分钟不前进
        if (this._minuteFrac == null) this._minuteFrac = 0;
        this._minuteFrac += secondsElapsed * minutesPerSecond;
        const wholeMin = Math.floor(this._minuteFrac);
        if (wholeMin > 0) {
            this.state.time.minute += wholeMin;
            this._minuteFrac -= wholeMin;
        }

        if (this.state.time.minute >= 60) {
            this.state.time.hour += Math.floor(this.state.time.minute / 60);
            this.state.time.minute = this.state.time.minute % 60;
        }

        if (this.state.time.hour >= 24) {
            this.state.time.hour = 0;
            this.progressNewDay();
        }

        // 现货/期货市场：与游戏日历完全解耦，每个 tick（100ms）独立撮合
        // 价格只来自真实成交，不做“先改价再假装成交”
        if (this.multiAgentMarket) {
            this.multiAgentMarket.tick(secondsElapsed);
        }

        // UI：只轻量刷新盘口数字，禁止每帧全量重绘（避免闪烁）
        if (this._lastMarketUiMs == null) this._lastMarketUiMs = 0;
        this._lastMarketUiMs += secondsElapsed * 1000;
        if (this._lastMarketUiMs >= 300) {
            this._lastMarketUiMs = 0;
            try { this.refreshMarketQuotesOnly(); } catch (e) {}
        }

        this.state.time.lastRealTimestamp = Date.now();
        this.updateTopBarUI();
    }

    progressNewDay() {
        this.state.time.day += 1;
        this.state.time.totalDaysPassed += 1;

        if (this.state.time.day > 30) {
            this.state.time.day = 1;
            this.state.time.seasonIndex = (this.state.time.seasonIndex + 1) % 4;
            if (this.state.time.seasonIndex === 0) {
                this.state.time.year += 1;
            }
            this.addLog(`季节轮替：已步入【${SEASONS[this.state.time.seasonIndex]}季】，请根据适宜性调整品种。`);
        }

        this.state.weather = this.state.weatherForecast.shift();
        const randWeather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
        this.state.weatherForecast.push(randWeather);

        this.processPlotsDailyGrowth();
        this.processWarehouseDaily();
        this.processWorkshopDaily();
        this.processMarketDailyPrices();
        this.processFuturesDailyCheck();
        this.processOrdersDailyCheck();
        this.processDailyEvent();
        this.resetDailyProgress();

        this.saveGame();
        this.updateUI();
        this.addLog(`第 ${this.state.time.totalDaysPassed} 天开始。天气：${this.state.weather.name}。`);
    }

    // ==========================================
    // 4. 自动化设施小人系统 (消耗物料、停工原因诊断、收割者)
    // ==========================================
    ensureProgression() {
        const p=this.state.progression || {};
        this.state.progression={level:p.level||1,xp:p.xp||0,xpToNext:p.xpToNext||500,
            daily:Object.assign({harvested:0,sold:0,processed:0,orders:0},p.daily||{}),
            lifetime:Object.assign({harvested:0,sold:0,processed:0,orders:0,upgrades:0},p.lifetime||{}),
            dailyTasks:Array.isArray(p.dailyTasks)?p.dailyTasks:[], achievements:Array.isArray(p.achievements)?p.achievements:[], event:p.event||null};
        if(!this.state.progression.dailyTasks.length)this.generateDailyTasks();
    }

    generateDailyTasks(){
        const p=this.state.progression; const types=[['harvested','收获农产品',120,120],['sold','完成现货销售',150,150],['processed','完成加工批次',2,220],['orders','完成订单',1,300]];
        p.dailyTasks=types.sort(()=>Math.random()-0.5).slice(0,3).map((t,i)=>({id:'task_'+Date.now()+'_'+i,type:t[0],name:t[1],target:t[2],reward:t[3],done:false}));
    }

    resetDailyProgress(){ this.ensureProgression(); this.state.progression.daily={harvested:0,sold:0,processed:0,orders:0}; this.generateDailyTasks(); }

    gainXP(amount,stat,delta=0){
        this.ensureProgression(); const p=this.state.progression;
        if(stat){p.daily[stat]=(p.daily[stat]||0)+delta; p.lifetime[stat]=(p.lifetime[stat]||0)+delta;}
        p.xp+=Math.max(0,amount);
        while(p.xp>=p.xpToNext){p.xp-=p.xpToNext;p.level+=1;p.xpToNext=Math.round(p.xpToNext*1.22);this.state.cash+=p.level*800;this.addLog(`🎉 农场经营等级提升至 Lv.${p.level}！获得发展奖励 ¥${(p.level*800).toLocaleString()}。`);window.soundEngine.playCoin();}
        this.checkAchievements();
    }

    checkAchievements(){
        this.ensureProgression(); const p=this.state.progression; const defs=[
            ['first_harvest','第一桶收成',p.lifetime.harvested>=1,500],['big_harvest','丰收达人',p.lifetime.harvested>=1000,3000],
            ['trader','市场玩家',p.lifetime.sold>=1000,5000],['factory','加工厂主',p.lifetime.processed>=10,6000],
            ['contractor','长期供应商',p.lifetime.orders>=5,8000],['builder','基建达人',p.lifetime.upgrades>=5,10000]
        ];
        defs.forEach(d=>{if(d[2]&&!p.achievements.includes(d[0])){p.achievements.push(d[0]);this.state.cash+=d[3];this.addLog(`🏆 成就解锁：${d[1]}，奖励 ¥${d[3].toLocaleString()}！`);}});
    }

    processDailyEvent(){
        this.ensureProgression();
        if(Math.random()>0.28){this.state.progression.event=null;return;}
        const events=[
            {title:'🌧️ 暴雨过境',desc:'天然降水让全部农田获得额外水分，但市场蔬菜运输受阻。',effect:()=>{this.state.plots.forEach(x=>x.soilWater=Math.min(100,x.soilWater+18));}},
            {title:'📈 城市餐饮旺季',desc:'餐饮需求激增，农产品与加工食品买盘短暂升温。',effect:()=>{Object.values(this.state.markets).forEach(m=>Object.keys(CROPS_CONFIG).forEach(id=>m.demandPressure[id]=Math.min(.25,(m.demandPressure[id]||0)+.05)));}},
            {title:'🚚 物流拥堵',desc:'跨城运输成本短期上升，远距离市场价格波动扩大。',effect:()=>{}},
            {title:'🌱 农业补贴',desc:'地方推出农业扶持补贴，本日经营现金奖励。',effect:()=>{this.state.cash+=3000;this.state.finance.totalRevenue+=3000;}},
            {title:'🐛 病虫害预警',desc:'虫害风险升高，请及时使用植保液或自动除虫。',effect:()=>{this.state.plots.forEach(x=>x.pests=Math.min(35,x.pests+10));}}
        ];
        const e=events[Math.floor(Math.random()*events.length)];e.effect();this.state.progression.event=e.title+'：'+e.desc;this.addLog(`📢 随机经营事件：${e.title}。${e.desc}`);this.addNews(e.title,e.desc);
    }

    renderProgressionUI(){
        this.ensureProgression(); const p=this.state.progression;
        const lv=document.getElementById('farm-level-val'); if(!lv)return;
        lv.innerText=`Lv.${p.level}`; document.getElementById('farm-xp-val').innerText=`${p.xp.toLocaleString()} / ${p.xpToNext.toLocaleString()} XP`;
        document.getElementById('farm-xp-bar').style.width=Math.min(100,p.xp/p.xpToNext*100)+'%';
        const event=document.getElementById('farm-event-box'); event.innerText=p.event||'今日暂无特殊事件，稳健经营也是一种策略。';
        const taskBox=document.getElementById('farm-task-list'); taskBox.innerHTML=p.dailyTasks.map(t=>{const v=p.daily[t.type]||0;const done=v>=t.target;return `<div class="farm-task ${done?'done':''}"><span>${done?'✅':'◻️'} ${t.name} ${Math.min(v,t.target)}/${t.target}</span><b>+¥${t.reward.toLocaleString()}</b></div>`}).join('');
        const ach=document.getElementById('farm-achievement-list'); const names={first_harvest:'第一桶收成',big_harvest:'丰收达人',trader:'市场玩家',factory:'加工厂主',contractor:'长期供应商',builder:'基建达人'}; ach.innerHTML=Object.entries(names).map(([id,n])=>`<span class="achievement-chip ${p.achievements.includes(id)?'unlocked':''}">${p.achievements.includes(id)?'🏆':'🔒'} ${n}</span>`).join('');
    }

    rebuildWorkers() {
        this.workers = [];
        const baseWorkers = [
            { type: 'water', upgradeId: 'auto_water', color: '#5e81ac', label: '浇水中', reqItem: 'water_bucket' },
            { type: 'weed', upgradeId: 'auto_weed', color: '#a3be8c', label: '除草中', reqItem: 'weed_tool' },
            { type: 'fertilize', upgradeId: 'auto_fertilize', color: '#ebcb8b', label: '施肥中', reqItem: 'fertilizer_pack' },
            { type: 'pest', upgradeId: 'auto_pest', color: '#bf616a', label: '驱虫中', reqItem: 'pest_spray' }
        ];

        let slotIndex = 0;
        baseWorkers.forEach(w => {
            if (this.isUpgradeUnlocked(w.upgradeId)) {
                const conf = this.state.workerUpgrades[w.type] || { level: 1 };
                const level = conf.level;
                const speed = 120 * (1 + (level - 1) * 0.35);
                const duration = Math.max(0.6, 2.2 / (1 + (level - 1) * 0.35));

                this.workers.push({
                    id: w.type,
                    type: w.type,
                    color: w.color,
                    label: w.label,
                    reqItem: w.reqItem,
                    level: level,
                    speed: speed,
                    workDuration: duration,
                    x: 25 + (slotIndex % 5) * 45,
                    y: 18 + Math.floor(slotIndex / 5) * 20,
                    targetX: 25 + (slotIndex % 5) * 45,
                    targetY: 18 + Math.floor(slotIndex / 5) * 20,
                    targetPlotIndex: -1,
                    state: 'idle',
                    idleReason: '待命中',
                    workTimer: 0,
                    bobAnim: Math.random() * Math.PI
                });
                slotIndex++;
            }
        });

        // 自动种植小人 (1 - 5)
        for (let i = 1; i <= 5; i++) {
            const pId = `planter_worker_${i}`;
            if (this.isUpgradeUnlocked(pId)) {
                const conf = this.state.workerUpgrades[`planter_${i}`] || { level: 1, assignedCrop: 'wheat', assignedRows: 'all' };
                const level = conf.level;
                const speed = 110 * (1 + (level - 1) * 0.35);
                const duration = Math.max(0.6, 2.4 / (1 + (level - 1) * 0.35));

                this.workers.push({
                    id: `planter_${i}`,
                    type: 'planter',
                    planterIndex: i,
                    color: '#b48ead',
                    label: `播种(${CROPS_CONFIG[conf.assignedCrop]?.name || '作物'})`,
                    assignedCrop: conf.assignedCrop,
                    assignedRows: conf.assignedRows,
                    level: level,
                    speed: speed,
                    workDuration: duration,
                    x: 25 + (slotIndex % 5) * 45,
                    y: 18 + Math.floor(slotIndex / 5) * 20,
                    targetX: 25 + (slotIndex % 5) * 45,
                    targetY: 18 + Math.floor(slotIndex / 5) * 20,
                    targetPlotIndex: -1,
                    state: 'idle',
                    idleReason: '待命中',
                    workTimer: 0,
                    bobAnim: Math.random() * Math.PI
                });
                slotIndex++;
            }
        }

        // 自动收割小人 (1 - 5)
        for (let i = 1; i <= 5; i++) {
            const hId = `harvester_worker_${i}`;
            if (this.isUpgradeUnlocked(hId)) {
                const conf = this.state.workerUpgrades[`harvester_${i}`] || { level: 1, assignedRows: 'all' };
                const level = conf.level;
                const speed = 115 * (1 + (level - 1) * 0.35);
                const duration = Math.max(0.6, 2.0 / (1 + (level - 1) * 0.35));

                this.workers.push({
                    id: `harvester_${i}`,
                    type: 'harvester',
                    harvesterIndex: i,
                    color: '#e5a440',
                    label: '采收中',
                    assignedRows: conf.assignedRows,
                    level: level,
                    speed: speed,
                    workDuration: duration,
                    x: 25 + (slotIndex % 5) * 45,
                    y: 18 + Math.floor(slotIndex / 5) * 20,
                    targetX: 25 + (slotIndex % 5) * 45,
                    targetY: 18 + Math.floor(slotIndex / 5) * 20,
                    targetPlotIndex: -1,
                    state: 'idle',
                    idleReason: '待命中',
                    workTimer: 0,
                    bobAnim: Math.random() * Math.PI
                });
                slotIndex++;
            }
        }
    }

    updateWorkers(dt) {
        if (!this.plotLayout || this.plotLayout.length === 0) return;

        this.workers.forEach(w => {
            w.bobAnim += dt * 6;

            if (w.state === 'idle') {
                let targetPlot = null;
                let reason = '待命中';

                if (w.type === 'water') {
                    const hasTool = this.getWarehouseItemCount(w.reqItem) > 0;
                    let foundDryPlot = false;

                    for (let layout of this.plotLayout) {
                        const plot = this.state.plots[layout.plotIndex];
                        if (!plot || !plot.unlocked) continue;
                        if (plot.soilWater < 50) {
                            foundDryPlot = true;
                            const isBusyByOther = this.workers.some(other => other !== w && other.targetPlotIndex === layout.plotIndex);
                            if (!isBusyByOther && hasTool) {
                                targetPlot = layout;
                                break;
                            }
                        }
                    }
                    if (!foundDryPlot) reason = '无缺水地块';
                    else if (!hasTool) reason = '缺少🪣水剂';
                } else if (w.type === 'weed') {
                    const hasTool = this.getWarehouseItemCount(w.reqItem) > 0;
                    let foundWeeds = false;

                    for (let layout of this.plotLayout) {
                        const plot = this.state.plots[layout.plotIndex];
                        if (!plot || !plot.unlocked) continue;
                        if (plot.weeds > 0) {
                            foundWeeds = true;
                            const isBusyByOther = this.workers.some(other => other !== w && other.targetPlotIndex === layout.plotIndex);
                            if (!isBusyByOther && hasTool) {
                                targetPlot = layout;
                                break;
                            }
                        }
                    }
                    if (!foundWeeds) reason = '田间无杂草';
                    else if (!hasTool) reason = '缺少🌿除草剂';
                } else if (w.type === 'fertilize') {
                    const hasTool = this.getWarehouseItemCount(w.reqItem) > 0;
                    let foundLowFert = false;

                    for (let layout of this.plotLayout) {
                        const plot = this.state.plots[layout.plotIndex];
                        if (!plot || !plot.unlocked) continue;
                        if (plot.soilFertility < 60) {
                            foundLowFert = true;
                            const isBusyByOther = this.workers.some(other => other !== w && other.targetPlotIndex === layout.plotIndex);
                            if (!isBusyByOther && hasTool) {
                                targetPlot = layout;
                                break;
                            }
                        }
                    }
                    if (!foundLowFert) reason = '养分充足';
                    else if (!hasTool) reason = '缺少🧪肥料';
                } else if (w.type === 'pest') {
                    const hasTool = this.getWarehouseItemCount(w.reqItem) > 0;
                    let foundPests = false;

                    for (let layout of this.plotLayout) {
                        const plot = this.state.plots[layout.plotIndex];
                        if (!plot || !plot.unlocked) continue;
                        if (plot.pests > 0) {
                            foundPests = true;
                            const isBusyByOther = this.workers.some(other => other !== w && other.targetPlotIndex === layout.plotIndex);
                            if (!isBusyByOther && hasTool) {
                                targetPlot = layout;
                                break;
                            }
                        }
                    }
                    if (!foundPests) reason = '田间无虫害';
                    else if (!hasTool) reason = '缺少🧴农药';
                } else if (w.type === 'planter') {
                    const seedItemId = `seed_${w.assignedCrop}`;
                    const hasSeed = this.getWarehouseItemCount(seedItemId) > 0;
                    const cropName = CROPS_CONFIG[w.assignedCrop]?.name || '作物';
                    let foundEmptyPlot = false;

                    for (let layout of this.plotLayout) {
                        const plot = this.state.plots[layout.plotIndex];
                        if (!plot || !plot.unlocked) continue;

                        if (!plot.crop && this.isPlotInAssignedRows(layout.plotIndex, w.assignedRows)) {
                            foundEmptyPlot = true;
                            const isBusyByOther = this.workers.some(other => other !== w && other.targetPlotIndex === layout.plotIndex);
                            if (!isBusyByOther && hasSeed) {
                                targetPlot = layout;
                                break;
                            }
                        }
                    }
                    if (!foundEmptyPlot) reason = '无空闲待播耕地';
                    else if (!hasSeed) reason = `缺少${cropName}良种`;
                } else if (w.type === 'harvester') {
                    const totalW = this.getWarehouseTotalWeight();
                    const isWarehouseFull = totalW >= this.state.warehouse.maxWeight || this.state.warehouse.items.length >= this.state.warehouse.maxSlots;
                    let foundMature = false;

                    for (let layout of this.plotLayout) {
                        const plot = this.state.plots[layout.plotIndex];
                        if (!plot || !plot.unlocked) continue;

                        if (plot.crop && plot.crop.stage === 'mature' && this.isPlotInAssignedRows(layout.plotIndex, w.assignedRows)) {
                            foundMature = true;
                            const isBusyByOther = this.workers.some(other => other !== w && other.targetPlotIndex === layout.plotIndex);
                            if (!isBusyByOther && !isWarehouseFull) {
                                targetPlot = layout;
                                break;
                            }
                        }
                    }
                    if (!foundMature) reason = '无成熟作物';
                    else if (isWarehouseFull) reason = '仓库满仓无法收割';
                }

                if (targetPlot) {
                    w.targetPlotIndex = targetPlot.plotIndex;
                    w.targetX = targetPlot.x + targetPlot.size / 2;
                    w.targetY = targetPlot.y + targetPlot.size / 2;
                    w.state = 'walking';
                    w.idleReason = '';
                } else {
                    w.idleReason = reason;
                }
            } else if (w.state === 'walking') {
                const dx = w.targetX - w.x;
                const dy = w.targetY - w.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const step = w.speed * dt;

                if (dist <= step || dist < 4) {
                    w.x = w.targetX;
                    w.y = w.targetY;
                    w.state = 'working';
                    w.workTimer = 0;
                } else {
                    w.x += (dx / dist) * step;
                    w.y += (dy / dist) * step;
                }
            } else if (w.state === 'working') {
                w.workTimer += dt;
                if (w.workTimer >= w.workDuration) {
                    const plot = this.state.plots[w.targetPlotIndex];
                    if (plot && plot.unlocked) {
                        if (w.type === 'water') {
                            if (this.consumeWarehouseItem(w.reqItem, 1)) {
                                plot.soilWater = Math.min(100, plot.soilWater + 40);
                                window.soundEngine.playWater();
                            }
                        } else if (w.type === 'weed') {
                            if (this.consumeWarehouseItem(w.reqItem, 1)) {
                                plot.weeds = 0;
                                window.soundEngine.playWeed();
                            }
                        } else if (w.type === 'fertilize') {
                            if (this.consumeWarehouseItem(w.reqItem, 1)) {
                                plot.soilFertility = Math.min(100, plot.soilFertility + 35);
                                window.soundEngine.playPlant();
                            }
                        } else if (w.type === 'pest') {
                            if (this.consumeWarehouseItem(w.reqItem, 1)) {
                                plot.pests = 0;
                                window.soundEngine.playPest();
                            }
                        } else if (w.type === 'planter') {
                            const seedItemId = `seed_${w.assignedCrop}`;
                            if (this.consumeWarehouseItem(seedItemId, 1)) {
                                this.plantCropInternal(w.targetPlotIndex, w.assignedCrop);
                                window.soundEngine.playPlant();
                            }
                        } else if (w.type === 'harvester') {
                            this.harvestPlot(w.targetPlotIndex);
                        }
                    }

                    w.targetPlotIndex = -1;
                    w.state = 'idle';
                    w.workTimer = 0;
                }
            }
        });
    }

    isPlotInAssignedRows(plotIndex, rowConfig) {
        const row = Math.floor(plotIndex / 4);
        if (rowConfig === 'all') return true;
        if (rowConfig === 'row_1_2' && (row === 0 || row === 1)) return true;
        if (rowConfig === 'row_3_4' && (row === 2 || row === 3)) return true;
        if (rowConfig === 'row_5_6' && (row === 4 || row === 5)) return true;
        if (rowConfig === 'row_7_8' && (row === 6 || row === 7)) return true;
        return false;
    }

    // ==========================================
    // 5. 农田地块生长与物料消耗判定
    // ==========================================
    processPlotsDailyGrowth() {
        const hasGreenhouse = this.isUpgradeUnlocked('greenhouse');

        this.state.plots.forEach(plot => {
            if (!plot.unlocked) return;

            plot.soilWater = Math.max(0, Math.min(100, plot.soilWater - this.state.weather.waterLoss + this.state.weather.rain));

            if (Math.random() < 0.22) {
                plot.weeds = Math.min(100, plot.weeds + Math.floor(Math.random() * 15 + 5));
            }
            if (Math.random() < this.state.weather.pestRisk) {
                plot.pests = Math.min(100, plot.pests + Math.floor(Math.random() * 20 + 8));
            }

            if (plot.crop) {
                const cropCfg = CROPS_CONFIG[plot.crop.cropId];

                const waterModifier = plot.soilWater >= cropCfg.waterNeed ? 1.20 : (plot.soilWater < 20 ? 0.75 : 0.90);
                const fertilityModifier = plot.soilFertility >= cropCfg.fertilizerNeed ? 1.15 : (plot.soilFertility < 30 ? 0.80 : 0.95);
                const weedModifier = plot.weeds > 40 ? 0.85 : 1.0;
                const pestModifier = plot.pests > 30 ? 0.80 : 1.0;
                const weatherModifier = this.state.weather.growthMod;

                const currentSeasonName = SEASONS[this.state.time.seasonIndex];
                const seasonFit = cropCfg.suitableSeasons.includes(currentSeasonName);
                const seasonModifier = seasonFit ? 1.10 : (hasGreenhouse ? 1.0 : 0.70);

                const totalGrowthSpeed = cropCfg.baseGrowthRate * waterModifier * fertilityModifier * weedModifier * pestModifier * weatherModifier * seasonModifier;
                plot.crop.growth += totalGrowthSpeed;

                if (plot.soilWater >= cropCfg.waterNeed && plot.weeds === 0 && plot.pests === 0) {
                    plot.crop.careScore = Math.min(100, plot.crop.careScore + 4);
                } else if (plot.pests > 40 || plot.soilWater < 15) {
                    plot.crop.careScore = Math.max(20, plot.crop.careScore - 5);
                }

                if (plot.crop.growth >= 100) {
                    if (plot.crop.stage !== 'mature') {
                        plot.crop.stage = 'mature';
                        plot.crop.harvestWaitDays = 0;
                        this.addLog(`地块 #${plot.id + 1} 的【${cropCfg.icon} ${cropCfg.name}】成熟！`);
                    } else {
                        plot.crop.harvestWaitDays += 1;
                        if (plot.crop.harvestWaitDays > 3) {
                            plot.crop.careScore = Math.max(10, plot.crop.careScore - 4);
                        }
                    }
                } else if (plot.crop.growth > 60) {
                    plot.crop.stage = 'fruiting';
                } else if (plot.crop.growth > 25) {
                    plot.crop.stage = 'sprout';
                } else {
                    plot.crop.stage = 'seed';
                }

                plot.soilFertility = Math.max(10, plot.soilFertility - 2);
            } else {
                plot.soilFertility = Math.min(95, plot.soilFertility + 1);
            }
        });
    }

    // 人工播种
    plantCrop(plotIndex, cropId) {
        const plot = this.state.plots[plotIndex];
        const seedItemId = `seed_${cropId}`;
        const seedCount = this.getWarehouseItemCount(seedItemId);

        if (seedCount <= 0) {
            window.soundEngine.playError();
            alert(`仓库中缺少【${CROPS_CONFIG[cropId].name}良种】！请前往杂货商店采购。`);
            return false;
        }

        if (!plot || !plot.unlocked || plot.crop) return false;

        this.consumeWarehouseItem(seedItemId, 1);
        this.plantCropInternal(plotIndex, cropId);
        window.soundEngine.playPlant();

        const cropCfg = CROPS_CONFIG[cropId];
        this.addLog(`人工播种：在地块 #${plot.id + 1} 播下【${cropCfg.icon} ${cropCfg.name}良种】。`);
        this.saveGame();
        this.updateUI();
        return true;
    }

    plantCropInternal(plotIndex, cropId) {
        const plot = this.state.plots[plotIndex];
        if (plot.lastHarvestedCropId === cropId) {
            plot.consecutiveCropsCount += 1;
            plot.soilFertility = Math.max(10, plot.soilFertility - 10);
        } else {
            plot.consecutiveCropsCount = 0;
            plot.soilFertility = Math.min(100, plot.soilFertility + 5);
        }

        plot.crop = {
            cropId: cropId,
            growth: 0,
            stage: 'seed',
            plantedDay: this.state.time.totalDaysPassed,
            careScore: 70,
            harvestWaitDays: 0
        };
    }

    harvestPlot(plotIndex) {
        const plot = this.state.plots[plotIndex];
        if (!plot || !plot.crop || plot.crop.stage !== 'mature') return;

        const cropCfg = CROPS_CONFIG[plot.crop.cropId];
        const soilModifier = 0.7 + (plot.soilFertility / 100) * 0.5;
        const qualityModifier = 0.8 + (plot.crop.careScore / 100) * 0.4;
        const randomYieldFactor = 0.95 + Math.random() * 0.1;
        const finalYield = Math.round(cropCfg.baseYield * soilModifier * qualityModifier * randomYieldFactor);
        const qualityGrade = this.getQualityGrade(plot.crop.careScore);

        const success = this.addWarehouseItem(cropCfg.id, finalYield, plot.crop.careScore, qualityGrade);
        if (!success) {
            window.soundEngine.playError();
            return;
        }

        window.soundEngine.playHarvest();
        plot.lastHarvestedCropId = plot.crop.cropId;
        plot.crop = null;

        this.gainXP(Math.round(finalYield*0.8),'harvested',finalYield);
        this.addLog(`采收成功：地块 #${plot.id + 1} 产出【${cropCfg.icon} ${cropCfg.name}】${finalYield} kg，品质：${qualityGrade}。`);
        this.saveGame();
        this.updateUI();
    }

    waterPlot(plotIndex) {
        const itemKey = 'water_bucket';
        if (this.getWarehouseItemCount(itemKey) <= 0) {
            window.soundEngine.playError();
            alert('仓库缺少【🪣 灌溉水剂】！请前往杂货商店购买。');
            return;
        }
        this.consumeWarehouseItem(itemKey, 1);
        window.soundEngine.playWater();
        const plot = this.state.plots[plotIndex];
        plot.soilWater = Math.min(100, plot.soilWater + 40);
        this.addLog(`地块 #${plotIndex + 1} 浇水完成。`);
        this.updateUI();
    }

    fertilizePlot(plotIndex) {
        const itemKey = 'fertilizer_pack';
        if (this.getWarehouseItemCount(itemKey) <= 0) {
            window.soundEngine.playError();
            alert('仓库缺少【🧪 有机复合营养肥】！请前往杂货商店购买。');
            return;
        }
        this.consumeWarehouseItem(itemKey, 1);
        window.soundEngine.playPlant();
        const plot = this.state.plots[plotIndex];
        plot.soilFertility = Math.min(100, plot.soilFertility + 35);
        this.addLog(`地块 #${plotIndex + 1} 施肥完成。`);
        this.updateUI();
    }

    weedPlot(plotIndex) {
        const itemKey = 'weed_tool';
        if (this.getWarehouseItemCount(itemKey) <= 0) {
            window.soundEngine.playError();
            alert('仓库缺少【🌿 强效除草制剂】！请前往杂货商店购买。');
            return;
        }
        this.consumeWarehouseItem(itemKey, 1);
        window.soundEngine.playWeed();
        const plot = this.state.plots[plotIndex];
        plot.weeds = 0;
        this.addLog(`地块 #${plotIndex + 1} 除草完成。`);
        this.updateUI();
    }

    pestControlPlot(plotIndex) {
        const itemKey = 'pest_spray';
        if (this.getWarehouseItemCount(itemKey) <= 0) {
            window.soundEngine.playError();
            alert('仓库缺少【🧴 生物广谱植保液】！请前往杂货商店购买。');
            return;
        }
        this.consumeWarehouseItem(itemKey, 1);
        window.soundEngine.playPest();
        const plot = this.state.plots[plotIndex];
        plot.pests = 0;
        this.addLog(`地块 #${plotIndex + 1} 驱虫完成。`);
        this.updateUI();
    }

    getQualityGrade(score) {
        if (score >= 90) return '特级';
        if (score >= 75) return '精品';
        if (score >= 50) return '优质';
        return '普通';
    }

    getQualityClass(grade) {
        switch (grade) {
            case '特级': return 'quality-epic';
            case '精品': return 'quality-rare';
            case '优质': return 'quality-good';
            default: return 'quality-normal';
        }
    }

    getItemIcon(itemId) {
        if (CROPS_CONFIG[itemId]) return CROPS_CONFIG[itemId].icon;
        if (PROCESSED_GOODS_CONFIG[itemId]) return PROCESSED_GOODS_CONFIG[itemId].icon;
        const tool = SUPPLIES_CONFIG.tools.find(t => t.id === itemId);
        if (tool) return tool.icon;
        const seed = SUPPLIES_CONFIG.seeds.find(s => s.id === itemId);
        if (seed) return seed.icon;
        return '📦';
    }

    getItemName(itemId) {
        if (CROPS_CONFIG[itemId]) return CROPS_CONFIG[itemId].name;
        if (PROCESSED_GOODS_CONFIG[itemId]) return PROCESSED_GOODS_CONFIG[itemId].name;
        const tool = SUPPLIES_CONFIG.tools.find(t => t.id === itemId);
        if (tool) return tool.name;
        const seed = SUPPLIES_CONFIG.seeds.find(s => s.id === itemId);
        if (seed) return seed.name;
        return itemId;
    }

    // ==========================================
    // 6. 仓储管理
    // ==========================================
    getWarehouseItemCount(cropId) {
        const items = this.state.warehouse.items.filter(it => it.cropId === cropId);
        return items.reduce((sum, it) => sum + (it.quantity - it.reservedForContract), 0);
    }

    consumeWarehouseItem(cropId, quantity) {
        const items = this.state.warehouse.items.filter(it => it.cropId === cropId);
        const total = items.reduce((sum, it) => sum + (it.quantity - it.reservedForContract), 0);
        if (total < quantity) return false;

        let remain = quantity;
        for (let it of items) {
            const free = it.quantity - it.reservedForContract;
            const take = Math.min(free, remain);
            it.quantity -= take;
            remain -= take;
            if (remain <= 0) break;
        }
        this.state.warehouse.items = this.state.warehouse.items.filter(it => it.quantity > 0);
        return true;
    }

    addWarehouseItem(cropId, quantity, qualityScore, qualityGrade) {
        const totalWeight = this.getWarehouseTotalWeight();
        const weightToAdd = (cropId.startsWith('seed_') || cropId.startsWith('water_') || cropId.startsWith('fertilizer_') || cropId.startsWith('weed_') || cropId.startsWith('pest_')) ? quantity * 0.2 : quantity;

        if (totalWeight + weightToAdd > this.state.warehouse.maxWeight) return false;

        const existing = this.state.warehouse.items.find(it => it.cropId === cropId && it.qualityGrade === qualityGrade);
        if (existing) {
            existing.quantity += quantity;
            existing.qualityScore = Math.round((existing.qualityScore + qualityScore) / 2);
            return true;
        }

        if (this.state.warehouse.items.length >= this.state.warehouse.maxSlots) return false;

        this.state.warehouse.items.push({
            id: 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            cropId: cropId,
            quantity: quantity,
            qualityScore: qualityScore,
            qualityGrade: qualityGrade,
            storedDay: this.state.time.totalDaysPassed,
            reservedForContract: 0
        });
        return true;
    }

    getWarehouseTotalWeight() {
        return this.state.warehouse.items.reduce((sum, item) => {
            const isSupply = item.cropId.startsWith('seed_') || item.cropId.startsWith('water_') || item.cropId.startsWith('fertilizer_') || item.cropId.startsWith('weed_') || item.cropId.startsWith('pest_');
            return sum + (isSupply ? item.quantity * 0.2 : item.quantity);
        }, 0);
    }

    processWarehouseDaily() {
        const hasColdStorage = this.isUpgradeUnlocked('cold_storage');
        const totalWeight = this.getWarehouseTotalWeight();
        const dailyStorageCost = Math.ceil((totalWeight / 100) * 3);

        if (dailyStorageCost > 0) {
            this.state.cash = Math.max(0, this.state.cash - dailyStorageCost);
            this.state.finance.totalExpense += dailyStorageCost;
            this.state.finance.yesterdayStorageCost = dailyStorageCost;
        }

        this.state.warehouse.items.forEach(item => {
            const cropCfg = CROPS_CONFIG[item.cropId] || PROCESSED_GOODS_CONFIG[item.cropId];
            if (!cropCfg) return;

            const daysStored = this.state.time.totalDaysPassed - item.storedDay;
            if (daysStored > cropCfg.spoilDays) {
                const decay = hasColdStorage ? 1 : 4;
                item.qualityScore = Math.max(5, item.qualityScore - decay);
                item.qualityGrade = this.getQualityGrade(item.qualityScore);
            }
        });
    }

    // ==========================================
    // 7. 农资杂货特许商店 (支持批量输入数量购买)
    // ==========================================
    buySupplyItem(itemId, itemType, quantity) {
        const qty = parseInt(quantity, 10);
        if (isNaN(qty) || qty <= 0) {
            window.soundEngine.playError();
            alert('请输入合法的购买数量！');
            return;
        }

        let itemDef = null;
        if (itemType === 'tool') {
            itemDef = SUPPLIES_CONFIG.tools.find(t => t.id === itemId);
        } else {
            itemDef = SUPPLIES_CONFIG.seeds.find(s => s.id === itemId);
        }

        if (!itemDef) return;

        const totalCost = itemDef.price * qty;
        if (this.state.cash < totalCost) {
            window.soundEngine.playError();
            alert(`资金不足！购买 ${qty} 件【${itemDef.icon} ${itemDef.name}】需要 ¥${totalCost}，当前仅有 ¥${this.state.cash}。`);
            return;
        }

        const success = this.addWarehouseItem(itemDef.id, qty, 80, '标准');
        if (!success) {
            window.soundEngine.playError();
            alert('仓库容量或货架格子已达上限！无法继续存放。');
            return;
        }

        this.state.cash -= totalCost;
        this.state.finance.totalExpense += totalCost;
        window.soundEngine.playCoin();

        this.addLog(`杂货批量采购：购买 ${qty} 件【${itemDef.icon} ${itemDef.name}】，支出 ¥${totalCost}。`);
        this.saveGame();
        this.updateUI();
    }

    // ==========================================
    // 动态产业链/长期行情辅助系统
    // ==========================================
    getRawMarketPrice(prodId, marketId = 'local') {
        const ms = this.state.markets?.[marketId];
        if (ms?.currentPrices?.[prodId] != null) return ms.currentPrices[prodId];
        const cfg = this.getMarketProductConfig(prodId);
        return cfg?.basePrice || cfg?.price || 1;
    }

    getRecipeInputCost(recipeId, marketId = 'local', depth = 0) {
        if (depth > 4) return 0;
        const recipe = PROCESSED_GOODS_CONFIG[recipeId];
        if (!recipe) return 0;
        let total = 0;
        Object.entries(recipe.input || {}).forEach(([inputId, qty]) => {
            if (CROPS_CONFIG[inputId] || this.isSupplyItem(inputId)) {
                total += this.getRawMarketPrice(inputId, marketId) * qty;
            } else if (PROCESSED_GOODS_CONFIG[inputId]) {
                total += this.getRecipeInputCost(inputId, marketId, depth + 1) * qty / Math.max(1, PROCESSED_GOODS_CONFIG[inputId].outputYield || 1);
            }
        });
        return total;
    }

    getProductEconomicBasePrice(prodId, marketId = 'local') {
        const cfg = this.getMarketProductConfig(prodId);
        if (!cfg) return 1;
        if (!PROCESSED_GOODS_CONFIG[prodId]) return cfg.basePrice || cfg.price || 1;
        const recipe = PROCESSED_GOODS_CONFIG[prodId];
        const inputCost = this.getRecipeInputCost(prodId, marketId);
        const outputQty = Math.max(1, recipe.outputYield || 1);
        const conversionCost = Math.max(1, (recipe.processDays || 1) * 1.8);
        // 原料成本 + 加工成本 + 合理加工毛利
        return Math.max(0.5, inputCost / outputQty + conversionCost) * 1.18;
    }

    applyLongMarketEvent() {
        const market = this.state.markets?.local;
        if (!market) return;
        if (market.macroEvent) {
            market.macroEvent.remainingDays -= 1;
            const e = market.macroEvent;
            Object.keys(CROPS_CONFIG).forEach(id => {
                const impact = e.impacts[id] || e.categoryImpacts?.[CROPS_CONFIG[id].name] || 0;
                market.trendBias[id] = Math.max(-0.035, Math.min(0.035, impact));
                market.volatilityBoost[id] = e.volatility || 1;
            });
            if (e.remainingDays <= 0) {
                this.addNews('✅ 行情事件结束', `${e.title}的市场影响逐渐消退，价格重新回归常态。`);
                market.macroEvent = null;
            }
        }
        if (!market.macroEvent && Math.random() < 0.08) {
            const cropIds = Object.keys(CROPS_CONFIG);
            const target = cropIds[Math.floor(Math.random() * cropIds.length)];
            const positive = Math.random() > 0.43;
            const templates = positive ? [
                ['🌾 主产区减产预期', `核心产区异常天气导致${CROPS_CONFIG[target].name}未来供应偏紧`, 0.018, 30, 1.65],
                ['🚢 国际供应收缩', `海外供应链扰动，${CROPS_CONFIG[target].name}进口成本持续抬升`, 0.014, 45, 1.45],
                ['📈 消费旺季启动', `${CROPS_CONFIG[target].name}下游采购进入旺季，渠道库存快速下降`, 0.012, 25, 1.35]
            ] : [
                ['🌾 全球丰收', `主要产区集中丰收，${CROPS_CONFIG[target].name}供应明显增加`, -0.014, 40, 1.45],
                ['📦 库存高位', `${CROPS_CONFIG[target].name}渠道库存高企，市场进入持续去库存阶段`, -0.011, 35, 1.35],
                ['📉 下游需求转弱', `${CROPS_CONFIG[target].name}下游采购放缓，现货市场进入弱需求阶段`, -0.010, 28, 1.3]
            ];
            const tpl = templates[Math.floor(Math.random() * templates.length)];
            const e = { title: tpl[0], desc: tpl[1], remainingDays: tpl[3], volatility: tpl[4], impacts: {} };
            e.impacts[target] = tpl[2];
            market.macroEvent = e;
            this.addNews(e.title, `${e.desc}，预计影响约 ${e.remainingDays} 天。`);
            this.addLog(`📣 长期行情启动：${e.title}，${CROPS_CONFIG[target].name}趋势发生变化。`);
        }
    }

    // ========== 盘中价格更新（非仅每日一次）==========
    processIntradayMarketPrices() {
        // 盘中微波动：基于成交压力、趋势与小噪声，价格由“连续小成交影响”自然漂移
        MARKETS_CONFIG.forEach(marketCfg => {
            const marketState = this.state.markets[marketCfg.id];
            if (!marketState || !marketState.currentPrices) return;
            const allProducts = this.getAllMarketProductIds();
            allProducts.forEach(prodId => {
                const cfg = this.getMarketProductConfig(prodId);
                if (!cfg) return;
                const basePrice = cfg.basePrice || cfg.price || 10;
                let price = marketState.currentPrices[prodId] || basePrice;
                const buy = marketState.dailyBuyVolume?.[prodId] || 0;
                const sell = marketState.dailySellVolume?.[prodId] || 0;
                const depth = Math.max(80, basePrice * (this.isSupplyItem(prodId) ? 60 : 25));
                const flowImpact = Math.max(-0.04, Math.min(0.04, (buy - sell) / depth * 0.012));
                const demand = (marketState.demandPressure?.[prodId] || 0);
                const supply = (marketState.supplyPressure?.[prodId] || 0);
                const pressure = (demand - supply) * 0.08;
                const trend = (marketState.trendBias?.[prodId] || 0) * 0.015;
                const vol = (marketState.volatilityBoost?.[prodId] || 1);
                // 小噪声（盘中），幅度远小于日度
                const noise = (Math.random() - 0.5) * 0.012 * vol;
                const multi = this.multiAgentMarket?.getLastTradeImpact?.(prodId) || 0;
                const delta = flowImpact + pressure + trend + noise + multi;
                const maxStep = Math.max(0.05, price * 0.035);
                const next = Math.max(0.5, price + Math.max(-maxStep, Math.min(maxStep, price * delta)));
                marketState.currentPrices[prodId] = parseFloat(next.toFixed(2));
                // 衰减压力，避免单日冲击永久存在
                if (marketState.demandPressure) marketState.demandPressure[prodId] = (demand || 0) * 0.97;
                if (marketState.supplyPressure) marketState.supplyPressure[prodId] = (supply || 0) * 0.97;
            });
        });
    }

    processIntradayFuturesPrices() {
        if (!this.state.futures?.quotes) return;
        Object.values(this.state.futures.quotes).forEach(q => {
            const spot = this.state.markets?.[MARKETS_CONFIG[0].id]?.currentPrices?.[q.productId] || q.price;
            const trend = this.state.markets?.local?.trendBias?.[q.productId] || 0;
            const vol = this.state.markets?.local?.volatilityBoost?.[q.productId] || 1;
            const noise = (Math.random() - 0.5) * 0.008 * vol;
            // 期货向现货收敛 + 轻微噪声，盘中多次更新
            const target = spot * (1 + trend * 0.3);
            q.previousPrice = q.price;
            q.price = Math.max(0.5, parseFloat((q.price * 0.85 + target * 0.15 + q.price * noise).toFixed(2)));
            q.volume = (q.volume || 0) + Math.floor(5 + Math.random() * 40);
        });
        // 盯市：盘中也更新持仓浮盈（小步）
        if (Array.isArray(this.state.futures.positions)) {
            this.state.futures.positions.forEach(p => {
                const q = this.state.futures.quotes[p.productId];
                if (!q || p.lastMarkPrice == null) return;
                const size = (q.contractSize || 100) * p.contracts;
                const mark = (q.price - p.lastMarkPrice) * size * (p.side === 'long' ? 1 : -1);
                if (Math.abs(mark) >= 0.5) {
                    this.state.cash += Math.round(mark);
                    p.lastMarkPrice = q.price;
                }
            });
        }
    }

    processMarketDailyPrices() {
        this.applyLongMarketEvent();
        const factorNames = [
            '天气','季节','区域产量','全国库存','仓储库存','消费需求','餐饮需求','工业需求','出口订单','进口到岸价',
            '能源成本','燃料成本','人工成本','化肥成本','农药成本','包装成本','冷链成本','物流运价','汇率','利率',
            '政策补贴','关税政策','环保政策','病虫害','疫病风险','水资源','极端气候','土地面积','播种面积','收获面积',
            '品质结构','替代品价格','加工利润','库存周期','渠道库存','零售价格','订单积压','期货基差','市场情绪','随机噪声'
        ];
        MARKETS_CONFIG.forEach(marketCfg => {
            const marketState = this.state.markets[marketCfg.id];
            const allProducts = this.getAllMarketProductIds();
            allProducts.forEach(prodId => {
                const cfg = this.getMarketProductConfig(prodId);
                const economicBase = this.getProductEconomicBasePrice(prodId, marketCfg.id === 'factory' ? 'local' : 'local');
                const basePrice = PROCESSED_GOODS_CONFIG[prodId] ? economicBase : (cfg.basePrice || cfg.price);
                const prevClose = marketState.currentPrices[prodId] || basePrice;
                const buy = marketState.dailyBuyVolume[prodId] || 0;
                const sell = marketState.dailySellVolume[prodId] || 0;
                const depth = Math.max(100, basePrice * (this.isSupplyItem(prodId) ? 80 : 30));
                const flowImpact = Math.max(-0.16, Math.min(0.16, (buy - sell) / depth * 0.055));
                const pressure = ((marketState.demandPressure[prodId] || 0) - (marketState.supplyPressure[prodId] || 0)) * 0.75;
                const season = CROPS_CONFIG[prodId] ? SEASONS[this.state.time.seasonIndex] : null;
                const seasonFactor = CROPS_CONFIG[prodId] ? (CROPS_CONFIG[prodId].suitableSeasons.includes(season) ? 1.018 : 0.982) : 1;
                const weatherFactor = CROPS_CONFIG[prodId] ? (1 + (this.state.weather.growthMod - 1) * 0.55) : 1;
                const oldFactors = (this.state.marketFactors[prodId] || {});
                const trendBias = marketState.trendBias?.[prodId] || 0;
                const volatilityBoost = marketState.volatilityBoost?.[prodId] || 1;
                const factorValues = {};
                factorNames.forEach((name, idx) => {
                    const old = Number(oldFactors[name] || 0);
                    const shock = (Math.random() - 0.5) * (idx < 8 ? 0.045 : 0.018) * volatilityBoost;
                    factorValues[name] = old * 0.72 + shock;
                });
                if (CROPS_CONFIG[prodId]) {
                    factorValues['天气'] += (this.state.weather.growthMod - 1) * 0.55;
                    factorValues['季节'] += seasonFactor - 1;
                    factorValues['病虫害'] -= ((this.state.weather.pestRisk || 0) - 0.08) * 0.35;
                    const farmSupply = this.getWarehouseItemCount(prodId);
                    factorValues['仓储库存'] -= Math.min(0.10, farmSupply / Math.max(500, basePrice * 80) * 0.025);
                    factorValues['全国库存'] += (Math.random() - 0.5) * 0.035;
                } else if (this.isSupplyItem(prodId)) {
                    factorValues['工业需求'] += (Math.random() - 0.42) * 0.025;
                    factorValues['渠道库存'] -= (Math.random() - 0.45) * 0.018;
                }
                // 下游加工利润越高，对原料采购的拉动越强；把产业链需求传回原材料价格
                Object.values(PROCESSED_GOODS_CONFIG).forEach(recipe => {
                    if (!recipe.input?.[prodId]) return;
                    const finishedPrice = this.getRawMarketPrice(recipe.id, 'local');
                    const rawCost = Math.max(0.01, this.getRawMarketPrice(prodId, 'local') * recipe.input[prodId]);
                    const margin = (finishedPrice * (recipe.outputYield || 1) - rawCost) / rawCost;
                    if (margin > 0.18) factorValues['加工利润'] += Math.min(0.08, margin * 0.035);
                });
                // 综合权重：每个交易日同时采样几十个宏观/产业/天气/库存因子；因子又可继续扩展到数千条新闻/子因素。
                let weightedShock = 0;
                const weights = {天气:.055,季节:.04,区域产量:.045,全国库存:.055,仓储库存:.035,消费需求:.065,餐饮需求:.04,工业需求:.045,出口订单:.035,进口到岸价:.03,能源成本:.025,燃料成本:.02,人工成本:.018,化肥成本:.022,农药成本:.018,包装成本:.014,冷链成本:.014,物流运价:.028,汇率:.018,利率:.01,政策补贴:.025,关税政策:.022,环保政策:.012,病虫害:.035,疫病风险:.03,水资源:.025,极端气候:.035,土地面积:.02,播种面积:.025,收获面积:.025,品质结构:.02,替代品价格:.022,加工利润:.025,库存周期:.03,渠道库存:.025,零售价格:.02,订单积压:.028,期货基差:.03,市场情绪:.02,随机噪声:.018};
                Object.keys(weights).forEach(k => weightedShock += (factorValues[k] || 0) * weights[k]);
                // 进一步模拟真实大宗商品市场的高维信息集合：每个品种每天叠加 1024 个微观变量。
                // 微观变量来自区域天气网格、渠道库存、企业采购、运输节点、加工利润、消费结构、政策执行等抽象数据桶，
                // 每项权重很小，最终只作为综合冲击的一部分，避免单一事件把价格瞬间打穿。
                let microShock=0;
                const seedBase=this.state.time.totalDaysPassed*0.6180339887 + prodId.length*1.137 + marketCfg.id.length*2.71;
                for(let mi=0;mi<1024;mi++){
                    const wave=Math.sin(seedBase + mi*12.9898)*0.5 + Math.sin(seedBase*0.37 + mi*78.233)*0.5;
                    const weight=0.000018 + (mi%17)*0.0000007;
                    microShock += wave*weight;
                }
                weightedShock += microShock;
                const meanReversion = (basePrice - prevClose) / Math.max(basePrice, 1) * 0.12;
                let targetPrice = prevClose * (1 + flowImpact + pressure + weightedShock + meanReversion) * seasonFactor * weatherFactor;
                targetPrice = targetPrice * 0.91 + basePrice * 0.09;
                targetPrice *= (1 + trendBias);
                // 加工品跟随原料成本与利润共同变化
                if (PROCESSED_GOODS_CONFIG[prodId]) {
                    const costSignal = (basePrice - prevClose) / Math.max(prevClose, 1);
                    targetPrice *= (1 + Math.max(-0.08, Math.min(0.12, costSignal * 0.55)));
                }
                const maxChange = Math.max(0.5, prevClose * (this.isSupplyItem(prodId) ? 0.12 : 0.20));
                const open = parseFloat((prevClose * (1 + weightedShock * 0.45)).toFixed(2));
                const close = parseFloat(Math.max(0.5, Math.max(prevClose - maxChange, Math.min(prevClose + maxChange, targetPrice))).toFixed(2));
                const high = parseFloat((Math.max(open, close) + Math.random() * Math.max(0.1, open * 0.035)).toFixed(2));
                const low = parseFloat(Math.max(0.3, Math.min(open, close) - Math.random() * Math.max(0.1, open * 0.035)).toFixed(2));
                const klines = marketState.klineHistory[prodId] || [];
                // 多智能体开启：日结不覆盖成交驱动价，仅滚动昨收
                if (this.multiAgentMarket && marketState.currentPrices[prodId] != null) {
                    const live = marketState.currentPrices[prodId];
                    marketState.yesterdayPrices[prodId] = live;
                    klines.push({ open: live, high: live, low: live, close: live, day: this.state.time.totalDaysPassed });
                    if (klines.length > 60) klines.shift();
                    marketState.klineHistory[prodId] = klines;
                    marketState.quotasLeft[prodId] = Infinity;
                    marketState.dailyBuyVolume[prodId] = 0;
                    marketState.dailySellVolume[prodId] = 0;
                    marketState.demandPressure[prodId] = (marketState.demandPressure[prodId] || 0) * 0.55;
                    marketState.supplyPressure[prodId] = (marketState.supplyPressure[prodId] || 0) * 0.55;
                    return;
                }
                klines.push({open,high,low,close,day:this.state.time.totalDaysPassed});
                if (klines.length > 60) klines.shift();
                marketState.yesterdayPrices[prodId] = prevClose;
                marketState.currentPrices[prodId] = close;
                marketState.quotasLeft[prodId] = Infinity;
                marketState.dailyBuyVolume[prodId] = 0;
                marketState.dailySellVolume[prodId] = 0;
                marketState.demandPressure[prodId] = (marketState.demandPressure[prodId] || 0) * 0.55;
                marketState.supplyPressure[prodId] = (marketState.supplyPressure[prodId] || 0) * 0.55;
                marketState.status[prodId] = Math.abs(buy - sell) > depth * 1.5 ? 'hot' : 'normal';
                marketState.rejectReason[prodId] = weightedShock > 0.035 ? '多重利多因素共振，需求/成本端共同推升价格' : weightedShock < -0.035 ? '多重利空因素叠加，供应/需求端共同压低价格' : '多因素综合定价，市场正常交易';
                this.state.marketFactors[prodId] = factorValues;
                marketState.klineHistory[prodId] = klines;
            });
            this.generateMarketNews(marketCfg);
        });
    }

    generateMarketNews(marketCfg) {
        const headlines = [
            ['全球粮食库存变化','国际库存周期变化影响大宗农产品估值'],['极端天气预警','部分产区天气异常，市场重新评估产量风险'],['餐饮消费回暖','餐饮渠道补库增加，食品原料采购活跃'],['能源价格变化','能源与燃料成本变化传导至农业物流和加工成本'],['物流运价调整','干线运输价格变化，区域价差扩大'],['进口政策调整','关税、检疫或进口节奏变化影响到岸供应'],['出口订单增加','海外采购订单变化带动相关品种需求预期'],['库存周期切换','渠道库存进入补库/去库阶段，现货价格波动加大'],['病虫害监测','部分产区病虫害风险变化，市场关注后续产量'],['农业政策发布','补贴、环保、耕地等政策改变产业成本与供给预期'],['加工利润变化','加工厂利润变化影响原料采购积极性'],['替代品价格波动','相关替代品价格变化带动需求替代效应']
        ];
        const n = headlines[Math.floor(Math.random()*headlines.length)];
        this.addNews(`📰 ${n[0]}`, `${n[1]}（${marketCfg.name}）`);
    }

    addNews(title, text) {
        if (!this.state.news) this.state.news=[];
        const t=`${this.state.time.year}年${SEASONS[this.state.time.seasonIndex]}季${this.state.time.day}日`;
        this.state.news.unshift({time:t,title,text});
        if(this.state.news.length>200) this.state.news.pop();
        this.renderNewsLogModal();
    }

    getSpotExecutionPrice(marketId, prodId, quantity, side) {
        const market = this.state.markets[marketId];
        const current = market.currentPrices[prodId];
        const cfg = this.getMarketProductConfig(prodId);
        const basePrice = cfg.basePrice || cfg.price;
        const depth = Math.max(100, basePrice * (this.isSupplyItem(prodId) ? 80 : 30));
        const impact = Math.min(0.30, Math.log10(1 + Math.max(1, quantity) / depth) * 0.18);
        return parseFloat((current * (side === 'buy' ? 1 + impact : 1 - impact)).toFixed(2));
    }

    sellSpotGoods(marketId, cropId, quantity) {
        const marketCfg = MARKETS_CONFIG.find(m => m.id === marketId);
        const marketState = this.state.markets[marketId];
        if (!marketCfg || !marketState || quantity <= 0) return;
        const eligibleItems = this.state.warehouse.items.filter(it => it.cropId === cropId);
        const availableTotal = eligibleItems.reduce((sum,it)=>sum + Math.max(0,it.quantity-it.reservedForContract),0);
        if (quantity > availableTotal) { window.soundEngine.playError(); alert(`仓库存货可用不足！当前仅有 ${availableTotal} kg。`); return; }

        // 走订单簿市价卖出，价格由真实吃买单产生
        let unitPrice, filled = quantity, reason = '';
        if (this.multiAgentMarket) {
            const res = this.multiAgentMarket.executePlayerMarketOrder(marketId, cropId, 'sell', quantity);
            if (!res.ok || res.filled <= 0) {
                window.soundEngine.playError();
                alert(`卖出失败：${res.reason || '暂无买盘'}`);
                return;
            }
            filled = res.filled;
            unitPrice = res.avgPrice;
            reason = res.reason;
        } else {
            unitPrice = this.getSpotExecutionPrice(marketId, cropId, quantity, 'sell');
        }

        let remaining = filled;
        for (const item of eligibleItems) {
            const free = Math.max(0, item.quantity - item.reservedForContract);
            const take = Math.min(free, remaining);
            item.quantity -= take;
            remaining -= take;
            if (remaining <= 0) break;
        }
        this.state.warehouse.items = this.state.warehouse.items.filter(it => it.quantity > 0);
        const grossValue = Math.round(unitPrice * filled);
        const transportFee = Math.round(grossValue * marketCfg.transportCostRate);
        const netCash = grossValue - transportFee;
        marketState.dailySellVolume[cropId] = (marketState.dailySellVolume[cropId] || 0) + filled;
        marketState.supplyPressure[cropId] = Math.min(0.35, (marketState.supplyPressure[cropId] || 0) + filled / Math.max(200, unitPrice * 40) * 0.05);
        this.state.cash += netCash;
        this.state.finance.totalRevenue += netCash;
        window.soundEngine.playCoin();
        this.gainXP(Math.max(10, Math.round(filled * 0.25)), 'sold', filled);
        this.addLog(`现货卖出：${this.getItemIcon(cropId)} ${this.getItemName(cropId)} ${filled}${this.getMarketUnit(cropId)}，成交均价 ¥${unitPrice.toFixed(2)}，净回款 ¥${netCash}${reason && reason !== '完全成交' ? '（' + reason + '）' : ''}。`);
        this.saveGame();
        this.updateUI();
        try { this.refreshMarketQuotesOnly(); } catch (e) {}
    }

    buySpotGoods(marketId, cropId, quantity) {
        const marketCfg = MARKETS_CONFIG.find(m => m.id === marketId);
        const marketState = this.state.markets[marketId];
        if (!marketCfg || !marketState || quantity <= 0) return;

        let unitPrice, filled = quantity, reason = '';
        if (this.multiAgentMarket) {
            const res = this.multiAgentMarket.executePlayerMarketOrder(marketId, cropId, 'buy', quantity);
            if (!res.ok || res.filled <= 0) {
                window.soundEngine.playError();
                alert(`买入失败：${res.reason || '暂无卖盘'}`);
                return;
            }
            filled = res.filled;
            unitPrice = res.avgPrice;
            reason = res.reason;
        } else {
            unitPrice = this.getSpotExecutionPrice(marketId, cropId, quantity, 'buy');
        }

        const gross = Math.round(unitPrice * filled);
        const fee = Math.round(gross * marketCfg.transportCostRate);
        const totalCost = gross + fee;
        if (this.state.cash < totalCost) {
            window.soundEngine.playError();
            alert(`资金不足！需要 ¥${totalCost}，当前 ¥${Math.floor(this.state.cash)}`);
            return;
        }
        // 注意：若已通过订单簿成交，资金已应对应扣减；这里用成交结果结算玩家账户
        this.state.cash -= totalCost;
        const ok = this.addWarehouseItem(cropId, filled, 80, '标准');
        if (!ok) {
            this.state.cash += totalCost;
            window.soundEngine.playError();
            alert('仓库容量不足，无法接收这批现货。');
            return;
        }
        marketState.dailyBuyVolume[cropId] = (marketState.dailyBuyVolume[cropId] || 0) + filled;
        marketState.demandPressure[cropId] = Math.min(0.35, (marketState.demandPressure[cropId] || 0) + filled / Math.max(200, unitPrice * 40) * 0.05);
        window.soundEngine.playCoin();
        this.addLog(`现货买入：${this.getItemIcon(cropId)} ${this.getItemName(cropId)} ${filled}${this.getMarketUnit(cropId)}，成交均价 ¥${unitPrice.toFixed(2)}${reason && reason !== '完全成交' ? '（' + reason + '）' : ''}。`);
        this.saveGame();
        this.updateUI();
        try { this.refreshMarketQuotesOnly(); } catch (e) {}
    }

    // 玩家限价单
    placeSpotLimitOrder(side) {
        const marketId = document.getElementById('market-select')?.value || MARKETS_CONFIG[0].id;
        const cropId = document.getElementById('crop-market-select')?.value || Object.keys(CROPS_CONFIG)[0];
        const price = parseFloat(document.getElementById('limit-order-price')?.value);
        const qty = parseInt(document.getElementById('limit-order-qty')?.value, 10);
        if (!this.multiAgentMarket) { alert('市场引擎未就绪'); return; }
        if (!(price > 0) || !(qty > 0)) { alert('请输入有效的限价与数量'); return; }
        if (side === 'sell') {
            const availableTotal = this.state.warehouse.items.filter(it => it.cropId === cropId)
                .reduce((s, it) => s + Math.max(0, it.quantity - it.reservedForContract), 0);
            if (qty > availableTotal) { alert(`可售库存不足，仅有 ${availableTotal}`); return; }
            // 预冻库存
            let left = qty;
            for (const item of this.state.warehouse.items.filter(it => it.cropId === cropId)) {
                const free = Math.max(0, item.quantity - item.reservedForContract);
                const take = Math.min(free, left);
                item.reservedForContract = (item.reservedForContract || 0) + take;
                left -= take;
                if (left <= 0) break;
            }
        } else {
            const need = Math.ceil(price * qty * 1.02);
            if (this.state.cash < need) { alert(`资金不足，限价买入约需 ¥${need}`); return; }
            this.state.cash -= need; // 预冻结
            this._limitBuyFreeze = this._limitBuyFreeze || {};
            this._limitBuyFreeze[`${marketId}|${cropId}|${price}`] = (this._limitBuyFreeze[`${marketId}|${cropId}|${price}`] || 0) + need;
        }
        const res = this.multiAgentMarket.placePlayerLimitOrder(marketId, cropId, side, price, qty);
        this.addLog(`限价${side === 'buy' ? '买' : '卖'}单已挂：${this.getItemName(cropId)} ${qty} @ ¥${price}（${res.status}）`);
        this.saveGame();
        this.updateUI();
        try { this.refreshMarketQuotesOnly(); this._renderPlayerOrders(); } catch (e) {}
    }

    onPlayerLimitFill(t, marketId, prodId) {
        // 限价成交结算
        if (t.buyAgent === 'PLAYER') {
            const cost = t.price * t.qty;
            // 已预冻资金，多退少补
            this.addWarehouseItem(prodId, t.qty, 80, '标准');
            this.addLog(`限价买单成交：${this.getItemName(prodId)} ${t.qty} @ ¥${t.price}`);
        } else if (t.sellAgent === 'PLAYER') {
            // 释放预留并扣库存
            let left = t.qty;
            for (const item of this.state.warehouse.items.filter(it => it.cropId === prodId)) {
                const reserved = item.reservedForContract || 0;
                const takeR = Math.min(reserved, left);
                item.reservedForContract -= takeR;
                const takeQ = Math.min(item.quantity, takeR || left);
                item.quantity -= takeQ;
                left -= takeQ;
                if (left <= 0) break;
            }
            this.state.warehouse.items = this.state.warehouse.items.filter(it => it.quantity > 0);
            const marketCfg = MARKETS_CONFIG.find(m => m.id === marketId);
            const fee = Math.round(t.price * t.qty * (marketCfg?.transportCostRate || 0));
            this.state.cash += Math.round(t.price * t.qty) - fee;
            this.addLog(`限价卖单成交：${this.getItemName(prodId)} ${t.qty} @ ¥${t.price}`);
        }
        try { this._renderPlayerOrders(); } catch (e) {}
        // 成交改变玩家资产/库存后立即落盘，避免刷新导致已成交结果丢失。
        try { this.saveGame(); } catch (e) {}
    }

    _renderPlayerOrders() {
        const el = document.getElementById('player-orders-list');
        if (!el || !this.multiAgentMarket) return;
        const orders = (this.multiAgentMarket.playerOrders || []).filter(o => o.remaining > 0);
        el.innerHTML = orders.length ? orders.map(o =>
            `<div class="player-order-row">${o.side === 'buy' ? '买' : '卖'} ${this.getItemName(o.productId)} ${o.remaining}@¥${o.price}
            <button class="btn btn-secondary btn-tiny" onclick="gameEngine.multiAgentMarket.cancelPlayerOrder('${o.orderId}');gameEngine._renderPlayerOrders();gameEngine.refreshMarketQuotesOnly();">撤单</button></div>`
        ).join('') : '<div class="player-order-row" style="opacity:.6">暂无挂单</div>';
    }

    drawMarketChart(klines, currentPrice, canvasId='market-chart') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.parentElement.clientWidth;
        const h = 170;
        canvas.width = w * window.devicePixelRatio;
        canvas.height = h * window.devicePixelRatio;
        ctx.setTransform(1,0,0,1,0,0);
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        ctx.fillStyle = '#181b24';
        ctx.fillRect(0, 0, w, h);

        if (!klines || klines.length === 0) return;

        let maxPrice = -Infinity;
        let minPrice = Infinity;
        klines.forEach(k => {
            if (k.high > maxPrice) maxPrice = k.high;
            if (k.low < minPrice) minPrice = k.low;
        });

        maxPrice = parseFloat((maxPrice * 1.05).toFixed(1));
        minPrice = parseFloat(Math.max(0, minPrice * 0.95).toFixed(1));
        if (maxPrice === minPrice) maxPrice += 1;

        const count = klines.length;
        const candleWidth = Math.max(3, (w - 60) / count - 3);
        const candleGap = (w - 60) / count;
        const startX = 15;
        const chartH = h - 35;
        const topY = 15;

        const priceToY = (price) => {
            return topY + chartH - ((price - minPrice) / (maxPrice - minPrice)) * chartH;
        };

        ctx.strokeStyle = '#272b38';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 3; i++) {
            const p = minPrice + (maxPrice - minPrice) * (i / 3);
            const py = priceToY(p);
            ctx.beginPath();
            ctx.moveTo(startX, py);
            ctx.lineTo(w - 45, py);
            ctx.stroke();

            ctx.fillStyle = '#656d81';
            ctx.font = '9px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(p.toFixed(1), w - 40, py + 3);
        }

        klines.forEach((k, idx) => {
            const cx = startX + idx * candleGap + candleWidth / 2;
            const yHigh = priceToY(k.high);
            const yLow = priceToY(k.low);
            const yOpen = priceToY(k.open);
            const yClose = priceToY(k.close);

            const isUp = k.close >= k.open;
            const color = isUp ? '#bf616a' : '#a3be8c';

            ctx.strokeStyle = color;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(cx, yHigh);
            ctx.lineTo(cx, yLow);
            ctx.stroke();

            ctx.fillStyle = color;
            const bodyTop = Math.min(yOpen, yClose);
            const bodyH = Math.max(2, Math.abs(yClose - yOpen));
            ctx.fillRect(cx - candleWidth / 2, bodyTop, candleWidth, bodyH);
        });

        const curY = priceToY(currentPrice);
        ctx.save();
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = '#ebcb8b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(startX, curY);
        ctx.lineTo(w - 45, curY);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#ebcb8b';
        ctx.fillRect(w - 48, curY - 7, 44, 14);
        ctx.fillStyle = '#1e222d';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`¥${currentPrice.toFixed(1)}`, w - 26, curY + 3);
    }

    // ==========================================
    // 9. 期货与订单体系
    // ==========================================
    generateDailyFuturesContracts() {
        if (!this.state.futures.quotes) this.state.futures.quotes = {};
        const ids = Object.keys(CROPS_CONFIG).concat(Object.keys(PROCESSED_GOODS_CONFIG)).slice(0, 24);
        const nextQuotes = {};
        ids.forEach((prodId, i) => {
            const cfg = this.getMarketProductConfig(prodId);
            const spot = this.state.markets[MARKETS_CONFIG[0].id].currentPrices[prodId] || cfg.basePrice;
            const prev = this.state.futures.quotes[prodId]?.price || spot * (1 + (Math.random()-0.5)*0.04);
            const days = [7,14,21,30][i % 4];
            const marketTrend = this.state.markets.local.trendBias?.[prodId] || 0;
            const basis = ((days / 30) * 0.018) + marketTrend * 0.55 + (Math.random()-0.5)*0.025;
            const target = spot * (1 + basis);
            const price = Math.max(0.5, parseFloat((prev*0.72 + target*0.28).toFixed(2)));
            const old = this.state.futures.quotes[prodId] || {};
            const history = Array.isArray(old.history) ? old.history.slice(-59) : [];
            history.push({open: prev, high: Math.max(prev, price) * (1 + Math.random()*0.018), low: Math.min(prev, price) * (1 - Math.random()*0.018), close: price, day:this.state.time.totalDaysPassed});
            nextQuotes[prodId] = { id:'FUT_'+prodId, productId:prodId, contractSize:100, price, previousPrice:prev, deliveryDay:this.state.time.totalDaysPassed+days, marginRate:0.12, maintenanceMarginRate:0.08, volume:Math.floor(800+Math.random()*4200), openInterest:Math.max(100, Math.floor((old.openInterest||500)+((Math.random()-0.46)*180))), tick:0.01, history };
        });
        this.state.futures.quotes = nextQuotes;
        this.state.futures.available = Object.values(nextQuotes);
    }

    getSelectedMarginRate() {
        const el = document.getElementById('future-margin-rate');
        const v = el ? parseFloat(el.value) : 0.10;
        return Math.min(0.5, Math.max(0.03, isNaN(v) ? 0.10 : v));
    }

    getSelectedDeliveryDays() {
        const el = document.getElementById('future-delivery-days');
        const v = el ? parseInt(el.value, 10) : 14;
        return [7, 14, 30].includes(v) ? v : 14;
    }

    openFuturesPosition(productId, side, contracts=1) {
        const q = this.state.futures.quotes[productId];
        if (!q) return;
        contracts = Math.max(1, parseInt(contracts, 10) || 1);
        const marginRate = this.getSelectedMarginRate();
        const deliveryDays = this.getSelectedDeliveryDays();
        const notional = q.price * q.contractSize * contracts;
        const margin = Math.ceil(notional * marginRate);
        const maintenanceMarginRate = Math.max(0.04, marginRate * 0.65);
        if (this.state.cash < margin) {
            window.soundEngine.playError();
            alert(`保证金不足，需要 ¥${margin.toLocaleString()}（比例 ${(marginRate * 100).toFixed(0)}%）。`);
            return;
        }
        this.state.cash -= margin;
        const deliveryDay = this.state.time.totalDaysPassed + deliveryDays;
        this.state.futures.positions.push({
            id: 'pos_' + Date.now() + '_' + Math.random(),
            contractId: q.id,
            productId,
            side,
            contracts,
            entryPrice: q.price,
            margin,
            marginRate,
            deliveryDay,
            deliveryDays,
            status: 'open',
            lastMarkPrice: q.price,
            maintenanceMarginRate
        });
        this.state.futures.holdings = this.state.futures.positions;
        this.addLog(`期货${side === 'long' ? '开多' : '开空'}：${this.getItemName(productId)} ${contracts}手，开仓价 ¥${q.price}/kg，保证金 ${(marginRate * 100).toFixed(0)}% ¥${margin.toLocaleString()}，交割 ${deliveryDays} 天后。`);
        this.addNews('📊 期货市场成交', `${this.getItemName(productId)} ${side === 'long' ? '多头' : '空头'}新增 ${contracts} 手，行情 ¥${q.price}/kg，交割周期 ${deliveryDays} 天。`);
        this.saveGame();
        this.updateUI();
    }

    closeFuturesPosition(positionId) {
        const idx=this.state.futures.positions.findIndex(p=>p.id===positionId); if(idx<0)return;
        const p=this.state.futures.positions[idx], q=this.state.futures.quotes[p.productId];
        const totalPnl=(q.price-p.entryPrice)*q.contractSize*p.contracts*(p.side==='long'?1:-1);
        const finalMark=(q.price-p.lastMarkPrice)*q.contractSize*p.contracts*(p.side==='long'?1:-1);
        this.state.cash+=p.margin+Math.round(finalMark); this.state.futures.cashSettlement+=Math.round(finalMark);
        this.state.finance.totalRevenue += Math.max(0,Math.round(totalPnl)); this.state.finance.totalExpense += Math.max(0,-Math.round(totalPnl));
        this.addLog(`期货平仓：${this.getItemName(p.productId)} ${p.side==='long'?'多头':'空头'} ${p.contracts}手，累计盈亏 ${totalPnl>=0?'+':''}¥${Math.round(totalPnl).toLocaleString()}。`);
        this.state.futures.positions.splice(idx,1);this.state.futures.holdings=this.state.futures.positions;this.saveGame();this.updateUI();
    }

    signFuturesContract(contractId) {
        const q=Object.values(this.state.futures.quotes||{}).find(x=>x.id===contractId) || this.state.futures.available.find(x=>x.id===contractId);
        if(!q)return; this.openFuturesPosition(q.productId,'short',1);
    }

    processFuturesDailyCheck() {
        if (!this.state.futures.quotes || Object.keys(this.state.futures.quotes).length === 0) this.generateDailyFuturesContracts();
        Object.values(this.state.futures.quotes).forEach(q => {
            const spot = this.state.markets[MARKETS_CONFIG[0].id].currentPrices[q.productId] || q.price;
            q.previousPrice = q.price;
            const trend = this.state.markets.local.trendBias?.[q.productId] || 0;
            const vol = this.state.markets.local.volatilityBoost?.[q.productId] || 1;
            const newsShock = (Math.random() - 0.5) * 0.035 * vol;
            q.price = Math.max(0.5, parseFloat((q.price * 0.62 + spot * 0.38 * (1 + trend * 0.7 + newsShock)).toFixed(2)));
            q.volume += Math.floor(100 + Math.random() * 500);
            q.openInterest = Math.max(0, q.openInterest + Math.floor((Math.random() - 0.48) * 120));
            const hist = Array.isArray(q.history) ? q.history : [];
            hist.push({ open: q.previousPrice, high: Math.max(q.previousPrice, q.price) * (1 + Math.random() * 0.012), low: Math.min(q.previousPrice, q.price) * (1 - Math.random() * 0.012), close: q.price, day: this.state.time.totalDaysPassed });
            q.history = hist.slice(-60);
        });
        const today = this.state.time.totalDaysPassed;
        const remaining = [];
        this.state.futures.positions.forEach(p => {
            const q = this.state.futures.quotes[p.productId];
            if (!q) return;
            const size = (q.contractSize || 100) * p.contracts;
            const mark = (q.price - p.lastMarkPrice) * size * (p.side === 'long' ? 1 : -1);
            this.state.cash += Math.round(mark);
            p.lastMarkPrice = q.price;
            const equity = p.margin + (q.price - p.entryPrice) * size * (p.side === 'long' ? 1 : -1);
            const maintRate = p.maintenanceMarginRate || 0.08;
            const maintenance = q.price * size * maintRate;
            if (equity < maintenance && p.deliveryDay > today) {
                const liquidationPnl = (q.price - p.entryPrice) * size * (p.side === 'long' ? 1 : -1);
                // 强平：保证金已通过盯市体现，不再重复退回全额保证金避免双计
                this.addLog(`🔴 强制平仓：${this.getItemName(p.productId)} ${p.side === 'long' ? '多头' : '空头'} ${p.contracts}手，保证金不足，累计盈亏 ${liquidationPnl >= 0 ? '+' : ''}¥${Math.round(liquidationPnl).toLocaleString()}。`);
                return;
            }
            if (p.deliveryDay <= today) {
                const cfg = this.getMarketProductConfig(p.productId);
                const unit = this.getMarketUnit(p.productId);
                if (p.side === 'long') {
                    // 多头交割：按开仓价获得现货，已付保证金抵扣，只需补齐 (开仓总价 - 保证金)
                    const totalCost = Math.round(p.entryPrice * size);
                    const needPay = Math.max(0, totalCost - Math.round(p.margin));
                    if (this.state.cash >= needPay) {
                        this.state.cash -= needPay;
                        this.addWarehouseItem(p.productId, size, 85, '优质');
                        this.addLog(`📦 期货多头交割成功：补齐 ¥${needPay.toLocaleString()}（开仓总价 ¥${totalCost.toLocaleString()} − 保证金 ¥${Math.round(p.margin).toLocaleString()}），获得 ${size}${unit}【${cfg.name}】。`);
                    } else {
                        // 违约：没收剩余保证金权益，不交付现货
                        this.addLog(`⚠️ 期货多头交割违约：需补齐 ¥${needPay.toLocaleString()}，可用资金不足，保证金已没收，未获得现货。`);
                        this.addNews('⚠️ 期货违约', `${cfg.name} 多头交割资金不足，按违约处理。`);
                    }
                } else {
                    // 空头交割：交付对应数量现货，按开仓价收款并退还保证金
                    const stock = this.getWarehouseItemCount(p.productId);
                    if (stock >= size) {
                        this.consumeWarehouseItem(p.productId, size);
                        const receive = Math.round(p.entryPrice * size);
                        this.state.cash += receive + Math.round(p.margin);
                        this.addLog(`📦 期货空头交割成功：交付 ${size}${unit}【${cfg.name}】，按开仓价收款 ¥${receive.toLocaleString()}，并退还保证金 ¥${Math.round(p.margin).toLocaleString()}。`);
                    } else {
                        const shortage = size - stock;
                        // 有多少交多少，缺货部分违约，保证金不退
                        if (stock > 0) this.consumeWarehouseItem(p.productId, stock);
                        const partial = Math.round(p.entryPrice * stock);
                        this.state.cash += partial;
                        this.addLog(`⚠️ 期货空头交割违约：需交付 ${size}${unit}，仅有 ${stock}${unit}，缺 ${shortage}${unit}。已交部分收款 ¥${partial.toLocaleString()}，保证金没收。`);
                        this.addNews('⚠️ 期货违约', `${cfg.name} 空头交割库存不足，按违约处理。`);
                    }
                }
            } else {
                remaining.push(p);
                const d = p.deliveryDay - today;
                if (d === 3 || d === 1) this.addLog(`⏰ 期货交割提醒：${this.getItemName(p.productId)} ${d === 1 ? '明日' : '还有3天'}到期。`);
            }
        });
        this.state.futures.positions = remaining;
        this.state.futures.holdings = remaining;
        this.generateDailyFuturesContracts();
    }

    generateDailyOrders() {
        // 保留未过期订单，不足时补足，避免每天清空导致订单过少
        const today = this.state.time.totalDaysPassed;
        this.state.orders = (this.state.orders || []).filter(o => today <= o.deadlineDay);
        const clients = [
            '阳光绿源商贸', '香格里拉大酒店', '中农鲜食加工部', '大宗进出口物产',
            '鲜达冷链物流', '都市生鲜连锁', '校园中央食堂', '社区团购联盟',
            '跨境农产品贸易行', '高端有机超市', '中央厨房配供中心', '预制菜产业园'
        ];
        const qualities = ['普通', '优质', '优质', '精品', '特级'];
        const qualityMul = { '普通': 1.15, '优质': 1.35, '精品': 1.55, '特级': 1.85 };
        const allKeys = Object.keys(CROPS_CONFIG).concat(Object.keys(PROCESSED_GOODS_CONFIG));
        const targetCount = 8;
        let i = 0;
        while (this.state.orders.length < targetCount && i < 20) {
            const client = clients[Math.floor(Math.random() * clients.length)];
            const prodId = allKeys[Math.floor(Math.random() * allKeys.length)];
            const basePrice = CROPS_CONFIG[prodId] ? CROPS_CONFIG[prodId].basePrice : PROCESSED_GOODS_CONFIG[prodId].basePrice;
            // 数量显著提高：约 120~600 kg（按 20kg 档）
            const quantity = Math.floor(Math.random() * 25 + 6) * 20;
            const minQuality = qualities[Math.floor(Math.random() * qualities.length)];
            const mul = qualityMul[minQuality] || 1.35;
            // 大单额外溢价
            const sizeBonus = quantity >= 400 ? 1.12 : quantity >= 200 ? 1.06 : 1.0;
            const reward = Math.round(quantity * basePrice * mul * sizeBonus);
            const duration = Math.floor(Math.random() * 8) + 5;

            this.state.orders.push({
                id: 'order_' + Date.now() + '_' + i + '_' + Math.random().toString(36).slice(2, 6),
                client: client,
                productId: prodId,
                quantity: quantity,
                minQuality: minQuality,
                rewardCash: reward,
                deadlineDay: this.state.time.totalDaysPassed + duration
            });
            i++;
        }
    }

    deliverOrder(orderId) {
        const orderIdx = this.state.orders.findIndex(o => o.id === orderId);
        if (orderIdx === -1) return;
        const order = this.state.orders[orderIdx];

        const qualityRank = { '普通': 1, '优质': 2, '精品': 3, '特级': 4 };
        const reqRank = qualityRank[order.minQuality];

        const eligibleItems = this.state.warehouse.items.filter(it =>
            it.cropId === order.productId && qualityRank[it.qualityGrade] >= reqRank
        );
        const totalEligible = eligibleItems.reduce((s, it) => s + (it.quantity - it.reservedForContract), 0);

        if (totalEligible < order.quantity) {
            window.soundEngine.playError();
            alert(`可用库存不满足订单要求！需要 ${order.quantity} kg (${order.minQuality}以上)，当前仅有 ${totalEligible} kg 可用。`);
            return;
        }

        let needDeduct = order.quantity;
        for (let it of eligibleItems) {
            const free = it.quantity - it.reservedForContract;
            const take = Math.min(free, needDeduct);
            it.quantity -= take;
            needDeduct -= take;
            if (needDeduct <= 0) break;
        }
        this.state.warehouse.items = this.state.warehouse.items.filter(it => it.quantity > 0);

        this.state.cash += order.rewardCash;
        this.state.finance.totalRevenue += order.rewardCash;
        this.state.orders.splice(orderIdx, 1);
        this.gainXP(180,'orders',1);
        window.soundEngine.playCoin();

        const icon = this.getItemIcon(order.productId);
        const prodName = this.getItemName(order.productId);
        this.addLog(`定向直供履约：向【${order.client}】交付 ${order.quantity} kg【${icon} ${prodName}】，获得酬金 ¥${order.rewardCash}！`);
        this.saveGame();
        this.updateUI();
    }

    processOrdersDailyCheck() {
        const today = this.state.time.totalDaysPassed;
        this.state.orders = this.state.orders.filter(o => today <= o.deadlineDay);
        if (this.state.orders.length < 6) {
            this.generateDailyOrders();
        }
    }

    startProcessing(recipeId, batchCount = 1) {
        const recipe = PROCESSED_GOODS_CONFIG[recipeId];
        if (!recipe) return;
        const ws = this.state.workshop;
        batchCount = Math.max(1, Math.min(parseInt(batchCount, 10) || 1, ws.batchSize || 1));

        if (ws.runningLines.length >= ws.maxSlots) {
            window.soundEngine.playError();
            alert('工坊生产线负荷已满！');
            return;
        }

        for (let inCropId in recipe.input) {
            const needQty = recipe.input[inCropId] * batchCount;
            const stockItems = this.state.warehouse.items.filter(it => it.cropId === inCropId);
            const totalStock = stockItems.reduce((s, it) => s + (it.quantity - it.reservedForContract), 0);
            if (totalStock < needQty) {
                window.soundEngine.playError();
                const name = this.getItemName(inCropId);
                const icon = this.getItemIcon(inCropId);
                alert(`原料库存不足！本次生产需要 ${icon} ${name} ${needQty} kg，当前仅有 ${totalStock} kg。`);
                return;
            }
        }

        for (let inCropId in recipe.input) {
            let needDeduct = recipe.input[inCropId] * batchCount;
            const stockItems = this.state.warehouse.items.filter(it => it.cropId === inCropId);
            for (let it of stockItems) {
                const free = it.quantity - it.reservedForContract;
                const take = Math.min(free, needDeduct);
                it.quantity -= take;
                needDeduct -= take;
                if (needDeduct <= 0) break;
            }
        }
        this.state.warehouse.items = this.state.warehouse.items.filter(it => it.quantity > 0);

        this.state.workshop.runningLines.push({
            id: 'line_' + Date.now(),
            recipeId: recipeId,
            targetItemId: recipeId,
            outputYield: recipe.outputYield * batchCount,
            remainingDays: Math.max(1, Math.ceil(recipe.processDays / Math.max(0.5, ws.speedMultiplier || 1))),
            batchCount
        });

        window.soundEngine.playClick();
        this.gainXP(80,'processed',1);
        this.addLog(`工坊启动：投入原料加工【${recipe.icon} ${recipe.name}】。`);
        this.saveGame();
        this.updateUI();
    }

    processWorkshopDaily() {
        const remainingLines = [];

        this.state.workshop.runningLines.forEach(line => {
            line.remainingDays -= 1;
            if (line.remainingDays <= 0) {
                const recipe = PROCESSED_GOODS_CONFIG[line.recipeId];
                const adjustedYield = Math.round(line.outputYield * (this.state.workshop.efficiency || 1));
                const added = this.addWarehouseItem(recipe.id, adjustedYield, 85, '优质');
                if (added) {
                    this.addLog(`工坊下线：深加工完成，产出【${recipe.icon} ${recipe.name}】${line.outputYield} kg。`);
                } else {
                    remainingLines.push(line);
                }
            } else {
                remainingLines.push(line);
            }
        });

        this.state.workshop.runningLines = remainingLines;
    }

    // ==========================================
    // 10. 扩建升级与小人升级/策略设置
    // ==========================================
    buyUpgrade(upgradeId) {
        const up = this.state.upgrades.find(u => u.id === upgradeId);
        if (!up || up.unlocked) return;

        if (this.state.cash < up.cost) {
            window.soundEngine.playError();
            alert(`建设资金不足！需要 ¥${up.cost}。`);
            return;
        }

        this.state.cash -= up.cost;
        this.gainXP(120,'upgrades',1);
        this.state.finance.totalExpense += up.cost;
        up.unlocked = true;
        window.soundEngine.playCoin();

        if (up.category === 'land') {
            let newlyUnlocked = 0;
            for (let plot of this.state.plots) {
                if (!plot.unlocked && newlyUnlocked < up.value) {
                    plot.unlocked = true;
                    newlyUnlocked++;
                }
            }
            this.addLog(`农田扩建成功：新增平整 ${newlyUnlocked} 块耕地！`);
            this.resizeCanvas();
        } else if (up.category === 'warehouse') {
            if (up.id === 'cold_storage') {
                this.addLog('冷库改造完成：恒温冷藏系统开启，大幅抑制储藏品质损耗！');
            } else {
                this.state.warehouse.maxWeight += up.value.weight;
                this.state.warehouse.maxSlots += up.value.slots;
                this.addLog(`仓库扩建成功：容量扩充至 ${this.state.warehouse.maxWeight} kg，货架格位增至 ${this.state.warehouse.maxSlots} 格！`);
            }
        } else if (up.category === 'automation') {
            if (up.workshopLevel) {
                const lvl = up.workshopLevel;
                this.state.workshop.level = lvl;
                this.state.workshop.maxSlots = lvl <= 6 ? lvl : (lvl + 2);
                this.state.workshop.batchSize = lvl <= 1 ? 1 : lvl <= 3 ? lvl : lvl <= 5 ? 6 : lvl <= 6 ? 8 : lvl === 7 ? 10 : 14;
                this.state.workshop.speedMultiplier = 1 + Math.min(0.45, (lvl-1)*0.06);
                this.state.workshop.efficiency = 1 + Math.min(0.25, (lvl-1)*0.035);
                this.addLog(`加工厂升级至 Lv.${lvl}：${this.state.workshop.maxSlots} 条产线、单次最多 ${this.state.workshop.batchSize} 批、速度提升。`);
            } else if (up.id === 'workshop_expand') {
                this.state.workshop.maxSlots += 1;
                this.addLog('工坊产线拓宽：深加工并发槽位增加！');
            } else if (up.id === 'greenhouse') {
                this.addLog('温室落成：全天候智能穹顶已覆盖，免疫季节负修正！');
            } else {
                this.rebuildWorkers();
                this.addLog(`自动化设备投产：购买了【${up.name}】，智能农工已部署到田间！`);
            }
        }

        this.saveGame();
        this.updateUI();
    }

    upgradeWorker(workerKey) {
        const conf = this.state.workerUpgrades[workerKey];
        if (!conf) return;

        if (conf.level >= 5) {
            window.soundEngine.playError();
            alert('该小人已升至最高等级 (Lv 5)！');
            return;
        }

        const cost = conf.level * 2500;
        if (this.state.cash < cost) {
            window.soundEngine.playError();
            alert(`升级资金不足！需要 ¥${cost}。`);
            return;
        }

        this.state.cash -= cost;
        this.state.finance.totalExpense += cost;
        conf.level += 1;
        window.soundEngine.playCoin();

        this.rebuildWorkers();
        this.addLog(`自动化工人升级：【${workerKey}】晋升至 Lv ${conf.level}，作业与移动速度提升！`);
        this.saveGame();
        this.updateUI();
    }

    openPlanterConfigModal(planterIndex) {
        this.currentConfiguringPlanterIndex = planterIndex;
        const conf = this.state.workerUpgrades[`planter_${planterIndex}`];
        if (!conf) return;

        document.getElementById('planter-config-title').innerText = `配置自动种植小人 #${planterIndex} 策略`;

        const cropSelect = document.getElementById('planter-crop-select');
        cropSelect.innerHTML = '';
        for (let k in CROPS_CONFIG) {
            const c = CROPS_CONFIG[k];
            const opt = document.createElement('option');
            opt.value = k;
            opt.innerText = `${c.icon} ${c.name}`;
            if (k === conf.assignedCrop) opt.selected = true;
            cropSelect.appendChild(opt);
        }

        document.getElementById('planter-row-select').value = conf.assignedRows || 'all';
        document.getElementById('modal-planter-config').classList.remove('hidden');
    }

    savePlanterConfig() {
        if (!this.currentConfiguringPlanterIndex) return;
        const conf = this.state.workerUpgrades[`planter_${this.currentConfiguringPlanterIndex}`];
        if (conf) {
            conf.assignedCrop = document.getElementById('planter-crop-select').value;
            conf.assignedRows = document.getElementById('planter-row-select').value;
            this.rebuildWorkers();
            this.addLog(`种植小人 #${this.currentConfiguringPlanterIndex} 策略更新：播种【${CROPS_CONFIG[conf.assignedCrop].name}】，管辖范围：${document.getElementById('planter-row-select').options[document.getElementById('planter-row-select').selectedIndex].text}。`);
        }
        document.getElementById('modal-planter-config').classList.add('hidden');
        this.saveGame();
        this.updateUI();
    }

    openHarvesterConfigModal(harvesterIndex) {
        this.currentConfiguringHarvesterIndex = harvesterIndex;
        const conf = this.state.workerUpgrades[`harvester_${harvesterIndex}`];
        if (!conf) return;

        document.getElementById('harvester-config-title').innerText = `配置自动收割小人 #${harvesterIndex} 策略`;
        document.getElementById('harvester-row-select').value = conf.assignedRows || 'all';
        document.getElementById('modal-harvester-config').classList.remove('hidden');
    }

    saveHarvesterConfig() {
        if (!this.currentConfiguringHarvesterIndex) return;
        const conf = this.state.workerUpgrades[`harvester_${this.currentConfiguringHarvesterIndex}`];
        if (conf) {
            conf.assignedRows = document.getElementById('harvester-row-select').value;
            this.rebuildWorkers();
            this.addLog(`收割小人 #${this.currentConfiguringHarvesterIndex} 策略更新，管辖范围：${document.getElementById('harvester-row-select').options[document.getElementById('harvester-row-select').selectedIndex].text}。`);
        }
        document.getElementById('modal-harvester-config').classList.add('hidden');
        this.saveGame();
        this.updateUI();
    }

    isUpgradeUnlocked(upgradeId) {
        const u = this.state.upgrades.find(item => item.id === upgradeId);
        return u ? u.unlocked : false;
    }

    // ==========================================
    // 11. 静态网站本地浏览器存档
    // ==========================================
    saveGame() {
        try {
            // 纯静态部署时不依赖服务器，也不依赖 Android/Auto.js。
            // 所有玩家数据按当前网站 Origin 保存在各自浏览器的 localStorage 中。
            const runtimeOrders = this.multiAgentMarket
                ? (this.multiAgentMarket.playerOrders || [])
                    .filter(o => o && o.remaining > 0)
                    .map(o => ({
                        orderId: o.orderId,
                        agentId: 'PLAYER',
                        productId: o.productId,
                        marketId: o.marketId,
                        side: o.side,
                        price: o.price,
                        quantity: o.quantity,
                        remaining: o.remaining,
                        ts: o.ts,
                        isFutures: false,
                        isPlayer: true
                    }))
                : (this.state.marketRuntime?.playerOrders || []);

            this.state.marketRuntime = {
                playerOrders: runtimeOrders
            };

            const dataStr = JSON.stringify(this.state);
            localStorage.setItem('block_farm_save_data_v3_5', dataStr);
        } catch (e) {
            console.error('本地浏览器存档失败', e);
        }
    }

    loadGame() {
        try {
            const dataStr = localStorage.getItem('block_farm_save_data_v3_5');
            if (dataStr) {
                const parsed = JSON.parse(dataStr);
                if (parsed && parsed.plots && parsed.warehouse && parsed.cash !== undefined) {
                    this.state = parsed;
                    this.migrateState();
                    this.ensureProgression();
                }
            }
        } catch (e) {
            console.warn('读取本地浏览器存档异常，使用初始数据', e);
        }
    }

    // 恢复刷新前仍处于挂单状态的玩家限价单。
    restoreLocalMarketRuntime() {
        const pending = this.state.marketRuntime?.playerOrders;
        if (!this.multiAgentMarket || !Array.isArray(pending) || !pending.length) return;

        this.multiAgentMarket.playerOrders = [];
        pending.forEach(saved => {
            if (!saved || !(saved.remaining > 0)) return;
            const book = this.multiAgentMarket.spotBooks[
                this.multiAgentMarket._bookKey(saved.marketId, saved.productId)
            ];
            if (!book) return;

            const order = {
                orderId: saved.orderId || ('P' + (this.multiAgentMarket.orderSeq++)),
                agentId: 'PLAYER',
                productId: saved.productId,
                marketId: saved.marketId,
                side: saved.side,
                price: Number(saved.price),
                quantity: Math.max(1, Math.floor(saved.quantity || saved.remaining)),
                remaining: Math.max(1, Math.floor(saved.remaining)),
                ts: Number(saved.ts || 0),
                isFutures: false,
                isPlayer: true
            };

            book.addOrder(order);
            this.multiAgentMarket.playerOrders.push(order);

            const numericId = parseInt(String(order.orderId).replace(/^P/, ''), 10);
            if (Number.isFinite(numericId)) {
                this.multiAgentMarket.orderSeq = Math.max(this.multiAgentMarket.orderSeq, numericId + 1);
            }
        });

        // 恢复后立即按正常订单簿规则检查一次是否可成交。
        try { this.multiAgentMarket._matchAll(); } catch (e) {}
        try { this._renderPlayerOrders(); } catch (e) {}
        try { this.refreshMarketQuotesOnly(); } catch (e) {}
    }

    migrateState() {
        if (!this.state.markets) this.state.markets=this.createInitialMarkets();
        MARKETS_CONFIG.forEach(m=>{
            const ms=this.state.markets[m.id]; if(!ms)return;
            ms.demandPressure=ms.demandPressure||{}; ms.supplyPressure=ms.supplyPressure||{}; ms.dailyBuyVolume=ms.dailyBuyVolume||{}; ms.dailySellVolume=ms.dailySellVolume||{}; ms.quotasLeft=ms.quotasLeft||{}; ms.trendBias=ms.trendBias||{}; ms.volatilityBoost=ms.volatilityBoost||{};
            this.getAllMarketProductIds().forEach(id=>{
                if(ms.currentPrices[id]===undefined){const cfg=this.getMarketProductConfig(id);ms.currentPrices[id]=cfg.basePrice||cfg.price;}
                if(ms.yesterdayPrices[id]===undefined) ms.yesterdayPrices[id]=ms.currentPrices[id];
                if(!ms.klineHistory[id]) ms.klineHistory[id]=[];
                ms.demandPressure[id]=ms.demandPressure[id]||0; ms.supplyPressure[id]=ms.supplyPressure[id]||0; ms.dailyBuyVolume[id]=0; ms.dailySellVolume[id]=0; ms.quotasLeft[id]=Infinity; ms.status[id]='normal'; ms.rejectReason[id]='正常流通交易中'; ms.trendBias[id]=Number(ms.trendBias[id]||0); ms.volatilityBoost[id]=Number(ms.volatilityBoost[id]||1);
            });
        });
        if(!this.state.orders)this.state.orders=[]; if(!this.state.futures) this.state.futures={available:[],holdings:[],quotes:{},positions:[],cashSettlement:0}; this.state.futures.quotes=this.state.futures.quotes||{}; this.state.futures.positions=this.state.futures.positions||this.state.futures.holdings||[]; this.state.futures.holdings=this.state.futures.positions;  if(!this.state.news)this.state.news=[]; if(!this.state.marketFactors)this.state.marketFactors={};
        this.currentSpotCategory=this.currentSpotCategory||'agri'; this.currentSpotProductId=this.currentSpotProductId||{agri:'wheat',goods:null};
        if(!this.state.farmPage)this.state.farmPage=0;
        this.state.workshop=this.state.workshop||{level:1,maxSlots:1,batchSize:1,speedMultiplier:1,efficiency:1,runningLines:[]};
        this.state.workshop.level=this.state.workshop.level||1;this.state.workshop.maxSlots=this.state.workshop.maxSlots||1;this.state.workshop.batchSize=this.state.workshop.batchSize||1;this.state.workshop.speedMultiplier=this.state.workshop.speedMultiplier||1;this.state.workshop.efficiency=this.state.workshop.efficiency||1;this.state.workshop.runningLines=this.state.workshop.runningLines||[]; if(!this.state.futures)this.state.futures={available:[],holdings:[],quotes:{},positions:[],cashSettlement:0}; this.state.futures.quotes=this.state.futures.quotes||{}; this.state.futures.positions=this.state.futures.positions||this.state.futures.holdings||[]; this.state.futures.holdings=this.state.futures.positions; if(!this.state.warehouse.capacityUpgradeCap)this.state.warehouse.capacityUpgradeCap=1000000;
        const maxWeight=this.state.warehouse.maxWeight||600; if(maxWeight>1000000)this.state.warehouse.maxWeight=1000000;
        while(this.state.plots.length < 1000) { const i=this.state.plots.length; this.state.plots.push({id:i,unlocked:false,crop:null,soilFertility:80,soilWater:60,weeds:0,pests:0,consecutiveCropsCount:0,lastHarvestedCropId:null}); }
        if(this.state.plots.length>1000)this.state.plots.length=1000;
        if(!this.state.upgrades)this.state.upgrades=JSON.parse(JSON.stringify(UPGRADES_CONFIG));
        UPGRADES_CONFIG.forEach(def=>{if(!this.state.upgrades.some(x=>x.id===def.id))this.state.upgrades.push(JSON.parse(JSON.stringify(def)));});
        // 老存档若已经购买旧仓库升级，则按当前上限自动修正到不超过100万kg。
        if(this.state.warehouse.maxWeight>this.state.warehouse.capacityUpgradeCap)this.state.warehouse.maxWeight=this.state.warehouse.capacityUpgradeCap;
        if(Object.keys(this.state.futures.quotes).length===0)this.generateDailyFuturesContracts();
        Object.values(this.state.futures.quotes).forEach(q=>{
            if(!Array.isArray(q.history) || q.history.length<8){
                const kh=this.state.markets?.local?.klineHistory?.[q.productId]||[];
                q.history=kh.slice(-60).map(x=>({open:x.open,high:x.high,low:x.low,close:x.close,day:x.day}));
            }
            q.maintenanceMarginRate=q.maintenanceMarginRate||0.08;
        });
        this.ensureProgression();
    }

    clearSave() {
        if (confirm('确认清空重置农场经营数据并删除本地浏览器存档吗？')) {
            localStorage.removeItem('block_farm_save_data_v3_5');

            this.state = this.getInitialState();
            this.state.marketRuntime = { playerOrders: [] };

            if (this.multiAgentMarket) {
                this.multiAgentMarket.playerOrders = [];
                Object.values(this.multiAgentMarket.spotBooks || {}).forEach(book => {
                    book.bids = book.bids.filter(o => !o.isPlayer);
                    book.asks = book.asks.filter(o => !o.isPlayer);
                });
            }

            this.rebuildWorkers();
            this.saveGame();
            this.updateUI();
            this.addLog('农场已重置，本地浏览器存档已重新初始化。');
        }
    }

    checkOfflineProgress() {
        const now = Date.now();
        const last = this.state.time.lastRealTimestamp || now;
        const elapsedSec = Math.floor((now - last) / 1000);

        if (elapsedSec > 60) {
            const daysToSimulate = Math.min(5, Math.floor(elapsedSec / this.dayDurationRealSec));
            if (daysToSimulate > 0) {
                for (let d = 0; d < daysToSimulate; d++) {
                    this.progressNewDay();
                }
                this.addLog(`离线结算：离开期间农场平稳运转了 ${daysToSimulate} 个游戏日。`);
            }
        }
        this.state.time.lastRealTimestamp = Date.now();
    }

    addLog(msg) {
        const timeStr = `${this.state.time.year}年${SEASONS[this.state.time.seasonIndex]}季${this.state.time.day}日`;
        this.state.logs.unshift({ time: timeStr, text: msg });
        if (this.state.logs.length > 50) this.state.logs.pop();
        this.renderLogs();
        this.renderNewsLogModal();
    }

    // ==========================================
    // 12. Canvas 2D 农田与工人渲染 (含停工诊断气泡)
    // ==========================================
    setupCanvas() {
        this.canvas = document.getElementById('farm-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        let lastCanvasPointer = 0;
        const handleCanvasPointer = (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            const now = Date.now();
            if (now - lastCanvasPointer < 180) return;
            lastCanvasPointer = now;
            const rect = this.canvas.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            this.handleCanvasClick(clickX, clickY);
        };
        if (window.PointerEvent) {
            this.canvas.addEventListener('pointerup', handleCanvasPointer, {passive:true});
        } else {
            this.canvas.addEventListener('click', handleCanvasPointer);
        }
    }

    resizeCanvas() {
        if (!this.canvas) return;
        const container = document.getElementById('canvas-scroll-container');
        if (!container || !this.ctx) return;
        const width = Math.max(1, container.clientWidth || container.getBoundingClientRect().width || window.innerWidth || 1);
        const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));

        const cols = 4;
        const pageSize = this.farmPageSize || 48;
        const rows = Math.ceil(pageSize / cols);
        const padding = 10;
        const plotSize = Math.floor((width - padding * (cols + 1)) / cols);
        const totalHeight = padding * 2 + rows * (plotSize + padding) + 60;

        this.canvas.width = Math.max(1, Math.floor(width * dpr));
        this.canvas.height = Math.max(1, Math.floor(totalHeight * dpr));
        this.canvas.style.width = '100%';
        this.canvas.style.height = `${totalHeight}px`;
        this.ctx.setTransform(dpr,0,0,dpr,0,0);

        this.currentPlotSize = plotSize;
        this.currentCols = cols;
        this.currentRows = rows;
        this.currentPadding = padding;
    }

    renderCanvas() {
        if (!this.ctx) return;
        const container = document.getElementById('canvas-scroll-container');
        const width = container.clientWidth;
        const cols = this.currentCols || 4;
        const rows = this.currentRows || Math.ceil((this.farmPageSize||48) / cols);
        const padding = this.currentPadding || 10;
        const plotSize = this.currentPlotSize || 75;
        const totalHeight = padding * 2 + rows * (plotSize + padding) + 60;

        const seasonBgColors = ['#232a24', '#2b2c20', '#2d271e', '#1e2329'];
        this.ctx.fillStyle = seasonBgColors[this.state.time.seasonIndex];
        this.ctx.fillRect(0, 0, width, totalHeight);

        this.plotLayout = [];
        const totalPages = Math.max(1, Math.ceil(this.state.plots.length / (this.farmPageSize || 48)));
        this.farmPage = Math.max(0, Math.min(this.farmPage || 0, totalPages - 1));
        const startIndex = this.farmPage * (this.farmPageSize || 48);
        const endIndex = Math.min(this.state.plots.length, startIndex + (this.farmPageSize || 48));
        for (let i = startIndex; i < endIndex; i++) {
            const plot = this.state.plots[i];
            if (!plot) continue;
            const localIndex = i - startIndex;
            const c = localIndex % cols;
            const r = Math.floor(localIndex / cols);
            const x = padding + c * (plotSize + padding);
            const y = 30 + padding + r * (plotSize + padding);

            this.plotLayout.push({ x, y, size: plotSize, plotIndex: i });

            if (!plot.unlocked) {
                this.ctx.fillStyle = '#1a1d24';
                this.ctx.strokeStyle = '#282d38';
                this.ctx.lineWidth = 1.5;
                this.roundRect(this.ctx, x, y, plotSize, plotSize, 6, true, true);

                this.ctx.fillStyle = '#4c566a';
                this.ctx.font = '10px sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('荒芜地块', x + plotSize / 2, y + plotSize / 2);
                this.ctx.font = '8px sans-serif';
                this.ctx.fillText('未开拓', x + plotSize / 2, y + plotSize / 2 + 13);
                continue;
            }

            const drynessRatio = 1 - (plot.soilWater / 100);
            this.ctx.fillStyle = drynessRatio > 0.6 ? '#54422e' : '#3d2c1d';
            this.ctx.strokeStyle = (i === this.selectedPlotIndex) ? '#88c0d0' : '#2c1e13';
            this.ctx.lineWidth = (i === this.selectedPlotIndex) ? 2.5 : 1;
            this.roundRect(this.ctx, x, y, plotSize, plotSize, 6, true, true);

            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            this.ctx.font = '9px sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`#${i + 1}`, x + 4, y + 11);

            if (plot.crop) {
                const cropCfg = CROPS_CONFIG[plot.crop.cropId];
                const cx = x + plotSize / 2;
                const cy = y + plotSize / 2;

                if (plot.crop.stage === 'seed') {
                    this.ctx.fillStyle = '#ebcb8b';
                    this.ctx.beginPath();
                    this.ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (plot.crop.stage === 'sprout') {
                    this.ctx.fillStyle = '#a3be8c';
                    this.ctx.fillRect(cx - 2.5, cy - 6, 5, 12);
                } else if (plot.crop.stage === 'fruiting') {
                    this.ctx.fillStyle = '#8fbcbb';
                    this.ctx.fillRect(cx - 5, cy - 8, 10, 16);
                    this.ctx.fillStyle = cropCfg.color;
                    this.ctx.beginPath();
                    this.ctx.arc(cx, cy - 5, 5, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (plot.crop.stage === 'mature') {
                    this.ctx.fillStyle = cropCfg.color;
                    this.ctx.beginPath();
                    this.ctx.arc(cx, cy - 2, plotSize * 0.26, 0, Math.PI * 2);
                    this.ctx.fill();

                    this.ctx.strokeStyle = '#ebcb8b';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();

                    this.ctx.fillStyle = '#2e3440';
                    this.ctx.font = 'bold 9px sans-serif';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(cropCfg.icon, cx, cy + 3);
                }

                const barW = plotSize - 10;
                const barH = 3.5;
                const bx = x + 5;
                const by = y + plotSize - 8;
                this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
                this.ctx.fillRect(bx, by, barW, barH);
                this.ctx.fillStyle = (plot.crop.stage === 'mature') ? '#a3be8c' : '#81a1c1';
                this.ctx.fillRect(bx, by, (Math.min(100, plot.crop.growth) / 100) * barW, barH);
            } else {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                this.ctx.font = '10px sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('空闲', x + plotSize / 2, y + plotSize / 2 + 3);
            }

            if (plot.weeds > 20) {
                this.ctx.fillStyle = '#a3be8c';
                this.ctx.font = '10px sans-serif';
                this.ctx.textAlign = 'right';
                this.ctx.fillText('🌿', x + plotSize - 3, y + 13);
            }
            if (plot.pests > 20) {
                this.ctx.fillStyle = '#bf616a';
                this.ctx.font = '10px sans-serif';
                this.ctx.textAlign = 'right';
                this.ctx.fillText('🐛', x + plotSize - 3, y + 25);
            }
        }

        const pageInfo=document.getElementById('farm-page-info');
        if(pageInfo) pageInfo.innerText=`第 ${this.farmPage+1} / ${totalPages} 页 · ${Math.min(this.farmPageSize||48,this.state.plots.length)} 地块/页`;
        const prev=document.getElementById('farm-page-prev'), next=document.getElementById('farm-page-next');
        if(prev) prev.disabled=this.farmPage<=0;
        if(next) next.disabled=this.farmPage>=totalPages-1;
        this.renderWorkers(this.ctx);
    }

    renderWorkers(ctx) {
        this.workers.forEach(w => {
            const wx = w.x;
            const wy = w.y + (w.state === 'walking' ? Math.sin(w.bobAnim) * 2 : 0);

            ctx.fillStyle = w.color;
            ctx.beginPath();
            ctx.arc(wx, wy - 9, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = w.color;
            ctx.fillRect(wx - 4, wy - 4, 8, 9);

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(wx - 2, wy - 11, 4, 2);

            // 如果正在作业，显示作业中气泡
            if (w.state === 'working') {
                const bubbleW = 72;
                const bubbleH = 16;
                const bx = wx - bubbleW / 2;
                const by = wy - 28;

                ctx.fillStyle = 'rgba(24, 27, 36, 0.9)';
                ctx.strokeStyle = w.color;
                ctx.lineWidth = 1;
                this.roundRect(ctx, bx, by, bubbleW, bubbleH, 4, true, true);

                ctx.fillStyle = '#eceff4';
                ctx.font = '9px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(w.label, wx, by + 11);
            } else if (w.state === 'idle') {
                // 如果闲置停工，在头顶显示停工原因气泡 (黄色/红色警示)
                const text = w.idleReason || '待命中';
                const textWidth = Math.max(65, text.length * 11 + 10);
                const bubbleH = 15;
                const bx = wx - textWidth / 2;
                const by = wy - 26;

                const isWarning = text.includes('缺少') || text.includes('满仓');
                ctx.fillStyle = isWarning ? 'rgba(191, 97, 106, 0.85)' : 'rgba(46, 52, 64, 0.8)';
                ctx.strokeStyle = isWarning ? '#bf616a' : '#4c566a';
                ctx.lineWidth = 1;
                this.roundRect(ctx, bx, by, textWidth, bubbleH, 4, true, true);

                ctx.fillStyle = '#ffffff';
                ctx.font = '9px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(text, wx, by + 11);
            }
        });
    }

    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (fill) ctx.fill();
        if (stroke) ctx.stroke();
    }

    handleCanvasClick(x, y) {
        if (!this.plotLayout) return;
        for (let item of this.plotLayout) {
            if (x >= item.x && x <= item.x + item.size && y >= item.y && y <= item.y + item.size) {
                const plot = this.state.plots[item.plotIndex];
                if (plot.unlocked) {
                    this.selectedPlotIndex = item.plotIndex;
                    window.soundEngine.playClick();
                    this.openPlotActionCard(item.plotIndex);
                } else {
                    window.soundEngine.playError();
                    alert(`地块 #${item.plotIndex + 1} 尚未开拓，请在“扩建”面板投资开拓农田！`);
                }
                break;
            }
        }
    }

    // ==========================================
    // 13. UI 视图数据联动
    // ==========================================
    updateUI() {
        this.updateTopBarUI();
        this.renderProgressionUI();
        this.renderPlotActionCard();
        this.renderMarketUI();
        this.renderSuppliesUI();
        this.renderFuturesUI();
        this.renderPendingContractsModal();
        this.renderOrdersUI();
        this.renderWarehouseUI();
        this.renderWorkshopUI();
        this.renderExpansionUI();
        this.renderFinanceUI();
        this.renderLogs();
        this.renderNewsLogModal();
    }

    updateTopBarUI() {
        const t = this.state.time;
        document.getElementById('display-date').innerText = `第 ${t.year} 年 · ${SEASONS[t.seasonIndex]} · 第 ${t.day} 天`;
        const pad = (n) => (n < 10 ? '0' + n : n);
        document.getElementById('display-time').innerText = `${pad(t.hour)}:${pad(t.minute)}`;
        document.getElementById('display-weather').innerText = `${this.state.weather.icon} ${this.state.weather.name}`;
        document.getElementById('display-cash').innerText = `💰 ¥${this.state.cash.toLocaleString()}`;

        const badge = document.getElementById('floating-contract-badge');
        if (badge) {
            badge.innerText = this.state.futures.positions ? this.state.futures.positions.length : this.state.futures.holdings.length;
        }
        const newsBadge=document.getElementById('floating-news-badge');
        if(newsBadge) newsBadge.innerText=(this.state.news||[]).length;
    }

    openPlotActionCard(index) {
        this.selectedPlotIndex = index;
        const card = document.getElementById('plot-action-card');
        card.classList.remove('hidden');
        this.renderPlotActionCard();
    }

    renderPlotActionCard() {
        if (this.selectedPlotIndex === -1) return;
        const plot = this.state.plots[this.selectedPlotIndex];
        document.getElementById('selected-plot-title').innerText = `地块 #${plot.id + 1} 精细照料`;

        if (plot.crop) {
            const cropCfg = CROPS_CONFIG[plot.crop.cropId];
            document.getElementById('plot-crop-name').innerText = `${cropCfg.icon} ${cropCfg.name} (${plot.crop.stage})`;
            document.getElementById('plot-growth-text').innerText = `${Math.min(100, Math.floor(plot.crop.growth))}%`;

            const grade = this.getQualityGrade(plot.crop.careScore);
            const gradeEl = document.getElementById('plot-quality-text');
            gradeEl.innerText = grade;
            gradeEl.className = this.getQualityClass(grade);

            const yieldEstimate = Math.round(cropCfg.baseYield * (0.7 + (plot.soilFertility / 100) * 0.5));
            document.getElementById('plot-yield-text').innerText = `约 ${yieldEstimate} kg`;

            document.getElementById('btn-action-plant').disabled = true;
            document.getElementById('btn-action-harvest').disabled = (plot.crop.stage !== 'mature');
        } else {
            document.getElementById('plot-crop-name').innerText = '未播种 (休耕)';
            document.getElementById('plot-growth-text').innerText = '0%';
            const gradeEl = document.getElementById('plot-quality-text');
            gradeEl.innerText = '-';
            gradeEl.className = '';
            document.getElementById('plot-yield-text').innerText = '0 kg';

            document.getElementById('btn-action-plant').disabled = false;
            document.getElementById('btn-action-harvest').disabled = true;
        }

        document.getElementById('plot-fertility-text').innerText = plot.soilFertility;
        document.getElementById('plot-water-text').innerText = `${plot.soilWater}%`;
        document.getElementById('plot-weed-text').innerText = plot.weeds > 0 ? `${plot.weeds}% (丛生)` : '整洁';
        document.getElementById('plot-pest-text').innerText = plot.pests > 0 ? `${plot.pests}% (受害)` : '无虫';
    }

    _drawLiveSpotChart(marketId, prodId, curPrice) {
        const iv = this.currentSpotKlineInterval || '1s';
        let klines;
        if (iv === 'day') {
            klines = this.state.markets?.[marketId]?.klineHistory?.[prodId] || [];
        } else if (this.multiAgentMarket) {
            klines = this.multiAgentMarket.getTickKlines(marketId, prodId, iv);
        } else {
            klines = [];
        }
        if ((!klines || !klines.length) && curPrice != null) {
            klines = [{ open: curPrice, high: curPrice, low: curPrice, close: curPrice, volume: 0, ts: Date.now() }];
        }
        const last = klines[klines.length - 1] || {};
        const key = `spot|${marketId}|${prodId}|${iv}|${klines.length}|${last.close}|${last.volume}`;
        if (key === this._lastChartDrawKey) return;
        this._lastChartDrawKey = key;
        this.drawMarketChart(klines, curPrice, 'market-chart');
        const nameEl = document.getElementById('market-product-name');
        if (nameEl) {
            const ivLabel = { '1s': '1秒', '5s': '5秒', '10s': '10秒', day: '日线' }[iv] || iv;
            nameEl.innerText = `${this.getItemIcon(prodId)} ${this.getItemName(prodId)} 现货K线 · ${ivLabel}`;
        }
    }

    _drawLiveFutChart(prodId, curPrice) {
        const iv = this.currentFutKlineInterval || '1s';
        let klines;
        if (iv === 'day') {
            klines = this.state.futures?.quotes?.[prodId]?.history || [];
        } else if (this.multiAgentMarket) {
            klines = this.multiAgentMarket.getFutTickKlines(prodId, iv);
        } else {
            klines = [];
        }
        if ((!klines || !klines.length) && curPrice != null) {
            klines = [{ open: curPrice, high: curPrice, low: curPrice, close: curPrice, volume: 0, ts: Date.now() }];
        }
        const last = klines[klines.length - 1] || {};
        const key = `fut|${prodId}|${iv}|${klines.length}|${last.close}|${last.volume}`;
        if (key === this._lastFutChartDrawKey) return;
        this._lastFutChartDrawKey = key;
        this.drawMarketChart(klines, curPrice, 'future-chart');
    }

    // 轻量刷新价格/盘口，有新K线时更新图表
    refreshMarketQuotesOnly() {
        const spotTab = document.getElementById('tab-market');
        const futTab = document.getElementById('tab-futures');
        if (spotTab && spotTab.classList.contains('active')) {
            const marketId = document.getElementById('market-select')?.value || MARKETS_CONFIG[0].id;
            const prodId = document.getElementById('crop-market-select')?.value || Object.keys(CROPS_CONFIG)[0];
            const marketData = this.state.markets[marketId];
            if (!marketData) return;
            const curPrice = marketData.currentPrices[prodId];
            const yestPrice = marketData.yesterdayPrices[prodId] || curPrice;
            const pct = yestPrice ? (((curPrice - yestPrice) / yestPrice) * 100).toFixed(1) : '0.0';
            const unit = this.getMarketUnit(prodId);
            const priceEl = document.getElementById('market-price-val');
            const chEl = document.getElementById('market-change-val');
            if (priceEl) priceEl.innerText = `¥${Number(curPrice).toFixed(2)} / ${unit}`;
            if (chEl) {
                chEl.innerText = `${Number(pct) >= 0 ? '+' + pct : pct}%`;
                chEl.style.color = Number(pct) >= 0 ? '#bf616a' : '#a3be8c';
            }
            this._renderSpotOrderBook(marketId, prodId);
            const regionEl = document.getElementById('market-region-news');
            if (regionEl && this.multiAgentMarket) {
                const ev = this.multiAgentMarket.getRegionEvent(marketId);
                const mname = (MARKETS_CONFIG.find(m => m.id === marketId) || {}).name || marketId;
                regionEl.innerText = ev
                    ? `🏛 ${mname} · ${ev.title}：${ev.desc}`
                    : `🏛 ${mname} · 做市商与农户持续挂单成交中`;
            }
            // 价格变化则刷新秒级K线
            this._drawLiveSpotChart(marketId, prodId, curPrice);
        }
        if (futTab && futTab.classList.contains('active') && this.multiAgentMarket) {
            const prodId = document.getElementById('future-product-select')?.value
                || this.currentFutureProductId
                || Object.keys(CROPS_CONFIG)[0];
            const q = this.state.futures?.quotes?.[prodId];
            if (q) {
                const priceEl = document.getElementById('future-price-val');
                if (priceEl) priceEl.innerText = `¥${Number(q.price).toFixed(2)}/${this.getMarketUnit(prodId)}`;
                const prev = q.previousPrice || q.price;
                const ch = ((q.price - prev) / Math.max(prev, 0.01)) * 100;
                const chEl = document.getElementById('future-change-val');
                if (chEl) {
                    chEl.innerText = `${ch >= 0 ? '+' : ''}${ch.toFixed(2)}%`;
                    chEl.style.color = ch >= 0 ? '#bf616a' : '#a3be8c';
                }
                let basisRef = this.getRawMarketPrice(prodId, 'local');
                const a = this.multiAgentMarket._multiMarketSpotAnchor(prodId);
                if (a) basisRef = a;
                const basis = ((q.price - basisRef) / Math.max(basisRef, 0.01) * 100);
                const metric = document.getElementById('future-basis-val');
                if (metric) metric.innerText = `${basis >= 0 ? '+' : ''}${basis.toFixed(2)}%`;
                const vol = document.getElementById('future-volume-val');
                if (vol) vol.innerText = (q.volume || 0).toLocaleString();
                const oi = document.getElementById('future-oi-val');
                if (oi) oi.innerText = (q.openInterest || 0).toLocaleString();
            }
            this._renderFutOrderBook(prodId);
            if (q) this._drawLiveFutChart(prodId, q.price);
        }
    }

    _renderSpotOrderBook(marketId, prodId) {
        if (!this.multiAgentMarket) return;
        const snap = this.multiAgentMarket.getOrderBookSnapshot(marketId, prodId);
        const asksEl = document.getElementById('spot-asks-list');
        const bidsEl = document.getElementById('spot-bids-list');
        const lastEl = document.getElementById('spot-last-trade');
        const spreadEl = document.getElementById('spot-spread');
        const bidQtyEl = document.getElementById('spot-bid-qty');
        const askQtyEl = document.getElementById('spot-ask-qty');
        const tapeEl = document.getElementById('spot-trade-tape');
        if (!asksEl || !bidsEl) return;
        const asks = (snap.asks || []).slice().reverse();
        asksEl.innerHTML = asks.map(r => `<div class="ob-row ask"><span>${r.price.toFixed(2)}</span><span>${Math.round(r.qty)}</span></div>`).join('') || '<div class="ob-row ask">暂无挂单</div>';
        bidsEl.innerHTML = (snap.bids || []).map(r => `<div class="ob-row bid"><span>${r.price.toFixed(2)}</span><span>${Math.round(r.qty)}</span></div>`).join('') || '<div class="ob-row bid">暂无挂单</div>';
        if (lastEl) lastEl.innerText = snap.last != null ? `¥${Number(snap.last).toFixed(2)} × ${snap.lastQty || 0}` : '等待成交';
        const bestBid = snap.bids && snap.bids[0] ? snap.bids[0].price : null;
        const bestAsk = snap.asks && snap.asks[0] ? snap.asks[0].price : null;
        if (spreadEl) {
            if (bestBid != null && bestAsk != null) spreadEl.innerText = `价差 ${(bestAsk - bestBid).toFixed(2)}`;
            else spreadEl.innerText = '价差 —';
        }
        if (bidQtyEl) bidQtyEl.innerText = Math.round(snap.bidQty || 0);
        if (askQtyEl) askQtyEl.innerText = Math.round(snap.askQty || 0);
        if (tapeEl) {
            const rows = (snap.trades || []).map(t => {
                return `<div class="tape-row"><span>${Number(t.price).toFixed(2)}</span><span>×${t.qty}</span></div>`;
            }).join('');
            tapeEl.innerHTML = rows || '<div class="tape-row">暂无成交</div>';
        }
    }

    _renderFutOrderBook(prodId) {
        if (!this.multiAgentMarket) return;
        const snap = this.multiAgentMarket.getFuturesBookSnapshot(prodId);
        const asksEl = document.getElementById('fut-asks-list');
        const bidsEl = document.getElementById('fut-bids-list');
        if (!asksEl || !bidsEl) return;
        const asks = (snap.asks || []).slice().reverse();
        asksEl.innerHTML = asks.map(r => `<div class="ob-row ask"><span>${r.price.toFixed(2)}</span><span>${Math.round(r.qty)}</span></div>`).join('') || '<div class="ob-row ask">暂无</div>';
        bidsEl.innerHTML = (snap.bids || []).map(r => `<div class="ob-row bid"><span>${r.price.toFixed(2)}</span><span>${Math.round(r.qty)}</span></div>`).join('') || '<div class="ob-row bid">暂无</div>';
        const lastEl = document.getElementById('fut-last-trade');
        if (lastEl) lastEl.innerText = snap.last != null ? `¥${Number(snap.last).toFixed(2)} × ${snap.lastQty || 0}` : '等待成交';
        const spreadEl = document.getElementById('fut-spread');
        if (spreadEl) {
            const basisPct = (snap.basis || 0) * 100;
            spreadEl.innerText = `基差 ${basisPct >= 0 ? '+' : ''}${basisPct.toFixed(2)}%`;
        }
        const bidQtyEl = document.getElementById('fut-bid-qty');
        const askQtyEl = document.getElementById('fut-ask-qty');
        if (bidQtyEl) bidQtyEl.innerText = Math.round(snap.bidQty || 0);
        if (askQtyEl) askQtyEl.innerText = Math.round(snap.askQty || 0);
        const tapeEl = document.getElementById('fut-trade-tape');
        if (tapeEl) {
            tapeEl.innerHTML = (snap.trades || []).map(t =>
                `<div class="tape-row"><span>${Number(t.price).toFixed(2)}</span><span>×${t.qty}</span></div>`
            ).join('') || '<div class="tape-row">暂无成交</div>';
        }
        const anchorEl = document.getElementById('future-region-anchor');
        if (anchorEl && this.multiAgentMarket) {
            const anchor = this.multiAgentMarket._multiMarketSpotAnchor(prodId);
            const parts = MARKETS_CONFIG.map(m => {
                const p = this.state.markets && this.state.markets[m.id] && this.state.markets[m.id].currentPrices
                    ? this.state.markets[m.id].currentPrices[prodId] : null;
                return p != null ? `${m.name.slice(0, 4)} ${Number(p).toFixed(1)}` : null;
            }).filter(Boolean);
            anchorEl.innerText = anchor != null
                ? `期货锚定多市场加权现货 ¥${anchor.toFixed(2)} ｜ ${parts.join(' · ')}`
                : '期货锚定：等待各市场成交';
        }
    }

    renderMarketUI() {
        const marketSelect=document.getElementById('market-select');
        const prodSelect=document.getElementById('crop-market-select');
        if(!this.currentSpotCategory)this.currentSpotCategory='agri';
        if(marketSelect.children.length===0){MARKETS_CONFIG.forEach(m=>{const o=document.createElement('option');o.value=m.id;o.innerText=m.name;marketSelect.appendChild(o);});marketSelect.addEventListener('change',()=>this.renderMarketDetail());}
        const previousProduct = this.currentSpotProductId?.[this.currentSpotCategory] || prodSelect.value;
        prodSelect.innerHTML='';
        this.getAllMarketProductIds().filter(id=>this.getMarketCategory(id)===this.currentSpotCategory).forEach(id=>{const o=document.createElement('option');o.value=id;o.innerText=`${this.getItemIcon(id)} ${this.getItemName(id)}`;prodSelect.appendChild(o);});
        const keep = [...prodSelect.options].some(o => o.value === previousProduct);
        prodSelect.value = keep ? previousProduct : (prodSelect.options[0]?.value||'');
        this.currentSpotProductId[this.currentSpotCategory] = prodSelect.value;
        if(!prodSelect.dataset.bound){prodSelect.addEventListener('change',()=>{ this.currentSpotProductId[this.currentSpotCategory]=prodSelect.value; this.renderMarketDetail(); });prodSelect.dataset.bound='1';}
        document.querySelectorAll('.spot-category-btn').forEach(b=>{b.classList.toggle('active',b.dataset.category===this.currentSpotCategory);});
        if (!this._klineIvBound) {
            this._klineIvBound = true;
            document.getElementById('spot-kline-intervals')?.addEventListener('click', (e) => {
                const btn = e.target.closest('.kline-iv-btn');
                if (!btn) return;
                this.currentSpotKlineInterval = btn.dataset.iv || '1s';
                document.querySelectorAll('#spot-kline-intervals .kline-iv-btn').forEach(b => b.classList.toggle('active', b === btn));
                this._lastChartDrawKey = '';
                this.refreshMarketQuotesOnly();
            });
            document.getElementById('fut-kline-intervals')?.addEventListener('click', (e) => {
                const btn = e.target.closest('.kline-iv-btn');
                if (!btn) return;
                this.currentFutKlineInterval = btn.dataset.iv || '1s';
                document.querySelectorAll('#fut-kline-intervals .kline-iv-btn').forEach(b => b.classList.toggle('active', b === btn));
                this._lastChartDrawKey = '';
                this.refreshMarketQuotesOnly();
            });
        }
        this.renderMarketDetail();
    }

    renderMarketDetail() {
        const marketId = document.getElementById('market-select').value || MARKETS_CONFIG[0].id;
        const prodId = document.getElementById('crop-market-select').value || Object.keys(CROPS_CONFIG)[0];
        const marketData = this.state.markets[marketId];

        const curPrice = marketData.currentPrices[prodId];
        const yestPrice = marketData.yesterdayPrices[prodId];
        const pct = (((curPrice - yestPrice) / yestPrice) * 100).toFixed(1);

        document.getElementById('market-product-name').innerText = `${this.getItemIcon(prodId)} ${this.getItemName(prodId)} 现货K线走势`;
        const unit=this.getMarketUnit(prodId);
        document.getElementById('market-price-val').innerText = `¥${curPrice} / ${unit}`;
        document.getElementById('market-change-val').innerText = `${pct >= 0 ? '+' + pct : pct}%`;
        document.getElementById('market-change-val').style.color = pct >= 0 ? '#bf616a' : '#a3be8c';

        // 订单簿 / 订单流（来自多智能体撮合，价格=最新成交）
        this._renderSpotOrderBook(marketId, prodId);
        const regionEl = document.getElementById('market-region-news');
        if (regionEl && this.multiAgentMarket) {
            const ev = this.multiAgentMarket.getRegionEvent(marketId);
            const mname = (MARKETS_CONFIG.find(m => m.id === marketId) || {}).name || marketId;
            regionEl.innerText = ev
                ? `🏛 ${mname} · ${ev.title}：${ev.desc}`
                : `🏛 ${mname} · 暂无突发区域新闻/政策（各市场独立事件池）`;
        }


        const status = marketData.status[prodId] || 'normal';
        const badge = document.getElementById('market-status-badge');
        const rejectBox = document.getElementById('market-reject-reason-box');

        badge.innerText = status === 'hot' ? '🔥 交易活跃' : '∞ 不限额连续交易';
        badge.style.background = status === 'hot' ? '#d08770' : '#a3be8c';
        rejectBox.classList.remove('hidden');
        const factors=this.state.marketFactors?.[prodId]||{}; const topFactors=Object.entries(factors).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,5).map(x=>`${x[0]} ${x[1]>=0?'+':''}${(x[1]*100).toFixed(1)}%`).join(' · ');
        rejectBox.innerText = `📊 ${marketData.rejectReason[prodId] || '供需正常'} · 主要影响因子：${topFactors||'暂无'}。`;
        document.getElementById('market-quota-val').innerText = '不限额';
        const netFlow=(marketData.dailyBuyVolume[prodId]||0)-(marketData.dailySellVolume[prodId]||0);
        document.getElementById('market-supply-demand-val').innerText = netFlow>0 ? `需求偏强 +${netFlow}kg` : netFlow<0 ? `供应偏强 ${netFlow}kg` : '供需平衡';

        const items = this.state.warehouse.items.filter(it => it.cropId === prodId);
        const freeStock = items.reduce((s, it) => s + (it.quantity - it.reservedForContract), 0);
        document.getElementById('trade-warehouse-avail').innerText = `${freeStock} ${this.getMarketUnit(prodId)}`;

        this._lastChartDrawKey = '';
        this._drawLiveSpotChart(marketId, prodId, curPrice);
    }

    renderSuppliesUI() {
        const container = document.getElementById('supplies-item-list');
        if (!container) return;
        container.innerHTML = '';

        const cat = this.currentSuppliesTab;
        const items = (cat === 'tools') ? SUPPLIES_CONFIG.tools : SUPPLIES_CONFIG.seeds;

        items.forEach(it => {
            const stock = this.getWarehouseItemCount(it.id);
            const div = document.createElement('div');
            div.className = 'supplies-card';
            div.innerHTML = `
                <div class="card-details">
                    <span class="card-main-title">${it.icon} ${it.name} <small style="color:#81a1c1;">(库存: ${stock})</small></span>
                    <span>功能：${it.desc}</span>
                    <span>单价：<b class="highlight">¥${it.price}</b></span>
                </div>
                <div class="supplies-buy-row">
                    <input type="number" min="1" max="999" value="1" id="buy-qty-${it.id}" class="input-qty">
                    <button class="btn btn-primary" onclick="gameEngine.triggerBuySupply('${it.id}', '${it.itemType}')">买入</button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    triggerBuySupply(itemId, itemType) {
        const inputEl = document.getElementById(`buy-qty-${itemId}`);
        const qty = inputEl ? inputEl.value : 1;
        this.buySupplyItem(itemId, itemType, qty);
    }

    renderFuturesUI() {
        const availList = document.getElementById('available-futures-list');
        const holdList = document.getElementById('holding-futures-list');
        if (!availList || !holdList) return;
        availList.innerHTML = '';
        holdList.innerHTML = '';
        const quotes = Object.values(this.state.futures.quotes || {});
        if (!quotes.length) return;
        if (!quotes.some(q => q.productId === this.currentFutureProductId)) {
            this.currentFutureProductId = quotes[0].productId;
        }
        const selected = quotes.find(q => q.productId === this.currentFutureProductId) || quotes[0];
        const cfg = this.getMarketProductConfig(selected.productId);
        const ch = ((selected.price - selected.previousPrice) / Math.max(selected.previousPrice, 0.01) * 100);
        const selEl = document.getElementById('future-product-select');
        if (selEl) {
            selEl.innerHTML = quotes.map(q => {
                const c = this.getMarketProductConfig(q.productId);
                return `<option value="${q.productId}" ${q.productId === this.currentFutureProductId ? 'selected' : ''}>${this.getItemIcon(q.productId)} ${c.name}</option>`;
            }).join('');
            if (!selEl.dataset.bound) {
                selEl.addEventListener('change', () => {
                    this.currentFutureProductId = selEl.value;
                    this.renderFuturesUI();
                });
                selEl.dataset.bound = '1';
            }
        }
        const nameEl = document.getElementById('future-product-name');
        if (nameEl) nameEl.innerText = `${cfg.icon} ${cfg.name} 期货`;
        const priceEl = document.getElementById('future-price-val');
        if (priceEl) priceEl.innerText = `¥${selected.price}/${this.getMarketUnit(selected.productId)}`;
        const chEl = document.getElementById('future-change-val');
        if (chEl) {
            chEl.innerText = `${ch >= 0 ? '+' : ''}${ch.toFixed(2)}%`;
            chEl.style.color = ch >= 0 ? '#bf616a' : '#a3be8c';
        }
        // 基差相对多市场加权现货锚定（非单一 local）
        let basisRef = this.getRawMarketPrice(selected.productId, 'local');
        if (this.multiAgentMarket) {
            const a = this.multiAgentMarket._multiMarketSpotAnchor(selected.productId);
            if (a) basisRef = a;
        }
        const basis = ((selected.price - basisRef) / Math.max(basisRef, 0.01) * 100);
        const metric = document.getElementById('future-basis-val');
        if (metric) metric.innerText = `${basis >= 0 ? '+' : ''}${basis.toFixed(2)}%`;
        this._renderFutOrderBook(selected.productId);
        const vol = document.getElementById('future-volume-val');
        if (vol) vol.innerText = selected.volume.toLocaleString();
        const oi = document.getElementById('future-oi-val');
        if (oi) oi.innerText = (selected.openInterest || 0).toLocaleString();

        // 按用户选择的保证金比例刷新预计保证金
        const marginRate = this.getSelectedMarginRate ? this.getSelectedMarginRate() : 0.10;
        const marginPerLot = Math.ceil(selected.price * (selected.contractSize || 100) * marginRate);
        const marginVal = document.getElementById('future-margin-val');
        if (marginVal) marginVal.innerText = `¥${marginPerLot.toLocaleString()} / 手 (${(marginRate * 100).toFixed(0)}%)`;

        // 绑定自定义控件刷新
        const marginSel = document.getElementById('future-margin-rate');
        const daysSel = document.getElementById('future-delivery-days');
        const qtyInput = document.getElementById('future-order-qty');
        const refreshMargin = () => {
            const rate = this.getSelectedMarginRate();
            const lots = Math.max(1, parseInt(qtyInput && qtyInput.value, 10) || 1);
            const m = Math.ceil(selected.price * (selected.contractSize || 100) * rate * lots);
            if (marginVal) marginVal.innerText = lots > 1
                ? `¥${m.toLocaleString()} / ${lots}手 (${(rate * 100).toFixed(0)}%)`
                : `¥${Math.ceil(selected.price * (selected.contractSize || 100) * rate).toLocaleString()} / 手 (${(rate * 100).toFixed(0)}%)`;
        };
        if (marginSel && !marginSel.dataset.bound) {
            marginSel.addEventListener('change', refreshMargin);
            marginSel.dataset.bound = '1';
        }
        if (qtyInput && !qtyInput.dataset.boundMargin) {
            qtyInput.addEventListener('input', refreshMargin);
            qtyInput.dataset.boundMargin = '1';
        }
        if (daysSel && !daysSel.dataset.bound) {
            daysSel.addEventListener('change', () => {});
            daysSel.dataset.bound = '1';
        }

        const label = document.getElementById('future-current-label');
        if (label) label.innerText = `· ${cfg.icon} ${cfg.name}`;

        // 仅展示当前选择的合约产品
        const q = selected;
        const cfg2 = cfg;
        const ch2 = ch;
        const daysHint = this.getSelectedDeliveryDays ? this.getSelectedDeliveryDays() : 14;
        const div = document.createElement('div');
        div.className = 'contract-card';
        div.innerHTML = `<div class="card-details"><span class="card-main-title">${this.getItemIcon(q.productId)} ${cfg2.name} · <b>¥${q.price}/${this.getMarketUnit(q.productId)}</b></span><span>涨跌 <b style="color:${ch2 >= 0 ? '#bf616a' : '#a3be8c'}">${ch2 >= 0 ? '+' : ''}${ch2.toFixed(2)}%</b> · 自选交割 ${daysHint} 天 · 合约 ${q.contractSize}${this.getMarketUnit(q.productId)}/手</span><span>自选保证金 ${(marginRate * 100).toFixed(0)}% · 约 ¥${marginPerLot.toLocaleString()}/手 · 成交 ${q.volume.toLocaleString()} · 持仓 ${q.openInterest.toLocaleString()}</span></div>`;
        availList.appendChild(div);

        // K线
        try {
            if (selected.history && selected.history.length) {
                this.drawMarketChart(selected.history, selected.price, 'future-chart');
            }
        } catch (e) {}

        // 仅显示当前品种持仓
        const positions = (this.state.futures.positions || []).filter(p => p.productId === this.currentFutureProductId);
        if (!positions.length) {
            holdList.innerHTML = '<div class="sub-hint" style="padding:12px;text-align:center;">当前品种暂无持仓</div>';
        } else {
            positions.forEach(p => {
                const qq = this.state.futures.quotes[p.productId];
                if (!qq) return;
                const c2 = this.getMarketProductConfig(p.productId);
                const size = (qq.contractSize || 100) * p.contracts;
                const pnl = (qq.price - p.entryPrice) * size * (p.side === 'long' ? 1 : -1);
                const d2 = p.deliveryDay - this.state.time.totalDaysPassed;
                const rateTxt = p.marginRate != null ? `${(p.marginRate * 100).toFixed(0)}%` : `${((qq.marginRate || 0.1) * 100).toFixed(0)}%`;
                const divP = document.createElement('div');
                divP.className = 'contract-card';
                divP.innerHTML = `<div class="card-details"><span class="card-main-title">${this.getItemIcon(p.productId)} ${c2.name} · ${p.side === 'long' ? '多头' : '空头'} ${p.contracts}手</span><span>开仓 ¥${p.entryPrice} · 最新 ¥${qq.price} · 浮盈亏 <b style="color:${pnl >= 0 ? '#a3be8c' : '#bf616a'}">${pnl >= 0 ? '+' : ''}¥${Math.round(pnl).toLocaleString()}</b></span><span>保证金 ¥${p.margin.toLocaleString()}（${rateTxt}） · 交割周期 ${p.deliveryDays || '?'}天 · 距交割 ${Math.max(0, d2)} 天</span></div><button class="btn btn-secondary" onclick="gameEngine.closeFuturesPosition('${p.id}')">平仓结算</button>`;
                holdList.appendChild(divP);
            });
        }
    }

    renderPendingContractsModal() {
        const container=document.getElementById('pending-contracts-content'); if(!container)return;
        container.innerHTML='';
        const positions=this.state.futures.positions||[];
        if(positions.length===0){container.innerHTML='<div style="text-align:center;padding:20px;color:#656d81;">目前没有持仓待履约的期货合约</div>';return;}
        positions.forEach(p=>{
            const q=this.state.futures.quotes[p.productId]||{}; const cfg=this.getMarketProductConfig(p.productId); const daysLeft=p.deliveryDay-this.state.time.totalDaysPassed;
            const size=(q.contractSize||100)*p.contracts; const stock=this.getWarehouseItemCount(p.productId); const need=Math.max(0,size-stock);
            const pnl=(q.price-p.entryPrice)*(q.contractSize||100)*p.contracts*(p.side==='long'?1:-1);
            const div=document.createElement('div');div.className='contract-card';div.style.flexDirection='column';div.style.alignItems='flex-start';div.innerHTML=`<div class="card-details" style="width:100%;"><div style="display:flex;justify-content:space-between;"><span class="card-main-title">${this.getItemIcon(p.productId)} ${cfg.name} · ${p.side==='long'?'多头':'空头'} ${p.contracts}手</span><span style="color:${daysLeft<=2?'#bf616a':'#ebcb8b'};font-weight:bold;">${daysLeft}天后交割</span></div><span>开仓价 ¥${p.entryPrice}/${this.getMarketUnit(p.productId)} · 当前 ¥${q.price||p.entryPrice}/${this.getMarketUnit(p.productId)}</span><span>浮盈亏：<b style="color:${pnl>=0?'#a3be8c':'#bf616a'}">${pnl>=0?'+':''}¥${Math.round(pnl).toLocaleString()}</b> · 交割数量 ${size}${this.getMarketUnit(p.productId)}</span><div style="margin-top:4px;padding-top:4px;border-top:1px dashed #3b4252;display:flex;justify-content:space-between;"><span>可用库存：<b>${stock}${this.getMarketUnit(p.productId)}</b></span><span>${p.side==='short'?(need>0?`⚠️ 尚缺 ${need}${this.getMarketUnit(p.productId)}`:'✅ 交割库存充足'):'到期需准备买入资金'}</span></div></div>`;container.appendChild(div);
        });
    }

    renderOrdersUI() {
        const list = document.getElementById('orders-list');
        list.innerHTML = '';

        if (this.state.orders.length === 0) {
            list.innerHTML = '<span style="font-size:12px; color:#4c566a;">暂无定向直供订单</span>';
            return;
        }

        this.state.orders.forEach(o => {
            const icon = this.getItemIcon(o.productId);
            const prodName = this.getItemName(o.productId);
            const daysLeft = o.deadlineDay - this.state.time.totalDaysPassed;
            const div = document.createElement('div');
            div.className = 'order-card';
            div.innerHTML = `
                <div class="card-details">
                    <span class="card-main-title">${o.client}</span>
                    <span>求购：${icon} ${prodName} · 数量：${o.quantity} kg (<span class="${this.getQualityClass(o.minQuality)}">${o.minQuality}以上</span>)</span>
                    <span>合约酬金：<b class="highlight">¥${o.rewardCash}</b> · 剩余：${daysLeft} 天</span>
                </div>
                <button class="btn btn-success" onclick="gameEngine.deliverOrder('${o.id}')">交付履行</button>
            `;
            list.appendChild(div);
        });
    }

    renderWarehouseUI() {
        const totalW = this.getWarehouseTotalWeight().toFixed(1);
        const maxW = this.state.warehouse.maxWeight;
        const totalSlots = this.state.warehouse.items.length;
        const maxSlots = this.state.warehouse.maxSlots;

        document.getElementById('wh-capacity-text').innerText = `${totalW} / ${maxW} kg`;
        document.getElementById('wh-slots-text').innerText = `${totalSlots} / ${maxSlots} 格`;
        document.getElementById('wh-cost-text').innerText = `¥${Math.ceil((totalW / 100) * 3)} / 日`;
        document.getElementById('wh-cold-status').innerText = this.isUpgradeUnlocked('cold_storage') ? '已启用 (品质衰减-70%)' : '未安装';

        const grid = document.getElementById('warehouse-item-grid');
        grid.innerHTML = '';

        this.state.warehouse.items.forEach(it => {
            const icon = this.getItemIcon(it.cropId);
            const name = this.getItemName(it.cropId);
            const qualityClass = this.getQualityClass(it.qualityGrade);

            const div = document.createElement('div');
            div.className = `inventory-slot ${it.reservedForContract > 0 ? 'reserved' : ''}`;
            div.innerHTML = `
                <div style="font-weight:bold; font-size:13px;">${icon} ${name}</div>
                <span>数量/存重：${it.quantity}</span>
                <span>评级：<b class="${qualityClass}">${it.qualityGrade}</b> (${it.qualityScore}分)</span>
                <span>已存：${this.state.time.totalDaysPassed - it.storedDay} 天</span>
            `;
            grid.appendChild(div);
        });
    }

    renderWorkshopUI() {
        const recipeList = document.getElementById('workshop-recipe-list');
        const runningList = document.getElementById('processing-running-list');
        recipeList.innerHTML = '';
        runningList.innerHTML = '';

        document.getElementById('processing-lines-count').innerText = `Lv.${this.state.workshop.level||1} · ${this.state.workshop.runningLines.length}/${this.state.workshop.maxSlots}条产线 · 单次最大${this.state.workshop.batchSize||1}批`;

        for (let rId in PROCESSED_GOODS_CONFIG) {
            const r = PROCESSED_GOODS_CONFIG[rId];
            let inDesc = [];
            for (let k in r.input) {
                inDesc.push(`${this.getItemIcon(k)} ${this.getItemName(k)} ${r.input[k]}kg`);
            }
            const div = document.createElement('div');
            div.className = 'recipe-card';
            const batchMax = this.state.workshop.batchSize || 1;
            const batchInput = `batch-${r.id}`;
            div.innerHTML = `
                <div class="card-details">
                    <span class="card-main-title">${r.icon} ${r.name}</span>
                    <span>单批物料：${inDesc.join(' + ')}</span>
                    <span>单批产出：${r.outputYield} kg · 基础周期：${r.processDays} 天</span>
                    <span>动态成本基准：约 ¥${Math.round(this.getRecipeInputCost(r.id,'local') + r.processDays*1.8)} / 批</span>
                </div>
                <div class="processing-batch-row"><input id="${batchInput}" class="input-qty" type="number" min="1" max="${batchMax}" value="1"><button class="btn btn-primary" onclick="gameEngine.startProcessing('${r.id}',document.getElementById('${batchInput}').value)">开工 ${batchMax>1?'x批量':''}</button></div>
            `;
            recipeList.appendChild(div);
        }

        this.state.workshop.runningLines.forEach(line => {
            const r = PROCESSED_GOODS_CONFIG[line.recipeId];
            const div = document.createElement('div');
            div.className = 'running-card';
            div.innerHTML = `
                <div class="card-details">
                    <span class="card-main-title">${r.icon} 制造中：${r.name}</span>
                    <span>预估产出：${Math.round(line.outputYield*(this.state.workshop.efficiency||1))} kg · 批次 ${line.batchCount||1}</span>
                    <span>剩余工时：${line.remainingDays} 天</span>
                </div>
            `;
            runningList.appendChild(div);
        });
    }

    renderExpansionUI() {
        const list = document.getElementById('expansion-content-list');
        if (!list) return;
        list.innerHTML = '';

        const currentCategory = this.currentExpansionSubTab;

        if (currentCategory === 'automation') {
            const baseAutomationCards = [
                { id: 'auto_water', workerKey: 'water', name: '智能灌溉工人 (蓝色·消耗🪣)', desc: '自动巡查浇水' },
                { id: 'auto_weed', workerKey: 'weed', name: '全自动除草工人 (绿色·消耗🌿)', desc: '自动巡查除草' },
                { id: 'auto_fertilize', workerKey: 'fertilize', name: '智能施肥工人 (橙色·消耗🧪)', desc: '自动巡查施肥' },
                { id: 'auto_pest', workerKey: 'pest', name: '智能植保除虫工人 (红色·消耗🧴)', desc: '自动巡查驱虫' }
            ];

            baseAutomationCards.forEach(c => {
                const up = this.state.upgrades.find(u => u.id === c.id);
                const conf = this.state.workerUpgrades[c.workerKey];
                const div = document.createElement('div');
                div.className = 'upgrade-card';

                if (!up.unlocked) {
                    div.innerHTML = `
                        <div class="card-details">
                            <span class="card-main-title">${c.name}</span>
                            <span>造价：¥${up.cost.toLocaleString()}</span>
                        </div>
                        <button class="btn btn-success" onclick="gameEngine.buyUpgrade('${up.id}')">购买部署</button>
                    `;
                } else {
                    const nextCost = conf.level * 2500;
                    div.innerHTML = `
                        <div class="card-details">
                            <span class="card-main-title">${c.name} <small style="color:#a3be8c;">[Lv.${conf.level}]</small></span>
                            <span>移动与执行速度：+${(conf.level - 1) * 35}%</span>
                            <span>升级费用：${conf.level >= 5 ? '已满级' : '¥' + nextCost}</span>
                        </div>
                        <button class="btn btn-action" ${conf.level >= 5 ? 'disabled' : ''} onclick="gameEngine.upgradeWorker('${c.workerKey}')">
                            ${conf.level >= 5 ? '已满级' : '升级速度'}
                        </button>
                    `;
                }
                list.appendChild(div);
            });

            // 5个自动种植小人卡片
            for (let i = 1; i <= 5; i++) {
                const upId = `planter_worker_${i}`;
                const up = this.state.upgrades.find(u => u.id === upId);
                const conf = this.state.workerUpgrades[`planter_${i}`];
                const div = document.createElement('div');
                div.className = 'upgrade-card';

                if (!up.unlocked) {
                    div.innerHTML = `
                        <div class="card-details">
                            <span class="card-main-title">自动种植小人 #${i} (紫色)</span>
                            <span>功能：指定行数与作物类型自动消耗种子播种</span>
                            <span>造价：¥${up.cost.toLocaleString()}</span>
                        </div>
                        <button class="btn btn-success" onclick="gameEngine.buyUpgrade('${up.id}')">购买小人</button>
                    `;
                } else {
                    const nextCost = conf.level * 2500;
                    const cropName = CROPS_CONFIG[conf.assignedCrop]?.name || '默认';
                    div.innerHTML = `
                        <div class="card-details">
                            <span class="card-main-title">自动种植小人 #${i} <small style="color:#b48ead;">[Lv.${conf.level}]</small></span>
                            <span>当前播种：<b>${cropName}</b> · 管辖：<b>${conf.assignedRows}</b></span>
                            <span>速度：+${(conf.level - 1) * 35}% · 升级费：${conf.level >= 5 ? '满级' : '¥' + nextCost}</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:4px;">
                            <button class="btn btn-primary" onclick="gameEngine.openPlanterConfigModal(${i})">定制策略</button>
                            <button class="btn btn-action" ${conf.level >= 5 ? 'disabled' : ''} onclick="gameEngine.upgradeWorker('planter_${i}')">升级速度</button>
                        </div>
                    `;
                }
                list.appendChild(div);
            }

            // 5个自动收割小人卡片
            for (let i = 1; i <= 5; i++) {
                const upId = `harvester_worker_${i}`;
                const up = this.state.upgrades.find(u => u.id === upId);
                const conf = this.state.workerUpgrades[`harvester_${i}`];
                const div = document.createElement('div');
                div.className = 'upgrade-card';

                if (!up.unlocked) {
                    div.innerHTML = `
                        <div class="card-details">
                            <span class="card-main-title">自动收割小人 #${i} (金黄)</span>
                            <span>功能：巡查成熟作物自动采收入库，防止老化减质</span>
                            <span>造价：¥${up.cost.toLocaleString()}</span>
                        </div>
                        <button class="btn btn-success" onclick="gameEngine.buyUpgrade('${up.id}')">购买小人</button>
                    `;
                } else {
                    const nextCost = conf.level * 2500;
                    div.innerHTML = `
                        <div class="card-details">
                            <span class="card-main-title">自动收割小人 #${i} <small style="color:#e5a440;">[Lv.${conf.level}]</small></span>
                            <span>管辖范围：<b>${conf.assignedRows}</b></span>
                            <span>速度：+${(conf.level - 1) * 35}% · 升级费：${conf.level >= 5 ? '满级' : '¥' + nextCost}</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:4px;">
                            <button class="btn btn-primary" onclick="gameEngine.openHarvesterConfigModal(${i})">指定行数</button>
                            <button class="btn btn-action" ${conf.level >= 5 ? 'disabled' : ''} onclick="gameEngine.upgradeWorker('harvester_${i}')">升级速度</button>
                        </div>
                    `;
                }
                list.appendChild(div);
            }

            const extraIds = ['greenhouse', 'workshop_expand'];
            extraIds.forEach(eid => {
                const u = this.state.upgrades.find(item => item.id === eid);
                if (u) {
                    const div = document.createElement('div');
                    div.className = 'upgrade-card';
                    div.innerHTML = `
                        <div class="card-details">
                            <span class="card-main-title">${u.name}</span>
                            <span>造价：¥${u.cost.toLocaleString()}</span>
                        </div>
                        <button class="btn ${u.unlocked ? 'btn-secondary' : 'btn-success'}" 
                                ${u.unlocked ? 'disabled' : ''} 
                                onclick="gameEngine.buyUpgrade('${u.id}')">
                            ${u.unlocked ? '已建成' : '立即投资'}
                        </button>
                    `;
                    list.appendChild(div);
                }
            });
            UPGRADES_CONFIG.filter(u=>u.workshopLevel).forEach(u=>{
                const div=document.createElement('div'); div.className='upgrade-card';
                const active=(this.state.workshop.level||1)>=u.workshopLevel;
                div.innerHTML=`<div class="card-details"><span class="card-main-title">🏭 ${u.name}</span><span>造价：¥${u.cost.toLocaleString()}</span></div><button class="btn ${active||u.unlocked?'btn-secondary':'btn-success'}" ${active||u.unlocked?'disabled':''} onclick="gameEngine.buyUpgrade('${u.id}')">${active||u.unlocked?'已完成':'升级加工厂'}</button>`;
                list.appendChild(div);
            });

        } else {
            const filtered = this.state.upgrades.filter(u => u.category === currentCategory);
            filtered.forEach(u => {
                const div = document.createElement('div');
                div.className = 'upgrade-card';
                div.innerHTML = `
                    <div class="card-details">
                        <span class="card-main-title">${u.name}</span>
                        <span>建设造价：¥${u.cost.toLocaleString()}</span>
                    </div>
                    <button class="btn ${u.unlocked ? 'btn-secondary' : 'btn-success'}" 
                            ${u.unlocked ? 'disabled' : ''} 
                            onclick="gameEngine.buyUpgrade('${u.id}')">
                        ${u.unlocked ? '已建成' : '立即投资'}
                    </button>
                `;
                list.appendChild(div);
            });
        }
    }

    renderFinanceUI() {
        document.getElementById('fin-total-rev').innerText = `¥${this.state.finance.totalRevenue.toLocaleString()}`;
        document.getElementById('fin-total-exp').innerText = `¥${this.state.finance.totalExpense.toLocaleString()}`;
        const net = this.state.finance.totalRevenue - this.state.finance.totalExpense;
        document.getElementById('fin-net-profit').innerText = `¥${net.toLocaleString()}`;
        document.getElementById('fin-net-profit').style.color = net >= 0 ? '#a3be8c' : '#bf616a';
        document.getElementById('fin-yesterday-storage').innerText = `¥${this.state.finance.yesterdayStorageCost}`;
    }

    renderLogs() {
        const box = document.getElementById('game-logs');
        if (!box) return;
        box.innerHTML = '';
        this.state.logs.forEach(l => {
            const div = document.createElement('div');
            div.className = 'log-entry';
            div.innerHTML = `<span class="time">[${l.time}]</span> ${l.text}`;
            box.appendChild(div);
        });
    }

    renderNewsLogModal() {
        const box=document.getElementById('news-log-content'); if(!box)return;
        const news=(this.state.news||[]).map(n=>`<div class="news-entry"><div><b>${n.title}</b><span class="time">${n.time}</span></div><div>${n.text}</div></div>`).join('');
        const logs=(this.state.logs||[]).map(l=>`<div class="log-entry"><span class="time">[${l.time}]</span> ${l.text}</div>`).join('');
        box.innerHTML=`<div class="news-section"><h4>📰 市场新闻与经营新闻</h4>${news||'<div class="sub-hint">暂无新闻</div>'}</div><div class="news-section"><h4>📒 全部经营日志</h4>${logs||'<div class="sub-hint">暂无日志</div>'}</div>`;
    }

    // ==========================================
    // 14. 事件监听与管理员密码认证
    // ==========================================
    bindEvents() {
        // 主导航切换（移动浏览器 pointerup + click 双保险）
        const switchMainTab = (btn) => {
            if (!btn || btn.disabled) return;
            const targetTab = btn.getAttribute('data-tab');
            const target = targetTab ? document.getElementById(targetTab) : null;
            if (!target) return;

            // 先切换 DOM 状态，页面渲染失败也不会导致导航卡死。
            document.querySelectorAll('#bottom-nav .nav-item').forEach(b => b.classList.toggle('active', b === btn));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p === target));

            try { if (window.soundEngine && typeof window.soundEngine.playClick === 'function') window.soundEngine.playClick(); } catch (_) {}

            try {
                if (targetTab === 'tab-farm') {
                    requestAnimationFrame(() => { this.resizeCanvas(); this.renderCanvas(); });
                } else if (targetTab === 'tab-market') {
                    this.renderMarketUI();
                } else if (targetTab === 'tab-supplies') {
                    this.renderSuppliesUI();
                } else if (targetTab === 'tab-futures') {
                    this.renderFuturesUI();
                } else if (targetTab === 'tab-orders') {
                    this.renderOrdersUI();
                } else if (targetTab === 'tab-warehouse') {
                    this.renderWarehouseUI();
                } else if (targetTab === 'tab-workshop') {
                    this.renderWorkshopUI();
                } else if (targetTab === 'tab-expansion') {
                    this.renderExpansionUI();
                } else if (targetTab === 'tab-finance') {
                    this.renderFinanceUI();
                }
            } catch (err) {
                console.error('[导航页面渲染异常]', targetTab, err);
                // 页面至少保持可见，不回滚到农田页。
            }
        };

        const nav = document.getElementById('bottom-nav');
        if (nav) {
            const fireNav = (btn) => {
                const now = Date.now();
                if (btn.dataset.navHandledAt && now - Number(btn.dataset.navHandledAt) < 400) return;
                btn.dataset.navHandledAt = String(now);
                switchMainTab(btn);
            };
            nav.querySelectorAll('.nav-item').forEach(btn => {
                // 打包 APK WebView：touchend + click 双通道，且不 preventDefault，避免吞掉点击
                btn.addEventListener('touchend', e => {
                    try { e.stopPropagation(); } catch (_) {}
                    fireNav(btn);
                }, { passive: true });
                btn.addEventListener('click', e => {
                    fireNav(btn);
                });
                btn.addEventListener('pointerup', e => {
                    if (e.pointerType === 'mouse' && e.button !== 0) return;
                    fireNav(btn);
                });
            });
        }

        // 现货市场双标签：农产品 / 商品（农资、良种、加工品）
        document.querySelectorAll('.spot-category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                window.soundEngine.playClick();
                this.currentSpotCategory = btn.dataset.category;
                this.renderMarketUI();
            });
        });

        // 综合经营新闻与日志悬浮窗
        const newsBtn=document.getElementById('btn-floating-news');
        if(newsBtn) newsBtn.addEventListener('click',()=>{window.soundEngine.playClick();this.renderNewsLogModal();document.getElementById('modal-news-log').classList.remove('hidden');});
        const newsClose=document.getElementById('btn-close-news-log');
        if(newsClose) newsClose.addEventListener('click',()=>document.getElementById('modal-news-log').classList.add('hidden'));

        // 音乐静音与开启切换
        document.getElementById('btn-audio-toggle').addEventListener('click', () => {
            const isPlaying = window.soundEngine.toggleMute();
            document.getElementById('btn-audio-toggle').innerText = isPlaying ? '🔊 音乐开' : '🔇 音乐关';
        });

        // 农资市场二级分类
        document.querySelectorAll('.supplies-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                window.soundEngine.playClick();
                document.querySelectorAll('.supplies-nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentSuppliesTab = btn.getAttribute('data-cat');
                this.renderSuppliesUI();
            });
        });

        // 扩建分栏二级导航切换
        document.querySelectorAll('.sub-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                window.soundEngine.playClick();
                document.querySelectorAll('.sub-nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentExpansionSubTab = btn.getAttribute('data-sub');
                this.renderExpansionUI();
            });
        });

        // 悬浮待交割合约抽屉
        document.getElementById('btn-floating-contracts').addEventListener('click', () => {
            window.soundEngine.playClick();
            this.renderPendingContractsModal();
            document.getElementById('modal-pending-contracts').classList.remove('hidden');
        });
        document.getElementById('btn-close-pending-modal').addEventListener('click', () => {
            document.getElementById('modal-pending-contracts').classList.add('hidden');
        });

        // 种植策略定制弹窗
        document.getElementById('btn-close-planter-modal').addEventListener('click', () => {
            document.getElementById('modal-planter-config').classList.add('hidden');
        });
        document.getElementById('btn-save-planter-config').addEventListener('click', () => {
            this.savePlanterConfig();
        });

        // 收割策略定制弹窗
        document.getElementById('btn-close-harvester-modal').addEventListener('click', () => {
            document.getElementById('modal-harvester-config').classList.add('hidden');
        });
        document.getElementById('btn-save-harvester-config').addEventListener('click', () => {
            this.saveHarvesterConfig();
        });

        // 跨过今日
        document.getElementById('btn-next-day').addEventListener('click', () => {
            window.soundEngine.playClick();
            this.progressNewDay();
        });

        // 地块操作卡关闭
        document.getElementById('btn-close-plot-card').addEventListener('click', () => {
            document.getElementById('plot-action-card').classList.add('hidden');
            this.selectedPlotIndex = -1;
            this.renderCanvas();
        });

        // 地块人工操作按钮
        document.getElementById('btn-action-plant').addEventListener('click', () => {
            this.openSeedModal();
        });
        document.getElementById('btn-action-water').addEventListener('click', () => {
            if (this.selectedPlotIndex !== -1) this.waterPlot(this.selectedPlotIndex);
        });
        document.getElementById('btn-action-fertilize').addEventListener('click', () => {
            if (this.selectedPlotIndex !== -1) this.fertilizePlot(this.selectedPlotIndex);
        });
        document.getElementById('btn-action-weed').addEventListener('click', () => {
            if (this.selectedPlotIndex !== -1) this.weedPlot(this.selectedPlotIndex);
        });
        document.getElementById('btn-action-pest').addEventListener('click', () => {
            if (this.selectedPlotIndex !== -1) this.pestControlPlot(this.selectedPlotIndex);
        });
        document.getElementById('btn-action-harvest').addEventListener('click', () => {
            if (this.selectedPlotIndex !== -1) this.harvestPlot(this.selectedPlotIndex);
        });

        document.getElementById('btn-close-seed-modal').addEventListener('click', () => {
            document.getElementById('modal-seed-selection').classList.add('hidden');
        });

        const farmPrev=document.getElementById('farm-page-prev'), farmNext=document.getElementById('farm-page-next');
        if(farmPrev) farmPrev.addEventListener('click',()=>{this.farmPage=Math.max(0,this.farmPage-1);this.resizeCanvas();this.renderCanvas();});
        if(farmNext) farmNext.addEventListener('click',()=>{const pages=Math.max(1,Math.ceil(this.state.plots.length/(this.farmPageSize||48)));this.farmPage=Math.min(pages-1,this.farmPage+1);this.resizeCanvas();this.renderCanvas();});

        // 现货卖出
        document.getElementById('btn-trade-sell').addEventListener('click', () => {
            const marketId = document.getElementById('market-select').value;
            const cropId = document.getElementById('crop-market-select').value;
            const amount = parseInt(document.getElementById('trade-sell-amount').value, 10);
            if (isNaN(amount) || amount <= 0) return alert('请输入有效的卖出数量！');
            this.sellSpotGoods(marketId, cropId, amount);
            document.getElementById('trade-sell-amount').value = '';
        });
        document.getElementById('btn-trade-buy').addEventListener('click', () => {
            const marketId=document.getElementById('market-select').value;
            const cropId=document.getElementById('crop-market-select').value;
            const amount=parseInt(document.getElementById('trade-buy-amount').value,10);
            if(isNaN(amount)||amount<=0)return alert('请输入有效的买入数量！');
            this.buySpotGoods(marketId,cropId,amount);
            document.getElementById('trade-buy-amount').value='';
        });

        // 本地浏览器存档按钮操作
        document.getElementById('btn-save-manual').addEventListener('click', () => {
            this.saveGame();
            window.soundEngine.playCoin();
            alert('经营数据已保存到当前浏览器。');
        });
        document.getElementById('btn-reload-save').addEventListener('click', () => {
            this.loadGame();
            this.rebuildWorkers();
            this.updateUI();
            window.soundEngine.playClick();
            alert('已从当前浏览器重新读取本地存档！');
        });
        document.getElementById('btn-clear-save').addEventListener('click', () => {
            this.clearSave();
        });

        // 管理员密码验证逻辑 (密码：715202)
        document.getElementById('btn-unlock-admin').addEventListener('click', () => {
            const pwd = document.getElementById('admin-password-input').value.trim();
            if (pwd === '715202') {
                this.isAdminUnlocked = true;
                window.soundEngine.playHarvest();
                document.getElementById('admin-lock-box').classList.add('hidden');
                document.getElementById('admin-features-box').classList.remove('hidden');
                const badge = document.getElementById('admin-status-badge');
                badge.innerText = '已授权';
                badge.className = 'badge badge-unlocked';
                document.getElementById('admin-password-input').value = '';
                this.addLog('管理员控制台：权限已通过密码验证解锁。');
            } else {
                window.soundEngine.playError();
                alert('密码错误！拒绝访问管理员调试特权。');
            }
        });

        document.getElementById('btn-lock-admin').addEventListener('click', () => {
            this.isAdminUnlocked = false;
            window.soundEngine.playClick();
            document.getElementById('admin-lock-box').classList.remove('hidden');
            document.getElementById('admin-features-box').classList.add('hidden');
            const badge = document.getElementById('admin-status-badge');
            badge.innerText = '未授权';
            badge.className = 'badge badge-locked';
            this.addLog('管理员控制台：已退出特权模式。');
        });

        // 管理员特权指令
        document.getElementById('btn-debug-cash').addEventListener('click', () => {
            if (!this.isAdminUnlocked) return;
            this.state.cash += 100000;
            window.soundEngine.playCoin();
            this.updateTopBarUI();
            this.addLog('【特权调试】注资 ¥100,000 到账。');
        });

        document.getElementById('btn-debug-items').addEventListener('click', () => {
            if (!this.isAdminUnlocked) return;
            SUPPLIES_CONFIG.tools.forEach(t => this.addWarehouseItem(t.id, 50, 80, '标准'));
            SUPPLIES_CONFIG.seeds.forEach(s => this.addWarehouseItem(s.id, 50, 80, '标准'));
            window.soundEngine.playCoin();
            this.updateUI();
            this.addLog('【特权调试】已向仓库注满全部农资道具与良种各 50 份。');
            alert('已成功增加各类作业道具与良种各 50 件！');
        });

        document.getElementById('btn-debug-mature').addEventListener('click', () => {
            if (!this.isAdminUnlocked) return;
            let count = 0;
            this.state.plots.forEach(p => {
                if (p.unlocked && p.crop) {
                    p.crop.growth = 100;
                    p.crop.stage = 'mature';
                    count++;
                }
            });
            window.soundEngine.playHarvest();
            this.renderCanvas();
            this.renderPlotActionCard();
            this.addLog(`【特权调试】全田 ${count} 块作物已瞬间催熟至100%成熟期。`);
            alert(`已强制催熟 ${count} 块耕地上的作物！`);
        });

        document.getElementById('btn-debug-spoil').addEventListener('click', () => {
            if (!this.isAdminUnlocked) return;
            this.state.plots.forEach(p => {
                if (p.unlocked) {
                    p.soilWater = 5;
                    p.weeds = 85;
                    p.pests = 80;
                }
            });
            window.soundEngine.playError();
            this.renderCanvas();
            this.renderPlotActionCard();
            this.addLog('【特权调试】已制造全田严重干旱、荒草与病虫害。');
            alert('已制造极端干旱灾情！');
        });
    }

    openSeedModal() {
        const modal = document.getElementById('modal-seed-selection');
        const container = document.getElementById('seed-list-container');
        container.innerHTML = '';
        modal.classList.remove('hidden');

        for (let k in CROPS_CONFIG) {
            const crop = CROPS_CONFIG[k];
            const seedId = `seed_${crop.id}`;
            const seedStock = this.getWarehouseItemCount(seedId);

            const div = document.createElement('div');
            div.className = 'seed-item-card';
            div.innerHTML = `
                <div>
                    <div class="title">${crop.icon} ${crop.name} <small style="color:${seedStock > 0 ? '#a3be8c' : '#bf616a'};">(${seedStock > 0 ? '库存:' + seedStock : '仓库无良种'})</small></div>
                    <div class="details">适宜季节：${crop.suitableSeasons.join('/')} · 周期约 ${Math.ceil(100 / crop.baseGrowthRate)} 天</div>
                </div>
                <button class="btn btn-primary" ${seedStock > 0 ? '' : 'disabled'} onclick="gameEngine.confirmPlant('${crop.id}')">选此播种</button>
            `;
            container.appendChild(div);
        }
    }

    confirmPlant(cropId) {
        if (this.selectedPlotIndex !== -1) {
            const ok = this.plantCrop(this.selectedPlotIndex, cropId);
            if (ok) {
                document.getElementById('modal-seed-selection').classList.add('hidden');
                this.renderPlotActionCard();
                this.renderCanvas();
            }
        }
    }
}

// 启动引擎

// ==========================================
// 多智能体虚拟交易市场 V2
// - 与游戏日历解耦，每 100ms tick
// - 价格只来自撮合成交
// - 每市场独立订单簿 + 区域新闻/政策
// - 期货锚定多市场现货，现货⇄期货互相传导
// ==========================================

const REGION_NEWS_POOL = {
    local: [
        { title: '本地农贸检疫抽检', bias: -0.01, vol: 1.1, desc: '集市抽检趋严，短线流通放缓' },
        { title: '乡镇采购补贴', bias: 0.012, vol: 1.05, desc: '本地采购补贴刺激买盘' },
        { title: '田间道路修缮', bias: 0.004, vol: 0.95, desc: '物流改善，供应稍增' },
        { title: '周边村社丰收', bias: -0.008, vol: 1.08, desc: '周边供应增加压价' },
        { title: '节庆备货启动', bias: 0.015, vol: 1.2, desc: '本地餐饮备货推高需求' }
    ],
    city: [
        { title: '省城批发冷库满仓', bias: -0.012, vol: 1.15, desc: '库存高压制价格' },
        { title: '连锁商超集中补货', bias: 0.018, vol: 1.25, desc: '商超订单推升需求' },
        { title: '城际高速限行', bias: 0.01, vol: 1.3, desc: '到货减少，短线偏紧' },
        { title: '省发改委稳价倡议', bias: -0.006, vol: 0.9, desc: '政策抑制投机波动' },
        { title: '会展经济带动消费', bias: 0.014, vol: 1.1, desc: '会展餐饮拉动原料需求' }
    ],
    port: [
        { title: '国际运价上调', bias: 0.02, vol: 1.4, desc: '到岸成本上升' },
        { title: '出口配额传闻', bias: 0.016, vol: 1.35, desc: '出口预期推升港口报价' },
        { title: '汇率波动加大', bias: 0.0, vol: 1.5, desc: '汇率扰动进出口定价' },
        { title: '港口作业延误', bias: 0.012, vol: 1.3, desc: '通关放缓，现货偏紧' },
        { title: '海外丰产到港', bias: -0.022, vol: 1.4, desc: '进口供应冲击港口价' }
    ],
    factory: [
        { title: '加工厂开工率上升', bias: 0.015, vol: 1.15, desc: '原料采购积极' },
        { title: '环保限产通知', bias: -0.01, vol: 1.2, desc: '部分产线减产压制需求' },
        { title: '成品订单回流', bias: 0.02, vol: 1.25, desc: '下游订单改善推升原料' },
        { title: '能源成本回落', bias: -0.006, vol: 0.95, desc: '加工成本下降传导原料' },
        { title: '品质溢价政策', bias: 0.008, vol: 1.05, desc: '高品质原料溢价扩大' }
    ]
};

class VirtualTrader {
    constructor(id, type, name, capital, marketId) {
        this.agentId = id;
        this.type = type;
        this.name = name;
        this.homeMarket = marketId;
        this.initialCapital = capital;
        this.cash = capital;
        this.availableCash = capital;
        this.frozenCash = 0;
        this.positions = {};
        this.futPositions = {};
        this.realizedPnL = 0;
        this.riskLevel = 0.25 + Math.random() * 0.55;
        this.maxPositionRatio = type === 'market_maker' ? 0.7 : (0.12 + Math.random() * 0.4);
        this.confidence = 0.35 + Math.random() * 0.55;
        this.fearLevel = Math.random() * 0.7;
        this.greedLevel = Math.random() * 0.75;
        this.fomoLevel = Math.random() * 0.85;
        this.panicLevel = Math.random() * 0.7;
        this.tradingFrequency = 0.08 + Math.random() * 0.45;
        this.preferredProducts = [];
        this.nextDecisionAt = 0;
        this.reactionMs = 100 + Math.floor(Math.random() * 4000);
        this.isMarketMaker = type === 'market_maker';
    }
}

class SimpleOrderBook {
    constructor(key) {
        this.key = key;
        this.bids = [];
        this.asks = [];
        this.lastTradePrice = null;
        this.lastTradeQty = 0;
        this.lastTradeTs = 0;
        this.trades = [];
        this.dayVolume = 0;
    }
    depth(side, levels = 10) {
        const arr = side === 'buy' ? this.bids : this.asks;
        const map = new Map();
        for (const o of arr) {
            const p = o.price;
            map.set(p, (map.get(p) || 0) + o.remaining);
        }
        const sorted = [...map.entries()].sort((a, b) => side === 'buy' ? b[0] - a[0] : a[0] - b[0]);
        return sorted.slice(0, levels).map(([price, qty]) => ({ price, qty }));
    }
    totalQty(side) {
        const arr = side === 'buy' ? this.bids : this.asks;
        return arr.reduce((s, o) => s + o.remaining, 0);
    }
    addOrder(order) {
        const book = order.side === 'buy' ? this.bids : this.asks;
        book.push(order);
        if (order.side === 'buy') this.bids.sort((a, b) => b.price - a.price || a.ts - b.ts);
        else this.asks.sort((a, b) => a.price - b.price || a.ts - b.ts);
    }
    cancelStale(now, maxAge, cancelProb) {
        this.bids = this.bids.filter(o => {
            if (now - o.ts < maxAge) return true;
            return Math.random() > cancelProb;
        });
        this.asks = this.asks.filter(o => {
            if (now - o.ts < maxAge) return true;
            return Math.random() > cancelProb;
        });
    }
    match() {
        const fills = [];
        while (this.bids.length && this.asks.length) {
            const bid = this.bids[0];
            const ask = this.asks[0];
            if (bid.price + 1e-9 < ask.price) break;
            const qty = Math.min(bid.remaining, ask.remaining);
            // 价格时间优先：先到的挂单价格作为成交价
            const price = bid.ts <= ask.ts ? bid.price : ask.price;
            fills.push({
                key: this.key,
                price,
                qty,
                buyAgent: bid.agentId,
                sellAgent: ask.agentId,
                buyOrderId: bid.orderId,
                sellOrderId: ask.orderId,
                ts: Date.now(),
                isFutures: !!bid.isFutures
            });
            bid.remaining -= qty;
            ask.remaining -= qty;
            this.lastTradePrice = price;
            this.lastTradeQty = qty;
            this.lastTradeTs = Date.now();
            this.dayVolume += qty;
            this.trades.push(fills[fills.length - 1]);
            if (this.trades.length > 120) this.trades.shift();
            if (bid.remaining <= 0) this.bids.shift();
            if (ask.remaining <= 0) this.asks.shift();
        }
        return fills;
    }
}

class MultiAgentMarket {
    constructor(game) {
        this.game = game;
        this.agents = [];
        this.spotBooks = {};   // `${marketId}|${prodId}`
        this.futBooks = {};    // prodId
        this.orderSeq = 1;
        this.simTimeMs = 0;
        this.regionEvents = {}; // marketId -> { title, bias, vol, desc, expireAt }
        this.futuresState = {}; // prodId -> { price, basis, oi, volume }
        this.tradeTape = [];    // recent trades for UI
        this.tickKlines = {};   // key -> { '1s':[], '5s':[], '10s':[] }
        this.crossBias = {};    // marketId|prodId -> temporary price bias from other markets
        this.types = [
            { type: 'retail', name: '散户', capital: [600, 4000], freq: 0.18 },
            { type: 'conservative', name: '保守', capital: [2500, 12000], freq: 0.06 },
            { type: 'aggressive', name: '投机', capital: [1500, 10000], freq: 0.38 },
            { type: 'trend', name: '趋势', capital: [4000, 22000], freq: 0.22 },
            { type: 'mean_reversion', name: '回归', capital: [3500, 18000], freq: 0.2 },
            { type: 'fomo', name: 'FOMO', capital: [1200, 7000], freq: 0.42 },
            { type: 'panic', name: '恐慌', capital: [1500, 8000], freq: 0.28 },
            { type: 'long_term', name: '长线', capital: [8000, 45000], freq: 0.04 },
            { type: 'market_maker', name: '做市商', capital: [40000, 150000], freq: 0.7 },
            { type: 'institution', name: '机构', capital: [60000, 220000], freq: 0.09 },
            { type: 'whale', name: '大户', capital: [35000, 140000], freq: 0.11 },
            { type: 'arbitrage', name: '套利', capital: [20000, 90000], freq: 0.3 }
        ];
    }

    bootstrap(nPerMarket = 20) {
        this.agents = [];
        this.spotBooks = {};
        this.futBooks = {};
        this.playerOrders = []; // 玩家限价单
        const products = Object.keys(typeof CROPS_CONFIG !== 'undefined' ? CROPS_CONFIG : {}).slice(0, 14);
        const markets = (typeof MARKETS_CONFIG !== 'undefined' ? MARKETS_CONFIG : [{ id: 'local', name: '本地' }]);

        markets.forEach(m => {
            this.regionEvents[m.id] = null;
            // 每个市场保证至少 3 个做市商
            const roster = [];
            for (let i = 0; i < 3; i++) roster.push(this.types.find(t => t.type === 'market_maker'));
            for (let i = 0; i < nPerMarket - 3; i++) roster.push(this.types[i % this.types.length]);

            roster.forEach((t, i) => {
                const cap = t.capital[0] + Math.random() * (t.capital[1] - t.capital[0]);
                const a = new VirtualTrader(`${m.id}_A${i + 1}`, t.type, `${(m.name || m.id).slice(0, 4)}-${t.name}${i + 1}`, Math.round(cap * (t.type === 'market_maker' ? 2.5 : 1)), m.id);
                a.tradingFrequency = t.type === 'market_maker' ? 0.95 : Math.min(0.85, t.freq * (0.8 + Math.random()));
                a.preferredProducts = products.slice(); // 可交易全部品种
                a.reactionMs = t.type === 'market_maker' ? 40 + Math.random() * 80 : 80 + Math.random() * 900;
                a.isMarketMaker = t.type === 'market_maker';
                // 关键库存：农户/做市商必须有货才能形成真实卖盘
                products.forEach((pid, pi) => {
                    let qty = 0;
                    if (t.type === 'market_maker') qty = Math.floor(800 + Math.random() * 2500);
                    else if (t.type === 'long_term' || t.type === 'institution' || t.type === 'whale') qty = Math.floor(200 + Math.random() * 800);
                    else if (t.type === 'retail' || t.type === 'conservative') qty = Math.floor(30 + Math.random() * 180);
                    else qty = Math.floor(50 + Math.random() * 350);
                    // 每个 agent 对部分品种持仓更重
                    if (pi % 3 !== i % 3 && t.type !== 'market_maker') qty = Math.floor(qty * 0.35);
                    const px = this.game.state?.markets?.[m.id]?.currentPrices?.[pid] || 15;
                    a.positions[pid] = { qty, avgPrice: px * (0.95 + Math.random() * 0.1) };
                });
                this.agents.push(a);
            });

            products.forEach(pid => {
                const key = `${m.id}|${pid}`;
                const book = new SimpleOrderBook(key);
                const p = this.game.state?.markets?.[m.id]?.currentPrices?.[pid]
                    || this.game.getRawMarketPrice?.(pid, m.id) || 15;
                book.lastTradePrice = p;
                this.spotBooks[key] = book;
            });
        });

        products.forEach(pid => {
            const book = new SimpleOrderBook('FUT|' + pid);
            const spots = markets.map(m => this.game.state?.markets?.[m.id]?.currentPrices?.[pid]).filter(x => x > 0);
            const anchor = spots.length ? spots.reduce((a, b) => a + b, 0) / spots.length : 15;
            book.lastTradePrice = +(anchor * (1 + (Math.random() - 0.5) * 0.008)).toFixed(2);
            this.futBooks[pid] = book;
            this.futuresState[pid] = {
                price: book.lastTradePrice,
                basis: 0,
                oi: 800 + Math.floor(Math.random() * 2000),
                volume: 0,
                previousPrice: book.lastTradePrice
            };
        });

        // 启动时立刻铺满做市挂单并产生首批成交
        this._seedMarketMakerQuotes();
        this._forceNoiseTrades(3);
        this._matchAll();
        this._syncAllPricesToGame();
    }

    tick(dtSec) {
        this.simTimeMs += dtSec * 1000;
        this._maybeSpawnRegionNews();
        // 每 tick：做市商刷新全部品种双边报价（持续有挂单）
        this._seedMarketMakerQuotes();
        this._agentDecisions();
        // 强制噪声成交：即使无人“主动”吃单，也有农户/投机与做市商成交
        this._forceNoiseTrades(1);
        this._matchAll();
        this._matchPlayerLimits();
        this._spotFuturesFeedback();
        this._syncAllPricesToGame();
        // 做市商库存再平衡，防止卖光后无卖盘
        this._rebalanceMMInventory();
    }

    _seedMarketMakerQuotes() {
        const products = Object.keys(this.futBooks);
        const mms = this.agents.filter(a => a.isMarketMaker);
        const marketCfgMap = {};
        (typeof MARKETS_CONFIG !== 'undefined' ? MARKETS_CONFIG : []).forEach(m => { marketCfgMap[m.id] = m; });
        mms.forEach(agent => {
            const marketId = agent.homeMarket;
            const mcfg = marketCfgMap[marketId] || { bookLevels: 10, depthScale: 1, spreadScale: 1, volatility: 0.1 };
            const levels = mcfg.bookLevels || 10;
            const depthScale = mcfg.depthScale || 1;
            const spreadScale = mcfg.spreadScale || 1;
            const event = this.regionEvents[marketId];
            const volMul = (event ? event.vol : 1) * (1 + (mcfg.volatility || 0.1) * 2);
            const newsBias = event ? event.bias : 0;
            products.forEach(prodId => {
                const book = this.spotBooks[this._bookKey(marketId, prodId)];
                if (!book) return;
                book.bids = book.bids.filter(o => o.agentId !== agent.agentId);
                book.asks = book.asks.filter(o => o.agentId !== agent.agentId);
                const crossKey = marketId + '|' + prodId;
                const cross = this.crossBias[crossKey] || 0;
                let mid = this._mid(book) * (1 + newsBias * 0.25 + cross);
                if (!(mid > 0)) mid = 10;
                const baseSpread = Math.max(0.02, mid * (0.0018 + Math.random() * 0.004) * spreadScale * volMul);
                for (let lvl = 0; lvl < levels; lvl++) {
                    // 越远档位量越大（真实盘口常见形态）
                    const q = Math.max(5, Math.floor((18 + Math.random() * 55 + lvl * 12) * depthScale));
                    const bidPx = +(mid - baseSpread * (0.45 + lvl * 0.55)).toFixed(2);
                    const askPx = +(mid + baseSpread * (0.45 + lvl * 0.55)).toFixed(2);
                    this._submitSpot(agent, marketId, prodId, 'buy', Math.max(0.5, bidPx), q);
                    this._submitSpot(agent, marketId, prodId, 'sell', Math.max(0.51, askPx), q);
                }
                const futBook = this.futBooks[prodId];
                if (futBook && Math.random() < 0.75) {
                    futBook.bids = futBook.bids.filter(o => o.agentId !== agent.agentId);
                    futBook.asks = futBook.asks.filter(o => o.agentId !== agent.agentId);
                    const fmid = this._mid(futBook);
                    const fs = Math.max(0.02, fmid * (0.0025 + Math.random() * 0.007) * spreadScale);
                    for (let lvl = 0; lvl < Math.min(6, levels); lvl++) {
                        const fq = Math.max(6, Math.floor((12 + Math.random() * 40 + lvl * 8) * depthScale));
                        this._submitFut(agent, prodId, 'buy', +(fmid - fs * (0.5 + lvl * 0.5)).toFixed(2), fq);
                        this._submitFut(agent, prodId, 'sell', +(fmid + fs * (0.5 + lvl * 0.5)).toFixed(2), fq);
                    }
                }
            });
        });
        // 跨市场偏差衰减
        Object.keys(this.crossBias).forEach(k => {
            this.crossBias[k] *= 0.92;
            if (Math.abs(this.crossBias[k]) < 0.0002) delete this.crossBias[k];
        });
    }

    _forceNoiseTrades(rounds = 1) {
        // 随机挑选农户/投机者对做市商挂单吃单，保证无玩家时也有成交与价格波动
        const products = Object.keys(this.futBooks);
        const markets = typeof MARKETS_CONFIG !== 'undefined' ? MARKETS_CONFIG : [];
        for (let r = 0; r < rounds; r++) {
            markets.forEach(m => {
                const traders = this.agents.filter(a => a.homeMarket === m.id && !a.isMarketMaker);
                if (!traders.length) return;
                // 每个市场每个 tick 对若干品种产生吃单
                const n = 2 + Math.floor(Math.random() * 3);
                for (let i = 0; i < n; i++) {
                    const prodId = products[Math.floor(Math.random() * products.length)];
                    const book = this.spotBooks[this._bookKey(m.id, prodId)];
                    if (!book) continue;
                    const agent = traders[Math.floor(Math.random() * traders.length)];
                    const side = Math.random() > 0.48 ? 'buy' : 'sell';
                    const qty = Math.max(3, Math.floor(5 + Math.random() * 55));
                    if (side === 'buy' && book.asks.length) {
                        const ask = book.asks[0];
                        // 主动吃卖一
                        this._submitSpot(agent, m.id, prodId, 'buy', ask.price, qty);
                    } else if (side === 'sell' && book.bids.length) {
                        const have = this._posQty(agent, prodId);
                        if (have < 1 && !agent.isMarketMaker) {
                            // 无货则给一点农户库存再卖
                            agent.positions[prodId] = agent.positions[prodId] || { qty: 0, avgPrice: this._mid(book) };
                            agent.positions[prodId].qty += Math.floor(20 + Math.random() * 80);
                        }
                        const bid = book.bids[0];
                        this._submitSpot(agent, m.id, prodId, 'sell', bid.price, Math.min(qty, this._posQty(agent, prodId) || qty));
                    }
                }
                // 期货噪声
                if (Math.random() < 0.6) {
                    const prodId = products[Math.floor(Math.random() * products.length)];
                    const futBook = this.futBooks[prodId];
                    if (!futBook) return;
                    const agent = traders[Math.floor(Math.random() * traders.length)];
                    if (Math.random() > 0.5 && futBook.asks.length) {
                        this._submitFut(agent, prodId, 'buy', futBook.asks[0].price, 5 + Math.floor(Math.random() * 30));
                    } else if (futBook.bids.length) {
                        this._submitFut(agent, prodId, 'sell', futBook.bids[0].price, 5 + Math.floor(Math.random() * 30));
                    }
                }
            });
        }
    }

    _rebalanceMMInventory() {
        this.agents.filter(a => a.isMarketMaker).forEach(agent => {
            Object.keys(this.futBooks).forEach(pid => {
                const p = agent.positions[pid] || { qty: 0, avgPrice: 15 };
                if (p.qty < 200) p.qty += Math.floor(100 + Math.random() * 400); // 做市商从“渠道库存”补货
                if (p.qty > 8000) p.qty = Math.floor(p.qty * 0.7);
                agent.positions[pid] = p;
                if (agent.cash < agent.initialCapital * 0.2) {
                    agent.cash = agent.initialCapital; // 做市资金池回补
                    agent.availableCash = agent.cash;
                }
            });
        });
    }

    _maybeSpawnRegionNews() {
        const markets = typeof MARKETS_CONFIG !== 'undefined' ? MARKETS_CONFIG : [];
        markets.forEach(m => {
            const cur = this.regionEvents[m.id];
            if (cur && this.simTimeMs < cur.expireAt) return;
            if (Math.random() > 0.015) return;
            const pool = REGION_NEWS_POOL[m.id] || REGION_NEWS_POOL.local;
            const n = pool[Math.floor(Math.random() * pool.length)];
            this.regionEvents[m.id] = {
                title: n.title, bias: n.bias, vol: n.vol, desc: n.desc,
                expireAt: this.simTimeMs + 10000 + Math.random() * 15000
            };
            try { this.game.addNews?.(`🏛 ${m.name}·${n.title}`, n.desc); } catch (e) {}
        });
    }

    _bookKey(marketId, prodId) { return `${marketId}|${prodId}`; }

    _mid(book) {
        if (book.lastTradePrice != null) return book.lastTradePrice;
        if (book.bids[0] && book.asks[0]) return (book.bids[0].price + book.asks[0].price) / 2;
        if (book.bids[0]) return book.bids[0].price;
        if (book.asks[0]) return book.asks[0].price;
        return 10;
    }

    _multiMarketSpotAnchor(prodId) {
        const markets = typeof MARKETS_CONFIG !== 'undefined' ? MARKETS_CONFIG : [];
        let sum = 0, wsum = 0;
        markets.forEach(m => {
            const book = this.spotBooks[this._bookKey(m.id, prodId)];
            if (!book || book.lastTradePrice == null) return;
            const w = 1 + Math.log10(1 + (book.dayVolume || 0));
            const regionW = m.id === 'port' ? 1.35 : m.id === 'city' ? 1.2 : m.id === 'factory' ? 1.1 : 1.0;
            sum += book.lastTradePrice * w * regionW;
            wsum += w * regionW;
        });
        return wsum > 0 ? sum / wsum : null;
    }

    _agentDecisions() {
        const now = this.simTimeMs;
        const products = Object.keys(this.futBooks);
        this.agents.forEach(agent => {
            if (agent.isMarketMaker) return; // 做市已在 _seedMarketMakerQuotes
            if (now < agent.nextDecisionAt) return;
            agent.nextDecisionAt = now + agent.reactionMs * (0.5 + Math.random() * 0.8);
            if (Math.random() > Math.min(0.9, agent.tradingFrequency + 0.15)) return;

            const prodId = products[Math.floor(Math.random() * products.length)];
            const marketId = agent.homeMarket;
            const spotBook = this.spotBooks[this._bookKey(marketId, prodId)];
            if (!spotBook) return;
            const event = this.regionEvents[marketId];
            const newsBias = event ? event.bias : 0;
            const mid = this._mid(spotBook);
            const ret = this._recentReturn(spotBook);

            let side = null;
            let price = mid;
            let qty = this._sampleQty(agent);

            if (agent.type === 'arbitrage') {
                const anchor = this._multiMarketSpotAnchor(prodId);
                const futBook = this.futBooks[prodId];
                const fmid = futBook ? this._mid(futBook) : mid;
                if (anchor && Math.abs(fmid - anchor) / anchor > 0.006) {
                    if (fmid > anchor) {
                        this._submitFut(agent, prodId, 'sell', +(fmid * 0.999).toFixed(2), 20 + Math.floor(Math.random() * 60));
                        if (spotBook.asks[0]) this._submitSpot(agent, marketId, prodId, 'buy', spotBook.asks[0].price, 15 + Math.floor(Math.random() * 40));
                    } else {
                        this._submitFut(agent, prodId, 'buy', +(fmid * 1.001).toFixed(2), 20 + Math.floor(Math.random() * 60));
                        if (spotBook.bids[0]) this._submitSpot(agent, marketId, prodId, 'sell', spotBook.bids[0].price, Math.min(this._posQty(agent, prodId) || 15, 40));
                    }
                }
                return;
            }

            switch (agent.type) {
                case 'trend':
                case 'momentum':
                    if (ret + newsBias > 0.003) { side = 'buy'; price = mid * (1.001 + Math.random() * 0.006); }
                    else if (ret + newsBias < -0.003) { side = 'sell'; price = mid * (0.999 - Math.random() * 0.006); }
                    break;
                case 'mean_reversion':
                    if (ret > 0.012) { side = 'sell'; price = mid * 0.998; }
                    else if (ret < -0.012) { side = 'buy'; price = mid * 1.002; }
                    break;
                case 'fomo':
                    if (ret > 0.005 || newsBias > 0.008) { side = 'buy'; price = mid * (1.003 + agent.fomoLevel * 0.01); }
                    break;
                case 'panic':
                    if (ret < -0.006 || newsBias < -0.008) { side = 'sell'; price = mid * (0.99 - agent.panicLevel * 0.01); }
                    break;
                case 'conservative':
                case 'long_term':
                    if (Math.abs(ret) > 0.02 && Math.random() < 0.4) {
                        side = ret > 0 ? 'sell' : 'buy';
                        price = mid * (side === 'buy' ? 0.997 : 1.003);
                    }
                    break;
                case 'institution':
                case 'whale':
                    if (Math.random() < 0.35 + Math.abs(newsBias) * 5) {
                        side = (ret + newsBias) >= 0 ? 'buy' : 'sell';
                        price = mid * (side === 'buy' ? 1.002 : 0.998);
                        qty = Math.floor(50 + Math.random() * 200);
                    }
                    break;
                default:
                    if (Math.random() < 0.45 + Math.abs(newsBias) * 4) {
                        side = Math.random() > 0.5 - newsBias * 6 ? 'buy' : 'sell';
                        // 50% 概率吃单（市价），50% 挂限价
                        if (Math.random() < 0.5) {
                            if (side === 'buy' && spotBook.asks[0]) price = spotBook.asks[0].price;
                            else if (side === 'sell' && spotBook.bids[0]) price = spotBook.bids[0].price;
                            else price = mid * (1 + (Math.random() - 0.5) * 0.01);
                        } else {
                            price = mid * (1 + (Math.random() - 0.5) * 0.012);
                        }
                    }
            }

            if (!side) return;
            price = +Math.max(0.5, price).toFixed(2);
            if (side === 'buy') {
                const maxAfford = Math.floor(agent.availableCash * 0.9 / price);
                qty = Math.min(qty, Math.max(0, maxAfford));
            } else {
                let have = this._posQty(agent, prodId);
                if (have < qty) {
                    // 农户可从“田间/库存”补充少量可售量，模拟真实供应
                    if (['retail', 'conservative', 'long_term', 'panic'].includes(agent.type)) {
                        agent.positions[prodId] = agent.positions[prodId] || { qty: 0, avgPrice: mid };
                        agent.positions[prodId].qty += Math.floor(10 + Math.random() * 40);
                        have = this._posQty(agent, prodId);
                    }
                }
                qty = Math.min(qty, have);
            }
            if (qty < 1) return;
            if (agent.type === 'whale' && qty > 60) {
                const chunks = 2 + Math.floor(Math.random() * 3);
                const part = Math.max(1, Math.floor(qty / chunks));
                for (let c = 0; c < chunks; c++) {
                    const px = +(price * (1 + (Math.random() - 0.5) * 0.003)).toFixed(2);
                    this._submitSpot(agent, marketId, prodId, side, px, part);
                }
            } else {
                this._submitSpot(agent, marketId, prodId, side, price, qty);
            }
        });
    }

    _sampleQty(agent) {
        const r = Math.random();
        if (agent.type === 'retail') return Math.floor(3 + Math.random() * 25);
        if (r < 0.6) return Math.floor(5 + Math.random() * 35);
        if (r < 0.85) return Math.floor(35 + Math.random() * 80);
        if (r < 0.96) return Math.floor(90 + Math.random() * 180);
        return Math.floor(200 + Math.random() * 400);
    }

    _posQty(agent, prodId) {
        return agent.positions[prodId]?.qty || 0;
    }

    _submitSpot(agent, marketId, prodId, side, price, qty) {
        if (qty < 1 || price <= 0) return;
        const key = this._bookKey(marketId, prodId);
        if (!this.spotBooks[key]) this.spotBooks[key] = new SimpleOrderBook(key);
        // 做市商卖出不强制扣库存（渠道供货）；普通 agent 在成交时扣
        this.spotBooks[key].addOrder({
            orderId: 'S' + (this.orderSeq++),
            agentId: agent.agentId,
            productId: prodId,
            marketId,
            side,
            price: +Number(price).toFixed(2),
            quantity: qty,
            remaining: qty,
            ts: this.simTimeMs,
            isFutures: false
        });
    }

    _submitFut(agent, prodId, side, price, qty) {
        if (qty < 1 || price <= 0) return;
        if (!this.futBooks[prodId]) this.futBooks[prodId] = new SimpleOrderBook('FUT|' + prodId);
        this.futBooks[prodId].addOrder({
            orderId: 'F' + (this.orderSeq++),
            agentId: agent.agentId,
            productId: prodId,
            side,
            price: +Number(price).toFixed(2),
            quantity: qty,
            remaining: qty,
            ts: this.simTimeMs,
            isFutures: true
        });
    }

    // ===== 玩家市价单：吃订单簿，真正推动最新成交价 =====
    executePlayerMarketOrder(marketId, prodId, side, qty) {
        const book = this.spotBooks[this._bookKey(marketId, prodId)];
        if (!book) return { ok: false, reason: '无市场订单簿', filled: 0, avgPrice: 0, cost: 0 };
        let remaining = qty;
        let filled = 0;
        let cost = 0;
        const levels = side === 'buy' ? book.asks : book.bids;
        const fills = [];
        while (remaining > 0 && levels.length) {
            const top = levels[0];
            const take = Math.min(remaining, top.remaining);
            const px = top.price;
            fills.push({ price: px, qty: take, counterparty: top.agentId, orderId: top.orderId });
            top.remaining -= take;
            remaining -= take;
            filled += take;
            cost += px * take;
            book.lastTradePrice = px;
            book.lastTradeQty = take;
            book.lastTradeTs = Date.now();
            book.dayVolume += take;
            book.trades.push({ key: book.key, price: px, qty: take, buyAgent: side === 'buy' ? 'PLAYER' : top.agentId, sellAgent: side === 'sell' ? 'PLAYER' : top.agentId, ts: Date.now(), isFutures: false });
            if (book.trades.length > 120) book.trades.shift();
            this.tradeTape.unshift({ kind: 'spot', marketId, prodId, price: px, qty: take, ts: Date.now(), buy: side === 'buy' ? 'PLAYER' : top.agentId, sell: side === 'sell' ? 'PLAYER' : top.agentId });
            if (this.tradeTape.length > 80) this.tradeTape.pop();
            this._recordTradeKline(marketId + '|' + prodId, px, take, false);
            this._propagateCrossMarket(marketId, prodId, px, take, side);
            // 对手方账户更新
            const cp = this.agents.find(a => a.agentId === top.agentId);
            if (cp) {
                if (side === 'buy') {
                    // 玩家买 = 对手卖
                    cp.cash += px * take;
                    cp.availableCash = cp.cash;
                    const p = cp.positions[prodId];
                    if (p) {
                        const closed = Math.min(p.qty, take);
                        cp.realizedPnL += (px - p.avgPrice) * closed;
                        p.qty -= closed;
                        if (p.qty <= 0) delete cp.positions[prodId];
                    }
                } else {
                    cp.cash -= px * take;
                    cp.availableCash = Math.max(0, cp.cash);
                    const p = cp.positions[prodId] || { qty: 0, avgPrice: 0 };
                    const nq = p.qty + take;
                    p.avgPrice = nq > 0 ? (p.avgPrice * p.qty + px * take) / nq : 0;
                    p.qty = nq;
                    cp.positions[prodId] = p;
                }
            }
            if (top.remaining <= 0) levels.shift();
        }
        this._syncAllPricesToGame();
        const avgPrice = filled > 0 ? cost / filled : 0;
        return { ok: filled > 0, filled, remaining, avgPrice, cost, fills, reason: filled < qty ? (filled > 0 ? '部分成交，流动性不足' : '无对手盘') : '完全成交' };
    }

    // ===== 玩家限价单 =====
    placePlayerLimitOrder(marketId, prodId, side, price, qty) {
        const book = this.spotBooks[this._bookKey(marketId, prodId)];
        if (!book) return { ok: false, reason: '无订单簿' };
        price = +Number(price).toFixed(2);
        qty = Math.max(1, Math.floor(qty));
        const order = {
            orderId: 'P' + (this.orderSeq++),
            agentId: 'PLAYER',
            productId: prodId,
            marketId,
            side,
            price,
            quantity: qty,
            remaining: qty,
            ts: this.simTimeMs,
            isFutures: false,
            isPlayer: true
        };
        book.addOrder(order);
        this.playerOrders.push(order);
        // 立即尝试撮合
        const fills = book.match();
        fills.forEach(t => this._applySpotTrade(t));
        this._syncAllPricesToGame();
        return { ok: true, orderId: order.orderId, remaining: order.remaining, status: order.remaining <= 0 ? 'filled' : 'open' };
    }

    cancelPlayerOrder(orderId) {
        this.playerOrders = this.playerOrders.filter(o => o.orderId !== orderId);
        Object.values(this.spotBooks).forEach(book => {
            book.bids = book.bids.filter(o => o.orderId !== orderId);
            book.asks = book.asks.filter(o => o.orderId !== orderId);
        });
        try { this.game.saveGame(); } catch (e) {}
        return true;
    }

    _matchPlayerLimits() {
        // 玩家单已在订单簿中，随 _matchAll 撮合即可
    }

    _matchAll() {
        Object.values(this.spotBooks).forEach(book => {
            // 只清理非做市商、非玩家的过期单；做市商每 tick 会重挂
            const maxAge = 20000;
            book.bids = book.bids.filter(o => o.isPlayer || o.agentId.includes('_A') && (this.simTimeMs - o.ts < maxAge || o.agentId && this.agents.find(a => a.agentId === o.agentId)?.isMarketMaker));
            // 简化：保留做市商与玩家单，其他超龄 30% 概率撤
            book.bids = book.bids.filter(o => {
                if (o.isPlayer) return o.remaining > 0;
                const ag = this.agents.find(a => a.agentId === o.agentId);
                if (ag?.isMarketMaker) return true;
                if (this.simTimeMs - o.ts > maxAge) return Math.random() > 0.35;
                return o.remaining > 0;
            });
            book.asks = book.asks.filter(o => {
                if (o.isPlayer) return o.remaining > 0;
                const ag = this.agents.find(a => a.agentId === o.agentId);
                if (ag?.isMarketMaker) return true;
                if (this.simTimeMs - o.ts > maxAge) return Math.random() > 0.35;
                return o.remaining > 0;
            });
            const fills = book.match();
            fills.forEach(t => this._applySpotTrade(t));
        });
        Object.entries(this.futBooks).forEach(([pid, book]) => {
            book.bids = book.bids.filter(o => {
                const ag = this.agents.find(a => a.agentId === o.agentId);
                if (ag?.isMarketMaker) return true;
                if (this.simTimeMs - o.ts > 15000) return Math.random() > 0.4;
                return o.remaining > 0;
            });
            book.asks = book.asks.filter(o => {
                const ag = this.agents.find(a => a.agentId === o.agentId);
                if (ag?.isMarketMaker) return true;
                if (this.simTimeMs - o.ts > 15000) return Math.random() > 0.4;
                return o.remaining > 0;
            });
            const fills = book.match();
            fills.forEach(t => this._applyFutTrade(pid, t));
        });
    }

    _applySpotTrade(t) {
        const parts = t.key.split('|');
        const marketId = parts[0];
        const prodId = parts[1];
        const buy = this.agents.find(a => a.agentId === t.buyAgent);
        const sell = this.agents.find(a => a.agentId === t.sellAgent);
        const notional = t.price * t.qty;
        if (buy && t.buyAgent !== 'PLAYER') {
            buy.cash -= notional;
            buy.availableCash = Math.max(0, buy.cash);
            const p = buy.positions[prodId] || { qty: 0, avgPrice: 0 };
            const nq = p.qty + t.qty;
            p.avgPrice = nq > 0 ? (p.avgPrice * p.qty + t.price * t.qty) / nq : 0;
            p.qty = nq;
            buy.positions[prodId] = p;
        }
        if (sell && t.sellAgent !== 'PLAYER') {
            sell.cash += notional;
            sell.availableCash = sell.cash;
            const p = sell.positions[prodId];
            if (p) {
                const closed = Math.min(p.qty, t.qty);
                sell.realizedPnL += (t.price - p.avgPrice) * closed;
                p.qty -= closed;
                if (p.qty <= 0) delete sell.positions[prodId];
            }
        }
        // 玩家限价单成交回调
        if (t.buyAgent === 'PLAYER' || t.sellAgent === 'PLAYER') {
            try { this.game.onPlayerLimitFill?.(t, marketId, prodId); } catch (e) {}
        }
        this.tradeTape.unshift({ kind: 'spot', marketId, prodId, price: t.price, qty: t.qty, ts: t.ts, buy: t.buyAgent, sell: t.sellAgent });
        if (this.tradeTape.length > 80) this.tradeTape.pop();
        this._recordTradeKline(marketId + '|' + prodId, t.price, t.qty, false);
        const sideHint = t.buyAgent === 'PLAYER' ? 'buy' : (t.sellAgent === 'PLAYER' ? 'sell' : null);
        this._propagateCrossMarket(marketId, prodId, t.price, t.qty, sideHint);
    }

    _applyFutTrade(prodId, t) {
        const st = this.futuresState[prodId] || { price: t.price, previousPrice: t.price, basis: 0, oi: 1000, volume: 0 };
        st.previousPrice = st.price;
        st.price = t.price;
        st.volume = (st.volume || 0) + t.qty;
        st.oi = Math.max(50, (st.oi || 500) + Math.floor((Math.random() - 0.45) * 10));
        const anchor = this._multiMarketSpotAnchor(prodId);
        if (anchor) st.basis = (st.price - anchor) / anchor;
        this.futuresState[prodId] = st;
        this.tradeTape.unshift({ kind: 'fut', prodId, price: t.price, qty: t.qty, ts: t.ts, buy: t.buyAgent, sell: t.sellAgent });
        if (this.tradeTape.length > 80) this.tradeTape.pop();
        this._recordTradeKline('FUT|' + prodId, t.price, t.qty, true);
    }

    _spotFuturesFeedback() {
        Object.keys(this.futBooks).forEach(prodId => {
            const futBook = this.futBooks[prodId];
            const fmid = this._mid(futBook);
            const anchor = this._multiMarketSpotAnchor(prodId);
            if (!anchor || !fmid) return;
            const prem = (fmid - anchor) / anchor;
            if (Math.abs(prem) < 0.003) return;
            const markets = typeof MARKETS_CONFIG !== 'undefined' ? MARKETS_CONFIG : [];
            markets.forEach(m => {
                const ev = this.regionEvents[m.id];
                if (ev) ev.bias = (ev.bias || 0) * 0.9 + prem * 0.12;
            });
        });
    }

    _syncAllPricesToGame() {
        const g = this.game;
        if (!g?.state?.markets) return;
        Object.entries(this.spotBooks).forEach(([key, book]) => {
            if (book.lastTradePrice == null) return;
            const [marketId, prodId] = key.split('|');
            const ms = g.state.markets[marketId];
            if (!ms?.currentPrices) return;
            ms.currentPrices[prodId] = book.lastTradePrice;
            ms.dailyBuyVolume = ms.dailyBuyVolume || {};
            ms.dailySellVolume = ms.dailySellVolume || {};
            ms.status = ms.status || {};
            const bidQ = book.totalQty('buy');
            const askQ = book.totalQty('sell');
            ms.status[prodId] = bidQ > askQ * 1.35 ? 'hot' : askQ > bidQ * 1.35 ? 'weak' : 'normal';
            ms.rejectReason = ms.rejectReason || {};
            const ev = this.regionEvents[marketId];
            ms.rejectReason[prodId] = ev
                ? `区域动态：${ev.title} — ${ev.desc}`
                : `盘口 买${Math.round(bidQ)} / 卖${Math.round(askQ)} · 成交价驱动`;
        });

        if (!g.state.futures) g.state.futures = { quotes: {}, available: [], positions: [], holdings: [], cashSettlement: 0 };
        if (!g.state.futures.quotes) g.state.futures.quotes = {};
        Object.keys(this.futBooks).forEach(prodId => {
            const st = this.futuresState[prodId];
            const book = this.futBooks[prodId];
            if (!st || book.lastTradePrice == null) return;
            const old = g.state.futures.quotes[prodId] || {};
            const hist = Array.isArray(old.history) ? old.history.slice(-59) : [];
            if (!hist.length || hist[hist.length - 1].close !== book.lastTradePrice) {
                hist.push({
                    open: st.previousPrice || book.lastTradePrice,
                    high: Math.max(st.previousPrice || book.lastTradePrice, book.lastTradePrice),
                    low: Math.min(st.previousPrice || book.lastTradePrice, book.lastTradePrice),
                    close: book.lastTradePrice,
                    day: g.state.time?.totalDaysPassed || 0
                });
            }
            g.state.futures.quotes[prodId] = {
                id: 'FUT_' + prodId,
                productId: prodId,
                contractSize: 100,
                price: book.lastTradePrice,
                previousPrice: st.previousPrice || book.lastTradePrice,
                deliveryDay: (g.state.time?.totalDaysPassed || 1) + 14,
                marginRate: 0.12,
                maintenanceMarginRate: 0.08,
                volume: st.volume || book.dayVolume || 0,
                openInterest: st.oi || 500,
                tick: 0.01,
                history: hist,
                basis: st.basis || 0
            };
        });
        g.state.futures.available = Object.values(g.state.futures.quotes);
    }

    _recentReturn(book) {
        if (!book || book.trades.length < 2) return 0;
        const a = book.trades[book.trades.length - 1].price;
        const b = book.trades[Math.max(0, book.trades.length - 8)].price;
        return (a - b) / Math.max(b, 0.01);
    }

    _recordTradeKline(key, price, qty, isFutures) {
        if (!this.tickKlines[key]) this.tickKlines[key] = { '1s': [], '5s': [], '10s': [] };
        const now = Date.now();
        const intervals = [
            { name: '1s', ms: 1000, max: 120 },
            { name: '5s', ms: 5000, max: 72 },
            { name: '10s', ms: 10000, max: 60 }
        ];
        intervals.forEach(({ name, ms, max }) => {
            const arr = this.tickKlines[key][name];
            const bucket = Math.floor(now / ms) * ms;
            let bar = arr.length ? arr[arr.length - 1] : null;
            if (!bar || bar.ts !== bucket) {
                bar = { open: price, high: price, low: price, close: price, volume: qty, ts: bucket };
                arr.push(bar);
                if (arr.length > max) arr.shift();
            } else {
                bar.high = Math.max(bar.high, price);
                bar.low = Math.min(bar.low, price);
                bar.close = price;
                bar.volume += qty;
            }
        });
    }

    getTickKlines(marketId, prodId, interval) {
        const key = this._bookKey(marketId, prodId);
        const store = this.tickKlines[key];
        if (!store) return [];
        return store[interval] || store['1s'] || [];
    }

    getFutTickKlines(prodId, interval) {
        const store = this.tickKlines['FUT|' + prodId];
        if (!store) return [];
        return store[interval] || store['1s'] || [];
    }

    // 一市场成交后，向其他市场传导价格压力（现货互相影响）
    _propagateCrossMarket(sourceMarketId, prodId, price, qty, sideHint) {
        const markets = typeof MARKETS_CONFIG !== 'undefined' ? MARKETS_CONFIG : [];
        const src = markets.find(m => m.id === sourceMarketId);
        const impactBase = (src?.crossImpact || 0.4) * Math.min(0.04, Math.log10(1 + qty) * 0.012);
        const dir = sideHint === 'buy' ? 1 : sideHint === 'sell' ? -1 : 0;
        markets.forEach(m => {
            if (m.id === sourceMarketId) return;
            const book = this.spotBooks[this._bookKey(m.id, prodId)];
            if (!book || book.lastTradePrice == null) return;
            // 相对偏离越大，套利拉力越强
            const gap = (price - book.lastTradePrice) / Math.max(book.lastTradePrice, 0.01);
            const pull = gap * 0.15 * (m.crossImpact || 0.4) + dir * impactBase * 0.25;
            const key = m.id + '|' + prodId;
            this.crossBias[key] = (this.crossBias[key] || 0) + pull;
            // 限制单次累计偏差
            this.crossBias[key] = Math.max(-0.06, Math.min(0.06, this.crossBias[key]));
            // 小概率在目标市场直接产生一笔“套利成交”贴近源价格
            if (Math.abs(gap) > 0.008 && Math.random() < 0.35) {
                const traders = this.agents.filter(a => a.homeMarket === m.id && !a.isMarketMaker);
                const ag = traders[Math.floor(Math.random() * traders.length)];
                if (!ag) return;
                if (gap > 0 && book.asks[0]) {
                    // 源市场更高 -> 目标市场买
                    this._submitSpot(ag, m.id, prodId, 'buy', book.asks[0].price, Math.max(5, Math.floor(qty * 0.3)));
                } else if (gap < 0 && book.bids[0]) {
                    this._submitSpot(ag, m.id, prodId, 'sell', book.bids[0].price, Math.max(5, Math.floor(qty * 0.3)));
                }
            }
        });
    }

    getOrderBookSnapshot(marketId, prodId) {
        const book = this.spotBooks[this._bookKey(marketId, prodId)];
        if (!book) return { bids: [], asks: [], last: null, bidQty: 0, askQty: 0, trades: [] };
        return {
            bids: book.depth('buy', 10),
            asks: book.depth('sell', 10),
            last: book.lastTradePrice,
            lastQty: book.lastTradeQty,
            bidQty: book.totalQty('buy'),
            askQty: book.totalQty('sell'),
            trades: book.trades.slice(-12).reverse()
        };
    }

    getFuturesBookSnapshot(prodId) {
        const book = this.futBooks[prodId];
        if (!book) return { bids: [], asks: [], last: null, bidQty: 0, askQty: 0, trades: [] };
        return {
            bids: book.depth('buy', 10),
            asks: book.depth('sell', 10),
            last: book.lastTradePrice,
            lastQty: book.lastTradeQty,
            bidQty: book.totalQty('buy'),
            askQty: book.totalQty('sell'),
            trades: book.trades.slice(-12).reverse(),
            basis: this.futuresState[prodId]?.basis || 0
        };
    }

    getRegionEvent(marketId) {
        const e = this.regionEvents[marketId];
        if (!e || this.simTimeMs > e.expireAt) return null;
        return e;
    }

    getStats() {
        let bidN = 0, askN = 0, trades = 0;
        Object.values(this.spotBooks).forEach(b => { bidN += b.bids.length; askN += b.asks.length; trades += b.trades.length; });
        Object.values(this.futBooks).forEach(b => { bidN += b.bids.length; askN += b.asks.length; trades += b.trades.length; });
        return { agents: this.agents.length, bidN, askN, trades, tape: this.tradeTape.length };
    }
}



window.gameEngine = new GameEngine();
window.addEventListener('DOMContentLoaded', () => {
    window.gameEngine.init();
});

// 静态网站生命周期存档：切后台、切换页面或关闭标签前尽量保存一次。
// 数据始终只写入当前 Origin 的 localStorage，不会上传到服务器。
window.addEventListener('pagehide', () => {
    try { window.gameEngine?.saveGame(); } catch (e) {}
});
window.addEventListener('beforeunload', () => {
    try { window.gameEngine?.saveGame(); } catch (e) {}
});
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        try { window.gameEngine?.saveGame(); } catch (e) {}
    }
});

// ==========================================
// 15. 现代 UI 动效增强层（不改变任何游戏逻辑）
// ==========================================
(function installModernUIEffects() {
    function boot() {
        const root = document.documentElement;
        root.classList.add('modern-ui-ready');

        // 页面切换时让内容和导航产生轻量反馈；不改动原有事件行为。
        document.querySelectorAll('#bottom-nav .nav-item').forEach((btn) => {
            btn.addEventListener('pointerdown', () => {
                btn.classList.add('ui-press');
                window.setTimeout(() => btn.classList.remove('ui-press'), 170);
            }, { passive: true });
        });

        // 所有游戏按钮增加一致的按压/弹起反馈。
        document.addEventListener('pointerdown', (event) => {
            const target = event.target.closest('.btn, .supplies-nav-btn, .sub-nav-btn, .floating-contract-btn');
            if (!target || target.disabled) return;
            target.classList.add('ui-press');
        }, { passive: true });

        document.addEventListener('pointerup', (event) => {
            const target = event.target.closest('.btn, .supplies-nav-btn, .sub-nav-btn, .floating-contract-btn');
            if (!target) return;
            window.setTimeout(() => target.classList.remove('ui-press'), 120);
        }, { passive: true });

        // 避免列表重绘时没有层次感，按当前 DOM 顺序错峰进入。
        const observeLists = () => {
            document.querySelectorAll('.supplies-list, .contract-list, .orders-list, .upgrade-list, .recipe-list, .running-list, .item-grid, .market-info-grid').forEach((list) => {
                const children = Array.from(list.children);
                children.forEach((child, index) => {
                    child.style.animationDelay = `${Math.min(index * 35, 280)}ms`;
                });
            });
        };

        observeLists();
        window.setInterval(observeLists, 1400);
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }
})();
