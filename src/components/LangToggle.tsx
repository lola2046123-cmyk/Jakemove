import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useT } from '../i18n';

const GlobeIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

/**
 * 默认中文（zh）→ 按钮展示二级语言「English」；英文界面 → 展示「中文」切回主语言。
 */
const LangToggle: React.FC = () => {
  const { tokens } = useTheme();
  const { locale, toggleLocale, t } = useT();
  const [hovered, setHovered] = useState(false);

  const label = locale === 'zh' ? t('lang.buttonToEn') : t('lang.buttonToZh');
  const title = locale === 'zh' ? t('lang.switchToEn') : t('lang.switchToZh');

  return (
    <button
      type="button"
      onClick={toggleLocale}
      title={title}
      aria-label={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '7px 12px',
        minWidth: '72px',
        justifyContent: 'center',
        flexShrink: 0,
        backgroundColor: hovered ? tokens.bgCardAlt : tokens.bgSand,
        color: hovered ? tokens.textPrimary : tokens.textSecondary,
        border: `1px solid ${tokens.borderMedium}`,
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px',
        fontFamily: 'system-ui, Arial, sans-serif',
        fontWeight: 500,
        letterSpacing: '0.02em',
        boxShadow: hovered ? `0px 0px 0px 1px ${tokens.hoverRing}` : `0px 0px 0px 1px ${tokens.ringWarm}`,
        transition: 'color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
        whiteSpace: 'nowrap',
      }}
    >
      <GlobeIcon />
      <span>{label}</span>
    </button>
  );
};

export default LangToggle;
