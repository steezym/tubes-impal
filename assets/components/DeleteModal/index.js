import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import React from 'react';

const LoadingBar = props => {
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
          width: 300,
          height: 'auto',
          zIndex: 999,
          backgroundColor: '#ffff',
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter_SemiBold',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          Are you sure want to delete this post?
        </Text>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={props.deletePost}
            style={{
              backgroundColor: '#000',
              paddingHorizontal: 30,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#fff', fontFamily: 'Inter_SemiBold' }}>
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={props.closeModal}
            style={{
              backgroundColor: '#fff',
              borderColor: '#000',
              borderWidth: 2,
              paddingHorizontal: 30,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#000', fontFamily: 'Inter_SemiBold' }}>
              No
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoadingBar;
