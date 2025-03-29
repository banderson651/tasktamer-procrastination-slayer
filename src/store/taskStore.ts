
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, SubTask, Priority } from '@/types/task';

interface TaskState {
  tasks: Task[];
  addTask: (title: string, description?: string, priority?: Priority, dueDate?: Date) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  addSubtask: (taskId: string, title: string, description?: string) => SubTask;
  updateSubtask: (taskId: string, subtaskId: string, updates: Partial<SubTask>) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  completeSubtask: (taskId: string, subtaskId: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      
      addTask: (title, description, priority = 'medium', dueDate) => {
        const newTask: Task = {
          id: crypto.randomUUID(),
          title,
          description,
          completed: false,
          priority,
          dueDate,
          subtasks: [],
          createdAt: new Date(),
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
        
        return newTask;
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
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
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  subtasks: task.subtasks.map((subtask) => ({
                    ...subtask,
                    completed: !task.completed,
                  })),
                }
              : task
          ),
        }));
      },
      
      addSubtask: (taskId, title, description) => {
        const newSubtask: SubTask = {
          id: crypto.randomUUID(),
          title,
          description,
          completed: false,
          createdAt: new Date(),
        };
        
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, subtasks: [...task.subtasks, newSubtask] }
              : task
          ),
        }));
        
        return newSubtask;
      },
      
      updateSubtask: (taskId, subtaskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks.map((subtask) =>
                    subtask.id === subtaskId
                      ? { ...subtask, ...updates }
                      : subtask
                  ),
                }
              : task
          ),
        }));
      },
      
      deleteSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks.filter(
                    (subtask) => subtask.id !== subtaskId
                  ),
                }
              : task
          ),
        }));
      },
      
      completeSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks.map((subtask) =>
                    subtask.id === subtaskId
                      ? { ...subtask, completed: !subtask.completed }
                      : subtask
                  ),
                }
              : task
          ),
        }));
      },
    }),
    {
      name: 'task-storage',
    }
  )
);
