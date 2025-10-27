

"use client";

import React, { useState, useEffect } from 'react';
import { useIntegratedFlow } from '../../context/IntegratedFlowContext';
import { useGoals } from '../../../../../../../store/hooks';
import { 
  AlertCircle, 
  ChevronDown, 
  Save, 
  Calendar,
  FileText,
  Clock,
  Users,
  Thermometer,
  Plus,
  X,
  Sparkles,
  Folder,
  Edit3,
  CheckCircle,
  Loader2
} from 'lucide-react';

const AdditionalInfoForm = () => {
  const { selectedAgent, additionalInfo, selectedTaskId, actions } = useIntegratedFlow();
  const { 
    error: goalsError, 
    fetchGoalsByAgent, 
    createOrUpdateGoal,
  } = useGoals();
  
  const [isNewSession, setIsNewSession] = useState(false);
  const [savedTasks, setSavedTasks] = useState([]);
  const [isFetchingGoals, setIsFetchingGoals] = useState(false);
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  
  if (!selectedAgent) {
    return (
      <div className="text-center py-12">
        <div 
          className="w-16 h-16 flex items-center justify-center mx-auto mb-4 border"
          style={{ 
            background: `linear-gradient(135deg, #6b7280, #9ca3af)`,
            borderColor: 'var(--border-accent)'
          }}
        >
          <AlertCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>No Agent Selected</h3>
        <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.6 }}>Please select an agent to continue</p>
      </div>
    );
  }

  const agentKey = selectedAgent.key;
  const currentInfo = additionalInfo[agentKey] || {};

  // Load saved tasks/goals from backend
  useEffect(() => {
    const loadGoals = async () => {
      if (!selectedAgent || isFetchingGoals) return;
      
      setIsFetchingGoals(true);
      try {
        const result = await fetchGoalsByAgent(agentKey);
        if (result.success) {
          // Transform backend goals to match frontend format
          const transformedTasks = result.data.goals.map(goal => ({
            id: goal.goal_id || goal.id || Date.now(),
            agentType: agentKey,
            title: goal.title,
            description: goal.description,
            created_at: goal.created_at,
            // Include additional fields for social_prep
            ...(agentKey === 'social_prep' && {
              event_type: goal.event_type,
              event_date: goal.event_date,
              anxiety_level: goal.anxiety_level,
              nervous_thoughts: goal.nervous_thoughts || [],
              physical_symptoms: goal.physical_symptoms || []
            })
          }));
          
          setSavedTasks(transformedTasks);
          
          // Set default selection to first relevant task if available
          if (transformedTasks.length > 0 && !selectedTaskId && !isNewSession) {
            actions.setSelectedTaskId(transformedTasks[0].id);
            handleSelectTask(transformedTasks[0]);
          }
        } else {
          console.error('Failed to fetch goals:', result.error);
          // Fallback to empty array
          setSavedTasks([]);
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
        setSavedTasks([]);
      } finally {
        setIsFetchingGoals(false);
      }
    };

    loadGoals();
  }, [agentKey, selectedAgent]);

  const canProceed = !isNewSession || (currentInfo.title && currentInfo.title.trim().length > 0);
  const relevantTasks = savedTasks.filter(task => task.agentType === agentKey);

  const handleChange = (field, value) => {
    actions.setAdditionalInfo({
      [agentKey]: { ...currentInfo, [field]: value }
    });
  };

  const handleSelectTask = (task) => {
    actions.setSelectedTaskId(task.id);
    setIsNewSession(false);
    
    const updatedInfo = {
      title: task.title,
      description: task.description,
      due_date: ''
    };

    if (agentKey === 'social_prep') {
      updatedInfo.event_date = '';
      updatedInfo.event_type = '';
      updatedInfo.anxiety_level = 5;
      updatedInfo.nervous_thoughts = [];
      updatedInfo.physical_symptoms = [];
    }

    actions.setAdditionalInfo({
      [agentKey]: { ...currentInfo, ...updatedInfo }
    });
  };

  const handleCreateNew = () => {
    setIsNewSession(true);
    actions.setSelectedTaskId(null);
    
    const clearedInfo = {
      title: '',
      description: '',
      due_date: ''
    };

    if (agentKey === 'social_prep') {
      clearedInfo.event_date = '';
      clearedInfo.event_type = '';
      clearedInfo.anxiety_level = 5;
      clearedInfo.nervous_thoughts = [];
      clearedInfo.physical_symptoms = [];
    }

    actions.setAdditionalInfo({ [agentKey]: clearedInfo });
  };

  const handleSaveNew = async () => {
    if (currentInfo.title && currentInfo.title.trim()) {
      setIsSavingGoal(true);
      
      try {
        // Prepare goal data for backend
        const goalData = {
          title: currentInfo.title,
          description: currentInfo.description || '',
          due_date: currentInfo.due_date || null,
          status: 'active'
        };

        // Add agent-specific fields
        if (agentKey === 'social_prep') {
          goalData.event_type = currentInfo.event_type || '';
          goalData.event_date = currentInfo.event_date || null;
          goalData.anxiety_level = currentInfo.anxiety_level || 5;
          goalData.nervous_thoughts = currentInfo.nervous_thoughts || [];
          goalData.physical_symptoms = currentInfo.physical_symptoms || [];
        }

        // Save to backend
        const result = await createOrUpdateGoal(agentKey, goalData);
        
        console.log('🔍 Goal creation result:', result);
        console.log('🔍 result.data:', result.data);
        console.log('🔍 result.data.goal_id:', result.data?.goal_id);
        console.log('🔍 result.data.goal:', result.data?.goal);
        console.log('🔍 result.data.goal.goal_id:', result.data?.goal?.goal_id);
        
        if (result.success) {
          // Create task object for local state
          const newTask = {
            id: result.data.goal?.goal_id || result.data.goal_id || Date.now(),
            agentType: agentKey,
            title: currentInfo.title,
            description: currentInfo.description || '',
            created_at: new Date().toISOString().split('T')[0],
            ...(agentKey === 'social_prep' && {
              event_type: currentInfo.event_type,
              event_date: currentInfo.event_date,
              anxiety_level: currentInfo.anxiety_level,
              nervous_thoughts: currentInfo.nervous_thoughts || [],
              physical_symptoms: currentInfo.physical_symptoms || []
            })
          };
          
          console.log('📝 Created newTask with id:', newTask.id);
          
          // Update local saved tasks
          setSavedTasks(prev => [...prev, newTask]);
          actions.setSelectedTaskId(newTask.id);
          setIsNewSession(false);
          
          console.log('Goal saved successfully');
        } else {
          console.error('Failed to save goal:', result.error);
          // You might want to show an error toast here
        }
      } catch (error) {
        console.error('Error saving goal:', error);
      } finally {
        setIsSavingGoal(false);
      }
    }
  };

  const handleCancelNew = () => {
    setIsNewSession(false);
    // Reset to first available task or clear if none
    if (relevantTasks.length > 0) {
      handleSelectTask(relevantTasks[0]);
    }
  };

  return (
    <div className="p-4 sm:p-6" style={{ backgroundColor: 'var(--beige)' }}>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          {/* <div 
            className="w-16 h-16 flex items-center justify-center mx-auto mb-4 border"
            style={{ 
              background: `linear-gradient(135deg, var(--border-accent), #3b82f6)`,
              borderColor: 'var(--border-accent)'
            }}
          >
            <Target className="w-8 h-8 text-white" />
          </div> */}
          <h1 className="text-2xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Session Configuration
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            Configure your {selectedAgent.name} session details
          </p>
        </div>

     
        {/* Session Selection Section */}
        {!isNewSession && (
           <div 
           className="bg-beige backdrop-blur-xl border-accent-right border-accent-left border-accent-top border-accent overflow-hidden shadow-lg"
         >
            <div 
              className="border-b px-6 py-4"
              style={{ 
                backgroundColor: 'var(--beige)',
                borderBottomColor: 'var(--border-accent)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 flex items-center justify-center"
                    style={{ backgroundColor: '#10b981' }}
                  >
                    <Folder className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: '#065f46' }}>
                      Select Existing Session
                    </h3>
                    <p className="text-sm" style={{ color: '#047857' }}>
                      Choose from your saved session templates
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] border-accent-right border-accent-left border-accent-top border-accent shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  style={{
                      color: 'var(--foreground)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '1';
                  }}
                >
                  <Plus className="w-4 h-4" />
                  New Session
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {isFetchingGoals ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
                  <span className="text-gray-600">Loading saved sessions...</span>
                </div>
              ) : relevantTasks.length > 0 ? (
                <div className="space-y-4">
                  <div className="relative">
                    <select
                      value={selectedTaskId || ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          const task = relevantTasks.find(t => t.id.toString() === e.target.value);
                          if (task) handleSelectTask(task);
                        }
                      }}
                      className="w-full px-4 py-3 pr-10 border border-gray-300  focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none text-sm  transition-all duration-200"
                    >
                      <option value="">Select a session template...</option>
                      {relevantTasks.map((task) => (
                        <option key={task.id} value={task.id}>
                          {task.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Selected Task Preview */}
                  {selectedTaskId && (
                    <div className="bg-emerald-50/50 border border-emerald-200  p-4">
                      {(() => {
                        const selectedTask = relevantTasks.find(t => t.id === selectedTaskId);
                        return selectedTask ? (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              <h4 className="font-semibold text-emerald-900">
                                {selectedTask.title}
                              </h4>
                            </div>
                            <p className="text-sm text-emerald-700 mb-3">
                              {selectedTask.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-emerald-600">
                              <Calendar className="w-3 h-3" />
                              Created: {new Date(selectedTask.created_at).toLocaleDateString()}
                            </div>

                            {/* Session Configuration within selected task */}
                            <div className="mt-4 pt-4 border-t border-emerald-200 space-y-4">
                              <h5 className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Session Configuration
                              </h5>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-semibold text-emerald-700 mb-2">
                                    <Calendar className="w-3 h-3 inline mr-1" />
                                    Target Date
                                  </label>
                                  <input
                                    type="datetime-local"
                                    value={currentInfo.due_date ? new Date(currentInfo.due_date).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => handleChange('due_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all duration-200"
                                  />
                                </div>

                                {agentKey === 'social_prep' && (
                                  <div>
                                    <label className="block text-xs font-semibold text-emerald-700 mb-2">
                                      <Clock className="w-3 h-3 inline mr-1" />
                                      Event Date
                                    </label>
                                    <input
                                      type="datetime-local"
                                      value={currentInfo.event_date ? new Date(currentInfo.event_date).toISOString().slice(0, 16) : ''}
                                      onChange={(e) => handleChange('event_date', e.target.value)}
                                      className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm  transition-all duration-200"
                                    />
                                  </div>
                                )}
                              </div>

                              {agentKey === 'social_prep' && (
                                <div>
                                  <label className="block text-xs font-semibold text-emerald-700 mb-2">
                                    <Thermometer className="w-3 h-3 inline mr-1" />
                                    Current Anxiety Level: <span className="font-bold text-emerald-800">{currentInfo.anxiety_level || 5}</span>
                                  </label>
                                  <div className="flex items-center space-x-3">
                                    <span className="text-xs text-emerald-600">Calm</span>
                                    <div className="flex-1">
                                      <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={currentInfo.anxiety_level || 5}
                                        onChange={(e) => handleChange('anxiety_level', parseInt(e.target.value))}
                                        className="w-full h-2 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg appearance-none cursor-pointer slider"
                                      />
                                    </div>
                                    <span className="text-xs text-emerald-600">Severe</span>
                                  </div>
                                  <div className="text-center mt-2">
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                      (currentInfo.anxiety_level || 5) <= 3 ? 'bg-green-100 text-green-700' : 
                                      (currentInfo.anxiety_level || 5) <= 6 ? 'bg-yellow-100 text-yellow-700' : 
                                      (currentInfo.anxiety_level || 5) <= 8 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                      {(currentInfo.anxiety_level || 5) <= 3 ? '😌 Mild' : 
                                       (currentInfo.anxiety_level || 5) <= 6 ? '😰 Moderate' : 
                                       (currentInfo.anxiety_level || 5) <= 8 ? '😟 High' : '😱 Severe'}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100  flex items-center justify-center mx-auto mb-3">
                    <Folder className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">
                    {isFetchingGoals ? 'Loading sessions...' : 'No saved sessions found'}
                  </p>
                  {!isFetchingGoals && (
                    <button
                      onClick={handleCreateNew}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors "
                    >
                      <Plus className="w-4 h-4" />
                      New Session
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Error handling */}
            {goalsError && (
              <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-700">
                    Failed to load sessions: {goalsError}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Session Creation Section */}
        {isNewSession && (
            <div className="bg-beige backdrop-blur-xl border-accent-right border-accent-left border-accent-top border-accent overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500  flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      Create New Session
                    </h3>
                    <p className="text-sm text-blue-700">
                      Set up a new session template
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancelNew}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] border-accent-right border-accent-left border-accent-top border-accent text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  style={{
                    color: 'var(--foreground)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '1';
                  }}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Session Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={currentInfo.title || ''}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="Enter session title"
                      className="w-full px-4 py-3 border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Target Date
                    </label>
                    <input
                      type="datetime-local"
                      value={currentInfo.due_date ? new Date(currentInfo.due_date).toISOString().slice(0, 16) : ''}
                      onChange={(e) => handleChange('due_date', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm  transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Description
                  </label>
                  <textarea
                    value={currentInfo.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe what you'd like to focus on in this session..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 resize-none"
                  />
                </div>

                {/* Social Prep Specific Fields */}
                {agentKey === 'social_prep' && (
                  <div className="bg-gray-50/50  p-6 space-y-6">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Event Details
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Event Type
                        </label>
                        <input
                          type="text"
                          value={currentInfo.event_type || ''}
                          onChange={(e) => handleChange('event_type', e.target.value)}
                          placeholder="Job interview, meeting, party..."
                          className="w-full px-4 py-3 border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm  transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Event Date
                        </label>
                        <input
                          type="datetime-local"
                          value={currentInfo.event_date ? new Date(currentInfo.event_date).toISOString().slice(0, 16) : ''}
                          onChange={(e) => handleChange('event_date', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm  transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Anxiety Level */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        <Thermometer className="w-4 h-4 inline mr-2" />
                        Anxiety Level: <span className="font-bold text-blue-600 text-lg">{currentInfo.anxiety_level || 5}</span>
                      </label>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 font-medium">Calm</span>
                        <div className="flex-1 relative">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={currentInfo.anxiety_level || 5}
                            onChange={(e) => handleChange('anxiety_level', parseInt(e.target.value))}
                            className="w-full h-3 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                        <span className="text-sm text-gray-500 font-medium">Severe</span>
                      </div>
                      <div className="text-center mt-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          (currentInfo.anxiety_level || 5) <= 3 ? 'bg-green-100 text-green-800' : 
                          (currentInfo.anxiety_level || 5) <= 6 ? 'bg-yellow-100 text-yellow-800' : 
                          (currentInfo.anxiety_level || 5) <= 8 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {(currentInfo.anxiety_level || 5) <= 3 ? '😌 Mild Concern' : 
                           (currentInfo.anxiety_level || 5) <= 6 ? '😰 Moderate Anxiety' : 
                           (currentInfo.anxiety_level || 5) <= 8 ? '😟 High Anxiety' : '😱 Severe Anxiety'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Actions */}
                <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-200/50  p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      {!canProceed ? (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="w-5 h-5 mr-2" />
                          <span className="font-medium">Session title is required</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          <span className="font-medium">Ready to save session</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={handleSaveNew}
                      disabled={!canProceed || isSavingGoal}
                      className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold  transition-all duration-200 ${
                        canProceed && !isSavingGoal
                          ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg transform hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isSavingGoal ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Session Template
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
    
          border: 3px solid white;
        }
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 3px solid white;
     
        }
        .slider::-webkit-slider-track {
          height: 12px;
          border-radius: 6px;
        }
        .slider::-moz-range-track {
          height: 12px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default AdditionalInfoForm;