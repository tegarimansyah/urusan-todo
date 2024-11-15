import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useToast } from '@/hooks/use-toast';

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
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
}

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  selectedTask: Task | null;
  taskDraft: Task | null;
  folders: Folder[];
  selectedFolder: string | null;
}

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTERED_TASKS'; payload: Task[] }
  | { type: 'SET_SELECTED_TASK'; payload: Task | null }
  | { type: 'SET_TASK_DRAFT'; payload: Task | null }
  | { type: 'SET_FOLDERS'; payload: Folder[] }
  | { type: 'ADD_FOLDER'; payload: Folder }
  | { type: 'UPDATE_FOLDER'; payload: Folder }
  | { type: 'DELETE_FOLDER'; payload: string }
  | { type: 'SET_SELECTED_FOLDER'; payload: string | null };

const TaskContext = createContext<
  | {
      state: TaskState;
      createTask: (task: Partial<Task>) => void;
      updateTask: (task: Task) => void;
      deleteTask: (id: string) => void;
      searchTasks: (query: string) => void;
      selectTask: (task: Task | null) => void;
      updateTaskDraft: (updates: Partial<Task>) => void;
      saveTaskDraft: () => void;
      discardTaskDraft: () => void;
      createFolder: (folder: Partial<Folder>) => void;
      updateFolder: (folder: Folder) => void;
      deleteFolder: (id: string) => void;
      selectFolder: (folderId: string | null) => void;
    }
  | undefined
