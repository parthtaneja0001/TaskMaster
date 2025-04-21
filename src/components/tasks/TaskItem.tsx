import React from 'react';
import { Check, Clock, Star, Trash2, Edit } from 'lucide-react';
import { Task, Priority } from '../../types';
import { formatDate } from '../../lib/utils';
import { Card } from '../ui/Card';
import Badge from '../ui/Badge';
import IconButton from '../ui/IconButton';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onComplete,
  onDelete,
  onEdit,
}) => {
  const { id, title, description, priority, status, dueDate, tags } = task;

  const getPriorityBadgeVariant = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card 
      className="transition-all hover:shadow-lg"
      variant={status === 'completed' ? 'outline' : 'default'}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onComplete(id)}
          className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full border ${
            status === 'completed'
              ? 'bg-primary-500 border-primary-500 text-white'
              : 'border-gray-300 dark:border-gray-600'
          } flex items-center justify-center`}
          aria-label={status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {status === 'completed' && <Check className="h-3 w-3" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 
              className={`font-medium ${
                status === 'completed' 
                  ? 'text-gray-500 dark:text-gray-400 line-through' 
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {title}
            </h3>
            
            <div className="flex items-center space-x-1 ml-2">
              <IconButton
                size="sm"
                variant="ghost"
                icon={<Edit className="h-4 w-4" />}
                onClick={() => onEdit(task)}
                tooltip="Edit task"
              />
              <IconButton
                size="sm"
                variant="ghost"
                icon={<Trash2 className="h-4 w-4 text-danger-500" />}
                onClick={() => onDelete(id)}
                tooltip="Delete task"
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
              variant={getPriorityBadgeVariant(priority)}
              size="sm"
              icon={<Star className="h-3 w-3" />}
            >
              {priority}
            </Badge>
            
            {dueDate && (
              <Badge 
                variant="secondary"
                size="sm"
                icon={<Clock className="h-3 w-3" />}
              >
                {formatDate(dueDate)}
              </Badge>
            )}
            
            {tags && tags.map(tag => (
              <Badge 
                key={tag}
                variant="default"
                size="sm"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskItem;