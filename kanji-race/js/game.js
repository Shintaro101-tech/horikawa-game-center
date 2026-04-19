const GAME_W = 540;
const GAME_H = 960;
const FONT = '"Hiragino Sans", "Yu Gothic", sans-serif';

const HORIZON_Y = 240;
const GROUND_Y = GAME_H + 30;
const ROAD_HALF_NEAR = 250;
const ROAD_HALF_FAR = 26;
const FAR_Z = 36;
const SCROLL_SPEED = 0.10;
const BG_SCROLL_SPEED = 0.42;
const POLE_SCROLL_SPEED = 0.50;
const LANE_SPAN = 400;
const QUESTION_GAP_MS = 2400;

const KANJI_GRADE_1 = [
    { k: '一', s: '一ねんせいです。', r: 'いちねんせいです。' },
    { k: '七', s: '七じにおきる。', r: 'しちじにおきる。' },
    { k: '下', s: 'つくえの下。', r: 'つくえのした。' },
    { k: '三', s: '三じのおやつ。', r: 'さんじのおやつ。' },
    { k: '上', s: 'つくえの上。', r: 'つくえのうえ。' },
    { k: '中', s: 'はこの中。', r: 'はこのなか。' },
    { k: '九', s: '九ひきのねこ。', r: 'きゅうひきのねこ。' },
    { k: '二', s: '二ほんのえんぴつ。', r: 'にほんのえんぴつ。' },
    { k: '五', s: '五さいのいもうと。', r: 'ごさいのいもうと。' },
    { k: '人', s: '人がおおい。', r: 'ひとがおおい。' },
    { k: '休', s: 'がっこうを休む。', r: 'がっこうをやすむ。' },
    { k: '先', s: '先にいく。', r: 'さきにいく。' },
    { k: '入', s: 'へやに入る。', r: 'へやにはいる。' },
    { k: '八', s: '八ひきの犬。', r: 'はちひきのいぬ。' },
    { k: '六', s: '六じにおきる。', r: 'ろくじにおきる。' },
    { k: '円', s: '百円のあめ。', r: 'ひゃくえんのあめ。' },
    { k: '出', s: 'いえを出る。', r: 'いえをでる。' },
    { k: '力', s: '力をだす。', r: 'ちからをだす。' },
    { k: '十', s: '十さいのおにいさん。', r: 'じゅっさいのおにいさん。' },
    { k: '千', s: '千えんさつ。', r: 'せんえんさつ。' },
    { k: '口', s: '口をあける。', r: 'くちをあける。' },
    { k: '右', s: '右をむく。', r: 'みぎをむく。' },
    { k: '名', s: '名まえをかく。', r: 'なまえをかく。' },
    { k: '四', s: '四つのりんご。', r: 'よっつのりんご。' },
    { k: '土', s: '土をほる。', r: 'つちをほる。' },
    { k: '夕', s: '夕やけがきれい。', r: 'ゆうやけがきれい。' },
    { k: '大', s: '大きな犬。', r: 'おおきないぬ。' },
    { k: '天', s: '天気がいい。', r: 'てんきがいい。' },
    { k: '女', s: '女の子。', r: 'おんなのこ。' },
    { k: '子', s: '子ねこがかわいい。', r: 'こねこがかわいい。' },
    { k: '字', s: '字をかく。', r: 'じをかく。' },
    { k: '学', s: '学校へいく。', r: 'がっこうへいく。' },
    { k: '小', s: '小さなとり。', r: 'ちいさなとり。' },
    { k: '山', s: '山にのぼる。', r: 'やまにのぼる。' },
    { k: '川', s: '川であそぶ。', r: 'かわであそぶ。' },
    { k: '左', s: '左をむく。', r: 'ひだりをむく。' },
    { k: '年', s: '一年生です。', r: 'いちねんせいです。' },
    { k: '花', s: '花がさく。', r: 'はながさく。' },
    { k: '草', s: '草がはえる。', r: 'くさがはえる。' },
    { k: '手', s: '手をあらう。', r: 'てをあらう。' },
    { k: '文', s: '文をよむ。', r: 'ぶんをよむ。' },
    { k: '日', s: '日がのぼる。', r: 'ひがのぼる。' },
    { k: '早', s: '早くおきる。', r: 'はやくおきる。' },
    { k: '月', s: '月がまるい。', r: 'つきがまるい。' },
    { k: '木', s: '木にのぼる。', r: 'きにのぼる。' },
    { k: '本', s: '本をよむ。', r: 'ほんをよむ。' },
    { k: '村', s: '村にすむ。', r: 'むらにすむ。' },
    { k: '林', s: '林であそぶ。', r: 'はやしであそぶ。' },
    { k: '校', s: '学校のもん。', r: 'がっこうのもん。' },
    { k: '森', s: '森のなか。', r: 'もりのなか。' },
    { k: '正', s: '正しいこたえ。', r: 'ただしいこたえ。' },
    { k: '気', s: '天気がいい。', r: 'てんきがいい。' },
    { k: '水', s: '水をのむ。', r: 'みずをのむ。' },
    { k: '火', s: '火があつい。', r: 'ひがあつい。' },
    { k: '犬', s: '犬がほえる。', r: 'いぬがほえる。' },
    { k: '王', s: '王さまのしろ。', r: 'おうさまのしろ。' },
    { k: '玉', s: '玉をなげる。', r: 'たまをなげる。' },
    { k: '生', s: '先生がくる。', r: 'せんせいがくる。' },
    { k: '田', s: '田んぼのかえる。', r: 'たんぼのかえる。' },
    { k: '男', s: '男の子。', r: 'おとこのこ。' },
    { k: '町', s: '町をあるく。', r: 'まちをあるく。' },
    { k: '白', s: '白い花。', r: 'しろいはな。' },
    { k: '百', s: '百円のあめ。', r: 'ひゃくえんのあめ。' },
    { k: '目', s: '目をあける。', r: 'めをあける。' },
    { k: '石', s: '石をひろう。', r: 'いしをひろう。' },
    { k: '空', s: '空が青い。', r: 'そらがあおい。' },
    { k: '立', s: 'いすに立つ。', r: 'いすにたつ。' },
    { k: '竹', s: '竹の林。', r: 'たけのはやし。' },
    { k: '糸', s: '糸をむすぶ。', r: 'いとをむすぶ。' },
    { k: '耳', s: '耳をすます。', r: 'みみをすます。' },
    { k: '虫', s: '虫がとぶ。', r: 'むしがとぶ。' },
    { k: '見', s: '空を見る。', r: 'そらをみる。' },
    { k: '貝', s: '貝をひろう。', r: 'かいをひろう。' },
    { k: '赤', s: '赤いりんご。', r: 'あかいりんご。' },
    { k: '足', s: '足がいたい。', r: 'あしがいたい。' },
    { k: '車', s: '車にのる。', r: 'くるまにのる。' },
    { k: '金', s: 'お金をもつ。', r: 'おかねをもつ。' },
    { k: '雨', s: '雨がふる。', r: 'あめがふる。' },
    { k: '青', s: '青い空。', r: 'あおいそら。' },
    { k: '音', s: '音がする。', r: 'おとがする。' }
];

const KANJI_GRADE_2 = [
    { k: '読', s: '本を読む。', r: 'ほんをよむ。' },
    { k: '雪', s: '雪がふる。', r: 'ゆきがふる。' },
    { k: '声', s: '大きな声でよむ。', r: 'おおきなこえでよむ。' },
    { k: '言', s: '先生が言う。', r: 'せんせいがいう。' },
    { k: '行', s: '学校へ行く。', r: 'がっこうへいく。' },
    { k: '南', s: '南をむく。', r: 'みなみをむく。' },
    { k: '図', s: '図をかく。', r: 'ずをかく。' },
    { k: '書', s: '名まえを書く。', r: 'なまえをかく。' },
    { k: '方', s: 'やり方をおしえる。', r: 'やりかたをおしえる。' },
    { k: '絵', s: '絵をかく。', r: 'えをかく。' }
];

const COURSES = [
    { id: 'g1', name: '1年生のかんじ', sub: '80字', list: KANJI_GRADE_1 },
    { id: 'g2', name: '2年生のかんじ', sub: '今ならってるところまで', list: KANJI_GRADE_2 }
];

const READING_OVERRIDES = {
    '八|八ひきの犬。': 'はち', '円|百円のあめ。': 'えん',
    '大|大きな犬。': 'おお', '天|天気がいい。': 'てん',
    '学|学校へいく。': 'がっ', '年|一年生です。': 'ねん',
    '校|学校のもん。': 'こう', '気|天気がいい。': 'き',
    '生|先生がくる。': 'せい', '男|男の子。': 'おとこ',
    '白|白い花。': 'しろ', '百|百円のあめ。': 'ひゃく',
    '竹|竹の林。': 'たけ', '見|空を見る。': 'み',
    '青|青い空。': 'あお', '声|大きな声でよむ。': 'こえ',
    '言|先生が言う。': 'い', '行|学校へ行く。': 'い',
    '書|名まえを書く。': 'か'
};

