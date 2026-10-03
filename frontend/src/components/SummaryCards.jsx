import React from 'react';
import { DollarSign, TrendingDown, Network, ShieldAlert, CheckCircle, Zap } from 'lucide-react';
import { useCampusStore } from '../store/useCampusStore.js';
import clsx from 'clsx';

export const SummaryCards = () => {
  const {
    optimizationResult,
    isOptimized,
    budget,
    nodes,
    edges
  } = useCampusStore();

  const totalPossibleCost = edges.reduce((acc, e) => acc + (Number(e.data?.cost) || 0), 0);
  const totalCost = optimizationResult ? optimizationResult.totalCost : totalPossibleCost;
  const savings = optimizationResult ? optimizationResult.costSavings : 0;
  const savingsPercentage = optimizationResult ? optimizationResult.savingsPercentage : 0;
  const isConnected = optimizationResult ? optimizationResult.isConnected : true;
  const isOverBudget = optimizationResult?.budgetStatus?.isOverBudget;
  const deficit = optimizationResult?.budgetStatus?.deficit || 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 pointer-events-auto">
      {/* 1. Total Investment */}
      <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-xl p-3 shadow-lg flex items-center justify-between">
        <div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            {isOptimized ? 'Optimal MST Cost' : 'Total Planned Cost'}
          </div>
          <div className="text-xl font-bold font-mono text-slate-100 flex items-center mt-0.5">
            <span className="text-sky-400 mr-0.5">$</span>
            {totalCost.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {isOptimized ? `${optimizationResult.selectedEdges.length} active cable runs` : `${edges.length} total routes`}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Capital Savings */}
      <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-xl p-3 shadow-lg flex items-center justify-between">
        <div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Optimization Savings
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 flex items-center mt-0.5">
            <span className="mr-0.5">$</span>
            {savings.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5 font-medium">
            {isOptimized ? `${savingsPercentage}% cable budget saved` : 'Run calculation to view'}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <TrendingDown className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Budget Compliance */}
      <div
        className={clsx(
          'border backdrop-blur-md rounded-xl p-3 shadow-lg flex items-center justify-between transition',
          isOverBudget
            ? 'bg-rose-950/40 border-rose-500/60 shadow-rose-950/50'
            : 'bg-slate-900/80 border-slate-800'
        )}
      >
        <div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Budget Ceiling
          </div>
          <div
            className={clsx(
              'text-xl font-bold font-mono flex items-center mt-0.5',
              isOverBudget ? 'text-rose-400' : 'text-slate-100'
            )}
          >
            <span className="text-slate-500 mr-0.5">$</span>
            {budget ? budget.toLocaleString() : 'No Limit'}
          </div>
          <div
            className={clsx(
              'text-[10px] mt-0.5 font-medium',
              isOverBudget
                ? 'text-rose-400 font-bold'
                : budget && totalCost <= budget
                ? 'text-emerald-400'
                : 'text-slate-400'
            )}
          >
            {isOverBudget
              ? `Exceeded by $${deficit.toLocaleString()}!`
              : budget
              ? `$${Math.max(0, budget - totalCost).toLocaleString()} headroom left`
              : 'Configurable in sidebar'}
          </div>
        </div>
        <div
          className={clsx(
            'p-2.5 rounded-lg border',
            isOverBudget
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse'
              : 'bg-slate-800 border-slate-700 text-slate-300'
          )}
        >
          {isOverBudget ? <ShieldAlert className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
        </div>
      </div>

      {/* 4. Connectivity Health */}
      <div
        className={clsx(
          'border backdrop-blur-md rounded-xl p-3 shadow-lg flex items-center justify-between transition',
          !isConnected
            ? 'bg-amber-950/40 border-amber-500/60 shadow-amber-950/50'
            : 'bg-slate-900/80 border-slate-800'
        )}
      >
        <div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Network Integrity
          </div>
          <div
            className={clsx(
              'text-base font-bold flex items-center mt-0.5',
              !isConnected ? 'text-amber-400' : 'text-emerald-400'
            )}
          >
            {nodes.length === 0 ? 'Empty' : isConnected ? '100% Connected' : 'Segmented/Isolated'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {nodes.length} nodes · {edges.length} cable options
          </div>
        </div>
        <div
          className={clsx(
            'p-2.5 rounded-lg border',
            !isConnected
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          )}
        >
          {!isConnected ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
        </div>
      </div>
    </div>
  );
};
