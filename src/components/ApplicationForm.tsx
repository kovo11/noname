import React, { useState, useEffect } from 'react';
import { FormProps, ApplicationData } from '../types';
import { useAuth } from '../contexts/AuthContext';
import DataService from '../services/DataService';

const ApplicationForm: React.FC<FormProps> = ({ onSubmit, initialData }) => {
  const { getUserPersonalInfo } = useAuth();
  const personalInfo = getUserPersonalInfo();
  
  const [formData, setFormData] = useState<ApplicationData>({
    firstName: personalInfo?.firstName || '',
    lastName: personalInfo?.lastName || '',
    email: personalInfo?.email || '',
    phone: personalInfo?.phone || '',
    address: '',
    salaryAcceptable: true,
    salaryRequest: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  useEffect(() => {
    if (personalInfo) {
      setFormData(prev => ({
        ...prev,
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.phone
      }));
    }
  }, [personalInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'radio') {
      setFormData({ ...formData, [name]: value === 'true' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Only require address since other fields are pre-populated
    if (!formData.address.trim()) {
      newErrors.address = 'Please provide your current address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="phase active">
      <div className="phase-header">
        <h2>Employee Onboarding - Phase 2</h2>
        <p>Welcome to the final phase of your onboarding process</p>
      </div>
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="info-display">
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name:</label>
                <span className="info-value">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span className="info-value">{formData.email}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span className="info-value">{formData.phone}</span>
              </div>
            </div>
            <p className="info-note">
              <i className="fas fa-info-circle"></i>
              The above information was provided during your initial application. If any details need to be updated, please contact HR.
            </p>
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Current Address *</label>
            <textarea
              id="address"
              name="address"
              rows={3}
              placeholder="Please enter your current residential address..."
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              required
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Continue to Identity Verification
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
