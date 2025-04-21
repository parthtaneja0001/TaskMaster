import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note } from '../types';
import { generateId } from '../lib/utils';

interface NotesState {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'lastEdited'>) => string;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  searchNotes: (query: string) => Note[];
}

const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      addNote: (noteData) => {
        const id = generateId();
        const now = new Date();
        set((state) => ({
          notes: [
            ...state.notes,
            {
              id,
              ...noteData,
              createdAt: now,
              lastEdited: now,
            },
          ],
        }));
        return id;
      },
      updateNote: (id, updatedNote) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id 
              ? { 
                  ...note, 
                  ...updatedNote, 
                  lastEdited: new Date() 
                } 
              : note
          ),
        }));
      },
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },
      togglePin: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, isPinned: !note.isPinned } : note
          ),
        }));
      },
      searchNotes: (query) => {
        const { notes } = get();
        if (!query.trim()) return notes;
        
        const lowerQuery = query.toLowerCase();
        return notes.filter(
          (note) =>
            note.title.toLowerCase().includes(lowerQuery) ||
            note.content.toLowerCase().includes(lowerQuery) ||
            note.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      },
    }),
    {
      name: 'notes-storage',
    }
  )
);

export default useNotesStore;