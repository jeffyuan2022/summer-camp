import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Car, Utensils, Clock } from 'lucide-react';

const Requirements = () => {
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--blue-900)', marginBottom: '1rem', textAlign: 'center' }}>Host Family Requirements</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', textAlign: 'center', marginBottom: '4rem' }}>
          Please review the following commitments required for the July 4th - July 12th camp period.
        </p>

        <div className="flex flex-col gap-6">
          <div style={{ padding: '2rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--blue-100)' }}>
            <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--blue-50)', borderRadius: 'var(--radius-md)' }}><BedDouble color="var(--primary)" /></div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--blue-900)' }}>Lodging & Sleeping</h2>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              You must host a minimum of two students, with no maximum limitation. You must provide a dedicated, comfortable bed for each student. Two students of the same gender may share a Queen or King-sized bed. Air mattresses or couches are not acceptable.
            </p>
          </div>

          <div style={{ padding: '2rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--blue-100)' }}>
            <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--blue-50)', borderRadius: 'var(--radius-md)' }}><Car color="var(--primary)" /></div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--blue-900)' }}>Transportation</h2>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              Hosts are required to provide daily pick-up and drop-off at the <b>Amazing Grace Institute</b> (<b>10760 Thernmint Rd. San Diego, CA 92127</b>). On the first day (July 4th), you will only pick up students around 6 PM. On the last day (July 12th), you will only drop off students around 9 AM.
            </p>
          </div>

          <div style={{ padding: '2rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--blue-100)' }}>
            <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--blue-50)', borderRadius: 'var(--radius-md)' }}><Utensils color="var(--primary)" /></div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--blue-900)' }}>Meals</h2>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              Host families must provide daily breakfast and dinner for the students. On the first day (July 4th), you are only responsible for dinner. On the last day (July 12th), you are only responsible for breakfast. Lunches are typically provided by the camp during their daily excursions.
            </p>
          </div>

          <div style={{ padding: '2rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--blue-100)' }}>
            <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--blue-50)', borderRadius: 'var(--radius-md)' }}><Clock color="var(--primary)" /></div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--blue-900)' }}>Evening Engagement</h2>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              The most rewarding part of the program! We ask that you spend engaging evenings with your students—whether that's cooking together, playing board games, or just conversing about your day to help them practice English.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Ready to Host?</h3>
          <Link to="/apply" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}>Start Your Application</Link>
        </div>
      </div>
    </div>
  );
};

export default Requirements;
