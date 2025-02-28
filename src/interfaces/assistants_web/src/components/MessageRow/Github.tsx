// 'use client';

// import { useCallback, useEffect, useState, useRef } from 'react';
// import {
//   ReactFlow,
//   Node,
//   Edge,
//   Controls,
//   Background,
//   NodeTypes,
//   useNodesState,
//   useEdgesState,
//   MarkerType,
//   addEdge,
//   type OnConnect,
//   BackgroundVariant,
//   Handle,
//   Position,
//   ReactFlowProvider,
//   useReactFlow,
//   Connection,
//   NodeOrigin,
// } from '@xyflow/react';
// import '@xyflow/react/dist/style.css';
// import { Modal } from '@/components/UI';
// import { initialEdges, edgeTypes } from "../edges";
// import { StreamToolCallsGeneration } from '@/cohere-client';

// const FlowDiagramContent = ({ 
//   nodes, 
//   edges, 
//   onNodesChange, 
//   onEdgesChange, 
//   onConnect, 
//   onNodeClick, 
//   nodeTypes,
//   getIconComponent,
//   createEdge
// }: {
//   nodes: Node<PlanStepNodeData>[];
//   edges: Edge[];
//   onNodesChange: (changes: any) => void;
//   onEdgesChange: (changes: any) => void;
//   onConnect: OnConnect;
//   onNodeClick: (event: React.MouseEvent, node: Node<PlanStepNodeData>) => void;
//   nodeTypes: NodeTypes;
//   getIconComponent: (toolName: string) => React.ComponentType<any>;
//   createEdge: (sourceId: string, targetId: string, index: number) => Edge;
// }) => {
//   const reactFlowWrapper = useRef<HTMLDivElement>(null);
//   const { screenToFlowPosition } = useReactFlow();
  
//   // Generate unique IDs for new nodes
//   const getNewNodeId = useCallback(() => {
//     const existingIds = nodes.map(n => n.id);
//     let newId = 0;
//     while (existingIds.includes(`new-node-${newId}`)) {
//       newId++;
//     }
//     return `new-node-${newId}`;
//   }, [nodes]);
  
//   // Handle connection end (for adding new nodes on drag)
//   const onConnectEnd = useCallback(
//     (event: MouseEvent | TouchEvent, connectionState: any) => {
//       if (!connectionState.isValid && connectionState.fromNode) {
//         // When a connection is dropped in an empty area, create a new node
//         const { clientX, clientY } = 'changedTouches' in event 
//           ? (event as TouchEvent).changedTouches[0] 
//           : (event as MouseEvent);
          
//         // Get flow position from screen position  
//         const position = screenToFlowPosition({
//           x: clientX,
//           y: clientY,
//         });
        
//         const newNodeId = getNewNodeId();
        
//         // Create the new node
//         const newNode: Node<PlanStepNodeData> = {
//           id: newNodeId,
//           type: 'planStep',
//           position,
//           data: {
//             content: 'New step',
//             title: 'Custom Step',
//             icon: getIconComponent('list'),
//             isEditing: true,
//           },
//           sourcePosition: Position.Bottom,
//           targetPosition: Position.Top,
//         };
        
//         // Create the new connection
//         const newEdge: Edge = createEdge(
//           connectionState.fromNode.id, 
//           newNodeId, 
//           edges.length
//         );
        
//         // Dispatch custom events to add the node and edge
//         window.dispatchEvent(new CustomEvent('node:add', { detail: newNode }));
//         window.dispatchEvent(new CustomEvent('edge:add', { detail: newEdge }));
//       }
//     },
//     [screenToFlowPosition, edges.length, getNewNodeId]
//   );

//   return (
//     <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         onConnectEnd={onConnectEnd}
//         onNodeClick={onNodeClick}
//         nodeTypes={nodeTypes}
//         fitView
//         fitViewOptions={{ padding: 0.2 }}
//         attributionPosition="bottom-right"
//         style={{ width: '100%', height: '100%' }}
//         proOptions={{ hideAttribution: true }}
//         defaultEdgeOptions={{
//           animated: true,
//           style: { strokeWidth: 2 }
//         }}
//         nodeOrigin={[0.5, 0.0] as NodeOrigin}
//       >
//         <Controls />
//         {/* MiniMap removed */}
//         <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
//       </ReactFlow>
//     </div>
//   );
// };

