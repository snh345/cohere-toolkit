export type DataSourceArtifact = {
  type: string;
  id: string;
  name: string;
  url?: string;
};

/**
 * Type definition for flow diagram regeneration data structure
 */
export type RegenerationData = {
  nodes: Array<{
    id: string;
    content: string;
    title?: string;
    parentId?: string;  // Optional parent node ID for alternative branches
    branchType: string;
    position: { x: number; y: number };
  }>;
  edges: Array<{
    source: string;
    target: string;
    branchType: string;
  }>;
};
