
import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskCard from '@/components/TaskCard';
import { Plus, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  const [newTag, setNewTag] = useState('');
  
  // Get all unique tags from tasks
  const allTags = tasks.reduce((tags, task) => {
    if (task.tags) {
      task.tags.forEach(tag => tags.add(tag));
    }
    return tags;
  }, new Set<string>());
  
  // Convert to array and sort alphabetically
  const sortedTags = Array.from(allTags).sort();
  
  // Group tasks by priority
  const tasksByPriority = {
    urgent: tasks.filter(task => task.priority === 'urgent' && !task.completed),
    high: tasks.filter(task => task.priority === 'high' && !task.completed),
    medium: tasks.filter(task => task.priority === 'medium' && !task.completed),
    low: tasks.filter(task => task.priority === 'low' && !task.completed),
  };
  
  const handleAddTag = () => {
    // This is a placeholder since we don't have proper tag management yet
    setNewTag('');
    // In a real implementation, we would save the tag to a tag list
  };
  
  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">View tasks by priority level</p>
        </div>
        <Button onClick={() => navigate('/tasks/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Urgent Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
              Urgent ({tasksByPriority.urgent.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksByPriority.urgent.length > 0 ? (
              <div className="grid gap-3">
                {tasksByPriority.urgent.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No urgent tasks
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* High Priority Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium flex items-center">
              <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
              High Priority ({tasksByPriority.high.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksByPriority.high.length > 0 ? (
              <div className="grid gap-3">
                {tasksByPriority.high.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No high priority tasks
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* Medium Priority Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
              Medium Priority ({tasksByPriority.medium.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksByPriority.medium.length > 0 ? (
              <div className="grid gap-3">
                {tasksByPriority.medium.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No medium priority tasks
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* Low Priority Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              Low Priority ({tasksByPriority.low.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksByPriority.low.length > 0 ? (
              <div className="grid gap-3">
                {tasksByPriority.low.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No low priority tasks
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Tag className="mr-2 h-5 w-5" />
          Task Tags
        </h2>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {sortedTags.length > 0 ? (
                sortedTags.map(tag => (
                  <div 
                    key={tag} 
                    className="px-3 py-1 bg-secondary rounded-full text-sm"
                  >
                    {tag}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No tags have been created yet
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add a new tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <Button 
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                className="whitespace-nowrap"
              >
                Add Tag
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              Note: Tags feature is coming soon. You'll be able to organize tasks using custom tags.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoriesPage;
