import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Habit } from '../types';
import { generateId } from '../lib/utils';

interface HabitsState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak'>) => string;
  updateHabit: (id: string, habit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string, date: Date) => void;
  getStreak: (id: string) => number;
}

const useHabitsStore = create<HabitsState>()(
  persist(
    (set, get) => ({
      habits: [],
      addHabit: (habitData) => {
        const id = generateId();
        set((state) => ({
          habits: [
            ...state.habits,
            {
              id,
              ...habitData,
              completedDates: [],
              streak: 0,
              createdAt: new Date(),
            },
          ],
        }));
        return id;
      },
      updateHabit: (id, updatedHabit) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, ...updatedHabit } : habit
          ),
        }));
      },
      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        }));
      },
      completeHabit: (id, date) => {
        const dateStr = date.toISOString().split('T')[0];
        
        set((state) => {
          const habit = state.habits.find(h => h.id === id);
          
          if (!habit) return state;
          
          // Check if already completed for this date
          const alreadyCompleted = habit.completedDates.some(d => 
            d.toISOString().split('T')[0] === dateStr
          );
          
          if (alreadyCompleted) return state;
          
          // Calculate new streak
          const newCompletedDates = [...habit.completedDates, date].sort((a, b) => a.getTime() - b.getTime());
          const newStreak = calculateStreak(habit.frequency, newCompletedDates);
          
          return {
            habits: state.habits.map((h) =>
              h.id === id 
                ? { 
                    ...h, 
                    completedDates: newCompletedDates,
                    streak: newStreak
                  } 
                : h
            ),
          };
        });
      },
      getStreak: (id) => {
        const habit = get().habits.find(h => h.id === id);
        if (!habit) return 0;
        return habit.streak;
      }
    }),
    {
      name: 'habits-storage',
    }
  )
);

// Helper function to calculate streak based on frequency and completed dates
function calculateStreak(
  frequency: 'daily' | 'weekly' | 'monthly',
  completedDates: Date[]
): number {
  if (completedDates.length === 0) return 0;
  
  // Sort dates
  const sortedDates = [...completedDates].sort((a, b) => a.getTime() - b.getTime());
  
  // Get current date without time
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let streak = 0;
  let currentDate = today;
  
  // Logic differs based on frequency
  if (frequency === 'daily') {
    // Daily tracking - check consecutive days
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const completed = sortedDates.some(d => 
        d.toISOString().split('T')[0] === dateStr
      );
      
      if (!completed) break;
      
      streak += 1;
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() - 1);
    }
  } else if (frequency === 'weekly') {
    // Weekly tracking - check consecutive weeks
    // Implementation simplified for brevity
    const weekCompleted = new Set();
    sortedDates.forEach(date => {
      const yearWeek = `${date.getFullYear()}-${getWeekNumber(date)}`;
      weekCompleted.add(yearWeek);
    });
    
    // Count consecutive weeks
    const currentWeek = getWeekNumber(today);
    const currentYear = today.getFullYear();
    
    let checkYear = currentYear;
    let checkWeek = currentWeek;
    
    while (weekCompleted.has(`${checkYear}-${checkWeek}`)) {
      streak += 1;
      
      // Move to previous week
      checkWeek -= 1;
      if (checkWeek < 1) {
        checkYear -= 1;
        checkWeek = getWeeksInYear(checkYear);
      }
    }
  } else if (frequency === 'monthly') {
    // Monthly tracking - check consecutive months
    const monthCompleted = new Set();
    sortedDates.forEach(date => {
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthCompleted.add(yearMonth);
    });
    
    // Count consecutive months
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    
    let checkYear = currentYear;
    let checkMonth = currentMonth;
    
    while (monthCompleted.has(`${checkYear}-${checkMonth}`)) {
      streak += 1;
      
      // Move to previous month
      checkMonth -= 1;
      if (checkMonth < 1) {
        checkYear -= 1;
        checkMonth = 12;
      }
    }
  }
  
  return streak;
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Helper function to get weeks in a year
function getWeeksInYear(year: number): number {
  const d = new Date(year, 11, 31);
  const week = getWeekNumber(d);
  return week === 1 ? 52 : week;
}

export default useHabitsStore;