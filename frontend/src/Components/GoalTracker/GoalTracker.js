import React, { useState, useEffect } from 'react';
import styles from './GoalTracker.module.css';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const GoalTracker = () => {
  const { dbUser } = useAuth();
  const [goalName, setGoalName] = useState('');
  const [category, setCategory] = useState('car');
  const [totalAmount, setTotalAmount] = useState('');
  const [upfront, setUpfront] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [msg1, setMsg1] = useState('');
  const [msg2, setMsg2] = useState('');
  const [msg3, setMsg3] = useState('');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [allGoals, setAllGoals] = useState([]);
  const [budgetData, setBudgetData] = useState({
    foodAndDining: 0,
    shopping: 0,
    entertainment: 0,
    travel: 0,
    health: 0,
    education: 0,
    rechargeAndSubscriptions: 0,
    others: 0,
    transportation: 0,
    billsAndUtilities: 0,
    limitAmount: 0,
    saving: 0,
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
  });

  const handleGoalInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'goalName':
        setGoalName(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'totalAmount':
        setTotalAmount(value);
        break;
      case 'upfront':
        setUpfront(value);
        break;
      default:
        break;
    }
  };
  
  // Fetch all goals for the current user
  const fetchGoals = async () => {
    if (!dbUser || !dbUser._id) {
      console.error("User not available");
      return;
    }
    
    try {
      const response = await axios.get(`https://budgetpro-backend.onrender.com/goal/user/${dbUser._id}`);
      if (response.data) {
        setAllGoals(response.data);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };
  
  // Load goals when modal opens
  useEffect(() => {
    if (showGoalsModal) {
      fetchGoals();
    }
  }, [showGoalsModal]);

  const handleBudgetInputChange = (e) => {
    const { name, value } = e.target;
    setBudgetData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const analyzeGoal = async () => {
    if (!goalName || !totalAmount) {
      alert('Please fill in all required fields');
      return;
    }

    const totalAmountNum = parseFloat(totalAmount);
    const upfrontNum = parseFloat(upfront) || 20;
    const remainingAmount = totalAmountNum - upfrontNum;
    console.log(totalAmountNum, upfrontNum, remainingAmount);
    const income = dbUser?.income;
    const save_per = dbUser?.save_per;
     
    if (!income || !save_per) {
      alert("User income or saving percentage not available.");
      return;
    }

    let savings = 0;
    try {
      console.log("Fetching accounts for user:", dbUser._id);
      const res = await axios.get(`https://budgetpro-backend.onrender.com/account/getbyuserid/${dbUser._id}`);
      const accounts = res.data;
      const savingAccount = accounts.find(acc => acc.accountType === 'savings');
      const accountId = savingAccount ? savingAccount._id : null;
      savings = savingAccount ? savingAccount.balance : 0;
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      alert("Unable to analyze goal due to account fetch failure.");
      return;
    }
    console.log("Savings fetched:", savings);
    const monthlySaving = save_per * income;
    const emi = (0.8 * totalAmountNum) / 18;

    setMsg1('');
    setMsg2('');
    setMsg3('');
    // Rule-based analysis
    // Set goal info
    setMsg1(`You want to save ${totalAmountNum.toLocaleString('en-US', {
      style: 'currency',
      currency: 'INR'
    })} for a new ${category}.`);
    console.log(income);
    // Rule-based analysis
    if (totalAmountNum > (0.15 * 12*income)) {
      // 🚨 Product is costly
      console.log("Product is costly.");
      setMsg2("Warning: This product exceeds 15% of your income. Ideally, it's best to delay this purchase. But still if you want to proceed, we can help you with that.");
    }
    if (savings < (0.2 * totalAmountNum)) {
      // 🕒 Not enough saved — calculate time
      console.log("Savings are less than 20% of total amount.");
      const months = Math.ceil(remainingAmount / monthlySaving);
      setMsg3('');
      setMsg3(`Your savings are below 20% of the product's cost. You'll need approximately ${months} months to save enough.`);
    } 
    else {
      // ✅ Enough saved, check EMI against monthly saving
      setMsg3('');
      if (monthlySaving < emi) {
        setMsg3(`You've saved enough upfront, but your current monthly savings may not cover the EMI of ${emi.toFixed(2)}. Try saving a bit more.`);
      } else {
        setMsg3(`You're doing well! Your monthly savings can comfortably handle the EMI of ${emi.toFixed(2)}. You're good to go. 🎉`);
      }
    }
    setShowAnalysis(true);
  };

  const saveGoal = async () => {
    if (!goalName || !category || !totalAmount) {
      alert("Please fill in all required fields");
      return;
    }
    const res = await axios.get(`https://budgetpro-backend.onrender.com/account/getbyuserid/${dbUser._id}`);
      const accounts = res.data;
      const savingAccount = accounts.find(acc => acc.accountType === 'savings');
      const accountId = savingAccount ? savingAccount._id : null;
  
    const goalData = {
      userId: dbUser._id,
      accountId: accountId,
      goalName,
      type: category,
      totalAmount: parseFloat(totalAmount),
      upfront: (totalAmount*0.2),
      remainingAmount: (totalAmount*0.8),
     duration: 18
      // Fallback to user ID if accountId is not available
    };
  
    try {
      const response = await axios.post("https://budgetpro-backend.onrender.com/goal", goalData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Goal saved successfully:", response.data);
      alert("Goal saved successfully!");
      resetForm();
  
      // Refresh the list of goals if the modal is open
      if (showGoalsModal) {
        fetchGoals();
      }
    } catch (error) {
      console.error("Error saving goal:", error);
      alert("Error saving goal");
    }
  };

  const saveBudget = async () => {
    try {
      // This is a placeholder for your API call
      console.log('Saving budget:', budgetData);
      alert('Budget saved successfully!');
      setShowBudgetModal(false);
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget. Please try again.');
    }
  };

  const resetForm = () => {
    setGoalName('');
    setCategory('car');
    setTotalAmount('');
    setUpfront('');
    setShowAnalysis(false);
    setMsg1('');
    setMsg2('');
    setMsg3('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Goal Tracker</h1>
      
      <div className={styles.formContainer}>
        <div className={styles.inputGroup}>
          <label htmlFor="goalName">Goal Name</label>
          <input
            type="text"
            id="goalName"
            name="goalName"
            value={goalName}
            onChange={handleGoalInputChange}
            placeholder="Enter goal name"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={handleGoalInputChange}
            className={styles.select}
            required
          >
            
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            
            <option value="others">Others</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="totalAmount">Total Amount</label>
          <input
            type="number"
            id="totalAmount"
            name="totalAmount"
            value={totalAmount}
            onChange={handleGoalInputChange}
            placeholder="Enter total amount"
            className={styles.input}
            required
          />
        </div>


        <div className={styles.inputGroup}>
          <label htmlFor="upfront">Upfront Payment (optional)</label>
          <input
            type="number"
            id="upfront"
            name="upfront"
            value={upfront}
            onChange={handleGoalInputChange}
            placeholder="Enter upfront payment"
            className={styles.input}
          />
        </div>

        <button 
          className={styles.analyzeButton} 
          onClick={analyzeGoal}
        >
          Analyze My Goal
        </button>
      </div>

      {showAnalysis && (
        <div className={styles.analysisContainer}>
          <div className={styles.message}>{msg1}</div>
          <div className={styles.message}>{msg2}</div>
          <div className={styles.message}>{msg3}</div>
          
        </div>
      )}

      <div className={styles.buttonContainer}>
        <button 
          className={styles.saveButton} 
          onClick={saveGoal}
        >
          Save Goal
        </button>
        
        <button 
          className={styles.viewGoalsButton} 
          onClick={() => setShowGoalsModal(true)}
        >
          View All Goals
        </button>
      </div>

      {showGoalsModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>All Goals</h2>
            
            {allGoals.length > 0 ? (
              <div className={styles.goalsContainer}>
                <table className={styles.goalsTable}>
                  <thead>
                    <tr>
                      <th>Goal Name</th>
                      <th>Category</th>
                      <th>Total Amount</th>
                      <th>Upfront</th>
                      <th>Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allGoals.map((goal) => (
                      <tr key={goal._id}>
                        <td>{goal.goalName}</td>
                        <td>{goal.type}</td>
                        <td>{goal.totalAmount.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'INR'
                        })}</td>
                        <td>{goal.upfront.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'INR'
                        })}</td>
                        <td>{goal.remainingAmount.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'INR'
                        })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.noGoals}>No goals found. Create a new goal to get started!</p>
            )}
            
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton} 
                onClick={() => setShowGoalsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showBudgetModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Budget Planner</h2>
            
            <div className={styles.budgetForm}>
              <div className={styles.budgetInputGroup}>
                <label htmlFor="foodAndDining">Food & Dining</label>
                <input
                  type="number"
                  id="foodAndDining"
                  name="foodAndDining"
                  value={budgetData.foodAndDining}
                  onChange={handleBudgetInputChange}
                  className={styles.budgetInput}
                />
              </div>

              <div className={styles.budgetInputGroup}>
                <label htmlFor="shopping">Shopping</label>
                <input
                  type="number"
                  id="shopping"
                  name="shopping"
                  value={budgetData.shopping}
                  onChange={handleBudgetInputChange}
                  className={styles.budgetInput}
                />
              </div>

              <div className={styles.budgetInputGroup}>
                <label htmlFor="entertainment">Entertainment</label>
                <input
                  type="number"
                  id="entertainment"
                  name="entertainment"
                  value={budgetData.entertainment}
                  onChange={handleBudgetInputChange}
                  className={styles.budgetInput}
                />
              </div>

              <div className={styles.budgetInputGroup}>
                <label htmlFor="travel">Travel</label>
                <input
                  type="number"
                  id="travel"
                  name="travel"
                  value={budgetData.travel}
                  onChange={handleBudgetInputChange}
                  className={styles.budgetInput}
                />
              </div>

              <div className={styles.budgetInputGroup}>
                <label htmlFor="health">Health</label>
                <input
                  type="number"
                  id="health"
                  name="health"
                  value={budgetData.health}
                  onChange={handleBudgetInputChange}
                  className={styles.budgetInput}
                />
              </div>

              <div className={styles.budgetInputGroup}>
                <label htmlFor="education">Education</label>
                <input
                  type="number"
                  id="education"
                  name="education"
                  value={budgetData.education}
                  onChange={handleBudgetInputChange}
                  className={styles.budgetInput}
                />
              </div>

              <div className={styles.budgetInputGroup}>
                <label htmlFor="rechargeAndSubscriptions">Recharge & Subscriptions</label>
                <input
                  type="number"
                  id="rechargeAndSubscriptions"
                  name="rechargeAndSubscriptions"
                  value={budgetData.rechargeAndSubscriptions}
                  onChange={handleBudgetInputChange}
                  className={styles.budgetInput}
                />
              </div>

              <div className={styles.budgetInputGroup}>
                <label htmlFor="transportation">Transportation</label>
                <input
                  type="number"
                  id="transportation"
                  name="transportation"
                  value={budgetData.transportation}
                  onChange={handleBudgetInputChange}
                  className={styles.budgetInput}
                />
              </div>

              <div className={styles.budgetInputGroup}>
                <label htmlFor="billsAndUtilities">Bills & Utilities</label>
                <input
                  type="number"
                  id="billsAndUtilities"
                  name="billsAndUtilities"
                  value={budgetData.billsAndUtilities}
                  onChange={handleBudgetInputChange}
                  className={styles.budgetInput}
                />
              </div>

              <div className={styles.budgetInputGroup}>
                <label htmlFor="others">Others</label>
                <input
                  type="number"
                  id="others"
                  name="others"
                  value={budgetData.others}
                  onChange={handleBudgetInputChange}
                  className={styles.budgetInput}
                />
              </div>

              <div className={styles.budgetInputGroup}>
                <label htmlFor="limitAmount">Monthly Limit</label>
                <input
                  type="number"
                  id="limitAmount"
                  name="limitAmount"
                  value={budgetData.limitAmount}
                  onChange={handleBudgetInputChange}
                  className={styles.budgetInput}
                />
              </div>

              <div className={styles.budgetInputGroup}>
                <label htmlFor="saving">Monthly Saving</label>
                <input
                  type="number"
                  id="saving"
                  name="saving"
                  value={budgetData.saving}
                  onChange={handleBudgetInputChange}
                  className={styles.budgetInput}
                />
              </div>

              <div className={styles.budgetActions}>
                <button 
                  className={styles.saveBudgetButton} 
                  onClick={saveBudget}
                >
                  Save Budget
                </button>
                <button 
                  className={styles.cancelButton} 
                  onClick={() => setShowBudgetModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;