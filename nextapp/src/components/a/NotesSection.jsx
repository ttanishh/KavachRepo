// components/a/NotesSection.jsx
import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Avatar } from '../common/Avatar';

export function NotesSection({
  notes = [],
  reportId,
  onAddNote,
  isLoading = false,
  className = '',
  ...props
}) {
  const [newNote, setNewNote] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote(reportId, newNote);
      setNewNote('');
    }
  };
  
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Officer Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {notes.length === 0 ? (
          <div className="text-center py-4 text-surface-500">
            No notes added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note, index) => (
              <div key={index} className="flex space-x-3">
                <Avatar 
                  src={note.author.avatar} 
                  name={note.author.name} 
                  size="sm"
                />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-sm font-medium text-surface-900">
                      {note.author.name}
                    </h4>
                    <span className="text-xs text-surface-500">
                      {new Date(note.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-surface-700">
                    {note.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          <div>
            <label htmlFor="newNote" className="sr-only">
              Add note
            </label>
            <textarea
              id="newNote"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
              className="w-full rounded-md border-surface-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              placeholder="Add a private note about this report..."
            />
            <p className="mt-1 text-xs text-surface-500">
              Notes are only visible to police officers, not to citizens.
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !newNote.trim()}
            >
              Add Note
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}