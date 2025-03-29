import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCard from '@/components/TaskCard';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '@/types/task';

const ScheduledPage = () => {
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Get tasks with due dates
  const tasksWithDueDates = tasks.filter(task => task.dueDate);
  
  // Filter tasks for the selected date
  const tasksForSelectedDate = tasksWithDueDates.filter(task => {
    if (!selectedDate || !task.dueDate) return false;
    
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getDate() === selectedDate.getDate() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getFullYear() === selectedDate.getFullYear()
    );
  });
  
  // Get dates that have tasks
  const datesWithTasks = tasksWithDueDates.reduce((dates, task) => {
    if (task.dueDate) {
      const dateStr = format(new Date(task.dueDate), 'yyyy-MM-dd');
      dates.add(dateStr);
    }
    return dates;
  }, new Set<string>());
  
  // Sort tasks for the selected date by priority
  const sortedTasks = [...tasksForSelectedDate].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  // Get upcoming tasks (due in the next 7 days)
  const today = new Date();
  const oneWeekLater = new Date();
  oneWeekLater.setDate(today.getDate() + 7);
  
  const upcomingTasks = tasksWithDueDates.filter(task => {
    if (!task.dueDate) return false;
    
    const taskDate = new Date(task.dueDate);
    return taskDate >= today && taskDate <= oneWeekLater;
  }).sort((a, b) => {
    // Sort by date first
    const dateA = new Date(a.dueDate!);
    const dateB = new Date(b.dueDate!);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    
    // If dates are the same, sort by priority
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  // Get overdue tasks
  const overdueTasks = tasksWithDueDates.filter(task => {
    if (!task.dueDate || task.completed) return false;
    
    const taskDate = new Date(task.dueDate);
    return taskDate < new Date(today.setHours(0, 0, 0, 0));
  }).sort((a, b) => {
    // Sort by date (oldest first)
    const dateA = new Date(a.dueDate!);
    const dateB = new Date(b.dueDate!);
    return dateA.getTime() - dateB.getTime();
  });

  // Group upcoming tasks by date
  const groupedUpcomingTasks: Record<string, Task[]> = {};
  upcomingTasks.forEach(task => {
    if (!task.dueDate) return;
    const dateStr = format(new Date(task.dueDate), 'yyyy-MM-dd');
    if (!groupedUpcomingTasks[dateStr]) {
      groupedUpcomingTasks[dateStr] = [];
    }
    groupedUpcomingTasks[dateStr].push(task);
  });

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Scheduled Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks by due date</p>
        </div>
        <Button onClick={() => navigate('/tasks/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 h-fit">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
              }}
              modifiers={{
                hasTasks: (date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  return datesWithTasks.has(dateStr);
                },
              }}
              modifiersClassNames={{
                hasTasks: 'border-2 border-primary',
              }}
            />
            
            <div className="mt-4">
              <h3 className="font-medium mb-2 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </h3>
              
              {tasksForSelectedDate.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tasks scheduled for this date
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {tasksForSelectedDate.length} task{tasksForSelectedDate.length !== 1 ? 's' : ''} scheduled
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="col-span-1 lg:col-span-2">
          <Tabs defaultValue="selected">
            <TabsList className="mb-6">
              <TabsTrigger value="selected">
                Selected Day ({tasksForSelectedDate.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingTasks.length})
              </TabsTrigger>
              <TabsTrigger value="overdue">
                Overdue ({overdueTasks.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="selected">
              {sortedTasks.length > 0 ? (
                <div className="task-grid">
                  {sortedTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    No tasks for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'this date'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Schedule a task for this date to see it here
                  </p>
                  <Button onClick={() => navigate('/tasks/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Task
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upcoming">
              {upcomingTasks.length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedUpcomingTasks).map(([dateStr, tasks]) => (
                    <div key={dateStr}>
                      <h3 className="font-medium mb-3">
                        {format(new Date(tasks[0].dueDate!), 'EEEE, MMMM d')}
                      </h3>
                      <div className="task-grid">
                        {tasks.map(task => (
                          <TaskCard key={task.id} task={task} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No upcoming tasks</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any tasks due in the next 7 days
                  </p>
                  <Button onClick={() => navigate('/tasks/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Task with Due Date
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="overdue">
              {overdueTasks.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-destructive mb-4">
                    You have {overdueTasks.length} overdue task{overdueTasks.length !== 1 ? 's' : ''}. 
                    Consider updating the due dates or completing them.
                  </p>
                  <div className="task-grid">
                    {overdueTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No overdue tasks</h3>
                  <p className="text-muted-foreground">
                    Great job! You're all caught up with your tasks
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ScheduledPage;
