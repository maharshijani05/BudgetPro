import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import axios from 'axios';
import './signup.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    income: 0
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    income: '',
    general: ''
  });
  const [loading, setLoading] = useState(false);

  const validateName = (name) => {
    if (!name.trim()) {
      return 'Name is required';
    }
    if (name.length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (name.length > 50) {
      return 'Name should not exceed 50 characters';
    }
    if (!/^[a-zA-Z\s]*$/.test(name)) {
      return 'Name should only contain letters and spaces';
    }
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    if (email.length > 50) {
      return 'Email should not exceed 50 characters';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (password.length > 20) {
      return 'Password should not exceed 20 characters';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[0-9])/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return '';
  };

  const validateIncome = (income) => {
    if (!income && income !== 0) {
      return 'Income is required';
    }
    if (isNaN(income) || income < 0) {
      return 'Income must be a positive number';
    }
    if (income > 1000000) {
      return 'Income seems too high. Please verify the amount';
    }
    return '';
  };

  const validateForm = () => {
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const incomeError = validateIncome(formData.income);

    const newErrors = {
      name: nameError,
      email: emailError,
      password: passwordError,
      income: incomeError,
      general: ''
    };

    setErrors(newErrors);
    return !nameError && !emailError && !passwordError && !incomeError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Real-time validation
    switch (name) {
      case 'name':
        setErrors(prev => ({
          ...prev,
          name: validateName(value),
          general: ''
        }));
        break;
      case 'email':
        setErrors(prev => ({
          ...prev,
          email: validateEmail(value),
          general: ''
        }));
        break;
      case 'password':
        setErrors(prev => ({
          ...prev,
          password: validatePassword(value),
          general: ''
        }));
        break;
      case 'income':
        setErrors(prev => ({
          ...prev,
          income: validateIncome(value),
          general: ''
        }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create user in your backend
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        income: parseFloat(formData.income)
      };

      const response = await axios.post('https://budgetpro-backend.onrender.com/user', userData);
      
      if (response.status === 201) {
        navigate('/dashboard');

      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrors(prev => ({
          ...prev,
          email: 'This email is already registered',
          general: ''
        }));
      } else if (error.code === 'auth/invalid-email') {
        setErrors(prev => ({
          ...prev,
          email: 'Invalid email format',
          general: ''
        }));
      } else if (error.code === 'auth/weak-password') {
        setErrors(prev => ({
          ...prev,
          password: 'Password is too weak',
          general: ''
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          general: 'An error occurred during signup. Please try again.'
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Create Account</h2>
        {errors.general && <div className="error-message">{errors.general}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder=" "
              className={errors.name ? 'error' : ''}
              maxLength="50"
            />
            <label htmlFor="name">Full Name</label>
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder=" "
              className={errors.email ? 'error' : ''}
              maxLength="50"
            />
            <label htmlFor="email">Email</label>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder=" "
              minLength="6"
              maxLength="20"
              className={errors.password ? 'error' : ''}
            />
            <label htmlFor="password">Password</label>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <input
              type="number"
              id="income"
              name="income"
              value={formData.income}
              onChange={handleChange}
              required
              placeholder=" "
              min="0"
              max="1000000"
              step="0.01"
              className={errors.income ? 'error' : ''}
            />
            <label htmlFor="income">Monthly Income</label>
            {errors.income && <span className="field-error">{errors.income}</span>}
          </div>

          <button 
            type="submit" 
            className="signup-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;