>(undefined);

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        filteredTasks: [action.payload, ...state.tasks],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        filteredTasks: state.filteredTasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        selectedTask: state.selectedTask?.id === action.payload.id ? action.payload : state.selectedTask,
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        filteredTasks: state.filteredTasks.filter(
          (task) => task.id !== action.payload
        ),
      };
    case 'SET_FILTERED_TASKS':
      return { ...state, filteredTasks: action.payload };
    case 'SET_SELECTED_TASK':
      return { 
        ...state, 
        selectedTask: action.payload,
        taskDraft: action.payload ? { ...action.payload } : null,
      };
    case 'SET_TASK_DRAFT':
      return { ...state, taskDraft: action.payload };
    case 'SET_FOLDERS':
      return { ...state, folders: action.payload };
    case 'ADD_FOLDER':
      return { ...state, folders: [...state.folders, action.payload] };
    case 'UPDATE_FOLDER':
      return {
        ...state,
        folders: state.folders.map((folder) =>
          folder.id === action.payload.id ? action.payload : folder
        ),
      };
    case 'DELETE_FOLDER':
      return {
        ...state,
        folders: state.folders.filter((folder) => folder.id !== action.payload),
      };
    case 'SET_SELECTED_FOLDER':
      return { ...state, selectedFolder: action.payload };
    default:
      return state;
  }
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [],
    filteredTasks: [],
    selectedTask: null,
    taskDraft: null,
    folders: [],
    selectedFolder: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasks, folders] = await Promise.all([
          loadTasksFromStorage(),
          loadFoldersFromStorage(),
        ]);
        dispatch({ type: 'SET_TASKS', payload: tasks });
        dispatch({ type: 'SET_FILTERED_TASKS', payload: tasks });
        dispatch({ type: 'SET_FOLDERS', payload: folders });
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data',
          variant: 'destructive',
        });
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const filterTasks = () => {
      const filtered = state.tasks.filter((task) => {
        const matchesFolder = !state.selectedFolder || task.folderId === state.selectedFolder;
        return matchesFolder;
      });
      dispatch({ type: 'SET_FILTERED_TASKS', payload: filtered });
    };

    filterTasks();
  }, [state.selectedFolder, state.tasks]);

  const createTask = async (taskData: Partial<Task>) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title: taskData.title || '',
      description: taskData.description,
      whyItMatters: taskData.whyItMatters,
      definitionOfDone: taskData.definitionOfDone,
      dueDate: taskData.dueDate,
      fundsNeeded: taskData.fundsNeeded,
      folderId: state.selectedFolder || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveTaskToStorage(task);
      dispatch({ type: 'ADD_TASK', payload: task });
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
    }
  };

  const updateTask = async (task: Task) => {
    try {
      const updatedTask = { ...task, updatedAt: new Date().toISOString() };
      await saveTaskToStorage(updatedTask);
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteTaskFromStorage(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  const searchTasks = (query: string) => {
    const filtered = state.tasks.filter((task) => {
      const matchesQuery = task.title.toLowerCase().includes(query.toLowerCase());
      const matchesFolder = !state.selectedFolder || task.folderId === state.selectedFolder;
      return matchesQuery && matchesFolder;
    });
    dispatch({ type: 'SET_FILTERED_TASKS', payload: filtered });
  };

  const selectTask = (task: Task | null) => {
    dispatch({ type: 'SET_SELECTED_TASK', payload: task });
  };

  const updateTaskDraft = (updates: Partial<Task>) => {
    if (state.taskDraft) {
      dispatch({
        type: 'SET_TASK_DRAFT',
        payload: { ...state.taskDraft, ...updates },
      });
    }
  };

  const saveTaskDraft = async () => {
    if (state.taskDraft) {
      await updateTask(state.taskDraft);
    }
  };

  const discardTaskDraft = () => {
    if (state.selectedTask) {
      dispatch({ type: 'SET_TASK_DRAFT', payload: { ...state.selectedTask } });
    }
  };

  const createFolder = async (folderData: Partial<Folder>) => {
    const folder: Folder = {
      id: crypto.randomUUID(),
      name: folderData.name || 'New Folder',
      color: folderData.color,
    };

    try {
      await saveFolderToStorage(folder);
      dispatch({ type: 'ADD_FOLDER', payload: folder });
      toast({
        title: 'Success',
        description: 'Folder created successfully',
      });
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: 'Error',
        description: 'Failed to create folder',
        variant: 'destructive',
      });
    }
  };

  const updateFolder = async (folder: Folder) => {
    try {
      await saveFolderToStorage(folder);
      dispatch({ type: 'UPDATE_FOLDER', payload: folder });
      toast({
        title: 'Success',
        description: 'Folder updated successfully',
      });
    } catch (error) {
      console.error('Error updating folder:', error);
      toast({
        title: 'Error',
        description: 'Failed to update folder',
        variant: 'destructive',
      });
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      await deleteFolderFromStorage(id);
      dispatch({ type: 'DELETE_FOLDER', payload: id });
      if (state.selectedFolder === id) {
        dispatch({ type: 'SET_SELECTED_FOLDER', payload: null });
      }
      toast({
        title: 'Success',
        description: 'Folder deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete folder',
        variant: 'destructive',
      });
    }
  };

  const selectFolder = (folderId: string | null) => {
    dispatch({ type: 'SET_SELECTED_FOLDER', payload: folderId });
  };

  return (
    <TaskContext.Provider
      value={{
        state,
        createTask,
        updateTask,
        deleteTask,
        searchTasks,
        selectTask,
        updateTaskDraft,
        saveTaskDraft,
        discardTaskDraft,
        createFolder,
        updateFolder,
        deleteFolder,
        selectFolder,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return {
    tasks: context.state.tasks,
    filteredTasks: context.state.filteredTasks,
    selectedTask: context.state.selectedTask,
    taskDraft: context.state.taskDraft,
    folders: context.state.folders,
    selectedFolder: context.state.selectedFolder,
    createTask: context.createTask,
    updateTask: context.updateTask,
    deleteTask: context.deleteTask,
    searchTasks: context.searchTasks,
    selectTask: context.selectTask,
    updateTaskDraft: context.updateTaskDraft,
    saveTaskDraft: context.saveTaskDraft,
    discardTaskDraft: context.discardTaskDraft,
    createFolder: context.createFolder,
    updateFolder: context.updateFolder,
    deleteFolder: context.deleteFolder,
    selectFolder: context.selectFolder,
  };
}

// Storage functions
async function loadTasksFromStorage(): Promise<Task[]> {
  const tasksJson = localStorage.getItem('tasks');
  return tasksJson ? JSON.parse(tasksJson) : [];
}

async function saveTaskToStorage(task: Task): Promise<void> {
  const tasks = await loadTasksFromStorage();
  const existingTaskIndex = tasks.findIndex((t) => t.id === task.id);

  if (existingTaskIndex >= 0) {
    tasks[existingTaskIndex] = task;
  } else {
    tasks.unshift(task);
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

async function deleteTaskFromStorage(id: string): Promise<void> {
  const tasks = await loadTasksFromStorage();
  const filteredTasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}

async function loadFoldersFromStorage(): Promise<Folder[]> {
  const foldersJson = localStorage.getItem('folders');
  return foldersJson ? JSON.parse(foldersJson) : [];
}

async function saveFolderToStorage(folder: Folder): Promise<void> {
  const folders = await loadFoldersFromStorage();
  const existingFolderIndex = folders.findIndex((f) => f.id === folder.id);

  if (existingFolderIndex >= 0) {
    folders[existingFolderIndex] = folder;
  } else {
    folders.push(folder);
  }

  localStorage.setItem('folders', JSON.stringify(folders));
}

async function deleteFolderFromStorage(id: string): Promise<void> {
  const folders = await loadFoldersFromStorage();
  const filteredFolders = folders.filter((folder) => folder.id !== id);
  localStorage.setItem('folders', JSON.stringify(filteredFolders));
}