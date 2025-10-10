// "use client";

// import { useRef, useState } from "react";
// import { useMarketingFunnel } from "../../context/MarketingFunnelContext";

// const VoiceDemoStep = () => {
//   const { data, actions } = useMarketingFunnel();
//   const audioRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [hasPlayed, setHasPlayed] = useState(false);

//   // Get intensity safely
//   const intensity = typeof data.intensity === "number" ? data.intensity : 0;
  
//   // Show step description based on conditions
//   const shouldShowVoiceDemo = intensity >= 6 || data.wantsVoiceDemo;

//   const handlePlay = () => {
//     // play audio
//     if (audioRef.current) {
//       audioRef.current.currentTime = 0; // restart from beginning
//       audioRef.current.play();
//       setIsPlaying(true);
//       setHasPlayed(true);
//     }
//     actions.updateData({ wantsVoiceDemo: true });
//     // Don't navigate immediately - let audio play
//   };

//   const handleAudioEnd = () => {
//     setIsPlaying(false);
//     // Audio has finished playing - don't auto-navigate, let user choose
//   };

//   const handleContinue = () => {
//     // Stop audio if still playing
//     if (audioRef.current && !audioRef.current.paused) {
//       audioRef.current.pause();
//     }
//     setIsPlaying(false);
//     actions.nextStep();
//   };

//   const handleSkip = () => {
//     // Stop audio if playing
//     if (audioRef.current && !audioRef.current.paused) {
//       audioRef.current.pause();
//     }
//     setIsPlaying(false);
//     actions.updateData({ wantsVoiceDemo: false });
//     actions.nextStep();
//   };

//   return (
//     <div className="text-center space-y-8">
//       <div className="space-y-4">
//         <h2 className="text-xl font-medium text-gray-900">
//           {shouldShowVoiceDemo
//             ? "Want a 20-second calming cue to see how it feels?"
//             : "Optional: Try a voice sample"}
//         </h2>
//         <p className="text-gray-500 leading-relaxed">
//           {shouldShowVoiceDemo
//             ? "One proof moment. Not spamming demos."
//             : "Experience how our voice sessions work before continuing."}
//         </p>
//       </div>

//       {/* Image placeholder */}
//       <div className="flex justify-center my-8">
//         <div className="w-50 h-50 flex items-center justify-center">
//           <img src="./mic.jpg" alt="" />
//         </div>
//       </div>

//       <div className="p-8">
//         <div className="text-center space-y-6">
//           {isPlaying && (
//             <div className="mb-4">
//               <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
//                 🎵 Playing audio sample...
//               </div>
//             </div>
//           )}
          
//           {hasPlayed && !isPlaying && (
//             <div className="mb-4">
//               <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//                 ✓ Sample completed
//               </div>
//             </div>
//           )}
          
//           <p className="text-sm leading-relaxed">
//             Experience a personalized calming session designed just for you
//           </p>
//         </div>
//       </div>

//       {/* Hidden audio element with event handlers */}
//       <audio 
//         ref={audioRef} 
//         src="./audiotherapy.mp3" 
//         onEnded={handleAudioEnd}
//         onPause={() => setIsPlaying(false)}
//         onPlay={() => setIsPlaying(true)}
//       />

//       {/* Navigation positioned at bottom */}
//       <div className="flex items-center justify-between mt-8 pt-4">
//         <button
//           onClick={handleSkip}
//           className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
//         >
//           {isPlaying ? "Stop & Skip" : "Skip for now"}
//         </button>

//         {!hasPlayed ? (
//           <button
//             onClick={handlePlay}
//             disabled={isPlaying}
//             className={`px-8 py-3 rounded-none transition-all duration-200 text-sm font-semibold ${
//               isPlaying
//                 ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                 : "bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 hover:shadow-lg"
//             }`}
//           >
//             {isPlaying ? "Playing..." : "Play sample"}
//           </button>
//         ) : (
//           <div className="flex gap-3">
//             <button
//               onClick={handlePlay}
//               disabled={isPlaying}
//               className={`px-6 py-3 rounded-none transition-all duration-200 text-sm font-medium border ${
//                 isPlaying
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
//                   : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
//               }`}
//             >
//               {isPlaying ? "Playing..." : "Play again"}
//             </button>
            
