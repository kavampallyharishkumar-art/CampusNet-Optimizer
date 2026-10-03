import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Play,
  DollarSign,
  Layers,
  HelpCircle,
  Sparkles,
  Link as LinkIcon,
  Server,
  BookOpen,
  Laptop,
  FlaskConical,
  Home,
  Trophy,
  Satellite,
  Info
} from 'lucide-react';
import { useCampusStore } from '../store/useCampusStore.js';
import clsx from 'clsx';

const ICONS = [
  { id: 'building', label: 'General', Icon: Building2 },
  { id: 'server', label: 'Data Hub', Icon: Server },
  { id: 'laptop', label: 'CS/Tech', Icon: Laptop },
  { id: 'flask', label: 'Lab/Science', Icon: FlaskConical },
  { id: 'book', label: 'Library', Icon: BookOpen },
  { id: 'home', label: 'Residence', Icon: Home },
  { id: 'trophy', label: 'Athletics', Icon: Trophy },
  { id: 'satellite', label: 'Remote', Icon: Satellite },
];

export const Sidebar = () => {
  const {
    nodes,
    budget,
    setBudget,
    addBuilding,
    onConnect,
    runOptimization,
    isOptimizing,
    isOptimized
  } = useCampusStore();

  // Add Building State
  const [bldgName, setBldgName] = useState('');
  const [bldgCluster, setBldgCluster] = useState('Main Campus');
  const [isExisting, setIsExisting] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('building');

  // Manual Cable Route State
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [cableCost, setCableCost] = useState('200');

  const handleAddBuilding = (e) => {
    e.preventDefault();
    if (!bldgName.trim()) return;

    addBuilding({
      label: bldgName.trim(),
      isExisting,
      networkCluster: bldgCluster.trim() || 'Main Campus',
      icon: selectedIcon
    });

    setBldgName('');
  };

  const handleAddManualCable = (e) => {
    e.preventDefault();
    if (!sourceNode || !targetNode || sourceNode === targetNode) return;

    onConnect({
      source: sourceNode,
      target: targetNode,
      sourceHandle: 'right-src',
      targetHandle: 'left'
    });

    // Reset target for quick sequential entries
    setTargetNode('');
  };

  return (
    <aside className="w-80 lg:w-96 border-r border-slate-800 bg-slate-900/90 backdrop-blur-md flex flex-col h-full z-10 select-none overflow-y-auto">
      {/* Top CTA: Run Kruskal's Optimizer */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40">
        <button
          onClick={() => runOptimization(true)}
          disabled={isOptimizing || nodes.length < 2}
          className={clsx(
            'w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-lg transition-all duration-300 relative overflow-hidden group',
            nodes.length < 2
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99]'
          )}
        >
          <Play className={clsx('w-5 h-5 fill-current', isOptimizing && 'animate-spin')} />
          <span className="text-sm tracking-wide">
            {isOptimizing ? 'Calculating MST...' : isOptimized ? 'Re-Calculate MST' : 'Run Kruskal Optimizer'}
          </span>
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition duration-1000" />
        </button>

        <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-400" />
          <span>Kruskal&apos;s Algorithm + DSU with Path Compression</span>
        </p>
      </div>

      <div className="p-4 space-y-6 flex-1">
        {/* Section 1: Add New Building */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-400" />
              Add Building
            </span>
            <span className="text-[10px] text-slate-400 lowercase font-normal">
              or double-click canvas
            </span>
          </div>

          <form onSubmit={handleAddBuilding} className="space-y-2.5">
            <div>
              <input
                type="text"
                value={bldgName}
                onChange={(e) => setBldgName(e.target.value)}
                placeholder="e.g. Robotics Center, Dorm B"
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            {/* Icon picker */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Building Icon Type</label>
              <div className="grid grid-cols-4 gap-1.5">
                {ICONS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedIcon(id)}
                    title={label}
                    className={clsx(
                      'flex flex-col items-center justify-center p-1.5 rounded-lg border text-[10px] transition',
                      selectedIcon === id
                        ? 'border-sky-500 bg-sky-500/20 text-sky-300'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 mb-0.5" />
                    <span className="truncate max-w-[48px]">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Network cluster / Quad */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Campus Zone / Cluster</label>
              <input
                type="text"
                value={bldgCluster}
                onChange={(e) => setBldgCluster(e.target.value)}
                placeholder="e.g. North Campus, Science Quad"
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            {/* Existing Toggle */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800">
              <div className="flex flex-col">
                <span className="text-xs text-slate-200 font-medium">Already Connected?</span>
                <span className="text-[10px] text-slate-400">Pre-existing campus backbone</span>
              </div>
              <input
                type="checkbox"
                checked={isExisting}
                onChange={(e) => setIsExisting(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 bg-slate-800 border-slate-700 focus:ring-sky-500 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={!bldgName.trim()}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center gap-1.5 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Place on Canvas</span>
            </button>
          </form>
        </div>

        {/* Section 2: Quick Cable Connection Wizard */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4 text-emerald-400" />
              Cable Route Wizard
            </span>
          </div>

          <form onSubmit={handleAddManualCable} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">From Building</label>
                <select
                  value={sourceNode}
                  onChange={(e) => setSourceNode(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select...</option>
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.data?.label || n.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">To Building</label>
                <select
                  value={targetNode}
                  onChange={(e) => setTargetNode(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select...</option>
                  {nodes
                    .filter((n) => n.id !== sourceNode)
                    .map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.data?.label || n.id}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!sourceNode || !targetNode}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect Route</span>
            </button>
            <p className="text-[10px] text-slate-500 italic text-center">
              Tip: You can also drag directly between building handles!
            </p>
          </form>
        </div>

        {/* Section 3: Budget Constraint Slider */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-400" />
              Budget Ceiling
            </span>
            <span className="font-mono text-amber-400">
              ${(budget || 0).toLocaleString()}
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="200"
              max="5000"
              step="50"
              value={budget || 1500}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$200</span>
              <span>$2,500</span>
              <span>$5,000</span>
            </div>
          </div>
        </div>

        {/* Interactive Tips */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1 text-sky-400 font-medium text-[11px]">
            <Info className="w-3.5 h-3.5" />
            <span>Interactive Controls</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
            <li><strong className="text-slate-200">Double-click canvas</strong> to spawn a building.</li>
            <li><strong className="text-slate-200">Drag handles</strong> between buildings to route cables.</li>
            <li><strong className="text-slate-200">Click cost pills</strong> to edit cable distance/price.</li>
            <li><strong className="text-slate-200">Click node badge</strong> to toggle existing infrastructure.</li>
          </ul>
        </div>
      </div>
    </aside>
  );
};
