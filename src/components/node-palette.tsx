"use client";

import { NODE_TEMPLATES } from "@/lib/types";
import {
  ArrowRightCircle, FileText, Brain, Monitor, GitBranch,
  Code, Database, Terminal, Search, Merge,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ArrowRightCircle, FileText, Brain, Monitor, GitBranch,
  Code, Database, Terminal, Search, Merge,
};

export default function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("nodeType", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-56 bg-gray-900 border-r border-gray-800 p-3 overflow-y-auto">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Node Library</h2>
      <div className="space-y-1.5">
        {NODE_TEMPLATES.map((template) => {
          const Icon = iconMap[template.icon] || Code;
          return (
            <div
              key={template.type}
              draggable
              onDragStart={(e) => onDragStart(e, template.type)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-grab hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-700 active:cursor-grabbing"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${template.color}20` }}
              >
                <Icon size={14} className="shrink-0" style={{ color: template.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{template.label}</p>
                <p className="text-[10px] text-gray-500 truncate">{template.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
