import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '../context/ThemeContext';
import { useT } from '../i18n';
import type { ToolType, ModelType, EditorDraft } from '../types';
import { TOOL_ICONS } from './EditorToolIcons';

// ─── Data ──────────────────────────────────────────────────────────────────────

const TOOLS: ToolType[] = ['Cursor', 'Claude Code', 'o1', 'Windsurf', 'Copilot', 'Other'];
const MODELS: ModelType[] = ['Sonnet 3.5', 'Sonnet 4.6', 'o1', 'GPT-4o', 'Haiku 3.5', 'Opus 4', 'Other'];

// ─── Utility icons ─────────────────────────────────────────────────────────────

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"
    style={{ flexShrink: 0, transition: 'transform 0.15s ease', transform: open ? 'rotate(180deg)' : 'none' }}>
    <polyline points="5 9 12 16 19 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <polyline points="4 12 9 17 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── ToolOption ────────────────────────────────────────────────────────────────

interface ToolOptionProps {
  tool: ToolType;
  Icon: React.FC;
  isSelected: boolean;
  onSelect: () => void;
}

const ToolOption: React.FC<ToolOptionProps> = ({ tool, Icon, isSelected, onSelect }) => {
  const { tokens, mode } = useTheme();
  const [hovered, setHovered] = useState(false);
  const active = isSelected || hovered;
  const bg = mode === 'dark' ? tokens.bgCard : tokens.bgPage;
  const bgHover = mode === 'dark' ? tokens.bgSand : tokens.bgCard;

  return (
    <button
      role="option"
      aria-selected={isSelected}
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      style={{
        width: '100%', padding: '9px 12px', display: 'flex', alignItems: 'center', gap: '10px',
        backgroundColor: active ? bgHover : bg,
        color: isSelected ? tokens.brandTerracotta : active ? tokens.brandTerracotta : tokens.textSecondary,
        border: 'none',
        borderLeft: `2px solid ${isSelected ? tokens.brandTerracotta : 'transparent'}`,
        cursor: 'pointer', fontSize: '13px', fontFamily: 'system-ui, Arial, sans-serif',
        textAlign: 'left', boxSizing: 'border-box', transition: 'background-color 0.08s, color 0.08s',
      }}
    >
      <Icon />
      <span style={{ flex: 1 }}>{tool}</span>
      {isSelected && <CheckIcon />}
    </button>
  );
};

// ─── ToolSelect (portal-based, escapes modal overflow clipping) ────────────────

interface ToolSelectProps {
  value: ToolType;
  onChange: (v: ToolType) => void;
}

