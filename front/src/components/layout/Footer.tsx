import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/b14b8995-4cec-4fca-af8c-857f1e9e3699.png" 
                alt="LearnUp Logo" 
                className="h-8 w-auto" 
              />
              <span className="text-xl font-bold bg-gradient-to-r from-learnup-blue1 to-learnup-blue2 bg-clip-text text-transparent">LearnUp</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Transforming education through innovative digital learning experiences. 
              LearnUp offers high-quality courses to help you achieve your 
              educational and professional goals.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-learnup-blue1 hover:text-learnup-blue5 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-learnup-blue1 hover:text-learnup-blue5 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-learnup-blue1 hover:text-learnup-blue5 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-learnup-blue1 hover:text-learnup-blue5 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-learnup-blue5">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/courses" className="text-gray-600 hover:text-learnup-blue1 transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-gray-600 hover:text-learnup-blue1 transition-colors">
                  Forum
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-learnup-blue5">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-learnup-blue1 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-learnup-blue1 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-learnup-blue5">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-learnup-blue1 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-learnup-blue1 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 hover:text-learnup-blue1 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} LearnUp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
