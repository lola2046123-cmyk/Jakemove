export const lightTokens = {
  // Backgrounds
  bgPage: '#f5f4ed',
  bgCard: '#faf9f5',
  bgCardAlt: '#ffffff',
  bgInput: '#ffffff',
  bgNavbar: '#f5f4ed',
  bgModal: '#ffffff',
  bgSand: '#e8e6dc',
  bgDarkSurface: '#30302e',

  // Text
  textPrimary: '#141413',
  textSecondary: '#5e5d59',
  textTertiary: '#87867f',
  textInverse: '#faf9f5',
  textMuted: '#b0aea5',
  textLink: '#c96442',

  // Brand
  brandTerracotta: '#c96442',
  brandCoral: '#d97757',

  // Borders
  borderLight: '#f0eee6',
  borderMedium: '#e8e6dc',
  borderDark: '#30302e',

  // Interactive
  ringWarm: '#d1cfc5',
  ringDeep: '#c2c0b6',
  /** DESIGN.md §2 Charcoal Warm — 1px ring on interactive hovers (light surfaces) */
  hoverRing: '#4d4c48',
  focusBlue: '#3898ec',

  // Semantic
  errorRed: '#b53333',

  // Shadows
  shadowWhisper: 'rgba(0,0,0,0.05) 0px 4px 24px',
  shadowRing: '0px 0px 0px 1px',
};

export const darkTokens = {
  bgPage: '#141413',
  bgCard: '#1e1e1c',
  bgCardAlt: '#30302e',
  bgInput: '#1e1e1c',
  bgNavbar: '#141413',
  bgModal: '#1e1e1c',
  bgSand: '#3a3a38',
  bgDarkSurface: '#30302e',

  textPrimary: '#faf9f5',
  textSecondary: '#b0aea5',
  textTertiary: '#87867f',
  textInverse: '#141413',
  textMuted: '#5e5d59',
  textLink: '#d97757',

  brandTerracotta: '#c96442',
  brandCoral: '#d97757',

  borderLight: '#30302e',
  borderMedium: '#3a3a38',
  borderDark: '#4d4c48',

  ringWarm: '#4d4c48',
  ringDeep: '#3a3a38',
  /** 暗色表面上可见的暖灰 1px hover ring（Stone Gray） */
  hoverRing: '#87867f',
  focusBlue: '#3898ec',

  errorRed: '#b53333',

  shadowWhisper: 'rgba(0,0,0,0.25) 0px 4px 24px',
  shadowRing: '0px 0px 0px 1px',
};

export type Tokens = typeof lightTokens;
