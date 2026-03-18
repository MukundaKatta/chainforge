"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { useFlowStore } from "@/store/flow-store";
import { NODE_TEMPLATES } from "@/lib/types";
import { Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";

function ChainNodeComponent({ id, data }: NodeProps) {
  const { executionResults, removeNode, selectNode } = useFlowStore();
  const template = NODE_TEMPLATES.find((t) => t.type === data.nodeType);
  const result = executionResults[id];

  const statusIcon = result?.status === "success" ? (
    <CheckCircle size={14} className="text-green-400" />
  ) : result?.status === "error" ? (
    <XCircle size={14} className="text-red-400" />
  ) : result?.status === "running" ? (
    <Loader2 size={14} className="text-yellow-400 animate-spin" />
  ) : null;

  return (
    <div
      className="bg-gray-900 border-2 rounded-xl min-w-[200px] shadow-lg cursor-pointer"
      style={{ borderColor: data.color || "#6b7280" }}
      onClick={() => selectNode(id)}
    >
      {/* Inputs */}
      {template?.inputs.map((input, i) => (
        <Handle
          key={`in-${input}`}
          type="target"
          position={Position.Left}
          id={input}
          style={{ top: `${((i + 1) / (template.inputs.length + 1)) * 100}%` }}
        />
      ))}

      {/* Header */}
      <div
        className="px-3 py-2 rounded-t-[10px] flex items-center justify-between"
        style={{ backgroundColor: `${data.color}20` }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="text-sm font-medium">{data.label}</span>
        </div>
        <div className="flex items-center gap-1">
          {statusIcon}
          <button
            onClick={(e) => { e.stopPropagation(); removeNode(id); }}
            className="p-1 hover:bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={12} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-2 text-xs text-gray-400">
        {data.nodeType === "prompt" && (
          <p className="truncate">{(data.template as string)?.slice(0, 60) || "No template"}</p>
        )}
        {data.nodeType === "llm" && (
          <p>{data.model as string} | temp: {data.temperature as number}</p>
        )}
        {data.nodeType === "input" && (
          <p className="truncate">{(data.value as string) || "Enter input..."}</p>
        )}
        {data.nodeType === "transform" && (
          <p className="truncate font-mono">{(data.code as string)?.slice(0, 60) || "No code"}</p>
        )}
        {data.nodeType === "condition" && (
          <p>{data.condition as string}: {data.value as string}</p>
        )}
        {data.nodeType === "output" && (
          <p>Format: {data.format as string}</p>
        )}
        {data.nodeType === "memory" && (
          <p>Type: {data.type as string} | Max: {data.maxMessages as number}</p>
        )}
        {data.nodeType === "function" && (
          <p className="font-mono truncate">{data.name as string}()</p>
        )}
        {data.nodeType === "retriever" && (
          <p>Top-K: {data.topK as number}</p>
        )}
        {data.nodeType === "combiner" && (
          <p>Separator: {JSON.stringify(data.separator)}</p>
        )}
      </div>

      {/* Result preview */}
      {result?.output && (
        <div className="px-3 py-1.5 border-t border-gray-800 text-xs text-green-400 bg-green-900/10">
          <p className="truncate">{result.output.slice(0, 80)}</p>
          {result.duration && <p className="text-gray-600 mt-0.5">{result.duration}ms</p>}
        </div>
      )}
      {result?.error && (
        <div className="px-3 py-1.5 border-t border-gray-800 text-xs text-red-400 bg-red-900/10">
          <p className="truncate">{result.error}</p>
        </div>
      )}

      {/* Outputs */}
      {template?.outputs.map((output, i) => (
        <Handle
          key={`out-${output}`}
          type="source"
          position={Position.Right}
          id={output}
          style={{ top: `${((i + 1) / (template.outputs.length + 1)) * 100}%` }}
        />
      ))}
    </div>
  );
}

export default memo(ChainNodeComponent);
