import React, { useState } from 'react';
import usersData from '../data/users.json';

interface UserData {
  username: string;
  password: string;
  status: string;
  assignedDate: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  data: any;
}

interface UsersJson {
  users: UserData[];
}

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user in the users data
    const typedUsersData = usersData as UsersJson;
    const user = typedUsersData.users.find(
      (u: UserData) => u.username === formData.username && u.password === formData.password
    );

    if (user) {
      if (user.status === 'active') {
        onLogin(formData.username);
      } else {
        setError('This account is not active. Please contact HR.');
      }
    } else {
      setError('Invalid credentials. Please check your username and password.');
    }

    setIsLoading(false);
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
          <p>
            <i className="fas fa-info-circle"></i>
            Don't have credentials? Contact HR for your assigned username and password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
