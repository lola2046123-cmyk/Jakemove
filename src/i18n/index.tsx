import React, { createContext, useContext, useState, useCallback } from 'react';
import zhTranslations from '../locales/zh.json';
import enTranslations from '../locales/en.json';

export type Locale = 'zh' | 'en';

/** 仅当用户显式选择英文时写入；未设置或移除后一律为简体中文（zh-CN）。 */
const PREFER_EN_KEY = 'skilldock-prefer-en';
const LEGACY_LOCALE_KEY = 'skilldock-locale';

type TranslationDict = Record<string, unknown>;

const translations: Record<Locale, TranslationDict> = {
  zh: zhTranslations as TranslationDict,
  en: enTranslations as TranslationDict,
};

function getNestedValue(obj: TranslationDict, key: string): string {
  const parts = key.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || typeof current !== 'object') return key;
    current = (current as TranslationDict)[part];
  }
  return typeof current === 'string' ? current : key;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

interface I18nContextValue {
  locale: Locale;
  /** BCP 47，用于 `Intl`、无障碍等 */
  localeTag: 'zh-CN' | 'en-US';
  t: (key: string, vars?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'zh',
  localeTag: 'zh-CN',
  t: (key) => key,
  setLocale: () => {},
  toggleLocale: () => {},
});

function getInitialLocale(): Locale {
  try {
    localStorage.removeItem(LEGACY_LOCALE_KEY);
    if (localStorage.getItem(PREFER_EN_KEY) === '1') return 'en';
  } catch { /* SSR / private browsing */ }
  return 'zh';
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  /** 懒初始化，避免把函数误当作 state；默认 zh（中文），二级 en（英文） */
  const [locale, setLocaleState] = useState<Locale>(() => getInitialLocale());

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      if (next === 'en') localStorage.setItem(PREFER_EN_KEY, '1');
      else localStorage.removeItem(PREFER_EN_KEY);
    } catch { /* ignore */ }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'zh' ? 'en' : 'zh');
  }, [locale, setLocale]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const raw = getNestedValue(translations[locale], key);
      return interpolate(raw, vars);
    },
    [locale],
  );

  const localeTag: 'zh-CN' | 'en-US' = locale === 'zh' ? 'zh-CN' : 'en-US';

  return (
    <I18nContext.Provider value={{ locale, localeTag, t, setLocale, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useT = () => useContext(I18nContext);
