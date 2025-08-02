import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Trash2, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIProvider } from "./ApiKeyModal";

interface ChatHeaderProps {
  provider?: AIProvider;
  messageCount: number;
  onSettingsClick: () => void;
  onClearChat: () => void;
  className?: string;
}

export const ChatHeader = ({ 
  provider, 
  messageCount, 
  onSettingsClick, 
  onClearChat,
  className 
}: ChatHeaderProps) => {
  const providerNames = {
    openai: 'OpenAI',
    anthropic: 'Anthropic',
    gemini: 'Gemini'
  };

  return (
    <header className={cn(
      "flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-gradient-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-foreground">AI Assistant</h1>
            <div className="flex items-center gap-2">
              {provider && (
                <Badge variant="outline" className="text-xs">
                  {providerNames[provider]}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {messageCount} messages
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearChat}
          disabled={messageCount === 0}
          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          title="Clear conversation"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className="h-8 w-8"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};