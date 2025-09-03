import React, { useState, useEffect } from 'react';
import { FileUpload, PrivacyPolicy } from './';
import { PhaseFormProps, DocumentInfo } from '../types';

interface IdentityFormProps extends PhaseFormProps {
  uploadedFiles: Record<string, DocumentInfo>;
  setUploadedFiles: React.Dispatch<React.SetStateAction<Record<string, DocumentInfo>>>;
}

const IdentityForm: React.FC<IdentityFormProps> = ({ 
  onSubmit, 
  onBack, 
  uploadedFiles, 
  setUploadedFiles, 
  initialData 
}) => {
  const [formData, setFormData] = useState({
    emergencyName: '',
    emergencyRelation: '',
    emergencyEmail: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const requiredFiles = ['passport', 'photo'];

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.emergencyName.trim()) {
      newErrors.emergencyName = 'Emergency contact name is required';
    }

    if (!formData.emergencyRelation.trim()) {
      newErrors.emergencyRelation = 'Relationship is required';
    }

    if (!formData.emergencyEmail.trim()) {
      newErrors.emergencyEmail = 'Emergency contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.emergencyEmail)) {
      newErrors.emergencyEmail = 'Please enter a valid email address';
    }

    return newErrors;
  };

  const validateFiles = () => {
    const newFileErrors: Record<string, string> = {};

    requiredFiles.forEach(fileType => {
      if (!uploadedFiles[fileType]) {
        newFileErrors[fileType] = `${fileType === 'passport' ? 'Passport/ID' : 'Photo'} is required`;
      }
    });

    return newFileErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    const currentFileErrors = validateFiles();

    if (Object.keys(formErrors).length > 0 || Object.keys(currentFileErrors).length > 0) {
      setErrors(formErrors);
      setFileErrors(currentFileErrors);
      return;
    }

    if (!privacyAccepted) {
      setShowPrivacyPolicy(true);
      return;
    }

    onSubmit(formData);
  };

  const handlePrivacyAccept = () => {
    setPrivacyAccepted(true);
    setShowPrivacyPolicy(false);
    // Don't auto-submit - let user complete and submit the form manually
    console.log('✅ Privacy policy accepted - user can now submit the form');
  };

  const handlePrivacyDecline = () => {
    setShowPrivacyPolicy(false);
  };

  return (
    <>
      <div className="form-container">
        <div className="phase-header">
          <h2>Identity Verification</h2>
          <p style={{ color: '#374151', fontWeight: '500' }}>
            Please provide your identity documents and emergency contact information for verification purposes.
          </p>
        </div>

        <div className="privacy-notice">
          <div className="notice-card">
            <h3><i className="fas fa-shield-alt"></i> Privacy Protection Notice</h3>
            <p>
              <strong>Your privacy is our priority:</strong> All verification documents are automatically 
              deleted within 24 hours of verification completion. We only verify your identity and do not 
              store personal documents permanently.
            </p>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => setShowPrivacyPolicy(true)}
            >
              <i className="fas fa-info-circle"></i>
              Read Full Privacy Policy
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="identity-form">
          <div className="form-section">
            <h3>Document Upload</h3>
            <p>Please upload clear, high-quality images of your identification documents:</p>
            
            <div className="file-uploads">
              <FileUpload
                id="passport"
                icon="fas fa-passport"
                title="Government ID / Passport"
                description="Upload a clear photo of your passport, driver's license, or government-issued ID"
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                error={fileErrors.passport}
              />

              <FileUpload
                id="photo"
                icon="fas fa-camera"
                title="Profile Photo"
                description="Upload a clear, recent photo of yourself for identity verification"
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                error={fileErrors.photo}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Emergency Contact Information</h3>
            <p>Please provide details of someone we can contact in case of emergency:</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="emergencyName">Emergency Contact Name</label>
                <input
                  type="text"
                  id="emergencyName"
                  name="emergencyName"
                  value={formData.emergencyName}
                  onChange={handleChange}
                  placeholder="Full name of emergency contact"
                  className={errors.emergencyName ? 'error' : ''}
                  required
                />
                {errors.emergencyName && <div className="error-message">{errors.emergencyName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="emergencyRelation">Relationship</label>
                <select
                  id="emergencyRelation"
                  name="emergencyRelation"
                  value={formData.emergencyRelation}
                  onChange={handleChange}
                  className={errors.emergencyRelation ? 'error' : ''}
                  required
                >
                  <option value="">Select relationship</option>
                  <option value="parent">Parent</option>
                  <option value="spouse">Spouse</option>
                  <option value="sibling">Sibling</option>
                  <option value="child">Child</option>
                  <option value="relative">Other Relative</option>
                  <option value="friend">Friend</option>
                  <option value="colleague">Colleague</option>
                </select>
                {errors.emergencyRelation && <div className="error-message">{errors.emergencyRelation}</div>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="emergencyEmail">Emergency Contact Email</label>
                <input
                  type="email"
                  id="emergencyEmail"
                  name="emergencyEmail"
                  value={formData.emergencyEmail}
                  onChange={handleChange}
                  placeholder="emergency.contact@email.com"
                  className={errors.emergencyEmail ? 'error' : ''}
                  required
                />
                {errors.emergencyEmail && <div className="error-message">{errors.emergencyEmail}</div>}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onBack} className="btn btn-secondary">
              <i className="fas fa-arrow-left"></i>
              Back
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-check"></i>
              Continue to Legal
            </button>
          </div>
        </form>
      </div>

      <PrivacyPolicy
        isVisible={showPrivacyPolicy}
        onAccept={handlePrivacyAccept}
        onDecline={handlePrivacyDecline}
      />
    </>
  );
};

export default IdentityForm;
