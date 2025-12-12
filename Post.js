import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Send from './assets/icons/send.png';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import ProgressBar from './assets/components/ProgressBar/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Post = ({ route }) => {
  const navigation = useNavigation();
  const photoPath = route.params.photoPath;
  const [caption, setCaption] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [charLength, setCharLength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userData, setUserData] = useState();

  const getUserData = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      setUserData(JSON.parse(value));
    } catch (err) {
      console.log(err.message);
    }
  };

  const validateAndUpload = val => {
    if (val.length === 0) {
      setErrorMessage('Add a caption, please!');
    } else if (val.length > 100) {
      setErrorMessage('Maximum caption length is 100 characters!');
    } else {
      uploadPost();
    }
  };

  const uploadPost = async () => {
    const fd = new FormData();
    fd.append('file', {
      name: 'file.jpg',
      uri: `file://${photoPath}`,
      type: 'image/jpg',
    });
    // Masih perlu diperbaiki agar input dinamis
    fd.append('content', caption);
    fd.append(
      'timestamp',
      new Date()
        .toISOString()
        .split('T')
        .join()
        .replace(',', ' ')
        .substr(0, 19),
    );
    fd.append('user_id', userData?.id);
    try {
      setIsLoading(true);
      await axios
        .post('http://10.0.2.2:4000/post/', fd, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: ({ loaded, total }) => {
            setProgress((loaded / total) * 100);
          },
        })
        .catch(err => setErrorMessage(err.response.data?.message));
      setIsLoading(false);
      navigation.replace('Tabs');
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getUserData('user');
  }, []);

  return (
    <KeyboardAvoidingView
      enabled={true}
      behavior={'padding'}
      style={{
        backgroundColor: 'black',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isLoading ? <ProgressBar progressValue={progress} /> : <></>}

      <View style={{ alignItems: 'center' }}>
        <Text
          style={{ color: '#fff', fontFamily: 'Inter_SemiBold', fontSize: 18 }}
        >
          Upload a Post
        </Text>
        <Image
          source={{ uri: `file://${photoPath}` }}
          style={{
            width: 350,
            height: 300,
            borderRadius: 30,
            overflow: 'hidden',
            marginTop: 60,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 35,
          }}
        >
          <TextInput
            placeholder="Enter your caption here!"
            placeholderTextColor={'#fff'}
            onChangeText={caption => {
              setCaption(caption);
              setCharLength(caption.length);
              setErrorMessage();
            }}
            style={{
              width: 280,
              height: 50,
              backgroundColor: '#373737ff',
              color: '#fff',
              fontSize: 14,
              fontFamily: 'Inter_Medium',
              paddingHorizontal: 15,
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: 15,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              validateAndUpload(caption);
            }}
            style={{
              backgroundColor: '#fff',
              width: 65,
              height: 50,
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image source={Send} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginVertical: 10,
            width: 330,
          }}
        >
          <Text style={{ fontFamily: 'Inter_Light', color: '#fff' }}>
            {charLength}/100
          </Text>
        </View>
        {errorMessage ? (
          <View style={{ marginVertical: 4 }}>
            <Text
              style={{
                color: '#ffff',
                fontFamily: 'Inter_Medium',
                fontSize: 14,
              }}
            >
              {errorMessage}
            </Text>
          </View>
        ) : (
          <></>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate('Camera')}
          style={{
            backgroundColor: 'white',
            width: 100,
            height: 100,
            marginTop: 40,
            borderRadius: 50,
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              borderWidth: 6,
              borderColor: 'black',
              width: 80,
              height: 80,
              borderRadius: 40,
              margin: 10,
            }}
          ></View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Post;
