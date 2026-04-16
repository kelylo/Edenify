import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { getEdenInsight } from '../services/gemini';

interface Message {
  id: string;
  role: 'user' | 'eden';
  content: string;
  timestamp: Date;
  feedback?: 'up' | 'down' | null;
}

interface EdenChatProps {
  context?: string;
  onClose?: () => void;
  theme?: 'light' | 'dark';
}

const QUICK_REPLIES = [
  'How do I build consistency?',
  'What should I focus on today?',
  'Help me with discipline',
  'I need motivation',
];

const renderMarkdown = (text: string) => {
  // Simple markdown rendering: **bold** and - bullet points
  return text
    .split('\n')
    .map((line, idx) => {
      let renderedLine = line;

      // Bold text: **text** -> <strong>text</strong>
      renderedLine = renderedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // Inline code: `code` -> <code>code</code>
      renderedLine = renderedLine.replace(/`(.*?)`/g, '<code>$1</code>');

      // Bullet points
      if (renderedLine.trim().startsWith('-')) {
        return (
          <li key={idx} className="ml-4">
            <div dangerouslySetInnerHTML={{ __html: renderedLine.replace(/^-\s*/, '') }} />
          </li>
        );
      }

      return (
        <div key={idx} dangerouslySetInnerHTML={{ __html: renderedLine }} />
      );
    });
};

export const EdenChat: React.FC<EdenChatProps> = ({
  context,
  onClose,
  theme = 'dark',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'eden',
      content: "Hey there. I'm Eden, your discipline coach. What's on your mind today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState(() => {
    // Persist input across conversations
    if (typeof window !== 'undefined') {
      return localStorage.getItem('edenChatDraft') || '';
    }
    return '';
  });
  const [loading, setLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Autofocus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const updateInputDraft = (value: string) => {
    setInput(value);
    // Persist input
    if (typeof window !== 'undefined') {
      localStorage.setItem('edenChatDraft', value);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    updateInputDraft('');
    setLoading(true);

    const edenMessageId = `eden-${Date.now()}`;

    try {
      // Create Eden message placeholder
      const edenMessage: Message = {
        id: edenMessageId,
        role: 'eden',
        content: '',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, edenMessage]);
      setStreamingMessageId(edenMessageId);

      // Get response from Gemini
      const prompt = `${context ? `Context: ${context}\n\n` : ''}User: ${textToSend}\n\nRespond as Eden, a wise and compassionate AI discipline coach. Be concise (1-3 sentences), actionable, and encouraging. Focus on practical next steps.`;
      const response = await getEdenInsight(prompt);

      // Simulate streaming by updating character by character
      const fullResponse = response || 'Keep going. You are building something beautiful through consistency.';
      let displayedText = '';

      for (let i = 0; i < fullResponse.length; i++) {
        displayedText += fullResponse[i];
        setMessages(prev =>
          prev.map(msg =>
            msg.id === edenMessageId
              ? { ...msg, content: displayedText }
              : msg
          )
        );
        // Delay between characters for streaming effect
        await new Promise(resolve => setTimeout(resolve, 20));
      }
    } catch (error) {
      console.error('Eden chat error:', error);
      const fallbackResponse = "I'm having trouble connecting right now. But remember: consistency beats perfection. Take one small step today.";
      setMessages(prev =>
        prev.map(msg =>
          msg.id === edenMessageId
            ? { ...msg, content: fallbackResponse }
            : msg
        )
      );
    } finally {
      setLoading(false);
      setStreamingMessageId(null);
      scrollToBottom();
    }
  };

  const provideFeedback = (messageId: string, feedback: 'up' | 'down') => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, feedback }
          : msg
      )
    );
  };

  const handleQuickReply = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <div className={cn(
      'flex flex-col h-full overflow-hidden rounded-2xl border',
      'bg-surface-container-highest border-outline-variant/30'
    )}>
      {/* Header - Minimalist with status */}
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
              <Sparkles size={24} className="text-primary" />
            </div>
            <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
          </div>
          <div>
            <p className="font-semibold text-sm text-on-surface">Eden</p>
            <p className="text-[10px] text-secondary flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Online
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close Eden chat"
            title="Close chat"
            className="p-2 hover:bg-surface-container-low rounded-lg transition-colors text-secondary"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Messages - Clean conversation thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-container-highest">
        {messages.map((message) => (
          <div key={message.id} className={cn(
            'flex gap-3 animate-in fade-in duration-300',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}>
            {/* Eden avatar */}
            {message.role === 'eden' && (
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles size={16} className="text-primary" />
              </div>
            )}

            <div className={cn('max-w-md', message.role === 'user' ? 'flex flex-col items-end' : '')}>
              {/* Message bubble */}
              <div
                className={cn(
                  'px-4 py-3 rounded-2xl text-sm leading-relaxed',
                  message.role === 'eden'
                    ? 'bg-surface-container-low text-on-surface rounded-bl-none'
                    : 'bg-primary text-white rounded-br-none'
                )}
              >
                <div className={message.role === 'eden' ? 'prose prose-sm dark:prose-invert' : ''}>
                  {message.role === 'eden' && message.content ? (
                    <div className="text-sm space-y-1">
                      {renderMarkdown(message.content)}
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>

              {/* Feedback buttons - Subtle thumbs for Eden messages */}
              {message.role === 'eden' && !loading && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => provideFeedback(message.id, 'up')}
                    className={cn(
                      'p-1.5 rounded-lg transition-all duration-200',
                      message.feedback === 'up'
                        ? 'bg-green-500/20 text-green-600'
                        : 'hover:bg-surface-container text-secondary hover:text-on-surface'
                    )}
                    title="Helpful"
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button
                    onClick={() => provideFeedback(message.id, 'down')}
                    className={cn(
                      'p-1.5 rounded-lg transition-all duration-200',
                      message.feedback === 'down'
                        ? 'bg-red-500/20 text-red-600'
                        : 'hover:bg-surface-container text-secondary hover:text-on-surface'
                    )}
                    title="Needs improvement"
                  >
                    <ThumbsDown size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Agentic UI - Show thinking state */}
        {loading && (
          <div className="flex gap-3 animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Loader2 size={16} className="text-primary animate-spin" />
            </div>
            <div className="bg-surface-container-low px-4 py-3 rounded-2xl rounded-bl-none text-sm text-secondary flex items-center gap-2">
              <span>Wait for me a second, I am thinking.</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:100ms]" />
                <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:200ms]" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick-Reply Chips - Suggested actions */}
      {messages.length === 1 && !loading && (
        <div className="px-6 py-3 border-t border-outline-variant/15 bg-surface-container-low">
          <p className="text-[10px] uppercase tracking-wide text-secondary font-bold mb-2">Quick replies</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => handleQuickReply(reply)}
                disabled={loading}
                className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface text-xs font-medium border border-outline-variant/30 hover:bg-primary/10 hover:border-primary/50 transition-all disabled:opacity-50"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Field - Minimalist bottom input */}
      <div className="border-t border-outline-variant/15 p-4 bg-surface-container-low">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => updateInputDraft(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
            autoFocus
            className="flex-1 bg-surface-container-highest text-on-surface placeholder:text-secondary/60 text-sm px-4 py-2.5 rounded-full border border-outline-variant/30 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={cn(
              'p-2.5 rounded-full transition-all duration-200 flex-shrink-0',
              input.trim()
                ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
                : 'bg-surface-container-highest text-secondary opacity-50 cursor-not-allowed'
            )}
            title="Send message"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-[10px] text-secondary/60 mt-2">Eden responds with discipline coaching and spiritual guidance</p>
      </div>
    </div>
  );
};
