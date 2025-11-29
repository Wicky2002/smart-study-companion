import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import NewSession from './pages/NewSession';
import Sessions from './pages/Sessions';
import Notes from './pages/Notes';
import Progress from './pages/Progress';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  return (
    <Router>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/new-session" element={<NewSession />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/progress" element={<Progress />} />
        {/* TODO: Add schedule page */}
        <Route path="/schedule" element={<div style={{padding: '20px'}}>Schedule Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

export default App;
