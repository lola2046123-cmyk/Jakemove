import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../context/ThemeContext';
import { useSkills } from '../context/SkillContext';
import { useT } from '../i18n';
import type { ChopEntry } from '../types';
import ShikiBlock from './ShikiBlock';

interface Props {
  skillId: string;
}

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ChopCard: React.FC<{ chop: ChopEntry; skillId: string }> = ({ chop, skillId }) => {
  const { tokens, mode } = useTheme();
  const { likeChop } = useSkills();
  const { localeTag, t } = useT();
  const [liked, setLiked] = useState(false);
  const [cardHover, setCardHover] = useState(false);
  const [likeHover, setLikeHover] = useState(false);

  const handleLike = () => {
    if (!liked) { likeChop(skillId, chop.id); setLiked(true); }
  };

  const formattedDate = new Intl.DateTimeFormat(localeTag, { month: 'short', day: 'numeric', year: 'numeric' }).format(chop.createdAt);

  return (
    <div
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => setCardHover(false)}
      style={{
        backgroundColor: tokens.bgCard,
        border: `1px solid ${tokens.borderLight}`,
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '12px',
        boxShadow: cardHover
          ? (mode === 'dark'
              ? `0px 0px 0px 1px ${tokens.ringWarm}`
              : tokens.shadowWhisper)
          : 'none',
        transition: 'box-shadow 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div
          style={{
            width: '34px', height: '34px', borderRadius: '50%',
            backgroundColor: tokens.brandTerracotta + '30',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 600, color: tokens.brandTerracotta, flexShrink: 0,
            fontFamily: 'system-ui, Arial, sans-serif',
          }}
        >
          {chop.author.charAt(0)}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: tokens.textPrimary, fontFamily: 'system-ui, Arial, sans-serif' }}>{chop.author}</p>
          <p style={{ margin: 0, fontSize: '12px', color: tokens.textTertiary, fontFamily: 'system-ui, Arial, sans-serif' }}>{formattedDate}</p>
        </div>
      </div>

      <div style={{ fontSize: '16px', lineHeight: 1.6, color: tokens.textSecondary, fontFamily: 'system-ui, Arial, sans-serif' }}>
        <ReactMarkdown
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match && !className;
              if (isInline) {
                return (
                  <code style={{ backgroundColor: tokens.bgSand, color: tokens.brandTerracotta, padding: '1px 6px', borderRadius: '4px', fontFamily: "'SF Mono','Cascadia Code','Fira Code','Courier New',monospace", fontSize: '15px' }} {...props}>
                    {children}
                  </code>
                );
              }
              return (
                <ShikiBlock
                  code={String(children).replace(/\n$/, '')}
                  lang={match?.[1] ?? 'text'}
                  margin="10px 0"
                  fontSize="13px"
                />
              );
            },
            p({ children }) { return <p style={{ margin: '0 0 8px', color: tokens.textSecondary }}>{children}</p>; },
            strong({ children }) { return <strong style={{ color: tokens.textPrimary, fontWeight: 600 }}>{children}</strong>; },
          }}
        >
          {chop.content}
        </ReactMarkdown>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <button
          onClick={handleLike}
          onMouseEnter={() => setLikeHover(true)}
          onMouseLeave={() => setLikeHover(false)}
          aria-label={t('chops.likeCount', { n: chop.likes + (liked ? 1 : 0) })}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            border: 'none', background: liked ? 'transparent' : tokens.bgSand,
            cursor: liked ? 'default' : 'pointer',
            color: liked ? tokens.brandTerracotta : tokens.textTertiary,
            fontSize: '13px', fontFamily: 'system-ui, Arial, sans-serif',
            padding: '4px 8px', borderRadius: '6px',
            boxShadow: !liked && likeHover ? `0px 0px 0px 1px ${tokens.hoverRing}` : 'none',
            transition: 'color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
          }}
        >
          <HeartIcon filled={liked} />
          <span>{chop.likes + (liked ? 1 : 0)}</span>
        </button>
      </div>
    </div>
  );
};

