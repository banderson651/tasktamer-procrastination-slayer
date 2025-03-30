
import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Task, Status } from '@/types/task';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskCard from '@/components/TaskCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const TaskBoardView = ({ tasks }: { tasks: Task[] }) => {
  const navigate = useNavigate();
  const { changeTaskStatus } = useTaskStore();
  
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
    
    toast.success(`Task moved to ${newStatus.replace('_', ' ')}`);
  };

  return (
    <div className="mt-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map(column => (
            <div key={column.id} className="flex flex-col">
              <Card className="bg-muted/40 border">
                <CardHeader className="pb-1">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium flex items-center">
                      {column.title}
                      <span className="ml-2 text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                        {getTasksByStatus(column.id).length}
                      </span>
                    </CardTitle>
                    {column.id === 'todo' && (
                      <Button variant="ghost" size="sm" onClick={() => navigate('/tasks/new')}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-[200px]"
                      >
                        {getTasksByStatus(column.id).length === 0 ? (
                          <div className="flex items-center justify-center h-20 border border-dashed rounded-lg">
                            <p className="text-sm text-muted-foreground">No tasks</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {getTasksByStatus(column.id).map((task, index) => (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
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
    </div>
  );
};

export default TaskBoardView;
