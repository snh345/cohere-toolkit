'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  NodeTypes,
  useNodesState,
  useEdgesState,
  MarkerType,
  addEdge,
  type OnConnect,
  Position,
  ReactFlowProvider,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Modal } from '@/components/UI';
import { StreamToolCallsGeneration } from '@/cohere-client';

// Import types from FlowTypes
import { 
  PlanStepNodeData,
  RegenerationData,
  PlanFlowDiagramProps,
  FlowTemplate
} from './FlowTypes';

// Import components
import { PlanStepNode } from './FlowNodes/PlanStepNode';
import { FlowDiagramContent } from './FlowContent/FlowDiagramContent';
import { TemplateSelector } from './FlowTemplates/TemplateSelector';

// Import utilities and data
import { createEdge, createPlanStepNode, extractDocumentInfo } from './FlowUtils';
import { getIconComponent } from './FlowUtils/IconMap';
import { flowTemplates } from './FlowTemplates/flowTemplateData';

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
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('current');
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [previewResponse, setPreviewResponse] = useState<string>('');
  
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
  
  // Custom node types
  const nodeTypes: NodeTypes = {
    planStep: PlanStepNode,
  };
  
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
  }, [setNodes, setEdges, nodes, selectedTemplate, setInitialNodes, setInitialEdges, setTemplateNodesMap, setTemplateEdgesMap]);
  
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
        const documents = event.stream_search_results.search_results.documents;
        
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