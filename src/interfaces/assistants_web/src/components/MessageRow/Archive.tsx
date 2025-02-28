// // // PlanFlowDiagram.tsx
// // 'use client';

// // import { useCallback, useEffect } from 'react';
// // import {
// //   ReactFlow,
// //   Node,
// //   Edge,
// //   Controls,
// //   Background,
// //   MiniMap,
// //   NodeTypes,
// //   useNodesState,
// //   useEdgesState,
// //   MarkerType,
// //   addEdge,
// //   type OnConnect,
// //   BackgroundVariant,
// // } from '@xyflow/react';
// // import '@xyflow/react/dist/style.css';
// // import { Modal } from '@/components/UI';
// // import { initialEdges, edgeTypes } from "../edges";
// // import { StreamToolCallsGeneration } from '@/cohere-client';

// // // import { initialNodes, nodeTypes } from "../nodes";

// // // const [nodes, , onNodesChange] = useNodesState(initialNodes);
// // // const [edges, setEdges, onEdgesChange]: [
// // //     Edge[],
// // //     React.Dispatch<React.SetStateAction<Edge[]>>,
// // //     (changes: any) => void
// // //   ] = useEdgesState<Edge>(initialEdges);

// // // Type definitions for tool calls and search results
// // type ToolCallParameters = {
// //   query?: string;
// //   code?: string;
// //   [key: string]: any;
// // };

// // type ToolCall = {
// //   name?: string;
// //   parameters?: ToolCallParameters;
// // };

// // type SearchResult = {
// //   title?: string;
// //   url?: string;
// //   // Add other properties as needed
// // };

// // type SearchResults = {
// //     search_results?: {
// //       documents?: SearchResult[];
// //     } | null; // Explicitly allow null or undefined
// //   };

// // // type StreamToolCallsGeneration = {
// // //   text?: string;
// // //   tool_calls?: ToolCall[];
// // //   stream_search_results?: SearchResults;
// // // };

// // // Custom node component with proper typing
// // type PlanStepNodeData = {
// //   icon: React.ComponentType<any>;
// //   title?: string;
// //   content: string;
// // };

// // const PlanStepNode = ({ data }: { data: PlanStepNodeData }) => {
// //   return (
// //     <div className="rounded-md border border-mushroom-700 bg-mushroom-950 p-3 shadow-md dark:border-volcanic-300 dark:bg-volcanic-200">
// //       <div className="flex items-start gap-2">
// //         {data.icon && (
// //           <span className="flex h-6 w-6 items-center justify-center">
// //             <data.icon className="h-5 w-5 text-mushroom-300 dark:text-marble-800" />
// //           </span>
// //         )}
// //         <div className="flex flex-col">
// //           {data.title && (
// //             <div className="text-sm font-medium text-mushroom-200 dark:text-marble-900">
// //               {data.title}
// //             </div>
// //           )}
// //           <div className="text-xs text-mushroom-300 dark:text-marble-800">{data.content}</div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const nodeTypes: NodeTypes = {
// //   planStep: PlanStepNode,
// // };

// // type PlanFlowDiagramProps = {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   events: StreamToolCallsGeneration[] | undefined;
// // };

// // const PlanFlowDiagram: React.FC<PlanFlowDiagramProps> = ({ isOpen, onClose, events }) => {
// //   // Fix the typing - use Node<PlanStepNodeData> instead of Node[]
// //   const [nodes, setNodes, onNodesChange] = useNodesState<Node<PlanStepNodeData>>([]);
// //   const [edges, setEdges, onEdgesChange]: [
// //     Edge[],
// //     React.Dispatch<React.SetStateAction<Edge[]>>,
// //     (changes: any) => void
// //   ] = useEdgesState<Edge>(initialEdges);
// //   const onConnect: OnConnect = useCallback(
// //     (connection) => setEdges((edges) => addEdge(connection, edges)),
// //     [setEdges]
// //   );

// //   // Icon mapping function with proper typing
// //   type IconMap = {
// //     [key: string]: () => JSX.Element;
// //   };

// //   const getIconComponent = (toolName: string) => {
// //     const iconMap: IconMap = {
// //       list: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <line x1="8" y1="6" x2="21" y2="6"></line>
// //           <line x1="8" y1="12" x2="21" y2="12"></line>
// //           <line x1="8" y1="18" x2="21" y2="18"></line>
// //           <line x1="3" y1="6" x2="3.01" y2="6"></line>
// //           <line x1="3" y1="12" x2="3.01" y2="12"></line>
// //           <line x1="3" y1="18" x2="3.01" y2="18"></line>
// //         </svg>
// //       ),
// //       'book-open-text': () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
// //           <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
// //           <path d="M6 8h2"></path>
// //           <path d="M6 12h2"></path>
// //           <path d="M16 8h2"></path>
// //           <path d="M16 12h2"></path>
// //         </svg>
// //       ),
// //       calculator: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <rect x="4" y="2" width="16" height="20" rx="2"></rect>
// //           <line x1="8" y1="6" x2="16" y2="6"></line>
// //           <line x1="16" y1="14" x2="16" y2="18"></line>
// //           <path d="M8 10h.01"></path>
// //           <path d="M12 10h.01"></path>
// //           <path d="M16 10h.01"></path>
// //           <path d="M8 14h.01"></path>
// //           <path d="M12 14h.01"></path>
// //           <path d="M8 18h.01"></path>
// //           <path d="M12 18h.01"></path>
// //         </svg>
// //       ),
// //       search: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <circle cx="11" cy="11" r="8"></circle>
// //           <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
// //         </svg>
// //       ),
// //       code: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <polyline points="16 18 22 12 16 6"></polyline>
// //           <polyline points="8 6 2 12 8 18"></polyline>
// //         </svg>
// //       ),
// //     };

// //     return iconMap[toolName] || iconMap.list;
// //   };

// //   // Initialize diagram from plan and events
// //   const initializeDiagram = useCallback(() => {
// //     if (!events || events.length === 0) return;

// //     const diagramNodes: Node<PlanStepNodeData>[] = [];
// //     const diagramEdges: Edge[] = [];
// //     let nodeId = 0;

// //     events.forEach((event) => {
// //       // Add plan text if available
// //       if (event.text) {
// //         const id = `node-${nodeId++}`;
// //         diagramNodes.push({
// //           id,
// //           type: 'planStep',
// //           position: { x: 250, y: nodeId * 120 },
// //           data: {
// //             content: event.text,
// //             title: 'Plan',
// //             icon: getIconComponent('list'),
// //           },
// //         });

// //         // Connect to previous node
// //         if (nodeId > 1) {
// //           diagramEdges.push({
// //             id: `edge-${nodeId - 2}-${nodeId - 1}`,
// //             source: `node-${nodeId - 2}`,
// //             target: id,
// //             type: 'smoothstep',
// //             markerEnd: { type: MarkerType.ArrowClosed },
// //           });
// //         }
// //       }

// //       // Add tool calls
// //       event.tool_calls?.forEach((toolCall) => {
// //         const id = `node-${nodeId++}`;
// //         const toolName = toolCall.name || '';
// //         const iconName = toolName.includes('search')
// //           ? 'search'
// //           : toolName.includes('calculator')
// //           ? 'calculator'
// //           : toolName.includes('python')
// //           ? 'code'
// //           : 'list';

// //         let content = `Using ${toolName}`;
        
// //         if (toolCall.parameters?.query) {
// //           content = `Searching for "${toolCall.parameters.query}"`;
// //         } else if (toolCall.parameters?.code) {
// //           content = `Executing code`;
// //         }

// //         diagramNodes.push({
// //           id,
// //           type: 'planStep',
// //           position: { x: 250, y: nodeId * 120 },
// //           data: {
// //             content,
// //             title: toolName,
// //             icon: getIconComponent(iconName),
// //           },
// //         });

// //         // Connect to previous node
// //         if (nodeId > 1) {
// //           diagramEdges.push({
// //             id: `edge-${nodeId - 2}-${nodeId - 1}`,
// //             source: `node-${nodeId - 2}`,
// //             target: id,
// //             type: 'smoothstep',
// //             markerEnd: { type: MarkerType.ArrowClosed },
// //           });
// //         }
// //       });

// //       // Add search results with proper type checking
// //     //   if (event.stream_search_results?.search_results?.documents?.length) {
// //     //     const id = `node-${nodeId++}`;
// //     //     const documents = event.stream_search_results.search_results.documents;
// //     //     const docTitles = documents
// //     //       .map((doc) => doc.title || doc.url || '')
// //     //       .filter(Boolean)
// //     //       .slice(0, 3);
// //     if (
// //         event.stream_search_results?.search_results &&
// //         typeof event.stream_search_results.search_results === 'object' && // Ensure it's not an array
// //         'documents' in event.stream_search_results.search_results &&
// //         Array.isArray(event.stream_search_results.search_results.documents)
// //       ) {
// //         const documents: SearchResult[] = event.stream_search_results.search_results.documents;
      
