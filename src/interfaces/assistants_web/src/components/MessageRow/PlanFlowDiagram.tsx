'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  NodeTypes,
  useNodesState,
  useEdgesState,
  MarkerType,
  addEdge,
  type OnConnect,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlowProvider,
  useReactFlow,
  Connection,
  NodeOrigin,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Modal } from '@/components/UI';
import { initialEdges, edgeTypes } from "../edges";
import { StreamToolCallsGeneration } from '@/cohere-client';
import { RegenerationData } from '@/types/tools';

// Custom node component with proper typing and explicit handles
type PlanStepNodeData = {
  icon: React.ComponentType<any>;
  title?: string;
  content: string;
  isEditing?: boolean;
  branchType?: 'primary' | 'alternative';
};

// Helper function for creating PlanStepNode will be defined after getIconComponent

// Node with explicit handles for better connection control
// NEW
const PlanStepNode = ({ id, data, selected }: { id: string; data: PlanStepNodeData; selected?: boolean }) => {
  const [editContent, setEditContent] = useState(data.content);
  const [editTitle, setEditTitle] = useState(data.title || '');
  const [editing, setEditing] = useState(data.isEditing || false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

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
      {/* <div className={`absolute top-0 right-0 m-1 px-2 py-0.5 text-xs rounded-full ${
        data.branchType === 'primary' ? 'bg-blue-600 text-white' : 
        data.branchType === 'alternative' ? 'bg-purple-600 text-white' : 
        'bg-blue-600 text-white'
      }`}>
        {data.branchType === 'primary' ? 'Main' : 
        data.branchType === 'alternative' ? 'Alt' : 'Main'}
      </div> */}
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

const nodeTypes: NodeTypes = {
  planStep: PlanStepNode,
};

// Main flow diagram content component
const FlowDiagramContent = ({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect, 
  onNodeClick, 
  nodeTypes,
  getIconComponent,
  createEdge,
  onCreateBranch,
  selectedNodeId,
  toggleAltBranches,
  altBranchesVisible
}: {
  nodes: Node<PlanStepNodeData>[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: OnConnect;
  onNodeClick: (event: React.MouseEvent, node: Node<PlanStepNodeData>) => void;
  nodeTypes: NodeTypes;
  getIconComponent: (toolName: string) => React.ComponentType<any>;
  createEdge: (sourceId: string, targetId: string, index: number, branchType?: string) => Edge;
  onCreateBranch: (nodeId: string) => void;
  selectedNodeId: string | null;
  toggleAltBranches: () => void;
  altBranchesVisible: boolean;
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  // Generate unique IDs for new nodes
  const getNewNodeId = useCallback(() => {
    const existingIds = nodes.map(n => n.id);
    let newId = 0;
    while (existingIds.includes(`new-node-${newId}`)) {
      newId++;
    }
    return `new-node-${newId}`;
  }, [nodes]);
  
  // Handle connection end (for adding new nodes on drag)
  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: any) => {
      if (!connectionState.isValid && connectionState.fromNode) {
        // When a connection is dropped in an empty area, create a new node
        const { clientX, clientY } = 'changedTouches' in event 
          ? (event as TouchEvent).changedTouches[0] 
          : (event as MouseEvent);
          
        // Get flow position from screen position  
        const position = screenToFlowPosition({
          x: clientX,
          y: clientY,
        });
        
        const newNodeId = getNewNodeId();
        
        // Create the new node with "alternative" branch type
        const newNode: Node<PlanStepNodeData> = {
          id: newNodeId,
          type: 'planStep',
          position,
          data: {
            content: 'New step',
            title: 'Custom Step',
            icon: getIconComponent('list'),
            isEditing: true,
            branchType: 'alternative', // Changed to 'alternative' to make all new nodes "alt" nodes
          },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        };
        
        // Create the new connection
        const newEdge: Edge = createEdge(
          connectionState.fromNode.id, 
          newNodeId, 
          edges.length,
          'alternative' // Changed to match the new node's branch type
        );
        
        // Dispatch custom events to add the node and edge
        window.dispatchEvent(new CustomEvent('node:add', { detail: newNode }));
        window.dispatchEvent(new CustomEvent('edge:add', { detail: newEdge }));
      }
    },
    [screenToFlowPosition, edges.length, getNewNodeId, createEdge]
  );

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 0.85 }}
        attributionPosition="bottom-right"
        style={{ width: '100%', height: '100%', backgroundColor: '#1a2236' }}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          animated: false,
          style: { strokeWidth: 2 }
        }}
        nodeOrigin={[0.5, 0.0] as NodeOrigin}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#505050" /> {/* Brightened dots */}
        
        <Panel position="top-right">
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-1 text-sm"
              onClick={() => {
                if (selectedNodeId) {
                  onCreateBranch(selectedNodeId);
                }
              }}
              disabled={!selectedNodeId}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 3v12"></path>
                <circle cx="18" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <path d="M18 9a9 9 0 0 1-9 9"></path>
              </svg>
              Create Branch
            </button>
            
            <button
              className={`px-3 py-1 ${altBranchesVisible ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded flex items-center gap-1 text-sm`}
              onClick={toggleAltBranches}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
              </svg>
              {altBranchesVisible ? "Hide Alt Branches" : "Show Alt Branches"}
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

