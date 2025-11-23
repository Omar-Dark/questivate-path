import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  context?: {
    roadmapId?: string;
    sectionId?: string;
  };
}

export const AIChat = ({ context }: AIChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [...messages, { role: 'user', content: userMessage }],
          context,
        },
      });

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response },
      ]);
    } catch (error) {
      console.error('AI chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full h-14 w-14 gradient-primary text-white border-0 shadow-lg"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-md"
          >
            <Card className="glass-card shadow-2xl">
              <div className="gradient-primary p-4 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-white" />
                  <h3 className="font-display font-semibold text-white">
                    AI Learning Assistant
                  </h3>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <ScrollArea ref={scrollRef} className="h-96 pr-4">
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center py-8 space-y-3">
                        <Sparkles className="h-12 w-12 mx-auto text-primary" />
                        <div>
                          <p className="font-semibold">How can I help you learn?</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Ask me about the current track, suggest projects, or explain concepts
                          </p>
                        </div>
                      </div>
                    )}

                    {messages.map((message, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'gradient-primary text-white'
                              : 'glass-surface'
                          }`}
                        >
                          {message.role === 'assistant' ? (
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {loading && (
                      <div className="flex justify-start">
                        <div className="glass-surface rounded-lg p-3">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything..."
                    disabled={loading}
                    className="glass-surface"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="gradient-primary text-white border-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