// //         const docTitles = documents
// //           .map((doc) => doc.title || doc.url || '')
// //           .filter(Boolean)
// //           .slice(0, 3);
      
// //         const id = `node-${nodeId++}`;
// //         diagramNodes.push({
// //           id,
// //           type: 'planStep',
// //           position: { x: 250, y: nodeId * 120 },
// //           data: {
// //             content:
// //               docTitles.length > 0
// //                 ? `Found resources: ${docTitles.join(', ')}${
// //                     documents.length > 3 ? ` and ${documents.length - 3} more` : ''
// //                   }`
// //                 : 'No resources found',
// //             title: 'Search Results',
// //             icon: getIconComponent('book-open-text'),
// //           },
// //         });

// //         // Connect to previous node
// //         if (nodeId > 1) {
// //           diagramEdges.push({
// //             id: `edge-${nodeId - 2}-${nodeId - 1}`,
// //             source: `node-${nodeId - 2}`,
// //             target: id,
// //             type: 'smoothstep',
// //             markerEnd: { type: MarkerType.ArrowClosed },
// //           });
// //         }
// //       }
// //     });

// //     // Add final response node
// //     diagramNodes.push({
// //       id: `node-${nodeId}`,
// //       type: 'planStep',
// //       position: { x: 250, y: nodeId * 120 + 120 },
// //       data: {
// //         content: 'Generate final response based on collected information',
// //         title: 'Final Response',
// //         icon: getIconComponent('list'),
// //       },
// //       style: {
// //         borderColor: 'rgb(34, 197, 94)',
// //         borderWidth: '2px',
// //       },
// //     });

// //     // Connect to previous node
// //     if (nodeId > 0) {
// //       diagramEdges.push({
// //         id: `edge-${nodeId - 1}-${nodeId}`,
// //         source: `node-${nodeId - 1}`,
// //         target: `node-${nodeId}`,
// //         type: 'smoothstep',
// //         markerEnd: { type: MarkerType.ArrowClosed },
// //       });
// //     }

// //     setNodes(diagramNodes);
// //     setEdges(diagramEdges);
// //   }, [events, setNodes, setEdges]);

// //   // Add onConnect handler for interactivity

// //   useEffect(() => {
// //     if (isOpen) {
// //       initializeDiagram();
// //     }
// //   }, [isOpen, initializeDiagram]);

// //   return (
// //     <Modal
// //       title="Plan Flow Diagram"
// //       isOpen={isOpen}
// //       onClose={onClose}
// //     >
// //       <div className="h-full w-full">
// //         <ReactFlow
// //           nodes={nodes}
// //           edges={edges}
// //           onNodesChange={onNodesChange}
// //           onEdgesChange={onEdgesChange}
// //           onConnect={onConnect}
// //           nodeTypes={nodeTypes}
// //           fitView
// //           attributionPosition="bottom-right"
// //         >
// //           <Controls />
// //           <MiniMap />
// //           <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
// //         </ReactFlow>
// //       </div>
// //     </Modal>
// //   );
// // };

// // export default PlanFlowDiagram;

// //////// EOL





// // 'use client';

// // import { useCallback, useEffect, useState } from 'react';
// // import {
// //   ReactFlow,
// //   Node,
// //   Edge,
// //   Controls,
// //   Background,
// //   MiniMap,
// //   NodeTypes,
// //   useNodesState,
// //   useEdgesState,
// //   MarkerType,
// //   addEdge,
// //   type OnConnect,
// //   BackgroundVariant,
// // } from '@xyflow/react';
// // import '@xyflow/react/dist/style.css';
// // import { Modal } from '@/components/UI';
// // import { initialEdges, edgeTypes } from "../edges";
// // import { StreamToolCallsGeneration } from '@/cohere-client';

// // // Type definitions for tool calls and search results
// // type ToolCallParameters = {
// //   query?: string;
// //   code?: string;
// //   [key: string]: any;
// // };

// // type ToolCall = {
// //   name?: string;
// //   parameters?: ToolCallParameters;
// // };

// // type SearchResult = {
// //   title?: string;
// //   url?: string;
// //   [key: string]: any;
// // };

// // // Updated type definition to handle possible array or object structure
// // type SearchResults = {
// //   search_results?: {
// //     documents?: SearchResult[] | { [key: string]: any }[];
// //   } | null;
// // };

// // // Custom node component with proper typing
// // type PlanStepNodeData = {
// //   icon: React.ComponentType<any>;
// //   title?: string;
// //   content: string;
// // };

// // const PlanStepNode = ({ data }: { data: PlanStepNodeData }) => {
// //   return (
// //     <div className="rounded-md border border-mushroom-700 bg-mushroom-950 p-3 shadow-md dark:border-volcanic-300 dark:bg-volcanic-200">
// //       <div className="flex items-start gap-2">
// //         {data.icon && (
// //           <span className="flex h-6 w-6 items-center justify-center">
// //             <data.icon className="h-5 w-5 text-mushroom-300 dark:text-marble-800" />
// //           </span>
// //         )}
// //         <div className="flex flex-col">
// //           {data.title && (
// //             <div className="text-sm font-medium text-mushroom-200 dark:text-marble-900">
// //               {data.title}
// //             </div>
// //           )}
// //           <div className="text-xs text-mushroom-300 dark:text-marble-800">{data.content}</div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const nodeTypes: NodeTypes = {
// //   planStep: PlanStepNode,
// // };

// // type PlanFlowDiagramProps = {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   events: StreamToolCallsGeneration[] | undefined;
// // };

// // const PlanFlowDiagram: React.FC<PlanFlowDiagramProps> = ({ isOpen, onClose, events }) => {
// //   // Fix the typing - use Node<PlanStepNodeData> instead of Node[]
// //   const [nodes, setNodes, onNodesChange] = useNodesState<Node<PlanStepNodeData>>([]);
// //   const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
// //   const [loaded, setLoaded] = useState(false);

// //   const onConnect: OnConnect = useCallback(
// //     (connection) => setEdges((edges) => addEdge(connection, edges)),
// //     [setEdges]
// //   );

// //   // Icon mapping function with proper typing
// //   type IconMap = {
// //     [key: string]: () => JSX.Element;
// //   };

// //   const getIconComponent = (toolName: string) => {
// //     const iconMap: IconMap = {
// //       list: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <line x1="8" y1="6" x2="21" y2="6"></line>
// //           <line x1="8" y1="12" x2="21" y2="12"></line>
// //           <line x1="8" y1="18" x2="21" y2="18"></line>
// //           <line x1="3" y1="6" x2="3.01" y2="6"></line>
// //           <line x1="3" y1="12" x2="3.01" y2="12"></line>
// //           <line x1="3" y1="18" x2="3.01" y2="18"></line>
// //         </svg>
// //       ),
// //       'book-open-text': () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
// //           <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
// //           <path d="M6 8h2"></path>
// //           <path d="M6 12h2"></path>
// //           <path d="M16 8h2"></path>
// //           <path d="M16 12h2"></path>
// //         </svg>
// //       ),
// //       calculator: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <rect x="4" y="2" width="16" height="20" rx="2"></rect>
// //           <line x1="8" y1="6" x2="16" y2="6"></line>
// //           <line x1="16" y1="14" x2="16" y2="18"></line>
// //           <path d="M8 10h.01"></path>
// //           <path d="M12 10h.01"></path>
// //           <path d="M16 10h.01"></path>
// //           <path d="M8 14h.01"></path>
// //           <path d="M12 14h.01"></path>
// //           <path d="M8 18h.01"></path>
// //           <path d="M12 18h.01"></path>
// //         </svg>
// //       ),
// //       search: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <circle cx="11" cy="11" r="8"></circle>
// //           <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
// //         </svg>
// //       ),
// //       code: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <polyline points="16 18 22 12 16 6"></polyline>
// //           <polyline points="8 6 2 12 8 18"></polyline>
// //         </svg>
// //       ),
// //     };

// //     return iconMap[toolName] || iconMap.list;
// //   };

// //   // Helper function to safely extract document information
// //   const extractDocumentInfo = (doc: any): { title?: string; url?: string } => {
// //     // Handle both SearchResult type and generic object
// //     if (doc) {
// //       return {
// //         title: typeof doc.title === 'string' ? doc.title : undefined,
// //         url: typeof doc.url === 'string' ? doc.url : undefined
// //       };
// //     }
// //     return {};
// //   };

// //   // Initialize diagram from plan and events
// //   const initializeDiagram = useCallback(() => {
// //     if (!events || events.length === 0) {
// //       console.log("No events to display");
// //       return;
// //     }

// //     console.log("Initializing diagram with events:", events);

// //     const diagramNodes: Node<PlanStepNodeData>[] = [];
// //     const diagramEdges: Edge[] = [];
// //     let nodeId = 0;
    
// //     // Starting x,y position for nodes
// //     const startX = 250;
// //     const startY = 100;
// //     const ySpacing = 120;

// //     events.forEach((event, index) => {
// //       console.log(`Processing event ${index}:`, event);
      
