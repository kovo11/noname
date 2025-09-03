import React, { createContext, useContext, useState, useEffect } from 'react';
import { CandidateData } from '../types';
import usersData from '../data/users.json';

interface UserData {
  username: string;
  password: string;
  status: string;
  assignedDate: string;
  completed: boolean;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  data: any;
}

interface UsersJson {
  users: UserData[];
}

interface AuthContextType {
  currentUser: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  saveUserData: (data: CandidateData) => void;
  loadUserData: () => CandidateData | null;
  getUserPersonalInfo: () => any;
  isUserCompleted: () => boolean;
  markUserAsCompleted: () => void;
  getLastLoginError: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [lastLoginError, setLastLoginError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    
    // Clean up localStorage on startup to prevent quota issues
    cleanupLocalStorage();
  }, []);

  // Function to clean up localStorage on startup
  const cleanupLocalStorage = () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('userData_') && key !== `userData_${currentUser}`) {
          keysToRemove.push(key);
        }
        // Preserve completion flags (completed_*) - they should persist
      }
      
      // Remove old user data
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      if (keysToRemove.length > 0) {
        console.log(`🧹 Cleaned up ${keysToRemove.length} old localStorage entries (completion flags preserved)`);
      }
    } catch (error) {
      console.error('Error during localStorage cleanup:', error);
    }
  };

  const login = (username: string, password: string): boolean => {
    console.log(`🔑 Login attempt for username: ${username}`);
    setLastLoginError(null);
    
    // Find user in users.json to validate credentials and status
    const typedUsersData = usersData as UsersJson;
    const user = typedUsersData.users.find(
      (u: UserData) => u.username === username
    );

    if (!user) {
      console.log(`❌ Login failed - user not found: ${username}`);
      setLastLoginError('Username not found. Please check your credentials.');
      return false;
    }

    if (user.password !== password) {
      console.log(`❌ Login failed - invalid password for: ${username}`);
      setLastLoginError('Invalid password. Please check your credentials.');
      return false;
    }

    if (user.status !== 'active') {
      console.log(`❌ Login failed - account not active for: ${username}`);
      setLastLoginError('This account is not active. Please contact support.');
      return false;
    }

    console.log(`✅ Login successful for: ${username}`);
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
    setLastLoginError(null);
    return true;
  };

  const logout = () => {
    // Clear current user data to free up space, but preserve completion status
    if (currentUser) {
      const key = `userData_${currentUser}`;
      localStorage.removeItem(key);
      // Keep the completion flag for future logins
      // localStorage.removeItem(`completed_${currentUser}`); // Don't remove this
    }
    
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    
    console.log('🚪 User logged out and localStorage cleaned (completion status preserved)');
  };

  const saveUserData = (data: CandidateData) => {
    if (currentUser) {
      try {
        // Create a lightweight version of the data for localStorage
        const lightweightData = {
          candidateId: data.candidateId,
          submissionDate: data.submissionDate,
          completionDate: data.completionDate,
          isCompleted: !!(data.legal?.consentCheck && data.legal?.transactionId), // Track completion status
          application: data.application,
          identity: data.identity ? {
            emergencyName: data.identity.emergencyName,
            emergencyRelation: data.identity.emergencyRelation,
            emergencyEmail: data.identity.emergencyEmail,
            // Only store document filenames, not full URLs to save space
            documents: data.identity.documents ? 
              Object.fromEntries(
                Object.entries(data.identity.documents).map(([key, doc]) => [
                  key, 
                  { filename: doc.filename, size: doc.size, type: doc.type, driveUrl: '' }
                ])
              ) : {}
          } : undefined,
          legal: data.legal ? {
            consentCheck: data.legal.consentCheck,
            paymentConsent: data.legal.paymentConsent,
            transactionId: data.legal.transactionId,
            ltcAmount: data.legal.ltcAmount,
            // Only store document filenames, not full URLs to save space
            documents: data.legal.documents ? 
              Object.fromEntries(
                Object.entries(data.legal.documents).map(([key, doc]) => [
                  key, 
                  { filename: doc.filename, size: doc.size, type: doc.type, driveUrl: '' }
                ])
              ) : {}
          } : undefined
        };

        // Save lightweight data to localStorage
        const key = `userData_${currentUser}`;
        localStorage.setItem(key, JSON.stringify(lightweightData));
        
        // Also save completion status separately for quick access
        if (lightweightData.isCompleted) {
          localStorage.setItem(`completed_${currentUser}`, 'true');
          console.log(`✅ User ${currentUser} marked as completed`);
        }
        
        // Auto-save to text file when legal phase is completed
        if (data.legal?.consentCheck || data.legal?.transactionId) {
          autoSaveToTextFile(data);
        }
        
        console.log(`✅ User data saved successfully for: ${currentUser}`);
      } catch (error) {
        if (error instanceof DOMException && error.code === 22) {
          // QuotaExceededError - clear old data and try again
          console.warn('⚠️ localStorage quota exceeded. Clearing old data...');
          clearOldUserData();
          
          try {
            // Try saving again with minimal data but keep completion status
            const isCompleted = !!(data.legal?.consentCheck && data.legal?.transactionId);
            const minimalData = {
              candidateId: data.candidateId,
              isCompleted: isCompleted,
              application: {
                firstName: data.application?.firstName || '',
                lastName: data.application?.lastName || '',
                email: data.application?.email || '',
                salaryAcceptable: data.application?.salaryAcceptable || true
              },
              identity: {
                emergencyName: data.identity?.emergencyName || '',
                emergencyRelation: data.identity?.emergencyRelation || ''
              },
              legal: {
                consentCheck: data.legal?.consentCheck || false,
                paymentConsent: data.legal?.paymentConsent || false,
                transactionId: data.legal?.transactionId || ''
              }
            };
            
            const key = `userData_${currentUser}`;
            localStorage.setItem(key, JSON.stringify(minimalData));
            
            // Always save completion status separately
            if (isCompleted) {
              localStorage.setItem(`completed_${currentUser}`, 'true');
            }
            
            console.log(`✅ Minimal user data saved after quota cleanup for: ${currentUser}`);
          } catch (retryError) {
            console.error('❌ Failed to save even minimal user data:', retryError);
            
            // As last resort, just save completion status
            try {
              const isCompleted = !!(data.legal?.consentCheck && data.legal?.transactionId);
              if (isCompleted) {
                localStorage.setItem(`completed_${currentUser}`, 'true');
                console.log(`✅ At least saved completion status for: ${currentUser}`);
              }
            } catch (finalError) {
              console.error('❌ Failed to save completion status:', finalError);
            }
          }
        } else {
          console.error('❌ Error saving user data:', error);
        }
      }
    }
  };

  // Helper function to clear old user data
  const clearOldUserData = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('userData_') && key !== `userData_${currentUser}`) {
          keysToRemove.push(key);
        }
        // Don't remove completion flags - they should persist
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed old user data: ${key}`);
      });
      
      // Also clear any other large items if needed, but preserve completion flags
      const otherKeys = ['interviewData', 'tempData', 'uploadedFiles'];
      otherKeys.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`🗑️ Removed large data item: ${key}`);
        }
      });
    } catch (error) {
      console.error('Error clearing old data:', error);
    }
  };

  const autoSaveToTextFile = (userData: CandidateData) => {
    const app = userData.application;
    const identity = userData.identity;
    const legal = userData.legal;
    
    const completionStatus = legal?.transactionId ? 'COMPLETED' : 'IN PROGRESS';
    const timestamp = new Date().toLocaleString();
    
    const textContent = `
