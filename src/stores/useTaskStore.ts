import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'

export interface Task {
  id: string;
  title: string;
  description?: string;
  whyItMatters?: string;
  definitionOfDone?: string;
  dueDate?: string;
  fundsNeeded?: number;
  createdAt: string;
  updatedAt: string;
  activityId?: string;
}

export interface Activity {
  id: string;
  name: string;
  color?: string;
}

interface TaskStore {
  tasks: Task[];
  filteredTasks: Task[];
  selectedTask: Task | null;
  taskDraft: Task | null;
  activities: Activity[];
  selectedActivity: string | null;
  
  // Task actions
  createTask: (taskData: Partial<Task>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  searchTasks: (query: string) => void;
  selectTask: (task: Task | null) => void;
  updateTaskDraft: (updates: Partial<Task>) => void;
  saveTaskDraft: () => void;
  discardTaskDraft: () => void;
  
  // Activity actions
  createActivity: (activityData: Partial<Activity>) => void;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
  selectActivity: (activityId: string | null) => void;
}

const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      filteredTasks: [],
      selectedTask: null,
      taskDraft: null,
      activities: [],
      selectedActivity: null,

      createTask: (taskData) => {
        const task: Task = {
          id: crypto.randomUUID(),
          title: taskData.title || '',
          description: taskData.description,
          whyItMatters: taskData.whyItMatters,
          definitionOfDone: taskData.definitionOfDone,
          dueDate: taskData.dueDate,
          fundsNeeded: taskData.fundsNeeded,
          activityId: get().selectedActivity || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          tasks: [task, ...state.tasks],
          filteredTasks: [task, ...state.tasks],
        }));
        toast.success('Task created successfully');
      },

      updateTask: (task) => {
        const updatedTask = { ...task, updatedAt: new Date().toISOString() };
        set((state) => ({
          tasks: state.tasks.map((t) => t.id === task.id ? updatedTask : t),
          filteredTasks: state.filteredTasks.map((t) => t.id === task.id ? updatedTask : t),
          selectedTask: state.selectedTask?.id === task.id ? updatedTask : state.selectedTask,
        }));
        toast.success('Task updated successfully');
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          filteredTasks: state.filteredTasks.filter((t) => t.id !== id),
        }));
        toast.success('Task deleted successfully');
      },

      searchTasks: (query) => {
        set((state) => {
          const filtered = state.tasks.filter((task) => {
            const matchesQuery = task.title.toLowerCase().includes(query.toLowerCase());
            const matchesActivity = !state.selectedActivity || task.activityId === state.selectedActivity;
            return matchesQuery && matchesActivity;
          });
          return { filteredTasks: filtered };
        });
      },

      selectTask: (task) => {
        set({
          selectedTask: task,
          taskDraft: task ? { ...task } : null,
        });
      },

      updateTaskDraft: (updates) => {
        set((state) => ({
          taskDraft: state.taskDraft ? { ...state.taskDraft, ...updates } : null,
        }));
      },

      saveTaskDraft: () => {
        const { taskDraft } = get();
        if (taskDraft) {
          get().updateTask(taskDraft);
        }
      },

      discardTaskDraft: () => {
        const { selectedTask } = get();
        set({
          taskDraft: selectedTask ? { ...selectedTask } : null,
        });
      },

      createActivity: (activityData) => {
        const activity: Activity = {
          id: crypto.randomUUID(),
          name: activityData.name || 'New Activity',
          color: activityData.color,
        };
        
        set((state) => ({
          activities: [...state.activities, activity],
        }));
        toast.success('Activity created successfully');
      },

      updateActivity: (activity) => {
        set((state) => ({
          activities: state.activities.map((f) => f.id === activity.id ? activity : f),
        }));
        toast.success('Activity updated successfully');
      },

      deleteActivity: (id) => {
        set((state) => ({
          activities: state.activities.filter((f) => f.id !== id),
          selectedActivity: state.selectedActivity === id ? null : state.selectedActivity,
        }));
        toast.success('Activity deleted successfully');
      },

      selectActivity: (activityId) => {
        set((state) => {
          const filtered = state.tasks.filter((task) => {
            return !activityId || task.activityId === activityId;
          });
          return {
            selectedActivity: activityId,
            filteredTasks: filtered,
          };
        });
      },
    }),
    {
      name: 'task-storage',
    }
  )
)

export default useTaskStore 