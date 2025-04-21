import { create } from 'zustand';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface AIState {
  loading: boolean;
  error: string | null;
  suggestions: string[];
  lastRequestTime: number | null;
  getSuggestions: (tasks: any[], habits: any[]) => Promise<void>;
}

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

// Helper function to generate fallback suggestions
const getFallbackSuggestions = (tasks: any[], habits: any[]): string[] => {
  const suggestions: string[] = [];
  
  // Add task-based suggestions
  const incompleteTasks = tasks.filter(task => task.status !== 'completed');
  const highPriorityTasks = incompleteTasks.filter(task => task.priority === 'high');
  
  if (highPriorityTasks.length > 0) {
    suggestions.push(`Focus on your ${highPriorityTasks.length} high-priority tasks first.`);
  }
  
  if (incompleteTasks.length > 0) {
    suggestions.push(`You have ${incompleteTasks.length} tasks remaining. Consider breaking them into smaller steps.`);
  }
  
  // Add habit-based suggestions
  const dailyHabits = habits.filter(habit => habit.frequency === 'daily');
  const today = new Date().toISOString().split('T')[0];
  const completedToday = dailyHabits.filter(habit => 
    habit.completedDates.some((date: Date) => date.toISOString().split('T')[0] === today)
  );
  
  if (dailyHabits.length > 0) {
    const remaining = dailyHabits.length - completedToday.length;
    if (remaining > 0) {
      suggestions.push(`You still have ${remaining} daily habits to complete today.`);
    } else {
      suggestions.push('Great job completing all your daily habits! Consider adding a new challenge.');
    }
  }
  
  // Add a general suggestion if needed
  if (suggestions.length < 3) {
    suggestions.push('Try using the Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break.');
  }
  
  return suggestions.slice(0, 3);
};

const useAIStore = create<AIState>((set, get) => ({
  loading: false,
  error: null,
  suggestions: [],
  lastRequestTime: null,
  
  getSuggestions: async (tasks, habits) => {
    try {
      set({ loading: true, error: null });
      
      // Check rate limiting
      const lastRequestTime = get().lastRequestTime;
      const now = Date.now();
      if (lastRequestTime && now - lastRequestTime < 60000) {
        const suggestions = getFallbackSuggestions(tasks, habits);
        set({ 
          suggestions,
          error: "Rate limit: Using fallback suggestions. Please wait a minute before trying again.",
          loading: false,
          lastRequestTime: now
        });
        return;
      }
      
      // Prepare data for the prompt
      const tasksData = tasks.map(task => ({
        title: task.title,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate
      }));
      
      const habitsData = habits.map(habit => ({
        name: habit.name,
        frequency: habit.frequency,
        streak: habit.streak
      }));
      
      // Create the prompt
      const prompt = `You are a productivity assistant. Based on the following tasks and habits, provide exactly 3 specific, actionable suggestions for improvement. Each suggestion should be clear and concise.

Tasks: ${JSON.stringify(tasksData, null, 2)}
Habits: ${JSON.stringify(habitsData, null, 2)}

Format your response as a simple bulleted list with exactly 3 items.`;

      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response
      const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-') || line.startsWith('•') || /^\d+\./.test(line))
        .map(line => line.replace(/^[-•\d.]\s*/, '').trim())
        .filter(Boolean)
        .slice(0, 3);
      
      // If we couldn't parse 3 suggestions, use fallback
      if (lines.length < 3) {
        const suggestions = getFallbackSuggestions(tasks, habits);
        set({ 
          suggestions,
          error: "Could not parse AI response. Using fallback suggestions.",
          loading: false,
          lastRequestTime: now
        });
        return;
      }
      
      set({ 
        suggestions: lines,
        loading: false,
        error: null,
        lastRequestTime: now
      });
      
    } catch (error: any) {
      console.error('AI suggestion error:', error);
      
      const suggestions = getFallbackSuggestions(tasks, habits);
      set({ 
        suggestions,
        error: "Failed to get AI suggestions. Using fallback suggestions instead.",
        loading: false,
        lastRequestTime: Date.now()
      });
    }
  }
}));

export default useAIStore;