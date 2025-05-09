import { useState ,useEffect} from 'react';
import { ChevronLeft, ChevronRight, PlusCircle, X, DollarSign } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
// Function to get month name
const getNextMonth = (currentMonth) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentIndex = months.indexOf(currentMonth);
  return months[(currentIndex + 1) % 12];
};

// Function to predict next month's budget based on previous months' averages
const predictNextBudget = async (dbUser,previousBudgets) => {
  console.log(previousBudgets)
  try {
    function getMonthlyTotals(previousBudgets) {
      return previousBudgets.map(b => (
        b.foodAndDining + b.shopping + b.entertainment + b.travel +
        b.health + b.education + b.rechargeAndSubscriptions + b.others +
        b.transportation + b.billsAndUtilities
      ));
    }
    
    function getCategoryWiseAverages(budgets) {
      const categories = [
        "foodAndDining", "shopping", "entertainment", "travel",
        "health", "education", "rechargeAndSubscriptions", "others",
        "transportation", "billsAndUtilities"
      ];
      const totals = {};
      categories.forEach(cat => totals[cat] = 0);
    
      budgets.forEach(b => {
        categories.forEach(cat => {
          totals[cat] += b[cat] || 0;
        });
      });
    
      const count = budgets.length;
      const averages = {};
      categories.forEach(cat => {
        averages[cat] = parseFloat((totals[cat] / count).toFixed(2));
      });
    
      return averages;
    }
    
    function getStdDev(values) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length;
      return Math.sqrt(variance);
    }
    
    // Suppose you have: dbUser.income, dbUser.tag, and previousBudgets[] from MongoDB
    function preparePayload(dbUser, previousBudgets) {
      console.log(previousBudgets)
      const monthlyTotals = getMonthlyTotals(previousBudgets);
      const averages = getCategoryWiseAverages(previousBudgets);
    
      const totalAvg = monthlyTotals.reduce((a, b) => a + b, 0) / monthlyTotals.length;
      const stdMonthlyExpense = getStdDev(monthlyTotals);
      const expenseToIncomeRatio = parseFloat((totalAvg / dbUser.income).toFixed(2));
    
      return {
        "income": dbUser.income,
        "expense_to_income_ratio": expenseToIncomeRatio,
        "std_monthly_expense": parseFloat(stdMonthlyExpense.toFixed(2)),
        "cluster_name": dbUser.tag,
        "Food and Dining": averages.foodAndDining,
        "Transportation": averages.transportation,
        "Shopping": averages.shopping,
        "Bills and Utilities": averages.billsAndUtilities,
        "Entertainment": averages.entertainment,
        "Travel": averages.travel,
        "Health": averages.health,
        "Education": averages.education,
        "Recharge and Subscriptions": averages.rechargeAndSubscriptions,
        "Others": averages.others
      };
    }
    
    // Then send payload via fetch to Flask
    const payload = preparePayload(dbUser, previousBudgets);
    console.log('Payload:', payload); // Log the payload for debugging
    const response = await axios.post('https://budgetpro-budgetpredictor.onrender.com/predict-budget',payload);
    console.log(response.data); // Log the response for debugging
    return response.data; // Assuming the API returns the predicted budget
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
};

// Function to generate budget based on target saving
const generateBudgetWithTargetSaving = (previousBudgets, targetSaving) => {
  if (!previousBudgets || previousBudgets.length === 0) {
    return {};
  }

  const lastBudget = previousBudgets[previousBudgets.length - 1];
  const nextMonth = getNextMonth(lastBudget.month);
  const nextYear = nextMonth === 'January' ? lastBudget.year + 1 : lastBudget.year;

  // Get the predicted budget as a starting point
  const predictedBudget = predictNextBudget(previousBudgets);
  
  // Calculate current total expenses
  const fields = [
    'foodAndDining', 'shopping', 'entertainment', 'travel', 'health', 
    'education', 'rechargeAndSubscriptions', 'others', 'transportation', 
    'billsAndUtilities'
  ];
  
  const totalExpenses = fields.reduce((acc, field) => acc + predictedBudget[field], 0);
  
  // Calculate what the total expenses should be to achieve target saving
  const targetExpenses = lastBudget.limitAmount - targetSaving;
  
  // If target expenses are higher than predicted, just return the predicted budget
  if (targetExpenses >= totalExpenses) {
    predictedBudget.saving = targetSaving;
    return predictedBudget;
  }
  
  // Otherwise, we need to reduce expenses proportionally
  const reductionFactor = targetExpenses / totalExpenses;
  
  // Apply reduction to each field
  fields.forEach(field => {
    predictedBudget[field] = Math.round(predictedBudget[field] * reductionFactor);
  });
  
  predictedBudget.saving = targetSaving;
  
  return predictedBudget;
};

