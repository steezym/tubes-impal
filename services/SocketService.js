import { io } from "socket.io-client";

export default class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    this.socket = io("http://10.0.2.2:4000", {
      transports: ["websocket"],
      query: { userId },
    });

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket.id);
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  onMessage(handler) {
    if (!this.socket) return;
    this.socket.on("new_message", handler);
  }

  offMessage(handler) {
    if (!this.socket) return;
    this.socket.off("new_message", handler);
  }

  sendMessage(data) {
    if (!this.socket) return;
    this.socket.emit("send_message", data);
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
  }
}
