import { useState } from 'react';
import './App.css';

type Message = {
  role: 'user' | 'system';
  content: string;
};

function App() {
  const [history, setHistory] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');

  const handleChat = async () => {
    setPrompt('');
    await handleConnect();
  };

  const handleConnect = async () => {
    const tempHistory: Message[] = [
      ...history,
      { role: 'user', content: prompt },
    ];
    setHistory(tempHistory);

    const response = await fetch('http://localhost:3030/chat', {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tempHistory),
    });
    const reader = response.body?.getReader() as ReadableStreamDefaultReader;

    let answer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const data = new TextDecoder().decode(value);
      answer += data;
      setHistory((prev) => [
        ...(prev[prev.length - 1].role === 'user' ? prev : prev.slice(0, -1)),
        { role: 'system', content: answer },
      ]);
    }
  };

  return (
    <div>
      {history.map((msg) => (
        <p key={msg.content}>{msg.content}</p>
      ))}
      <input
        type='text'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleChat}>Chat</button>
    </div>
  );
}

export default App;
