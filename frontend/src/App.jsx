import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        {/* TODO: Add more routes for other pages */}
        <Route path="/new-session" element={<div style={{padding: '20px'}}>New Session Page - Coming Soon</div>} />
        <Route path="/sessions" element={<div style={{padding: '20px'}}>Sessions Page - Coming Soon</div>} />
        <Route path="/notes" element={<div style={{padding: '20px'}}>Notes Page - Coming Soon</div>} />
        <Route path="/progress" element={<div style={{padding: '20px'}}>Progress Page - Coming Soon</div>} />
        <Route path="/schedule" element={<div style={{padding: '20px'}}>Schedule Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

export default App;
