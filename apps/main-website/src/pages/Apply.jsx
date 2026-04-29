import React from 'react';

const Apply = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--blue-900)', marginBottom: '1rem' }}>Host Family Application</h1>
          <p style={{ color: 'var(--text-muted)' }}>Please fill out the secure Google Form below to apply for the July 4-12 program.</p>
        </div>

        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          {/* Note: The Google Form iframe from the user's specific link */}
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdc6p-5YsxhwXUsqu2n3UlCg9Ln0zGd-X4EsHL40MD5nj4Rpw/viewform?embedded=true"
            width="100%"
            height="1200"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Host Family Registration Form"
          >
            Loading form...
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default Apply;
