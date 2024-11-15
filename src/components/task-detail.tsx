import { format } from 'date-fns';
import { Calendar as CalendarIcon, DollarSign, X } from 'lucide-react';
import { useTask } from '@/contexts/task-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function TaskDetail() {
  const { 
    taskDraft, 
    updateTaskDraft, 
    saveTaskDraft, 
    discardTaskDraft, 
    deleteTask, 
    selectTask,
    folders 
  } = useTask();

  if (!taskDraft) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateTaskDraft({ [name]: value });
  };

  const handleDateSelect = (date: Date | undefined) => {
    updateTaskDraft({
      dueDate: date?.toISOString(),
    });
  };

  const handleFolderSelect = (folderId: string) => {
    updateTaskDraft({
      folderId: folderId === 'none' ? undefined : folderId,
    });
  };

  const handleClose = () => {
    discardTaskDraft();
    selectTask(null);
  };

  const handleSave = async () => {
    await saveTaskDraft();
    selectTask(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-2xl font-bold">Task Details</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={taskDraft.title}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="folder">Folder</Label>
          <Select
            value={taskDraft.folderId || 'none'}
            onValueChange={handleFolderSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Folder</SelectItem>
              {folders.map((folder) => (
                <SelectItem key={folder.id} value={folder.id}>
                  {folder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={taskDraft.description || ''}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whyItMatters">Why it matters</Label>
          <Textarea
            id="whyItMatters"
            name="whyItMatters"
            value={taskDraft.whyItMatters || ''}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="definitionOfDone">Definition of done</Label>
          <Textarea
            id="definitionOfDone"
            name="definitionOfDone"
            value={taskDraft.definitionOfDone || ''}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Due date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !taskDraft.dueDate && 'text-muted-foreground'
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {taskDraft.dueDate ? (
                    format(new Date(taskDraft.dueDate), 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    taskDraft.dueDate
                      ? new Date(taskDraft.dueDate)
                      : undefined
                  }
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundsNeeded">Funds needed</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="fundsNeeded"
                name="fundsNeeded"
                type="number"
                className="pl-9"
                value={taskDraft.fundsNeeded || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Created: {format(new Date(taskDraft.createdAt), 'PPP')}</p>
          <p>Updated: {format(new Date(taskDraft.updatedAt), 'PPP')}</p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="destructive"
          onClick={() => {
            deleteTask(taskDraft.id);
            selectTask(null);
          }}
        >
          Delete Task
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardFooter>
    </Card>
  );
}