'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Bot, User, MapPin, DollarSign, 
  Star, Loader2, Sparkles, RefreshCw
} from 'lucide-react';

const EventConnectChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userContext, setUserContext] = useState({
    budget: null,
    location: null,
    serviceType: null,
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage(
          "👋 Hi! I'm your Event-Connect assistant.\n\n" +
          "I can help you find:\n" +
          "📸 Photographers\n" +
          "🎬 Production Houses\n" +
          "🍽️ Caterers\n" +
          "🎉 Event Managers\n" +
          "🎥 Cinematographers\n\n" +
          "Just tell me what you're looking for!"
        );
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (text, data = null) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      text,
      data,
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text,
      timestamp: new Date()
    }]);
  };

  // Smart extraction - understands context
  const extractInfo = (message) => {
    const lower = message.toLowerCase();
    let newContext = { ...userContext };
    
    // Extract SERVICE TYPE (most important - check first!)
    const servicePatterns = {
      'Photographers': ['photograph', 'photo', 'camera', 'picture', 'snap'],
      'Production Houses': ['production', 'studio', 'production house'],
      'Cinematographers': ['cinematograph', 'video', 'film', 'movie', 'videograph'],
      'Caterers': ['cater', 'food', 'cook', 'catering', 'meal'],
      'Event Management': ['event manage', 'event planner', 'planner', 'coordinator'],
      'Community Centers': ['community center', 'venue', 'hall', 'center']
    };

    for (const [service, keywords] of Object.entries(servicePatterns)) {
      if (keywords.some(kw => lower.includes(kw))) {
        newContext.serviceType = service;
        console.log('✅ Detected service:', service);
        break;
      }
    }

    // Extract LOCATION
    const locations = [
      'savar', 'dhaka', 'chittagong', 'sylhet', 'rajshahi', 'khulna', 
      'barisal', 'rangpur', 'mymensingh', 'comilla', 'gazipur', 
      'narayanganj', 'cox\'s bazar', 'noakhali', 'feni', 'brahmanbaria',
      'jessore', 'bogra', 'dinajpur', 'pabna', 'sirajganj', 'tangail'
    ];
    
    for (const loc of locations) {
      if (lower.includes(loc)) {
        newContext.location = loc.charAt(0).toUpperCase() + loc.slice(1);
        console.log('✅ Detected location:', newContext.location);
        break;
      }
    }

    // Extract BUDGET
    const budgetMatch = message.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|thousand|taka|tk|৳)?/i);
    if (budgetMatch) {
      let budget = parseFloat(budgetMatch[1].replace(/,/g, ''));
      if (lower.includes('k') || lower.includes('thousand')) {
        budget *= 1000;
      }
      newContext.budget = budget;
      console.log('✅ Detected budget:', budget);
    }

    return newContext;
  };

  // Determine what user wants
  const getIntent = (message, context) => {
    const lower = message.toLowerCase();

    // Check for specific intents
    if (lower.includes('all') || lower.includes('show') || lower.includes('list')) {
      if (context.serviceType || lower.includes('vendor')) {
        return 'SEARCH'; // Search for specific service
      }
    }

    if (lower.includes('review') || lower.includes('good') || lower.includes('best') || 
        lower.includes('top') || lower.includes('suggest') || lower.includes('recommend')) {
      return 'BEST_RATED';
    }

    if (lower.match(/\d+/) || lower.includes('budget') || lower.includes('cheap') || 
        lower.includes('afford') || lower.includes('under')) {
      return 'BUDGET';
    }

    if (lower.includes('near') || lower.includes('location') || lower.includes('area') ||
        context.location) {
      return 'LOCATION';
    }

    if (lower.includes('compar')) {
      return 'COMPARE';
    }

    if (lower.includes('help')) {
      return 'HELP';
    }

    // If user mentions a service, they want to search for it
    if (context.serviceType) {
      return 'SEARCH';
    }

    return 'GENERAL';
  };

  const fetchVendors = async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.serviceCategory) {
        params.append('serviceCategory', filters.serviceCategory);
      }
      if (filters.location) {
        params.append('location', filters.location);
      }
      if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice);
      }

      const url = `${process.env.NEXT_PUBLIC_API}/services/allservices${params.toString() ? '?' + params : ''}`;
      console.log('🔍 Fetching:', url);

      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.data) {
        console.log('✅ Found vendors:', data.data.length);
        return data.data;
      }
      return [];
    } catch (error) {
      console.error('❌ Fetch error:', error);
      return [];
    }
  };

  const handleMessage = async (userMessage) => {
    setIsTyping(true);

    // Extract info from message
    const newContext = extractInfo(userMessage);
    setUserContext(newContext);

    console.log('📝 Context:', newContext);

    // Determine intent
    const intent = getIntent(userMessage, newContext);
    console.log('🎯 Intent:', intent);

    await new Promise(resolve => setTimeout(resolve, 800));

    let response = '';
    let vendorData = null;

    try {
      switch (intent) {
        case 'SEARCH':
        case 'LOCATION':
        case 'BUDGET':
          // Build filters
          const filters = {};
          if (newContext.serviceType) filters.serviceCategory = newContext.serviceType;
          if (newContext.location) filters.location = newContext.location;
          if (newContext.budget) filters.maxPrice = newContext.budget;

          let vendors = await fetchVendors(filters);

          // Client-side filtering for precision
          if (newContext.budget) {
            vendors = vendors.filter(v => v.startingPrice && v.startingPrice <= newContext.budget);
          }
          if (newContext.location) {
            vendors = vendors.filter(v => 
              v.location && v.location.toLowerCase().includes(newContext.location.toLowerCase())
            );
          }

          // Sort by rating
          vendors = vendors.sort((a, b) => (b.rating || 0) - (a.rating || 0));

          if (vendors.length > 0) {
            // Build response message
            response = `✨ Found ${vendors.length} `;
            if (newContext.serviceType) response += newContext.serviceType;
            else response += 'vendors';
            
            if (newContext.location) response += ` in ${newContext.location}`;
            if (newContext.budget) response += ` under ৳${newContext.budget.toLocaleString()}`;
            
            response += ':\n\n';
            
            vendorData = vendors.slice(0, 10);
          } else {
            response = `😔 Sorry, I couldn't find any `;
            if (newContext.serviceType) response += newContext.serviceType;
            else response += 'vendors';
            
            if (newContext.location) response += ` in ${newContext.location}`;
            if (newContext.budget) response += ` under ৳${newContext.budget.toLocaleString()}`;
            
            response += '.\n\nWould you like to:\n';
            response += '• Try a different location?\n';
            response += '• Increase your budget?\n';
            response += '• See all available options?';
          }
          break;

        case 'BEST_RATED':
          const filters2 = {};
          if (newContext.serviceType) filters2.serviceCategory = newContext.serviceType;
          if (newContext.location) filters2.location = newContext.location;

          let topVendors = await fetchVendors(filters2);

          // Filter by location if specified
          if (newContext.location) {
            topVendors = topVendors.filter(v => 
              v.location && v.location.toLowerCase().includes(newContext.location.toLowerCase())
            );
          }

          // Filter high-rated only
          topVendors = topVendors.filter(v => (v.rating || 0) >= 4);

          // Sort by combined score
          topVendors = topVendors.sort((a, b) => {
            const aScore = ((a.vendorId?.adminRating || 0) * 2) + (a.rating || 0) + ((a.reviewCount || 0) * 0.1);
            const bScore = ((b.vendorId?.adminRating || 0) * 2) + (b.rating || 0) + ((b.reviewCount || 0) * 0.1);
            return bScore - aScore;
          });

          if (topVendors.length > 0) {
            response = `⭐ Here are the best `;
            if (newContext.serviceType) response += newContext.serviceType;
            else response += 'vendors';
            
            if (newContext.location) response += ` in ${newContext.location}`;
            
            response += ' (top-rated with great reviews):\n\n';
            
            vendorData = topVendors.slice(0, 8);
          } else {
            response = `I couldn't find highly-rated `;
            if (newContext.serviceType) response += newContext.serviceType;
            else response += 'vendors';
            
            if (newContext.location) response += ` in ${newContext.location}`;
            
            response += '.\n\nLet me show you all available options:';
            
            // Show all as fallback
            const allVendors = await fetchVendors(filters2);
            vendorData = allVendors.slice(0, 10);
          }
          break;

        case 'COMPARE':
          const filters3 = {};
          if (newContext.serviceType) filters3.serviceCategory = newContext.serviceType;

          let compareVendors = await fetchVendors(filters3);
          compareVendors = compareVendors
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 5);

          if (compareVendors.length >= 2) {
            response = `📊 Comparing top `;
            if (newContext.serviceType) response += newContext.serviceType;
            else response += 'vendors';
            response += ':\n\n';
            
            vendorData = compareVendors;
          } else {
            response = `Not enough vendors to compare. Showing available options:`;
            vendorData = compareVendors;
          }
          break;

        case 'HELP':
          response = `💡 I can help you find vendors! Try:\n\n`;
          response += `📸 "I need a photographer"\n`;
          response += `📍 "Find caterers in Dhaka"\n`;
          response += `💰 "Photographers under 30000 taka"\n`;
          response += `⭐ "Best event management companies"\n`;
          response += `🔍 "Show all production houses"\n\n`;
          response += `You can combine location, budget, and service type!`;
          break;

        default:
          response = `I can help you find vendors! What are you looking for?\n\n`;
          response += `Try saying:\n`;
          response += `• "I need a photographer"\n`;
          response += `• "Caterers in Dhaka"\n`;
          response += `• "Best production houses"\n`;
          response += `• "Show all vendors"`;
      }

    } catch (error) {
      console.error('❌ Error:', error);
      response = `Sorry, I encountered an error. Please try again.`;
    }

    setIsTyping(false);
    addBotMessage(response, vendorData);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    addUserMessage(userMessage);

    await handleMessage(userMessage);
  };

  const handleQuickAction = (action) => {
    addUserMessage(action);
    handleMessage(action);
  };

  const VendorCard = ({ vendor }) => (
    <div className="bg-white border border-cyan-200 rounded-xl p-4 hover:shadow-lg transition-all hover:border-cyan-400">
      <div className="flex gap-3">
        {vendor.image?.[0] && (
          <img 
            src={vendor.image[0]} 
            alt={vendor.companyName}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 mb-1 truncate">{vendor.companyName}</h4>
          <p className="text-xs text-gray-600 mb-2 truncate">{vendor.serviceCategory}</p>
          
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{(vendor.rating || 0).toFixed(1)}</span>
              <span className="text-xs text-gray-500">({vendor.reviewCount || 0})</span>
            </div>
            {vendor.vendorId?.adminRating > 0 && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-cyan-100 to-blue-100 px-2 py-0.5 rounded-full">
                <Sparkles size={10} className="text-cyan-600" />
                <span className="text-xs font-bold text-cyan-700">Admin: {vendor.vendorId.adminRating}/5</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1 text-gray-600 truncate">
              <MapPin size={12} />
              <span>{vendor.location || 'N/A'}</span>
            </div>
            {vendor.startingPrice > 0 && (
              <div className="flex items-center gap-1 font-bold text-cyan-600">
                <DollarSign size={12} />
                <span>৳{vendor.startingPrice.toLocaleString()}</span>
              </div>
            )}
          </div>

          <button 
            onClick={() => window.open(`/production-houses/${vendor.slug || vendor._id}`, '_blank')}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 group"
        >
          <MessageSquare className="w-7 h-7 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Event-Connect AI</h3>
                <p className="text-cyan-100 text-xs">Vendor finder assistant</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMessages([]);
                  setUserContext({ budget: null, location: null, serviceType: null });
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-all"
                title="Reset"
              >
                <RefreshCw className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}>
                    {message.type === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                  </div>

                  <div>
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>

                    {message.data?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.data.map(vendor => (
                          <VendorCard key={vendor._id} vendor={vendor} />
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-1 px-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="p-3 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'I need a photographer',
                  'Best caterers',
                  'Production houses in Dhaka',
                  'Help'
                ].map(action => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="text-xs px-3 py-1.5 bg-gradient-to-r from-cyan-100 to-blue-100 hover:from-cyan-200 hover:to-blue-200 text-cyan-700 font-semibold rounded-full transition-all"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventConnectChatbot;