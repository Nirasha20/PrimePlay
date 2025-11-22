// Authentication API using DummyJSON API
import axios from 'axios';

// DummyJSON API Configuration
const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  token: string;
  image?: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Transform DummyJSON user to our User format
const transformDummyUser = (dummyUser: any): User => {
  return {
    id: dummyUser.id?.toString() || '0',
    name: `${dummyUser.firstName || ''} ${dummyUser.lastName || ''}`.trim(),
    email: dummyUser.email || `${dummyUser.username}@primeplay.com`,
    username: dummyUser.username || dummyUser.email?.split('@')[0] || 'user',
    token: dummyUser.accessToken || dummyUser.token || `token-${Date.now()}`,
    image: dummyUser.image,
    firstName: dummyUser.firstName,
    lastName: dummyUser.lastName,
  };
};

export const authApi = {
  // Login user using DummyJSON API
  // Credentials for testing:
  // username: 'emilys', password: 'emilyspass'
  // username: 'michaelw', password: 'michaelwpass'
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${DUMMYJSON_BASE_URL}/auth/login`, {
        username: credentials.username,
        password: credentials.password,
        expiresInMins: 30, // Token expires in 30 minutes
      });

      const user = transformDummyUser(response.data);

      return {
        user,
        token: user.token,
        message: 'Login successful',
      };
    } catch (error: any) {
      // Provide helpful error messages
      if (error.response?.status === 400) {
        throw new Error('Invalid username or password');
      }
      throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  },

  // Register new user
  // Note: DummyJSON doesn't actually create users, but we simulate the process
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      // DummyJSON doesn't have a real registration endpoint
      // We'll use the add user endpoint which simulates creation
      const response = await axios.post(`${DUMMYJSON_BASE_URL}/users/add`, {
        firstName: data.name.split(' ')[0] || data.name,
        lastName: data.name.split(' ').slice(1).join(' ') || '',
        username: data.username,
        email: data.email,
        password: data.password,
      });

      const user = transformDummyUser(response.data);
      
      // Generate a mock token for the new user
      user.token = `mock-token-${Date.now()}`;

      return {
        user,
        token: user.token,
        message: 'Registration successful',
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  },

  // Logout user
  logout: async (): Promise<{ message: string }> => {
    // DummyJSON doesn't have a logout endpoint
    // Just return success
    return { message: 'Logout successful' };
  },

  // Verify token and get current user
  verifyToken: async (token: string): Promise<User | null> => {
    try {
      // Get current authenticated user
      const response = await axios.get(`${DUMMYJSON_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return transformDummyUser(response.data);
    } catch (error) {
      return null;
    }
  },

  // Get current user profile
  getProfile: async (token: string): Promise<User> => {
    try {
      const response = await axios.get(`${DUMMYJSON_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return transformDummyUser(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  // Refresh auth token
  refreshToken: async (token: string): Promise<{ token: string; refreshToken: string }> => {
    try {
      const response = await axios.post(`${DUMMYJSON_BASE_URL}/auth/refresh`, {
        refreshToken: token,
        expiresInMins: 30,
      });

      return {
        token: response.data.accessToken || response.data.token,
        refreshToken: response.data.refreshToken,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to refresh token');
    }
  },
};

export default authApi;
