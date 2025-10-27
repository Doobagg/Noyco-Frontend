import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../lib/api';

// Initial state
const initialState = {
  schedules: {
    data: [],
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 0
  },
  activeSchedules: {
    data: [],
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 0
  },
  scheduleStats: null,
  activeScheduleStats: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  lastCreatedSchedule: null,
  currentView: 'schedules', // 'schedules' or 'active'
};

// Map frontend agent keys to backend agent instance IDs
// const getAgentInstanceId = (agentType) => {
//   const agentTypeMap = {
//     'emotional_companion': 'emotional_companion_v1',
//     'accountability_buddy': 'accountability_buddy_v1', 
//     'social_prep': 'social_anxiety_v1',
//     'therapy_checkin': 'therapy_checkin_v1',
//     'loneliness_support': 'loneliness_support_v1'
//   };
//   return agentTypeMap[agentType] || agentType;
// };

// Convert frontend call settings to backend schedule format
const convertToBackendSchedule = (selectedAgent, callSettings, additionalInfo, userProfile, createdBy, selectedTaskId = null) => {
  const agentKey = selectedAgent.key;
  const info = additionalInfo[agentKey] || {};
  
  console.log('🔍 convertToBackendSchedule - selectedTaskId received:', selectedTaskId);
  console.log('🔍 convertToBackendSchedule - selectedTaskId type:', typeof selectedTaskId);
  
  // Use selectedTaskId as agent_instance_id if available, otherwise generate one
  let agentInstanceId = selectedTaskId;
  if (!agentInstanceId) {
    console.log('⚠️ No selectedTaskId provided, generating new agent_instance_id');
    // If no task is selected, generate a new goal_id pattern
    const timestamp = Date.now();
    const agentTypeMap = {
      'emotional_companion': 'emotional',
      'accountability_buddy': 'accountability',
      'social_prep': 'anxiety', 
      'therapy_checkin': 'therapy',
      'loneliness_support': 'loneliness'
    };
    const backendAgentType = agentTypeMap[agentKey] || agentKey;
    agentInstanceId = `${backendAgentType}_${timestamp}`;
    console.log('✅ Generated new agent_instance_id:', agentInstanceId);
  } else {
    console.log('✅ Using existing selectedTaskId as agent_instance_id:', agentInstanceId);
  }
  
  // Ensure agentInstanceId is always a string
  agentInstanceId = String(agentInstanceId);
  console.log('🎯 Final agent_instance_id (after String conversion):', agentInstanceId);
  
  // Determine schedule time
  const scheduleTime = callSettings.callTime === 'immediate' 
    ? new Date() 
    : new Date(callSettings.scheduledDateTime);

  // Map frequency to repeat type
  let repeatType = 'once';
  let repeatInterval = null;
  let repeatUnit = null;
  let repeatDays = null;

  switch (callSettings.frequency) {
    case 'daily':
      repeatType = 'daily';
      break;
    case 'weekly':
      repeatType = 'weekly';
      if (callSettings.selectedDays && callSettings.selectedDays.length > 0) {
        repeatDays = callSettings.selectedDays;
      }
      break;
    case 'monthly':
      repeatType = 'monthly';
      break;
    case 'custom':
      repeatType = 'custom';
      repeatInterval = parseInt(callSettings.repeatInterval) || 1;
      repeatUnit = callSettings.repeatUnit || 'days';
      break;
  }

  const scheduleRequest = {
    created_by: createdBy,
    user_profile_id: userProfile?.user_profile_id || userProfile?.id || 'default',
    agent_instance_id: agentInstanceId,
    schedule_time: scheduleTime.toISOString(),
    repeat_type: repeatType,
    phone: userProfile?.phone || '+1234567890', // Use user's actual phone or default
    notes: `Scheduled ${selectedAgent.name} session: ${info.title || 'No title'}`,
    condition: null
  };

  // Add repeat configuration if not 'once'
  if (repeatType !== 'once') {
    if (repeatInterval) scheduleRequest.repeat_interval = repeatInterval;
    if (repeatUnit) scheduleRequest.repeat_unit = repeatUnit;
    if (repeatDays) scheduleRequest.repeat_days = repeatDays;
  }

  return scheduleRequest;
};

