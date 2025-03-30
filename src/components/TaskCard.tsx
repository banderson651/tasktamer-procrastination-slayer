
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, Priority, Status, Label } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Clock, 
  CalendarIcon, 
  ArrowRightCircle,
  User,
  Tag
} from 'lucide-react';
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

const statusColors: Record<Status, string> = {
  todo: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  in_progress: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  review: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  done: 'bg-green-100 text-green-800 hover:bg-green-200',
};

const labelColors: Record<Label, string> = {
  work: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
  personal: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
  education: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
  health: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
  finance: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  other: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
};

const TaskCard = ({ task }: TaskCardProps) => {
  const navigate = useNavigate();
  const { completeTask, deleteTask, changeTaskStatus } = useTaskStore();
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
    navigate(`/tasks/${task.id}/edit`);
  };

  const handleTaskDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteTask(task.id);
    toast.info("Task deleted");
  };

  const handleStatusChange = (event: React.MouseEvent, status: Status) => {
    event.stopPropagation();
    changeTaskStatus(task.id, status);
    toast.success(`Task moved to ${status.replace('_', ' ')}`);
  };

  const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  const progress = task.subtasks.length > 0 
    ? Math.round((completedSubtasks / task.subtasks.length) * 100) 
    : task.completed ? 100 : 0;

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const statusLabels: Record<Status, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    review: 'Review',
    done: 'Done'
  };

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
              {task.status !== 'todo' && (
                <DropdownMenuItem onClick={(e) => handleStatusChange(e, 'todo')}>
                  <ArrowRightCircle className="mr-2 h-4 w-4" />
                  <span>Move to To Do</span>
                </DropdownMenuItem>
              )}
              {task.status !== 'in_progress' && (
                <DropdownMenuItem onClick={(e) => handleStatusChange(e, 'in_progress')}>
                  <ArrowRightCircle className="mr-2 h-4 w-4" />
                  <span>Move to In Progress</span>
                </DropdownMenuItem>
              )}
              {task.status !== 'review' && (
                <DropdownMenuItem onClick={(e) => handleStatusChange(e, 'review')}>
                  <ArrowRightCircle className="mr-2 h-4 w-4" />
                  <span>Move to Review</span>
                </DropdownMenuItem>
              )}
              {task.status !== 'done' && (
                <DropdownMenuItem onClick={(e) => handleStatusChange(e, 'done')}>
                  <ArrowRightCircle className="mr-2 h-4 w-4" />
                  <span>Move to Done</span>
                </DropdownMenuItem>
              )}
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
        
        <div className="flex flex-wrap gap-1.5 mb-2">
          {task.status && (
            <Badge className={statusColors[task.status]}>
              {statusLabels[task.status]}
            </Badge>
          )}
          
          {task.label && (
            <Badge variant="outline" className={labelColors[task.label]}>
              {task.label.charAt(0).toUpperCase() + task.label.slice(1)}
            </Badge>
          )}
        </div>
        
        {task.assignedTo && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
            <User className="h-3.5 w-3.5" />
            <span>{task.assignedTo}</span>
          </div>
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
        
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 mb-1">
            {task.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 justify-between">
        <Badge className={priorityColors[task.priority]}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
        
        <div className="flex items-center gap-3">
          {task.estimatedTime && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3.5 w-3.5" />
              {formatTime(task.estimatedTime)}
            </div>
          )}
          
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="mr-1 h-3.5 w-3.5" />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
