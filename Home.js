import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Post from './assets/components/Post/index';
import LogoutIcon from './assets/icons/logout_svg.svg';
import UserEmptyPost from './assets/components/UserEmptyPost/index';
import PostButton from './assets/components/PostButton/index';
import axios from 'axios';
import Timer from './services/Timer';
import AlertModal from './Alert';
import { BackHandler } from 'react-native';
import { useRef } from 'react';

const Home = () => {
  const navigation = useNavigation();
  const [postSelection, setPostSelection] = useState('you');
  const [post, setPost] = useState([]);
  const [popUpShow, setPopUpShow] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [userData, setUserData] = useState();

  const getUserData = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      setUserData(JSON.parse(value));
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteDataUser = async key => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      console.log(err.message);
    }
  };

  const API_URL = 'http://10.0.2.2:4000'; // Ubah sesuai dengan IPv4 di ipconfig cmd

  const getPostDataByUser = async id => {
    await axios
      .get(
        `${API_URL}/post/${
          postSelection === 'you' ? 'user/' : 'exclude/'
        }${id}`,
      )
      .then(res => {
        setPost(res.data.data);
      })
      .catch(err => console.log(err.message));
  };

  const deletePost = async postId => {
    await axios
      .delete(`${API_URL}/post/${postId}`)
      .then(res => console.log('Delete post success!'));
  };

  const [showAlertModal, setShowAlertModal] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    getUserData('user');
  }, []);

  useEffect(() => {
    getPostDataByUser(userData?.id);
  }, [userData]);

  useEffect(() => {
    getPostDataByUser(userData?.id);
  }, [postSelection]);

  useEffect(() => {
  if (!userData) return;

  // buat timer baru
  timerRef.current = new Timer(() => {
    setShowAlertModal(true);

    axios.post(`${API_URL}/alert`, {
      user_id: userData.id,
      message: "User has used the app"
    }).catch(err => console.log("Alert error:", err.message));
  }, 120); // 120 test

  // mulai timer
  timerRef.current.start();

  return () => timerRef.current?.stop();

}, [userData]);

  return (
    <LinearGradient
      style={{ height: '100%' }}
      colors={['#ffff', '#ffff', '#C2E86A']}
    >
      {popUpShow ? (
        <DeleteModal
          deletePost={() => {
            deletePost(selectedId);
            setPopUpShow(false);
            setSelectedId();
          }}
          closeModal={() => {
            setPopUpShow(false);
            setSelectedId();
          }}
        />
      ) : (
        <></>
      )}

      <PostButton action={() => navigation.navigate('Camera')} />
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.textHeader}>Howdy, {userData?.name} 👋</Text>
              <Text style={styles.textSubHeader}>Glad to see you again!</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                deleteDataUser('user');
                navigation.replace('Login');
              }}
              style={styles.logoutIconWrapper}
            >
              <LogoutIcon />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginVertical: 10 }}>
            <TouchableOpacity
              onPress={() => setPostSelection('you')}
              style={
                postSelection === 'you'
                  ? styles.postSelectionActiveWrapper
                  : styles.postSelectionNonActiveWrapper
              }
            >
              <Text
                style={
                  postSelection === 'you'
                    ? styles.postSelectionActiveText
                    : styles.postSelectionNonActiveText
                }
              >
                You
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPostSelection('others')}
              style={
                postSelection === 'others'
                  ? styles.postSelectionActiveWrapper
                  : styles.postSelectionNonActiveWrapper
              }
            >
              <Text
                style={
                  postSelection === 'others'
                    ? styles.postSelectionActiveText
                    : styles.postSelectionNonActiveText
                }
              >
                Others
              </Text>
            </TouchableOpacity>
          </View>
          {post.map(data => {
            return (
              <Post
                key={data.post_id}
                postId={data.post_id}
                username={data.name}
                date={data.timestamp}
                caption={data.content}
                image={data.file}
                selection={postSelection}
                showModal={() => {
                  setPopUpShow(true);
                  setSelectedId(data.post_id);
                }}
              />
            );
          })}
          <AlertModal
            visible={showAlertModal}
            onSnooze={() => {
              setShowAlertModal(false);

              // stop timer lama
              timerRef.current?.stop();

              // buat timer baru
              timerRef.current = new Timer(() => {
                setShowAlertModal(true);
              }, 120);

              // mulai timer baru
              timerRef.current.start();
            }}
            onClose={() => BackHandler.exitApp()}
          />
          {post?.length > 0 ? (
            post.map(data => {
              return (
                <Post
                  key={data.post_id}
                  postId={data.post_id}
                  username={data.name}
                  date={data.timestamp}
                  caption={data.content}
                  image={data.file}
                  selection={postSelection}
                />
              );
            })
          ) : postSelection == 'you' ? (
            <UserEmptyPost action={() => navigation.navigate('Camera')} />
          ) : (
            <></>
          )}
          <View style={{ padding: 12 }}></View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  textHeader: {
    fontFamily: 'Inter_SemiBold',
    fontSize: 20,
  },
  textSubHeader: {
    fontFamily: 'Inter_Medium',
    fontSize: 14,
    color: '#848484',
  },
  logoutIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#87A347',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  postSelectionActiveWrapper: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  postSelectionActiveText: { color: '#fff', fontFamily: 'Inter_SemiBold' },
  postSelectionNonActiveWrapper: {
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  postSelectionNonActiveText: { color: '#000', fontFamily: 'Inter_SemiBold' },
});

export default Home;
