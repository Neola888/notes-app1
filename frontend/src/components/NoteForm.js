import React, { useState } from 'react';

export default function NoteForm({ addNote }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    addNote({ title: title.trim(), content: content.trim() });
    setTitle('');
    setContent('');
  };

  return (
    <form className="note-form" onSubmit={handleSubmit} aria-label="Add a new note">
      <input
        type="text"
        placeholder="Title (optional)"
        className="note-input title-input"
        value={title}
        maxLength={60}
        onChange={(e) => setTitle(e.target.value)}
        spellCheck={false}
        aria-label="Note title"
      />
      <textarea
        placeholder="Write your note here..."
        className="note-input content-input"
        value={content}
        rows={4}
        maxLength={1000}
        onChange={(e) => setContent(e.target.value)}
        spellCheck={false}
        aria-label="Note content"
      />
      <button type="submit" className="submit-btn" aria-label="Add note">
        ➕ Add Note
      </button>
    </form>
  );
}
