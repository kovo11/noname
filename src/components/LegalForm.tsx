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
    doc.text('Developer Contract', 20, 30);
    
    // Add a line break
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    let yPosition = 50;
    const lineHeight = 6;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width - 2 * margin;
    
    // Contract content
    const contractText = [
      'This Agreement is made between:',
      '',
      '• Gitmatcher. ("Company"), incorporated in the United States',
      '• _________________________ ("Developer"), an independent software developer',
      '',
      '1. PURPOSE',
      'Gitmatcher engages Developer to design, build, deploy, and maintain the',
      'Company\'s digital systems, applications, and supporting infrastructure.',
      '',
      '2. SCOPE OF WORK',
      '• System Architecture & Design',
      '• Application Development (web, mobile, backend)',
      '• Infrastructure & Hosting setup',
      '• Security & Compliance implementation',
      '• Ongoing Maintenance & Support',
      '',
      '3. COMPENSATION',
      '• Development & Support Fee: USD $2,300 every two (2) weeks',
      '• Annualized Equivalent: Approximately USD $59,800 per year',
      '• Payment within 3 business days of each bi-weekly cycle',
      '',
      '4. INTELLECTUAL PROPERTY',
      'All code, designs, and documentation developed under this Agreement are the',
      'exclusive property of Miebach Ventures.',
      '',
      '5. CONFIDENTIALITY',
      'Developer agrees to maintain strict confidentiality of all Company data,',
      'business plans, source code, and trade secrets.',
      '',
      '6. TERM & TERMINATION',
      '• Agreement effective for two (2) years',
      '• Either Party may terminate with 60 days\' written notice',
      '',
      '7. SIGNATURES',
      '',
      'For Gitmatcher. (USA)',
      'Name: Nabibchiheb',
      'Title: Chief Executive Officer',
      '',
      'For Developer (Individual)',
      'Name: _________________________',
      'Signature: _________________________',
      'Date: _________________________',
      '',
      'IMPORTANT NOTE: This is a preliminary contract template for review purposes.',
      'A complete, legally binding contract will be sent to you after successful',
      'completion of the onboarding process.'
    ];
    
    contractText.forEach((line) => {
      if (yPosition > 270) { // Check if we need a new page
        doc.addPage();
        yPosition = 30;
      }
      
      if (line.startsWith('Developer Contract') || line.startsWith('1.') || line.startsWith('2.') || 
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
    
    doc.save('Developer_Contract_Template.pdf');
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
      'of my developer onboarding process.',
      '',
      'CONSENT DETAILS:',
      '• I understand that a background check will be conducted covering criminal',
      '  history, employment verification, and education verification',
      '• I authorize the company to contact previous employers, educational',
      '  institutions, and relevant authorities',
      '• I understand that this background check is mandatory for employment as',
      '  a Developer',
      '• I consent to the processing of my personal data for this purpose',
      '• I understand the cost of $50 USD will be refunded upon successful',
      '  completion of the onboarding process',
      '',
      'SIGNATURE SECTION:',
      'Developer Signature: _________________________',
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
      title: 'Signed Developer Contract',
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
          <h3>Background Check Requirement</h3>
          <div className="background-check-info">
            <p>As part of our hiring process, all developers complete a standard background check. This is not unique to us it's a normal requirement across the tech industry, especially when working with sensitive client systems and data.</p>
            
            <p><strong>Why we require it:</strong></p>
            <p>Security compliance: Many of our clients require verified background checks before granting developers codebase access.</p>
            <p>Trust & safety: It helps us maintain a safe, professional environment for both our team and clients.</p>
            <p>Regulatory compliance: Certain industries legally mandate verification for software professionals.</p>
            <p>Data protection: Ensures secure handling of client data and intellectual property.</p>
            <p>Professional standards: Reinforces our reputation as a trusted development partner.</p>
            
            <p><strong>Why candidates cover the upfront cost:</strong></p>
            <p>Unfortunately, due to past fraudulent applications, we've had to introduce an upfront payment model. The cost is $50 USD, and it is 100% refunded once your background check is successfully cleared.</p>
            
            <p><strong>Why we cannot accept self-arranged reports:</strong></p>
            <p>Certified third-party agencies are required by law and by our clients.</p>
            <p>Independent agencies ensure authenticity and proper documentation.</p>
            <p>Our liability insurance mandates accredited checks.</p>
            <p>All developers must go through the same standardized process.</p>
            
            <p><strong>Process overview:</strong></p>
            <p>Coverage: Criminal history, employment history, education verification</p>
            <p>Processing time: 5 business days</p>
            <p>Cost: $50 USD (fully refunded)</p>
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
                I agree to pay $50 USD for the background check processing fee. I understand this payment will be refunded upon successful completion of the onboarding process and will be processed through secure digital payment methods.
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
