import db from "../config/db.js";

class Chat {
  constructor(chat_id, sender_id, receiver_id, message, timeStamp) {
    this.chat_id = chat_id;
    this.sender_id = sender_id;
    this.receiver_id = receiver_id;
    this.message = message;
    this.timeStamp = timeStamp;
  }

  static getChats(userA, userB) {
    return new Promise((resolve, reject) => {
      db.query(
        `
        SELECT * FROM chat
        WHERE (sender_id=? AND receiver_id=?)
           OR (sender_id=? AND receiver_id=?)
        ORDER BY timeStamp ASC
        `,
        [userA, userB, userB, userA],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }

  static getRecentChats(user_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT 
        u.user_id,
        u.name,
        c.message AS lastMessage,
        c.timeStamp
      FROM chat c
      JOIN user u 
        ON u.user_id = 
          CASE 
            WHEN c.sender_id = ? THEN c.receiver_id
            ELSE c.sender_id
          END
      WHERE c.timeStamp = (
        SELECT MAX(timeStamp)
        FROM chat
        WHERE 
          (sender_id = c.sender_id AND receiver_id = c.receiver_id)
          OR
          (sender_id = c.receiver_id AND receiver_id = c.sender_id)
      )
      AND (c.sender_id = ? OR c.receiver_id = ?)
      ORDER BY c.timeStamp DESC;
      `,
      [user_id, user_id, user_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}

  insertChat() {
    return new Promise((resolve, reject) => {
      db.query(
        `
        INSERT INTO chat (chat_id, sender_id, receiver_id, message)
        VALUES (?, ?, ?, ?)
        `,
        [this.chat_id, this.sender_id, this.receiver_id, this.message],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }
}

export default Chat;
