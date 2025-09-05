import React, { useState, useEffect } from 'react';
import { FormProps, ApplicationData } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ApplicationForm: React.FC<FormProps> = ({ onSubmit, initialData }) => {
  const { getUserPersonalInfo } = useAuth();
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  
  const [formData, setFormData] = useState<ApplicationData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    salaryAcceptable: true,
    salaryRequest: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadPersonalInfo = async () => {
      try {
        const info = await getUserPersonalInfo();
        if (info) {
          setPersonalInfo(info);
          setFormData(prev => ({
            ...prev,
            firstName: info.firstName || '',
            lastName: info.lastName || '',
            email: info.email || ''
          }));
        }
      } catch (error) {
        console.error('Error loading personal info:', error);
      }
    };
    
    loadPersonalInfo();
  }, [getUserPersonalInfo]);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

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
            </div>
            <p className="info-note">
              <i className="fas fa-info-circle"></i>
              The above information was provided during your initial application. If any details need to be updated, please contact us.
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

        <div className="form-section">
          <h3>Position Details & Work Environment</h3>
          <div className="job-details-card">
            <div className="job-overview">
              <div className="job-header">
                <i className="fas fa-briefcase"></i>
                <h4>Remote Work Structure</h4>
              </div>
              <p className="job-description">
                You'll be joining our fully remote team as a GitMatcher developer, working collaboratively 
                across different time zones while maintaining strong communication and project delivery standards.
              </p>
            </div>

            <div className="work-schedule">
              <div className="schedule-header">
                <i className="fas fa-clock"></i>
                <h4>Working Hours & Schedule</h4>
              </div>
              <div className="schedule-grid">
                <div className="schedule-item">
                  <span className="schedule-label">Time Zone:</span>
                  <span className="schedule-value">US Eastern Standard Time (EST)</span>
                </div>
                <div className="schedule-item">
                  <span className="schedule-label">Core Hours:</span>
                  <span className="schedule-value">9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="schedule-item">
                  <span className="schedule-label">Daily Stand-up:</span>
                  <span className="schedule-value">Morning team calls (9:30 AM EST)</span>
                </div>
                <div className="schedule-item">
                  <span className="schedule-label">Flexibility:</span>
                  <span className="schedule-value">Adjustable based on project needs</span>
                </div>
              </div>
            </div>

            <div className="communication-tools">
              <div className="tools-header">
                <i className="fas fa-comments"></i>
                <h4>Communication & Collaboration</h4>
              </div>
              <div className="tools-grid">
                <div className="tool-item primary">
                  <i className="fab fa-slack"></i>
                  <div>
                    <strong>Slack</strong>
                    <span>Primary communication platform for team chat, updates, and quick discussions</span>
                  </div>
                </div>
                <div className="tool-item">
                  <i className="fas fa-video"></i>
                  <div>
                    <strong>Video Meetings</strong>
                    <span>Daily stand-ups, weekly planning, and project reviews</span>
                  </div>
                </div>
                <div className="tool-item">
                  <i className="fas fa-code-branch"></i>
                  <div>
                    <strong>Git/GitHub</strong>
                    <span>Code collaboration, version control, and project management</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="expectations">
              <div className="expectations-header">
                <i className="fas fa-target"></i>
                <h4>What We Expect</h4>
              </div>
              <ul className="expectations-list">
                <li><i className="fas fa-check-circle"></i> Active participation in daily morning stand-up calls</li>
                <li><i className="fas fa-check-circle"></i> Responsive communication during US business hours</li>
                <li><i className="fas fa-check-circle"></i> Collaborative approach to problem-solving and development</li>
                <li><i className="fas fa-check-circle"></i> Commitment to project deadlines and quality standards</li>
                <li><i className="fas fa-check-circle"></i> Proactive communication about challenges or blockers</li>
              </ul>
            </div>

            <div className="next-steps-info">
              <div className="next-steps-header">
                <i className="fas fa-phone-alt"></i>
                <h4>Post-Onboarding Process</h4>
              </div>
              <div className="next-steps-content">
                <p>
                  <strong>Personalized Discussion:</strong> After completing this onboarding process, 
                  you'll have a detailed call with our team to discuss any questions or concerns you may have.
                </p>
                <div className="flexibility-note">
                  <i className="fas fa-handshake"></i>
                  <div>
                    <strong>Contract Flexibility</strong>
                    <p>
                      Your employment contract can be adjusted based on your preferences and our mutual agreement 
                      during the post-onboarding call. We believe in finding the right fit for both parties.
                    </p>
                  </div>
                </div>
                <div className="contact-info">
                  <p>
                    <i className="fas fa-info-circle"></i>
                    <strong>Questions?</strong> More detailed information about policies, benefits, and specific 
                    role expectations will be provided during your onboarding call.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Compensation Details</h3>
          <div className="compensation-card">
            <div className="salary-details">
              <div className="salary-item">
                <span className="salary-label">Base Bi-weekly Salary:</span>
                <span className="salary-amount">$4,230</span>
              </div>
              <div className="bonus-section">
                <div className="bonus-header">
                  <i className="fas fa-plus-circle"></i>
                  <strong>Additional Benefits</strong>
                </div>
                <div className="bonus-item">
                  <span className="bonus-label">Monthly Performance Bonus:</span>
                  <span className="bonus-amount">Up to $1,650</span>
                </div>
                <div className="bonus-description">
                  <p><strong>Bonus Coverage Includes:</strong></p>
                  <ul>
                    <li><i className="fas fa-wifi"></i> Internet subscription reimbursement</li>
                    <li><i className="fas fa-clock"></i> Extra work hours compensation</li>
                    <li><i className="fas fa-chart-line"></i> Performance-based incentives</li>
                  </ul>
                </div>
              </div>
              <div className="total-compensation">
                <div className="total-item">
                  <span className="total-label">Total Monthly Potential:</span>
                  <span className="total-amount">$8,460 + $1,650 bonus</span>
                </div>
                <div className="annual-note">
                  <small>Annual range: $110,000 - $129,800 (including bonuses)</small>
                </div>
              </div>
            </div>
            
            <div className="salary-acceptance">
              <h4>Salary Acceptance</h4>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="salaryAcceptable"
                    value="true"
                    checked={formData.salaryAcceptable === true}
                    onChange={handleChange}
                  />
                  <span className="radio-text">Yes, I accept this salary</span>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="salaryAcceptable"
                    value="false"
                    checked={formData.salaryAcceptable === false}
                    onChange={handleChange}
                  />
                  <span className="radio-text">No, I would like to negotiate</span>
                </label>
              </div>
              
              {formData.salaryAcceptable === false && (
                <div className="form-group">
                  <label htmlFor="salaryRequest">Your Salary Request</label>
                  <input
                    type="text"
                    id="salaryRequest"
                    name="salaryRequest"
                    placeholder="Please specify your desired salary..."
                    value={formData.salaryRequest}
                    onChange={handleChange}
                  />
                  <small className="form-hint">Please provide your salary expectations for further discussion with us.</small>
                </div>
              )}
            </div>
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
