import React from 'react';
import { useCampusStore } from '../store/useCampusStore.js';
import { exportBOMReport } from '../utils/exportUtils.js';
import { X, FileText, Download, CheckCircle2, AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import clsx from 'clsx';

export const CostBreakdownModal = () => {
  const {
    isBOMModalOpen,
    setIsBOMModalOpen,
    optimizationResult,
    nodes,
    edges,
    budget
  } = useCampusStore();

  if (!isBOMModalOpen) return null;

  const nodeMap = new Map(nodes.map(n => [n.id, n.data?.label || n.id]));
  const selectedEdges = optimizationResult?.selectedEdges || [];
  const redundantEdges = optimizationResult?.redundantEdges || [];
  const totalCost = optimizationResult ? optimizationResult.totalCost : edges.reduce((acc, e) => acc + (Number(e.data?.cost) || 0), 0);
  const totalProposed = optimizationResult ? optimizationResult.totalProposedCost : totalCost;
  const savings = optimizationResult ? optimizationResult.costSavings : 0;
  const isOverBudget = optimizationResult?.budgetStatus?.isOverBudget;
  const deficit = optimizationResult?.budgetStatus?.deficit || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Network Expansion Bill of Materials (BOM)
              </h2>
              <p className="text-xs text-slate-400">
                Detailed itemized cable runs and capital expenditure breakdown
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBOMModalOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Summary Overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Total MST Investment</div>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                ${totalCost.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {selectedEdges.length} active segments
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Total Potential Cost</div>
              <div className="text-lg font-bold font-mono text-slate-300 mt-1">
                ${totalProposed.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Without MST optimization
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Capital Savings</div>
              <div className="text-lg font-bold font-mono text-sky-400 mt-1">
                ${savings.toLocaleString()}
              </div>
              <div className="text-[10px] text-sky-400/80 mt-0.5 font-semibold">
                {optimizationResult ? `${optimizationResult.savingsPercentage}% savings` : '0%'}
              </div>
            </div>
          </div>

          {/* Budget Warning if over budget */}
          {isOverBudget && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-2.5 text-rose-300">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <div className="font-semibold text-rose-200">Budget Limit Exceeded</div>
                <div className="text-[11px] text-rose-300/80 mt-0.5">
                  The computed Minimum Spanning Tree exceeds your budget ceiling of ${budget?.toLocaleString()} by{' '}
                  <strong>${deficit.toLocaleString()}</strong>. Consider trimming expansion buildings or negotiating bulk fiber procurement.
                </div>
              </div>
            </div>
          )}

          {/* Selected Optimal Cable Runs */}
          <div>
            <div className="flex items-center justify-between font-semibold text-slate-200 mb-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Selected Fiber Routes ({selectedEdges.length})
              </span>
              <span className="text-[11px] text-slate-400">Essential Backbone</span>
            </div>

            {selectedEdges.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-slate-500">
                No active cable runs. Click &quot;Run Kruskal Optimizer&quot; to compute.
              </div>
            ) : (
              <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
                {selectedEdges.map((edge, index) => {
                  const src = nodeMap.get(edge.source) || edge.source;
                  const tgt = nodeMap.get(edge.target) || edge.target;
                  return (
                    <div
                      key={edge.id}
                      className="px-4 py-2.5 bg-slate-950/40 flex items-center justify-between hover:bg-slate-950 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 text-[10px]">#{index + 1}</span>
                        <span className="font-medium text-slate-200">{src}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-medium text-slate-200">{tgt}</span>
                      </div>
                      <div className="font-mono font-semibold text-emerald-400">
                        ${edge.cost.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Redundant Routes Discarded */}
          {redundantEdges.length > 0 && (
            <div>
              <div className="flex items-center justify-between font-semibold text-slate-300 mb-2">
                <span>Discarded Redundant Loops ({redundantEdges.length})</span>
                <span className="text-[11px] text-slate-500">Filtered by Kruskal DSU</span>
              </div>

              <div className="border border-slate-800/80 rounded-xl overflow-hidden divide-y divide-slate-800/60 opacity-70">
                {redundantEdges.map((edge, index) => {
                  const src = nodeMap.get(edge.source) || edge.source;
                  const tgt = nodeMap.get(edge.target) || edge.target;
                  return (
                    <div key={edge.id} className="px-4 py-2 bg-slate-950/20 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 line-through">
                        <span>{src}</span>
                        <ArrowRight className="w-3 h-3 text-slate-600" />
                        <span>{tgt}</span>
                      </div>
                      <div className="font-mono text-slate-500">
                        ${edge.cost.toLocaleString()} (Avoided)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            MST Graph Solver powered by Kruskal&apos;s Algorithm
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsBOMModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Close
            </button>
            <button
              onClick={() => exportBOMReport(nodes, edges, optimizationResult)}
              disabled={!optimizationResult}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-sky-600/20 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download BOM Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
