// PrivacyScreen.js
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function PrivacyScreen({ navigation }) {
  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <View style={s.header}>
        <Text style={s.title}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.paragraph}>
          This privacy policy explains how Solife handles your personal data.
        </Text>

        <Text style={s.sectionTitle}>1. Data we collect</Text>
        <Text style={s.paragraph}>
          We may collect your name, email address, and basic usage information
          when you create an account and use the app.
        </Text>

        <Text style={s.sectionTitle}>2. How we use data</Text>
        <Text style={s.paragraph}>
          We use your data to provide and improve the Solife service,
          communicate with you, and keep your account secure.
        </Text>

        <Text style={s.sectionTitle}>3. Data security</Text>
        <Text style={s.paragraph}>
          We use reasonable security measures to protect your data, but no
          system is 100% secure. Please keep your password safe.
        </Text>

        <Text style={s.sectionTitle}>4. Your choices</Text>
        <Text style={s.paragraph}>
          You can contact us to update or delete your account information, in
          accordance with applicable regulations.
        </Text>

        <TouchableOpacity
          style={s.button}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={s.buttonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FEFEFC' },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  button: {
    marginTop: 24,
    alignSelf: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
