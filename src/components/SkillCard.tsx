import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSkills } from '../context/SkillContext';
import { useT } from '../i18n';
import type { Skill } from '../types';

interface Props {
  skill: Skill;
  onClick: (id: string) => void;
}

const toolColors: Record<string, string> = {
  Cursor: '#c96442',
  'Claude Code': '#d97757',
  o1: '#5e5d59',
  Windsurf: '#4d4c48',
  Copilot: '#87867f',
  Other: '#87867f',
};

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SkillCard: React.FC<Props> = ({ skill, onClick }) => {
  const { tokens, mode } = useTheme();
  const { copySkill } = useSkills();
  const { t } = useT();
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [copyHovered, setCopyHovered] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(skill.manifesto).catch(() => {});
    copySkill(skill.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toolColor = toolColors[skill.tool] || '#87867f';

  return (
    <article
      onClick={() => onClick(skill.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(skill.id)}
      aria-label={`${skill.name} by ${skill.author}`}
      style={{
        backgroundColor: tokens.bgCard,
        border: `1px solid ${tokens.borderLight}`,
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        boxShadow: hovered
          ? (mode === 'dark'
              ? `0px 0px 0px 1px ${tokens.ringWarm}`
              : tokens.shadowWhisper)
          : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: 500,
              color: tokens.textPrimary,
              fontFamily: 'Georgia, serif',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {skill.name}
          </h3>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '13px',
              color: tokens.textTertiary,
              fontFamily: 'system-ui, Arial, sans-serif',
            }}
          >
            {t('card.by')} {skill.author}
          </p>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          onMouseEnter={() => setCopyHovered(true)}
          onMouseLeave={() => setCopyHovered(false)}
          aria-label={copied ? t('card.copied') : t('card.copy')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 10px',
            backgroundColor: tokens.bgSand,
            color: copied ? tokens.brandTerracotta : tokens.textSecondary,
            border: `1px solid ${copied ? tokens.brandTerracotta : tokens.borderMedium}`,
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: 'system-ui, Arial, sans-serif',
            flexShrink: 0,
            transition: 'all 0.18s ease',
            /* 成功态仅 border；悬停未成功时 Charcoal Warm 1px ring（DESIGN.md） */
            boxShadow:
              copied ? 'none'
              : copyHovered ? `0px 0px 0px 1px ${tokens.hoverRing}`
              : `0px 0px 0px 1px ${tokens.ringWarm}`,
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? t('card.copied') : t('card.copy')}
        </button>
      </div>

      {/* Description */}
      <p
        style={{
          margin: 0,
          fontSize: '14px',
          color: tokens.textSecondary,
          fontFamily: 'system-ui, Arial, sans-serif',
          lineHeight: 1.6,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {skill.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {skill.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            onClick={e => e.stopPropagation()}
            style={{
              padding: '2px 8px',
              backgroundColor: tokens.bgSand,
              color: tokens.textTertiary,
              borderRadius: '24px',
              fontSize: '11px',
              fontWeight: 500,
              fontFamily: 'system-ui, Arial, sans-serif',
              letterSpacing: '0.12px',
              cursor: 'default',
              boxShadow: 'none',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: `1px solid ${tokens.borderLight}`,
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span
            onClick={e => e.stopPropagation()}
            style={{
              padding: '3px 8px',
              backgroundColor: toolColor + '18',
              color: toolColor,
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              fontFamily: 'system-ui, Arial, sans-serif',
              border: `1px solid ${toolColor}30`,
              boxShadow: 'none',
            }}
          >
            {skill.tool}
          </span>
          <span
            onClick={e => e.stopPropagation()}
            style={{
              padding: '3px 8px',
              backgroundColor: tokens.bgSand,
              color: tokens.textTertiary,
              borderRadius: '6px',
              fontSize: '12px',
              fontFamily: 'system-ui, Arial, sans-serif',
              boxShadow: 'none',
            }}
          >
            {skill.targetModel}
          </span>
        </div>

        <span
          style={{
            fontSize: '12px',
            color: tokens.textTertiary,
            fontFamily: 'system-ui, Arial, sans-serif',
          }}
        >
          {skill.copies} {t('card.copies')}
        </span>
      </div>
    </article>
  );
};

export default SkillCard;
