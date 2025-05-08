import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Components/Auth/signup';
import Login from './Components/Auth/login';
import Dashboard from './Components/dashboard';
import LandingPage from './Components/landingPage';
import { ProtectedRoute } from './protectedRoute';
import ProfilePage from './Components/Profile/ProfilePage';
import ChatbotPage from './Components/Chatbot/ChatbotPage';
import FAQChatbotPage from './Components/Chatbot/FAQChatbotPage';
import SpendingInsightsPage from './Components/ExpenseTracker/SpendingInsightsPage';
import BudgetPlannerPage from './Components/budgetPlanner/budgetPlannerPage';
import Layout from './Layout';
import './App.css';

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
