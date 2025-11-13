import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function InputWithIcon({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  IconComponent,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        {IconComponent ? <IconComponent size={18} color="#9CA3AF" /> : null}
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 54,
    borderRadius: 27,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconWrap: {
    width: 24,
    alignItems: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
    paddingVertical: 0,
  },
});