// Type definitions for tool calls and search results
type ToolCallParameters = {
  query?: string;
  code?: string;
  [key: string]: any;
};

type ToolCall = {
  name?: string;
  parameters?: ToolCallParameters;
};

type SearchResult = {
  title?: string;
  url?: string;
};

type SearchResults = {
  search_results?: {
    documents?: SearchResult[];
  } | null;
};

// type PlanFlowDiagramProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   events: StreamToolCallsGeneration[] | undefined;
// };

// const PlanFlowDiagram: React.FC<PlanFlowDiagramProps> = ({ isOpen, onClose, events }) => {
//   const [nodes, setNodes, onNodesChange] = useNodesState<Node<PlanStepNodeData>>([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
//   const [loaded, setLoaded] = useState(false);
//   const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
//   const [altBranchesVisible, setAltBranchesVisible] = useState(true);
type PlanFlowDiagramProps = {
  isOpen: boolean;
  onClose: () => void;
  events: StreamToolCallsGeneration[] | undefined;
  onRegenerateFromFlow?: (flowData: RegenerationData) => Promise<void>; // Updated type
};

// Define flow template types
type FlowTemplate = {
  id: string;
  name: string;
  description: string;
  nodes: RegenerationData['nodes'];
  edges: RegenerationData['edges'];
};

// We're using the imported RegenerationData type from @/types/tools

