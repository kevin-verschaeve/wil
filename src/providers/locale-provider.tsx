import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { I18n, type TranslateOptions } from 'i18n-js';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { en } from '@/locales/en';
import { fr } from '@/locales/fr';

export type AppLocale = 'fr' | 'en';

const STORAGE_KEY = 'app.locale';

function deviceLocale(): AppLocale {
  const code = getLocales()[0]?.languageCode;
  return code === 'en' ? 'en' : 'fr';
}

interface LocaleContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (key: string, options?: TranslateOptions) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(deviceLocale());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'fr' || stored === 'en') setLocaleState(stored);
    });
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    const i18n = new I18n({ fr, en });
    i18n.defaultLocale = 'fr';
    i18n.enableFallback = true;
    i18n.locale = locale;
    return {
      locale,
      setLocale: (next) => {
        setLocaleState(next);
        AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      },
      t: (key, options) => i18n.t(key, options),
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

/** Shorthand for the translate function only. */
export function useT() {
  return useLocale().t;
}
