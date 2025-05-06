
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider avec vos cours et apprentissage aujourd\'hui ?'
    }
  ]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    
    // Simulated response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant',
        content: "Cette fonctionnalité sera implémentée dans le sprint 4 avec l'intégration réelle d'un modèle GPT. Pour l'instant, il s'agit d'une simulation de réponse."
      }]);
    }, 1000);
    
    setUserInput('');
  };

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
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
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
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1"
              />
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
            </form>
          </CardContent>
        </Card>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default ChatbotPage;
