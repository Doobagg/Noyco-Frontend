import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../lib/api';

// Initial state
const initialState = {
  goals: {
    emotional_companion: [],
    accountability_buddy: [],
    social_prep: [],
    therapy_checkin: [],
    loneliness_support: [],
  },
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks for fetching goals by agent type
export const fetchGoalsByAgentType = createAsyncThunk(
  'goals/fetchByAgentType',
  async (agentType, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.user?.role_entity_id) {
        return rejectWithValue('User role entity ID not found');
      }

      // Map frontend agent keys to backend endpoint names
      const agentTypeMap = {
        'emotional_companion': 'emotional',
        'accountability_buddy': 'accountability', 
        'social_prep': 'anxiety',
        'therapy_checkin': 'therapy',
        'loneliness_support': 'loneliness'
      };

      const backendAgentType = agentTypeMap[agentType];
      if (!backendAgentType) {
        return rejectWithValue(`Invalid agent type: ${agentType}`);
      }

      const data = await apiRequest(`/user-profile/goals/${auth.user.role_entity_id}/${backendAgentType}`, {
        method: 'GET',
        credentials: 'include',
      });

      return { agentType, goals: data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch goals');
    }
  }
);

// Async thunk for creating/updating goals
export const createOrUpdateGoalThunk = createAsyncThunk(
  'goals/createOrUpdate',
  async ({ agentType, goalData, userProfileId }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.csrfToken) {
        return rejectWithValue('CSRF token missing');
      }

      // Get user profile ID if not provided
      let actualUserProfileId = userProfileId;
      if (!actualUserProfileId) {
        // Fetch user profiles to get the user_profile_id
        const profilesData = await apiRequest(`/user-profile/${auth.user.role_entity_id}`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (profilesData.profiles && profilesData.profiles.length > 0) {
          actualUserProfileId = profilesData.profiles[0].user_profile_id;
        } else {
          return rejectWithValue('No user profile found');
        }
      }

      // Map frontend agent keys to backend endpoint names
      const agentTypeMap = {
        'emotional_companion': 'emotional',
        'accountability_buddy': 'accountability', 
        'social_prep': 'anxiety',
        'therapy_checkin': 'therapy',
        'loneliness_support': 'loneliness'
      };

      const backendAgentType = agentTypeMap[agentType];
      if (!backendAgentType) {
        return rejectWithValue(`Invalid agent type: ${agentType}`);
      }

      const data = await apiRequest(`/user-profile/goals/${backendAgentType}/${actualUserProfileId}`, {
        method: 'PUT',
        headers: {
          'X-CSRF-Token': auth.csrfToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
        credentials: 'include',
      });

      return { agentType, goal: data, userProfileId: actualUserProfileId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create/update goal');
    }
  }
);

// Goals slice
const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetGoals: () => {
      return initialState;
    },
    // Add a goal to local state without API call (for immediate UI updates)
    addGoalLocally: (state, action) => {
      const { agentType, goal } = action.payload;
      if (state.goals[agentType]) {
        state.goals[agentType].push(goal);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch goals by agent type
      .addCase(fetchGoalsByAgentType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoalsByAgentType.fulfilled, (state, action) => {
        state.isLoading = false;
        const { agentType, goals } = action.payload;
        state.goals[agentType] = goals;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchGoalsByAgentType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create/Update goal
      .addCase(createOrUpdateGoalThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrUpdateGoalThunk.fulfilled, (state) => {
        state.isLoading = false;
        // const { agentType } = action.payload;
        
        // Refresh the goals for this agent type
        // Note: The actual goal data structure from the backend might be different
        // so we'll need to refetch to get the updated list
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(createOrUpdateGoalThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetGoals, addGoalLocally } = goalsSlice.actions;

export default goalsSlice.reducer;
