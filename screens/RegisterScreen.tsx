import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup';
import { borderRadius, colors, fontSize, shadows, spacing } from '../constants/theme';
import { authApi } from '../utils/api/authApi';

// Validation Schema - Simplified for testing
const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

// Password strength calculator
const calculatePasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  if (!password) return { strength: 0, label: '', color: '' };

  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 15;
  
  // Character type checks
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[@$!%*?&#]/.test(password)) strength += 15;

  let label = '';
  let color = '';

  if (strength <= 25) {
    label = 'Weak';
    color = colors.error.icon;
  } else if (strength <= 50) {
    label = 'Fair';
    color = colors.warning.icon;
  } else if (strength <= 75) {
    label = 'Good';
    color = '#3b82f6';
  } else {
    label = 'Strong';
    color = colors.success.icon;
  }

  return { strength, label, color };
};

const RegisterScreen = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: '', color: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (values: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setRegisterError('');
      setIsLoading(true);
      
      // Call DummyJSON API for registration
      const response = await authApi.register({
        name: values.username, // Using username as name for demo
        username: values.username,
        email: values.email,
        password: values.password,
      });
      
      console.log('Registration successful:', response.user);
      
      setIsLoading(false);
      
      Alert.alert(
        '✅ Registration Successful',
        `Welcome to PrimePlay, ${response.user.name}! You can now login.`,
        [
          {
            text: 'Go to Login',
            onPress: () => router.replace('/login'),
          },
        ]
      );
      
      // TODO: Store token in AsyncStorage and navigate to home
      // await AsyncStorage.setItem('authToken', response.token);
      // router.replace('/(tabs)');
      
    } catch (error: any) {
      setIsLoading(false);
      setRegisterError(error.message || 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <LinearGradient colors={colors.background.gradient} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo and Title */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="football" size={40} color={colors.text.primary} />
            </View>
            <Text style={styles.appName}>PrimePlay</Text>
            <Text style={styles.tagline}>Your Ultimate Sports Hub</Text>
          </View>

          {/* Register Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Create Account</Text>

            {/* Demo Info */}
            <View style={styles.demoInfo}>
              <View style={styles.demoInfoHeader}>
                <Ionicons name="information-circle" size={18} color={colors.primary} />
                <Text style={styles.demoInfoText}>Quick Test Registration</Text>
              </View>
              <Text style={styles.demoNote}>
                Password only needs 6+ characters for testing
              </Text>
              <Text style={styles.demoNote}>
                Tap "Use Demo Data" below to auto-fill
              </Text>
            </View>

            <Formik
              initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={RegisterSchema}
              onSubmit={handleRegister}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
                setFieldValue,
              }) => (
                <View style={styles.form}>
                  {/* Quick Fill Button */}
                  <TouchableOpacity
                    style={styles.quickFillButton}
                    onPress={() => {
                      const randomNum = Math.floor(Math.random() * 1000);
                      setFieldValue('username', `testuser${randomNum}`);
                      setFieldValue('email', `testuser${randomNum}@example.com`);
                      setFieldValue('password', 'test123');
                      setFieldValue('confirmPassword', 'test123');
                    }}
                  >
                    <Ionicons name="flash" size={16} color={colors.primary} />
                    <Text style={styles.quickFillText}>Use Demo Data</Text>
                  </TouchableOpacity>
                  
                  {/* Username Input */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color={colors.icon.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor={colors.text.placeholder}
                        value={values.username}
                        onChangeText={handleChange('username')}
                        onBlur={handleBlur('username')}
                        autoCapitalize="none"
                        autoComplete="username"
                      />
                    </View>
                    {touched.username && errors.username && (
                      <Text style={styles.errorText}>{errors.username}</Text>
                    )}
                  </View>

                  {/* Email Input */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color={colors.icon.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        placeholderTextColor={colors.text.placeholder}
                        value={values.email}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                      />
                    </View>
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={colors.icon.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={colors.text.placeholder}
                        value={values.password}
                        onChangeText={(text) => {
                          handleChange('password')(text);
                          setPasswordStrength(calculatePasswordStrength(text));
                        }}
                        onBlur={handleBlur('password')}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoComplete="password"
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                      >
                        <Ionicons
                          name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                          size={20}
                          color={colors.icon.primary}
                        />
                      </TouchableOpacity>
                    </View>
                    
                    {/* Password Strength Indicator */}
                    {values.password.length > 0 && (
                      <View style={styles.strengthContainer}>
                        <View style={styles.strengthBarContainer}>
                          <View
                            style={[
                              styles.strengthBar,
                              {
                                width: `${passwordStrength.strength}%`,
                                backgroundColor: passwordStrength.color,
                              },
                            ]}
                          />
                        </View>
                        <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                          {passwordStrength.label}
                        </Text>
                      </View>
                    )}
                    
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  {/* Confirm Password Input */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={colors.icon.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={colors.text.placeholder}
                        value={values.confirmPassword}
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoComplete="password"
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.eyeIcon}
                      >
                        <Ionicons
                          name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                          size={20}
                          color={colors.icon.primary}
                        />
                      </TouchableOpacity>
                    </View>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                    )}
                  </View>

                  {/* Register Error Display */}
                  {registerError ? (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle" size={16} color={colors.error.icon} />
                      <Text style={styles.registerErrorText}>{registerError}</Text>
                    </View>
                  ) : null}

                  {/* Register Button */}
                  <TouchableOpacity
                    style={[
                      styles.registerButton,
                      (isSubmitting || isLoading) && styles.registerButtonDisabled,
                    ]}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting || isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={colors.text.primary} />
                    ) : (
                      <Text style={styles.registerButtonText}>
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                      </Text>
                    )}
                  </TouchableOpacity>

                  {/* Login Link */}
                  <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/login')}>
                      <Text style={styles.loginLink}>Sign In</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>© 2025 PrimePlay. All rights reserved.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.huge,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  appName: {
    fontSize: fontSize.huge,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  formContainer: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxxl,
    ...shadows.medium,
  },
  welcomeText: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xxl,
    textAlign: 'left',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.input,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    height: 56,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  demoInfo: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  demoInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  demoInfoText: {
    color: colors.text.secondary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  demoNote: {
    color: colors.text.tertiary,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  quickFillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  quickFillText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  inputIcon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
    height: '100%',
  },
  eyeIcon: {
    padding: spacing.xs,
  },
  strengthContainer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  strengthBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border.default,
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    minWidth: 50,
  },
  errorText: {
    color: colors.error.icon,
    fontSize: fontSize.xs,
    marginTop: 6,
    marginLeft: spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error.background,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.lg,
  },
  registerErrorText: {
    color: colors.error.text,
    fontSize: fontSize.sm,
    marginLeft: spacing.sm,
    flex: 1,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    ...shadows.primary,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: colors.text.primary,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    color: colors.text.secondary,
    fontSize: fontSize.sm,
  },
  loginLink: {
    color: colors.primaryLight,
    fontSize: fontSize.sm,
    fontWeight: 'bold',
  },
  footer: {
    color: colors.text.tertiary,
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.huge,
  },
});

export default RegisterScreen;
