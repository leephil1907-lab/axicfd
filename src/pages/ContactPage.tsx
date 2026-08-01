import { useState } from "react";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import TopBar from "@/sections/TopBar";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <TopBar /><Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600">We're here to help. Reach out through any channel below.</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-[#D31C2B]" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Support Hub</div>
                    <div className="text-sm text-gray-600">Online Help Center</div>
                    <div className="text-xs text-gray-500">24/7 Portal & Ticket Desk</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#D31C2B]" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-sm text-gray-600">support@axi-trading.com</div>
                    <div className="text-xs text-gray-500">Response within 24 hours</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-[#D31C2B]" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Live Chat</div>
                    <div className="text-sm text-gray-600">Available 24/7</div>
                    <div className="text-xs text-gray-500">Average response: 2 minutes</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#D31C2B]" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Office</div>
                    <div className="text-sm text-gray-600">Level 10, 90 Arthur Street</div>
                    <div className="text-sm text-gray-600">North Sydney, NSW 2060, Australia</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#D31C2B]" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Business Hours</div>
                    <div className="text-sm text-gray-600">Sunday 22:00 - Friday 22:00 GMT</div>
                    <div className="text-xs text-gray-500">Markets open 24/5</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h2>
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                  <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D31C2B]" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                  <input type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D31C2B]" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D31C2B]">
                    <option>General Inquiry</option>
                    <option>Account Issue</option>
                    <option>Deposit/Withdrawal</option>
                    <option>Trading Platform</option>
                    <option>Technical Support</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Message</label>
                  <textarea required rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D31C2B]" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#D31C2B] text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
