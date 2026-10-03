import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant
} from '@xyflow/react';
import { useCampusStore } from '../store/useCampusStore.js';
import { BuildingNode } from './BuildingNode.jsx';
import { CableEdge } from './CableEdge.jsx';
import { SummaryCards } from './SummaryCards.jsx';
import { AlertTriangle, X, ShieldAlert, Sparkles } from 'lucide-react';

const nodeTypes = {
  buildingNode: BuildingNode,
};

const edgeTypes = {
  cableEdge: CableEdge,
};

function FlowCanvasInternal() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addBuilding,
    errorBanner,
    clearErrorBanner,
    optimizationResult,
    isOptimized
  } = useCampusStore();

  const { screenToFlowPosition } = useReactFlow();

  // Double-click on canvas to spawn a new building at mouse position
  const handleDoubleClick = useCallback(
    (event) => {
      // Only trigger if double clicking canvas directly, not on a node
      if (event.target.classList.contains('react-flow__pane')) {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        addBuilding({
          label: `Building ${nodes.length + 1}`,
          isExisting: false,
          networkCluster: 'New Expansion',
          icon: 'building',
          position,
        });
      }
    },
    [screenToFlowPosition, addBuilding, nodes.length]
  );

  return (
    <div className="relative w-full h-full bg-[#070b14]">
      {/* Top Floating Dashboard Metrics */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <SummaryCards />
      </div>

      {/* Floating Error / Notification Toast Banner */}
      {errorBanner && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-xl w-[90%] animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-rose-950/95 border border-rose-500/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-start justify-between gap-3 text-rose-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Network Topology Notice</div>
                <div className="text-xs text-rose-200/90 mt-0.5 leading-relaxed">{errorBanner}</div>
              </div>
            </div>
            <button
              onClick={clearErrorBanner}
              className="text-rose-400 hover:text-white p-1 rounded-lg hover:bg-rose-900/50 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* The Interactive React Flow Graph Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDoubleClick={handleDoubleClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.2}
        maxZoom={2.5}
        proOptions={{ hideAttribution: true }}
        className="touch-none"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#1e293b"
        />

        <Controls
          showInteractive={false}
          className="!bg-slate-900 !border-slate-800 !rounded-xl !shadow-xl [&>button]:!border-slate-800 [&>button]:!bg-slate-900 [&>button]:!text-slate-300 [&>button:hover]:!bg-slate-800 [&>button:hover]:!text-white"
        />

        <MiniMap
          nodeColor={(node) => {
            if (node.data?.isIsolated) return '#f43f5e';
            if (node.data?.isExisting) return '#0284c7';
            return '#f59e0b';
          }}
          maskColor="rgba(7, 11, 20, 0.75)"
          className="!bg-slate-950 !border !border-slate-800 !rounded-xl !overflow-hidden shadow-2xl !bottom-4 !right-4"
          zoomable
          pannable
        />

        {/* Bottom Helper Legend */}
        <Panel position="bottom-left" className="!m-4">
          <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800/80 rounded-xl p-2.5 text-[11px] shadow-lg flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>Existing Backbone</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>New Expansion</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400" />
              <span className="text-emerald-400 font-medium">Optimal MST Cable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 border-t border-dashed border-slate-600" />
              <span>Redundant Loop</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export const Canvas = () => (
  <ReactFlowProvider>
    <FlowCanvasInternal />
  </ReactFlowProvider>
);
