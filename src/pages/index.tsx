import { SearchBar } from '@/components/search-bar';
import { TaskList } from '@/components/task-list';
import { TaskDetail } from '@/components/task-detail';
import useTaskStore from '@/stores/useTaskStore';

export function IndexPage() {
  const selectedTask = useTaskStore((state) => state.selectedTask);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <SearchBar />
      {selectedTask ? <TaskDetail /> : <TaskList />}
    </div>
  );
} 