import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../context/ThemeContext';
import { useSkills } from '../context/SkillContext';
import { useT } from '../i18n';
import ChopsBoard from './ChopsBoard';
import ShikiBlock from './ShikiBlock';

interface Props {
  skillId: string;
  onBack: () => void;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const TerminalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const AgentIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONO = "'SF Mono','Cascadia Code','Fira Code','Courier New',monospace";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── InstallPanel ─────────────────────────────────────────────────────────────

const InstallPanel: React.FC<{ skill: { name: string; manifesto: string }; onClose: () => void }> = ({ skill, onClose }) => {
  const { tokens, mode } = useTheme();
  const { t } = useT();

  const [cmdCopied, setCmdCopied] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  const slug = slugify(skill.name) || 'my-skill';
  const installCmd = `npx skills add ${slug}`;

  const copyCmd = () => {
    navigator.clipboard.writeText(installCmd).catch(() => {});
    setCmdCopied(true);
    setTimeout(() => setCmdCopied(false), 2000);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(skill.manifesto).catch(() => {});
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  const panelBg = tokens.bgCard;
  const codeBg = mode === 'dark' ? tokens.bgInput : tokens.bgSand;

  return (
    <div
      style={{
        marginTop: '16px',
        backgroundColor: panelBg,
        border: `1px solid ${tokens.borderMedium}`,
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Panel header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: `1px solid ${tokens.borderLight}`,
        backgroundColor: mode === 'dark' ? tokens.bgCardAlt : tokens.bgPage,
      }}>
        <span style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px',
          textTransform: 'uppercase', color: tokens.textTertiary,
          fontFamily: 'system-ui, Arial, sans-serif',
        }}>
          {t('detail.installTitle')}
        </span>
        <button
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            border: 'none', background: 'none', cursor: 'pointer',
            fontSize: '12px', color: tokens.textTertiary,
            fontFamily: 'system-ui, Arial, sans-serif', padding: '2px 4px',
          }}
        >
          <ChevronUpIcon />
          {t('detail.installClose')}
        </button>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Step 1 — terminal install */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span style={{
              width: '18px', height: '18px', borderRadius: '50%',
              backgroundColor: tokens.brandTerracotta,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', color: '#faf9f5', fontWeight: 700,
              fontFamily: 'system-ui, sans-serif', flexShrink: 0,
            }}>1</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: tokens.textSecondary, fontFamily: 'system-ui, Arial, sans-serif' }}>
              <TerminalIcon />
              {t('detail.installStep1')}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: codeBg,
            border: `1px solid ${tokens.borderLight}`,
            borderRadius: '6px',
            overflow: 'hidden',
          }}>
            <code style={{
              flex: 1,
              padding: '10px 14px',
              fontFamily: MONO,
              fontSize: '13px',
              color: tokens.textPrimary,
              userSelect: 'all',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {installCmd}
            </code>
            <button
              onClick={copyCmd}
              title="Copy command"
              style={{
                flexShrink: 0,
                padding: '10px 14px',
                border: 'none',
                borderLeft: `1px solid ${tokens.borderLight}`,
                backgroundColor: cmdCopied ? tokens.bgSand : 'transparent',
                color: cmdCopied ? tokens.brandTerracotta : tokens.textTertiary,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '12px',
                fontFamily: 'system-ui, Arial, sans-serif',
                transition: 'background-color 0.15s, color 0.15s',
              }}
            >
              {cmdCopied ? <CheckIcon /> : <CopyIcon />}
              {cmdCopied ? t('detail.installCopied') : null}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: tokens.borderLight }} />
          <span style={{ fontSize: '11px', color: tokens.textMuted, fontFamily: 'system-ui, Arial, sans-serif' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: tokens.borderLight }} />
        </div>

        {/* Step 2 — copy prompt for agent */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span style={{
              width: '18px', height: '18px', borderRadius: '50%',
              border: `1px solid ${tokens.borderMedium}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', color: tokens.textTertiary, fontWeight: 700,
              fontFamily: 'system-ui, sans-serif', flexShrink: 0,
            }}>2</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: tokens.textSecondary, fontFamily: 'system-ui, Arial, sans-serif' }}>
              <AgentIcon />
              {t('detail.installStep2')}
            </span>
          </div>

          <button
            onClick={copyPrompt}
            style={{
              width: '100%',
              padding: '10px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              backgroundColor: promptCopied ? tokens.bgSand : tokens.bgDarkSurface,
              color: promptCopied ? tokens.brandTerracotta : '#faf9f5',
              border: promptCopied ? `1px solid ${tokens.borderMedium}` : `1px solid ${tokens.bgDarkSurface}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: 'system-ui, Arial, sans-serif',
              transition: 'background-color 0.15s',
            }}
          >
            {promptCopied ? <CheckIcon /> : <CopyIcon />}
            {promptCopied ? t('detail.installCopied') : t('detail.copyManifesto')}
          </button>
        </div>

      </div>
    </div>
  );
};

