import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, DollarSign, Globe, Calendar } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Image Layer */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/images/host_family_hero_1776660093102.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.6)',
          zIndex: 1
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10, color: 'white' }}>
          <div style={{ maxWidth: '800px' }}>
            <span style={{ 
              display: 'inline-block',
              backgroundColor: 'var(--primary)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              July 4 – July 12, {new Date().getFullYear()} • San Diego, CA
            </span>
            
            <h1 className="hero-title">
              Open Your Home.<br />
              <span style={{ color: 'var(--blue-300)' }}>Open Their World.</span>
            </h1>
            
            <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9, maxWidth: '600px' }}>
              Host a student from Taiwan this summer! Provide a welcoming cross-cultural experience while earning compensation for your hospitality.
            </p>
            
            <div className="flex items-center gap-4 hero-buttons">
              <Link to="/apply" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                Apply to Host
              </Link>
              <Link to="/requirements" className="btn btn-outline" style={{ 
                padding: '1rem 2.5rem', 
                fontSize: '1.125rem', 
                color: 'white', 
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                View Requirements
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Host Section */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--blue-900)', marginBottom: '1rem' }}>Why Host With AGI?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
              Hosting an international student is an enriching experience that brings global perspectives directly into your living room.
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
          }}>
            {[
              { icon: <DollarSign size={40} color="var(--primary)"/>, title: 'Earn Compensation', desc: 'Receive a stipend of $560 per student for the duration of the camp to cover meals, transportation, and setup.' },
              { icon: <Globe size={40} color="var(--primary)"/>, title: 'Cultural Enrichment', desc: 'Share your traditions and learn theirs. A unique opportunity to bridge the gap between Taiwan and America.' },
              { icon: <Heart size={40} color="var(--primary)"/>, title: 'Meaningful Connections', desc: 'Create lifelong friendships and become an essential part of an international student’s American experience.' },
              { icon: <Calendar size={40} color="var(--primary)"/>, title: 'Short Commitment', desc: 'The program runs for just over a week (July 4th - July 12th). A perfect, manageable summer initiative.' },
            ].map((feature, i) => (
              <div key={i} style={{
                padding: '2.5rem 2rem',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ marginBottom: '1.5rem', display: 'inline-block', padding: '1rem', backgroundColor: 'var(--blue-50)', borderRadius: 'var(--radius-lg)' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--blue-900)', marginBottom: '1rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Photo Section */}
      <section style={{ padding: '6rem 0', backgroundColor: 'white' }}>
        <div className="container flex items-center gap-8 flex-wrap">
          <div style={{ flex: '1 1 500px' }}>
            <img 
              src="/images/cultural_exchange_1776660115913.png" 
              alt="Cultural Exchange" 
              style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} 
            />
          </div>
          <div style={{ flex: '1 1 500px', padding: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--blue-900)', marginBottom: '1.5rem' }}>Make a Difference</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '1.5rem', lineHeight: 1.8 }}>
              Our students come from Taiwan eager to learn about American culture, practice their English, and experience the warmth of a local family. As a host, you provide the safe haven that makes this exchange possible.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Hosts are primarily responsible for comfortable sleeping arrangements, daily breakfasts and dinners, and morning/evening transportation to Grace Christian School. We handle the rest!
            </p>
            <Link to="/requirements" className="btn btn-outline">Review Detailed Requirements</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
