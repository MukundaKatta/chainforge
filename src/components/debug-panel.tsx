"use client";

import { useFlowStore } from "@/store/flow-store";
import { CheckCircle, XCircle, Loader2, Clock } from "lucide-react";

export default function DebugPanel() {
  const { debugPanel, executionResults, nodes } = useFlowStore();

  if (!debugPanel) return null;

  const results = Object.values(executionResults);

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
      <div className="p-3 border-b border-gray-800">
        <h3 className="font-medium text-sm">Debug Console</h3>
        <p className="text-xs text-gray-500 mt-1">
          {results.length} nodes executed | {results.filter((r) => r.status === "success").length} success | {results.filter((r) => r.status === "error").length} errors
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {results.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">Run the chain to see results</p>
        )}
        {results.map((result) => {
          const node = nodes.find((n) => n.id === result.nodeId);
          return (
            <div key={result.nodeId} className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {result.status === "success" && <CheckCircle size={14} className="text-green-400" />}
                  {result.status === "error" && <XCircle size={14} className="text-red-400" />}
                  {result.status === "running" && <Loader2 size={14} className="text-yellow-400 animate-spin" />}
                  <span className="text-sm font-medium">{(node?.data.label as string) || "Unknown"}</span>
                </div>
                {result.duration && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={10} /> {result.duration}ms
                  </span>
                )}
              </div>
              {result.output && (
                <div className="bg-gray-900 rounded p-2 text-xs font-mono text-green-400 max-h-32 overflow-y-auto">
                  {result.output}
                </div>
              )}
              {result.error && (
                <div className="bg-red-900/20 rounded p-2 text-xs font-mono text-red-400">
                  {result.error}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
