# Authentication Demo Credentials

## DummyJSON API Integration

The app now uses [DummyJSON](https://dummyjson.com) for authentication with real API endpoints.

### Test Users for Login

You can use any of these credentials to test the login functionality:

| Username | Password | Name |
|----------|----------|------|
| `emilys` | `emilyspass` | Emily Johnson |
| `michaelw` | `michaelwpass` | Michael Williams |
| `sophiab` | `sophiabpass` | Sophia Brown |
| `jamesd` | `jamesdpass` | James Davis |
| `emmaj` | `emmajpass` | Emma Miller |
| `oliviaw` | `oliviawpass` | Olivia Wilson |
| `alexm` | `alexmpass` | Alexander Moore |
| `avat` | `avatpass` | Ava Taylor |
| `ethanm` | `ethanmpass` | Ethan Martinez |
| `isabellaa` | `isabellaapass` | Isabella Anderson |

### API Endpoints Used

#### Login
- **Endpoint**: `POST https://dummyjson.com/auth/login`
- **Body**:
  ```json
  {
    "username": "emilys",
    "password": "emilyspass",
    "expiresInMins": 30
  }
  ```
- **Response**: Returns user data and authentication token

#### Register (Simulated)
- **Endpoint**: `POST https://dummyjson.com/users/add`
- **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Note**: DummyJSON doesn't actually create users, but simulates the process

#### Get Current User
- **Endpoint**: `GET https://dummyjson.com/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Returns authenticated user details

#### Refresh Token
- **Endpoint**: `POST https://dummyjson.com/auth/refresh`
- **Body**:
  ```json
  {
    "refreshToken": "<token>",
    "expiresInMins": 30
  }
  ```

### Features Implemented

✅ Real API authentication with DummyJSON
✅ Login with username/password
✅ User registration (simulated)
✅ Token-based authentication
✅ Get current user profile
✅ Token refresh functionality
✅ Proper error handling
✅ Demo credentials displayed on login screen

### Testing Instructions

1. **Login Test**:
   - Open the Login screen
   - Use username: `emilys` and password: `emilyspass`
   - Click "Sign In"
   - Should see success alert with user name

2. **Registration Test**:
   - Open the Register screen
   - Fill in all fields with valid data
   - Click "Create Account"
   - Should see success alert and navigate to login

3. **Error Handling**:
   - Try logging in with wrong credentials
   - Should see error message "Invalid username or password"

### Next Steps

- Implement Redux slice for auth state management
- Add AsyncStorage for token persistence
- Implement auto-login on app start
- Add protected routes
- Implement logout functionality
- Add user profile management
