import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import useTaskStore from '@/stores/useTaskStore';
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
  const { 
    searchTasks, 
    createTask, 
    activities, 
    selectedActivity, 
    selectActivity, 
    createActivity 
  } = useTaskStore();
  
  const [newActivityName, setNewActivityName] = useState('');
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

  const handleCreateActivity = () => {
    if (newActivityName) {
      createActivity({ name: newActivityName });
      setNewActivityName('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="w-full sm:w-48">
        <Select 
          value={selectedActivity || 'all'} 
          onValueChange={(value) => {
            if (value === 'new') {
              setIsDialogOpen(true);
            } else {
              selectActivity(value === 'all' ? null : value);
            }
          }}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="All Activities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            {activities.map((activity) => (
              <SelectItem key={activity.id} value={activity.id}>
                {activity.name}
              </SelectItem>
            ))}
            <Separator className="my-2" />
            <SelectItem value="new" className="text-primary">
              <Plus className="h-4 w-4 mr-2 inline-block" />
              Create New Activity
            </SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Activity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activityName">Activity Name</Label>
                <Input
                  id="activityName"
                  value={newActivityName}
                  onChange={(e) => setNewActivityName(e.target.value)}
                  placeholder="Enter activity name"
                />
              </div>
              <Button onClick={handleCreateActivity} disabled={!newActivityName}>
                Create Activity
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
