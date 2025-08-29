export interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  salaryAcceptable: boolean;
  salaryRequest: string;
}

export interface DocumentInfo {
  filename: string;
  size: number;
  type: string;
  driveUrl: string;
}

export interface IdentityData {
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  emergencyEmail?: string;
  documents: Record<string, DocumentInfo>;
}

export interface LegalData {
  consentCheck: boolean;
  paymentConsent: boolean;
  transactionId: string;
  ltcAmount: string;
  documents: Record<string, DocumentInfo>;
}

export interface CandidateData {
  candidateId?: string;
  submissionDate?: string;
  completionDate?: string;
  application?: ApplicationData;
  identity?: IdentityData;
  legal?: LegalData;
}

export interface FormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export interface PhaseFormProps extends FormProps {
  onBack: () => void;
}