// //       // Add plan text if available
// //       if (event.text && event.text.trim() !== '') {
// //         const id = `node-${nodeId}`;
// //         diagramNodes.push({
// //           id,
// //           type: 'planStep',
// //           position: { x: startX, y: startY + nodeId * ySpacing },
// //           data: {
// //             content: event.text,
// //             title: 'Plan',
// //             icon: getIconComponent('list'),
// //           },
// //         });

// //         // Connect to previous node
// //         if (nodeId > 0) {
// //           diagramEdges.push({
// //             id: `edge-${nodeId-1}-${nodeId}`,
// //             source: `node-${nodeId-1}`,
// //             target: id,
// //             type: 'smoothstep',
// //             markerEnd: { type: MarkerType.ArrowClosed },
// //           });
// //         }
        
// //         nodeId++;
// //       }

// //       // Add tool calls
// //       if (event.tool_calls && Array.isArray(event.tool_calls)) {
// //         event.tool_calls.forEach((toolCall) => {
// //           const id = `node-${nodeId}`;
// //           const toolName = toolCall.name || 'Unknown Tool';
// //           const iconName = 
// //             toolName.includes('search') ? 'search' :
// //             toolName.includes('calculator') ? 'calculator' :
// //             toolName.includes('python') || toolName.includes('code') ? 'code' : 
// //             'list';

// //           let content = `Using ${toolName}`;
          
// //           if (toolCall.parameters) {
// //             if (toolCall.parameters.query) {
// //               content = `Searching for "${toolCall.parameters.query}"`;
// //             } else if (toolCall.parameters.code) {
// //               content = `Executing code`;
// //             }
// //           }

// //           diagramNodes.push({
// //             id,
// //             type: 'planStep',
// //             position: { x: startX, y: startY + nodeId * ySpacing },
// //             data: {
// //               content,
// //               title: toolName,
// //               icon: getIconComponent(iconName),
// //             },
// //           });

// //           // Connect to previous node
// //           if (nodeId > 0) {
// //             diagramEdges.push({
// //               id: `edge-${nodeId-1}-${nodeId}`,
// //               source: `node-${nodeId-1}`,
// //               target: id,
// //               type: 'smoothstep',
// //               markerEnd: { type: MarkerType.ArrowClosed },
// //             });
// //           }
          
// //           nodeId++;
// //         });
// //       }

// //       // Add search results - more defensive approach
// //       if (event.stream_search_results?.search_results) {
// //         const searchResults = event.stream_search_results.search_results;
        
// //         let documents: any[] = [];
        
// //         // Handle different possible structures for documents
// //         if ('documents' in searchResults && searchResults.documents) {
// //           documents = Array.isArray(searchResults.documents) ? searchResults.documents : [];
// //         }
        
// //         if (documents.length > 0) {
// //           // Extract title or URL safely from each document
// //           const docInfo = documents
// //             .map(doc => extractDocumentInfo(doc))
// //             .filter(info => info.title || info.url);
            
// //           const docTitles = docInfo
// //             .map(info => info.title || info.url || '')
// //             .filter(Boolean)
// //             .slice(0, 3);
          
// //           if (docTitles.length > 0) {
// //             const id = `node-${nodeId}`;
// //             diagramNodes.push({
// //               id,
// //               type: 'planStep',
// //               position: { x: startX, y: startY + nodeId * ySpacing },
// //               data: {
// //                 content: `Found resources: ${docTitles.join(', ')}${
// //                   documents.length > 3 ? ` and ${documents.length - 3} more` : ''
// //                 }`,
// //                 title: 'Search Results',
// //                 icon: getIconComponent('book-open-text'),
// //               },
// //             });

// //             // Connect to previous node
// //             if (nodeId > 0) {
// //               diagramEdges.push({
// //                 id: `edge-${nodeId-1}-${nodeId}`,
// //                 source: `node-${nodeId-1}`,
// //                 target: id,
// //                 type: 'smoothstep',
// //                 markerEnd: { type: MarkerType.ArrowClosed },
// //               });
// //             }
            
// //             nodeId++;
// //           }
// //         }
// //       }
// //     });

// //     // Only add final response node if we have at least one other node
// //     if (nodeId > 0) {
// //       // Add final response node
// //       const finalId = `node-${nodeId}`;
// //       diagramNodes.push({
// //         id: finalId,
// //         type: 'planStep',
// //         position: { x: startX, y: startY + nodeId * ySpacing },
// //         data: {
// //           content: 'Generate final response based on collected information',
// //           title: 'Final Response',
// //           icon: getIconComponent('list'),
// //         },
// //         style: {
// //           borderColor: 'rgb(34, 197, 94)',
// //           borderWidth: '2px',
// //         },
// //       });

// //       // Connect to previous node
// //       diagramEdges.push({
// //         id: `edge-${nodeId-1}-${nodeId}`,
// //         source: `node-${nodeId-1}`,
// //         target: finalId,
// //         type: 'smoothstep',
// //         markerEnd: { type: MarkerType.ArrowClosed },
// //       });
// //     }

// //     console.log("Created nodes:", diagramNodes);
// //     console.log("Created edges:", diagramEdges);
    
// //     setNodes(diagramNodes);
// //     setEdges(diagramEdges);
// //     setLoaded(true);
    
// //   }, [events, setNodes, setEdges]);

// //   useEffect(() => {
// //     if (isOpen && events) {
// //       console.log("Modal is open, initializing diagram");
// //       initializeDiagram();
// //     }
// //   }, [isOpen, events, initializeDiagram]);

// //   return (
// //     <Modal
// //       title="Plan Flow Diagram"
// //       isOpen={isOpen}
// //       onClose={onClose}
// //     >
// //       <div className="h-full w-full" style={{ minHeight: "500px" }}>
// //         {!loaded && events && events.length > 0 ? (
// //           <div className="flex h-full items-center justify-center">
// //             <p>Loading diagram...</p>
// //           </div>
// //         ) : nodes.length === 0 ? (
// //           <div className="flex h-full items-center justify-center">
// //             <p>No plan steps available to display</p>
// //           </div>
// //         ) : (
// //           <ReactFlow
// //             nodes={nodes}
// //             edges={edges}
// //             onNodesChange={onNodesChange}
// //             onEdgesChange={onEdgesChange}
// //             onConnect={onConnect}
// //             nodeTypes={nodeTypes}
// //             fitView
// //             attributionPosition="bottom-right"
// //           >
// //             <Controls />
// //             <MiniMap />
// //             <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
// //           </ReactFlow>
// //         )}
// //       </div>
// //     </Modal>
// //   );
// // };

// // export default PlanFlowDiagram;

// /// ANOTHER ONE

// // 'use client';

// // import { useCallback, useEffect, useState } from 'react';
// // import {
// //   ReactFlow,
// //   Node,
// //   Edge,
// //   Controls,
// //   Background,
// //   MiniMap,
// //   NodeTypes,
// //   useNodesState,
// //   useEdgesState,
// //   MarkerType,
// //   addEdge,
// //   type OnConnect,
// //   BackgroundVariant,
// // } from '@xyflow/react';
// // import '@xyflow/react/dist/style.css';
// // import { Modal } from '@/components/UI';
// // import { initialEdges, edgeTypes } from "../edges";
// // import { StreamToolCallsGeneration } from '@/cohere-client';

// // // Type definitions for tool calls and search results
// // type ToolCallParameters = {
// //   query?: string;
// //   code?: string;
// //   [key: string]: any;
// // };

// // type ToolCall = {
// //   name?: string;
// //   parameters?: ToolCallParameters;
// // };

// // type SearchResult = {
// //   title?: string;
// //   url?: string;
// //   // Add other properties as needed
// // };

// // type SearchResults = {
// //   search_results?: {
// //     documents?: SearchResult[];
// //   } | null; // Explicitly allow null or undefined
// // };

// // // Custom node component with proper typing
// // type PlanStepNodeData = {
// //   icon: React.ComponentType<any>;
// //   title?: string;
// //   content: string;
// // };

// // const PlanStepNode = ({ data }: { data: PlanStepNodeData }) => {
// //   return (
// //     <div className="rounded-md border border-mushroom-700 bg-mushroom-950 p-3 shadow-md dark:border-volcanic-300 dark:bg-volcanic-200">
// //       <div className="flex items-start gap-2">
// //         {data.icon && (
// //           <span className="flex h-6 w-6 items-center justify-center">
// //             <data.icon className="h-5 w-5 text-mushroom-300 dark:text-marble-800" />
// //           </span>
// //         )}
// //         <div className="flex flex-col">
// //           {data.title && (
// //             <div className="text-sm font-medium text-mushroom-200 dark:text-marble-900">
// //               {data.title}
// //             </div>
// //           )}
// //           <div className="text-xs text-mushroom-300 dark:text-marble-800">{data.content}</div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const nodeTypes: NodeTypes = {
// //   planStep: PlanStepNode,
// // };

