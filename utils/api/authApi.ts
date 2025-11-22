// Dummy authentication API using JSONPlaceholder or local mock data

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
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

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dummy users for testing
const DUMMY_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    token: 'dummy-token-123456',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    username: 'janesmith',
    token: 'dummy-token-789012',
  },
];

export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(1000); // Simulate network delay

    // Simple validation for demo purposes
    const user = DUMMY_USERS.find(u => u.email === credentials.email);

    if (!user || credentials.password.length < 6) {
      throw new Error('Invalid email or password');
    }

    return {
      user,
      token: user.token,
      message: 'Login successful',
    };
  },

  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    await delay(1200); // Simulate network delay

    // Check if user already exists
    const existingUser = DUMMY_USERS.find(
      u => u.email === data.email || u.username === data.username
    );

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Create new user
    const newUser: User = {
      id: (DUMMY_USERS.length + 1).toString(),
      name: data.name,
      email: data.email,
      username: data.username,
      token: `dummy-token-${Date.now()}`,
    };

    DUMMY_USERS.push(newUser);

    return {
      user: newUser,
      token: newUser.token,
      message: 'Registration successful',
    };
  },

  // Logout user
  logout: async (): Promise<{ message: string }> => {
    await delay(300);
    return { message: 'Logout successful' };
  },

  // Verify token (for auto-login)
  verifyToken: async (token: string): Promise<User | null> => {
    await delay(500);

    const user = DUMMY_USERS.find(u => u.token === token);
    return user || null;
  },

  // Get current user profile
  getProfile: async (token: string): Promise<User> => {
    await delay(600);

    const user = DUMMY_USERS.find(u => u.token === token);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },
};

export default authApi;
