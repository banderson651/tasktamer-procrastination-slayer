
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskCard from '@/components/TaskCard';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Lightbulb, 
  Brain, 
  Rocket, 
  Zap, 
  Award,
  TrendingUp
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

const HomePage = () => {
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [animateCards, setAnimateCards] = useState(false);

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const urgentTasks = incompleteTasks.filter(task => task.priority === 'urgent' || task.priority === 'high');
  
  const filteredTasks = searchQuery 
    ? tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : incompleteTasks;

  const motivationalQuotes = [
    "Small steps every day lead to big results. Let's start with one tiny task.",
    "You don't have to be perfect, you just have to begin somewhere.",
    "Focus on progress, not perfection. Every small win counts!",
    "The hardest part is starting. After that, it gets easier.",
    "Break it down, tackle one piece at a time. You've got this!"
  ];

  useEffect(() => {
    // Trigger animation after component mounts
    setAnimateCards(true);
  }, []);

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-6 overflow-hidden">
      {/* Hero Section */}
      <div className="relative mb-8 p-6 md:p-10 rounded-2xl bg-gradient-to-br from-accent/30 via-background to-primary/20 border shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold animate-fade-in">
              <span className="text-primary">Conquer</span> Your Tasks
            </h1>
            <p className="text-xl text-muted-foreground mt-4 animate-fade-in" style={{animationDelay: '100ms'}}>
              Break down big challenges into small, manageable steps and defeat procrastination one task at a time.
            </p>
            <div className="flex gap-4 mt-6 animate-fade-in" style={{animationDelay: '200ms'}}>
              <Button 
                size="lg" 
                onClick={() => navigate('/tasks/new')}
                className="transition-all duration-300 hover:scale-105"
              >
                <Plus className="mr-2 h-4 w-4" />
                Start New Task
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/ai-assistant')}
                className="transition-all duration-300 hover:scale-105"
              >
                <Brain className="mr-2 h-4 w-4" />
                AI Assistant
              </Button>
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto animate-fade-in" style={{animationDelay: '300ms'}}>
            <Carousel className="w-full max-w-xs mx-auto">
              <CarouselContent>
                {motivationalQuotes.map((quote, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-2 border-primary/10 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <Zap className="h-10 w-10 text-primary mb-4" />
                        <p className="text-sm md:text-base font-medium">{quote}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div 
        className={cn(
          "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 opacity-0", 
          animateCards && "animate-fade-in opacity-100"
        )}
        style={{animationDelay: '400ms'}}
      >
        <Card className="overflow-hidden relative group hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-lg font-medium flex items-center text-blue-600">
              <CheckSquare className="mr-2 h-5 w-5" />
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-4xl font-bold">{incompleteTasks.length}</div>
            <p className="text-muted-foreground">Active tasks</p>
            <TrendingUp className="absolute bottom-4 right-4 h-12 w-12 text-blue-200 opacity-20 group-hover:opacity-40 transition-opacity" />
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden relative group hover:shadow-lg transition-all border-2 border-transparent hover:border-amber-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-lg font-medium flex items-center text-amber-600">
              <Rocket className="mr-2 h-5 w-5" />
              Urgent
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-4xl font-bold">{urgentTasks.length}</div>
            <p className="text-muted-foreground">High priority tasks</p>
            <Zap className="absolute bottom-4 right-4 h-12 w-12 text-amber-200 opacity-20 group-hover:opacity-40 transition-opacity" />
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden relative group hover:shadow-lg transition-all border-2 border-transparent hover:border-green-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-lg font-medium flex items-center text-green-600">
              <Award className="mr-2 h-5 w-5" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-4xl font-bold">{completedTasks.length}</div>
            <p className="text-muted-foreground">Finished tasks</p>
            <Award className="absolute bottom-4 right-4 h-12 w-12 text-green-200 opacity-20 group-hover:opacity-40 transition-opacity" />
          </CardContent>
        </Card>
      </div>
      
      <div 
        className={cn(
          "flex flex-col md:flex-row gap-6 opacity-0",
          animateCards && "animate-fade-in opacity-100"
        )}
        style={{animationDelay: '500ms'}}
      >
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
            
            <Tabs defaultValue="active" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active ({incompleteTasks.length})</TabsTrigger>
                <TabsTrigger value="urgent">Urgent ({urgentTasks.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-4">
                {filteredTasks.length > 0 ? (
                  <div className="task-grid">
                    {filteredTasks.map((task, index) => (
                      <div 
                        key={task.id} 
                        className={cn(
                          "opacity-0 translate-y-4",
                          animateCards && "animate-fade-in opacity-100 translate-y-0"
                        )}
                        style={{animationDelay: `${600 + index * 50}ms`}}
                      >
                        <TaskCard task={task} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border rounded-lg bg-card/50 backdrop-blur-sm">
                    <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? "Try a different search term" : "You don't have any active tasks"}
                    </p>
                    <Button onClick={() => navigate('/tasks/new')} className="animated-button">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Task
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="urgent">
                {urgentTasks.length > 0 ? (
                  <div className="task-grid">
                    {urgentTasks.map((task, index) => (
                      <div 
                        key={task.id} 
                        className={cn(
                          "opacity-0 translate-y-4",
                          activeTab === 'urgent' && "animate-fade-in opacity-100 translate-y-0"
                        )}
                        style={{animationDelay: `${100 + index * 50}ms`}}
                      >
                        <TaskCard task={task} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border rounded-lg bg-card/50 backdrop-blur-sm">
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
                    {completedTasks.map((task, index) => (
                      <div 
                        key={task.id} 
                        className={cn(
                          "opacity-0 translate-y-4",
                          activeTab === 'completed' && "animate-fade-in opacity-100 translate-y-0"
                        )}
                        style={{animationDelay: `${100 + index * 50}ms`}}
                      >
                        <TaskCard task={task} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border rounded-lg bg-card/50 backdrop-blur-sm">
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
        
        <div 
          className="w-full md:w-1/4 lg:w-1/3 space-y-6 opacity-0 animate-fade-in"
          style={{animationDelay: '700ms'}}
        >
          <Card className="overflow-hidden border-2 border-accent/30 hover:border-accent/50 transition-all duration-300 bg-gradient-to-br from-accent/5 to-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Break down large tasks into smaller, more manageable subtasks",
                  "Use the urgent priority for only 1-2 tasks at a time",
                  "Set specific due dates to help with time management",
                  "Try the AI assistant to automatically break down complex tasks",
                  "Complete the smallest subtask first to build momentum",
                ].map((tip, index) => (
                  <li 
                    key={index} 
                    className="flex items-start gap-2 text-sm p-2 hover:bg-accent/10 rounded-md transition-colors"
                  >
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-accent/20 text-xs mt-0.5">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 overflow-hidden relative bg-gradient-to-br from-primary/5 to-background">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
            <CardHeader className="pb-2 relative">
              <CardTitle className="text-lg font-medium flex items-center">
                <Brain className="mr-2 h-5 w-5 text-primary" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-muted-foreground mb-4">
                Let our AI assistant help you break down complex tasks into manageable steps
              </p>
              <Button 
                className="w-full relative overflow-hidden group" 
                onClick={() => navigate('/ai-assistant')}
              >
                <span className="relative z-10 flex items-center">
                  <Brain className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  Try AI Assistant
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animated-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
        }
        
        .animated-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .animated-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }
        
        .animated-button:hover::before {
          transform: translateX(100%);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
