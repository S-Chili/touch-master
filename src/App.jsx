import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home/Home.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx'; 
import Lessons from './pages/Lessons/Lessons.jsx';
import Games from './pages/Games/Games.jsx';
import Stats from './pages/Stats/Stats.jsx';
import Layout from './components/Layout/Layout.jsx'; 
import LessonDynamic from "./pages/Lessons/LessonDynamic.jsx";
import AccuracyShield from "./pages/Games/AccuracyShield.jsx";
import RaceAgainstTime from "./pages/Games/RaceAgainstTime.jsx";
import MemoryMaze from './pages/Games/MemoryMaze.jsx';
import WarmUp from './pages/Dashboard/WarmUp.jsx';
import FreeTyping from './pages/Dashboard/FreeTyping.jsx';
import About from './pages/Dashboard/About.jsx';
function App() {
  return (
    <Routes>

      <Route path="/" element={<HomePage />} />

      <Route path="/" element={<Layout />}>

        <Route path="dashboard">
          <Route index element={<Dashboard />} />
          <Route path="warmup" element={<WarmUp />} />
          <Route path="free-typing" element={<FreeTyping />} /> 
          <Route path="about" element={<About />} />
        </Route>
        <Route path="lessons">
          <Route index element={<Lessons />} />        
          <Route path=":id" element={<LessonDynamic />} /> 
        </Route>

        <Route path="games">
          <Route index element={<Games />} />
          <Route path="race" element={<RaceAgainstTime />} />
          <Route path="accuracy" element={<AccuracyShield />} />
          <Route path="memory" element={<MemoryMaze />} />
        </Route>
        <Route path="stats" element={<Stats />} />

      </Route>

      <Route path="*" element={<h1>404 Not Found</h1>} />

    </Routes>
  );
}

export default App;
