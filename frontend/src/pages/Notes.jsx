import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notesAPI } from '../services/api';
import './Notes.css';

function Notes() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    related_topic: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await notesAPI.getAll();
        setNotes(data.results || data);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
        setError('Failed to load notes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [navigate, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingNote) {
        // Update existing note
        const updated = await notesAPI.update(editingNote.id, formData);
        setNotes(notes.map(note => 
          note.id === editingNote.id ? updated : note
        ));
      } else {
        // Create new note
        const newNote = await notesAPI.create(formData);
        setNotes([newNote, ...notes]);
      }

      // Reset form
      setFormData({ title: '', content: '', related_topic: '' });
      setShowForm(false);
      setEditingNote(null);
    } catch (err) {
      console.error('Failed to save note:', err);
      alert('Failed to save note. Please try again.');
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      related_topic: note.related_topic || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.delete(id);
        setNotes(notes.filter(n => n.id !== id));
      } catch (err) {
        console.error('Failed to delete note:', err);
        alert('Failed to delete note. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNote(null);
    setFormData({ title: '', content: '', related_topic: '' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="notes-container">
        <header className="page-header">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1>📝 Study Notes</h1>
        </header>
        <div className="loading-state">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="notes-container">
      <header className="page-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>📝 Study Notes</h1>
        <p>Organize and manage your study notes</p>
      </header>

      <div className="notes-content">
        {error && <div className="error-message">{error}</div>}
        
        <div className="notes-toolbar">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-add-note"
          >
            {showForm ? '✕ Cancel' : '+ Add Note'}
          </button>
        </div>

        {showForm && (
          <div className="note-form-container">
            <h3>{editingNote ? 'Edit Note' : 'Create New Note'}</h3>
            <form onSubmit={handleSubmit} className="note-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter note title..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Related Topic</label>
                <input
                  type="text"
                  value={formData.related_topic}
                  onChange={(e) => setFormData({ ...formData, related_topic: e.target.value })}
                  placeholder="e.g., React, Python, Math..."
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your notes here..."
                  rows={8}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingNote ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="notes-grid">
          {notes.length === 0 ? (
            <div className="empty-state">
              <p>No notes yet. Create your first note to get started!</p>
            </div>
          ) : (
            notes.map(note => (
              <div key={note.id} className="note-card">
                <div className="note-header">
                  <h3>{note.title}</h3>
                  {note.related_topic && (
                    <span className="topic-tag">{note.related_topic}</span>
                  )}
                </div>
                <div className="note-content">
                  {note.content}
                </div>
                <div className="note-footer">
                  <span className="note-date">{formatDate(note.created_at)}</span>
                  <div className="note-actions">
                    <button onClick={() => handleEdit(note)} className="btn-icon" title="Edit">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(note.id)} className="btn-icon btn-delete" title="Delete">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;
