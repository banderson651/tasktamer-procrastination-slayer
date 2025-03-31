import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCard from '@/components/TaskCard';
import TaskBoardView from '@/components/TaskBoardView';
import { Plus, Search, SlidersHorizontal, LayoutGrid, List, CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Priority } from '@/types/task';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const TasksPage = () => {
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedLabel, setSelectedLabel] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');
  
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  // Process filter logic
  const filteredIncompleteTasks = incompleteTasks.filter(task => {
    const matchesSearch = searchQuery 
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
      
    const matchesPriority = selectedPriority === 'all' 
      ? true 
      : task.priority === selectedPriority;
      
    const matchesLabel = selectedLabel === 'all'
      ? true
      : task.label === selectedLabel;
      
    return matchesSearch && matchesPriority && matchesLabel;
  });
  
  const filteredCompletedTasks = completedTasks.filter(task => {
    const matchesSearch = searchQuery 
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
      
    const matchesPriority = selectedPriority === 'all' 
      ? true 
      : task.priority === selectedPriority;
      
    const matchesLabel = selectedLabel === 'all'
      ? true
      : task.label === selectedLabel;
      
    return matchesSearch && matchesPriority && matchesLabel;
  });

  // Updated implementation to ensure proper navigation
  const handleCreateNewTask = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    e.stopPropagation(); // Stop event propagation
    navigate('/tasks/new', { replace: false });
  };

  // All available priorities for dropdown filtering
  const priorityOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  // All available labels for dropdown filtering
  const labelOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'All Labels' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'other', label: 'Other' }
  ];

  const priorityColors: Record<Priority, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-amber-100 text-amber-800',
    urgent: 'bg-red-100 text-red-800',
  };
  
  // Get statistics to display in the header
  const getTasksStats = () => {
    const dueToday = incompleteTasks.filter(task => {
      if (!task.dueDate) return false;
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      return (
        dueDate.getDate() === today.getDate() &&
        dueDate.getMonth() === today.getMonth() &&
        dueDate.getFullYear() === today.getFullYear()
      );
    });
    
    const overdue = incompleteTasks.filter(task => {
      if (!task.dueDate) return false;
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    });
    
    return { dueToday: dueToday.length, overdue: overdue.length };
  };
  
  const taskStats = getTasksStats();

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline" className="flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" /> 
              {taskStats.dueToday} due today
            </Badge>
            {taskStats.overdue > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                {taskStats.overdue} overdue
              </Badge>
            )}
          </div>
        </div>
        <Button 
          onClick={handleCreateNewTask} 
          type="button"
        >
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {selectedPriority === 'all' ? (
                  'Priority'
                ) : (
                  <span className={`px-2 py-0.5 rounded-md text-xs ${
                    priorityColors[selectedPriority as Priority]
                  }`}>
                    {selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={selectedPriority} onValueChange={setSelectedPriority}>
                {priorityOptions.map(option => (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {selectedLabel === 'all' ? (
                  'Label'
                ) : (
                  selectedLabel.charAt(0).toUpperCase() + selectedLabel.slice(1)
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={selectedLabel} onValueChange={setSelectedLabel}>
                {labelOptions.map(option => (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIncompleteTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">No active tasks found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedPriority !== 'all' || selectedLabel !== 'all'
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCompletedTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border rounded-lg">
                <h3 className="text-lg font-medium">No completed tasks found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedPriority !== 'all' || selectedLabel !== 'all'
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
