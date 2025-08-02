import { useState, useEffect } from "react";
import { ChatContainer } from "@/components/Chat/ChatContainer";
import { ChatInput } from "@/components/Chat/ChatInput";
import { ChatHeader } from "@/components/Chat/ChatHeader";
import { ApiKeyModal, type AIProvider } from "@/components/Chat/ApiKeyModal";
import { useToast } from "@/hooks/use-toast";
import { aiService } from "@/services/aiService";
import type { Message } from "@/components/Chat/ChatMessage";

export const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<AIProvider | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    // Load saved credentials on component mount
    const hasCredentials = aiService.loadCredentials();
    if (hasCredentials) {
      setCurrentProvider(aiService.getProvider());
    } else {
      setShowApiModal(true);
    }
  }, []);

  const handleApiKeySubmit = (apiKey: string, provider: AIProvider) => {
    aiService.setCredentials(apiKey, provider);
    setCurrentProvider(provider);
    toast({
      title: "Success!",
      description: `Connected to ${provider}. You can now start chatting!`,
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!aiService.hasCredentials()) {
      setShowApiModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const response = await aiService.sendMessage(content, conversationHistory);

      if (response.error) {
        throw new Error(response.error);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });

      // If it's an authentication error, show the API key modal
      if (error instanceof Error && error.message.includes('401')) {
        setShowApiModal(true);
      }
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "Conversation history has been cleared.",
    });
  };

  const handleSettingsClick = () => {
    setShowApiModal(true);
  };

  return (
    <div className="flex flex-col h-screen bg-chat-bg">
      <ChatHeader
        provider={currentProvider}
        messageCount={messages.length}
        onSettingsClick={handleSettingsClick}
        onClearChat={handleClearChat}
      />
      
      <ChatContainer
        messages={messages}
        isTyping={isTyping}
        className="flex-1"
      />
      
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        disabled={!aiService.hasCredentials()}
        placeholder={
          aiService.hasCredentials() 
            ? "Type your message..." 
            : "Configure API key to start chatting..."
        }
      />

      <ApiKeyModal
        open={showApiModal}
        onOpenChange={setShowApiModal}
        onApiKeySubmit={handleApiKeySubmit}
      />
    </div>
  );
};