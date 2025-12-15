import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import SocketService from '../services/SocketService';
import ChatService from '../services/ChatService';
import { useRoute, useNavigation } from '@react-navigation/native';

// ambil inisial dari nama untuk pp
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ').filter(Boolean);
  const first = parts[0]?.charAt(0).toUpperCase() || '';
  const second = parts[1]?.charAt(0).toUpperCase() || '';
  return (first + second).slice(0, 2);
};

// group messages per tanggal (dd/mm/yyyy)
const groupMessagesByDate = (messages) => {
  const groups = {};
  messages.forEach((msg) => {
    const dateObj = new Date(msg.timeStamp); 
    const dateKey = dateObj.toLocaleDateString('en-GB'); // dd/mm/yyyy
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(msg);
  });
  return groups;
};

export default function Chat() {
  const route = useRoute();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  if (!route.params) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Invalid chat session</Text>
      </View>
    );
  }

  const { me, other, otherName } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  // load history
  const loadHistory = async () => {
    try {
      const res = await ChatService.getChats(me, other);
      const data = res?.data?.data ?? res?.data ?? [];
      // sorted by time asc
      data.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
      setMessages(data);
    } catch (err) {
      console.log('loadHistory error', err?.message || err);
    }
  };

  useEffect(() => {
    loadHistory();

    const socket = new SocketService();
    socket.connect(me);
    socketRef.current = socket;

    const onMsg = (msg) => {
      if (msg.sender_id === me) return;
      // hanya terima pesan dari orang
      if (msg.sender_id === other && msg.receiver_id === me) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.onMessage(onMsg);

    return () => {
      try {
        socket.offMessage(onMsg);
        socket.disconnect();
      } catch (e) {}
    };
  }, []);

  const send = async () => {
  if (!text.trim()) return;

  const localTempId = `tmp-${Date.now()}`;

  setMessages(prev => [
    ...prev,
    {
      chat_id: localTempId,
      sender_id: me,
      receiver_id: other,
      message: text.trim(),
      timeStamp: new Date().toISOString(),
    }
  ]);

  const optimisticScroll = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };
  setTimeout(optimisticScroll, 50);

  setText("");

  try {
    const res = await ChatService.sendMessage(me, other, text.trim());

    const savedMsg = {
      chat_id: res.data.chat_id,
      sender_id: me,
      receiver_id: other,
      message: text.trim(),
      timeStamp: new Date(res.data.timestamp).toISOString(),
    };

    setMessages(prev =>
      prev.map(m => (m.chat_id === localTempId ? savedMsg : m))
    );

    
  } catch (err) {
    console.log("send error", err);
  }
};

  const groups = groupMessagesByDate(messages);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <View style={[styles.headerAvatar, { backgroundColor: '#87A347' }]}>
            <Text style={styles.headerAvatarText}>{getInitials(otherName)}</Text>
          </View>
          <Text style={styles.headerName}>{otherName}</Text>
        </View>
      </View>

      <View style={styles.topDivider} />

      <ScrollView ref={scrollViewRef}
  contentContainerStyle={styles.messagesWrap}
  onContentSizeChange={() => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }}>
        {Object.entries(groups).map(([date, msgs]) => (
          <View key={date}>
            <View style={styles.dateHeader}>
              <Text style={styles.dateHeaderText}>{date}</Text>
            </View>

            {msgs.map((item) => {
              const isMe = item.sender_id === me;
              const parsed = new Date(item.timeStamp);
              const time = isNaN(parsed)
                ? ""
                : parsed.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
              if (isMe) {
                return (
                  <View key={item.chat_id} style={styles.myRow}>
                    <View style={[styles.bubble, styles.myBubble]}>
  <Text style={styles.msg}>{item.message}</Text>
  <Text style={styles.msgTime}>{time}</Text>
</View>

                  </View>
                );
              }

              return (
                <View key={item.chat_id} style={styles.otherRow}>
                  <View style={[styles.avatar, { backgroundColor: '#87A347' }]}>
                    <Text style={styles.avatarText}>{getInitials(otherName)}</Text>
                  </View>

                  <View style={[styles.bubble, styles.otherBubble]}>
  <Text style={styles.msg}>{item.message}</Text>
  <Text style={styles.msgTime}>{time}</Text>
</View>

                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomDivider} />

      <View style={styles.inputBar}>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#b5b5b5"
            value={text}
            onChangeText={setText}
          />
        </View>

        <TouchableOpacity onPress={send} style={styles.sendBtn}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingTop: 18,
  },
  back: { 
    fontSize: 26 
  },
  headerTitle: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: 10 
  },
  headerAvatar: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  headerAvatarText: { 
    color: '#fff', 
    fontWeight: '700' 
  },
  headerName: { 
    marginLeft: 10, 
    fontSize: 18, 
    fontWeight: '700' 
  },

  topDivider: { 
    height: 1, 
    backgroundColor: '#e5e5e5' 
  },
  bottomDivider: { 
    height: 1, 
    backgroundColor: '#e5e5e5' 
  },

  messagesWrap: { 
    padding: 16, 
    paddingBottom: 8 
  },

  dateHeader: {
    alignSelf: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginVertical: 8,
  },
  dateHeaderText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '600' 
  },

  otherRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    marginVertical: 6 
  },
  myRow: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginVertical: 6 
  },

  avatar: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 8 
  },
  avatarText: { 
    color: '#fff', 
    fontWeight: '700' 
  },

  timeInsideBubble: { 
    fontSize: 10, 
    color: '#555', 
    alignSelf: 'flex-end', 
    marginTop: 6 
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  inputBox: { 
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: '#f4f4f4', 
    borderRadius: 20, 
    paddingHorizontal: 14 
  },
  textInput: { 
    height: 40, 
    fontSize: 15, 
    color: '#333' 
  },

  sendBtn: { 
    marginLeft: 10, 
    backgroundColor: '#8FD36F', 
    paddingHorizontal: 16, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  sendBtnText: { 
    color: '#fff', 
    fontWeight: '700' 
  },
  msg: {
  fontSize: 15,
  color: '#111',
  flexShrink: 1,
  maxWidth: "85%",
},

msgTime: {
  fontSize: 11,
  color: "#666",
  marginLeft: 6,
  alignSelf: "flex-end",
},

bubble: {
  flexDirection: "row",
  alignItems: "flex-end",
  maxWidth: "75%",
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 12,
  marginVertical: 6,
},

myBubble: {
  backgroundColor: "#C8F57B",
  alignSelf: "flex-end",
},

otherBubble: {
  backgroundColor: "#f2f2f2",
  alignSelf: "flex-start",
},

});
