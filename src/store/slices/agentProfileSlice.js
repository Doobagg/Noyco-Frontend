import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../lib/api';

// Initial state
const initialState = {
  profiles: [],
  currentProfile: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  lastUpdated: null,
};

// Async thunks
export const createAgentProfile = createAsyncThunk(
  'agentProfile/create',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.user?.role_entity_id) {
        return rejectWithValue('User role entity ID not found');
      }

      if (!auth.csrfToken) {
        return rejectWithValue('CSRF token missing');
      }

      // Add debugging
      console.log('Creating profile with data:', JSON.stringify(profileData, null, 2));
      
      // Validate that profile_name exists
      if (!profileData.profile_name) {
        console.error('VALIDATION ERROR: profile_name is missing from profileData');
        return rejectWithValue('Profile name is required');
      }

      const data = await apiRequest(`/user-profile/${auth.user.role_entity_id}`, {
        method: 'POST',
        headers: {
          'X-CSRF-Token': auth.csrfToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
        credentials: 'include',
      });

      return data;
    } catch (error) {
      console.error('Profile creation error:', error);
      return rejectWithValue(error.message || 'Failed to create agent profile');
    }
  }
);

export const fetchAgentProfiles = createAsyncThunk(
  'agentProfile/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.user?.role_entity_id) {
        return rejectWithValue('User role entity ID not found');
      }

      const data = await apiRequest(`/user-profile/${auth.user.role_entity_id}`, {
        method: 'GET',
        credentials: 'include',
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch agent profiles');
    }
  }
);

export const fetchAgentProfileById = createAsyncThunk(
  'agentProfile/fetchById',
  async (userProfileId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.user?.role_entity_id) {
        return rejectWithValue('User role entity ID not found');
      }

      const data = await apiRequest(`/user-profile/${auth.user.role_entity_id}/${userProfileId}`, {
        method: 'GET',
        credentials: 'include',
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch agent profile');
    }
  }
);

export const updateAgentProfile = createAsyncThunk(
  'agentProfile/update',
  async ({ userProfileId, profileData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.user?.role_entity_id) {
        return rejectWithValue('User role entity ID not found');
      }

      if (!auth.csrfToken) {
        return rejectWithValue('CSRF token missing');
      }

      const data = await apiRequest(`/user-profile/${auth.user.role_entity_id}/${userProfileId}`, {
        method: 'PUT',
        headers: {
          'X-CSRF-Token': auth.csrfToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
        credentials: 'include',
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update agent profile');
    }
  }
);

export const deleteAgentProfile = createAsyncThunk(
  'agentProfile/delete',
  async (userProfileId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.user?.role_entity_id) {
        return rejectWithValue('User role entity ID not found');
      }

      if (!auth.csrfToken) {
        return rejectWithValue('CSRF token missing');
      }

      await apiRequest(`/user-profile/${auth.user.role_entity_id}/${userProfileId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': auth.csrfToken,
        },
        credentials: 'include',
      });

      return { userProfileId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete agent profile');
    }
  }
);

// Agent Profile slice
const agentProfileSlice = createSlice({
  name: 'agentProfile',
  initialState,
  reducers: {
    setCurrentProfile: (state, action) => {
      state.currentProfile = action.payload;
    },
    clearCurrentProfile: (state) => {
      state.currentProfile = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetProfiles: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create agent profile
      .addCase(createAgentProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAgentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Backend returns { user_profile_id, role_entity_id, message, profile: {...} }
        const created = action.payload?.profile || action.payload;
        state.profiles.unshift(created); // Add created profile object to beginning of array
        state.totalCount += 1;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(createAgentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch all agent profiles
      .addCase(fetchAgentProfiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAgentProfiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profiles = action.payload.profiles || [];
        state.totalCount = action.payload.total_count || 0;
        state.lastUpdated = action.payload.updated_at || new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchAgentProfiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch agent profile by ID
      .addCase(fetchAgentProfileById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAgentProfileById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
        
        // Update the profile in the profiles array if it exists
        const index = state.profiles.findIndex(
          profile => (profile.user_profile_id || profile?.profile?.user_profile_id) === action.payload.user_profile_id
        );
        if (index !== -1) {
          state.profiles[index] = action.payload;
        }
        
        state.error = null;
      })
      .addCase(fetchAgentProfileById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update agent profile
      .addCase(updateAgentProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAgentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Backend returns { message, profile: updated_profile }
        const updated = action.payload?.profile || action.payload;

        // Update the profile in the profiles array
        const index = state.profiles.findIndex(
          profile => (profile.user_profile_id || profile?.profile?.user_profile_id) === updated.user_profile_id
        );
        if (index !== -1) {
          state.profiles[index] = updated;
        }

        // Update current profile if it's the same one
        if (state.currentProfile?.user_profile_id === updated.user_profile_id) {
          state.currentProfile = updated;
        }
        
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(updateAgentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete agent profile
      .addCase(deleteAgentProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAgentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Remove the profile from the profiles array
        state.profiles = state.profiles.filter(
          profile => (profile.user_profile_id || profile?.profile?.user_profile_id) !== action.payload.userProfileId
        );
        
        // Clear current profile if it was the deleted one
        if (state.currentProfile?.user_profile_id === action.payload.userProfileId) {
          state.currentProfile = null;
        }
        
        state.totalCount = Math.max(0, state.totalCount - 1);
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(deleteAgentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setCurrentProfile, 
  clearCurrentProfile, 
  clearError, 
  resetProfiles 
} = agentProfileSlice.actions;

export default agentProfileSlice.reducer;
