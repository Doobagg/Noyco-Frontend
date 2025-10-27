import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL } from '../lib/constant';
import { apiRequest } from '../lib/api';
import {
  login as loginAction,
  loginWithGoogle as loginWithGoogleAction,
  logout as logoutAction,
  registerUser as registerUserAction,
  checkAuthStatus as checkAuthStatusAction,
  refreshToken as refreshTokenAction
} from './slices/authSlice';
import {
  createAgentProfile,
  fetchAgentProfiles,
  fetchAgentProfileById,
  updateAgentProfile,
  deleteAgentProfile,
  setCurrentProfile,
  clearCurrentProfile,
  clearError as clearAgentProfileError,
  resetProfiles
} from './slices/agentProfileSlice';
import {
  fetchGoalsByAgentType,
  createOrUpdateGoalThunk,
  clearError as clearGoalsError,
  resetGoals as resetGoalsAction,
  addGoalLocally
} from './slices/goalsSlice';
import {
  createSchedule,
  fetchScheduleStats,
  fetchSchedules,
  updateSchedule,
  deleteSchedule,
  clearError as clearScheduleError,
  clearLastCreatedSchedule,
} from './slices/scheduleSlice';
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, csrfToken, loading, error } = useSelector((state) => state.auth);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const result = await dispatch(checkAuthStatusAction()).unwrap();
      return { success: true, user: result.user };
    } catch (error) {
      console.log("Auth check failed:", error);
      return { success: false, error };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const result = await dispatch(loginAction({ email, password })).unwrap();
      // Return the user data from the action result for role-based redirection
      return {
        success: true,
        user: result.user
      };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Google Login function
  const loginWithGoogle = async (idToken) => {
    try {
      const result = await dispatch(loginWithGoogleAction({ id_token: idToken })).unwrap();
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Register hospital function`
  const registerUser = async (hospitalData) => {
    try {
      const result = await dispatch(registerUserAction(hospitalData)).unwrap();
      return {
        success: true,
        user: result.user
      };
    } catch (error) {
      return { success: false, error };
    }
  };

  // createAssistant functionality removed - no longer supporting assistant creation

  // OTP functions
  const sendOTP = async (email) => {
    try {
      await apiRequest('/auth/otp/send', { method: 'POST', body: JSON.stringify({ email }) });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      await apiRequest('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ email, otp }) });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Refresh token function
  const refreshAuthToken = async () => {
    try {
      const result = await dispatch(refreshTokenAction()).unwrap();
      return { success: true, csrfToken: result.csrf_token };
    } catch (error) {
      console.log("Token refresh failed:", error);
      return { success: false, error };
    }
  };

  // Logout function
  const logout = async () => {
    await dispatch(logoutAction());
  };

  // Update profile (name, phone)
  const updateProfile = async (profileData) => {
    try {
      // remove empty string fields
      const payload = Object.fromEntries(
        Object.entries(profileData).filter(([, v]) => v !== undefined && v !== '')
      );
      await apiRequest('/auth/me/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : {}
      });
      await dispatch(checkAuthStatusAction());
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Change password
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await apiRequest('/auth/password/update', {
        method: 'POST',
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
        headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : {}
      });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    user,
    isAuthenticated,
    csrfToken,
    loading,
    error,
    login,
    loginWithGoogle,
    logout,
    registerUser,
    sendOTP,
    verifyOTP,
    checkAuthStatus,
    refreshAuthToken,
    updateProfile,
    updatePassword
  };
};

// ---------------------------------------------------------------------------
// Metrics Hook – fetches conversation metrics & analytics
// ---------------------------------------------------------------------------

export const useMetrics = () => {
  const { user } = useAuth();
  const [agentTypes, setAgentTypes] = useState([]);
  const [conversations, setConversations] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available agent types
  const fetchAgentTypes = async () => {
    if (!user?.role_entity_id) return;
    
    try {
      const response = await fetch("/api/metrics/agent-types", {
        credentials: "include"
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setAgentTypes(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  // Fetch conversations grouped by agent instance
  const fetchConversations = async (agentType = null) => {
    if (!user?.role_entity_id) return;
    
    setLoading(true);
    setError(null);
    try {
      const url = agentType 
        ? `/api/metrics/conversations?agent_type=${agentType}`
        : `/api/metrics/conversations`;
      
      const response = await fetch(url, {
        credentials: "include"
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setConversations(data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch conversation analytics
  const fetchAnalytics = async (agentType = null) => {
    if (!user?.role_entity_id) return;
    
    try {
      const url = agentType 
        ? `/api/metrics/analytics?agent_type=${agentType}`
        : `/api/metrics/analytics`;
      
      const response = await fetch(url, {
        credentials: "include"
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setAnalytics(data);
      return data;
    } catch (err) {
      setError(err.message);
    }
  };

  // Get conversation detail with full context
  const getConversationDetail = async (conversationId) => {
    try {
      const response = await fetch(`/api/metrics/conversations/${conversationId}`, {
        credentials: "include"
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Legacy support for dashboard
  const fetchDashboard = async () => {
    await Promise.all([
      fetchAgentTypes(),
      fetchConversations(),
      fetchAnalytics()
    ]);
  };

  // Legacy getTranscript method
  const getTranscript = async (conversationId) => {
    const detail = await getConversationDetail(conversationId);
    return {
      messages: detail.context.map(msg => ({
        sender: msg.role,
        message: msg.content,
        timestamp: msg.timestamp || new Date().toISOString()
      }))
    };
  };

  // Removed schedule controls as they're not part of conversation metrics

  useEffect(() => {
    if (user?.role_entity_id) {
      fetchDashboard();
    }
  }, [user?.role_entity_id]);

  return {
    // New structure
    agentTypes,
    conversations,
    analytics,
    loading,
    error,
    fetchAgentTypes,
    fetchConversations,
    fetchAnalytics,
    getConversationDetail,
    
    // Legacy support
    dashboard: { conversation_analytics: analytics },
    refresh: fetchDashboard,
    getTranscript,
    
    // Removed schedule controls
    pauseSchedule: () => {},
    resumeSchedule: () => {},
    cancelSchedule: () => {},
    deleteSchedule: () => {},
  };
};

// Agent Profile Hook
export const useAgentProfile = () => {
  const dispatch = useDispatch();
  const { 
    profiles, 
    currentProfile, 
    isLoading, 
    error, 
    totalCount, 
    lastUpdated 
  } = useSelector(state => state.agentProfile);
  const { user } = useAuth();

  const createProfile = async (profileData) => {
    try {
      const result = await dispatch(createAgentProfile(profileData));
      if (createAgentProfile.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const fetchProfiles = async () => {
    try {
      const result = await dispatch(fetchAgentProfiles());
      if (fetchAgentProfiles.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const fetchProfileById = async (userProfileId) => {
    try {
      const result = await dispatch(fetchAgentProfileById(userProfileId));
      if (fetchAgentProfileById.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (userProfileId, profileData) => {
    try {
      const result = await dispatch(updateAgentProfile({ userProfileId, profileData }));
      if (updateAgentProfile.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteProfile = async (userProfileId) => {
    try {
      const result = await dispatch(deleteAgentProfile(userProfileId));
      if (deleteAgentProfile.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const setActiveProfile = (profile) => {
    dispatch(setCurrentProfile(profile));
  };

  const clearActiveProfile = () => {
    dispatch(clearCurrentProfile());
  };

  const clearProfileError = () => {
    dispatch(clearAgentProfileError());
  };

  const resetAllProfiles = () => {
    dispatch(resetProfiles());
  };

  // Auto-fetch profiles when user is available
  useEffect(() => {
    if (user?.role_entity_id && profiles.length === 0 && !isLoading) {
      fetchProfiles();
    }
  }, [user?.role_entity_id]);

  return {
    // State
    profiles,
    currentProfile,
    isLoading,
    error,
    totalCount,
    lastUpdated,
    
    // Actions
    createProfile,
    fetchProfiles,
    fetchProfileById,
    updateProfile,
    deleteProfile,
    setActiveProfile,
    clearActiveProfile,
    clearProfileError,
    resetAllProfiles,
  };
};

// Agent Metrics Hook
export const useAgentMetrics = () => {
  const { user } = useAuth();
  const [agentTypes, setAgentTypes] = useState([]);
  const [agentMetrics, setAgentMetrics] = useState(null);
  const [goalProgressData, setGoalProgressData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Import API_BASE_URL from constants instead of redefining
  // const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch available agent types with statistics
  const fetchAgentTypes = async () => {
    if (!user?.role_entity_id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/metrics/agents/types`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch agent types');
      
      const data = await response.json();
      setAgentTypes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching agent types:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch metrics for a specific agent type
  const fetchAgentMetrics = async (agentType, timeframe = '7d') => {
    if (!user?.role_entity_id || !agentType) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/metrics/agents/${agentType}/metrics?timeframe=${timeframe}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch agent metrics');
      
      const data = await response.json();
      setAgentMetrics(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching agent metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch goal progress data for charts
  const fetchGoalProgressData = async (agentType, goalId, timeframe = '30d') => {
    if (!user?.role_entity_id || !agentType || !goalId) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/metrics/agents/${agentType}/goals/${goalId}/progress?timeframe=${timeframe}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch goal progress data');
      
      const data = await response.json();
      setGoalProgressData(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching goal progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics summary across all agent types
  const fetchAgentAnalyticsSummary = async (timeframe = '30d') => {
    if (!user?.role_entity_id) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/metrics/agents/analytics/summary?timeframe=${timeframe}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch analytics summary');
      
      const data = await response.json();
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analytics summary:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Initialize agent types on user change
  useEffect(() => {
    if (user?.role_entity_id) {
      fetchAgentTypes();
    }
  }, [user?.role_entity_id]);

  return {
    agentTypes,
    agentMetrics,
    goalProgressData,
    loading,
    error,
    fetchAgentTypes,
    fetchAgentMetrics,
    fetchGoalProgressData,
    fetchAgentAnalyticsSummary,
    clearError,
  };
};

// Goals Hook
export const useGoals = () => {
  const dispatch = useDispatch();
  const { goals, isLoading, error, lastUpdated } = useSelector(state => state.goals);

  const fetchGoalsByAgent = async (agentType) => {
    try {
      const result = await dispatch(fetchGoalsByAgentType(agentType)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error };
    }
  };

  const createOrUpdateGoal = async (agentType, goalData, userProfileId) => {
    try {
      const result = await dispatch(createOrUpdateGoalThunk({ agentType, goalData, userProfileId })).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error };
    }
  };

  const getGoalsForAgent = (agentType) => {
    return goals[agentType] || [];
  };

  const clearError = () => {
    dispatch(clearGoalsError());
  };

  const resetGoals = () => {
    dispatch(resetGoalsAction());
  };

  const addGoalLocallyToState = (agentType, goal) => {
    dispatch(addGoalLocally({ agentType, goal }));
  };

  return {
    goals,
    isLoading,
    error,
    lastUpdated,
    fetchGoalsByAgent,
    createOrUpdateGoal,
    getGoalsForAgent,
    clearError,
    resetGoals,
    addGoalLocallyToState,
  };
};

export const useSchedule = () => {
  const dispatch = useDispatch();
  const { 
    schedules, 
    scheduleStats, 
    isLoading, 
    isSubmitting, 
    error, 
    lastCreatedSchedule 
  } = useSelector((state) => state.schedule);

  // Create a new schedule
  const scheduleCall = async (selectedAgent, callSettings, additionalInfo, userProfile, selectedTaskId = null) => {
    try {
      const result = await dispatch(createSchedule({
        selectedAgent,
        callSettings,
        additionalInfo,
        userProfile,
        selectedTaskId
      })).unwrap();
      return { success: true, data: result };
    } catch (error) {
      console.error('Schedule creation failed:', error);
      return { success: false, error };
    }
  };

  // Fetch schedule statistics
  const getScheduleStats = async (filters) => {
    try {
      const result = await dispatch(fetchScheduleStats(filters)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to fetch schedule stats:', error);
      return { success: false, error };
    }
  };

  // Fetch schedules list
  const getSchedules = async (filters) => {
    try {
      const result = await dispatch(fetchSchedules(filters)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      return { success: false, error };
    }
  };

  // Update schedule
  const updateScheduleById = async (scheduleId, updateData) => {
    try {
      const result = await dispatch(updateSchedule({ scheduleId, updateData })).unwrap();
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to update schedule:', error);
      return { success: false, error };
    }
  };

  // Delete schedule
  const deleteScheduleById = async (scheduleId) => {
    try {
      const result = await dispatch(deleteSchedule(scheduleId)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      return { success: false, error };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch(clearScheduleError());
  };

  // Clear last created schedule
  const clearLastCreated = () => {
    dispatch(clearLastCreatedSchedule());
  };

  // Reset schedules
  const resetSchedules = () => {
    dispatch(resetSchedules());
  };

  return {
    schedules,
    scheduleStats,
    isLoading,
    isSubmitting,
    error,
    lastCreatedSchedule,
    scheduleCall,
    getScheduleStats,
    getSchedules,
    updateScheduleById,
    deleteScheduleById,
    clearError,
    clearLastCreated,
    resetSchedules,
  };
};
