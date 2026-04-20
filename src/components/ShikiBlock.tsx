import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getShikiHighlighter, normalizeLang } from '../lib/shiki';

interface Props {
  code: string;
  lang: string;
  /** Extra margin override, default '12px 0' */
  margin?: string;
  /** Font size override, default '13.5px' */
  fontSize?: string;
}

const MONO_STACK = "'SF Mono','Cascadia Code','Fira Code','Courier New',monospace";

const ShikiBlock: React.FC<Props> = ({
  code,
  lang,
  margin = '12px 0',
  fontSize = '13.5px',
}) => {
  const { tokens, mode } = useTheme();
  const [html, setHtml] = useState<string | null>(null);

  // Parchment for light (#f5f4ed), dark card for dark (#1e1e1c).
  const bgColor = mode === 'dark' ? tokens.bgCard : tokens.bgPage;
  const borderColor = tokens.borderLight;
  const theme = mode === 'dark' ? 'github-dark' : 'github-light';

  useEffect(() => {
    let cancelled = false;
    const normalizedLang = normalizeLang(lang);

    const sharedPreStyle =
      `background-color:${bgColor};margin:0;padding:16px 20px;overflow-x:auto;` +
      `font-size:${fontSize};line-height:1.65;font-family:${MONO_STACK};tab-size:2;`;

    const highlight = (targetLang: string) =>
      getShikiHighlighter().then(hl =>
        hl.codeToHtml(code, {
          lang: targetLang as ReturnType<typeof normalizeLang>,
          theme,
          transformers: [
            {
              // Override shiki's default white background and inject design-system values.
              pre(node) {
                node.properties['style'] = sharedPreStyle;
              },
            },
          ],
        }),
      );

    highlight(normalizedLang)
      .catch(() => highlight('text'))
      .then(result => {
        if (!cancelled) setHtml(result);
      })
      .catch(() => {
        if (!cancelled) setHtml(null);
      });

    return () => {
      cancelled = true;
    };
    // Re-highlight when code, lang, or theme changes.
    // bgColor / fontSize are stable per render; include them so a theme switch refreshes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, lang, mode, bgColor, fontSize]);

  // Plain-text fallback rendered immediately while shiki loads (avoids layout shift).
  if (!html) {
    return (
      <pre
        style={{
          backgroundColor: bgColor,
          color: tokens.textSecondary,
          border: `1px solid ${borderColor}`,
          borderRadius: 0,
          margin,
          padding: '16px 20px',
          fontSize,
          lineHeight: 1.65,
          fontFamily: MONO_STACK,
          overflowX: 'auto',
          whiteSpace: 'pre',
        }}
      >
        <code style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{code}</code>
      </pre>
    );
  }

  return (
    <>
      {/*
       * Scoped reset: undo browser default margin/padding on the <pre> shiki renders.
       * The transformer already sets padding via inline style; this just provides safety.
       */}
      <style>{`
        .sd-shiki pre.shiki { margin: 0; }
        .sd-shiki pre.shiki code { font-family: inherit; font-size: inherit; background: none; }
      `}</style>
      <div
        className="sd-shiki"
        style={{
          border: `1px solid ${borderColor}`,
          borderRadius: 0,      /* STRICT: no rounded corners per design spec */
          margin,
          overflow: 'hidden',   /* clip the scrollable <pre> cleanly */
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
};

export default ShikiBlock;
