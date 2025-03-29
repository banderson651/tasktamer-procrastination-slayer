
import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AITaskBreakdownProps {
  taskId: string;
}

const EXAMPLE_SUBTASKS = [
  "Research current social media platforms",
  "Identify target audience demographics",
  "Create a content calendar template",
  "Design 3 sample posts for Instagram",
  "Draft engagement strategy document"
];

const AITaskBreakdown = ({ taskId }: AITaskBreakdownProps) => {
  const { tasks, addSubtask } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedSubtasks, setGeneratedSubtasks] = useState<string[]>([]);
  
  const task = tasks.find(t => t.id === taskId);
  
  // This would be replaced with actual API integration
  const simulateAIGeneration = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an OpenRouter API key");
      return;
    }
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate subtasks");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock subtasks based on the task title and prompt
      const simulatedSubtasks = [
        `Research best practices for ${task?.title}`,
        `Create outline for ${task?.title}`,
        `Gather resources needed for ${task?.title}`,
        `Schedule specific time blocks for focused work`,
        `Set up environment for minimal distractions`,
        `Break down ${task?.title} into 25-minute work sessions`,
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
  
  const addGeneratedSubtasks = () => {
    if (generatedSubtasks.length === 0) {
      toast.error("No subtasks to add. Generate some first!");
      return;
    }
    
    generatedSubtasks.forEach(subtaskTitle => {
      addSubtask(taskId, subtaskTitle);
    });
    
    toast.success(`Added ${generatedSubtasks.length} subtasks to your task!`);
    setGeneratedSubtasks([]);
  };
  
  const addExampleSubtask = (subtaskTitle: string) => {
    addSubtask(taskId, subtaskTitle);
    toast.success(`Added subtask: ${subtaskTitle}`);
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">AI Task Breakdown</CardTitle>
          </div>
        </div>
        <CardDescription>
          Let AI help you break down your task into manageable subtasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="generate">Generate Subtasks</TabsTrigger>
            <TabsTrigger value="examples">Example Breakdowns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4">
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
              <label className="text-sm font-medium">Prompt</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Help me break down this task: "${task?.title || 'My task'}". I need specific actionable subtasks.`}
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
                <div className="flex justify-end">
                  <Button onClick={addGeneratedSubtasks}>
                    Add All Subtasks
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="examples">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Here are some example subtasks for breaking down work. Click one to add it to your task.
              </p>
              <div className="grid gap-2">
                {EXAMPLE_SUBTASKS.map((subtask, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => addExampleSubtask(subtask)}
                  >
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-muted text-xs mr-2">
                      {index + 1}
                    </span>
                    {subtask}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AITaskBreakdown;
