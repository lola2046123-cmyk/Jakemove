import { useState } from 'react';
import { useTheme } from './context/ThemeContext';
import { useT } from './i18n';
import type { Tokens } from './theme/tokens';
import Navbar from './components/Navbar';
import DiscoveryGrid from './components/DiscoveryGrid';
import UploadModal from './components/UploadModal';
import Editor from './components/Editor';
import SkillDetail from './components/SkillDetail';
import Leaderboard from './components/Leaderboard';
import type { EditorDraft } from './types';

type View = 'grid' | 'detail';

/** Single source of truth for the two-step upload flow (modal ↔ editor). */
interface UploadSession {
  draft: EditorDraft;
  manifesto: string;
  chopNote: string;
}

// ─── 2.5D Floating Illustrations ─────────────────────────────────────────────

const FLOAT_CSS = `
@keyframes skillFloat1 {
  0%,100% { transform: rotate(-8deg) translateY(0px); }
  50%      { transform: rotate(-8deg) translateY(-12px); }
}
@keyframes skillFloat2 {
  0%,100% { transform: rotate(6deg) translateY(-6px); }
  50%      { transform: rotate(6deg) translateY(6px); }
}
@keyframes skillFloat3 {
  0%,100% { transform: rotate(9deg) translateY(0px); }
  50%      { transform: rotate(9deg) translateY(-10px); }
}
@keyframes skillFloat4 {
  0%,100% { transform: rotate(-5deg) translateY(-4px); }
  50%      { transform: rotate(-5deg) translateY(8px); }
}
.sf1 { animation: skillFloat1 4.8s ease-in-out infinite; }
.sf2 { animation: skillFloat2 5.6s ease-in-out infinite 0.9s; }
.sf3 { animation: skillFloat3 5.2s ease-in-out infinite 0.4s; }
.sf4 { animation: skillFloat4 4.4s ease-in-out infinite 1.5s; }
@media (max-width: 860px) { .hero-illo { display: none !important; } }
`;

const IlloSkillCard = ({ tokens, dark }: { tokens: Tokens; dark: boolean }) => {
  const fc = dark ? tokens.bgCard : tokens.bgPage;
  const fd = dark ? tokens.bgPage : tokens.bgSand;
  const sk = tokens.textSecondary;
  return (
    <svg width="114" height="134" viewBox="0 0 114 134" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* depth shadow */}
      <rect x="9" y="9" width="98" height="120" fill={fd} />
      {/* card face */}
      <rect x="4" y="4" width="98" height="120" fill={fc} stroke={sk} strokeWidth="1" />
      {/* header strip */}
      <rect x="4" y="4" width="98" height="26" fill={tokens.brandTerracotta} fillOpacity="0.13" />
      <line x1="4" y1="30" x2="102" y2="30" stroke={sk} strokeWidth="1" />
      {/* traffic dots */}
      <circle cx="17" cy="17" r="4.5" fill={tokens.brandTerracotta} fillOpacity="0.55" />
      <circle cx="30" cy="17" r="4.5" fill={sk} fillOpacity="0.3" />
      {/* title line */}
      <line x1="44" y1="13" x2="88" y2="13" stroke={sk} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="44" y1="21" x2="76" y2="21" stroke={sk} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.5" />
      {/* content lines */}
      <line x1="14" y1="44" x2="90" y2="44" stroke={sk} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.45" />
      <line x1="14" y1="56" x2="82" y2="56" stroke={sk} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.38" />
      <line x1="14" y1="68" x2="86" y2="68" stroke={sk} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.32" />
      <line x1="14" y1="80" x2="62" y2="80" stroke={sk} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.26" />
      {/* tag badge */}
      <rect x="14" y="94" width="34" height="14" rx="7" fill="none" stroke={tokens.brandTerracotta} strokeWidth="0.9" strokeOpacity="0.6" />
      <line x1="21" y1="101" x2="41" y2="101" stroke={tokens.brandTerracotta} strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.6" />
      {/* copy button */}
      <rect x="56" y="92" width="44" height="18" fill={tokens.brandTerracotta} fillOpacity="0.12" stroke={tokens.brandTerracotta} strokeWidth="0.9" strokeOpacity="0.55" />
      <line x1="63" y1="101" x2="93" y2="101" stroke={tokens.brandTerracotta} strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.7" />
    </svg>
  );
};

