"use client";

import dynamic from "next/dynamic";
import Toolbar from "@/components/toolbar";
import NodePalette from "@/components/node-palette";
import PropertiesPanel from "@/components/properties-panel";
import DebugPanel from "@/components/debug-panel";
import { useFlowStore } from "@/store/flow-store";

const FlowCanvas = dynamic(() => import("@/components/flow-canvas"), { ssr: false });

export default function Home() {
  const { selectedNodeId } = useFlowStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <NodePalette />
        <div className="flex-1">
          <FlowCanvas />
        </div>
        {selectedNodeId && <PropertiesPanel />}
        <DebugPanel />
      </div>
    </div>
  );
}
