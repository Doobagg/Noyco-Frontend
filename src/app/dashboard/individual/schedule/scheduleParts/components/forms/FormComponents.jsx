"use client";

import React from 'react';
import { 
  Plus,
  X
} from 'lucide-react';

const FormComponents = {
  DateTimeInput: ({ label, value, onChange, icon: Icon, required = false }) => {
    const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return '';
      return new Date(dateTimeString).toISOString().slice(0, 16);
    };

    return (
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
          <Icon className="w-4 h-4 inline mr-2" />
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="datetime-local"
          value={formatDateTime(value)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border border-accent bg-white transition-all"
          style={{
            
            color: 'var(--foreground)'
          }}
        />
      </div>
    );
  },

  TextInput: ({ label, value, onChange, placeholder, icon: Icon, required = false }) => (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
        <Icon className="w-4 h-4 inline mr-2" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-accent bg-white transition-all"
        placeholder={placeholder}
        style={{
          
          color: 'var(--foreground)'
        }}
      />
    </div>
  ),

  TextAreaInput: ({ label, value, onChange, placeholder, icon: Icon, rows = 3 }) => (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
        <Icon className="w-4 h-4 inline mr-2" />
        {label}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
           className="w-full px-4 py-3 border border-accent bg-white transition-all resize-none"
        style={{
          
          color: 'var(--foreground)'
        }}
      />
    </div>
  ),

  ArrayInput: ({ label, items, onAdd, onRemove, placeholder, icon: Icon, maxItems = 5, currentInput, setCurrentInput }) => (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
        <Icon className="w-4 h-4 inline mr-2" />
        {label} {items && items.length > 0 && <span style={{ color: 'var(--foreground)', opacity: 0.6 }}>({items.length}/{maxItems})</span>}
      </label>
      
      {/* Display existing items */}
      {items && items.length > 0 && (
        <div className="mb-3 space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border" style={{ backgroundColor: 'var(--beige)', borderColor: '#d1d5db' }}>
              <span className="flex-1 text-sm" style={{ color: 'var(--foreground)' }}>{item}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new item */}
      {(!items || items.length < maxItems) && (
        <div className="flex gap-2">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border"
            style={{
              borderColor: 'var(--border-accent)',
              backgroundColor: 'white',
              color: 'var(--foreground)'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAdd(currentInput);
              }
            }}
          />
          <button
            type="button"
            onClick={() => onAdd(currentInput)}
            className="px-3 py-2 border transition-colors"
            style={{
              borderColor: 'var(--primary-100)',
              backgroundColor: 'var(--primary-100)',
              color: 'var(--foreground)'
            }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  ),

  SliderInput: ({ label, value, onChange, min = 1, max = 10, icon: Icon }) => (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
        <Icon className="w-4 h-4 inline mr-2" />
        {label}: <span className="font-semibold" style={{ color: 'var(--border-accent)' }}>{value}</span>
      </label>
      <div className="flex items-center gap-4">
        <span className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.6 }}>{min}</span>
        <input
          type="range"
          min={min}
          max={max}
          value={value || 5}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="flex-1 h-2 appearance-none cursor-pointer slider"
          style={{
            backgroundColor: '#e5e7eb',
              accentColor: '#1f4d8f'
          }}
        />
        <span className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.6 }}>{max}</span>
      </div>
      <div className="text-xs mt-1" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
        {value <= 3 ? 'Mild' : value <= 6 ? 'Moderate' : value <= 8 ? 'High' : 'Severe'}
      </div>
    </div>
  )
};

export default FormComponents;
