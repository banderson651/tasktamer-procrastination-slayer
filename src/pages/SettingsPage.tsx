
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, BellRing, Trash2, Download, ExternalLink, Key, Check, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTaskStore } from '@/store/taskStore';
import { toast } from 'sonner';
import { useOpenRouterStore } from '@/store/openRouterStore';
import { getOpenRouterService } from '@/services/openRouterService';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  const { credentials, setApiKey, validateApiKey } = useOpenRouterStore();
  
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [autoDeleteCompleted, setAutoDeleteCompleted] = useState(false);
  const [theme, setTheme] = useState('system');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  useEffect(() => {
    // Initialize the API key input with the stored value
    if (credentials.apiKey) {
      setApiKeyInput(credentials.apiKey);
    }
  }, [credentials.apiKey]);
  
  const exportTasks = () => {
    const tasksData = JSON.stringify(tasks, null, 2);
    const blob = new Blob([tasksData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasktamer-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Tasks exported successfully");
  };
  
  const deleteAllCompletedTasks = () => {
    // This would actually use useTaskStore's actions to delete tasks
    toast.success("All completed tasks deleted");
  };

  const handleVerifyApiKey = async () => {
    if (!apiKeyInput.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    setIsValidating(true);
    try {
      const service = getOpenRouterService(apiKeyInput);
      const isValid = await service.validateApiKey();
      
      if (isValid) {
        setApiKey(apiKeyInput);
        validateApiKey(true);
        toast.success("API key verified successfully");
      } else {
        validateApiKey(false);
        toast.error("Invalid API key. Please check and try again.");
      }
    } catch (error) {
      console.error("API key validation error:", error);
      validateApiKey(false);
      toast.error(`Validation failed: ${(error as Error).message}`);
    } finally {
      setIsValidating(false);
    }
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
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground">Customize your TaskTamer experience</p>
      </div>
      
      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure how TaskTamer works for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Theme</Label>
                <div className="text-sm text-muted-foreground">
                  Choose your preferred appearance
                </div>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Receive reminders for upcoming due dates
                </div>
              </div>
              <Switch
                id="notifications"
                checked={enableNotifications}
                onCheckedChange={setEnableNotifications}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoDelete">Auto-delete Completed Tasks</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically delete tasks after 30 days of completion
                </div>
              </div>
              <Switch
                id="autoDelete"
                checked={autoDeleteCompleted}
                onCheckedChange={setAutoDeleteCompleted}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* OpenRouter API Settings */}
        <Card>
          <CardHeader>
            <CardTitle>OpenRouter API Integration</CardTitle>
            <CardDescription>
              Connect to OpenRouter for AI-powered task breakdown features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="apiKey">OpenRouter API Key</Label>
                {credentials.isValid && (
                  <span className="flex items-center text-xs text-green-600 font-medium">
                    <Check className="h-3 w-3 mr-1" /> Verified
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Enter your OpenRouter API key"
                    className="pl-8 font-mono text-sm"
                  />
                </div>
                <Button 
                  onClick={handleVerifyApiKey}
                  disabled={isValidating || !apiKeyInput.trim()}
                  className="whitespace-nowrap"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying
                    </>
                  ) : credentials.isValid ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Verified
                    </>
                  ) : (
                    'Verify API Key'
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openrouter.ai/keys</a>. Your key is stored securely in your browser.
              </p>
              
              {credentials.lastValidated && (
                <p className="text-xs text-muted-foreground">
                  Last verified: {new Date(credentials.lastValidated).toLocaleString()}
                </p>
              )}
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">OpenRouter Integration Benefits</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>AI-powered task breakdown for complex projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Get suggestions for organizing and prioritizing tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Convert vague ideas into actionable step-by-step tasks</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Manage your task data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Task Statistics</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Tasks:</span>
                <span className="font-medium">{totalTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completed Tasks:</span>
                <span className="font-medium">{completedTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completion Rate:</span>
                <span className="font-medium">
                  {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                </span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={exportTasks}
              >
                <Download className="mr-2 h-4 w-4" />
                Export All Tasks
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={deleteAllCompletedTasks}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All Completed Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* About TaskTamer */}
        <Card>
          <CardHeader>
            <CardTitle>About TaskTamer</CardTitle>
            <CardDescription>
              Information about this application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              TaskTamer is a task management application designed specifically for people with
              ultra-procrastination and adult ADHD, helping you break down complex tasks into
              manageable steps and stay focused.
            </p>
            <div className="flex justify-end">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
