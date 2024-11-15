import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { MainLayout } from '@/layouts/main-layout';
import { TaskProvider } from '@/contexts/task-context';
import { ProfileProvider } from '@/contexts/profile-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { Routes, Route } from 'react-router-dom';
import { Settings } from '@/pages/settings';
import { Profile } from '@/pages/profile';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <ProfileProvider>
      <SettingsProvider>
        <TaskProvider>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <Toaster position="bottom-right" />
        </TaskProvider>
      </SettingsProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}

export default App;