import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  BackgroundVariant,
  useReactFlow,
  NodeOrigin,
  Position
} from '@xyflow/react';
import { FlowDiagramContentProps, PlanStepNodeData } from '../FlowTypes';
import { Node } from '@xyflow/react';

/**
 * Main flow diagram content component
 * Responsible for rendering the ReactFlow canvas with nodes and edges
 */
export const FlowDiagramContent: React.FC<FlowDiagramContentProps> = ({ 
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
        const newEdge = createEdge(
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
    [screenToFlowPosition, edges.length, getNewNodeId, createEdge, getIconComponent]
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
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#505050" />
        
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