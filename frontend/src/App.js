import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fetchNotes = useCallback(async (pageNum = 1) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/notes?page=${pageNum}`);
      const fetchedNotes = res.data.notes || [];
      const more = res.data.hasMore ?? false;

      setNotes(prev => (pageNum === 1 ? fetchedNotes : [...prev, ...fetchedNotes]));
      setHasMore(more);
      setPage(pageNum + 1);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch notes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes(1);
  }, [fetchNotes]);

  useEffect(() => {
    const handleScroll = () => {
      // Infinite scroll
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200 &&
        hasMore &&
        !isLoading
      ) {
        fetchNotes(page);
      }

      // Show scroll-to-top button
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNotes, page, hasMore, isLoading]);

  // Load dark mode setting on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('dark-mode');
    if (savedMode === 'enabled') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Toggle dark mode with persistence
  const toggleDarkMode = () => {
    if (darkMode) {
      document.body.classList.remove('dark-mode');
      localStorage.removeItem('dark-mode');
      setDarkMode(false);
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('dark-mode', 'enabled');
      setDarkMode(true);
    }
  };

  const addNote = async (note) => {
    try {
      const res = await axios.post('http://localhost:5000/api/notes', note);
      setNotes(prev => [res.data, ...prev]);
      toast.success('Note saved successfully!');
    } catch (err) {
      toast.error('Failed to save note.');
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      setNotes(prev => prev.filter(note => note._id !== id));
      toast.info('Note deleted.');
    } catch (err) {
      toast.error('Failed to delete note.');
    }
  };

  const updateNote = async (id, updatedNote) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/notes/${id}`, updatedNote);
      setNotes(prev => prev.map(note => (note._id === id ? res.data : note)));
      toast.success('Note updated.');
    } catch (err) {
      toast.error('Failed to update note.');
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`container ${darkMode ? 'dark' : 'light'}`}>
      <button className="toggle-btn" onClick={toggleDarkMode}>
        {darkMode ? '🌞' : '🌙'}
      </button>

      <h1 className="app-title">📝 Notes App</h1>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search Notes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            className="clear-btn"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>

      <NoteForm addNote={addNote} />
      <NoteList notes={filteredNotes} deleteNote={deleteNote} updateNote={updateNote} />

      {isLoading && <p className="loading-text">Loading...</p>}

      {!isLoading && notes.length === 0 && (
        <p className="end-text">No notes yet.</p>
      )}

      {!isLoading && notes.length > 0 && filteredNotes.length === 0 && (
        <p className="end-text">No matching notes found.</p>
      )}

      {!hasMore && !isLoading && filteredNotes.length > 0 && (
        <p className="end-text">No more notes</p>
      )}

      {showScrollTop && (
        <button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
    </div>
  );
}

export default App;
