
import { useState } from 'react';
import { SubTask } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface SubtaskItemProps {
  taskId: string;
  subtask: SubTask;
}

const SubtaskItem = ({ taskId, subtask }: SubtaskItemProps) => {
  const { completeSubtask, updateSubtask, deleteSubtask } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(subtask.title);
  const [description, setDescription] = useState(subtask.description || '');
  const [isCheckboxAnimating, setIsCheckboxAnimating] = useState(false);

  const handleCheckboxChange = () => {
    setIsCheckboxAnimating(true);
    completeSubtask(taskId, subtask.id);
    
    if (!subtask.completed) {
      toast.success("Subtask completed! Keep going! 🎯");
    }
    
    setTimeout(() => {
      setIsCheckboxAnimating(false);
    }, 400);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTitle(subtask.title);
    setDescription(subtask.description || '');
    setIsEditing(false);
  };

  const handleSave = () => {
    if (title.trim() === '') {
      toast.error("Subtask title cannot be empty");
      return;
    }
    
    updateSubtask(taskId, subtask.id, {
      title,
      description: description || undefined,
    });
    
    setIsEditing(false);
    toast.success("Subtask updated");
  };

  const handleDelete = () => {
    deleteSubtask(taskId, subtask.id);
    toast.info("Subtask removed");
  };

  return (
    <Card className={`border ${subtask.completed ? 'border-muted bg-muted/30' : ''}`}>
      <CardContent className="p-4">
        {!isEditing ? (
          <div className="flex items-start gap-3">
            <div 
              className={`mt-0.5 ${isCheckboxAnimating ? 'animate-task-complete' : ''}`}
              onClick={handleCheckboxChange}
            >
              <Checkbox checked={subtask.completed} />
            </div>
            <div className="flex-grow">
              <h4 className={`font-medium ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                {subtask.title}
              </h4>
              {subtask.description && (
                <p className={`text-sm text-muted-foreground mt-1 ${subtask.completed ? 'line-through' : ''}`}>
                  {subtask.description}
                </p>
              )}
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive hover:text-destructive" 
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Subtask title"
              className="focus-visible:ring-primary"
              autoFocus
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="min-h-16 focus-visible:ring-primary"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubtaskItem;