// // Type definitions for tool calls and search results
// type ToolCallParameters = {
//   query?: string;
//   code?: string;
//   [key: string]: any;
// };

// type ToolCall = {
//   name?: string;
//   parameters?: ToolCallParameters;
// };

// type SearchResult = {
//   title?: string;
//   url?: string;
// };

// type SearchResults = {
//   search_results?: {
//     documents?: SearchResult[];
//   } | null;
// };

// // Custom node component with proper typing and explicit handles
// type PlanStepNodeData = {
//   icon: React.ComponentType<any>;
//   title?: string;
//   content: string;
//   isEditing?: boolean;
// };

// // Node with explicit handles for better connection control
// const PlanStepNode = ({ id, data, selected }: { id: string; data: PlanStepNodeData; selected?: boolean }) => {
//   const [editContent, setEditContent] = useState(data.content);
//   const [editTitle, setEditTitle] = useState(data.title || '');
//   const [editing, setEditing] = useState(false);
  
//   // Handle double-click to start editing
//   const handleDoubleClick = () => {
//     setEditing(true);
//   };
  
//   // Handle save on blur or Enter key
//   const handleSave = () => {
//     const event = new CustomEvent('node:update', {
//       detail: { 
//         id, 
//         data: { 
//           ...data, 
//           content: editContent,
//           title: editTitle.trim() ? editTitle : data.title
//         } 
//       }
//     });
//     window.dispatchEvent(event);
//     setEditing(false);
//   };
  
//   // Handle Enter key
//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSave();
//     }
//   };

//   return (
//     <div 
//       className={`rounded-md border ${selected ? 'border-green-500 dark:border-green-400' : 'border-mushroom-700 dark:border-volcanic-300'} bg-mushroom-950 p-3 shadow-md dark:bg-volcanic-200 ${selected ? 'ring-2 ring-green-500 dark:ring-green-400' : ''}`}
//       onDoubleClick={handleDoubleClick}
//     >
//       {/* Explicit source handle at bottom */}
//       <Handle
//         type="source"
//         position={Position.Bottom}
//         id={`${id}-source`}
//         style={{ background: '#555', width: '8px', height: '8px' }}
//       />
      
//       {/* Explicit target handle at top */}
//       <Handle
//         type="target"
//         position={Position.Top}
//         id={`${id}-target`}
//         style={{ background: '#555', width: '8px', height: '8px' }}
//       />
      
//       <div className="flex items-start gap-2">
//         {data.icon && (
//           <span className="flex h-6 w-6 items-center justify-center">
//             <data.icon className={`h-5 w-5 ${selected ? 'text-green-500 dark:text-green-400' : 'text-mushroom-300 dark:text-marble-800'}`} />
//           </span>
//         )}
//         <div className="flex flex-col w-full">
//           {editing ? (
//             // Editing mode
//             <>
//               {data.title !== undefined && (
//                 <input
//                   type="text"
//                   className="text-sm font-medium bg-mushroom-900 dark:bg-volcanic-300 text-mushroom-200 dark:text-marble-900 p-1 mb-1 rounded w-full"
//                   value={editTitle}
//                   onChange={(e) => setEditTitle(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   onBlur={handleSave}
//                   autoFocus
//                 />
//               )}
//               <textarea
//                 className="text-xs bg-mushroom-900 dark:bg-volcanic-300 text-mushroom-300 dark:text-marble-800 p-1 rounded w-full min-h-[60px]"
//                 value={editContent}
//                 onChange={(e) => setEditContent(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 onBlur={handleSave}
//                 autoFocus={!data.title}
//               />
//             </>
//           ) : (
//             // Display mode
//             <>
//               {data.title && (
//                 <div className={`text-sm font-medium ${selected ? 'text-green-500 dark:text-green-400' : 'text-mushroom-200 dark:text-marble-900'}`}>
//                   {data.title}
//                 </div>
//               )}
//               <div className="text-xs text-mushroom-300 dark:text-marble-800">{data.content}</div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const nodeTypes: NodeTypes = {
//   planStep: PlanStepNode,
// };

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
  
//   // Set up a listener for node content updates and new nodes/edges
//   useEffect(() => {
//     const handleNodeUpdate = (e: Event) => {
//       const customEvent = e as CustomEvent;
//       const { id, data } = customEvent.detail;
      
