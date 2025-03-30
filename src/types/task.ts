
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'todo' | 'in_progress' | 'review' | 'done';
export type Label = 'work' | 'personal' | 'education' | 'health' | 'finance' | 'other';

export interface SubTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  status: Status;
  label?: Label;
  dueDate?: Date;
  subtasks: SubTask[];
  createdAt: Date;
  assignedTo?: string;
  tags?: string[];
  notes?: string;
  estimatedTime?: number; // in minutes
}
