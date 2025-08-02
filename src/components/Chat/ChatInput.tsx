import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput = ({ 
  onSendMessage, 
  isLoading = false, 
  placeholder = "Type your message...",
  disabled = false 
}: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || disabled) return;
    
    onSendMessage(message.trim());
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex gap-3 p-4">
        <div className="relative flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className={cn(
              "min-h-[50px] max-h-[120px] resize-none pr-12",
              "bg-chat-input border-border text-chat-input-foreground",
              "focus:ring-2 focus:ring-primary/30 focus:border-primary",
              "shadow-input transition-smooth"
            )}
            rows={1}
          />
          <div className="absolute right-2 bottom-2">
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || isLoading || disabled}
              className={cn(
                "h-8 w-8 rounded-full bg-gradient-primary",
                "hover:scale-110 transition-bounce",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};