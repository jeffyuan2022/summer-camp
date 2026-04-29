import React, { useState, useEffect } from 'react';
import { Send, Search, ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const AdminInbox = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [showListOnMobile, setShowListOnMobile] = useState(true);
  const [families, setFamilies] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [input, setInput] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    fetchData();
    const channel = supabase.channel('admin_inbox')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        fetchData();
        if (payload.eventType === 'INSERT' && payload.new.sender_id !== user?.id) {
          playNotificationSound();
          showBrowserNotification('New Message from Host', payload.new.text);
        }
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  const showBrowserNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      if (document.hidden) {
        new Notification(title, { body });
      }
    }
  };

  const fetchData = async () => {
    const { data: hosts } = await supabase.from('profiles').select('*').eq('role', 'host').order('family_name');
    const { data: msgs } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
    if (hosts) setFamilies(hosts);
    if (msgs) setAllMessages(msgs);
  };

  const handleAdminReply = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChat || !user) return;
    await supabase.from('messages').insert([{ sender_id: user.id, receiver_id: activeChat, text: input }]);
    setInput('');
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div>
        <h1 style={{ fontSize: '2rem', color: 'var(--blue-900)', marginBottom: '0.5rem' }}>Support Inbox</h1>
        <p style={{ color: 'var(--text-muted)' }}>Triage messages and assist Host Families instantly.</p>
      </div>

      <div className="admin-inbox-layout" style={{ display: 'flex', height: 'calc(100vh - 250px)', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--blue-100)', overflow: 'hidden' }}>
        
        {/* Contact List Sidebar */}
        <div className={`admin-inbox-sidebar ${!showListOnMobile ? 'hide-on-mobile' : ''}`} style={{ width: '320px', borderRight: '1px solid var(--blue-100)', backgroundColor: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--blue-100)' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search families..." 
                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--blue-200)', outline: 'none' }}
              />
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {families.map(f => {
              const hostMessages = allMessages.filter(m => m.sender_id === f.id || m.receiver_id === f.id);
              const lastMsg = hostMessages.length > 0 ? hostMessages[hostMessages.length - 1].text : 'No messages yet...';
              return (
              <button 
                key={f.id} 
                onClick={() => { setActiveChat(f.id); setShowListOnMobile(false); }}
                style={{ 
                  width: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', 
                  border: 'none', borderBottom: '1px solid var(--blue-50)', background: activeChat === f.id ? 'white' : 'transparent', textAlign: 'left', cursor: 'pointer',
                  borderLeft: activeChat === f.id ? '4px solid var(--primary)' : '4px solid transparent',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontWeight: 600, color: 'var(--blue-900)' }}>{f.family_name}</span>
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                  {lastMsg}
                </span>
              </button>
            )})}
          </div>
        </div>

        {/* Active Chat Window */}
        <div className={`admin-inbox-main ${showListOnMobile ? 'hide-on-mobile' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeChat ? (
            <>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--blue-50)', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  className="mobile-only" 
                  onClick={() => setShowListOnMobile(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue-900)', alignItems: 'center' }}
                >
                  <ChevronLeft size={24} />
                </button>
                <div>
                  <h2 style={{ fontSize: '1.25rem', color: 'var(--blue-900)' }}>{families.find(f => f.id === activeChat)?.family_name}</h2>
                </div>
              </div>
              
              <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {allMessages.filter(m => m.sender_id === activeChat || m.receiver_id === activeChat).map(msg => {
                  const isAdmin = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} style={{ 
                      alignSelf: isAdmin ? 'flex-end' : 'flex-start', 
                      maxWidth: '70%', padding: '1rem', borderRadius: '1rem', 
                      backgroundColor: isAdmin ? 'var(--primary)' : 'white', 
                      color: isAdmin ? 'white' : 'var(--text-main)', 
                      border: isAdmin ? 'none' : '1px solid var(--blue-200)', 
                      borderBottomRightRadius: isAdmin ? '4px' : '1rem',
                      borderBottomLeftRadius: isAdmin ? '1rem' : '4px' 
                    }}>
                      {msg.text}
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '1.5rem', borderTop: '1px solid var(--blue-50)', backgroundColor: 'white' }}>
                <form onSubmit={handleAdminReply} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response..."
                style={{ flex: 1, padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--blue-200)', outline: 'none' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }}>
                <Send size={20} />
              </button>
            </form>
          </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', color: 'var(--text-muted)' }}>
              Select a Host Family to begin messaging.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminInbox;
