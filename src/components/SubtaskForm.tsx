
import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

interface SubtaskFormProps {
  taskId: string;
  onComplete?: () => void;
}

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  description: z.string().optional(),
});

const SubtaskForm = ({ taskId, onComplete }: SubtaskFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addSubtask } = useTaskStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const expandForm = () => {
    setIsExpanded(true);
  };

  const collapseForm = () => {
    setIsExpanded(false);
    form.reset();
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addSubtask(taskId, data.title, data.description);
    toast.success('Subtask added successfully!');
    form.reset();
    
    if (onComplete) {
      onComplete();
    }
  };

  if (!isExpanded) {
    return (
      <Button 
        variant="ghost" 
        className="w-full border border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 bg-secondary/50 hover:bg-secondary"
        onClick={expandForm}
      >
        + Add Subtask
      </Button>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-card animate-fade-in">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="What's the next step?" 
                    {...field} 
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {isExpanded && (
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Add details about this subtask (optional)"
                      {...field}
                      className="min-h-16"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={collapseForm}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Add Subtask
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SubtaskForm;
