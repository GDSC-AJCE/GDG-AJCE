import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/Header';
import AdminProvider from './contexts/AdminContext';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import Core from './pages/Core';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';

const App = () => {
  return (
    <AdminProvider>
      <Router>
        <div className="min-h-screen bg-neutral-50 text-neutral-900 antialiased selection:bg-blue-200/60 selection:text-neutral-900">
          <div className="min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/core" element={<Core />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AdminProvider>
  );
};

export default App;
