import { useState, useCallback, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const SYSTEM_PROMPT = `Sen Sarvarning shaxsiy AI yordamchisisan. Sen portfolio saytida joylashgansan.
Sarvar - professional frontend developer, 3+ yil tajribaga ega. 
U React, TypeScript, Node.js, Three.js, va boshqa zamonaviy texnologiyalar bilan ishlaydi.
Sen mehribon, professional va yordam berishga tayyor bo'lishingiz kerak.
Savollarga qisqa va aniq javob ber. Agar Sarvar haqida so'rasa, uning tajribasi va loyihalari haqida gapirib ber.
Agar texnik savol bo'lsa, professional darajada javob ber.
Har doim o'zbek, rus, ingliz yoki koreys tilida javob berishing mumkin — foydalanuvchi qaysi tilda yozsa, o'sha tilda javob ber.`;

export function useGeminiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const abortRef = useRef(false);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setStreamingText('');
    abortRef.current = false;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', content: m.content })),
          userMessage
        }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Chat xatosi');

      if (!abortRef.current) {
        const assistantMsg: Message = {
          id: Date.now().toString() + '-assistant',
          role: 'assistant',
          content: data.text,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: `❌ Xatolik: ${error.message}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setStreamingText('');
    abortRef.current = true;
  }, []);

  return { messages, isLoading, streamingText, sendMessage, clearChat };
}
