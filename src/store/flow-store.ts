import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
} from "reactflow";
import { NodeType, NODE_TEMPLATES, ExecutionResult, Chain } from "@/lib/types";

interface FlowState {
  chains: Chain[];
  currentChainId: string | null;
  nodes: Node[];
  edges: Edge[];
  executionResults: Record<string, ExecutionResult>;
  isExecuting: boolean;
  debugPanel: boolean;
  selectedNodeId: string | null;
  codeExport: string;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  removeNode: (id: string) => void;
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  selectNode: (id: string | null) => void;
  executeChain: () => Promise<void>;
  toggleDebug: () => void;
  saveChain: (name: string) => void;
  loadChain: (id: string) => void;
  deleteChain: (id: string) => void;
  exportCode: () => void;
  clearCanvas: () => void;
}

export const useFlowStore = create<FlowState>()(
  persist(
    (set, get) => ({
      chains: [],
      currentChainId: null,
      nodes: [],
      edges: [],
      executionResults: {},
      isExecuting: false,
      debugPanel: false,
      selectedNodeId: null,
      codeExport: "",

      onNodesChange: (changes) =>
        set({ nodes: applyNodeChanges(changes, get().nodes) }),
      onEdgesChange: (changes) =>
        set({ edges: applyEdgeChanges(changes, get().edges) }),
      onConnect: (connection: Connection) =>
        set({ edges: addEdge({ ...connection, id: uuidv4() }, get().edges) }),

      addNode: (type, position) => {
        const template = NODE_TEMPLATES.find((t) => t.type === type);
        if (!template) return;
        const newNode: Node = {
          id: uuidv4(),
          type: "chainNode",
          position,
          data: { ...template.defaultData, nodeType: type, label: template.label, color: template.color },
        };
        set({ nodes: [...get().nodes, newNode] });
      },

      removeNode: (id) =>
        set({
          nodes: get().nodes.filter((n) => n.id !== id),
          edges: get().edges.filter((e) => e.source !== id && e.target !== id),
        }),

      updateNodeData: (id, data) =>
        set({
          nodes: get().nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
        }),

      selectNode: (id) => set({ selectedNodeId: id }),

      executeChain: async () => {
        const { nodes, edges } = get();
        set({ isExecuting: true, executionResults: {} });

        // Topological sort
        const inDegree: Record<string, number> = {};
        const adj: Record<string, string[]> = {};
        nodes.forEach((n) => {
          inDegree[n.id] = 0;
          adj[n.id] = [];
        });
        edges.forEach((e) => {
          inDegree[e.target] = (inDegree[e.target] || 0) + 1;
          adj[e.source] = [...(adj[e.source] || []), e.target];
        });

        const queue = nodes.filter((n) => inDegree[n.id] === 0).map((n) => n.id);
        const order: string[] = [];
        while (queue.length) {
          const nodeId = queue.shift()!;
          order.push(nodeId);
          for (const next of adj[nodeId] || []) {
            inDegree[next]--;
            if (inDegree[next] === 0) queue.push(next);
          }
        }

        const outputs: Record<string, string> = {};

        for (const nodeId of order) {
          const node = nodes.find((n) => n.id === nodeId);
          if (!node) continue;

          set({
            executionResults: {
              ...get().executionResults,
              [nodeId]: { nodeId, status: "running", output: "" },
            },
          });

          const start = Date.now();
          try {
            const incoming = edges.filter((e) => e.target === nodeId);
            const inputText = incoming.map((e) => outputs[e.source] || "").join("\n");
            let output = "";

            switch (node.data.nodeType) {
              case "input":
                output = (node.data.value as string) || "Hello, world!";
                break;
              case "prompt": {
                let template = (node.data.template as string) || "";
                template = template.replace(/\{\{input\}\}/g, inputText);
                output = template;
                break;
              }
              case "llm":
                try {
                  const res = await fetch("/api/execute", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      prompt: inputText,
                      model: node.data.model,
                      temperature: node.data.temperature,
                      maxTokens: node.data.maxTokens,
                    }),
                  });
                  const data = await res.json();
                  output = data.result || data.error || "No output";
                } catch {
                  output = `[LLM Simulated] Response to: ${inputText.slice(0, 100)}...`;
                }
                break;
              case "transform":
                try {
                  const fn = new Function("input", node.data.code as string);
                  output = fn(inputText);
                } catch (e) {
                  output = `Transform error: ${e}`;
                }
                break;
              case "condition": {
                const cond = (node.data.condition as string) || "contains";
                const val = (node.data.value as string) || "";
                const matches =
                  cond === "contains" ? inputText.includes(val) :
                  cond === "equals" ? inputText === val :
                  cond === "startsWith" ? inputText.startsWith(val) : false;
                output = matches ? inputText : "";
                break;
              }
              case "combiner":
                output = incoming.map((e) => outputs[e.source] || "").join((node.data.separator as string) || "\n\n");
                break;
              case "memory":
                output = inputText;
                break;
              case "function":
                try {
                  const fn = new Function("input", `${node.data.code}\nreturn run(input);`);
                  output = await fn(inputText);
                } catch (e) {
                  output = `Function error: ${e}`;
                }
                break;
              case "retriever":
                output = `[Retrieved ${node.data.topK} documents for: ${inputText.slice(0, 50)}]`;
                break;
              case "output":
                output = inputText;
                break;
              default:
                output = inputText;
            }

            outputs[nodeId] = output;
            set({
              executionResults: {
                ...get().executionResults,
                [nodeId]: { nodeId, status: "success", output, duration: Date.now() - start },
              },
            });
          } catch (error) {
            set({
              executionResults: {
                ...get().executionResults,
                [nodeId]: {
                  nodeId,
                  status: "error",
                  output: "",
                  error: error instanceof Error ? error.message : "Unknown error",
                  duration: Date.now() - start,
                },
              },
            });
          }
        }

        set({ isExecuting: false });
      },

      toggleDebug: () => set({ debugPanel: !get().debugPanel }),

      saveChain: (name) => {
        const { nodes, edges, chains } = get();
        const chain: Chain = {
          id: uuidv4(),
          user_id: "",
          name,
          description: "",
          nodes: nodes.map((n) => ({ id: n.id, type: n.data.nodeType, position: n.position, data: n.data })),
          edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set({ chains: [...chains, chain], currentChainId: chain.id });
      },

      loadChain: (id) => {
        const chain = get().chains.find((c) => c.id === id);
        if (!chain) return;
        set({
          currentChainId: id,
          nodes: chain.nodes.map((n) => ({
            id: n.id,
            type: "chainNode",
            position: n.position,
            data: n.data,
          })),
          edges: chain.edges,
          executionResults: {},
        });
      },

      deleteChain: (id) =>
        set({
          chains: get().chains.filter((c) => c.id !== id),
          currentChainId: get().currentChainId === id ? null : get().currentChainId,
        }),

      exportCode: () => {
        const { nodes, edges } = get();
        let code = `// ChainForge Generated Code\n`;
        code += `// Generated: ${new Date().toISOString()}\n\n`;
        code += `import OpenAI from 'openai';\n\n`;
        code += `const openai = new OpenAI();\n\n`;
        code += `async function runChain(input: string) {\n`;
        code += `  const outputs: Record<string, string> = {};\n\n`;

        // Topological sort
        const inDegree: Record<string, number> = {};
        const adj: Record<string, string[]> = {};
        nodes.forEach((n) => { inDegree[n.id] = 0; adj[n.id] = []; });
        edges.forEach((e) => { inDegree[e.target] = (inDegree[e.target] || 0) + 1; adj[e.source].push(e.target); });
        const queue = nodes.filter((n) => inDegree[n.id] === 0).map((n) => n.id);
        const order: string[] = [];
        while (queue.length) {
          const id = queue.shift()!;
          order.push(id);
          for (const next of adj[id]) { inDegree[next]--; if (inDegree[next] === 0) queue.push(next); }
        }

        for (const nodeId of order) {
          const node = nodes.find((n) => n.id === nodeId);
          if (!node) continue;
          const varName = `node_${nodeId.slice(0, 8)}`;
          const incoming = edges.filter((e) => e.target === nodeId);
          const inputVar = incoming.length ? incoming.map((e) => `outputs['${e.source}']`).join(" + ") : "input";

          switch (node.data.nodeType) {
            case "input":
              code += `  // Input Node\n  outputs['${nodeId}'] = input;\n\n`;
              break;
            case "prompt":
              code += `  // Prompt Template\n  outputs['${nodeId}'] = \`${(node.data.template as string || "").replace(/\{\{input\}\}/g, "${" + inputVar + "}")}\`;\n\n`;
              break;
            case "llm":
              code += `  // LLM Call (${node.data.model})\n`;
              code += `  const ${varName} = await openai.chat.completions.create({\n`;
              code += `    model: '${node.data.model}',\n`;
              code += `    messages: [{ role: 'user', content: ${inputVar} }],\n`;
              code += `    temperature: ${node.data.temperature},\n`;
              code += `    max_tokens: ${node.data.maxTokens},\n  });\n`;
              code += `  outputs['${nodeId}'] = ${varName}.choices[0].message.content || '';\n\n`;
              break;
            case "output":
              code += `  // Output\n  return ${inputVar};\n\n`;
              break;
            default:
              code += `  // ${node.data.nodeType} node\n  outputs['${nodeId}'] = ${inputVar};\n\n`;
          }
        }

        code += `}\n\n`;
        code += `// Usage:\n// const result = await runChain("Your input here");\n`;

        set({ codeExport: code });
      },

      clearCanvas: () => set({ nodes: [], edges: [], executionResults: {}, currentChainId: null }),
    }),
    { name: "chainforge-storage", partialize: (state) => ({ chains: state.chains }) }
  )
);
