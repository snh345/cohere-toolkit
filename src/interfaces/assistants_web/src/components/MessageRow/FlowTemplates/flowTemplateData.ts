import { FlowTemplate } from '../FlowTypes';

// Define available flow templates
export const flowTemplates: FlowTemplate[] = [
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