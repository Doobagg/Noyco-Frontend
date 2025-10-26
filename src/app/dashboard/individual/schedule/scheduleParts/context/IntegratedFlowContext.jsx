"use client";

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { agentSchemas } from '../utils/agentSchemas';

const IntegratedFlowContext = createContext();

// Action types
const FLOW_ACTIONS = {
  SET_STEP: 'SET_STEP',
  SELECT_AGENT: 'SELECT_AGENT',
  SET_CALL_TIME: 'SET_CALL_TIME',
  SET_ADDITIONAL_INFO: 'SET_ADDITIONAL_INFO',
  SET_SAVED_TASKS: 'SET_SAVED_TASKS',
  ADD_SAVED_TASK: 'ADD_SAVED_TASK',
  SET_SELECTED_TASK_ID: 'SET_SELECTED_TASK_ID',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET_FLOW: 'RESET_FLOW'
};

// Initial state
const initialState = {
  currentStep: 1,
  totalSteps: 4, // 4 steps now: Agent, Additional Info, Call Time, Review
  isLoading: false,
  error: null,
  
  // Step 1: Agent Configuration
  selectedAgent: null,
  
  // Default user profile (since we're removing user profile selection)
  selectedUserProfile: { user_profile_id: 'default', profile_name: 'Default Profile' },
  
  // Step 2: Additional Information (dynamic based on agent)
  additionalInfo: {
    // For Emotional Companion Agent
    emotional_companion: {
      title: 'My Emotional Support Session',
      description: '',
      due_date: ''
    },
    // For Accountability Agent
    accountability_buddy: {
      title: 'My Goal Achievement Session',
      description: '',
      due_date: ''
    },
    // For Social Anxiety Agent
    social_prep: {
      title: 'My Social Confidence Session',
      description: '',
      due_date: '',
      event_date: '',
      event_type: '',
      anxiety_level: 5,
      nervous_thoughts: [],
      physical_symptoms: []
    },
    // For Therapy Agent
    therapy_checkin: {
      title: 'My Mental Wellness Session',
      description: '',
      due_date: ''
    },
    // For Loneliness Support Agent
    loneliness_support: {
      title: 'My Companionship Session',
      description: '',
      due_date: ''
    }
  },

  // Saved tasks for reuse
  savedTasks: [],
  
  // Selected task ID for scheduling (goal_id from backend)
  selectedTaskId: null,
  
  // Step 3: Call Time Selection
  callSettings: {
    callTime: 'immediate',
    scheduledDateTime: '',
    frequency: 'once',
    customFrequency: '',
    repeatInterval: '',
    repeatUnit: 'days',
    selectedDays: []
  },
  
  // Final data for submission
  finalData: null
};

// Reducer function
const flowReducer = (state, action) => {
  // Define disabled agents (temporarily disabled for future integration)
  const disabledAgents = [];
  
  switch (action.type) {
    case FLOW_ACTIONS.SET_STEP:
      return {
        ...state,
        currentStep: action.payload,
        error: null
      };

    case FLOW_ACTIONS.SELECT_AGENT: {
      // Prevent selection of disabled agents
      if (disabledAgents.includes(action.payload?.key)) {
        return {
          ...state,
          error: 'This agent is temporarily disabled and will be available soon.'
        };
      }
      
      // All agents now have additional info, so total steps is always 4
      const newTotalSteps = 4;
      
      return {
        ...state,
        selectedAgent: action.payload,
        totalSteps: newTotalSteps,
        error: null
      };
    }

    case FLOW_ACTIONS.SET_CALL_TIME:
      return {
        ...state,
        callSettings: {
          ...state.callSettings,
          ...action.payload
        },
        error: null
      };

    case FLOW_ACTIONS.SET_ADDITIONAL_INFO:
      return {
        ...state,
        additionalInfo: {
          ...state.additionalInfo,
          ...action.payload
        },
        error: null
      };

    case FLOW_ACTIONS.SET_SAVED_TASKS:
      return {
        ...state,
        savedTasks: action.payload,
        error: null
      };

    case FLOW_ACTIONS.ADD_SAVED_TASK:
      return {
        ...state,
        savedTasks: [...state.savedTasks, action.payload],
        error: null
      };

    case FLOW_ACTIONS.SET_SELECTED_TASK_ID:
      return {
        ...state,
        selectedTaskId: action.payload,
        error: null
      };

    case FLOW_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case FLOW_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case FLOW_ACTIONS.RESET_FLOW:
      return {
        ...initialState
      };

    default:
      return state;
  }
};

