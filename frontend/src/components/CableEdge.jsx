import React, { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import { useCampusStore } from '../store/useCampusStore.js';
import { DollarSign, Trash2, Zap, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export const CableEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data = {},
  style = {}
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isOptimal = Boolean(data.isOptimal);
  const isRedundant = Boolean(data.isRedundant);
  const isExisting = Boolean(data.isExisting);
  const isOverBudget = Boolean(data.isOverBudget);
  const cost = Number(data.cost) || 0;

  const setActiveEdgeForEdit = useCampusStore((s) => s.setActiveEdgeForEdit);
  const removeCable = useCampusStore((s) => s.removeCable);

  // Dynamic stroke color and weight
  let strokeColor = '#475569'; // default slate-600
  let strokeWidth = 2;
  let edgeClass = '';

  if (isOverBudget) {
    strokeColor = '#ef4444'; // red
    strokeWidth = 3.5;
    edgeClass = 'mst-edge-overbudget';
  } else if (isOptimal) {
    strokeColor = '#10b981'; // neon emerald green
    strokeWidth = 3.5;
    edgeClass = 'mst-edge-optimal';
  } else if (isExisting) {
    strokeColor = '#38bdf8'; // sky blue
    strokeWidth = 2.5;
  } else if (isRedundant) {
    strokeColor = '#334155'; // dimmed slate-700
    strokeWidth = 1.5;
  }

  const customStyle = {
    ...style,
    stroke: strokeColor,
    strokeWidth,
    strokeDasharray: isRedundant ? '4 4' : undefined,
    opacity: isRedundant ? 0.35 : 1,
    transition: 'all 0.3s ease',
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={customStyle} className={edgeClass} />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan group"
        >
          <div
            onClick={() => setActiveEdgeForEdit({ id, data })}
            title="Click to edit cable cost / specifications"
            className={clsx(
              'cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-medium shadow-md transition-all duration-200 select-none border',
              isOverBudget
                ? 'bg-rose-950/90 border-rose-500 text-rose-300 ring-2 ring-rose-500/70 animate-pulse'
                : isOptimal
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-emerald-900/50 hover:scale-105'
                : isExisting
                ? 'bg-sky-950/80 border-sky-500 text-sky-300'
                : isRedundant
                ? 'bg-slate-900/70 border-slate-700 text-slate-500 hover:text-slate-300'
                : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-slate-500'
            )}
          >
            {isOverBudget && <AlertCircle className="w-3 h-3 text-rose-400" />}
            {isOptimal && !isOverBudget && <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />}
            <span className="text-[10px] text-slate-400">$</span>
            <span>{cost.toLocaleString()}</span>

            {/* Quick delete on hover */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeCable(id);
              }}
              title="Remove Cable"
              className="ml-0.5 opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-400 transition"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

CableEdge.displayName = 'CableEdge';
