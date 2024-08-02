const OpenAI = require('openai');

const API_KEY = process.env.API_KEY;

const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: 'https://api.moonshot.cn/v1',
});

async function chat(history) {
  const completion = await client.chat.completions.create({
    model: 'moonshot-v1-8k',
    messages: history,
    temperature: 0.5,
    stream: true,
  });
  return completion;
}

module.exports = chat;
