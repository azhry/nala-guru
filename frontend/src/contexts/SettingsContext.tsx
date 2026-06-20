import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const DEFAULT_PIN = '1234';
const STORAGE_KEY_MUTED = 'baby-math-muted';
const STORAGE_KEY_HIGH_CONTRAST = 'baby-math-high-contrast';
const STORAGE_KEY_PIN = 'baby-math-pin';
const STORAGE_KEY_LOCALE = 'baby-math-locale';

export type Locale = 'en' | 'id';

interface SettingsContextValue {
  muted: boolean;
  toggleMute: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  locale: Locale;
  toggleLocale: () => void;
  pin: string | null;
  setPin: (pin: string) => void;
  clearPin: () => void;
  validatePin: (input: string) => boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(() => localStorage.getItem(STORAGE_KEY_MUTED) === 'true');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem(STORAGE_KEY_HIGH_CONTRAST) === 'true');
  const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem(STORAGE_KEY_LOCALE) === 'id' ? 'id' : 'en'));
  const [pin, setPinState] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY_PIN));

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY_MUTED, String(next));
      return next;
    });
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY_HIGH_CONTRAST, String(next));
      return next;
    });
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next: Locale = prev === 'en' ? 'id' : 'en';
      localStorage.setItem(STORAGE_KEY_LOCALE, next);
      return next;
    });
  }, []);

  const setPin = useCallback((newPin: string) => {
    localStorage.setItem(STORAGE_KEY_PIN, newPin);
    setPinState(newPin);
  }, []);

  const clearPin = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_PIN);
    setPinState(null);
  }, []);

  const validatePin = useCallback((input: string) => input === DEFAULT_PIN, []);

  return (
    <SettingsContext.Provider value={{ muted, toggleMute, highContrast, toggleHighContrast, locale, toggleLocale, pin, setPin, clearPin, validatePin }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
