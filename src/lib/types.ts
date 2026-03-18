export type NodeType =
  | "prompt"
  | "llm"
  | "output"
  | "condition"
  | "transform"
  | "input"
  | "memory"
  | "function"
  | "retriever"
  | "combiner";

export interface ChainNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface ChainEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Chain {
  id: string;
  user_id: string;
  name: string;
  description: string;
  nodes: ChainNode[];
  edges: ChainEdge[];
  created_at: string;
  updated_at: string;
}

export interface ExecutionResult {
  nodeId: string;
  status: "pending" | "running" | "success" | "error";
  output: string;
  duration?: number;
  error?: string;
}

export interface NodeTemplate {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  color: string;
  defaultData: Record<string, unknown>;
  inputs: string[];
  outputs: string[];
}

export const NODE_TEMPLATES: NodeTemplate[] = [
  {
    type: "input",
    label: "Input",
    description: "User input or data source",
    icon: "ArrowRightCircle",
    color: "#22c55e",
    defaultData: { value: "", variableName: "input" },
    inputs: [],
    outputs: ["output"],
  },
  {
    type: "prompt",
    label: "Prompt Template",
    description: "Format text with variables",
    icon: "FileText",
    color: "#3b82f6",
    defaultData: { template: "You are a helpful assistant.\n\n{{input}}", variables: ["input"] },
    inputs: ["input"],
    outputs: ["output"],
  },
  {
    type: "llm",
    label: "LLM",
    description: "Call a language model",
    icon: "Brain",
    color: "#a855f7",
    defaultData: { model: "gpt-4", temperature: 0.7, maxTokens: 2048, provider: "openai" },
    inputs: ["prompt"],
    outputs: ["output"],
  },
  {
    type: "output",
    label: "Output",
    description: "Display or save result",
    icon: "Monitor",
    color: "#f59e0b",
    defaultData: { format: "text" },
    inputs: ["input"],
    outputs: [],
  },
  {
    type: "condition",
    label: "Condition",
    description: "Branch based on condition",
    icon: "GitBranch",
    color: "#ef4444",
    defaultData: { condition: "contains", value: "" },
    inputs: ["input"],
    outputs: ["true", "false"],
  },
  {
    type: "transform",
    label: "Transform",
    description: "Transform text with code",
    icon: "Code",
    color: "#06b6d4",
    defaultData: { code: "// Transform input\nreturn input.toUpperCase();" },
    inputs: ["input"],
    outputs: ["output"],
  },
  {
    type: "memory",
    label: "Memory",
    description: "Store and recall conversation history",
    icon: "Database",
    color: "#8b5cf6",
    defaultData: { type: "buffer", maxMessages: 10 },
    inputs: ["input"],
    outputs: ["output"],
  },
  {
    type: "function",
    label: "Function",
    description: "Execute custom function",
    icon: "Terminal",
    color: "#10b981",
    defaultData: { name: "custom_fn", code: "async function run(input) {\n  return input;\n}" },
    inputs: ["input"],
    outputs: ["output"],
  },
  {
    type: "retriever",
    label: "Retriever",
    description: "Retrieve relevant documents",
    icon: "Search",
    color: "#f97316",
    defaultData: { topK: 3, collection: "default" },
    inputs: ["query"],
    outputs: ["documents"],
  },
  {
    type: "combiner",
    label: "Combiner",
    description: "Combine multiple inputs",
    icon: "Merge",
    color: "#ec4899",
    defaultData: { separator: "\n\n" },
    inputs: ["input1", "input2"],
    outputs: ["output"],
  },
];
