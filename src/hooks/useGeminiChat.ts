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

    const apiKey = typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '';
    
    if (!apiKey) {
      const errorMsg: Message = {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: '⚠️ API kalit topilmadi. Iltimos, GEMINI_API_KEY ni sozlang.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

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
      const ai = new GoogleGenAI({ apiKey });

      // Build conversation history for context
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContentStream({
        model: 'gemini-2.0-flash',
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
          { role: 'model', parts: [{ text: 'Tushundim! Men Sarvarning AI yordamchisiman. Yordam berishga tayyorman.' }] },
          ...history,
          { role: 'user', parts: [{ text: userMessage }] },
        ],
      });

      let fullText = '';
      
      for await (const chunk of response) {
        if (abortRef.current) break;
        const text = chunk.text || '';
        fullText += text;
        setStreamingText(fullText);
      }

      if (!abortRef.current) {
        const assistantMsg: Message = {
          id: Date.now().toString() + '-assistant',
          role: 'assistant',
          content: fullText,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (error: any) {
      console.error('Gemini API error:', error);
      const errorMsg: Message = {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: `❌ Xatolik yuz berdi: ${error?.message || 'Noma\'lum xatolik'}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setStreamingText('');
    }
  }, [messages, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setStreamingText('');
    abortRef.current = true;
  }, []);

  return { messages, isLoading, streamingText, sendMessage, clearChat };
}
