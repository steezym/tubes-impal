import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatService from '../services/ChatService';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import SocketService from '../services/SocketService';
console.log("ChatList FILE LOADED");

const dedupeChats = (arr) => {
  const map = new Map();

  arr.forEach(item => {
    map.set(item.user_id, item);
  });

  return Array.from(map.values());
};


export default function ChatList() {
  console.log("ChatList COMPONENT RENDERED");

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const socketRef = useRef(null);

  // get user from async storage
  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await AsyncStorage.getItem('user');
        if (data) setUser(JSON.parse(data));
      } catch (e) {
        console.log('getUser error', e);
      }
    };
    getUser();
  }, []);

  // load chats when user available
  useEffect(() => {
    if (user) loadChats();
  }, [user]);

  // refresh
  useEffect(() => {
    if (isFocused && user) {
      loadChats();
    }
  }, [isFocused, user]);

  // realtime updates
  useEffect(() => {
  if (!user) return;

  socketRef.current = new SocketService();
  socketRef.current.connect(user.id);

  const handler = (msg) => {
    console.log("push refresh:", msg);
    loadChats();
  };

  socketRef.current.onMessage(handler);

  return () => {
    socketRef.current.offMessage(handler);
    socketRef.current.disconnect();
  };
}, [user]);

  const loadChats = async () => {
  if (!user) return;
  try {
    console.log("loadChats DIPANGGIL");

    const res = await ChatService.getRecentChats(user.id);
    console.log("API RESPONSE:", res.data);

    const data = res?.data?.data ?? [];
    const sorted = data.sort(
      (a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)
    );

    setChats(sorted);
    console.log("chats state:", sorted);

  } catch (err) {
    console.log("loadChats error:", err);
  }
};


  const formatTime = (timeStamp) => {
    if (!timeStamp) return '';
    const date = new Date(timeStamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    if (isYesterday) return 'Yesterday';
    return date.toLocaleDateString('en-GB'); // dd/mm/yyyy
  };

  //untuk buat avatar dari inisial nama
  const getInitials = (name) => {
  if (!name) return '';

  const parts = name.split(' ');
  const first = parts[0]?.charAt(0).toUpperCase() || '';
  const second = parts[1]?.charAt(0).toUpperCase() || '';

  return first + second;
 };
console.log("chats state:", chats);

  return (
      <LinearGradient
            style={[{ height: '100%' }, styles.container]}
            colors={['#ffff', '#ffff', '#C2E86A']}>
      <ScrollView>
        <Text style={styles.title}>Chats</Text>

        {dedupeChats(chats)
  .filter(item => user && item.user_id !== user.id)
  .map(item => (
    <TouchableOpacity
      key={`chat-${item.user_id}`}
      style={styles.row}
      onPress={() =>
        navigation.navigate("Chat", {
          me: user.id,
          other: item.user_id,
          otherName: item.name,
        })
      }
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.lastMessage}</Text>
      </View>

      <Text style={styles.time}>{formatTime(item.timeStamp)}</Text>
    </TouchableOpacity>
  ))}

        <View style={{ padding: 30 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 40,
    marginBottom: 10,
    color: '#1f2937',
    fontFamily: 'Inter_SemiBold',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter_SemiBold',
    color: '#1f2937',
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter_Medium',
  },
  time: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter_Medium',
  },
  avatar: {
  width: 52,
  height: 52,
  borderRadius: 26,
  backgroundColor: '#87A347',
  alignItems: 'center',
  justifyContent: 'center',
},

avatarText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: '700',
},

});
