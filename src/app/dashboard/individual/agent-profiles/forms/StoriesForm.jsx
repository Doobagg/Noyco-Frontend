"use client";

import { useEffect, useState } from "react";
import { Smile, Trophy, History, Sparkles, Dumbbell, Frown, HandHeart, Laugh } from "lucide-react";
import { PlusIcon, XMarkIcon, BookOpenIcon } from "@heroicons/react/24/outline";

const StoriesForm = ({ data = {}, updateData }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStory, setNewStory] = useState({
    title: "",
    description: "",
    date: "",
    emotional_significance: ""
  });

  // Initialize arrays if they don't exist
  const safeData = {
    past_stories: data.past_stories || [],
    ...data
  };

  const emotionalSignificance = [
    { value: "happy", label: "Happy", icon: <Smile className="w-3 h-3" /> },
    { value: "proud", label: "Proud", icon: <Trophy className="w-3 h-3" /> },
    { value: "nostalgic", label: "Nostalgic", icon: <History className="w-3 h-3" /> },
    { value: "inspiring", label: "Inspiring", icon: <Sparkles className="w-3 h-3" /> },
    { value: "challenging", label: "Challenging", icon: <Dumbbell className="w-3 h-3" /> },
    { value: "sad", label: "Sad", icon: <Frown className="w-3 h-3" /> },
    { value: "grateful", label: "Grateful", icon: <HandHeart className="w-3 h-3" /> },
    { value: "funny", label: "Funny", icon: <Laugh className="w-3 h-3" /> }
  ];

  const addStory = () => {
    if (newStory.title.trim() && newStory.description.trim()) {
      const story = { 
        title: newStory.title.trim(), 
        description: newStory.description.trim(),
        emotional_significance: newStory.emotional_significance
      };
      if (newStory.date && String(newStory.date).trim() !== "") {
        story.date = newStory.date;
      }
      updateData({ 
        past_stories: [...safeData.past_stories, story] 
      });
      setNewStory({ title: "", description: "", date: "", emotional_significance: "" });
      setShowAddForm(false);
    }
  };

  const removeStory = (index) => {
    updateData({ 
      past_stories: safeData.past_stories.filter((_, i) => i !== index) 
    });
  };

  const getEmotionConfig = (emotion) => {
    return emotionalSignificance.find(e => e.value === emotion) || emotionalSignificance[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Auto-add story on form progression (listen for a custom next event)
  useEffect(() => {
    const handler = () => {
      if (newStory.title.trim() && newStory.description.trim()) {
        addStory();
      }
    };
    window.addEventListener('profileCreator:next', handler);
    return () => window.removeEventListener('profileCreator:next', handler);
  }, [newStory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Personal Stories</h2>
        <p className="text-sm text-gray-600 mt-1">Share meaningful experiences that help define who you are</p>
      </div>

      {/* Current Stories */}
      {safeData.past_stories.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpenIcon className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-900">
              Your Stories ({safeData.past_stories.length})
            </h3>
          </div>
          
          <div className="space-y-3">
            {safeData.past_stories.map((story, index) => {
              const emotionConfig = getEmotionConfig(story.emotional_significance);
              return (
                <div key={index} className="bg-gray-50 border border-accent p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{story.title}</h4>
                      {story.date && (
                        <p className="text-xs text-gray-500 mt-1">{formatDate(story.date)}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {story.emotional_significance && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 text-xs">
                          {emotionConfig.icon}
                          <span>{emotionConfig.label}</span>
                        </span>
                      )}
                      <button
                        onClick={() => removeStory(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed">{story.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add New Story */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-accent text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="font-medium text-sm">Add Personal Story</span>
        </button>
      ) : (
        <div className="bg-beige border-accent border-accent-top border-accent-left border-accent-right p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Add Personal Story</h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewStory({ title: "", description: "", date: "", emotional_significance: "" });
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Story Title *
              </label>
              <input
                type="text"
                value={newStory.title}
                onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Give your story a meaningful title..."
                className="w-full px-3 py-2 border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-sm"
              />
            </div>

            {/* Date and Emotional Significance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Date (Optional)
                </label>
                <input
                  type="date"
                  value={newStory.date}
                  onChange={(e) => setNewStory(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Emotional Significance
                </label>
                <select
                  value={newStory.emotional_significance}
                  onChange={(e) => setNewStory(prev => ({ ...prev, emotional_significance: e.target.value }))}
                  className="w-full px-3 py-2 border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-sm bg-beige hover:bg-gradient-to-r hover:from-[#E6D3E7] hover:via-[#F6D9D5] hover:to-[#D6E3EC]"
                >
                  <option value="">Select feeling</option>
                  {emotionalSignificance.map((emotion) => (
                    <option key={emotion.value} value={emotion.value}>
                      {emotion.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Story Description *
              </label>
              <textarea
                value={newStory.description}
                onChange={(e) => setNewStory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Tell your story... What happened? How did it make you feel? Why is it important to you?"
                rows={4}
                className="w-full px-3 py-2 border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400 resize-none text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={addStory}
                disabled={!newStory.title.trim() || !newStory.description.trim()}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Add Story
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewStory({ title: "", description: "", date: "", emotional_significance: "" });
                }}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story Prompts */}
      {safeData.past_stories.length === 0 && !showAddForm && (
                 <div className="bg-beige border border-accent p-4">
          <h4 className="font-medium text-gray-900 mb-2 text-sm flex items-center gap-1">
            <span>📚</span> Story Ideas
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
            <div>
              <p className="font-medium text-gray-700 mb-1">Health Journey:</p>
              <ul className="space-y-0.5">
                <li>• Overcoming a health challenge</li>
                <li>• Starting a wellness routine</li>
                <li>• A meaningful doctor visit</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Life Moments:</p>
              <ul className="space-y-0.5">
                <li>• A proud achievement</li>
                <li>• A lesson you learned</li>
                <li>• A meaningful conversation</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] border border-accent p-4">
        <div className="flex items-start space-x-2">
          <div className="w-5 h-5 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-gray-800 text-xs">💡</span>
          </div>
          <div className="text-sm text-gray-800">
            <p className="font-medium mb-1">Story Tips:</p>
            <p>Stories help your agent understand your experiences and values. Include both positive and challenging experiences for more personalized support.</p>
          </div>
        </div>
      </div>

      {/* Skip Option */}
      {safeData.past_stories.length === 0 && !showAddForm && (
        <div className="text-center py-2">
          <p className="text-gray-500 text-xs">
            Stories are optional but help create deeper, more meaningful conversations.
          </p>
        </div>
      )}
    </div>
  );
};

export default StoriesForm;