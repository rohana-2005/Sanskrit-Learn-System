import React, { useState } from 'react'
import './login_signup.css'
import { authAPI, tokenManager } from '../services/api'
import { useNavigate } from 'react-router-dom'

export const LoginSignup = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 

  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/test');
      const data = await response.json();
      console.log('Connection test successful:', data);
      setMessage('✅ Connection to server successful!');
      setMessageType('success');
    } catch (error) {
      console.error('Connection test failed:', error);
      setMessage('❌ Cannot connect to server. Please check if server is running on port 5000.');
      setMessageType('error');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { email, password } = formData;
        if (!email || !password) {
          throw { message: 'Please fill in all fields' };
        }

        console.log('Attempting login...');
        const response = await authAPI.login({ email, password });
        
        tokenManager.setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        setMessage('Login successful! Welcome back.');
        setMessageType('success');
        
        setTimeout(() => {
          if (onLogin) onLogin();
          navigate('/dashboard'); // Navigate to dashboard after login
        }, 1000);
        
        console.log('Login successful:', response.user);
        
      } else {
        const { fullName, email, password, confirmPassword } = formData;
        if (!fullName || !email || !password || !confirmPassword) {
          throw { message: 'Please fill in all fields' };
        }

        if (password !== confirmPassword) {
          throw { message: 'Passwords do not match' };
        }

        console.log('Attempting registration...');
        const response = await authAPI.register(formData);
        
        tokenManager.setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        setMessage('Registration successful! Welcome to Sanskrit Learning System.');
        setMessageType('success');
        
        setTimeout(() => {
          if (onLogin) onLogin();
          navigate('/dashboard'); // Navigate to dashboard after registration
        }, 1000);
        
        console.log('Registration successful:', response.user);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      let errorMessage = 'An error occurred. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check if the server is running.';
      }
      
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className='form-wrapper'>
        <div className='form-toggle'>
          <button 
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        
        <div className='header'>
          <div className='text'>{isLogin ? 'Welcome Back' : 'Create Account'}</div>
          <div className='underline'></div>
        </div>
        
        <div className='form'>
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className='field'>
                <input 
                  type='text' 
                  name='fullName'
                  placeholder='Full Name' 
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            )}
            <div className='field'>
              <input 
                type='email' 
                name='email'
                placeholder='Email Address' 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className='field'>
              <input 
                type='password' 
                name='password'
                placeholder='Password' 
                value={formData.password}
                onChange={handleInputChange}
                required 
              />
            </div>
            {!isLogin && (
              <div className='field'>
                <input 
                  type='password' 
                  name='confirmPassword'
                  placeholder='Confirm Password' 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            )}
            
            {isLogin && (
              <div className='forgot-password'>
                <a href='#'>Forgot Password?</a>
              </div>
            )}
            
            <div className='field btn'>
              <div className='btn-layer'></div>
              <input 
                type='submit' 
                value={loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')} 
                disabled={loading}
              />
            </div>
          </form>
          
          <div className='switch-form'>
            {isLogin ? (
              <p>Don't have an account? <span onClick={toggleForm}>Sign up here</span></p>
            ) : (
              <p>Already have an account? <span onClick={toggleForm}>Login here</span></p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default LoginSignup
