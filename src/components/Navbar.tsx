import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSkills } from '../context/SkillContext';
import { useT } from '../i18n';
import ThemeToggle from './ThemeToggle';
import LangToggle from './LangToggle';

const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const LogoMark = ({ color }: { color: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect width="28" height="28" rx="7" fill={color} />
    <path d="M8 9h7a5 5 0 0 1 0 10H8V9z" fill="#faf9f5" opacity="0.9" />
    <rect x="8" y="16" width="12" height="2.5" rx="1.25" fill="#faf9f5" opacity="0.5" />
  </svg>
);

interface Props {
  view: 'grid' | 'detail';
  onLogoClick: () => void;
  onShareClick: () => void;
}

const Navbar: React.FC<Props> = ({ view, onLogoClick, onShareClick }) => {
  const { tokens } = useTheme();
  const { skills } = useSkills();
  const { t } = useT();
  const [discoverHover, setDiscoverHover] = useState(false);
  const [shareHover, setShareHover] = useState(false);

  return (
    <nav
      role="navigation"
      aria-label={t('nav.ariaMain')}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: tokens.bgNavbar,
        borderBottom: `1px solid ${tokens.borderLight}`,
        backdropFilter: 'blur(12px)',
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          minHeight: '60px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: '10px',
          columnGap: '10px',
        }}
      >
        {/* Logo */}
        <button
          onClick={onLogoClick}
          aria-label={t('nav.ariaHome')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <LogoMark color={tokens.brandTerracotta} />
          <span
            style={{
              fontSize: '17px',
              fontWeight: 500,
              color: tokens.textPrimary,
              fontFamily: 'Georgia, serif',
              letterSpacing: '-0.3px',
            }}
          >
            SkillDock
          </span>
        </button>

        {/* Nav link */}
        <div style={{ display: 'flex', gap: '2px' }}>
          <button
            onClick={onLogoClick}
            onMouseEnter={() => setDiscoverHover(true)}
            onMouseLeave={() => setDiscoverHover(false)}
            style={{
              border: 'none',
              cursor: 'pointer',
              padding: '5px 10px',
              borderRadius: '7px',
              fontSize: '14px',
              fontWeight: view === 'grid' ? 500 : 400,
              color: view === 'grid' ? tokens.textPrimary : tokens.textSecondary,
              fontFamily: 'system-ui, Arial, sans-serif',
              backgroundColor: view === 'grid' ? tokens.bgSand : 'transparent',
              boxShadow: discoverHover ? `0px 0px 0px 1px ${tokens.hoverRing}` : 'none',
              transition: 'color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            {t('nav.discover')}
          </button>
        </div>

        {/* 占满中间空白，把右侧操作区顶到最右 */}
        <div style={{ flex: '1 1 auto', minWidth: '12px' }} aria-hidden />

        {/* 右侧：统计 → 分享 → 语言（中文默认时显示 English）→ 主题 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          {/* Stats pill：允许收缩，避免挤出语言按钮 */}
          <div
            title={t('nav.statsTemplate', { count: skills.length, members: 58 })}
            style={{
              padding: '4px 10px',
              backgroundColor: tokens.bgSand,
              border: `1px solid ${tokens.borderLight}`,
              borderRadius: '24px',
              fontSize: '12px',
              color: tokens.textTertiary,
              fontFamily: 'system-ui, Arial, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              minWidth: 0,
              maxWidth: 'min(220px, 42vw)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: tokens.brandTerracotta,
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t('nav.statsTemplate', { count: skills.length, members: 58 })}
            </span>
          </div>

          <button
            type="button"
            onClick={onShareClick}
            onMouseEnter={() => setShareHover(true)}
            onMouseLeave={() => setShareHover(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              backgroundColor: tokens.brandTerracotta,
              color: '#faf9f5',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: 'system-ui, Arial, sans-serif',
              boxShadow: shareHover
                ? `0px 0px 0px 1px rgba(250,249,245,0.45)`
                : `${tokens.brandTerracotta} 0px 0px 0px 0px, ${tokens.brandTerracotta} 0px 0px 0px 1px`,
              opacity: shareHover ? 0.94 : 1,
              transition: 'opacity 0.15s ease, box-shadow 0.15s ease',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            <PlusIcon />
            {t('nav.shareSkill')}
          </button>

          <LangToggle />

          <div style={{ flexShrink: 0 }}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
