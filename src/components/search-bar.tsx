import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import useTaskStore from '@/stores/useTaskStore';
import useProfileStore from '@/stores/useProfileStore';
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export function SearchBar() {
  const { 
    searchTasks, 
    createTask, 
    activities,
    selectedActivity, 
    selectActivity, 
    createActivity 
  } = useTaskStore();
  const { profile } = useProfileStore();
  
  const [newActivity, setNewActivity] = useState({
    name: '',
    roleId: '',
    notes: '',
    isComplex: true,
    isRemarkable: false,
    isRepetitive: false,
  });
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
    if (newActivity.name && newActivity.roleId) {
      createActivity(newActivity);
      setNewActivity({
        name: '',
        roleId: '',
        notes: '',
        isComplex: true,
        isRemarkable: false,
        isRepetitive: false,
      });
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Activity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activityName">Activity Name</Label>
                <Input
                  id="activityName"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                  placeholder="Enter activity name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleId">Role</Label>
                <Select
                  value={newActivity.roleId}
                  onValueChange={(value) => setNewActivity({ ...newActivity, roleId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {profile.roles
                      .filter(role => !role.archived)
                      .map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newActivity.notes}
                  onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                  placeholder="Add any notes about this activity"
                />
              </div>

              <RadioGroup
                value={newActivity.isComplex ? "complex" : "simple"}
                onValueChange={(value) => 
                  setNewActivity({ ...newActivity, isComplex: value === "complex" })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="simple" id="simple" />
                  <Label htmlFor="simple">Simple</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="complex" id="complex" />
                  <Label htmlFor="complex">Complex</Label>
                </div>
              </RadioGroup>

              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remarkable"
                    checked={newActivity.isRemarkable}
                    onCheckedChange={(checked) => 
                      setNewActivity({ ...newActivity, isRemarkable: checked as boolean })
                    }
                  />
                  <Label htmlFor="remarkable">Remarkable</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="repetitive"
                    checked={newActivity.isRepetitive}
                    onCheckedChange={(checked) => 
                      setNewActivity({ ...newActivity, isRepetitive: checked as boolean })
                    }
                  />
                  <Label htmlFor="repetitive">Repetitive</Label>
                </div>
              </div>

              <Button 
                onClick={handleCreateActivity} 
                disabled={!newActivity.name || !newActivity.roleId}
              >
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
