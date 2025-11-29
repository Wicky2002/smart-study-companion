import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Notes.css';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    related_topic: ''
  });

  useEffect(() => {
    // TODO: Fetch from backend
    // fetch('http://localhost:8000/api/study/notes/', {
    //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    // }).then(res => res.json()).then(data => setNotes(data));

    // Mock data
    const mockNotes = [
      {
        id: 1,
        title: 'React Hooks Summary',
        content: 'useState - manages state\nuseEffect - handles side effects\nuseContext - shares data across components',
        related_topic: 'React',
        created_at: '2025-11-25T10:00:00Z'
      },
      {
        id: 2,
        title: 'Python List Comprehensions',
        content: 'Syntax: [expression for item in iterable if condition]\nExample: squares = [x**2 for x in range(10)]',
        related_topic: 'Python',
        created_at: '2025-11-26T14:30:00Z'
      }
    ];
    setNotes(mockNotes);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingNote) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === editingNote.id 
          ? { ...note, ...formData, created_at: note.created_at }
          : note
      ));
    } else {
      // Create new note
      const newNote = {
        id: Date.now(),
        ...formData,
        created_at: new Date().toISOString()
      };
      setNotes([newNote, ...notes]);
    }

    // Reset form
    setFormData({ title: '', content: '', related_topic: '' });
    setShowForm(false);
    setEditingNote(null);
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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(n => n.id !== id));
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

  return (
    <div className="notes-container">
      <header className="page-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>📝 Study Notes</h1>
        <p>Organize and manage your study notes</p>
      </header>

      <div className="notes-content">
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
