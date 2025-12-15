import db from "../config/db.js";

class Alert {
  constructor(alert_id, user_id, message, timeStamp) {
    this.alert_id = alert_id;
    this.user_id = user_id;
    this.message = message;
    this.timeStamp = timeStamp;
  }

  async insertAlert() {
    const sql = `
      INSERT INTO alert (alert_id, user_id, message, timeStamp)
      VALUES (?, ?, ?, ?)
    `;
    return db.promise().query(sql, [
      this.alert_id,
      this.user_id,
      this.message,
      this.timeStamp,
    ]);
  }

  static async getAlertByUser(user_id) {
    const sql = "SELECT * FROM alert WHERE user_id = ? ORDER BY timeStamp DESC";
    return db.promise().query(sql, [user_id]);
  }
}

export default Alert;
