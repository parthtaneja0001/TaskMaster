import React, { useState } from 'react';
import { Plus, Search, Filter, Mic } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import TaskForm from '../components/tasks/TaskForm';
import TaskItem from '../components/tasks/TaskItem';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import IconButton from '../components/ui/IconButton';
import useTasksStore from '../store/tasksStore';
import { Task, Priority, TaskStatus } from '../types';

const TasksPage: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, completeTask, filterTasks } = useTasksStore();
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState<Priority | undefined>(undefined);

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      addTask(taskData);
      setIsFormVisible(false);
    }
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormVisible(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleCreateTask = () => {
    setIsFormVisible(true);
    setEditingTask(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore - Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        const taskTitle = speechResult.charAt(0).toUpperCase() + speechResult.slice(1);
        
        addTask({
          title: taskTitle,
          description: '',
          priority: 'medium',
          status: 'todo',
        });
      };
      
      recognition.start();
    } else {
      alert("Speech recognition is not supported in your browser");
    }
  };
  
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter(undefined);
    setPriorityFilter(undefined);
  };
  
  const filteredTasks = filterTasks(statusFilter, priorityFilter, searchQuery);
  
  // Group tasks by status
  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  
  return (
    <PageContainer
      title="Tasks"
      description="Manage your tasks and stay organized"
      actions={
        <div className="flex gap-2">
          <IconButton
            variant="ghost"
            icon={<Mic className="h-5 w-5" />}
            onClick={handleVoiceInput}
            tooltip="Add task with voice"
          />
          <Button 
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleCreateTask}
          >
            Add Task
          </Button>
        </div>
      }
    >
      {/* Edit Form */}
      {editingTask && (
        <TaskForm 
          onSubmit={handleTaskSubmit}
          initialTask={editingTask}
          onCancel={handleCancelEdit}
        />
      )}
      
      {/* New Task Form */}
      {isFormVisible && !editingTask && (
        <TaskForm 
          onSubmit={handleTaskSubmit}
          onCancel={() => setIsFormVisible(false)}
        />
      )}
      
      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4 text-gray-400" />}
                fullWidth
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter || ''}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus || undefined)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              
              <select
                value={priorityFilter || ''}
                onChange={(e) => setPriorityFilter(e.target.value as Priority || undefined)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              
              <Button
                variant="outline"
                size="sm"
                icon={<Filter className="h-4 w-4" />}
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Tasks Lists */}
      <div className="space-y-8">
        {/* To Do Tasks */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <span className="h-2 w-2 rounded-full bg-primary-500 mr-2"></span>
            To Do ({todoTasks.length})
          </h2>
          
          {todoTasks.length > 0 ? (
            <div className="space-y-3">
              {todoTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No to-do tasks found</p>
          )}
        </div>
        
        {/* In Progress Tasks */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <span className="h-2 w-2 rounded-full bg-warning-500 mr-2"></span>
            In Progress ({inProgressTasks.length})
          </h2>
          
          {inProgressTasks.length > 0 ? (
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No in-progress tasks found</p>
          )}
        </div>
        
        {/* Completed Tasks */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <span className="h-2 w-2 rounded-full bg-success-500 mr-2"></span>
            Completed ({completedTasks.length})
          </h2>
          
          {completedTasks.length > 0 ? (
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No completed tasks found</p>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default TasksPage;