// // type PlanFlowDiagramProps = {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   events: StreamToolCallsGeneration[] | undefined;
// // };

// // const PlanFlowDiagram: React.FC<PlanFlowDiagramProps> = ({ isOpen, onClose, events }) => {
// //   // Fix the typing - use Node<PlanStepNodeData> instead of Node[]
// //   const [nodes, setNodes, onNodesChange] = useNodesState<Node<PlanStepNodeData>>([]);
// //   const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
// //   const [loaded, setLoaded] = useState(false);
  
// //   const onConnect: OnConnect = useCallback(
// //     (connection) => setEdges((eds) => addEdge(connection, eds)),
// //     [setEdges]
// //   );

// //   // Icon mapping function with proper typing
// //   type IconMap = {
// //     [key: string]: () => JSX.Element;
// //   };

// //   const getIconComponent = (toolName: string) => {
// //     const iconMap: IconMap = {
// //       list: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <line x1="8" y1="6" x2="21" y2="6"></line>
// //           <line x1="8" y1="12" x2="21" y2="12"></line>
// //           <line x1="8" y1="18" x2="21" y2="18"></line>
// //           <line x1="3" y1="6" x2="3.01" y2="6"></line>
// //           <line x1="3" y1="12" x2="3.01" y2="12"></line>
// //           <line x1="3" y1="18" x2="3.01" y2="18"></line>
// //         </svg>
// //       ),
// //       'book-open-text': () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
// //           <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
// //           <path d="M6 8h2"></path>
// //           <path d="M6 12h2"></path>
// //           <path d="M16 8h2"></path>
// //           <path d="M16 12h2"></path>
// //         </svg>
// //       ),
// //       calculator: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <rect x="4" y="2" width="16" height="20" rx="2"></rect>
// //           <line x1="8" y1="6" x2="16" y2="6"></line>
// //           <line x1="16" y1="14" x2="16" y2="18"></line>
// //           <path d="M8 10h.01"></path>
// //           <path d="M12 10h.01"></path>
// //           <path d="M16 10h.01"></path>
// //           <path d="M8 14h.01"></path>
// //           <path d="M12 14h.01"></path>
// //           <path d="M8 18h.01"></path>
// //           <path d="M12 18h.01"></path>
// //         </svg>
// //       ),
// //       search: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <circle cx="11" cy="11" r="8"></circle>
// //           <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
// //         </svg>
// //       ),
// //       code: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <polyline points="16 18 22 12 16 6"></polyline>
// //           <polyline points="8 6 2 12 8 18"></polyline>
// //         </svg>
// //       ),
// //     };

// //     return iconMap[toolName] || iconMap.list;
// //   };

// //   // Helper function to safely extract document information
// //   const extractDocumentInfo = (doc: any): { title?: string; url?: string } => {
// //     if (doc) {
// //       return {
// //         title: typeof doc.title === 'string' ? doc.title : undefined,
// //         url: typeof doc.url === 'string' ? doc.url : undefined
// //       };
// //     }
// //     return {};
// //   };

// //   // Initialize diagram from plan and events
// //   const initializeDiagram = useCallback(() => {
// //     if (!events || events.length === 0) {
// //       setLoaded(true);
// //       return;
// //     }

// //     const diagramNodes: Node<PlanStepNodeData>[] = [];
// //     const diagramEdges: Edge[] = [];
// //     let nodeId = 0;
    
// //     // Starting x,y position for nodes
// //     const startX = 250;
// //     const startY = 100;
// //     const ySpacing = 120;

// //     events.forEach((event, index) => {
// //       // Add plan text if available
// //       if (event.text && event.text.trim() !== '') {
// //         const id = `node-${nodeId}`;
// //         diagramNodes.push({
// //           id,
// //           type: 'planStep',
// //           position: { x: startX, y: startY + nodeId * ySpacing },
// //           data: {
// //             content: event.text,
// //             title: 'Plan',
// //             icon: getIconComponent('list'),
// //           },
// //         });

// //         // Connect to previous node
// //         if (nodeId > 0) {
// //           diagramEdges.push({
// //             id: `edge-${nodeId-1}-${nodeId}`,
// //             source: `node-${nodeId-1}`,
// //             target: id,
// //             type: 'smoothstep',
// //             markerEnd: { type: MarkerType.ArrowClosed },
// //           });
// //         }
        
// //         nodeId++;
// //       }

// //       // Add tool calls
// //       if (event.tool_calls && Array.isArray(event.tool_calls)) {
// //         event.tool_calls.forEach((toolCall) => {
// //           const id = `node-${nodeId}`;
// //           const toolName = toolCall.name || 'Unknown Tool';
// //           const iconName = 
// //             toolName.includes('search') ? 'search' :
// //             toolName.includes('calculator') ? 'calculator' :
// //             toolName.includes('python') || toolName.includes('code') ? 'code' : 
// //             'list';

// //           let content = `Using ${toolName}`;
          
// //           if (toolCall.parameters) {
// //             if (toolCall.parameters.query) {
// //               content = `Searching for "${toolCall.parameters.query}"`;
// //             } else if (toolCall.parameters.code) {
// //               content = `Executing code`;
// //             }
// //           }

// //           diagramNodes.push({
// //             id,
// //             type: 'planStep',
// //             position: { x: startX, y: startY + nodeId * ySpacing },
// //             data: {
// //               content,
// //               title: toolName,
// //               icon: getIconComponent(iconName),
// //             },
// //           });

// //           // Connect to previous node
// //           if (nodeId > 0) {
// //             diagramEdges.push({
// //               id: `edge-${nodeId-1}-${nodeId}`,
// //               source: `node-${nodeId-1}`,
// //               target: id,
// //               type: 'smoothstep',
// //               markerEnd: { type: MarkerType.ArrowClosed },
// //             });
// //           }
          
// //           nodeId++;
// //         });
// //       }

// //       // Add search results with safer type checking
// //       if (
// //         event.stream_search_results?.search_results &&
// //         typeof event.stream_search_results.search_results === 'object' &&
// //         'documents' in event.stream_search_results.search_results &&
// //         Array.isArray(event.stream_search_results.search_results.documents)
// //       ) {
// //         const documents: SearchResult[] = event.stream_search_results.search_results.documents;
        
// //         // Extract title or URL safely from each document
// //         const docInfo = documents
// //           .map(doc => extractDocumentInfo(doc))
// //           .filter(info => info.title || info.url);
          
// //         const docTitles = docInfo
// //           .map(info => info.title || info.url || '')
// //           .filter(Boolean)
// //           .slice(0, 3);
        
// //         if (docTitles.length > 0) {
// //           const id = `node-${nodeId}`;
// //           diagramNodes.push({
// //             id,
// //             type: 'planStep',
// //             position: { x: startX, y: startY + nodeId * ySpacing },
// //             data: {
// //               content: `Found resources: ${docTitles.join(', ')}${
// //                 documents.length > 3 ? ` and ${documents.length - 3} more` : ''
// //               }`,
// //               title: 'Search Results',
// //               icon: getIconComponent('book-open-text'),
// //             },
// //           });

// //           // Connect to previous node
// //           if (nodeId > 0) {
// //             diagramEdges.push({
// //               id: `edge-${nodeId-1}-${nodeId}`,
// //               source: `node-${nodeId-1}`,
// //               target: id,
// //               type: 'smoothstep',
// //               markerEnd: { type: MarkerType.ArrowClosed },
// //             });
// //           }
          
// //           nodeId++;
// //         }
// //       }
// //     });

// //     // Only add final response node if we have at least one other node
// //     if (nodeId > 0) {
// //       // Add final response node
// //       const finalId = `node-${nodeId}`;
// //       diagramNodes.push({
// //         id: finalId,
// //         type: 'planStep',
// //         position: { x: startX, y: startY + nodeId * ySpacing },
// //         data: {
// //           content: 'Generate final response based on collected information',
// //           title: 'Final Response',
// //           icon: getIconComponent('list'),
// //         },
// //         style: {
// //           borderColor: 'rgb(34, 197, 94)',
// //           borderWidth: '2px',
// //         },
// //       });

// //       // Connect to previous node
// //       diagramEdges.push({
// //         id: `edge-${nodeId-1}-${nodeId}`,
// //         source: `node-${nodeId-1}`,
// //         target: finalId,
// //         type: 'smoothstep',
// //         markerEnd: { type: MarkerType.ArrowClosed },
// //       });
// //     }
    
// //     // Set nodes first, then edges after a small delay to ensure nodes are mounted
// //     setNodes(diagramNodes);
    
// //     // Use a slight delay before setting edges to ensure nodes are properly mounted
// //     setTimeout(() => {
// //       setEdges(diagramEdges);
// //       setLoaded(true);
// //     }, 50);
    
// //   }, [events, setNodes, setEdges]);

// //   // Reset and initialize when modal opens
// //   useEffect(() => {
// //     if (isOpen) {
// //       // Reset states when modal opens
// //       setNodes([]);
// //       setEdges([]);
// //       setLoaded(false);
      
