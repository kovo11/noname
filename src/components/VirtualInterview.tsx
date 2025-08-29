import React, { useState, useEffect } from 'react';
import DataService from '../services/DataService';

interface InterviewData {
  // Personal Information
  fullName: string;
  email: string;
  position: string;
  experience: string;
  
  // Technical Questions
  gitMatcherScaling: string;
  collaborationBalance: string;
  infrastructureDesign: string;
  uiDesign: string;
  
  // Multiple Choice Questions
  preferredLanguage: string;
  workStyle: string;
  teamSize: string;
  
  // Video Questions (Google Drive links)
  introVideo: string;
  technicalVideo: string;
}

const VirtualInterview: React.FC<{ onComplete: (data: InterviewData, interviewId: string) => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [formData, setFormData] = useState<InterviewData>({
    fullName: '',
    email: '',
    position: '',
    experience: '',
    gitMatcherScaling: '',
    collaborationBalance: '',
    infrastructureDesign: '',
    uiDesign: '',
    preferredLanguage: '',
    workStyle: '',
    teamSize: '',
    introVideo: '',
    technicalVideo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Personal Information
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.position.trim()) newErrors.position = 'Position is required';
        if (!formData.experience.trim()) newErrors.experience = 'Experience level is required';
        break;
      
      case 1: // Technical Questions
        if (!formData.gitMatcherScaling.trim()) newErrors.gitMatcherScaling = 'This answer is required';
        if (!formData.collaborationBalance.trim()) newErrors.collaborationBalance = 'This answer is required';
        if (!formData.infrastructureDesign.trim()) newErrors.infrastructureDesign = 'This answer is required';
        if (!formData.uiDesign.trim()) newErrors.uiDesign = 'This answer is required';
        break;
      
      case 2: // Multiple Choice
        if (!formData.preferredLanguage) newErrors.preferredLanguage = 'Please select an option';
        if (!formData.workStyle) newErrors.workStyle = 'Please select an option';
        if (!formData.teamSize) newErrors.teamSize = 'Please select an option';
        break;
      
      case 3: // Video Questions
        if (!formData.introVideo.trim()) newErrors.introVideo = 'Introduction video link is required';
        if (!formData.technicalVideo.trim()) newErrors.technicalVideo = 'Technical video link is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        // Generate unique interview ID
        const interviewId = `GIT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        console.log('🎯 INTERVIEW SUBMISSION STARTING...');
        console.log('📋 Interview ID:', interviewId);
        console.log('📋 Form Data:', formData);
        
        // Save to Google Sheets
        const dataService = DataService.getInstance();
        try {
          console.log('💾 Attempting to save to Google Sheets...');
          const success = await dataService.saveInterviewData(formData, interviewId);
          if (success) {
            console.log('✅ SUCCESS: Interview data saved to Google Sheets!');
          } else {
            console.log('⚠️ FALLBACK: Interview data saved to local backup');
          }
        } catch (error) {
          console.error('❌ ERROR saving interview data:', error);
        }
        
        // Continue to success page
        onComplete(formData, interviewId);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepTitles = [
    'Personal Information',
    'Technical Assessment',
    'Work Preferences',
    'Video Responses'
  ];

  return (
    <div className="virtual-interview">
      <div className="interview-header">
        <div className="company-branding">
          <h1><i className="fas fa-code-branch"></i> GitMatcher</h1>
          <p>Virtual Technical Interview</p>
        </div>
        
        <div className="timer-display">
          <i className="fas fa-clock"></i>
          <span className="timer">{formatTime(timeLeft)}</span>
          <small>Time Remaining</small>
        </div>
      </div>

      <div className="interview-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
          ></div>
        </div>
        <p>Step {currentStep + 1} of 4: {stepTitles[currentStep]}</p>
      </div>

      <div className="interview-content">
        {currentStep === 0 && (
          <div className="interview-step">
            <h2>Welcome to GitMatcher Technical Interview</h2>
            <p className="step-description">
              Please provide your basic information to begin the technical assessment.
            </p>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : ''}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="your.email@example.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="position">Position Applied For *</label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={errors.position ? 'error' : ''}
                >
                  <option value="">Select a position</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="AI Integration Specialist">AI Integration Specialist</option>
                  <option value="Project Manager">Project Manager</option>
                </select>
                {errors.position && <span className="error-message">{errors.position}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="experience">Years of Experience *</label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={errors.experience ? 'error' : ''}
                >
                  <option value="">Select experience level</option>
                  <option value="0-1">0-1 years (Entry Level)</option>
                  <option value="2-3">2-3 years (Junior)</option>
                  <option value="4-6">4-6 years (Mid-Level)</option>
                  <option value="7-10">7-10 years (Senior)</option>
                  <option value="10+">10+ years (Expert/Lead)</option>
                </select>
                {errors.experience && <span className="error-message">{errors.experience}</span>}
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="interview-step">
            <h2>Technical Assessment</h2>
            <p className="step-description">
              Please provide detailed answers to the following technical questions about GitMatcher.
            </p>

            <div className="question-block">
              <label htmlFor="gitMatcherScaling">
                <strong>Question 1:</strong> How would you design a system that analyzes developer activity on GitHub and generates insights (e.g., coding style, frequency, language preferences)? Consider scalability, API rate limits, and data processing. *
              </label>
              <textarea
                id="gitMatcherScaling"
                name="gitMatcherScaling"
                value={formData.gitMatcherScaling}
                onChange={handleInputChange}
                className={errors.gitMatcherScaling ? 'error' : ''}
                rows={6}
                placeholder="Discuss your approach to GitHub API integration, data analysis pipelines, caching strategies, etc..."
              />
              {errors.gitMatcherScaling && <span className="error-message">{errors.gitMatcherScaling}</span>}
            </div>

            <div className="question-block">
              <label htmlFor="collaborationBalance">
                <strong>Question 2:</strong> GitMatcher is about matching people, not just code. How would you balance technical scoring with softer metrics like collaboration style when creating developer profiles? *
              </label>
              <textarea
                id="collaborationBalance"
                name="collaborationBalance"
                value={formData.collaborationBalance}
                onChange={handleInputChange}
                className={errors.collaborationBalance ? 'error' : ''}
                rows={5}
                placeholder="Discuss approaches to measure collaboration, code review quality, communication patterns, etc..."
              />
              {errors.collaborationBalance && <span className="error-message">{errors.collaborationBalance}</span>}
            </div>

            <div className="question-block">
              <label htmlFor="infrastructureDesign">
                <strong>Question 3:</strong> Our app needs to constantly sync data from GitHub. How would you design an infrastructure that scales with traffic and doesn't break when GitHub rate-limits us? *
              </label>
              <textarea
                id="infrastructureDesign"
                name="infrastructureDesign"
                value={formData.infrastructureDesign}
                onChange={handleInputChange}
                className={errors.infrastructureDesign ? 'error' : ''}
                rows={5}
                placeholder="Discuss queue systems, retry mechanisms, caching, monitoring, and rate limit handling..."
              />
              {errors.infrastructureDesign && <span className="error-message">{errors.infrastructureDesign}</span>}
            </div>

            <div className="question-block">
              <label htmlFor="uiDesign">
                <strong>Question 4:</strong> GitMatcher matches developers visually. How would you design a UI that clearly displays compatibility (skills overlap, coding style, activity patterns)? *
              </label>
              <textarea
                id="uiDesign"
                name="uiDesign"
                value={formData.uiDesign}
                onChange={handleInputChange}
                className={errors.uiDesign ? 'error' : ''}
                rows={5}
                placeholder="Discuss data visualization, user experience, frameworks, and state management approaches..."
              />
              {errors.uiDesign && <span className="error-message">{errors.uiDesign}</span>}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="interview-step">
            <h2>Work Style & Preferences</h2>
            <p className="step-description">
              Help us understand your work preferences and technical choices.
            </p>

            <div className="question-block">
              <label><strong>What is your preferred programming language for backend development?</strong> *</label>
              <div className="radio-group">
                {['JavaScript/Node.js', 'Python', 'Java', 'Go', 'Rust', 'C#/.NET', 'Other'].map(lang => (
                  <label key={lang} className="radio-label">
                    <input
                      type="radio"
                      name="preferredLanguage"
                      value={lang}
                      checked={formData.preferredLanguage === lang}
                      onChange={handleInputChange}
                    />
                    {lang}
                  </label>
                ))}
              </div>
              {errors.preferredLanguage && <span className="error-message">{errors.preferredLanguage}</span>}
            </div>

            <div className="question-block">
              <label><strong>How do you prefer to work on complex projects?</strong> *</label>
              <div className="radio-group">
                {[
                  'Break down into small tasks and iterate quickly',
                  'Plan extensively before coding',
                  'Prototype first, then refine',
                  'Collaborate heavily with team members',
                  'Work independently with periodic check-ins'
                ].map(style => (
                  <label key={style} className="radio-label">
                    <input
                      type="radio"
                      name="workStyle"
                      value={style}
                      checked={formData.workStyle === style}
                      onChange={handleInputChange}
                    />
                    {style}
                  </label>
                ))}
              </div>
              {errors.workStyle && <span className="error-message">{errors.workStyle}</span>}
            </div>

            <div className="question-block">
              <label><strong>What team size do you work best in?</strong> *</label>
              <div className="radio-group">
                {[
                  'Solo (1 person)',
                  'Small team (2-4 people)',
                  'Medium team (5-8 people)', 
                  'Large team (9+ people)',
                  'I adapt well to any team size'
                ].map(size => (
                  <label key={size} className="radio-label">
                    <input
                      type="radio"
                      name="teamSize"
                      value={size}
                      checked={formData.teamSize === size}
                      onChange={handleInputChange}
                    />
                    {size}
                  </label>
                ))}
              </div>
              {errors.teamSize && <span className="error-message">{errors.teamSize}</span>}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="interview-step">
            <h2>Video Responses</h2>
            <p className="step-description">
              Please record short videos answering the questions below. Upload to Google Drive and share the links.
            </p>

            <div className="video-instructions">
              <div className="instruction-box">
                <h4><i className="fas fa-video"></i> Video Recording Instructions</h4>
                <ul>
                  <li>Record each video separately (2-3 minutes each)</li>
                  <li>Ensure good lighting and clear audio</li>
                  <li>Upload to Google Drive and make it viewable by anyone with the link</li>
                  <li>Paste the Google Drive share link in the corresponding field</li>
                </ul>
              </div>
            </div>

            <div className="question-block">
              <label htmlFor="introVideo">
                <strong>Video 1: Introduction</strong><br/>
                Please introduce yourself, your background, and why you want to work at GitMatcher. Explain your experience with developer tools and team collaboration. (2-3 minutes) *
              </label>
              <input
                type="url"
                id="introVideo"
                name="introVideo"
                value={formData.introVideo}
                onChange={handleInputChange}
                className={errors.introVideo ? 'error' : ''}
                placeholder="https://drive.google.com/file/d/..."
              />
              {errors.introVideo && <span className="error-message">{errors.introVideo}</span>}
            </div>

            <div className="question-block">
              <label htmlFor="technicalVideo">
                <strong>Video 2: Technical Design</strong><br/>
                If you had to build a "developer profile card" with dynamic data (commits, repos, skills), what framework and state management would you use? Walk through your technical approach. (2-3 minutes) *
              </label>
              <input
                type="url"
                id="technicalVideo"
                name="technicalVideo"
                value={formData.technicalVideo}
                onChange={handleInputChange}
                className={errors.technicalVideo ? 'error' : ''}
                placeholder="https://drive.google.com/file/d/..."
              />
              {errors.technicalVideo && <span className="error-message">{errors.technicalVideo}</span>}
            </div>
          </div>
        )}
      </div>

      <div className="interview-actions">
        {currentStep > 0 && (
          <button type="button" className="btn btn-secondary" onClick={prevStep}>
            <i className="fas fa-arrow-left"></i>
            Previous
          </button>
        )}
        
        <button type="button" className="btn btn-primary" onClick={nextStep}>
          {currentStep < 3 ? (
            <>
              Next
              <i className="fas fa-arrow-right"></i>
            </>
          ) : (
            <>
              Submit Interview
              <i className="fas fa-check"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VirtualInterview;
