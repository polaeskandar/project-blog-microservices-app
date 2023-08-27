const { default: axios } = require('axios');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    await axios
      .post('http://event-bus-service:4002/events', {
        type: 'CommentUpdated',
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      })
      .catch((err) => console.log(err.message));
  }

  res.send({});
});

app.listen(4003, () => console.log('Listening on port 4003'));
