import React, { useState, useEffect } from 'react';
import DataService from '../services/DataService';

interface InterviewData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  
  // Technical Questions
  gitMacherScaling: string;
  techStack: string;
  problemSolving: string;
  projectManagement: string;
  
  // Multiple Choice Questions
  preferredLanguage: string;
  workStyle: string;
  teamSize: string;
  
  // Video Questions (Google Drive links)
  introVideo: string;
  technicalVideo: string;
  challengeVideo: string;
}

const VirtualInterview: React.FC<{ onComplete: (data: InterviewData, interviewId: string) => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [formData, setFormData] = useState<InterviewData>({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    gitMacherScaling: '',
    techStack: '',
    problemSolving: '',
    projectManagement: '',
    preferredLanguage: '',
    workStyle: '',
    teamSize: '',
    introVideo: '',
    technicalVideo: '',
    challengeVideo: ''
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
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.position.trim()) newErrors.position = 'Position is required';
        if (!formData.experience.trim()) newErrors.experience = 'Experience level is required';
        break;
      
      case 1: // Technical Questions
        if (!formData.gitMacherScaling.trim()) newErrors.gitMacherScaling = 'This answer is required';
        if (!formData.techStack.trim()) newErrors.techStack = 'This answer is required';
        if (!formData.problemSolving.trim()) newErrors.problemSolving = 'This answer is required';
        break;
      
      case 2: // Multiple Choice
        if (!formData.preferredLanguage) newErrors.preferredLanguage = 'Please select an option';
        if (!formData.workStyle) newErrors.workStyle = 'Please select an option';
        if (!formData.teamSize) newErrors.teamSize = 'Please select an option';
        break;
      
      case 3: // Video Questions
        if (!formData.introVideo.trim()) newErrors.introVideo = 'Introduction video link is required';
        if (!formData.technicalVideo.trim()) newErrors.technicalVideo = 'Technical video link is required';
        if (!formData.challengeVideo.trim()) newErrors.challengeVideo = 'Challenge video link is required';
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
        
        // Save to Google Sheets
        const dataService = DataService.getInstance();
        try {
          const success = await dataService.saveInterviewData(formData, interviewId);
          if (success) {
            console.log('✅ Interview data saved to Google Sheets successfully');
          } else {
            console.log('💾 Interview data saved to local backup');
          }
        } catch (error) {
          console.error('❌ Error saving interview data:', error);
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
          <h1><i className="fas fa-code-branch"></i> GitMacher</h1>
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
            <h2>Welcome to GitMacher Technical Interview</h2>
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
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="position">Position Applied For *</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={errors.position ? 'error' : ''}
                  placeholder="e.g., Full Stack Developer, DevOps Engineer"
                />
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
              Please provide detailed answers to the following technical questions about GitMacher.
            </p>

            <div className="question-block">
              <label htmlFor="gitMacherScaling">
                <strong>Question 1:</strong> GitMacher is experiencing rapid growth. Based on your technical expertise, 
                how would you approach scaling our Git repository management platform to handle 10x more users and repositories? 
                Consider performance, reliability, and cost-effectiveness. *
              </label>
              <textarea
                id="gitMacherScaling"
                name="gitMacherScaling"
                value={formData.gitMacherScaling}
                onChange={handleInputChange}
                className={errors.gitMacherScaling ? 'error' : ''}
                rows={6}
                placeholder="Discuss your approach to scaling architecture, database optimization, caching strategies, microservices, etc..."
              />
              {errors.gitMacherScaling && <span className="error-message">{errors.gitMacherScaling}</span>}
            </div>

            <div className="question-block">
              <label htmlFor="techStack">
                <strong>Question 2:</strong> What technology stack would you recommend for GitMacher's next major feature: 
                real-time collaborative code editing? Explain your choice and implementation strategy. *
              </label>
              <textarea
                id="techStack"
                name="techStack"
                value={formData.techStack}
                onChange={handleInputChange}
                className={errors.techStack ? 'error' : ''}
                rows={5}
                placeholder="Discuss WebSocket technologies, CRDT, conflict resolution, frontend/backend technologies..."
              />
              {errors.techStack && <span className="error-message">{errors.techStack}</span>}
            </div>

            <div className="question-block">
              <label htmlFor="problemSolving">
                <strong>Question 3:</strong> Describe a complex technical problem you've solved recently. 
                How would you apply similar problem-solving approaches at GitMacher? *
              </label>
              <textarea
                id="problemSolving"
                name="problemSolving"
                value={formData.problemSolving}
                onChange={handleInputChange}
                className={errors.problemSolving ? 'error' : ''}
                rows={5}
                placeholder="Describe the problem, your approach, implementation, and lessons learned..."
              />
              {errors.problemSolving && <span className="error-message">{errors.problemSolving}</span>}
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
                Please introduce yourself, your background, and why you want to work at GitMacher. (2-3 minutes) *
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
                <strong>Video 2: Technical Expertise</strong><br/>
                Explain a technical project you're proud of. Walk us through your approach, 
                challenges faced, and solutions implemented. (2-3 minutes) *
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

            <div className="question-block">
              <label htmlFor="challengeVideo">
                <strong>Video 3: Problem-Solving Challenge</strong><br/>
                Describe how you would debug a performance issue where GitMacher's repository 
                cloning is taking 10x longer than usual. Walk through your debugging process. (2-3 minutes) *
              </label>
              <input
                type="url"
                id="challengeVideo"
                name="challengeVideo"
                value={formData.challengeVideo}
                onChange={handleInputChange}
                className={errors.challengeVideo ? 'error' : ''}
                placeholder="https://drive.google.com/file/d/..."
              />
              {errors.challengeVideo && <span className="error-message">{errors.challengeVideo}</span>}
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
