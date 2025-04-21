import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { CalendarDays, CheckSquare, BarChart } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import useTasksStore from '../store/tasksStore';
import useHabitsStore from '../store/habitsStore';
import 'react-calendar/dist/Calendar.css';

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();
  
  // Get tasks for selected date
  const tasksForSelectedDate = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getDate() === selectedDate.getDate() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getFullYear() === selectedDate.getFullYear()
    );
  });
  
  // Get habits for selected date
  const habitsForSelectedDate = habits.filter(habit => {
    // For daily habits, always show
    if (habit.frequency === 'daily') return true;
    
    // For weekly habits, check if the selected date is the same day of week as today
    if (habit.frequency === 'weekly') {
      const today = new Date();
      return selectedDate.getDay() === today.getDay();
    }
    
    // For monthly habits, check if the selected date is the same day of month as today
    if (habit.frequency === 'monthly') {
      const today = new Date();
      return selectedDate.getDate() === today.getDate();
    }
    
    return false;
  });
  
  // Check if a date has tasks
  const hasTasksOnDate = (date: Date) => {
    return tasks.some(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  // Calendar tile content
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const hasTasks = hasTasksOnDate(date);
    
    if (!hasTasks) return null;
    
    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <span className="h-1 w-1 bg-primary-500 rounded-full"></span>
      </div>
    );
  };

  return (
    <PageContainer
      title="Calendar"
      description="View your tasks and habits on a calendar"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="calendar-wrapper">
              <style jsx>{`
                .calendar-wrapper :global(.react-calendar) {
                  width: 100%;
                  border: none;
                  font-family: inherit;
                }
                
                .calendar-wrapper :global(.react-calendar__tile) {
                  position: relative;
                  height: 60px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                
                .calendar-wrapper :global(.react-calendar__month-view__days__day--weekend) {
                  color: #ef4444;
                }
                
                .calendar-wrapper :global(.react-calendar__tile--active) {
                  background: #3b82f6;
                  color: white;
                }
                
                .calendar-wrapper :global(.react-calendar__tile--now) {
                  background: #dbeafe;
                }
                
                .calendar-wrapper :global(.react-calendar__tile--active.react-calendar__tile--now) {
                  background: #3b82f6;
                }
                
                .calendar-wrapper :global(.react-calendar__navigation button:enabled:hover),
                .calendar-wrapper :global(.react-calendar__navigation button:enabled:focus),
                .calendar-wrapper :global(.react-calendar__tile:enabled:hover),
                .calendar-wrapper :global(.react-calendar__tile:enabled:focus) {
                  background-color: #f3f4f6;
                }
                
                .calendar-wrapper :global(.react-calendar__tile--active:enabled:hover),
                .calendar-wrapper :global(.react-calendar__tile--active:enabled:focus) {
                  background: #2563eb;
                }
                
                @media (prefers-color-scheme: dark) {
                  .calendar-wrapper :global(.react-calendar) {
                    background-color: #1f2937;
                    color: #f9fafb;
                  }
                  
                  .calendar-wrapper :global(.react-calendar__tile--now) {
                    background: #374151;
                  }
                  
                  .calendar-wrapper :global(.react-calendar__navigation button:enabled:hover),
                  .calendar-wrapper :global(.react-calendar__navigation button:enabled:focus),
                  .calendar-wrapper :global(.react-calendar__tile:enabled:hover),
                  .calendar-wrapper :global(.react-calendar__tile:enabled:focus) {
                    background-color: #374151;
                  }
                }
              `}</style>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>
              {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Tasks Section */}
              <div>
                <div className="flex items-center mb-3">
                  <CheckSquare className="h-5 w-5 text-primary-500 mr-2" />
                  <h3 className="text-lg font-medium">Tasks</h3>
                </div>
                
                {tasksForSelectedDate.length > 0 ? (
                  <ul className="space-y-2">
                    {tasksForSelectedDate.map(task => (
                      <li key={task.id} className="flex items-center justify-between p-2 border-l-2 border-l-primary-500 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <p className={`font-medium ${
                            task.status === 'completed' ? 'line-through text-gray-500' : ''
                          }`}>
                            {task.title}
                          </p>
                          <div className="flex mt-1">
                            <Badge
                              variant={
                                task.priority === 'high' 
                                  ? 'danger' 
                                  : task.priority === 'medium' 
                                    ? 'warning' 
                                    : 'success'
                              }
                              size="sm"
                            >
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No tasks scheduled for this day</p>
                )}
              </div>
              
              {/* Habits Section */}
              <div>
                <div className="flex items-center mb-3">
                  <BarChart className="h-5 w-5 text-secondary-500 mr-2" />
                  <h3 className="text-lg font-medium">Habits</h3>
                </div>
                
                {habitsForSelectedDate.length > 0 ? (
                  <ul className="space-y-2">
                    {habitsForSelectedDate.map(habit => {
                      // Check if completed on selected date
                      const isCompletedOnDate = habit.completedDates.some(date => 
                        date.getDate() === selectedDate.getDate() &&
                        date.getMonth() === selectedDate.getMonth() &&
                        date.getFullYear() === selectedDate.getFullYear()
                      );
                      
                      return (
                        <li key={habit.id} className="flex items-center justify-between p-2 border-l-2 border-l-secondary-500 bg-gray-50 dark:bg-gray-800 rounded">
                          <div>
                            <p className={`font-medium ${
                              isCompletedOnDate ? 'text-success-500' : ''
                            }`}>
                              {habit.name}
                            </p>
                            <div className="flex mt-1">
                              <Badge
                                variant="secondary"
                                size="sm"
                              >
                                {habit.frequency}
                              </Badge>
                              {isCompletedOnDate && (
                                <Badge
                                  variant="success"
                                  size="sm"
                                  className="ml-1"
                                >
                                  Completed
                                </Badge>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No habits for this day</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CalendarPage;