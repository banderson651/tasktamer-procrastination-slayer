import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Calendar, 
  CheckSquare, 
  Edit, 
  Trash2, 
  Clock,
  User,
  Tag,
  FileText,
  ArrowRightCircle
} from 'lucide-react';
import SubtaskForm from '@/components/SubtaskForm';
import SubtaskItem from '@/components/SubtaskItem';
import AITaskBreakdown from '@/components/AITaskBreakdown';
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import TaskForm from '@/components/TaskForm';

const TaskDetailPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { tasks, deleteTask, completeTask, updateTask, changeTaskStatus } = useTaskStore();
  const [task, setTask] = useState(taskId === 'new' ? null : tasks.find(t => t.id === taskId));
  
  useEffect(() => {
    if (taskId === 'new') {
      // New task case, don't need to find existing task
      setTask(null);
      return;
    }
    
    const foundTask = tasks.find(t => t.id === taskId);
    setTask(foundTask);
    
    if (!foundTask && taskId !== 'new') {
      toast.error('Task not found');
      navigate('/tasks');
    }
  }, [taskId, tasks, navigate]);
  
  // Handle the "new" task case
  if (taskId === 'new') {
    return (
      <div className="container max-w-4xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold mb-1">Create New Task</h1>
          <p className="text-muted-foreground">Add a new task to organize your work</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <TaskForm />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Handle task not found case
  if (!task) {
    return (
      <div className="container max-w-4xl mx-auto p-4 md:p-6">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Task not found</h2>
          <Button onClick={() => navigate('/tasks')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }
  
  const priorityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-amber-100 text-amber-800',
    urgent: 'bg-red-100 text-red-800',
  };
  
  const statusColors: Record<string, string> = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    review: 'bg-purple-100 text-purple-800',
    done: 'bg-green-100 text-green-800',
  };
  
  const labelColors: Record<string, string> = {
    work: 'bg-indigo-100 text-indigo-800',
    personal: 'bg-pink-100 text-pink-800',
    education: 'bg-cyan-100 text-cyan-800',
    health: 'bg-emerald-100 text-emerald-800',
    finance: 'bg-amber-100 text-amber-800',
    other: 'bg-gray-100 text-gray-800',
  };
  
  const handleEdit = () => {
    navigate(`/tasks/${task.id}/edit`);
  };
  
  const handleDelete = () => {
    deleteTask(task.id);
    toast.info("Task deleted");
    navigate('/tasks');
  };
  
  const handleToggleComplete = () => {
    completeTask(task.id);
    
    if (!task.completed) {
      toast.success("Task completed! Great job! 🎉");
    }
  };
  
  const handleStatusChange = (status: string) => {
    changeTaskStatus(task.id, status as any);
    toast.success(`Task moved to ${status.replace('_', ' ')}`);
  };
  
  const statusLabels: Record<string, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    review: 'Review',
    done: 'Done'
  };
  
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins > 1 ? 's' : ''}` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };
  
  const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  const progress = task.subtasks.length > 0 
    ? Math.round((completedSubtasks / task.subtasks.length) * 100) 
    : task.completed ? 100 : 0;
  
  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Badge className={priorityColors[task.priority]}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              
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
            
            <h1 className={`text-2xl font-bold mb-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
              {task.dueDate && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}
              
              {task.estimatedTime && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(task.estimatedTime)}
                </div>
              )}
              
              {task.assignedTo && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {task.assignedTo}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={task.completed ? "secondary" : "default"}
              onClick={handleToggleComplete}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              {task.completed ? "Mark Incomplete" : "Mark Complete"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleEdit}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              className="text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        
        {/* Status Selector */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm font-medium">Status:</span>
          <Select value={task.status} onValueChange={handleStatusChange}>
            <SelectTrigger className={cn("w-[180px]", statusColors[task.status])}>
              <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mb-6">
        {task.subtasks.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {completedSubtasks} of {task.subtasks.length} subtasks completed
            </div>
          </div>
        )}
        
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {task.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <Tabs defaultValue="details">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="subtasks">
            Subtasks ({task.subtasks.length})
          </TabsTrigger>
          <TabsTrigger value="ai-breakdown">
            AI Breakdown
          </TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardContent className="pt-6">
              {task.description ? (
                <div>
                  <h3 className="text-lg font-medium mb-3">Description</h3>
                  <p className="whitespace-pre-line text-muted-foreground">
                    {task.description}
                  </p>
                </div>
              ) : (
                <div className="text-center p-6">
                  <p className="text-muted-foreground">
                    No description provided
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleEdit} 
                    className="mt-4"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Add Description
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subtasks">
          <div className="space-y-4">
            {task.subtasks.length > 0 && (
              <div className="space-y-3">
                {task.subtasks.map(subtask => (
                  <SubtaskItem 
                    key={subtask.id} 
                    taskId={task.id} 
                    subtask={subtask} 
                  />
                ))}
              </div>
            )}
            
            <SubtaskForm taskId={task.id} />
            
            {task.subtasks.length === 0 && (
              <div className="text-center p-6 border rounded-lg mt-4">
                <p className="text-muted-foreground mb-2">
                  No subtasks yet. Break down your task into smaller steps.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Breaking tasks into smaller steps makes them easier to complete.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="ai-breakdown">
          <AITaskBreakdown taskId={task.id} />
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardContent className="pt-6">
              {task.notes ? (
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                    <h3 className="text-lg font-medium">Notes</h3>
                  </div>
                  <p className="whitespace-pre-line text-muted-foreground">
                    {task.notes}
                  </p>
                </div>
              ) : (
                <div className="text-center p-6">
                  <p className="text-muted-foreground">
                    No notes added yet
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleEdit} 
                    className="mt-4"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Add Notes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskDetailPage;
