import React,{useState} from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';

import { FiLogOut } from 'react-icons/fi';
import { auth } from './Components/Auth/firebase';
import Signup from './Components/Auth/signup';
import Login from './Components/Auth/login';
import Dashboard from './Components/dashboard';
import LandingPage from './Components/landingPage';
import ProfilePage from './Components/Profile/ProfilePage';
import ChatbotPage from './Components/Chatbot/ChatbotPage';
import FAQChatbotPage from './Components/Chatbot/FAQChatbotPage';
import SpendingInsightsPage from './Components/ExpenseTracker/SpendingInsightsPage';
import BudgetPlannerPage from './Components/budgetPlanner/budgetPlannerPage';
import GoalTracker from './Components/GoalTracker/GoalTracker';
import {Link} from 'react-router-dom';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigate('/')
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);


const toggleDropdown = () => {
  setDropdownOpen(prev => !prev);
};

const handleProfile = () => {
  navigate('/profile');
  setDropdownOpen(false);
};



  return (
    <div className="App">
      {location.pathname !== '/'&&location.pathname!=='/login'&&location.pathname!=='/signup' && (
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
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
    <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>

            <a href="https://budgetprofaq.streamlit.app/" style={{ color: 'white', textDecoration: 'none' }}>FAQs</a>
          </div>
          <div style={{ position: 'relative' }}>
  <button
    onClick={toggleDropdown}
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
    <FiUser size={20} />
  </button>

  {dropdownOpen && (
    <div style={{
      position: 'absolute',
      top: '100%',
      right: 0,
      backgroundColor: '#fff',
      color: '#000',
      border: '1px solid #ccc',
      borderRadius: '0.5rem',
      marginTop: '0.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      zIndex: 1000
    }}>
      <div
        onClick={handleProfile}
        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Profile
      </div>
      <div
        onClick={handleLogout}
        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Logout
      </div>
    </div>
  )}
</div>

        </nav>
      )}
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chat" element={<ChatbotPage />} />
        <Route path='/FAQ' element={<FAQChatbotPage />} />
        <Route path='/spendingInsights' element={<SpendingInsightsPage />} />
        <Route path='/goalTracker' element={<GoalTracker />} />
        <Route path='/budget' element={<BudgetPlannerPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default Layout;