// //       // Use timeout to ensure modal DOM is fully rendered before initializing
// //       const timer = setTimeout(() => {
// //         initializeDiagram();
// //       }, 100);
      
// //       return () => clearTimeout(timer);
// //     }
// //   }, [isOpen, initializeDiagram, setNodes, setEdges]);

// //   return (
// //     <Modal
// //       title="Plan Flow Diagram"
// //       isOpen={isOpen}
// //       onClose={onClose}
// //     >
// //       <div 
// //         className="w-full" 
// //         style={{ height: "500px" }} // Explicit height is crucial for React Flow
// //       >
// //         {!loaded ? (
// //           <div className="flex h-full items-center justify-center">
// //             <p>Loading diagram...</p>
// //           </div>
// //         ) : nodes.length === 0 ? (
// //           <div className="flex h-full items-center justify-center">
// //             <p>No plan steps available to display</p>
// //           </div>
// //         ) : (
// //           <ReactFlow
// //             nodes={nodes}
// //             edges={edges}
// //             onNodesChange={onNodesChange}
// //             onEdgesChange={onEdgesChange}
// //             onConnect={onConnect}
// //             nodeTypes={nodeTypes}
// //             fitView
// //             attributionPosition="bottom-right"
// //             style={{ width: '100%', height: '100%' }} // Explicit dimensions
// //           >
// //             <Controls />
// //             <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
// //           </ReactFlow>
// //         )}
// //       </div>
// //     </Modal>
// //   );
// // };

// // export default PlanFlowDiagram;

// /// SHIT

// // 'use client';

// // import { useCallback, useEffect, useState } from 'react';
// // import {
// //   ReactFlow,
// //   Node,
// //   Edge,
// //   Controls,
// //   Background,
// //   NodeTypes,
// //   useNodesState,
// //   useEdgesState,
// //   MarkerType,
// //   addEdge,
// //   type OnConnect,
// //   BackgroundVariant,
// //   Handle,
// //   Position,
// //   ReactFlowProvider,
// // } from '@xyflow/react';
// // import '@xyflow/react/dist/style.css';
// // import { Modal } from '@/components/UI';
// // import { initialEdges, edgeTypes } from "../edges";
// // import { StreamToolCallsGeneration } from '@/cohere-client';

// // // Type definitions for tool calls and search results
// // type ToolCallParameters = {
// //   query?: string;
// //   code?: string;
// //   [key: string]: any;
// // };

// // type ToolCall = {
// //   name?: string;
// //   parameters?: ToolCallParameters;
// // };

// // type SearchResult = {
// //   title?: string;
// //   url?: string;
// // };

// // type SearchResults = {
// //   search_results?: {
// //     documents?: SearchResult[];
// //   } | null;
// // };

// // // Custom node component with proper typing and explicit handles
// // type PlanStepNodeData = {
// //   icon: React.ComponentType<any>;
// //   title?: string;
// //   content: string;
// // };

// // // Node with explicit handles for better connection control
// // const PlanStepNode = ({ id, data, selected }: { id: string; data: PlanStepNodeData; selected?: boolean }) => {
// //   return (
// //     <div className={`rounded-md border ${selected ? 'border-green-500 dark:border-green-400' : 'border-mushroom-700 dark:border-volcanic-300'} bg-mushroom-950 p-3 shadow-md dark:bg-volcanic-200 ${selected ? 'ring-2 ring-green-500 dark:ring-green-400' : ''}`}>
// //       {/* Explicit source handle at bottom */}
// //       <Handle
// //         type="source"
// //         position={Position.Bottom}
// //         id={`${id}-source`}
// //         style={{ background: '#555', width: '8px', height: '8px' }}
// //       />
      
// //       {/* Explicit target handle at top */}
// //       <Handle
// //         type="target"
// //         position={Position.Top}
// //         id={`${id}-target`}
// //         style={{ background: '#555', width: '8px', height: '8px' }}
// //       />
      
// //       <div className="flex items-start gap-2">
// //         {data.icon && (
// //           <span className="flex h-6 w-6 items-center justify-center">
// //             <data.icon className={`h-5 w-5 ${selected ? 'text-green-500 dark:text-green-400' : 'text-mushroom-300 dark:text-marble-800'}`} />
// //           </span>
// //         )}
// //         <div className="flex flex-col">
// //           {data.title && (
// //             <div className={`text-sm font-medium ${selected ? 'text-green-500 dark:text-green-400' : 'text-mushroom-200 dark:text-marble-900'}`}>
// //               {data.title}
// //             </div>
// //           )}
// //           <div className="text-xs text-mushroom-300 dark:text-marble-800">{data.content}</div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const nodeTypes: NodeTypes = {
// //   planStep: PlanStepNode,
// // };

// // type PlanFlowDiagramProps = {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   events: StreamToolCallsGeneration[] | undefined;
// // };

// // const PlanFlowDiagram: React.FC<PlanFlowDiagramProps> = ({ isOpen, onClose, events }) => {
// //   const [nodes, setNodes, onNodesChange] = useNodesState<Node<PlanStepNodeData>>([]);
// //   const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
// //   const [loaded, setLoaded] = useState(false);
// //   const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
// //   const onConnect: OnConnect = useCallback(
// //     (connection) => setEdges((eds) => addEdge(connection, eds)),
// //     [setEdges]
// //   );

// //   // Handle node click to set the selected node
// //   const onNodeClick = useCallback((event: React.MouseEvent, node: Node<PlanStepNodeData>) => {
// //     setSelectedNodeId(node.id);
// //   }, []);

// //   // Icon mapping function with proper typing
// //   type IconMap = {
// //     [key: string]: () => JSX.Element;
// //   };

// //   const getIconComponent = (toolName: string) => {
// //     const iconMap: IconMap = {
// //       list: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <line x1="8" y1="6" x2="21" y2="6"></line>
// //           <line x1="8" y1="12" x2="21" y2="12"></line>
// //           <line x1="8" y1="18" x2="21" y2="18"></line>
// //           <line x1="3" y1="6" x2="3.01" y2="6"></line>
// //           <line x1="3" y1="12" x2="3.01" y2="12"></line>
// //           <line x1="3" y1="18" x2="3.01" y2="18"></line>
// //         </svg>
// //       ),
// //       'book-open-text': () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
// //           <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
// //           <path d="M6 8h2"></path>
// //           <path d="M6 12h2"></path>
// //           <path d="M16 8h2"></path>
// //           <path d="M16 12h2"></path>
// //         </svg>
// //       ),
// //       calculator: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <rect x="4" y="2" width="16" height="20" rx="2"></rect>
// //           <line x1="8" y1="6" x2="16" y2="6"></line>
// //           <line x1="16" y1="14" x2="16" y2="18"></line>
// //           <path d="M8 10h.01"></path>
// //           <path d="M12 10h.01"></path>
// //           <path d="M16 10h.01"></path>
// //           <path d="M8 14h.01"></path>
// //           <path d="M12 14h.01"></path>
// //           <path d="M8 18h.01"></path>
// //           <path d="M12 18h.01"></path>
// //         </svg>
// //       ),
// //       search: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <circle cx="11" cy="11" r="8"></circle>
// //           <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
// //         </svg>
// //       ),
// //       code: () => (
// //         <svg
// //           xmlns="http://www.w3.org/2000/svg"
// //           width="24"
// //           height="24"
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         >
// //           <polyline points="16 18 22 12 16 6"></polyline>
// //           <polyline points="8 6 2 12 8 18"></polyline>
// //         </svg>
// //       ),
// //     };

// //     return iconMap[toolName] || iconMap.list;
// //   };

// //   // Helper function to safely extract document information
// //   const extractDocumentInfo = (doc: any): { title?: string; url?: string } => {
// //     if (doc) {
// //       return {
// //         title: typeof doc.title === 'string' ? doc.title : undefined,
// //         url: typeof doc.url === 'string' ? doc.url : undefined
// //       };
// //     }
// //     return {};
// //   };

// //   // Create edges with explicit handle IDs
// //   const createEdge = (sourceId: string, targetId: string, index: number): Edge => {
// //     return {
// //       id: `edge-${index}`,
// //       source: sourceId,
// //       target: targetId,
// //       sourceHandle: `${sourceId}-source`,
// //       targetHandle: `${targetId}-target`,
// //       type: 'step',
// //       animated: true,
// //       style: { 
// //         strokeWidth: 2,
// //       },
// //       markerEnd: { 
// //         type: MarkerType.ArrowClosed,
// //         width: 20,
// //         height: 20,
// //       },
// //     };
// //   };

// //   // Initialize diagram from plan and events
// //   const initializeDiagram = useCallback(() => {
// //     if (!events || events.length === 0) {
// //       setLoaded(true);
// //       return;
// //     }

// //     const diagramNodes: Node<PlanStepNodeData>[] = [];
// //     const diagramEdges: Edge[] = [];
// //     let nodeId = 0;
    
// //     // Starting x,y position for nodes
// //     const startX = 250;
// //     const startY = 100;
// //     const ySpacing = 120;

