import React, { useState } from 'react';
import { Plus, Search, Tag } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import NoteForm from '../components/notes/NoteForm';
import NoteItem from '../components/notes/NoteItem';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import useNotesStore from '../store/notesStore';
import { Note } from '../types';

const NotesPage: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, togglePin, searchNotes } = useNotesStore();
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleNoteSubmit = (noteData: Omit<Note, 'id' | 'createdAt' | 'lastEdited'>) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData);
      setEditingNote(null);
    } else {
      addNote(noteData);
      setIsFormVisible(false);
    }
  };
  
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsFormVisible(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  const handleCreateNote = () => {
    setIsFormVisible(true);
    setEditingNote(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Get all unique tags
  const allTags = Array.from(
    new Set(
      notes
        .filter(note => note.tags && note.tags.length > 0)
        .flatMap(note => note.tags || [])
    )
  );
  
  // Filter notes
  const filteredNotes = searchNotes(searchQuery)
    .filter(note => !selectedTag || (note.tags && note.tags.includes(selectedTag)));
  
  // Separate pinned and unpinned notes
  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);
  
  return (
    <PageContainer
      title="Notes"
      description="Capture your thoughts and ideas"
      actions={
        <Button 
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleCreateNote}
        >
          New Note
        </Button>
      }
    >
      {/* Edit Form */}
      {editingNote && (
        <NoteForm 
          onSubmit={handleNoteSubmit}
          initialNote={editingNote}
          onCancel={handleCancelEdit}
        />
      )}
      
      {/* New Note Form */}
      {isFormVisible && !editingNote && (
        <NoteForm 
          onSubmit={handleNoteSubmit}
          onCancel={() => setIsFormVisible(false)}
        />
      )}
      
      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col space-y-4">
            <div>
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4 text-gray-400" />}
                fullWidth
              />
            </div>
            
            {allTags.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Tag className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter by Tag
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={!selectedTag ? 'primary' : 'default'}
                    size="md"
                    className="cursor-pointer"
                    onClick={() => setSelectedTag(null)}
                  >
                    All
                  </Badge>
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? 'primary' : 'default'}
                      size="md"
                      className="cursor-pointer"
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <span className="h-2 w-2 rounded-full bg-accent-500 mr-2"></span>
            Pinned Notes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onDelete={deleteNote}
                onEdit={handleEditNote}
                onTogglePin={togglePin}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Unpinned Notes */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
          Notes
        </h2>
        
        {unpinnedNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unpinnedNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onDelete={deleteNote}
                onEdit={handleEditNote}
                onTogglePin={togglePin}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            {notes.length === 0 || filteredNotes.length === 0
              ? "No notes found. Create one to get started!"
              : "All notes are pinned"}
          </p>
        )}
      </div>
    </PageContainer>
  );
};

export default NotesPage;