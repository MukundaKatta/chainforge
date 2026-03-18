"use client";

import { useState } from "react";
import { useFlowStore } from "@/store/flow-store";
import {
  Play, Square, Bug, Save, FolderOpen, Code, Trash2, Download, X,
} from "lucide-react";

export default function Toolbar() {
  const {
    isExecuting, debugPanel, chains, codeExport,
    executeChain, toggleDebug, saveChain, loadChain, deleteChain, exportCode, clearCanvas,
  } = useFlowStore();

  const [showSave, setShowSave] = useState(false);
  const [showLoad, setShowLoad] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [chainName, setChainName] = useState("");

  const handleSave = () => {
    if (chainName.trim()) {
      saveChain(chainName.trim());
      setChainName("");
      setShowSave(false);
    }
  };

  const handleExport = () => {
    exportCode();
    setShowCode(true);
  };

  return (
    <>
      <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-forge-400 mr-4">ChainForge</h1>

          <button
            onClick={executeChain}
            disabled={isExecuting}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            {isExecuting ? <Square size={14} /> : <Play size={14} />}
            {isExecuting ? "Stop" : "Run"}
          </button>

          <button
            onClick={toggleDebug}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              debugPanel ? "bg-amber-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`}
          >
            <Bug size={14} /> Debug
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowSave(true)} className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm text-gray-300">
            <Save size={14} /> Save
          </button>
          <button onClick={() => setShowLoad(true)} className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm text-gray-300">
            <FolderOpen size={14} /> Load
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm text-gray-300">
            <Code size={14} /> Export
          </button>
          <button onClick={clearCanvas} className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm text-red-400">
            <Trash2 size={14} /> Clear
          </button>
        </div>
      </div>

      {/* Save Modal */}
      {showSave && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-96">
            <h3 className="font-medium mb-4">Save Chain</h3>
            <input
              value={chainName}
              onChange={(e) => setChainName(e.target.value)}
              placeholder="Chain name..."
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700 mb-4"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowSave(false)} className="px-4 py-2 bg-gray-800 rounded-lg text-sm">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-forge-600 rounded-lg text-sm font-medium">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showLoad && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-96 max-h-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Load Chain</h3>
              <button onClick={() => setShowLoad(false)}><X size={16} /></button>
            </div>
            <div className="space-y-2 overflow-y-auto max-h-64">
              {chains.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No saved chains</p>}
              {chains.map((chain) => (
                <div key={chain.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                  <button onClick={() => { loadChain(chain.id); setShowLoad(false); }} className="text-sm text-left flex-1">
                    <p className="font-medium">{chain.name}</p>
                    <p className="text-xs text-gray-500">{chain.nodes.length} nodes | {new Date(chain.created_at).toLocaleDateString()}</p>
                  </button>
                  <button onClick={() => deleteChain(chain.id)} className="p-1 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Code Export Modal */}
      {showCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-[600px] max-h-[80vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Exported Code</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(codeExport)}
                  className="px-3 py-1 bg-gray-800 rounded-lg text-xs"
                >
                  Copy
                </button>
                <button onClick={() => setShowCode(false)}><X size={16} /></button>
              </div>
            </div>
            <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono overflow-auto max-h-[60vh] text-green-400">
              {codeExport || "// No chain to export. Add nodes and connect them first."}
            </pre>
          </div>
        </div>
      )}
    </>
  );
}
