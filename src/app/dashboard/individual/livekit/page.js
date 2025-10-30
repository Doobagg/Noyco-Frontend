'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Room, RoomEvent, Track } from 'livekit-client';
import { useAuth, useAgentProfile } from '../../../../store/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaperAirplaneIcon,
  PencilSquareIcon,
  XMarkIcon,
  CheckIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
} from '@heroicons/react/24/solid';

// Animated Amoeba/Blob component
const Amoeba = ({
  gradient,
  duration,
  delay,
  sizeClass,
  isActive = false,
  isListening = false,
}) => {
  const getAnimationProps = () => {
    if (isListening) {
      return {
        borderRadius: [
          '40% 60% 60% 40% / 50% 40% 60% 50%',
          '70% 30% 30% 70% / 30% 70% 30% 70%',
          '30% 70% 70% 30% / 70% 30% 70% 30%',
          '60% 40% 40% 60% / 40% 60% 40% 60%',
          '40% 60% 60% 40% / 50% 40% 60% 50%',
        ],
        scale: [1, 1.2, 0.7, 1.3, 0.85, 1],
        x: [0, 60, -40, 80, -60, 0],
        y: [0, -80, 60, -40, 70, 0],
        transition: {
          duration: duration * 0.25,
          delay: delay * 0.3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };
    } else if (isActive) {
      return {
        borderRadius: [
          '40% 60% 60% 40% / 50% 40% 60% 50%',
          '65% 35% 35% 65% / 35% 65% 35% 65%',
          '45% 55% 75% 25% / 25% 75% 25% 75%',
          '75% 25% 25% 75% / 65% 35% 65% 35%',
          '40% 60% 60% 40% / 50% 40% 60% 50%',
        ],
        scale: [1, 1.15, 0.8, 1.2, 0.9, 1],
        x: [0, 45, -30, 60, -45, 0],
        y: [0, -60, 45, -30, 50, 0],
        transition: {
          duration: duration * 0.5,
          delay: delay * 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };
    } else {
      return {
        borderRadius: [
          '40% 60% 60% 40% / 50% 40% 60% 50%',
          '60% 40% 40% 60% / 40% 60% 40% 60%',
          '50% 50% 70% 30% / 30% 70% 30% 70%',
          '70% 30% 30% 70% / 60% 40% 60% 40%',
          '40% 60% 60% 40% / 50% 40% 60% 50%',
        ],
        scale: [1, 1.1, 0.9, 1.05, 1],
        x: [0, 25, -25, 20, 0],
        y: [0, -20, 25, -15, 0],
        transition: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
      };
    }
  };

  const animationProps = getAnimationProps();

  return (
    <motion.div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${sizeClass}`}
      style={{
        background: gradient,
        filter: isListening
          ? 'blur(35px)'
          : isActive
          ? 'blur(42px)'
          : 'blur(50px)',
        opacity: isListening ? 0.8 : isActive ? 0.7 : 0.55,
        willChange: 'transform, border-radius',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        WebkitPerspective: 1000,
        perspective: 1000,
      }}
      animate={{
        borderRadius: animationProps.borderRadius,
        scale: animationProps.scale,
        x: animationProps.x,
        y: animationProps.y,
      }}
      transition={animationProps.transition}
    />
  );
};

// Mic Icon Button component
const MicIconButton = ({ onClick, isActive, isConnecting, isListening }) => {
  const getButtonState = () => {
    if (isConnecting) return 'connecting';
    if (isListening) return 'listening';
    if (isActive) return 'active';
    return 'idle';
  };

  const buttonState = getButtonState();

  const getButtonStyles = () => {
    switch (buttonState) {
      case 'connecting':
        return 'text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.5)]';
      case 'listening':
        return 'text-green-300 drop-shadow-[0_0_20px_rgba(134,239,172,0.8)] animate-pulse';
      case 'active':
        return 'text-blue-300 drop-shadow-[0_0_20px_rgba(147,197,253,0.6)]';
      default:
        return 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]';
    }
  };

  const getRingAnimation = () => {
    switch (buttonState) {
      case 'connecting':
        return 'animate-ping';
      case 'listening':
        return 'animate-pulse';
      case 'active':
        return 'animate-pulse';
      default:
        return '';
    }
  };

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ zIndex: 20 }}
    >
      {(isActive || isConnecting || isListening) && (
        <div
          className={`absolute inset-0 rounded-full border-2 ${
            buttonState === 'connecting'
              ? 'border-yellow-300/50'
              : buttonState === 'listening'
              ? 'border-green-300/50'
              : 'border-blue-300/50'
          } ${getRingAnimation()}`}
          style={{
            width: '80px',
            height: '80px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {(buttonState === 'connecting' || buttonState === 'listening') && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
          <div className="text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 backdrop-blur-sm shadow-md">
            {buttonState === 'connecting' && 'Connecting...'}
            {buttonState === 'listening' && '🎤 Listening'}
          </div>
        </div>
      )}

      <motion.button
        className={`mic-button-white flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 transition-all duration-300 ${getButtonStyles()}`}
        whileHover={{ scale: buttonState === 'idle' ? 1.1 : 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        disabled={isConnecting}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className={`w-10 h-10 transition-all duration-300 ${
            buttonState === 'listening' ? 'animate-pulse' : ''
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2.25a3.75 3.75 0 00-3.75 3.75v6a3.75 3.75 0 007.5 0v-6A3.75 3.75 0 0012 2.25z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5v.75a7.5 7.5 0 01-15 0v-.75M12 21v-3"
          />
        </svg>

        {isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-yellow-300/30 border-t-yellow-300 rounded-full animate-spin"></div>
          </div>
        )}
      </motion.button>
    </div>
  );
};

// Waveform Visualizer
// const WaveformVisualizer = ({ isActive }) => {
//   const bars = Array.from({ length: 30 }, (_, i) => i);
//   return (
//     <div className="flex items-center justify-center space-x-1 h-8 w-full max-w-xs mx-auto">
//       {bars.map((bar) => (
//         <div
//           key={bar}
//           className="bg-gradient-to-t from-blue-400 via-purple-400 to-pink-400 rounded-full transition-all duration-200 ease-out"
//           style={{
//             width: '2px',
//             height: isActive ? `${Math.random() * 20 + 4}px` : '3px',
//             opacity: isActive ? 0.8 : 0.3,
//             animationDelay: `${bar * 30}ms`,
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// Chat AI Component - Personal AI Agent
// WebSocket Connection: Connects to backend at NEXT_PUBLIC_WS_URL (e.g., ws://localhost:8000/api/v1/ws/chat)
// Message Format:
//   - Send: { type: 'message', text: string, conversation_id: string, timestamp: number }
//   - Receive: { type: 'response', text: string } or { type: 'error', message: string }
const ChatTherapist = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    profiles,
    currentProfile,
    isLoading: profilesLoading,
  } = useAgentProfile();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const conversationIdRef = useRef(null);
  const sessionIdRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus input when connected and after sending message
  useEffect(() => {
    if (isConnected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isConnected, isSending]);

  // Get session config
  const getSessionConfig = () => {
    const activeProfile =
      currentProfile || (profiles && profiles.length > 0 ? profiles[0] : null);

    let userProfileId = 'profile_default';
    let participantName = user?.name || 'User';

    if (activeProfile) {
      userProfileId = activeProfile.user_profile_id;
      participantName = activeProfile.name || user?.name || 'User';
    }

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);

    return {
      conversation_id: `chat_${timestamp}_${randomId}`,
      individual_id: user?.role_entity_id || 'individual_default',
      user_profile_id: userProfileId,
      detected_agent: 'mental_therapist',
      agent_instance_id: `agent_${timestamp}`,
      call_log_id: `call_${timestamp}`,
      participant_name: participantName,
      force_fresh_start: true,
      session_reset_timestamp: timestamp,
      mode: 'chat',
    };
  };

  // Connect to WebSocket
  const connectWebSocket = async () => {
    try {
      setIsConnecting(true);
      setConnectionStatus('connecting');

      const sessionConfig = getSessionConfig();
      conversationIdRef.current = sessionConfig.conversation_id;

      // Step 1: Create voice session first (like voice agent does)
      console.log('📞 Creating voice session...');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const createSessionResponse = await fetch(
        `${apiUrl}/api/v1/voice/voice-sessions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sessionConfig),
        }
      );

      if (!createSessionResponse.ok) {
        throw new Error('Failed to create voice session');
      }

      const sessionData = await createSessionResponse.json();
      const sessionId = sessionData.session_id;
      sessionIdRef.current = sessionId;

      console.log('✅ Voice session created:', sessionId);

      // Step 2: Now connect to WebSocket using the session_id
      const wsUrl =
        process.env.NEXT_PUBLIC_WS_URL +
        '/api/v1/voice/ws/voice-session/' +
        sessionId;

      // Add session_id to WebSocket URL
      const url = new URL(wsUrl);
      url.searchParams.append('session_id', sessionId);

      console.log('🔌 Connecting to WebSocket:', url.toString());

      const ws = new WebSocket(url.toString());
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionStatus('connected');

        // Send initial connection message with session info
        ws.send(
          JSON.stringify({
            type: 'connect',
            session_id: sessionId,
            data: sessionConfig,
          })
        );

        // Add welcome message
        setMessages([
          {
            sender: 'agent',
            text: "Hello! I'm your personal AI agent. I'm here to listen and support you. How are you feeling today?",
            timestamp: Date.now(),
          },
        ]);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📨 Received:', message);

          // Handle assistant response (type can be 'response' or 'assistant_response')
          if (
            (message.type === 'response' ||
              message.type === 'assistant_response') &&
            message.text
          ) {
            setMessages((prev) => [
              ...prev,
              {
                sender: 'agent',
                text: message.text,
                timestamp: Date.now(),
                intent_status: message.intent_status,
                detected_intent: message.detected_intent,
                turn_count: message.turn_count,
              },
            ]);
            setIsSending(false);
          } else if (message.type === 'error') {
            console.error('Error from server:', message.message);
            setMessages((prev) => [
              ...prev,
              {
                sender: 'system',
                text: 'Sorry, I encountered an error. Please try again.',
                timestamp: Date.now(),
              },
            ]);
            setIsSending(false);
          } else {
            // Log unhandled message types for debugging
            console.log('Unhandled message type:', message.type);
            setIsSending(false);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
          setIsSending(false);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionStatus('error');
        setIsConnecting(false);
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionStatus('disconnected');
        wsRef.current = null;

        // Attempt reconnection after 3 seconds if not manually disconnected
        if (connectionStatus !== 'disconnected') {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Attempting to reconnect...');
            connectWebSocket();
          }, 3000);
        }
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      setIsConnecting(false);
      setConnectionStatus('error');

      // Show error message to user
      setMessages([
        {
          sender: 'system',
          text: 'Failed to establish connection. Please try again.',
          timestamp: Date.now(),
        },
      ]);
    }
  };

  // Disconnect WebSocket
  const disconnectWebSocket = async () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Clean up voice session on backend
    if (sessionIdRef.current) {
      try {
        const agentUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        await fetch(
          `${agentUrl}/api/v1/voice/voice-sessions/${sessionIdRef.current}`,
          {
            method: 'DELETE',
          }
        );
        console.log('🗑️ Voice session cleaned up:', sessionIdRef.current);
        sessionIdRef.current = null;
      } catch (error) {
        console.error('Error cleaning up session:', error);
      }
    }

    setIsConnected(false);
    setConnectionStatus('disconnected');
    setMessages([]);
  };

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || !isConnected || isSending) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: userMessage,
        timestamp: Date.now(),
      },
    ]);

    try {
      // Send via WebSocket
      wsRef.current.send(
        JSON.stringify({
          type: 'user_message',
          text: userMessage,
          conversation_id: conversationIdRef.current,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'system',
          text: 'Failed to send message. Please try again.',
          timestamp: Date.now(),
        },
      ]);
      setIsSending(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, []);

  // const activeProfile =
  //   currentProfile || (profiles && profiles.length > 0 ? profiles[0] : null);
  const isProfileReady = !profilesLoading;

  return (
    <div className="flex flex-col bg-[#f8f7f1] h-[calc(100vh-215px)] ">
      {/* Header - Sticky */}
      <div className="flex-shrink-0 px-3 sm:px-4 md:px-6 py-3 sm:py-4 sticky top-0 bg-[#f8f7f1] z-10 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                Your Personal AI Agent
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Chat-based emotional support and guidance
              </p>
            </div>

            {!isConnected ? (
              <button
                onClick={connectWebSocket}
                disabled={isConnecting || !isAuthenticated || !isProfileReady}
                className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 shadow-lg whitespace-nowrap ${
                  isConnecting
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white cursor-wait'
                    : isAuthenticated && isProfileReady
                    ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-gray-300/30'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isConnecting ? (
                  <>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Start Session</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={disconnectWebSocket}
                className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg whitespace-nowrap"
              >
                <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>End Session</span>
              </button>
            )}
          </div>

          {isConnected && (
            <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-gray-600 font-medium">
                Connected - Your conversation is secure and private
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 overscroll-contain">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 min-h-full">
          {!isConnected && messages.length === 0 && (
            <div className="text-center py-8 sm:py-12 px-3">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] mb-4 shadow-lg">
                <ChatBubbleLeftRightIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                Start Your Session
              </h3>
              {/* Intro blurb removed to keep header compact */}
            </div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.sender === 'agent'
                  ? 'justify-start'
                  : msg.sender === 'system'
                  ? 'justify-center'
                  : 'justify-end'
              }`}
            >
              {msg.sender === 'system' ? (
                <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300/50 text-yellow-800 text-[10px] sm:text-xs font-medium shadow-md">
                  {msg.text}
                </div>
              ) : (
                <div
                  className={`max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[75%] px-4 py-3 sm:px-5 sm:py-4 rounded-2xl shadow-xl backdrop-blur-md border-2 ${
                    msg.sender === 'agent'
                      ? 'bg-gradient-to-br from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 border-purple-200/50'
                      : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800 border-blue-300/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        msg.sender === 'agent' ? 'bg-purple-500' : 'bg-blue-500'
                      }`}
                    ></div>
                    <div className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-80">
                      {msg.sender === 'agent' ? '� Noyco' : '👤 You'}
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words font-medium">
                    {msg.text}
                  </div>
                  <div className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-500 mt-1.5 sm:mt-2 opacity-70 font-medium">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {isSending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="px-4 py-3 sm:px-5 sm:py-4 rounded-2xl bg-gradient-to-br from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] border-2 border-purple-200/50 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Sticky Bottom */}
      {isConnected && (
        <div className="flex-shrink-0 border-t-2 border-gray-200/40 bg-gradient-to-r from-white/80 via-blue-50/20 to-purple-50/20 backdrop-blur-sm sticky bottom-0 z-10 shadow-lg">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <div className="flex gap-2 sm:gap-3">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your thoughts and feelings..."
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-2 border-gray-300/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 resize-none bg-white shadow-sm text-xs sm:text-sm"
                rows={2}
                disabled={isSending}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isSending}
                className={`flex items-center justify-center px-4 sm:px-6 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-lg ${
                  inputMessage.trim() && !isSending
                    ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-gray-300/30'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="mt-2 text-[10px] sm:text-xs text-gray-500 text-center">
              Press Enter to send • Shift + Enter for new line
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Voice Assistant Component
const ImprovedVoiceAssistant = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    profiles,
    currentProfile,
    fetchProfiles,
    isLoading: profilesLoading,
  } = useAgentProfile();

  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [debugStatus, setDebugStatus] = useState('Ready');
  const [turnCount, setTurnCount] = useState(0);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [initialGreetingReceived, setInitialGreetingReceived] = useState(false);

  // New states for manual send mode
  const [autoSendEnabled, setAutoSendEnabled] = useState(true);
  const [accumulatedTranscript, setAccumulatedTranscript] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState('');

  const roomRef = useRef(null);
  const sessionIdRef = useRef(null);

  // Get session config
  const getSessionConfig = () => {
    const activeProfile =
      currentProfile || (profiles && profiles.length > 0 ? profiles[0] : null);

    let userProfileId = 'profile_default';
    let participantName = user?.name || 'User';

    if (activeProfile) {
      userProfileId = activeProfile.user_profile_id;
      participantName = activeProfile.name || user?.name || 'User';
    }

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);

    return {
      conversation_id: `livekit_${timestamp}_${randomId}`,
      individual_id: user?.role_entity_id || 'individual_default',
      user_profile_id: userProfileId,
      detected_agent: 'unknown',
      agent_instance_id: `agent_${timestamp}`,
      call_log_id: `call_${timestamp}`,
      participant_name: participantName,
      force_fresh_start: true,
      session_reset_timestamp: timestamp,
    };
  };

  // Start voice session
  const startVoiceSession = async () => {
    try {
      setIsConnecting(true);
      setDebugStatus('Waking up assistant...');
      console.log(debugStatus)

      fetch(`${process.env.NEXT_PUBLIC_AGENT_URL}/warmup`).catch((err) =>
        console.warn('Warmup call failed but proceeding anyway:', err)
      );

      setDebugStatus('Creating session...');
      setDebugStatus('Creating session...');

      const sessionConfig = getSessionConfig();

      // Create session
      const response = await fetch('/api/v1/voice/voice-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionConfig),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();
      sessionIdRef.current = data.session_id;

      console.log('Session created:', data.session_id);
      setDebugStatus('Connecting to LiveKit...');

      // Create LiveKit room
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      roomRef.current = room;

      // Setup event handlers
      room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        console.log('Track subscribed:', track.kind, participant.identity);
        if (track.kind === Track.Kind.Audio) {
          const audioElement = track.attach();
          audioElement.autoplay = true;
          audioElement.playsInline = true;
          audioElement.muted = false;
          audioElement.style.display = 'none';
          document.body.appendChild(audioElement);

          const attempt = audioElement.play();
          if (attempt && attempt.catch) {
            attempt.catch((err) =>
              console.warn('Autoplay blocked, waiting for user gesture:', err)
            );
          }

          setIsBotSpeaking(true);
          setDebugStatus('Agent speaking');

          // Mark initial greeting as received and set recording to true when first audio plays
          if (!initialGreetingReceived) {
            console.log('✅ Initial greeting received, activating session');
            setInitialGreetingReceived(true);
            setIsConnecting(false);
            setIsRecording(true);
          }
        }
      });

      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        track.detach().forEach((el) => el.remove());
        setIsBotSpeaking(false);
        setIsListening(false);
        // Show "Ready" after initial greeting has been played
        if (initialGreetingReceived) {
          setDebugStatus('Ready - Your turn to speak');
        }
      });

      room.on(RoomEvent.DataReceived, (payload, participant) => {
        try {
          console.log('📦 Raw data received:', payload);
          console.log(participant);

          let message;
          if (typeof payload === 'string') {
            message = JSON.parse(payload);
          } else if (payload instanceof Uint8Array) {
            const decoder = new TextDecoder();
            const decoded = decoder.decode(payload);
            console.log('🔤 Decoded string:', decoded);
            message = JSON.parse(decoded);
          } else {
            console.warn('Unknown payload type:', typeof payload);
            return;
          }

          console.log('📩 Parsed message:', message);

          if (message.type === 'message') {
            const newMsg = {
              sender: message.sender,
              text: message.text,
              timestamp: message.timestamp || Date.now(),
            };
            console.log('💬 Adding message:', newMsg);
            setConversationMessages((prev) => {
              const updated = [...prev, newMsg];
              console.log('📝 Total messages:', updated.length);
              return updated;
            });

            if (message.sender === 'agent') {
              setCurrentMessage(message.text);
            }
          } else if (message.type === 'transcript_update') {
            // Handle accumulated transcript update from agent (manual mode)
            console.log('📝 Transcript update:', message.text);
            setAccumulatedTranscript(message.text);
            setCurrentMessage(message.text);
          } else if (message.type === 'transcript') {
            // Handle transcript in manual mode
            if (!autoSendEnabled) {
              setAccumulatedTranscript(
                (prev) => prev + (prev ? ' ' : '') + message.text
              );
              setCurrentMessage(message.text);
            } else {
              setCurrentMessage(message.text);
            }
          } else if (message.type === 'user_speech') {
            setIsListening(true);
            setTurnCount((prev) => prev + 1);
          } else if (message.type === 'agent_response') {
            setIsListening(false);
          }
        } catch (e) {
          console.error('❌ Error parsing data:', e, payload);
        }
      });

      room.on(RoomEvent.Connected, () => {
        console.log('Connected to room');
        // Keep connecting state until we receive first audio
        setDebugStatus('Waiting for agent greeting...');
      });

      room.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from room');
        setIsRecording(false);
        setIsConnecting(false);
        setDebugStatus('Disconnected');
      });

      // Connect to room
      await room.connect(data.url, data.token);

      // Enable microphone
      await room.localParticipant.setMicrophoneEnabled(true);

      console.log(
        'Voice session started successfully - waiting for initial greeting'
      );
    } catch (error) {
      console.error('Error starting voice session:', error);
      setDebugStatus('Error: ' + error.message);
      setIsConnecting(false);
      setIsRecording(false);
    }
  };

  // Stop voice session
  const stopVoiceSession = async () => {
    try {
      console.log('Stopping voice session');

      if (roomRef.current) {
        await roomRef.current.disconnect();
        roomRef.current = null;
      }

      if (sessionIdRef.current) {
        await fetch(`/api/v1/voice/voice-sessions/${sessionIdRef.current}`, {
          method: 'DELETE',
        });
        sessionIdRef.current = null;
      }

      setIsRecording(false);
      setIsConnecting(false);
      setIsListening(false);
      setIsBotSpeaking(false);
      setCurrentMessage('');
      setConversationMessages([]);
      setTurnCount(0);
      setDebugStatus('Ready');
      setAccumulatedTranscript('');
      setAutoSendEnabled(true);
      setInitialGreetingReceived(false);
    } catch (error) {
      console.error('Error stopping session:', error);
    }
  };

  // Manual send transcript
  const handleManualSend = async () => {
    const textToSend = isEditing ? editableText : accumulatedTranscript;
    if (!textToSend.trim() || !roomRef.current) return;

    try {
      console.log('📤 Manually sending transcript:', textToSend);

      // Send manual send command to agent (agent will process its buffer)
      const encoder = new TextEncoder();
      const data = encoder.encode(
        JSON.stringify({
          type: 'manual_send',
          timestamp: Date.now(),
        })
      );

      await roomRef.current.localParticipant.publishData(data, {
        reliable: true,
      });

      // Don't add to conversation UI here - let the backend send it back
      // This prevents duplicate messages in the logs

      // Clear accumulated transcript
      setAccumulatedTranscript('');
      setEditableText('');
      setCurrentMessage('');
      setIsEditing(false);
    } catch (error) {
      console.error('Error sending manual message:', error);
    }
  };

  // Start editing
  const handleStartEdit = () => {
    setEditableText(accumulatedTranscript);
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditableText('');
    setIsEditing(false);
  };

  // Toggle voice
  const handleVoiceToggle = async () => {
    if (isRecording || isConnecting) {
      await stopVoiceSession();
    } else {
      await startVoiceSession();
    }
  };

  // Toggle auto-send mode
  const handleAutoSendToggle = async () => {
    const newState = !autoSendEnabled;
    setAutoSendEnabled(newState);

    // Send control message to agent
    if (roomRef.current) {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(
          JSON.stringify({
            type: 'toggle_auto_send',
            enabled: newState,
            timestamp: Date.now(),
          })
        );

        await roomRef.current.localParticipant.publishData(data, {
          reliable: true,
        });
        console.log(`🔄 Auto-send mode: ${newState ? 'ON' : 'OFF'}`);
      } catch (error) {
        console.error('Error sending auto-send toggle:', error);
      }
    }

    if (newState) {
      // Switching to auto mode - clear buffer
      setAccumulatedTranscript('');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    const cleanup = async () => {
      if (roomRef.current) {
        await roomRef.current.disconnect();
      }
      if (sessionIdRef.current) {
        fetch(`/api/v1/voice/voice-sessions/${sessionIdRef.current}`, {
          method: 'DELETE',
          keepalive: true,
        }).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', cleanup);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, []);

  // Conversation Display
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null); // container for all logs scroll

  const ConversationDisplay = () => {
    if (conversationMessages.length > 0) {
      return (
        <div className="space-y-2 sm:space-y-3 md:space-y-4 px-1 sm:px-2 py-2">
          {conversationMessages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`flex ${
                msg.sender === 'agent' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[75%] px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5 rounded-2xl shadow-xl backdrop-blur-md border-2 ${
                  msg.sender === 'agent'
                    ? 'bg-gradient-to-br from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 border-purple-200/50'
                    : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800 border-blue-300/50'
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      msg.sender === 'agent' ? 'bg-purple-500' : 'bg-blue-500'
                    }`}
                  ></div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-80">
                    {msg.sender === 'agent' ? '🤖 Noyco' : '👤 You'}
                  </div>
                </div>
                <div className="text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words font-medium">
                  {msg.text}
                </div>
                <div className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-500 mt-1.5 sm:mt-2 opacity-70 font-medium">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      );
    } else if (currentMessage) {
      return (
        <div className="text-center px-3 sm:px-4">
          <div className="inline-block bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 lg:px-10 lg:py-6 rounded-2xl border-2 border-blue-200/50 shadow-xl max-w-full sm:max-w-2xl w-full backdrop-blur-sm">
            <div className="text-gray-800 text-xs sm:text-sm md:text-base font-medium leading-relaxed">
              {currentMessage}
            </div>
          </div>
        </div>
      );
    } else if (isRecording) {
      return null;
    }
    return null;
  };

  /* ---------------- Sequential (cycle) display state ---------------- */
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const DISPLAY_INTERVAL_MS = 5000; // 5s per message

  // Auto-scroll only the internal logs container (prevents entire page jump)
  useEffect(() => {
    if (showAllLogs && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [conversationMessages, showAllLogs]);

  // Advance index over time only when NOT showing all logs
  useEffect(() => {
    if (showAllLogs) return; // paused while in full log view
    if (conversationMessages.length === 0) return;
    // Ensure index within bounds
    if (displayIndex > conversationMessages.length - 1) {
      setDisplayIndex(conversationMessages.length - 1);
      return;
    }
    // Stop advancing after last message (do not loop)
    if (displayIndex === conversationMessages.length - 1) return;
    const id = setTimeout(() => {
      setDisplayIndex((i) => Math.min(i + 1, conversationMessages.length - 1));
    }, DISPLAY_INTERVAL_MS);
    return () => clearTimeout(id);
  }, [conversationMessages, displayIndex, showAllLogs]);

  // When new messages arrive while at last index, auto-follow to show them next
  const prevLengthRef = useRef(0);
  useEffect(() => {
    if (conversationMessages.length > prevLengthRef.current) {
      // If new message arrives, immediately show it (live catch-up)
      if (!showAllLogs) {
        setDisplayIndex(conversationMessages.length - 1);
      }
    }
    prevLengthRef.current = conversationMessages.length;
  }, [conversationMessages, displayIndex, showAllLogs]);

  const SequentialMessage = () => {
    if (conversationMessages.length === 0) {
      if (currentMessage) {
        return (
          <motion.div
            key="current-msg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-center px-3 sm:px-4"
          >
            <div className="inline-block bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 px-4 py-3 sm:px-6 sm:py-4 rounded-2xl border-2 border-blue-200/50 shadow-xl backdrop-blur-sm max-w-full">
              <div className="text-xs sm:text-sm md:text-base text-gray-800 font-medium leading-relaxed">
                {currentMessage}
              </div>
            </div>
          </motion.div>
        );
      }
      if (isRecording) return null;
      return null;
    }
    const msg = conversationMessages[displayIndex];
    const isAgent = msg.sender === 'agent';
    return (
      <motion.div
        key={msg.timestamp + '_' + displayIndex}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className={`w-full flex px-2 sm:px-3 md:px-4 ${
          isAgent ? 'justify-start' : 'justify-end'
        }`}
      >
        <div
          className={`max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5 rounded-2xl shadow-xl backdrop-blur-md border-2 ${
            isAgent
              ? 'bg-gradient-to-br from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 border-purple-200/50'
              : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800 border-blue-300/50'
          }`}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isAgent ? 'bg-purple-500' : 'bg-blue-500'
              }`}
            ></div>
            <div className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-80">
              {isAgent ? '🤖 Noyco' : '👤 You'}
            </div>
          </div>
          <div className="text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words font-medium">
            {msg.text}
          </div>
          <div className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-500 mt-1.5 sm:mt-2 opacity-70 font-medium">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </motion.div>
    );
  };

  const activeProfile =
    currentProfile || (profiles && profiles.length > 0 ? profiles[0] : null);
  const isProfileReady = !profilesLoading;
  const hasConversation = conversationMessages.length > 0; // for conditional UI

  return (
    <VoiceAssistantContent
      user={user}
      isAuthenticated={isAuthenticated}
      activeProfile={activeProfile}
      profilesLoading={profilesLoading}
      isProfileReady={isProfileReady}
      fetchProfiles={fetchProfiles}
      isRecording={isRecording}
      isConnecting={isConnecting}
      isListening={isListening}
      isBotSpeaking={isBotSpeaking}
      turnCount={turnCount}
      autoSendEnabled={autoSendEnabled}
      handleAutoSendToggle={handleAutoSendToggle}
      handleManualSend={handleManualSend}
      accumulatedTranscript={accumulatedTranscript}
      isEditing={isEditing}
      editableText={editableText}
      handleStartEdit={handleStartEdit}
      setEditableText={setEditableText}
      handleCancelEdit={handleCancelEdit}
      setIsEditing={setIsEditing}
      hasConversation={hasConversation}
      showAllLogs={showAllLogs}
      setShowAllLogs={setShowAllLogs}
      conversationMessages={conversationMessages}
      scrollContainerRef={scrollContainerRef}
      ConversationDisplay={ConversationDisplay}
      messagesEndRef={messagesEndRef}
      SequentialMessage={SequentialMessage}
      handleVoiceToggle={handleVoiceToggle}
    />
  );
};

// Voice Assistant Content Component (extracted for tab use)
const VoiceAssistantContent = ({
  user,
  isAuthenticated,
  activeProfile,
  profilesLoading,
  fetchProfiles,
  isRecording,
  isConnecting,
  isListening,
  isBotSpeaking,
  autoSendEnabled,
  handleAutoSendToggle,
  handleManualSend,
  accumulatedTranscript,
  isEditing,
  editableText,
  handleStartEdit,
  setEditableText,
  handleCancelEdit,
  setIsEditing,
  hasConversation,
  showAllLogs,
  setShowAllLogs,
  conversationMessages,
  scrollContainerRef,
  ConversationDisplay,
  messagesEndRef,
  SequentialMessage,
  handleVoiceToggle,
}) => {
  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="min-h-[calc(100vh-200px)] max-h-[calc(100vh-100px)] bg-[#f8f7f1] flex flex-col overflow-hidden">
        <div className="flex-shrink-0 px-3 sm:px-4 md:px-6 pt-2 sm:pt-3 pb-1 bg-[#f8f7f1] relative z-10">
          <div className="w-full max-w-4xl mx-auto">
            {/* Profile Loading State */}
            {profilesLoading && (
              <div className="text-center mb-3 sm:mb-4 md:mb-6">
                <div className="inline-block bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] px-4 py-2 sm:px-6 sm:py-3 md:py-4 rounded-2xl backdrop-blur-sm shadow-lg">
                  <div className="text-gray-800 text-sm sm:text-base md:text-lg font-medium">
                    Loading your profile...
                  </div>
                </div>
              </div>
            )}

            {/* No Profile Warning */}
            {!profilesLoading && !activeProfile && (
              <div className="text-center mb-3 sm:mb-4 md:mb-6 px-2">
                <div className="inline-block bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] px-4 py-2 sm:px-6 sm:py-3 md:py-4 rounded-2xl backdrop-blur-sm shadow-lg max-w-md w-full mx-2">
                  <div className="text-gray-800 text-sm sm:text-base md:text-lg font-medium">
                    Profile not found
                  </div>
                  <div className="text-gray-700 text-[10px] sm:text-xs md:text-sm mt-1">
                    Please refresh the page or check your profile settings.
                  </div>
                  <button
                    onClick={fetchProfiles}
                    className="mt-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/80 text-gray-800 rounded-lg text-[10px] sm:text-xs md:text-sm hover:shadow-md transition-all duration-200 border border-gray-300/30 font-medium"
                  >
                    Retry Loading Profile
                  </button>
                </div>
              </div>
            )}

            {/* Main Control Button with Animated Blobs */}
            <div className="flex flex-col items-center self-center mb-2 sm:mb-3 md:mb-4 -mt-1">
              {isAuthenticated && user ? (
                <div className="relative w-full max-w-[260px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] aspect-square -mt-1 sm:-mt-2 md:-mt-3">
                  <Amoeba
                    gradient="linear-gradient(135deg, #facc15 0%, #f97316 100%)"
                    duration={12}
                    delay={0}
                    sizeClass="w-[42%] aspect-square"
                    isActive={isRecording}
                    isListening={isListening}
                  />
                  <Amoeba
                    gradient="linear-gradient(135deg, #a855f7 0%, #ef4444 100%)"
                    duration={16}
                    delay={2}
                    sizeClass="w-[48%] aspect-square"
                    isActive={isRecording}
                    isListening={isListening}
                  />
                  <Amoeba
                    gradient="linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                    duration={14}
                    delay={1}
                    sizeClass="w-[38%] aspect-square"
                    isActive={isRecording}
                    isListening={isListening}
                  />
                  <Amoeba
                    gradient="linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)"
                    duration={18}
                    delay={3}
                    sizeClass="w-[43%] aspect-square"
                    isActive={isRecording}
                    isListening={isListening}
                  />

                  <MicIconButton
                    onClick={handleVoiceToggle}
                    isActive={isRecording}
                    isConnecting={isConnecting}
                    isListening={isListening}
                  />
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-300 flex items-center justify-center opacity-50">
                  <div className="text-gray-500 text-xs sm:text-sm text-center px-2">
                    Not Authenticated
                  </div>
                </div>
              )}

              {/* Status text */}
              {/* Status text under amoeba removed to keep logs visible */}

              {/* Status Indicator */}
              {/* Status indicator pill removed to reduce vertical space */}
            </div>

            {/* Auto-Send Toggle & Manual Controls */}
            {isRecording && (
              <div className="mt-3 sm:mt-4 mb-2">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4">
                  {/* Auto-Send Toggle */}
                  <div className="flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-5 sm:py-3 rounded-full bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 backdrop-blur-md shadow-lg border-2 border-blue-200/40">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-700">
                      Auto-Send
                    </span>
                    <button
                      onClick={handleAutoSendToggle}
                      className={`relative w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-inner ${
                        autoSendEnabled
                          ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600'
                          : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
                          autoSendEnabled
                            ? 'left-[22px] sm:left-[26px]'
                            : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Manual Send Button */}
                  {!autoSendEnabled && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={handleManualSend}
                      disabled={
                        !(isEditing
                          ? editableText.trim()
                          : accumulatedTranscript.trim())
                      }
                      className={`flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-200 shadow-lg ${
                        (
                          isEditing
                            ? editableText.trim()
                            : accumulatedTranscript.trim()
                        )
                          ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 active:scale-95 border border-blue-400/30'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <PaperAirplaneIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Send Query</span>
                    </motion.button>
                  )}
                </div>

                {/* Manual Mode Transcript Display with Edit Option */}
                {!autoSendEnabled && (accumulatedTranscript || isEditing) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 mx-auto max-w-full sm:max-w-2xl px-2 sm:px-0"
                  >
                    <div className="px-4 py-3 sm:px-5 sm:py-4 rounded-2xl bg-gradient-to-br from-white via-blue-50/40 to-purple-50/40 backdrop-blur-md border border-blue-200/50 shadow-xl">
                      <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
                          <div className="text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Your Query
                          </div>
                        </div>
                        {!isEditing && accumulatedTranscript && (
                          <button
                            onClick={handleStartEdit}
                            className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold text-blue-700 bg-blue-100/60 hover:bg-blue-100 transition-all duration-200 hover:shadow-md border border-blue-300/30"
                          >
                            <PencilSquareIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>Edit</span>
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 sm:space-y-3">
                          <textarea
                            value={editableText}
                            onChange={(e) => setEditableText(e.target.value)}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-800 leading-relaxed border-2 border-blue-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white/90 shadow-inner"
                            rows={3}
                            placeholder="Edit your message..."
                            autoFocus
                          />
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-1 gap-2">
                            <div className="text-[10px] sm:text-xs text-gray-600 font-medium">
                              {editableText.split(' ').filter((w) => w).length}{' '}
                              words • {editableText.length} chars
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button
                                onClick={handleCancelEdit}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 border border-gray-300/50 shadow-sm"
                              >
                                <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Cancel</span>
                              </button>
                              <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                              >
                                <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Apply</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-xs sm:text-sm text-gray-800 leading-relaxed max-h-24 sm:max-h-32 overflow-y-auto px-2 py-2 bg-white/50 rounded-lg">
                            {accumulatedTranscript}
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 sm:mt-3 pt-2 border-t border-gray-200/60 gap-2">
                            <div className="text-[10px] sm:text-xs text-gray-600 font-medium">
                              {
                                accumulatedTranscript
                                  .split(' ')
                                  .filter((w) => w).length
                              }{' '}
                              words • {accumulatedTranscript.length} chars
                            </div>
                            <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-emerald-600 font-semibold">
                              <CheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span>Ready to send</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 overflow-y-auto overscroll-contain">
          <div className="w-full max-w-5xl mx-auto flex flex-col min-h-full">
            {hasConversation && (
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2 sticky top-0 bg-[#f8f7f1] py-2 z-[5]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <div className="text-[10px] sm:text-xs text-gray-700 font-bold">
                    {conversationMessages.length}{' '}
                    {conversationMessages.length === 1 ? 'message' : 'messages'}
                  </div>
                </div>
                <button
                  onClick={() => setShowAllLogs((s) => !s)}
                  className="text-[10px] sm:text-xs font-bold px-3 py-2 sm:px-5 sm:py-2.5 rounded-full border-2 border-blue-300/50 bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 hover:from-blue-50 hover:to-purple-50 shadow-md hover:shadow-lg transition-all duration-200 backdrop-blur-sm"
                >
                  {showAllLogs ? '📱 Stream' : '📋 All Logs'}
                </button>
              </div>
            )}
            {showAllLogs ? (
              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto overscroll-contain pr-1 sm:pr-2 space-y-2 sm:space-y-3 pb-4 min-h-0"
              >
                <ConversationDisplay />
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center min-h-0 overflow-y-auto">
                <div className="flex-1 w-full flex items-center justify-center py-4">
                  <SequentialMessage />
                </div>
                {isRecording && !autoSendEnabled && (
                  <div className="mt-2 sm:mt-3 text-center text-gray-500 text-[10px] sm:text-xs font-light px-2">
                    🎤 Manual Mode: Keep speaking, then click "Send Query" when
                    done
                  </div>
                )}
                {/* Hint below removed to keep view compact */}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Main Tabbed Interface Component
const TabbedAssistantInterface = () => {
  const [activeTab, setActiveTab] = useState('voice'); // 'voice' or 'chat'

  const tabs = [
    { id: 'voice', name: 'Voice AI', icon: MicrophoneIcon },
    { id: 'chat', name: 'Chat AI', icon: ChatBubbleLeftRightIcon },
  ];

  return (
    <div className="flex flex-col h-full bg-beige overflow-hidden">
      {/* Header with Tab Navigation - Sticky (compact, no bottom border line) */}
      <div className="flex-shrink-0 bg-beige sticky top-0 z-20">
        <div className="px-3 sm:px-4 md:px-6 py-1 sm:py-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
            <div className="flex-1">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                AI Assistant
              </h1>
              <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5">
                Connect via voice or chat for support and guidance
              </p>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex space-x-3 sm:space-x-6 md:space-x-8 overflow-x-auto no-scrollbar whitespace-nowrap pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition-all duration-200 flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'border-gray-800 text-gray-800 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-t-lg px-3 sm:px-4'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content - Flex to fill remaining space with scroll */}
      <div className="flex-1 h-full overflow-x-hidden flex flex-col min-h-0">
        <div className="flex-1 bg-beige h-full">
          <AnimatePresence mode="wait">
            {activeTab === 'voice' ? (
              <motion.div
                key="voice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <ImprovedVoiceAssistant />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <ChatTherapist />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TabbedAssistantInterface;