// ─── SkillDetail ──────────────────────────────────────────────────────────────

const SkillDetail: React.FC<Props> = ({ skillId, onBack }) => {
  const { tokens } = useTheme();
  const { getSkill, copySkill } = useSkills();
  const { t, localeTag } = useT();
  const skill = getSkill(skillId);

  const [copied, setCopied] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [backHover, setBackHover] = useState(false);

  if (!skill) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: tokens.textTertiary, fontFamily: 'system-ui, Arial, sans-serif' }}>
        {t('detail.notFound')}
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(skill.manifesto).catch(() => {});
    copySkill(skill.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Intl.DateTimeFormat(localeTag, { month: 'long', day: 'numeric', year: 'numeric' }).format(skill.createdAt);

  return (
    <article>
      {/* Back button */}
      <button
        onClick={onBack}
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '7px 12px',
          backgroundColor: backHover ? tokens.bgCardAlt : tokens.bgSand,
          color: backHover ? tokens.textPrimary : tokens.textSecondary,
          border: `1px solid ${tokens.borderMedium}`, borderRadius: '8px',
          cursor: 'pointer', fontSize: '14px', fontWeight: 500,
          fontFamily: 'system-ui, Arial, sans-serif', marginBottom: '28px',
          boxShadow: backHover ? `0px 0px 0px 1px ${tokens.hoverRing}` : `0px 0px 0px 1px ${tokens.ringWarm}`,
          transition: 'color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        <BackIcon />
        {t('detail.back')}
      </button>

      {/* Header */}
      <header style={{ marginBottom: '32px' }}>
        {/* Tool / Model / Tags pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ padding: '4px 10px', backgroundColor: tokens.brandTerracotta + '18', color: tokens.brandTerracotta, borderRadius: '6px', fontSize: '13px', fontWeight: 500, fontFamily: 'system-ui, Arial, sans-serif', border: `1px solid ${tokens.brandTerracotta}30` }}>
            {skill.tool}
          </span>
          <span style={{ padding: '4px 10px', backgroundColor: tokens.bgSand, color: tokens.textTertiary, borderRadius: '6px', fontSize: '13px', fontFamily: 'system-ui, Arial, sans-serif' }}>
            {skill.targetModel}
          </span>
          {skill.tags.map(tag => (
            <span key={tag} style={{ padding: '4px 10px', backgroundColor: tokens.bgSand, color: tokens.textTertiary, borderRadius: '24px', fontSize: '12px', fontFamily: 'system-ui, Arial, sans-serif' }}>
              {tag}
            </span>
          ))}
        </div>

        <h1 style={{ margin: '0 0 12px', fontSize: '36px', fontWeight: 500, color: tokens.textPrimary, fontFamily: 'Georgia, serif', lineHeight: 1.2 }}>
          {skill.name}
        </h1>
        <p style={{ margin: '0 0 20px', fontSize: '17px', color: tokens.textSecondary, fontFamily: 'system-ui, Arial, sans-serif', lineHeight: 1.6 }}>
          {skill.description}
        </p>

        {/* Author · stats row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: tokens.brandTerracotta + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: tokens.brandTerracotta, fontFamily: 'system-ui, Arial, sans-serif' }}>
              {skill.author.charAt(0)}
            </div>
            <span style={{ fontSize: '14px', color: tokens.textSecondary, fontFamily: 'system-ui, Arial, sans-serif' }}>
              {skill.author} · {formattedDate}
            </span>
          </div>
          <span style={{ fontSize: '14px', color: tokens.textTertiary, fontFamily: 'system-ui, Arial, sans-serif' }}>
            {skill.copies} {t('detail.copies')} · {skill.chops.length} {t('detail.chops')}
          </span>
        </div>

        {/* ── Action buttons — Install (primary) + Copy (secondary) ── */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* Install Skill — primary */}
          <button
            onClick={() => setShowInstall(v => !v)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 18px',
              backgroundColor: showInstall ? tokens.bgSand : tokens.bgDarkSurface,
              color: showInstall ? tokens.textSecondary : '#faf9f5',
              border: showInstall ? `1px solid ${tokens.borderMedium}` : `1px solid ${tokens.bgDarkSurface}`,
              borderRadius: '8px',
              cursor: 'pointer', fontSize: '14px', fontWeight: 500,
              fontFamily: 'system-ui, Arial, sans-serif',
              transition: 'background-color 0.15s, color 0.15s',
            }}
          >
            {showInstall ? <ChevronUpIcon /> : <DownloadIcon />}
            {showInstall ? t('detail.installClose') : t('detail.install')}
          </button>

          {/* Copy Manifest — secondary */}
          <button
            onClick={handleCopy}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 18px',
              backgroundColor: tokens.bgSand,
              color: copied ? tokens.brandTerracotta : tokens.textSecondary,
              border: `1px solid ${copied ? tokens.brandTerracotta : tokens.borderMedium}`,
              borderRadius: '8px',
              cursor: 'pointer', fontSize: '14px', fontWeight: 500,
              fontFamily: 'system-ui, Arial, sans-serif',
              transition: 'all 0.15s ease',
            }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? t('detail.copied') : t('detail.copyManifesto')}
          </button>
        </div>

        {/* Install panel — expands below buttons */}
        {showInstall && (
          <InstallPanel
            skill={skill}
            onClose={() => setShowInstall(false)}
          />
        )}
      </header>

      {/* Preview image */}
      {skill.previewImage && (
        <div style={{ marginBottom: '32px' }}>
          <img
            src={skill.previewImage}
            alt={`${skill.name} preview`}
            style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '16px', border: `1px solid ${tokens.borderLight}` }}
          />
        </div>
      )}

      {/* Manifesto */}
      <section>
        <h2 style={{ margin: '0 0 16px', fontSize: '20px', fontWeight: 500, color: tokens.textPrimary, fontFamily: 'Georgia, serif' }}>
          {t('detail.manifesto')}
        </h2>
        <div style={{ backgroundColor: tokens.bgCard, border: `1px solid ${tokens.borderLight}`, borderRadius: '12px', padding: '24px', fontSize: '15px', lineHeight: 1.7, color: tokens.textSecondary, fontFamily: 'system-ui, Arial, sans-serif' }}>
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match && !className;
                if (isInline) {
                  return (
                    <code style={{ backgroundColor: tokens.bgSand, color: tokens.brandTerracotta, padding: '2px 6px', borderRadius: '4px', fontFamily: "'Courier New', monospace", fontSize: '14px' }} {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <ShikiBlock code={String(children).replace(/\n$/, '')} lang={match?.[1] ?? 'text'} fontSize="14px" />
                );
              },
              h1({ children }) { return <h1 style={{ fontSize: '24px', fontWeight: 500, color: tokens.textPrimary, fontFamily: 'Georgia, serif', margin: '0 0 12px', lineHeight: 1.3 }}>{children}</h1>; },
              h2({ children }) { return <h2 style={{ fontSize: '19px', fontWeight: 500, color: tokens.textPrimary, fontFamily: 'Georgia, serif', margin: '20px 0 8px', lineHeight: 1.3 }}>{children}</h2>; },
              h3({ children }) { return <h3 style={{ fontSize: '16px', fontWeight: 600, color: tokens.textPrimary, fontFamily: 'system-ui, Arial, sans-serif', margin: '16px 0 6px' }}>{children}</h3>; },
              p({ children }) { return <p style={{ margin: '0 0 10px', color: tokens.textSecondary }}>{children}</p>; },
              ul({ children }) { return <ul style={{ paddingLeft: '20px', margin: '0 0 10px', color: tokens.textSecondary }}>{children}</ul>; },
              ol({ children }) { return <ol style={{ paddingLeft: '20px', margin: '0 0 10px', color: tokens.textSecondary }}>{children}</ol>; },
              li({ children }) { return <li style={{ marginBottom: '4px' }}>{children}</li>; },
              strong({ children }) { return <strong style={{ color: tokens.textPrimary, fontWeight: 600 }}>{children}</strong>; },
              blockquote({ children }) {
                return (
                  <blockquote style={{ borderLeft: `3px solid ${tokens.brandTerracotta}`, paddingLeft: '16px', margin: '12px 0', color: tokens.textTertiary, fontStyle: 'italic' }}>
                    {children}
                  </blockquote>
                );
              },
            }}
          >
            {skill.manifesto}
          </ReactMarkdown>
        </div>
      </section>

      {/* Chops Board */}
      <ChopsBoard skillId={skillId} />
    </article>
  );
};

export default SkillDetail;