const PlanFlowDiagram: React.FC<PlanFlowDiagramProps> = ({ 
  isOpen, 
  onClose, 
  events, 
  onRegenerateFromFlow 
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<PlanStepNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [altBranchesVisible, setAltBranchesVisible] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false); // New state for tracking regeneration
  const [selectedTemplate, setSelectedTemplate] = useState<string>('current'); // Default to current flow
  const [previewExpanded, setPreviewExpanded] = useState(false); // State for preview panel
  const [previewResponse, setPreviewResponse] = useState<string>(''); // State for preview content
  
  // Toggle visibility of alternative branches
  const toggleAltBranches = useCallback(() => {
    setAltBranchesVisible(prev => {
      const newValue = !prev;
      
      // Use newValue instead of the not-yet-updated altBranchesVisible
      setNodes(nds => 
        nds.map(node => ({
          ...node,
          hidden: !newValue && node.data?.branchType === 'alternative'
        }))
      );
      
      // Same here
      setEdges(eds => 
        eds.map(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          const isAltBranchEdge = 
            (sourceNode?.data?.branchType === 'alternative' || targetNode?.data?.branchType === 'alternative');
          
          return {
            ...edge,
            hidden: !newValue && isAltBranchEdge
          };
        })
      );
      
      return newValue;
    });
  }, [nodes, setNodes, setEdges]);
  
  // Set up a listener for node content updates and new nodes/edges
  useEffect(() => {
    // Old commented code kept for reference
    // const handleNodeUpdate = (e: Event) => {
    //   const customEvent = e as CustomEvent;
    //   const { id, data } = customEvent.detail;
      
    //   setNodes(nds => 
    //     nds.map(node => 
    //       node.id === id 
    //         ? { ...node, data: { ...data } }
    //         : node
    //     )
    //   );
    // };
    const handleNodeUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { id, data } = customEvent.detail;
      
      // Update the current nodes state
      setNodes(nds => {
        const updatedNodes = nds.map(node => 
          node.id === id 
            ? { ...node, data: { ...data } }
            : node
        );
        
        // If we're in a specific template, update its persisted state
        if (selectedTemplate !== 'current' && selectedTemplate !== '') {
          setTemplateNodesMap(prev => ({
            ...prev,
            [selectedTemplate]: updatedNodes
          }));
        }
        
        // If we're in the "current" template, also update the initial state
        if (selectedTemplate === 'current') {
          setInitialNodes(updatedNodes);
        }
        
        return updatedNodes;
      });
    
      // Update edge styling if branch type changed
      if ('branchType' in data) {
        setEdges(eds => {
          const updatedEdges = eds.map(edge => {
            // If this edge connects to/from the updated node
            if (edge.source === id || edge.target === id) {
              const sourceNode = nodes.find(n => n.id === edge.source);
              // Get the branch type from the source node (which may be the updated node)
              const branchType = edge.source === id ? 
                data.branchType : 
                sourceNode?.data?.branchType || 'primary';
                
              // Update edge styling
              return {
                ...edge,
                animated: branchType === 'alternative',
                style: { 
                  stroke: branchType === 'primary' ? '#3b82f6' : '#9333ea',
                  strokeWidth: 2 
                },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 15,
                  height: 15,
                  color: branchType === 'primary' ? '#3b82f6' : '#9333ea',
                }
              };
            }
            return edge;
          });
          
          // Persist the updated edges state
          if (selectedTemplate !== 'current' && selectedTemplate !== '') {
            setTemplateEdgesMap(prev => ({
              ...prev,
              [selectedTemplate]: updatedEdges
            }));
          }
          
          // If we're in the "current" template, also update the initial state
          if (selectedTemplate === 'current') {
            setInitialEdges(updatedEdges);
          }
          
          return updatedEdges;
        });
      }
    };
    
    const handleNodeAdd = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newNode = customEvent.detail;
      
      // Update the current nodes state
      setNodes(nds => {
        const updatedNodes = [...nds, newNode];
        
        // Persist the updated nodes state
        if (selectedTemplate !== 'current' && selectedTemplate !== '') {
          setTemplateNodesMap(prev => ({
            ...prev,
            [selectedTemplate]: updatedNodes
          }));
        }
        
        // If we're in the "current" template, also update the initial state
        if (selectedTemplate === 'current') {
          setInitialNodes(updatedNodes);
        }
        
        return updatedNodes;
      });
    };
    
    const handleEdgeAdd = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newEdge = customEvent.detail;
      
      // Update the current edges state
      setEdges(eds => {
        const updatedEdges = [...eds, newEdge];
        
        // Persist the updated edges state
        if (selectedTemplate !== 'current' && selectedTemplate !== '') {
          setTemplateEdgesMap(prev => ({
            ...prev,
            [selectedTemplate]: updatedEdges
          }));
        }
        
        // If we're in the "current" template, also update the initial state
        if (selectedTemplate === 'current') {
          setInitialEdges(updatedEdges);
        }
        
        return updatedEdges;
      });
    };
    
    const handleBranchCreate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { id } = customEvent.detail;
      createBranch(id);
    };
    
    window.addEventListener('node:update', handleNodeUpdate as EventListener);
    window.addEventListener('node:add', handleNodeAdd as EventListener);
    window.addEventListener('edge:add', handleEdgeAdd as EventListener);
    window.addEventListener('branch:create', handleBranchCreate as EventListener);
    
    return () => {
      window.removeEventListener('node:update', handleNodeUpdate as EventListener);
      window.removeEventListener('node:add', handleNodeAdd as EventListener);
      window.removeEventListener('edge:add', handleEdgeAdd as EventListener);
      window.removeEventListener('branch:create', handleBranchCreate as EventListener);
    };
  }, [setNodes, setEdges]);
  
  const onConnect: OnConnect = useCallback(
    (connection) => {
      // Determine branch type based on source node
      const sourceNode = nodes.find(n => n.id === connection.source);
      const branchType = sourceNode?.data?.branchType || 'primary';
      
      // Create styled edge
      const edge: Edge = {
        ...connection,
        id: `edge-${connection.source}-${connection.target}`,
        animated: branchType === 'alternative',
        style: { 
          stroke: branchType === 'primary' ? '#3b82f6' : '#9333ea',
          strokeWidth: 2 
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
          color: branchType === 'primary' ? '#3b82f6' : '#9333ea',
        }
      };
      
      setEdges((eds) => addEdge(edge, eds));
    },
    [nodes, setEdges]
  );

  // Create an edge between nodes with styling based on branch type
  const createEdge = (sourceId: string, targetId: string, index: number, branchType = 'primary'): Edge => {
    return {
      id: `edge-${index}`,
      source: sourceId,
      target: targetId,
      sourceHandle: `${sourceId}-source`,
      targetHandle: `${targetId}-target`,
      type: 'step',
      animated: branchType === 'alternative',
      style: { 
        stroke: branchType === 'primary' ? '#3b82f6' : '#9333ea',
        strokeWidth: 2 
      },
      markerEnd: { 
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: branchType === 'primary' ? '#3b82f6' : '#9333ea',
      },
    };
  };
  
  // Create a branch from a node
  const createBranch = (sourceNodeId: string): void => {
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    if (!sourceNode) return;
    
    // Generate a new node ID
    const existingIds = nodes.map(n => n.id);
    let newId = 0;
    while (existingIds.includes(`branch-node-${newId}`)) {
      newId++;
    }
    const branchNodeId = `branch-node-${newId}`;
    
    // Create branch node
    const branchNode: Node<PlanStepNodeData> = {
      id: branchNodeId,
      type: 'planStep',
      position: { 
        x: sourceNode.position.x + 300, 
        y: sourceNode.position.y + 50
      },
      data: {
        content: 'Alternative approach...',
        title: 'Branch Point',
        icon: getIconComponent('compare'),
        branchType: 'alternative',
        isEditing: true
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
    
    // Add the branch to nodes and persist changes
    setNodes(nds => {
      const updatedNodes = [...nds, branchNode];
      
      // Persist the updated nodes state
      if (selectedTemplate !== 'current' && selectedTemplate !== '') {
        setTemplateNodesMap(prev => ({
          ...prev,
          [selectedTemplate]: updatedNodes
        }));
      }
      
      // If we're in the "current" template, also update the initial state
      if (selectedTemplate === 'current') {
        setInitialNodes(updatedNodes);
      }
      
      return updatedNodes;
    });
    
    // Create an edge from source to branch
    const newEdge = createEdge(sourceNodeId, branchNodeId, edges.length, 'alternative');
    
    // Add the edge and persist changes
    setEdges(eds => {
      const updatedEdges = [...eds, newEdge];
      
      // Persist the updated edges state
      if (selectedTemplate !== 'current' && selectedTemplate !== '') {
        setTemplateEdgesMap(prev => ({
          ...prev,
          [selectedTemplate]: updatedEdges
        }));
      }
      
      // If we're in the "current" template, also update the initial state
      if (selectedTemplate === 'current') {
        setInitialEdges(updatedEdges);
      }
      
      return updatedEdges;
    });
  };

  // Handle node click to set the selected node
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<PlanStepNodeData>) => {
    setSelectedNodeId(node.id);
  }, []);

  // Icon mapping function with proper typing
  type IconMap = {
    [key: string]: () => JSX.Element;
  };

  const getIconComponent = (toolName: string) => {
    const iconMap: IconMap = {
      list: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      ),
      'book-open-text': () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          <path d="M6 8h2"></path>
          <path d="M6 12h2"></path>
          <path d="M16 8h2"></path>
          <path d="M16 12h2"></path>
        </svg>
      ),
      calculator: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="2" width="16" height="20" rx="2"></rect>
          <line x1="8" y1="6" x2="16" y2="6"></line>
          <line x1="16" y1="14" x2="16" y2="18"></line>
          <path d="M8 10h.01"></path>
          <path d="M12 10h.01"></path>
          <path d="M16 10h.01"></path>
          <path d="M8 14h.01"></path>
          <path d="M12 14h.01"></path>
          <path d="M8 18h.01"></path>
          <path d="M12 18h.01"></path>
        </svg>
      ),
      search: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      ),
      code: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
      compare: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 3v12"></path>
          <circle cx="18" cy="6" r="3"></circle>
          <circle cx="6" cy="18" r="3"></circle>
          <path d="M18 9a9 9 0 0 1-9 9"></path>
        </svg>
      ),
    };

    return iconMap[toolName] || iconMap.list;
  };

  // Helper function to create properly typed nodes
  const createPlanStepNode = (
    id: string, 
    position: { x: number, y: number }, 
    content: string,
    title: string | undefined,
    iconName: string,
    branchType: string,
    draggable: boolean = true
  ): Node<PlanStepNodeData> => {
    // Ensure valid branch type
    const safeBranchType = branchType === 'alternative' ? 'alternative' : 'primary';
    
    return {
      id,
      type: 'planStep',
      position,
      data: {
        content,
        title,
        icon: getIconComponent(iconName),
        branchType: safeBranchType,
      },
      draggable,
    };
  };

  // Helper function to safely extract document information
  const extractDocumentInfo = (doc: any): { title?: string; url?: string } => {
    if (doc) {
      return {
        title: typeof doc.title === 'string' ? doc.title : undefined,
        url: typeof doc.url === 'string' ? doc.url : undefined
      };
    }
    return {};
  };

  // Initialize diagram from plan and events
  const initializeDiagram = useCallback(() => {
    if (!events || events.length === 0) {
      setLoaded(true);
      return;
    }

    // Explicitly type the nodes with the exact same type expected by useNodesState
    const diagramNodes: Node<PlanStepNodeData>[] = [];
    const diagramEdges: Edge[] = [];
    let nodeId = 0;
    
    // Starting x,y position for nodes
    const startX = 250;
    const startY = 100;
    const ySpacing = 120;

    events.forEach((event, index) => {
      // Add plan text if available
      if (event.text && event.text.trim() !== '') {
        const id = `node-${nodeId}`;
        diagramNodes.push(
          createPlanStepNode(
            id,                                 // id
            { x: startX, y: startY + nodeId * ySpacing }, // position
            event.text,                         // content
            'Plan',                             // title
            'list',                             // iconName
            'primary'                           // branchType
          )
        );
        
        // Connect to previous node
        if (nodeId > 0) {
          const prevId = `node-${nodeId-1}`;
          diagramEdges.push(createEdge(prevId, id, diagramEdges.length));
        }
        
        nodeId++;
      }

      // Add tool calls
      if (event.tool_calls && Array.isArray(event.tool_calls)) {
        event.tool_calls.forEach((toolCall) => {
          const id = `node-${nodeId}`;
          const toolName = toolCall.name || 'Unknown Tool';
          const iconName = 
            toolName.includes('search') ? 'search' :
            toolName.includes('calculator') ? 'calculator' :
            toolName.includes('python') || toolName.includes('code') ? 'code' : 
            'list';

          let content = `Using ${toolName}`;
          
          if (toolCall.parameters) {
            if (toolCall.parameters.query) {
              content = `Searching for "${toolCall.parameters.query}"`;
            } else if (toolCall.parameters.code) {
              content = `Executing code`;
            }
          }

          diagramNodes.push(
            createPlanStepNode(
              id,
              { x: startX, y: startY + nodeId * ySpacing },
              content,
              toolName,
              iconName,
              'primary'
            )
          );

          // Connect to previous node
          if (nodeId > 0) {
            const prevId = `node-${nodeId-1}`;
            diagramEdges.push(createEdge(prevId, id, diagramEdges.length));
          }
          
          nodeId++;
        });
      }

      // Add search results with safer type checking
      if (
        event.stream_search_results?.search_results &&
        typeof event.stream_search_results.search_results === 'object' &&
        'documents' in event.stream_search_results.search_results &&
        Array.isArray(event.stream_search_results.search_results.documents)
      ) {
        const documents: SearchResult[] = event.stream_search_results.search_results.documents;
        
        // Extract title or URL safely from each document
        const docInfo = documents
          .map(doc => extractDocumentInfo(doc))
          .filter(info => info.title || info.url);
          
        const docTitles = docInfo
          .map(info => info.title || info.url || '')
          .filter(Boolean)
          .slice(0, 3);
        
        if (docTitles.length > 0) {
          const id = `node-${nodeId}`;
          const resultsContent = `Found resources: ${docTitles.join(', ')}${
            documents.length > 3 ? ` and ${documents.length - 3} more` : ''
          }`;
          
          diagramNodes.push(
            createPlanStepNode(
              id,
              { x: startX, y: startY + nodeId * ySpacing },
              resultsContent,
              'Search Results',
              'book-open-text',
              'primary'
            )
          );

          // Connect to previous node
          if (nodeId > 0) {
            const prevId = `node-${nodeId-1}`;
            diagramEdges.push(createEdge(prevId, id, diagramEdges.length));
          }
          
          nodeId++;
        }
      }
    });
    if (nodeId > 0) {
      // Add final response node
      const finalId = `node-${nodeId}`;
      diagramNodes.push(
        createPlanStepNode(
          finalId,
          { x: startX, y: startY + nodeId * ySpacing },
          'Generate final response based on collected information',
          'Final Response',
          'list',
          'primary'
        )
      );

      // Connect to previous node
      if (nodeId > 0) {
        const prevId = `node-${nodeId-1}`;
        diagramEdges.push(createEdge(prevId, finalId, diagramEdges.length));
      }
      
      // Set the final node as selected by default
      setSelectedNodeId(finalId);
    }
    
    // Set nodes and edges
    setNodes(diagramNodes);
    setEdges(diagramEdges);
    
    // Wait for nodes to be properly mounted and initialized
    setTimeout(() => {
      setLoaded(true);
    }, 100);
    
  }, [events, setNodes, setEdges]);

  // Update node selected state
  useEffect(() => {
    if (selectedNodeId) {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          selected: node.id === selectedNodeId,
        }))
      );
    }
  }, [selectedNodeId, setNodes]);

  // Initialize when modal opens or events change
  useEffect(() => {
    if (isOpen && events) {
      // Only initialize if no nodes exist yet
      if (nodes.length === 0) {
        setLoaded(false);
        
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
          initializeDiagram();
        }, 100);
        
        return () => clearTimeout(timer);
      } else {
        // Just mark as loaded if we already have nodes
        setLoaded(true);
      }
    }
  }, [isOpen, events, nodes.length, initializeDiagram]);
  
  // Handle window resize and node drag
  useEffect(() => {
    if (!isOpen) return;
    
    const handleResize = () => {
      setEdges(edges => edges.map(edge => ({...edge})));
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, setEdges]);

const prepareRegenerationData = (): RegenerationData => {
  // Get all nodes, sorted by position for the main path
  const allNodes = [...nodes].sort((a, b) => 
    (a.position.y || 0) - (b.position.y || 0)
  );
  
  // Extract node data without adding parentId
  const nodesData = allNodes.map(node => ({
    id: node.id,
    content: node.data.content,
    title: node.data.title,
    branchType: node.data.branchType || 'primary',
    position: { x: node.position.x || 0, y: node.position.y || 0 }
  }));
  
  // Extract edge data with branch types
  const edgesData = edges.map(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const branchType = sourceNode?.data?.branchType || 'primary';
    
    return {
      source: edge.source,
      target: edge.target,
      branchType
    };
  });
  
  return {
    nodes: nodesData,
    edges: edgesData
  };
};

