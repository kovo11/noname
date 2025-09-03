import React, { createContext, useContext, useState, useEffect } from 'react';
import { CandidateData } from '../types';
import AuthService from '../services/AuthService';

interface AuthContextType {
  currentUser: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  saveUserData: (data: CandidateData) => void;
  loadUserData: () => CandidateData | null;
  getUserPersonalInfo: () => Promise<any>;
  isUserCompleted: () => Promise<boolean>;
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

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log(`🔑 Login attempt for username: ${username}`);
    setLastLoginError(null);
    
    try {
      const authService = AuthService.getInstance();
      const result = await authService.validateCredentials(username, password);

      if (!result.success) {
        console.log(`❌ Login failed for ${username}: ${result.error}`);
        setLastLoginError(result.error || 'Login failed. Please try again.');
        return false;
      }

      console.log(`✅ Login successful for: ${username}`);
      setCurrentUser(username);
      localStorage.setItem('currentUser', username);
      setLastLoginError(null);
      return true;
    } catch (error) {
      console.error('❌ Login error:', error);
      setLastLoginError('Authentication service error. Please try again.');
      return false;
    }
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
    } catch (error) {
      console.error('Error clearing old data:', error);
    }
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

  const getUserPersonalInfo = async () => {
    if (currentUser) {
      try {
        const authService = AuthService.getInstance();
        const user = await authService.getUserByUsername(currentUser);
        return user?.personalInfo || null;
      } catch (error) {
        console.error('❌ Error getting user personal info:', error);
        return null;
      }
    }
    return null;
  };

  const isUserCompleted = async (): Promise<boolean> => {
    if (!currentUser) return false;
    
    console.log(`🔍 Checking completion status for user: ${currentUser}`);
    
    try {
      // First check the AuthService for completion status
      const authService = AuthService.getInstance();
      const isCompleted = await authService.isUserCompleted(currentUser);
      console.log(`📋 User completion status from service:`, isCompleted);
      
      if (isCompleted) {
        console.log(`✅ User ${currentUser} is marked as completed in service`);
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
    } catch (error) {
      console.error('❌ Error checking user completion:', error);
      return false;
    }
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
