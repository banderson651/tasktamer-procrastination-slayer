
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, Priority } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface TaskCardProps {
  task: Task;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-green-100 text-green-800 hover:bg-green-200',
  medium: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  high: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  urgent: 'bg-red-100 text-red-800 hover:bg-red-200',
};

const TaskCard = ({ task }: TaskCardProps) => {
  const navigate = useNavigate();
  const { completeTask, deleteTask } = useTaskStore();
  const [isCheckboxAnimating, setIsCheckboxAnimating] = useState(false);

  const handleTaskCompletion = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsCheckboxAnimating(true);
    completeTask(task.id);
    
    if (!task.completed) {
      toast.success("Task completed! Great job! 🎉");
    }
    
    setTimeout(() => {
      setIsCheckboxAnimating(false);
    }, 400);
  };

  const handleTaskEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/tasks/${task.id}`);
  };

  const handleTaskDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteTask(task.id);
    toast.info("Task deleted");
  };

  const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  const progress = task.subtasks.length > 0 
    ? Math.round((completedSubtasks / task.subtasks.length) * 100) 
    : task.completed ? 100 : 0;

  return (
    <Card 
      className={`overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer ${
        task.completed ? 'opacity-70' : ''
      }`}
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div 
            className={`flex items-center gap-3 ${task.completed ? 'line-through text-muted-foreground' : ''}`}
          >
            <div 
              className={`${isCheckboxAnimating ? 'animate-task-complete' : ''}`} 
              onClick={handleTaskCompletion}
            >
              <Checkbox checked={task.completed} />
            </div>
            <CardTitle className="text-base font-medium">{task.title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleTaskEdit}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive" 
                onClick={handleTaskDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {task.description && (
          <p className={`text-sm text-muted-foreground mb-2 ${task.completed ? 'line-through' : ''}`}>
            {task.description.length > 100 
              ? `${task.description.substring(0, 100)}...` 
              : task.description}
          </p>
        )}
        
        {task.subtasks.length > 0 && (
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {completedSubtasks} of {task.subtasks.length} subtasks
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 justify-between">
        <Badge className={priorityColors[task.priority] || ''}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
        
        {task.dueDate && (
          <span className="text-xs text-muted-foreground">
            Due: {task.dueDate.toLocaleDateString()}
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
