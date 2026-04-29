import React, { useState, useEffect } from 'react';
import { UserCheck, UserMinus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const CheckInOut = () => {
  const [students, setStudents] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchStudents();
  }, [user]);

  const fetchStudents = async () => {
    const { data } = await supabase.from('students').select('*').eq('assigned_host_id', user.id);
    if (data) setStudents(data);
  };

  const toggleCheckIn = async (student) => {
    const isCurrentlyCheckedIn = student.status === 'checked_in';
    const newStatus = isCurrentlyCheckedIn ? 'checked_out' : 'checked_in';
    
    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, loading: true } : s));
    
    await supabase.from('students')
      .update({ status: newStatus, last_action_time: new Date().toISOString() })
      .eq('id', student.id);
      
    fetchStudents();
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-md)', border: '1px solid var(--blue-100)' }}>
      <h2 style={{ fontSize: '1.25rem', color: 'var(--blue-900)', marginBottom: '0.5rem' }}>Daily Student Status</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Log drop-offs and pick-ups for your assigned students.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {students.map(student => {
          const isCheckedIn = student.status === 'checked_in';
          return (
          <div key={student.id} style={{ padding: '1.5rem', backgroundColor: isCheckedIn ? '#f0fdf4' : '#f8fafc', borderRadius: 'var(--radius-md)', border: `1px solid ${isCheckedIn ? '#bbf7d0' : '#e2e8f0'}`, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>
              {isCheckedIn ? <UserCheck size={36} color="#16a34a" /> : <UserMinus size={36} color="#94a3b8" />}
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: isCheckedIn ? '#166534' : 'var(--text-main)', marginBottom: '0.5rem' }}>
              {isCheckedIn ? `${student.name} is dropped off!` : `${student.name} is with you.`}
            </h3>
            
            <button 
              onClick={() => toggleCheckIn(student)} 
              disabled={student.loading}
              className={isCheckedIn ? "btn" : "btn btn-primary"} 
              style={{ width: '100%', marginTop: '0.5rem', backgroundColor: isCheckedIn ? '#ef4444' : '', color: isCheckedIn ? 'white' : '' }}
            >
              {student.loading ? 'Processing...' : isCheckedIn ? 'Check-out (Pick up)' : 'Check-in (Drop off)'}
            </button>
          </div>
        )})}
        {students.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>You have no assigned students at this time.</p>
        )}
      </div>
    </div>
  );
};

export default CheckInOut;