// Define available flow templates
const flowTemplates: FlowTemplate[] = [
  {
    id: 'current',
    name: 'Current Flow',
    description: 'Continue with the current flow diagram',
    nodes: [],
    edges: []
  },
  {
    id: 'research',
    name: 'Research Pattern',
    description: 'A template for researching a topic thoroughly with evidence',
    nodes: [
      {
        id: 'start',
        title: 'Question',
        content: 'Define research question',
        branchType: 'primary',
        position: { x: 250, y: 100 }
      },
      {
        id: 'search',
        title: 'Search',
        content: 'Perform comprehensive search for information',
        branchType: 'primary',
        position: { x: 250, y: 200 }
      },
      {
        id: 'evaluate',
        title: 'Evaluate',
        content: 'Critically evaluate sources and information',
        branchType: 'primary',
        position: { x: 250, y: 300 }
      },
      {
        id: 'synthesize',
        title: 'Synthesize',
        content: 'Connect and integrate findings',
        branchType: 'primary',
        position: { x: 250, y: 400 }
      },
      {
        id: 'conclude',
        title: 'Conclude',
        content: 'Draw evidence-based conclusions',
        branchType: 'primary',
        position: { x: 250, y: 500 }
      },
      {
        id: 'alt-sources',
        title: 'Alternative Sources',
        content: 'Consider non-traditional information sources',
        branchType: 'alternative',
        position: { x: 450, y: 250 }
      }
    ],
    edges: [
      { source: 'start', target: 'search', branchType: 'primary' },
      { source: 'search', target: 'evaluate', branchType: 'primary' },
      { source: 'evaluate', target: 'synthesize', branchType: 'primary' },
      { source: 'synthesize', target: 'conclude', branchType: 'primary' },
      { source: 'search', target: 'alt-sources', branchType: 'alternative' },
      { source: 'alt-sources', target: 'evaluate', branchType: 'alternative' }
    ]
  },
  {
    id: 'creative',
    name: 'Creative Thinking',
    description: 'Divergent thinking pattern for creative solutions',
    nodes: [
      {
        id: 'problem',
        title: 'Problem',
        content: 'Define the creative challenge',
        branchType: 'primary',
        position: { x: 250, y: 100 }
      },
      {
        id: 'diverge',
        title: 'Diverge',
        content: 'Generate many possible ideas',
        branchType: 'primary',
        position: { x: 250, y: 200 }
      },
      {
        id: 'explore',
        title: 'Explore',
        content: 'Explore unusual combinations and perspectives',
        branchType: 'primary',
        position: { x: 250, y: 300 }
      },
      {
        id: 'converge',
        title: 'Converge',
        content: 'Select promising directions',
        branchType: 'primary',
        position: { x: 250, y: 400 }
      },
      {
        id: 'refine',
        title: 'Refine',
        content: 'Develop and refine the selected idea',
        branchType: 'primary',
        position: { x: 250, y: 500 }
      },
      {
        id: 'wild',
        title: 'Wild Ideas',
        content: 'Consider absurd or impossible solutions',
        branchType: 'alternative',
        position: { x: 450, y: 250 }
      }
    ],
    edges: [
      { source: 'problem', target: 'diverge', branchType: 'primary' },
      { source: 'diverge', target: 'explore', branchType: 'primary' },
      { source: 'explore', target: 'converge', branchType: 'primary' },
      { source: 'converge', target: 'refine', branchType: 'primary' },
      { source: 'diverge', target: 'wild', branchType: 'alternative' },
      { source: 'wild', target: 'converge', branchType: 'alternative' }
    ]
  },
  {
    id: 'analysis',
    name: 'Analytical Reasoning',
    description: 'Structured analysis pattern for complex problems',
    nodes: [
      {
        id: 'define',
        title: 'Define',
        content: 'Define the problem and criteria',
        branchType: 'primary',
        position: { x: 250, y: 100 }
      },
      {
        id: 'decompose',
        title: 'Decompose',
        content: 'Break down into component parts',
        branchType: 'primary',
        position: { x: 250, y: 200 }
      },
      {
        id: 'analyze',
        title: 'Analyze',
        content: 'Analyze each component in detail',
        branchType: 'primary',
        position: { x: 250, y: 300 }
      },
      {
        id: 'calculate',
        title: 'Calculate',
        content: 'Perform quantitative analysis if applicable',
        branchType: 'primary',
        position: { x: 250, y: 400 }
      },
      {
        id: 'synthesize',
        title: 'Synthesize',
        content: 'Reassemble components with insights',
        branchType: 'primary',
        position: { x: 250, y: 500 }
      },
      {
        id: 'validate',
        title: 'Validate',
        content: 'Validate results against criteria',
        branchType: 'primary',
        position: { x: 250, y: 600 }
      },
      {
        id: 'alt-approach',
        title: 'Alternative Method',
        content: 'Consider a different analytical approach',
        branchType: 'alternative',
        position: { x: 450, y: 350 }
      }
    ],
    edges: [
      { source: 'define', target: 'decompose', branchType: 'primary' },
      { source: 'decompose', target: 'analyze', branchType: 'primary' },
      { source: 'analyze', target: 'calculate', branchType: 'primary' },
      { source: 'calculate', target: 'synthesize', branchType: 'primary' },
      { source: 'synthesize', target: 'validate', branchType: 'primary' },
      { source: 'analyze', target: 'alt-approach', branchType: 'alternative' },
      { source: 'alt-approach', target: 'synthesize', branchType: 'alternative' }
    ]
  }
];

