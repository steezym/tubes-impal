import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';

import EmptyBoxIcon from '../../icons/empty_box_icon.png';

const UserEmptyPost = props => {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          backgroundColor: '#000',
          width: '90%',
          height: 'auto',
          borderRadius: 30,
          paddingVertical: 35,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          shadowColor: '#000',
          shadowOffset: {
            width: 2,
            height: 11,
          },
          shadowOpacity: 25,
          shadowRadius: 26,
          elevation: 10,
        }}
      >
        <Image
          source={EmptyBoxIcon}
          style={{ width: 130, height: 120 }}
        ></Image>
        <Text
          style={{
            fontFamily: 'Inter_SemiBold',
            fontSize: 16,
            textAlign: 'center',
            color: '#fff',
          }}
        >
          You don't have any post yet!
        </Text>

        <TouchableOpacity
          onPress={props.action}
          style={{
            backgroundColor: '#fff',
            width: 'auto',
            height: 'auto',
            borderRadius: 15,
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontFamily: 'Inter_Bold',
              fontSize: 14,
              textAlign: 'center',
              color: '#000',
            }}
          >
            Let's Make a Post
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserEmptyPost;
