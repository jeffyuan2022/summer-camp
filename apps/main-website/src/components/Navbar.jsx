import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tent, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--blue-100)',
      zIndex: 50,
      padding: '1rem 0',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container flex items-center justify-between nav-container">
        <Link to="/" className="flex items-center gap-2" style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.25rem' }}>
          <Tent size={28} />
          <span style={{ fontFamily: 'Outfit, sans-serif' }}>AGI Camp Hosting</span>
        </Link>
        <div className="flex items-center gap-4 nav-links" style={{ fontWeight: 500, color: 'var(--text-main)' }}>
          <Link to="/" style={{ padding: '0.5rem', transition: 'color 0.2s' }}>Home</Link>
          <Link to="/requirements" style={{ padding: '0.5rem', transition: 'color 0.2s' }}>Requirements</Link>
          <Link to="/faq" style={{ padding: '0.5rem', transition: 'color 0.2s' }}>FAQ</Link>
          
          {!user ? (
            <>
              <Link to="/login" style={{ padding: '0.5rem', transition: 'color 0.2s' }}>Host Login</Link>
              <Link to="/apply" className="btn btn-primary" style={{ marginLeft: '0.5rem' }}>Apply to Host</Link>
            </>
          ) : (
            <>
              <Link to="/portal" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>My Portal</Link>
              <button onClick={handleSignOut} style={{ padding: '0.5rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <LogOut size={18} /> Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
