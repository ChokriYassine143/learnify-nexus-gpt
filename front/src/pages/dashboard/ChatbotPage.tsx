import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Paperclip, SmilePlus } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { chatService } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types";
import { aiService } from '@/services/aiService';

const ChatbotPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to use the chatbot",
        variant: "destructive"
      });
      return;
    }

    // Add user message
    const newUserMsg: Message = { role: 'user', content: userInput };
    setMessages(prev => [...prev, newUserMsg]);
    
    try {
      // Save user message
      await chatService.addMessage(user.id, newUserMsg);
      
      setIsTyping(true);
      
      try {
        // Generate AI response
        const prompt = aiService.formatPrompt(userInput);
        const response = await aiService.generateResponse(prompt);
        
        const assistantMsg: Message = { role: 'assistant', content: response };
        
        // Save assistant message
        await chatService.addMessage(user.id, assistantMsg);
        setMessages(prev => [...prev, assistantMsg]);
      } catch (error) {
        console.error("Error generating AI response:", error);
        toast({
          title: "Error",
          description: "Failed to generate response. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsTyping(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
    
    setUserInput('');
  };

  // Load conversation on mount
  React.useEffect(() => {
    const loadConversation = async () => {
      if (!user?.id) {
        // Set default welcome message if no user
        const welcomeMessage: Message = {
          role: 'assistant',
          content: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider avec vos cours et apprentissage aujourd'hui ?"
        };
        setMessages([welcomeMessage]);
        return;
      }

      try {
        const conv = await chatService.getConversation(user.id);
        if (Array.isArray(conv) && conv.length > 0) {
          setMessages(conv);
        } else {
          // Default welcome message
          const welcomeMessage: Message = {
            role: 'assistant',
            content: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider avec vos cours et apprentissage aujourd'hui ?"
          };
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error("Error loading conversation:", error);
        toast({
          title: "Error",
          description: "Failed to load conversation history",
          variant: "destructive"
        });
        // Set default welcome message on error
        const welcomeMessage: Message = {
          role: 'assistant',
          content: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider avec vos cours et apprentissage aujourd'hui ?"
        };
        setMessages([welcomeMessage]);
      }
    };

    loadConversation();
  }, [user, toast]);

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Assistant IA</h1>
          <p className="text-gray-600 mt-2">Posez vos questions et obtenez de l'aide</p>
        </div>
        
        <Card className="h-[600px] flex flex-col">
          <CardContent className="flex-1 flex flex-col p-6">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 max-h-[400px]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center mb-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span className="font-semibold">Assistant</span>
                      </div>
                    )}
                    <p className="break-words whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                    <div className="flex items-center mb-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span className="font-semibold">Assistant</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t pt-4 mt-auto">
              <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                <Textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Posez votre question..."
                  className="flex-1 min-h-[80px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button type="button" size="icon" variant="ghost">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="icon" variant="ghost">
                      <SmilePlus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button type="submit" className="px-4">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default ChatbotPage;