const ChopsBoard: React.FC<Props> = ({ skillId }) => {
  const { tokens } = useTheme();
  const { getSkill, addChop } = useSkills();
  const { t } = useT();
  const skill = getSkill(skillId);
  const [newChop, setNewChop] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [preview, setPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [postHover, setPostHover] = useState(false);

  if (!skill) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChop.trim() || !authorName.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      addChop(skillId, newChop.trim(), authorName.trim());
      setNewChop('');
      setSubmitting(false);
    }, 300);
  };

  return (
    <section style={{ marginTop: '48px' }}>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', color: tokens.textTertiary, margin: '0 0 4px', fontFamily: 'system-ui, Arial, sans-serif' }}>
          {t('chops.overline')}
        </p>
        <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 500, color: tokens.textPrimary, fontFamily: 'Georgia, serif' }}>
          {t('chops.title')}
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: '15px', color: tokens.textSecondary, fontFamily: 'system-ui, Arial, sans-serif' }}>
          {t('chops.subtitle')}
        </p>
      </div>

      {skill.chops.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: tokens.bgCard, border: `1px solid ${tokens.borderLight}`, borderRadius: '12px', marginBottom: '24px' }}>
          <p style={{ fontSize: '28px', margin: '0 0 8px' }}>✍️</p>
          <p style={{ fontSize: '16px', fontFamily: 'Georgia, serif', color: tokens.textSecondary, margin: 0 }}>
            {t('chops.empty')}
          </p>
        </div>
      ) : (
        <div style={{ marginBottom: '24px' }}>
          {skill.chops.map(chop => <ChopCard key={chop.id} chop={chop} skillId={skillId} />)}
        </div>
      )}

      {/* Write new chop */}
      <div style={{ backgroundColor: tokens.bgCard, border: `1px solid ${tokens.borderLight}`, borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: 500, color: tokens.textPrimary, fontFamily: 'Georgia, serif' }}>
          {t('chops.addTitle')}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder={t('chops.namePlaceholder')}
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            style={{
              padding: '9px 14px',
              backgroundColor: tokens.bgInput,
              border: `1px solid ${tokens.borderMedium}`,
              borderRadius: '12px',
              fontSize: '14px',
              color: tokens.textPrimary,
              fontFamily: 'system-ui, Arial, sans-serif',
              outline: 'none',
            }}
          />

          {/* Write / Preview tabs */}
          <div style={{ display: 'flex', gap: '4px', borderBottom: `1px solid ${tokens.borderLight}`, paddingBottom: '0' }}>
            {[t('chops.write'), t('chops.preview')].map((tab, i) => {
              const isActive = preview ? i === 1 : i === 0;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPreview(i === 1)}
                  style={{
                    padding: '6px 14px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: isActive ? tokens.textPrimary : tokens.textTertiary,
                    borderBottom: isActive ? `2px solid ${tokens.brandTerracotta}` : '2px solid transparent',
                    fontFamily: 'system-ui, Arial, sans-serif',
                    marginBottom: '-1px',
                    transition: 'color 0.15s',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {preview ? (
            <div style={{ minHeight: '120px', padding: '12px', backgroundColor: tokens.bgCard, border: `1px solid ${tokens.borderLight}`, borderRadius: '12px', fontSize: '16px', lineHeight: 1.6, color: tokens.textSecondary, fontFamily: 'system-ui, Arial, sans-serif' }}>
              {newChop ? <ReactMarkdown>{newChop}</ReactMarkdown> : <span style={{ color: tokens.textTertiary, fontStyle: 'italic' }}>{t('chops.noPreview')}</span>}
            </div>
          ) : (
            <textarea
              placeholder={t('chops.placeholder')}
              value={newChop}
              onChange={e => setNewChop(e.target.value)}
              rows={5}
              style={{
                padding: '10px 14px',
                backgroundColor: tokens.bgInput,
                border: `1px solid ${tokens.borderMedium}`,
                borderRadius: '12px',
                fontSize: '16px',
                color: tokens.textPrimary,
                fontFamily: 'system-ui, Arial, sans-serif',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical',
              }}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={submitting || !newChop.trim() || !authorName.trim()}
              onMouseEnter={() => setPostHover(true)}
              onMouseLeave={() => setPostHover(false)}
              style={{
                padding: '9px 20px',
                backgroundColor: tokens.brandTerracotta,
                color: '#faf9f5',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'system-ui, Arial, sans-serif',
                cursor: submitting || !newChop.trim() || !authorName.trim() ? 'not-allowed' : 'pointer',
                opacity: submitting || !newChop.trim() || !authorName.trim() ? 0.6 : 1,
                boxShadow:
                  submitting || !newChop.trim() || !authorName.trim()
                    ? 'none'
                    : postHover
                      ? `0px 0px 0px 1px rgba(250,249,245,0.45)`
                      : `${tokens.brandTerracotta} 0px 0px 0px 0px, ${tokens.brandTerracotta} 0px 0px 0px 1px`,
                transition: 'opacity 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              {submitting ? t('chops.posting') : t('chops.post')}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ChopsBoard;
