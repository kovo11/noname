import React from 'react';
import { CandidateData } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface SuccessPageProps {
  candidateData: CandidateData;
  onLogout?: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ candidateData, onLogout }) => {
  const { logout } = useAuth();
  
  const handleLogout = onLogout || logout;
  const generateApplicationSummary = (): string => {
    const data = candidateData;
    
    return `DEVELOPER ONBOARDING SUBMISSION REPORT
======================================

Candidate ID: ${data.candidateId}
Submission Date: ${new Date(data.submissionDate!).toLocaleString()}
Completion Date: ${new Date(data.completionDate!).toLocaleString()}

PERSONAL INFORMATION
-------------------
Name: ${data.application?.firstName} ${data.application?.lastName}
Email: ${data.application?.email}
Address: ${data.application?.address}

COMPENSATION DETAILS
-------------------
Bi-weekly Salary: $2,300
Annual Salary: $59,800
Salary Acceptable: ${data.application?.salaryAcceptable ? 'Yes' : 'No'}
${!data.application?.salaryAcceptable ? `Salary Request: ${data.application?.salaryRequest}` : ''}

EMERGENCY CONTACT
----------------
Name: ${data.identity?.emergencyName}
Relationship: ${data.identity?.emergencyRelation}
Email: ${data.identity?.emergencyEmail}

DOCUMENTS SUBMITTED (Google Drive Links)
---------------------------------------
${Object.keys(data.identity?.documents || {}).map(doc => `- ${doc}: ${data.identity!.documents[doc].filename} (View: ${data.identity!.documents[doc].driveUrl})`).join('\n')}
${Object.keys(data.legal?.documents || {}).map(doc => `- ${doc}: ${data.legal!.documents[doc].filename} (View: ${data.legal!.documents[doc].driveUrl})`).join('\n')}

PAYMENT INFORMATION
------------------
Transaction ID: ${data.legal?.transactionId}
LTC Amount: ${data.legal?.ltcAmount}
Payment Status: Pending Verification

APPLICATION STATUS
-----------------
Status: PENDING REVIEW
Your application is currently under review by our team.
We will contact you within 3-5 business days regarding next steps.

NEXT STEPS
----------
1. Background check processing (5 business days)
2. Document verification by our legal team
3. ${!data.application?.salaryAcceptable ? 'Salary negotiation discussion' : 'Contract finalization'}
4. Final approval and start date confirmation

Thank you for your patience during the review process.
`;
  };

  const downloadSummary = () => {
    const summary = generateApplicationSummary();
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Application_Summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="phase active">
      <div className="success-container">
        <div className="success-icon">
          <i className="fas fa-clock"></i>
        </div>
        <h2>Application Submitted Successfully</h2>
        <div className="status-badge">
          <i className="fas fa-hourglass-half"></i>
          <span>PENDING REVIEW</span>
        </div>
        <p>Thank you for completing your developer onboarding application. Your submission has been received and is currently under review by our team.</p>
        
        <div className="success-details">
          <h3>What happens next?</h3>
          <ul>
            <li><strong>Initial Review:</strong> Our team will review your application and documents within 24-48 hours</li>
            <li><strong>Team Contact:</strong> We will reach out to you within 3-5 business days with updates on your application status</li>
            <li><strong>Team Meeting:</strong> You will join us for a meeting where we will go into details about this position and introduce you to the rest of the team</li>
            <li><strong>Background Verification:</strong> Background check processing will commence within 5 business days</li>
            <li><strong>Document Verification:</strong> All submitted documents will be verified for authenticity and completeness</li>
            <li><strong>Final Approval:</strong> Upon successful verification, you will receive your contract and start date confirmation</li>
          </ul>
          
          <div className="timeline-note">
            <p><strong>Expected Timeline:</strong> The complete review process typically takes 5-7 business days. We appreciate your patience during this time.</p>
          </div>
        </div>

        <div className="candidate-id">
          <p><strong>Your Reference ID:</strong> <span>{candidateData.candidateId}</span></p>
          <p>Please save this ID for future correspondence and reference.</p>
        </div>

        <div className="contact-info">
          <h4>Questions or Concerns?</h4>
          <p>If you have any questions about your application status, please contact us using your reference ID above.</p>
        </div>

        <div className="success-actions">
          <button className="btn btn-primary" onClick={downloadSummary}>
            <i className="fas fa-download"></i>
            Download Application Summary
          </button>
          
          <button className="btn btn-secondary" onClick={handleLogout} style={{ marginLeft: '1rem' }}>
            <i className="fas fa-sign-out-alt"></i>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
