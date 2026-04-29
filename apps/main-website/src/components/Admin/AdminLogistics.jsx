import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminLogistics = () => {
  const [students, setStudents] = useState([]);
  const [hosts, setHosts] = useState([]);

  useEffect(() => {
    fetchLogistics();
  }, []);

  const fetchLogistics = async () => {
    const { data: hostData } = await supabase.from('profiles').select('*').eq('role', 'host');
    const { data: studentData } = await supabase.from('students').select('*');
    if (hostData) setHosts(hostData);
    if (studentData) setStudents(studentData);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 style={{ fontSize: '2rem', color: 'var(--blue-900)', marginBottom: '0.5rem' }}>Students & Hosts Database</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage student assignments and approve host families.</p>
      </div>

      {/* Host Families Table */}
      <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--blue-100)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--blue-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--blue-900)' }}>Host Families</h2>
          <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', whiteSpace: 'nowrap' }}><Plus size={16} style={{ marginRight: '0.5rem' }}/> Add Host</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead style={{ backgroundColor: 'var(--bg-main)' }}>
              <tr>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Family Name</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hosts.map(h => (
              <tr key={h.id} style={{ borderBottom: '1px solid var(--blue-50)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{h.family_name}</td>
                <td style={{ padding: '1rem 1.5rem' }}>Protected</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}>Approved</span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginRight: '1rem' }}><Edit size={18} /></button>
                  <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Students Table */}
      <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--blue-100)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--blue-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--blue-900)' }}>International Students</h2>
          <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', whiteSpace: 'nowrap' }}><Plus size={16} style={{ marginRight: '0.5rem' }}/> Add Student</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead style={{ backgroundColor: 'var(--bg-main)' }}>
              <tr>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Student Name</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Age</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Assigned Host</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--blue-50)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '1rem 1.5rem' }}>{s.age}</td>
                <td style={{ padding: '1rem 1.5rem' }}>{hosts.find(h => h.id === s.assigned_host_id)?.family_name || 'Unassigned'}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginRight: '1rem' }}><Edit size={18} /></button>
                  <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLogistics;
