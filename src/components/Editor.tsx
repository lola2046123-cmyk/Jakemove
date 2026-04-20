/**
 * Editor.tsx — Step-2 full-screen skill editor.
 *
 * Layout (Chops-inspired dual panel):
 * ┌──────────────────── Top Bar ────────────────────────────┐
 * │ [← 修改元数据]  [name · tool · model badges]  [Publish] │
 * ├──────────── LEFT (55%) ──────────┬── RIGHT (45%) ────── ┤
 * │  Manifest editor                 │  Chops note editor   │
 * │  bg: slightly darker             │  bg: Parchment       │
 * │  [Edit | Preview] tabs           │  [Write | Preview]   │
 * │  <textarea> / ShikiBlock         │  <textarea> / MD     │
 * └──────────────────────────────────┴──────────────────────┘
 */

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../context/ThemeContext';
import { useSkills } from '../context/SkillContext';
import { useT } from '../i18n';
import type { EditorDraft } from '../types';
import ShikiBlock from './ShikiBlock';
import { TOOL_ICONS } from './EditorToolIcons';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  draft: EditorDraft;
  /** Manifest / 配置 — 唯一权威编辑区在左侧面板，由 App.uploadSession 持有 */
  manifesto: string;
  chopNote: string;
  onManifestoChange: (v: string) => void;
  onChopNoteChange: (v: string) => void;
  onBack: () => void;
  onPublished: () => void;
}

type PanelTab = 'edit' | 'preview';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const MONO = "'SF Mono','Cascadia Code','Fira Code','Courier New',monospace";
/** DESIGN.md §3 — Body / UI（Anthropic Sans 替代）；双面板编辑区正文统一 */
const UI_SANS = 'system-ui, Arial, sans-serif';

function editorBodyText(tokens: { textPrimary: string }): React.CSSProperties {
  return {
    fontFamily: UI_SANS,
    fontSize: '16px',
    lineHeight: 1.6,
    color: tokens.textPrimary,
  };
}

