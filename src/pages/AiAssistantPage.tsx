
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Sparkles, Loader2 } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { toast } from 'sonner';

const AiAssistantPage = () => {
  const navigate = useNavigate();
  const { addTask } = useTaskStore();
  const [apiKey, setApiKey] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSubtasks, setGeneratedSubtasks] = useState<string[]>([]);
  
  // This would be replaced with actual OpenRouter API integration
  const simulateAIGeneration = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an OpenRouter API key");
      return;
    }
    
    if (!taskTitle.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock subtasks based on the task title
      const simulatedSubtasks = [
        `Research best practices for ${taskTitle}`,
        `Create outline for ${taskTitle}`,
        `Gather resources needed for ${taskTitle}`,
        `Schedule specific time blocks for focused work`,
        `Set up environment for minimal distractions`,
        `Break down ${taskTitle} into 25-minute work sessions`,
        `Plan for regular breaks to maintain focus`,
        `Identify potential obstacles and solutions`,
      ];
      
      setGeneratedSubtasks(simulatedSubtasks);
      toast.success("Generated subtasks successfully!");
    } catch (error) {
      toast.error("Failed to generate subtasks. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const createTaskWithSubtasks = () => {
    if (generatedSubtasks.length === 0) {
      toast.error("No subtasks to add. Generate some first!");
      return;
    }
    
    const newTask = addTask(
      taskTitle,
      taskDescription,
      'medium'
    );
    
    generatedSubtasks.forEach(subtaskTitle => {
      useTaskStore.getState().addSubtask(newTask.id, subtaskTitle);
    });
    
    toast.success(`Created task with ${generatedSubtasks.length} subtasks!`);
    navigate(`/tasks/${newTask.id}`);
  };
  
  const resetForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setGeneratedSubtasks([]);
  };
  
  // Example task ideas for inspiration
  const taskIdeas = [
    "Create a social media marketing plan",
    "Plan a home renovation project",
    "Organize a team building event",
    "Write a research paper on climate change",
    "Develop a personal finance tracking system",
    "Plan a family vacation",
    "Launch a personal blog"
  ];
  
  const useTaskIdea = (idea: string) => {
    setTaskTitle(idea);
    setTaskDescription('');
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
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-bold">AI Assistant</h1>
        </div>
        <p className="text-muted-foreground">
          Let AI help you break down complex tasks into manageable steps
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="generate">
            <TabsList className="mb-6">
              <TabsTrigger value="generate">Generate Subtasks</TabsTrigger>
              <TabsTrigger value="ideas">Task Ideas</TabsTrigger>
              <TabsTrigger value="about">About AI Assistant</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">OpenRouter API Key</label>
                  <Input
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    type="password"
                    placeholder="Enter your OpenRouter API key"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your API key is used only for this request and is not stored
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Task Title</label>
                  <Input
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Enter your task title"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Task Description (Optional)</label>
                  <Textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Add more details about this task (helps AI generate better subtasks)"
                    className="min-h-24"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={simulateAIGeneration} 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Subtasks
                      </>
                    )}
                  </Button>
                </div>
                
                {generatedSubtasks.length > 0 && (
                  <div className="space-y-4 mt-6 p-4 border rounded-lg">
                    <h3 className="font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent" />
                      Generated Subtasks
                    </h3>
                    <ul className="space-y-2">
                      {generatedSubtasks.map((subtask, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-muted text-xs">
                            {index + 1}
                          </span>
                          <span>{subtask}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={resetForm}
                      >
                        Reset
                      </Button>
                      <Button 
                        onClick={createTaskWithSubtasks}
                      >
                        Create Task with Subtasks
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="ideas">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Not sure what to create? Here are some task ideas you can use as a starting point:
                </p>
                <div className="grid gap-2">
                  {taskIdeas.map((idea, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="justify-start h-auto py-3 px-4"
                      onClick={() => useTaskIdea(idea)}
                    >
                      {idea}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="about">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">How the AI Assistant Works</h3>
                  <p className="text-muted-foreground">
                    The AI Assistant uses advanced language models to help you break down tasks into smaller, 
                    more manageable subtasks. This is especially helpful for people with ADHD or 
                    procrastination challenges.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Benefits for ADHD and Procrastination</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-muted text-xs mt-0.5">
                        1
                      </span>
                      <span>Reduces overwhelm by breaking large tasks into small steps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-muted text-xs mt-0.5">
                        2
                      </span>
                      <span>Provides clear starting points to overcome initiation paralysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-muted text-xs mt-0.5">
                        3
                      </span>
                      <span>Creates a structured approach for better focus and completion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-muted text-xs mt-0.5">
                        4
                      </span>
                      <span>Builds momentum through completion of small tasks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-muted text-xs mt-0.5">
                        5
                      </span>
                      <span>Provides a sense of accomplishment with each completed subtask</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiAssistantPage;
