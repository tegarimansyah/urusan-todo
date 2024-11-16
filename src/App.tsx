import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { RootLayout } from '@/layouts/root-layout';
import { Routes, Route } from 'react-router-dom';
import { Settings } from '@/pages/settings';
import { Profile } from '@/pages/profile';
import { IndexPage } from '@/pages/index';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useProfileStore from '@/stores/useProfileStore';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const { profile, addRole } = useProfileStore();

  useEffect(() => {
    if (profile.roles.filter((role) => role.archived === false).length === 0) {
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
      <RootLayout>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </RootLayout>
      <Toaster position="bottom-right" />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Your First Active Role</DialogTitle>
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
    </ThemeProvider>
  );
}

export default App;
