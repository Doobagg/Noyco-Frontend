'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth, useAgentProfile } from '../../store/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  TrashIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  ServerIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';

const DevChatTest = () => {
  const { user } = useAuth();
  const { profiles, currentProfile } = useAgentProfile();

  const [sessionId, setSessionId] = useState(null);
  // const [roomName, setRoomName] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  const [showDebug, setShowDebug] = useState(true);
  
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get session config similar to livekit page
  const getSessionConfig = () => {
    const activeProfile = currentProfile || (profiles && profiles.length > 0 ? profiles[0] : null);
    
    let userProfileId = 'profile_default';
    let participantName = user?.name || 'Developer';
    
    if (activeProfile) {
      userProfileId = activeProfile.user_profile_id;
      participantName = activeProfile.name || user?.name || 'Developer';
    }
    
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    
    return {
      conversation_id: `chat_test_${timestamp}_${randomId}`,
      individual_id: user?.role_entity_id || 'individual_default',
      user_profile_id: userProfileId,
      detected_agent: 'unknown',
      agent_instance_id: `agent_${timestamp}`,
      call_log_id: `call_${timestamp}`,
      participant_name: participantName,
      force_fresh_start: true,
      session_reset_timestamp: timestamp
    };
  };

  // Create session and connect
  const createSession = async () => {
    try {
      setIsConnecting(true);
      setMessages([]);
      
      addSystemMessage('Creating session...');
      
      const sessionConfig = getSessionConfig();
      
      // Create session via backend
      const response = await fetch('/api/v1/voice/voice-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionConfig)
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();
      setSessionId(data.session_id);
      // setRoomName(data.room_name);
      
      setDebugInfo({
        session_id: data.session_id,
        room_name: data.room_name,
        conversation_id: data.conversation_id,
        user_profile_id: data.user_profile_id,
        individual_id: data.individual_id
      });

      addSystemMessage(`✅ Session created: ${data.session_id}`);
      
      // Connect WebSocket
      await connectWebSocket(data.session_id);
      
    } catch (error) {
      console.error('Error creating session:', error);
      addSystemMessage(`❌ Error: ${error.message}`, 'error');
      setIsConnecting(false);
    }
  };

  // Connect to WebSocket
  const connectWebSocket = async (sid) => {
    return new Promise((resolve, reject) => {
      try {
        addSystemMessage('Connecting to WebSocket...');
        
        // Get WebSocket URL
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = process.env.NEXT_PUBLIC_API_URL 
          ? new URL(process.env.NEXT_PUBLIC_API_URL).host 
          : window.location.host;
        
        const wsUrl = `${wsProtocol}//${wsHost}/api/v1/voice/ws/voice-session/${sid}`;
        
        console.log('Connecting to:', wsUrl);
        
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          addSystemMessage('✅ Connected to chat processor');
          setIsConnected(true);
          setIsConnecting(false);
          wsRef.current = ws;
          resolve();
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          addSystemMessage('❌ WebSocket error', 'error');
          setIsConnected(false);
          setIsConnecting(false);
          reject(error);
        };
        
        ws.onclose = () => {
          console.log('WebSocket closed');
          addSystemMessage('⚠️ Connection closed');
          setIsConnected(false);
          wsRef.current = null;
        };
        
      } catch (error) {
        console.error('Error connecting WebSocket:', error);
        reject(error);
      }
    });
  };

  // Handle WebSocket messages
  const handleWebSocketMessage = (data) => {
    console.log('Received:', data);
    
    switch (data.type) {
      case 'connected':
        addSystemMessage(`Connected: ${data.message}`);
        break;
        
      case 'assistant_response':
        setIsProcessing(false);
        addMessage(data.text, 'assistant', {
          intent_status: data.intent_status,
          detected_intent: data.detected_intent,
          turn_count: data.turn_count
        });
        break;
        
      case 'error':
        setIsProcessing(false);
        addSystemMessage(`Error: ${data.message}`, 'error');
        break;
        
      case 'pong':
        // Heartbeat response
        break;
        
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  // Send message
  const sendMessage = () => {
    if (!inputMessage.trim() || !isConnected || isProcessing) return;
    
    const message = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to UI
    addMessage(message, 'user');
    
    // Send to WebSocket
    setIsProcessing(true);
    wsRef.current.send(JSON.stringify({
      type: 'user_message',
      text: message,
      timestamp: new Date().toISOString()
    }));
  };

  // Add message to chat
  const addMessage = (text, role, metadata = {}) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      role,
      timestamp: new Date().toISOString(),
      metadata
    }]);
  };

  // Add system message
  const addSystemMessage = (text, type = 'info') => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      role: 'system',
      type,
      timestamp: new Date().toISOString()
    }]);
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
  };

  // Disconnect
  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'disconnect' }));
      wsRef.current.close();
    }
    setIsConnected(false);
    setSessionId(null);
    // setRoomName(null);
    setMessages([]);
    setDebugInfo({});
  };

  // Handle enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden z-1000">
      <div className="h-full flex flex-col max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ChatBubbleLeftRightIcon className="w-7 h-7 md:w-8 md:h-8 text-indigo-600" />
                Developer Chat Test
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Test backend query processor without LiveKit (saves STT/TTS credits)
              </p>
            </div>
            
            {/* Connection Status */}
            <div className={`px-4 py-2 rounded-full flex items-center gap-2 shadow-sm ${
              isConnected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
              isConnecting ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
              'bg-gray-100 text-gray-600 border border-gray-300'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-500 animate-pulse' : 
                isConnecting ? 'bg-amber-500 animate-pulse' : 
                'bg-gray-400'
              }`} />
              <span className="text-sm font-medium">
                {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 overflow-hidden">
          {/* Main Chat Area */}
          <div className="lg:col-span-2 flex flex-col overflow-hidden">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-full">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 md:p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <ServerIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <div>
                    <h2 className="text-white font-semibold text-sm md:text-base">Chat Session</h2>
                    {sessionId && (
                      <p className="text-white/90 text-xs">ID: {sessionId.slice(-12)}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={clearChat}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Clear chat"
                  >
                    <TrashIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </button>
                  {isConnected && (
                    <button
                      onClick={disconnect}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      title="Disconnect"
                    >
                      <XMarkIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </button>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {!isConnected && messages.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <ChatBubbleLeftRightIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-base md:text-lg mb-4">No active session</p>
                      <button
                        onClick={createSession}
                        disabled={isConnecting}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isConnecting ? 'Creating Session...' : 'Create Session & Connect'}
                      </button>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${
                        msg.role === 'user' ? 'justify-end' : 
                        msg.role === 'system' ? 'justify-center' : 
                        'justify-start'
                      }`}
                    >
                      {msg.role === 'system' ? (
                        <div className={`px-4 py-2 rounded-full text-xs md:text-sm ${
                          msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
                          'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {msg.text}
                        </div>
                      ) : (
                        <div className={`max-w-[85%] md:max-w-[80%] ${
                          msg.role === 'user' ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-md' : 
                          'bg-white shadow-md border border-gray-200'
                        } rounded-2xl p-3 md:p-4`}>
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-semibold uppercase ${
                                  msg.role === 'user' ? 'text-white/90' : 'text-gray-700'
                                }`}>
                                  {msg.role === 'user' ? 'You' : 'Assistant'}
                                </span>
                                {msg.metadata?.intent_status && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    msg.role === 'user' 
                                      ? 'bg-white/20 border border-white/30 text-white' 
                                      : 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                                  }`}>
                                    {msg.metadata.intent_status}
                                  </span>
                                )}
                              </div>
                              <p className={`text-sm md:text-base whitespace-pre-wrap leading-relaxed ${
                                msg.role === 'user' ? 'text-white' : 'text-gray-800'
                              }`}>{msg.text}</p>
                              {msg.metadata?.detected_intent && (
                                <div className={`mt-2 text-xs rounded px-2 py-1 inline-block ${
                                  msg.role === 'user' 
                                    ? 'text-white/80 bg-white/20' 
                                    : 'text-purple-700 bg-purple-50 border border-purple-200'
                                }`}>
                                  Intent: {msg.metadata.detected_intent}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-3 md:p-4">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 md:p-4 bg-white border-t border-gray-200 flex-shrink-0">
                <div className="flex gap-2 md:gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isConnected ? "Type your message..." : "Create a session to start chatting"}
                    disabled={!isConnected || isProcessing}
                    className="flex-1 bg-white text-gray-900 border border-gray-300 rounded-xl px-3 md:px-4 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 placeholder:text-gray-400"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!isConnected || isProcessing || !inputMessage.trim()}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Panel */}
          <div className="lg:col-span-1 flex flex-col overflow-hidden">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h3 className="text-gray-900 font-semibold flex items-center gap-2 text-sm md:text-base">
                  <CheckCircleIcon className="w-5 h-5 text-indigo-600" />
                  Debug Info
                </h3>
                <button
                  onClick={() => setShowDebug(!showDebug)}
                  className="text-gray-500 hover:text-gray-900 text-xs md:text-sm transition-colors"
                >
                  {showDebug ? 'Hide' : 'Show'}
                </button>
              </div>

              {showDebug && (
                <div className="space-y-3 md:space-y-4">
                  {/* Session Info */}
                  {sessionId && (
                    <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2 border border-gray-200">
                      <h4 className="text-indigo-700 text-xs md:text-sm font-semibold mb-2">Session Details</h4>
                      {Object.entries(debugInfo).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-gray-500 text-xs uppercase">{key.replace(/_/g, ' ')}</span>
                          <span className="text-gray-900 text-xs md:text-sm font-mono break-all">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* User Info */}
                  <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2 border border-gray-200">
                    <h4 className="text-indigo-700 text-xs md:text-sm font-semibold mb-2">User Info</h4>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-xs uppercase">Name</span>
                      <span className="text-gray-900 text-xs md:text-sm">{user?.name || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-xs uppercase">Role Entity ID</span>
                      <span className="text-gray-900 text-xs md:text-sm font-mono break-all">
                        {user?.role_entity_id || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Profile Info */}
                  {currentProfile && (
                    <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2 border border-gray-200">
                      <h4 className="text-indigo-700 text-xs md:text-sm font-semibold mb-2">Active Profile</h4>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs uppercase">Name</span>
                        <span className="text-gray-900 text-xs md:text-sm">{currentProfile.name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs uppercase">Profile ID</span>
                        <span className="text-gray-900 text-xs md:text-sm font-mono break-all">
                          {currentProfile.user_profile_id}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2 border border-gray-200">
                    <h4 className="text-indigo-700 text-xs md:text-sm font-semibold mb-2">Stats</h4>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-xs">Messages</span>
                      <span className="text-gray-900 text-sm font-semibold">
                        {messages.filter(m => m.role !== 'system').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-xs">Status</span>
                      <span className={`text-sm font-semibold ${
                        isConnected ? 'text-emerald-600' : 'text-gray-500'
                      }`}>
                        {isConnected ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isConnected && (
                    <button
                      onClick={createSession}
                      disabled={isConnecting}
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                    >
                      {isConnecting ? 'Creating...' : 'New Session'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="mt-4 md:mt-6 bg-cyan-50 backdrop-blur-sm rounded-xl border border-cyan-200 p-3 md:p-4 flex-shrink-0">
              <div className="flex items-start gap-2 md:gap-3">
                <ExclamationCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-cyan-900 font-semibold mb-1 text-xs md:text-sm">Developer Mode</h4>
                  <p className="text-cyan-800 text-xs md:text-sm leading-relaxed">
                    This page bypasses LiveKit for testing. It connects directly to the backend 
                    query processor via WebSocket, saving STT/TTS credits while testing conversation logic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevChatTest;
