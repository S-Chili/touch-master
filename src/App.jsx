// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home/Home.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx'; 
import Lessons from './pages/Lessons/Lessons.jsx';
import Games from './pages/Games/Games.jsx';
import Stats from './pages/Stats/Stats.jsx';
import Layout from './components/Layout/Layout.jsx'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="games" element={<Games />} />
        <Route path="stats" element={<Stats />} />
      </Route>
      <Route path="*" element={<h1>404: Not Found (Спробуйте / або /dashboard)</h1>} />
      
    </Routes>
  );
}

export default App;