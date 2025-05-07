import React, { useState } from 'react';

export default function NoteList({ notes, deleteNote, updateNote }) {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [deletingIds, setDeletingIds] = useState([]);

  const startEdit = (note) => {
    setEditId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle('');
    setEditContent('');
  };

  const saveEdit = () => {
    if (!editTitle.trim() && !editContent.trim()) return;
    updateNote(editId, { title: editTitle.trim(), content: editContent.trim() });
    cancelEdit();
  };

  const handleDelete = (id) => {
    setDeletingIds((prev) => [...prev, id]);
    setTimeout(() => {
      deleteNote(id);
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    }, 300);
  };

  return (
    <div className="note-list" role="list" aria-label="Notes list">
      {notes.map((note) => (
        <div
          key={note._id}
          className={`note-card ${deletingIds.includes(note._id) ? 'fade-out' : ''}`}
          tabIndex={0}
          role="listitem"
          aria-label={`Note titled ${note.title || 'Untitled'}`}
        >
          {editId === note._id ? (
            <>
              <input
                type="text"
                className="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                maxLength={60}
                spellCheck={false}
                autoFocus
                aria-label="Edit note title"
              />
              <textarea
                className="edit-content"
                rows={6}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                maxLength={1000}
                spellCheck={false}
                aria-label="Edit note content"
              />
              <div className="note-actions">
                <button
                  onClick={saveEdit}
                  className="action-btn save-btn"
                  aria-label="Save changes"
                >
                  💾 Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="action-btn cancel-btn"
                  aria-label="Cancel editing"
                >
                  ✖ Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {note.title && <div className="note-title">{note.title}</div>}
              <pre className="note-content">{note.content || '(No content)'}</pre>
              <div className="note-actions">
                <button
                  onClick={() => startEdit(note)}
                  className="action-btn edit-btn"
                  aria-label={`Edit note titled ${note.title || 'Untitled'}`}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="action-btn delete-btn"
                  aria-label={`Delete note titled ${note.title || 'Untitled'}`}
                >
                  🗑️ Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