// Store the initial diagram state for returning to "Current Flow"
const [initialNodes, setInitialNodes] = useState<Node<PlanStepNodeData>[]>([]);
const [initialEdges, setInitialEdges] = useState<Edge[]>([]);

// Store the current template's nodes and edges for persistence
const [templateNodesMap, setTemplateNodesMap] = useState<Record<string, Node<PlanStepNodeData>[]>>({});
const [templateEdgesMap, setTemplateEdgesMap] = useState<Record<string, Edge[]>>({});

// Save initial diagram state when first loaded
useEffect(() => {
  if (loaded && nodes.length > 0 && initialNodes.length === 0) {
    setInitialNodes([...nodes]);
    setInitialEdges([...edges]);
  }
}, [loaded, nodes, edges, initialNodes.length]);

// Function to load a selected template
const loadTemplate = (templateId: string) => {
  // Before switching templates, save current state to the template map for persistence
  if (selectedTemplate !== '' && selectedTemplate !== 'current') {
    setTemplateNodesMap(prev => ({
      ...prev,
      [selectedTemplate]: [...nodes]
    }));
    setTemplateEdgesMap(prev => ({
      ...prev,
      [selectedTemplate]: [...edges]
    }));
  }
  
  // Always update the selected template state
  setSelectedTemplate(templateId);
  
  if (templateId === 'current') {
    // Restore the initial flow
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
    return;
  }
  
  const template = flowTemplates.find(t => t.id === templateId);
  if (!template) return;
  
  // Check if we have persisted state for this template
  if (templateNodesMap[templateId] && templateEdgesMap[templateId]) {
    // Restore the persisted state
    setNodes(templateNodesMap[templateId]);
    setEdges(templateEdgesMap[templateId]);
    return;
  }
  
  // Convert template nodes to ReactFlow nodes using our helper function
  const diagramNodes = template.nodes.map(node => {
    // Determine icon based on title
    const iconType = 
      (node.title?.toLowerCase() || '').includes('search') ? 'search' : 
      (node.title?.toLowerCase() || '').includes('code') || 
      (node.title?.toLowerCase() || '').includes('calculate') ? 'calculator' : 'list';
    
    // Use our helper function to create a properly typed node
    return createPlanStepNode(
      node.id,
      { x: node.position.x, y: node.position.y },
      node.content,
      node.title,
      iconType,
      node.branchType
    );
  });
  
  // Convert template edges to ReactFlow edges
  const diagramEdges = template.edges.map((edge, index) => createEdge(
    edge.source,
    edge.target,
    index,
    edge.branchType
  ));
  
  // Set the nodes and edges
  setNodes(diagramNodes);
  setEdges(diagramEdges);
  
  // Reset preview
  setPreviewResponse('');
};

