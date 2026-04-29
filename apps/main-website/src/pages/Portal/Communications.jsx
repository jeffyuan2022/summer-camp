import React, { useState, useEffect } from 'react';
import { Send, MessageSquareText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const Communications = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    fetchMessages();
    const channel = supabase.channel('host_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        fetchMessages();
        if (payload.eventType === 'INSERT' && payload.new.sender_id !== user.id) {
          playNotificationSound();
          showBrowserNotification('New Message from AGI Admin', payload.new.text);
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

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages')
      .select('*, profiles!sender_id(family_name)')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true });
    if (data) setMessages(data);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    
    await supabase.from('messages').insert([{ sender_id: user.id, receiver_id: null, text: input }]);
    setInput('');
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--blue-100)', display: 'flex', flexDirection: 'column', height: '500px' }}>
      
      {/* Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--blue-50)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MessageSquareText size={24} color="var(--primary)" />
        <h2 style={{ fontSize: '1.25rem', color: 'var(--blue-900)' }}>Direct Support Chat</h2>
      </div>

      {/* Messages Window */}
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#f8fafc' }}>
        {messages.map(msg => {
          const isMyMessage = msg.sender_id === user?.id;
          const senderName = isMyMessage ? 'You' : (msg.profiles?.family_name || 'AGI Admin');
          const timeStr = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMyMessage ? 'flex-end' : 'flex-start' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', marginLeft: '0.5rem', marginRight: '0.5rem' }}>
                {senderName} • {timeStr}
              </div>
              <div style={{ 
                maxWidth: '80%', 
                padding: '1rem', 
                borderRadius: '1rem', 
                backgroundColor: isMyMessage ? 'var(--primary)' : 'white',
                color: isMyMessage ? 'white' : 'var(--text-main)',
                border: isMyMessage ? 'none' : '1px solid var(--blue-200)',
                borderBottomRightRadius: isMyMessage ? '4px' : '1rem',
                borderBottomLeftRadius: isMyMessage ? '1rem' : '4px',
              }}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Field */}
      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--blue-50)', backgroundColor: 'white', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message to AGI..."
            style={{ flex: 1, padding: '1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--blue-200)', outline: 'none' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', borderRadius: 'var(--radius-full)' }}>
            <Send size={20} />
          </button>
        </form>
      </div>

    </div>
  );
};

export default Communications;
