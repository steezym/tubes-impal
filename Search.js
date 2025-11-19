import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Button } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';

export default function Search() {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Search</Text>
    </View>
  );
}
