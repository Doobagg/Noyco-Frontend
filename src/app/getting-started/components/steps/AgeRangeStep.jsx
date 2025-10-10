"use client";

import { motion } from 'framer-motion';
import Image from 'next/image'; // Import Next.js Image component
import { useMarketingFunnel } from '../../context/MarketingFunnelContext';

// Animation variants for a staggered fade-in effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Slightly faster stagger for more dynamic feel
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const AgeRangeStep = () => {
  const { data, actions } = useMarketingFunnel();

  const ageGroups = [
    { value: '18-24', label: '18-24', image: '/age18-24.png' },
    { value: '25-34', label: '25-34', image: '/age25-34.jpg' },
    { value: '35-44', label: '35-44', image: '/age35-44.png' },
    { value: '45+', label: '45+', image: '/age45.png' }
  ];

  const handleAgeSelect = (ageGroup) => {
    actions.updateData({ ageGroup });
    // Remove auto-advance to give user control
    // setTimeout(() => {
    //   actions.nextStep();
    // }, 300); 
  };

  const handleContinue = () => {
    if (data.ageGroup) {
      actions.nextStep();
    }
  };

  return (
    <motion.div
      className="font-sans text-center max-w-lg mx-auto p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-8"> {/* Adjusted spacing for overall flow */}
        <motion.div className="space-y-2" variants={itemVariants}>
          <h2 className="text-2xl font-semibold text-gray-800">What's your age group?</h2>
          <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">This helps us personalize your wellness journey.</p>
        </motion.div>


        {/* Age group selection grid */}
        <motion.div className="grid grid-cols-2 gap-4 sm:gap-6" variants={itemVariants}>
          {ageGroups.map((group) => (
            <motion.button
              key={group.value}
              onClick={() => handleAgeSelect(group.value)}
              className={`
                relative h-48 sm:h-60 overflow-hidden
                transition-all duration-300 ease-out cursor-pointer group
                ${data.ageGroup === group.value
                  ? 'shadow-xl scale-[1.05] ring-2 ring-purple-400' // Selected state
                  : 'shadow-md hover:shadow-lg hover:scale-[1.03]' // Default/Hover state
                }
              `}
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.97 }}   
              variants={itemVariants} 
            >
              {/* Background image */}
              <div className="absolute inset-0">
                {/* <img 
                  src={group.image}
                  alt={`People in ${group.label} age range`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  
                /> */
                }
                <Image
                  src={group.image}
                  alt={`People in ${group.label} age range`}
                  // layout="fill"
                  objectFit='contain'
                  height={200}
                  width={200}
                  priority={true}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
              </div>
              
              {/* Text overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0">
                <div className={`
                  w-full py-3 px-4 text-white font-semibold text-sm sm:text-base text-center
                  transition-all duration-300
                  ${data.ageGroup === group.value
                    ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800' 
                    : 'bg-gray/60 backdrop-blur-sm group-hover:bg-gray/70'
                  }
                `}>
                  Age: {group.label}
                  {data.ageGroup === group.value && (
                    <svg className="inline ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Continue button */}
        <motion.div className="pt-6" variants={itemVariants}>
          <button
            onClick={handleContinue}
            disabled={!data.ageGroup}
            className={`
              w-full px-8 py-3 text-sm font-semibold transition-all duration-200
              ${data.ageGroup 
                ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 hover:shadow-lg' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Continue
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default AgeRangeStep;