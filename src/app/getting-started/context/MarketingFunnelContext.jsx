"use client";

import { createContext, useContext, useReducer, useEffect } from 'react';

const MarketingFunnelContext = createContext();

const initialState = {
  currentStep: 1,
  // Keep in sync with stepComponents length in MarketingFunnelFlow
  totalSteps: 21,
  data: {
    // Existing
    ageGroup: null,
    mood: null,
    hobbies: [],
    supportPreference: null,
    wantsPersonalization: null,

    // New funnel data
    intensity: 0, // 0-10
    isHighIntensity: false, // derived flag (>=7)
    primaryTopic: null, // string
    symptomPatterns: [], // max 2
    triggers: [], // multi-select
    wantsVoiceDemo: false,
    copingAnchors: [], // max 3
    supportStyle: null,
    timeBudget: null,
    boundaries: [],
    accountabilityStyle: null,
    goal30: null,
    languagePref: null, // optional for plan preview
    voicePref: null, // optional for plan preview
    checkinTime: null, // optional for plan preview
    email: null, // user email for plan delivery
  },
  isAnimating: false,
  direction: 'forward',
  visitedSteps: new Set([1]), // Track visited steps to prevent auto-redirect
  maxReachedStep: 1 // Track the furthest step reached
};

const funnelReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STEP': {
      // Ensure we don't go beyond valid step range
      const targetStep = Math.max(1, Math.min(action.payload, state.totalSteps));
      const newVisitedSteps = new Set(state.visitedSteps);
      newVisitedSteps.add(targetStep);
      
      return {
        ...state,
        currentStep: targetStep,
        direction: targetStep > state.currentStep ? 'forward' : 'backward',
        visitedSteps: newVisitedSteps,
        maxReachedStep: Math.max(state.maxReachedStep, targetStep)
      };
    }
    
    case 'NEXT_STEP':{
      // Add validation to prevent auto-skipping steps
      const nextStep = Math.min(state.currentStep + 1, state.totalSteps);
      const nextVisitedSteps = new Set(state.visitedSteps);
      nextVisitedSteps.add(nextStep);
      
      return {
        ...state,
        currentStep: nextStep,
        direction: 'forward',
        visitedSteps: nextVisitedSteps,
        maxReachedStep: Math.max(state.maxReachedStep, nextStep)
      };
    }
    case 'PREVIOUS_STEP':{
      // Ensure we can always go back to previous steps
      const prevStep = Math.max(state.currentStep - 1, 1);
      return {
        ...state,
        currentStep: prevStep,
        direction: 'backward'
        // Don't update visitedSteps or maxReachedStep when going back
      };
  }
    case 'UPDATE_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload
        }
      };
    
    case 'SET_ANIMATING':
      return {
        ...state,
        isAnimating: action.payload
      };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
};

export const MarketingFunnelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(funnelReducer, initialState);

  // Prevent auto-redirect when going back
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Store current progress in sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('funnelProgress', JSON.stringify({
          currentStep: state.currentStep,
          maxReachedStep: state.maxReachedStep,
          visitedSteps: Array.from(state.visitedSteps),
          data: state.data
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state]);

  // Restore progress on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProgress = sessionStorage.getItem('funnelProgress');
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress);
          // Only restore if we're not already past the saved progress
          if (state.currentStep === 1 && progress.currentStep > 1) {
            dispatch({ type: 'SET_STEP', payload: progress.currentStep });
            dispatch({ type: 'UPDATE_DATA', payload: progress.data });
          }
        } catch (e) {
          console.warn('Failed to restore funnel progress:', e);
        }
      }
    }
  }, []);

  const actions = {
    setStep: (step) => dispatch({ type: 'SET_STEP', payload: step }),
    nextStep: () => dispatch({ type: 'NEXT_STEP' }),
    previousStep: () => dispatch({ type: 'PREVIOUS_STEP' }),
    updateData: (data) => dispatch({ type: 'UPDATE_DATA', payload: data }),
    setAnimating: (isAnimating) => dispatch({ type: 'SET_ANIMATING', payload: isAnimating }),
    reset: () => {
      // Clear saved progress when resetting
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('funnelProgress');
      }
      dispatch({ type: 'RESET' });
    },
    // New helper method to go to a specific step with validation
    goToStep: (step) => {
      const validStep = Math.max(1, Math.min(step, state.totalSteps));
      dispatch({ type: 'SET_STEP', payload: validStep });
    }
  };

  const value = {
    ...state,
    actions
  };

  return (
    <MarketingFunnelContext.Provider value={value}>
      {children}
    </MarketingFunnelContext.Provider>
  );
};

export const useMarketingFunnel = () => {
  const context = useContext(MarketingFunnelContext);
  if (!context) {
    throw new Error('useMarketingFunnel must be used within a MarketingFunnelProvider');
  }
  return context;
};
