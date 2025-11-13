// App.js
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

import InputWithIcon from './components/InputWithIcon';
import UserIcon from './components/icons/UserIcon';
import LockIcon from './components/icons/LockIcon';

import Home from './Home';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import TermsScreen from './TermsScreen';
import PrivacyScreen from './PrivacyScreen';

const Stack = createNativeStackNavigator();
const API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

// =======================
// LOGIN SCREEN
// =======================
function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || 'Login failed');
        return;
      }

      // sukses -> ke Home
      navigation.replace('Home', { user: data.user });
    } catch (e) {
      console.log('Login error:', e);
      setError('Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <LinearGradient
          colors={['#FEFEFC', '#FEFEFC', '#C2E86A']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.wrap}>
            {/* Logo */}
            <View style={styles.logoBox}>
              <Image
                source={require('./assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Title / Subtitle */}
            <Text style={styles.title}>Welcome To Solife</Text>
            <Text style={styles.subtitle}>Connect. Balance. Live</Text>

            {/* Form */}
            <View style={styles.form}>
              <InputWithIcon
                placeholder="Enter your email"
                value={email}
                onChangeText={t => {
                  setEmail(t);
                  if (error) setError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                IconComponent={UserIcon}
              />
              <InputWithIcon
                placeholder="Enter your password"
                value={password}
                onChangeText={t => {
                  setPassword(t);
                  if (error) setError('');
                }}
                secureTextEntry
                autoCapitalize="none"
                IconComponent={LockIcon}
              />

              {!!error && <Text style={styles.inlineError}>{error}</Text>}

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.forgotWrap}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.loginBtn}
                onPress={onLogin}
                disabled={loading}
              >
                <Text style={styles.loginText}>
                  {loading ? 'Loading...' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don’t have an account?</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.signupText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// =======================
// ROOT APP + NAVIGATION
// =======================
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Login"
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="Home" component={Home} />
           <Stack.Screen name="Terms" component={TermsScreen} />
  <Stack.Screen name="Privacy" component={PrivacyScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// =======================
// STYLES LOGIN
// =======================
const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: '#ffffff' },
  gradient: { flex: 1 },
  wrap: { flex: 1, alignItems: 'center', paddingHorizontal: 24 },

  // Header
  logoBox: { marginTop: 24, marginBottom: 12 },
  logo: {
    width: 176,
    height: 178,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 26,
  },

  // Form
  form: { width: '100%', gap: 14 },

  inlineError: {
    color: '#ef4444',
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: '600',
    fontSize: 13,
    marginTop: 4,
  },

  forgotWrap: { alignSelf: 'flex-end', marginTop: 6, marginBottom: 8 },
  forgotText: { fontSize: 14, color: '#626B73', fontWeight: '600' },

  loginBtn: {
    marginTop: 6,
    backgroundColor: '#000000',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },

  // Footer
  footer: { alignItems: 'center', marginTop: 28 },
  footerText: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 6,
    fontWeight: '700',
  },
  signupText: { fontSize: 16, color: '#626B73', fontWeight: '700' },
});
