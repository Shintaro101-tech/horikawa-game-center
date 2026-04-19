const GAME_W = 540;
const GAME_H = 960;
const FONT = '"Hiragino Sans", "Yu Gothic", sans-serif';
const BUFF_DURATIONS = { fast: 20000, missile: 20000, invincible: 10000 };

const LEVEL_COIN_THRESHOLDS = [0, 800, 1800, 3500, 5500, 8000, 11000, 14000];
const HP_BY_LEVEL = [0, 100, 210, 300, 450, 530, 600, 800, 1000];

const PLAYER_Y_MIN = 60;
const PLAYER_Y_MAX = GAME_H - 80;

function getLevelFromCoins(coins) {
    let lv = 1;
    for (let i = 0; i < LEVEL_COIN_THRESHOLDS.length; i++) {
        if (coins >= LEVEL_COIN_THRESHOLDS[i]) lv = i + 1;
    }
    return Math.min(lv, 8);
}

function getLevelStats(level) {
    return {
        maxHp: HP_BY_LEVEL[level] || 100,
        fireDelay: Math.max(110, 240 - (level - 1) * 16),
        bulletSpeed: 560 + (level - 1) * 35,
        moveSpeed: 9 + (level - 1) * 1.4
    };
}

const storage = {
    getCoins() { return parseInt(localStorage.getItem('hk_sub_coins') || '0', 10); },
    setCoins(n) { localStorage.setItem('hk_sub_coins', String(n)); },
    getDeepest() { return parseInt(localStorage.getItem('hk_sub_deepest') || '0', 10); },
    setDeepest(n) { localStorage.setItem('hk_sub_deepest', String(n)); },
    getUnlocked() { return parseInt(localStorage.getItem('hk_sub_unlocked') || '1', 10); },
    setUnlocked(n) { localStorage.setItem('hk_sub_unlocked', String(n)); },
    resetAll() {
        localStorage.removeItem('hk_sub_coins');
        localStorage.removeItem('hk_sub_deepest');
        localStorage.removeItem('hk_sub_unlocked');
    }
};

const VEHICLES = [
    { id: 'submarine', name: 'せんすいかん', icon: '🛥', worldName: 'うみ' },
    { id: 'buggy', name: 'バギー', icon: '🚙', worldName: 'りく' },
    { id: 'jet', name: 'ジェット', icon: '✈️', worldName: 'そら' },
    { id: 'spaceship', name: 'うちゅうせん', icon: '🚀', worldName: 'うちゅう' }
];

const SEA_STAGES = [
    {
        num: 1, name: 'あさいうみ',
        depthStart: 1, depthEnd: 200,
        duration: 48, midBossTime: 22, bossTime: 42,
        bg: { top: 0x0099d6, bottom: 0x004080 },
        bubbleAlpha: 0.45,
        enemies: [
            { emoji: '🐟', points: 10, coins: 10, speed: 110, size: 60 },
            { emoji: '🐠', points: 15, coins: 12, speed: 130, size: 60 },
            { emoji: '🐡', points: 20, coins: 14, speed: 90, size: 64 },
            { emoji: '🦀', points: 25, coins: 16, speed: 100, size: 60 }
        ],
        midBoss: { emoji: '🐡', name: 'メガフグ', size: 180, hp: 12, coins: 110, points: 200, contactDamage: 30 },
        boss: {
            emoji: '🦈', name: 'メガサメ', size: 220, hp: 130, coins: 2300, points: 1500,
            contactDamage: 45, attackPattern: 'single',
            bulletEmoji: '💧', bulletSpeed: 230, attackDelay: 2700, glowColor: 0xFF1744
        }
    },
    {
        num: 2, name: 'たそがれの海',
        depthStart: 201, depthEnd: 1000,
        duration: 52, midBossTime: 24, bossTime: 46,
        bg: { top: 0x004080, bottom: 0x001a4d },
        bubbleAlpha: 0.35,
        enemies: [
            { emoji: '🦑', points: 25, coins: 18, speed: 140, size: 60 },
            { emoji: '🐙', points: 30, coins: 20, speed: 120, size: 66 },
            { emoji: '🪼', points: 25, coins: 18, speed: 80, size: 62 },
            { emoji: '🐡', points: 20, coins: 16, speed: 100, size: 60 }
        ],
        midBoss: { emoji: '🦞', name: 'ふかうみイセエビ', size: 180, hp: 18, coins: 110, points: 250, contactDamage: 30 },
        boss: {
            name: 'リュウグウノツカイ', hp: 230, coins: 2300, points: 2000, custom: 'oarfish',
            contactDamage: 75, attackPattern: 'spread3',
            bulletEmoji: '⚡', bulletSpeed: 250, attackDelay: 2200, glowColor: 0xFFD700
        }
    },
    {
        num: 3, name: 'くらやみの海',
        depthStart: 1001, depthEnd: 3710,
        duration: 58, midBossTime: 27, bossTime: 52,
        bg: { top: 0x001a4d, bottom: 0x000814 },
        bubbleAlpha: 0.25,
        enemies: [
            { emoji: '🦈', points: 60, coins: 22, speed: 200, size: 72 },
            { emoji: '🪼', points: 30, coins: 20, speed: 80, size: 62 },
            { emoji: '🐙', points: 35, coins: 22, speed: 130, size: 66 },
            { emoji: '🦀', points: 35, coins: 22, speed: 110, size: 60 }
        ],
        midBoss: { emoji: '🦀', name: 'ふかうみガニ', size: 180, hp: 22, coins: 110, points: 300, contactDamage: 30 },
        boss: {
            name: 'モンスターアンコウ', hp: 340, coins: 2300, points: 2500, custom: 'angler',
            contactDamage: 90, attackPattern: 'aimed',
            bulletEmoji: '🔥', bulletSpeed: 300, attackDelay: 1800, glowColor: 0xFFEB3B
        }
    },
    {
        num: 4, name: 'まっくらの海',
        depthStart: 3711, depthEnd: 6500,
        duration: 62, midBossTime: 30, bossTime: 56,
        bg: { top: 0x0a0a1a, bottom: 0x000000 },
        bubbleAlpha: 0.18,
        enemies: [
            { emoji: '🐙', points: 35, coins: 25, speed: 130, size: 70, tint: 0x9C27B0 },
            { emoji: '🦑', points: 35, coins: 25, speed: 150, size: 68 },
            { emoji: '🪼', points: 30, coins: 25, speed: 90, size: 70 },
            { emoji: '🦴', points: 40, coins: 28, speed: 120, size: 60 }
        ],
        midBoss: { emoji: '🦑', name: 'ヤミイカ', size: 200, hp: 28, coins: 110, points: 350, contactDamage: 30, tint: 0x4A148C },
        boss: {
            emoji: '🦑', name: 'ダイオウイカ', size: 280, hp: 500, coins: 2300, points: 3000,
            tint: 0x6A1B9A,
            contactDamage: 115, attackPattern: 'spread5',
            bulletEmoji: '🟣', bulletSpeed: 240, attackDelay: 1500, glowColor: 0x9C27B0
        }
    },
    {
        num: 5, name: 'まよなかの海',
        depthStart: 6501, depthEnd: 11000,
        duration: 70, midBossTime: 33, bossTime: 62,
        bg: { top: 0x1a0033, bottom: 0x000000 },
        bubbleAlpha: 0.12,
        enemies: [
            { emoji: '👻', points: 40, coins: 30, speed: 140, size: 70 },
            { emoji: '🪼', points: 35, coins: 28, speed: 100, size: 75 },
            { emoji: '🦴', points: 45, coins: 30, speed: 130, size: 65 },
            { emoji: '🐙', points: 40, coins: 28, speed: 140, size: 70, tint: 0xFF1744 }
        ],
        midBoss: { emoji: '👹', name: 'うみおに', size: 200, hp: 35, coins: 110, points: 400, contactDamage: 30 },
        boss: {
            emoji: '🐉', name: 'うみドラゴン', size: 280, hp: 750, coins: 2300, points: 4000,
            tint: 0xFF1744,
            contactDamage: 235, attackPattern: 'aimedSalvo',
            bulletEmoji: '☄️', bulletSpeed: 360, attackDelay: 1000, glowColor: 0xFF1744
        }
    }
];

const LAND_STAGES = [
    {
        num: 1, name: 'はらっぱ', depthStart: 1, depthEnd: 10,
        duration: 48, midBossTime: 22, bossTime: 42,
        bg: { top: 0x90EE90, bottom: 0x4A6A2C }, bubbleAlpha: 0.2,
        enemies: [
            { emoji: '🐗', points: 10, coins: 10, speed: 110, size: 60 },
            { emoji: '🐰', points: 15, coins: 12, speed: 130, size: 60 },
            { emoji: '🐺', points: 20, coins: 14, speed: 120, size: 64 },
            { emoji: '🦊', points: 25, coins: 16, speed: 110, size: 60 }
        ],
        midBoss: { emoji: '🐂', name: 'メガうし', size: 180, hp: 25, coins: 110, points: 200, contactDamage: 30 },
        boss: {
            emoji: '🦏', name: 'メガサイ', size: 220, hp: 130, coins: 2300, points: 1500,
            contactDamage: 45, attackPattern: 'single',
            bulletEmoji: '🪨', bulletSpeed: 230, attackDelay: 2700, glowColor: 0x8B4513
        }
    },
    {
        num: 2, name: 'もり', depthStart: 11, depthEnd: 30,
        duration: 52, midBossTime: 24, bossTime: 46,
        bg: { top: 0x228B22, bottom: 0x0B4D0B }, bubbleAlpha: 0.18,
        enemies: [
            { emoji: '🦁', points: 25, coins: 18, speed: 140, size: 60 },
            { emoji: '🐅', points: 30, coins: 20, speed: 150, size: 64 },
            { emoji: '🐊', points: 30, coins: 18, speed: 100, size: 66 },
            { emoji: '🦝', points: 20, coins: 16, speed: 120, size: 60 }
        ],
        midBoss: { emoji: '🦬', name: 'ジャイアントバイソン', size: 180, hp: 35, coins: 110, points: 250, contactDamage: 30 },
        boss: {
            emoji: '🐗', name: 'ジャンボブタ', size: 240, hp: 230, coins: 2300, points: 2000,
            tint: 0x8B4513,
            contactDamage: 75, attackPattern: 'spread3',
            bulletEmoji: '🔥', bulletSpeed: 250, attackDelay: 2200, glowColor: 0xFF6F00
        }
    },
    {
        num: 3, name: 'さばく', depthStart: 31, depthEnd: 60,
        duration: 58, midBossTime: 27, bossTime: 52,
        bg: { top: 0xFFD700, bottom: 0xCD853F }, bubbleAlpha: 0.15,
        enemies: [
            { emoji: '🦂', points: 30, coins: 22, speed: 130, size: 62 },
            { emoji: '🐍', points: 35, coins: 22, speed: 140, size: 60 },
            { emoji: '🦎', points: 25, coins: 20, speed: 120, size: 60 },
            { emoji: '🐪', points: 40, coins: 25, speed: 100, size: 70 }
        ],
        midBoss: { emoji: '🐍', name: 'キングコブラ', size: 180, hp: 50, coins: 110, points: 300, contactDamage: 30 },
        boss: {
            emoji: '🦖', name: 'ティラノ', size: 250, hp: 340, coins: 2300, points: 2500,
            contactDamage: 90, attackPattern: 'aimed',
            bulletEmoji: '💢', bulletSpeed: 300, attackDelay: 1800, glowColor: 0xFFEB3B
        }
    },
    {
        num: 4, name: 'かざん', depthStart: 61, depthEnd: 100,
        duration: 62, midBossTime: 30, bossTime: 56,
        bg: { top: 0xFF4500, bottom: 0x8B0000 }, bubbleAlpha: 0.18,
        enemies: [
            { emoji: '🦕', points: 35, coins: 25, speed: 130, size: 70 },
            { emoji: '🦖', points: 40, coins: 25, speed: 150, size: 68 },
            { emoji: '🐲', points: 40, coins: 28, speed: 140, size: 70 },
            { emoji: '🔥', points: 30, coins: 22, speed: 160, size: 60 }
        ],
        midBoss: { emoji: '🦕', name: 'マグマザウルス', size: 200, hp: 70, coins: 110, points: 350, contactDamage: 30, tint: 0xFF6F00 },
        boss: {
            emoji: '🐲', name: 'マグマドラゴン', size: 280, hp: 500, coins: 2300, points: 3000,
            tint: 0xFF1744,
            contactDamage: 115, attackPattern: 'spread5',
            bulletEmoji: '🟠', bulletSpeed: 240, attackDelay: 1500, glowColor: 0xFF6F00
        }
    },
    {
        num: 5, name: 'まおうじょう', depthStart: 101, depthEnd: 200,
        duration: 70, midBossTime: 33, bossTime: 62,
        bg: { top: 0x4B0082, bottom: 0x000000 }, bubbleAlpha: 0.12,
        enemies: [
            { emoji: '👻', points: 40, coins: 30, speed: 140, size: 70 },
            { emoji: '🧌', points: 45, coins: 30, speed: 110, size: 72 },
            { emoji: '💀', points: 45, coins: 30, speed: 130, size: 65 },
            { emoji: '🦇', points: 35, coins: 25, speed: 160, size: 60 }
        ],
        midBoss: { emoji: '👻', name: 'ボスゴースト', size: 200, hp: 100, coins: 110, points: 400, contactDamage: 30 },
        boss: {
            emoji: '👹', name: 'だいまおう', size: 280, hp: 750, coins: 2300, points: 4000,
            tint: 0xFF1744,
            contactDamage: 235, attackPattern: 'aimedSalvo',
            bulletEmoji: '☄️', bulletSpeed: 360, attackDelay: 1000, glowColor: 0xFF1744
        }
    }
];

const SKY_STAGES = [
    {
        num: 1, name: 'あおぞら', depthStart: 1, depthEnd: 500,
        duration: 48, midBossTime: 22, bossTime: 42,
        bg: { top: 0x87CEEB, bottom: 0x4FC3F7 }, bubbleAlpha: 0.4,
        enemies: [
            { emoji: '🐦', points: 10, coins: 10, speed: 130, size: 60 },
            { emoji: '🕊️', points: 15, coins: 12, speed: 140, size: 60 },
            { emoji: '🦋', points: 20, coins: 14, speed: 110, size: 64 },
            { emoji: '🐝', points: 25, coins: 16, speed: 150, size: 60 }
        ],
        midBoss: { emoji: '🦅', name: 'メガワシ', size: 180, hp: 25, coins: 110, points: 200, contactDamage: 30 },
        boss: {
            emoji: '🦅', name: 'キングイーグル', size: 220, hp: 130, coins: 2300, points: 1500,
            contactDamage: 45, attackPattern: 'single',
            bulletEmoji: '⚡', bulletSpeed: 230, attackDelay: 2700, glowColor: 0xFFEB3B
        }
    },
    {
        num: 2, name: 'くものうみ', depthStart: 501, depthEnd: 2000,
        duration: 52, midBossTime: 24, bossTime: 46,
        bg: { top: 0xB0BEC5, bottom: 0x546E7A }, bubbleAlpha: 0.45,
        enemies: [
            { emoji: '🦅', points: 25, coins: 18, speed: 140, size: 60 },
            { emoji: '🦉', points: 30, coins: 20, speed: 130, size: 64 },
            { emoji: '🦇', points: 25, coins: 18, speed: 150, size: 60 },
            { emoji: '🪁', points: 20, coins: 16, speed: 120, size: 62 }
        ],
        midBoss: { emoji: '🦉', name: 'ナイトオウル', size: 180, hp: 35, coins: 110, points: 250, contactDamage: 30 },
        boss: {
            emoji: '🐉', name: 'そらドラゴン', size: 250, hp: 230, coins: 2300, points: 2000,
            tint: 0x4FC3F7,
            contactDamage: 75, attackPattern: 'spread3',
            bulletEmoji: '❄️', bulletSpeed: 250, attackDelay: 2200, glowColor: 0x29B6F6
        }
    },
    {
        num: 3, name: 'たかぞら', depthStart: 2001, depthEnd: 5000,
        duration: 58, midBossTime: 27, bossTime: 52,
        bg: { top: 0x303F9F, bottom: 0x1A237E }, bubbleAlpha: 0.3,
        enemies: [
            { emoji: '⚡', points: 30, coins: 22, speed: 180, size: 60 },
            { emoji: '☁️', points: 25, coins: 20, speed: 100, size: 70 },
            { emoji: '🌩️', points: 35, coins: 22, speed: 160, size: 65 },
            { emoji: '🌧️', points: 25, coins: 18, speed: 130, size: 60 }
        ],
        midBoss: { emoji: '🌪️', name: 'ミニトルネード', size: 180, hp: 50, coins: 110, points: 300, contactDamage: 30 },
        boss: {
            emoji: '⛈️', name: 'あらしのおう', size: 250, hp: 340, coins: 2300, points: 2500,
            contactDamage: 90, attackPattern: 'aimed',
            bulletEmoji: '🌀', bulletSpeed: 300, attackDelay: 1800, glowColor: 0x303F9F
        }
    },
    {
        num: 4, name: 'せいそうけん', depthStart: 5001, depthEnd: 10000,
        duration: 62, midBossTime: 30, bossTime: 56,
        bg: { top: 0x1A237E, bottom: 0x0D1B5E }, bubbleAlpha: 0.2,
        enemies: [
            { emoji: '🛸', points: 40, coins: 28, speed: 150, size: 70 },
            { emoji: '🎈', points: 25, coins: 20, speed: 90, size: 70 },
            { emoji: '🚁', points: 35, coins: 25, speed: 140, size: 70 },
            { emoji: '🪁', points: 30, coins: 22, speed: 130, size: 65 }
        ],
        midBoss: { emoji: '🛸', name: 'スパイUFO', size: 200, hp: 70, coins: 110, points: 350, contactDamage: 30 },
        boss: {
            emoji: '🛸', name: 'ジャイアントUFO', size: 280, hp: 500, coins: 2300, points: 3000,
            tint: 0x9C27B0,
            contactDamage: 115, attackPattern: 'spread5',
            bulletEmoji: '💨', bulletSpeed: 240, attackDelay: 1500, glowColor: 0x9C27B0
        }
    },
    {
        num: 5, name: 'てんかい', depthStart: 10001, depthEnd: 30000,
        duration: 70, midBossTime: 33, bossTime: 62,
        bg: { top: 0x4A148C, bottom: 0x000000 }, bubbleAlpha: 0.15,
        enemies: [
            { emoji: '🌟', points: 40, coins: 30, speed: 140, size: 70 },
            { emoji: '🌠', points: 45, coins: 30, speed: 200, size: 65 },
            { emoji: '✨', points: 35, coins: 28, speed: 130, size: 60 },
            { emoji: '👼', points: 50, coins: 32, speed: 120, size: 70 }
        ],
        midBoss: { emoji: '👼', name: 'ガーディアン', size: 200, hp: 100, coins: 110, points: 400, contactDamage: 30 },
        boss: {
            emoji: '👼', name: 'てんしのおう', size: 280, hp: 750, coins: 2300, points: 4000,
            tint: 0xFFD700,
            contactDamage: 235, attackPattern: 'aimedSalvo',
            bulletEmoji: '🌟', bulletSpeed: 360, attackDelay: 1000, glowColor: 0xFFD700
        }
    }
];

