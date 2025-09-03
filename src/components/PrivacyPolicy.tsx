import React, { useState, useEffect } from 'react';

interface PrivacyPolicyProps {
  onAccept: () => void;
  onDecline: () => void;
  isVisible: boolean;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onAccept, onDecline, isVisible }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(false);

  // Enable button after 10 seconds as fallback
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setTimeElapsed(true);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    // More reliable scroll detection with 5px tolerance
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 5;
    if (isAtBottom) {
      setHasScrolledToBottom(true);
    }
  };

  // Check if content requires scrolling when component mounts
  const checkContentHeight = (element: HTMLDivElement | null) => {
    if (element) {
      // If content doesn't overflow, enable the button immediately
      if (element.scrollHeight <= element.clientHeight + 5) {
        setHasScrolledToBottom(true);
      }
    }
  };

  const canProceed = hasScrolledToBottom || timeElapsed;

  if (!isVisible) return null;

  return (
    <div className="privacy-policy-overlay">
      <div className="privacy-policy-modal">
        <div className="privacy-policy-header">
          <h2><i className="fas fa-shield-alt"></i> Privacy Policy & Data Protection</h2>
          <p>Please review our privacy policy regarding verification documents</p>
        </div>

        <div 
          className="privacy-policy-content" 
          onScroll={handleScroll}
          ref={checkContentHeight}
        >
          <div className="policy-section">
            <h3><i className="fas fa-file-shield"></i> Document Verification & Data Deletion Policy</h3>
            <p>
              At GitMatcher, we take your privacy and data security seriously. This policy outlines how we handle 
              your verification documents during the onboarding process.
            </p>
          </div>

          <div className="policy-section">
            <h4><i className="fas fa-clock"></i> Immediate Data Deletion</h4>
            <ul>
              <li>
                <strong>Automatic Deletion:</strong> All verification documents (ID, passport, photos) are 
                automatically deleted from our systems within 24 hours of verification completion.
              </li>
              <li>
                <strong>No Permanent Storage:</strong> We do not retain copies of your personal identification 
                documents beyond the verification period.
              </li>
              <li>
                <strong>Secure Processing:</strong> Documents are processed through encrypted channels and 
                stored temporarily in secure, access-controlled environments.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h4><i className="fas fa-eye"></i> What We Verify</h4>
            <ul>
              <li>Identity verification through government-issued ID or passport</li>
              <li>Photo verification to match identity documents</li>
              <li>Background check consent (no personal documents stored)</li>
            </ul>
          </div>

          <div className="policy-section">
            <h4><i className="fas fa-trash-alt"></i> Data Retention & Deletion</h4>
            <div className="retention-timeline">
              <div className="timeline-item">
                <span className="timeline-point"></span>
                <div className="timeline-content">
                  <strong>Upload & Verification:</strong> Documents processed immediately upon upload
                </div>
              </div>
              <div className="timeline-item">
                <span className="timeline-point"></span>
                <div className="timeline-content">
                  <strong>Verification Complete:</strong> Identity confirmed, documents marked for deletion
                </div>
              </div>
              <div className="timeline-item">
                <span className="timeline-point success"></span>
                <div className="timeline-content">
                  <strong>24 Hours Later:</strong> All verification documents permanently deleted
                </div>
              </div>
            </div>
          </div>

          <div className="policy-section">
            <h4><i className="fas fa-lock"></i> Your Rights</h4>
            <ul>
              <li>Request immediate deletion of documents at any time</li>
              <li>Receive confirmation of document deletion</li>
              <li>Access our data deletion logs upon request</li>
              <li>Contact support for any privacy concerns</li>
            </ul>
          </div>

          <div className="policy-section">
            <h4><i className="fas fa-phone"></i> Contact Information</h4>
            <p>
              For privacy concerns or data deletion requests, contact our Data Protection Officer at:
              <br />
              <strong>Email:</strong> privacy@gitmatcher.com
              <br />
              <strong>Reference:</strong> Document Deletion Policy v2.1
            </p>
          </div>

          <div className="policy-section highlight">
            <h4><i className="fas fa-exclamation-triangle"></i> Important Notice</h4>
            <p>
              By proceeding with document upload, you acknowledge that:
            </p>
            <ul>
              <li>You understand our immediate deletion policy</li>
              <li>You consent to temporary document processing for verification</li>
              <li>You can request immediate deletion at any time</li>
              <li>No verification documents will be stored beyond 24 hours</li>
            </ul>
          </div>
        </div>

        <div className="privacy-policy-footer">
          <div className="scroll-indicator">
            {!canProceed && (
              <p style={{ color: '#f59e0b', fontWeight: '500' }}>
                <i className="fas fa-arrow-down"></i> 
                Please scroll to read the complete policy or wait 10 seconds
              </p>
            )}
            {canProceed && (
              <p style={{ color: '#10b981', fontWeight: '500' }}>
                <i className="fas fa-check-circle"></i> 
                You can now continue
              </p>
            )}
          </div>
          
          <div className="policy-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onDecline}
            >
              <i className="fas fa-times"></i>
              Decline
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={onAccept}
              disabled={!canProceed}
            >
              <i className="fas fa-check"></i>
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
