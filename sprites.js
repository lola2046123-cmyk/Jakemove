/** 精灵条目配置 —— Home / 预览 / 游戏共用 */
window.SPRITE_CATALOG = [
  {
    id: "jack-attack",
    name: "进击的JACK",
    frames: 20,
    grid: [5, 4],
    gif: "spritesheet-20f.gif",
    atlas: "atlas.png",
    ready: true,
    playable: true,
    blurb: "20 帧连招 · 像素武者",
    hitGif: "shanbai.gif",
    /** 帧索引从 0 开始，对应 5×4 图集从左到右、从上到下 */
    anims: {
      idle: [0, 1, 19, 1],
      dash: [2, 10],
      punch: [3, 4, 11],
      kick: [6, 7, 8, 12, 13],
      slide: [9, 14, 15],
      victory: [16, 17, 18, 17],
      hit: [15, 14],
    },
    /** 攻击帧：该 clip 内第几帧产生判定 */
    hitFrames: {
      punch: [1, 2],
      kick: [1, 2, 3],
    },
  },
  {
    id: "run1",
    name: "疾跑的JACK",
    frames: 8,
    grid: [1, 1],
    gif: "Run1.gif",
    atlas: null,
    ready: true,
    playable: false,
    blurb: "8 帧奔跑 · 扛包冲刺",
    accent: "#0a9396",
  },
  {
    id: "placeholder-spin",
    name: "回旋踢",
    frames: 8,
    grid: [4, 2],
    gif: null,
    atlas: null,
    ready: false,
    playable: false,
    blurb: "占位 · 待导入",
    accent: "#4c6ef5",
  },
  {
    id: "placeholder-idle",
    name: "待机呼吸",
    frames: 6,
    grid: [3, 2],
    gif: null,
    atlas: null,
    ready: false,
    playable: false,
    blurb: "占位 · 待导入",
    accent: "#2b8a3e",
  },
  {
    id: "shanbai",
    name: "受击闪白",
    frames: 8,
    grid: [1, 1],
    gif: "shanbai.gif",
    atlas: null,
    ready: true,
    playable: false,
    role: "hit",
    blurb: "8 帧受击 · 闪白爆点",
    accent: "#c2255c",
  },
  {
    id: "placeholder-win",
    name: "胜利姿势",
    frames: 10,
    grid: [5, 2],
    gif: null,
    atlas: null,
    ready: false,
    playable: false,
    blurb: "占位 · 待导入",
    accent: "#e67700",
  },
];

window.getSpriteById = function (id) {
  return (window.SPRITE_CATALOG || []).find((s) => s.id === id) || null;
};

window.getPlayableSprites = function () {
  return (window.SPRITE_CATALOG || []).filter((s) => s.playable && s.atlas);
};