//             <button
//               onClick={handleContinue}
//               disabled={isPlaying}
//               className={`px-8 py-3 rounded-none transition-all duration-200 text-sm font-semibold ${
//                 isPlaying
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 hover:shadow-lg"
//               }`}
//             >
//               Continue
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VoiceDemoStep;




















"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import { useMarketingFunnel } from "../../context/MarketingFunnelContext";

// Animated Amoeba/Blob component (adapted from livekit page)
const Amoeba = ({ gradient, duration, delay, sizeClass, isActive = false, isPlaying = false }) => {
  // Adjust animation based on state
  const getAnimationProps = () => {
    if (isPlaying) {
      // Fast, echo-like spreading animation when playing audio
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
          duration: duration * 0.6, // Even slower
          delay: delay * 0.7,
          repeat: Infinity,
          ease: 'easeInOut',
        }
      };
    } else if (isActive) {
      // Medium speed when ready to play
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
          duration: duration * 0.9, // Even slower
          delay: delay * 1.0,
          repeat: Infinity,
          ease: 'easeInOut',
        }
      };
    } else {
      // Default idle animation
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
        filter: isPlaying ? 'blur(35px)' : isActive ? 'blur(42px)' : 'blur(50px)',
        opacity: isPlaying ? 0.8 : isActive ? 0.7 : 0.55,
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

// Play Icon Button component (adapted from livekit)
const PlayIconButton = ({ onClick, isActive, isPlaying }) => {
  const getButtonState = () => {
    if (isPlaying) return 'playing';
    if (isActive) return 'active';
    return 'idle';
  };

  const buttonState = getButtonState();

  const getButtonStyles = () => {
    switch (buttonState) {
      case 'playing':
        return 'text-green-300 drop-shadow-[0_0_20px_rgba(134,239,172,0.8)] animate-pulse';
      case 'active':
        return 'text-blue-300 drop-shadow-[0_0_20px_rgba(147,197,253,0.6)]';
      default:
        return 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]';
    }
  };

  const getRingAnimation = () => {
    switch (buttonState) {
      case 'playing':
        return 'animate-pulse';
      case 'active':
        return 'animate-pulse';
      default:
        return '';
    }
  };

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 20 }}>
      {/* Outer ring for visual feedback */}
      {(isActive || isPlaying) && (
        <div 
          className={`absolute inset-0 rounded-full border-2 ${
            buttonState === 'playing' ? 'border-green-300/50' :
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
      
      {/* Status indicator text - Only show "Ready to play" when active but not playing */}
      {buttonState === 'active' && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
          <div className="text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 backdrop-blur-sm shadow-md">
            Ready to play
          </div>
        </div>
      )}

      <motion.button
        className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 transition-all duration-300 ${getButtonStyles()}`}
        whileHover={{ scale: buttonState === 'idle' ? 1.1 : 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        disabled={isPlaying}
      >
        {isPlaying ? (
          <PauseIcon className="w-10 h-10 transition-all duration-300" />
        ) : (
          <PlayIcon className="w-10 h-10 transition-all duration-300" />
        )}
      </motion.button>
    </div>
  );
};

const VoiceDemoStep = () => {
  const { data, actions } = useMarketingFunnel();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Get intensity safely
  const intensity = typeof data.intensity === "number" ? data.intensity : 0;
  
  // Show step description based on conditions
  const shouldShowVoiceDemo = intensity >= 6 || data.wantsVoiceDemo;

  const handlePlay = () => {
    // play audio
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // restart from beginning
      audioRef.current.play();
      setIsPlaying(true);
      setHasPlayed(true);
    }
    actions.updateData({ wantsVoiceDemo: true });
    // Don't navigate immediately - let audio play
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    // Audio has finished playing - don't auto-navigate, let user choose
  };

  const handleContinue = () => {
    // Stop audio if still playing
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    actions.nextStep();
  };

  const handleSkip = () => {
    // Stop audio if playing
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    actions.updateData({ wantsVoiceDemo: false });
    actions.nextStep();
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">
          {shouldShowVoiceDemo
            ? "Want a 20-second calming cue to see how it feels?"
            : "Optional: Try a voice sample"}
        </h2>
        <p className="text-gray-500 leading-relaxed">
          {shouldShowVoiceDemo
            ? "One proof moment. Not spamming demos."
            : "Experience how our voice sessions work before continuing."}
        </p>
      </div>

      {/* Animated Blob Container - replacing the static image */}
      <div className="flex justify-center my-8">
        <div className="relative w-full max-w-[min(60vw,50vh,400px)] aspect-square">
          {/* Gradient Blobs Container */}
          <Amoeba
            gradient="linear-gradient(135deg, #facc15 0%, #f97316 100%)"
            duration={40}
            delay={0}
            sizeClass="w-[clamp(120px,40%,320px)] aspect-square"
            isActive={hasPlayed || isPlaying}
            isPlaying={isPlaying}
          />
          <Amoeba
            gradient="linear-gradient(135deg, #a855f7 0%, #ef4444 100%)"
            duration={50}
            delay={2}
            sizeClass="w-[clamp(140px,45%,360px)] aspect-square"
            isActive={hasPlayed || isPlaying}
            isPlaying={isPlaying}
          />
          <Amoeba
            gradient="linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
            duration={45}
            delay={1}
            sizeClass="w-[clamp(100px,35%,280px)] aspect-square"
            isActive={hasPlayed || isPlaying}
            isPlaying={isPlaying}
          />
          <Amoeba
            gradient="linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)"
            duration={55}
            delay={3}
            sizeClass="w-[clamp(120px,40%,340px)] aspect-square"
            isActive={hasPlayed || isPlaying}
            isPlaying={isPlaying}
          />

          {/* Play icon overlay - Centered within the blob container */}
          <PlayIconButton 
            onClick={handlePlay} 
            isActive={hasPlayed || isPlaying}
            isPlaying={isPlaying}
          />
        </div>
      </div>

      <div className="p-8">
        <div className="text-center space-y-6">
          {isPlaying && (
            <div className="mb-4">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                🎵 Playing audio sample...
              </div>
            </div>
          )}
          
          {hasPlayed && !isPlaying && (
            <div className="mb-4">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ✓ Sample completed
              </div>
            </div>
          )}
          
          <p className="text-sm leading-relaxed">
            Experience a personalized calming session designed just for you
          </p>
        </div>
      </div>

      {/* Hidden audio element with event handlers */}
      <audio 
        ref={audioRef} 
        src="./audiotherapy.mp3" 
        onEnded={handleAudioEnd}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Navigation positioned at bottom */}
      <div className="flex items-center justify-between mt-8 pt-4">
        <button
          onClick={handleSkip}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
        >
          {isPlaying ? "Stop & Skip" : "Skip for now"}
        </button>

        {!hasPlayed ? (
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`px-8 py-3 rounded-none transition-all duration-200 text-sm font-semibold ${
              isPlaying
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 hover:shadow-lg"
            }`}
          >
            {isPlaying ? "Playing..." : "Play sample"}
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className={`px-6 py-3 rounded-none transition-all duration-200 text-sm font-medium border ${
                isPlaying
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
              }`}
            >
              {isPlaying ? "Playing..." : "Play again"}
            </button>
            
            <button
              onClick={handleContinue}
              disabled={isPlaying}
              className={`px-8 py-3 rounded-none transition-all duration-200 text-sm font-semibold ${
                isPlaying
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 hover:shadow-lg"
              }`}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceDemoStep;

