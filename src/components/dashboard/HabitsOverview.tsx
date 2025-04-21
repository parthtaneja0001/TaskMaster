import React from 'react';
import { Flame, Check, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import useHabitsStore from '../../store/habitsStore';

const HabitsOverview: React.FC = () => {
  const { habits } = useHabitsStore();
  
  // Get completed habits for today
  const today = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter(habit => 
    habit.completedDates.some(date => date.toISOString().split('T')[0] === today)
  );
  
  // Get uncompleted habits for today
  const uncompletedToday = habits.filter(habit => 
    !habit.completedDates.some(date => date.toISOString().split('T')[0] === today)
  );
  
  // Get top streaks
  const topStreaks = [...habits]
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 3);
  
  // Completion rate
  const completionRate = habits.length > 0 
    ? Math.round((completedToday.length / habits.length) * 100) 
    : 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Habits Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Today's Progress
              </span>
              <span className="text-sm font-medium">
                {completedToday.length}/{habits.length} ({completionRate}%)
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent-500 rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center text-success-500 dark:text-success-300 mr-3">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-lg font-semibold">{completedToday.length}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 dark:text-primary-300 mr-3">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
                <p className="text-lg font-semibold">{uncompletedToday.length}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Top Streaks</h4>
            {topStreaks.length > 0 ? (
              <ul className="space-y-3">
                {topStreaks.map(habit => (
                  <li key={habit.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center text-accent-500 dark:text-accent-300 mr-3">
                        <Flame className="h-5 w-5" />
                      </div>
                      <span className="text-sm truncate">{habit.name}</span>
                    </div>
                    <span className="font-medium">{habit.streak} days</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No habits with streaks yet</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitsOverview;