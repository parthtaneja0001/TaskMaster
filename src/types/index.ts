export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
  tags?: string[];
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completedDates: Date[];
  streak: number;
  createdAt: Date;
  color?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  isPinned: boolean;
  lastEdited: Date;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  preferences: {
    theme: 'light' | 'dark';
    dashboardLayout: WidgetLayout[];
  };
}

export interface WidgetLayout {
  id: string;
  type: 'tasks' | 'habits' | 'notes' | 'calendar' | 'goals';
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export type ThemeMode = 'light' | 'dark';