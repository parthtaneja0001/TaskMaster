import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import HabitForm from '../components/habits/HabitForm';
import HabitItem from '../components/habits/HabitItem';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import useHabitsStore from '../store/habitsStore';
import { Habit } from '../types';

const HabitsPage: React.FC = () => {
  const { habits, addHabit, updateHabit, deleteHabit, completeHabit } = useHabitsStore();
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState<'daily' | 'weekly' | 'monthly' | ''>('');

  const handleHabitSubmit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak'>) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
      setEditingHabit(null);
    } else {
      addHabit(habitData);
      setIsFormVisible(false);
    }
  };
  
  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsFormVisible(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingHabit(null);
  };

  const handleCreateHabit = () => {
    setIsFormVisible(true);
    setEditingHabit(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCompleteHabit = (id: string) => {
    completeHabit(id, new Date());
  };
  
  const handleResetFilters = () => {
    setSearchQuery('');
    setFrequencyFilter('');
  };
  
  // Filter and sort habits
  const filteredHabits = habits
    .filter(habit => {
      // Search filter
      const matchesSearch = !searchQuery || 
        habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (habit.description && habit.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Frequency filter
      const matchesFrequency = !frequencyFilter || habit.frequency === frequencyFilter;
      
      return matchesSearch && matchesFrequency;
    })
    .sort((a, b) => {
      // Sort by completion and then by name
      const today = new Date().toISOString().split('T')[0];
      
      const aCompletedToday = a.completedDates.some(
        date => date.toISOString().split('T')[0] === today
      );
      
      const bCompletedToday = b.completedDates.some(
        date => date.toISOString().split('T')[0] === today
      );
      
      if (aCompletedToday && !bCompletedToday) return 1;
      if (!aCompletedToday && bCompletedToday) return -1;
      
      return a.name.localeCompare(b.name);
    });
  
  return (
    <PageContainer
      title="Habits"
      description="Track your habits and build streaks"
      actions={
        <Button 
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleCreateHabit}
        >
          New Habit
        </Button>
      }
    >
      {/* Edit Form */}
      {editingHabit && (
        <HabitForm 
          onSubmit={handleHabitSubmit}
          initialHabit={editingHabit}
          onCancel={handleCancelEdit}
        />
      )}
      
      {/* New Habit Form */}
      {isFormVisible && !editingHabit && (
        <HabitForm 
          onSubmit={handleHabitSubmit}
          onCancel={() => setIsFormVisible(false)}
        />
      )}
      
      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search habits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4 text-gray-400" />}
                fullWidth
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={frequencyFilter}
                onChange={(e) => setFrequencyFilter(e.target.value as any)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Frequencies</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
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
      
      {/* Habits List */}
      <div className="space-y-3">
        {filteredHabits.length > 0 ? (
          filteredHabits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onComplete={handleCompleteHabit}
              onDelete={deleteHabit}
              onEdit={handleEditHabit}
            />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            {habits.length === 0 
              ? "You don't have any habits yet. Create one to get started!" 
              : "No habits match your search criteria"}
          </p>
        )}
      </div>
    </PageContainer>
  );
};

export default HabitsPage;