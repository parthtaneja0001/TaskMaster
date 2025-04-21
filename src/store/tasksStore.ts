import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Priority, TaskStatus } from '../types';
import { generateId } from '../lib/utils';

interface TasksState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => string;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  filterTasks: (status?: TaskStatus, priority?: Priority, search?: string) => Task[];
}

const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (taskData) => {
        const id = generateId();
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id,
              ...taskData,
              createdAt: new Date(),
            },
          ],
        }));
        return id;
      },
      updateTask: (id, updatedTask) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        }));
      },
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      completeTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status: 'completed' } : task
          ),
        }));
      },
      filterTasks: (status, priority, search) => {
        const { tasks } = get();
        return tasks.filter((task) => {
          const statusMatch = !status || task.status === status;
          const priorityMatch = !priority || task.priority === priority;
          const searchMatch = !search || 
            task.title.toLowerCase().includes(search.toLowerCase()) || 
            (task.description && task.description.toLowerCase().includes(search.toLowerCase()));
          
          return statusMatch && priorityMatch && searchMatch;
        });
      },
    }),
    {
      name: 'tasks-storage',
    }
  )
);

export default useTasksStore;