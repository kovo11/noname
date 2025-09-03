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

// Hardcoded user data for production reliability
const USERS_DATA: UserData[] = [
  {
    username: "Candidate7K9M",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-15",
    completed: true,
    personalInfo: {
      firstName: "Kinger Stephen",
      lastName: "Justin",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "Candidate3X7Q",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-16",
    completed: false,
    personalInfo: {
      firstName: "Kinger Stephen",
      lastName: "Eric",
      email: "stephen.eric243@gmail.com"
    },
    data: null
  },
  {
    username: "Candidate9P2R",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-17",
    completed: false,
    personalInfo: {
      firstName: "Ekunola",
      lastName: "Paul",
      email: "ekunolapaul@gmail.com"
    },
    data: null
  },
  {
    username: "Candidate5F8W",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-18",
    completed: false,
    personalInfo: {
      firstName: "Idongesit Samuel",
      lastName: "Robson",
      email: "robsonidongesitsamuel@gmail.com"
    },
    data: null
  },
  {
    username: "Candidate1N4T",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-19",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "Candidate6H3Y",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-20",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "Candidate2L9V",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-21",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "Candidate8D5B",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-22",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "Candidate4Z6C",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-23",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "Candidate0J1E",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-24",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "CandidateM8X2",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-25",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "CandidateQ3Z7",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-26",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "CandidateA9R1",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-27",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "CandidateT4P5",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-28",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "CandidateK6W7",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-29",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "CandidateB9F1",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-30",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "CandidateE8L2",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-08-31",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "CandidateY5U3",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-09-01",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "CandidateS4H6",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-09-01",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  },
  {
    username: "CandidateN7C8",
    password: "OnboardSecure2025!",
    status: "active",
    assignedDate: "2025-09-01",
    completed: false,
    personalInfo: {
      firstName: "[FIRST_NAME]",
      lastName: "[LAST_NAME]",
      email: "[EMAIL@COMPANY.COM]"
    },
    data: null
  }
];

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Get all users data - tries JSON import first, falls back to hardcoded data
   */
  public async getUsersData(): Promise<UserData[]> {
    try {
      // Try to dynamically import the JSON file
      const usersModule = await import('../data/users.json');
      const usersData = usersModule.default || usersModule;
      
      if (usersData && usersData.users && Array.isArray(usersData.users)) {
        console.log('✅ Successfully loaded users from JSON file');
        return usersData.users;
      } else {
        throw new Error('Invalid JSON structure');
      }
    } catch (error) {
      console.warn('⚠️ Could not load users.json, using hardcoded data:', error);
      console.log('🔄 Using fallback hardcoded user data for production');
      return USERS_DATA;
    }
  }

  /**
   * Validate user credentials
   */
  public async validateCredentials(username: string, password: string): Promise<{
    success: boolean;
    error?: string;
    user?: UserData;
  }> {
    try {
      const users = await this.getUsersData();
      const user = users.find(u => u.username === username);

      if (!user) {
        return {
          success: false,
          error: 'Username not found. Please check your credentials.'
        };
      }

      if (user.password !== password) {
        return {
          success: false,
          error: 'Invalid password. Please check your credentials.'
        };
      }

      if (user.status !== 'active') {
        return {
          success: false,
          error: 'This account is not active. Please contact support.'
        };
      }

      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('❌ Error validating credentials:', error);
      return {
        success: false,
        error: 'Authentication service error. Please try again.'
      };
    }
  }

  /**
   * Get user by username
   */
  public async getUserByUsername(username: string): Promise<UserData | null> {
    try {
      const users = await this.getUsersData();
      return users.find(u => u.username === username) || null;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  }

  /**
   * Check if user has completed onboarding
   */
  public async isUserCompleted(username: string): Promise<boolean> {
    try {
      const user = await this.getUserByUsername(username);
      return user?.completed === true;
    } catch (error) {
      console.error('❌ Error checking user completion:', error);
      return false;
    }
  }

  /**
   * Get demo credentials for testing
   */
  public getDemoCredentials(): { username: string; password: string } {
    return {
      username: "Candidate3X7Q",
      password: "OnboardSecure2025!"
    };
  }
}

export default AuthService;