const IlloTerminal = ({ tokens, dark }: { tokens: Tokens; dark: boolean }) => {
  const fd = dark ? tokens.bgCard : tokens.bgDarkSurface;
  const fh = dark ? tokens.bgPage : tokens.textPrimary;
  const sk = tokens.textSecondary;
  return (
    <svg width="128" height="96" viewBox="0 0 128 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* shadow — 暖黑半透明，对齐 Near Black */}
      <rect x="7" y="7" width="116" height="84" fill="rgba(20,20,19,0.16)" />
      {/* window */}
      <rect x="2" y="2" width="116" height="84" fill={fd} stroke={sk} strokeWidth="1" />
      {/* title bar */}
      <rect x="2" y="2" width="116" height="20" fill={fh} />
      <line x1="2" y1="22" x2="118" y2="22" stroke={sk} strokeWidth="0.8" strokeOpacity="0.5" />
      {/* dots */}
      <circle cx="16" cy="12" r="4" fill={tokens.brandTerracotta} fillOpacity="0.65" />
      <circle cx="29" cy="12" r="4" fill={tokens.brandCoral} fillOpacity="0.55" />
      <circle cx="42" cy="12" r="4" fill={tokens.textTertiary} fillOpacity="0.55" />
      {/* prompt symbol */}
      <text x="14" y="38" fill={tokens.brandTerracotta} fontSize="10" fontFamily="monospace" fillOpacity="0.85">$</text>
      <line x1="24" y1="34" x2="80" y2="34" stroke={tokens.brandTerracotta} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.75" />
      <line x1="14" y1="46" x2="92" y2="46" stroke={tokens.textTertiary} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.55" />
      <line x1="14" y1="58" x2="72" y2="58" stroke={tokens.brandCoral} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.65" />
      <line x1="14" y1="70" x2="48" y2="70" stroke={tokens.textSecondary} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.55" />
      {/* blinking cursor */}
      <rect x="50" y="64" width="7" height="10" fill={tokens.textTertiary} fillOpacity="0.55" />
    </svg>
  );
};

const IlloPromptBubble = ({ tokens, dark }: { tokens: Tokens; dark: boolean }) => {
  const fc = tokens.bgCard;
  const fd = dark ? tokens.bgPage : tokens.bgSand;
  const sk = tokens.textSecondary;
  return (
    <svg width="120" height="106" viewBox="0 0 120 106" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* shadow */}
      <path d="M11 9 L109 9 Q114 9 114 14 L114 76 Q114 81 109 81 L46 81 L34 96 L34 81 L11 81 Q6 81 6 76 L6 14 Q6 9 11 9 Z" fill={fd} transform="translate(3,3)" />
      {/* bubble */}
      <path d="M10 8 L108 8 Q113 8 113 13 L113 75 Q113 80 108 80 L45 80 L33 95 L33 80 L10 80 Q5 80 5 75 L5 13 Q5 8 10 8 Z" fill={fc} stroke={sk} strokeWidth="1" />
      {/* sparkle */}
      <path d="M96 19 L98.5 13 L101 19 L107 16.5 L101 19 L98.5 25 L96 19 Z" fill="none" stroke={tokens.brandTerracotta} strokeWidth="0.9" strokeOpacity="0.65" />
      {/* text lines */}
      <line x1="18" y1="24" x2="84" y2="24" stroke={sk} strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.5" />
      <line x1="18" y1="36" x2="96" y2="36" stroke={sk} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
      <line x1="18" y1="48" x2="88" y2="48" stroke={sk} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.35" />
      <line x1="18" y1="60" x2="68" y2="60" stroke={sk} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.28" />
      {/* inline code chip */}
      <rect x="18" y="68" width="36" height="8" fill={tokens.brandTerracotta} fillOpacity="0.15" stroke={tokens.brandTerracotta} strokeWidth="0.8" strokeOpacity="0.5" />
    </svg>
  );
};

