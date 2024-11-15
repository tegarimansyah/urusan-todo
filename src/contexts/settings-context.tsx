import { createContext, useContext, useEffect, useState } from 'react';

interface Settings {
  apiKey?: string;
  theme: 'light' | 'dark' | 'system';
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    theme: 'system',
  });

  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    };

    loadSettings();
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('settings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}