function getReading(item) {
    const override = READING_OVERRIDES[`${item.k}|${item.s}`];
    if (override) return override;
    const idx = item.s.indexOf(item.k);
    if (idx === -1) return item.r;
    const before = item.s.substring(0, idx);
    const after = item.s.substring(idx + item.k.length);
    if (item.r.startsWith(before) && item.r.endsWith(after)) {
        return item.r.substring(before.length, item.r.length - after.length);
    }
    return item.r;
}

function pickN(arr, n) {
    const copy = arr.slice();
    const result = [];
    for (let i = 0; i < n && copy.length > 0; i++) {
        const idx = Phaser.Math.Between(0, copy.length - 1);
        result.push(copy.splice(idx, 1)[0]);
    }
    return result;
}

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Phaser.Math.Between(0, i);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function project(z, worldX) {
    const f = Math.max(0.001, 1 - z / FAR_Z);
    return {
        x: GAME_W / 2 + worldX * f,
        y: HORIZON_Y + (GROUND_Y - HORIZON_Y) * f,
        scale: f
    };
}

function laneToWorldX(laneIdx, numLanes) {
    return -LANE_SPAN / 2 + (laneIdx + 0.5) * (LANE_SPAN / numLanes);
}

function worldXToLane(worldX, numLanes) {
    const fromLeft = worldX + LANE_SPAN / 2;
    const lane = Math.floor(fromLeft / (LANE_SPAN / numLanes));
    return Math.max(0, Math.min(numLanes - 1, lane));
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
        const tempo = mode === 'race' ? 130 : 200;
        this.tick();
        this.timer = setInterval(() => this.tick(), tempo);
    },
    stop() {
        if (this.timer) clearInterval(this.timer);
        this.timer = null; this.mode = null;
    },
    tick() {
        const patterns = {
            title: { melody: [392, 523, 659, 784, 659, 523, 392, 330], bass: [196, 196, 247, 196], bassEvery: 4 },
            race: {
                melody: [
                    523, 0, 659, 0, 784, 0, 659, 523,
                    587, 0, 698, 0, 880, 0, 698, 587,
                    523, 0, 659, 784, 988, 880, 784, 659,
                    784, 698, 659, 587, 523, 587, 659, 0
                ],
                bass: [131, 131, 175, 175, 196, 196, 175, 131], bassEvery: 2
            },
            victory: { melody: [523, 659, 784, 1047, 1319, 1047, 1319, 1568], bass: [262, 330, 392, 523], bassEvery: 2 }
        };
        const p = patterns[this.mode];
        if (!p) return;
        const note = p.melody[this.beat % p.melody.length];
        if (note > 0) this.tone(note, 0.16, 0.04, 'square');
        if (this.beat % p.bassEvery === 0) {
            const bn = p.bass[Math.floor(this.beat / p.bassEvery) % p.bass.length];
            if (bn > 0) this.tone(bn, 0.4, 0.07, 'sawtooth');
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

function createCarTexture(scene) {
    const w = 92, h = 210;
    const g = scene.make.graphics({ add: false });

    g.fillStyle(0x00E5FF, 0.14);
    g.fillEllipse(w/2, h - 4, 90, 36);
    g.fillStyle(0xFFD700, 0.08);
    g.fillEllipse(w/2, 24, 70, 50);
    g.fillStyle(0x00E5FF, 0.08);
    g.fillEllipse(w/2, h/2, 116, 200);

    g.fillStyle(0x000000, 0.6);
    g.fillEllipse(w/2 + 5, h/2 + 14, 58, 184);

    g.fillStyle(0x080810);
    g.fillRoundedRect(w/2 - 12, 4, 24, 50, 5);
    g.lineStyle(1, 0x333344, 0.7);
    g.strokeRoundedRect(w/2 - 12, 4, 24, 50, 5);
    g.fillStyle(0x00E5FF, 0.45);
    g.fillCircle(w/2, 28, 10);
    g.fillStyle(0x00BCD4);
    g.fillCircle(w/2, 28, 5);
    g.fillStyle(0xFFD700);
    g.fillCircle(w/2, 28, 2);

    g.fillStyle(0x37474F);
    g.fillRect(w/2 - 11, 50, 4, 32);
    g.fillRect(w/2 + 7, 50, 4, 32);
    g.fillStyle(0x90A4AE);
    g.fillRect(w/2 - 11, 50, 4, 5);
    g.fillRect(w/2 + 7, 50, 4, 5);

    g.fillStyle(0x141420);
    g.fillTriangle(w/2, 48, w/2 - 33, 80, w/2 + 33, 80);
    g.fillRoundedRect(w/2 - 33, 74, 66, 14, 5);

    g.lineStyle(0.6, 0x2a2a3a, 0.7);
    for (let i = 0; i < 7; i++) {
        const sx = w/2 - 28 + i * 9;
        g.lineBetween(sx, 60, sx + 6, 80);
    }

    g.lineStyle(1.5, 0x00E5FF, 0.95);
    g.strokeTriangle(w/2, 48, w/2 - 33, 80, w/2 + 33, 80);
    g.fillStyle(0xFFD700);
    g.fillTriangle(w/2 + 7, 50, w/2 + 20, 64, w/2 + 9, 64);

    g.fillStyle(0x080810);
    g.fillRect(w/2 - 28, 64, 56, 5);
    g.fillStyle(0xFFEB3B);
    g.fillRect(w/2 - 26, 65, 52, 2);
    g.fillStyle(0xFFFFFF);
    g.fillRect(w/2 - 24, 65.4, 48, 1.2);
    g.fillStyle(0xFFEB3B, 0.35);
    g.fillTriangle(w/2 - 32, 60, w/2 - 6, 50, w/2 - 6, 64);
    g.fillTriangle(w/2 + 32, 60, w/2 + 6, 50, w/2 + 6, 64);

    g.fillStyle(0x070710);
    g.fillRoundedRect(w/2 - 28, 88, 56, 60, 12);

    g.lineStyle(0.5, 0x252540, 0.6);
    for (let row = 0; row < 5; row++) {
        const y = 92 + row * 11;
        g.lineBetween(w/2 - 25, y, w/2 + 25, y);
    }

    g.lineStyle(1.5, 0x00E5FF, 0.95);
    g.strokeRoundedRect(w/2 - 28, 88, 56, 60, 12);
    g.fillStyle(0xFFD700);
    g.fillRect(w/2 - 27, 99, 54, 1);
    g.fillRect(w/2 - 27, 136, 54, 1);

    g.fillStyle(0x0a0a18);
    g.fillRoundedRect(w/2 - 17, 96, 34, 44, 10);
    g.fillStyle(0x14142a);
    g.fillTriangle(w/2 - 17, 100, w/2 - 17, 118, w/2 - 7, 110);
    g.fillTriangle(w/2 + 17, 100, w/2 + 17, 118, w/2 + 7, 110);

    g.fillStyle(0x00E5FF);
    g.fillRect(w/2 - 14, 116, 28, 2);
    g.fillStyle(0xFFD700);
    g.fillRect(w/2 - 14, 120, 28, 1);
    g.fillStyle(0xFF1744);
    g.fillRect(w/2 - 4, 124, 8, 6);

    g.fillStyle(0x0a0a18);
    g.fillRoundedRect(w/2 - 38, 90, 17, 14, 4);
    g.fillRoundedRect(w/2 + 21, 90, 17, 14, 4);

    g.fillStyle(0x1a1a1a);
    g.fillCircle(w/2 - 38, 100, 7);
    g.fillCircle(w/2 + 38, 100, 7);
    g.lineStyle(1, 0x4a4a4a);
    g.strokeCircle(w/2 - 38, 100, 7);
    g.strokeCircle(w/2 + 38, 100, 7);
    g.fillStyle(0xFFD700);
    g.fillRect(w/2 - 41, 99, 5, 1.5);
    g.fillRect(w/2 + 36, 99, 5, 1.5);
    g.fillStyle(0x00FFFF);
    g.fillCircle(w/2 - 38, 99.5, 1.5);
    g.fillCircle(w/2 + 38, 99.5, 1.5);

    g.fillStyle(0x070710);
    g.fillCircle(w/2, 102, 18);

    g.fillStyle(0x141422, 0.85);
    g.fillCircle(w/2 - 5, 96, 11);

    g.lineStyle(1.5, 0x2a2a3a);
    g.strokeCircle(w/2, 102, 18);

    g.fillStyle(0xFFD700);
    g.fillTriangle(w/2 - 4, 84, w/2 + 4, 84, w/2, 79);
    g.fillRect(w/2 - 1.5, 84, 3, 32);

    g.fillStyle(0x002240);
    g.fillEllipse(w/2, 94, 26, 10);
    g.fillStyle(0x00E5FF, 0.9);
    g.fillEllipse(w/2, 94, 24, 8);
    g.fillStyle(0x18FFFF, 0.7);
    g.fillEllipse(w/2 - 5, 93, 9, 4);
    g.fillStyle(0xFFFFFF, 0.95);
    g.fillRect(w/2 - 9, 92, 5, 1.4);
    g.fillRect(w/2 + 4, 92.5, 5, 1.2);
    g.lineStyle(1, 0x004466);
    g.strokeEllipse(w/2, 94, 24, 8);

    g.fillStyle(0xFF1744);
    g.fillRect(w/2 - 17, 105, 4, 6);
    g.fillRect(w/2 + 13, 105, 4, 6);
    g.fillStyle(0x000000);
    g.fillRect(w/2 - 16, 106, 2, 4);
    g.fillRect(w/2 + 14, 106, 2, 4);

    g.fillStyle(0x141420);
    g.fillRoundedRect(w/2 - 32, 144, 64, 5, 2);
    g.lineStyle(1, 0x00E5FF, 0.7);
    g.strokeRoundedRect(w/2 - 32, 144, 64, 5, 2);

    g.fillStyle(0x070710);
    g.fillRoundedRect(w/2 - 22, 150, 44, 28, 8);
    g.lineStyle(1.5, 0x00E5FF, 0.95);
    g.strokeRoundedRect(w/2 - 22, 150, 44, 28, 8);

    g.fillStyle(0xFFD700);
    g.fillRect(w/2 - 11, 158, 22, 11);
    g.lineStyle(0.8, 0x000000);
    g.strokeRect(w/2 - 11, 158, 22, 11);

    g.fillStyle(0x37474F);
    g.fillRect(w/2 - 26, 154, 5, 32);
    g.fillRect(w/2 + 21, 154, 5, 32);
    g.fillStyle(0x90A4AE);
    g.fillRect(w/2 - 26, 154, 5, 4);
    g.fillRect(w/2 + 21, 154, 5, 4);

    g.fillStyle(0x080810);
    g.fillRoundedRect(w/2 - 16, 174, 32, 26, 8);
    g.lineStyle(1, 0x444466, 0.6);
    g.strokeRoundedRect(w/2 - 16, 174, 32, 26, 8);
    g.fillStyle(0x00E5FF, 0.45);
    g.fillCircle(w/2, 187, 10);
    g.fillStyle(0x00BCD4);
    g.fillCircle(w/2, 187, 5);
    g.fillStyle(0xFFD700);
    g.fillCircle(w/2, 187, 2);

    g.fillStyle(0xFF1744);
    g.fillRect(w/2 - 14, 174, 28, 3);
    g.fillStyle(0xFF80AB, 0.9);
    g.fillRect(w/2 - 12, 174.5, 24, 1.5);

    g.fillStyle(0x37474F);
    g.fillRect(w/2 - 32, 164, 5, 22);
    g.fillRect(w/2 + 27, 164, 5, 22);
    g.fillStyle(0xFF6F00);
    g.fillCircle(w/2 - 29.5, 184, 2.5);
    g.fillCircle(w/2 + 29.5, 184, 2.5);
    g.fillStyle(0xFFEB3B);
    g.fillCircle(w/2 - 29.5, 184, 1.2);
    g.fillCircle(w/2 + 29.5, 184, 1.2);

    g.fillStyle(0x00E5FF, 0.75);
    g.fillCircle(w/2 - 11, 204, 6);
    g.fillCircle(w/2 + 11, 204, 6);
    g.fillStyle(0xFFFFFF);
    g.fillCircle(w/2 - 11, 204, 2.5);
    g.fillCircle(w/2 + 11, 204, 2.5);
    g.fillStyle(0xFFD700, 0.4);
    g.fillCircle(w/2, 207, 5);

    g.generateTexture('car', w, h);
    g.destroy();
}

class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }
    create() {
        createCarTexture(this);
        this.scene.start('TitleScene');
    }
}

