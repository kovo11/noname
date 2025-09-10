import React, { useState, useEffect } from 'react';
import InterviewStateService from '../services/InterviewStateService';

interface InterviewSuccessProps {
  interviewId: string;
  candidateName: string;
  onContinueToOnboarding: () => void;
  onRetryInterview?: () => void;
}

const InterviewSuccess: React.FC<InterviewSuccessProps> = ({ 
  interviewId, 
  candidateName, 
  onContinueToOnboarding,
  onRetryInterview 
}) => {
  const [canRetry, setCanRetry] = useState(false);

  useEffect(() => {
    const retryAllowed = InterviewStateService.getInstance().canRetry();
    setCanRetry(retryAllowed);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(interviewId);
    // Removed alert for better UX - using visual feedback instead
    const button = document.querySelector('.copy-btn');
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    }
  };

  const handleRetryInterview = () => {
    if (onRetryInterview) {
      onRetryInterview();
    }
  };

  return (
    <div className="interview-success">
      <div className="success-container">
        <div className="success-header">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1>Interview Submitted Successfully!</h1>
          <p className="success-subtitle">
            Thank you for completing the GitMatcher technical interview, {candidateName}
          </p>
        </div>

        <div className="interview-id-section">
          <div className="id-box">
            <h3>Your Interview Reference ID</h3>
            <div className="id-display">
              <span className="interview-id">{interviewId}</span>
              <button className="copy-btn" onClick={copyToClipboard}>
                <i className="fas fa-copy"></i>
                Copy
              </button>
            </div>
          </div>
          
          <div className="important-notice">
            <div className="notice-header" style={{ textAlign: 'center' }}>
              <strong>Important - Action Required</strong>
            </div>
            <div className="notice-content">
              <p>Please send us an email with the following information to complete your application:</p>
              <div className="email-info">
                <p><strong>Your Interview ID:</strong> {interviewId}</p>
                <p><strong>Your Full Name:</strong> {candidateName}</p>
                <p><strong>Subject Line:</strong> "Technical Interview Completed - {interviewId}"</p>
                <p><strong>Send to:</strong> <a href={`mailto:gitmatcher@nabibchiheb.info?subject=Technical Interview Completed - ${interviewId}&body=Interview ID: ${interviewId}%0AFull Name: ${candidateName}%0A%0AThank you for reviewing my technical interview submission.`}>gitmatcher@nabibchiheb.info</a></p>
              </div>
            </div>
          </div>
        </div>

        <div className="next-steps">
          <h3>What Happens Next?</h3>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Review Process</h4>
                <p>Our technical team will review your interview responses within 2-3 business days</p>
              </div>
            </div>
            
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Assessment Evaluation</h4>
                <p>We'll evaluate your technical skills, problem-solving approach, and cultural fit</p>
              </div>
            </div>
            
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Decision & Next Steps</h4>
                <p>You'll receive an email with our decision and next steps in the hiring process</p>
              </div>
            </div>
          </div>
        </div>

        <div className="performance-note">
          <div className="note-box">
            <i className="fas fa-lightbulb"></i>
            <div>
              <h4>Performance-Based Selection</h4>
              <p>
                Your progression to the next stage depends entirely on your interview performance. 
                We evaluate technical competency, communication skills, and alignment with GitMatcher's values.
              </p>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <button className="btn btn-secondary" onClick={copyToClipboard}>
            <i className="fas fa-copy"></i>
            Copy Interview ID
          </button>
          
          {canRetry && onRetryInterview && (
            <button className="btn btn-warning" onClick={handleRetryInterview}>
              <i className="fas fa-redo"></i>
              One More Try
            </button>
          )}
          
          <a 
            href={`mailto:gitmatcher@nabibchiheb.info?subject=Technical Interview Completed - ${interviewId}&body=Interview ID: ${interviewId}%0AFull Name: ${candidateName}%0A%0AThank you for reviewing my technical interview submission.`}
            className="btn btn-primary"
          >
            <i className="fas fa-envelope"></i>
            Send Email Now
          </a>
        </div>

        <div className="footer-note">
          <p>
            <i className="fas fa-info-circle"></i>
            Keep your Interview ID safe - you'll need it for all future communications regarding this application.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewSuccess;