/** Detect a plausible shiki language from the first fenced code block in text */
function detectLang(text: string): string {
  const m = /^```(\w+)/m.exec(text);
  if (m) return m[1];
  if (/^---/.test(text.trim()) || /^[a-z_]+:\s/m.test(text)) return 'yaml';
  return 'markdown';
}

function lineCount(s: string): number {
  return s ? s.split('\n').length : 0;
}

// ─── Panel tab strip ───────────────────────────────────────────────────────────

const TabStrip: React.FC<{ tab: PanelTab; onChange: (t: PanelTab) => void; editLabel: string; previewLabel: string }> = ({
  tab, onChange, editLabel, previewLabel,
}) => {
  const { tokens } = useTheme();
  const btn = (t: PanelTab, label: string) => (
    <button
      key={t}
      type="button"
      onClick={() => onChange(t)}
      style={{
        padding: '4px 12px',
        fontSize: '12px',
        fontFamily: UI_SANS,
        border: 'none',
        borderBottom: `2px solid ${tab === t ? tokens.brandTerracotta : 'transparent'}`,
        backgroundColor: 'transparent',
        color: tab === t ? tokens.brandTerracotta : tokens.textTertiary,
        cursor: 'pointer',
        fontWeight: tab === t ? 500 : 400,
        transition: 'color 0.12s, border-color 0.12s',
      }}
    >
      {label}
    </button>
  );
  return (
    <div style={{ display: 'flex', gap: '0', borderBottom: `1px solid ${tokens.borderLight}` }}>
      {btn('edit', editLabel)}
      {btn('preview', previewLabel)}
    </div>
  );
};

// ─── Manifest panel (left) ─────────────────────────────────────────────────────

const ManifestPanel: React.FC<{
  value: string;
  onChange: (v: string) => void;
  tab: PanelTab;
  onTabChange: (t: PanelTab) => void;
  hasError: boolean;
}> = ({ value, onChange, tab, onTabChange, hasError }) => {
  const { tokens, mode } = useTheme();
  const { t } = useT();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // DESIGN.md：暖中性层级 — 亮色用 Warm Sand；暗色用 Ivory-on-dark（bgCard），避免 #18181a 等冷灰
  const panelBg = mode === 'dark' ? tokens.bgCard : tokens.bgSand;
  const lang = detectLang(value);

  // Auto-focus textarea on mount / tab switch
  useEffect(() => {
    if (tab === 'edit') textareaRef.current?.focus();
  }, [tab]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%', backgroundColor: panelBg }}>
      {/* Panel header */}
      <div style={{
        padding: '10px 16px 0',
        borderBottom: `1px solid ${tokens.borderLight}`,
        display: 'flex', flexDirection: 'column', gap: 0,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase',
            color: tokens.textTertiary, fontFamily: UI_SANS,
          }}>
            {t('editor.manifestPanel')}
          </span>
          <span style={{ fontSize: '11px', color: tokens.textTertiary, fontFamily: MONO }}>
            {t('editor.lineCount').replace('{n}', String(lineCount(value)))}
          </span>
        </div>
        <TabStrip tab={tab} onChange={onTabChange} editLabel={t('editor.edit')} previewLabel={t('editor.preview')} />
      </div>

      {/* Content — minHeight:0 让 flex 子项在视口内可滚动 */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {tab === 'edit' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={t('editor.manifestPlaceholder')}
            spellCheck={false}
            style={{
              width: '100%',
              flex: 1,
              minHeight: '240px',
              padding: '20px',
              backgroundColor: 'transparent',
              border: hasError ? `1px solid ${tokens.errorRed}` : 'none',
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
              caretColor: tokens.brandTerracotta,
              ...editorBodyText(tokens),
            }}
          />
        ) : (
          <div style={{ padding: '16px' }}>
            {value.trim() ? (
              <ShikiBlock code={value} lang={lang} fontSize="15px" margin="0" />
            ) : (
              <p style={{ margin: 0, paddingTop: '20px', fontFamily: UI_SANS, fontSize: '15px', lineHeight: 1.6, color: tokens.textTertiary }}>
                {t('editor.noPreview')}
              </p>
            )}
          </div>
        )}
      </div>

      {hasError && (
        <div style={{ padding: '8px 16px', borderTop: `1px solid ${tokens.errorRed}`, backgroundColor: tokens.errorRed + '10' }}>
          <p style={{ margin: 0, fontSize: '12px', color: tokens.errorRed, fontFamily: UI_SANS }}>
            {t('editor.manifestRequired')}
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Chops note panel (right) ──────────────────────────────────────────────────

const ChopPanel: React.FC<{
  value: string;
  onChange: (v: string) => void;
  tab: PanelTab;
  onTabChange: (t: PanelTab) => void;
}> = ({ value, onChange, tab, onTabChange }) => {
  const { tokens, mode } = useTheme();
  const { t } = useT();

  // Parchment（页级）；暗色用 bgCard
  const panelBg = mode === 'dark' ? tokens.bgCard : tokens.bgPage;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%', backgroundColor: panelBg }}>
      {/* Panel header */}
      <div style={{
        padding: '10px 16px 0',
        borderBottom: `1px solid ${tokens.borderLight}`,
        display: 'flex', flexDirection: 'column', gap: 0,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase',
            color: tokens.textTertiary, fontFamily: UI_SANS,
          }}>
            {t('editor.chopPanel')}
          </span>
          <span style={{ fontSize: '11px', color: tokens.textTertiary, fontFamily: MONO }}>
            {t('editor.lineCount').replace('{n}', String(lineCount(value)))}
          </span>
        </div>
        <TabStrip tab={tab} onChange={onTabChange} editLabel={t('editor.edit')} previewLabel={t('editor.preview')} />
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {tab === 'edit' ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={t('editor.chopPlaceholder')}
            style={{
              width: '100%',
              flex: 1,
              minHeight: '240px',
              padding: '20px',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
              caretColor: tokens.brandTerracotta,
              ...editorBodyText(tokens),
            }}
          />
        ) : (
          <div style={{
            padding: '20px',
            fontSize: '16px',
            lineHeight: 1.6,
            color: tokens.textSecondary,
            fontFamily: UI_SANS,
          }}>
            {value.trim() ? (
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    if (!match) {
                      return (
                        <code style={{
                          backgroundColor: tokens.bgSand, color: tokens.brandTerracotta,
                          padding: '1px 5px', fontFamily: MONO, fontSize: '15px',
                        }} {...props}>{children}</code>
                      );
                    }
                    return (
                      <ShikiBlock code={String(children).replace(/\n$/, '')} lang={match[1]} fontSize="15px" margin="10px 0" />
                    );
                  },
                  p: ({ children }) => <p style={{ margin: '0 0 10px', color: tokens.textSecondary, fontFamily: UI_SANS, fontSize: '16px', lineHeight: 1.6 }}>{children}</p>,
                  strong: ({ children }) => <strong style={{ color: tokens.textPrimary, fontWeight: 600, fontFamily: UI_SANS }}>{children}</strong>,
                  h1: ({ children }) => <h1 style={{ fontSize: '20px', fontWeight: 500, color: tokens.textPrimary, fontFamily: 'Georgia, serif', lineHeight: 1.25, margin: '0 0 10px' }}>{children}</h1>,
                  h2: ({ children }) => <h2 style={{ fontSize: '17px', fontWeight: 500, color: tokens.textPrimary, fontFamily: 'Georgia, serif', lineHeight: 1.25, margin: '12px 0 8px' }}>{children}</h2>,
                  ul: ({ children }) => <ul style={{ paddingLeft: '18px', margin: '0 0 10px', color: tokens.textSecondary, fontFamily: UI_SANS, fontSize: '16px', lineHeight: 1.6 }}>{children}</ul>,
                  blockquote: ({ children }) => (
                    <blockquote style={{ borderLeft: `2px solid ${tokens.brandTerracotta}`, paddingLeft: '14px', margin: '10px 0', color: tokens.textTertiary, fontStyle: 'italic', fontFamily: UI_SANS, fontSize: '16px', lineHeight: 1.6 }}>
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <p style={{ margin: 0, fontFamily: UI_SANS, fontSize: '15px', lineHeight: 1.6, color: tokens.textTertiary }}>
                {t('editor.noPreview')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Editor (main component) ───────────────────────────────────────────────────

const Editor: React.FC<Props> = ({
  draft,
  manifesto,
  chopNote,
  onManifestoChange,
  onChopNoteChange,
  onBack,
  onPublished,
}) => {
  const { tokens, mode } = useTheme();
  const { addSkill, addChop } = useSkills();
  const { t } = useT();

  const [manifestTab, setManifestTab] = useState<PanelTab>('edit');
  const [chopTab, setChopTab] = useState<PanelTab>('edit');
  const [manifestError, setManifestError] = useState(false);
  const [published, setPublished] = useState(false);
  const [backHover, setBackHover] = useState(false);
  const [publishHover, setPublishHover] = useState(false);

  const ToolIcon = TOOL_ICONS[draft.tool];

  const handlePublish = () => {
    if (!manifesto.trim()) { setManifestError(true); return; }
    setManifestError(false);

    const skillId = addSkill({
      name: draft.name,
      tool: draft.tool,
      targetModel: draft.targetModel,
      description: draft.description,
      manifesto,
      tags: draft.tags,
    });

    const trimmedChop = chopNote.trim();
    if (trimmedChop) {
      addChop(skillId, trimmedChop, t('skill.authorYou'));
    }

    setPublished(true);
    setTimeout(onPublished, 1400);
  };

  const topBarBg = mode === 'dark' ? tokens.bgPage : tokens.bgCard;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('editor.manifestPanel')}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 950,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        backgroundColor: tokens.bgPage,
      }}
    >
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 20px',
        height: '52px',
        flexShrink: 0,
        backgroundColor: topBarBg,
        borderBottom: `1px solid ${tokens.borderLight}`,
        boxSizing: 'border-box',
      }}>
        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 10px',
            backgroundColor: 'transparent',
            border: `1px solid ${tokens.borderMedium}`,
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            color: tokens.textSecondary,
            fontFamily: UI_SANS,
            flexShrink: 0,
            boxShadow: backHover ? `0px 0px 0px 1px ${tokens.hoverRing}` : 'none',
            transition: 'box-shadow 0.15s ease',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          {t('editor.back')}
        </button>

        {/* Metadata badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
          <span style={{
            fontSize: '15px', fontWeight: 500, color: tokens.textPrimary,
            fontFamily: 'Georgia, serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {draft.name || '—'}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '2px 8px',
            backgroundColor: tokens.brandTerracotta + '18',
            color: tokens.brandTerracotta,
            border: `1px solid ${tokens.brandTerracotta}30`,
            borderRadius: '6px',
            fontSize: '12px', fontFamily: UI_SANS, flexShrink: 0,
          }}>
            <ToolIcon />
            {draft.tool}
          </span>
          <span style={{
            padding: '2px 8px',
            backgroundColor: tokens.bgSand,
            color: tokens.textTertiary,
            border: `1px solid ${tokens.borderLight}`,
            borderRadius: '6px',
            fontSize: '12px', fontFamily: UI_SANS, flexShrink: 0,
          }}>
            {draft.targetModel}
          </span>
        </div>

        {/* Publish button */}
        {published ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 16px',
            backgroundColor: tokens.bgSand, color: tokens.brandTerracotta,
            border: `1px solid ${tokens.borderMedium}`, borderRadius: '8px',
            fontSize: '13px', fontFamily: UI_SANS, flexShrink: 0,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t('editor.published')}
          </div>
        ) : (
          <button
            type="button"
            onClick={handlePublish}
            onMouseEnter={() => setPublishHover(true)}
            onMouseLeave={() => setPublishHover(false)}
            style={{
              padding: '6px 18px',
              backgroundColor: tokens.brandTerracotta,
              color: '#faf9f5' /* Ivory — DESIGN.md Brand Terracotta 按钮正文 */,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: UI_SANS,
              flexShrink: 0,
              boxShadow: publishHover
                ? `0px 0px 0px 1px rgba(250,249,245,0.45)`
                : `${tokens.brandTerracotta} 0px 0px 0px 0px, ${tokens.brandTerracotta} 0px 0px 0px 1px`,
              opacity: publishHover ? 0.94 : 1,
              transition: 'opacity 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            {t('editor.publish')}
          </button>
        )}
      </div>

      {/* ── Dual Panel — minHeight:0 保证子面板在视口内占满并可滚动 ─ */}
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '55fr 45fr', overflow: 'hidden' }}>
        <div style={{ minHeight: 0, overflow: 'hidden', borderRight: `1px solid ${tokens.borderLight}`, display: 'flex', flexDirection: 'column' }}>
          <ManifestPanel
            value={manifesto}
            onChange={v => { onManifestoChange(v); if (v.trim()) setManifestError(false); }}
            tab={manifestTab}
            onTabChange={setManifestTab}
            hasError={manifestError}
          />
        </div>

        <div style={{ minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ChopPanel
            value={chopNote}
            onChange={onChopNoteChange}
            tab={chopTab}
            onTabChange={setChopTab}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
