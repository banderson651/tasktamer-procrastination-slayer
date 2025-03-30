
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, SubTask, Priority, Status, Label } from '@/types/task';

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
  changeTaskStatus: (id: string, status: Status) => void;
  changeTaskLabel: (id: string, label: Label) => void;
  assignTask: (id: string, assignee: string) => void;
  addTaskNote: (id: string, note: string) => void;
  setEstimatedTime: (id: string, minutes: number) => void;
  addTaskTag: (id: string, tag: string) => void;
  removeTaskTag: (id: string, tag: string) => void;
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
          status: 'todo',
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
                  status: !task.completed ? 'done' : 'todo',
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
      
      changeTaskStatus: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id 
              ? { 
                  ...task, 
                  status,
                  completed: status === 'done'
                } 
              : task
          ),
        }));
      },
      
      changeTaskLabel: (id, label) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, label } : task
          ),
        }));
      },
      
      assignTask: (id, assignee) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, assignedTo: assignee } : task
          ),
        }));
      },
      
      addTaskNote: (id, note) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, notes: note } : task
          ),
        }));
      },
      
      setEstimatedTime: (id, minutes) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, estimatedTime: minutes } : task
          ),
        }));
      },
      
      addTaskTag: (id, tag) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id 
              ? { 
                  ...task, 
                  tags: task.tags ? [...task.tags, tag] : [tag] 
                } 
              : task
          ),
        }));
      },
      
      removeTaskTag: (id, tag) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id && task.tags 
              ? { 
                  ...task, 
                  tags: task.tags.filter(t => t !== tag) 
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
