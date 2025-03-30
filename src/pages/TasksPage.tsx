import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCard from '@/components/TaskCard';
import TaskBoardView from '@/components/TaskBoardView';
import { Plus, Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';

const TasksPage = () => {
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  const filteredIncompleteTasks = incompleteTasks.filter(task => {
    const matchesSearch = searchQuery 
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
      
    const matchesPriority = selectedPriority === 'all' 
      ? true 
      : task.priority === selectedPriority;
      
    return matchesSearch && matchesPriority;
  });
  
  const filteredCompletedTasks = completedTasks.filter(task => {
    const matchesSearch = searchQuery 
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
      
    const matchesPriority = selectedPriority === 'all' 
      ? true 
      : task.priority === selectedPriority;
      
    return matchesSearch && matchesPriority;
  });

  // Handler for creating a new task
  const handleCreateNewTask = () => {
    navigate('/tasks/new');
  };

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage all your tasks in one place</p>
        </div>
        <Button onClick={handleCreateNewTask}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Task
        </Button>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select 
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          
          <div className="flex border rounded-md">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'board' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('board')}
              className="rounded-l-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {viewMode === 'board' ? (
        <TaskBoardView tasks={filteredIncompleteTasks} />
      ) : (
        <Tabs defaultValue="active">
          <TabsList className="mb-6">
            <TabsTrigger value="active">
              Active ({filteredIncompleteTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({filteredCompletedTasks.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {filteredIncompleteTasks.length > 0 ? (
              <div className="task-grid">
                {filteredIncompleteTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">No active tasks found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedPriority !== 'all' 
                    ? "Try different search or filter options" 
                    : "You don't have any active tasks"
                  }
                </p>
                <Button onClick={handleCreateNewTask}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Task
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {filteredCompletedTasks.length > 0 ? (
              <div className="task-grid">
                {filteredCompletedTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border rounded-lg">
                <h3 className="text-lg font-medium">No completed tasks found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedPriority !== 'all' 
                    ? "Try different search or filter options" 
                    : "Complete some tasks to see them here"
                  }
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default TasksPage;
