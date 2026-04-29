import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Requirements from './pages/Requirements';
import FAQ from './pages/FAQ';
import Apply from './pages/Apply';
import Login from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import Portal from './pages/Portal';

function App() {
  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/requirements" element={<Requirements />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Portal Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/portal" element={<Portal />} />
          </Route>
        </Routes>
      </main>
      <footer style={{ backgroundColor: 'var(--blue-900)', color: 'white', padding: '2rem 0', textAlign: 'center' }}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Amazing Grace Institute. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
