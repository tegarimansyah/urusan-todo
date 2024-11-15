import { Header } from '@/components/header';
import { SearchBar } from '@/components/search-bar';
import { TaskList } from '@/components/task-list';
import { TaskDetail } from '@/components/task-detail';
import { useTask } from '@/contexts/task-context';
import { useProfile } from '@/contexts/profile-context';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function MainLayout() {
  const { selectedTask } = useTask();
  const { profile, addRole } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <SearchBar />
          {selectedTask ? <TaskDetail /> : <TaskList />}
        </div>
      </main>
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
    </div>
  );
}
