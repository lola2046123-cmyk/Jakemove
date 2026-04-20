import React, { useMemo, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSkills } from '../context/SkillContext';
import { useT } from '../i18n';
import SkillCard from './SkillCard';
import type { ToolType } from '../types';

const TOOLS: Array<ToolType | 'All'> = ['All', 'Cursor', 'Claude Code', 'o1', 'Windsurf', 'Copilot', 'Other'];

function filterPillLabel(tool: ToolType | 'All', t: (key: string) => string): string {
  if (tool === 'All') return t('grid.filterAll');
  if (tool === 'Other') return t('grid.filterOther');
  return tool;
}

interface Props {
  onSelectSkill: (id: string) => void;
}

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }} aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const DiscoveryGrid: React.FC<Props> = ({ onSelectSkill }) => {
  const { tokens } = useTheme();
  const { skills, searchQuery, setSearchQuery, filterTool, setFilterTool } = useSkills();
  const { t } = useT();
  const [filterHover, setFilterHover] = useState<ToolType | 'All' | null>(null);
  const [searchWrapHover, setSearchWrapHover] = useState(false);

  const filtered = useMemo(() => {
    return skills.filter(s => {
      const matchesTool = filterTool === 'All' || s.tool === filterTool;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some(tag => tag.toLowerCase().includes(q)) ||
        s.author.toLowerCase().includes(q);
      return matchesTool && matchesSearch;
    });
  }, [skills, searchQuery, filterTool]);

  const resultsLabel = filtered.length === 1
    ? t('grid.resultFound', { n: filtered.length })
    : t('grid.resultsFound', { n: filtered.length });

  return (
    <section>
      {/* Search + filter toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
          alignItems: 'center',
        }}
      >
        {/* Search box */}
        <div
          onMouseEnter={() => setSearchWrapHover(true)}
          onMouseLeave={() => setSearchWrapHover(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: '1 1 240px',
            padding: '8px 14px',
            backgroundColor: tokens.bgInput,
            border: `1px solid ${tokens.borderMedium}`,
            borderRadius: '12px',
            boxShadow: searchWrapHover ? `0px 0px 0px 1px ${tokens.hoverRing}` : 'none',
            transition: 'box-shadow 0.15s ease',
          }}
        >
          <SearchIcon />
          <input
            type="text"
            placeholder={t('grid.searchPlaceholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label={t('grid.searchPlaceholder')}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '15px',
              color: tokens.textPrimary,
              fontFamily: 'system-ui, Arial, sans-serif',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label={t('grid.clearSearch')}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: tokens.textTertiary,
                padding: '0',
                fontSize: '16px',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Tool filter pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {TOOLS.map(tool => {
            const selected = filterTool === tool;
            const showHoverRing = !selected && filterHover === tool;
            return (
            <button
              key={tool}
              onClick={() => setFilterTool(tool)}
              onMouseEnter={() => setFilterHover(tool)}
              onMouseLeave={() => setFilterHover(null)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: `1px solid ${selected ? tokens.brandTerracotta : tokens.borderMedium}`,
                backgroundColor: selected ? tokens.brandTerracotta : tokens.bgSand,
                color: selected ? '#faf9f5' : tokens.textSecondary,
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: 'system-ui, Arial, sans-serif',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
                boxShadow: showHoverRing ? `0px 0px 0px 1px ${tokens.hoverRing}` : 'none',
              }}
            >
              {filterPillLabel(tool, t)}
            </button>
            );
          })}
        </div>
      </div>

      {/* Result count */}
      <p
        style={{
          fontSize: '13px',
          color: tokens.textTertiary,
          margin: '0 0 16px',
          fontFamily: 'system-ui, Arial, sans-serif',
        }}
      >
        {resultsLabel}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {filtered.map(skill => (
            <SkillCard key={skill.id} skill={skill} onClick={onSelectSkill} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: tokens.textTertiary,
            fontFamily: 'system-ui, Arial, sans-serif',
          }}
        >
          <p style={{ fontSize: '32px', margin: '0 0 12px' }}>🔍</p>
          <p style={{ fontSize: '17px', fontFamily: 'Georgia, serif', color: tokens.textSecondary }}>
            {t('grid.noResults')}
          </p>
          <p style={{ fontSize: '14px', margin: '6px 0 0' }}>
            {t('grid.noResultsHint')}
          </p>
        </div>
      )}
    </section>
  );
};

export default DiscoveryGrid;