const SPACE_STAGES = [
    {
        num: 1, name: 'ちきゅうきどう', depthStart: 1, depthEnd: 100,
        duration: 48, midBossTime: 22, bossTime: 42,
        bg: { top: 0x0D1B5E, bottom: 0x000033 }, bubbleAlpha: 0.6,
        enemies: [
            { emoji: '🛰️', points: 10, coins: 10, speed: 110, size: 62 },
            { emoji: '☄️', points: 15, coins: 12, speed: 160, size: 60 },
            { emoji: '🪨', points: 20, coins: 14, speed: 100, size: 64 },
            { emoji: '💫', points: 25, coins: 16, speed: 140, size: 60 }
        ],
        midBoss: { emoji: '🛰️', name: 'コワレた えいせい', size: 180, hp: 25, coins: 110, points: 200, contactDamage: 30 },
        boss: {
            emoji: '☄️', name: 'おおいんせき', size: 220, hp: 130, coins: 2300, points: 1500,
            contactDamage: 45, attackPattern: 'single',
            bulletEmoji: '⭐', bulletSpeed: 230, attackDelay: 2700, glowColor: 0xFF6F00
        }
    },
    {
        num: 2, name: 'つきのうら', depthStart: 101, depthEnd: 500,
        duration: 52, midBossTime: 24, bossTime: 46,
        bg: { top: 0x4A148C, bottom: 0x1A0033 }, bubbleAlpha: 0.55,
        enemies: [
            { emoji: '👾', points: 25, coins: 18, speed: 140, size: 60 },
            { emoji: '🛸', points: 30, coins: 20, speed: 130, size: 66 },
            { emoji: '⭐', points: 20, coins: 16, speed: 120, size: 60 },
            { emoji: '💫', points: 25, coins: 18, speed: 150, size: 62 }
        ],
        midBoss: { emoji: '👾', name: 'インベーダー', size: 180, hp: 35, coins: 110, points: 250, contactDamage: 30 },
        boss: {
            emoji: '👾', name: 'エイリアン', size: 240, hp: 230, coins: 2300, points: 2000,
            tint: 0x00E676,
            contactDamage: 75, attackPattern: 'spread3',
            bulletEmoji: '💫', bulletSpeed: 250, attackDelay: 2200, glowColor: 0x00E676
        }
    },
    {
        num: 3, name: 'たいようけい', depthStart: 501, depthEnd: 2000,
        duration: 58, midBossTime: 27, bossTime: 52,
        bg: { top: 0x000033, bottom: 0x000000 }, bubbleAlpha: 0.5,
        enemies: [
            { emoji: '🤖', points: 30, coins: 22, speed: 130, size: 64 },
            { emoji: '🛸', points: 35, coins: 22, speed: 150, size: 66 },
            { emoji: '👾', points: 30, coins: 20, speed: 140, size: 60 },
            { emoji: '🌟', points: 25, coins: 18, speed: 130, size: 62 }
        ],
        midBoss: { emoji: '🤖', name: 'バトルメカ', size: 180, hp: 50, coins: 110, points: 300, contactDamage: 30 },
        boss: {
            emoji: '🛸', name: 'マザーシップ', size: 280, hp: 340, coins: 2300, points: 2500,
            tint: 0x607D8B,
            contactDamage: 90, attackPattern: 'aimed',
            bulletEmoji: '🌟', bulletSpeed: 300, attackDelay: 1800, glowColor: 0x00E5FF
        }
    },
    {
        num: 4, name: 'ぎんがけい', depthStart: 2001, depthEnd: 10000,
        duration: 62, midBossTime: 30, bossTime: 56,
        bg: { top: 0x1A0033, bottom: 0x000000 }, bubbleAlpha: 0.45,
        enemies: [
            { emoji: '🌌', points: 35, coins: 25, speed: 130, size: 70 },
            { emoji: '💫', points: 40, coins: 25, speed: 150, size: 65 },
            { emoji: '🌠', points: 35, coins: 25, speed: 180, size: 60 },
            { emoji: '☄️', points: 40, coins: 28, speed: 170, size: 65 }
        ],
        midBoss: { emoji: '💫', name: 'ぎんがの ヌシ', size: 200, hp: 70, coins: 110, points: 350, contactDamage: 30, tint: 0x9C27B0 },
        boss: {
            emoji: '🌑', name: 'ブラックホール', size: 280, hp: 500, coins: 2300, points: 3000,
            tint: 0x424242,
            contactDamage: 115, attackPattern: 'spread5',
            bulletEmoji: '🌠', bulletSpeed: 240, attackDelay: 1500, glowColor: 0x6A1B9A
        }
    },
    {
        num: 5, name: 'うちゅうのはて', depthStart: 10001, depthEnd: 99999,
        duration: 70, midBossTime: 33, bossTime: 62,
        bg: { top: 0x000000, bottom: 0x000000 }, bubbleAlpha: 0.4,
        enemies: [
            { emoji: '👹', points: 50, coins: 32, speed: 140, size: 70 },
            { emoji: '👻', points: 45, coins: 30, speed: 130, size: 70 },
            { emoji: '🛸', points: 50, coins: 32, speed: 160, size: 68 },
            { emoji: '🌑', points: 40, coins: 28, speed: 110, size: 70 }
        ],
        midBoss: { emoji: '👹', name: 'うちゅうおに', size: 200, hp: 100, coins: 110, points: 400, contactDamage: 30, tint: 0xFF1744 },
        boss: {
            emoji: '🐉', name: 'うちゅうのまおう', size: 280, hp: 750, coins: 2300, points: 4000,
            tint: 0xFF1744,
            contactDamage: 235, attackPattern: 'aimedSalvo',
            bulletEmoji: '☄️', bulletSpeed: 360, attackDelay: 1000, glowColor: 0xFF1744
        }
    }
];

const WORLDS = [
    { id: 'sea', name: 'うみ', vehicle: 'submarine', icon: '🛥', depthUnit: 'm', particle: '🫧', stages: SEA_STAGES },
    { id: 'land', name: 'りく', vehicle: 'buggy', icon: '🚙', depthUnit: 'km', particle: '🍃', stages: LAND_STAGES },
    { id: 'sky', name: 'そら', vehicle: 'jet', icon: '✈️', depthUnit: 'm', particle: '☁️', stages: SKY_STAGES },
    { id: 'space', name: 'うちゅう', vehicle: 'spaceship', icon: '🚀', depthUnit: '万km', particle: '⭐', stages: SPACE_STAGES }
];

