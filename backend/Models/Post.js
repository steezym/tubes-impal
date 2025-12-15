import db from '../config/db.js';

class Post {
  constructor({
    post_id = null,
    content = null,
    file = null,
    timestamp = null,
    user_id = null,
  } = {}) {
    this.post_id = post_id;
    this.content = content;
    this.file = file;
    this.timestamp = timestamp;
    this.user_id = user_id;
  }

  getPost() {
    const SQLQuery =
      'SELECT post.post_id, user.user_id, user.name, post.content, post.file, post.timestamp FROM post INNER JOIN user ON post.user_id = user.user_id ORDER BY post.timeStamp DESC;';
    return db.promise().query(SQLQuery);
  }

  getPostById(id) {
    const SQLQuery = 'SELECT * FROM post WHERE post_id = ?;';
    return db.promise().query(SQLQuery, [id]);
  }

  createPost() {
    const SQLQuery = `INSERT INTO post(post_id, user_id, content, file, timestamp) VALUES(?,?,?,?,?)`;
    return db
      .promise()
      .query(SQLQuery, [
        this.post_id,
        this.user_id,
        this.content,
        this.file,
        this.timestamp,
      ]);
  }

  editPost() {
    const SQLQuery = 'UPDATE post SET content = ?, file= ? WHERE post_id = ?';
    return db
      .promise()
      .query(SQLQuery, [this.content, this.file, this.post_id]);
  }

  deletePost() {
    const SQLQuery = 'DELETE FROM post WHERE post_id = ?';
    return db.promise().query(SQLQuery, [this.post_id]);
  }

  getPostByUserId(id) {
    const SQLQuery =
      'SELECT post.post_id, user.name, post.content, post.file, post.timestamp FROM post INNER JOIN user ON post.user_id = user.user_id WHERE user.user_id=? ORDER BY post.timeStamp DESC;';
    return db.promise().query(SQLQuery, [id]);
  }

  getPostByUserExclusion(id) {
    const SQLQuery =
      'SELECT post.post_id, user.name, post.content, post.file, post.timestamp FROM post INNER JOIN user ON post.user_id = user.user_id WHERE NOT user.user_id=? ORDER BY post.timeStamp DESC;';
    return db.promise().query(SQLQuery, [id]);
  }
}

export default Post;
