import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  useCameraDevice,
  useCameraPermission,
  Camera,
} from 'react-native-vision-camera';

import { useNavigation } from '@react-navigation/native';

import { CameraRoll } from '@react-native-camera-roll/camera-roll';

import SwitchCamera from './assets/icons/switch-camera.png';
import LoadingBar from './assets/components/LoadingBar/index';

const CameraPage = ({ route }) => {
  const [cameraPosition, setCameraPosition] = useState('back');
  const [photo, setPhoto] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const device = useCameraDevice(cameraPosition, {
    physicalDevices: ['wide-angle-camera'],
  });

  const onError = useCallback(error => {
    console.log(error);
  }, []);

  const navigation = useNavigation();

  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      const req = requestPermission();
    }
  }, [hasPermission]);

  const camera = useRef(null);

  const takePhoto = async () => {
    try {
      setIsLoading(true);
      const photo = await camera.current.takePhoto();
      const test = await CameraRoll.save(`file://${photo.path}`, {
        type: 'photo',
      });
      setPhoto(photo);
      if (!route.params?.status) {
        navigation.replace('Post', {
          photoPath: photo.path,
        });
      } else {
        navigation.replace('EditPost', {
          newPhotoPath: photo.path,
          postData: route.params.postData,
        });
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <View
      enabled={true}
      behavior={'padding'}
      style={{
        backgroundColor: 'black',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isLoading ? <LoadingBar /> : <></>}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: 350,
          gap: 25,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.replace('Tabs');
          }}
          style={{
            backgroundColor: '#fff',
            height: 'auto',
            width: 'auto',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              color: '#000',
              fontFamily: 'Inter_Bold',
              fontSize: 16,
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
        <Text
          style={{ color: '#fff', fontFamily: 'Inter_SemiBold', fontSize: 18 }}
        >
          Capture Your Moment
        </Text>
      </View>
      <View
        style={{
          height: 250,
          width: 350,
          borderRadius: 30,
          overflow: 'hidden',
          marginTop: 50,
        }}
      >
        {hasPermission ? (
          <Camera
            onError={onError}
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
        ) : (
          <></>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 30,
          alignItems: 'center',
          marginLeft: 90,
        }}
      >
        <TouchableOpacity
          onPress={takePhoto}
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
        <TouchableOpacity
          onPress={() =>
            setCameraPosition(cameraPosition == 'back' ? 'front' : 'back')
          }
          style={{
            backgroundColor: 'white',
            width: 70,
            height: 70,
            marginTop: 40,
            borderRadius: 50,
            paddingHorizontal: 15,
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <Image source={SwitchCamera} style={{ height: 40, width: 40 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CameraPage;
