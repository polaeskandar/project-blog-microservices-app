const express = require('express');
const cors = require('cors');
const axios = require('axios');

const { randomBytes } = require('crypto');
const app = express();
const commentsByPostId = {};

app.use(express.json());
app.use(cors());

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const postId = req.params.id;
  const { content } = req.body;

  const comments = commentsByPostId[postId] || [];

  comments.push({ id: commentId, content, status: 'pending' });
  commentsByPostId[postId] = comments;

  await axios.post('http://event-bus-service:4002/events', {
    type: 'CommentCreated',
    data: { id: commentId, content, postId, status: 'pending' },
  });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  console.log(type, data);

  if (type === 'CommentModerated') {
    const { id, postId, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    await axios
      .post('http://event-bus-service:4002/events', {
        type: 'CommentUpdated',
        data: { id, postId, status, content },
      })
      .catch((err) => console.log(err.message));
  }

  res.send({});
});

app.listen(4001, () => console.log('Listening on port 4001'));
