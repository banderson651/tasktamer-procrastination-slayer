
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, CheckSquare, Edit, Trash2 } from 'lucide-react';
import SubtaskForm from '@/components/SubtaskForm';
import SubtaskItem from '@/components/SubtaskItem';
import AITaskBreakdown from '@/components/AITaskBreakdown';
import { toast } from 'sonner';

const TaskDetailPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { tasks, deleteTask, completeTask } = useTaskStore();
  const [task, setTask] = useState(tasks.find(t => t.id === taskId));
  
  useEffect(() => {
    const foundTask = tasks.find(t => t.id === taskId);
    setTask(foundTask);
    
    if (!foundTask && taskId !== 'new') {
      toast.error('Task not found');
      navigate('/tasks');
    }
  }, [taskId, tasks, navigate]);
  
  if (!task && taskId !== 'new') {
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
            <TaskForm taskId={undefined} />
          </CardContent>
        </Card>
      </div>
    );
  }

  const priorityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-amber-100 text-amber-800',
    urgent: 'bg-red-100 text-red-800',
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
            <div className="flex items-center gap-3 mb-2">
              <Badge className={priorityColors[task.priority]}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              
              {task.dueDate && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
            
            <h1 className={`text-2xl font-bold mb-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h1>
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
      </Tabs>
    </div>
  );
};

import TaskForm from '@/components/TaskForm';

export default TaskDetailPage;