// Async thunk for creating a new schedule
export const createSchedule = createAsyncThunk(
  'schedule/create',
  async ({ selectedAgent, callSettings, additionalInfo, userProfile, selectedTaskId }, { getState, rejectWithValue }) => {
    try {
      console.log('🚀 createSchedule - Received selectedTaskId:', selectedTaskId);
      console.log('🚀 createSchedule - selectedTaskId type:', typeof selectedTaskId);
      
      const { auth } = getState();
      
      if (!auth.user?.role_entity_id) {
        return rejectWithValue('User not authenticated');
      }

      if (!auth.csrfToken) {
        return rejectWithValue('CSRF token missing');
      }

      // If no userProfile provided, try to get the default one from API
      let actualUserProfile = userProfile;
      if (!actualUserProfile || actualUserProfile.user_profile_id === 'default') {
        try {
          console.log('Fetching user profiles for role_entity_id:', auth.user.role_entity_id);
          const profilesResponse = await apiRequest(`/user-profile/${auth.user.role_entity_id}`, {
            method: 'GET',
            credentials: 'include',
          });
          
          if (profilesResponse.profiles && profilesResponse.profiles.length > 0) {
            // Use the first profile as default
            const profile = profilesResponse.profiles[0];
            actualUserProfile = {
              user_profile_id: profile.user_profile_id || profile.id,
              profile_name: profile.profile_name || profile.name,
              phone: profile.phone || '+1234567890', // Fallback phone
              ...profile
            };
            console.log('Using fetched user profile:', actualUserProfile);
          } else {
            console.log('No user profiles found, using default');
            actualUserProfile = {
              user_profile_id: 'default',
              profile_name: 'Default Profile',
              phone: '+1234567890'
            };
          }
        } catch (error) {
          console.error('Failed to fetch user profiles:', error);
          // Continue with provided profile or default
          actualUserProfile = userProfile || {
            user_profile_id: 'default',
            profile_name: 'Default Profile',
            phone: '+1234567890'
          };
        }
      }

      // Convert frontend data to backend format
      const scheduleRequest = convertToBackendSchedule(
        selectedAgent, 
        callSettings, 
        additionalInfo, 
        actualUserProfile, 
        auth.user.role_entity_id, // Use role_entity_id as created_by
        selectedTaskId // Pass the selectedTaskId as agent_instance_id
      );

      console.log('Creating schedule with data:', scheduleRequest);
      console.log(scheduleRequest)

      const response = await apiRequest('/schedule/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': auth.csrfToken,
        },
        body: JSON.stringify(scheduleRequest),
        credentials: 'include',
      });

      return response;
    } catch (error) {
      console.error('Schedule creation error:', error);
      return rejectWithValue(error.message || 'Failed to create schedule');
    }
  }
);

// Async thunk for fetching schedule statistics
export const fetchScheduleStats = createAsyncThunk(
  'schedule/fetchStats',
  async (filters, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.user?.role_entity_id) {
        return rejectWithValue('User not authenticated');
      }

      const queryParams = new URLSearchParams();
      if (filters?.user_profile_id) {
        queryParams.append('user_profile_id', filters.user_profile_id);
      }
      queryParams.append('created_by', auth.user.role_entity_id);

      const response = await apiRequest(`/schedule/stats?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch schedule stats:', error);
      return rejectWithValue(error.message || 'Failed to fetch schedule statistics');
    }
  }
);

// Async thunk for fetching schedules list
export const fetchSchedules = createAsyncThunk(
  'schedule/fetchList',
  async (filters, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.user?.role_entity_id) {
        return rejectWithValue('User not authenticated');
      }

      const queryParams = new URLSearchParams();
      if (filters?.user_profile_id) {
        queryParams.append('user_profile_id', filters.user_profile_id);
      }
      queryParams.append('created_by', auth.user.role_entity_id);
      if (filters?.status) {
        queryParams.append('status', filters.status);
      }
      queryParams.append('page', filters?.page || 1);
      queryParams.append('per_page', filters?.per_page || 10);

      const response = await apiRequest(`/schedule/list?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      return rejectWithValue(error.message || 'Failed to fetch schedules');
    }
  }
);

