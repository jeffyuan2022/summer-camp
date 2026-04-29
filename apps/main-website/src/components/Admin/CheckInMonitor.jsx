import React, { useState, useEffect } from 'react';
import { UserCheck, UserMinus, ShieldAlert, ArrowDownUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const CheckInMonitor = () => {
  const [sortOrder, setSortOrder] = useState('status');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();

    const channel = supabase.channel('student_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, (payload) => {
        fetchStudents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStudents = async () => {
    // Left Join relation with profiles to get the assigned host family name
    const { data } = await supabase.from('students').select(`*, profiles(family_name)`);
    if (data) setStudents(data);
  };

  const sortedStudents = [...students].sort((a, b) => {
    const hostA = a.profiles?.family_name || 'Unassigned';
    const hostB = b.profiles?.family_name || 'Unassigned';

    if (sortOrder === 'family_asc') return hostA.localeCompare(hostB);
    if (sortOrder === 'student_asc') return a.name.localeCompare(b.name);
    
    // Sort by status (Pending -> Checked In -> Checked Out)
    const orderScore = { 'pending': 1, 'checked_in': 2, 'checked_out': 3 };
    return (orderScore[a.status] || 1) - (orderScore[b.status] || 1);
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'checked_in': return { bg: '#dcfce7', border: '#bbf7d0', color: '#166534', icon: <UserCheck size={28} /> }; // Green
      case 'checked_out': return { bg: '#f3e8ff', border: '#e9d5ff', color: '#6b21a8', icon: <UserMinus size={28} /> }; // Purple
      case 'pending': default: return { bg: '#fef3c7', border: '#fde68a', color: '#b45309', icon: <ShieldAlert size={28} /> }; // Yellow
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'checked_in': return 'Dropped Off (On Campus)';
      case 'checked_out': return 'Picked Up (With Host)';
      case 'pending': default: return 'Pending Route';
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="admin-layout" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--blue-900)', marginBottom: '0.5rem' }}>Live Check-In Monitor</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time snapshot of student logistics and whereabouts.</p>
        </div>
        <div className="admin-monitor-controls" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'white', padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--blue-200)', flex: 1, width: '100%' }}>
            <ArrowDownUp size={18} color="var(--blue-900)" style={{ flexShrink: 0 }} />
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '1rem', color: 'var(--blue-900)', fontWeight: 600, cursor: 'pointer', width: '100%' }}
            >
              <option value="status">Sort by Status (Urgency)</option>
              <option value="family_asc">Sort by Host Family (A-Z)</option>
              <option value="student_asc">Sort by Student (A-Z)</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#166534' }}></span> On Campus
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#b45309' }}></span> Pending
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#6b21a8' }}></span> Picked Up
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        {sortedStudents.map(student => {
          const style = getStatusColor(student.status);
          const hostName = student.profiles?.family_name || 'Unassigned';
          const timeString = new Date(student.last_action_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={student.id} style={{ 
              backgroundColor: 'white', 
              borderRadius: 'var(--radius-lg)', 
              boxShadow: 'var(--shadow-sm)', 
              border: `2px solid ${style.border}`,
              overflow: 'hidden'
            }}>
              <div style={{ backgroundColor: style.bg, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: style.color }}>{style.icon}</div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: style.color, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {getStatusText(student.status)}
                  </span>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>{student.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{hostName}</p>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--blue-50)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Last Action:</span>
                  <span style={{ fontWeight: 600 }}>{timeString}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckInMonitor;
