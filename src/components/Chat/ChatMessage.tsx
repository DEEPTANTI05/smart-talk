import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export const ChatMessage = ({ message, isTyping = false }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div
      className={cn(
        "flex w-full gap-3 px-4 py-6 transition-smooth",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border-2 border-primary/20">
          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={cn(
          "group relative max-w-[80%] rounded-2xl px-4 py-3 shadow-message",
          "transition-smooth hover:scale-[1.02]",
          isUser
            ? "bg-chat-bubble-user text-chat-bubble-user-foreground ml-auto"
            : "bg-chat-bubble-ai text-chat-bubble-ai-foreground"
        )}
      >
        <div className="prose prose-sm max-w-none text-current">
          {isTyping ? (
            <TypingIndicator />
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          )}
        </div>
        
        <div
          className={cn(
            "mt-2 text-xs opacity-60",
            isUser ? "text-right" : "text-left"
          )}
        >
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 border-2 border-primary/20">
          <AvatarFallback className="bg-muted text-muted-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-center gap-1">
    <span className="text-sm text-muted-foreground">AI is typing</span>
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2 w-2 rounded-full bg-chat-typing animate-pulse"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  </div>
);