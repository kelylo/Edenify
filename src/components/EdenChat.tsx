import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { getEdenInsight } from '../services/gemini';

interface Message {
  id: string;
  role: 'user' | 'eden';
  content: string;
  timestamp: Date;
}

interface EdenChatProps {
  context?: string;
  onClose?: () => void;
  theme?: 'light' | 'dark';
}

export const EdenChat: React.FC<EdenChatProps> = ({
  context,
  onClose,
  theme = 'dark',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'eden',
      content: "I'm Eden, your AI discipline coach. How can I help you today with your spiritual growth and daily discipline?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Get response from Gemini
      const prompt = `${context ? `Context: ${context}\n\n` : ''}User: ${input}\n\nRespond as Eden, a wise and compassionate AI discipline coach. Be concise (1-3 sentences), actionable, and encouraging. Focus on practical next steps.`;
      const response = await getEdenInsight(prompt);

      const edenMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'eden',
        content: response || 'Keep going. You are building something beautiful through consistency.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, edenMessage]);
    } catch (error) {
      console.error('Eden chat error:', error);
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'eden',
        content: "I'm having trouble connecting right now. But remember: consistency beats perfection. Take one small step today.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-highest rounded-2xl overflow-hidden border border-outline-variant/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Sparkles size={20} />
          <div>
            <p className="font-bold text-sm">Eden</p>
            <p className="text-[10px] opacity-90">AI Discipline Coach</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn('flex gap-3 animate-in fade-in duration-300',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'eden' && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles size={16} className="text-primary" />
              </div>
            )}

            <div
              className={cn(
                'max-w-xs px-4 py-2.5 rounded-xl text-sm leading-relaxed',
                message.role === 'eden'
                  ? 'bg-surface-container-low text-on-surface rounded-bl-none'
                  : 'bg-primary text-white rounded-br-none'
              )}
            >
              {message.content}
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 text-primary font-bold text-xs mt-1">
                You
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Loader2 size={16} className="text-primary animate-spin" />
            </div>
            <div className="bg-surface-container-low px-4 py-2.5 rounded-xl text-sm text-secondary">
              Eden is thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-outline-variant/20 p-3 bg-surface-container-low">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Eden for guidance..."
            disabled={loading}
            className="flex-1 bg-surface-container-lowest text-on-surface placeholder:text-secondary text-sm px-3 py-2 rounded-lg border border-outline-variant/40 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
