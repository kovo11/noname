// Service to manage interview completion state and retry attempts
interface InterviewState {
  completed: boolean;
  completionDate: string;
  interviewId: string;
  candidateName: string;
  retryUsed: boolean;
  retryDate?: string;
  retryInterviewId?: string;
}

class InterviewStateService {
  private static instance: InterviewStateService;
  private storageKey = 'interview_state';

  private constructor() {}

  public static getInstance(): InterviewStateService {
    if (!InterviewStateService.instance) {
      InterviewStateService.instance = new InterviewStateService();
    }
    return InterviewStateService.instance;
  }

  // Save interview completion
  public saveInterviewCompletion(interviewId: string, candidateName: string): void {
    const state: InterviewState = {
      completed: true,
      completionDate: new Date().toISOString(),
      interviewId,
      candidateName,
      retryUsed: false
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(state));
    console.log('✅ Interview completion state saved');
  }

  // Save retry attempt
  public saveRetryAttempt(newInterviewId: string): boolean {
    const currentState = this.getInterviewState();
    
    if (!currentState || currentState.retryUsed) {
      console.log('❌ Retry attempt not allowed');
      return false;
    }

    const updatedState: InterviewState = {
      ...currentState,
      retryUsed: true,
      retryDate: new Date().toISOString(),
      retryInterviewId: newInterviewId
    };

    localStorage.setItem(this.storageKey, JSON.stringify(updatedState));
    console.log('✅ Retry attempt state saved');
    return true;
  }

  // Get current interview state
  public getInterviewState(): InterviewState | null {
    try {
      const stateJson = localStorage.getItem(this.storageKey);
      if (!stateJson) return null;
      
      return JSON.parse(stateJson);
    } catch (error) {
      console.error('❌ Error reading interview state:', error);
      return null;
    }
  }

  // Check if interview was completed
  public hasCompletedInterview(): boolean {
    const state = this.getInterviewState();
    return state?.completed || false;
  }

  // Check if retry is available
  public canRetry(): boolean {
    const state = this.getInterviewState();
    return state?.completed && !state?.retryUsed || false;
  }

  // Clear interview state (for testing)
  public clearState(): void {
    localStorage.removeItem(this.storageKey);
    console.log('🗑️ Interview state cleared');
  }

  // Get interview summary
  public getInterviewSummary(): string {
    const state = this.getInterviewState();
    if (!state) return 'No interview found';

    let summary = `Interview Summary:
📝 Candidate: ${state.candidateName}
🆔 Interview ID: ${state.interviewId}
📅 Completed: ${new Date(state.completionDate).toLocaleString()}`;

    if (state.retryUsed && state.retryInterviewId) {
      summary += `

🔄 Retry Attempt:
🆔 Retry ID: ${state.retryInterviewId}
📅 Retry Date: ${new Date(state.retryDate!).toLocaleString()}`;
    }

    return summary;
  }
}

// Make available globally for debugging
declare global {
  interface Window {
    debugInterviewState: InterviewStateService;
  }
}

if (typeof window !== 'undefined') {
  window.debugInterviewState = InterviewStateService.getInstance();
}

export default InterviewStateService;
