// Export all components from a central index file
export { default as Header } from './Header';
export { default as ApplicationForm } from './ApplicationForm';
export { default as IdentityForm } from './IdentityForm';
export { default as LegalForm } from './LegalForm';
export { default as SuccessPage } from './SuccessPage';
export { default as LoadingOverlay } from './LoadingOverlay';
export { default as FileUpload } from './FileUpload';
export { default as Login } from './Login';
export { default as VirtualInterview } from './VirtualInterview';
export { default as InterviewSuccess } from './InterviewSuccess';
export { default as LandingPage } from './LandingPage';
export { default as PrivacyPolicy } from './PrivacyPolicy';
export { default as DigitalSigningInstructions } from './DigitalSigningInstructions';

// Re-export types for convenience
export type { 
  ApplicationData, 
  IdentityData, 
  LegalData, 
  CandidateData, 
  FormProps, 
  PhaseFormProps,
  DocumentInfo 
} from '../types';
