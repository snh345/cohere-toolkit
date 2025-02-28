import React from 'react';
import { TemplateSelectorProps } from '../FlowTypes';

/**
 * Template selector component for the flow diagram
 * Displays available templates and allows switching between them
 */
export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate 
}) => {
  return (
    <div className="flex flex-col bg-gray-900 border-b border-gray-800 p-2 mb-3">
      <div className="text-xs text-gray-400 mb-2">Select a flow template:</div>
      <div className="flex flex-wrap gap-2">
        {templates.map(template => (
          <button
            key={template.id}
            className={`px-2 py-1 text-xs rounded ${
              selectedTemplate === template.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            {template.name}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {templates.find(t => t.id === selectedTemplate)?.description || ''}
      </div>
    </div>
  );
};