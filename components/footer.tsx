import React from "react";
import { Github, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4">MindJourney</h3>
            <p className="text-gray-600 mb-4">Empowering minds through transformative experiences and personal growth.</p>
            <div className="flex gap-4">
              <a href="#" className="text-primary hover:text-secondary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-primary hover:text-secondary transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-primary hover:text-secondary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-secondary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-secondary transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-secondary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-secondary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-secondary transition-colors">
                  Mental Wellness
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-secondary transition-colors">
                  Personal Growth
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-secondary transition-colors">
                  Mindfulness
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-secondary transition-colors">
                  Coaching
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span>info@mindjourney.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <span>123 Wellness Street, Mind City</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} MindJourney. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-600 hover:text-secondary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-secondary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-secondary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
