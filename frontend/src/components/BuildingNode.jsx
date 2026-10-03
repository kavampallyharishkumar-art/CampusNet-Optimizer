import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Building2, Server, BookOpen, Laptop, FlaskConical, Home, Trophy, Satellite, Trash2, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { useCampusStore } from '../store/useCampusStore.js';
import clsx from 'clsx';

const ICON_MAP = {
  server: Server,
  book: BookOpen,
  laptop: Laptop,
  flask: FlaskConical,
  home: Home,
  trophy: Trophy,
  satellite: Satellite,
  building: Building2
};

export const BuildingNode = memo(({ id, data, selected }) => {
  const removeBuilding = useCampusStore((s) => s.removeBuilding);
  const updateBuilding = useCampusStore((s) => s.updateBuilding);

  const IconComponent = ICON_MAP[data.icon] || Building2;
  const isExisting = Boolean(data.isExisting);
  const isIsolated = Boolean(data.isIsolated);

  const toggleExisting = (e) => {
    e.stopPropagation();
    updateBuilding(id, { isExisting: !isExisting });
  };

  return (
    <div
      className={clsx(
        'group relative min-w-[190px] rounded-xl border backdrop-blur-md p-3.5 shadow-xl transition-all duration-200',
        isIsolated
          ? 'border-rose-500 bg-rose-950/70 shadow-rose-900/40 ring-2 ring-rose-500 animate-bounce-short'
          : isExisting
          ? 'border-sky-500/60 bg-slate-900/85 hover:border-sky-400 shadow-sky-950/50'
          : 'border-amber-500/60 bg-slate-900/85 hover:border-amber-400 shadow-amber-950/50',
        selected && 'ring-2 ring-sky-400 scale-[1.02]'
      )}
    >
      {/* React Flow Handles on all 4 sides for seamless routing */}
      <Handle type="target" position={Position.Top} id="top" className="!bg-sky-400" />
      <Handle type="source" position={Position.Top} id="top-src" className="!bg-sky-400" />
      <Handle type="target" position={Position.Right} id="right" className="!bg-sky-400" />
      <Handle type="source" position={Position.Right} id="right-src" className="!bg-sky-400" />
      <Handle type="target" position={Position.Bottom} id="bottom" className="!bg-sky-400" />
      <Handle type="source" position={Position.Bottom} id="bottom-src" className="!bg-sky-400" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-sky-400" />
      <Handle type="source" position={Position.Left} id="left-src" className="!bg-sky-400" />

      {/* Header with Icon and Quick Delete */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div
          className={clsx(
            'flex h-8 w-8 items-center justify-center rounded-lg shadow-sm',
            isIsolated
              ? 'bg-rose-500 text-white'
              : isExisting
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          )}
        >
          <IconComponent className="h-4 w-4" />
        </div>

        <div className="flex items-center gap-1.5">
          {/* Status Badge */}
          <button
            onClick={toggleExisting}
            title={isExisting ? 'Part of existing network (Click to toggle)' : 'New expansion building (Click to toggle)'}
            className={clsx(
              'px-2 py-0.5 text-[10px] font-semibold rounded-full border transition flex items-center gap-1',
              isExisting
                ? 'bg-sky-950/80 border-sky-400/50 text-sky-300 hover:bg-sky-900'
                : 'bg-amber-950/80 border-amber-400/50 text-amber-300 hover:bg-amber-900'
            )}
          >
            {isExisting ? (
              <>
                <CheckCircle2 className="w-2.5 h-2.5 text-sky-400" />
                Existing
              </>
            ) : (
              <>
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                New Expansion
              </>
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeBuilding(id);
            }}
            title="Delete Building"
            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 rounded transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Building Label */}
      <div className="text-xs font-semibold text-slate-100 tracking-wide truncate">
        {data.label}
      </div>

      {/* Network Cluster Subtitle */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
        <span className="truncate max-w-[120px]">{data.networkCluster || 'Default Quad'}</span>
        {isIsolated && (
          <span className="text-[10px] text-rose-400 flex items-center gap-0.5 font-bold">
            <AlertTriangle className="w-3 h-3" /> Stranded
          </span>
        )}
      </div>
    </div>
  );
});

BuildingNode.displayName = 'BuildingNode';
