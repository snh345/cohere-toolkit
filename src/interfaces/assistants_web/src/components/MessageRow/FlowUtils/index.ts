import { Edge, Node, Position, MarkerType } from '@xyflow/react';
import { PlanStepNodeData } from '../FlowTypes';
import { getIconComponent } from './IconMap';

/**
 * Creates an edge between nodes with styling based on branch type
 */
export const createEdge = (
  sourceId: string, 
  targetId: string, 
  index: number, 
  branchType = 'primary'
): Edge => {
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

/**
 * Creates a properly typed node for the plan flow
 */
export const createPlanStepNode = (
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
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  };
};

/**
 * Helper function to safely extract document information
 */
export const extractDocumentInfo = (doc: any): { title?: string; url?: string } => {
  if (doc) {
    return {
      title: typeof doc.title === 'string' ? doc.title : undefined,
      url: typeof doc.url === 'string' ? doc.url : undefined
    };
  }
  return {};
};