"use client";

import { useFlowStore } from "@/store/flow-store";
import { NODE_TEMPLATES } from "@/lib/types";
import { X } from "lucide-react";

export default function PropertiesPanel() {
  const { nodes, selectedNodeId, updateNodeData, selectNode } = useFlowStore();
  const node = nodes.find((n) => n.id === selectedNodeId);

  if (!node) return null;

  const template = NODE_TEMPLATES.find((t) => t.type === node.data.nodeType);

  return (
    <div className="w-72 bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: node.data.color as string }} />
          {node.data.label as string}
        </h3>
        <button onClick={() => selectNode(null)} className="p-1 hover:bg-gray-800 rounded-lg">
          <X size={14} />
        </button>
      </div>

      <div className="space-y-4">
        {node.data.nodeType === "input" && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Input Value</label>
            <textarea
              value={(node.data.value as string) || ""}
              onChange={(e) => updateNodeData(node.id, { value: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700 resize-none h-24"
              placeholder="Enter input text..."
            />
            <label className="block text-xs text-gray-500 mb-1 mt-3">Variable Name</label>
            <input
              value={(node.data.variableName as string) || ""}
              onChange={(e) => updateNodeData(node.id, { variableName: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
            />
          </div>
        )}

        {node.data.nodeType === "prompt" && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Template</label>
            <textarea
              value={(node.data.template as string) || ""}
              onChange={(e) => updateNodeData(node.id, { template: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700 resize-none h-40 font-mono"
              placeholder="Use {{variable}} for placeholders"
            />
          </div>
        )}

        {node.data.nodeType === "llm" && (
          <>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Model</label>
              <select
                value={(node.data.model as string) || "gpt-4"}
                onChange={(e) => updateNodeData(node.id, { model: e.target.value })}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Temperature: {node.data.temperature as number}</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={(node.data.temperature as number) || 0.7}
                onChange={(e) => updateNodeData(node.id, { temperature: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max Tokens</label>
              <input
                type="number"
                value={(node.data.maxTokens as number) || 2048}
                onChange={(e) => updateNodeData(node.id, { maxTokens: parseInt(e.target.value) })}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
              />
            </div>
          </>
        )}

        {node.data.nodeType === "transform" && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Code</label>
            <textarea
              value={(node.data.code as string) || ""}
              onChange={(e) => updateNodeData(node.id, { code: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700 resize-none h-40 font-mono"
              placeholder="// input is the incoming text\nreturn input.toUpperCase();"
            />
          </div>
        )}

        {node.data.nodeType === "condition" && (
          <>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Condition</label>
              <select
                value={(node.data.condition as string) || "contains"}
                onChange={(e) => updateNodeData(node.id, { condition: e.target.value })}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
              >
                <option value="contains">Contains</option>
                <option value="equals">Equals</option>
                <option value="startsWith">Starts With</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Value</label>
              <input
                value={(node.data.value as string) || ""}
                onChange={(e) => updateNodeData(node.id, { value: e.target.value })}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
              />
            </div>
          </>
        )}

        {node.data.nodeType === "function" && (
          <>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Function Name</label>
              <input
                value={(node.data.name as string) || ""}
                onChange={(e) => updateNodeData(node.id, { name: e.target.value })}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Code</label>
              <textarea
                value={(node.data.code as string) || ""}
                onChange={(e) => updateNodeData(node.id, { code: e.target.value })}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700 resize-none h-40 font-mono"
              />
            </div>
          </>
        )}

        {node.data.nodeType === "memory" && (
          <>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Memory Type</label>
              <select
                value={(node.data.type as string) || "buffer"}
                onChange={(e) => updateNodeData(node.id, { type: e.target.value })}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
              >
                <option value="buffer">Buffer</option>
                <option value="summary">Summary</option>
                <option value="window">Window</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max Messages</label>
              <input
                type="number"
                value={(node.data.maxMessages as number) || 10}
                onChange={(e) => updateNodeData(node.id, { maxMessages: parseInt(e.target.value) })}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
              />
            </div>
          </>
        )}

        {node.data.nodeType === "retriever" && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Top-K Results</label>
            <input
              type="number"
              value={(node.data.topK as number) || 3}
              onChange={(e) => updateNodeData(node.id, { topK: parseInt(e.target.value) })}
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
            />
          </div>
        )}

        {node.data.nodeType === "combiner" && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Separator</label>
            <input
              value={(node.data.separator as string) || "\n\n"}
              onChange={(e) => updateNodeData(node.id, { separator: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
            />
          </div>
        )}

        {node.data.nodeType === "output" && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Format</label>
            <select
              value={(node.data.format as string) || "text"}
              onChange={(e) => updateNodeData(node.id, { format: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
            >
              <option value="text">Plain Text</option>
              <option value="json">JSON</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
        )}

        <div className="pt-2 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            <strong>Inputs:</strong> {template?.inputs.join(", ") || "None"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            <strong>Outputs:</strong> {template?.outputs.join(", ") || "None"}
          </p>
        </div>
      </div>
    </div>
  );
}
