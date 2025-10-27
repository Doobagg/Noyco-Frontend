"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  DocumentTextIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  FolderIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

export default function DocsSidebar() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const pathname = usePathname();

  useEffect(() => {
    fetchDocs();
    // Initialize with some folders expanded by default
    setExpandedFolders(new Set(['overview', 'Services', 'others']));
  }, []);

  useEffect(() => {
    // Auto-expand main folders by default
    if (docs.length > 0) {
      setExpandedFolders(new Set(['overview', 'Services', 'others', 'Api Gateway']));
    }
  }, [docs]);

  const fetchDocs = async () => {
    try {
      const response = await fetch('http://localhost:8000/docs/');
      const data = await response.json();
      
      if (data.status === 'success') {
        setDocs(data.documentation || []);
      }
    } catch (error) {
      console.error('Error fetching docs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Organize docs into actual folder structure
  // const organizeDocsIntoFolders = (docs) => {
  //   const folderStructure = {};
    
  //   docs.forEach(doc => {
  //     const folderPath = doc.folder || 'root';
      
  //     if (!folderStructure[folderPath]) {
  //       folderStructure[folderPath] = [];
  //     }
      
  //     folderStructure[folderPath].push(doc);
  //   });

  //   // Sort folders and files
  //   Object.keys(folderStructure).forEach(folder => {
  //     folderStructure[folder].sort((a, b) => a.name.localeCompare(b.name));
  //   });

  //   return folderStructure;
  // };

  // Create nested folder structure for better display
  const createNestedStructure = (docs) => {
    const structure = {};
    
    docs.forEach(doc => {
      const parts = doc.folder ? doc.folder.split('/') : [''];
      let current = structure;
      
      // Build nested structure
      parts.forEach((part, index) => {
        const folderName = part || 'Root';
        
        if (!current[folderName]) {
          current[folderName] = {
            type: 'folder',
            children: {},
            files: []
          };
        }
        
        if (index === parts.length - 1) {
          current[folderName].files.push(doc);
        }
        
        current = current[folderName].children;
      });
    });
    
    return structure;
  };

  const toggleFolder = (folderName) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const getDocSlug = (doc) => {
    // Include folder path in slug for nested documents
    if (doc.folder && doc.folder !== '') {
      return `${doc.folder}/${doc.name}`;
    }
    return doc.name;
  };

  const isActiveDoc = (doc) => {
    const slug = getDocSlug(doc);
    return pathname === `/docs/${slug}`;
  };

  const formatDocName = (name) => {
    return name
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Recursive component to render folder structure
  const renderFolderStructure = (structure, level = 0) => {
    return Object.entries(structure).map(([folderName, folderData]) => (
      <div key={folderName} style={{ marginLeft: `${level * 12}px` }}>
        {/* Folder Header */}
        <button
          onClick={() => toggleFolder(folderName)}
          className="flex items-center w-full p-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <FolderIcon className="h-4 w-4 mr-2 text-gray-500" />
          <span className="font-medium flex-1 text-sm">{folderName}</span>
          {expandedFolders.has(folderName) ? (
            <ChevronDownIcon className="h-3 w-3 text-gray-400" />
          ) : (
            <ChevronRightIcon className="h-3 w-3 text-gray-400" />
          )}
        </button>
        
        {/* Folder Contents */}
        {expandedFolders.has(folderName) && (
          <div className="mt-1">
            {/* Files in this folder */}
            {folderData.files && folderData.files.map((doc) => (
              <Link
                key={doc.name}
                href={`/docs/${getDocSlug(doc)}`}
                className={`flex items-center p-2 ml-4 rounded-lg text-sm transition-colors ${
                  isActiveDoc(doc)
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <DocumentTextIcon className="h-3 w-3 mr-2 text-gray-400" />
                <span>{formatDocName(doc.name)}</span>
              </Link>
            ))}
            
            {/* Subfolders */}
            {folderData.children && Object.keys(folderData.children).length > 0 && 
              renderFolderStructure(folderData.children, level + 1)
            }
          </div>
        )}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 h-full">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const folderStructure = createNestedStructure(docs);

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <DocumentTextIcon className="h-8 w-8 text-yellow-600 mr-3" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Documentation</h2>
            <p className="text-sm text-gray-600">{docs.length} documents</p>
          </div>
        </div>

        {/* Home Link */}
        <Link 
          href="/docs"
          className={`flex items-center p-3 rounded-lg mb-4 transition-colors ${
            pathname === '/docs' 
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <HomeIcon className="h-5 w-5 mr-3" />
          <span className="font-medium">Overview</span>
        </Link>

        {/* Navigation - Folder Structure */}
        <nav className="space-y-1">
          {renderFolderStructure(folderStructure)}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()}
              className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Refresh Documentation
            </button>
            <Link 
              href="/docs"
              className="block w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Search Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}