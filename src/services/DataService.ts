// Google Sheets integration service
// This handles saving both interview and onboarding data to Google Sheets

interface InterviewData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  gitMacherScaling: string;
  techStack: string;
  problemSolving: string;
  projectManagement: string;
  preferredLanguage: string;
  workStyle: string;
  teamSize: string;
  introVideo: string;
  technicalVideo: string;
  challengeVideo: string;
}

interface OnboardingData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  salaryAcceptable: boolean;
  salaryRequest: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  emergencyEmail: string;
  consentCheck: boolean;
  transactionId: string;
}

class DataService {
  private static instance: DataService;
  private googleSheetsUrl: string;
  private airtableUrl: string;
  private notionUrl: string;

  private constructor() {
    // Google Sheets Web App URL (you'll create this)
    this.googleSheetsUrl = 'https://script.google.com/macros/s/AKfycbx_GzfMLBR8xP2jzwhRTtPavnnqFTHRNt72frSoOMUt1dSx3DJGpq-SMfHNUWug31F7FQ/exec';
    
    // Alternative URLs for other services
    this.airtableUrl = 'https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE_NAME';
    this.notionUrl = 'https://api.notion.com/v1/pages';
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Save interview data to Google Sheets
  async saveInterviewData(data: InterviewData, interviewId: string): Promise<boolean> {
    try {
      const payload = {
        type: 'interview',
        interviewId,
        timestamp: new Date().toISOString(),
        data: {
          // Personal Information
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          position: data.position,
          experience: data.experience,
          
          // Technical Responses
          gitMacherScaling: data.gitMacherScaling,
          techStack: data.techStack,
          problemSolving: data.problemSolving,
          
          // Work Preferences
          preferredLanguage: data.preferredLanguage,
          workStyle: data.workStyle,
          teamSize: data.teamSize,
          
          // Video Links
          introVideo: data.introVideo,
          technicalVideo: data.technicalVideo,
          challengeVideo: data.challengeVideo,
          
          // Metadata
          submissionDate: new Date().toLocaleString(),
          status: 'AWAITING_REVIEW'
        }
      };

      // Method 1: Google Sheets via Web App (Recommended)
      const response = await fetch(this.googleSheetsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('✅ Interview data saved to Google Sheets successfully');
        return true;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error saving interview data:', error);
      
      // Fallback: Save to localStorage and show instructions
      this.saveToLocalStorageBackup('interview', interviewId, data);
      return false;
    }
  }

  // Save onboarding data to Google Sheets
  async saveOnboardingData(data: OnboardingData): Promise<boolean> {
    try {
      const payload = {
        type: 'onboarding',
        username: data.username,
        timestamp: new Date().toISOString(),
        data: {
          // Personal Information
          fullName: `${data.firstName} ${data.lastName}`,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          
          // Compensation
          salaryAcceptable: data.salaryAcceptable,
          salaryRequest: data.salaryRequest,
          
          // Emergency Contact
          emergencyName: data.emergencyName,
          emergencyRelation: data.emergencyRelation,
          emergencyPhone: data.emergencyPhone,
          emergencyEmail: data.emergencyEmail,
          
          // Legal
          consentCheck: data.consentCheck,
          transactionId: data.transactionId,
          
          // Metadata
          completionDate: new Date().toLocaleString(),
          status: 'ONBOARDING_COMPLETED'
        }
      };

      const response = await fetch(this.googleSheetsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('✅ Onboarding data saved to Google Sheets successfully');
        return true;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error saving onboarding data:', error);
      
      // Fallback: Save to localStorage and show instructions
      this.saveToLocalStorageBackup('onboarding', data.username, data);
      return false;
    }
  }

  // Alternative: Save to Airtable
  async saveToAirtable(data: any, type: 'interview' | 'onboarding'): Promise<boolean> {
    try {
      const AIRTABLE_API_KEY = 'YOUR_AIRTABLE_API_KEY'; // You'll need to set this
      
      const payload = {
        fields: {
          Type: type,
          Name: data.fullName || `${data.firstName} ${data.lastName}`,
          Email: data.email,
          Phone: data.phone,
          Status: type === 'interview' ? 'AWAITING_REVIEW' : 'COMPLETED',
          'Submission Date': new Date().toISOString(),
          'Raw Data': JSON.stringify(data)
        }
      };

      const response = await fetch(this.airtableUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error saving to Airtable:', error);
      return false;
    }
  }

  // Alternative: Save to Notion
  async saveToNotion(data: any, type: 'interview' | 'onboarding'): Promise<boolean> {
    try {
      const NOTION_API_KEY = 'YOUR_NOTION_INTEGRATION_TOKEN'; // You'll need to set this
      const DATABASE_ID = 'YOUR_NOTION_DATABASE_ID'; // You'll need to set this
      
      const payload = {
        parent: { database_id: DATABASE_ID },
        properties: {
          Name: {
            title: [{ text: { content: data.fullName || `${data.firstName} ${data.lastName}` } }]
          },
          Type: {
            select: { name: type }
          },
          Email: {
            email: data.email
          },
          Status: {
            select: { name: type === 'interview' ? 'Review Pending' : 'Completed' }
          },
          'Submission Date': {
            date: { start: new Date().toISOString() }
          }
        }
      };

      const response = await fetch(this.notionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error saving to Notion:', error);
      return false;
    }
  }

  // Backup method: Save to localStorage if cloud services fail
  private saveToLocalStorageBackup(type: string, id: string, data: any) {
    const backupKey = `${type}_backup_${id}_${Date.now()}`;
    localStorage.setItem(backupKey, JSON.stringify({
      type,
      id,
      data,
      timestamp: new Date().toISOString(),
      needsSync: true
    }));
    
    console.log(`💾 Data saved to localStorage backup: ${backupKey}`);
    this.showCloudSyncInstructions();
  }

  // Show instructions for manual data sync
  private showCloudSyncInstructions() {
    const instructions = `
🔄 CLOUD SYNC INSTRUCTIONS:

Your data was saved locally but couldn't sync to the cloud service.
To manually sync:

1. Check your internet connection
2. Verify your Google Sheets/API configuration
3. The data is safely stored in localStorage and will auto-retry on next submission
4. Contact support if the issue persists

The system will automatically retry syncing when the service is available.
    `;
    
    console.warn(instructions);
    
    // You could also show a user-friendly notification here
    if (typeof window !== 'undefined') {
      window.alert('Data saved locally. Cloud sync will retry automatically. Check console for details.');
    }
  }

  // Retry failed syncs (call this on app startup)
  async retryFailedSyncs(): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    const keys = Object.keys(localStorage).filter(key => key.includes('_backup_'));
    
    for (const key of keys) {
      try {
        const backup = JSON.parse(localStorage.getItem(key) || '{}');
        if (backup.needsSync) {
          const success = backup.type === 'interview' 
            ? await this.saveInterviewData(backup.data, backup.id)
            : await this.saveOnboardingData(backup.data);
            
          if (success) {
            localStorage.removeItem(key);
            console.log(`✅ Successfully synced backup: ${key}`);
          }
        }
      } catch (error) {
        console.error(`❌ Failed to sync backup ${key}:`, error);
      }
    }
  }
}

export default DataService;