const bgm = {
    ctx: null, timer: null, mode: null, beat: 0,
    init() {
        if (!this.ctx) {
            try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
            catch (e) { return false; }
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
        return true;
    },
    play(mode) {
        if (!this.init()) return;
        if (this.mode === mode) return;
        this.stop();
        this.mode = mode; this.beat = 0;
        const tempos = { title: 230, normal: 200, deep: 240, boss: 150, boss5: 110, victory: 180, invincible: 130 };
        const tempo = tempos[mode] || 200;
        this.tick();
        this.timer = setInterval(() => this.tick(), tempo);
    },
    stop() {
        if (this.timer) clearInterval(this.timer);
        this.timer = null; this.mode = null;
    },
    tick() {
        const patterns = {
            title: { melody: [262, 330, 392, 523, 392, 330, 262, 196], bass: [131, 131, 175, 196], bassEvery: 4 },
            normal: {
                melody: [523, 0, 659, 0, 784, 659, 523, 0, 659, 0, 784, 0, 880, 784, 659, 0,
                         784, 0, 880, 0, 988, 880, 784, 0, 659, 523, 587, 0, 659, 587, 523, 392],
                bass: [131, 131, 175, 196, 196, 175, 131, 131], bassEvery: 4
            },
            deep: {
                melody: [196, 0, 233, 0, 262, 0, 233, 196, 174, 0, 196, 0, 233, 0, 196, 174,
                         147, 0, 174, 0, 196, 0, 174, 147, 130, 0, 147, 0, 174, 147, 130, 0],
                bass: [98, 98, 87, 87, 78, 78, 87, 87], bassEvery: 4
            },
            boss: {
                melody: [220, 247, 220, 0, 277, 0, 247, 220, 220, 247, 277, 0, 311, 0, 277, 247,
                         330, 0, 311, 0, 277, 0, 247, 220, 220, 0, 277, 0, 311, 277, 247, 220,
                         196, 0, 220, 247, 196, 0, 233, 247, 196, 247, 196, 220, 196, 165, 196, 220],
                bass: [110, 110, 117, 117, 123, 123, 110, 110, 98, 98, 110, 110], bassEvery: 2
            },
            boss5: {
                melody: [110, 117, 110, 117, 123, 117, 110, 117, 130, 117, 110, 117,
                         110, 117, 110, 117, 123, 117, 110, 117, 138, 130, 117, 110,
                         147, 138, 130, 117, 110, 117, 130, 138, 147, 138, 130, 117],
                bass: [55, 55, 58, 58, 62, 62, 65, 65, 55, 55], bassEvery: 1
            },
            victory: { melody: [523, 659, 784, 1047, 784, 1047, 1175, 1047, 1319, 1175, 1047, 784],
                bass: [262, 330, 392, 523], bassEvery: 2 },
            invincible: {
                melody: [
                    1047, 988, 880, 988, 1047, 1175, 1319, 1175,
                    1047, 988, 880, 988, 1047, 880, 784, 880,
                    1047, 1175, 1319, 1397, 1319, 1175, 1047, 988,
                    880, 988, 1047, 1175, 1319, 1175, 1047, 880
                ],
                bass: [262, 330, 392, 523, 392, 330, 262, 330], bassEvery: 2
            }
        };
        const p = patterns[this.mode];
        if (!p) return;
        const note = p.melody[this.beat % p.melody.length];
        if (note > 0) this.tone(note, 0.18, 0.04, 'triangle');
        if (this.beat % p.bassEvery === 0) {
            const bn = p.bass[Math.floor(this.beat / p.bassEvery) % p.bass.length];
            if (bn > 0) this.tone(bn, 0.4, 0.07, 'sine');
        }
        this.beat++;
    },
    tone(freq, dur, vol, type) {
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type; osc.frequency.value = freq;
            const now = this.ctx.currentTime;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(vol, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.start(now); osc.stop(now + dur);
        } catch (e) {}
    }
};

function createSubmarineTexture(scene, level) {
    const w = 130, h = 170;
    const g = scene.make.graphics({ add: false });
    const palette = {
        1: { body: 0xFFC107, accent: 0xFF6F00, fin: 0xFF6F00, window: 0x4FC3F7, outline: 0x4A2700 },
        2: { body: 0xFFD740, accent: 0xFF8F00, fin: 0xE65100, window: 0x29B6F6, outline: 0x4A2700 },
        3: { body: 0xCDDC39, accent: 0xFF6F00, fin: 0x33691E, window: 0x29B6F6, outline: 0x33691E },
        4: { body: 0xFF7043, accent: 0xBF360C, fin: 0x4E342E, window: 0x00BCD4, outline: 0x3E2723 },
        5: { body: 0x4FC3F7, accent: 0x0277BD, fin: 0x01579B, window: 0xFFF59D, outline: 0x004D7A },
        6: { body: 0x1565C0, accent: 0x00B8D4, fin: 0xFFEA00, window: 0xE1F5FE, outline: 0x002171 },
        7: { body: 0xC62828, accent: 0xFFD600, fin: 0x424242, window: 0xFFFFFF, outline: 0x1B0000 },
        8: { body: 0x263238, accent: 0xFFD700, fin: 0xC62828, window: 0x00E5FF, outline: 0x000000 }
    };
    const c = palette[level] || palette[1];

    g.fillStyle(0x000000, 0.25);
    g.fillEllipse(w/2 + 4, 95, 86, 120);

    g.fillStyle(c.body);
    g.fillTriangle(w/2, 8, w/2 - 35, 55, w/2 + 35, 55);
    g.fillRoundedRect(w/2 - 35, 50, 70, 90, 12);

    g.fillStyle(c.accent);
    g.fillRect(w/2 - 35, 88, 70, 14);

    g.lineStyle(4, c.outline);
    g.strokeTriangle(w/2, 8, w/2 - 35, 55, w/2 + 35, 55);
    g.strokeRoundedRect(w/2 - 35, 50, 70, 90, 12);
    g.lineStyle(2, c.outline);
    g.strokeRect(w/2 - 35, 88, 70, 14);

    g.fillStyle(c.window);
    g.fillCircle(w/2, 70, 15);
    g.lineStyle(3, c.outline);
    g.strokeCircle(w/2, 70, 15);
    g.fillStyle(0xFFFFFF, 0.7);
    g.fillCircle(w/2 - 4, 66, 5);

    g.fillStyle(c.window);
    g.fillCircle(w/2 - 14, 116, 6);
    g.fillCircle(w/2 + 14, 116, 6);
    g.fillCircle(w/2, 130, 6);
    g.lineStyle(2, c.outline);
    g.strokeCircle(w/2 - 14, 116, 6);
    g.strokeCircle(w/2 + 14, 116, 6);
    g.strokeCircle(w/2, 130, 6);

    g.fillStyle(c.fin);
    g.fillTriangle(w/2 - 35, 110, w/2 - 35, 138, w/2 - 58, 130);
    g.fillTriangle(w/2 + 35, 110, w/2 + 35, 138, w/2 + 58, 130);
    g.lineStyle(3, c.outline);
    g.strokeTriangle(w/2 - 35, 110, w/2 - 35, 138, w/2 - 58, 130);
    g.strokeTriangle(w/2 + 35, 110, w/2 + 35, 138, w/2 + 58, 130);

    g.fillStyle(0x616161);
    g.fillRoundedRect(w/2 - 18, 142, 36, 14, 4);
    g.lineStyle(3, 0x000000);
    g.strokeRoundedRect(w/2 - 18, 142, 36, 14, 4);
    g.fillStyle(0xBDBDBD);
    g.fillRect(w/2 - 28, 154, 56, 5);
    g.fillRect(w/2 - 2, 144, 4, 16);

    if (level >= 2) {
        g.fillStyle(0x424242);
        g.fillRect(w/2 + 13, 30, 4, 18);
        g.fillStyle(0xFF1744);
        g.fillCircle(w/2 + 15, 28, 4);
    }
    if (level >= 3) {
        g.fillStyle(c.accent);
        g.fillRect(w/2 - 30, 78, 60, 4);
    }
    if (level >= 4) {
        g.fillStyle(0x424242);
        g.fillRoundedRect(w/2 - 51, 78, 14, 26, 3);
        g.fillRoundedRect(w/2 + 37, 78, 14, 26, 3);
        g.fillStyle(0xFFD600);
        g.fillTriangle(w/2 - 44, 70, w/2 - 51, 78, w/2 - 37, 78);
        g.fillTriangle(w/2 + 44, 70, w/2 + 37, 78, w/2 + 51, 78);
        g.lineStyle(2, 0x000000);
        g.strokeRoundedRect(w/2 - 51, 78, 14, 26, 3);
        g.strokeRoundedRect(w/2 + 37, 78, 14, 26, 3);
    }
    if (level >= 5) {
        g.fillStyle(0xFFFF00, 0.7);
        g.fillTriangle(w/2, 14, w/2 - 22, -8, w/2 + 22, -8);
        g.fillStyle(0xFFFFFF);
        g.fillCircle(w/2, 18, 4);
    }
    if (level >= 6) {
        g.fillStyle(0x00E5FF, 0.7);
        g.fillCircle(w/2 - 28, 162, 9);
        g.fillCircle(w/2 + 28, 162, 9);
        g.fillStyle(0xFFFFFF);
        g.fillCircle(w/2 - 28, 162, 4);
        g.fillCircle(w/2 + 28, 162, 4);
    }
    if (level >= 7) {
        g.fillStyle(0x424242);
        g.fillRect(w/2 - 24, 36, 9, 24);
        g.fillRect(w/2 + 15, 36, 9, 24);
        g.lineStyle(2, 0x000000);
        g.strokeRect(w/2 - 24, 36, 9, 24);
        g.strokeRect(w/2 + 15, 36, 9, 24);
        g.fillStyle(0xFFC107);
        g.fillCircle(w/2 - 19, 34, 4);
        g.fillCircle(w/2 + 19, 34, 4);
    }
    if (level >= 8) {
        g.fillStyle(0xFFD700);
        for (let i = 0; i < 5; i++) {
            const fx = w/2 - 32 + i * 16;
            g.fillTriangle(fx, 26, fx + 12, 26, fx + 6, 6);
        }
        g.lineStyle(3, 0xFFD700);
        g.strokeRoundedRect(w/2 - 33, 52, 66, 86, 12);
        g.fillStyle(0xFF1744);
        g.fillCircle(w/2, 110, 8);
        g.fillStyle(0xFFFFFF, 0.9);
        g.fillCircle(w/2, 110, 4);
        g.fillStyle(0xFFD700);
        g.fillCircle(w/2 - 35, 88, 4);
        g.fillCircle(w/2 + 35, 88, 4);
        g.fillCircle(w/2 - 35, 102, 4);
        g.fillCircle(w/2 + 35, 102, 4);
    }

    g.generateTexture(`submarine_${level}`, w, h);
    g.destroy();
}

function createBuggyTexture(scene) {
    const w = 130, h = 170;
    const g = scene.make.graphics({ add: false });
    g.fillStyle(0x000000, 0.3);
    g.fillRoundedRect(22, 38, 86, 110, 14);
    g.fillStyle(0x222222);
    g.fillRoundedRect(8, 28, 28, 42, 8);
    g.fillRoundedRect(94, 28, 28, 42, 8);
    g.fillRoundedRect(8, 110, 28, 42, 8);
    g.fillRoundedRect(94, 110, 28, 42, 8);
    g.fillStyle(0x666666);
    g.fillCircle(22, 49, 6); g.fillCircle(108, 49, 6);
    g.fillCircle(22, 131, 6); g.fillCircle(108, 131, 6);
    g.fillStyle(0xE53935);
    g.fillRoundedRect(28, 28, 74, 124, 16);
    g.lineStyle(4, 0x4A0000);
    g.strokeRoundedRect(28, 28, 74, 124, 16);
    g.fillStyle(0xC62828);
    g.fillRect(36, 38, 58, 26);
    g.fillStyle(0x222222);
    g.fillRect(40, 28, 50, 8);
    g.fillStyle(0xFFEB3B);
    g.fillCircle(42, 32, 6); g.fillCircle(88, 32, 6);
    g.fillStyle(0x4FC3F7);
    g.fillRoundedRect(36, 70, 58, 38, 6);
    g.lineStyle(2, 0x000080);
    g.strokeRoundedRect(36, 70, 58, 38, 6);
    g.fillStyle(0xFF6F00);
    g.fillCircle(65, 88, 12);
    g.lineStyle(5, 0x424242);
    g.strokeRoundedRect(36, 70, 58, 38, 6);
    g.beginPath();
    g.moveTo(36, 70); g.lineTo(94, 108);
    g.moveTo(94, 70); g.lineTo(36, 108);
    g.strokePath();
    g.fillStyle(0xC62828);
    g.fillRect(36, 116, 58, 30);
    g.fillStyle(0x616161);
    g.fillRect(46, 144, 8, 16);
    g.fillRect(76, 144, 8, 16);
    g.fillStyle(0xFF9800);
    g.fillCircle(50, 162, 4); g.fillCircle(80, 162, 4);
    g.generateTexture('buggy_1', w, h);
    g.destroy();
}

function createJetTexture(scene) {
    const w = 140, h = 170;
    const g = scene.make.graphics({ add: false });
    g.fillStyle(0x000000, 0.3);
    g.fillEllipse(w/2 + 4, 90, 36, 130);
    g.fillStyle(0x607D8B);
    g.fillTriangle(w/2, 60, 5, 115, 5, 92);
    g.fillTriangle(w/2, 60, w - 5, 115, w - 5, 92);
    g.lineStyle(3, 0x000000);
    g.strokeTriangle(w/2, 60, 5, 115, 5, 92);
    g.strokeTriangle(w/2, 60, w - 5, 115, w - 5, 92);
    g.fillStyle(0x90A4AE);
    g.fillEllipse(w/2, 85, 36, 130);
    g.lineStyle(3, 0x000000);
    g.strokeEllipse(w/2, 85, 36, 130);
    g.fillStyle(0x424242);
    g.fillTriangle(w/2, 8, w/2 - 12, 36, w/2 + 12, 36);
    g.lineStyle(2, 0x000000);
    g.strokeTriangle(w/2, 8, w/2 - 12, 36, w/2 + 12, 36);
    g.fillStyle(0x4FC3F7);
    g.fillEllipse(w/2, 60, 22, 32);
    g.lineStyle(3, 0x01579B);
    g.strokeEllipse(w/2, 60, 22, 32);
    g.fillStyle(0xFFFFFF, 0.6);
    g.fillEllipse(w/2 - 4, 55, 6, 10);
    g.fillStyle(0xCC0000);
    g.fillCircle(w/2 - 30, 100, 6);
    g.fillCircle(w/2 + 30, 100, 6);
    g.fillStyle(0x607D8B);
    g.fillTriangle(w/2 - 30, 145, w/2 - 20, 135, w/2 - 20, 150);
    g.fillTriangle(w/2 + 30, 145, w/2 + 20, 135, w/2 + 20, 150);
    g.fillStyle(0x424242);
    g.fillRect(w/2 - 18, 135, 12, 28);
    g.fillRect(w/2 + 6, 135, 12, 28);
    g.lineStyle(2, 0x000000);
    g.strokeRect(w/2 - 18, 135, 12, 28);
    g.strokeRect(w/2 + 6, 135, 12, 28);
    g.fillStyle(0xFF9800);
    g.fillCircle(w/2 - 12, 160, 5);
    g.fillCircle(w/2 + 12, 160, 5);
    g.fillStyle(0xFFEB3B);
    g.fillCircle(w/2 - 12, 162, 3);
    g.fillCircle(w/2 + 12, 162, 3);
    g.generateTexture('jet_1', w, h);
    g.destroy();
}

function createSpaceshipTexture(scene) {
    const w = 140, h = 170;
    const g = scene.make.graphics({ add: false });
    g.fillStyle(0x00E5FF, 0.18);
    g.fillCircle(w/2, h/2, 75);
    g.fillStyle(0x37474F);
    g.fillTriangle(w/2, 8, w/2 - 38, 92, w/2 + 38, 92);
    g.fillRoundedRect(w/2 - 38, 88, 76, 60, 12);
    g.lineStyle(4, 0x000000);
    g.strokeTriangle(w/2, 8, w/2 - 38, 92, w/2 + 38, 92);
    g.strokeRoundedRect(w/2 - 38, 88, 76, 60, 12);
    g.fillStyle(0x546E7A);
    g.fillTriangle(w/2 - 38, 92, w/2 - 65, 134, w/2 - 38, 134);
    g.fillTriangle(w/2 + 38, 92, w/2 + 65, 134, w/2 + 38, 134);
    g.lineStyle(3, 0x000000);
    g.strokeTriangle(w/2 - 38, 92, w/2 - 65, 134, w/2 - 38, 134);
    g.strokeTriangle(w/2 + 38, 92, w/2 + 65, 134, w/2 + 38, 134);
    g.fillStyle(0x00E5FF);
    g.fillEllipse(w/2, 56, 26, 38);
    g.lineStyle(3, 0xFFFFFF);
    g.strokeEllipse(w/2, 56, 26, 38);
    g.fillStyle(0xFFFFFF, 0.7);
    g.fillEllipse(w/2 - 5, 50, 6, 10);
    g.fillStyle(0xFFD700);
    g.fillRect(w/2 - 2, 0, 4, 14);
    g.fillCircle(w/2, 0, 5);
    g.fillStyle(0xE91E63, 0.7);
    g.fillCircle(w/2 - 22, 156, 14);
    g.fillCircle(w/2 + 22, 156, 14);
    g.fillStyle(0xFFFFFF);
    g.fillCircle(w/2 - 22, 156, 6);
    g.fillCircle(w/2 + 22, 156, 6);
    g.fillStyle(0xFFD700);
    g.fillCircle(w/2 - 30, 110, 4);
    g.fillCircle(w/2 + 30, 110, 4);
    g.fillCircle(w/2, 138, 4);
    g.generateTexture('spaceship_1', w, h);
    g.destroy();
}

function createMissileTexture(scene) {
    const w = 32, h = 56;
    const g = scene.make.graphics({ add: false });
    g.fillStyle(0xE0E0E0);
    g.fillRoundedRect(8, 8, 16, 36, 4);
    g.fillStyle(0xFF1744);
    g.fillTriangle(16, 0, 6, 12, 26, 12);
    g.fillStyle(0x424242);
    g.fillTriangle(8, 40, 0, 52, 8, 52);
    g.fillTriangle(24, 40, 24, 52, 32, 52);
    g.lineStyle(2, 0x000000);
    g.strokeRoundedRect(8, 8, 16, 36, 4);
    g.fillStyle(0xFF9800);
    g.fillTriangle(11, 44, 21, 44, 16, 56);
    g.fillStyle(0xFFEB3B);
    g.fillTriangle(13, 46, 19, 46, 16, 54);
    g.generateTexture('missile', w, h);
    g.destroy();
}

function createOarfishTexture(scene) {
    const w = 460, h = 180;
    const g = scene.make.graphics({ add: false });

    g.fillStyle(0xE0E0E0);
    g.fillRoundedRect(40, 60, w - 80, 60, 30);
    g.lineStyle(3, 0x666666);
    g.strokeRoundedRect(40, 60, w - 80, 60, 30);

    g.fillStyle(0xE53935);
    for (let i = 0; i < 12; i++) {
        const fx = 60 + i * 28;
        g.fillTriangle(fx, 60, fx + 22, 60, fx + 11, 18);
    }
    g.lineStyle(2, 0x8B0000);
    for (let i = 0; i < 12; i++) {
        const fx = 60 + i * 28;
        g.strokeTriangle(fx, 60, fx + 22, 60, fx + 11, 18);
    }

    g.fillStyle(0xE53935);
    for (let i = 0; i < 6; i++) {
        const fx = 100 + i * 50;
        g.fillTriangle(fx, 120, fx + 22, 120, fx + 11, 148);
    }

    g.fillStyle(0xF5F5F5);
    g.fillCircle(w - 50, 90, 42);
    g.lineStyle(3, 0x666666);
    g.strokeCircle(w - 50, 90, 42);

    g.fillStyle(0xFFFFFF);
    g.fillCircle(w - 35, 78, 14);
    g.fillStyle(0x000000);
    g.fillCircle(w - 32, 78, 7);
    g.fillStyle(0xFFFFFF, 0.9);
    g.fillCircle(w - 30, 75, 3);

    g.fillStyle(0xC62828);
    g.fillEllipse(w - 22, 100, 14, 8);

    g.fillStyle(0xE53935);
    g.fillTriangle(40, 90, 5, 50, 5, 130);
    g.lineStyle(2, 0x8B0000);
    g.strokeTriangle(40, 90, 5, 50, 5, 130);

    g.generateTexture('boss_oarfish', w, h);
    g.destroy();
}

function createAnglerfishTexture(scene) {
    const w = 280, h = 320;
    const g = scene.make.graphics({ add: false });

    g.lineStyle(5, 0x1A1A1A);
    g.beginPath();
    g.moveTo(w/2 + 5, 110);
    g.lineTo(w/2 - 25, 75);
    g.lineTo(w/2 - 50, 50);
    g.strokePath();

    g.fillStyle(0xFFEB3B, 0.4);
    g.fillCircle(w/2 - 55, 45, 38);
    g.fillStyle(0xFFEB3B, 0.7);
    g.fillCircle(w/2 - 55, 45, 24);
    g.fillStyle(0xFFF59D);
    g.fillCircle(w/2 - 55, 45, 14);
    g.fillStyle(0xFFFFFF);
    g.fillCircle(w/2 - 55, 45, 6);

    g.fillStyle(0x1A1A1A);
    g.fillCircle(w/2, h/2 + 35, 110);
    g.lineStyle(4, 0x000000);
    g.strokeCircle(w/2, h/2 + 35, 110);

    g.fillStyle(0x2A2A2A);
    g.fillTriangle(w/2 + 100, h/2 + 30, w/2 + 145, h/2 - 5, w/2 + 145, h/2 + 70);
    g.lineStyle(3, 0x000000);
    g.strokeTriangle(w/2 + 100, h/2 + 30, w/2 + 145, h/2 - 5, w/2 + 145, h/2 + 70);

    g.fillStyle(0x2A2A2A);
    g.fillTriangle(w/2 - 100, h/2 + 30, w/2 - 140, h/2 - 5, w/2 - 140, h/2 + 70);
    g.lineStyle(3, 0x000000);
    g.strokeTriangle(w/2 - 100, h/2 + 30, w/2 - 140, h/2 - 5, w/2 - 140, h/2 + 70);

    g.fillStyle(0x440000);
    g.fillTriangle(w/2 - 60, h/2 + 35, w/2 + 60, h/2 + 35, w/2, h/2 + 120);

    g.fillStyle(0xFFFFFF);
    for (let i = 0; i < 7; i++) {
        const tx = w/2 - 50 + i * 16;
        g.fillTriangle(tx, h/2 + 38, tx + 11, h/2 + 38, tx + 5.5, h/2 + 65);
    }
    for (let i = 0; i < 5; i++) {
        const tx = w/2 - 30 + i * 14;
        g.fillTriangle(tx, h/2 + 105, tx + 10, h/2 + 105, tx + 5, h/2 + 80);
    }

    g.fillStyle(0xFFEB3B);
    g.fillCircle(w/2 + 28, h/2 + 5, 16);
    g.fillStyle(0xFF6F00);
    g.fillCircle(w/2 + 30, h/2 + 6, 11);
    g.fillStyle(0x000000);
    g.fillCircle(w/2 + 31, h/2 + 7, 6);
    g.fillStyle(0xFFFFFF, 0.9);
    g.fillCircle(w/2 + 33, h/2 + 4, 3);

    g.generateTexture('boss_angler', w, h);
    g.destroy();
}

function drawSeaBackground(scene, bg) {
    if (scene.bgGraphics) scene.bgGraphics.destroy();
    if (scene.bgWaves) scene.bgWaves.forEach(w => w.destroy());
    scene.bgGraphics = scene.add.graphics().setDepth(-10);
    scene.bgGraphics.fillGradientStyle(bg.top, bg.top, bg.bottom, bg.bottom, 1);
    scene.bgGraphics.fillRect(0, 0, GAME_W, GAME_H);

    scene.bgWaves = [];
    for (let i = 0; i < 4; i++) {
        const y = 80 + i * 60;
        const wave = scene.add.graphics().setDepth(-9).setAlpha(0.12);
        wave.lineStyle(3, 0xffffff, 1);
        wave.beginPath();
        for (let x = 0; x <= GAME_W; x += 20) {
            const yy = y + Math.sin(x / 40) * 8;
            if (x === 0) wave.moveTo(x, yy); else wave.lineTo(x, yy);
        }
        wave.strokePath();
        scene.bgWaves.push(wave);
    }
}

function startBackgroundBubbles(scene, alphaRef) {
    if (!scene.bubbleList) scene.bubbleList = [];
    const spawn = () => {
        const x = Phaser.Math.Between(0, GAME_W);
        const size = Phaser.Math.Between(18, 38);
        const a = alphaRef.value;
        const bubble = scene.add.text(x, GAME_H + 30, '🫧', { fontSize: `${size}px` })
            .setOrigin(0.5).setAlpha(a).setDepth(-5);
        scene.bubbleList.push(bubble);
        scene.tweens.add({
            targets: bubble, y: -40,
            x: x + Phaser.Math.Between(-40, 40),
            duration: Phaser.Math.Between(5000, 9000),
            onComplete: () => {
                const idx = scene.bubbleList.indexOf(bubble);
                if (idx >= 0) scene.bubbleList.splice(idx, 1);
                bubble.destroy();
            }
        });
    };
    for (let i = 0; i < 6; i++) scene.time.delayedCall(i * 600, spawn);
    scene.time.addEvent({ delay: 700, loop: true, callback: spawn });
}

function playTone(scene, freq, duration, volume, type = 'sine', endFreq = null) {
    try {
        const ctx = scene.sound.context;
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + duration);
    } catch (e) {}
}

function isDarkBg(bg) {
    const c = bg.bottom;
    const r = (c >> 16) & 0xFF, g = (c >> 8) & 0xFF, b = c & 0xFF;
    return (r + g + b) / 3 < 40;
}

