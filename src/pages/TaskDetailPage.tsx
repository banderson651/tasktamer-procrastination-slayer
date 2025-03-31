
import { useParams } from 'react-router-dom';
import TaskForm from '@/components/TaskForm';

interface TaskDetailPageProps {
  isNew?: boolean;
}

const TaskDetailPage = ({ isNew }: TaskDetailPageProps) => {
  const { taskId } = useParams();
  const taskIdToUse = isNew ? undefined : taskId;

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <TaskForm taskId={taskIdToUse} />
    </div>
  );
};

export default TaskDetailPage;
