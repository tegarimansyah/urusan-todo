import { format } from 'date-fns';
import { useTask } from '@/contexts/task-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function TaskList() {
  const { filteredTasks, selectTask, folders } = useTask();

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No tasks found. Create one by typing in the search bar above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <Card
          key={task.id}
          className="cursor-pointer hover:shadow-md transition-shadow py-4"
          onClick={() => selectTask(task)}
        >
          <CardHeader className="py-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg leading-none">{task.title}</CardTitle>
                {task.dueDate && (
                  <CardDescription>
                    Due: {format(new Date(task.dueDate), 'PPP')}
                  </CardDescription>
                )}
              </div>
              {task.folderId && (
                <Badge variant="secondary">
                  {folders.find((f) => f.id === task.folderId)?.name}
                </Badge>
              )}
            </div>
          </CardHeader>
          {task.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}