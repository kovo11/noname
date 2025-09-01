import React, { useState, useEffect } from 'react';
import { 
  Header, 
  ApplicationForm, 
  IdentityForm, 
  LegalForm, 
  SuccessPage, 
  LoadingOverlay,
  Login,
  type CandidateData,
  type DocumentInfo
} from './components';
import VirtualInterview from './components/VirtualInterview';
import InterviewSuccess from './components/InterviewSuccess';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DataService from './services/DataService';
import InterviewStateService from './services/InterviewStateService';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated, currentUser, login, logout, saveUserData, loadUserData, isUserCompleted, markUserAsCompleted } = useAuth();
  const [appState, setAppState] = useState<'landing' | 'interview' | 'interview-success' | 'login' | 'onboarding'>('landing');
  const [interviewData, setInterviewData] = useState<any>(null);
  const [interviewId, setInterviewId] = useState<string>('');
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [candidateData, setCandidateData] = useState<CandidateData>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, DocumentInfo>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Enhanced logout function that redirects to landing page
  const handleLogout = () => {
    logout();
    setAppState('landing');
    setCurrentPhase(1);
    setCandidateData({});
    setUploadedFiles({});
    setInterviewData(null);
    setInterviewId('');
  };

    // Initialize data service and retry failed syncs
  useEffect(() => {
    const dataService = DataService.getInstance();
    dataService.retryFailedSyncs().catch(error => {
      console.warn('Failed to retry sync on startup:', error);
    });
  }, []);

  // Load user data on authentication
  useEffect(() => {
    console.log(`🔄 useEffect triggered - isAuthenticated: ${isAuthenticated}, currentUser: ${currentUser}`);
    
    if (isAuthenticated && currentUser) {
      console.log(`👤 Processing authentication for user: ${currentUser}`);
      
      // Check if user has completed the onboarding process
      const userCompleted = isUserCompleted();
      console.log(`🎯 User completion check result: ${userCompleted}`);
      
      if (userCompleted) {
        console.log(`🎉 User ${currentUser} has completed onboarding - showing success page`);
        setCurrentPhase(4); // Go directly to success page
        
        // Load any available data for the success page
        const savedData = loadUserData();
        if (savedData) {
          setCandidateData(savedData);
          console.log(`📥 Loaded saved data for completed user`);
        } else {
          // Create minimal data for success page display
          setCandidateData({
            candidateId: `ONBD-${currentUser}`,
            completionDate: new Date().toISOString(),
            application: {
              firstName: 'User',
              lastName: 'Completed',
              email: 'completed@onboarding.com',
              address: 'Onboarding Complete',
              salaryAcceptable: true,
              salaryRequest: ''
            }
          });
          console.log(`📝 Created minimal data for completed user display`);
        }
        return;
      }
      
      console.log(`📋 User ${currentUser} has not completed onboarding - loading normal flow`);
      
      // For non-completed users, load normal data and set phase
      const savedData = loadUserData();
      if (savedData) {
        setCandidateData(savedData);
        // Restore the phase based on saved data
        if (savedData.legal && savedData.legal.transactionId) {
          setCurrentPhase(4); // Success - legal completed
        } else if (savedData.identity) {
          setCurrentPhase(3); // Go to legal phase
        } else if (savedData.application) {
          setCurrentPhase(2); // Go to identity phase
        }
        
        // Restore uploaded files
        if (savedData.identity?.documents) {
          setUploadedFiles(prev => ({ ...prev, ...savedData.identity!.documents }));
        }
        if (savedData.legal?.documents) {
          setUploadedFiles(prev => ({ ...prev, ...savedData.legal!.documents }));
        }
      }
    }
  }, [isAuthenticated, currentUser, isUserCompleted, loadUserData]);

  // Save data whenever candidateData changes
  useEffect(() => {
    if (isAuthenticated && Object.keys(candidateData).length > 0) {
      saveUserData(candidateData);
    }
  }, [candidateData, isAuthenticated, saveUserData]);

  // Handle retry interview
  const handleRetryInterview = () => {
    const interviewState = InterviewStateService.getInstance();
    
    if (interviewState.canRetry()) {
      // Reset interview data but keep onboarding
      setInterviewData(null);
      setInterviewId('');
      
      // Generate new interview ID for retry
      const newInterviewId = `INT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Save retry attempt
      interviewState.saveRetryAttempt(newInterviewId);
      
      // Go back to interview
      setAppState('interview');
    }
  };

  // Handle interview completion
  const handleInterviewComplete = (data: any, id: string) => {
    setInterviewData(data);
    setInterviewId(id);
    
    // Save interview completion state
    InterviewStateService.getInstance().saveInterviewCompletion(id, data.candidateInfo?.name || 'Anonymous');
    
    // Save interview data to cloud (Google Sheets) with enhanced debugging
    DataService.getInstance().saveInterviewData(data, id);
    
    setAppState('interview-success');
  };

  // Save interview data to text file in codebase
  const saveInterviewToFile = (data: any, id: string) => {
    const timestamp = new Date().toLocaleString();
    const textContent = `
===============================================
GITMATCHER VIRTUAL INTERVIEW SUBMISSION
===============================================
Interview ID: ${id}
Submission Date: ${timestamp}
===============================================

CANDIDATE INFORMATION:
• Full Name: ${data.fullName}
• Email: ${data.email}
• Position Applied: ${data.position}
• Experience Level: ${data.experience}

===============================================
TECHNICAL ASSESSMENT RESPONSES:
===============================================

QUESTION 1 - GitMatcher Scaling Strategy:
${data.gitMatcherScaling}

QUESTION 2 - Technology Stack Recommendation:
${data.techStack}

QUESTION 3 - Problem-Solving Experience:
${data.problemSolving}

QUESTION 4 - Project Management Experience:
${data.projectManagement || 'No response provided'}

===============================================
WORK PREFERENCES & MULTIPLE CHOICE:
===============================================

Preferred Programming Language: ${data.preferredLanguage}
Work Style: ${data.workStyle}
Preferred Team Size: ${data.teamSize}

===============================================
VIDEO RESPONSES (GOOGLE DRIVE LINKS):
===============================================

Introduction Video: ${data.introVideo}
Technical Expertise Video: ${data.technicalVideo}
Problem-Solving Challenge Video: ${data.challengeVideo}

===============================================
INTERVIEW METADATA:
===============================================
Interview ID: ${id}
Candidate Name: ${data.fullName}
Email Contact: ${data.email}
Submission Timestamp: ${timestamp}

Status: AWAITING REVIEW
Next Action: Technical team review and assessment

===============================================
GitMatcher US Department - Technical Interview System
===============================================
`;

    // Note: Data is now automatically saved to Google Sheets
    console.log(`✅ Interview data processed for: ${data.fullName}`);
  };

  const handleContinueToOnboarding = () => {
    setAppState('onboarding');
  };

  // Landing page handlers
  const handleStartInterview = () => {
    setAppState('interview');
  };

  const handleGoToOnboarding = () => {
    setAppState('login');
  };

  const goToPhase = (phase: number) => {
    setCurrentPhase(phase);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplicationSubmit = (data: any) => {
    setIsLoading(true);
    const candidateId = generateCandidateId();
    
    setCandidateData({
      ...candidateData,
      application: data,
      submissionDate: new Date().toISOString(),
      candidateId
    });

    setTimeout(() => {
      setIsLoading(false);
      goToPhase(2);
    }, 1500);
  };

  const handleIdentitySubmit = (data: any) => {
    setIsLoading(true);
    
    setCandidateData({
      ...candidateData,
      identity: {
        ...data,
        documents: processUploadedFiles(['passport', 'photo'])
      }
    });

    setTimeout(() => {
      setIsLoading(false);
      goToPhase(3);
    }, 1500);
  };

  const handleLegalSubmit = async (data: any) => {
    setIsLoading(true);
    
    const completedCandidateData = {
      ...candidateData,
      legal: {
        ...data,
        documents: processUploadedFiles(['contract', 'nda'])
      },
      completionDate: new Date().toISOString()
    };
    
    setCandidateData(completedCandidateData);

    // Prepare onboarding data for Google Sheets
    const onboardingData = {
      username: currentUser || 'unknown',
      firstName: completedCandidateData.application?.firstName || '',
      lastName: completedCandidateData.application?.lastName || '',
      email: completedCandidateData.application?.email || '',
      address: completedCandidateData.application?.address || '',
      salaryAcceptable: completedCandidateData.application?.salaryAcceptable || false,
      salaryRequest: completedCandidateData.application?.salaryRequest || '',
      emergencyName: completedCandidateData.identity?.emergencyName || '',
      emergencyRelation: completedCandidateData.identity?.emergencyRelation || '',
      emergencyEmail: completedCandidateData.identity?.emergencyEmail || '',
      consentCheck: completedCandidateData.legal?.consentCheck || false,
      transactionId: completedCandidateData.candidateId || generateCandidateId()
    };

    // Save to Google Sheets
    const dataService = DataService.getInstance();
    try {
      const success = await dataService.saveOnboardingData(onboardingData);
      if (success) {
        console.log('✅ Onboarding data saved to Google Sheets successfully');
      } else {
        console.log('💾 Onboarding data saved to local backup');
      }
    } catch (error) {
      console.error('❌ Error saving onboarding data:', error);
    }

    // Mark user as completed in the system
    markUserAsCompleted();

    setTimeout(() => {
      setIsLoading(false);
      setCurrentPhase(4); // Success page
    }, 2000);
  };

  const generateCandidateId = (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `CAND-${timestamp}-${random}`.toUpperCase();
  };

    const processUploadedFiles = (fileTypes: string[]) => {
    const result: Record<string, DocumentInfo> = {};
    fileTypes.forEach(fileType => {
      if (uploadedFiles[fileType]) {
        result[fileType] = uploadedFiles[fileType];
      }
    });
    return result;
  };

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 1:
        return (
          <ApplicationForm
            onSubmit={handleApplicationSubmit}
            initialData={candidateData.application}
          />
        );
      case 2:
        return (
          <IdentityForm
            onSubmit={handleIdentitySubmit}
            onBack={() => goToPhase(1)}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            initialData={candidateData.identity}
          />
        );
      case 3:
        return (
          <LegalForm
            onSubmit={handleLegalSubmit}
            onBack={() => goToPhase(2)}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            initialData={candidateData.legal}
          />
        );
      case 4:
        return (
          <SuccessPage
            candidateData={candidateData}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  // Show landing page first
  if (appState === 'landing') {
    return (
      <div className="app">
        <LandingPage 
          onStartInterview={handleStartInterview}
          onGoToOnboarding={handleGoToOnboarding}
        />
      </div>
    );
  }

  // Show interview flow (no authentication required)
  if (appState === 'interview') {
    return (
      <div className="app">
        <VirtualInterview onComplete={handleInterviewComplete} />
      </div>
    );
  }

  // Show interview success page
  if (appState === 'interview-success') {
    return (
      <div className="app">
        <InterviewSuccess 
          interviewId={interviewId}
          candidateName={interviewData?.fullName || 'Candidate'}
          onContinueToOnboarding={handleContinueToOnboarding}
          onRetryInterview={handleRetryInterview}
        />
      </div>
    );
  }

  // Show login page for onboarding
  if (appState === 'login' && !isAuthenticated) {
    const handleLogin = (username: string) => {
      const success = login(username, 'OnboardSecure2024!');
      if (success) {
        setAppState('onboarding');
      }
    };
    
    return (
      <div className="app">
        <div className="onboarding-notice">
          <div className="notice-box">
            <h2><i className="fas fa-user-check"></i> Employee Onboarding Portal</h2>
            <p>
              Congratulations! You have successfully completed the technical interview phase. 
              Please log in with the credentials provided by our team to continue with employee onboarding.
            </p>
          </div>
        </div>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  // Handle authenticated onboarding state
  if ((appState === 'login' && isAuthenticated) || appState === 'onboarding') {
    if (appState !== 'onboarding') {
      setAppState('onboarding');
    }
  }

  // Show authenticated onboarding flow (default case)
  if (isAuthenticated) {
    return (
      <div className="app">
        <div className="container">
          <Header currentPhase={currentPhase} currentUser={currentUser} onLogout={handleLogout} />
          {renderCurrentPhase()}
          {isLoading && <LoadingOverlay />}
        </div>
      </div>
    );
  }

  // Fallback (should not reach here)
  return null;
}

export default App;