// //     events.forEach((event, index) => {
// //       // Add plan text if available
// //       if (event.text && event.text.trim() !== '') {
// //         const id = `node-${nodeId}`;
// //         diagramNodes.push({
// //           id,
// //           type: 'planStep',
// //           position: { x: startX, y: startY + nodeId * ySpacing },
// //           data: {
// //             content: event.text,
// //             title: 'Plan',
// //             icon: getIconComponent('list'),
// //           },
// //           draggable: true,
// //         });
        
// //         // Connect to previous node
// //         if (nodeId > 0) {
// //           const prevId = `node-${nodeId-1}`;
// //           diagramEdges.push(createEdge(prevId, id, diagramEdges.length));
// //         }
        
// //         nodeId++;
// //       }

// //       // Add tool calls
// //       if (event.tool_calls && Array.isArray(event.tool_calls)) {
// //         event.tool_calls.forEach((toolCall) => {
// //           const id = `node-${nodeId}`;
// //           const toolName = toolCall.name || 'Unknown Tool';
// //           const iconName = 
// //             toolName.includes('search') ? 'search' :
// //             toolName.includes('calculator') ? 'calculator' :
// //             toolName.includes('python') || toolName.includes('code') ? 'code' : 
// //             'list';

// //           let content = `Using ${toolName}`;
          
// //           if (toolCall.parameters) {
// //             if (toolCall.parameters.query) {
// //               content = `Searching for "${toolCall.parameters.query}"`;
// //             } else if (toolCall.parameters.code) {
// //               content = `Executing code`;
// //             }
// //           }

// //           diagramNodes.push({
// //             id,
// //             type: 'planStep',
// //             position: { x: startX, y: startY + nodeId * ySpacing },
// //             data: {
// //               content,
// //               title: toolName,
// //               icon: getIconComponent(iconName),
// //             },
// //             draggable: true,
// //           });

// //           // Connect to previous node
// //           if (nodeId > 0) {
// //             const prevId = `node-${nodeId-1}`;
// //             diagramEdges.push(createEdge(prevId, id, diagramEdges.length));
// //           }
          
// //           nodeId++;
// //         });
// //       }

// //       // Add search results with safer type checking
// //       if (
// //         event.stream_search_results?.search_results &&
// //         typeof event.stream_search_results.search_results === 'object' &&
// //         'documents' in event.stream_search_results.search_results &&
// //         Array.isArray(event.stream_search_results.search_results.documents)
// //       ) {
// //         const documents: SearchResult[] = event.stream_search_results.search_results.documents;
        
// //         // Extract title or URL safely from each document
// //         const docInfo = documents
// //           .map(doc => extractDocumentInfo(doc))
// //           .filter(info => info.title || info.url);
          
// //         const docTitles = docInfo
// //           .map(info => info.title || info.url || '')
// //           .filter(Boolean)
// //           .slice(0, 3);
        
// //         if (docTitles.length > 0) {
// //           const id = `node-${nodeId}`;
// //           diagramNodes.push({
// //             id,
// //             type: 'planStep',
// //             position: { x: startX, y: startY + nodeId * ySpacing },
// //             data: {
// //               content: `Found resources: ${docTitles.join(', ')}${
// //                 documents.length > 3 ? ` and ${documents.length - 3} more` : ''
// //               }`,
// //               title: 'Search Results',
// //               icon: getIconComponent('book-open-text'),
// //             },
// //             draggable: true,
// //           });

// //           // Connect to previous node
// //           if (nodeId > 0) {
// //             const prevId = `node-${nodeId-1}`;
// //             diagramEdges.push(createEdge(prevId, id, diagramEdges.length));
// //           }
          
// //           nodeId++;
// //         }
// //       }
// //     });

// //     // Only add final response node if we have at least one other node
// //     if (nodeId > 0) {
// //       // Add final response node
// //       const finalId = `node-${nodeId}`;
// //       diagramNodes.push({
// //         id: finalId,
// //         type: 'planStep',
// //         position: { x: startX, y: startY + nodeId * ySpacing },
// //         data: {
// //           content: 'Generate final response based on collected information',
// //           title: 'Final Response',
// //           icon: getIconComponent('list'),
// //         },
// //         draggable: true,
// //       });

// //       // Connect to previous node
// //       if (nodeId > 0) {
// //         const prevId = `node-${nodeId-1}`;
// //         diagramEdges.push(createEdge(prevId, finalId, diagramEdges.length));
// //       }
      
// //       // Set the final node as selected by default
// //       setSelectedNodeId(finalId);
// //     }
    
// //     // Set nodes and edges
// //     setNodes(diagramNodes);
// //     setEdges(diagramEdges);
    
// //     // Wait for nodes to be properly mounted and initialized
// //     setTimeout(() => {
// //       setLoaded(true);
// //     }, 100);
    
// //   }, [events, setNodes, setEdges]);

// //   // Update node selected state
// //   useEffect(() => {
// //     if (selectedNodeId) {
// //       setNodes((nds) =>
// //         nds.map((node) => ({
// //           ...node,
// //           selected: node.id === selectedNodeId,
// //         }))
// //       );
// //     }
// //   }, [selectedNodeId, setNodes]);

// //   // Initialize when modal opens or events change
// //   useEffect(() => {
// //     if (isOpen && events) {
// //       // Reset states
// //       setNodes([]);
// //       setEdges([]);
// //       setLoaded(false);
// //       setSelectedNodeId(null);
      
// //       // Small delay to ensure DOM is ready
// //       const timer = setTimeout(() => {
// //         initializeDiagram();
// //       }, 100);
      
// //       return () => clearTimeout(timer);
// //     }
// //   }, [isOpen, events, initializeDiagram]);
  
// //   // Handle window resize and node drag
// //   useEffect(() => {
// //     if (!isOpen) return;
    
// //     const handleResize = () => {
// //       setEdges(edges => edges.map(edge => ({...edge})));
// //     };
    
// //     window.addEventListener('resize', handleResize);
// //     return () => {
// //       window.removeEventListener('resize', handleResize);
// //     };
// //   }, [isOpen, setEdges]);

// //   return (
// //     <Modal
// //       title="Plan Flow Diagram"
// //       isOpen={isOpen}
// //       onClose={onClose}
// //     >
// //       <div 
// //         className="w-full" 
// //         style={{ height: "500px" }}
// //       >
// //         {!loaded ? (
// //           <div className="flex h-full items-center justify-center">
// //             <p>Loading diagram...</p>
// //           </div>
// //         ) : nodes.length === 0 ? (
// //           <div className="flex h-full items-center justify-center">
// //             <p>No plan steps available to display</p>
// //           </div>
// //         ) : (
// //           <ReactFlowProvider>
// //             <ReactFlow
// //               nodes={nodes}
// //               edges={edges}
// //               onNodesChange={onNodesChange}
// //               onEdgesChange={onEdgesChange}
// //               onConnect={onConnect}
// //               onNodeClick={onNodeClick}
// //               nodeTypes={nodeTypes}
// //               fitView
// //               fitViewOptions={{ padding: 0.2 }}
// //               attributionPosition="bottom-right"
// //               style={{ width: '100%', height: '100%' }}
// //               proOptions={{ hideAttribution: true }}
// //               defaultEdgeOptions={{
// //                 animated: true,
// //                 style: { strokeWidth: 2 }
// //               }}
// //             >
// //               <Controls />
// //               {/* MiniMap removed */}
// //               <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
// //             </ReactFlow>
// //           </ReactFlowProvider>
// //         )}
// //       </div>
// //     </Modal>
// //   );
// // };

// // export default PlanFlowDiagram;

// // BACON

// // Enhanced flow diagram with drag & drop node creation


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
//             {data.title !== undefined && (
//               <input
//                 type="text"
//                 className="text-sm font-medium bg-gray-800 text-gray-200 p-1 mb-1 rounded w-full"
//                 value={editTitle}
//                 onChange={(e) => setEditTitle(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSave()}
//                 autoFocus
//               />
//             )}
//             <textarea
//               className="text-xs bg-gray-800 text-gray-300 p-1 rounded w-full min-h-[60px]"
//               value={editContent}
//               onChange={(e) => setEditContent(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleSave()}
//               autoFocus={!data.title}
//             />
//             <div className="flex justify-end mt-2 space-x-2">
//               <button 
//                 className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
//                 onClick={handleSave}
//               >
//                 Save
//               </button>
//             </div>
//           </>
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


// import { Modal } from '@/components/UI'
// //ABOVE THIS IS THE GOOD ONE

// import React, { useState, useCallback, useEffect } from 'react';
// import {
//   ReactFlow,
//   Node,
//   Edge,
//   Controls,
//   Background,
//   BackgroundVariant,
//   Handle,
//   Position,
//   ReactFlowProvider,
//   useNodesState,
//   useEdgesState,
//   useReactFlow,
//   MarkerType,
//   addEdge,
//   NodeTypes,
//   Panel,
//   Connection,
//   OnConnect,
// } from '@xyflow/react';
// import '@xyflow/react/dist/style.css';

