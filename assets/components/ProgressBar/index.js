import { View, Text } from 'react-native';
import React from 'react';

const ProgressBar = props => {
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
          height: 80,
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
          Uploading...
        </Text>
        <View
          style={{
            width: '80%',
            height: 4,
            backgroundColor: '#d9d9d9',
            borderRadius: 20,
          }}
        >
          <View
            style={{
              width: `${props.progressValue > 99 ? 100 : props.progressValue}%`,
              height: 4,
              backgroundColor: '#000',
              borderRadius: 20,
            }}
          ></View>
        </View>
      </View>
    </View>
  );
};

export default ProgressBar;
