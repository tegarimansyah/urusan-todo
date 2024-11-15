import { Header } from '@/components/header';
import { SearchBar } from '@/components/search-bar';
import { TaskList } from '@/components/task-list';
import { TaskDetail } from '@/components/task-detail';
import useTaskStore from '@/stores/useTaskStore';

export function MainLayout() {
  const selectedTask = useTaskStore((state) => state.selectedTask);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <SearchBar />
          {selectedTask ? <TaskDetail /> : <TaskList />}
        </div>
      </main>
    </div>
  );
}
