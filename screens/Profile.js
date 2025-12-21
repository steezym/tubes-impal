import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Post from '../assets/components/Post/index';
import MessageIcon from '../assets/icons/message.png';

// ambil inisial dari nama untuk pp
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ').filter(Boolean);
  const first = parts[0]?.charAt(0).toUpperCase() || '';
  const second = parts[1]?.charAt(0).toUpperCase() || '';
  return (first + second).slice(0, 2);
};

export default function Profile() {
    //tarik data
    const route = useRoute();
    const navigation = useNavigation();
    const { me, other, otherName } = route.params;
    const [post, setPost] = useState([]);

    const API_URL = 'http://10.0.2.2:4000';

    const getPostDataByUser = async other => {
    await axios
      .get(
        `${API_URL}/post/user/${other}`,
      )
      .then(res => {
        setPost(res.data.data);
      })
      .catch(err => console.log(err.message));
    };

    useEffect(() => {
        getPostDataByUser(other);
      },[]);

    return(
    <LinearGradient
      style={{ height: '100%' }}
      colors={['#ffff', '#ffff', '#C2E86A']}
    >
    <ScrollView style={styles.content}>
        {/*Header*/}
        <View style={styles.header}>
            <View style={styles.topheader}>
                {/*Button Back*/}
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.back}>←</Text>
                </TouchableOpacity>
                {/*Button Chat*/}
                <TouchableOpacity
                    onPress={() => {
                    navigation.navigate("Chat", {
                    me: me,
                    other: other,
                    otherName: otherName,
                    })
                }}
                >
                    <Image
                        source={MessageIcon}
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: '#87A347',
                        }}
                    />
                </TouchableOpacity>
            </View>
            {/* profile picture dibawah */}
            <View style={styles.card}>
                <View style={[styles.avatar, { backgroundColor: '#87A347' }]}>
                    <Text style={styles.avatarText}>{getInitials(otherName)}</Text>
                </View>
                <Text style={styles.username}>{otherName}</Text>
            </View>
        </View>
        {/*End of header*/}
        <View style={styles.post}>
          {post.map(data => {
            return (
              <Post
                key={data.post_id}
                postId={data.post_id}
                username={data.name}
                date={data.timestamp}
                caption={data.content}
                image={data.file}
              />
            );
          })}
        </View>
    </ScrollView>
    </LinearGradient>
    )
};

const styles = StyleSheet.create({
    content:{
        flex:1,
    },
    header:{
      padding: 10,
    },
    topheader:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    back: { 
        fontSize: 26 
    },
    logoutIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#87A347',
    width: 50,
    height: 50,
    borderRadius: 25,
    },
    card: {
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 2,
        paddingVertical: 10,
        borderColor: "#b1b1b1ff",
        borderBottomWidth: .3,
    },
    avatar: { 
        width: 80, 
        height: 80, 
        borderRadius: 40, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginRight: 8, 
        marginBottom: 15,
    },
    avatarText: { 
        color: '#fff', 
        fontWeight: '700',
        fontSize: 30,
    },
    username:{
        fontSize: 20,
        fontWeight: 'bold',
    },
    post:{
      padding: 30,
    }
});