// Async thunk for fetching active schedules list
export const fetchActiveSchedules = createAsyncThunk(
  'schedule/fetchActiveList',
  async (filters, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.user?.role_entity_id) {
        return rejectWithValue('User not authenticated');
      }

      const queryParams = new URLSearchParams();
      if (filters?.user_profile_id) {
        queryParams.append('user_profile_id', filters.user_profile_id);
      }
      queryParams.append('created_by', auth.user.role_entity_id);
      queryParams.append('page', filters?.page || 1);
      queryParams.append('per_page', filters?.per_page || 10);

      const response = await apiRequest(`/schedule/active/list?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch active schedules:', error);
      return rejectWithValue(error.message || 'Failed to fetch active schedules');
    }
  }
);

// Async thunk for fetching active schedule statistics
export const fetchActiveScheduleStats = createAsyncThunk(
  'schedule/fetchActiveStats',
  async (filters, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.user?.role_entity_id) {
        return rejectWithValue('User not authenticated');
      }

      const queryParams = new URLSearchParams();
      if (filters?.user_profile_id) {
        queryParams.append('user_profile_id', filters.user_profile_id);
      }
      queryParams.append('created_by', auth.user.role_entity_id);

      const response = await apiRequest(`/schedule/active/stats?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch active schedule stats:', error);
      return rejectWithValue(error.message || 'Failed to fetch active schedule statistics');
    }
  }
);

// Async thunk for updating schedule
export const updateSchedule = createAsyncThunk(
  'schedule/update',
  async ({ scheduleId, updateData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.csrfToken) {
        return rejectWithValue('CSRF token missing');
      }

      const response = await apiRequest(`/schedule/${scheduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': auth.csrfToken,
        },
        body: JSON.stringify(updateData),
        credentials: 'include',
      });

      return response;
    } catch (error) {
      console.error('Schedule update error:', error);
      return rejectWithValue(error.message || 'Failed to update schedule');
    }
  }
);

// Async thunk for deleting schedule
export const deleteSchedule = createAsyncThunk(
  'schedule/delete',
  async (scheduleId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.csrfToken) {
        return rejectWithValue('CSRF token missing');
      }

      const response = await apiRequest(`/schedule/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': auth.csrfToken,
        },
        credentials: 'include',
      });

      return { scheduleId, response };
    } catch (error) {
      console.error('Schedule deletion error:', error);
      return rejectWithValue(error.message || 'Failed to delete schedule');
    }
  }
);

// Async thunk for schedule actions (pause, resume, cancel)
export const scheduleAction = createAsyncThunk(
  'schedule/action',
  async ({ scheduleId, action }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.csrfToken) {
        return rejectWithValue('CSRF token missing');
      }

      const response = await apiRequest(`/schedule/${scheduleId}/${action}`, {
        method: 'POST',
        headers: {
          'X-CSRF-Token': auth.csrfToken,
        },
        credentials: 'include',
      });

      return { scheduleId, action, response };
    } catch (error) {
      console.error(`Schedule ${action} error:`, error);
      return rejectWithValue(error.message || `Failed to ${action} schedule`);
    }
  }
);

