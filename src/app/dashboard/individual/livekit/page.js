'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Room, RoomEvent, Track } from 'livekit-client';
import { useAuth, useAgentProfile } from '../../../../store/hooks';
import { motion } from 'framer-motion';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

// Animated Amoeba/Blob component
const Amoeba = ({ gradient, duration, delay, sizeClass, isActive = false, isListening = false }) => {
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
        }
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
        }
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
        }
      };
    }
  };

  const animationProps = getAnimationProps();

  return (
    <motion.div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${sizeClass}`}
      style={{
        background: gradient,
        filter: isListening ? 'blur(35px)' : isActive ? 'blur(42px)' : 'blur(50px)',
        opacity: isListening ? 0.8 : isActive ? 0.7 : 0.55,
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
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 20 }}>
      {(isActive || isConnecting || isListening) && (
        <div 
          className={`absolute inset-0 rounded-full border-2 ${
            buttonState === 'connecting' ? 'border-yellow-300/50' :
            buttonState === 'listening' ? 'border-green-300/50' :
            'border-blue-300/50'
          } ${getRingAnimation()}`}
          style={{ 
            width: '80px', 
            height: '80px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5v.75a7.5 7.5 0 01-15 0v-.75M12 21v-3" />
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
const WaveformVisualizer = ({ isActive }) => {
  const bars = Array.from({ length: 30 }, (_, i) => i);
  return (
    <div className="flex items-center justify-center space-x-1 h-8 w-full max-w-xs mx-auto">
      {bars.map((bar) => (
        <div
          key={bar}
          className="bg-gradient-to-t from-blue-400 via-purple-400 to-pink-400 rounded-full transition-all duration-200 ease-out"
          style={{ 
            width: '2px',
            height: isActive 
              ? `${Math.random() * 20 + 4}px`
              : '3px',
            opacity: isActive ? 0.8 : 0.3,
            animationDelay: `${bar * 30}ms`
          }}
        />
      ))}
    </div>
  );
};

// Main Voice Assistant Component
const ImprovedVoiceAssistant = () => {
  const { user, isAuthenticated } = useAuth();
  const { profiles, currentProfile, fetchProfiles, isLoading: profilesLoading } = useAgentProfile();

  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [debugStatus, setDebugStatus] = useState('Ready');
  const [turnCount, setTurnCount] = useState(0);
  const [conversationMessages, setConversationMessages] = useState([]);
  
  const roomRef = useRef(null);
  const sessionIdRef = useRef(null);

  // Get session config
  const getSessionConfig = () => {
    const activeProfile = currentProfile || (profiles && profiles.length > 0 ? profiles[0] : null);
    
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
      session_reset_timestamp: timestamp
    };
  };

  // Start voice session
  const startVoiceSession = async () => {
    try {
      setIsConnecting(true);
      setDebugStatus('Waking up assistant...');

      fetch(`${process.env.NEXT_PUBLIC_AGENT_URL}/warmup`).catch(err => console.warn("Warmup call failed but proceeding anyway:", err));

      setDebugStatus('Creating session...');
      setDebugStatus('Creating session...');
      
      const sessionConfig = getSessionConfig();
      
      // Create session
      const response = await fetch('/api/v1/voice/voice-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionConfig)
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
            attempt.catch(err => console.warn('Autoplay blocked, waiting for user gesture:', err));
          }
          setIsBotSpeaking(true);
          setDebugStatus('Agent speaking');
        }
      });

      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        track.detach().forEach(el => el.remove());
        setIsBotSpeaking(false);
        setIsListening(false);
        setDebugStatus('Ready to talk');
      });

      room.on(RoomEvent.DataReceived, (payload, participant) => {
        try {
          console.log('📦 Raw data received:', payload);
          
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
              timestamp: message.timestamp || Date.now()
            };
            console.log('💬 Adding message:', newMsg);
            setConversationMessages(prev => {
              const updated = [...prev, newMsg];
              console.log('📝 Total messages:', updated.length);
              return updated;
            });
            
            if (message.sender === 'agent') {
              setCurrentMessage(message.text);
            }
          } else if (message.type === 'transcript') {
            setCurrentMessage(message.text);
          } else if (message.type === 'user_speech') {
            setIsListening(true);
            setTurnCount(prev => prev + 1);
          } else if (message.type === 'agent_response') {
            setIsListening(false);
          }
        } catch (e) {
          console.error('❌ Error parsing data:', e, payload);
        }
      });

      room.on(RoomEvent.Connected, () => {
        console.log('Connected to room');
        setIsConnecting(false);
        setIsRecording(true);
        setDebugStatus('Connected - Ready to talk');
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

      console.log('Voice session started successfully');
      
      // Test: Add a welcome message to verify display works
      setTimeout(() => {
        const testMessage = {
          sender: 'agent',
          text: 'Hello! I\'m ready to assist you. Start speaking anytime!',
          timestamp: Date.now()
        };
        console.log('🧪 Adding test message:', testMessage);
        setConversationMessages(prev => [...prev, testMessage]);
      }, 2000);

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
          method: 'DELETE'
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

    } catch (error) {
      console.error('Error stopping session:', error);
    }
  };

  // Toggle voice
  const handleVoiceToggle = async () => {
    if (isRecording || isConnecting) {
      await stopVoiceSession();
    } else {
      await startVoiceSession();
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
          keepalive: true
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
        <div className="space-y-3 px-2 py-2">
          {conversationMessages.map((msg, idx) => (
            <div 
              key={idx}
              className={`flex ${msg.sender === 'agent' ? 'justify-start' : 'justify-end'}`}
              style={{ animation: 'fadeIn 0.3s ease-in' }}
            >
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-lg ${
                msg.sender === 'agent'
                  ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 border border-white/40'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              }`}>
                <div className="text-xs font-semibold mb-1.5 opacity-80">
                  {msg.sender === 'agent' ? '🤖 Noyco' : '👤 You'}
                </div>
                <div className="text-sm lg:text-base leading-relaxed">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      );
    } else if (currentMessage) {
      return (
        <div className="text-center">
          <div className="inline-block bg-white px-6 py-4 lg:px-8 lg:py-5 rounded-2xl border border-gray-200 shadow-lg max-w-2xl">
            <div className="text-gray-800 text-sm lg:text-base">
              {currentMessage}
            </div>
          </div>
        </div>
      );
    } else if (isRecording) {
      return (
        <div className="text-center text-gray-600">
          <div className="text-sm">Start speaking to begin the conversation...</div>
        </div>
      );
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
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
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
      setDisplayIndex(i => Math.min(i + 1, conversationMessages.length - 1));
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
            className="text-center text-sm text-gray-700"
          >
            {currentMessage}
          </motion.div>
        );
      }
      if (isRecording) {
        return <div className="text-center text-xs text-gray-500">Start speaking to begin the conversation...</div>;
      }
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
        className={`w-full flex ${isAgent ? 'justify-start' : 'justify-end'}`}
      >
        <div className={`max-w-[90%] md:max-w-[75%] px-5 py-4 rounded-2xl shadow-lg backdrop-blur-sm ${
          isAgent
            ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 border border-white/40'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
        }`}
        >
          <div className="text-[10px] font-semibold uppercase tracking-wide opacity-70 mb-1">
            {isAgent ? 'Noyco' : 'You'}
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</div>
        </div>
      </motion.div>
    );
  };

  const activeProfile = currentProfile || (profiles && profiles.length > 0 ? profiles[0] : null);
  const isProfileReady = !profilesLoading;
  const canStartSession = isAuthenticated && user && isProfileReady;
  const hasConversation = conversationMessages.length > 0; // for conditional UI

  return (
    <>
      <style jsx>{`
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
      <div className="h-screen bg-[#f8f7f1] flex flex-col overflow-hidden">
        <div className="flex-shrink-0 px-4 sm:px-6 lg:px-10 pt-4 pb-2 bg-[#f8f7f1] sticky top-0 z-30 border-b border-gray-200/40">
          <div className="w-full max-w-2xl mx-auto">
        
        {/* Profile Loading State */}
        {profilesLoading && (
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] px-6 py-4 rounded-2xl backdrop-blur-sm shadow-lg">
              <div className="text-gray-800 text-lg font-medium">
                Loading your profile...
              </div>
            </div>
          </div>
        )}
        
        {/* No Profile Warning */}
        {!profilesLoading && !activeProfile && (
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] px-6 py-4 rounded-2xl backdrop-blur-sm shadow-lg">
              <div className="text-gray-800 text-lg font-medium">
                Profile not found
              </div>
              <div className="text-gray-700 text-sm mt-1">
                Please refresh the page or check your profile settings.
              </div>
              <button 
                onClick={fetchProfiles}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 rounded-lg text-sm hover:shadow-md transition-all duration-200 border border-gray-300/30"
              >
                Retry Loading Profile
              </button>
            </div>
          </div>
        )}
        
        {/* Main Control Button with Animated Blobs */}
        <div className="flex flex-col items-center mb-4 lg:mb-6 lg:-mt-12">
          {isAuthenticated && user ? (
            <div className="relative w-full max-w-[min(80vw,70vh,520px)] aspect-square">
              <Amoeba
                gradient="linear-gradient(135deg, #facc15 0%, #f97316 100%)"
                duration={12}
                delay={0}
                sizeClass="w-[clamp(140px,45%,380px)] aspect-square"
                isActive={isRecording}
                isListening={isListening}
              />
              <Amoeba
                gradient="linear-gradient(135deg, #a855f7 0%, #ef4444 100%)"
                duration={16}
                delay={2}
                sizeClass="w-[clamp(160px,50%,420px)] aspect-square"
                isActive={isRecording}
                isListening={isListening}
              />
              <Amoeba
                gradient="linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                duration={14}
                delay={1}
                sizeClass="w-[clamp(120px,40%,350px)] aspect-square"
                isActive={isRecording}
                isListening={isListening}
              />
              <Amoeba
                gradient="linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)"
                duration={18}
                delay={3}
                sizeClass="w-[clamp(140px,45%,395px)] aspect-square"
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
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-gray-300 flex items-center justify-center opacity-50">
              <div className="text-gray-500 text-sm text-center">
                Not Authenticated
              </div>
            </div>
          )}

          {/* Status text */}
          <div className="mt-2 lg:mt-3 text-center">
            {!isAuthenticated || !user ? (
              <div className="text-[#15345fff] text-lg sm:text-xl font-medium">
                Please login to start
              </div>
            ) : (
              <>
                {isListening && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-1"
                  >
                    <div className="text-xs font-medium text-gray-800 mb-0.5 animate-pulse">
                      🎤 Listening...
                    </div>
                    <div className="text-xs text-gray-600">
                      I can hear you
                    </div>
                  </motion.div>
                )}
                {isRecording && (isConnecting || isBotSpeaking) && (
                  <div className="text-[#15345fff] text-sm font-medium">
                    Voice Assistant Active
                  </div>
                )}
              </>
            )}
          </div>

          {/* Status Indicator */}
          {isRecording && (
            <div className="mb-2 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-medium bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 backdrop-blur-sm shadow-md">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  isBotSpeaking 
                    ? 'bg-purple-600 animate-pulse' 
                    : isConnecting
                      ? 'bg-yellow-600 animate-pulse'
                      : isListening 
                        ? 'bg-blue-600 animate-pulse'
                        : 'bg-gray-600'
                }`} />
                <span>
                  {isBotSpeaking 
                    ? `Speaking • Turn ${turnCount}` 
                    : isConnecting
                      ? 'Connecting...'
                      : isListening 
                        ? `Listening • Turn ${turnCount}`
                        : turnCount === 0 
                          ? 'Ready • Turn 0'
                          : `Ready • Turn ${turnCount}`
                  }
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Waveform Visualizer */}
        {/** Waveform visualizer removed as requested */}

          </div>
        </div>
        <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-10 pb-4 overflow-hidden">
          <div className="w-full max-w-6xl mx-auto flex flex-col h-full">
            {hasConversation && (
              <div className="flex items-center justify-end mb-2">
                <button
                  onClick={() => setShowAllLogs(s => !s)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-300/60 bg-white/70 hover:bg-white shadow-sm transition-colors duration-200 backdrop-blur-sm"
                >
                  {showAllLogs ? 'Show Stream' : 'Show All Logs'}
                </button>
              </div>
            )}
            {showAllLogs ? (
              <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overscroll-contain pr-1">
                <ConversationDisplay />
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 w-full">
                  <SequentialMessage />
                </div>
                {isRecording && (
                  <div className="mt-2 text-center text-gray-400 text-xs font-light">Speak naturally • Assistant responds in real-time</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImprovedVoiceAssistant;