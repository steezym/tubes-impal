// TermsScreen.js
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function TermsScreen({ navigation }) {
  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <View style={s.header}>
        <Text style={s.title}>Terms & Conditions</Text>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.paragraph}>
          These are the basic terms and conditions for using the Solife app.
          By creating an account and using this application, you agree to:
        </Text>

        <Text style={s.bullet}>• Provide accurate account information.</Text>
        <Text style={s.bullet}>• Keep your login details secure.</Text>
        <Text style={s.bullet}>
          • Use the app in a lawful and respectful manner.
        </Text>
        <Text style={s.bullet}>
          • Not abuse, attack, or attempt to hack the service.
        </Text>

        <Text style={s.paragraph}>
          Solife may update these terms in the future. We will inform you
          in the app if there are important changes.
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
  paragraph: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  bullet: {
    fontSize: 14,
    color: '#374151',
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
