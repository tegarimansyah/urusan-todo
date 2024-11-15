import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTask } from '@/contexts/task-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export function SearchBar() {
  const { searchTasks, createTask, folders, selectedFolder, selectFolder, createFolder } = useTask();
  const [newFolderName, setNewFolderName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector('input');
    if (input?.value) {
      createTask({ title: input.value });
      input.value = '';
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName) {
      createFolder({ name: newFolderName });
      setNewFolderName('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="w-full sm:w-48">
        <Select 
          value={selectedFolder || 'all'} 
          onValueChange={(value) => {
            if (value === 'new') {
              setIsDialogOpen(true);
            } else {
              selectFolder(value === 'all' ? null : value);
            }
          }}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="All Folders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Folders</SelectItem>
            {folders.map((folder) => (
              <SelectItem key={folder.id} value={folder.id}>
                {folder.name}
              </SelectItem>
            ))}
            <Separator className="my-2" />
            <SelectItem value="new" className="text-primary">
              <Plus className="h-4 w-4 mr-2 inline-block" />
              Create New Folder
            </SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="folderName">Folder Name</Label>
                <Input
                  id="folderName"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                />
              </div>
              <Button onClick={handleCreateFolder} disabled={!newFolderName}>
                Create Folder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <form onSubmit={handleSubmit} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          className="pl-10 h-10"
          placeholder="Search tasks or create a new one..."
          onChange={(e) => searchTasks(e.target.value)}
        />
      </form>
    </div>
  );
}