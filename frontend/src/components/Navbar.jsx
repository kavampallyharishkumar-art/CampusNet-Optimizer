import React, { useEffect, useRef } from 'react';
import { Network, Server, Cpu, FileText, Download, Upload, RotateCcw, Sparkles } from 'lucide-react';
import { useCampusStore } from '../store/useCampusStore.js';
import { exportTopologyJSON, exportBOMReport } from '../utils/exportUtils.js';
import { PRESETS } from '../utils/presets.js';

export const Navbar = () => {
  const {
    engine,
    setEngine,
    isBackendOnline,
    checkBackend,
    loadPreset,
    resetNetwork,
    setIsBOMModalOpen,
    nodes,
    edges,
    optimizationResult,
    importTopology
  } = useCampusStore();

  const fileInputRef = useRef(null);

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, [checkBackend]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        importTopology(parsed);
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur px-5 flex items-center justify-between z-20 select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Network className="w-5 h-5 text-sky-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              CampusNet Optimizer
            </span>
            <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60">
              MST Planner
            </span>
          </div>
          <p className="text-xs text-slate-400">Next-Gen Campus Fiber Expansion & Topology Solver</p>
        </div>
      </div>

      {/* Center Controls: Engine Selector & Presets */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Presets Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-lg p-1 text-xs">
          <span className="text-slate-400 pl-2 pr-1 font-medium">Presets:</span>
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => loadPreset(key)}
              className="px-2.5 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title={preset.description}
            >
              {preset.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Engine Switcher */}
        <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setEngine('client')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition ${
              engine === 'client'
                ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Runs Kruskal's algorithm directly in your browser. Works offline & 100% on GitHub Pages."
          >
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>Client Engine</span>
          </button>

          <button
            onClick={() => setEngine('backend')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition ${
              engine === 'backend'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Sends graph payload to Express/Node.js API."
          >
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>Express API</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendOnline ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-500'
              }`}
              title={isBackendOnline ? 'Express Server Online' : 'Server Offline (Auto-fallback enabled)'}
            />
          </button>
        </div>
      </div>

      {/* Right Controls: Actions */}
      <div className="flex items-center gap-2">
        {/* Bill of Materials Button */}
        <button
          onClick={() => setIsBOMModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
          title="View detailed Cable Run Bill of Materials"
        >
          <FileText className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Cost Breakdown</span>
        </button>

        {/* Export JSON */}
        <button
          onClick={() => exportTopologyJSON(nodes, edges, optimizationResult)}
          className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 border border-slate-700/60 transition"
          title="Export Topology JSON"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Import JSON */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 border border-slate-700/60 transition"
          title="Import Topology JSON"
        >
          <Upload className="w-4 h-4" />
        </button>

        {/* Clear / Reset */}
        <button
          onClick={resetNetwork}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 bg-slate-800/60 hover:bg-rose-950/40 border border-slate-700/60 hover:border-rose-800/50 transition"
          title="Reset Canvas"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
