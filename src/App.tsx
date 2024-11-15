import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { MainLayout } from '@/layouts/main-layout';
import { TaskProvider } from '@/contexts/task-context';
import { ProfileProvider, useProfile } from '@/contexts/profile-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { Routes, Route } from 'react-router-dom';
import { Settings } from '@/pages/settings';
import { Profile } from '@/pages/profile';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const { profile, addRole } = useProfile();

  useEffect(() => {
    if (profile.roles.length === 0) {
      setIsModalOpen(true);
    }
  }, [profile.roles]);

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      addRole(newRoleName.trim());
      setNewRoleName('');
      setIsModalOpen(false);
    }
  };

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
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a Role</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Enter role name"
                  />
                  <Button onClick={handleAddRole} disabled={!newRoleName.trim()}>
                    Add Role
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TaskProvider>
        </SettingsProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}

export default App;