//       setNodes(nds => 
//         nds.map(node => 
//           node.id === id 
//             ? { ...node, data: { ...data } }
//             : node
//         )
//       );
//     };
    
//     const handleNodeAdd = (e: Event) => {
//       const customEvent = e as CustomEvent;
//       const newNode = customEvent.detail;
//       setNodes(nds => [...nds, newNode]);
//     };
    
//     const handleEdgeAdd = (e: Event) => {
//       const customEvent = e as CustomEvent;
//       const newEdge = customEvent.detail;
//       setEdges(eds => [...eds, newEdge]);
//     };
    
//     window.addEventListener('node:update', handleNodeUpdate as EventListener);
//     window.addEventListener('node:add', handleNodeAdd as EventListener);
//     window.addEventListener('edge:add', handleEdgeAdd as EventListener);
    
//     return () => {
//       window.removeEventListener('node:update', handleNodeUpdate as EventListener);
//       window.removeEventListener('node:add', handleNodeAdd as EventListener);
//       window.removeEventListener('edge:add', handleEdgeAdd as EventListener);
//     };
//   }, [setNodes, setEdges]);
  
//   const onConnect: OnConnect = useCallback(
//     (connection) => setEdges((eds) => addEdge(connection, eds)),
//     [setEdges]
//   );

//   // Handle node click to set the selected node
//   const onNodeClick = useCallback((event: React.MouseEvent, node: Node<PlanStepNodeData>) => {
//     setSelectedNodeId(node.id);
//   }, []);

//   // Icon mapping function with proper typing
//   type IconMap = {
//     [key: string]: () => JSX.Element;
//   };

//   const getIconComponent = (toolName: string) => {
//     const iconMap: IconMap = {
//       list: () => (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <line x1="8" y1="6" x2="21" y2="6"></line>
//           <line x1="8" y1="12" x2="21" y2="12"></line>
//           <line x1="8" y1="18" x2="21" y2="18"></line>
//           <line x1="3" y1="6" x2="3.01" y2="6"></line>
//           <line x1="3" y1="12" x2="3.01" y2="12"></line>
//           <line x1="3" y1="18" x2="3.01" y2="18"></line>
//         </svg>
//       ),
//       'book-open-text': () => (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
//           <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
//           <path d="M6 8h2"></path>
//           <path d="M6 12h2"></path>
//           <path d="M16 8h2"></path>
//           <path d="M16 12h2"></path>
//         </svg>
//       ),
//       calculator: () => (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <rect x="4" y="2" width="16" height="20" rx="2"></rect>
//           <line x1="8" y1="6" x2="16" y2="6"></line>
//           <line x1="16" y1="14" x2="16" y2="18"></line>
//           <path d="M8 10h.01"></path>
//           <path d="M12 10h.01"></path>
//           <path d="M16 10h.01"></path>
//           <path d="M8 14h.01"></path>
//           <path d="M12 14h.01"></path>
//           <path d="M8 18h.01"></path>
//           <path d="M12 18h.01"></path>
//         </svg>
//       ),
//       search: () => (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <circle cx="11" cy="11" r="8"></circle>
//           <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//         </svg>
//       ),
//       code: () => (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <polyline points="16 18 22 12 16 6"></polyline>
//           <polyline points="8 6 2 12 8 18"></polyline>
//         </svg>
//       ),
//     };

//     return iconMap[toolName] || iconMap.list;
//   };

//   // Helper function to safely extract document information
//   const extractDocumentInfo = (doc: any): { title?: string; url?: string } => {
//     if (doc) {
//       return {
//         title: typeof doc.title === 'string' ? doc.title : undefined,
//         url: typeof doc.url === 'string' ? doc.url : undefined
//       };
//     }
//     return {};
//   };

//   // Create edges with explicit handle IDs
//   const createEdge = (sourceId: string, targetId: string, index: number): Edge => {
//     return {
//       id: `edge-${index}`,
//       source: sourceId,
//       target: targetId,
//       sourceHandle: `${sourceId}-source`,
//       targetHandle: `${targetId}-target`,
//       type: 'step',
//       animated: true,
//       style: { 
//         strokeWidth: 2,
//       },
//       markerEnd: { 
//         type: MarkerType.ArrowClosed,
//         width: 20,
//         height: 20,
//       },
//     };
//   };

//   // Initialize diagram from plan and events
//   const initializeDiagram = useCallback(() => {
//     if (!events || events.length === 0) {
//       setLoaded(true);
//       return;
//     }

