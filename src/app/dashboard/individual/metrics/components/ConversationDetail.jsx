'use client';
import { useState, useEffect, useRef } from 'react';
import { X, User, Monitor, Calendar, MessageCircle } from 'lucide-react';
import { useMetrics } from '../../../../../store/hooks';

export default function ConversationDetail({ conversation, onClose }) {
  const { getConversationDetail } = useMetrics();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversation?.conversation_id) {
      loadConversationDetail();
    }
  }, [conversation?.conversation_id]);

  useEffect(() => {
    scrollToBottom();
  }, [detail]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversationDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getConversationDetail(conversation.conversation_id);
      setDetail(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getAgentColor = (agentType) => {
    const colors = {
      'loneliness': 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800',
      'accountability': 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800',
      'mental_therapist': ' text-purple-800',
      'nutrition': 'bg-orange-100 text-orange-800',
      'medication': 'bg-red-100 text-red-800'
    };
    return colors[agentType] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2  mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error loading conversation: {error}</p>
            <button 
              onClick={loadConversationDetail}
              className="mt-2 text-sm text-red-800 hover:text-red-900 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Select a conversation to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-beige min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Conversation {detail.conversation_id}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAgentColor(detail.detected_agent)}`}>
                {detail.detected_agent}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                detail.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {detail.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Conversation Info */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
          <div>
            <span className="text-gray-600">Agent Instance:</span>
            <span className="ml-2 font-medium text-gray-900">{detail.agent_instance_id}</span>
          </div>
          <div>
            <span className="text-gray-600">Messages:</span>
            <span className="ml-2 font-medium text-gray-900">{detail.context.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Created:</span>
            <span className="ml-2 font-medium text-gray-900">
              {formatTimestamp(detail.created_at)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Last Updated:</span>
            <span className="ml-2 font-medium text-gray-900">
              {formatTimestamp(detail.updated_at)}
            </span>
          </div>
        </div>

        {detail.summary && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Summary</h4>
            <p className="text-sm text-blue-800">{detail.summary}</p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {detail.context.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No messages in this conversation</p>
          </div>
        ) : (
          detail.context.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Monitor className="w-4 h-4" />
                )}
              </div>

              {/* Message Content */}
              <div className={`flex-1 max-w-full sm:max-w-xl break-words ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}>
                <div className={`inline-block px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                </div>
                {message.timestamp && (
                  <p className={`text-xs text-gray-500 mt-1 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {formatTimestamp(message.timestamp)}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>End of conversation</span>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Last activity: {formatTimestamp(detail.updated_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
