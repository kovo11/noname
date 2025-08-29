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
        <i className="fas fa-briefcase" aria-hidden="true"></i>
        <h1>Onboarding Portal</h1>
      </div>
      <div className="progress-indicator" role="progressbar" 
           aria-valuenow={currentPhase} 
           aria-valuemin={1} 
           aria-valuemax={3}
           aria-label={`Step ${currentPhase} of 3`}>
        {steps.map((step) => (
          <div key={step.number} 
               className={getStepClass(step.number)} 
               data-step={step.number}
               aria-current={step.number === currentPhase ? 'step' : undefined}>
            <div className="step-number" aria-label={`Step ${step.number}`}>
              {step.number < currentPhase ? '' : step.number}
            </div>
            <span className="mobile-hidden">{step.label}</span>
          </div>
        ))}
      </div>
      {currentUser && (
        <div className="user-info">
          <span className="username">
            <i className="fas fa-user" aria-hidden="true"></i>
            <span className="mobile-hidden">Welcome, </span>
            {currentUser}
          </span>
          {onLogout && (
            <button onClick={onLogout} 
                    className="logout-btn" 
                    title="Sign Out"
                    aria-label="Sign out of your account">
              <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
              <span className="mobile-hidden">Sign Out</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
