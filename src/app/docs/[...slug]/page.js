"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getApiUrl } from '@/lib/api';
import MermaidDiagram from '@/components/MermaidDiagram';
import { 
  ArrowLeftIcon, 
  DocumentTextIcon,
  ClockIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function DocViewPage() {
  const params = useParams();
  const docName = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    if (docName) {
      fetchDoc();
    }
  }, [docName]);

  const fetchDoc = async () => {
    try {
      setLoading(true);
      // Don't double encode - let the browser handle it
      const response = await fetch(getApiUrl(`/docs/${docName}`));
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error('Backend API is not running. Please start the backend server.');
        }
        throw new Error(`Documentation not found: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched doc data:', data); // Debug log
      setDoc(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching doc:', err);
      if (err.message.includes('JSON') || err.message.includes('<!DOCTYPE')) {
        setError('Backend API is not running. Please start the backend server at http://localhost:8000');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text) => {
    const processedText = text ? text.replace(/\\n/g, '\n') : '';
    navigator.clipboard.writeText(processedText).then(() => {
      // You could add a toast notification here
      console.log('Copied to clipboard');
    });
  };

  const downloadMarkdown = () => {
    if (!doc) return;
    
    const processedContent = doc.content ? doc.content.replace(/\\n/g, '\n') : '';
    const blob = new Blob([processedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
              <h1 className="text-xl font-semibold text-red-700">Error Loading Documentation</h1>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex space-x-4">
              <button 
                onClick={fetchDoc}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
              <Link 
                href="/docs"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Back to Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 capitalize">
                  {docName?.split('/').pop()?.replace(/-/g, ' ')}
                </h1>
                <p className="text-gray-600">{doc?.filename}</p>
                {docName?.includes('/') && (
                  <p className="text-sm text-gray-500">
                    Path: {docName.replace(/\//g, ' → ')}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowRaw(!showRaw)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  showRaw 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <EyeIcon className="h-4 w-4 inline mr-1" />
                {showRaw ? 'Rendered' : 'Raw'}
              </button>
              <button
                onClick={() => copyToClipboard(doc?.content || '')}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                <DocumentDuplicateIcon className="h-4 w-4 inline mr-1" />
                Copy
              </button>
              <button
                onClick={downloadMarkdown}
                className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600"
              >
                Download
              </button>
            </div>
          </div>
          
          {/* Metadata */}
          {doc?.metadata && (
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                Modified: {formatDate(doc.metadata.modified)}
              </div>
              <div>Size: {formatFileSize(doc.metadata.size)}</div>
              <div>{doc.metadata.lines} lines</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {showRaw ? (
            <div className="p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono bg-gray-50 p-4 rounded-lg overflow-x-auto">
                {doc?.content ? doc.content.replace(/\\n/g, '\n') : ''}
              </pre>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none p-6">
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    const content = String(children).replace(/\n$/, '');
                    
                    // Handle Mermaid diagrams
                    if (match && match[1] === 'mermaid') {
                      // Try to extract title from preceding heading
                      const diagramTitle = node?.position ? 
                        `Diagram ${Math.random().toString(36).substr(2, 5)}` : 
                        'Flow Diagram';
                      
                      return (
                        <MermaidDiagram 
                          chart={content} 
                          id={`mermaid-${Math.random().toString(36).substr(2, 9)}`}
                          title={diagramTitle}
                          showToolbar={true}
                        />
                      );
                    }
                    
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {content}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  h1: ({children}) => (
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({children}) => (
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3 mt-8">
                      {children}
                    </h2>
                  ),
                  h3: ({children}) => (
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-6">
                      {children}
                    </h3>
                  ),
                  p: ({children}) => (
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({children}) => (
                    <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({children}) => (
                    <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1">
                      {children}
                    </ol>
                  ),
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-yellow-400 bg-yellow-50 p-4 mb-4 italic">
                      {children}
                    </blockquote>
                  ),
                  table: ({children}) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full border border-gray-200">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({children}) => (
                    <th className="border border-gray-200 bg-gray-50 px-4 py-2 text-left font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({children}) => (
                    <td className="border border-gray-200 px-4 py-2">
                      {children}
                    </td>
                  ),
                }}
              >
                {doc?.content ? doc.content.replace(/\\n/g, '\n') : ''}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Link 
            href="/docs"
            className="flex items-center text-yellow-600 hover:text-yellow-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to All Documentation
          </Link>
          
          <div className="text-sm text-gray-500">
            Last updated: {doc?.metadata ? formatDate(doc.metadata.modified) : 'Unknown'}
          </div>
        </div>
      </div>
    </div>
  );
}