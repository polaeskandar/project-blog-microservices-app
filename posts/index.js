const express = require('express');
const cors = require('cors');
const axios = require('axios');

const { randomBytes } = require('crypto');
const app = express();
const posts = {};

app.use(express.json());
app.use(cors());

app.get('/posts', (_, res) => {
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = { id, title };

  await axios.post('http://event-bus-service:4002/events', {
    type: 'PostCreated',
    data: { id, title },
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  if (req.body.type === 'PostCreated') {
    console.log('Received event for post with id ' + req.body.data.id);
  }

  res.send({});
});

app.listen(4000, () => console.log('Listening on port 4000'));
