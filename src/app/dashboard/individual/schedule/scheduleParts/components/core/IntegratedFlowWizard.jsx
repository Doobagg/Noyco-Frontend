"use client";

import { useIntegratedFlow } from '../../context/IntegratedFlowContext';

import AgentSelector from '../selectors/AgentSelector';
import AdditionalInfoForm from '../forms/AdditionalInfoForm';
import CallTimeSelector from '../selectors/CallTimeSelector';
import ReviewAndConfirm from '../ui/ReviewAndConfirm';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const IntegratedFlowWizard = () => {
  const { 
    currentStep, 
    totalSteps, 
    actions, 
    isCurrentStepValid,
    error,
    isLoading
  } = useIntegratedFlow();

  // Dynamic step configuration based on selected agent
  // const steps = useMemo(() => {
  //   // All agents now have additional info steps, but no user profile step
  //   return [
  //     'Agent Configuration',
  //     'Additional Information',
  //     'Call Time',
  //     'Review & Confirm'
  //   ];
  // }, []);

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < totalSteps && isCurrentStepValid()) {
      actions.setStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      actions.setStep(currentStep - 1);
    }
  };

  // const handleStepClick = (step) => {
  //   if (canProceedToStep(step)) {
  //     actions.setStep(step);
  //   }
  // };

  // Render step content
  const renderStepContent = () => {
    // All agents now have additional info steps (4-step flow, no user profile)
    switch (currentStep) {
      case 1:
        return <AgentSelector />;
      case 2:
        return <AdditionalInfoForm />;
      case 3:
        return <CallTimeSelector />;
      case 4:
        return <ReviewAndConfirm />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--beige)' }}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
            Schedule Your Call
          </h1>
          <p className="text-lg mt-2" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            Configure your agent and schedule a personalized consultation
          </p>
        </div>

        {/* Progress Stepper */}
        {/* <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-10 h-10 border flex items-center justify-center text-sm font-semibold transition-colors cursor-pointer ${
                    currentStep > index + 1
                      ? 'border-primary text-white'
                      : currentStep === index + 1
                      ? 'border-primary text-primary bg-primary'
                      : 'border-gray-300'
                  }`}
                  style={{
                    backgroundColor: currentStep > index + 1 
                      ? 'var(--primary-100)' 
                      : currentStep === index + 1 
                      ? 'var(--primary-100)' 
                      : 'transparent',
                    borderColor: currentStep >= index + 1 ? 'var(--primary-100)' : '#d1d5db',
                    color: currentStep >= index + 1 ? 'var(--foreground)' : '#6b7280'
                  }}
                  onClick={() => handleStepClick(index + 1)}
                >
                  {index + 1}
                </div>
                <span 
                  className={`ml-3 text-sm font-medium ${
                    currentStep >= index + 1 ? '' : 'text-gray-500'
                  }`}
                  style={{ color: currentStep >= index + 1 ? 'var(--foreground)' : '#6b7280' }}
                >
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div 
                    className="flex-1 h-0.5 mx-4"
                    style={{ 
                      backgroundColor: currentStep > index + 1 ? 'var(--primary-100)' : '#e5e7eb' 
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div> */}

        {/* Error Display */}
        {error && (
          <div 
            className="mb-6 p-4 border flex items-center"
            style={{ 
              backgroundColor: '#fef2f2', 
              borderColor: '#dc2626' 
            }}
          >
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: '#dc2626' }} />
            <div>
              <h3 className="text-sm font-medium" style={{ color: '#991b1b' }}>Error</h3>
              <p className="text-sm mt-1" style={{ color: '#b91c1c' }}>{error}</p>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div 
         className="bg-beige backdrop-blur-xl border-accent-right border-accent-left border-accent-top border-accent overflow-hidden shadow-lg"


        >
          <div className="p-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div 
                  className="animate-spin h-8 w-8 border-b-2"
                  style={{ 
                    borderRadius: '50%',
                    borderColor: 'var(--primary-100)' 
                  }}
                ></div>
                <span className="ml-3" style={{ color: 'var(--foreground)' }}>Loading...</span>
              </div>
            ) : (
              renderStepContent()
            )}
          </div>

          {/* Navigation Footer */}
          <div 
            className="px-8 py-4 border-t bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC]"
            style={{ 
              
              borderTopColor: 'var(--border-accent)' 
            }}
          >
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                    className="inline-flex items-center px-4 py-2 bg-beige backdrop-blur-xl border-accent-right border-accent-left border-accent-top border-accent text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02]"
                style={{
                  borderColor: 'var(--border-accent)',
                  backgroundColor: 'white',
                  color: 'var(--foreground)'
                }}
                onMouseEnter={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = 'var(--beige)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = 'white';
                  }
                }}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              <div className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                Step {currentStep} of {totalSteps}
              </div>

              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={!isCurrentStepValid()}
                   className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] border-accent-right border-accent-left border-accent-top border-accent text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  style={{
                   
                    color: 'var(--foreground)'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.opacity = '0.9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.opacity = '1';
                    }
                  }}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <div className="w-20" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedFlowWizard;