//     const diagramNodes: Node<PlanStepNodeData>[] = [];
//     const diagramEdges: Edge[] = [];
//     let nodeId = 0;
    
//     // Starting x,y position for nodes
//     const startX = 250;
//     const startY = 100;
//     const ySpacing = 120;

//     events.forEach((event, index) => {
//       // Add plan text if available
//       if (event.text && event.text.trim() !== '') {
//         const id = `node-${nodeId}`;
//         diagramNodes.push({
//           id,
//           type: 'planStep',
//           position: { x: startX, y: startY + nodeId * ySpacing },
//           data: {
//             content: event.text,
//             title: 'Plan',
//             icon: getIconComponent('list'),
//           },
//           draggable: true,
//         });
        
//         // Connect to previous node
//         if (nodeId > 0) {
//           const prevId = `node-${nodeId-1}`;
//           diagramEdges.push(createEdge(prevId, id, diagramEdges.length));
//         }
        
//         nodeId++;
//       }

//       // Add tool calls
//       if (event.tool_calls && Array.isArray(event.tool_calls)) {
//         event.tool_calls.forEach((toolCall) => {
//           const id = `node-${nodeId}`;
//           const toolName = toolCall.name || 'Unknown Tool';
//           const iconName = 
//             toolName.includes('search') ? 'search' :
//             toolName.includes('calculator') ? 'calculator' :
//             toolName.includes('python') || toolName.includes('code') ? 'code' : 
//             'list';

//           let content = `Using ${toolName}`;
          
//           if (toolCall.parameters) {
//             if (toolCall.parameters.query) {
//               content = `Searching for "${toolCall.parameters.query}"`;
//             } else if (toolCall.parameters.code) {
//               content = `Executing code`;
//             }
//           }

//           diagramNodes.push({
//             id,
//             type: 'planStep',
//             position: { x: startX, y: startY + nodeId * ySpacing },
//             data: {
//               content,
//               title: toolName,
//               icon: getIconComponent(iconName),
//             },
//             draggable: true,
//           });

//           // Connect to previous node
//           if (nodeId > 0) {
//             const prevId = `node-${nodeId-1}`;
//             diagramEdges.push(createEdge(prevId, id, diagramEdges.length));
//           }
          
//           nodeId++;
//         });
//       }

//       // Add search results with safer type checking
//       if (
//         event.stream_search_results?.search_results &&
//         typeof event.stream_search_results.search_results === 'object' &&
//         'documents' in event.stream_search_results.search_results &&
//         Array.isArray(event.stream_search_results.search_results.documents)
//       ) {
//         const documents: SearchResult[] = event.stream_search_results.search_results.documents;
        
//         // Extract title or URL safely from each document
//         const docInfo = documents
//           .map(doc => extractDocumentInfo(doc))
//           .filter(info => info.title || info.url);
          
//         const docTitles = docInfo
//           .map(info => info.title || info.url || '')
//           .filter(Boolean)
//           .slice(0, 3);
        
//         if (docTitles.length > 0) {
//           const id = `node-${nodeId}`;
//           diagramNodes.push({
//             id,
//             type: 'planStep',
//             position: { x: startX, y: startY + nodeId * ySpacing },
//             data: {
//               content: `Found resources: ${docTitles.join(', ')}${
//                 documents.length > 3 ? ` and ${documents.length - 3} more` : ''
//               }`,
//               title: 'Search Results',
//               icon: getIconComponent('book-open-text'),
//             },
//             draggable: true,
//           });

//           // Connect to previous node
//           if (nodeId > 0) {
//             const prevId = `node-${nodeId-1}`;
//             diagramEdges.push(createEdge(prevId, id, diagramEdges.length));
//           }
          
//           nodeId++;
//         }
//       }
//     });

//     // Only add final response node if we have at least one other node
//     if (nodeId > 0) {
//       // Add final response node
//       const finalId = `node-${nodeId}`;
//       diagramNodes.push({
//         id: finalId,
//         type: 'planStep',
//         position: { x: startX, y: startY + nodeId * ySpacing },
//         data: {
//           content: 'Generate final response based on collected information',
//           title: 'Final Response',
//           icon: getIconComponent('list'),
//         },
//         draggable: true,
//       });

