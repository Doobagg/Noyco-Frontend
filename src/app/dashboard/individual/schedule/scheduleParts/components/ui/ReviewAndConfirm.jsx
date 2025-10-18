"use client";

import React, { useState } from 'react';
import { useIntegratedFlow } from '../../context/IntegratedFlowContext';
import { useSchedule } from '../../../../../../../store/hooks';
import { useRouter } from 'next/navigation';
import { showToast } from '@/lib/toast';
import { 
  CheckCircle, 
  User, 
  Calendar, 
  Clock, 
  Sparkles, 
  Phone,
  AlertCircle,
  Loader2,
  Heart
} from 'lucide-react';

const ReviewAndConfirm = () => {
  const { 
    selectedAgent, 
    callSettings,
    additionalInfo,
    selectedUserProfile,
    selectedTaskId,
    actions 
  } = useIntegratedFlow();
  
  const { scheduleCall, isSubmitting, error: scheduleError, clearError } = useSchedule();
  const router = useRouter();
  const [submitError, setSubmitError] = useState(null);

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAgentIcon = (agentType) => {
    const agentSchemas = {
      emotional_companion: <Heart className="w-8 h-8" />,
      accountability_buddy: <CheckCircle className="w-8 h-8" />,
      loneliness_support: <User className="w-8 h-8" />,
      therapy_checkin: <Calendar className="w-8 h-8" />,
      social_prep: <Phone className="w-8 h-8" />
    };
    return agentSchemas[agentType] || <User className="w-8 h-8" />;
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    clearError(); // Clear any previous schedule errors

    try {
      // The schedule slice will handle fetching the actual user profile
      // if none is provided or if it's the default one
      const userProfile = selectedUserProfile || null;

      console.log('🎯 ReviewAndConfirm - selectedTaskId value:', selectedTaskId);
      console.log('🎯 ReviewAndConfirm - selectedTaskId type:', typeof selectedTaskId);
      console.log('🎯 ReviewAndConfirm - selectedAgent:', selectedAgent);
      console.log('🎯 ReviewAndConfirm - callSettings:', callSettings);
      console.log('🎯 ReviewAndConfirm - additionalInfo:', additionalInfo);

      // Call the schedule API
      const result = await scheduleCall(
        selectedAgent,
        callSettings,
        additionalInfo,
        userProfile,
        selectedTaskId  // Pass the selectedTaskId as agent_instance_id
      );

      if (result.success) {
        // Success! Show success message and redirect
        actions.resetFlow(); // Clear all data
        
        // Show a success toast
        showToast('Call scheduled successfully!', 'success');
        
        // Redirect to dashboard or schedule list
        router.push('/dashboard/individual/schedule');
      } else {
        throw new Error(result.error || 'Failed to schedule call');
      }
      
    } catch (error) {
      console.error('Error scheduling call:', error);
      setSubmitError(error.message || error || 'Failed to schedule call');
      showToast(error.message || 'Failed to schedule call', 'error');
    }
  };

  const isReadyToSubmit = () => {
    const baseRequirements = selectedAgent && 
      (callSettings.callTime === 'immediate' || 
       (callSettings.callTime === 'scheduled' && callSettings.scheduledDateTime));
    
    if (!baseRequirements) return false;

    // Check additional info requirements - all agents now require at least a title
    const agentKey = selectedAgent?.key;
    if (agentKey && additionalInfo[agentKey]) {
      const info = additionalInfo[agentKey];
      return info.title && info.title.trim() !== '';
    }

    return true;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
      
        <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
          Review & Confirm
        </h2>
        <p className="max-w-2xl mx-auto" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
          Please review all details before scheduling your AI agent call.
        </p>
      </div>

      {/* Error Display */}
      {(submitError || scheduleError) && (
        <div 
          className="mb-6 p-4 bg-beige backdrop-blur-xl border-accent-right border-accent-left border-accent-top border-accent flex items-center shadow-lg"
          style={{ 
          backgroundColor: '#fef2f2'
          }}
        >
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: '#dc2626' }} />
          <div>
            <h3 className="text-sm font-medium" style={{ color: '#991b1b' }}>Scheduling Error</h3>
            <p className="text-sm mt-1" style={{ color: '#b91c1c' }}>{submitError || scheduleError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column: Configuration Details */}
        <div className="space-y-6">
          {/* Agent Information */}
          <div 
              className="bg-beige backdrop-blur-xl border-accent-right border-accent-left border-accent-top border-accent p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3 className="font-semibold mb-4 flex items-center" style={{ color: 'var(--foreground)' }}>
              <Sparkles className="w-5 h-5 mr-2" style={{ color: 'var(--primary-100)' }} />
              Selected Agent
            </h3>
            {selectedAgent ? (
              <div className="flex items-start gap-4">
                 <div className="text-gray-600">{getAgentIcon(selectedAgent.key)}</div>
                <div>
                  <h4 className="font-medium text-lg" style={{ color: 'var(--foreground)' }}>{selectedAgent.name}</h4>
                  <p className="text-sm mt-1" style={{ color: 'var(--foreground)', opacity: 0.7 }}>{selectedAgent.description}</p>
                  <div className="mt-3">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium"
                      style={{ 
                        backgroundColor: 'var(--beige)',
                        color: 'var(--primary-100)',
                        border: '1px solid var(--primary-100)'
                      }}
                    >
                      {Object.keys(selectedAgent.fields).length} configuration options
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-red-600">No agent selected</p>
            )}
          </div>

          {/* Additional Information (for all agents) */}
          {selectedAgent && (
            <div 
                 className="bg-beige backdrop-blur-xl border-accent-right border-accent-left border-accent-top border-accent p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h3 className="font-semibold mb-4 flex items-center" style={{ color: 'var(--foreground)' }}>
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Session Details
              </h3>
              
              {(() => {
                const agentKey = selectedAgent.key;
                const info = additionalInfo[agentKey] || {};
                
                return (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Title:</span>
                      <span style={{ color: 'var(--foreground)' }}>{info.title || 'Not specified'}</span>
                    </div>
                    
                    {info.due_date && (
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Target Date:</span>
                        <span style={{ color: 'var(--foreground)' }}>{formatDateTime(info.due_date)}</span>
                      </div>
                    )}
                    
                    {info.description && (
                      <div 
                        className="pt-2 border-t"
                        style={{ borderTopColor: 'var(--beige)' }}
                      >
                        <span className="font-medium block mb-1" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Description:</span>
                        <p className="text-sm" style={{ color: 'var(--foreground)' }}>{info.description}</p>
                      </div>
                    )}
                    
                    {/* Social Anxiety specific fields */}
                    {agentKey === 'social_prep' && (
                      <>
                        {info.event_type && (
                          <div className="flex justify-between">
                            <span className="font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Event Type:</span>
                            <span style={{ color: 'var(--foreground)' }}>{info.event_type}</span>
                          </div>
                        )}
                        {info.event_date && (
                          <div className="flex justify-between">
                            <span className="font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Event Date:</span>
                            <span style={{ color: 'var(--foreground)' }}>{formatDateTime(info.event_date)}</span>
                          </div>
                        )}
                        {info.anxiety_level && (
                          <div className="flex justify-between">
                            <span className="font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Anxiety Level:</span>
                            <span style={{ color: 'var(--foreground)' }}>{info.anxiety_level}/10</span>
                          </div>
                        )}
                        {info.nervous_thoughts && info.nervous_thoughts.length > 0 && (
                          <div 
                            className="pt-2 border-t"
                            style={{ borderTopColor: 'var(--beige)' }}
                          >
                            <span className="font-medium block mb-1" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Nervous Thoughts:</span>
                            <ul className="text-sm space-y-1">
                              {info.nervous_thoughts.map((thought, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2" style={{ color: 'var(--foreground)', opacity: 0.5 }}>•</span>
                                  <span style={{ color: 'var(--foreground)' }}>{thought}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {info.physical_symptoms && info.physical_symptoms.length > 0 && (
                          <div 
                            className="pt-2 border-t"
                            style={{ borderTopColor: 'var(--beige)' }}
                          >
                            <span className="font-medium block mb-1" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Physical Symptoms:</span>
                            <ul className="text-sm space-y-1">
                              {info.physical_symptoms.map((symptom, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2" style={{ color: 'var(--foreground)', opacity: 0.5 }}>•</span>
                                  <span style={{ color: 'var(--foreground)' }}>{symptom}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Right Column: Call Settings */}
        <div className="space-y-6">
          {/* Call Timing */}
          <div 
             className="bg-beige backdrop-blur-xl border-accent-right border-accent-left border-accent-top border-accent p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3 className="font-semibold mb-4 flex items-center" style={{ color: 'var(--foreground)' }}>
              <Clock className="w-5 h-5 mr-2" style={{ color: '#f97316' }} />
              Call Timing
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Type:</span>
                <span className="capitalize" style={{ color: 'var(--foreground)' }}>
                  {callSettings.callTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Scheduled Time:</span>
                <span style={{ color: 'var(--foreground)' }}>
                  {callSettings.callTime === 'immediate' 
                    ? 'Right now' 
                    : formatDateTime(callSettings.scheduledDateTime)
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Frequency:</span>
                <span style={{ color: 'var(--foreground)' }}>
                  {callSettings.frequency === 'custom' 
                    ? callSettings.customFrequency || 'Custom'
                    : callSettings.frequency.charAt(0).toUpperCase() + callSettings.frequency.slice(1)
                  }
                </span>
              </div>
              {callSettings.frequency === 'weekly' && callSettings.selectedDays && callSettings.selectedDays.length > 0 && (
                <div 
                  className="pt-2 border-t"
                  style={{ borderTopColor: 'var(--beige)' }}
                >
                  <span className="font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Selected Days:</span>
                  <p className="mt-1" style={{ color: 'var(--foreground)' }}>
                    {callSettings.selectedDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Call Summary */}
          <div 
            className="border p-6"
            style={{ 
              backgroundColor: 'var(--beige)',
              borderColor: 'var(--border-accent)'
            }}
          >
            <h3 className="font-semibold mb-4 flex items-center" style={{ color: 'var(--border-accent)' }}>
              <Phone className="w-5 h-5 mr-2" style={{ color: 'var(--border-accent)' }} />
              Call Summary
            </h3>
            <div className="text-sm space-y-2" style={{ color: 'var(--border-accent)' }}>
              <p>
                <strong>Agent:</strong> {selectedAgent?.name || 'Not selected'} will assist you
              </p>
              <p>
                <strong>When:</strong> {
                  callSettings.callTime === 'immediate' 
                    ? 'Immediately after confirmation'
                    : formatDateTime(callSettings.scheduledDateTime)
                }
              </p>
              <p>
                <strong>Frequency:</strong> {
                  callSettings.frequency === 'once' ? 'One-time call' :
                  callSettings.frequency === 'custom' ? callSettings.customFrequency :
                  `${callSettings.frequency.charAt(0).toUpperCase() + callSettings.frequency.slice(1)} calls`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            const hasAdditionalInfo = selectedAgent?.key === 'social_prep' || selectedAgent?.key === 'accountability_buddy';
            const backStep = hasAdditionalInfo ? 4 : 3; // Go back to Call Time step
            actions.setStep(backStep);
          }}
          disabled={isSubmitting}
             className="px-6 py-3 bg-beige backdrop-blur-xl border-accent-right border-accent-left border-accent-top border-accent font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02]"
          style={{
            borderColor: 'var(--border-accent)',
            backgroundColor: '',
            color: 'var(--foreground)'
          }}
          onMouseEnter={(e) => {
            if (!e.target.disabled) {
              e.target.style.backgroundColor = 'var(--beige)';
            }
          }}
          onMouseLeave={(e) => {
            if (!e.target.disabled) {
              e.target.style.backgroundColor = '';
            }
          }}
        >
          Back to Call Settings
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={!isReadyToSubmit() || isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] border-accent-right border-accent-left border-accent-top border-accent font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl hover:scale-[1.02]"
          style={{
            borderColor: '#10b981',
            backgroundColor: '#10b981',
            color: 'var(--foreground)'
          }}
          onMouseEnter={(e) => {
            if (!e.target.disabled) {
              e.target.style.backgroundColor = '#059669';
              e.target.style.borderColor = '#059669';
            }
          }}
          onMouseLeave={(e) => {
            if (!e.target.disabled) {
              e.target.style.opacity = '1';
            }
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Scheduling...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Schedule Call
            </>
          )}
        </button>
      </div>

      {/* Validation Warning */}
      {!isReadyToSubmit() && (
        <div className="text-center mt-4">
          <p className="text-sm" style={{ color: '#f97316' }}>
            Please complete all required fields to schedule your call
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewAndConfirm;