class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }
    create() {
        this.drawBackground();

        const titleFrame = this.add.graphics();
        titleFrame.lineStyle(1, 0x18FFFF, 0.8);
        titleFrame.strokeRect(GAME_W/2 - 200, 100, 400, 180);
        titleFrame.lineStyle(2, 0xE91E63, 0.6);
        titleFrame.lineBetween(GAME_W/2 - 220, 100, GAME_W/2 - 200, 100);
        titleFrame.lineBetween(GAME_W/2 - 200, 100, GAME_W/2 - 200, 80);
        titleFrame.lineBetween(GAME_W/2 + 200, 100, GAME_W/2 + 220, 100);
        titleFrame.lineBetween(GAME_W/2 + 200, 100, GAME_W/2 + 200, 80);
        titleFrame.lineBetween(GAME_W/2 - 220, 280, GAME_W/2 - 200, 280);
        titleFrame.lineBetween(GAME_W/2 - 200, 280, GAME_W/2 - 200, 300);
        titleFrame.lineBetween(GAME_W/2 + 200, 280, GAME_W/2 + 220, 280);
        titleFrame.lineBetween(GAME_W/2 + 200, 280, GAME_W/2 + 200, 300);

        const title = this.add.text(GAME_W / 2, 168, 'KANJI', {
            fontSize: '108px', fontFamily: FONT, fontStyle: 'bold',
            color: '#18FFFF', stroke: '#0d0028', strokeThickness: 8,
            letterSpacing: 6
        }).setOrigin(0.5);
        const title2 = this.add.text(GAME_W / 2, 248, 'レースバトル', {
            fontSize: '40px', fontFamily: FONT, fontStyle: 'bold',
            color: '#E0F7FA', stroke: '#E91E63', strokeThickness: 4,
            letterSpacing: 6
        }).setOrigin(0.5);
        this.tweens.add({ targets: [title, title2], scale: 1.05, duration: 1100,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        this.add.text(GAME_W / 2, 332, '◤ FUTURE KANJI CIRCUIT ◢', {
            fontSize: '14px', fontFamily: FONT, fontStyle: 'bold',
            color: '#18FFFF', stroke: '#0a0020', strokeThickness: 3, letterSpacing: 4
        }).setOrigin(0.5);

        this.add.text(GAME_W / 2, 360, 'コースを えらんでね！', {
            fontSize: '26px', fontFamily: FONT, fontStyle: 'bold',
            color: '#00E5FF', stroke: '#0a0020', strokeThickness: 4
        }).setOrigin(0.5);

        this.menuItems = [];
        COURSES.forEach((c, i) => {
            const y = 440 + i * 130;
            const card = this.add.rectangle(GAME_W / 2, y, GAME_W - 60, 110, 0x1a0040)
                .setStrokeStyle(4, 0x00FFFF).setInteractive({ useHandCursor: true });

            this.add.text(GAME_W / 2 - 200, y - 22, '🏁', { fontSize: '46px' }).setOrigin(0.5);

            this.add.text(GAME_W / 2 - 30, y - 22, c.name, {
                fontSize: '32px', fontFamily: FONT, fontStyle: 'bold',
                color: '#FFEB3B', stroke: '#0a0020', strokeThickness: 4
            }).setOrigin(0, 0.5);

            this.add.text(GAME_W / 2 - 30, y + 14, c.sub + `（${c.list.length}字）`, {
                fontSize: '18px', fontFamily: FONT,
                color: '#FFFFFF', stroke: '#0a0020', strokeThickness: 3
            }).setOrigin(0, 0.5);

            if (c.id === 'g2') {
                this.add.text(GAME_W / 2 - 30, y + 38, '※ 2026/4/19 までに ならった字', {
                    fontSize: '14px', fontFamily: FONT,
                    color: '#FF80AB', stroke: '#0a0020', strokeThickness: 2
                }).setOrigin(0, 0.5);
            }

            this.tweens.add({ targets: card, alpha: 0.7, duration: 800,
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

            const action = () => {
                bgm.play('race');
                this.scene.start('RaceScene', { course: c });
            };
            card.on('pointerdown', action);
            this.menuItems.push({ card, y, action });
        });

        this.menuIndex = 0;
        this.selectionMarker = this.add.text(0, 0, '▶', {
            fontSize: '44px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFEB3B', stroke: '#0a0020', strokeThickness: 5
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

        this.add.text(GAME_W / 2, 720, 'ゆびで くるまを うごかすよ！', {
            fontSize: '20px', fontFamily: FONT,
            color: '#FFFFFF', stroke: '#0a0020', strokeThickness: 3
        }).setOrigin(0.5);
        this.add.text(GAME_W / 2, 750, 'ただしい かんじの コースに すすもう', {
            fontSize: '20px', fontFamily: FONT,
            color: '#FFFFFF', stroke: '#0a0020', strokeThickness: 3
        }).setOrigin(0.5);
        this.add.text(GAME_W / 2, 790, '10もん せいかいで コースクリア！', {
            fontSize: '22px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFEB3B', stroke: '#0a0020', strokeThickness: 4
        }).setOrigin(0.5);

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
        this.selectionMarker.x = item.card.x - item.card.width / 2 - 10;
        this.selectionMarker.y = item.y;
    }

    drawBackground() {
        const g = this.add.graphics().setDepth(-10);
        g.fillGradientStyle(0x0a0020, 0x0a0020, 0x4a0080, 0x000000, 1);
        g.fillRect(0, 0, GAME_W, GAME_H);
        for (let i = 0; i < 60; i++) {
            const x = Phaser.Math.Between(0, GAME_W);
            const y = Phaser.Math.Between(0, GAME_H);
            const s = Math.random() < 0.5 ? 1 : 2;
            g.fillStyle(0xFFFFFF, Math.random() * 0.7 + 0.3);
            g.fillCircle(x, y, s);
        }
        g.lineStyle(1, 0x00FFFF, 0.3);
        for (let y = HORIZON_Y; y < GAME_H; y += 30) {
            g.lineBetween(0, y, GAME_W, y);
        }
        for (let x = 0; x <= GAME_W; x += 60) {
            g.lineBetween(x, HORIZON_Y, GAME_W / 2, HORIZON_Y - 30);
        }
    }
}

class RaceScene extends Phaser.Scene {
    constructor() { super('RaceScene'); }

    create(data) {
        this.course = data.course;
        this.kanjiList = data.course.list;
        this.correctCount = 0;
        this.lives = 3;
        this.numChoices = 2;
        this.gameOver = false;
        this.questionActive = false;
        this.carWorldX = 0;
        this.carTargetX = 0;
        this.scrollOffset = 0;

        this.gates = [];
        this.barriers = [];
        this.stripes = [];
        for (let i = 0; i < 28; i++) this.stripes.push({ z: (i / 28) * FAR_Z });

        this.poles = [];
        for (let i = 0; i < 22; i++) {
            this.poles.push({ z: (i / 11) * FAR_Z, side: i % 2 === 0 ? -1 : 1 });
        }

        this.streaks = [];
        for (let i = 0; i < 70; i++) {
            this.streaks.push({
                angle: Math.random() * Math.PI * 2,
                dist: Math.random() * 600,
                speed: 6 + Math.random() * 10
            });
        }

        this.bgStars = [];
        for (let i = 0; i < 80; i++) {
            this.bgStars.push({
                x: Math.random() * GAME_W,
                y: Math.random() * HORIZON_Y,
                speed: 5 + Math.random() * 12,
                size: Math.random() < 0.7 ? 1 : 2,
                alpha: 0.4 + Math.random() * 0.5
            });
        }

        this.edgeStreaks = [];
        for (let i = 0; i < 28; i++) {
            const side = i % 2 === 0 ? 'L' : 'R';
            this.edgeStreaks.push({
                side,
                offset: Math.random() * 35,
                y: Math.random() * GAME_H,
                speed: 22 + Math.random() * 28,
                len: 30 + Math.random() * 70,
                alpha: 0.3 + Math.random() * 0.4
            });
        }

        this.thrusters = [];

        this.drawSky();
        this.bgStarGfx = this.add.graphics().setDepth(-11);
        this.streakGfx = this.add.graphics().setDepth(-7);
        this.roadGfx = this.add.graphics().setDepth(-5);
        this.poleGfx = this.add.graphics().setDepth(-3);
        this.thrusterGfx = this.add.graphics().setDepth(19);
        this.edgeStreakGfx = this.add.graphics().setDepth(48);

        this.cameras.main.shake(60000, 0.0015);

        this.fovTimer = this.time.addEvent({
            delay: 2200, loop: true, callback: () => {
                if (this.gameOver) return;
                this.tweens.add({
                    targets: this.cameras.main, zoom: 1.035,
                    duration: 200, yoyo: true, ease: 'Sine.easeOut'
                });
            }
        });

        this.startEngineSound();
        this.startWindSound();

        this.events.once('shutdown', () => {
            this.stopEngineSound();
            this.stopWindSound();
        });

        this.car = this.add.image(GAME_W / 2, GAME_H - 80, 'car').setOrigin(0.5, 0.95).setDepth(20);
        this.tweens.add({ targets: this.car, scale: { from: 0.95, to: 1.02 },
            duration: 200, yoyo: true, repeat: -1 });

        this.questionBg = this.add.rectangle(GAME_W / 2, 110, GAME_W - 30, 165, 0x000000, 0.7)
            .setStrokeStyle(2, 0x18FFFF).setDepth(30);
        this.questionFrame = this.add.graphics().setDepth(30);
        this.questionFrame.lineStyle(1, 0xE91E63, 0.6);
        this.questionFrame.strokeRect(20, 36, GAME_W - 40, 155);
        this.questionFrame.lineStyle(2, 0x18FFFF, 0.4);
        this.questionFrame.lineBetween(20, 38, 60, 38);
        this.questionFrame.lineBetween(GAME_W - 60, 38, GAME_W - 20, 38);
        this.questionFrame.lineBetween(20, 188, 60, 188);
        this.questionFrame.lineBetween(GAME_W - 60, 188, GAME_W - 20, 188);
        this.questionParts = [];

        this.scoreText = this.add.text(15, 15, '✓ 0/10', {
            fontSize: '26px', fontFamily: FONT, fontStyle: 'bold',
            color: '#00FF88', stroke: '#000', strokeThickness: 4
        }).setDepth(31);
        this.livesText = this.add.text(GAME_W - 15, 15, '❤️❤️❤️', { fontSize: '24px' })
            .setOrigin(1, 0).setDepth(31);
        this.courseText = this.add.text(GAME_W / 2, 15, this.course.name, {
            fontSize: '18px', fontFamily: FONT, fontStyle: 'bold',
            color: '#00E5FF', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5, 0).setDepth(31);

        this.input.on('pointerdown', (p) => this.steerTo(p.x));
        this.input.on('pointermove', (p) => { if (p.isDown) this.steerTo(p.x); });
        this.cursors = this.input.keyboard.createCursorKeys();

        this.spawnTimer = this.time.delayedCall(1500, () => this.spawnQuestion());
        this.barrierTimer = this.time.addEvent({ delay: 4500, loop: true, callback: () => this.maybeSpawnBarrier() });

        bgm.play('race');
    }

    startEngineSound() {
        if (this.engineOsc) return;
        const ctx = this.sound.context;
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        try {
            this.engineOsc = ctx.createOscillator();
            this.engineGain = ctx.createGain();
            this.engineLfo = ctx.createOscillator();
            this.engineLfoGain = ctx.createGain();

            this.engineOsc.type = 'sawtooth';
            this.engineOsc.frequency.value = 70;
            this.engineGain.gain.value = 0.04;

            this.engineLfo.frequency.value = 9;
            this.engineLfoGain.gain.value = 6;
            this.engineLfo.connect(this.engineLfoGain);
            this.engineLfoGain.connect(this.engineOsc.frequency);

            this.engineFilter = ctx.createBiquadFilter();
            this.engineFilter.type = 'lowpass';
            this.engineFilter.frequency.value = 350;

            this.engineOsc.connect(this.engineFilter);
            this.engineFilter.connect(this.engineGain);
            this.engineGain.connect(ctx.destination);

            this.engineOsc.start();
            this.engineLfo.start();
        } catch (e) {}
    }

    stopEngineSound() {
        try { if (this.engineOsc) this.engineOsc.stop(); } catch (e) {}
        try { if (this.engineLfo) this.engineLfo.stop(); } catch (e) {}
        this.engineOsc = null; this.engineLfo = null;
    }

    startWindSound() {
        if (this.windNode) return;
        const ctx = this.sound.context;
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        try {
            const bufferSize = ctx.sampleRate * 2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            this.windNode = ctx.createBufferSource();
            this.windNode.buffer = buffer;
            this.windNode.loop = true;

            this.windFilter = ctx.createBiquadFilter();
            this.windFilter.type = 'highpass';
            this.windFilter.frequency.value = 1800;

            this.windGain = ctx.createGain();
            this.windGain.gain.value = 0.025;

            this.windNode.connect(this.windFilter);
            this.windFilter.connect(this.windGain);
            this.windGain.connect(ctx.destination);
            this.windNode.start();
        } catch (e) {}
    }

    stopWindSound() {
        try { if (this.windNode) this.windNode.stop(); } catch (e) {}
        this.windNode = null;
    }

    drawSky() {
        const g = this.add.graphics().setDepth(-12);
        g.fillGradientStyle(0x0a0020, 0x0a0020, 0x4a0080, 0x6a0080, 1);
        g.fillRect(0, 0, GAME_W, HORIZON_Y);
        g.fillStyle(0x000000);
        g.fillRect(0, HORIZON_Y, GAME_W, GAME_H - HORIZON_Y);

        for (let i = 0; i < 80; i++) {
            const x = Phaser.Math.Between(0, GAME_W);
            const y = Phaser.Math.Between(0, HORIZON_Y);
            g.fillStyle(0xFFFFFF, Math.random() * 0.7 + 0.3);
            g.fillCircle(x, y, Math.random() < 0.7 ? 1 : 2);
        }
        g.fillStyle(0x4a0080);
        for (let i = 0; i < 6; i++) {
            const x = i * 90;
            g.fillTriangle(x, HORIZON_Y, x + 50, HORIZON_Y - 30, x + 100, HORIZON_Y);
        }
        g.lineStyle(2, 0xFF00FF, 0.6);
        g.lineBetween(0, HORIZON_Y, GAME_W, HORIZON_Y);
    }

    drawRoad() {
        this.roadGfx.clear();

        this.roadGfx.fillStyle(0x0a0028);
        this.roadGfx.beginPath();
        this.roadGfx.moveTo(GAME_W/2 - ROAD_HALF_FAR - 30, HORIZON_Y);
        this.roadGfx.lineTo(GAME_W/2 + ROAD_HALF_FAR + 30, HORIZON_Y);
        this.roadGfx.lineTo(GAME_W/2 + ROAD_HALF_NEAR + 60, GROUND_Y);
        this.roadGfx.lineTo(GAME_W/2 - ROAD_HALF_NEAR - 60, GROUND_Y);
        this.roadGfx.closePath();
        this.roadGfx.fillPath();

        this.roadGfx.fillStyle(0x1a0040);
        this.roadGfx.beginPath();
        this.roadGfx.moveTo(GAME_W/2 - ROAD_HALF_FAR, HORIZON_Y);
        this.roadGfx.lineTo(GAME_W/2 + ROAD_HALF_FAR, HORIZON_Y);
        this.roadGfx.lineTo(GAME_W/2 + ROAD_HALF_NEAR, GROUND_Y);
        this.roadGfx.lineTo(GAME_W/2 - ROAD_HALF_NEAR, GROUND_Y);
        this.roadGfx.closePath();
        this.roadGfx.fillPath();

        const numLanes = this.numChoices;
        const carLane = worldXToLane(this.carWorldX, numLanes);
        const laneWorldX = laneToWorldX(carLane, numLanes);
        const halfLane = (LANE_SPAN / numLanes) / 2;
        this.roadGfx.fillStyle(0x00FFFF, 0.12);
        this.roadGfx.beginPath();
        this.roadGfx.moveTo(GAME_W/2 + (laneWorldX - halfLane) * (ROAD_HALF_FAR / ROAD_HALF_NEAR), HORIZON_Y);
        this.roadGfx.lineTo(GAME_W/2 + (laneWorldX + halfLane) * (ROAD_HALF_FAR / ROAD_HALF_NEAR), HORIZON_Y);
        this.roadGfx.lineTo(GAME_W/2 + (laneWorldX + halfLane), GROUND_Y);
        this.roadGfx.lineTo(GAME_W/2 + (laneWorldX - halfLane), GROUND_Y);
        this.roadGfx.closePath();
        this.roadGfx.fillPath();

        for (const stripe of this.stripes) {
            const f = 1 - stripe.z / FAR_Z;
            const y = HORIZON_Y + (GROUND_Y - HORIZON_Y) * f;
            const halfW = ROAD_HALF_FAR + (ROAD_HALF_NEAR - ROAD_HALF_FAR) * f;
            this.roadGfx.fillStyle(0xFF00FF, (0.5 * f + 0.2));
            this.roadGfx.fillRect(GAME_W/2 - halfW, y - 2, halfW * 2, 3 * f + 1);
        }

        this.roadGfx.lineStyle(10, 0xFF00FF, 0.4);
        this.roadGfx.lineBetween(GAME_W/2 - ROAD_HALF_FAR - 6, HORIZON_Y, GAME_W/2 - ROAD_HALF_NEAR - 14, GROUND_Y);
        this.roadGfx.lineBetween(GAME_W/2 + ROAD_HALF_FAR + 6, HORIZON_Y, GAME_W/2 + ROAD_HALF_NEAR + 14, GROUND_Y);
        this.roadGfx.lineStyle(5, 0x00FFFF, 1);
        this.roadGfx.lineBetween(GAME_W/2 - ROAD_HALF_FAR, HORIZON_Y, GAME_W/2 - ROAD_HALF_NEAR, GROUND_Y);
        this.roadGfx.lineBetween(GAME_W/2 + ROAD_HALF_FAR, HORIZON_Y, GAME_W/2 + ROAD_HALF_NEAR, GROUND_Y);
        this.roadGfx.lineStyle(2, 0xFFFFFF, 1);
        this.roadGfx.lineBetween(GAME_W/2 - ROAD_HALF_FAR, HORIZON_Y, GAME_W/2 - ROAD_HALF_NEAR, GROUND_Y);
        this.roadGfx.lineBetween(GAME_W/2 + ROAD_HALF_FAR, HORIZON_Y, GAME_W/2 + ROAD_HALF_NEAR, GROUND_Y);

        for (let i = 1; i < numLanes; i++) {
            const offset = -LANE_SPAN / 2 + i * (LANE_SPAN / numLanes);
            const farX = GAME_W/2 + offset * (ROAD_HALF_FAR / ROAD_HALF_NEAR);
            const nearX = GAME_W/2 + offset;
            for (const stripe of this.stripes) {
                const f = 1 - stripe.z / FAR_Z;
                const y = HORIZON_Y + (GROUND_Y - HORIZON_Y) * f;
                const cx = farX + (nearX - farX) * f;
                this.roadGfx.fillStyle(0xFFEB3B, 0.7);
                this.roadGfx.fillRect(cx - 2 * f - 1, y - 8 * f - 2, 4 * f + 2, 16 * f + 4);
            }
        }
    }

    update(time, dt) {
        if (this.gameOver) return;
        const delta = dt / 1000;

        for (const stripe of this.stripes) {
            stripe.z -= BG_SCROLL_SPEED * delta * 60;
            if (stripe.z < 0) stripe.z += FAR_Z;
        }

        this.bgStarGfx.clear();
        for (const s of this.bgStars) {
            s.y += s.speed * delta * 60;
            if (s.y > HORIZON_Y) {
                s.y = -5;
                s.x = Math.random() * GAME_W;
            }
            this.bgStarGfx.fillStyle(0xFFFFFF, s.alpha);
            this.bgStarGfx.fillCircle(s.x, s.y, s.size);
        }

        this.poleGfx.clear();
        for (const p of this.poles) {
            p.z -= POLE_SCROLL_SPEED * delta * 60;
            if (p.z < 0) {
                p.z += FAR_Z;
                p.side = Math.random() > 0.5 ? 1 : -1;
            }
            const f = 1 - p.z / FAR_Z;
            const halfRoad = ROAD_HALF_FAR + (ROAD_HALF_NEAR - ROAD_HALF_FAR) * f;
            const px = GAME_W / 2 + p.side * (halfRoad + 25 * f + 8);
            const py = HORIZON_Y + (GROUND_Y - HORIZON_Y) * f;
            const poleH = 110 * f + 10;
            this.poleGfx.fillStyle(0x00E5FF, 0.25 * f + 0.05);
            this.poleGfx.fillRect(px - 8 * f - 1, py - poleH, 16 * f + 2, poleH);
            this.poleGfx.fillStyle(0x18FFFF, Math.min(1, f * 1.4));
            this.poleGfx.fillRect(px - 2 * f - 0.5, py - poleH, 4 * f + 1, poleH);
            this.poleGfx.fillStyle(0xFFFFFF);
            this.poleGfx.fillRect(px - 1 * f - 0.5, py - poleH, 2 * f + 1, poleH * 0.35);
            this.poleGfx.fillStyle(0xE91E63, f);
            this.poleGfx.fillCircle(px, py - poleH, 3 * f + 1);
        }

        this.edgeStreakGfx.clear();
        for (const e of this.edgeStreaks) {
            e.y += e.speed * delta * 60;
            if (e.y > GAME_H + 80) {
                e.y = -80;
                e.offset = Math.random() * 35;
            }
            const x = e.side === 'L' ? e.offset : GAME_W - e.offset;
            this.edgeStreakGfx.lineStyle(2, 0xFFFFFF, e.alpha);
            this.edgeStreakGfx.lineBetween(x, e.y, x, e.y - e.len);
        }

        this.thrusterGfx.clear();
        if (!this.gameOver && this.car && this.car.visible) {
            if (Math.random() < 0.6) {
                this.thrusters.push({
                    x: this.car.x + (Math.random() < 0.5 ? -11 : 11),
                    y: this.car.y - 10,
                    vy: 6 + Math.random() * 5,
                    life: 18,
                    maxLife: 18,
                    size: 3 + Math.random() * 3,
                    color: Math.random() < 0.7 ? 0x18FFFF : 0xFFD700
                });
            }
        }
        for (const t of this.thrusters.slice()) {
            t.y += t.vy * delta * 60;
            t.life--;
            if (t.life <= 0) {
                const idx = this.thrusters.indexOf(t);
                this.thrusters.splice(idx, 1);
                continue;
            }
            const a = t.life / t.maxLife;
            this.thrusterGfx.fillStyle(t.color, a * 0.65);
            this.thrusterGfx.fillCircle(t.x, t.y, t.size * a + 0.5);
        }

        this.streakGfx.clear();
        const cx = GAME_W / 2, cy = HORIZON_Y;
        for (const s of this.streaks) {
            s.dist += s.speed * delta * 60;
            if (s.dist > 760) {
                s.dist = Math.random() * 20;
                s.angle = Math.random() * Math.PI * 2;
                s.speed = 3 + Math.random() * 6;
            }
            const cosA = Math.cos(s.angle), sinA = Math.sin(s.angle);
            const x1 = cx + cosA * s.dist;
            const y1 = cy + sinA * s.dist * 0.7;
            const trail = Math.max(0, s.dist - 55);
            const x2 = cx + cosA * trail;
            const y2 = cy + sinA * trail * 0.7;
            if (x1 < -40 || x1 > GAME_W + 40 || y1 < -40 || y1 > GAME_H + 40) continue;
            const alpha = Math.min(0.55, s.dist / 280);
            const inSky = y1 < HORIZON_Y + 10;
            const offRoad = (Math.abs(x1 - GAME_W/2) > 200 + (s.dist * 0.4));
            const visible = inSky || offRoad;
            if (!visible) continue;
            this.streakGfx.lineStyle(1.5, 0x18FFFF, alpha);
            this.streakGfx.lineBetween(x1, y1, x2, y2);
        }

        if (this.cursors.left.isDown) this.carTargetX -= 9;
        if (this.cursors.right.isDown) this.carTargetX += 9;

        const pad = this.input.gamepad && this.input.gamepad.pad1;
        if (pad) {
            const dz = 0.22;
            const ax = pad.axes.length > 0 ? pad.axes[0].getValue() : 0;
            if (Math.abs(ax) > dz) this.carTargetX += ax * 11;
            else if (pad.left && pad.left.isDown) this.carTargetX -= 9;
            else if (pad.right && pad.right.isDown) this.carTargetX += 9;
        }

        this.carTargetX = Phaser.Math.Clamp(this.carTargetX, -LANE_SPAN/2 + 30, LANE_SPAN/2 - 30);
        this.carWorldX += (this.carTargetX - this.carWorldX) * 0.18;
        this.car.x = GAME_W / 2 + this.carWorldX;

        for (const gate of this.gates.slice()) {
            if (!gate.frozen) gate.z -= SCROLL_SPEED * delta * 60;
            this.renderGate(gate);
            if (gate.z <= 1.5 && !gate.judged) {
                this.judgeGate(gate);
            }
            if (!gate.frozen && gate.z < -4) this.cleanupGate(gate);
        }

        for (const bar of this.barriers.slice()) {
            bar.z -= SCROLL_SPEED * delta * 60;
            this.renderBarrier(bar);
            if (bar.z <= 0 && !bar.hit) {
                const carLane = worldXToLane(this.carWorldX, bar.numLanes);
                if (carLane === bar.lane) this.hitBarrier(bar);
                bar.hit = true;
            }
            if (bar.z < -2) this.cleanupBarrier(bar);
        }

        this.drawRoad();
    }

    steerTo(screenX) {
        if (this.gameOver) return;
        const cam = this.cameras.main;
        const x = (screenX - cam.x) / cam.zoom;
        this.carTargetX = Phaser.Math.Clamp(x - GAME_W / 2, -LANE_SPAN/2 + 30, LANE_SPAN/2 - 30);
    }

    spawnQuestion() {
        if (this.gameOver) return;
        if (this.correctCount >= 10) return;

        this.gates.slice().forEach(g => this.cleanupGate(g));
        this.barriers.slice().forEach(b => this.cleanupBarrier(b));

        this.numChoices = Math.min(6, 2 + Math.floor(this.correctCount / 2));

        const correct = pickN(this.kanjiList, 1)[0];
        const others = pickN(this.kanjiList.filter(k => k.k !== correct.k), this.numChoices - 1);
        const choices = shuffle([correct, ...others]);
        const correctIdx = choices.findIndex(k => k.k === correct.k);

        this.questionParts.forEach(p => p.destroy());
        this.questionParts = [];

        const reading = getReading(correct);
        const idx = correct.s.indexOf(correct.k);
        const before = correct.s.substring(0, idx);
        const after = correct.s.substring(idx + correct.k.length);
        const blank = '〔？〕';

        const sentY = 138;
        const sentStyle = {
            fontSize: '32px', fontFamily: FONT, fontStyle: 'bold',
            color: '#E0F7FA', stroke: '#000814', strokeThickness: 5
        };
        const blankStyle = { ...sentStyle, color: '#FF80AB' };

        const tBefore = this.add.text(0, 0, before, sentStyle).setOrigin(0, 0.5).setDepth(31);
        const tBlank = this.add.text(0, 0, blank, blankStyle).setOrigin(0, 0.5).setDepth(31);
        const tAfter = this.add.text(0, 0, after, sentStyle).setOrigin(0, 0.5).setDepth(31);

        const totalW = tBefore.width + tBlank.width + tAfter.width;
        const startX = (GAME_W - totalW) / 2;
        tBefore.setPosition(startX, sentY);
        tBlank.setPosition(startX + tBefore.width, sentY);
        tAfter.setPosition(startX + tBefore.width + tBlank.width, sentY);

        const blankCenter = tBlank.x + tBlank.width / 2;

        const furiBg = this.add.graphics().setDepth(31);
        furiBg.fillStyle(0xFFEB3B, 0.15);
        furiBg.fillRoundedRect(blankCenter - 60, 60, 120, 38, 6);
        furiBg.lineStyle(2, 0xFFEB3B, 0.7);
        furiBg.strokeRoundedRect(blankCenter - 60, 60, 120, 38, 6);

        const furigana = this.add.text(blankCenter, 79, reading, {
            fontSize: '32px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFEB3B', stroke: '#000814', strokeThickness: 6
        }).setOrigin(0.5).setDepth(32);
        this.tweens.add({ targets: furigana, scale: 1.08, duration: 700,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        const arrow = this.add.text(blankCenter, 110, '▼', {
            fontSize: '18px', color: '#FFEB3B', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(32);
        this.tweens.add({ targets: arrow, alpha: 0.4, duration: 500,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        this.questionParts.push(tBefore, tBlank, tAfter, furiBg, furigana, arrow);

        const gate = {
            z: FAR_Z,
            choices: choices.map(c => c.k),
            correctIdx,
            numLanes: this.numChoices,
            openProgress: 0,
            crashed: false,
            judged: false,
            judgedResult: null,
            shake: 0,
            cracksTimer: 0,
            gfx: this.add.graphics().setDepth(8),
            texts: []
        };
        for (let i = 0; i < gate.numLanes; i++) {
            const t = this.add.text(0, 0, gate.choices[i], {
                fontSize: '72px', fontFamily: FONT, fontStyle: 'bold',
                color: '#FFFFFF', stroke: '#001f4d', strokeThickness: 8
            }).setOrigin(0.5).setDepth(10);
            gate.texts.push(t);
        }
        this.gates.push(gate);

        this.questionActive = true;
    }

    renderGate(gate) {
        const g = gate.gfx;
        g.clear();
        if (gate.z <= -3) {
            g.setVisible(false);
            gate.texts.forEach(t => t.setVisible(false));
            return;
        }
        const f = Math.max(0.001, 1 - gate.z / FAR_Z);
        const baseY = HORIZON_Y + (GROUND_Y - HORIZON_Y) * f;
        const halfRoadW = ROAD_HALF_FAR + (ROAD_HALF_NEAR - ROAD_HALF_FAR) * f;
        const archHeight = 280 * f;
        const topY = baseY - archHeight;
        const shakeX = gate.shake > 0 ? (Math.random() - 0.5) * gate.shake : 0;

        g.fillStyle(0x1a0040);
        g.fillRect(GAME_W/2 - halfRoadW - 35 * f, topY, 35 * f + 8, archHeight);
        g.fillRect(GAME_W/2 + halfRoadW - 5, topY, 35 * f + 8, archHeight);
        g.fillRect(GAME_W/2 - halfRoadW - 35 * f, topY - 30 * f - 4, halfRoadW * 2 + 70 * f + 16, 30 * f + 8);

        g.lineStyle(Math.max(2, 5 * f), 0xFF00FF, 0.6);
        g.strokeRect(GAME_W/2 - halfRoadW - 35 * f, topY - 30 * f - 4, halfRoadW * 2 + 70 * f + 16, archHeight + 30 * f + 8);
        g.lineStyle(Math.max(2, 3 * f), 0x00FFFF, 1);
        g.strokeRect(GAME_W/2 - halfRoadW - 30 * f, topY - 26 * f, halfRoadW * 2 + 60 * f + 4, archHeight + 26 * f);

        for (let i = 0; i < gate.numLanes; i++) {
            const worldX = laneToWorldX(i, gate.numLanes);
            const cx = GAME_W/2 + worldX * f + shakeX * (i === gate.judgedResult ? 1 : 0.3);
            const doorW = (LANE_SPAN / gate.numLanes) * f * 0.92;
            const doorH = archHeight * 0.95;
            const halfDoor = doorW / 2;

            const isCorrect = i === gate.correctIdx;
            let leftOff = 0, rightOff = 0;
            if (isCorrect && gate.openProgress > 0) {
                leftOff = -halfDoor * gate.openProgress;
                rightOff = halfDoor * gate.openProgress;
            }

            g.fillStyle(0x000000, 0.5);
            g.fillRect(cx - halfDoor + leftOff + 3, topY + 4, halfDoor, doorH);
            g.fillRect(cx + rightOff + 3, topY + 4, halfDoor, doorH);

            const baseColor = isCorrect && gate.openProgress > 0.5 ? 0x004D33 : 0x14141f;
            g.fillStyle(baseColor);
            g.fillRect(cx - halfDoor + leftOff, topY, halfDoor, doorH);
            g.fillRect(cx + rightOff, topY, halfDoor, doorH);

            const panelLines = 3;
            g.lineStyle(Math.max(0.5, 1 * f), 0x2a2a40, 0.8);
            for (let p = 1; p < panelLines; p++) {
                const py = topY + (doorH * p) / panelLines;
                g.lineBetween(cx - halfDoor + leftOff, py, cx + leftOff, py);
                g.lineBetween(cx + rightOff, py, cx + rightOff + halfDoor, py);
            }

            g.fillStyle(0x18FFFF);
            g.fillRect(cx - halfDoor + leftOff, topY, halfDoor, 4 * f + 1);
            g.fillRect(cx + rightOff, topY, halfDoor, 4 * f + 1);
            g.fillStyle(0xE91E63);
            g.fillRect(cx - halfDoor + leftOff, topY + doorH - 4 * f - 1, halfDoor, 4 * f + 1);
            g.fillRect(cx + rightOff, topY + doorH - 4 * f - 1, halfDoor, 4 * f + 1);

            g.lineStyle(Math.max(1, 2 * f), 0x18FFFF, 0.9);
            g.strokeRect(cx - halfDoor + leftOff, topY, halfDoor, doorH);
            g.strokeRect(cx + rightOff, topY, halfDoor, doorH);

            g.fillStyle(0xFFD700);
            g.fillCircle(cx - halfDoor + leftOff + halfDoor - 8 * f, topY + doorH/2, 3 * f + 1);
            g.fillCircle(cx + rightOff + 8 * f, topY + doorH/2, 3 * f + 1);

            if (gate.judgedResult === i && !isCorrect && gate.cracksTimer > 0) {
                g.lineStyle(Math.max(1, 3 * f), 0xFFFFFF);
                g.beginPath();
                g.moveTo(cx, topY + doorH * 0.3);
                g.lineTo(cx - halfDoor * 0.5, topY + doorH * 0.55);
                g.lineTo(cx - halfDoor * 0.3, topY + doorH * 0.7);
                g.lineTo(cx + halfDoor * 0.4, topY + doorH * 0.85);
                g.strokePath();
                g.beginPath();
                g.moveTo(cx, topY + doorH * 0.3);
                g.lineTo(cx + halfDoor * 0.6, topY + doorH * 0.5);
                g.lineTo(cx + halfDoor * 0.4, topY + doorH * 0.75);
                g.strokePath();
            }

            const txt = gate.texts[i];
            const showText = !(isCorrect && gate.openProgress > 0.4);
            if (showText) {
                txt.x = cx;
                txt.y = topY + doorH / 2;
                txt.setScale(f * 1.15);
                txt.setVisible(true);
                txt.setColor(isCorrect && gate.openProgress > 0.1 ? '#FFEB3B' : '#FFFFFF');
            } else {
                txt.setVisible(false);
            }
        }
    }

    judgeGate(gate) {
        if (gate.judged) return;
        gate.judged = true;
        const carLane = worldXToLane(this.carWorldX, gate.numLanes);
        gate.judgedResult = carLane;

        if (carLane === gate.correctIdx) {
            this.tweens.add({
                targets: gate, openProgress: 1,
                duration: 280, ease: 'Cubic.easeOut'
            });
            playTone(this, 1200, 0.15, 0.08, 'sine', 1800);
            this.time.delayedCall(280, () => this.correct());
        } else {
            this.crashIntoDoor(gate, carLane);
        }
    }

    cleanupGate(gate) {
        if (gate.gfx) gate.gfx.destroy();
        gate.texts.forEach(t => t.destroy());
        const idx = this.gates.indexOf(gate);
        if (idx >= 0) this.gates.splice(idx, 1);
    }

    crashIntoDoor(gate, lane) {
        gate.frozen = true;
        gate.z = 0.6;
        gate.shake = 14;
        gate.cracksTimer = 1;
        this.cameras.main.shake(900, 0.05);
        this.cameras.main.flash(450, 255, 50, 50);
        playTone(this, 80, 0.8, 0.18, 'sawtooth');
        this.time.delayedCall(120, () => playTone(this, 60, 0.6, 0.15, 'sawtooth'));

        const carX = this.car.x, carY = this.car.y - 30;
        for (let i = 0; i < 24; i++) {
            const e = this.add.text(carX, carY, Phaser.Math.RND.pick(['💥', '🔥', '💢', '⚡', '✨']), {
                fontSize: `${36 + Math.random() * 30}px`
            }).setOrigin(0.5).setDepth(50);
            const angle = Math.random() * Math.PI * 2;
            const dist = 100 + Math.random() * 180;
            this.tweens.add({
                targets: e,
                x: carX + Math.cos(angle) * dist,
                y: carY + Math.sin(angle) * dist,
                scale: { from: 1.2, to: 0.2 }, alpha: 0,
                duration: 1200 + Math.random() * 600,
                onComplete: () => e.destroy()
            });
        }

        const colors = [0x00BCD4, 0xE91E63, 0x37474F, 0xFFD700, 0xFFEB3B];
        for (let i = 0; i < 22; i++) {
            const piece = this.add.rectangle(
                carX + Phaser.Math.Between(-15, 15),
                carY + Phaser.Math.Between(-15, 15),
                Phaser.Math.Between(6, 18),
                Phaser.Math.Between(6, 18),
                Phaser.Math.RND.pick(colors)
            ).setStrokeStyle(2, 0xFFFFFF).setDepth(49);
            const angle = Math.random() * Math.PI * 2;
            const speed = 220 + Math.random() * 280;
            this.tweens.add({
                targets: piece,
                x: carX + Math.cos(angle) * speed,
                y: carY + Math.sin(angle) * speed + 280,
                angle: Phaser.Math.Between(-720, 720),
                alpha: 0, duration: 1800, ease: 'Cubic.in',
                onComplete: () => piece.destroy()
            });
        }

        this.car.setVisible(false);
        this.tweens.add({ targets: gate, shake: 0, duration: 400 });

        const correctKanji = gate.choices[gate.correctIdx];
        this.wrong(correctKanji);
    }

    correct() {
        this.correctCount++;
        this.scoreText.setText(`✓ ${this.correctCount}/10`);

        const fx = this.add.text(this.car.x, this.car.y - 100, '✓ せいかい！', {
            fontSize: '40px', fontFamily: FONT, fontStyle: 'bold',
            color: '#00FF88', stroke: '#000', strokeThickness: 6
        }).setOrigin(0.5).setDepth(40);
        this.tweens.add({ targets: fx, y: fx.y - 80, alpha: 0, scale: 1.4,
            duration: 1000, onComplete: () => fx.destroy() });
        this.cameras.main.flash(200, 0, 255, 100);
        playTone(this, 800, 0.1, 0.1, 'square');
        this.time.delayedCall(120, () => playTone(this, 1200, 0.15, 0.1, 'square'));

        if (this.correctCount >= 10) {
            this.victory();
            return;
        }
        this.time.delayedCall(QUESTION_GAP_MS, () => this.spawnQuestion());
    }

    wrong(correctKanji) {
        this.lives--;
        this.updateLives();

        const ans = this.add.text(GAME_W/2, GAME_H/2, `せいかいは「${correctKanji}」`, {
            fontSize: '46px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFEB3B', backgroundColor: '#000000',
            padding: { x: 30, y: 15 },
            stroke: '#FF00FF', strokeThickness: 6
        }).setOrigin(0.5).setDepth(60);
        this.tweens.add({ targets: ans, scale: { from: 0.5, to: 1.05 }, duration: 350, ease: 'Back.easeOut' });

        if (this.lives <= 0) {
            this.time.delayedCall(2400, () => {
                ans.destroy();
                this.gameOver = true;
                bgm.stop();
                this.scene.start('ResultScene', {
                    course: this.course, victory: false, correctCount: this.correctCount
                });
            });
        } else {
            this.time.delayedCall(2400, () => {
                ans.destroy();
                this.car.setVisible(true);
                this.car.alpha = 0;
                this.tweens.add({ targets: this.car, alpha: 1, duration: 400, ease: 'Cubic.easeIn' });
                this.tweens.add({ targets: this.car, alpha: 0.4, duration: 120,
                    yoyo: true, repeat: 4, delay: 400,
                    onComplete: () => this.car.alpha = 1 });
                this.spawnQuestion();
            });
        }
    }

    updateLives() {
        this.livesText.setText('❤️'.repeat(Math.max(0, this.lives)));
    }

    maybeSpawnBarrier() {
        if (this.gameOver || this.gates.length === 0) return;
        if (this.gates[0].z < FAR_Z * 0.6) return;
        if (Math.random() > 0.3) return;
        const numLanes = this.numChoices;
        const lane = Phaser.Math.Between(0, numLanes - 1);
        const bar = {
            z: FAR_Z * 0.7,
            lane,
            numLanes,
            hit: false,
            visual: this.add.graphics().setDepth(7)
        };
        this.barriers.push(bar);
    }

    renderBarrier(bar) {
        const g = bar.visual;
        g.clear();
        if (bar.z <= 0) { g.setVisible(false); return; }
        const f = Math.max(0.001, 1 - bar.z / FAR_Z);
        const worldX = laneToWorldX(bar.lane, bar.numLanes);
        const sx = GAME_W / 2 + worldX * f;
        const y = HORIZON_Y + (GROUND_Y - HORIZON_Y) * f;
        const w = (LANE_SPAN / bar.numLanes) * f * 0.6;
        const h = 25 * f + 5;
        g.fillStyle(0xFF1744, 0.85);
        g.fillRect(sx - w/2, y - h/2, w, h);
        g.lineStyle(Math.max(1, 3 * f), 0xFFEB3B);
        g.strokeRect(sx - w/2, y - h/2, w, h);
    }

    hitBarrier(bar) {
        this.cameras.main.shake(200, 0.015);
        playTone(this, 150, 0.2, 0.1, 'sawtooth');
        const fx = this.add.text(this.car.x, this.car.y - 60, '💢', { fontSize: '50px' })
            .setOrigin(0.5).setDepth(50);
        this.tweens.add({ targets: fx, alpha: 0, scale: 1.5, duration: 500,
            onComplete: () => fx.destroy() });
        this.tweens.add({ targets: this.car, angle: { from: -15, to: 15 },
            duration: 80, yoyo: true, repeat: 2,
            onComplete: () => this.car.angle = 0 });
    }

    cleanupBarrier(bar) {
        if (bar.visual) bar.visual.destroy();
        const idx = this.barriers.indexOf(bar);
        if (idx >= 0) this.barriers.splice(idx, 1);
    }

    victory() {
        this.gameOver = true;
        bgm.play('victory');
        this.cameras.main.flash(800, 255, 255, 100);
        for (let i = 0; i < 30; i++) {
            this.time.delayedCall(i * 60, () => {
                const x = Phaser.Math.Between(0, GAME_W);
                const y = Phaser.Math.Between(0, GAME_H/2);
                const e = this.add.text(x, y, Phaser.Math.RND.pick(['🎉', '🎊', '⭐', '🏁']), {
                    fontSize: '50px'
                }).setOrigin(0.5).setDepth(50);
                this.tweens.add({ targets: e, y: y + 200, alpha: 0,
                    duration: 1500, onComplete: () => e.destroy() });
            });
        }
        this.time.delayedCall(2400, () => {
            bgm.stop();
            this.scene.start('ResultScene', {
                course: this.course, victory: true, correctCount: this.correctCount
            });
        });
    }
}

class ResultScene extends Phaser.Scene {
    constructor() { super('ResultScene'); }

    init(data) {
        this.course = data.course;
        this.victory = data.victory;
        this.correctCount = data.correctCount || 0;
    }

    create() {
        const g = this.add.graphics();
        if (this.victory) {
            g.fillGradientStyle(0xFFD700, 0xFFD700, 0xFF6F00, 0xE91E63, 1);
        } else {
            g.fillGradientStyle(0x4a0080, 0x4a0080, 0x000000, 0x000000, 1);
        }
        g.fillRect(0, 0, GAME_W, GAME_H);

        const title = this.victory ? '🏆 コースクリア！🏆' : '💥 ゲームオーバー 💥';
        this.add.text(GAME_W / 2, 200, title, {
            fontSize: '46px', fontFamily: FONT, fontStyle: 'bold',
            color: this.victory ? '#FFFFFF' : '#FF6B6B',
            stroke: '#000', strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(GAME_W / 2, 320, this.course.name, {
            fontSize: '36px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFEB3B', stroke: '#000', strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(GAME_W / 2, 440, 'せいかい', {
            fontSize: '32px', fontFamily: FONT,
            color: '#FFFFFF', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5);
        this.add.text(GAME_W / 2, 510, `${this.correctCount} / 10 もん`, {
            fontSize: '64px', fontFamily: FONT, fontStyle: 'bold',
            color: '#00FF88', stroke: '#000', strokeThickness: 8
        }).setOrigin(0.5);

        let comment;
        if (this.victory) comment = 'すごい！てんさい！';
        else if (this.correctCount >= 7) comment = 'おしい！もうちょっと！';
        else if (this.correctCount >= 4) comment = 'いいかんじ！';
        else comment = 'がんばろう！';
        this.add.text(GAME_W / 2, 600, comment, {
            fontSize: '32px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#000', strokeThickness: 5
        }).setOrigin(0.5);

        const retry = this.add.text(GAME_W / 2, 740, '🔄 もういっかい', {
            fontSize: '40px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFFFFF', backgroundColor: '#FF6B00',
            padding: { x: 36, y: 16 }, stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.tweens.add({ targets: retry, scale: 1.06, duration: 600,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        retry.on('pointerdown', () => {
            bgm.play('race');
            this.scene.start('RaceScene', { course: this.course });
        });

        const home = this.add.text(GAME_W / 2, 850, '🏠 コースえらびに もどる', {
            fontSize: '24px', fontFamily: FONT, fontStyle: 'bold',
            color: '#FFFFFF', backgroundColor: '#1a0040',
            padding: { x: 24, y: 10 }, stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        home.on('pointerdown', () => {
            bgm.play('title');
            this.scene.start('TitleScene');
        });

        const retryAction = () => {
            bgm.play('race');
            this.scene.start('RaceScene', { course: this.course });
        };
        const homeAction = () => {
            bgm.play('title');
            this.scene.start('TitleScene');
        };
        this.input.keyboard.on('keydown-ENTER', retryAction);
        this.input.keyboard.on('keydown-SPACE', retryAction);
        this.input.keyboard.on('keydown-ESC', homeAction);
        if (this.input.gamepad) {
            this.input.gamepad.on('down', (pad, button) => {
                if (button.index === 0 || button.index === 9) retryAction();
                else if (button.index === 1 || button.index === 8) homeAction();
            });
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: GAME_W,
    height: GAME_H,
    backgroundColor: '#0a0020',
    scale: { mode: Phaser.Scale.FIT },
    input: { gamepad: true },
    scene: [BootScene, TitleScene, RaceScene, ResultScene]
};

new Phaser.Game(config);
