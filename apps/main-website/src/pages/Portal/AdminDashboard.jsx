import React, { useState } from 'react';
import { Users, Megaphone, CheckSquare, MessageSquare } from 'lucide-react';
import AdminLogistics from '../../components/Admin/AdminLogistics';
import AdminAnnouncements from '../../components/Admin/AdminAnnouncements';
import CheckInMonitor from '../../components/Admin/CheckInMonitor';
import AdminInbox from '../../components/Admin/AdminInbox';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('monitor');

  const tabs = [
    { id: 'monitor', label: 'Live Check-in Monitor', icon: <CheckSquare size={20} /> },
    { id: 'logistics', label: 'Students & Hosts', icon: <Users size={20} /> },
    { id: 'announcements', label: 'Schedule & Announcements', icon: <Megaphone size={20} /> },
    { id: 'inbox', label: 'Support Inbox', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: 'calc(100vh - 72px)', backgroundColor: 'var(--bg-main)' }}>
      
      {/* Admin Sidebar */}
      <div className="admin-sidebar" style={{ width: '280px', backgroundColor: 'white', borderRight: '1px solid var(--blue-100)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1rem', paddingLeft: '1rem' }}>
          Admin Command Center
        </h2>
        
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: activeTab === tab.id ? 'var(--blue-50)' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-main)',
              fontWeight: activeTab === tab.id ? 600 : 500,
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="admin-content-area" style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        {activeTab === 'monitor' && <CheckInMonitor />}
        {activeTab === 'logistics' && <AdminLogistics />}
        {activeTab === 'announcements' && <AdminAnnouncements />}
        {activeTab === 'inbox' && <AdminInbox />}
      </div>

    </div>
  );
};

export default AdminDashboard;
