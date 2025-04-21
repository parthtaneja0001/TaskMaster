import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import useTasksStore from '../../store/tasksStore';

const TasksOverview: React.FC = () => {
  const { tasks, filterTasks } = useTasksStore();
  
  // Get tasks by status
  const completedTasks = filterTasks('completed');
  const pendingTasks = filterTasks('todo');
  const inProgressTasks = filterTasks('in-progress');
  
  // Get tasks by priority
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && task.status !== 'completed');
  
  // Get overdue tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const overdueTasks = tasks.filter(
    task => task.status !== 'completed' && 
    task.dueDate && 
    new Date(task.dueDate) < today
  );
  
  // Get upcoming tasks
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(23, 59, 59, 999);
  
  const upcomingTasks = tasks.filter(
    task => task.status !== 'completed' && 
    task.dueDate && 
    new Date(task.dueDate) >= today && 
    new Date(task.dueDate) <= tomorrow
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Tasks Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center text-success-500 dark:text-success-300 mr-3">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-lg font-semibold">{completedTasks.length}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 dark:text-primary-300 mr-3">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-lg font-semibold">{pendingTasks.length + inProgressTasks.length}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-warning-100 dark:bg-warning-900 flex items-center justify-center text-warning-500 dark:text-warning-300 mr-3">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">High Priority</p>
                <p className="text-lg font-semibold">{highPriorityTasks.length}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-danger-100 dark:bg-danger-900 flex items-center justify-center text-danger-500 dark:text-danger-300 mr-3">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Overdue</p>
                <p className="text-lg font-semibold">{overdueTasks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Due Today/Tomorrow</h4>
            {upcomingTasks.length > 0 ? (
              <ul className="space-y-2">
                {upcomingTasks.slice(0, 3).map(task => (
                  <li key={task.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${
                        task.priority === 'high' 
                          ? 'bg-danger-500' 
                          : task.priority === 'medium' 
                            ? 'bg-warning-500' 
                            : 'bg-success-500'
                      }`} />
                      <span className="truncate">{task.title}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(task.dueDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </li>
                ))}
                {upcomingTasks.length > 3 && (
                  <li className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                    + {upcomingTasks.length - 3} more
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming tasks</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksOverview;