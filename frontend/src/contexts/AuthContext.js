import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../Components/Auth/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDbUser = async (firebaseUser) => {
    try {
      console.log('Fetching database user for email:', firebaseUser.email);
      const response = await axios.get(`https://budgetpro-backend.onrender.com/user/email/${firebaseUser.email}`);
      console.log('Database user data:', response.data);
      setDbUser(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching database user:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to fetch user data');
      setDbUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Firebase auth state changed:', user ? 'User logged in' : 'No user');
      setCurrentUser(user);
      if (user) {
        await fetchDbUser(user);
      } else {
        setDbUser(null);
        setError(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  const value = {
    currentUser,
    dbUser,
    setDbUser,
    userId: dbUser?._id || null,
    userName: dbUser?.name || null,
    loading,
    error
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 