==========================================
MIEBACH VENTURES - CANDIDATE RECORD
==========================================
Generated: ${timestamp}
Username: ${currentUser}
Reference ID: ${userData.candidateId || 'Not assigned'}
Status: ${completionStatus}
==========================================

PERSONAL INFORMATION:
• Full Name: ${app?.firstName || ''} ${app?.lastName || ''}
• Username: ${currentUser}

APPLICATION DETAILS:
• Email: ${app?.email || 'Not provided'}
• Address: ${app?.address || 'Not provided'}
• Salary Acceptable: ${app?.salaryAcceptable ? 'Yes' : 'No'}
• Salary Request: ${app?.salaryRequest || 'Not provided'}

IDENTITY VERIFICATION:
• Emergency Contact: ${identity?.emergencyName || 'Not provided'}
• Emergency Relation: ${identity?.emergencyRelation || 'Not provided'}
• Emergency Email: ${identity?.emergencyEmail || 'Not provided'}

LEGAL & COMPLIANCE:
• Background Check Consent: ${legal?.consentCheck ? '✓ YES' : '✗ NO'}
• Payment Consent: ${legal?.paymentConsent ? '✓ YES' : '✗ NO'}
• Transaction ID: ${legal?.transactionId || 'Not processed'}
• LTC Amount: ${legal?.ltcAmount || 'Not processed'}
• Salary Agreement: $2,300 bi-weekly ($59,800 annually)

