"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/store/hooks';
import { User, Bell, Shield, Settings } from 'lucide-react';
import AnimatedBlob from '@/components/landing/AnimatedBlob';
import { showToast } from '@/lib/toast';

export default function SettingsPage() {
  const { user, updateProfile, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: '',
      phone: '',
      language: 'en',
      timezone: 'UTC',
    },
    password: {
      current: '',
      new: '',
      confirm: ''
    },
    notifications: {
      emailNotifications: false,
      smsNotifications: false,
      pushNotifications: true,
      reminderNotifications: true
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analyticsOptOut: false
    },
    preferences: {
      theme: 'light',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD'
    }
  });

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        }
      }));
    }
  }, [user]);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      // Phone validation regex
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (settings.profile.phone && !phoneRegex.test(settings.profile.phone)) {
        showToast('Invalid phone number. Enter 10-15 digits, optional leading +', 'error');
        return;
      }

      // Update profile
  const payload = {};
  const currentName = user?.name || '';
  const currentPhone = user?.phone || '';
  const newName = settings.profile.name.trim();
  const newPhone = settings.profile.phone.trim();

  if (newName && newName !== currentName) payload.name = newName;
  if (newPhone && newPhone !== currentPhone) payload.phone = newPhone;

      if (Object.keys(payload).length) {
        const res = await updateProfile(payload);
        if (!res.success) throw res.error;
      }

      // Handle password change (only for non-OAuth users)
      const { current, new: newPwd, confirm } = settings.password;
      if ((current || newPwd || confirm) && user?.hasPassword) {
        if (!current || !newPwd || !confirm) {
          showToast('Please fill all password fields.', 'error');
          return;
        }
        if (newPwd !== confirm) {
          showToast('New password and confirm password do not match', 'error');
          return;
        }
        const res = await updatePassword(current, newPwd);
        if (!res.success) throw res.error || new Error('Password update failed');
        showToast('Password updated', 'success');
      }

      if (Object.keys(payload).length) {
        showToast('Profile updated', 'success');
      } else if (!(settings.password.current || settings.password.new || settings.password.confirm)) {
        // If neither profile nor password changed, still provide positive feedback if desired
        showToast('Settings updated successfully', 'success');
      }
      // reset password fields
      setSettings(prev=>({...prev,password:{current:'',new:'',confirm:''}}));
    } catch (error) {
      console.error('Failed to save settings:', error);
      showToast(error.message || 'Failed to save settings', 'error');
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    // { id: 'privacy', name: 'Privacy', icon: Shield },
    // { id: 'preferences', name: 'Preferences', icon: Settings }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={settings.profile.name}
              onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors border-accent-right border-accent-left border-accent-top border-accent text-sm sm:text-base"
              placeholder="Enter your full name"
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={settings.profile.email}
              disabled
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-beige border-accent-right border-accent-left border-accent-top border-accent cursor-not-allowed text-sm sm:text-base"
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={settings.profile.phone}
              onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
              pattern="^\\+?[0-9]{10,15}$"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors border-accent-right border-accent-left border-accent-top border-accent text-sm sm:text-base"
              placeholder="Enter phone number"
              title="10-15 digits, optional leading +"
            />
          </div>
          {/* Password section - only show for email/password users */}
          {user?.hasPassword && (
            <div className="lg:col-span-2">
              <h4 className="text-md font-medium text-gray-900 mb-2">Change Password</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <input 
                  type="password" 
                  value={settings.password.current} 
                  onChange={(e)=>handleSettingChange('password','current',e.target.value)} 
                  placeholder="Current Password" 
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-accent-right border-accent-left border-accent-top border-accent rounded-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors border-accent text-sm sm:text-base" 
                />
                <input 
                  type="password" 
                  value={settings.password.new} 
                  onChange={(e)=>handleSettingChange('password','new',e.target.value)} 
                  placeholder="New Password" 
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-accent-right border-accent-left border-accent-top border-accent rounded-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors border-accent text-sm sm:text-base" 
                />
                <input 
                  type="password" 
                  value={settings.password.confirm} 
                  onChange={(e)=>handleSettingChange('password','confirm',e.target.value)} 
                  placeholder="Confirm New Password" 
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-accent-right border-accent-left border-accent-top border-accent rounded-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors border-accent text-sm sm:text-base" 
                />
              </div>
            </div>
          )}
          <div>
            {/* <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.profile.language}
              onChange={(e) => handleSettingChange('profile', 'language', e.target.value)}
              className="w-full px-4 py-3 bg-beige border border-gray-300 rounded-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors border-accent-right border-accent-left border-accent-top border-accent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select> */}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
            // { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive text message alerts' },
            // { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser notifications' },
            // { key: 'reminderNotifications', label: 'Reminder Notifications', description: 'Get reminders for appointments and tasks' }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{notification.label}</h4>
                <p className="text-sm text-gray-500">{notification.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[notification.key]}
                  onChange={(e) => handleSettingChange('notifications', notification.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#E6D3E7] peer-checked:via-[#F6D9D5] peer-checked:to-[#D6E3EC]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="py-4 border-b border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
              className="w-full px-4 py-3 bg-beige border focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>
          
          {[
            { key: 'dataSharing', label: 'Data Sharing', description: 'Allow sharing of anonymized data for research' },
            { key: 'analyticsOptOut', label: 'Analytics Opt-out', description: 'Opt out of usage analytics collection' }
          ].map((privacy) => (
            <div key={privacy.key} className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{privacy.label}</h4>
                <p className="text-sm text-gray-500">{privacy.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy[privacy.key]}
                  onChange={(e) => handleSettingChange('privacy', privacy.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#E6D3E7] peer-checked:via-[#F6D9D5] peer-checked:to-[#D6E3EC]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Application Preferences</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={settings.preferences.theme}
              onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
              className="w-full px-4 py-3 bg-beige border-accent-right border-accent-left border-accent-top border-accent focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
         
         
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      // case 'privacy':
      //   return renderPrivacyTab();
      // case 'preferences':
      //   return renderPreferencesTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your account preferences and privacy settings</p>
        </div>

        <div className="bg-beige rounded-none shadow-sm border border-gray-200 overflow-hidden border-accent-right border-accent-left border-accent-top border-accent">
          <div className="flex flex-col lg:flex-row">
            {/* Mobile Tab Navigation */}
            <div className="lg:hidden border-b border-gray-200 bg-beige">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800'
                        : 'text-gray-700 hover:bg-beige'
                    }`}
                  >
                    <tab.icon className="mr-2 w-5 h-5" />
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Sidebar Navigation */}
            <div className="hidden lg:block w-64 bg-beige border-accent-right">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-none transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 shadow-md'
                        : 'text-gray-700 hover:bg-beige hover:shadow-sm'
                    }`}
                  >
                    <tab.icon className="mr-3 w-5 h-5" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8">
              {renderTabContent()}

              {/* Save Button */}
              <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 transition-colors duration-200 text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    // className="relative w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-300 text-white rounded-none hover:shadow-lg transition-all duration-200 transform hover:scale-105 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] backdrop-blur-sm"
                    className="px-6 py-3 rounded-none  shadow-md 
                    bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] 
                    backdrop-blur-md hover:opacity-90 transition "
                  >
                    {/* Animated Blobs Background with White Glow */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-none">
                      {/* White Glow Blobs */}
                      <AnimatedBlob
                        gradient="radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)"
                        duration={10}
                        delay={0.5}
                        sizeClass="w-8 h-8"
                        opacity={0.4}
                        blur={20}
                        position="center"
                        offsetX={0}
                        offsetY={0}
                      />
                      <AnimatedBlob
                        gradient="radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 100%)"
                        duration={15}
                        delay={2.5}
                        sizeClass="w-6 h-6"
                        opacity={0.3}
                        blur={25}
                        position="center"
                        offsetX={-10}
                        offsetY={5}
                      />
                      
                      {/* Pink-Lavender Accent Blobs */}
                      <AnimatedBlob
                        gradient="linear-gradient(135deg, #f472b6 0%, #c084fc 100%)"
                        duration={12}
                        delay={0}
                        sizeClass="w-5 h-5"
                        opacity={0.4}
                        blur={12}
                        position="center"
                        offsetX={-8}
                        offsetY={-8}
                      />
                      <AnimatedBlob
                        gradient="linear-gradient(135deg, #e879f9 0%, #a78bfa 100%)"
                        duration={16}
                        delay={2}
                        sizeClass="w-6 h-6"
                        opacity={0.3}
                        blur={14}
                        position="center"
                        offsetX={8}
                        offsetY={-6}
                      />
                      <AnimatedBlob
                        gradient="linear-gradient(135deg, #fbbf24 0%, #f472b6 100%)"
                        duration={14}
                        delay={1}
                        sizeClass="w-4 h-4"
                        opacity={0.5}
                        blur={10}
                        position="center"
                        offsetX={-6}
                        offsetY={8}
                      />
                      <AnimatedBlob
                        gradient="linear-gradient(135deg, #c084fc 0%, #ddd6fe 100%)"
                        duration={18}
                        delay={3}
                        sizeClass="w-5 h-5"
                        opacity={0.35}
                        blur={13}
                        position="center"
                        offsetX={6}
                        offsetY={6}
                      />
                    </div>
                    <span className="relative z-10 font-semibold text-gray-800">Update</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