// Context Provider
export const IntegratedFlowProvider = ({ children }) => {
  const [state, dispatch] = useReducer(flowReducer, initialState);

  // Define disabled agents (temporarily disabled for future integration)
  const disabledAgents = [];

  // Action creators
  const setStep = useCallback((step) => {
    dispatch({ type: FLOW_ACTIONS.SET_STEP, payload: step });
  }, []);

  const selectAgent = useCallback((agent) => {
    // Prevent selection of disabled agents
    if (disabledAgents.includes(agent?.key)) {
      return;
    }
    dispatch({ type: FLOW_ACTIONS.SELECT_AGENT, payload: agent });
  }, [disabledAgents]);

  const setCallTime = useCallback((callData) => {
    dispatch({ type: FLOW_ACTIONS.SET_CALL_TIME, payload: callData });
  }, []);

  const setAdditionalInfo = useCallback((info) => {
    dispatch({ type: FLOW_ACTIONS.SET_ADDITIONAL_INFO, payload: info });
  }, []);

  const setSavedTasks = useCallback((tasks) => {
    dispatch({ type: FLOW_ACTIONS.SET_SAVED_TASKS, payload: tasks });
  }, []);

  const addSavedTask = useCallback((task) => {
    dispatch({ type: FLOW_ACTIONS.ADD_SAVED_TASK, payload: task });
  }, []);

  const setSelectedTaskId = useCallback((taskId) => {
    dispatch({ type: FLOW_ACTIONS.SET_SELECTED_TASK_ID, payload: taskId });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: FLOW_ACTIONS.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: FLOW_ACTIONS.SET_ERROR, payload: error });
  }, []);

  const resetFlow = useCallback(() => {
    dispatch({ type: FLOW_ACTIONS.RESET_FLOW });
  }, []);

  // Memoize actions object
  const actions = useMemo(() => ({
    setStep,
    selectAgent,
    setCallTime,
    setAdditionalInfo,
    setSavedTasks,
    addSavedTask,
    setSelectedTaskId,
    setLoading,
    setError,
    resetFlow
  }), [setStep, selectAgent, setCallTime, setAdditionalInfo, setSavedTasks, addSavedTask, setSelectedTaskId, setLoading, setError, resetFlow]);

  // Validation functions
  const canProceedToStep = useCallback((step) => {
    // All agents now have additional info steps
    const isAgentDisabled = disabledAgents.includes(state.selectedAgent?.key);
    
    switch (step) {
      case 1:
        return true;
      case 2:
        return state.selectedAgent !== null && !isAgentDisabled;
      case 3: {
        // Step 3 is Call Time for all agents
        const agentKey = state.selectedAgent?.key;
        let additionalInfoValid = false;
        
        if (agentKey && state.additionalInfo[agentKey]) {
          const info = state.additionalInfo[agentKey];
          // Basic validation - at least title is required for all agents
          additionalInfoValid = info.title && info.title.trim() !== '';
        }
        
        return state.selectedAgent !== null && 
               !isAgentDisabled && 
               additionalInfoValid;
      }
      case 4:
        // Step 4 is Review & Confirm
        return state.selectedAgent !== null && 
               !isAgentDisabled &&
               (state.callSettings.callTime === 'immediate' || 
                (state.callSettings.callTime === 'scheduled' && state.callSettings.scheduledDateTime));
      default:
        return false;
    }
  }, [state, disabledAgents]);

  const isCurrentStepValid = useCallback(() => {
    return canProceedToStep(state.currentStep + 1);
  }, [state.currentStep, canProceedToStep]);

  const value = {
    ...state,
    actions,
    canProceedToStep,
    isCurrentStepValid
  };

  return (
    <IntegratedFlowContext.Provider value={value}>
      {children}
    </IntegratedFlowContext.Provider>
  );
};

// Custom hook
export const useIntegratedFlow = () => {
  const context = useContext(IntegratedFlowContext);
  if (!context) {
    throw new Error('useIntegratedFlow must be used within an IntegratedFlowProvider');
  }
  return context;
};