COMPLETION STATUS: ${completionStatus}
Submission Date: ${userData.submissionDate || 'Not submitted'}
Completion Date: ${userData.completionDate || 'Not completed'}

==========================================
CONFIDENTIAL CANDIDATE INFORMATION
This file was automatically generated by
GitMatcher Onboarding System
==========================================
`;

    // Note: Data is now automatically saved to Google Sheets
    console.log(`✅ Candidate record processed for: ${currentUser}`);
  };

  const loadUserData = (): CandidateData | null => {
    if (currentUser) {
      try {
        const key = `userData_${currentUser}`;
        const savedData = localStorage.getItem(key);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log(`📥 User data loaded for: ${currentUser}`);
          return parsedData;
        }
      } catch (error) {
        console.error('❌ Error loading user data from localStorage:', error);
        // Clear corrupted data
        const key = `userData_${currentUser}`;
        localStorage.removeItem(key);
        console.log('🗑️ Removed corrupted user data');
      }
    }
    return null;
  };

  const getUserPersonalInfo = () => {
    if (currentUser) {
      const typedUsersData = usersData as UsersJson;
      const user = typedUsersData.users.find((u: UserData) => u.username === currentUser);
      return user?.personalInfo || null;
    }
    return null;
  };

  const isUserCompleted = (): boolean => {
    if (!currentUser) return false;
    
    console.log(`🔍 Checking completion status for user: ${currentUser}`);
    
    // First check the JSON data for completion status
    const typedUsersData = usersData as UsersJson;
    const user = typedUsersData.users.find((u: UserData) => u.username === currentUser);
    console.log(`📋 User found in JSON:`, user);
    console.log(`✅ User completed status:`, user?.completed);
    
    if (user?.completed === true) {
      console.log(`✅ User ${currentUser} is marked as completed in JSON`);
      return true;
    }
    
    // Check completion flag in localStorage
    const completionFlag = localStorage.getItem(`completed_${currentUser}`);
    console.log(`💾 localStorage completion flag:`, completionFlag);
    if (completionFlag === 'true') {
      console.log(`✅ User ${currentUser} is marked as completed in localStorage`);
      return true;
    }
    
    // Fallback: check user data for completion
    const userData = loadUserData();
    if (userData && userData.legal?.consentCheck && userData.legal?.transactionId) {
      // Mark as completed for future quick access
      localStorage.setItem(`completed_${currentUser}`, 'true');
      console.log(`✅ User ${currentUser} marked as completed based on user data`);
      return true;
    }
    
    console.log(`❌ User ${currentUser} is not completed`);
    return false;
  };

  const markUserAsCompleted = (): void => {
    if (!currentUser) return;
    
    try {
      // Mark as completed in localStorage for immediate effect
      localStorage.setItem(`completed_${currentUser}`, 'true');
      
      // In a real application, you would update the JSON file on the server
      // For now, we'll just log this action
      console.log(`✅ User ${currentUser} marked as completed in system`);
      
      // Note: In production, this would involve an API call to update the users.json
      // file on the server to set completed: true for this user
      console.log(`📝 Backend update needed: Set completed=true for user ${currentUser}`);
      
    } catch (error) {
      console.error('❌ Error marking user as completed:', error);
    }
  };

  const getLastLoginError = (): string | null => {
    return lastLoginError;
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    saveUserData,
    loadUserData,
    getUserPersonalInfo,
    isUserCompleted,
    markUserAsCompleted,
    getLastLoginError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
