// Google Sheets integration service
// This handles saving both interview and onboarding data to Google Sheets

interface InterviewData {
  fullName: string;
  email: string;
  position: string;
  experience: string;
  gitMatcherScaling: string;
  collaborationBalance: string;
  infrastructureDesign: string;
  uiDesign: string;
  preferredLanguage: string;
  workStyle: string;
  teamSize: string;
  introVideo: string;
  technicalVideo: string;
}

interface OnboardingData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  salaryAcceptable: boolean;
  salaryRequest: string;
  emergencyName: string;
  emergencyRelation: string;
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
    this.googleSheetsUrl = 'https://script.google.com/macros/s/AKfycby4fLfrKl9SfaRZTgsHt2NpU3eY3jljzuFuNOD9lpMnViSG1ASOCp1korONXrF15oCiog/exec';
    
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
    console.log('🚀 Starting saveInterviewData with:', { interviewId, data });
    
    try {
      const payload = {
        type: 'interview',
        interviewId,
        timestamp: new Date().toISOString(),
        data: {
          // Personal Information
          fullName: data.fullName,
          email: data.email,
          position: data.position,
          experience: data.experience,
          
          // Technical Responses
          gitMatcherScaling: data.gitMatcherScaling,
          collaborationBalance: data.collaborationBalance,
          infrastructureDesign: data.infrastructureDesign,
          uiDesign: data.uiDesign,
          
          // Work Preferences
          preferredLanguage: data.preferredLanguage,
          workStyle: data.workStyle,
          teamSize: data.teamSize,
          
          // Video Links
          introVideo: data.introVideo,
          technicalVideo: data.technicalVideo,
          
          // Metadata
          submissionDate: new Date().toLocaleString(),
          status: 'AWAITING_REVIEW'
        }
      };

      console.log('📤 Sending payload to Google Sheets:', payload);
      console.log('🔗 Using URL:', this.googleSheetsUrl);

      // Method 1: Google Sheets via Web App (Recommended)
      const response = await fetch(this.googleSheetsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);
      
      const responseText = await response.text();
      console.log('📥 Response body:', responseText);

      if (response.ok) {
        console.log('✅ Interview data saved to Google Sheets successfully');
        return true;
      } else {
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
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
          address: data.address,
          
          // Compensation
          salaryAcceptable: data.salaryAcceptable,
          salaryRequest: data.salaryRequest,
          
          // Emergency Contact
          emergencyName: data.emergencyName,
          emergencyRelation: data.emergencyRelation,
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
🔄 CLOUD SYNC ISSUE DETECTED:

Your interview data was saved locally but couldn't sync to Google Sheets.

TROUBLESHOOTING STEPS:
1. Check your internet connection
2. Verify the Google Apps Script URL is correct
3. Make sure the Google Apps Script has "Anyone" access permissions
4. The data is safely stored in localStorage and will auto-retry

Your data is NOT lost - it's safely backed up locally.
    `;
    
    console.warn(instructions);
    
    // Log backup status for debugging (no user popup)
    if (typeof window !== 'undefined') {
      console.log('� Interview data saved to localStorage backup');
      console.table({
        'Data Status': '✅ Saved Locally',
        'Cloud Sync': '❌ Failed',
        'Auto Retry': '✅ Enabled',
        'Data Lost': '❌ No - Data is Safe'
      });
    }
  }

  // Retry failed syncs (call this on app startup)
  async retryFailedSyncs(): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    const keys = Object.keys(localStorage).filter(key => key.includes('_backup_'));
    
    if (keys.length > 0) {
      console.log(`🔄 Found ${keys.length} backup items to retry sync:`, keys);
    }
    
    for (const key of keys) {
      try {
        const backup = JSON.parse(localStorage.getItem(key) || '{}');
        if (backup.needsSync) {
          console.log(`🔄 Retrying sync for: ${key}`);
          const success = backup.type === 'interview' 
            ? await this.saveInterviewData(backup.data, backup.id)
            : await this.saveOnboardingData(backup.data);
            
          if (success) {
            localStorage.removeItem(key);
            console.log(`✅ Successfully synced backup: ${key}`);
          } else {
            console.log(`❌ Still failed to sync: ${key}`);
          }
        }
      } catch (error) {
        console.error(`❌ Failed to sync backup ${key}:`, error);
      }
    }
  }

  // Debug method to show what's in localStorage
  public showBackupData(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.log('❌ localStorage not available');
      return;
    }
    
    const backupKeys = Object.keys(localStorage).filter(key => key.includes('_backup_'));
    
    if (backupKeys.length === 0) {
      console.log('ℹ️ No backup data found in localStorage');
      return;
    }
    
    console.log(`📊 Found ${backupKeys.length} backup items:`);
    
    backupKeys.forEach(key => {
      try {
        const backup = JSON.parse(localStorage.getItem(key) || '{}');
        console.log(`📁 ${key}:`, {
          type: backup.type,
          timestamp: backup.timestamp,
          needsSync: backup.needsSync,
          id: backup.id
        });
      } catch (error) {
        console.error(`❌ Error parsing backup ${key}:`, error);
      }
    });
  }

  // Test Google Sheets connection
  public async testConnection(): Promise<boolean> {
    console.log('🧪 Testing Google Sheets connection...');
    console.log('🔗 URL:', this.googleSheetsUrl);
    
    try {
      const testPayload = {
        type: 'interview',
        interviewId: 'TEST_CONNECTION',
        timestamp: new Date().toISOString(),
        data: {
          fullName: 'Test User',
          email: 'test@example.com',
          position: 'Test Position',
          experience: 'Test Experience',
          gitMatcherScaling: 'Test response',
          collaborationBalance: 'Test response',
          infrastructureDesign: 'Test response',
          uiDesign: 'Test response',
          preferredLanguage: 'JavaScript',
          workStyle: 'Remote',
          teamSize: '5-10',
          introVideo: 'https://example.com/video1',
          technicalVideo: 'https://example.com/video2',
          submissionDate: new Date().toLocaleString(),
          status: 'TEST'
        }
      };

      const response = await fetch(this.googleSheetsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload)
      });

      const responseText = await response.text();
      
      console.log('🧪 Test Response Status:', response.status);
      console.log('🧪 Test Response Body:', responseText);

      if (response.ok) {
        console.log('✅ Google Sheets connection test PASSED');
        return true;
      } else {
        console.log('❌ Google Sheets connection test FAILED');
        return false;
      }
    } catch (error) {
      console.error('❌ Connection test error:', error);
      return false;
    }
  }
}

// Make DataService available globally for debugging
declare global {
  interface Window {
    debugDataService: DataService;
  }
}

// Expose for debugging in development
if (typeof window !== 'undefined') {
  window.debugDataService = DataService.getInstance();
}

export default DataService;