function spawnExplosion(scene, x, y, scale = 1) {
    const emojis = ['💥', '✨', '⚡', '💢', '🔥'];
    const count = Math.floor(8 * scale);
    for (let i = 0; i < count; i++) {
        const e = scene.add.text(x, y, Phaser.Math.RND.pick(emojis), {
            fontSize: `${(40 + Math.random() * 20) * scale}px`
        }).setOrigin(0.5).setDepth(15);
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        const dist = (60 + Math.random() * 80) * scale;
        scene.tweens.add({
            targets: e, x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist,
            scale: 1.5 * scale, alpha: 0,
            duration: 600 + Math.random() * 300, ease: 'Cubic.easeOut',
            onComplete: () => e.destroy()
        });
    }
}

class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }
    create() {
        for (let lv = 1; lv <= 8; lv++) createSubmarineTexture(this, lv);
        createBuggyTexture(this);
        createJetTexture(this);
        createSpaceshipTexture(this);
        createMissileTexture(this);
        createOarfishTexture(this);
        createAnglerfishTexture(this);
        this.scene.start('TitleScene');
    }
}

class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }
    create() {
        const alphaRef = { value: 0.45 };
        drawSeaBackground(this, { top: 0x0099d6, bottom: 0x004080 });
        startBackgroundBubbles(this, alphaRef);

        const coins = storage.getCoins();
        const level = getLevelFromCoins(coins);
        const deepest = storage.getDeepest();
        const unlocked = storage.getUnlocked();

        const title = this.add.text(GAME_W / 2, 130, '深海大冒険', {
            fontSize: '78px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFD54A', stroke: '#001f4d', strokeThickness: 12
        }).setOrigin(0.5);
        this.tweens.add({
            targets: title, scale: 1.04, duration: 1200,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        this.add.text(GAME_W / 2, 205, '〜 ステージを えらんで ぼうけん！ 〜', {
            fontSize: '20px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#001f4d', strokeThickness: 5
        }).setOrigin(0.5);

        this.menuItems = [];
        WORLDS.forEach((w, i) => {
            const y = 270 + i * 90;
            const isUnlocked = (i + 1) <= unlocked;
            const label = isUnlocked
                ? `${w.icon}  ${w.name} で ぼうけん  ▶`
                : `${w.icon}  ${w.name}  🔒`;
            const btn = this.add.text(GAME_W / 2, y, label, {
                fontSize: '30px', fontFamily: FONT, fontStyle: 'bold',
                color: isUnlocked ? '#FFFFFF' : '#888888',
                backgroundColor: isUnlocked ? '#FF6B00' : '#333333',
                padding: { x: 30, y: 16 },
                stroke: isUnlocked ? '#5B2200' : '#000000', strokeThickness: 3
            }).setOrigin(0.5);

            if (isUnlocked) {
                btn.setInteractive({ useHandCursor: true });
                this.tweens.add({ targets: btn, scale: 1.05, duration: 800,
                    yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
                const action = () => {
                    bgm.play('normal');
                    this.scene.start('GameScene', { worldIndex: i });
                };
                btn.on('pointerdown', action);
                this.menuItems.push({ btn, y, action });
            }
        });

        this.menuIndex = 0;
        this.selectionMarker = this.add.text(0, 0, '▶', {
            fontSize: '40px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFEB3B', stroke: '#001f4d', strokeThickness: 5
        }).setOrigin(1, 0.5).setDepth(20);
        this.tweens.add({ targets: this.selectionMarker, alpha: 0.4,
            duration: 400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this.updateMenuSelection();

        this.input.keyboard.on('keydown-UP', () => this.moveMenu(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.moveMenu(1));
        this.input.keyboard.on('keydown-ENTER', () => this.confirmMenu());
        this.input.keyboard.on('keydown-SPACE', () => this.confirmMenu());

        if (this.input.gamepad) {
            this.input.gamepad.on('down', (pad, button) => {
                if (button.index === 12) this.moveMenu(-1);
                else if (button.index === 13) this.moveMenu(1);
                else if (button.index === 0 || button.index === 9) this.confirmMenu();
            });
        }

        this.add.text(GAME_W / 2, 720, `レベル ${level}  ·  🪙 ${coins}`, {
            fontSize: '26px', fontFamily: FONT, fontStyle: 'bold',
            color: '#00E5FF', stroke: '#001f4d', strokeThickness: 5
        }).setOrigin(0.5);
        if (deepest > 0) {
            this.add.text(GAME_W / 2, 760, `さいしんきろく ${deepest}m`, {
                fontSize: '20px', fontFamily: FONT,
                color: '#FFFFFF', stroke: '#001f4d', strokeThickness: 3
            }).setOrigin(0.5);
        }

        this.add.text(GAME_W / 2, 815, 'ぜんステージクリア → 新ステージ アンロック！', {
            fontSize: '18px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFD54A', stroke: '#001f4d', strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(GAME_W / 2, 870, 'ゆびで じょうげさゆう うごける', {
            fontSize: '20px', fontFamily: FONT,
            color: '#FFFFFF', stroke: '#001f4d', strokeThickness: 3
        }).setOrigin(0.5);
        this.add.text(GAME_W / 2, 905, '⭐💎🌟🍩 アイテムでパワーアップ！', {
            fontSize: '18px', fontFamily: FONT,
            color: '#FFD54A', stroke: '#001f4d', strokeThickness: 3
        }).setOrigin(0.5);

        const resetBtn = this.add.text(GAME_W / 2, 950, '⚠️ ぜんぶ リセット', {
            fontSize: '16px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFFFFF', backgroundColor: '#7A0000',
            padding: { x: 14, y: 6 }, stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        resetBtn.on('pointerdown', () => this.showResetConfirm());

        bgm.play('title');
    }

    moveMenu(dir) {
        if (!this.menuItems || this.menuItems.length === 0) return;
        this.menuIndex = (this.menuIndex + dir + this.menuItems.length) % this.menuItems.length;
        this.updateMenuSelection();
        playTone(this, 600, 0.05, 0.04, 'square');
    }

    confirmMenu() {
        if (!this.menuItems || this.menuItems.length === 0) return;
        playTone(this, 1100, 0.1, 0.05, 'square');
        this.menuItems[this.menuIndex].action();
    }

    updateMenuSelection() {
        if (!this.menuItems[this.menuIndex] || !this.selectionMarker) return;
        const item = this.menuItems[this.menuIndex];
        this.selectionMarker.x = item.btn.x - item.btn.displayWidth / 2 - 12;
        this.selectionMarker.y = item.y;
    }

    showResetConfirm() {
        const overlay = this.add.rectangle(GAME_W/2, GAME_H/2, GAME_W, GAME_H, 0x000000, 0.8).setDepth(60);
        const box = this.add.rectangle(GAME_W/2, GAME_H/2, GAME_W - 80, 320, 0x222222)
            .setStrokeStyle(4, 0xFF1744).setDepth(61);
        const title = this.add.text(GAME_W/2, GAME_H/2 - 100, '⚠️ かくにん ⚠️', {
            fontSize: '34px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FF6B6B', stroke: '#000', strokeThickness: 5
        }).setOrigin(0.5).setDepth(62);
        const msg = this.add.text(GAME_W/2, GAME_H/2 - 30,
            'コイン・きろく・アンロック\nぜんぶ きえます！', {
            fontSize: '22px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#000', strokeThickness: 4, align: 'center'
        }).setOrigin(0.5).setDepth(62);

        const yesBtn = this.add.text(GAME_W/2 - 90, GAME_H/2 + 80, 'リセット', {
            fontSize: '26px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFFFFF', backgroundColor: '#C62828',
            padding: { x: 22, y: 12 }, stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(62).setInteractive({ useHandCursor: true });
        const noBtn = this.add.text(GAME_W/2 + 90, GAME_H/2 + 80, 'やめる', {
            fontSize: '26px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFFFFF', backgroundColor: '#444444',
            padding: { x: 22, y: 12 }, stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(62).setInteractive({ useHandCursor: true });

        yesBtn.on('pointerdown', () => {
            storage.resetAll();
            playTone(this, 200, 0.4, 0.1, 'sawtooth');
            this.scene.restart();
        });
        noBtn.on('pointerdown', () => {
            overlay.destroy(); box.destroy(); title.destroy(); msg.destroy();
            yesBtn.destroy(); noBtn.destroy();
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }

    create(data) {
        this.worldIndex = (data && typeof data.worldIndex === 'number') ? data.worldIndex : 0;
        this.world = WORLDS[this.worldIndex];
        this.stages = this.world.stages;

        const requestedStage = (data && data.startStage) ? data.startStage : 1;
        const startStage = Math.min(Math.max(1, requestedStage), this.stages.length);

        this.score = 0;
        const baseCoins = (data && typeof data.startCoins === 'number') ? data.startCoins : storage.getCoins();
        this.totalCoins = baseCoins;
        if (baseCoins > 0) storage.setCoins(baseCoins);
        this.runCoins = 0;
        this.level = getLevelFromCoins(this.totalCoins);
        this.startLevel = this.level;
        this.applyLevelStats();
        this.hp = this.maxHp;

        this.isGameOver = false;
        this.stage = startStage;
        this.stageElapsed = 0;
        this.bossSpawned = false;
        this.midBossSpawned = false;
        this.bossActive = false;
        this.midBossActive = false;
        this.bossDefeated = false;
        this.depth = this.stages[startStage - 1].depthStart;
        this.deepestThisRun = this.depth;

        this.buffs = { fast: 0, missile: 0, invincible: 0 };
        this.specialWeapon = null;
        this.allies = [];
        this.bonusCompleted = startStage > 3;
        this.inBonusStage = false;
        this.gamePaused = false;

        this.alphaRef = { value: this.stages[startStage - 1].bubbleAlpha };
        drawSeaBackground(this, this.stages[startStage - 1].bg);
        startBackgroundBubbles(this, this.alphaRef);

        const playerTex = this.world.vehicle === 'submarine' ? `submarine_${this.level}` : `${this.world.vehicle}_1`;
        this.player = this.physics.add.image(GAME_W / 2, GAME_H - 150, playerTex);
        this.player.setSize(60, 90).setOffset(35, 40);
        this.player.body.setCollideWorldBounds(true);
        this.player.alive = true;
        this.player.bumpInvuln = false;

        this.tweens.add({
            targets: this.player, angle: { from: -3, to: 3 },
            duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        this.bullets = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.items = this.physics.add.group();
        this.bossBullets = this.physics.add.group();

        this.createUI();

        this.shootTimer = this.time.addEvent({ delay: this.fireDelay, loop: true, callback: () => this.shoot() });
        this.enemyTimer = this.time.addEvent({ delay: 1300, loop: true, callback: () => this.spawnEnemy() });
        this.itemTimer = this.time.addEvent({ delay: 14000, loop: true, callback: () => this.spawnItem() });
        this.unkoTimer = null;
        this.gameTimer = this.time.addEvent({ delay: 1000, loop: true, callback: () => this.tickGameTime() });

        this.input.on('pointerdown', (pointer) => this.movePlayerTo(pointer.x, pointer.y));
        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) this.movePlayerTo(pointer.x, pointer.y);
        });
        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.overlap(this.bullets, this.enemies, this.bulletHit, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.playerHit, null, this);
        this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
        this.physics.add.overlap(this.player, this.bossBullets, this.bossBulletHit, null, this);

        this.showStageBanner(`ステージ ${startStage}\n${this.stages[startStage - 1].name}`, 1800);
        bgm.play(startStage <= 2 ? 'normal' : 'deep');

        this.refreshHeadlight();
    }

    refreshHeadlight() {
        const stage = this.stages[this.stage - 1];
        const dark = isDarkBg(stage.bg);
        if (dark && !this.headlightBeam) {
            this.headlightBeam = this.add.graphics().setDepth(-3);
            this.headlightLeft = this.add.text(0, 0, '💡', { fontSize: '18px' }).setOrigin(0.5).setDepth(7);
            this.headlightRight = this.add.text(0, 0, '💡', { fontSize: '18px' }).setOrigin(0.5).setDepth(7);
        } else if (!dark && this.headlightBeam) {
            this.headlightBeam.destroy(); this.headlightBeam = null;
            this.headlightLeft.destroy(); this.headlightLeft = null;
            this.headlightRight.destroy(); this.headlightRight = null;
        }
    }

    updateHeadlight() {
        if (!this.headlightBeam || !this.player.alive) return;
        const px = this.player.x, py = this.player.y - 60;
        this.headlightLeft.x = this.player.x - 22; this.headlightLeft.y = py + 5;
        this.headlightRight.x = this.player.x + 22; this.headlightRight.y = py + 5;
        this.headlightBeam.clear();
        this.headlightBeam.fillStyle(0xFFEB3B, 0.18);
        this.headlightBeam.beginPath();
        this.headlightBeam.moveTo(px - 30, py);
        this.headlightBeam.lineTo(px + 30, py);
        this.headlightBeam.lineTo(px + 180, 0);
        this.headlightBeam.lineTo(px - 180, 0);
        this.headlightBeam.closePath();
        this.headlightBeam.fillPath();
        this.headlightBeam.fillStyle(0xFFEB3B, 0.35);
        this.headlightBeam.beginPath();
        this.headlightBeam.moveTo(px - 12, py);
        this.headlightBeam.lineTo(px + 12, py);
        this.headlightBeam.lineTo(px + 80, 0);
        this.headlightBeam.lineTo(px - 80, 0);
        this.headlightBeam.closePath();
        this.headlightBeam.fillPath();
    }

    applyLevelStats() {
        const stats = getLevelStats(this.level);
        this.maxHp = stats.maxHp;
        this.fireDelay = stats.fireDelay;
        this.bulletSpeed = stats.bulletSpeed;
        this.moveSpeed = stats.moveSpeed;
    }

    createUI() {
        this.scoreText = this.add.text(15, 15, 'スコア 0', {
            fontSize: '22px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#001f4d', strokeThickness: 4
        }).setDepth(20);
        this.coinText = this.add.text(15, 42, '🪙 0', {
            fontSize: '22px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFD54A', stroke: '#001f4d', strokeThickness: 4
        }).setDepth(20);
        this.levelText = this.add.text(15, 70, `Lv.${this.level}`, {
            fontSize: '20px', fontFamily: FONT, fontStyle: 'bold',
            color: '#00E5FF', stroke: '#001f4d', strokeThickness: 4
        }).setDepth(20);

        this.depthText = this.add.text(GAME_W / 2 - 30, 15, `${this.depth}${this.world.depthUnit}`, {
            fontSize: '24px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#001f4d', strokeThickness: 5
        }).setOrigin(0.5, 0).setDepth(20);
        this.stageText = this.add.text(GAME_W / 2 - 30, 46, '', {
            fontSize: '14px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFD54A', stroke: '#001f4d', strokeThickness: 3
        }).setOrigin(0.5, 0).setDepth(20);

        const hpBarW = 175, hpBarX = GAME_W - 15 - hpBarW;
        this.hpBarBg = this.add.rectangle(hpBarX + hpBarW / 2, 28, hpBarW, 26, 0x000000)
            .setStrokeStyle(2, 0xFFFFFF).setDepth(20);
        this.hpBar = this.add.rectangle(hpBarX + 2, 28, hpBarW - 4, 20, 0x4CAF50)
            .setOrigin(0, 0.5).setDepth(21);
        this.hpText = this.add.text(hpBarX + hpBarW / 2, 28, `HP ${this.maxHp}/${this.maxHp}`, {
            fontSize: '15px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(22);
        this.hpBarPulsing = false;

        this.buffContainer = this.add.container(GAME_W / 2, 100).setDepth(20);
        this.buffIcons = {};

        this.updateHpBar();
    }

    updateHpBar() {
        const ratio = Math.max(0, this.hp / this.maxHp);
        this.hpBar.scaleX = ratio;
        if (ratio < 0.25) this.hpBar.fillColor = 0xFF1744;
        else if (ratio < 0.5) this.hpBar.fillColor = 0xFF9800;
        else this.hpBar.fillColor = 0x4CAF50;
        this.hpText.setText(`HP ${Math.max(0, this.hp)}/${this.maxHp}`);

        if (ratio < 0.25 && !this.hpBarPulsing) {
            this.hpBarPulsing = true;
            this.hpBarPulseTween = this.tweens.add({
                targets: [this.hpBar, this.hpBarBg, this.hpText],
                alpha: 0.4, duration: 300, yoyo: true, repeat: -1
            });
        } else if (ratio >= 0.25 && this.hpBarPulsing) {
            this.hpBarPulsing = false;
            if (this.hpBarPulseTween) this.hpBarPulseTween.remove();
            this.hpBar.alpha = 1; this.hpBarBg.alpha = 1; this.hpText.alpha = 1;
        }
    }

    updateBuffUI() {
        const now = this.time.now;
        const types = [
            { key: 'fast', emoji: '⭐', color: '#FFFFFF' },
            { key: 'missile', emoji: '💎', color: '#00E5FF' },
            { key: 'invincible', emoji: '🍩', color: '#FF80AB' }
        ];
        const active = types.filter(t => this.buffs[t.key] > now);

        Object.values(this.buffIcons).forEach(g => g.destroy());
        this.buffIcons = {};

        const startX = -((active.length - 1) * 70) / 2;
        active.forEach((t, i) => {
            const remaining = Math.ceil((this.buffs[t.key] - now) / 1000);
            const ic = this.add.text(startX + i * 70, 0, `${t.emoji}${remaining}`, {
                fontSize: '22px', fontFamily: FONT, fontStyle: 'bold',
                color: t.color, stroke: '#001f4d', strokeThickness: 4
            }).setOrigin(0.5);
            this.buffContainer.add(ic);
            this.buffIcons[t.key] = ic;
        });
    }

    update() {
        if (this.isGameOver) return;
        if (this.gamePaused) return;
        const now = this.time.now;

        if (this.player.alive) {
            if (this.cursors.left.isDown) this.player.x = Math.max(50, this.player.x - this.moveSpeed);
            if (this.cursors.right.isDown) this.player.x = Math.min(GAME_W - 50, this.player.x + this.moveSpeed);
            if (this.cursors.up.isDown) this.player.y = Math.max(PLAYER_Y_MIN, this.player.y - this.moveSpeed);
            if (this.cursors.down.isDown) this.player.y = Math.min(PLAYER_Y_MAX, this.player.y + this.moveSpeed);

            const pad = this.input.gamepad && this.input.gamepad.pad1;
            if (pad) {
                const dz = 0.22;
                const ax = pad.axes.length > 0 ? pad.axes[0].getValue() : 0;
                const ay = pad.axes.length > 1 ? pad.axes[1].getValue() : 0;
                let dx = 0, dy = 0;
                if (Math.abs(ax) > dz) dx = ax;
                else if (pad.left && pad.left.isDown) dx = -1;
                else if (pad.right && pad.right.isDown) dx = 1;
                if (Math.abs(ay) > dz) dy = ay;
                else if (pad.up && pad.up.isDown) dy = -1;
                else if (pad.down && pad.down.isDown) dy = 1;
                if (dx !== 0) this.player.x = Phaser.Math.Clamp(this.player.x + dx * this.moveSpeed, 50, GAME_W - 50);
                if (dy !== 0) this.player.y = Phaser.Math.Clamp(this.player.y + dy * this.moveSpeed, PLAYER_Y_MIN, PLAYER_Y_MAX);
            }
        }

        if (this.shieldFx && this.player.alive) {
            this.shieldFx.x = this.player.x; this.shieldFx.y = this.player.y;
        }
        if (this.bossGlow && this.boss && this.boss.active) {
            this.bossGlow.x = this.boss.x; this.bossGlow.y = this.boss.y;
        }
        this.updateHeadlight();
        this.updateLaser();
        if (this.allies.length && this.player.alive) {
            this.allies.forEach((ally, i) => {
                const offset = i === 0 ? -90 : 90;
                ally.x = Phaser.Math.Clamp(this.player.x + offset, 30, GAME_W - 30);
                ally.y = Phaser.Math.Clamp(this.player.y + 30, PLAYER_Y_MIN + 30, PLAYER_Y_MAX);
            });
        }

        if (this.buffs.invincible > 0 && this.buffs.invincible < now) this.endBuff('invincible');
        this.updateBuffUI();

        if (!this.bossActive) {
            const stage = this.stages[this.stage - 1];
            const t = Math.min(1, this.stageElapsed / stage.duration);
            this.depth = Math.floor(stage.depthStart + (stage.depthEnd - stage.depthStart) * t);
            this.depthText.setText(`${this.depth}${this.world.depthUnit}`);
            if (this.depth > this.deepestThisRun) this.deepestThisRun = this.depth;
        }

        this.bullets.getChildren().forEach(b => { if (b.y < -60) b.destroy(); });
        this.enemies.getChildren().forEach(e => {
            if (!e.isBoss && !e.isMidBoss && e.y > GAME_H + 80) e.destroy();
        });
        this.items.getChildren().forEach(i => { if (i.y > GAME_H + 80) i.destroy(); });
        this.bossBullets.getChildren().forEach(b => {
            if (b.y > GAME_H + 80 || b.y < -80 || b.x < -80 || b.x > GAME_W + 80) b.destroy();
        });
    }

    movePlayerTo(screenX, screenY) {
        if (!this.player.alive) return;
        const cam = this.cameras.main;
        const x = (screenX - cam.x) / cam.zoom;
        const y = (screenY - cam.y) / cam.zoom;
        this.player.x = Phaser.Math.Clamp(x, 50, GAME_W - 50);
        this.player.y = Phaser.Math.Clamp(y, PLAYER_Y_MIN, PLAYER_Y_MAX);
    }

    tickGameTime() {
        if (this.bossActive) return;
        if (this.inBonusStage) return;
        this.stageElapsed++;
        const stage = this.stages[this.stage - 1];

        if (this.stageElapsed >= stage.midBossTime && !this.midBossSpawned && !this.bossSpawned) {
            this.midBossSpawned = true;
            this.spawnMidBoss();
        }
        if (this.stageElapsed >= stage.bossTime && !this.bossSpawned && !this.midBossActive) {
            this.bossSpawned = true;
            this.spawnBoss();
        }

        if (this.stage >= 2 && !this.unkoTimer && this.stageElapsed > 5) {
            const delay = this.stage <= 2 ? 7000 : (this.stage <= 3 ? 5500 : 4500);
            this.unkoTimer = this.time.addEvent({ delay, loop: true, callback: () => this.spawnUnko() });
        }
    }

    showStageBanner(text, duration) {
        const banner = this.add.text(GAME_W / 2, GAME_H / 2, text, {
            fontSize: '52px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFD54A', stroke: '#001f4d', strokeThickness: 9, align: 'center'
        }).setOrigin(0.5).setDepth(30).setScale(0);
        this.tweens.add({ targets: banner, scale: 1, duration: 300, ease: 'Back.easeOut' });
        this.time.delayedCall(duration, () => {
            this.tweens.add({ targets: banner, alpha: 0, duration: 300,
                onComplete: () => banner.destroy() });
        });
    }

    fireBulletsFrom(x, y) {
        if (this.specialWeapon === 'laser') {
            const angles = [-0.42, 0, 0.42];
            const speed = 880;
            for (const a of angles) {
                const bullet = this.add.rectangle(x, y, 7, 34, 0xFF1744)
                    .setStrokeStyle(2, 0xFFFFFF);
                this.bullets.add(bullet);
                bullet.body.setSize(7, 34);
                bullet.damage = 4;
                bullet.isLaser = true;
                bullet.body.setVelocity(Math.sin(a) * speed, -Math.cos(a) * speed);
                bullet.rotation = a;
            }
            return;
        }

        const now = this.time.now;
        const isPiercing = this.specialWeapon === 'piercing';
        const isMissile = this.buffs.missile > now || isPiercing;
        const isFast = this.buffs.fast > now;

        let bullet;
        if (isMissile) {
            bullet = this.add.image(x, y, 'missile');
            this.bullets.add(bullet);
            bullet.body.setSize(16, 36).setOffset(8, 8);
            bullet.damage = isPiercing ? 8 : 5;
        } else {
            bullet = this.add.text(x, y, '🫧', { fontSize: '40px' }).setOrigin(0.5);
            this.bullets.add(bullet);
            bullet.body.setSize(28, 28).setOffset(6, 6);
            bullet.damage = 1;
        }
        if (isPiercing) {
            bullet.piercing = true;
            bullet.hitEnemies = new Set();
            bullet.setTint && bullet.setTint(0xFFD700);
        }
        const speed = (isFast ? this.bulletSpeed * 1.7 : this.bulletSpeed);
        bullet.body.setVelocity(0, -speed * (isPiercing ? 1.1 : 1));
    }

    shoot() {
        if (this.isGameOver || !this.player.alive) return;
        this.fireBulletsFrom(this.player.x, this.player.y - 60);
        const now = this.time.now;
        if (this.specialWeapon === 'laser') playTone(this, 1500, 0.05, 0.04, 'square', 700);
        else if (this.buffs.missile > now || this.specialWeapon === 'piercing') playTone(this, 600, 0.06, 0.035, 'sawtooth', 200);
        else playTone(this, this.buffs.fast > now ? 1400 : 1100, 0.04, 0.025, 'sine');
    }

    spawnEnemy() {
        if (this.isGameOver || this.bossActive || this.midBossActive) return;
        const stage = this.stages[this.stage - 1];
        const t = Phaser.Math.RND.pick(stage.enemies);
        const x = Phaser.Math.Between(50, GAME_W - 50);
        const enemy = this.add.text(x, -60, t.emoji, { fontSize: `${t.size}px` }).setOrigin(0.5);
        if (t.tint) enemy.setTint(t.tint);
        this.enemies.add(enemy);
        enemy.body.setSize(t.size * 0.7, t.size * 0.7).setOffset(t.size * 0.15, t.size * 0.2);
        enemy.body.setVelocity(0, t.speed);
        enemy.points = t.points;
        enemy.coins = t.coins;
        enemy.hp = 1;
        enemy.contactDamage = 10;
        enemy.isInstantKill = false;

        this.tweens.add({
            targets: enemy,
            x: Phaser.Math.Clamp(x + Phaser.Math.Between(-80, 80), 50, GAME_W - 50),
            duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });
    }

    spawnUnko() {
        if (this.isGameOver || this.bossActive || this.midBossActive) return;
        const x = Phaser.Math.Between(50, GAME_W - 50);
        const unko = this.add.text(x, -60, '💩', { fontSize: '72px' }).setOrigin(0.5);
        this.enemies.add(unko);
        unko.body.setSize(50, 50).setOffset(11, 14);
        unko.body.setVelocity(0, 130);
        unko.points = 200;
        unko.coins = 30;
        unko.hp = 1;
        unko.contactDamage = 9999;
        unko.isInstantKill = true;
        this.tweens.add({ targets: unko, scale: 1.18, duration: 380,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        const warn = this.add.text(unko.x, 50, '⚠️', { fontSize: '40px' }).setOrigin(0.5).setDepth(15);
        this.tweens.add({ targets: warn, alpha: 0, duration: 1200,
            onComplete: () => warn.destroy() });
    }

    spawnItem() {
        if (this.isGameOver) return;
        const items = [
            { emoji: '⭐', type: 'star_fast', size: 56, weight: 3 },
            { emoji: '💎', type: 'diamond', size: 56, weight: 3 },
            { emoji: '🍩', type: 'donut', size: 58, weight: 2 },
            { emoji: '❤️', type: 'heart', size: 54, weight: 2 }
        ];
        const weighted = [];
        items.forEach(it => { for (let i = 0; i < it.weight; i++) weighted.push(it); });
        const t = Phaser.Math.RND.pick(weighted);
        const x = Phaser.Math.Between(50, GAME_W - 50);
        const item = this.add.text(x, -60, t.emoji, { fontSize: `${t.size}px` }).setOrigin(0.5);
        this.items.add(item);
        item.body.setSize(t.size * 0.7, t.size * 0.7).setOffset(t.size * 0.15, t.size * 0.15);
        item.body.setVelocity(0, 90);
        item.itemType = t.type;
        this.tweens.add({ targets: item, angle: 360, duration: 1800, repeat: -1 });
    }

    spawnDonut() {
        if (this.isGameOver) return;
        const x = Phaser.Math.Between(50, GAME_W - 50);
        const item = this.add.text(x, -60, '🍩', { fontSize: '58px' }).setOrigin(0.5);
        this.items.add(item);
        item.body.setSize(40, 40).setOffset(9, 9);
        item.body.setVelocity(0, 90);
        item.itemType = 'donut';
        this.tweens.add({ targets: item, angle: 360, duration: 1800, repeat: -1 });
        const aura = this.add.circle(x, -60, 36, 0xFF80AB, 0.4).setDepth(-1);
        this.tweens.add({ targets: aura, alpha: 0.1, scale: 1.4, duration: 500, yoyo: true, repeat: -1 });
        item.aura = aura;
        this.time.addEvent({ delay: 50, loop: true, callback: () => {
            if (!item.active) { aura.destroy(); return; }
            aura.x = item.x; aura.y = item.y;
        }});
    }

    bulletHit(bullet, enemy) {
        if (bullet.piercing) {
            if (!bullet.hitEnemies) bullet.hitEnemies = new Set();
            if (bullet.hitEnemies.has(enemy)) return;
            bullet.hitEnemies.add(enemy);
        }
        const damage = bullet.damage || 1;

        if (enemy.isBoss || enemy.isMidBoss) {
            enemy.hp -= damage;
            this.updateBossHp(enemy);
            const hitFx = this.add.text(bullet.x, bullet.y, damage > 1 ? '💥' : '💢', { fontSize: '50px' }).setOrigin(0.5);
            this.tweens.add({ targets: hitFx, scale: 1.5, alpha: 0, duration: 300,
                onComplete: () => hitFx.destroy() });
            this.tweens.add({ targets: enemy, alpha: 0.5, duration: 60, yoyo: true });
            if (!bullet.piercing) bullet.destroy();
            if (bullet.isLaser) playTone(this, 1800, 0.08, 0.07, 'square', 600);
            else playTone(this, 200, 0.08, 0.06, 'square');
            if (enemy.hp <= 0) {
                if (enemy.isBoss) this.defeatBoss(enemy);
                else this.defeatMidBoss(enemy);
            }
            return;
        }

        this.addPoints(enemy.points || 10);
        this.addCoins(enemy.coins || 10);
        spawnExplosion(this, enemy.x, enemy.y, enemy.isInstantKill ? 1.5 : 1);

        const popup = this.add.text(enemy.x, enemy.y, `+${enemy.points || 10} 🪙${enemy.coins || 10}`, {
            fontSize: '22px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFEB3B', stroke: '#001f4d', strokeThickness: 4
        }).setOrigin(0.5);
        this.tweens.add({ targets: popup, y: popup.y - 60, alpha: 0, duration: 700,
            onComplete: () => popup.destroy() });

        if (!bullet.piercing) bullet.destroy();
        enemy.destroy();
        if (bullet.isLaser) playTone(this, 1600, 0.06, 0.06, 'square', 500);
        else playTone(this, 600, 0.08, 0.06, 'square');
    }

    addPoints(p) {
        this.score += p;
        this.scoreText.setText('スコア ' + this.score);
    }

    addCoins(c) {
        this.runCoins += c;
        this.totalCoins += c;
        storage.setCoins(this.totalCoins);
        this.coinText.setText('🪙 ' + this.runCoins);
        this.checkLevelUp();
    }

    checkLevelUp() {
        const newLevel = getLevelFromCoins(this.totalCoins);
        if (newLevel > this.level) {
            const oldLevel = this.level;
            this.level = newLevel;
            this.levelUpEffect(oldLevel, newLevel);
        }
    }

    levelUpEffect(from, to) {
        this.applyLevelStats();
        this.hp = this.maxHp;
        this.updateHpBar();
        if (this.shootTimer) this.shootTimer.delay = this.fireDelay;

        if (this.world.vehicle === 'submarine') this.player.setTexture(`submarine_${to}`);
        this.levelText.setText(`Lv.${to}`);

        const banner = this.add.text(GAME_W / 2, GAME_H / 2, `⚡ レベル ${to} ⚡\nパワーアップ！`, {
            fontSize: '48px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFD700', stroke: '#001f4d', strokeThickness: 9, align: 'center'
        }).setOrigin(0.5).setDepth(40).setScale(0);
        this.tweens.add({ targets: banner, scale: 1, duration: 400, ease: 'Back.easeOut' });
        this.time.delayedCall(1800, () => {
            this.tweens.add({ targets: banner, alpha: 0, duration: 400,
                onComplete: () => banner.destroy() });
        });

        this.cameras.main.flash(400, 255, 215, 0);
        for (let i = 0; i < 16; i++) {
            const angle = (Math.PI * 2 / 16) * i;
            const star = this.add.text(this.player.x, this.player.y, '⭐', { fontSize: '40px' })
                .setOrigin(0.5).setDepth(20);
            this.tweens.add({
                targets: star,
                x: this.player.x + Math.cos(angle) * 200,
                y: this.player.y + Math.sin(angle) * 200,
                alpha: 0, duration: 1000,
                onComplete: () => star.destroy()
            });
        }

        playTone(this, 523, 0.15, 0.08, 'square');
        this.time.delayedCall(150, () => playTone(this, 659, 0.15, 0.08, 'square'));
        this.time.delayedCall(300, () => playTone(this, 784, 0.15, 0.08, 'square'));
        this.time.delayedCall(450, () => playTone(this, 1047, 0.4, 0.08, 'square'));
    }

    playerHit(player, enemy) {
        if (this.isGameOver || !player.alive) return;

        const now = this.time.now;
        if (this.buffs.invincible > now) {
            this.handleProtectedHit(enemy, true);
            return;
        }
        if (player.bumpInvuln) return;

        const damage = enemy.contactDamage || 10;

        if (enemy.isInstantKill) {
            this.takeDamage(this.maxHp, this.player.x, this.player.y);
            spawnExplosion(this, enemy.x, enemy.y, 1.5);
            this.cameras.main.flash(300, 80, 50, 30);
            enemy.destroy();
            return;
        }

        this.takeDamage(damage, this.player.x, this.player.y);

        if (!enemy.isBoss && !enemy.isMidBoss) enemy.destroy();

        this.applyBumpInvuln();
        this.cameras.main.shake(150, 0.012);
        playTone(this, 200, 0.25, 0.09, 'sawtooth');
    }

    bossBulletHit(player, bullet) {
        if (this.isGameOver || !player.alive) return;
        const now = this.time.now;

        if (this.buffs.invincible > now) {
            spawnExplosion(this, bullet.x, bullet.y, 0.6);
            bullet.destroy();
            playTone(this, 800, 0.08, 0.05, 'sine');
            return;
        }
        if (player.bumpInvuln) {
            bullet.destroy();
            return;
        }

        const damage = bullet.damage || 30;
        this.takeDamage(damage, this.player.x, this.player.y);
        spawnExplosion(this, bullet.x, bullet.y, 0.8);
        bullet.destroy();
        this.applyBumpInvuln();
        this.cameras.main.shake(140, 0.012);
        playTone(this, 250, 0.22, 0.09, 'sawtooth');
    }

    takeDamage(amount, x, y) {
        this.hp = Math.max(0, this.hp - amount);
        this.updateHpBar();
        this.showDamagePopup(x, y, amount);
        if (this.specialWeapon) this.loseSpecialWeapon();
        if (this.hp <= 0) this.playerDeath();
    }

    showDamagePopup(x, y, amount) {
        const txt = this.add.text(x, y - 30, `-${amount}`, {
            fontSize: amount >= 100 ? '52px' : '40px',
            fontFamily: FONT, fontStyle: 'bold',
            color: '#FF1744', stroke: '#FFFFFF', strokeThickness: 6
        }).setOrigin(0.5).setDepth(40);
        this.tweens.add({
            targets: txt, y: txt.y - 80, scale: 1.3, alpha: 0,
            duration: 1100, ease: 'Cubic.easeOut',
            onComplete: () => txt.destroy()
        });
    }

    handleProtectedHit(enemy, givePoints) {
        if (enemy.isBoss || enemy.isMidBoss) {
            enemy.hp -= 3;
            this.updateBossHp(enemy);
            spawnExplosion(this, this.player.x, this.player.y - 30, 1);
            this.tweens.add({ targets: enemy, alpha: 0.5, duration: 60, yoyo: true });
            playTone(this, 800, 0.1, 0.06, 'sine');
            if (givePoints) this.addPoints(50);
            if (enemy.hp <= 0) {
                if (enemy.isBoss) this.defeatBoss(enemy);
                else this.defeatMidBoss(enemy);
            }
            return;
        }
        if (givePoints) {
            this.addPoints(enemy.points || 50);
            this.addCoins(enemy.coins || 10);
        }
        spawnExplosion(this, enemy.x, enemy.y, 1.2);
        enemy.destroy();
        playTone(this, 800, 0.1, 0.06, 'sine');
    }

    applyBumpInvuln() {
        this.player.bumpInvuln = true;
        this.tweens.add({
            targets: this.player, alpha: 0.3, duration: 100,
            yoyo: true, repeat: 7,
            onComplete: () => {
                this.player.alpha = 1;
                this.player.bumpInvuln = false;
            }
        });
    }

    collectItem(player, item) {
        const t = item.itemType;
        if (t === 'heart') {
            if (this.hp < this.maxHp) {
                const before = this.hp;
                this.hp = Math.min(this.maxHp, this.hp + 100);
                const gained = this.hp - before;
                this.updateHpBar();
                const txt = this.add.text(this.player.x, this.player.y - 50, `+${gained}`, {
                    fontSize: '38px', fontFamily: FONT, fontStyle: 'bold',
                    color: '#4CAF50', stroke: '#FFFFFF', strokeThickness: 5
                }).setOrigin(0.5).setDepth(40);
                this.tweens.add({ targets: txt, y: txt.y - 60, alpha: 0, duration: 1000,
                    onComplete: () => txt.destroy() });
            } else {
                this.addPoints(100);
            }
        } else if (t === 'star_fast') this.activateBuff('fast');
        else if (t === 'diamond') this.activateBuff('missile');
        else if (t === 'donut') this.activateBuff('invincible');

        const cheer = this.add.text(item.x, item.y, '🎉', { fontSize: '70px' }).setOrigin(0.5);
        this.tweens.add({ targets: cheer, scale: 2, alpha: 0, duration: 500,
            onComplete: () => cheer.destroy() });
        item.destroy();
        playTone(this, 1200, 0.15, 0.06, 'triangle', 400);
    }

    playStageBGM() {
        if (this.bossActive) bgm.play(this.stage >= 5 ? 'boss5' : 'boss');
        else if (this.inBonusStage) bgm.play('victory');
        else bgm.play(this.stage <= 2 ? 'normal' : 'deep');
    }

    activateBuff(type) {
        const now = this.time.now;
        const base = Math.max(this.buffs[type], now);
        this.buffs[type] = base + (BUFF_DURATIONS[type] || 20000);

        if (type === 'invincible') bgm.play('invincible');

        if (type === 'invincible' && !this.shieldFx) {
            this.shieldFx = this.add.circle(this.player.x, this.player.y, 70, 0xFFD700, 0.25);
            this.shieldFx.setStrokeStyle(5, 0xFFEB3B);
            this.shieldFx.setDepth(5);
            this.shieldTween = this.tweens.add({
                targets: this.shieldFx, scale: 1.18, alpha: 0.45,
                duration: 400, yoyo: true, repeat: -1
            });
        }
        this.cameras.main.flash(200, 255, 215, 100);
        playTone(this, 500, 0.1, 0.07, 'square');
        this.time.delayedCall(100, () => playTone(this, 800, 0.15, 0.07, 'square'));
    }

    endBuff(type) {
        this.buffs[type] = 0;
        if (type === 'invincible') {
            if (this.shieldFx) { this.shieldFx.destroy(); this.shieldFx = null; }
            if (this.shieldTween) { this.shieldTween.remove(); this.shieldTween = null; }
            this.playStageBGM();
        }
    }

    spawnMidBoss() {
        const stage = this.stages[this.stage - 1];
        const m = stage.midBoss;
        this.midBossActive = true;
        this.showStageBanner('⚠️ 中ボス！', 1600);
        playTone(this, 300, 0.3, 0.1, 'sawtooth');

        this.time.delayedCall(1600, () => {
            const x = GAME_W / 2;
            const mb = this.add.text(x, -100, m.emoji, { fontSize: `${m.size}px` }).setOrigin(0.5);
            if (m.tint) mb.setTint(m.tint);
            this.physics.add.existing(mb);
            mb.body.setSize(m.size * 0.7, m.size * 0.7).setOffset(m.size * 0.15, m.size * 0.2);
            mb.body.moves = false; mb.body.allowGravity = false;
            mb.hp = m.hp; mb.maxHp = m.hp;
            mb.points = m.points; mb.coins = m.coins;
            mb.contactDamage = m.contactDamage || 30;
            mb.bossName = m.name;
            mb.bossEmoji = m.emoji;
            mb.isMidBoss = true;
            this.enemies.add(mb);
            this.midBoss = mb;

            this.midBossHpBg = this.add.rectangle(GAME_W / 2, 130, 360, 24, 0x000000)
                .setStrokeStyle(2, 0xFFFFFF).setDepth(20);
            this.midBossHpBar = this.add.rectangle(GAME_W / 2 - 178, 130, 356, 18, 0xFF6F00)
                .setOrigin(0, 0.5).setDepth(21);
            this.midBossLabel = this.add.text(GAME_W / 2, 130, `${m.name}  ${m.hp}/${m.hp}`, {
                fontSize: '16px', fontFamily: FONT, fontStyle: 'bold',
                color: '#FFFFFF', stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5).setDepth(22);

            this.tweens.add({
                targets: mb, y: 230, duration: 1000, ease: 'Bounce.easeOut',
                onComplete: () => {
                    this.midBossMoveTween = this.tweens.add({
                        targets: mb,
                        x: { from: 100, to: GAME_W - 100 },
                        duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
                    });
                }
            });
        });
    }

    defeatMidBoss(mb) {
        if (this.midBossMoveTween) { this.midBossMoveTween.remove(); this.midBossMoveTween = null; }
        const x = mb.x, y = mb.y;
        mb.body.enable = false;
        for (let i = 0; i < 4; i++) {
            this.time.delayedCall(i * 150, () => spawnExplosion(this,
                x + Phaser.Math.Between(-50, 50), y + Phaser.Math.Between(-30, 30), 1.4));
        }
        this.tweens.add({ targets: mb, alpha: 0, scale: 0.5, angle: 90,
            duration: 800, onComplete: () => mb.destroy() });
        this.cameras.main.shake(400, 0.02);
        if (this.midBossHpBg) this.midBossHpBg.destroy();
        if (this.midBossHpBar) this.midBossHpBar.destroy();
        if (this.midBossLabel) this.midBossLabel.destroy();

        this.addPoints(mb.points);
        this.addCoins(mb.coins);
        const popup = this.add.text(x, y, `+${mb.points} 🪙${mb.coins}`, {
            fontSize: '28px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFEB3B', stroke: '#001f4d', strokeThickness: 5
        }).setOrigin(0.5).setDepth(20);
        this.tweens.add({ targets: popup, y: y - 100, alpha: 0, duration: 1200,
            onComplete: () => popup.destroy() });

        this.midBossActive = false;
        this.midBoss = null;
    }

    updateBossHp(enemy) {
        if (enemy.isBoss) {
            const ratio = Math.max(0, enemy.hp / enemy.maxHp);
            this.bossHpBar.scaleX = ratio;
            if (ratio < 0.3) this.bossHpBar.fillColor = 0xFFEB3B;
            else if (ratio < 0.6) this.bossHpBar.fillColor = 0xFF6F00;
            else this.bossHpBar.fillColor = 0xFF0000;
            if (this.bossLabel && enemy.bossName) {
                this.bossLabel.setText(`${enemy.bossEmoji || '👾'} ${enemy.bossName}  ${Math.max(0, enemy.hp)}/${enemy.maxHp}`);
            }
        } else if (enemy.isMidBoss && this.midBossHpBar) {
            const ratio = Math.max(0, enemy.hp / enemy.maxHp);
            this.midBossHpBar.scaleX = ratio;
            if (this.midBossLabel && enemy.bossName) {
                this.midBossLabel.setText(`${enemy.bossName}  ${Math.max(0, enemy.hp)}/${enemy.maxHp}`);
            }
        }
    }

    spawnBoss() {
        const stage = this.stages[this.stage - 1];
        const b = stage.boss;
        this.bossActive = true;
        this.bossDefeated = false;

        if (this.enemyTimer) this.enemyTimer.remove();
        if (this.unkoTimer) { this.unkoTimer.remove(); this.unkoTimer = null; }

        this.enemies.getChildren().forEach(e => {
            if (!e.isBoss && !e.isMidBoss) {
                this.tweens.add({ targets: e, alpha: 0, duration: 300,
                    onComplete: () => e.destroy() });
            }
        });

        this.cameras.main.shake(2200, 0.025);
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 380, () => {
                this.cameras.main.flash(180, 255, 0, 0);
                playTone(this, 200 + i * 50, 0.25, 0.1, 'square');
            });
        }
        this.time.delayedCall(1900, () => playTone(this, 400, 0.6, 0.12, 'sawtooth', 1400));
        this.time.delayedCall(2400, () => playTone(this, 400, 0.6, 0.12, 'sawtooth', 1400));

        const warning = this.add.text(GAME_W / 2, GAME_H / 2, `⚠️ ${b.name} ⚠️`, {
            fontSize: '54px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FF1744', stroke: '#FFFFFF', strokeThickness: 10
        }).setOrigin(0.5).setDepth(40).setScale(0);
        this.tweens.add({
            targets: warning, scale: 1.2, duration: 400, ease: 'Back.easeOut'
        });
        this.tweens.add({
            targets: warning, alpha: 0.4, duration: 200, yoyo: true, repeat: 6, delay: 400
        });
        this.time.delayedCall(3200, () => {
            this.tweens.add({ targets: warning, alpha: 0, duration: 300,
                onComplete: () => warning.destroy() });
        });

        if (this.stage >= 5) bgm.play('boss5');
        else bgm.play('boss');

        this.time.delayedCall(3300, () => {
            let boss;
            if (b.custom === 'oarfish') {
                boss = this.add.image(GAME_W / 2, -150, 'boss_oarfish').setScale(0.95);
            } else if (b.custom === 'angler') {
                boss = this.add.image(GAME_W / 2, -200, 'boss_angler').setScale(0.95);
            } else {
                boss = this.add.text(GAME_W / 2, -150, b.emoji, { fontSize: `${b.size}px` }).setOrigin(0.5);
                if (b.tint) boss.setTint(b.tint);
            }
            this.physics.add.existing(boss);
            const bw = boss.displayWidth, bh = boss.displayHeight;
            boss.body.setSize(bw * 0.65, bh * 0.55);
            boss.body.setOffset(bw * 0.175, bh * 0.225);
            boss.body.moves = false;
            boss.body.allowGravity = false;
            boss.hp = b.hp; boss.maxHp = b.hp;
            boss.points = b.points; boss.coins = b.coins;
            boss.contactDamage = b.contactDamage || 50;
            boss.bossName = b.name;
            boss.bossEmoji = b.emoji || '👾';
            boss.isBoss = true;
            this.enemies.add(boss);
            this.boss = boss;

            this.bossGlow = this.add.circle(GAME_W / 2, -150, 130, b.glowColor || 0xFF1744, 0.3).setDepth(-2);
            this.bossGlowTween = this.tweens.add({
                targets: this.bossGlow, scale: 1.25, alpha: 0.5,
                duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });

            this.bossHpBg = this.add.rectangle(GAME_W / 2, 130, 460, 36, 0x000000)
                .setStrokeStyle(3, 0xFFFFFF).setDepth(20);
            this.bossHpBar = this.add.rectangle(GAME_W / 2 - 228, 130, 456, 32, 0xFF0000)
                .setOrigin(0, 0.5).setDepth(21);
            this.bossLabel = this.add.text(GAME_W / 2, 130, `${b.emoji || '👾'} ${b.name}  ${b.hp}/${b.hp}`, {
                fontSize: '18px', fontFamily: FONT, fontStyle: 'bold',
                color: '#FFFFFF', stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5).setDepth(22);

            this.tweens.add({
                targets: boss, y: 240, duration: 1500, ease: 'Bounce.easeOut',
                onComplete: () => this.startBossMovement()
            });

            this.bossIdleTween = this.tweens.add({
                targets: boss, scaleX: { from: boss.scaleX * 0.96, to: boss.scaleX * 1.08 },
                scaleY: { from: boss.scaleY * 0.96, to: boss.scaleY * 1.08 },
                duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
        });
    }

    startBossMovement() {
        if (!this.boss || !this.boss.active) return;
        const halfW = this.boss.displayWidth / 2;
        this.bossMoveTween = this.tweens.add({
            targets: this.boss,
            x: { from: halfW + 20, to: GAME_W - halfW - 20 },
            duration: Math.max(1400, 2400 - (this.stage - 1) * 200),
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });
        this.bossLungeTimer = this.time.addEvent({
            delay: Math.max(3000, 5500 - (this.stage - 1) * 500), loop: true,
            callback: () => this.bossLunge()
        });
        this.bossItemTimer = this.time.addEvent({
            delay: 18000, loop: true, callback: () => this.spawnItem()
        });
        this.time.delayedCall(2000, () => this.spawnDonut());
        this.bossDonutTimer = this.time.addEvent({
            delay: 30000, loop: true, callback: () => this.spawnDonut()
        });
        const stage = this.stages[this.stage - 1];
        this.bossAttackTimer = this.time.delayedCall(800, () => {
            this.bossAttack();
            this.bossAttackTimerLoop = this.time.addEvent({
                delay: stage.boss.attackDelay, loop: true,
                callback: () => this.bossAttack()
            });
        });
    }

    bossLunge() {
        if (!this.boss || !this.boss.active || this.bossDefeated) return;
        const origY = 240;
        const startScaleX = this.boss.scaleX, startScaleY = this.boss.scaleY;

        for (let i = 0; i < 3; i++) {
            this.time.delayedCall(i * 80, () => {
                if (!this.boss || !this.boss.active) return;
                const after = this.add.text(this.boss.x, this.boss.y, this.boss.text || '',
                    { fontSize: this.boss.style ? this.boss.style.fontSize : '200px' })
                    .setOrigin(0.5).setAlpha(0.3).setDepth(this.boss.depth - 1);
                if (this.boss.texture && !this.boss.text) {
                    after.destroy();
                    const img = this.add.image(this.boss.x, this.boss.y, this.boss.texture.key)
                        .setScale(this.boss.scaleX, this.boss.scaleY).setAlpha(0.3).setDepth(this.boss.depth - 1);
                    if (this.boss.tintTopLeft !== undefined && this.boss.tintTopLeft !== 0xFFFFFF) {
                        img.setTint(this.boss.tintTopLeft);
                    }
                    this.tweens.add({ targets: img, alpha: 0, duration: 400,
                        onComplete: () => img.destroy() });
                } else {
                    if (this.boss.tintTopLeft !== undefined && this.boss.tintTopLeft !== 0xFFFFFF) {
                        after.setTint(this.boss.tintTopLeft);
                    }
                    this.tweens.add({ targets: after, alpha: 0, duration: 400,
                        onComplete: () => after.destroy() });
                }
            });
        }

        this.tweens.add({
            targets: this.boss, scaleX: startScaleX * 1.2, scaleY: startScaleY * 1.2,
            duration: 200,
            onComplete: () => {
                if (!this.boss || !this.boss.active) return;
                this.tweens.add({
                    targets: this.boss, y: origY + 320, duration: 380, ease: 'Cubic.easeIn',
                    onComplete: () => {
                        if (!this.boss || !this.boss.active) return;
                        this.cameras.main.shake(200, 0.02);
                        this.tweens.add({
                            targets: this.boss, y: origY,
                            scaleX: startScaleX, scaleY: startScaleY,
                            duration: 800, ease: 'Cubic.easeOut'
                        });
                    }
                });
            }
        });
    }

    bossAttack() {
        if (this.isGameOver || !this.boss || !this.boss.active || this.bossDefeated) return;
        const stage = this.stages[this.stage - 1];
        const bConfig = stage.boss;
        const sx = this.boss.x, sy = this.boss.y + this.boss.displayHeight / 3;

        const tellFx = this.add.text(sx, sy, '✦', { fontSize: '50px',
            color: '#FF1744', stroke: '#FFFFFF', strokeThickness: 4 }).setOrigin(0.5).setDepth(15);
        this.tweens.add({ targets: tellFx, scale: 2, alpha: 0, duration: 250,
            onComplete: () => tellFx.destroy() });

        if (bConfig.attackPattern === 'single') {
            this.fireBossBullet(sx, sy, 0, bConfig.bulletSpeed, bConfig.bulletEmoji, bConfig.contactDamage);
        } else if (bConfig.attackPattern === 'spread3') {
            for (const dx of [-180, 0, 180]) {
                this.fireBossBullet(sx, sy, dx, bConfig.bulletSpeed, bConfig.bulletEmoji, bConfig.contactDamage);
            }
        } else if (bConfig.attackPattern === 'aimed') {
            this.fireAimedBullet(sx, sy, this.player.x, this.player.y,
                bConfig.bulletSpeed, bConfig.bulletEmoji, bConfig.contactDamage);
        } else if (bConfig.attackPattern === 'spread5') {
            for (let i = -2; i <= 2; i++) {
                const angle = i * 0.32;
                const vx = Math.sin(angle) * bConfig.bulletSpeed;
                const vy = Math.cos(angle) * bConfig.bulletSpeed;
                this.fireBossBullet(sx, sy, vx, vy, bConfig.bulletEmoji, bConfig.contactDamage);
            }
        } else if (bConfig.attackPattern === 'aimedSalvo') {
            if (!this.salvoTimers) this.salvoTimers = [];
            for (let i = 0; i < 3; i++) {
                const t = this.time.delayedCall(i * 130, () => {
                    if (this.isGameOver || !this.boss || !this.boss.active || this.bossDefeated) return;
                    this.fireAimedBullet(this.boss.x, this.boss.y + this.boss.displayHeight / 3,
                        this.player.x, this.player.y,
                        bConfig.bulletSpeed, bConfig.bulletEmoji, bConfig.contactDamage);
                });
                this.salvoTimers.push(t);
            }
        }

        playTone(this, 350, 0.12, 0.07, 'square');
    }

    fireBossBullet(x, y, vx, vy, emoji, damage) {
        const bullet = this.add.text(x, y, emoji, { fontSize: '50px' }).setOrigin(0.5).setDepth(8);
        this.bossBullets.add(bullet);
        bullet.body.setSize(36, 36);
        bullet.body.setVelocity(vx, vy);
        bullet.damage = damage;
        this.tweens.add({ targets: bullet, angle: 360, duration: 800, repeat: -1 });
    }

    fireAimedBullet(x, y, targetX, targetY, speed, emoji, damage) {
        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        this.fireBossBullet(x, y, dx / dist * speed, dy / dist * speed, emoji, damage);
    }

    defeatBoss(boss) {
        if (this.bossDefeated) return;
        this.bossDefeated = true;
        this.addPoints(boss.points);
        this.addCoins(boss.coins);

        if (this.bossMoveTween) this.bossMoveTween.remove();
        if (this.bossLungeTimer) this.bossLungeTimer.remove();
        if (this.bossItemTimer) this.bossItemTimer.remove();
        if (this.bossDonutTimer) { this.bossDonutTimer.remove(); this.bossDonutTimer = null; }
        if (this.bossAttackTimerLoop) this.bossAttackTimerLoop.remove();
        if (this.bossAttackTimer) this.bossAttackTimer.remove();
        if (this.bossIdleTween) this.bossIdleTween.remove();
        if (this.salvoTimers) { this.salvoTimers.forEach(t => t.remove()); this.salvoTimers = []; }
        if (this.bossGlowTween) { this.bossGlowTween.remove(); this.bossGlowTween = null; }
        if (this.bossGlow) {
            const glow = this.bossGlow;
            this.bossGlow = null;
            this.tweens.add({ targets: glow, alpha: 0, scale: 2, duration: 800,
                onComplete: () => glow.destroy() });
        }

        this.bossBullets.getChildren().forEach(b => {
            this.tweens.add({ targets: b, alpha: 0, duration: 200,
                onComplete: () => b.destroy() });
        });

        const bx = boss.x, by = boss.y;
        boss.body.enable = false;

        for (let i = 0; i < 8; i++) {
            this.time.delayedCall(i * 180, () => {
                const x = bx + Phaser.Math.Between(-100, 100);
                const y = by + Phaser.Math.Between(-80, 80);
                spawnExplosion(this, x, y, 2);
                playTone(this, 100 + Math.random() * 80, 0.4, 0.12, 'sawtooth');
            });
        }

        this.tweens.add({ targets: boss, alpha: 0, scale: 0.5, angle: 180,
            duration: 1500, onComplete: () => boss && boss.destroy() });

        const rewardPopup = this.add.text(bx, by, `+${boss.points} 🪙${boss.coins}！`, {
            fontSize: '40px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFEB3B', stroke: '#001f4d', strokeThickness: 6
        }).setOrigin(0.5).setDepth(30);
        this.tweens.add({ targets: rewardPopup, y: by - 120, alpha: 0, duration: 2000,
            onComplete: () => rewardPopup.destroy() });

        this.cameras.main.shake(1000, 0.03);
        this.cameras.main.flash(800, 255, 255, 200);

        this.time.delayedCall(800, () => {
            if (this.bossHpBg) this.bossHpBg.destroy();
            if (this.bossHpBar) this.bossHpBar.destroy();
            if (this.bossLabel) this.bossLabel.destroy();
        });

        this.time.delayedCall(2500, () => {
            if (this.inBonusStage) {
                this.spawnTreasureItem(bx, by);
            } else if (this.stage === 3 && !this.bonusCompleted) {
                this.enterBonusStage();
            } else if (this.stage >= this.stages.length) {
                this.ultimateVictory();
            } else {
                this.advanceStage();
            }
        });
    }

    spawnTreasureItem(srcX, srcY) {
        const item = this.add.text(srcX, srcY, '🎁', { fontSize: '90px' }).setOrigin(0.5).setDepth(15);
        this.tweens.add({ targets: item, angle: 360, duration: 1200, repeat: -1 });
        this.tweens.add({ targets: item, scale: { from: 0.9, to: 1.25 }, duration: 400, yoyo: true, repeat: -1 });

        const sparkleTimer = this.time.addEvent({ delay: 100, repeat: 30, callback: () => {
            const s = this.add.text(item.x + Phaser.Math.Between(-50, 50), item.y + Phaser.Math.Between(-50, 50), '✨', {
                fontSize: '28px'
            }).setOrigin(0.5).setDepth(14);
            this.tweens.add({ targets: s, alpha: 0, scale: 0.5, duration: 700,
                onComplete: () => s.destroy() });
        }});

        const msg = this.add.text(GAME_W/2, srcY - 130, 'たからばこ かいほう！\nアイテム ゲット！', {
            fontSize: '32px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFD700', stroke: '#000', strokeThickness: 6, align: 'center'
        }).setOrigin(0.5).setDepth(15);
        this.tweens.add({ targets: msg, scale: 1.1, duration: 600, yoyo: true, repeat: 1 });

        playTone(this, 600, 0.15, 0.08, 'square');
        this.time.delayedCall(180, () => playTone(this, 800, 0.15, 0.08, 'square'));
        this.time.delayedCall(360, () => playTone(this, 1100, 0.3, 0.1, 'square'));

        this.time.delayedCall(1800, () => {
            sparkleTimer.remove();
            msg.destroy();
            this.tweens.add({
                targets: item, x: this.player.x, y: this.player.y,
                duration: 900, ease: 'Cubic.easeIn',
                onComplete: () => {
                    item.destroy();
                    this.cameras.main.flash(300, 255, 215, 0);
                    this.startSlotMachine();
                }
            });
        });
    }

    enterBonusStage() {
        this.inBonusStage = true;
        this.bossActive = false;
        this.bossSpawned = false;
        this.midBossSpawned = false;
        this.midBossActive = false;
        this.bossDefeated = false;
        this.boss = null;
        this.midBoss = null;

        this.alphaRef.value = 0.6;
        drawSeaBackground(this, { top: 0xFFD700, bottom: 0xFF6F00 });

        this.refreshHeadlight();

        this.cameras.main.flash(600, 255, 215, 0);
        this.showStageBanner(`🎁 ボーナスステージ！\nたからばこを たおせ！🎁`, 2200);
        bgm.play('victory');

        for (let i = 0; i < 3; i++) {
            this.time.delayedCall(i * 200, () => playTone(this, 523 + i * 130, 0.2, 0.08, 'square'));
        }

        if (this.enemyTimer) { this.enemyTimer.remove(); this.enemyTimer = null; }
        if (this.itemTimer) { this.itemTimer.remove(); this.itemTimer = null; }
        if (this.unkoTimer) { this.unkoTimer.remove(); this.unkoTimer = null; }

        this.enemies.getChildren().forEach(e => {
            if (!e.isBoss && !e.isMidBoss) e.destroy();
        });
        this.items.getChildren().forEach(i => i.destroy());

        this.time.delayedCall(2200, () => {
            if (!this.inBonusStage || this.isGameOver) return;
            this.spawnBonusBoss();
        });
    }

    spawnBonusBoss() {
        this.bossActive = true;
        this.showStageBanner('💎 ボーナスボス！💎', 1500);
        this.cameras.main.flash(400, 255, 215, 0);
        playTone(this, 600, 0.3, 0.1, 'square');

        this.time.delayedCall(1500, () => {
            const boss = this.add.text(GAME_W / 2, -150, '🎁', { fontSize: '180px' }).setOrigin(0.5);
            this.physics.add.existing(boss);
            boss.body.setSize(140, 140).setOffset(20, 25);
            boss.body.moves = false; boss.body.allowGravity = false;
            boss.hp = 40; boss.maxHp = 40;
            boss.points = 1000; boss.coins = 500;
            boss.contactDamage = 20;
            boss.bossName = 'たからばこ';
            boss.bossEmoji = '🎁';
            boss.isBoss = true;
            this.enemies.add(boss);
            this.boss = boss;

            this.bossGlow = this.add.circle(GAME_W / 2, -150, 130, 0xFFD700, 0.4).setDepth(-2);
            this.bossGlowTween = this.tweens.add({
                targets: this.bossGlow, scale: 1.3, alpha: 0.6,
                duration: 600, yoyo: true, repeat: -1
            });

            this.bossHpBg = this.add.rectangle(GAME_W / 2, 130, 460, 36, 0x000000)
                .setStrokeStyle(3, 0xFFD700).setDepth(20);
            this.bossHpBar = this.add.rectangle(GAME_W / 2 - 228, 130, 456, 32, 0xFFD700)
                .setOrigin(0, 0.5).setDepth(21);
            this.bossLabel = this.add.text(GAME_W / 2, 130, `🎁 ボーナスたからばこ  100/100`, {
                fontSize: '18px', fontFamily: FONT, fontStyle: 'bold',
                color: '#FFFFFF', stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5).setDepth(22);

            this.tweens.add({
                targets: boss, y: 240, duration: 1200, ease: 'Bounce.easeOut',
                onComplete: () => {
                    this.bossMoveTween = this.tweens.add({
                        targets: boss,
                        x: { from: 100, to: GAME_W - 100 },
                        duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
                    });
                    this.bossAttackTimerLoop = this.time.addEvent({
                        delay: 2000, loop: true, callback: () => {
                            if (!this.boss || !this.boss.active) return;
                            for (const dx of [-150, 0, 150]) {
                                this.fireBossBullet(this.boss.x, this.boss.y + 60, dx, 200, '✨', 20);
                            }
                            playTone(this, 700, 0.1, 0.06, 'square');
                        }
                    });
                }
            });

            this.bossIdleTween = this.tweens.add({
                targets: boss, scaleX: 1.1, scaleY: 1.1,
                duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
        });
    }

    pauseGameForSlot() {
        this.gamePaused = true;
        if (this.shootTimer) this.shootTimer.paused = true;
        if (this.enemyTimer) this.enemyTimer.paused = true;
        if (this.itemTimer) this.itemTimer.paused = true;
        if (this.unkoTimer) this.unkoTimer.paused = true;
        if (this.gameTimer) this.gameTimer.paused = true;
        if (this.bossAttackTimerLoop) this.bossAttackTimerLoop.paused = true;
        if (this.bossLungeTimer) this.bossLungeTimer.paused = true;
        if (this.bossItemTimer) this.bossItemTimer.paused = true;
        if (this.allyShootTimer) this.allyShootTimer.paused = true;
        this.enemies.getChildren().forEach(e => e.body && e.body.setVelocity(0, 0));
        this.bullets.getChildren().forEach(b => b.body && b.body.setVelocity(0, 0));
        this.bossBullets.getChildren().forEach(b => b.body && b.body.setVelocity(0, 0));
        this.items.getChildren().forEach(i => i.body && i.body.setVelocity(0, 0));
    }

    playFanfare() {
        const notes = [523, 659, 784, 1047, 1319];
        notes.forEach((f, i) => this.time.delayedCall(i * 110, () => playTone(this, f, 0.18, 0.1, 'square')));
        this.time.delayedCall(700, () => playTone(this, 1568, 0.5, 0.12, 'square'));
        this.time.delayedCall(700, () => playTone(this, 784, 0.5, 0.08, 'sine'));
    }

    startSlotMachine() {
        this.bossActive = true;
        this.pauseGameForSlot();
        const overlay = this.add.rectangle(GAME_W/2, GAME_H/2, GAME_W, GAME_H, 0x000000, 0.75).setDepth(50);

        const title = this.add.text(GAME_W/2, 200, '🎰 スロット！🎰', {
            fontSize: '48px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFD700', stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5).setDepth(51);

        const weapons = [
            { id: 'laser', emoji: '🔴', name: '巨大レーザー' },
            { id: 'piercing', emoji: '🚀', name: '貫通ミサイル' },
            { id: 'allies', emoji: this.world.icon, name: 'なかま2たい' }
        ];

        let currentIdx = 0;
        const slotIcon = this.add.text(GAME_W/2, GAME_H/2 - 30, weapons[0].emoji, {
            fontSize: '160px'
        }).setOrigin(0.5).setDepth(51);
        const slotName = this.add.text(GAME_W/2, GAME_H/2 + 100, weapons[0].name, {
            fontSize: '40px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#000', strokeThickness: 5
        }).setOrigin(0.5).setDepth(51);

        const finalIdx = Phaser.Math.Between(0, weapons.length - 1);

        const slotTimer = this.time.addEvent({
            delay: 110, loop: true, callback: () => {
                currentIdx = (currentIdx + 1) % weapons.length;
                slotIcon.setText(weapons[currentIdx].emoji);
                slotName.setText(weapons[currentIdx].name);
                playTone(this, 700 + currentIdx * 100, 0.04, 0.04, 'square');
            }
        });

        const hint = this.add.text(GAME_W/2, GAME_H - 200, 'ランダムで けってい中…', {
            fontSize: '24px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFEB3B', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(51);
        this.tweens.add({ targets: hint, alpha: 0.4, duration: 400, yoyo: true, repeat: -1 });

        this.time.delayedCall(2800, () => {
            slotTimer.remove();
            currentIdx = finalIdx;
            slotIcon.setText(weapons[currentIdx].emoji);
            slotName.setText(weapons[currentIdx].name);
            const selected = weapons[currentIdx];
            this.cameras.main.flash(500, 255, 215, 0);
            this.tweens.add({ targets: slotIcon, scale: 1.5, duration: 350, yoyo: true });
            this.playFanfare();
            for (let i = 0; i < 12; i++) {
                const angle = (Math.PI * 2 / 12) * i;
                const star = this.add.text(GAME_W/2, GAME_H/2, '⭐', { fontSize: '40px' })
                    .setOrigin(0.5).setDepth(52);
                this.tweens.add({
                    targets: star,
                    x: GAME_W/2 + Math.cos(angle) * 250,
                    y: GAME_H/2 + Math.sin(angle) * 250,
                    alpha: 0, duration: 1200,
                    onComplete: () => star.destroy()
                });
            }

            const got = this.add.text(GAME_W/2, GAME_H/2 + 200, `✨ ${selected.name} GET！ ✨`, {
                fontSize: '34px', fontFamily: FONT, fontStyle: 'bold',
                color: '#FFD700', stroke: '#000', strokeThickness: 5
            }).setOrigin(0.5).setDepth(51);

            this.applySpecialWeapon(selected.id);

            this.time.delayedCall(2200, () => {
                overlay.destroy(); title.destroy();
                slotIcon.destroy(); slotName.destroy();
                hint.destroy(); got.destroy();
                this.inBonusStage = false;
                this.bonusCompleted = true;
                this.bossActive = false;
                this.advanceStage();
            });
        });
    }

    applySpecialWeapon(id) {
        this.specialWeapon = id;
        if (id === 'allies') this.spawnAllies();
        if (this.specialIcon) this.specialIcon.destroy();
        const labels = { laser: '🔴 レーザー', piercing: '🚀 かんつう', allies: `${this.world.icon} なかま` };
        this.specialIcon = this.add.text(GAME_W - 15, 75, labels[id], {
            fontSize: '20px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFD700', stroke: '#001f4d', strokeThickness: 4
        }).setOrigin(1, 0).setDepth(20);
    }

    loseSpecialWeapon() {
        if (!this.specialWeapon) return;
        const lostName = this.specialWeapon;
        if (this.allies.length) {
            this.allies.forEach(a => a.destroy());
            this.allies = [];
        }
        if (this.allyShootTimer) { this.allyShootTimer.remove(); this.allyShootTimer = null; }
        if (this.laserBeam) { this.laserBeam.destroy(); this.laserBeam = null; }
        this.specialWeapon = null;
        if (this.specialIcon) { this.specialIcon.destroy(); this.specialIcon = null; }

        const lost = this.add.text(this.player.x, this.player.y - 80, `とくしゅぶき そうしつ！`, {
            fontSize: '22px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#FF1744', strokeThickness: 5
        }).setOrigin(0.5).setDepth(50);
        this.tweens.add({ targets: lost, y: lost.y - 60, alpha: 0, duration: 1500,
            onComplete: () => lost.destroy() });
    }

    spawnAllies() {
        const tex = this.world.vehicle === 'submarine' ? 'submarine_1' : `${this.world.vehicle}_1`;
        for (const offset of [-90, 90]) {
            const ally = this.physics.add.image(this.player.x + offset, this.player.y + 30, tex);
            ally.setScale(0.45);
            ally.setDepth(6);
            this.allies.push(ally);
        }
        if (this.allyShootTimer) this.allyShootTimer.remove();
        this.allyShootTimer = this.time.addEvent({
            delay: 320, loop: true, callback: () => this.alliesShoot()
        });
    }

    alliesShoot() {
        if (this.isGameOver || !this.player.alive) return;
        this.allies.forEach(ally => {
            this.fireBulletsFrom(ally.x, ally.y - 30);
        });
        playTone(this, 1300, 0.03, 0.02, 'sine');
    }

    updateLaser() {
        if (this.laserBeam) { this.laserBeam.destroy(); this.laserBeam = null; }
    }

    advanceStage() {
        this.gamePaused = false;
        this.stage++;
        this.stageElapsed = 0;
        this.bossSpawned = false;
        this.midBossSpawned = false;
        this.bossActive = false;
        this.midBossActive = false;
        this.bossDefeated = false;
        this.boss = null;
        this.midBoss = null;

        this.enemies.getChildren().forEach(e => {
            if (!e.isBoss && !e.isMidBoss) e.destroy();
        });
        this.items.getChildren().forEach(i => i.destroy());
        this.bullets.getChildren().forEach(b => b.destroy());
        this.bossBullets.getChildren().forEach(b => b.destroy());
        if (this.bubbleList) {
            this.bubbleList.forEach(b => { this.tweens.killTweensOf(b); b.destroy(); });
            this.bubbleList = [];
        }

        if (this.shootTimer) this.shootTimer.paused = false;
        if (this.gameTimer) this.gameTimer.paused = false;
        if (this.unkoTimer) this.unkoTimer.paused = false;
        if (this.itemTimer) this.itemTimer.remove();
        this.itemTimer = this.time.addEvent({ delay: 14000, loop: true, callback: () => this.spawnItem() });

        const stage = this.stages[this.stage - 1];
        this.alphaRef.value = stage.bubbleAlpha;
        drawSeaBackground(this, stage.bg);

        if (this.stage <= 2) bgm.play('normal');
        else bgm.play('deep');

        this.showStageBanner(`ステージ ${this.stage}\n${stage.name}\n${stage.depthStart}m〜`, 2400);
        this.depth = stage.depthStart;
        this.depthText.setText(`${this.depth}${this.world.depthUnit}`);

        if (this.enemyTimer) this.enemyTimer.remove();
        const baseDelay = Math.max(700, 1300 - (this.stage - 1) * 100);
        this.enemyTimer = this.time.addEvent({ delay: baseDelay, loop: true, callback: () => this.spawnEnemy() });

        this.refreshHeadlight();
    }

    ultimateVictory() {
        this.isGameOver = true;
        bgm.play('victory');
        if (this.deepestThisRun > storage.getDeepest()) storage.setDeepest(this.deepestThisRun);

        const worldIdx = this.worldIndex || 0;
        const nextUnlock = worldIdx + 2;
        const oldUnlock = storage.getUnlocked();
        let newVehicle = null;
        if (nextUnlock <= VEHICLES.length && nextUnlock > oldUnlock) {
            storage.setUnlocked(nextUnlock);
            newVehicle = VEHICLES[nextUnlock - 1];
        }

        const finalLevel = this.level;
        storage.setCoins(0);

        this.time.delayedCall(2000, () => {
            this.scene.start('GameOverScene', {
                score: this.score, victory: true, ultimate: true,
                runCoins: this.runCoins, totalCoins: 0,
                level: finalLevel, startLevel: this.startLevel,
                deepest: this.deepestThisRun, newUnlock: newVehicle, coinsReset: true,
                worldIndex: this.worldIndex
            });
        });
    }

    playerDeath() {
        if (!this.player.alive) return;
        this.player.alive = false;
        this.isGameOver = true;

        if (this.deepestThisRun > storage.getDeepest()) storage.setDeepest(this.deepestThisRun);

        if (this.shootTimer) this.shootTimer.remove();
        if (this.enemyTimer) this.enemyTimer.remove();
        if (this.itemTimer) this.itemTimer.remove();
        if (this.unkoTimer) this.unkoTimer.remove();
        if (this.gameTimer) this.gameTimer.remove();
        if (this.bossLungeTimer) this.bossLungeTimer.remove();
        if (this.bossMoveTween) this.bossMoveTween.remove();
        if (this.bossItemTimer) this.bossItemTimer.remove();
        if (this.bossDonutTimer) { this.bossDonutTimer.remove(); this.bossDonutTimer = null; }
        if (this.bossAttackTimerLoop) this.bossAttackTimerLoop.remove();
        if (this.bossAttackTimer) this.bossAttackTimer.remove();
        if (this.bossIdleTween) this.bossIdleTween.remove();
        if (this.bossGlowTween) { this.bossGlowTween.remove(); this.bossGlowTween = null; }
        if (this.midBossMoveTween) { this.midBossMoveTween.remove(); this.midBossMoveTween = null; }
        if (this.shieldTween) this.shieldTween.remove();
        if (this.hpBarPulseTween) this.hpBarPulseTween.remove();
        if (this.salvoTimers) { this.salvoTimers.forEach(t => t.remove()); this.salvoTimers = []; }

        if (this.bossGlow) { this.bossGlow.destroy(); this.bossGlow = null; }
        if (this.shieldFx) { this.shieldFx.destroy(); this.shieldFx = null; }
        if (this.laserBeam) { this.laserBeam.destroy(); this.laserBeam = null; }
        if (this.allyShootTimer) { this.allyShootTimer.remove(); this.allyShootTimer = null; }
        if (this.allies && this.allies.length) { this.allies.forEach(a => a.destroy()); this.allies = []; }
        if (this.specialIcon) { this.specialIcon.destroy(); this.specialIcon = null; }
        if (this.headlightBeam) { this.headlightBeam.destroy(); this.headlightBeam = null; }
        if (this.headlightLeft) { this.headlightLeft.destroy(); this.headlightLeft = null; }
        if (this.headlightRight) { this.headlightRight.destroy(); this.headlightRight = null; }

        const px = this.player.x, py = this.player.y;
        this.cameras.main.flash(500, 255, 200, 50);
        this.cameras.main.shake(1800, 0.05);

        this.player.setVisible(false);
        this.player.body.enable = false;

        for (let i = 0; i < 12; i++) {
            this.time.delayedCall(i * 150, () => {
                const x = px + Phaser.Math.Between(-100, 100);
                const y = py + Phaser.Math.Between(-80, 80);
                const scale = 1 + Math.random() * 1.5;
                spawnExplosion(this, x, y, scale);
                playTone(this, 80 + Math.random() * 100, 0.4, 0.13, 'sawtooth');
            });
        }

        const colors = [0xFFC107, 0xFF6F00, 0x4FC3F7, 0xBDBDBD, 0x616161];
        for (let i = 0; i < 16; i++) {
            const piece = this.add.rectangle(
                px + Phaser.Math.Between(-15, 15),
                py + Phaser.Math.Between(-15, 15),
                Phaser.Math.Between(8, 22),
                Phaser.Math.Between(8, 22),
                Phaser.Math.RND.pick(colors)
            ).setStrokeStyle(2, 0x4A2700).setDepth(10);
            const angle = Math.random() * Math.PI * 2;
            const speed = 200 + Math.random() * 250;
            this.tweens.add({
                targets: piece,
                x: px + Math.cos(angle) * speed,
                y: py + Math.sin(angle) * speed + 250,
                angle: Phaser.Math.Between(-720, 720),
                alpha: 0, duration: 1800, ease: 'Cubic.in',
                onComplete: () => piece.destroy()
            });
        }

        this.time.delayedCall(500, () => {
            const txt = this.add.text(px, py - 100, 'ガーン！💥', {
                fontSize: '60px', fontFamily: FONT, fontStyle: 'bold',
                color: '#FF1744', stroke: '#FFFFFF', strokeThickness: 6
            }).setOrigin(0.5).setDepth(50);
            this.tweens.add({ targets: txt, scale: 1.5, alpha: 0, duration: 1500,
                onComplete: () => txt.destroy() });
        });

        const finalLevel = this.level;
        const finalCoins = this.totalCoins;
        const dyingStage = this.stage;
        storage.setCoins(0);

        this.time.delayedCall(3000, () => {
            bgm.stop();
            this.scene.start('GameOverScene', {
                score: this.score, victory: false,
                runCoins: this.runCoins, totalCoins: 0,
                level: finalLevel, startLevel: this.startLevel,
                deepest: this.deepestThisRun, stage: dyingStage, coinsReset: true,
                worldIndex: this.worldIndex, retryStage: dyingStage,
                retryCoins: finalCoins
            });
        });
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() { super('GameOverScene'); }
    init(data) {
        this.finalScore = data.score || 0;
        this.victory = data.victory || false;
        this.ultimate = data.ultimate || false;
        this.runCoins = data.runCoins || 0;
        this.totalCoins = data.totalCoins || 0;
        this.endLevel = data.level || 1;
        this.startLevel = data.startLevel || 1;
        this.deepest = data.deepest || 0;
        this.newUnlock = data.newUnlock || null;
        this.coinsReset = data.coinsReset || false;
        this.worldIndex = data.worldIndex || 0;
        this.retryStage = data.retryStage || 1;
        this.retryCoins = data.retryCoins || 0;
    }
    create() {
        const alphaRef = { value: 0.3 };
        drawSeaBackground(this, this.victory
            ? { top: 0xFF9800, bottom: 0xE65100 }
            : { top: 0x4A148C, bottom: 0x000000 });
        startBackgroundBubbles(this, alphaRef);

        const title = this.ultimate ? '🏆 ぜんステージ\nクリア！🏆'
            : (this.victory ? 'ボス げきは！' : 'ゲームオーバー');
        this.add.text(GAME_W / 2, 130, title, {
            fontSize: this.ultimate ? '50px' : '54px',
            fontFamily: FONT, fontStyle: 'bold',
            color: this.victory ? '#FFD54A' : '#FF6B6B',
            stroke: '#001f4d', strokeThickness: 8, align: 'center'
        }).setOrigin(0.5);

        const world = WORLDS[this.worldIndex] || WORLDS[0];
        const vehicleTex = world.vehicle === 'submarine' ? `submarine_${this.endLevel}` : `${world.vehicle}_1`;

        if (this.victory) {
            const sub = this.add.image(GAME_W / 2, 300, vehicleTex).setScale(1.3);
            this.tweens.add({ targets: sub, y: '+=20', duration: 800,
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            for (let i = 0; i < 4; i++) {
                this.add.text(
                    GAME_W / 2 + Phaser.Math.Between(-160, 160),
                    300 + Phaser.Math.Between(-100, 100),
                    Phaser.Math.RND.pick(['🎉', '🎊', '⭐', '🏆']),
                    { fontSize: '50px' }
                ).setOrigin(0.5);
            }

            if (this.newUnlock) {
                const unlockBg = this.add.rectangle(GAME_W/2, 410, GAME_W - 40, 70, 0x000000, 0.6)
                    .setStrokeStyle(3, 0xFFD700);
                const unlockText = this.add.text(GAME_W/2, 410,
                    `🔓 アンロック！  ${this.newUnlock.icon} ${this.newUnlock.name}\n${this.newUnlock.worldName} ステージが あそべる！`, {
                    fontSize: '22px', fontFamily: FONT, fontStyle: 'bold',
                    color: '#FFD700', stroke: '#000000', strokeThickness: 4, align: 'center'
                }).setOrigin(0.5);
                this.tweens.add({ targets: [unlockBg, unlockText], scale: 1.05, duration: 600,
                    yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            }
        } else {
            this.add.image(GAME_W / 2, 300, vehicleTex).setScale(1.2).setAngle(35).setAlpha(0.6);
            this.add.text(GAME_W / 2 + 30, 270, '💥', { fontSize: '70px' }).setOrigin(0.5);
            this.add.text(GAME_W / 2 - 40, 330, '💥', { fontSize: '60px' }).setOrigin(0.5);
            this.add.text(GAME_W / 2, 380, '🔥', { fontSize: '50px' }).setOrigin(0.5);
        }

        const infoY = 480;
        this.add.text(GAME_W / 2, infoY, `スコア ${this.finalScore}`, {
            fontSize: '34px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#001f4d', strokeThickness: 5
        }).setOrigin(0.5);

        const coinLabel = this.coinsReset
            ? `🪙 +${this.runCoins}  (リセット！次は0から)`
            : `🪙 +${this.runCoins} (ぜんぶで ${this.totalCoins})`;
        this.add.text(GAME_W / 2, infoY + 50, coinLabel, {
            fontSize: '24px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFD54A', stroke: '#001f4d', strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(GAME_W / 2, infoY + 95, `さいしんきろく ${this.deepest}${world.depthUnit}`, {
            fontSize: '24px', fontFamily: FONT, fontStyle: 'bold',
            color: '#00E5FF', stroke: '#001f4d', strokeThickness: 4
        }).setOrigin(0.5);

        if (this.endLevel > this.startLevel) {
            const lvText = this.add.text(GAME_W / 2, infoY + 145,
                `⚡ レベル ${this.startLevel} → ${this.endLevel} ⚡`, {
                fontSize: '32px', fontFamily: FONT, fontStyle: 'bold',
                color: '#FFD700', stroke: '#001f4d', strokeThickness: 5
            }).setOrigin(0.5);
            this.tweens.add({ targets: lvText, scale: 1.1, duration: 500,
                yoyo: true, repeat: -1 });
        } else {
            this.add.text(GAME_W / 2, infoY + 145, `レベル ${this.endLevel}`, {
                fontSize: '26px', fontFamily: FONT,
                color: '#FFFFFF', stroke: '#001f4d', strokeThickness: 4
            }).setOrigin(0.5);
        }

        let comment;
        if (this.ultimate) comment = '🎊 だいぼうけん クリア！🎊';
        else if (this.victory) comment = 'やったね！';
        else if (this.runCoins >= 1000) comment = 'すごい！てんさい！⭐';
        else if (this.runCoins >= 500) comment = 'じょうず！👍';
        else if (this.runCoins >= 200) comment = 'いいね！🎉';
        else comment = 'がんばったね！';

        this.add.text(GAME_W / 2, 740, comment, {
            fontSize: '30px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFD54A', stroke: '#001f4d', strokeThickness: 5
        }).setOrigin(0.5);

        const restartBtn = this.add.text(GAME_W / 2, 830, '🔄 もういっかい', {
            fontSize: '42px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFFFFF', backgroundColor: '#FF6B00',
            padding: { x: 36, y: 18 }, stroke: '#5B2200', strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.tweens.add({ targets: restartBtn, scale: 1.08, duration: 650,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        const retryLabel = this.victory
            ? '🔄 もういっかい'
            : `🔄 ステージ ${this.retryStage} から`;
        restartBtn.setText(retryLabel);
        restartBtn.on('pointerdown', () => {
            bgm.play('normal');
            this.scene.start('GameScene', {
                worldIndex: this.worldIndex,
                startStage: this.victory ? 1 : this.retryStage,
                startCoins: this.victory ? 0 : this.retryCoins
            });
        });

        const titleBtn = this.add.text(GAME_W / 2, 905, 'タイトルへ', {
            fontSize: '24px', fontFamily: FONT,
            color: '#FFFFFF', stroke: '#001f4d', strokeThickness: 3
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        titleBtn.on('pointerdown', () => {
            bgm.play('title');
            this.scene.start('TitleScene');
        });

        const restartAction = () => {
            bgm.play('normal');
            this.scene.start('GameScene', {
                worldIndex: this.worldIndex,
                startStage: this.victory ? 1 : this.retryStage,
                startCoins: this.victory ? 0 : this.retryCoins
            });
        };
        const titleAction = () => {
            bgm.play('title');
            this.scene.start('TitleScene');
        };
        this.input.keyboard.on('keydown-ENTER', restartAction);
        this.input.keyboard.on('keydown-SPACE', restartAction);
        this.input.keyboard.on('keydown-ESC', titleAction);
        if (this.input.gamepad) {
            this.input.gamepad.on('down', (pad, button) => {
                if (button.index === 0 || button.index === 9) restartAction();
                else if (button.index === 1 || button.index === 8) titleAction();
            });
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: GAME_W,
    height: GAME_H,
    backgroundColor: '#001a40',
    scale: { mode: Phaser.Scale.FIT },
    input: { gamepad: true },
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
    scene: [BootScene, TitleScene, GameScene, GameOverScene]
};

new Phaser.Game(config);
