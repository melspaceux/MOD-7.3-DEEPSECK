import { useState } from 'react';
import { useGlobal } from '../context/global-context';

export function useOllama() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useGlobal();

  const sendMessage = async (prompt) => {
    setLoading(true);
    setError(null);

    dispatch({
      type: '@add_message',
      payload: { role: 'user', content: prompt }
    });

    dispatch({
      type: '@add_message',
      payload: { role: 'assistant', content: '' }
    });

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-r1:1.5b',
          prompt: prompt,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to Ollama. Make sure it is running.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const json = JSON.parse(line);
            if (json.response) {
              fullResponse += json.response;
              dispatch({
                type: '@update_last_message',
                payload: fullResponse
              });
            }
          } catch (e) {
            console.warn('Error parsing JSON chunk', e);
          }
        }
      }
    } catch (err) {
      console.error('Ollama Error:', err);
      setError(err.message);
      dispatch({
        type: '@update_last_message',
        payload: 'Error: ' + err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
}