// // Define icon component type
// type IconComponent = React.ComponentType<any>;

// // Define branch types
// type BranchType = 'primary' | 'alternative' | undefined;

// // Define execution state types
// type ExecutionState = 'idle' | 'pending' | 'executing' | 'completed' | 'error' | undefined;

// // Define node data with proper types
// interface PlanStepNodeData extends Record<string, unknown> {
//   content: string;
//   title?: string;
//   icon: IconComponent;
//   branchType?: BranchType;
//   isEditing?: boolean;
//   executionState?: ExecutionState;
//   executionTime?: number;
//   errorMessage?: string;
//   onUpdate: (data: Partial<PlanStepNodeData>) => void;
//   onCreateBranch: (nodeId: string) => void;
// }

// // Custom node component with proper typing and explicit handles
// // Using type assertion to make it compatible with ReactFlow's expected node component type
// const PlanStepNode = ({ id, data, selected }: {
//   id: string;
//   data: PlanStepNodeData;
//   selected?: boolean;
// }) => {
//   const [editing, setEditing] = useState(data.isEditing || false);
//   const [editContent, setEditContent] = useState(data.content);
//   const [editTitle, setEditTitle] = useState(data.title || '');
  
//   // Save edits
//   const handleSave = () => {
//     data.onUpdate({
//       content: editContent,
//       title: editTitle.trim() ? editTitle : data.title,
//       isEditing: false
//     });
//     setEditing(false);
//   };
  
//   // Create a branch from this node
//   const handleCreateBranch = () => {
//     data.onCreateBranch(id);
//   };
  
//   // Determine border color based on branch path
//   const getBorderColor = () => {
//     if (selected) return 'border-green-500';
//     if (data.branchType === 'primary') return 'border-blue-500';
//     if (data.branchType === 'alternative') return 'border-purple-500';
//     return 'border-gray-500';
//   };
  
//   return (
//     <div 
//       className={`rounded-md border ${getBorderColor()} bg-gray-900 p-3 shadow-md ${selected ? 'ring-2 ring-green-500' : ''}`}
//       onDoubleClick={() => setEditing(true)}
//     >
//       {/* Handles for connecting nodes */}
//       <Handle
//         type="target"
//         position={Position.Top}
//         id={`${id}-target`}
//         style={{ background: '#555', width: '8px', height: '8px' }}
//       />
//       <Handle
//         type="source"
//         position={Position.Bottom}
//         id={`${id}-source`}
//         style={{ background: '#555', width: '8px', height: '8px' }}
//       />
      
//       {/* Branch indicators */}
//       {data.branchType && (
//         <div className={`absolute top-0 right-0 m-1 px-2 py-0.5 text-xs rounded-full ${
//           data.branchType === 'primary' ? 'bg-blue-600 text-white' : 
//           data.branchType === 'alternative' ? 'bg-purple-600 text-white' : 
//           'bg-gray-600 text-white'
//         }`}>
//           {data.branchType === 'primary' ? 'Main' : 
//            data.branchType === 'alternative' ? 'Alt' : 'Branch'}
//         </div>
//       )}
      
//       <div className="flex items-start gap-2">
//         {/* Icon */}
//         {data.icon && (
//           <span className="flex h-6 w-6 items-center justify-center">
//             <data.icon className={`h-5 w-5 ${selected ? 'text-green-500' : 'text-gray-300'}`} />
//           </span>
//         )}
        
//         {/* Content */}
//         <div className="flex flex-col w-full">
//           {editing ? (
//             // Editing mode
//             <>
//               {data.title !== undefined && (
//                 <input
//                   type="text"
//                   className="text-sm font-medium bg-gray-800 text-gray-200 p-1 mb-1 rounded w-full"
//                   value={editTitle}
//                   onChange={(e) => setEditTitle(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSave()}
//                   autoFocus
//                 />
//               )}
//               <textarea
//                 className="text-xs bg-gray-800 text-gray-300 p-1 rounded w-full min-h-[60px]"
//                 value={editContent}
//                 onChange={(e) => setEditContent(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleSave()}
//                 autoFocus={!data.title}
//               />
//               <div className="flex justify-end mt-2 space-x-2">
//                 <button 
//                   className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
//                   onClick={handleSave}
//                 >
//                   Save
//                 </button>
//               </div>
//             </>
//           ) : (
//             // Display mode
//             <>
//               {data.title && (
//                 <div className={`text-sm font-medium ${selected ? 'text-green-500' : 'text-gray-200'}`}>
//                   {data.title}
//                 </div>
//               )}
//               <div className="text-xs text-gray-300">{data.content}</div>
              
//               {/* Node actions */}
//               <div className="flex justify-end mt-2 space-x-2">
//                 <button 
//                   className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
//                   onClick={handleCreateBranch}
//                   title="Create alternative thought branch"
//                 >
//                   Branch
//                 </button>
//               </div>
//             </>
//           )}
          
//           {/* Execution status if available */}
//           {data.executionState && (
//             <div className={`mt-2 text-xs border-t pt-1 ${
//               data.executionState === 'completed' ? 'text-green-500' :
//               data.executionState === 'error' ? 'text-red-500' :
//               'text-gray-400'
//             }`}>
//               {data.executionState === 'pending' && 'Queued...'}
//               {data.executionState === 'executing' && 'Executing...'}
//               {data.executionState === 'completed' && `Completed in ${data.executionTime || 0}ms`}
//               {data.executionState === 'error' && `Error: ${data.errorMessage || 'Unknown error'}`}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Icons for different node types
// const getIconComponent = (iconName: string): IconComponent => {
//   const icons: Record<string, IconComponent> = {
//     list: () => (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <line x1="8" y1="6" x2="21" y2="6"></line>
//         <line x1="8" y1="12" x2="21" y2="12"></line>
//         <line x1="8" y1="18" x2="21" y2="18"></line>
//         <line x1="3" y1="6" x2="3.01" y2="6"></line>
//         <line x1="3" y1="12" x2="3.01" y2="12"></line>
//         <line x1="3" y1="18" x2="3.01" y2="18"></line>
//       </svg>
//     ),
//     search: () => (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <circle cx="11" cy="11" r="8"></circle>
//         <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//       </svg>
//     ),
//     code: () => (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <polyline points="16 18 22 12 16 6"></polyline>
//         <polyline points="8 6 2 12 8 18"></polyline>
//       </svg>
//     ),
//     compare: () => (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <line x1="18" y1="20" x2="18" y2="10"></line>
//         <line x1="12" y1="20" x2="12" y2="4"></line>
//         <line x1="6" y1="20" x2="6" y2="14"></line>
//         <line x1="2" y1="10" x2="22" y2="10"></line>
//       </svg>
//     ),
//   };
  
//   return icons[iconName] || icons.list;
// };

// // Type for traced path in comparison view
// interface BranchPath {
//   nodes: Node<PlanStepNodeData, string>[];
// }

// // Main component
// const BranchingThoughtFlow: React.FC = () => {
//   // Define node types
//   const nodeTypes: NodeTypes = {
//     planStep: PlanStepNode,
//   };
  
//   // State
//   const [nodes, setNodes, onNodesChange] = useNodesState<Node<PlanStepNodeData, string>>([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
//   const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
//   const [comparisonView, setComparisonView] = useState<boolean>(false);
//   const [comparedBranches, setComparedBranches] = useState<BranchPath[]>([]);
//   const [nextNodeId, setNextNodeId] = useState<number>(0);
  
//   const reactFlowInstance = useReactFlow();
  
//   // Helper to generate unique node IDs
//   const getNewNodeId = (): string => {
//     const id = `node-${nextNodeId}`;
//     setNextNodeId(nextNodeId + 1);
//     return id;
//   };
  
//   // Create an edge between nodes
//   const createEdge = (sourceId: string, targetId: string, branchType: BranchType = 'primary'): void => {
//     const newEdge: Edge = {
//       id: `edge-${sourceId}-${targetId}`,
//       source: sourceId,
//       target: targetId,
//       type: 'default',
//       animated: branchType === 'alternative',
//       style: { 
//         stroke: branchType === 'primary' ? '#3b82f6' : '#9333ea',
//         strokeWidth: 2 
//       },
//       markerEnd: {
//         type: MarkerType.ArrowClosed,
//         width: 15,
//         height: 15,
//         color: branchType === 'primary' ? '#3b82f6' : '#9333ea',
//       }
//     };
    
//     setEdges(eds => [...eds, newEdge]);
//   };
  
//   // Update a node's data
//   const updateNodeData = (nodeId: string, newData: Partial<PlanStepNodeData>): void => {
//     setNodes(nds => 
//       nds.map(node => 
//         node.id === nodeId 
//           ? { ...node, data: { ...node.data, ...newData } }
//           : node
//       )
//     );
//   };
  