// New function to handle regeneration
const handleRegenerate = async () => {
  if (!onRegenerateFromFlow) return;
  
  try {
    setIsRegenerating(true);
    setPreviewExpanded(true); // Auto-expand preview when regenerating
    setPreviewResponse(''); // Clear existing preview
    
    const flowData = prepareRegenerationData();
    
    // Start streaming preview updates if possible
    let previewContent = "Generating response based on flow diagram...\n\n";
    setPreviewResponse(previewContent);
    
    // Set up an interval to simulate streaming updates for demo purposes
    // In a real implementation, you would stream actual content from the AI service
    const streamingInterval = setInterval(() => {
      const steps = ["Analyzing main path...", 
                    "Processing alternative branches...", 
                    "Integrating insights...", 
                    "Formulating response..."];
      
      const randomStep = steps[Math.floor(Math.random() * steps.length)];
      previewContent += randomStep + "\n";
      setPreviewResponse(previewContent);
    }, 1000);
    
    // Simulate a regeneration with mock data for demo purposes
    // In a real implementation, this would call an API to generate a response
    const mockResponse = "This is a regenerated response based on your flow diagram.";
    const mockEvents = [...(events || [])]; // Clone existing events
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Call the regenerate callback with flow data
    if (onRegenerateFromFlow) {
      await onRegenerateFromFlow(flowData);
    }
    
    // Clear the interval after regeneration completes
    clearInterval(streamingInterval);
    
    // Add final response
    previewContent += "\n## Final Response\nThe response has been regenerated based on your flow diagram modifications. " + 
      "Close this dialog to see the updated response.";
    setPreviewResponse(previewContent);
    
  } catch (error) {
    console.error('Error regenerating responses:', error);
    setPreviewResponse("Error occurred during regeneration. Please try again.");
  } finally {
    setIsRegenerating(false);
  }
};

