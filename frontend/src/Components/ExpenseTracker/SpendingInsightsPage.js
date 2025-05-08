import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid
} from 'recharts';
import {
  Calendar, ChevronDown, AlertTriangle,
  TrendingUp, Users, Filter, ArrowUpRight
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';

// Theme colors
const THEME = {
  primaryColor: '#4a3aff',
  primaryLight: '#e9e6ff',
  secondaryColor: '#6254ff',
  textDark: '#333',
  textMedium: '#555',
  textLight: '#777',
  bgLight: '#f9f9ff',
  bgWhite: '#fff',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  borderRadius: '12px',
  shadow: '0 2px 10px rgba(74, 58, 255, 0.1)',
};

const CATEGORIES = [
  "Food and Dining",
  "Transportation",
  "Shopping",
  "Bills and Utilities",
  "Entertainment",
  "Travel",
  "Health",
  "Education",
  "Recharge and Subscriptions",
  "Others"
];
const COLORS = [
  '#4a3aff', // Base Blue
  '#6254ff', // Slightly Lighter Blue
  '#7a6eff', // Medium Blue
  '#9288ff', // Soft Blue
  '#aaa2ff', // Light Blue
  '#c2bcff', // Very Light Blue
  '#8c8cff', // Vibrant Lavender
  '#5c5cff', // Bright Indigo
  '#3a3aff', // Deep Indigo
  '#2a2aff'  // Dark Indigo
];

// Styles
const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    color: THEME.textDark,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: THEME.textDark,
    margin: '0',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  filterDropdown: {
    position: 'relative',
  },
  dropdownButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: THEME.bgWhite,
    border: '1px solid #e2e2e2',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    color: THEME.textMedium,
    transition: 'all 0.2s ease',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: '0',
    width: '120px',
    backgroundColor: THEME.bgWhite,
    borderRadius: '8px',
    boxShadow: THEME.shadow,
    zIndex: 10,
    marginTop: '4px',
    overflow: 'hidden',
  },
  dropdownItem: {
    width: '100%',
    padding: '10px 16px',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: THEME.textMedium,
    transition: 'background-color 0.2s ease',
  },
  chartToggle: {
    display: 'flex',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #e2e2e2',
  },
  toggleButton: {
    padding: '8px 16px',
    backgroundColor: THEME.bgWhite,
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    color: THEME.textMedium,
    transition: 'all 0.2s ease',
  },
  toggleButtonActive: {
    backgroundColor: THEME.primaryColor,
    color: 'white',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: THEME.bgWhite,
    borderRadius: THEME.borderRadius,
    boxShadow: THEME.shadow,
    padding: '20px',
  },
  fullWidthCard: {
    gridColumn: '1 / -1',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: THEME.textDark,
    marginTop: '0',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cardIcon: {
    color: THEME.primaryColor,
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: THEME.textLight,
  },
  alertsList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  alertItem: (severity) => ({
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: severity === 'high'
      ? 'rgba(239, 68, 68, 0.05)'
      : severity === 'medium'
        ? 'rgba(245, 158, 11, 0.05)'
        : 'rgba(74, 58, 255, 0.05)',
    borderLeft: `4px solid ${severity === 'high'
      ? THEME.error
      : severity === 'medium'
        ? THEME.warning
        : THEME.primaryColor
      }`,
  }),
  alertHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  alertCategory: {
    fontWeight: '600',
    fontSize: '14px',
  },
  alertSeverity: (severity) => ({
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '12px',
    backgroundColor: severity === 'high'
      ? 'rgba(239, 68, 68, 0.1)'
      : severity === 'medium'
        ? 'rgba(245, 158, 11, 0.1)'
        : 'rgba(74, 58, 255, 0.1)',
    color: severity === 'high'
      ? THEME.error
      : severity === 'medium'
        ? THEME.warning
        : THEME.primaryColor,
  }),
  alertMessage: {
    margin: '0',
    fontSize: '14px',
    color: THEME.textMedium,
  },
  emptyState: {
    color: THEME.textLight,
    textAlign: 'center',
    padding: '40px 0',
  },
  profileContainer: {
    padding: '16px',
    backgroundColor: THEME.bgLight,
    borderRadius: '8px',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  profileBadge: (profile) => ({
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: profile === 'spender'
      ? 'rgba(239, 68, 68, 0.1)'
      : profile === 'balanced'
        ? 'rgba(74, 58, 255, 0.1)'
        : 'rgba(16, 185, 129, 0.1)',
    color: profile === 'spender'
      ? THEME.error
      : profile === 'balanced'
        ? THEME.primaryColor
        : THEME.success,
  }),
  profileDescription: {
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '20px',
    color: THEME.textMedium,
  },
  profileMetrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  metricItem: {
    backgroundColor: THEME.bgWhite,
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  metricLabel: {
    display: 'block',
    fontSize: '12px',
    color: THEME.textLight,
    marginBottom: '4px',
  },
  metricValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: THEME.textDark,
  },
  metricSubValue: {
    fontSize: '12px',
    color: THEME.textMedium,
  },
  trendsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  trendItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  trendInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendCategory: {
    fontSize: '14px',
    fontWeight: '500',
  },
  trendChange: (type) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: '600',
    color: type === 'increase'
      ? THEME.error
      : type === 'decrease'
        ? THEME.success
        : THEME.textLight,
  }),
  rotated: {
    transform: 'rotate(180deg)',
  },
  trendBar: {
    height: '8px',
    backgroundColor: '#e2e2e2',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  trendProgress: (type, width) => ({
    height: '100%',
    width: width,
    borderRadius: '4px',
    backgroundColor: type === 'increase'
      ? THEME.error
      : type === 'decrease'
        ? THEME.success
        : THEME.primaryColor,
  }),
  trendAmount: {
    fontSize: '12px',
    color: THEME.textMedium,
    textAlign: 'right',
  },
};