export default function BudgetPlanner() {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const {dbUser} = useAuth();
    const [budgets, setBudgets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [showTargetSavingModal, setShowTargetSavingModal] = useState(false);
  const [predictedBudget, setPredictedBudget] = useState(null);
  const [targetSaving, setTargetSaving] = useState('');
  const [generatedBudget, setGeneratedBudget] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`https://budgetpro-backend.onrender.com/budget/userid/${dbUser._id}`); // Replace with your API endpoint
        setBudgets(response.data); // Update state with fetched budgets
      } catch (err) {
        console.error('Error fetching budgets:', err);
        setError('Failed to fetch budgets. Please try again later.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBudgets();
  }, []);
  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < budgets.length - 1 ? prev + 1 : prev));
  };

  const handlePredictBudget = async () => {
    try {
      console.log(budgets);
      const predicted = await predictNextBudget(dbUser, budgets); // ✅ Await the promise
      console.log("predicted", predicted);
      setPredictedBudget(predicted); // ✅ Set once resolved
      setShowPredictionModal(true);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };
  

 

const handleSavePrediction = async () => {
  if (!predictedBudget || !dbUser?._id) return;

  // Compute next month and year
  const currentDate = new Date();
  const nextMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
  const month = nextMonthDate.getMonth() + 1; // JS months are 0-based
  const year = nextMonthDate.getFullYear();

  // Build budget data from predictedBudget
  const newBudget = {
    userId: dbUser._id,
    foodAndDining: predictedBudget.foodAndDining || 0,
    shopping: predictedBudget.shopping || 0,
    entertainment: predictedBudget.entertainment || 0,
    travel: predictedBudget.travel || 0,
    health: predictedBudget.health || 0,
    education: predictedBudget.education || 0,
    rechargeAndSubscriptions: predictedBudget.rechargeAndSubscriptions || 0,
    others: predictedBudget.others || 0,
    transportation: predictedBudget.transportation || 0,
    billsAndUtilities: predictedBudget.billsAndUtilities || 0,
    limitAmount: predictedBudget.limitAmount || 71400, // Optional
    saving: predictedBudget.savings || 0, // Rename 'savings' to 'saving'
    month,
    year,
  };

  try {
    const response = await axios.post('https://budgetpro-backend.onrender.com/budget', newBudget);
    console.log('Saved to DB:', response.data);

    // Update frontend state
    setBudgets(prev => [...prev, { ...response.data }]);
    setCurrentIndex(budgets.length);
    setShowPredictionModal(false);
  } catch (error) {
    console.error('Error saving predicted budget:', error);
  }
};

  
  const handleGenerateBudget = () => {
    if (!targetSaving || isNaN(parseFloat(targetSaving))) {
      alert('Please enter a valid target saving amount');
      return;
    }
    
    const generated = generateBudgetWithTargetSaving(budgets, parseFloat(targetSaving));
    setGeneratedBudget(generated);
    setShowTargetSavingModal(true);
  };

  const handleSaveGenerated = () => {
    if (generatedBudget) {
      setBudgets(prev => [...prev, { ...generatedBudget, _id: `${prev.length + 1}` }]);
      setShowTargetSavingModal(false);
      // Move to the newly added budget
      setCurrentIndex(budgets.length);
      setTargetSaving('');
    }
  };

  // Helper function to render budget in table format
  const renderBudgetTable = (budget) => {
    if (!budget) return null;
    
    const tableStyles = {
      budgetMonth: {
        fontSize: '1.125rem',
        fontWeight: 600,
        marginBottom: '0.5rem'
      },
      budgetTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '1rem'
      },
      tableHeader: {
        backgroundColor: 'rgba(243, 244, 246, 1)'
      },
      tableHeaderCell: {
        border: '1px solid rgba(209, 213, 219, 1)',
        padding: '0.5rem',
        textAlign: 'left'
      },
      tableAmountCell: {
        border: '1px solid rgba(209, 213, 219, 1)',
        padding: '0.5rem',
        textAlign: 'right'
      },
      tableCell: {
        border: '1px solid rgba(209, 213, 219, 1)',
        padding: '0.5rem'
      },
      totalRow: {
        fontWeight: 600
      },
      savingRow: {
        fontWeight: 600,
        color: 'rgba(16, 185, 129, 1)'
      }
    };
    
    const categories = [
      { key: 'foodAndDining', label: 'Food & Dining' },
      { key: 'shopping', label: 'Shopping' },
      { key: 'entertainment', label: 'Entertainment' },
      { key: 'travel', label: 'Travel' },
      { key: 'health', label: 'Health' },
      { key: 'education', label: 'Education' },
      { key: 'rechargeAndSubscriptions', label: 'Recharges & Subscriptions' },
      { key: 'transportation', label: 'Transportation' },
      { key: 'billsAndUtilities', label: 'Bills & Utilities' },
      { key: 'others', label: 'Others' }
    ];
    
    // Calculate total expenses
    const totalExpenses = categories.reduce((sum, cat) => sum + budget[cat.key], 0);
    
    return (
      <div style={{ width: '100%' }}>
        <div style={tableStyles.budgetMonth}>
          {monthNames[budget.month - 1]} {budget.year}
        </div>
        <table style={tableStyles.budgetTable}>
          <thead>
            <tr style={tableStyles.tableHeader}>
              <th style={tableStyles.tableHeaderCell}>Category</th>
              <th style={{...tableStyles.tableHeaderCell, textAlign: 'right'}}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.key}>
                <td style={tableStyles.tableCell}>{cat.label}</td>
                <td style={tableStyles.tableAmountCell}>₹{budget[cat.key]}</td>
              </tr>
            ))}
            <tr style={tableStyles.totalRow}>
              <td style={tableStyles.tableCell}>Total Expenses</td>
              <td style={tableStyles.tableAmountCell}>₹{totalExpenses}</td>
            </tr>
            <tr style={tableStyles.totalRow}>
              <td style={tableStyles.tableCell}>Budget Limit</td>
              <td style={tableStyles.tableAmountCell}>₹{budget.limitAmount}</td>
            </tr>
            <tr style={tableStyles.savingRow}>
              <td style={tableStyles.tableCell}>Saving</td>
              <td style={tableStyles.tableAmountCell}>₹{budget.saving}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // Define styles
  const styles = {
    container: {
      maxWidth: '64rem',
      margin: '0 auto',
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    header: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#4a3aff'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      marginBottom: '1rem'
    },
    carouselContainer: {
      marginBottom: '2rem'
    },
    carouselHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem'
    },
    navigationButton: {
      padding: '0.5rem',
      borderRadius: '9999px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer'
    },
    navigationButtonDisabled: {
      color: 'rgba(156, 163, 175, 1)',
      cursor: 'not-allowed'
    },
    navigationButtonEnabled: {
      color: 'rgba(55, 65, 81, 1)'
    },
    budgetCard: {
      border: '1px solid rgba(229, 231, 235, 1)',
      borderRadius: '0.5rem',
      padding: '1rem',
      minHeight: '16rem'
    },
    emptyState: {
      textAlign: 'center',
      color: 'rgba(107, 114, 128, 1)',
      padding: '2rem 0'
    },
    primaryButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      fontWeight: 500,
      color: 'white',
      backgroundColor: '#4a3aff',
      border: 'none',
      cursor: 'pointer'
    },
    buttonIcon: {
      marginRight: '0.5rem'
    },
    targetSavingContainer: {
      marginBottom: '2rem'
    },
    inputContainer: {
      display: 'flex',
      gap: '0.5rem'
    },
    inputWrapper: {
      position: 'relative',
      flex: 1
    },
    inputIcon: {
      position: 'absolute',
      left: '0.75rem',
      top: '0.75rem',
      color: 'rgba(107, 114, 128, 1)'
    },
    savingInput: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      border: '1px solid #4a3aff',
      borderRadius: '0.375rem'
    },
    generateButton: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.375rem',
      fontWeight: 500,
      color: 'white',
      backgroundColor: '#4a3aff',
      border: 'none',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <h1 style={styles.header}>
        Budget Planner
      </h1>
      
      {/* Budget Carousel */}
      <div style={styles.carouselContainer}>
        <div style={styles.carouselHeader}>
          <h2 style={styles.sectionTitle}>Your Budgets</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handlePrevious} 
              disabled={currentIndex === 0}
              style={{
                ...styles.navigationButton,
                ...(currentIndex === 0 ? styles.navigationButtonDisabled : styles.navigationButtonEnabled)
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext} 
              disabled={currentIndex === budgets.length - 1}
              style={{
                ...styles.navigationButton,
                ...(currentIndex === budgets.length - 1 ? styles.navigationButtonDisabled : styles.navigationButtonEnabled)
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        
        <div style={styles.budgetCard}>
          {budgets.length > 0 ? (
            renderBudgetTable(budgets[currentIndex])
          ) : (
            <div style={styles.emptyState}>No budgets found</div>
          )}
        </div>
      </div>
      
      {/* Predict Button */}
      <div style={styles.carouselContainer}>
        <button 
          onClick={handlePredictBudget}
          style={styles.primaryButton}
        >
          <PlusCircle size={20} style={styles.buttonIcon} />
          Predict Next Month Budget
        </button>
      </div>
      
    
      {/* Prediction Modal */}
      {showPredictionModal && predictedBudget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              width: '100%',
              maxWidth: '42rem',
              padding: '1.5rem',
              maxHeight: '100vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#4a3aff',
                }}
              >
                Predicted Budget
              </h2>
              <button
                onClick={() => setShowPredictionModal(false)}
                style={{
                  padding: '0.25rem',
                  borderRadius: '9999px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Render Predicted Budget Table */}
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '1rem',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}>
                  <th style={{ border: '1px solid rgba(209, 213, 219, 1)', padding: '0.5rem', textAlign: 'left' }}>
                    Category
                  </th>
                  <th style={{ border: '1px solid rgba(209, 213, 219, 1)', padding: '0.5rem', textAlign: 'right' }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(predictedBudget).map(([key, value]) => (
                  <tr key={key}>
                    <td style={{ border: '1px solid rgba(209, 213, 219, 1)', padding: '0.5rem' }}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </td>
                    <td style={{ border: '1px solid rgba(209, 213, 219, 1)', padding: '0.5rem', textAlign: 'right' }}>
                      ₹{value.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                marginTop: '1.5rem',
              }}
            >
              <button
                onClick={() => setShowPredictionModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(209, 213, 219, 1)',
                  borderRadius: '0.375rem',
                  fontWeight: 500,
                  color: 'rgba(55, 65, 81, 1)',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                onClick={handleSavePrediction}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontWeight: 500,
                  color: 'white',
                  backgroundColor: '#4a3aff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Target Saving Modal */}
      {showTargetSavingModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            width: '100%',
            maxWidth: '42rem',
            padding: '1.5rem',
            maxHeight: '100vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              
              <button 
                onClick={() => setShowTargetSavingModal(false)}
                style={{
                  padding: '0.25rem',
                  borderRadius: '9999px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            {renderBudgetTable(generatedBudget)}
            
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '1.5rem'
            }}>
              <button 
                onClick={handleSaveGenerated}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontWeight: 500,
                  color: 'white',
                  backgroundColor: '#4a3aff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}