// Now we'll modify the return statement to include our regenerate button in the Modal
  // Template selector component
  const TemplateSelector = ({ 
    templates, 
    selectedTemplate, 
    onSelectTemplate 
  }: {
    templates: FlowTemplate[],
    selectedTemplate: string,
    onSelectTemplate: (templateId: string) => void
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

return (
  <Modal
    title="Plan Flow Diagram"
    isOpen={isOpen}
    onClose={onClose}
    dialogPaddingClassName="px-3 py-4"
  >
    <div 
       className="w-full mt-[-1rem]" 
       style={{ height: "550px", width: "550px" }}
    >
      {!loaded ? (
        <div className="flex h-full items-center justify-center">
          <p>Loading diagram...</p>
        </div>
      ) : nodes.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p>No plan steps available to display</p>
        </div>
      ) : (
        <ReactFlowProvider>
          <div className="flex flex-col h-full">
            {/* Add controls at the top - minimized */}
            <div className="flex justify-between items-center px-1 py-0.5 bg-gray-900 border-b border-gray-800">
              <div className="text-xs text-gray-400">
              {isRegenerating ? 'Regenerating...' : 'Edit diagram'}
              </div>
              <button
                className={`px-1 py-0.5 rounded flex items-center gap-1 text-xs ${
                  isRegenerating 
                    ? 'bg-gray-700 text-gray-300 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
                onClick={handleRegenerate}
                disabled={isRegenerating || !onRegenerateFromFlow}
              >
                {isRegenerating ? (
                  <>
                    <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Regenerating
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 2v6h-6"></path>
                      <path d="M3 12a9 9 0 0 1 15-6.7l3-3"></path>
                      <path d="M3 22v-6h6"></path>
                      <path d="M21 12a9 9 0 0 1-15 6.7l-3 3"></path>
                    </svg>
                    Regenerate
                  </>
                )}
              </button>
            </div>
            
            {/* Template Selector */}
            <TemplateSelector 
              templates={flowTemplates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={loadTemplate}
            />
            
            {/* Main Flow content */}
            <div className="flex-1">
              <FlowDiagramContent
                nodes={nodes}
                selectedNodeId={selectedNodeId}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                getIconComponent={getIconComponent}
                createEdge={createEdge}
                onCreateBranch={createBranch}
                toggleAltBranches={toggleAltBranches}
                altBranchesVisible={altBranchesVisible}
              />
            </div>
          </div>
        </ReactFlowProvider>
      )}
    </div>
  </Modal>
);
};

export default PlanFlowDiagram;

