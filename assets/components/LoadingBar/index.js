import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';

const LoadingBar = () => {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000000ba',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
      }}
    >
      <View
        style={{
          width: 200,
          height: 90,
          zIndex: 999,
          backgroundColor: '#ffff',
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            marginBottom: 12,
            fontFamily: 'Inter_Medium',
            fontSize: 14,
          }}
        >
          Processing Photo...
        </Text>
        <ActivityIndicator size="large" color="#000" />
      </View>
    </View>
  );
};

export default LoadingBar;
