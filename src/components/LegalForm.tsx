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

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'ltc' | 'card' | 'paypal' | 'skrill'>('ltc');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  const requiredFiles = ['contract', 'consent'];
  const ltcAddress = 'LTC1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

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
      '• Miebach Ventures Ltd. ("Company"), incorporated in the United States',
      '• _________________________ ("Developer"), an independent software developer',
      '',
      '1. PURPOSE',
      'Miebach Ventures engages Developer to design, build, deploy, and maintain the',
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
      'For Miebach Ventures Ltd. (USA)',
      'Name: Micheal Miebach',
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
      'for Miebach Ventures Ltd. to conduct a comprehensive background check as part',
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
        <p>Complete your legal documentation and background check payment</p>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <div className="info-card">
            <h3><i className="fas fa-shield-alt"></i> Background Check Requirement</h3>
            <div className="background-check-info">
              <p><strong>Why is a background check mandatory for developers?</strong></p>
              <ul>
                <li><strong>Security Compliance:</strong> Our clients require all developers to pass comprehensive security screenings for code access</li>
                <li><strong>Trust & Safety:</strong> We maintain the highest standards of trust with our clients and their sensitive systems</li>
                <li><strong>Legal Requirements:</strong> Industry regulations mandate background verification for all software developers</li>
                <li><strong>Data Protection:</strong> Ensuring secure handling of client data and proprietary code</li>
                <li><strong>Professional Standards:</strong> Maintaining our reputation as a trusted development partner</li>
              </ul>
              <div className="check-details">
                <p><strong>Processing Time:</strong> 5 business days</p>
                <p><strong>Cost:</strong> $50 USD</p>
                <p><strong>Coverage:</strong> Criminal history, employment verification, education verification</p>
              </div>
            </div>
          </div>
        </div>

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
          <h3>Payment Method Selection</h3>
          <div className="payment-method-selection">
            <p>Choose your preferred payment method for the $50 USD background check fee:</p>
            
            <div className="payment-methods">
              <div 
                className={`payment-option ${selectedPaymentMethod === 'ltc' ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod('ltc')}
              >
                <div className="payment-icon">₿</div>
                <div className="payment-details">
                  <h4>Litecoin (LTC)</h4>
                  <p>Available - Cryptocurrency payment</p>
                </div>
              </div>

              <div 
                className={`payment-option disabled`}
                onClick={() => alert('Credit/Debit Card payment is currently unavailable and under maintenance. Please use Litecoin for now.')}
              >
                <div className="payment-icon">💳</div>
                <div className="payment-details">
                  <h4>Credit/Debit Card</h4>
                  <p>Unavailable - Currently under maintenance</p>
                </div>
              </div>

              <div 
                className={`payment-option disabled`}
                onClick={() => alert('PayPal payment is currently unavailable and under maintenance. Please use Litecoin for now.')}
              >
                <div className="payment-icon">📧</div>
                <div className="payment-details">
                  <h4>PayPal</h4>
                  <p>Unavailable - Currently under maintenance</p>
                </div>
              </div>

              <div 
                className={`payment-option disabled`}
                onClick={() => alert('Skrill payment is currently unavailable and under maintenance. Please use Litecoin for now.')}
              >
                <div className="payment-icon">💰</div>
                <div className="payment-details">
                  <h4>Skrill</h4>
                  <p>Unavailable - Currently under maintenance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedPaymentMethod === 'ltc' && (
        <div className="form-section">
          <h3>Litecoin Payment Details</h3>
          <div className="payment-section">
            <div className="payment-info">
              <h4>Payment Instructions:</h4>
              <ol>
                <li>Send exactly <strong>$50 USD worth of LTC</strong> to the address below</li>
                <li>Copy your transaction ID and paste it in the field below</li>
                <li>Payment will be verified within 1-2 hours</li>
              </ol>
            </div>
            
            <div className="wallet-address">
              <label>LTC Wallet Address:</label>
              <div className="address-container">
                <input type="text" value={ltcAddress} readOnly />
                <button type="button" className="btn-copy" onClick={() => copyToClipboard(ltcAddress)}>
                  <i className="fas fa-copy"></i>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="transactionId">Transaction ID *</label>
              <input
                type="text"
                id="transactionId"
                name="transactionId"
                placeholder="Paste your LTC transaction ID here"
                value={formData.transactionId}
                onChange={handleChange}
                className={errors.transactionId ? 'error' : ''}
                required
              />
              {errors.transactionId && <span className="error-message">{errors.transactionId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="ltcAmount">LTC Amount Sent *</label>
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
    </div>
  );
};

export default LegalForm;
