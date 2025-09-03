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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateGoogleDriveLink = (url: string): boolean => {
    const driveRegex = /^https:\/\/drive\.google\.com\/(file\/d\/|open\?id=)/;
    return driveRegex.test(url);
  };

  // Get position-specific questions
  const getPositionQuestions = (position: string) => {
    switch (position) {
      case 'Backend Developer':
      case 'Frontend Developer':
      case 'Full Stack Developer':
      case 'AI Integration Specialist':
        return {
          q1: {
            label: "How would you design a system that analyzes developer activity on GitHub and generates insights (e.g., coding style, frequency, language preferences)? Consider scalability, API rate limits, and data processing.",
            placeholder: "Discuss your approach to GitHub API integration, data analysis pipelines, caching strategies, etc..."
          },
          q2: {
            label: "GitMatcher is about matching people, not just code. How would you balance technical scoring with softer metrics like collaboration style when creating developer profiles?",
            placeholder: "Discuss approaches to measure collaboration, code review quality, communication patterns, etc..."
          },
          q3: {
            label: "Our app needs to constantly sync data from GitHub. How would you design an infrastructure that scales with traffic and doesn't break when GitHub rate-limits us?",
            placeholder: "Discuss queue systems, retry mechanisms, caching, monitoring, and rate limit handling..."
          },
          q4: {
            label: "GitMatcher matches developers visually. How would you design a UI that clearly displays compatibility (skills overlap, coding style, activity patterns)?",
            placeholder: "Discuss data visualization, user experience, frameworks, and state management approaches..."
          }
        };

      case 'Social Media Manager':
        return {
          q1: {
            label: "How would you develop a social media strategy to promote GitMatcher to the developer community? Consider platforms, content types, and engagement tactics.",
            placeholder: "Discuss platform selection (Twitter, LinkedIn, GitHub, etc.), content strategy, community building, influencer partnerships..."
          },
          q2: {
            label: "GitMatcher connects developers based on code analysis. How would you explain this technical concept in engaging social media content for different audiences?",
            placeholder: "Discuss content creation for technical vs non-technical audiences, visual storytelling, educational content..."
          },
          q3: {
            label: "How would you measure and improve social media ROI for a B2B developer tool like GitMatcher? What metrics would you track?",
            placeholder: "Discuss KPIs, analytics tools, conversion tracking, A/B testing, community growth metrics..."
          },
          q4: {
            label: "How would you handle crisis communication on social media if GitMatcher faced technical issues or community backlash?",
            placeholder: "Discuss crisis management protocols, transparent communication, community relations, reputation management..."
          }
        };

      case 'UX/UI Designer':
        return {
          q1: {
            label: "How would you design an intuitive interface for developers to browse and discover compatible coding partners based on GitHub data analysis?",
            placeholder: "Discuss user flows, information architecture, visual design principles, developer-focused UX patterns..."
          },
          q2: {
            label: "GitMatcher shows complex matching algorithms to users. How would you visualize compatibility scores, skill overlaps, and collaboration patterns in an easy-to-understand way?",
            placeholder: "Discuss data visualization, progressive disclosure, interactive elements, accessibility considerations..."
          },
          q3: {
            label: "How would you conduct user research with developers to understand their pain points in finding coding collaborators and validate design decisions?",
            placeholder: "Discuss research methodologies, user personas, usability testing, feedback collection, iteration processes..."
          },
          q4: {
            label: "How would you design GitMatcher's mobile experience while maintaining the depth of information needed for developer matching decisions?",
            placeholder: "Discuss responsive design, mobile-first approach, progressive web app considerations, touch interactions..."
          }
        };

      case 'Data Analyst':
        return {
          q1: {
            label: "How would you design analytics systems to track and improve GitMatcher's matching algorithm effectiveness? What key metrics would you monitor?",
            placeholder: "Discuss success metrics, A/B testing frameworks, cohort analysis, machine learning performance indicators..."
          },
          q2: {
            label: "How would you analyze GitHub activity data to identify patterns that predict successful developer collaborations?",
            placeholder: "Discuss data mining techniques, statistical analysis, correlation vs causation, feature engineering..."
          },
          q3: {
            label: "How would you build dashboards and reporting systems for GitMatcher stakeholders to understand user behavior and platform performance?",
            placeholder: "Discuss BI tools, data visualization, automated reporting, stakeholder-specific insights, real-time monitoring..."
          },
          q4: {
            label: "How would you approach analyzing user churn and retention for GitMatcher? What data sources and methodologies would you use?",
            placeholder: "Discuss churn prediction models, retention cohorts, user lifecycle analysis, predictive analytics..."
          }
        };

      case 'Project Manager':
        return {
          q1: {
            label: "How would you manage a cross-functional team developing GitMatcher's matching algorithm while coordinating between developers, designers, and data scientists?",
            placeholder: "Discuss agile methodologies, stakeholder management, cross-team communication, timeline coordination..."
          },
          q2: {
            label: "How would you prioritize feature development for GitMatcher when balancing user requests, technical debt, and business objectives?",
            placeholder: "Discuss prioritization frameworks, stakeholder alignment, roadmap planning, resource allocation..."
          },
          q3: {
            label: "How would you handle project risks related to GitHub API dependencies, data privacy regulations, and scaling challenges?",
            placeholder: "Discuss risk assessment, mitigation strategies, contingency planning, compliance management..."
          },
          q4: {
            label: "How would you measure and report project success for GitMatcher development iterations? What KPIs would you track?",
            placeholder: "Discuss project metrics, team velocity, quality indicators, stakeholder reporting, continuous improvement..."
          }
        };

      default:
        return {
          q1: {
            label: "How would you contribute to GitMatcher's mission of connecting developers through code analysis and matching?",
            placeholder: "Discuss your approach to this role and how you would add value to the team..."
          },
          q2: {
            label: "What unique skills and experience do you bring that would help GitMatcher grow and succeed?",
            placeholder: "Discuss your relevant background, skills, and potential contributions..."
          },
          q3: {
            label: "How do you stay current with trends and technologies in your field that could benefit GitMatcher?",
            placeholder: "Discuss your learning approach, industry awareness, and knowledge application..."
          },
          q4: {
            label: "Describe a challenging project you've worked on and how you overcame obstacles to achieve success.",
            placeholder: "Discuss problem-solving skills, resilience, and professional achievements..."
          }
        };
    }
  };

  // Get position-specific preference questions
  const getPositionPreferences = (position: string) => {
    switch (position) {
      case 'Backend Developer':
      case 'Full Stack Developer':
        return {
          q1: {
            label: "What is your preferred programming language for backend development?",
            options: ['JavaScript/Node.js', 'Python', 'Java', 'Go', 'Rust', 'C#/.NET', 'Other']
          },
          q2: {
            label: "What is your preferred development approach?",
            options: ['Microservices Architecture', 'Monolithic Applications', 'Serverless Functions', 'Hybrid Approach']
          },
          q3: {
            label: "What team size do you work best in?",
            options: ['Solo (1-2 people)', 'Small team (3-5 people)', 'Medium team (6-10 people)', 'Large team (10+ people)']
          }
        };

      case 'Frontend Developer':
        return {
          q1: {
            label: "What is your preferred frontend framework/library?",
            options: ['React', 'Vue.js', 'Angular', 'Svelte', 'Vanilla JavaScript', 'Other']
          },
          q2: {
            label: "What is your preferred styling approach?",
            options: ['CSS-in-JS (styled-components)', 'CSS Modules', 'Tailwind CSS', 'SCSS/SASS', 'Vanilla CSS']
          },
          q3: {
            label: "What team size do you work best in?",
            options: ['Solo (1-2 people)', 'Small team (3-5 people)', 'Medium team (6-10 people)', 'Large team (10+ people)']
          }
        };

      case 'AI Integration Specialist':
        return {
          q1: {
            label: "What is your preferred AI/ML framework?",
            options: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Hugging Face', 'OpenAI API', 'Other']
          },
          q2: {
            label: "What is your preferred data processing approach?",
            options: ['Real-time Processing', 'Batch Processing', 'Stream Processing', 'Hybrid Approach']
          },
          q3: {
            label: "What team size do you work best in?",
            options: ['Solo (1-2 people)', 'Small team (3-5 people)', 'Medium team (6-10 people)', 'Large team (10+ people)']
          }
        };

      case 'Social Media Manager':
        return {
          q1: {
            label: "What is your preferred social media management approach?",
            options: ['Content Creation Focus', 'Community Engagement Focus', 'Analytics & Strategy Focus', 'Balanced Approach']
          },
          q2: {
            label: "What is your preferred content creation style?",
            options: ['Visual/Graphic Heavy', 'Text & Blog Posts', 'Video Content', 'Interactive/Polls', 'Mixed Content']
          },
          q3: {
            label: "What team collaboration style works best for you?",
            options: ['Independent with check-ins', 'Close collaboration', 'Cross-functional teams', 'Campaign-based teams']
          }
        };

      case 'UX/UI Designer':
        return {
          q1: {
            label: "What is your preferred design tool?",
            options: ['Figma', 'Adobe XD', 'Sketch', 'Adobe Creative Suite', 'InVision', 'Other']
          },
          q2: {
            label: "What is your preferred design approach?",
            options: ['User-Centered Design', 'Design Thinking Process', 'Agile Design', 'Lean UX', 'Design Systems First']
          },
          q3: {
            label: "What team collaboration style works best for you?",
            options: ['Embedded in dev teams', 'Separate design team', 'Cross-functional squads', 'Design-led projects']
          }
        };

      case 'Data Analyst':
        return {
          q1: {
            label: "What is your preferred data analysis tool?",
            options: ['Python (Pandas/NumPy)', 'R', 'SQL', 'Excel/Google Sheets', 'Tableau/Power BI', 'Other']
          },
          q2: {
            label: "What is your preferred analysis approach?",
            options: ['Exploratory Data Analysis', 'Statistical Modeling', 'Machine Learning', 'Business Intelligence', 'Predictive Analytics']
          },
          q3: {
            label: "What team collaboration style works best for you?",
            options: ['Independent analysis', 'Embedded with stakeholders', 'Data team collaboration', 'Cross-functional projects']
          }
        };

      case 'Project Manager':
        return {
          q1: {
            label: "What is your preferred project management methodology?",
            options: ['Agile/Scrum', 'Kanban', 'Waterfall', 'Hybrid Approach', 'Lean Project Management']
          },
          q2: {
            label: "What is your preferred team communication style?",
            options: ['Daily standups & regular check-ins', 'Weekly milestone reviews', 'Asynchronous updates', 'Continuous collaboration']
          },
          q3: {
            label: "What team size do you prefer to manage?",
            options: ['Small team (3-5 people)', 'Medium team (6-10 people)', 'Large team (10-15 people)', 'Multiple teams (15+ people)']
          }
        };

      default:
        return {
          q1: {
            label: "What is your preferred work style?",
            options: ['Independent work', 'Collaborative work', 'Mixed approach', 'Team leadership']
          },
          q2: {
            label: "What is your preferred communication style?",
            options: ['Direct communication', 'Detailed documentation', 'Visual presentations', 'Regular meetings']
          },
          q3: {
            label: "What team size do you work best in?",
            options: ['Solo (1-2 people)', 'Small team (3-5 people)', 'Medium team (6-10 people)', 'Large team (10+ people)']
          }
        };
    }
  };

  // Get position-specific video questions
  const getPositionVideoQuestions = (position: string) => {
    switch (position) {
      case 'Backend Developer':
      case 'Full Stack Developer':
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher as a developer. Explain your experience with backend systems and API development. (2-3 minutes)",
          technical: "If you had to build a 'developer profile card' with dynamic data (commits, repos, skills), what framework and state management would you use? Walk through your technical approach including database design, API architecture, and caching strategies. (2-3 minutes)"
        };

      case 'Frontend Developer':
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher as a frontend developer. Explain your experience with user interfaces and responsive design. (2-3 minutes)",
          technical: "If you had to build a 'developer matching interface' that shows compatibility scores and skill overlaps, how would you design the UI/UX? Walk through your component architecture, state management, and data visualization approach. (2-3 minutes)"
        };

      case 'AI Integration Specialist':
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher as an AI specialist. Explain your experience with machine learning and data analysis. (2-3 minutes)",
          technical: "If you had to build an AI system that analyzes GitHub activity to predict developer compatibility, what machine learning approach would you use? Walk through your data pipeline, model selection, and integration strategy. (2-3 minutes)"
        };

      case 'Social Media Manager':
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher as a social media manager. Explain your experience with community building and content creation. (2-3 minutes)",
          technical: "If you had to launch a social media campaign to promote GitMatcher to the developer community, what would be your strategy? Walk through your content plan, platform selection, influencer outreach, and success metrics. (2-3 minutes)"
        };

      case 'UX/UI Designer':
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher as a UX/UI designer. Explain your experience with user research and design systems. (2-3 minutes)",
          technical: "If you had to design the user flow for developers finding compatible collaborators on GitMatcher, how would you approach it? Walk through your research process, wireframing, user testing strategy, and final design decisions. (2-3 minutes)"
        };

      case 'Data Analyst':
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher as a data analyst. Explain your experience with data visualization and business intelligence. (2-3 minutes)",
          technical: "If you had to analyze GitMatcher's user behavior to improve matching accuracy, what metrics would you track and what analysis approach would you use? Walk through your data collection, analysis methodology, and reporting strategy. (2-3 minutes)"
        };

      case 'Project Manager':
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher as a project manager. Explain your experience with cross-functional teams and agile methodologies. (2-3 minutes)",
          technical: "If you had to manage the development of GitMatcher's new matching algorithm feature, how would you coordinate between developers, designers, and data scientists? Walk through your project planning, risk management, and stakeholder communication approach. (2-3 minutes)"
        };

      default:
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher. Explain your relevant experience and what excites you about this opportunity. (2-3 minutes)",
          technical: "If you had to contribute to GitMatcher's success in your role, what would be your approach? Walk through your strategy, key initiatives, and how you would measure success. (2-3 minutes)"
        };
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Personal Information
        if (!formData.fullName.trim()) {
          newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
          newErrors.fullName = 'Please enter a valid full name';
        }

        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email.trim())) {
          newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.position.trim()) newErrors.position = 'Position is required';
        if (!formData.experience.trim()) newErrors.experience = 'Experience level is required';
        break;
      
      case 1: // Technical Questions
        if (!formData.gitMatcherScaling.trim()) {
          newErrors.gitMatcherScaling = 'This answer is required';
        } else if (formData.gitMatcherScaling.trim().length < 50) {
          newErrors.gitMatcherScaling = 'Please provide a more detailed answer (minimum 50 characters)';
        }

        if (!formData.collaborationBalance.trim()) {
          newErrors.collaborationBalance = 'This answer is required';
        } else if (formData.collaborationBalance.trim().length < 50) {
          newErrors.collaborationBalance = 'Please provide a more detailed answer (minimum 50 characters)';
        }

        if (!formData.infrastructureDesign.trim()) {
          newErrors.infrastructureDesign = 'This answer is required';
        } else if (formData.infrastructureDesign.trim().length < 50) {
          newErrors.infrastructureDesign = 'Please provide a more detailed answer (minimum 50 characters)';
        }

        if (!formData.uiDesign.trim()) {
          newErrors.uiDesign = 'This answer is required';
        } else if (formData.uiDesign.trim().length < 50) {
          newErrors.uiDesign = 'Please provide a more detailed answer (minimum 50 characters)';
        }
        break;
      
      case 2: // Multiple Choice
        if (!formData.preferredLanguage) newErrors.preferredLanguage = 'Please select an option';
        if (!formData.workStyle) newErrors.workStyle = 'Please select an option';
        if (!formData.teamSize) newErrors.teamSize = 'Please select an option';
        break;
      
      case 3: // Video Questions
        if (!formData.introVideo.trim()) {
          newErrors.introVideo = 'Introduction video link is required';
        } else if (!validateGoogleDriveLink(formData.introVideo.trim())) {
          newErrors.introVideo = 'Please provide a valid Google Drive link (e.g., https://drive.google.com/file/d/...)';
        }

        if (!formData.technicalVideo.trim()) {
          newErrors.technicalVideo = 'Technical video link is required';
        } else if (!validateGoogleDriveLink(formData.technicalVideo.trim())) {
          newErrors.technicalVideo = 'Please provide a valid Google Drive link (e.g., https://drive.google.com/file/d/...)';
        }

        // Check if both video links are the same
        if (formData.introVideo.trim() && formData.technicalVideo.trim() && 
            formData.introVideo.trim() === formData.technicalVideo.trim()) {
          newErrors.introVideo = 'Introduction and technical videos must be different';
          newErrors.technicalVideo = 'Introduction and technical videos must be different';
        }
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
                  <option value="Social Media Manager">Social Media Manager</option>
                  <option value="UX/UI Designer">UX/UI Designer</option>
                  <option value="Data Analyst">Data Analyst</option>
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
              Please provide detailed answers to the following questions specific to your selected position.
              {!formData.position && (
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                  <br />Please select a position in the previous step to see relevant questions.
                </span>
              )}
            </p>

            {formData.position && (() => {
              const questions = getPositionQuestions(formData.position);
              return (
                <>
                  <div className="question-block">
                    <label htmlFor="gitMatcherScaling">
                      <strong>Question 1:</strong> {questions.q1.label} *
                    </label>
                    <textarea
                      id="gitMatcherScaling"
                      name="gitMatcherScaling"
                      value={formData.gitMatcherScaling}
                      onChange={handleInputChange}
                      className={errors.gitMatcherScaling ? 'error' : ''}
                      rows={6}
                      placeholder={questions.q1.placeholder}
                    />
                    {errors.gitMatcherScaling && <span className="error-message">{errors.gitMatcherScaling}</span>}
                  </div>

                  <div className="question-block">
                    <label htmlFor="collaborationBalance">
                      <strong>Question 2:</strong> {questions.q2.label} *
                    </label>
                    <textarea
                      id="collaborationBalance"
                      name="collaborationBalance"
                      value={formData.collaborationBalance}
                      onChange={handleInputChange}
                      className={errors.collaborationBalance ? 'error' : ''}
                      rows={5}
                      placeholder={questions.q2.placeholder}
                    />
                    {errors.collaborationBalance && <span className="error-message">{errors.collaborationBalance}</span>}
                  </div>

                  <div className="question-block">
                    <label htmlFor="infrastructureDesign">
                      <strong>Question 3:</strong> {questions.q3.label} *
                    </label>
                    <textarea
                      id="infrastructureDesign"
                      name="infrastructureDesign"
                      value={formData.infrastructureDesign}
                      onChange={handleInputChange}
                      className={errors.infrastructureDesign ? 'error' : ''}
                      rows={5}
                      placeholder={questions.q3.placeholder}
                    />
                    {errors.infrastructureDesign && <span className="error-message">{errors.infrastructureDesign}</span>}
                  </div>

                  <div className="question-block">
                    <label htmlFor="uiDesign">
                      <strong>Question 4:</strong> {questions.q4.label} *
                    </label>
                    <textarea
                      id="uiDesign"
                      name="uiDesign"
                      value={formData.uiDesign}
                      onChange={handleInputChange}
                      className={errors.uiDesign ? 'error' : ''}
                      rows={5}
                      placeholder={questions.q4.placeholder}
                    />
                    {errors.uiDesign && <span className="error-message">{errors.uiDesign}</span>}
                  </div>
                </>
              );
            })()}

            {!formData.position && (
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                background: '#f9fafb', 
                border: '2px dashed #d1d5db', 
                borderRadius: '0.5rem',
                margin: '1rem 0'
              }}>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                  <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                  Please go back and select a position to see the relevant technical questions.
                </p>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="interview-step">
            <h2>Work Style & Preferences</h2>
            <p className="step-description">
              Help us understand your work preferences and choices specific to your role.
              {!formData.position && (
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                  <br />Please select a position in step 1 to see relevant preference questions.
                </span>
              )}
            </p>

            {formData.position && (() => {
              const preferences = getPositionPreferences(formData.position);
              return (
                <>
                  <div className="question-block">
                    <label><strong>{preferences.q1.label}</strong> *</label>
                    <div className="radio-group">
                      {preferences.q1.options.map(option => (
                        <label key={option} className="radio-label">
                          <input
                            type="radio"
                            name="preferredLanguage"
                            value={option}
                            checked={formData.preferredLanguage === option}
                            onChange={handleInputChange}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    {errors.preferredLanguage && <span className="error-message">{errors.preferredLanguage}</span>}
                  </div>

                  <div className="question-block">
                    <label><strong>{preferences.q2.label}</strong> *</label>
                    <div className="radio-group">
                      {preferences.q2.options.map(option => (
                        <label key={option} className="radio-label">
                          <input
                            type="radio"
                            name="workStyle"
                            value={option}
                            checked={formData.workStyle === option}
                            onChange={handleInputChange}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    {errors.workStyle && <span className="error-message">{errors.workStyle}</span>}
                  </div>

                  <div className="question-block">
                    <label><strong>{preferences.q3.label}</strong> *</label>
                    <div className="radio-group">
                      {preferences.q3.options.map(option => (
                        <label key={option} className="radio-label">
                          <input
                            type="radio"
                            name="teamSize"
                            value={option}
                            checked={formData.teamSize === option}
                            onChange={handleInputChange}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    {errors.teamSize && <span className="error-message">{errors.teamSize}</span>}
                  </div>
                </>
              );
            })()}

            {!formData.position && (
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                background: '#f9fafb', 
                border: '2px dashed #d1d5db', 
                borderRadius: '0.5rem',
                margin: '1rem 0'
              }}>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                  <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                  Please go back and select a position to see the relevant preference questions.
                </p>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="interview-step">
            <h2>Video Responses</h2>
            <p className="step-description">
              Please record short videos answering the questions below specific to your selected position. Upload to Google Drive and share the links.
              {!formData.position && (
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                  <br />Please select a position in step 1 to see relevant video questions.
                </span>
              )}
            </p>

            <div className="video-instructions">
              <div className="instruction-box">
                <h4><i className="fas fa-video"></i> Video Recording Instructions</h4>
                <ul>
                  <li>Record each video separately (2-3 minutes each)</li>
                  <li>Ensure good lighting and clear audio</li>
                  <li>Upload to Google Drive and make it viewable by anyone with the link</li>
                  <li>Paste the Google Drive share link in the corresponding field</li>
                  <li><strong>Important:</strong> Each video must have a unique Google Drive link</li>
                </ul>
                <div className="example-link">
                  <strong>Example valid link:</strong> https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view
                </div>
              </div>
            </div>

            {formData.position && (() => {
              const videoQuestions = getPositionVideoQuestions(formData.position);
              return (
                <>
                  <div className="question-block">
                    <label htmlFor="introVideo">
                      <strong>Video 1: Introduction</strong><br/>
                      {videoQuestions.intro} *
                    </label>
                    <div className="input-with-validation">
                      <input
                        type="url"
                        id="introVideo"
                        name="introVideo"
                        value={formData.introVideo}
                        onChange={handleInputChange}
                        className={errors.introVideo ? 'error' : (formData.introVideo && validateGoogleDriveLink(formData.introVideo) ? 'valid' : '')}
                        placeholder="https://drive.google.com/file/d/..."
                      />
                      {formData.introVideo && validateGoogleDriveLink(formData.introVideo) && !errors.introVideo && (
                        <span className="validation-icon valid"><i className="fas fa-check-circle"></i></span>
                      )}
                      {formData.introVideo && !validateGoogleDriveLink(formData.introVideo) && (
                        <span className="validation-icon invalid"><i className="fas fa-times-circle"></i></span>
                      )}
                    </div>
                    {errors.introVideo && <span className="error-message">{errors.introVideo}</span>}
                  </div>

                  <div className="question-block">
                    <label htmlFor="technicalVideo">
                      <strong>Video 2: Role-Specific Challenge</strong><br/>
                      {videoQuestions.technical} *
                    </label>
                    <div className="input-with-validation">
                      <input
                        type="url"
                        id="technicalVideo"
                        name="technicalVideo"
                        value={formData.technicalVideo}
                        onChange={handleInputChange}
                        className={errors.technicalVideo ? 'error' : (formData.technicalVideo && validateGoogleDriveLink(formData.technicalVideo) ? 'valid' : '')}
                        placeholder="https://drive.google.com/file/d/..."
                      />
                      {formData.technicalVideo && validateGoogleDriveLink(formData.technicalVideo) && !errors.technicalVideo && (
                        <span className="validation-icon valid"><i className="fas fa-check-circle"></i></span>
                      )}
                      {formData.technicalVideo && !validateGoogleDriveLink(formData.technicalVideo) && (
                        <span className="validation-icon invalid"><i className="fas fa-times-circle"></i></span>
                      )}
                    </div>
                    {errors.technicalVideo && <span className="error-message">{errors.technicalVideo}</span>}
                  </div>
                </>
              );
            })()}

            {!formData.position && (
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                background: '#f9fafb', 
                border: '2px dashed #d1d5db', 
                borderRadius: '0.5rem',
                margin: '1rem 0'
              }}>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                  <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                  Please go back and select a position to see the relevant video questions.
                </p>
              </div>
            )}
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
