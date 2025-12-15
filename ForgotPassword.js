// ForgotPassword.js (minimalis + auto ke Reset)

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import InputWithIcon from './components/InputWithIcon';
import UserIcon from './components/icons/UserIcon';

const API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const onSend = async () => {
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    try {
      await fetch(`${API_URL}/auth/forgot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      setSuccess('OTP has been sent.');
      // ⬇️ auto ke Reset page
      navigation.navigate('ResetPassword', { email: email.trim() });
    } catch (e) {
      console.log('FORGOT ERROR:', e);
      setError('Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={['#FEFEFC', '#FEFEFC', '#C2E86A']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={s.gradient}
      >
        <View style={s.header}>
          <Image
            source={require('./assets/logo.png')}
            style={s.logo}
            resizeMode="contain"
          />
          <Text style={s.title}>Forgot Password</Text>
          <Text style={s.subtitle}>Enter your email to receive an OTP.</Text>
        </View>

        <View style={s.form}>
          <InputWithIcon
            placeholder="Enter your email"
            value={email}
            onChangeText={t => {
              setEmail(t);
              setError('');
              setSuccess('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            IconComponent={UserIcon}
          />

          {!!error && <Text style={s.error}>{error}</Text>}
          {!!success && <Text style={s.success}>{success}</Text>}

          <TouchableOpacity
            style={s.primaryBtn}
            onPress={onSend}
            activeOpacity={0.9}
            disabled={loading}
          >
            <Text style={s.primaryText}>
              {loading ? 'Sending...' : 'Send OTP'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.backTextWrap}
            onPress={() => navigation.replace('Login')}
            activeOpacity={0.7}
          >
            <Text style={s.backText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  gradient: { flex: 1, paddingHorizontal: 24 },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },

  form: {
    marginTop: 8,
    gap: 14,
  },

  error: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
  success: {
    color: '#059669',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
  },

  primaryBtn: {
    marginTop: 8,
    backgroundColor: '#000000',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  backTextWrap: {
    marginTop: 16,
    alignItems: 'center',
  },
  backText: {
    fontSize: 14,
    color: '#374151',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
