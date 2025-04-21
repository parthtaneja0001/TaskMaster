import React from 'react';
import { Edit, Trash2, Pin, PinOff } from 'lucide-react';
import { Note } from '../../types';
import { formatDateTime, truncateText } from '../../lib/utils';
import { Card } from '../ui/Card';
import IconButton from '../ui/IconButton';
import Badge from '../ui/Badge';

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
  onTogglePin: (id: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  onDelete,
  onEdit,
  onTogglePin,
}) => {
  const { id, title, content, isPinned, lastEdited, tags } = note;

  return (
    <Card 
      className={`transition-all hover:shadow-lg ${
        isPinned ? 'border-l-4 border-l-accent-500 dark:border-l-accent-400' : ''
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {title}
          </h3>
          
          <div className="flex items-center space-x-1 ml-2">
            <IconButton
              size="sm"
              variant="ghost"
              icon={isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              onClick={() => onTogglePin(id)}
              tooltip={isPinned ? "Unpin note" : "Pin note"}
            />
            <IconButton
              size="sm"
              variant="ghost"
              icon={<Edit className="h-4 w-4" />}
              onClick={() => onEdit(note)}
              tooltip="Edit note"
            />
            <IconButton
              size="sm"
              variant="ghost"
              icon={<Trash2 className="h-4 w-4 text-danger-500" />}
              onClick={() => onDelete(id)}
              tooltip="Delete note"
            />
          </div>
        </div>
        
        <div className="mt-2 flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
            {truncateText(content, 200)}
          </p>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Last edited: {formatDateTime(lastEdited)}
            </div>
            
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge 
                    key={tag}
                    variant="default"
                    size="sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NoteItem;