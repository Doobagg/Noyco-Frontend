"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useMarketingFunnel } from '../context/MarketingFunnelContext';
import ProgressBar from './ProgressBar';

// Import step components
import WelcomeStep from './steps/WelcomeStep';
import AgeRangeStep from './steps/AgeRangeStep';
import LonelinessFactStep from './steps/LonelinessFactStep';
import AnxietyFactStep from './steps/AnxietyFactStep';
import ConsistencyFactStep from './steps/ConsistencyFactStep';
import MeetAgentsStep from './steps/MeetAgentsStep';
import CurrentIntensityStep from './steps/CurrentIntensityStep';
import PrimaryTopicStep from './steps/PrimaryTopicStep';
import SymptomPatternStep from './steps/SymptomPatternStep';
import TriggerSnapshotStep from './steps/TriggerSnapshotStep';
import VoiceDemoStep from './steps/VoiceDemoStep';
import CopingAnchorsStep from './steps/CopingAnchorsStep';
import SupportStyleStep from './steps/SupportStyleStep';
import TimeBudgetStep from './steps/TimeBudgetStep';
import BoundariesSafetyStep from './steps/BoundariesSafetyStep';
import AccountabilityStyleStep from './steps/AccountabilityStyleStep';
import Goal30Step from './steps/Goal30Step';
import PersonalizedPlanCreationStep from './steps/PersonalizedPlanCreationStep';
import EmailCollectionStep from './steps/EmailCollectionStep';
import WellbeingProgressStep from './steps/WellbeingProgressStep';
import InstantPlanPreviewStep from './steps/InstantPlanPreviewStep';

// Order reflects the desired flow. Personalization and MeetAgents remain just before the plan preview.
const stepComponents = {
  1: WelcomeStep,
  2: AgeRangeStep,
  3: LonelinessFactStep,
  4: CurrentIntensityStep,
  5: ConsistencyFactStep,
  6: PrimaryTopicStep,
  7: AnxietyFactStep,
  8: SymptomPatternStep,
  9: TriggerSnapshotStep,
  10: VoiceDemoStep, // optional display logic handled inside step
  11: CopingAnchorsStep,
  12: SupportStyleStep,
  13: TimeBudgetStep,
  14: BoundariesSafetyStep,
  15: AccountabilityStyleStep,
  16: Goal30Step,
  17: MeetAgentsStep,
  18: PersonalizedPlanCreationStep, // New plan creation step with reviews
  19: EmailCollectionStep, // Email collection before plan preview
  20: WellbeingProgressStep, // 4-week progress visualization
  21: InstantPlanPreviewStep,
};

const MarketingFunnelFlow = () => {
  const { currentStep, totalSteps, direction, actions } = useMarketingFunnel();

  // Debug: Check which components are invalid
  console.log('Current step:', currentStep);
  console.log('Step component:', stepComponents[currentStep]);
  console.log('All step components:', Object.keys(stepComponents).map(key => ({ 
    step: key, 
    component: stepComponents[key], 
    isFunction: typeof stepComponents[key] === 'function' 
  })));

  const CurrentStepComponent = stepComponents[currentStep];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    })
  };

  // Improved back button handler with validation
  const handleBackButton = () => {
    if (currentStep > 1) {
      actions.previousStep();
    }
  };

  return (
  <div className="getting-started-scroll-fix min-h-full bg-white pb-10">
      {/* Main content - positioned at top like onboarding */}
      <div className="flex justify-center pt-6 px-4">
        <div className="w-full max-w-md">
          
          {/* Progress bar with back button - Hidden on welcome step */}
          {currentStep > 1 && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={handleBackButton}
                  className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200"
                  aria-label="Go back to previous step"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center space-x-1 flex-1">
                  {[...Array(totalSteps)].map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        index < currentStep ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC]' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Clean content without card styling */}
          <div className="bg-white">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {CurrentStepComponent && typeof CurrentStepComponent === 'function' ? (
                  <CurrentStepComponent />
                ) : (
                  <div className="text-center p-8">
                    <h2 className="text-xl text-gray-900 mb-4">Step not found</h2>
                    <p className="text-gray-500 mb-4">
                      Unable to load step {currentStep}. Component type: {typeof CurrentStepComponent}
                    </p>
                    <p className="text-gray-500 mb-4 text-xs">
                      Component value: {JSON.stringify(CurrentStepComponent)}
                    </p>
                    <button 
                      onClick={() => actions.goToStep(1)}
                      className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 px-6 py-2 rounded text-sm"
                    >
                      Return to start
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    {/* Bottom scroll sentinel for tablet Safari & iPad Pro to ensure scrollable area */}
  <div className="h-12 md:h-28 lg:h-32 xl:h-24 getting-started-pro-sentinel" aria-hidden="true" />
    </div>
  );
};

export default MarketingFunnelFlow;
