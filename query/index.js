const express = require('express');
const cors = require('cors');
const { default: axios } = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    posts[postId].comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    const comments = posts[postId].comments;
    const comment = comments.find((comment) => comment.id === id);
    comment.content = content;
    comment.status = status;
  }
};

app.get('/posts', (_, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

app.listen(4004, async () => {
  console.log('Listening on port 4004');

  try {
    const res = await axios.get('http://event-bus-service:4002/events');

    for (const event of res.data) {
      console.log('Handling event: ' + event.type);
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error);
  }
});
