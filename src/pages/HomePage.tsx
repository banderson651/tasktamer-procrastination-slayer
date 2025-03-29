
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskCard from '@/components/TaskCard';
import { CheckSquare, Plus, Search, Lightbulb, Brain } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HomePage = () => {
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const urgentTasks = incompleteTasks.filter(task => task.priority === 'urgent' || task.priority === 'high');
  
  const filteredTasks = searchQuery 
    ? tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : incompleteTasks;

  const tips = [
    "Break down large tasks into smaller, more manageable subtasks",
    "Use the urgent priority for only 1-2 tasks at a time",
    "Set specific due dates to help with time management",
    "Try the AI assistant to automatically break down complex tasks",
    "Complete the smallest subtask first to build momentum",
  ];

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your tasks and stay productive</p>
        </div>
        <Button onClick={() => navigate('/tasks/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center text-blue-600">
              <CheckSquare className="mr-2 h-5 w-5" />
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{incompleteTasks.length}</div>
            <p className="text-muted-foreground">Active tasks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center text-amber-600">
              <CheckSquare className="mr-2 h-5 w-5" />
              Urgent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{urgentTasks.length}</div>
            <p className="text-muted-foreground">High priority tasks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center text-green-600">
              <CheckSquare className="mr-2 h-5 w-5" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedTasks.length}</div>
            <p className="text-muted-foreground">Finished tasks</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4 lg:w-2/3">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Tasks</h2>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="w-full md:w-64 pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="active">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active ({incompleteTasks.length})</TabsTrigger>
                <TabsTrigger value="urgent">Urgent ({urgentTasks.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active">
                {filteredTasks.length > 0 ? (
                  <div className="task-grid">
                    {filteredTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? "Try a different search term" : "You don't have any active tasks"}
                    </p>
                    <Button onClick={() => navigate('/tasks/new')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Task
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="urgent">
                {urgentTasks.length > 0 ? (
                  <div className="task-grid">
                    {urgentTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border rounded-lg">
                    <h3 className="text-lg font-medium">No urgent tasks</h3>
                    <p className="text-muted-foreground">
                      You don't have any high-priority tasks at the moment
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed">
                {completedTasks.length > 0 ? (
                  <div className="task-grid">
                    {completedTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border rounded-lg">
                    <h3 className="text-lg font-medium">No completed tasks</h3>
                    <p className="text-muted-foreground">
                      Complete some tasks to see them here
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="w-full md:w-1/4 lg:w-1/3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-muted text-xs mt-0.5">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Brain className="mr-2 h-5 w-5 text-accent" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Let our AI assistant help you break down complex tasks into manageable steps
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/ai-assistant')}
              >
                Try AI Assistant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