//       // Connect to previous node
//       if (nodeId > 0) {
//         const prevId = `node-${nodeId-1}`;
//         diagramEdges.push(createEdge(prevId, finalId, diagramEdges.length));
//       }
      
//       // Set the final node as selected by default
//       setSelectedNodeId(finalId);
//     }
    
//     // Set nodes and edges
//     setNodes(diagramNodes);
//     setEdges(diagramEdges);
    
//     // Wait for nodes to be properly mounted and initialized
//     setTimeout(() => {
//       setLoaded(true);
//     }, 100);
    
//   }, [events, setNodes, setEdges]);

//   // Update node selected state
//   useEffect(() => {
//     if (selectedNodeId) {
//       setNodes((nds) =>
//         nds.map((node) => ({
//           ...node,
//           selected: node.id === selectedNodeId,
//         }))
//       );
//     }
//   }, [selectedNodeId, setNodes]);

//   // Initialize when modal opens or events change
//   useEffect(() => {
//     if (isOpen && events) {
//       // Reset states
//       setNodes([]);
//       setEdges([]);
//       setLoaded(false);
//       setSelectedNodeId(null);
      
//       // Small delay to ensure DOM is ready
//       const timer = setTimeout(() => {
//         initializeDiagram();
//       }, 100);
      
//       return () => clearTimeout(timer);
//     }
//   }, [isOpen, events, initializeDiagram]);
  
//   // Handle window resize and node drag
//   useEffect(() => {
//     if (!isOpen) return;
    
//     const handleResize = () => {
//       setEdges(edges => edges.map(edge => ({...edge})));
//     };
    
//     window.addEventListener('resize', handleResize);
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, [isOpen, setEdges]);

//   return (
//     <Modal
//       title="Plan Flow Diagram"
//       isOpen={isOpen}
//       onClose={onClose}
//     >
//       <div 
//         className="w-full" 
//         style={{ height: "500px" }}
//       >
//         {!loaded ? (
//           <div className="flex h-full items-center justify-center">
//             <p>Loading diagram...</p>
//           </div>
//         ) : nodes.length === 0 ? (
//           <div className="flex h-full items-center justify-center">
//             <p>No plan steps available to display</p>
//           </div>
//         ) : (
//           <ReactFlowProvider>
//             <FlowDiagramContent
//               nodes={nodes}
//               edges={edges}
//               onNodesChange={onNodesChange}
//               onEdgesChange={onEdgesChange}
//               onConnect={onConnect}
//               onNodeClick={onNodeClick}
//               nodeTypes={nodeTypes}
//               getIconComponent={getIconComponent}
//               createEdge={createEdge}
//             />
//           </ReactFlowProvider>
//         )}
//       </div>
//     </Modal>
//   );
// };

// export default PlanFlowDiagram;

// FLOW TEMPLATES

