import React from 'react';

interface HeaderProps {
  currentPhase: number;
  currentUser?: string | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPhase, currentUser, onLogout }) => {
  const steps = [
    { number: 1, label: 'Application' },
    { number: 2, label: 'Identity' },
    { number: 3, label: 'Legal' }
  ];

  const getStepClass = (stepNumber: number): string => {
    if (stepNumber < currentPhase) return 'step completed';
    if (stepNumber === currentPhase) return 'step active';
    return 'step';
  };

  return (
    <header className="header">
      <div className="logo">
        <i className="fas fa-briefcase"></i>
        <h1>Onboarding Portal</h1>
      </div>
      <div className="progress-indicator">
        {steps.map((step) => (
          <div key={step.number} className={getStepClass(step.number)} data-step={step.number}>
            <div className="step-number">{step.number}</div>
            <span>{step.label}</span>
          </div>
        ))}
      </div>
      {currentUser && (
        <div className="user-info">
          <span className="username">
            <i className="fas fa-user"></i>
            {currentUser}
          </span>
          {onLogout && (
            <button onClick={onLogout} className="logout-btn" title="Sign Out">
              <i className="fas fa-sign-out-alt"></i>
              Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
