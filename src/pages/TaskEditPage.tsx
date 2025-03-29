
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import TaskForm from '@/components/TaskForm';

const TaskEditPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  const task = tasks.find(t => t.id === taskId);

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
        <h1 className="text-2xl font-bold mb-1">Edit Task</h1>
        <p className="text-muted-foreground">Update task details</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <TaskForm taskId={taskId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskEditPage;
