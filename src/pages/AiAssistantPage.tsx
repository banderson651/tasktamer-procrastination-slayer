
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AITaskAssistant from '@/components/AITaskAssistant';

const AiAssistantPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('breakdown');

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
        <h1 className="text-3xl font-bold mb-1">AI Assistant</h1>
        <p className="text-muted-foreground">Use AI to help break down complex tasks</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Task Assistant</CardTitle>
          <CardDescription>
            Let our AI help you break down complex projects into manageable tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="breakdown">Task Breakdown</TabsTrigger>
              <TabsTrigger value="tips" disabled>Tips & Advice</TabsTrigger>
            </TabsList>
            
            <TabsContent value="breakdown" className="space-y-4">
              <AITaskAssistant />
            </TabsContent>
            
            <TabsContent value="tips">
              <p>Coming soon...</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiAssistantPage;
