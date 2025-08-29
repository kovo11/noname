import React from 'react';

interface LandingPageProps {
  onStartInterview: () => void;
  onGoToOnboarding: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartInterview, onGoToOnboarding }) => {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-header">
          <div className="company-logo">
            <i className="fas fa-code-branch"></i>
            <h1>GitMatcher</h1>
          </div>
          <p className="company-tagline">Revolutionizing Git Repository Management</p>
        </div>

        <div className="welcome-section">
          <h2>Welcome to GitMatcher Career Portal</h2>
          <p className="welcome-description">
            Join our innovative team and help shape the future of version control and collaboration. 
            Choose your path below to continue your journey with GitMatcher.
          </p>
        </div>

        <div className="action-cards">
          <div className="action-card interview-card">
            <div className="card-icon">
              <i className="fas fa-video"></i>
            </div>
            <div className="card-content">
              <h3>Technical Interview</h3>
              <p>
                New to GitMatcher? Start your application process with our virtual technical interview. 
                This comprehensive assessment covers your technical skills, problem-solving abilities, 
                and fit for our team.
              </p>
              <ul className="card-features">
                <li><i className="fas fa-clock"></i> Takes approximately 1 hour</li>
                <li><i className="fas fa-code"></i> Technical questions about scaling</li>
                <li><i className="fas fa-microphone"></i> Video responses required</li>
                <li><i className="fas fa-user-check"></i> No prior experience with GitMatcher needed</li>
              </ul>
            </div>
            <button 
              className="btn btn-primary btn-large"
              onClick={onStartInterview}
            >
              <i className="fas fa-play"></i>
              Start Virtual Interview
            </button>
          </div>

          <div className="action-card onboarding-card">
            <div className="card-icon">
              <i className="fas fa-user-tie"></i>
            </div>
            <div className="card-content">
              <h3>Employee Onboarding</h3>
              <p>
                Already completed the interview process and received your credentials? 
                Access the employee onboarding portal to complete your hiring paperwork, 
                identity verification, and legal documentation.
              </p>
              <ul className="card-features">
                <li><i className="fas fa-id-card"></i> Identity verification</li>
                <li><i className="fas fa-file-contract"></i> Legal documentation</li>
                <li><i className="fas fa-shield-alt"></i> Background check consent</li>
                <li><i className="fas fa-key"></i> Requires login credentials</li>
              </ul>
            </div>
            <button 
              className="btn btn-secondary btn-large"
              onClick={onGoToOnboarding}
            >
              <i className="fas fa-sign-in-alt"></i>
              Login to Onboarding
            </button>
          </div>
        </div>

        <div className="info-section">
          <div className="info-box">
            <div className="info-item">
              <i className="fas fa-question-circle"></i>
              <div>
                <h4>New Candidate?</h4>
                <p>Start with the virtual interview to showcase your technical skills</p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-check-circle"></i>
              <div>
                <h4>Interview Completed?</h4>
                <p>Use the onboarding portal with credentials provided by our US team</p>
              </div>
            </div>
          </div>
        </div>

        <div className="process-flow">
          <h3>GitMatcher Hiring Process</h3>
          <div className="flow-steps">
            <div className="flow-step">
              <div className="step-circle">1</div>
              <div className="step-content">
                <h4>Technical Interview</h4>
                <p>Complete virtual assessment</p>
              </div>
            </div>
            <div className="flow-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
            <div className="flow-step">
              <div className="step-circle">2</div>
              <div className="step-content">
                <h4>Review Process</h4>
                <p>Our team evaluates your submission</p>
              </div>
            </div>
            <div className="flow-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
            <div className="flow-step">
              <div className="step-circle">3</div>
              <div className="step-content">
                <h4>Employee Onboarding</h4>
                <p>Complete hiring documentation</p>
              </div>
            </div>
            <div className="flow-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
            <div className="flow-step">
              <div className="step-circle">4</div>
              <div className="step-content">
                <h4>Welcome to GitMatcher!</h4>
                <p>Start your new career</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="landing-footer">
          <p>&copy; 2025 GitMatcher. All rights reserved. | Revolutionizing Version Control</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
