const express = require('express');
const cors = require('cors');
const chat = require('./chat');

const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const stream = await chat(req.body);
  for await (const chunk of stream) {
    res.write(chunk.choices[0]?.delta?.content || '');
  }
  res.end();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
