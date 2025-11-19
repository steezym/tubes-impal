import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';

import TrashIcon from '../../icons/trash_icon.png';
import PencilIcon from '../../icons/pencil_icon.png';
import SendIcon from '../../icons/message.png';
import axios from 'axios';

const Post = props => {
  const changeDate = date => {
    const indexOfT = date.indexOf('T');
    const dateWithoutTime = date.substring(0, indexOfT);
    return dateWithoutTime;
  };

  return (
    <View style={styles.content}>
      <View style={styles.userTimeWrapper}>
        <View style={styles.userWrapper}>
          <Text style={styles.userText}>{props.username}</Text>
        </View>
        <Text style={styles.timeText}>{changeDate(props.date)}</Text>
      </View>
      <Image
        source={{ uri: `http://192.168.100.23:8000/${props.image}` }}
        style={styles.upload}
      />
      <Text style={styles.text}>{props.caption}</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 10,
          marginTop: 25,
        }}
      >
        {props.selection === 'you' ? (
          <>
            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image source={PencilIcon} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={props.showModal}
              style={{
                backgroundColor: '#fff',
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image source={TrashIcon} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image source={SendIcon} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    marginVertical: 15,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    height: 'auto',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 11,
    },
    shadowOpacity: 25,
    shadowRadius: 26,
    elevation: 10,
  },
  userTimeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userWrapper: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  userText: {
    color: '#000',
    fontFamily: 'Inter_SemiBold',
    fontSize: 12,
  },
  timeText: {
    color: '#fff',
    fontFamily: 'Inter_SemiBold',
    fontSize: 12,
  },
  upload: {
    marginVertical: 20,
    width: 310,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  text: {
    color: '#ffff',
    fontFamily: 'Inter_Medium',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Post;
