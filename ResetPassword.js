// ResetPassword.js (minimalis + auto kembali ke Login)

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import InputWithIcon from './components/InputWithIcon';
import UserIcon from './components/icons/UserIcon';
import LockIcon from './components/icons/LockIcon';

const API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

export default function ResetPassword({ navigation, route }) {
  const presetEmail = route?.params?.email || '';

  const [email, setEmail] = React.useState(presetEmail);
  const [otp, setOtp] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');

  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onReset = async () => {
    setError('');
    setSuccess('');

    if (!email.trim() || !otp.trim() || !password) {
      setError('All fields are required');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    // ✅ PASSWORD KUAT (minimal 6 + kombinasi)
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (!hasUpperCase) {
      setError('Password must contain at least one uppercase letter');
      return;
    }
    if (!hasLowerCase) {
      setError('Password must contain at least one lowercase letter');
      return;
    }
    if (!hasNumber) {
      setError('Password must contain at least one number');
      return;
    }
    if (!hasSymbol) {
      setError('Password must contain at least one symbol');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          new_password: password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || 'Reset failed');
        return;
      }

      setSuccess('Password has been reset.');

      // 🔁 Auto redirect ke Login setelah 1 detik
      setTimeout(() => {
        navigation.replace('Login');
      }, 1000);
    } catch (e) {
      console.log('RESET ERROR:', e);
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
          <Text style={s.title}>Reset Password</Text>
          <Text style={s.subtitle}>
            Enter the OTP and your new password.
          </Text>
        </View>

        <View style={s.form}>
          <InputWithIcon
            placeholder="Enter your email"
            value={email}
            onChangeText={t => {
              const cleaned = t.toLowerCase().replace(/\s+/g, '');
              setEmail(cleaned);
              setError('');
              setSuccess('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            IconComponent={UserIcon}
          />

          <InputWithIcon
            placeholder="Enter OTP"
            value={otp}
            onChangeText={t => {
              setOtp(t);
              setError('');
              setSuccess('');
            }}
            keyboardType="number-pad"
            autoCapitalize="none"
            IconComponent={UserIcon}
          />
          <InputWithIcon
            placeholder="New password"
            value={password}
            onChangeText={t => {
              setPassword(t);
              setError('');
              setSuccess('');
            }}
            secureTextEntry
            autoCapitalize="none"
            IconComponent={LockIcon}
          />
          <InputWithIcon
            placeholder="Confirm new password"
            value={confirm}
            onChangeText={t => {
              setConfirm(t);
              setError('');
              setSuccess('');
            }}
            secureTextEntry
            autoCapitalize="none"
            IconComponent={LockIcon}
          />

          {!!error && <Text style={s.error}>{error}</Text>}
          {!!success && <Text style={s.success}>{success}</Text>}

          <TouchableOpacity
            style={s.primaryBtn}
            onPress={onReset}
            activeOpacity={0.9}
            disabled={loading}
          >
            <Text style={s.primaryText}>
              {loading ? 'Saving...' : 'Reset Password'}
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
    marginTop: 48,
    marginBottom: 24,
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
    gap: 12,
  },

  error: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  success: {
    color: '#059669',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },

  primaryBtn: {
    marginTop: 12,
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