// Schedule slice
const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLastCreatedSchedule: (state) => {
      state.lastCreatedSchedule = null;
    },
    resetSchedules: () => {
      return initialState;
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create schedule
      .addCase(createSchedule.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.lastCreatedSchedule = action.payload;
        // Add to schedules list if it exists
        if (action.payload.schedule && state.schedules.data) {
          state.schedules.data.unshift(action.payload.schedule);
          state.schedules.total += 1;
        }
        state.error = null;
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Fetch schedule stats
      .addCase(fetchScheduleStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScheduleStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.scheduleStats = action.payload;
        state.error = null;
      })
      .addCase(fetchScheduleStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch schedules list
      .addCase(fetchSchedules.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.isLoading = false;
        // Store the full response structure with pagination info
        state.schedules = {
          data: action.payload.schedules || [],
          total: action.payload.total || 0,
          page: action.payload.page || 1,
          per_page: action.payload.per_page || 10,
          total_pages: Math.ceil((action.payload.total || 0) / (action.payload.per_page || 10))
        };
        state.error = null;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update schedule
      .addCase(updateSchedule.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Update the schedule in the list
        if (action.payload.schedule && state.schedules.data) {
          const index = state.schedules.data.findIndex(s => s.id === action.payload.schedule.id);
          if (index !== -1) {
            state.schedules.data[index] = action.payload.schedule;
          }
        }
        state.error = null;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Delete schedule
      .addCase(deleteSchedule.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Remove the schedule from the list
        if (state.schedules.data) {
          state.schedules.data = state.schedules.data.filter(s => s.id !== action.payload.scheduleId);
          state.schedules.total = Math.max(0, state.schedules.total - 1);
          state.schedules.total_pages = Math.ceil(state.schedules.total / state.schedules.per_page);
        }
        state.error = null;
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Fetch active schedules
      .addCase(fetchActiveSchedules.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveSchedules.fulfilled, (state, action) => {
        state.isLoading = false;
        // Store the full response structure with pagination info
        state.activeSchedules = {
          data: action.payload.active_schedules || action.payload.data || [],
          total: action.payload.total || 0,
          page: action.payload.page || 1,
          per_page: action.payload.per_page || 10,
          total_pages: Math.ceil((action.payload.total || 0) / (action.payload.per_page || 10))
        };
        state.error = null;
      })
      .addCase(fetchActiveSchedules.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch active schedule stats
      .addCase(fetchActiveScheduleStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveScheduleStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeScheduleStats = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveScheduleStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Schedule actions (pause, resume, cancel)
      .addCase(scheduleAction.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(scheduleAction.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const { scheduleId, action: actionType } = action.payload;
        
        // Update the schedule in the schedules list
        if (state.schedules.data) {
          const scheduleIndex = state.schedules.data.findIndex(s => s.id === scheduleId);
          if (scheduleIndex !== -1) {
            switch (actionType) {
              case 'pause':
                state.schedules.data[scheduleIndex].schedule_action = 'pause';
                break;
              case 'resume':
                state.schedules.data[scheduleIndex].schedule_action = 'active';
                break;
              case 'cancel':
                state.schedules.data[scheduleIndex].schedule_action = 'cancel';
                state.schedules.data[scheduleIndex].status = 'cancelled';
                break;
            }
          }
        }

        // Update the schedule in the active schedules list
        const activeScheduleIndex = state.activeSchedules.data?.findIndex(s => s.call_schedule_id === scheduleId);
        if (activeScheduleIndex !== -1 && state.activeSchedules.data) {
          switch (actionType) {
            case 'pause':
              state.activeSchedules.data[activeScheduleIndex].is_paused = true;
              state.activeSchedules.data[activeScheduleIndex].schedule_action = 'pause';
              break;
            case 'resume':
              state.activeSchedules.data[activeScheduleIndex].is_paused = false;
              state.activeSchedules.data[activeScheduleIndex].schedule_action = 'active';
              break;
            case 'cancel':
              state.activeSchedules.data[activeScheduleIndex].schedule_action = 'cancel';
              break;
          }
        }
        
        state.error = null;
      })
      .addCase(scheduleAction.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearLastCreatedSchedule, resetSchedules, setCurrentView } = scheduleSlice.actions;

export default scheduleSlice.reducer;
