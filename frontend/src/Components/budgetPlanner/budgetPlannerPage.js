import React from 'react';
import { useState, useEffect } from 'react';
import styles from './BudgetPlannerPage.module.css';

export default function BudgetPlanner() {
  // State for form inputs
  const [income, setIncome] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [upfrontAmount, setUpfrontAmount] = useState('');
  const [emiMonths, setEmiMonths] = useState(6);
  const [goalName, setGoalName] = useState('');
  
  // State for calculated budget
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  
  // State for saved goals
  const [savedGoals, setSavedGoals] = useState([]);
  
  // Convert string values to numbers and handle empty inputs
  const parseInputValue = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  // Calculate budget based on the 10-6-20 rule
  const calculateBudget = () => {
    const incomeValue = parseInputValue(income);
    const targetValue = parseInputValue(targetAmount);
    const upfrontValue = parseInputValue(upfrontAmount);
    const emiPeriod = parseInt(emiMonths) || 6;
    
    if (!incomeValue || !targetValue) {
      alert('Please enter your income and target amount.');
      return;
    }
    
    // Calculate budget components
    const remainingAmount = targetValue - upfrontValue;
    const requiredEMI = remainingAmount / emiPeriod;
    const totalSavings = incomeValue * 0.2; // 20% of income for savings
    const requiredMonthlySavings = requiredEMI * 0.1; // 10% rule - upfront payment
    const budgetLimit = incomeValue * 0.6; // 60% of income for expenses
    
    const summary = {
      monthlyIncome: incomeValue,
      totalSavings: totalSavings,
      savingsPerMonth: totalSavings - requiredMonthlySavings,
      requiredEMI: requiredEMI,
      requiredMonthlySavings: requiredMonthlySavings,
      budgetLimit: budgetLimit
    };
    
    setBudgetSummary(summary);
    
    // Check eligibility
    if (totalSavings >= requiredMonthlySavings + requiredEMI) {
      setEligibility({
        status: 'success',
        message: 'You can proceed with your purchase plan!'
      });
    } else if (totalSavings >= requiredMonthlySavings) {
      const shortfall = requiredEMI - (totalSavings - requiredMonthlySavings);
      setEligibility({
        status: 'warning',
        message: `You're short of ₹${shortfall.toFixed(2)} for your EMI.`,
        shortfall: shortfall
      });
    } else {
      const additionalSavingsNeeded = requiredMonthlySavings - totalSavings;
      setEligibility({
        status: 'danger',
        message: `You need to save ₹${additionalSavingsNeeded.toFixed(2)} more per month.`,
        additionalSavingsNeeded: additionalSavingsNeeded
      });
    }
  };
  
  // Save goal to the table
  const saveGoal = () => {
    if (!budgetSummary || !goalName) {
      alert('Please enter a goal name and calculate a budget first.');
      return;
    }
    
    const newGoal = {
      id: Date.now(),
      name: goalName,
      targetAmount: parseInputValue(targetAmount),
      upfrontAmount: parseInputValue(upfrontAmount),
      emiMonths: emiMonths,
      requiredSavings: budgetSummary.requiredMonthlySavings,
      requiredEMI: budgetSummary.requiredEMI,
      eligibility: eligibility.status,
      createdAt: new Date().toLocaleDateString()
    };
    
    setSavedGoals([...savedGoals, newGoal]);
    
    // Reset form
    setGoalName('');
    setTargetAmount('');
    setUpfrontAmount('');
    setEmiMonths(6);
    setBudgetSummary(null);
    setEligibility(null);
  };
  
  // Handle modified budget plan
  const planModifiedBudget = (additionalSavings) => {
    if (!budgetSummary) return;
    
    const incomeValue = parseInputValue(income);
    
    // Calculate new budget with reduced expenses
    const newBudgetLimit = budgetSummary.budgetLimit - additionalSavings;
    const newSavings = budgetSummary.totalSavings + additionalSavings;
    
    const summary = {
      ...budgetSummary,
      totalSavings: newSavings,
      savingsPerMonth: newSavings - budgetSummary.requiredMonthlySavings,
      budgetLimit: newBudgetLimit
    };
    
    setBudgetSummary(summary);
    
    // Update eligibility
    if (newSavings >= summary.requiredMonthlySavings + summary.requiredEMI) {
      setEligibility({
        status: 'success',
        message: 'With the modified budget, you can proceed with your purchase plan!'
      });
    } else {
      const remainingShortfall = summary.requiredMonthlySavings + summary.requiredEMI - newSavings;
      setEligibility({
        status: 'warning',
        message: `You're still short of ₹${remainingShortfall.toFixed(2)} even with the modified budget.`,
        shortfall: remainingShortfall
      });
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Budget Planner with Goal Tracker</h1>
      </div>
      
      {/* Main content container */}
      <div className={styles.grid}>
        {/* Budget Planner Form */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <span>🧾</span> Budget Planner Form
          </h2>
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Monthly Income</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className={styles.input}
                placeholder="Enter your monthly income"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Target Amount</label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className={styles.input}
                placeholder="Enter target purchase amount"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Upfront Amount</label>
              <input
                type="number"
                value={upfrontAmount}
                onChange={(e) => setUpfrontAmount(e.target.value)}
                className={styles.input}
                placeholder="Enter upfront payment amount"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>EMI Months</label>
              <input
                type="number"
                value={emiMonths}
                onChange={(e) => setEmiMonths(e.target.value)}
                className={styles.input}
                placeholder="Enter EMI period in months"
                min="1"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Goal Name</label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className={styles.input}
                placeholder="Give your goal a name"
              />
            </div>
            
            <button
              onClick={calculateBudget}
              className={styles.button}
            >
              Calculate Budget
            </button>
          </div>
        </div>
        
        {/* Budget Summary and Eligibility Result */}
        <div className={styles.grid}>
          {budgetSummary && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span>📊</span> Budget Summary
              </h2>
              <div className={styles.summary}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Monthly Income</span>
                  <span className={styles.summaryValue}>{formatCurrency(budgetSummary.monthlyIncome)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Total Savings (20%)</span>
                  <span className={styles.summaryValue}>{formatCurrency(budgetSummary.totalSavings)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Remaining Savings</span>
                  <span className={styles.summaryValue}>{formatCurrency(budgetSummary.savingsPerMonth)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Required EMI</span>
                  <span className={styles.summaryValue}>{formatCurrency(budgetSummary.requiredEMI)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Required Monthly Savings</span>
                  <span className={styles.summaryValue}>{formatCurrency(budgetSummary.requiredMonthlySavings)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Budget Limit (60%)</span>
                  <span className={styles.summaryValue}>{formatCurrency(budgetSummary.budgetLimit)}</span>
                </div>
              </div>
            </div>
          )}
          
          {eligibility && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span>✅</span> Eligibility Result
              </h2>
              <div className={`${styles.summary} ${
                eligibility.status === 'success' ? styles.success : 
                eligibility.status === 'warning' ? styles.warning : 
                styles.error
              }`}>
                <p>{eligibility.message}</p>
              </div>
              
              {eligibility.status !== 'success' && (
                <div className={styles.form}>
                  {eligibility.additionalSavingsNeeded && (
                    <button
                      onClick={() => planModifiedBudget(eligibility.additionalSavingsNeeded)}
                      className={styles.button}
                    >
                      Plan Budget for Saving {formatCurrency(eligibility.additionalSavingsNeeded)}/month
                    </button>
                  )}
                  {eligibility.shortfall && (
                    <button
                      onClick={() => planModifiedBudget(eligibility.shortfall)}
                      className={styles.button}
                    >
                      Plan Budget for Saving {formatCurrency(eligibility.shortfall)}/month
                    </button>
                  )}
                </div>
              )}
              
              <button
                onClick={saveGoal}
                className={styles.button}
              >
                Save as Goal
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Saved Goals Table */}
      {savedGoals.length > 0 && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <span>🎯</span> Your Saved Goals
          </h2>
          <div className={styles.summary}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Goal Name</th>
                  <th>Target Amount</th>
                  <th>Upfront Amount</th>
                  <th>EMI Months</th>
                  <th>Monthly Savings</th>
                  <th>Monthly EMI</th>
                  <th>Status</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {savedGoals.map((goal) => (
                  <tr key={goal.id}>
                    <td>{goal.name}</td>
                    <td>{formatCurrency(goal.targetAmount)}</td>
                    <td>{formatCurrency(goal.upfrontAmount)}</td>
                    <td>{goal.emiMonths}</td>
                    <td>{formatCurrency(goal.requiredSavings)}</td>
                    <td>{formatCurrency(goal.requiredEMI)}</td>
                    <td>
                      <span className={`${styles.status} ${
                        goal.eligibility === 'success' ? styles.success : 
                        goal.eligibility === 'warning' ? styles.warning : 
                        styles.error
                      }`}>
                        {goal.eligibility === 'success' ? 'Eligible' : 
                         goal.eligibility === 'warning' ? 'Partially Eligible' : 
                         'Not Eligible'}
                      </span>
                    </td>
                    <td>{goal.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* About the 10-6-20 Rule Section */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>About the 10-6-20 Rule</h2>
        <div className={styles.summary}>
          <p>
            The 10-6-20 rule is a financial guideline for budgeting that helps ensure you can afford your purchases:
          </p>
          <ul>
            <li><strong>10%:</strong> Your upfront payment should be at least 10% of the purchase price</li>
            <li><strong>60%:</strong> Limit your spending to 60% of your income for expenses</li>
            <li><strong>20%:</strong> Save at least 20% of your income monthly</li>
          </ul>
          <p>
            This budgeting tool checks if your savings and income align with these guidelines for your planned purchase.
          </p>
        </div>
      </div>
    </div>
  );
}