import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MessageSquare, TrendingUp, DollarSign, PieChart, User } from 'lucide-react';
import styles from './dashboard.module.css';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { auth } from './Auth/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { userName, currentUser, dbUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [insights, setInsights] = useState([]);
  const [savingsProgress, setSavingsProgress] = useState(0);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [monthlySpending, setMonthlySpending] = useState({});

  // Fetch user's current account and transactions
  useEffect(() => {
    const fetchData = async () => {
      if (!dbUser?._id) return;

      try {
        setLoading(true);
        console.log("Getting account data");
        const accountsResponse = await axios.get(`https://budgetpro-backend.onrender.com/account/getbyuserid/${dbUser._id}`);
        console.log("Account data fetched:", accountsResponse.data);
        const accounts = accountsResponse.data;

        // Find current account
        const currentAcc = accounts.find(acc => acc.accountType === 'current');
        if (!currentAcc) {
          throw new Error('No current account found');
        }
        setCurrentAccount(currentAcc);
        console.log("Current account:", currentAcc);

        // Fetch transactions for current account
        const transactionsResponse = await axios.get(`https://budgetpro-backend.onrender.com/transaction/accountid/${currentAcc._id}`);
        console.log("Transactions data fetched:", transactionsResponse.data);
        const allTransactions = transactionsResponse.data;
        setTransactions(allTransactions);
        console.log("All transactions:", allTransactions);

        // Calculate monthly spending data
        const spendingData = calculateMonthlySpending(allTransactions);
        setMonthlySpending(spendingData);
        console.log("Monthly spending data:", spendingData);

        // Calculate insights
        console.log("Calculating insights...");
        const calculatedInsights = calculateInsights(allTransactions, dbUser);
        setInsights(calculatedInsights);

        // Calculate savings progress
        console.log("Calculating savings progress...");
        const progress = calculateSavingsProgress(allTransactions, dbUser);
        setSavingsProgress(progress);

        setError(null);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dbUser?._id]);

  // Calculate monthly spending data
  const calculateMonthlySpending = (transactions) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 5);

    const monthlySpending = {};
    months.forEach(month => {
      monthlySpending[month] = 0;
    });

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      if (date >= sixMonthsAgo && date <= currentDate) {
        const month = months[date.getMonth()];
        if (transaction.debit > 0) {
          monthlySpending[month] += transaction.debit;
          console.log(`Transaction on ${date.toDateString()}: ${transaction.debit} in ${month}`);
        }
      }
    });

    console.log("Monthly spending data:", monthlySpending);
    return monthlySpending;
  };

  // Calculate chart data from monthly spending
  const calculateChartData = (spendingData) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();

    // Get the last six months, handling wrapping around the year
    const lastSixMonths = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      lastSixMonths.push(months[monthIndex]);
    }

    // Map the spending data to the last six months
    return lastSixMonths.map(month => ({
      month,
      spending: spendingData[month] || 0
    }));
  };

  // Update monthly data when spending data changes
  useEffect(() => {
    const data = calculateChartData(monthlySpending);
    setMonthlyData(data);
    console.log("Updated monthly data for chart:", data);
  }, [monthlySpending]);

  // Calculate insights from transactions
  const calculateInsights = (transactions, user) => {
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    // Calculate highest expense category
    const categorySpending = {};
    transactions.forEach(tx => {
      if (tx.debit > 0 && new Date(tx.date).getMonth() === currentMonth) {
        categorySpending[tx.category] = (categorySpending[tx.category] || 0) + tx.debit;
      }
    });

    const highestCategory = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)[0];

    // Calculate savings progress
    const monthlyIncome = user.income || 0;
    const savingsTarget = monthlyIncome * (user.save_per / 100);
    const currentSavings = transactions
      .filter(tx => tx.credit > 0 && new Date(tx.date).getMonth() === currentMonth)
      .reduce((sum, tx) => sum + tx.credit, 0);

    const savingsProgress = Math.min(100, (currentSavings / savingsTarget) * 100);

    // Calculate unused subscriptions
   
// Filter transactions for "Recharge And Subscription" in the current month

const subscriptions = transactions.filter(
  (tx) =>
    tx.category === 'Recharge And Subscription' &&
    new Date(tx.date).getMonth() === currentMonth
);
    return [
      {
        title: `Highest Expense: ${highestCategory?.[0] || 'N/A'}`,
        description: highestCategory ?
          `You spent ${formatCurrency(highestCategory[1])} on ${highestCategory[0]} this month` :
          'No expenses recorded this month',
        icon: <PieChart className={styles.insightIcon} />
      },
      {
        title: 'Savings Target',
        description: `You are 30% of the way to your monthly savings goal`,
        icon: <DollarSign className={styles.insightIcon} />
      },
      {
        title: 'Subscription Alert',
        description: `You have ${subscriptions.length || 3}   active subscriptions`,
        icon: <TrendingUp className={styles.insightIcon} />
      }
    ];
  };

  // Calculate savings progress
  const calculateSavingsProgress = (transactions, user) => {
    const monthlyIncome = user.income || 0;
    const savingsTarget = monthlyIncome * (user.save_per / 100);
    const currentMonth = new Date().getMonth();

    const currentSavings = transactions
      .filter(tx => tx.credit > 0 && new Date(tx.date).getMonth() === currentMonth)
      .reduce((sum, tx) => sum + tx.credit, 0);

    return Math.min(100, (currentSavings / savingsTarget) * 100);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const quickActions = [
    {
      name: 'Chat with AI',
      icon: <MessageSquare />,
      color: '#6366f1',
      onClick: () =>  {
        window.location.href = 'https://budgetpropfa.streamlit.app/';
      }
      
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
      onClick: () => navigate('/goalTracker')
    }
  ];

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1>Financial Dashboard</h1>
        <p className={styles.welcomeText}>
          Welcome back, {userName || currentUser?.email?.split('@')[0] || 'User'}!
          Here's your financial overview.
        </p>
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
                <Tooltip formatter={(value) => formatCurrency(value)} />
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
      <p>Monthly Spendings</p>
      <p className={styles.progressPercentage}>
        {formatCurrency(
          monthlyData.find(data => data.month === new Date().toLocaleString('default', { month: 'short' }))?.spending || 0
        )}
      </p>
    </div>
    <div className={styles.progressBar}>
      <div
        className={styles.progressFill}
        style={{
          width: `${Math.min(
            (monthlyData.find(data => data.month === new Date().toLocaleString('default', { month: 'short' }))?.spending || 0) /
              (dbUser?.income || 1) *
              100,
            100
          )}%`
        }}
      ></div>
    </div>
    <div className={styles.progressLabels}>
      <span>{formatCurrency(0)}</span>
      <span>{formatCurrency(dbUser?.income * (1 - (dbUser?.save_per / 100)) || 0)}</span>
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