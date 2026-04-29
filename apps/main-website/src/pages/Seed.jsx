import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const Seed = () => {
  const [log, setLog] = useState('');
  const [loading, setLoading] = useState(false);

  const writeLog = (msg) => {
    setLog(prev => prev + '\n> ' + msg);
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const runSeeder = async () => {
    setLoading(true);
    setLog('Initializing Supabase Database Seeding...');
    
    try {
      // 1. Create Admin Account
      writeLog('Signing up jeff.admin@agi.edu...');
      const { data: adminData, error: adminErr } = await supabase.auth.signUp({
        email: 'jeff.admin@agi.edu',
        password: 'password123',
        options: {
          data: { role: 'admin', family_name: 'AGI Command Center' }
        }
      });
      if (adminErr) throw adminErr;
      const adminId = adminData.user.id;
      writeLog('Success! Admin UUID: ' + adminId);
      
      await delay(1000);

      // 2. Create Host Account
      writeLog('Signing up host.smith@agi.edu...');
      const { data: hostData, error: hostErr } = await supabase.auth.signUp({
        email: 'host.smith@agi.edu',
        password: 'password123',
        options: {
          data: { role: 'host', family_name: 'Smith Family' }
        }
      });
      if (hostErr) throw hostErr;
      const hostId = hostData.user.id;
      writeLog('Success! Host UUID: ' + hostId);
      
      // Because Supabase auto-logs you in upon signUp, sign out immediately to prevent token conflicts
      await supabase.auth.signOut();
      
      // Re-Authenticate as Admin to seed protected records (if RLS was enabled)
      // Since RLS is off in our MVP schema, we can insert regardless, but let's do it cleanly
      await supabase.auth.signInWithPassword({ email: 'jeff.admin@agi.edu', password: 'password123' });

      await delay(1000);
      
      // 3. Seed Students
      writeLog('Injecting Students into Database...');
      const { error: studentErr } = await supabase.from('students').insert([
        { name: 'Wei-Chen Lin', age: 16, assigned_host_id: hostId, status: 'checked_in' },
        { name: 'Yu-Ting Chen', age: 15, assigned_host_id: hostId, status: 'checked_out' },
        { name: 'Chih-Hao Wu', age: 17, assigned_host_id: null, status: 'pending' }, // Unassigned
      ]);
      if (studentErr) throw studentErr;
      
      // 4. Seed Announcements
      writeLog('Injecting Global Announcements...');
      const { error: announceErr } = await supabase.from('announcements').insert([
        { title: 'Welcome to AGI 2026', content: 'Thank you for hosting our spectacular students! Check your schedules regularly.' },
        { title: 'Traffic Update', content: 'There is major construction near I-5. Please expect 15 minute delays.' }
      ]);
      if (announceErr) throw announceErr;

      // Finish
      writeLog('==============================');
      writeLog('SEEDING COMPLETED SUCCESSFULLY!');
      writeLog('Test Accounts Created:');
      writeLog('- EMAIL: jeff.admin@agi.edu | PASSWORD: password123');
      writeLog('- EMAIL: host.smith@agi.edu | PASSWORD: password123');
      writeLog('You may now delete this /seed route and navigate to /login.');
      
    } catch (err) {
      writeLog('ERROR: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#10b981', fontFamily: 'monospace', padding: '3rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'white', marginBottom: '2rem' }}>AGI Database Seeder</h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
          This script will communicate directly via API to your Supabase project to generate secure Auth accounts, trigger your newly created SQL profile builders, and populate the tables with mock data.
        </p>
        
        <button 
          onClick={runSeeder}
          disabled={loading}
          style={{ backgroundColor: '#3b82f6', color: 'white', padding: '1rem 2rem', fontSize: '1.25rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Executing Network Requests...' : 'EXECUTE SEED SCRIPT NOW'}
        </button>
        
        <div style={{ marginTop: '3rem', backgroundColor: 'black', padding: '2rem', borderRadius: '8px', minHeight: '300px', whiteSpace: 'pre-wrap' }}>
          {log || 'Waiting for execution...'}
        </div>
      </div>
    </div>
  );
};

export default Seed;
