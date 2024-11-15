import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Settings {
  apiKey?: string;
  theme: 'light' | 'dark' | 'system';
}

interface SettingsStore {
  settings: Settings;
  draftSettings: Settings;
  updateDraft: (newSettings: Partial<Settings>) => void;
  saveSettings: () => void;
  revertSettings: () => void;
  resetToDefaults: () => void;
}

const defaultSettings: Settings = {
  theme: 'system'
};

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      draftSettings: defaultSettings,
      
      updateDraft: (newSettings) => 
        set((state) => ({
          draftSettings: { ...state.draftSettings, ...newSettings }
        })),
      
      saveSettings: () => 
        set((state) => ({
          settings: state.draftSettings
        })),
      
      revertSettings: () => 
        set((state) => ({
          draftSettings: state.settings
        })),
      
      resetToDefaults: () => 
        set((state) => ({
          draftSettings: state.settings
        }))
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({ settings: state.settings }), // Only persist the actual settings, not the draft
    }
  )
)

export default useSettingsStore 