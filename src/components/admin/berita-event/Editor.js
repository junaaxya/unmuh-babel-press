// src/components/admin/berita-event/Editor.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBold, 
  faItalic, 
  faUnderline,
  faListUl,
  faListOl,
  faQuoteLeft,
  faLink,
  faImage,
  faCode,
  faHeading,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faUndo,
  faRedo,
  faExpand,
  faCompress
} from '@fortawesome/free-solid-svg-icons';

export default function Editor({ content, onChange, placeholder }) {
  const [editorContent, setEditorContent] = useState(content || '');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFormats, setActiveFormats] = useState(new Set());
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);

  useEffect(() => {
    if (content !== editorContent) {
      setEditorContent(content || '');
    }
  }, [content]);

  // Update parent component when content changes
  const handleContentChange = (newContent) => {
    setEditorContent(newContent);
    onChange(newContent);
  };

  // Format text commands
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    updateActiveFormats();
  };

  // Update active format states
  const updateActiveFormats = () => {
    const formats = new Set();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('insertUnorderedList')) formats.add('ul');
    if (document.queryCommandState('insertOrderedList')) formats.add('ol');
    if (document.queryCommandState('justifyLeft')) formats.add('left');
    if (document.queryCommandState('justifyCenter')) formats.add('center');
    if (document.queryCommandState('justifyRight')) formats.add('right');
    
    setActiveFormats(formats);
  };

  // Handle editor input
  const handleInput = () => {
    const content = editorRef.current.innerHTML;
    handleContentChange(content);
    updateActiveFormats();
  };

  // Handle key events
  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          formatText('bold');
          break;
        case 'i':
          e.preventDefault();
          formatText('italic');
          break;
        case 'u':
          e.preventDefault();
          formatText('underline');
          break;
        case 'z':
          if (e.shiftKey) {
            e.preventDefault();
            formatText('redo');
          } else {
            e.preventDefault();
            formatText('undo');
          }
          break;
      }
    }
  };

  // Insert link
  const insertLink = () => {
    const url = prompt('Masukkan URL:');
    if (url) {
      formatText('createLink', url);
    }
  };

  // Insert image
  const insertImage = () => {
    const url = prompt('Masukkan URL gambar:');
    if (url) {
      formatText('insertImage', url);
    }
  };

  // Change heading level
  const changeHeading = (level) => {
    formatText('formatBlock', `h${level}`);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Toolbar button component
  const ToolbarButton = ({ icon, command, value, active, title, onClick }) => (
    <button
      type="button"
      onClick={onClick || (() => formatText(command, value))}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        active ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
      }`}
      title={title}
    >
      <FontAwesomeIcon icon={icon} className="w-4 h-4" />
    </button>
  );

  // Dropdown for headings
  const HeadingDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600 flex items-center"
          title="Heading"
        >
          <FontAwesomeIcon icon={faHeading} className="w-4 h-4 mr-1" />
          <span className="text-xs">▼</span>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
            <button
              type="button"
              onClick={() => {
                formatText('formatBlock', 'p');
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
            >
              Normal
            </button>
            {[1, 2, 3, 4, 5, 6].map(level => (
              <button
                key={level}
                type="button"
                onClick={() => {
                  changeHeading(level);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 hover:bg-gray-100 text-${
                  level <= 2 ? 'lg' : level <= 4 ? 'base' : 'sm'
                } font-${level <= 3 ? 'bold' : 'semibold'}`}
              >
                Heading {level}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
      {/* Toolbar */}
      <div 
        ref={toolbarRef}
        className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200 bg-gray-50"
      >
        {/* Text Formatting */}
        <div className="flex items-center gap-1 mr-3">
          <ToolbarButton
            icon={faBold}
            command="bold"
            active={activeFormats.has('bold')}
            title="Bold (Ctrl+B)"
          />
          <ToolbarButton
            icon={faItalic}
            command="italic"
            active={activeFormats.has('italic')}
            title="Italic (Ctrl+I)"
          />
          <ToolbarButton
            icon={faUnderline}
            command="underline"
            active={activeFormats.has('underline')}
            title="Underline (Ctrl+U)"
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mr-3"></div>

        {/* Headings */}
        <div className="mr-3">
          <HeadingDropdown />
        </div>

        <div className="w-px h-6 bg-gray-300 mr-3"></div>

        {/* Lists */}
        <div className="flex items-center gap-1 mr-3">
          <ToolbarButton
            icon={faListUl}
            command="insertUnorderedList"
            active={activeFormats.has('ul')}
            title="Bullet List"
          />
          <ToolbarButton
            icon={faListOl}
            command="insertOrderedList"
            active={activeFormats.has('ol')}
            title="Numbered List"
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mr-3"></div>

        {/* Alignment */}
        <div className="flex items-center gap-1 mr-3">
          <ToolbarButton
            icon={faAlignLeft}
            command="justifyLeft"
            active={activeFormats.has('left')}
            title="Align Left"
          />
          <ToolbarButton
            icon={faAlignCenter}
            command="justifyCenter"
            active={activeFormats.has('center')}
            title="Align Center"
          />
          <ToolbarButton
            icon={faAlignRight}
            command="justifyRight"
            active={activeFormats.has('right')}
            title="Align Right"
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mr-3"></div>

        {/* Insert */}
        <div className="flex items-center gap-1 mr-3">
          <ToolbarButton
            icon={faLink}
            onClick={insertLink}
            title="Insert Link"
          />
          <ToolbarButton
            icon={faImage}
            onClick={insertImage}
            title="Insert Image"
          />
          <ToolbarButton
            icon={faQuoteLeft}
            command="formatBlock"
            value="blockquote"
            title="Quote"
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mr-3"></div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1 mr-3">
          <ToolbarButton
            icon={faUndo}
            command="undo"
            title="Undo (Ctrl+Z)"
          />
          <ToolbarButton
            icon={faRedo}
            command="redo"
            title="Redo (Ctrl+Shift+Z)"
          />
        </div>

        {/* Fullscreen Toggle */}
        <div className="ml-auto">
          <ToolbarButton
            icon={isFullscreen ? faCompress : faExpand}
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          />
        </div>
      </div>

      {/* Editor */}
      <div 
        className={`${
          isFullscreen ? 'flex-1 flex flex-col' : 'min-h-[400px]'
        }`}
      >
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onMouseUp={updateActiveFormats}
          onKeyUp={updateActiveFormats}
          className={`
            p-4 outline-none overflow-y-auto
            ${isFullscreen ? 'flex-1' : 'min-h-[400px]'}
            prose prose-sm max-w-none
            focus:ring-0 focus:outline-none
          `}
          dangerouslySetInnerHTML={{ __html: editorContent }}
          data-placeholder={placeholder}
          style={{
            minHeight: isFullscreen ? 'auto' : '400px'
          }}
        />
      </div>

      {/* Word Count */}
      <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200 bg-gray-50">
        {editorContent.replace(/<[^>]*>/g, '').length} karakter
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          font-style: italic;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        
        [contenteditable] h4 {
          font-size: 1em;
          font-weight: bold;
          margin: 1.12em 0;
        }
        
        [contenteditable] h5 {
          font-size: 0.83em;
          font-weight: bold;
          margin: 1.5em 0;
        }
        
        [contenteditable] h6 {
          font-size: 0.75em;
          font-weight: bold;
          margin: 1.67em 0;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          margin: 1.5em 0;
          padding-left: 1em;
          color: #6b7280;
          font-style: italic;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        
        [contenteditable] li {
          margin: 0.5em 0;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1em 0;
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        [contenteditable] a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
}