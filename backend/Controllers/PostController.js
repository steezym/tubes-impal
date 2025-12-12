import Post from '../Models/Post.js';
import sendResponse from '../utils/sendResponse.js';
import postIdGenerator from '../utils/postIdGenerator.js';

class PostController {
  async getPost(req, res) {
    try {
      const post = new Post();

      // Destructuring dua array ke dalam variabel data dan _
      const [data, _] = await post.getPost();
      sendResponse(res, 200, {
        status: 'success',
        length: data.length,
        data: data,
      });
    } catch (err) {
      sendResponse(res, 500, {
        status: 'error',
        message: err.message,
      });
    }
  }

  async getPostsUser(req, res) {
    try {
      const userId = req.params.user_id;
      const post = new Post();

      // Destructuring dua array ke dalam variabel data dan _
      const [data, _] = await post.getPostByUserId(userId);

      sendResponse(res, 200, {
        status: 'success',
        length: data.length,
        data: data,
      });
    } catch (err) {
      sendResponse(res, 500, {
        status: 'error',
        message: err.message,
      });
    }
  }

  async getPostsExcludingUser(req, res) {
    try {
      const userId = req.params.user_id;
      const post = new Post();

      // Destructuring dua array ke dalam variabel data dan _
      const [data, _] = await post.getPostByUserExclusion(userId);
      sendResponse(res, 200, {
        status: 'success',
        length: data.length,
        data: data,
      });
    } catch (err) {
      sendResponse(res, 500, {
        status: 'error',
        message: err.message,
      });
    }
  }

  async uploadPost(req, res) {
    try {
      if (!req.body.content) {
        throw new Error('Caption cannot be empty!');
      }

      if (!req.body.user_id) {
        throw new Error('User is required!');
      }

      if (!req.body.timestamp) {
        throw new Error('Timestamp is required!');
      }

      if (req.body?.content?.length > 100) {
        throw new Error('Maximum length for the caption is 100 characters!');
      }
      const post_id = postIdGenerator();
      const post = new Post({
        post_id: post_id,
        content: req.body.content,
        file: req.file?.filename,
        timestamp: req.body.timestamp,
        user_id: req.body.user_id,
      });

      await post.createPost();
      sendResponse(res, 201, {
        status: 'success',
        message: 'Post successfully posted!',
      });
    } catch (err) {
      sendResponse(res, 500, {
        status: 'error',
        message: err.message,
      });
    }
  }

  async updatePost(req, res) {
    try {
      const post = new Post();

      // Destructuring dua array ke dalam variabel row dan _ (yang dibutuhkan rows)
      const [rows, _] = await post.getPostById(req.params.postId);

      // Mengambil item indeks pertama pada array rows
      const data = rows[0];

      if (!data) {
        throw new Error('Post not found!');
      }

      if (req.body?.content?.length > 100) {
        throw new Error('Maximum length for the caption is 100 characters!');
      }

      const newPost = new Post({
        post_id: data.post_id,
        content: req.body?.content ? req.body.content : data.content,
        file: req.file?.filename ? req.file.filename : data.file,
      });
      await newPost.editPost();

      sendResponse(res, 200, {
        status: 'success',
        message: 'Post updated successfully!',
      });
    } catch (err) {
      sendResponse(res, 500, {
        status: 'error',
        message: err.message,
      });
    }
  }

  async deletePost(req, res) {
    try {
      const post = new Post({ post_id: req.params.postId });
      await post.deletePost();
      res.status(204).end();
    } catch (err) {
      sendResponse(res, 500, {
        status: 'error',
        message: err.message,
      });
    }
  }
}

export default PostController;
