import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSkills } from '../context/SkillContext';
import { useT } from '../i18n';

const Leaderboard: React.FC = () => {
  const { tokens } = useTheme();
  const { members } = useSkills();
  const { t } = useT();
  const top5 = members.slice(0, 5);
  const medals = ['🥇', '🥈', '🥉', t('leaderboard.rank4'), t('leaderboard.rank5')];

  return (
    <aside
      style={{
        backgroundColor: tokens.bgCard,
        border: `1px solid ${tokens.borderLight}`,
        borderRadius: '12px',
        padding: '20px',
        boxShadow: 'none',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <p
          style={{
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            color: tokens.textTertiary,
            margin: 0,
            fontFamily: 'system-ui, Arial, sans-serif',
          }}
        >
          {t('leaderboard.overline')}
        </p>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 500,
            color: tokens.textPrimary,
            margin: '4px 0 0',
            fontFamily: 'Georgia, serif',
            lineHeight: 1.3,
          }}
        >
          {t('leaderboard.title')}
        </h3>
      </div>

      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {top5.map((member, i) => (
          <li
            key={member.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 0',
              borderBottom: i < 4 ? `1px solid ${tokens.borderLight}` : 'none',
            }}
          >
            <span
              style={{
                fontSize: i < 3 ? '16px' : '12px',
                width: '24px',
                textAlign: 'center',
                color: i >= 3 ? tokens.textTertiary : undefined,
                fontFamily: 'system-ui, Arial, sans-serif',
              }}
            >
              {medals[i]}
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: `hsl(${(i * 67 + 15) % 360}, 38%, 68%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 600,
                color: tokens.textPrimary,
                flexShrink: 0,
                fontFamily: 'system-ui, Arial, sans-serif',
              }}
            >
              {member.name.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: tokens.textPrimary, fontFamily: 'system-ui, Arial, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {member.name}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: tokens.textTertiary, fontFamily: 'system-ui, Arial, sans-serif' }}>
                {t('leaderboard.skillsCount', { n: member.contributions })}
              </p>
            </div>
            <div
              style={{
                padding: '2px 8px',
                backgroundColor: i === 0 ? tokens.brandTerracotta : tokens.bgSand,
                color: i === 0 ? '#faf9f5' : tokens.textSecondary,
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                fontFamily: 'system-ui, Arial, sans-serif',
              }}
            >
              #{member.rank}
            </div>
          </li>
        ))}
      </ol>

      <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: `1px solid ${tokens.borderLight}`, textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: tokens.textTertiary, margin: 0, fontFamily: 'system-ui, Arial, sans-serif' }}>
          {t('leaderboard.footer')}
        </p>
      </div>
    </aside>
  );
};

export default Leaderboard;
