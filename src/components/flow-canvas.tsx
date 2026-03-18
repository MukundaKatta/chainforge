"use client";

import { useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { useFlowStore } from "@/store/flow-store";
import ChainNode from "./chain-node";
import { NodeType } from "@/lib/types";

const nodeTypes = { chainNode: ChainNode };

function FlowCanvasInner() {
  const {
    nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode,
  } = useFlowStore();
  const reactFlowRef = useRef<ReactFlowInstance | null>(null);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("nodeType") as NodeType;
      if (!type || !reactFlowRef.current) return;
      const bounds = (event.target as HTMLElement).closest(".react-flow")?.getBoundingClientRect();
      if (!bounds) return;
      const position = reactFlowRef.current.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      addNode(type, position);
    },
    [addNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={(instance) => { reactFlowRef.current = instance; }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      nodeTypes={nodeTypes}
      fitView
      className="bg-gray-950"
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#374151" gap={20} />
      <Controls />
      <MiniMap
        nodeColor={(node) => (node.data?.color as string) || "#6b7280"}
        maskColor="rgba(0,0,0,0.7)"
      />
    </ReactFlow>
  );
}

export default function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}