const ToolSelect: React.FC<ToolSelectProps> = ({ value, onChange }) => {
  const { tokens, mode } = useTheme();
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const SelectedIcon = TOOL_ICONS[value];

  const updatePosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDropdownStyle({ position: 'fixed', top: rect.bottom + 2, left: rect.left, width: rect.width, zIndex: 9999 });
  }, []);

  const open_ = () => { updatePosition(); setOpen(true); };
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !dropdownRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = () => close();
    window.addEventListener('scroll', h, true);
    window.addEventListener('resize', h);
    return () => { window.removeEventListener('scroll', h, true); window.removeEventListener('resize', h); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open]);

  const bgDropdown = mode === 'dark' ? tokens.bgCard : tokens.bgPage;

  const dropdown = open ? ReactDOM.createPortal(
    <div ref={dropdownRef} role="listbox" aria-label="Tool" style={{
      ...dropdownStyle, backgroundColor: bgDropdown,
      border: `1px solid ${tokens.brandTerracotta}`, borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)', overflow: 'hidden',
    }}>
      {TOOLS.map(tool => (
        <ToolOption key={tool} tool={tool} Icon={TOOL_ICONS[tool]} isSelected={tool === value}
          onSelect={() => { onChange(tool); close(); }} />
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <div style={{ position: 'relative' }}>
      <button ref={triggerRef} type="button" aria-haspopup="listbox" aria-expanded={open}
        onClick={open ? close : open_}
        style={{
          width: '100%', padding: '9px 12px', backgroundColor: mode === 'dark' ? tokens.bgCard : tokens.bgPage,
          border: `1px solid ${open ? tokens.brandTerracotta : tokens.borderMedium}`,
          borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '14px', color: tokens.textSecondary, fontFamily: 'system-ui, Arial, sans-serif',
          boxSizing: 'border-box', transition: 'border-color 0.15s',
        }}
      >
        <span style={{ color: tokens.textSecondary, display: 'flex', alignItems: 'center' }}><SelectedIcon /></span>
        <span style={{ flex: 1, textAlign: 'left' }}>{value}</span>
        <ChevronIcon open={open} />
      </button>
      {dropdown}
    </div>
  );
};

// ─── UploadModal — Step 1: Metadata only ──────────────────────────────────────

interface Props {
  /** Close without proceeding */
  onClose: () => void;
  /** Proceed to editor with the collected metadata */
  onNext: (draft: EditorDraft) => void;
  /** Pre-fill when the user comes back from the editor */
  initialDraft?: EditorDraft;
}

const UploadModal: React.FC<Props> = ({ onClose, onNext, initialDraft }) => {
  const { tokens, mode } = useTheme();
  const { t } = useT();

  const [form, setForm] = useState<EditorDraft>({
    name: initialDraft?.name ?? '',
    tool: initialDraft?.tool ?? 'Cursor',
    targetModel: initialDraft?.targetModel ?? 'Sonnet 4.6',
    description: initialDraft?.description ?? '',
    tags: initialDraft?.tags ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EditorDraft, string>>>({});

  // 从编辑器「返回」时父组件会传入已保存的 draft — 必须与 App 中 uploadSession 同步
  useEffect(() => {
    if (initialDraft) setForm({ ...initialDraft });
  }, [initialDraft]);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
    backgroundColor: mode === 'dark' ? tokens.bgCard : tokens.bgPage,
    border: `1px solid ${tokens.borderMedium}`,
    borderRadius: '8px',
    fontSize: '14px', color: tokens.textPrimary,
    fontFamily: 'system-ui, Arial, sans-serif',
    outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: 500,
    color: tokens.textTertiary, marginBottom: '5px',
    fontFamily: 'system-ui, Arial, sans-serif', textTransform: 'uppercase', letterSpacing: '0.4px',
  };

  const validate = () => {
    const e: Partial<Record<keyof EditorDraft, string>> = {};
    if (!form.name.trim()) e.name = t('upload.errorRequired');
    return e;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onNext(form);
  };

  const RequiredMark = () => <span style={{ color: tokens.brandTerracotta, marginLeft: '2px' }}>*</span>;

  return (
    <div
      onClick={onClose}
      role="dialog" aria-modal="true" aria-label={t('upload.title')}
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(20,20,19,0.55)',
        backdropFilter: 'blur(4px)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: mode === 'dark' ? tokens.bgModal : '#faf9f5',
          border: `1px solid ${tokens.borderMedium}`,
          borderRadius: '12px',
          width: '100%', maxWidth: '480px',
          boxShadow: `rgba(0,0,0,${mode === 'dark' ? '0.5' : '0.12'}) 0px 20px 48px`,
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: `1px solid ${tokens.borderLight}`,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 500, color: tokens.textPrimary, fontFamily: 'Georgia, serif' }}>
              {t('upload.title')}
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '13px', color: tokens.textTertiary, fontFamily: 'system-ui, Arial, sans-serif' }}>
              {t('upload.subtitle')}
            </p>
          </div>
          <button onClick={onClose} aria-label={t('upload.close')}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: tokens.textTertiary, padding: '4px', display: 'flex' }}>
            <XIcon />
          </button>
        </div>

        {/* Step indicator */}
        <div style={{ padding: '12px 22px 0', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: tokens.brandTerracotta, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#faf9f5', fontWeight: 600, fontFamily: 'system-ui, sans-serif', flexShrink: 0 }}>1</div>
          <span style={{ fontSize: '12px', color: tokens.brandTerracotta, fontFamily: 'system-ui, sans-serif', fontWeight: 500 }}>{t('upload.stepMeta')}</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: tokens.borderLight }} />
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `1px solid ${tokens.borderMedium}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: tokens.textTertiary, fontFamily: 'system-ui, sans-serif', flexShrink: 0 }}>2</div>
          <span style={{ fontSize: '12px', color: tokens.textTertiary, fontFamily: 'system-ui, sans-serif' }}>{t('upload.stepContent')}</span>
        </div>
        <p style={{
          margin: '10px 22px 0',
          padding: '10px 12px',
          backgroundColor: mode === 'dark' ? tokens.bgSand : tokens.bgPage,
          border: `1px solid ${tokens.borderLight}`,
          borderRadius: '6px',
          fontSize: '12px',
          lineHeight: 1.55,
          color: tokens.textSecondary,
          fontFamily: 'system-ui, Arial, sans-serif',
        }}>
          {t('upload.manifestNextStepHint')}
        </p>

        {/* Form */}
        <form onSubmit={handleNext} style={{ padding: '16px 22px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Skill Name */}
          <div>
            <label style={labelStyle}>{t('upload.skillName')} <RequiredMark /></label>
            <input type="text" placeholder={t('upload.skillNamePlaceholder')} value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={{ ...inputStyle, borderColor: errors.name ? tokens.errorRed : tokens.borderMedium }}
              autoFocus
            />
            {errors.name && <p style={{ margin: '3px 0 0', fontSize: '11px', color: tokens.errorRed, fontFamily: 'system-ui, sans-serif' }}>{errors.name}</p>}
          </div>

          {/* Tool + Model */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>{t('upload.tool')}</label>
              <ToolSelect value={form.tool} onChange={tool => setForm(f => ({ ...f, tool }))} />
            </div>
            <div>
              <label style={labelStyle}>{t('upload.targetModel')}</label>
              <select value={form.targetModel}
                onChange={e => setForm(f => ({ ...f, targetModel: e.target.value as ModelType }))}
                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' }}
              >
                {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>{t('upload.description')}</label>
            <input type="text" placeholder={t('upload.descriptionPlaceholder')} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              style={inputStyle}
            />
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>{t('upload.tags')}</label>
            <input type="text" placeholder={t('upload.tagsPlaceholder')} value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              style={inputStyle}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button type="button" onClick={onClose}
              style={{
                padding: '9px 18px', backgroundColor: 'transparent', color: tokens.textSecondary,
                border: `1px solid ${tokens.borderMedium}`, borderRadius: '8px',
                fontSize: '14px', fontFamily: 'system-ui, Arial, sans-serif', cursor: 'pointer',
              }}
            >
              {t('upload.cancel')}
            </button>
            <button type="submit"
              style={{
                flex: 1, padding: '9px 18px', backgroundColor: tokens.brandTerracotta, color: '#faf9f5',
                border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: 500, fontFamily: 'system-ui, Arial, sans-serif', cursor: 'pointer',
              }}
            >
              {t('upload.next')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
