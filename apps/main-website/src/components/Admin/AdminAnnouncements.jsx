import React, { useState, useEffect } from 'react';
import { Megaphone, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (data) setAnnouncements(data);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if(!newTitle || !newContent) return;

    await supabase.from('announcements').insert([{ title: newTitle, content: newContent }]);
    fetchAnnouncements();
    setNewTitle('');
    setNewContent('');
  };

  const handleDelete = async (id) => {
    await supabase.from('announcements').delete().eq('id', id);
    fetchAnnouncements();
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 style={{ fontSize: '2rem', color: 'var(--blue-900)', marginBottom: '0.5rem' }}>Global Announcements</h1>
        <p style={{ color: 'var(--text-muted)' }}>Broadcast live updates instantly to all Host Family Dashboards.</p>
      </div>

      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '2rem' }}>
        {/* Editor Form */}
        <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--blue-100)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--blue-900)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Megaphone size={20} color="var(--primary)" /> Post New Update
          </h2>
          <form onSubmit={handlePost} className="flex flex-col gap-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Announcement Title</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--blue-200)', outline: 'none' }}
                placeholder="e.g., Traffic Delay Warning"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Content Details</label>
              <textarea 
                rows="4"
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--blue-200)', outline: 'none', resize: 'vertical' }}
                placeholder="Message goes here..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Broadcast Update</button>
          </form>
        </div>

        {/* Live Feed Management */}
        <div className="flex flex-col gap-4">
          <h2 style={{ fontSize: '1.25rem', color: 'var(--blue-900)', marginBottom: '0.5rem' }}>Active Broadcasts</h2>
          {announcements.map(a => (
            <div key={a.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', borderBottom: '3px solid var(--primary)', position: 'relative' }}>
              <button 
                onClick={() => handleDelete(a.id)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <Trash2 size={18} />
              </button>
              <h4 style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.125rem' }}>{a.title}</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
                {new Date(a.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <p style={{ color: 'var(--text-muted)' }}>{a.content}</p>
            </div>
          ))}
          {announcements.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No active announcements.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncements;
