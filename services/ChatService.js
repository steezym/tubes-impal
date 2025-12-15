import axios from 'axios';

const API_URL = 'http://10.0.2.2:4000'; // ip emulator

export default {
  getChats: (a, b) =>
    axios.get(`${API_URL}/chat`, {
      params: { userA: a, userB: b, t: Date.now() },
    }),

  sendMessage: (sender, receiver, message) =>
    axios.post(`${API_URL}/chat`, {
      sender_id: sender,
      receiver_id: receiver,
      message,
    }),

  getRecentChats: (id, extraConfig = {}) =>
    axios.get(`${API_URL}/recent-chats`, {
      params: {
        user_id: id,
        t: Date.now(),
        ...(extraConfig.params || {})
      },
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        ...(extraConfig.headers || {})
     }
  }),
};
