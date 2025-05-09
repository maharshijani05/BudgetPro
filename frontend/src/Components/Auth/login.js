import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: 'aarav1@example.com', password: 'Password@123' });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [loading, setLoading] = useState(false);

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
    return '';
  };

  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    const newErrors = {
      email: emailError,
      password: passwordError,
      general: ''
    };

    setErrors(newErrors);
    return !emailError && !passwordError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation
    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(value),
        general: ''
      }));
    } else if (name === 'password') {
      setErrors(prev => ({
        ...prev,
        password: validatePassword(value),
        general: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      window.location.replace('/dashboard/index.html');

    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setErrors(prev => ({
          ...prev,
          email: 'No account found with this email',
          general: ''
        }));
      } else if (err.code === 'auth/wrong-password') {
        setErrors(prev => ({
          ...prev,
          password: 'Incorrect password',
          general: ''
        }));
      } else if (err.code === 'auth/too-many-requests') {
        setErrors(prev => ({
          ...prev,
          general: 'Too many failed attempts. Please try again later.'
        }));
      } else if (err.code === 'auth/invalid-email') {
        setErrors(prev => ({
          ...prev,
          email: 'Invalid email format',
          general: ''
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          general: 'An error occurred during login. Please try again.'
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {errors.general && <div className="error-message">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder=""
              className={errors.email ? 'error' : ''}
              maxLength="50"
              
            />
            <label>Email</label>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder=""
              className={errors.password ? 'error' : ''}
              minLength="6"
              maxLength="20"
            />
            <label>Password</label>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
