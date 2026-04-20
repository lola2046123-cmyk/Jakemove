import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useT } from '../i18n';

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ThemeToggle: React.FC = () => {
  const { mode, tokens, toggle } = useTheme();
  const { t } = useT();
  const [hovered, setHovered] = useState(false);

  const label = mode === 'light' ? t('theme.dark') : t('theme.light');
  const title = mode === 'light' ? t('theme.switchToDark') : t('theme.switchToLight');

  return (
    <button
      onClick={toggle}
      title={title}
      aria-label={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '7px 12px',
        backgroundColor: hovered ? tokens.bgCardAlt : tokens.bgSand,
        color: hovered ? tokens.textPrimary : tokens.textSecondary,
        border: `1px solid ${tokens.borderMedium}`,
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px',
        fontFamily: 'system-ui, Arial, sans-serif',
        fontWeight: 500,
        boxShadow: hovered ? `0px 0px 0px 1px ${tokens.hoverRing}` : `0px 0px 0px 1px ${tokens.ringWarm}`,
        transition: 'color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {mode === 'light' ? <MoonIcon /> : <SunIcon />}
      <span>{label}</span>
    </button>
  );
};

export default ThemeToggle;