//   // Create a branch from a node
//   const createBranch = (sourceNodeId: string): void => {
//     const sourceNode = nodes.find(n => n.id === sourceNodeId);
//     if (!sourceNode) return;
    
//     // Create branch node
//     const branchNodeId = getNewNodeId();
//     const branchNode: Node<PlanStepNodeData, string> = {
//       id: branchNodeId,
//       type: 'planStep',
//       position: { 
//         x: sourceNode.position.x + 300, 
//         y: sourceNode.position.y + 50
//       },
//       data: {
//         content: 'Alternative approach...',
//         title: 'Branch Point',
//         icon: getIconComponent('compare'),
//         branchType: 'alternative',
//         onUpdate: (data) => updateNodeData(branchNodeId, data),
//         onCreateBranch: createBranch,
//         isEditing: true
//       }
//     };
    
//     // Add the branch to nodes
//     setNodes(nds => [...nds, branchNode]);
    
//     // Create an edge from source to branch
//     createEdge(sourceNodeId, branchNodeId, 'alternative');
//   };
  
//   // Handle node selection
//   const onNodeClick = useCallback((event: React.MouseEvent, node: Node<PlanStepNodeData, string>) => {
//     setSelectedNodeId(node.id);
//   }, []);
  
//   // Handle connection
//   const onConnect: OnConnect = useCallback((params: Connection) => {
//     if (!params.source || !params.target) return;
    
//     // Determine if this is creating an alternative branch
//     const sourceNode = nodes.find(n => n.id === params.source);
//     const branchType = sourceNode?.data?.branchType || 'primary';
    
//     // Create styled edge
//     const edge: Edge = {
//       ...params,
//       id: `edge-${params.source}-${params.target}`,
//       type: 'default',
//       animated: branchType === 'alternative',
//       style: { 
//         stroke: branchType === 'primary' ? '#3b82f6' : '#9333ea',
//         strokeWidth: 2 
//       },
//       markerEnd: {
//         type: MarkerType.ArrowClosed,
//         width: 15,
//         height: 15,
//         color: branchType === 'primary' ? '#3b82f6' : '#9333ea',
//       }
//     };
    
//     setEdges(eds => addEdge(edge, eds));
//   }, [nodes, setEdges]);
  
//   // Toggle comparison view
//   const toggleComparisonView = () => {
//     setComparisonView(!comparisonView);
    
//     // If entering comparison view, find the branches
//     if (!comparisonView) {
//       // Find all branch points (nodes with multiple outgoing edges)
//       const branchPoints = nodes.filter(node => {
//         const outgoingEdges = edges.filter(edge => edge.source === node.id);
//         return outgoingEdges.length > 1;
//       });
      
//       if (branchPoints.length > 0) {
//         // For demo, just use the first branch point
//         const branchPoint = branchPoints[0];
        
//         // Find all outgoing paths
//         const outgoingEdges = edges.filter(edge => edge.source === branchPoint.id);
        
//         // Trace each path to its end
//         const branches: BranchPath[] = outgoingEdges.map(edge => {
//           const pathNodes: Node<PlanStepNodeData>[] = [branchPoint];
//           let currentNodeId: string | undefined = edge.target
          
//           // Follow the path
//           while (currentNodeId) {
//             const currentNode = nodes.find(n => n.id === currentNodeId);
//             if (!currentNode) break;
            
//             pathNodes.push(currentNode);
            
//             // Find the next node in the path
//             const nextEdge = edges.find(e => e.source === currentNodeId);
//             currentNodeId = nextEdge?.target || undefined;
            
//             if (!currentNodeId) break;
//           }
          
//           return { nodes: pathNodes };
//         });
        
//         setComparedBranches(branches);
//       }
//     }
//   };
  
//   // Initialize with some example nodes
//   useEffect(() => {
//     // Create initial nodes
//     const initialNodes: Node<PlanStepNodeData, string>[] = [
//       {
//         id: 'node-0',
//         type: 'planStep',
//         position: { x: 250, y: 100 },
//         data: {
//           content: 'Given the user query, I need to analyze the problem',
//           title: 'Initial Assessment',
//           icon: getIconComponent('list'),
//           branchType: 'primary',
//           onUpdate: (data) => updateNodeData('node-0', data),
//           onCreateBranch: createBranch
//         }
//       },
//       {
//         id: 'node-1',
//         type: 'planStep',
//         position: { x: 250, y: 220 },
//         data: {
//           content: 'I should search for relevant information',
//           title: 'Information Gathering',
//           icon: getIconComponent('search'),
//           branchType: 'primary',
//           onUpdate: (data) => updateNodeData('node-1', data),
//           onCreateBranch: createBranch
//         }
//       },
//       {
//         id: 'node-2',
//         type: 'planStep',
//         position: { x: 250, y: 340 },
//         data: {
//           content: 'Based on the search results, I can provide a response',
//           title: 'Analysis',
//           icon: getIconComponent('code'),
//           branchType: 'primary', 
//           onUpdate: (data) => updateNodeData('node-2', data),
//           onCreateBranch: createBranch
//         }
//       },
//       {
//         id: 'node-3',
//         type: 'planStep',
//         position: { x: 250, y: 460 },
//         data: {
//           content: 'Generate final response based on the analysis',
//           title: 'Final Response',
//           icon: getIconComponent('list'),
//           branchType: 'primary',
//           onUpdate: (data) => updateNodeData('node-3', data),
//           onCreateBranch: createBranch
//         }
//       }
//     ];
    
//     // Create initial edges
//     const initialEdges: Edge[] = [
//       { 
//         id: 'edge-0-1', 
//         source: 'node-0', 
//         target: 'node-1',
//         type: 'default',
//         style: { stroke: '#3b82f6', strokeWidth: 2 },
//         markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
//       },
//       { 
//         id: 'edge-1-2', 
//         source: 'node-1', 
//         target: 'node-2',
//         type: 'default',
//         style: { stroke: '#3b82f6', strokeWidth: 2 },
//         markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
//       },
//       { 
//         id: 'edge-2-3', 
//         source: 'node-2', 
//         target: 'node-3',
//         type: 'default',
//         style: { stroke: '#3b82f6', strokeWidth: 2 },
//         markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
//       }
//     ];
    
//     setNodes(initialNodes);
//     setEdges(initialEdges);
//     setNextNodeId(4);
//   }, []);
  
//   return (
//     <div className="w-full h-screen bg-gray-100 dark:bg-gray-800">
//       {comparisonView ? (
//         // Comparison view showing multiple branches side by side
//         <div className="w-full h-full flex flex-col">
//           <div className="p-4 bg-gray-900 flex justify-between items-center">
//             <h2 className="text-lg font-bold text-white">Branch Comparison View</h2>
//             <button 
//               className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//               onClick={toggleComparisonView}
//             >
//               Return to Flow
//             </button>
//           </div>
          
//           <div className="flex-1 flex overflow-hidden">
//             {comparedBranches.length === 0 ? (
//               <div className="flex-1 flex items-center justify-center text-gray-400">
//                 No branches to compare
//               </div>
//             ) : (
//               comparedBranches.map((branch, index) => (
//                 <div key={index} className="flex-1 border-r border-gray-700 overflow-y-auto p-4">
//                   <h3 className={`text-lg font-bold mb-4 ${
//                     index === 0 ? 'text-blue-500' : 'text-purple-500'
//                   }`}>
//                     {index === 0 ? 'Primary Path' : `Alternative ${index}`}
//                   </h3>
                  
//                   <div className="space-y-4">
//                     {branch.nodes.map((node, nodeIndex) => (
//                       <div 
//                         key={node.id} 
//                         className={`p-3 rounded-md border ${
//                           index === 0 ? 'border-blue-500 bg-blue-900 bg-opacity-20' : 
//                                       'border-purple-500 bg-purple-900 bg-opacity-20'
//                         }`}
//                       >
//                         <div className="font-medium text-sm text-gray-200 mb-1">
//                           {node.data.title || `Step ${nodeIndex + 1}`}
//                         </div>
//                         <div className="text-xs text-gray-300">
//                           {node.data.content}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       ) : (
//         // Flow diagram view
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onNodeClick={onNodeClick}
//           nodeTypes={nodeTypes}
//           fitView
//         >
//           <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
//           <Controls />
          
//           <Panel position="top-right">
//             <div className="flex gap-2">
//               <button
//                 className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-1"
//                 onClick={toggleComparisonView}
//                 disabled={
//                   nodes.filter(node => 
//                     edges.filter(edge => edge.source === node.id).length > 1
//                   ).length === 0
//                 }
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="16"
//                   height="16"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
//                   <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
//                   <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
//                   <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
//                 </svg>
//                 Compare Branches
//               </button>
//             </div>
//           </Panel>
//         </ReactFlow>
//       )}
//     </div>
//   );
// };

// // Wrapper with provider
// export default function App() {
//   return (
//     <ReactFlowProvider>
//       <BranchingThoughtFlow />
//     </ReactFlowProvider>
//   );
// }

// const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
// MAN WHAT 2/26
export {};