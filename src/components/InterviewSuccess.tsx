import React from 'react';

interface InterviewSuccessProps {
  interviewId: string;
  candidateName: string;
  onContinueToOnboarding: () => void;
}

const InterviewSuccess: React.FC<InterviewSuccessProps> = ({ 
  interviewId, 
  candidateName, 
  onContinueToOnboarding 
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(interviewId);
    alert('Interview ID copied to clipboard!');
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
            Thank you for completing the GitMacher technical interview, {candidateName}
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
            <div className="notice-header">
              <i className="fas fa-exclamation-triangle"></i>
              <strong>Important - Action Required</strong>
            </div>
            <div className="notice-content">
              <p>
                Please send us an email with the following information to complete your application:
              </p>
              <ul>
                <li><strong>Your Interview ID:</strong> {interviewId}</li>
                <li><strong>Your Full Name:</strong> {candidateName}</li>
                <li><strong>Subject Line:</strong> "Technical Interview Completed - {interviewId}"</li>
              </ul>
              <p>
                <strong>Send to:</strong> <a href={`mailto:interviews@gitmacher.com?subject=Technical Interview Completed - ${interviewId}&body=Interview ID: ${interviewId}%0AFull Name: ${candidateName}%0A%0AThank you for reviewing my technical interview submission.`}>interviews@gitmacher.com</a>
              </p>
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
                We evaluate technical competency, communication skills, and alignment with GitMacher's values.
              </p>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <button className="btn btn-secondary" onClick={copyToClipboard}>
            <i className="fas fa-copy"></i>
            Copy Interview ID
          </button>
          
          <a 
            href={`mailto:interviews@gitmacher.com?subject=Technical Interview Completed - ${interviewId}&body=Interview ID: ${interviewId}%0AFull Name: ${candidateName}%0A%0AThank you for reviewing my technical interview submission.`}
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
