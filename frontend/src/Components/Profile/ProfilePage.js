// ProfilePage.jsx
import { useState, useEffect } from 'react';
import styles from './ProfilePage.module.css';
import { FiEdit2, FiX, FiSave, FiCalendar, FiCreditCard, FiEye } from 'react-icons/fi';

const ProfilePage = () => {
  // User state
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  
  // Date filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  
  // Add account modal states
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    accountType: 'savings',
    balance: 0,
    currency: 'INR'
  });
  
  // Transaction modal states
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Fetch user data
  useEffect(() => {
    // This would be an API call in a real application
    const fetchUserData = async () => {
      try {
        // Mock data - would be replaced with actual API call
        const userData = {
          userId: 12345,
          name: "Jane Doe",
          email: "jane.doe@example.com",
          Savings: 25000,
          income: 60000,
          save_per: 15,
          tag: "Premium",
          createdAt: new Date('2023-01-15')
        };
        
        setUser(userData);
        setEditedUser(userData);
        fetchUserAccounts(userData.userId);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, []);

  // Fetch user accounts
  const fetchUserAccounts = async (userId) => {
    try {
      // Mock data - would be replaced with actual API call
      const accountsData = [
        {
          _id: "acc1",
          accountNumber: "123456789012",
          accountType: "savings",
          balance: 15000,
          currency: "INR",
          createdAt: new Date('2023-01-20')
        },
        {
          _id: "acc2",
          accountNumber: "987654321012",
          accountType: "current",
          balance: 35000,
          currency: "INR",
          createdAt: new Date('2023-02-10')
        }
      ];
      
      setAccounts(accountsData);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  // Fetch transactions for a specific account
  const fetchAccountTransactions = async (accountId, startDate, endDate) => {
    try {
      // Mock data - would be replaced with actual API call
      const transactionsData = Array(25).fill().map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - index);
        
        const isDebit = Math.random() > 0.4;
        const amount = Math.floor(Math.random() * 10000) + 100;
        
        return {
          _id: `tx${index}`,
          date: date,
          description: isDebit ? 
            ["Food order", "Shopping", "Utility bill", "Subscription", "Fuel"][Math.floor(Math.random() * 5)] :
            ["Salary", "Refund", "Interest", "Transfer", "Gift"][Math.floor(Math.random() * 5)],
          debit: isDebit ? amount : 0,
          credit: !isDebit ? amount : 0,
          balance: 50000 - (isDebit ? amount : -amount) * index,
          type: ["debit card", "credit card", "cash", "UPI"][Math.floor(Math.random() * 4)],
          category: ["Food and Dining", "Shopping", "Bills and Utilities", "Entertainment", "Others"][Math.floor(Math.random() * 5)],
          sender_id: isDebit ? "SELF" : `SND${Math.floor(Math.random() * 1000)}`,
          receiver_id: isDebit ? `RCV${Math.floor(Math.random() * 1000)}` : "SELF"
        };
      });
      
      // Apply date filtering if provided
      let filteredTransactions = transactionsData;
      if (startDate && endDate) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1); // Include end date
        
        filteredTransactions = transactionsData.filter(tx => {
          const txDate = new Date(tx.date);
          return txDate >= startDateObj && txDate <= endDateObj;
        });
      }
      
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Handle account selection
  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    fetchAccountTransactions(account._id, startDate, endDate);
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // If currently editing, cancel and reset form
      setEditedUser(user);
    }
    setIsEditing(!isEditing);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: name === 'income' || name === 'Savings' || name === 'save_per' 
        ? parseFloat(value) || 0 
        : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // This would be an API call in a real application
      // await updateUserProfile(editedUser);
      
      // For now, just update the local state
      setUser(editedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  
  // Handle new account input changes
  const handleNewAccountChange = (e) => {
    const { name, value } = e.target;
    setNewAccount({
      ...newAccount,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value
    });
  };
  
  // Handle add account submission
  const handleAddAccount = async (e) => {
    e.preventDefault();
    
    try {
      // Generate a random account number (12 digits)
      const accountNumber = Array(12).fill().map(() => Math.floor(Math.random() * 10)).join('');
      
      // This would be an API call in a real application
      // const response = await createNewAccount({ ...newAccount, accountNumber, userId: user._id });
      
      // For now, just update the local state
      const newAccountObj = {
        _id: `acc${accounts.length + 1}`,
        accountNumber,
        accountType: newAccount.accountType,
        balance: newAccount.balance,
        currency: newAccount.currency,
        createdAt: new Date()
      };
      
      setAccounts([...accounts, newAccountObj]);
      setShowAddAccountModal(false);
      setNewAccount({
        accountType: 'savings',
        balance: 0,
        currency: 'INR'
      });
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  // Handle date filter
  const handleDateFilter = () => {
    if (selectedAccount) {
      fetchAccountTransactions(selectedAccount._id, startDate, endDate);
    }
  };

  // Handle transaction click to show details
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyDateFilter = () => {
    if (!dateFilter.startDate || !dateFilter.endDate) {
      setFilteredTransactions(transactions);
      return;
    }

    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    setFilteredTransactions(filtered);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount, currency = "INR") => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!user) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  return (
    <div className={styles.profilePageContainer}>
      <div className={styles.profileSection}>
        <div className={styles.sectionHeader}>
          <h2>Profile Details</h2>
          <button 
            className={styles.iconButton} 
            onClick={handleEditToggle}
            aria-label={isEditing ? "Cancel editing" : "Edit profile"}
          >
            {isEditing ? <FiX /> : <FiEdit2 />}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className={styles.editForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="income">Monthly Income</label>
              <input
                type="number"
                id="income"
                name="income"
                value={editedUser.income}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="Savings">Total Savings</label>
              <input
                type="number"
                id="Savings"
                name="Savings"
                value={editedUser.Savings}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="save_per">Savings Percentage</label>
              <input
                type="number"
                id="save_per"
                name="save_per"
                value={editedUser.save_per}
                onChange={handleInputChange}
                min="0"
                max="100"
              />
            </div>
            
            <button type="submit" className={styles.saveButton}>
              <FiSave /> Save Changes
            </button>
          </form>
        ) : (
          <div className={styles.profileDetails}>
            <div className={styles.profileDetail}>
              <span className={styles.detailLabel}>Name:</span>
              <span className={styles.detailValue}>{user.name}</span>
            </div>
            
            <div className={styles.profileDetail}>
              <span className={styles.detailLabel}>Email:</span>
              <span className={styles.detailValue}>{user.email}</span>
            </div>
            
            <div className={styles.profileDetail}>
              <span className={styles.detailLabel}>Monthly Income:</span>
              <span className={styles.detailValue}>{formatCurrency(user.income)}</span>
            </div>
            
            <div className={styles.profileDetail}>
              <span className={styles.detailLabel}>Savings Percentage:</span>
              <span className={styles.detailValue}>{user.save_per}%</span>
            </div>
            
            <div className={styles.profileDetail}>
              <span className={styles.detailLabel}>User Type:</span>
              <span className={styles.detailValue}>{user.tag}</span>
            </div>
            
            <div className={styles.profileDetail}>
              <span className={styles.detailLabel}>Member Since:</span>
              <span className={styles.detailValue}>{formatDate(user.createdAt)}</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.accountsSection}>
        <div className={styles.sectionHeader}>
          <h2>Your Accounts</h2>
          <div className={styles.accountActions}>
            <button 
              className={styles.viewTransactionsButton}
              onClick={() => setShowTransactionsModal(true)}
              aria-label="View transactions"
            >
              <FiEye /> View Transactions
            </button>
          </div>
        </div>
        <div className={styles.accountsList}>
          {accounts.map(account => (
            <div 
              key={account._id} 
              className={`${styles.accountCard} ${selectedAccount?._id === account._id ? styles.selectedAccount : ''}`}
              onClick={() => handleAccountSelect(account)}
            >
              <div className={styles.accountCardHeader}>
                <FiCreditCard className={styles.accountIcon} />
                <span className={styles.accountType}>{account.accountType.toUpperCase()}</span>
              </div>
              <div className={styles.accountNumber}>
                {account.accountNumber.replace(/(\d{4})/g, '$1 ').trim()}
              </div>
              <div className={styles.accountBalance}>
                {formatCurrency(account.balance, account.currency)}
              </div>
              <div className={styles.accountFooter}>
                Created: {formatDate(account.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Modal */}
      {showTransactionsModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '800px', width: '90%' }}>
            <div className={styles.modalHeader}>
              <h3>Transaction History</h3>
              <button 
                className={styles.closeButton} 
                onClick={() => setShowTransactionsModal(false)}
                aria-label="Close modal"
              >
                <FiX />
              </button>
            </div>
            
            <div className={styles.transactionsSection}>
              <div className={styles.transactionsHeader}>
                <div className={styles.transactionActions}>
                  <button 
                    className={styles.filterButton}
                    onClick={() => setShowDateFilter(!showDateFilter)}
                  >
                    <FiCalendar /> {showDateFilter ? 'Hide Filter' : 'Date Filter'}
                  </button>
                </div>
              </div>

              {showDateFilter && (
                <div className={styles.dateFilterContainer}>
                  <div className={styles.dateInputGroup}>
                    <label htmlFor="startDate">From:</label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className={styles.dateInputGroup}>
                    <label htmlFor="endDate">To:</label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <button className={styles.applyFilterButton} onClick={handleDateFilter}>
                    Apply Filter
                  </button>
                </div>
              )}

              <div className={styles.transactionsList}>
                {transactions.length > 0 ? (
                  transactions.map(tx => (
                    <div 
                      key={tx._id} 
                      className={styles.transactionItem}
                      onClick={() => handleTransactionClick(tx)}
                    >
                      <div className={styles.transactionDate}>
                        {formatDate(tx.date)}
                      </div>
                      <div className={styles.transactionDescription}>
                        <div className={styles.transactionTitle}>{tx.description}</div>
                        <div className={styles.transactionCategory}>{tx.category}</div>
                      </div>
                      <div className={`${styles.transactionAmount} ${tx.debit > 0 ? styles.debitAmount : styles.creditAmount}`}>
                        {tx.debit > 0 ? `-${formatCurrency(tx.debit)}` : `+${formatCurrency(tx.credit)}`}
                      </div>
                      <div className={styles.viewButton}>
                        <FiEye />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noTransactions}>No transactions found for the selected period.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Transaction Details</h3>
              <button 
                className={styles.closeButton} 
                onClick={() => setShowTransactionModal(false)}
                aria-label="Close modal"
              >
                <FiX />
              </button>
            </div>
            <div className={styles.transactionModalContent}>
              <div className={styles.transactionDetailItem}>
                <span className={styles.detailLabel}>Date:</span>
                <span className={styles.detailValue}>{formatDate(selectedTransaction.date)}</span>
              </div>
              
              <div className={styles.transactionDetailItem}>
                <span className={styles.detailLabel}>Description:</span>
                <span className={styles.detailValue}>{selectedTransaction.description}</span>
              </div>
              
              <div className={styles.transactionDetailItem}>
                <span className={styles.detailLabel}>Category:</span>
                <span className={styles.detailValue}>{selectedTransaction.category}</span>
              </div>
              
              <div className={styles.transactionDetailItem}>
                <span className={styles.detailLabel}>Payment Method:</span>
                <span className={styles.detailValue}>{selectedTransaction.type}</span>
              </div>
              
              {selectedTransaction.debit > 0 ? (
                <div className={styles.transactionDetailItem}>
                  <span className={styles.detailLabel}>Amount Debited:</span>
                  <span className={`${styles.detailValue} ${styles.debitAmount}`}>
                    {formatCurrency(selectedTransaction.debit)}
                  </span>
                </div>
              ) : (
                <div className={styles.transactionDetailItem}>
                  <span className={styles.detailLabel}>Amount Credited:</span>
                  <span className={`${styles.detailValue} ${styles.creditAmount}`}>
                    {formatCurrency(selectedTransaction.credit)}
                  </span>
                </div>
              )}
              
              <div className={styles.transactionDetailItem}>
                <span className={styles.detailLabel}>Balance After Transaction:</span>
                <span className={styles.detailValue}>{formatCurrency(selectedTransaction.balance)}</span>
              </div>
              
              <div className={styles.transactionDetailItem}>
                <span className={styles.detailLabel}>Transaction ID:</span>
                <span className={styles.detailValue}>{selectedTransaction._id}</span>
              </div>
              
              {selectedTransaction.debit > 0 ? (
                <div className={styles.transactionDetailItem}>
                  <span className={styles.detailLabel}>Recipient:</span>
                  <span className={styles.detailValue}>{selectedTransaction.receiver_id}</span>
                </div>
              ) : (
                <div className={styles.transactionDetailItem}>
                  <span className={styles.detailLabel}>Sender:</span>
                  <span className={styles.detailValue}>{selectedTransaction.sender_id}</span>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowTransactionModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;