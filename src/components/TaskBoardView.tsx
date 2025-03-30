import { useState, useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Task, Status } from '@/types/task';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskCard from '@/components/TaskCard';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle, Filter, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const TaskBoardView = ({ tasks }: { tasks: Task[] }) => {
  const navigate = useNavigate();
  const { changeTaskStatus } = useTaskStore();
  const [highlightedColumn, setHighlightedColumn] = useState<Status | null>(null);
  
  const columns: { id: Status; title: string }[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Done' }
  ];
  
  const getTasksByStatus = (status: Status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    setHighlightedColumn(null);

    // Dropped outside the list
    if (!destination) return;

    // Dropped in the same list at the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Get the status from the droppable ID
    const newStatus = destination.droppableId as Status;
    
    // Update the task status
    changeTaskStatus(draggableId, newStatus);
    
    toast.success(`Task moved to ${columns.find(col => col.id === newStatus)?.title || newStatus.replace('_', ' ')}`);
  };

  const handleDragStart = (result: any) => {
    const { source } = result;
    setHighlightedColumn(source.droppableId as Status);
  };

  // Fixed: Handler for creating a new task - ensure we're using the correct route
  const handleCreateNewTask = () => {
    navigate('/tasks/new');
  };

  // Filter options for future implementation
  const filterOptions = [
    { label: 'All Tasks', value: 'all' },
    { label: 'My Tasks', value: 'assigned' },
    { label: 'High Priority', value: 'high' },
  ];

  return (
    <div className="mt-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Kanban Board</h2>
          <Badge variant="outline" className="text-xs">Drag & Drop</Badge>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-4 w-4 mr-1" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {filterOptions.map((option) => (
                <DropdownMenuItem key={option.value}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="default" size="sm" className="h-8" onClick={handleCreateNewTask}>
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 overflow-x-auto">
          {columns.map(column => (
            <div key={column.id} className="flex flex-col min-w-[270px]">
              <Card 
                className={`bg-muted/40 border ${
                  highlightedColumn === column.id 
                    ? 'ring-2 ring-primary ring-opacity-50' 
                    : ''
                }`}
              >
                <CardHeader className="pb-1">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium flex items-center">
                      {column.title}
                      <span className="ml-2 text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                        {getTasksByStatus(column.id).length}
                      </span>
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      {column.id === 'todo' && (
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCreateNewTask}>
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem>Sort by Due Date</DropdownMenuItem>
                          <DropdownMenuItem>Sort by Priority</DropdownMenuItem>
                          <DropdownMenuItem>Collapse Column</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] transition-colors rounded-md ${
                          snapshot.isDraggingOver ? 'bg-muted/80' : ''
                        }`}
                      >
                        {getTasksByStatus(column.id).length === 0 ? (
                          <div className="flex items-center justify-center h-20 border border-dashed rounded-lg">
                            <p className="text-sm text-muted-foreground">No tasks</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {getTasksByStatus(column.id).map((task, index) => (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`transition-all ${
                                      snapshot.isDragging ? 'rotate-1 scale-105 shadow-lg' : ''
                                    }`}
                                  >
                                    <TaskCard task={task} />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </DragDropContext>
      
      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 mt-8 border rounded-lg border-dashed text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first task to get started with your Kanban board
          </p>
          <Button onClick={handleCreateNewTask}>
            <Plus className="mr-2 h-4 w-4" />
            Create First Task
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskBoardView;
