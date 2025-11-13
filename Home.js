import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

export default function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top','left','right']}>
      <LinearGradient
        colors={['#FEFEFC', '#FEFEFC', '#C2E86A']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <Text style={styles.text}>Home Page</Text>

          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.85}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  gradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { alignItems: 'center' },
  text: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 40 },
  logoutBtn: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  logoutText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
