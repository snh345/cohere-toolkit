
import { Node, Edge } from '@xyflow/react';
import { StreamToolCallsGeneration } from '@/cohere-client';

// Node data type definition
export type PlanStepNodeData = {
  icon: React.ComponentType<any>;
  title?: string;
  content: string;
  isEditing?: boolean;
  branchType?: 'primary' | 'alternative';
};

// Flow template type definition
export type FlowTemplate = {
  id: string;
  name: string;
  description: string;
  nodes: RegenerationData['nodes'];
  edges: RegenerationData['edges'];
};

// Regeneration data type
export type RegenerationData = {
  nodes: {
    id: string;
    content: string;
    title?: string;
    branchType: string;
    position: { x: number, y: number };
  }[];
  edges: {
    source: string;
    target: string;
    branchType: string;
  }[];
};

// Props for the main PlanFlowDiagram component
export type PlanFlowDiagramProps = {
  isOpen: boolean;
  onClose: () => void;
  events: StreamToolCallsGeneration[] | undefined;
  onRegenerateFromFlow?: (flowData: RegenerationData) => Promise<void>;
};

// Props for the FlowDiagramContent component
export type FlowDiagramContentProps = {
  nodes: Node<PlanStepNodeData>[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onNodeClick: (event: React.MouseEvent, node: Node<PlanStepNodeData>) => void;
  nodeTypes: any;
  getIconComponent: (toolName: string) => React.ComponentType<any>;
  createEdge: (sourceId: string, targetId: string, index: number, branchType?: string) => Edge;
  onCreateBranch: (nodeId: string) => void;
  selectedNodeId: string | null;
  toggleAltBranches: () => void;
  altBranchesVisible: boolean;
};

// Props for the PlanStepNode component
export type PlanStepNodeProps = {
  id: string;
  data: PlanStepNodeData;
  selected: boolean; // React Flow requires this to be a strict boolean, not optional
};

// Props for the TemplateSelector component
export type TemplateSelectorProps = {
  templates: FlowTemplate[];
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
};

// Types for tool calls
export type ToolCallParameters = {
  query?: string;
  code?: string;
  [key: string]: any;
};

export type ToolCall = {
  name?: string;
  parameters?: ToolCallParameters;
};

export type SearchResult = {
  title?: string;
  url?: string;
};

export type SearchResults = {
  search_results?: {
    documents?: SearchResult[];
  } | null;
};