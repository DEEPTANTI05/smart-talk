import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, type Message } from "./ChatMessage";
import { cn } from "@/lib/utils";

interface ChatContainerProps {
  messages: Message[];
  isTyping?: boolean;
  className?: string;
}

export const ChatContainer = ({ 
  messages, 
  isTyping = false, 
  className 
}: ChatContainerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const typingMessage: Message = {
    id: 'typing',
    content: '',
    role: 'assistant',
    timestamp: new Date()
  };

  return (
    <div className={cn("flex-1 overflow-hidden", className)}>
      <ScrollArea className="h-full" ref={scrollRef}>
        <div className="flex flex-col min-h-full">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center space-y-4 max-w-md">
                <div className="text-6xl mb-4">🤖</div>
                <h2 className="text-2xl font-bold text-foreground">
                  Welcome to AI Chat
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Start a conversation with our AI assistant. Ask questions, get help, 
                  or just have a friendly chat!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                />
              ))}
              {isTyping && (
                <ChatMessage 
                  message={typingMessage} 
                  isTyping={true}
                />
              )}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
};