const IlloAvatarCard = ({ tokens, dark }: { tokens: Tokens; dark: boolean }) => {
  const fc = tokens.bgCard;
  const fd = dark ? tokens.bgPage : tokens.bgSand;
  const sk = tokens.textSecondary;
  return (
    <svg width="108" height="96" viewBox="0 0 108 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* shadow */}
      <rect x="8" y="8" width="94" height="82" fill={fd} />
      {/* card */}
      <rect x="3" y="3" width="94" height="82" fill={fc} stroke={sk} strokeWidth="1" />
      {/* avatar circle */}
      <circle cx="54" cy="36" r="20" fill={tokens.brandTerracotta} fillOpacity="0.1" stroke={tokens.brandTerracotta} strokeWidth="1" strokeOpacity="0.45" />
      {/* person head */}
      <circle cx="54" cy="29" r="7" fill="none" stroke={tokens.brandTerracotta} strokeWidth="1" strokeOpacity="0.55" />
      {/* person shoulders */}
      <path d="M36 52 Q45 44 54 44 Q63 44 72 52" fill="none" stroke={tokens.brandTerracotta} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.55" />
      {/* name lines */}
      <line x1="30" y1="62" x2="78" y2="62" stroke={sk} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
      <line x1="36" y1="70" x2="72" y2="70" stroke={sk} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.35" />
      {/* status dots */}
      <circle cx="40" cy="80" r="3.5" fill={tokens.brandTerracotta} fillOpacity="0.4" stroke={tokens.brandTerracotta} strokeWidth="0.8" strokeOpacity="0.45" />
      <circle cx="54" cy="80" r="3.5" fill={sk} fillOpacity="0.3" stroke={sk} strokeWidth="0.8" strokeOpacity="0.4" />
      <circle cx="68" cy="80" r="3.5" fill={tokens.brandCoral} fillOpacity="0.3" stroke={tokens.textTertiary} strokeWidth="0.8" strokeOpacity="0.4" />
    </svg>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const { tokens, mode } = useTheme();
  const dark = mode === 'dark';
  const { t } = useT();
  const [view, setView] = useState<View>('grid');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [uploadSession, setUploadSession] = useState<UploadSession | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const openUploadFlow = () => {
    if (!uploadSession) {
      setUploadSession({
        draft: {
          name: '',
          tool: 'Cursor',
          targetModel: 'Sonnet 4.6',
          description: '',
          tags: '',
        },
        manifesto: '',
        chopNote: '',
      });
    }
    setUploadModalOpen(true);
  };

  const abortUploadFlow = () => {
    setUploadModalOpen(false);
    setUploadSession(null);
  };

  const goToEditorFromModal = (draft: EditorDraft) => {
    setUploadSession(prev => ({
      draft,
      manifesto: prev?.manifesto ?? '',
      chopNote: prev?.chopNote ?? '',
    }));
    setUploadModalOpen(false);
  };

  const showEditor = uploadSession !== null && !uploadModalOpen;

  const handleSelectSkill = (id: string) => {
    setSelectedSkillId(id);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setView('grid');
    setSelectedSkillId(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: tokens.bgPage,
        color: tokens.textPrimary,
        transition: 'background-color 0.25s ease, color 0.25s ease',
      }}
    >
      {/* Extracted Navbar component */}
      <Navbar
        view={view}
        onLogoClick={handleBack}
        onShareClick={openUploadFlow}
      />

      {/* Float animation keyframes */}
      <style>{FLOAT_CSS}</style>

      {/* Hero banner — grid view only */}
      {view === 'grid' && (
        <div
          style={{
            backgroundColor: tokens.bgCardAlt,
            borderBottom: `1px solid ${tokens.borderLight}`,
            padding: '56px 32px',
            transition: 'background-color 0.25s ease',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              maxWidth: '1120px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '1fr minmax(0, 440px) 1fr',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {/* ── Left illustrations ── */}
            <div
              className="hero-illo"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '28px', paddingRight: '8px' }}
            >
              <div className="sf1" style={{ opacity: 0.92 }}>
                <IlloSkillCard tokens={tokens} dark={dark} />
              </div>
              <div className="sf2" style={{ opacity: 0.85, marginRight: '24px' }}>
                <IlloTerminal tokens={tokens} dark={dark} />
              </div>
            </div>

            {/* ── Center text ── */}
            <div style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontSize: '11px', fontWeight: 600, letterSpacing: '0.6px',
                  textTransform: 'uppercase', color: tokens.brandTerracotta,
                  margin: '0 0 14px', fontFamily: 'system-ui, Arial, sans-serif',
                }}
              >
                {t('hero.overline')}
              </p>
              <h1
                style={{
                  margin: '0 0 16px',
                  fontSize: 'clamp(28px, 4.5vw, 48px)',
                  fontWeight: 500, color: tokens.textPrimary,
                  fontFamily: 'Georgia, serif', lineHeight: 1.12,
                }}
              >
                {t('hero.title')}
              </h1>
              <p
                style={{
                  margin: '0 0 28px', fontSize: '16px',
                  color: tokens.textSecondary,
                  fontFamily: 'system-ui, Arial, sans-serif', lineHeight: 1.55,
                  maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto',
                }}
              >
                {t('hero.subtitle')}
              </p>
              <button
                onClick={openUploadFlow}
                style={{
                  padding: '10px 24px',
                  backgroundColor: tokens.brandTerracotta,
                  color: '#faf9f5', border: 'none',
                  cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                  fontFamily: 'system-ui, Arial, sans-serif',
                  letterSpacing: '0.2px', borderRadius: '10px',
                }}
              >
                {t('hero.cta')}
              </button>
            </div>

            {/* ── Right illustrations ── */}
            <div
              className="hero-illo"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '28px', paddingLeft: '8px' }}
            >
              <div className="sf3" style={{ opacity: 0.9, marginLeft: '20px' }}>
                <IlloPromptBubble tokens={tokens} dark={dark} />
              </div>
              <div className="sf4" style={{ opacity: 0.88 }}>
                <IlloAvatarCard tokens={tokens} dark={dark} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main layout — two-column on grid view */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '32px 24px 80px',
          display: 'grid',
          gridTemplateColumns: view === 'grid' ? '1fr 280px' : '1fr',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        <main>
          {view === 'grid' ? (
            <DiscoveryGrid onSelectSkill={handleSelectSkill} />
          ) : selectedSkillId ? (
            <SkillDetail skillId={selectedSkillId} onBack={handleBack} />
          ) : null}
        </main>

        {view === 'grid' && (
          <aside style={{ position: 'sticky', top: '80px' }}>
            <Leaderboard />
          </aside>
        )}
      </div>

      {/* Step 1 — Metadata modal (Manifest 不在此填写，见下一步 Editor) */}
      {uploadModalOpen && uploadSession && (
        <UploadModal
          onClose={abortUploadFlow}
          onNext={goToEditorFromModal}
          initialDraft={uploadSession.draft}
        />
      )}

      {/* Step 2 — Manifest + Chops 全屏编辑器；状态与弹窗通过 uploadSession 联动 */}
      {showEditor && uploadSession && (
        <Editor
          draft={uploadSession.draft}
          manifesto={uploadSession.manifesto}
          chopNote={uploadSession.chopNote}
          onManifestoChange={v => setUploadSession(s => (s ? { ...s, manifesto: v } : s))}
          onChopNoteChange={v => setUploadSession(s => (s ? { ...s, chopNote: v } : s))}
          onBack={() => setUploadModalOpen(true)}
          onPublished={abortUploadFlow}
        />
      )}
    </div>
  );
}

export default App;
