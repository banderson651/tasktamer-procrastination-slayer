import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/taskStore';
import { Task, Priority, Status, Label } from '@/types/task';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Tag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface TaskFormProps {
  taskId?: string;
}

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['todo', 'in_progress', 'review', 'done']),
  label: z.enum(['work', 'personal', 'education', 'health', 'finance', 'other']).optional(),
  dueDate: z.date().optional(),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
  estimatedTime: z.number().optional(),
});

const TaskForm = ({ taskId }: TaskFormProps = {}) => {
  const navigate = useNavigate();
  const { tasks, addTask, updateTask } = useTaskStore();
  const [existingTask, setExistingTask] = useState<Task | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium' as Priority,
      status: 'todo' as Status,
      dueDate: undefined,
      assignedTo: '',
      notes: '',
      estimatedTime: undefined,
    },
  });
  
  useEffect(() => {
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setExistingTask(task);
        setTags(task.tags || []);
        form.reset({
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          status: task.status || 'todo',
          label: task.label,
          dueDate: task.dueDate,
          assignedTo: task.assignedTo || '',
          notes: task.notes || '',
          estimatedTime: task.estimatedTime,
        });
      }
    }
  }, [taskId, tasks, form]);

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (existingTask) {
      updateTask(existingTask.id, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        label: data.label,
        dueDate: data.dueDate,
        assignedTo: data.assignedTo,
        notes: data.notes,
        estimatedTime: data.estimatedTime,
        tags
      });
      toast.success('Task updated successfully!');
    } else {
      const newTask = addTask(
        data.title,
        data.description,
        data.priority,
        data.dueDate
      );
      
      // Update the additional fields that aren't in addTask params
      updateTask(newTask.id, {
        status: data.status,
        label: data.label,
        assignedTo: data.assignedTo,
        notes: data.notes,
        estimatedTime: data.estimatedTime,
        tags
      });
      
      toast.success('Task created successfully!');
      navigate(`/tasks/${newTask.id}`);
    }
    
    if (!existingTask) {
      navigate('/tasks');
    }
  };

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'done', label: 'Done' },
  ];

  const labelOptions = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="What needs to be done?" 
                  {...field} 
                  className="focus-visible:ring-primary"
                  autoFocus
                />
              </FormControl>
              <FormDescription>
                Choose a clear and specific task name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add details about this task..."
                  {...field}
                  className="min-h-24 focus-visible:ring-primary"
                />
              </FormControl>
              <FormDescription>
                Optional: provide more context or details
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Set how important this task is
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Current progress of this task
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a label" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {labelOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Categorize your task
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When this task should be completed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Name of assignee"
                      {...field}
                      className="pl-8"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Who is responsible for this task
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="estimatedTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Time (minutes)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Time in minutes"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="pl-8"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  How long will this task take
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes, links, or context..."
                  {...field}
                  className="min-h-20"
                />
              </FormControl>
              <FormDescription>
                Any extra information that might be helpful
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Tags</FormLabel>
          <div className="flex gap-2 mb-2">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="px-3 py-1">
                {tag}
                <button 
                  type="button" 
                  className="ml-2 text-muted-foreground hover:text-foreground"
                  onClick={() => handleRemoveTag(tag)}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="pl-8"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
            </div>
            <Button type="button" variant="outline" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Press Enter or click Add to create a tag
          </p>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit">
            {existingTask ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
