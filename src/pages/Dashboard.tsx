import React, { useState } from 'react';
import { CheckSquare, BarChart, FileText, 
  Clock, Plus, Sparkles } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import TasksOverview from '../components/dashboard/TasksOverview';
import HabitsOverview from '../components/dashboard/HabitsOverview';
import StatsCard from '../components/dashboard/StatsCard';
import AISuggestions from '../components/dashboard/AISuggestions';
import useTasksStore from '../store/tasksStore';
import useHabitsStore from '../store/habitsStore';
import useNotesStore from '../store/notesStore';
import useAuthStore from '../store/authStore';
import { getGreeting } from '../lib/utils';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();
  const { notes } = useNotesStore();
  const { user } = useAuthStore();
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  
  // Get completed tasks for today
  const today = new Date().toISOString().split('T')[0];
  const completedToday = tasks.filter(
    task => task.status === 'completed' && 
    new Date(task.createdAt).toISOString().split('T')[0] === today
  );
  
  // Get pinned notes
  const pinnedNotes = notes.filter(note => note.isPinned);

  const handleAISuggestions = () => {
    setShowAISuggestions(!showAISuggestions);
  };

  return (
    <PageContainer
      title={`${getGreeting()}, ${user?.displayName || 'User'}!`}
      description="Your productivity dashboard for today"
      actions={
        <Button 
          variant="primary"
          icon={<Sparkles className="h-4 w-4" />}
          onClick={handleAISuggestions}
        >
          AI Suggestions
        </Button>
      }
    >
      {showAISuggestions && (
        <div className="mb-6">
          <AISuggestions />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Tasks"
          value={tasks.length}
          icon={<CheckSquare className="h-5 w-5" />}
          trend={{
            value: 12,
            isPositive: true
          }}
          description="vs. last week"
        />
        
        <StatsCard 
          title="Active Habits"
          value={habits.length}
          icon={<BarChart className="h-5 w-5" />}
          trend={{
            value: 8,
            isPositive: true
          }}
          description="vs. last month"
        />
        
        <StatsCard 
          title="Task Completion"
          value={`${Math.round((completedToday.length / (completedToday.length + tasks.filter(t => t.status !== 'completed').length)) * 100)}%`}
          icon={<Clock className="h-5 w-5" />}
          trend={{
            value: 5,
            isPositive: true
          }}
          description="vs. yesterday"
        />
        
        <StatsCard 
          title="Notes"
          value={notes.length}
          icon={<FileText className="h-5 w-5" />}
          description={`${pinnedNotes.length} pinned`}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <TasksOverview />
        <HabitsOverview />
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Card 
            className="bg-primary-50 dark:bg-gray-800 hover:shadow-md cursor-pointer transition-shadow"
            onClick={() => onNavigate('tasks')}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 dark:text-primary-300 mb-3">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="font-medium">New Task</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create a new task</p>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-secondary-50 dark:bg-gray-800 hover:shadow-md cursor-pointer transition-shadow"
            onClick={() => onNavigate('habits')}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center text-secondary-500 dark:text-secondary-300 mb-3">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="font-medium">New Habit</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create a habit to track</p>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-accent-50 dark:bg-gray-800 hover:shadow-md cursor-pointer transition-shadow"
            onClick={() => onNavigate('notes')}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center text-accent-500 dark:text-accent-300 mb-3">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="font-medium">New Note</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Write a new note</p>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-gray-50 dark:bg-gray-800 hover:shadow-md cursor-pointer transition-shadow"
            onClick={() => onNavigate('calendar')}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 mb-3">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-medium">Calendar</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View your schedule</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;