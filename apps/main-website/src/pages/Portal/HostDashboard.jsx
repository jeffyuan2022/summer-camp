import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Calendar as CalendarIcon, CheckCircle2, Smartphone, Save } from 'lucide-react';
import CheckInOut from './CheckInOut';
import Communications from './Communications';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const { user } = useAuth();
  
  const [phone, setPhone] = useState('');
  const [carrier, setCarrier] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (data) setAnnouncements(data);
    };
    fetchAnnouncements();

    const channel = supabase.channel('host_announcements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, fetchAnnouncements)
      .subscribe();
      
    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase.from('profiles').select('phone_number, carrier, sms_consent').eq('id', user.id).single();
        if (data) {
          setPhone(data.phone_number || '');
          setCarrier(data.carrier || '');
          setSmsConsent(data.sms_consent || false);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const saveSettings = async () => {
    if (!user) return;
    setSavingSettings(true);
    await supabase.from('profiles').update({
      phone_number: phone,
      carrier: carrier,
      sms_consent: smsConsent
    }).eq('id', user.id);
    setSavingSettings(false);
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--blue-900)' }}>Host Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Welcome back! Here is your daily overview.</p>
      </div>

      <div className="dashboard-grid">
        
        {/* Left Column: Logistics & Comms */}
        <div className="flex flex-col gap-8 dashboard-col">
          
          {/* Daily Schedule Card */}
          <div className="mod-logistics" style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-md)', border: '1px solid var(--blue-100)' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--blue-900)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarIcon size={24} color="var(--primary)" /> Today's Logistics
            </h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4" style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--blue-50)' }}>
                <div style={{ backgroundColor: '#fef3c7', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}><Clock color="#d97706" /></div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Morning Drop-off: 8:00 AM</h3>
                  <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                    <MapPin size={16} /> AGI Campus (10760 Thernmint Rd)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div style={{ backgroundColor: '#e0e7ff', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}><Clock color="#4f46e5" /></div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Evening Pick-up: 5:00 PM <span style={{ fontSize: '0.875rem', backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.5rem', borderRadius: '4px', marginLeft: '0.5rem' }}>Modified</span></h3>
                  <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                    <MapPin size={16} /> La Jolla Shores (Lifeguard Tower 32)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Communications Hub */}
          <div className="mod-comms">
            <Communications />
          </div>
        </div>

        {/* Right Column: Actions & Alerts */}
        <div className="flex flex-col gap-8 dashboard-col">
          
          {/* Check-in / Check-out System */}
          <div className="mod-checkin">
            <CheckInOut />
          </div>

          {/* Announcements */}
          <div className="mod-announcements" style={{ backgroundColor: 'var(--blue-50)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--blue-200)' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--blue-900)', marginBottom: '1.5rem' }}>Global Announcements</h2>
            <div className="flex flex-col gap-3">
              {announcements.map(a => (
                <div key={a.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontWeight: 600, color: 'var(--text-main)' }}>{a.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(a.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{a.content}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Notification Settings */}
          <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--blue-100)' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--blue-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Smartphone size={20} color="var(--primary)" /> SMS Notifications
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="(555) 123-4567"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--blue-200)' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Mobile Carrier</label>
                <select 
                  value={carrier} 
                  onChange={(e) => setCarrier(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--blue-200)' }}
                >
                  <option value="">Select a carrier...</option>
                  <option value="att">AT&T</option>
                  <option value="verizon">Verizon</option>
                  <option value="tmobile">T-Mobile</option>
                  <option value="sprint">Sprint</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="smsConsent" 
                  checked={smsConsent} 
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  style={{ marginTop: '0.25rem' }}
                />
                <label htmlFor="smsConsent" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  I consent to receive text messages for important notifications. By declining, I acknowledge I am responsible for providing immediate attention to communications through my email address or this web platform.
                </label>
              </div>
              <button 
                onClick={saveSettings} 
                disabled={savingSettings}
                className="btn btn-primary" 
                style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}
              >
                <Save size={18} /> {savingSettings ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
