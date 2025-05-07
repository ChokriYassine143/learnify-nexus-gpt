
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Paperclip, SmilePlus } from "lucide-react";
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
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulated response with common learning questions
    setTimeout(() => {
      setIsTyping(false);
      
      // Generate context-aware responses based on user input
      let response = "";
      const lowerCaseInput = userInput.toLowerCase();
      
      if (lowerCaseInput.includes("cours") || lowerCaseInput.includes("apprendre")) {
        response = "Nous avons plusieurs cours disponibles dans notre catalogue. Souhaitez-vous explorer des cours de programmation, design, ou peut-être marketing digital ? Vous pouvez également consulter vos cours inscrits depuis votre tableau de bord.";
      } else if (lowerCaseInput.includes("exercice") || lowerCaseInput.includes("devoir")) {
        response = "Les exercices sont essentiels pour renforcer votre apprentissage. Vous trouverez tous vos devoirs en cours dans la section 'Activités' de chaque cours. N'hésitez pas à demander de l'aide pour un exercice spécifique !";
      } else if (lowerCaseInput.includes("forum") || lowerCaseInput.includes("discussion")) {
        response = "Notre forum communautaire est un excellent endroit pour poser des questions et partager vos connaissances. Vous pouvez créer un nouveau sujet ou participer aux discussions existantes depuis la page Forum. Souhaitez-vous que je vous explique comment créer un nouveau sujet de discussion ?";
      } else if (lowerCaseInput.includes("quiz") || lowerCaseInput.includes("test")) {
        response = "Les quiz vous aident à évaluer votre compréhension. Vous pouvez accéder à tous les quiz disponibles depuis la section 'Évaluations' de chaque cours. N'oubliez pas que vous pouvez refaire les quiz autant de fois que nécessaire pour améliorer votre score !";
      } else {
        response = "Cette fonctionnalité sera implémentée dans le sprint 4 avec l'intégration réelle d'un modèle GPT. Pour l'instant, il s'agit d'une simulation de réponse. Posez-moi des questions sur vos cours, les devoirs, les forums ou les quiz pour voir d'autres réponses simulées.";
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant',
        content: response
      }]);
    }, 1500);
    
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
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
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
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
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
            
            <div className="border-t pt-4">
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
