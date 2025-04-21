import React, { useEffect, useState } from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import useAIStore from '../../store/aiStore';
import useTasksStore from '../../store/tasksStore';
import useHabitsStore from '../../store/habitsStore';

const AISuggestions: React.FC = () => {
  const [retryCountdown, setRetryCountdown] = useState<number>(0);
  const { loading, error, suggestions, getSuggestions, lastRequestTime } = useAIStore();
  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();

  const fetchSuggestions = async () => {
    await getSuggestions(tasks, habits);
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  useEffect(() => {
    if (retryCountdown > 0) {
      const timer = setTimeout(() => {
        setRetryCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (retryCountdown === 0 && lastRequestTime) {
      fetchSuggestions();
    }
  }, [retryCountdown]);

  const handleRetry = () => {
    if (lastRequestTime) {
      const timeSinceLastRequest = Date.now() - lastRequestTime;
      const waitTime = Math.ceil((60000 - timeSinceLastRequest) / 1000);
      
      if (waitTime > 0) {
        setRetryCountdown(waitTime);
      } else {
        fetchSuggestions();
      }
    } else {
      fetchSuggestions();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Suggestions</h2>
        <button
          onClick={handleRetry}
          disabled={loading || retryCountdown > 0}
          className={`p-2 rounded-full transition-colors ${
            loading || retryCountdown > 0
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800'
          }`}
          title={retryCountdown > 0 ? `Wait ${retryCountdown}s before retrying` : 'Refresh suggestions'}
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : retryCountdown > 0 ? (
            <div className="flex items-center gap-1">
              <Clock className="w-5 h-5" />
              <span className="text-sm">{retryCountdown}s</span>
            </div>
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <>
          {suggestions.length > 0 ? (
            <ul className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No suggestions available at the moment.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default AISuggestions;