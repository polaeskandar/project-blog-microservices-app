const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const events = [];

app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event);

  axios
    .post('http://posts-service:4000/events', event)
    .catch((err) => console.log(err.message));

  axios
    .post('http://comments-service:4001/events', event)
    .catch((err) => console.log(err.message));

  axios
    .post('http://moderation-service:4003/events', event)
    .catch((err) => console.log(err.message));

  axios
    .post('http://query-service:4004/events', event)
    .catch((err) => console.log(err.message));

  res.send({ status: 'OK' });
});

app.get('/events', (_, res) => {
  res.send(events);
});

app.listen(4002, () => {
  console.log('Listening on port 4002');
});
