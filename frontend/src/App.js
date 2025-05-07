import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Components/Auth/signup';
import Login from './Components/Auth/login';
import Dashboard from './Components/dashboard';
import LandingPage from './Components/landingPage';
import { ProtectedRoute } from './protectedRoute';
import ProfilePage from './Components/Profile/ProfilePage';
import { FiLogOut } from 'react-icons/fi';
import './App.css';
import ChatbotPage from './Components/Chatbot/ChatbotPage';
import FAQChatbotPage from './Components/Chatbot/FAQChatbotPage';
import SpendingInsightsPage from './Components/ExpenseTracker/SpendingInsightsPage';
import BudgetPlannerPage from './Components/budgetPlanner/budgetPlannerPage';
import { auth } from './Components/Auth/firebase';
function App() {
  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        window.location.replace('/'); // Redirect to landing page
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };
  return (  
    <Router>
      <div className="App">
      <nav style={{
        backgroundColor: '#4a3aff',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        marginBottom: '2rem',
        width: '98%'
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#1" style={{ color: 'white', textDecoration: 'none' }}>1</a>
          <a href="#2" style={{ color: 'white', textDecoration: 'none' }}>2</a>
          <a href="#3" style={{ color: 'white', textDecoration: 'none' }}>2</a>
          <a href="/FAQ" style={{ color: 'white', textDecoration: 'none' }}>FAQs</a>
        </div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid white',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FiLogOut size={20} />
        </button>
      </nav>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path='/chat' element={<ChatbotPage/>} />
          <Route path='/FAQ'element={<FAQChatbotPage/>} />
          <Route path='/spendingInsights' element={<SpendingInsightsPage/>}/>
          <Route path='/budget' element={<BudgetPlannerPage/>}/>
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
