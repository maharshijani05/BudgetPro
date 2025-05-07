import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MessageSquare, TrendingUp, DollarSign, PieChart, User } from 'lucide-react';
import styles from './dashboard.module.css';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { auth } from './Auth/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { userName,currentUser } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.replace('/'); // redirect to landing page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  // Mock data - in a real application, this would come from your API
  const [monthlyData] = useState([
    { month: 'Jan', spending: 2400 },
    { month: 'Feb', spending: 1398 },
    { month: 'Mar', spending: 3200 },
    { month: 'Apr', spending: 2780 },
    { month: 'May', spending: 1890 },
    { month: 'Jun', spending: 2390 },
  ]);

  const [insights] = useState([
    {
      title: 'Highest Expense: Groceries',
      description: 'You spent 30% more on groceries this month compared to last month',
      icon: <PieChart className={styles.insightIcon} />
    },
    {
      title: 'Savings Target',
      description: 'You are 75% of the way to your monthly savings goal',
      icon: <DollarSign className={styles.insightIcon} />
    },
    {
      title: 'Subscription Alert',
      description: 'You have 3 unused subscriptions totaling $45/month',
      icon: <TrendingUp className={styles.insightIcon} />
    }
  ]);

  const [savingsProgress] = useState(75); // Percentage of savings goal achieved

  const [quickActions] = useState([
    { 
      name: 'Chat with AI', 
      icon: <MessageSquare />, 
      color: '#6366f1',
      onClick: () => navigate('/chat')  // Replace with your actual route or function
    },
    { 
      name: 'Spending Insights', 
      icon: <TrendingUp />, 
      color: '#8b5cf6',
      onClick: () => navigate('/spendingInsights')
    },
    { 
      name: 'Budget Planner', 
      icon: <DollarSign />, 
      color: '#ec4899',
      onClick: () => navigate('/budget')
    },
    { 
      name: 'Goal Tracker', 
      icon: <PieChart />,
      color: '#f59e0b',
      onClick: () => navigate('/profile')
    }
  ]);
  
  return (
    <div className={styles.dashboardContainer}>
      {/* Add Navbar */}
     

      <header className={styles.dashboardHeader}>
        <h1>Financial Dashboard</h1>
        <p className={styles.welcomeText}>Welcome back, { userName|| currentUser?.email?.split('@')[0] || 'User'}! Here's your financial overview.</p>
      </header>

      <div className={styles.dashboardGrid}>
        <section className={styles.chartSection}>
          <h2>Monthly Spending</h2>
          <div className={styles.chart}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="spending" fill="#4a3aff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className={styles.insightsSection}>
          <h2>Key Insights</h2>
          <div className={styles.insightsList}>
            {insights.map((insight, index) => (
              <div className={styles.insightCard} key={index}>
                <div className={styles.insightIconContainer}>
                  {insight.icon}
                </div>
                <div className={styles.insightContent}>
                  <h3>{insight.title}</h3>
                  <p>{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.budgetSection}>
          <h2>Budget Progress</h2>
          <div className={styles.savingsProgress}>
            <div className={styles.progressText}>
              <p>Monthly Savings Goal</p>
              <p className={styles.progressPercentage}>{savingsProgress}%</p>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${savingsProgress}%` }}
              ></div>
            </div>
            <div className={styles.progressLabels}>
              <span>$0</span>
              <span>$1,000</span>
            </div>
          </div>
        </section>

        <section className={styles.quickAccessSection}>
          <h2>Quick Access</h2>
          <div className={styles.quickAccessGrid}>
            {quickActions.map((action, index) => (
              <button
                className={styles.quickAccessButton}
                key={index}
                style={{ backgroundColor: action.color }}
                onClick={action.onClick}
              >
                <span className={styles.actionIcon}>{action.icon}</span>
                <span className={styles.actionName}>{action.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;