import React, { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  // Get demo credentials for development
  useEffect(() => {
    const authService = AuthService.getInstance();
    const demoCredentials = authService.getDemoCredentials();
    
    // Auto-fill demo credentials in development
    if (process.env.NODE_ENV === 'development') {
      setFormData(demoCredentials);
      setShowDemoCredentials(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the parent's login handler and await the result
      const result = await onLogin(formData.username, formData.password);
      
      if (!result.success) {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-icon">
            <i className="fas fa-user-shield"></i>
          </div>
          <h2>Employee Onboarding Portal</h2>
          <p>Please sign in with your assigned credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your assigned username"
              className={error ? 'error' : ''}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={error ? 'error' : ''}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Signing In...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          {showDemoCredentials && (
            <div className="demo-credentials">
              <p>
                <i className="fas fa-flask"></i>
                <strong>Development Mode:</strong> Demo credentials pre-filled
              </p>
              <small>Username: {formData.username} | Password: {formData.password}</small>
            </div>
          )}
          <p>
            <i className="fas fa-info-circle"></i>
            Don't have credentials? Contact us for your assigned username and password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
