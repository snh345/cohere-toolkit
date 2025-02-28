import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { PlanStepNodeProps } from '../FlowTypes';

/**
 * Custom node component with proper typing and explicit handles
 */
export const PlanStepNode: React.FC<PlanStepNodeProps> = ({ id, data, selected }) => {
  const [editContent, setEditContent] = useState(data.content);
  const [editTitle, setEditTitle] = useState(data.title || '');
  const [editing, setEditing] = useState(data.isEditing || false);

  // Handle toggling between primary and alternative branch types
  const handleToggleBranchType = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent triggering node selection
    
    // Toggle branch type between primary and alternative
    const newBranchType = data.branchType === 'primary' ? 'alternative' : 'primary';
    
    // Dispatch event to update the node data
    const event = new CustomEvent('node:update', {
      detail: { 
        id, 
        data: { 
          ...data, 
          branchType: newBranchType
        } 
      }
    });
    window.dispatchEvent(event);
  };
  
  // Determine node styling based on status and type
  const getNodeStyle = () => {
    // Base style - dark navy blue background for all nodes
    let style = 'rounded-md border p-3 shadow-md bg-[#111827]';
    
    // Border styling
    if (selected) {
      // Green border for final node or selected nodes (like in the image)
      style += ' border-[#22c55e]';
    } else if (data.branchType === 'primary') {
      // Blue border for primary branch nodes
      style += ' border-[#3b82f6]';
    } else if (data.branchType === 'alternative') {
      // Purple border for alternative branch nodes
      style += ' border-[#9333ea]';
    } else {
      // Default border
      style += ' border-[#3b82f6]';
    }
    
    return style;
  };
  
  // Handle double-click to start editing
  const handleDoubleClick = () => {
    setEditing(true);
  };
  
  // Handle save on blur or Enter key
  const handleSave = () => {
    const event = new CustomEvent('node:update', {
      detail: { 
        id, 
        data: { 
          ...data, 
          content: editContent,
          title: editTitle.trim() ? editTitle : data.title,
          isEditing: false
        } 
      }
    });
    window.dispatchEvent(event);
    setEditing(false);
  };
  
  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  // Handle creating a new branch
  const handleCreateBranch = () => {
    const event = new CustomEvent('branch:create', {
      detail: { id }
    });
    window.dispatchEvent(event);
  };

  return (
    <div 
      className={getNodeStyle()}
      onDoubleClick={handleDoubleClick}
    >
      {/* Branch indicators */}
      <div 
  className={`absolute top-0 right-0 m-1 px-2 py-0.5 text-xs rounded-full cursor-pointer hover:opacity-80 ${
    data.branchType === 'primary' ? 'bg-blue-600 text-white' : 
    data.branchType === 'alternative' ? 'bg-purple-600 text-white' : 
    'bg-blue-600 text-white'
  }`}
  onClick={handleToggleBranchType}
  title="Click to toggle branch type"
>
  {data.branchType === 'primary' ? 'Main' : 
   data.branchType === 'alternative' ? 'Alt' : 'Main'}
</div>
      
      {/* Explicit source handle at bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${id}-source`}
        style={{ background: '#555', width: '8px', height: '8px' }}
      />
      
      {/* Explicit target handle at top */}
      <Handle
        type="target"
        position={Position.Top}
        id={`${id}-target`}
        style={{ background: '#555', width: '8px', height: '8px' }}
      />
      
      <div className="flex items-start gap-2">
        {data.icon && (
          <span className="flex h-6 w-6 items-center justify-center">
            <data.icon className={`h-5 w-5 ${selected ? 'text-green-500' : 'text-white'}`} />
          </span>
        )}
        <div className="flex flex-col w-full">
          {editing ? (
            // Editing mode
            <>
            {data.title !== undefined && (
              <input
                type="text"
                className="text-sm font-medium bg-gray-800 text-gray-200 p-1 mb-1 rounded w-full"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSave()}
                autoFocus
              />
            )}
            <textarea
              className="text-xs bg-gray-800 text-gray-300 p-1 rounded w-full min-h-[60px]"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleSave()}
              autoFocus={!data.title}
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button 
                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </>
          ) : (
            // Display mode
            <>
              <div className="flex flex-col w-full">
                {data.title && (
                  <div className={`text-sm font-medium ${selected ? 'text-green-500' : 'text-white'}`}>
                    {data.title}
                  </div>
                )}
                <div className="text-xs text-white">{data.content}</div>
              
                {/* Node actions */}
                <div className="flex justify-end mt-2 space-x-2">
                  <button 
                    className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                    onClick={handleCreateBranch}
                    title="Create alternative thought branch"
                  >
                    Branch
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};