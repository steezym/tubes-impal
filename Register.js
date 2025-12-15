// Register.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import InputWithIcon from './components/InputWithIcon';
import UserIcon from './components/icons/UserIcon';
import LockIcon from './components/icons/LockIcon';

const API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

export default function Register({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [hide, setHide] = React.useState(true);
  const [agree, setAgree] = React.useState(false);

  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async () => {
    setError('');
    setSuccess('');

    const cleanedUsername = username.trim();
    const trimmedEmail = email.trim();

    // 1. Cek field kosong
    if (!cleanedUsername || !trimmedEmail || !password) {
      setError('All fields are required');
      return;
    }

    // 2. Validasi username: hanya lowercase & tidak boleh spasi
    const usernameRegex = /^[a-z0-9]+$/;
    if (!usernameRegex.test(cleanedUsername)) {
      setError(
        'Username can only contain lowercase letters and numbers, no spaces',
      );
      return;
    }

    // 3. Validasi email hanya gmail.com
    const gmailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/i;
    if (!gmailRegex.test(trimmedEmail)) {
      setError('Email must be a valid @gmail.com address');
      return;
    }

    // 4. Validasi password kuat
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
      setError('Password must contain at least one symbol (e.g. !@#$%^&*)');
      return;
    }

    // 5. Cek persetujuan terms & privacy
    if (!agree) {
      setError('You must agree to the terms and privacy policy');
      return;
    }

    setLoading(true);
    try {
      // 6. CEK USERNAME SUDAH ADA ATAU BELUM (FRONTEND-INITIATED CHECK)
      try {
        const checkRes = await fetch(
          `${API_URL}/auth/check-username?name=${encodeURIComponent(
            cleanedUsername,
          )}`,
        );

        if (checkRes.ok) {
          const checkData = await checkRes.json();
          // backend diharapkan mengembalikan: { exists: true/false }
          if (checkData?.exists) {
            setError('Username already registered');
            return; // jangan lanjut ke register
          }
        } else {
          // kalau mau strict, bisa juga block di sini:
          // setError('Unable to verify username');
          // return;
          console.log('check-username not OK:', checkRes.status);
        }
      } catch (checkErr) {
        console.log('check-username error:', checkErr);
        // pilihan: lanjut saja, biar backend di /auth/register yang nentuin
      }

      // 7. Kalau lolos semua, baru kirim REGISTER
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // nama kolom di DB tetap "name", isinya username
          name: cleanedUsername,
          email: trimmedEmail,
          password,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.log('JSON parse error:', jsonErr);
        setError('Unexpected server response');
        return;
      }

      if (!res.ok) {
        if (res.status === 409) {
          // backup kalau backend tetap kirim 409 untuk duplikat
          setError(data?.message || 'Username already registered');
        } else {
          setError(data?.message || 'Registration failed');
        }
        return;
      }

      setSuccess('Registration successful. You can log in now.');
      setUsername('');
      setEmail('');
      setPassword('');
      setAgree(false);

      // opsional: auto arahkan ke login setelah 1–2 detik
      // setTimeout(() => navigation.replace('Login'), 1200);
    } catch (e) {
      console.log('Register error:', e);
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
        {/* Header / Logo */}
        <View style={s.logoBox}>
          <Image
            source={require('./assets/logo.png')}
            style={s.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={s.title}>Sign Up</Text>
        <Text style={s.subtitle}>Connect. Balance. Live</Text>

        {/* Form */}
        <View style={s.form}>
          {/* USERNAME */}
          <InputWithIcon
            placeholder="Enter username"
            value={username}
            onChangeText={t => {
              const cleaned = t.toLowerCase().replace(/\s+/g, '');
              setUsername(cleaned);
              setError('');
              setSuccess('');
            }}
            autoCapitalize="none"
            IconComponent={UserIcon}
          />

          {/* EMAIL */}
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

          {/* PASSWORD */}
          <InputWithIcon
            placeholder="Create password"
            value={password}
            onChangeText={t => {
              setPassword(t);
              setError('');
              setSuccess('');
            }}
            secureTextEntry={hide}
            autoCapitalize="none"
            IconComponent={LockIcon}
            rightAccessory={
              <TouchableOpacity onPress={() => setHide(v => !v)}>
                <Text style={{ fontSize: 16 }}>{hide ? '👁' : '🙈'}</Text>
              </TouchableOpacity>
            }
          />

          {/* Checkbox + Terms & Privacy */}
          <View style={s.checkRow}>
            <TouchableOpacity
              onPress={() => setAgree(v => !v)}
              activeOpacity={0.8}
            >
              <View style={[s.box, agree && s.boxChecked]}>
                {agree ? <Text style={s.checkMark}>✓</Text> : null}
              </View>
            </TouchableOpacity>

            <Text style={s.checkText}>
              I agree with{' '}
              <Text
                style={s.linkText}
                onPress={() => navigation.navigate('Terms')}
              >
                terms and conditions
              </Text>{' '}
              and{' '}
              <Text
                style={s.linkText}
                onPress={() => navigation.navigate('Privacy')}
              >
                privacy policy
              </Text>
              .
            </Text>
          </View>

          {/* Error / Success */}
          {!!error && <Text style={s.error}>{error}</Text>}
          {!!success && <Text style={s.success}>{success}</Text>}

          {/* Button Sign Up */}
          <TouchableOpacity
            style={[s.btn, loading && { opacity: 0.7 }]}
            onPress={onSubmit}
            disabled={loading}
            activeOpacity={0.9}
          >
            <Text style={s.btnText}>{loading ? 'Loading...' : 'Sign Up'}</Text>
          </TouchableOpacity>

          {/* Footer Link ke Login */}
          <View style={s.footer}>
            <Text style={s.footerText}>Already have an account?</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.replace('Login')}
            >
              <Text style={s.footerLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  gradient: { flex: 1, paddingHorizontal: 24 },
  logoBox: { alignItems: 'center', marginTop: 24, marginBottom: 6 },
  logo: { width: 120, height: 120 },
  title: {
    fontSize: 28,
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
    marginBottom: 20,
  },

  form: {
    gap: 14,
  },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 2,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    backgroundColor: '#fff',
  },
  boxChecked: {
    borderColor: '#111827',
    backgroundColor: '#111827',
  },
  checkMark: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 12,
  },
  checkText: {
    color: '#374151',
    fontSize: 14,
    flex: 1,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: '#111827',
    fontWeight: '600',
  },

  error: {
    color: '#ef4444',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
    marginTop: 4,
  },
  success: {
    color: '#059669',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 13,
    marginTop: 4,
  },

  btn: {
    marginTop: 8,
    backgroundColor: '#000',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#1f2937',
  },
  footerLink: {
    fontSize: 15,
    color: '#626B73',
    fontWeight: '700',
    marginTop: 4,
  },
});
