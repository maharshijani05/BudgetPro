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
  '#4a3aff', '#6254ff', '#7a6eff', '#9288ff', 
  '#aaa2ff', '#c2bcff', '#dad6ff', '#e9e6ff', 
  '#f2f0ff', '#f8f7ff'
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
    borderLeft: `4px solid ${
      severity === 'high' 
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

// Mock data for the charts
const mockTransactionsData = [
  { month: 'Jan', "Food and Dining": 450, "Transportation": 200, "Shopping": 300, "Bills and Utilities": 350, "Entertainment": 150 },
  { month: 'Feb', "Food and Dining": 470, "Transportation": 220, "Shopping": 250, "Bills and Utilities": 350, "Entertainment": 180 },
  { month: 'Mar', "Food and Dining": 540, "Transportation": 180, "Shopping": 320, "Bills and Utilities": 350, "Entertainment": 200 },
  { month: 'Apr', "Food and Dining": 520, "Transportation": 190, "Shopping": 400, "Bills and Utilities": 400, "Entertainment": 150 },
  { month: 'May', "Food and Dining": 490, "Transportation": 220, "Shopping": 280, "Bills and Utilities": 350, "Entertainment": 170 },
  { month: 'Jun', "Food and Dining": 560, "Transportation": 240, "Shopping": 220, "Bills and Utilities": 350, "Entertainment": 220 },
];

const pieChartData = [
  { name: "Food and Dining", value: 2500 },
  { name: "Transportation", value: 1250 },
  { name: "Shopping", value: 1770 },
  { name: "Bills and Utilities", value: 2150 },
  { name: "Entertainment", value: 1070 },
  { name: "Travel", value: 890 },
  { name: "Health", value: 650 },
  { name: "Education", value: 430 },
  { name: "Recharge and Subscriptions", value: 780 },
  { name: "Others", value: 390 }
];

// Mock insights and alerts
const mockAlerts = [
  { id: 1, category: "Entertainment", message: "Entertainment spending is 35% higher than your monthly average", severity: "high" },
  { id: 2, category: "Shopping", message: "Shopping expenses are unusually high this month", severity: "medium" },
  { id: 3, category: "Food and Dining", message: "You're spending more on dining out compared to last month", severity: "low" }
];

export default function SpendingInsightsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('pie');
  const [userProfile, setUserProfile] = useState('balanced');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // This would typically come from an API call
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulating API fetch
    setTimeout(() => {
      setTransactions(mockTransactionsData);
      setLoading(false);
    }, 1000);
  }, [timeRange]);
  
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setDropdownOpen(false);
  };
  
  const getProfileDescription = () => {
    switch(userProfile) {
      case 'spender':
        return "Your spending patterns indicate you're a 'Spender'. You tend to use most of your available funds with less focus on savings.";
      case 'saver':
        return "Your spending patterns indicate you're a 'Saver'. You prioritize saving money and are careful with your spending.";
      default:
        return "Your spending patterns indicate you're 'Balanced'. You maintain a healthy balance between spending and saving.";
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
        <div style={{...styles.card, ...styles.fullWidthCard}}>
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
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              ) : (
                <BarChart
                  data={transactions}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Bar dataKey="Food and Dining" fill={COLORS[0]} />
                  <Bar dataKey="Transportation" fill={COLORS[1]} />
                  <Bar dataKey="Shopping" fill={COLORS[2]} />
                  <Bar dataKey="Bills and Utilities" fill={COLORS[3]} />
                  <Bar dataKey="Entertainment" fill={COLORS[4]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
        
        {/* Unusual spending alerts */}
        <div style={styles.card}>
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
        </div>
        
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
                <span style={styles.metricValue}>$2,450</span>
              </div>
              <div style={styles.metricItem}>
                <span style={styles.metricLabel}>Savings Rate</span>
                <span style={styles.metricValue}>18%</span>
              </div>
              <div style={styles.metricItem}>
                <span style={styles.metricLabel}>Top Category</span>
                <span style={styles.metricValue}>Food & Dining</span>
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
            <div style={styles.trendItem}>
              <div style={styles.trendInfo}>
                <span style={styles.trendCategory}>Food & Dining</span>
                <span style={styles.trendChange('increase')}>
                  <ArrowUpRight size={16} /> 12%
                </span>
              </div>
              <div style={styles.trendBar}>
                <div style={styles.trendProgress('increase', '75%')}></div>
              </div>
              <span style={styles.trendAmount}>$540 this month</span>
            </div>
            <div style={styles.trendItem}>
              <div style={styles.trendInfo}>
                <span style={styles.trendCategory}>Transportation</span>
                <span style={styles.trendChange('decrease')}>
                  <ArrowUpRight size={16} style={styles.rotated} /> 8%
                </span>
              </div>
              <div style={styles.trendBar}>
                <div style={styles.trendProgress('decrease', '45%')}></div>
              </div>
              <span style={styles.trendAmount}>$190 this month</span>
            </div>
            <div style={styles.trendItem}>
              <div style={styles.trendInfo}>
                <span style={styles.trendCategory}>Shopping</span>
                <span style={styles.trendChange('increase')}>
                  <ArrowUpRight size={16} /> 25%
                </span>
              </div>
              <div style={styles.trendBar}>
                <div style={styles.trendProgress('increase', '85%')}></div>
              </div>
              <span style={styles.trendAmount}>$400 this month</span>
            </div>
            <div style={styles.trendItem}>
              <div style={styles.trendInfo}>
                <span style={styles.trendCategory}>Bills & Utilities</span>
                <span style={styles.trendChange('neutral')}>
                  0%
                </span>
              </div>
              <div style={styles.trendBar}>
                <div style={styles.trendProgress('neutral', '60%')}></div>
              </div>
              <span style={styles.trendAmount}>$350 this month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}