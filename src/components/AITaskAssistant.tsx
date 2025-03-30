
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOpenRouterStore } from '@/store/openRouterStore';
import { getOpenRouterService } from '@/services/openRouterService';
import { useTaskStore } from '@/store/taskStore';
import { toast } from 'sonner';
import { Brain, Loader2, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AITaskAssistantProps {
  onTasksCreated?: () => void;
}

const AITaskAssistant = ({ onTasksCreated }: AITaskAssistantProps) => {
  const navigate = useNavigate();
  const { credentials } = useOpenRouterStore();
  const { addTask } = useTaskStore();
  
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateTasks = useCallback(async () => {
    if (!credentials.apiKey || !credentials.isValid) {
      setError('Please configure your OpenRouter API key in Settings first');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a task description');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedTasks([]);

    try {
      const openRouterService = getOpenRouterService(credentials.apiKey);
      
      const systemPrompt = `You are a task breakdown assistant for people with ADHD and procrastination issues. 
      Break down the user's complex task into 3-7 smaller, actionable subtasks. 
      Each subtask must be clear, specific, and small enough to be completed in a single session. 
      Respond ONLY with a numbered list of tasks, one per line. Do not include any other text.`;
      
      const response = await openRouterService.createCompletion({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      const content = response.choices[0].message.content;
      
      // Parse the numbered list of tasks
      const taskLines = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => /^\d+\./.test(line))
        .map(line => line.replace(/^\d+\.\s*/, ''));
      
      setGeneratedTasks(taskLines);
    } catch (error) {
      console.error('Error generating tasks:', error);
      setError(`Failed to generate tasks: ${(error as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, credentials.apiKey, credentials.isValid]);

  const handleCreateTasks = () => {
    if (generatedTasks.length === 0) return;
    
    generatedTasks.forEach(task => {
      addTask(task);
    });
    
    toast.success(`Created ${generatedTasks.length} tasks successfully`);
    setGeneratedTasks([]);
    setPrompt('');
    
    if (onTasksCreated) {
      onTasksCreated();
    }
    
    // Navigate to tasks page
    navigate('/tasks');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Describe your project or challenge below, and the AI will break it down into manageable tasks.
        </p>
        
        <Textarea
          placeholder="E.g., I need to create a presentation for my work meeting on Friday about our quarterly results"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-32"
        />
        
        {!credentials.isValid && (
          <div className="flex items-center gap-2 text-amber-600 text-sm mt-2">
            <AlertCircle className="h-4 w-4" />
            <span>
              OpenRouter API key not configured. 
              <Button 
                variant="link" 
                onClick={() => navigate('/settings')} 
                className="h-auto p-0 text-primary"
              >
                Configure in Settings
              </Button>
            </span>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            onClick={generateTasks} 
            disabled={isGenerating || !prompt.trim() || !credentials.isValid}
            className="relative overflow-hidden group"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Tasks...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Generate Tasks
              </>
            )}
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 opacity-0 group-hover:opacity-10 transition-opacity"></span>
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {generatedTasks.length > 0 && (
        <div className="animate-in fade-in duration-300">
          <Separator className="my-4" />
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Generated Tasks</h3>
          </div>
          
          <Card>
            <CardContent className="p-4 space-y-2">
              {generatedTasks.map((task, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-background rounded-md border flex items-start gap-2 animate-in fade-in duration-300 slide-in-from-bottom-3"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p>{task}</p>
                </div>
              ))}
              
              <div className="flex justify-end pt-2">
                <Button onClick={handleCreateTasks} className="gap-1">
                  Create Tasks
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AITaskAssistant;
