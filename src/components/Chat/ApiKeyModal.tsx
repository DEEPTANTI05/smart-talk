import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Key, AlertCircle } from "lucide-react";

export type AIProvider = 'openai' | 'anthropic' | 'gemini';

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeySubmit: (apiKey: string, provider: AIProvider) => void;
}

export const ApiKeyModal = ({ open, onOpenChange, onApiKeySubmit }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsLoading(true);
    try {
      onApiKeySubmit(apiKey.trim(), provider);
      setApiKey("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error setting API key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const providerInfo = {
    openai: {
      name: 'OpenAI',
      description: 'Get your API key from platform.openai.com',
      placeholder: 'sk-...'
    },
    anthropic: {
      name: 'Anthropic',
      description: 'Get your API key from console.anthropic.com',
      placeholder: 'sk-ant-...'
    },
    gemini: {
      name: 'Google Gemini',
      description: 'Get your API key from makersuite.google.com',
      placeholder: 'AI...'
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configure AI Provider
          </DialogTitle>
          <DialogDescription>
            Enter your API key to start chatting with AI. Your key is stored locally 
            and never sent to our servers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">AI Provider</Label>
            <Select 
              value={provider} 
              onValueChange={(value: AIProvider) => setProvider(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an AI provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
                <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apikey">API Key</Label>
            <div className="relative">
              <Input
                id="apikey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={providerInfo[provider].placeholder}
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>{providerInfo[provider].name}:</strong>{' '}
              {providerInfo[provider].description}
            </AlertDescription>
          </Alert>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!apiKey.trim() || isLoading}
              className="flex-1 bg-gradient-primary"
            >
              {isLoading ? "Saving..." : "Save & Start Chatting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};