// Fetch data from the backend

export default function SpendingInsightsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('pie');
  const [userProfile, setUserProfile] = useState('balanced');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dbUser } = useAuth(); // Assuming you have a context for user data
  const [profileMetrics, setProfileMetrics] = useState({
    monthlySpending: 0,
    savingsRate: 0,
    topCategory: { name: '', amount: 0 },
    highestSavingCategory: { name: '', amount: 0 }
  });
  const [spendingTrends, setSpendingTrends] = useState([]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch accounts
        const accountsResponse = await axios.get(`http://localhost:5000/account/getbyuserid/${dbUser._id}`);
        const accounts = accountsResponse.data;
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found for the user.');
        }

        // Find current account
        const currentAcc = accounts.find(acc => acc.accountType === 'current');
        if (!currentAcc) {
          throw new Error('No current account found.');
        }

        // Fetch transactions
        const transactionsResponse = await axios.get(`http://localhost:5000/transaction/accountid/${currentAcc._id}`);
        const data = transactionsResponse.data;
        if (!data || data.length === 0) {
          throw new Error('No transactions found for the account.');
        }

        // Filter transactions
        const filteredTransactions = data.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          const now = new Date();

          if (timeRange === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            return transactionDate >= oneWeekAgo && transactionDate <= now;
          } else if (timeRange === 'month') {
            return (
              transactionDate.getMonth() === now.getMonth() - 1 &&
              transactionDate.getFullYear() === now.getFullYear()
            );
          } else if (timeRange === 'year') {
            return transactionDate.getFullYear() === now.getFullYear();
          }
          return true;
        });
        console.log('Filtered Transactions:', filteredTransactions[10].category);
        setTransactions(filteredTransactions);
        console.log(CATEGORIES);
        // Calculate pie chart data
        const calculatedPieData = CATEGORIES.map((category) => {
          return {
            name: category,
            value: filteredTransactions.reduce((sum, transaction) => {
              return transaction.category?.trim().toLowerCase() === category.toLowerCase()
                ? sum + transaction.debit
                : sum;
            }, 0),
          };
        }).filter((item) => item.value > 0);
        console.log('Pie Chart Data:', calculatedPieData);
        setPieChartData(calculatedPieData);

        if (dbUser.tag) {
          setUserProfile(dbUser.tag.toLowerCase());
        } else {
          setUserProfile('unknown'); // fallback if tag isn't available
        }

        // Calculate metrics
        const currentMonth = new Date().getMonth() - 1;
        const currentYear = new Date().getFullYear();

        // Filter transactions for current month
        const currentMonthTransactions = filteredTransactions.filter(tx => {
          const txDate = new Date(tx.date);
          return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
        });

        // Calculate monthly spending
        const monthlySpending = currentMonthTransactions.reduce((sum, tx) => {
          return sum + (tx.debit || 0);
        }, 0);

        // Calculate savings rate
        const totalIncome = currentMonthTransactions.reduce((sum, tx) => {
          return sum + (tx.credit || 0);
        }, 0);
        const savingsRate = totalIncome > 0 ? ((totalIncome - monthlySpending) / totalIncome) * 100 : 0;

        // Calculate top spending category
        const categorySpending = currentMonthTransactions.reduce((acc, tx) => {
          if (tx.debit > 0) {
            const category = tx.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + tx.debit;
          }
          return acc;
        }, {});

        const topCategory = Object.entries(categorySpending)
          .sort(([, a], [, b]) => b - a)[0] || { name: 'No Data', amount: 0 };

        // Calculate highest saving category
        console.log('Current Month Transactions:', currentMonthTransactions);
        const savingByCategory = currentMonthTransactions.reduce((acc, tx) => {
          console.log('Transaction:', tx.category, tx.credit);
          if (tx.debit > 0 && tx.category?.toLowerCase() !== 'na') {
            const category = tx.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + tx.debit;
          }
          return acc;
        }, {});

        console.log('Saving by Category:', savingByCategory);

        const highestSavingCategory = Object.entries(savingByCategory)
          .sort(([, a], [, b]) => b - a)[0] || ['No Data', 0];

        console.log('Highest Spending Category:', highestSavingCategory[0], 'with amount:', highestSavingCategory[1]);

        console.log('Highest Saving Category:', highestSavingCategory);

        setProfileMetrics({
          monthlySpending,
          savingsRate,
          topCategory: {
            name: topCategory[0],
            amount: topCategory[1]
          },
          highestSavingCategory: {
            name: highestSavingCategory[0],
            amount: highestSavingCategory[1]
          }
        });

        // Calculate trends
        const now = new Date();
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const previousMonthTransactions = filteredTransactions.filter((tx) => {
          const txDate = new Date(tx.date);
          return txDate.getMonth() === previousMonth && txDate.getFullYear() === previousYear;
        });

        const calculateCategoryTotals = (transactions) => {
          return transactions.reduce((acc, tx) => {
            if (tx.debit > 0) {
              const category = tx.category || 'Uncategorized';
              acc[category] = (acc[category] || 0) + tx.debit;
            }
            return acc;
          }, {});
        };

        const currentMonthTotals = calculateCategoryTotals(currentMonthTransactions);
        const previousMonthTotals = calculateCategoryTotals(previousMonthTransactions);

        const trends = CATEGORIES.map((category) => {
          const current = currentMonthTotals[category] || 0;
          const previous = previousMonthTotals[category] || 0;
          const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
          return {
            category,
            change: change.toFixed(1), // Percentage change
            amount: current, // Current month's spending
            previousAmount: previous, // Previous month's spending
            type: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'neutral',
          };
        });

        setSpendingTrends(trends);

      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setDropdownOpen(false);
  };

  const getProfileDescription = () => {
    switch (userProfile) {
      case 'extremespender':
        return "You're an 'Extreme Spender'. You tend to use nearly all your income with very little or no savings, which may put long-term financial goals at risk.";
      case 'spender':
        return "You're a 'Spender'. You use most of your available funds with less focus on saving.";
      case 'balanced':
        return "You're 'Balanced'. You maintain a healthy balance between spending and saving.";
      case 'saver':
        return "You're a 'Saver'. You prioritize saving money and are cautious with your expenses.";
      case 'extremesaver':
        return "You're an 'Extreme Saver'. You save a significant portion of your income and limit spending to essentials only.";
      default:
        return "Your financial habits are being evaluated.";
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Spending Insights & Analysis</h1>
        <div style={styles.filterContainer}>
          <div style={styles.filterDropdown}>
            <button
              style={styles.dropdownButton}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Calendar size={16} />
              <span>{timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</span>
              <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div style={styles.dropdownMenu}>
                <button
                  style={styles.dropdownItem}
                  onClick={() => handleTimeRangeChange('week')}
                >
                  Week
                </button>
                <button
                  style={styles.dropdownItem}
                  onClick={() => handleTimeRangeChange('month')}
                >
                  Month
                </button>
                <button
                  style={styles.dropdownItem}
                  onClick={() => handleTimeRangeChange('year')}
                >
                  Year
                </button>
              </div>
            )}
          </div>

          <div style={styles.chartToggle}>
            <button
              style={{
                ...styles.toggleButton,
                ...(chartType === 'pie' ? styles.toggleButtonActive : {})
              }}
              onClick={() => setChartType('pie')}
            >
              Pie Chart
            </button>
            <button
              style={{
                ...styles.toggleButton,
                ...(chartType === 'bar' ? styles.toggleButtonActive : {})
              }}
              onClick={() => setChartType('bar')}
            >
              Bar Chart
            </button>
          </div>
        </div>
      </header>

      <div style={styles.dashboardGrid}>
        {/* Chart section */}
        <div style={{ ...styles.card, ...styles.fullWidthCard }}>
          <h2 style={styles.cardTitle}>Spending by Category</h2>
          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              ) : (
                <BarChart
                  data={pieChartData} // Use the same data as the PieChart
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" /> {/* Use 'name' for the X-axis */}
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Legend />
                  <Bar dataKey="value" fill={COLORS[0]} /> {/* Use 'value' for the bar height */}
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Unusual spending alerts */}
        {/* <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <AlertTriangle size={20} style={styles.cardIcon} />
            Unusual Spending Alerts
          </h2>
          {mockAlerts.length > 0 ? (
            <ul style={styles.alertsList}>
              {mockAlerts.map(alert => (
                <li key={alert.id} style={styles.alertItem(alert.severity)}>
                  <div style={styles.alertHeader}>
                    <span style={styles.alertCategory}>{alert.category}</span>
                    <span style={styles.alertSeverity(alert.severity)}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                  </div>
                  <p style={styles.alertMessage}>{alert.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div style={styles.emptyState}>No unusual spending detected.</div>
          )}
        </div> */}

        {/* User profile/cluster insights */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Users size={20} style={styles.cardIcon} />
            Your Spending Profile
          </h2>
          <div style={styles.profileContainer}>
            <div style={styles.profileHeader}>
              <span style={styles.profileBadge(userProfile)}>
                {userProfile.charAt(0).toUpperCase() + userProfile.slice(1)}
              </span>
            </div>
            <p style={styles.profileDescription}>{getProfileDescription()}</p>

            <div style={styles.profileMetrics}>
              <div style={styles.metricItem}>
                <span style={styles.metricLabel}>Monthly Avg. Spending</span>
                <span style={styles.metricValue}>
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                  }).format(profileMetrics.monthlySpending)}
                </span>
              </div>
              <div style={styles.metricItem}>
                <span style={styles.metricLabel}>Savings Rate</span>
                <span style={styles.metricValue}>{profileMetrics.savingsRate.toFixed(1)}%</span>
              </div>
              <div style={styles.metricItem}>
                <span style={styles.metricLabel}>Highest Spending Category</span>
                <span style={styles.metricValue}>{profileMetrics.highestSavingCategory.name}</span>
                {/* <span style={styles.metricSubValue}>
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                  }).format(profileMetrics.highestSavingCategory.amount)}
                </span> */}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly trends */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <TrendingUp size={20} style={styles.cardIcon} />
            Spending Trends
          </h2>
          <div style={styles.trendsList}>
            {spendingTrends.map((trend, index) => (
              <div key={index} style={styles.trendItem}>
                <div style={styles.trendInfo}>
                  <span style={styles.trendCategory}>{trend.category}</span>
                  <span style={styles.trendChange(trend.type)}>
                    {trend.type === 'increase' && <ArrowUpRight size={16} />}
                    {trend.type === 'decrease' && <ArrowUpRight size={16} style={styles.rotated} />}
                    {trend.type === 'neutral' && `${Number(trend.amount.toString().slice(0, 2))}%`}
                    {trend.type !== 'neutral' && ` ${Number(trend.amount.toString().slice(0, 2))}%`}
                  </span>
                </div>
                <div style={styles.trendBar}>
                  <div
                    style={{
                      ...styles.trendProgress(trend.type),
                      width: `${Math.min(Number(trend.amount.toString().slice(0, 2)), 100)}%`, // Dynamically set width based on ratio
                    }}
                  ></div>
                </div>
                <span style={styles.trendAmount}>
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  }).format(trend.amount)}{' '}
                  this month
                </span>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
