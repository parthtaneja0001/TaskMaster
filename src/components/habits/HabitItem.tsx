import React from 'react';
import { Edit, Trash2, CheckCircle } from 'lucide-react';
import { Habit } from '../../types';
import { formatDate } from '../../lib/utils';
import { Card } from '../ui/Card';
import Badge from '../ui/Badge';
import IconButton from '../ui/IconButton';

interface HabitItemProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (habit: Habit) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  onComplete,
  onDelete,
  onEdit,
}) => {
  const { id, name, description, frequency, streak, completedDates, color } = habit;
  
  // Check if completed today
  const today = new Date().toISOString().split('T')[0];
  const completedToday = completedDates.some(
    date => date.toISOString().split('T')[0] === today
  );
  
  // Get last completed date
  const lastCompletedDate = completedDates.length > 0 
    ? new Date(Math.max(...completedDates.map(d => d.getTime())))
    : null;
  
  // Get frequency label
  const frequencyLabel = {
    'daily': 'Daily',
    'weekly': 'Weekly',
    'monthly': 'Monthly'
  }[frequency];
  
  // Get streak color
  const getStreakColor = () => {
    if (streak >= 10) return 'text-accent-500';
    if (streak >= 5) return 'text-success-500';
    return 'text-gray-600 dark:text-gray-400';
  };
  
  // Get card border based on completion
  const getBorderStyle = () => {
    if (completedToday) {
      return 'border-l-4 border-l-success-500';
    }
    if (color) {
      return `border-l-4 border-l-${color}-500`;
    }
    return '';
  };

  return (
    <Card 
      className={`transition-all hover:shadow-lg ${getBorderStyle()}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onComplete(id)}
          className={`mt-1 flex-shrink-0 h-6 w-6 rounded-full ${
            completedToday
              ? 'bg-success-100 text-success-500 dark:bg-success-900 dark:text-success-300'
              : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
          } flex items-center justify-center`}
          aria-label={completedToday ? 'Completed for today' : 'Mark as completed for today'}
        >
          <CheckCircle className="h-5 w-5" />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {name}
            </h3>
            
            <div className="flex items-center space-x-1 ml-2">
              <IconButton
                size="sm"
                variant="ghost"
                icon={<Edit className="h-4 w-4" />}
                onClick={() => onEdit(habit)}
                tooltip="Edit habit"
              />
              <IconButton
                size="sm"
                variant="ghost"
                icon={<Trash2 className="h-4 w-4 text-danger-500" />}
                onClick={() => onDelete(id)}
                tooltip="Delete habit"
              />
            </div>
          </div>
          
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
          
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge 
              variant="primary"
              size="sm"
            >
              {frequencyLabel}
            </Badge>
            
            <div className={`text-sm font-medium ${getStreakColor()}`}>
              {streak} day{streak !== 1 ? 's' : ''} streak
            </div>
            
            {lastCompletedDate && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Last completed: {formatDate(lastCompletedDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HabitItem;