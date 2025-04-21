import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Habit } from '../../types';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface HabitFormProps {
  onSubmit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak'>) => void;
  initialHabit?: Habit;
  onCancel?: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ 
  onSubmit, 
  initialHabit,
  onCancel
}) => {
  const [name, setName] = useState(initialHabit?.name || '');
  const [description, setDescription] = useState(initialHabit?.description || '');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>(initialHabit?.frequency || 'daily');
  const [color, setColor] = useState(initialHabit?.color || 'primary');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    onSubmit({
      name,
      description: description.trim() ? description : undefined,
      frequency,
      color,
    });
    
    if (!initialHabit) {
      // Clear form if it's a new habit
      setName('');
      setDescription('');
      setFrequency('daily');
      setColor('primary');
    }
  };

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Habit Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Daily Exercise, Read 30 minutes"
              fullWidth
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this habit..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white min-h-[80px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Frequency
              </label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color
              </label>
              <select
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="primary">Blue</option>
                <option value="secondary">Teal</option>
                <option value="accent">Purple</option>
                <option value="success">Green</option>
                <option value="warning">Amber</option>
                <option value="danger">Red</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              icon={initialHabit ? undefined : <PlusCircle className="h-4 w-4" />}
            >
              {initialHabit ? 'Update Habit' : 'Add Habit'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default HabitForm;