import React, { useState, useEffect } from 'react';
import { FileUpload } from './';
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

  const requiredFiles = ['passport', 'photo'];

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const newFileErrors: Record<string, string> = {};
    
    // Required field validation
    if (!formData.emergencyName.trim()) newErrors.emergencyName = 'Emergency contact name is required';
    if (!formData.emergencyRelation.trim()) newErrors.emergencyRelation = 'Relationship is required';

    // Email validation (optional field)
    if (formData.emergencyEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emergencyEmail)) {
        newErrors.emergencyEmail = 'Please enter a valid email address';
      }
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

  const uploadConfigs = [
    {
      id: 'passport',
      icon: 'fas fa-id-card',
      title: 'Passport / National ID / Driver\'s License',
      description: 'Upload any valid government-issued ID (Google Drive link)'
    },
    {
      id: 'photo',
      icon: 'fas fa-camera',
      title: 'Professional Photo',
      description: 'Recent headshot photo (Google Drive link)'
    }
  ];

  return (
    <div className="phase active">
      <div className="phase-header">
        <h2>Identity Verification</h2>
        <p>Please upload your identification documents for verification</p>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h3>Identity Documents</h3>
          <div className="upload-grid">
            {uploadConfigs.map(config => (
              <FileUpload
                key={config.id}
                id={config.id}
                icon={config.icon}
                title={config.title}
                description={config.description}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                error={fileErrors[config.id]}
              />
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Emergency Contact</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="emergencyName">Contact Name *</label>
              <input
                type="text"
                id="emergencyName"
                name="emergencyName"
                value={formData.emergencyName}
                onChange={handleChange}
                className={errors.emergencyName ? 'error' : ''}
                required
              />
              {errors.emergencyName && <span className="error-message">{errors.emergencyName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="emergencyRelation">Relationship *</label>
              <input
                type="text"
                id="emergencyRelation"
                name="emergencyRelation"
                value={formData.emergencyRelation}
                onChange={handleChange}
                className={errors.emergencyRelation ? 'error' : ''}
                required
              />
              {errors.emergencyRelation && <span className="error-message">{errors.emergencyRelation}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="emergencyEmail">Email Address</label>
              <input
                type="email"
                id="emergencyEmail"
                name="emergencyEmail"
                value={formData.emergencyEmail}
                onChange={handleChange}
                className={errors.emergencyEmail ? 'error' : ''}
              />
              {errors.emergencyEmail && <span className="error-message">{errors.emergencyEmail}</span>}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            Continue to Legal Onboarding
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default IdentityForm;
