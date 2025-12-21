import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import CameraIcon from '../../icons/camera.svg';

const PostButton = props => {
  return (
    <TouchableOpacity onPress={props.action} style={styles.wrapper}>
      <CameraIcon />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#87A347',
    bottom: 25,
    right: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 11,
    },
    shadowOpacity: 25,
    shadowRadius: 26,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

export default PostButton;
