import { getSingletonHighlighter } from 'shiki';
import type { HighlighterGeneric, BundledLanguage, BundledTheme } from 'shiki';

type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>;

// Module-level singleton promise — initializes exactly once, shared across all components.
let _promise: Promise<Highlighter> | null = null;

export function getShikiHighlighter(): Promise<Highlighter> {
  if (!_promise) {
    _promise = getSingletonHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: [
        'javascript',
        'typescript',
        'tsx',
        'jsx',
        'python',
        'yaml',
        'json',
        'bash',
        'sh',
        'sql',
        'css',
        'html',
        'markdown',
        'text',
      ],
    });
  }
  return _promise;
}

const LANG_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
  md: 'markdown',
  py: 'python',
  plaintext: 'text',
};

export function normalizeLang(raw: string): BundledLanguage {
  const lower = raw.toLowerCase().trim();
  return (LANG_ALIASES[lower] ?? lower) as BundledLanguage;
}
