import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { contactService } from "@/services/contactService";
import { ContactMessage } from "@/types";

const ContactUs: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create contact message
      const contactMessage: ContactMessage = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: new Date().toISOString(),
        status: "pending"
      };
      
      // Send message through contact service
      await contactService.sendContactMessage(contactMessage);
      
      // Show success message
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll respond shortly.",
        duration: 5000
      });
      
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/80 to-primary/60 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-6">Contact Us</h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Have questions about our courses? Want to know more about LearnUp?
                We'd love to hear from you.
              </p>
            </div>
          </div>
          
          {/* Wave SVG */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 100"
              fill="white"
              preserveAspectRatio="none"
              className="h-12 w-full"
            >
              <path d="M0,0L40,6.7C80,13,160,27,240,33.3C320,40,400,40,480,33.3C560,27,640,13,720,13.3C800,13,880,27,960,40C1040,53,1120,67,1200,66.7C1280,67,1360,53,1400,46.7L1440,40V100H1400C1360,100,1280,100,1200,100C1120,100,1040,100,960,100C880,100,800,100,720,100C640,100,560,100,480,100C400,100,320,100,240,100C160,100,80,100,40,100H0V0Z" />
            </svg>
          </div>
        </section>
        
        {/* Contact Info and Form Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h2>
                  
                  {!formSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john.doe@example.com"
                          className="w-full"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help you?"
                          className="w-full"
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Please provide details about your inquiry..."
                          className="w-full min-h-[150px]"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div>
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
                      <p className="text-green-700">
                        Thank you for reaching out to us. We'll get back to you as soon as possible.
                      </p>
                      <Button
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setFormSubmitted(false);
                          setFormData({ 
                            name: user?.name || "", 
                            email: user?.email || "", 
                            subject: "", 
                            message: "" 
                          });
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
                  
                  <div className="space-y-8">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Email Us</h3>
                        <p className="text-gray-600 mt-1">
                          <a href="mailto:info@learnup.com" className="text-primary hover:underline">
                            info@learnup.com
                          </a>
                        </p>
                        <p className="text-gray-600 mt-1">
                          <a href="mailto:support@learnup.com" className="text-primary hover:underline">
                            support@learnup.com
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Call Us</h3>
                        <p className="text-gray-600 mt-1">
                          <a href="tel:+11234567890" className="text-primary hover:underline">
                            +1 (123) 456-7890
                          </a>
                        </p>
                        <p className="text-gray-600 mt-1">Monday - Friday, 9am - 6pm EST</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Visit Us</h3>
                        <p className="text-gray-600 mt-1">
                          123 Education Street<br />
                          Suite 101<br />
                          San Francisco, CA 94105
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Business Hours</h3>
                        <p className="text-gray-600 mt-1">
                          Monday - Friday: 9:00 AM - 6:00 PM<br />
                          Saturday: 10:00 AM - 4:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Find Us</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg">
                <div className="w-full h-[400px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                  <p className="text-center">
                    Interactive map would be embedded here.<br />
                    (Google Maps, Mapbox, etc.)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                {[
                  {
                    q: "How quickly do you respond to inquiries?",
                    a: "We strive to respond to all inquiries within 24-48 business hours. For urgent matters, please call our support line."
                  },
                  {
                    q: "Do you offer technical support for courses?",
                    a: "Yes, we provide technical support for all our courses. You can reach out to our dedicated support team via email or through the help center in your student dashboard."
                  },
                  {
                    q: "How can I become an instructor?",
                    a: "We're always looking for qualified instructors! Please send your resume and course proposal to instructors@learnup.com."
                  },
                  {
                    q: "Can I request a refund for a course?",
                    a: "Yes, we offer refunds within 30 days of purchase if you're unsatisfied with your course. Please check our refund policy for more details."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ContactUs;