// const flowTemplates: FlowTemplate[] = [
//     {
//       id: 'current',
//       name: 'Current Flow',
//       description: 'Continue with the current flow diagram',
//       nodes: [],
//       edges: []
//     },
//     {
//       id: 'research',
//       name: 'Research Pattern',
//       description: 'A template for researching a topic thoroughly with evidence',
//       nodes: [
//         {
//           id: 'start',
//           title: 'Question',
//           content: 'Define research question',
//           branchType: 'primary',
//           position: { x: 250, y: 100 }
//         },
//         {
//           id: 'search',
//           title: 'Search',
//           content: 'Perform comprehensive search for information',
//           branchType: 'primary',
//           position: { x: 250, y: 200 }
//         },
//         {
//           id: 'evaluate',
//           title: 'Evaluate',
//           content: 'Critically evaluate sources and information',
//           branchType: 'primary',
//           position: { x: 250, y: 300 }
//         },
//         {
//           id: 'synthesize',
//           title: 'Synthesize',
//           content: 'Connect and integrate findings',
//           branchType: 'primary',
//           position: { x: 250, y: 400 }
//         },
//         {
//           id: 'conclude',
//           title: 'Conclude',
//           content: 'Draw evidence-based conclusions',
//           branchType: 'primary',
//           position: { x: 250, y: 500 }
//         },
//         {
//           id: 'alt-sources',
//           title: 'Alternative Sources',
//           content: 'Consider non-traditional information sources',
//           branchType: 'alternative',
//           position: { x: 450, y: 250 }
//         }
//       ],
//       edges: [
//         { source: 'start', target: 'search', branchType: 'primary' },
//         { source: 'search', target: 'evaluate', branchType: 'primary' },
//         { source: 'evaluate', target: 'synthesize', branchType: 'primary' },
//         { source: 'synthesize', target: 'conclude', branchType: 'primary' },
//         { source: 'search', target: 'alt-sources', branchType: 'alternative' },
//         { source: 'alt-sources', target: 'evaluate', branchType: 'alternative' }
//       ]
//     },
//     {
//       id: 'creative',
//       name: 'Creative Thinking',
//       description: 'Divergent thinking pattern for creative solutions',
//       nodes: [
//         {
//           id: 'problem',
//           title: 'Problem',
//           content: 'Define the creative challenge',
//           branchType: 'primary',
//           position: { x: 250, y: 100 }
//         },
//         {
//           id: 'diverge',
//           title: 'Diverge',
//           content: 'Generate many possible ideas',
//           branchType: 'primary',
//           position: { x: 250, y: 200 }
//         },
//         {
//           id: 'explore',
//           title: 'Explore',
//           content: 'Explore unusual combinations and perspectives',
//           branchType: 'primary',
//           position: { x: 250, y: 300 }
//         },
//         {
//           id: 'converge',
//           title: 'Converge',
//           content: 'Select promising directions',
//           branchType: 'primary',
//           position: { x: 250, y: 400 }
//         },
//         {
//           id: 'refine',
//           title: 'Refine',
//           content: 'Develop and refine the selected idea',
//           branchType: 'primary',
//           position: { x: 250, y: 500 }
//         },
//         {
//           id: 'wild',
//           title: 'Wild Ideas',
//           content: 'Consider absurd or impossible solutions',
//           branchType: 'alternative',
//           position: { x: 450, y: 250 }
//         }
//       ],
//       edges: [
//         { source: 'problem', target: 'diverge', branchType: 'primary' },
//         { source: 'diverge', target: 'explore', branchType: 'primary' },
//         { source: 'explore', target: 'converge', branchType: 'primary' },
//         { source: 'converge', target: 'refine', branchType: 'primary' },
//         { source: 'diverge', target: 'wild', branchType: 'alternative' },
//         { source: 'wild', target: 'converge', branchType: 'alternative' }
//       ]
//     },
//     {
//       id: 'analysis',
//       name: 'Analytical Reasoning',
//       description: 'Structured analysis pattern for complex problems',
//       nodes: [
//         {
//           id: 'define',
//           title: 'Define',
//           content: 'Define the problem and criteria',
//           branchType: 'primary',
//           position: { x: 250, y: 100 }
//         },
//         {
//           id: 'decompose',
//           title: 'Decompose',
//           content: 'Break down into component parts',
//           branchType: 'primary',
//           position: { x: 250, y: 200 }
//         },
//         {
//           id: 'analyze',
//           title: 'Analyze',
//           content: 'Analyze each component in detail',
//           branchType: 'primary',
//           position: { x: 250, y: 300 }
//         },
//         {
//           id: 'calculate',
//           title: 'Calculate',
//           content: 'Perform quantitative analysis if applicable',
//           branchType: 'primary',
//           position: { x: 250, y: 400 }
//         },
//         {
//           id: 'synthesize',
//           title: 'Synthesize',
//           content: 'Reassemble components with insights',
//           branchType: 'primary',
//           position: { x: 250, y: 500 }
//         },
//         {
//           id: 'validate',
//           title: 'Validate',
//           content: 'Validate results against criteria',
//           branchType: 'primary',
//           position: { x: 250, y: 600 }
//         },
//         {
//           id: 'alt-approach',
//           title: 'Alternative Method',
//           content: 'Consider a different analytical approach',
//           branchType: 'alternative',
//           position: { x: 450, y: 350 }
//         }
//       ],
//       edges: [
//         { source: 'define', target: 'decompose', branchType: 'primary' },
//         { source: 'decompose', target: 'analyze', branchType: 'primary' },
//         { source: 'analyze', target: 'calculate', branchType: 'primary' },
//         { source: 'calculate', target: 'synthesize', branchType: 'primary' },
//         { source: 'synthesize', target: 'validate', branchType: 'primary' },
//         { source: 'analyze', target: 'alt-approach', branchType: 'alternative' },
//         { source: 'alt-approach', target: 'synthesize', branchType: 'alternative' }
//       ]
//     }
//   ];

export {};