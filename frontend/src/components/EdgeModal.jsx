import React, { useState, useEffect } from 'react';
import { useCampusStore } from '../store/useCampusStore.js';
import { X, DollarSign, Trash2, CheckCircle, Cable } from 'lucide-react';

export const EdgeModal = () => {
  const { activeEdgeForEdit, setActiveEdgeForEdit, updateCable, removeCable, nodes } = useCampusStore();

  const [cost, setCost] = useState('150');
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    if (activeEdgeForEdit) {
      setCost(String(activeEdgeForEdit.data?.cost || 150));
      setIsExisting(Boolean(activeEdgeForEdit.data?.isExisting));
    }
  }, [activeEdgeForEdit]);

  if (!activeEdgeForEdit) return null;

  const nodeMap = new Map(nodes.map(n => [n.id, n.data?.label || n.id]));
  const srcLabel = nodeMap.get(activeEdgeForEdit.source) || activeEdgeForEdit.source;
  const tgtLabel = nodeMap.get(activeEdgeForEdit.target) || activeEdgeForEdit.target;

  const handleSave = (e) => {
    e.preventDefault();
    updateCable(activeEdgeForEdit.id, {
      cost: Number(cost) || 0,
      isExisting
    });
  };

  const handleDelete = () => {
    removeCable(activeEdgeForEdit.id);
    setActiveEdgeForEdit(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
            <Cable className="w-4 h-4 text-sky-400" />
            <span>Edit Cable Connection</span>
          </div>
          <button
            onClick={() => setActiveEdgeForEdit(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="text-slate-400">Endpoint Route:</div>
            <div className="text-slate-200 font-medium mt-1 flex items-center justify-between">
              <span className="text-sky-300 truncate max-w-[150px]">{srcLabel}</span>
              <span className="text-slate-500 font-mono">⟷</span>
              <span className="text-sky-300 truncate max-w-[150px]">{tgtLabel}</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1.5 font-medium">
              Estimated Cable Run Cost ($)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="number"
                min="0"
                step="10"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Represents fiber optic installation, trenching, and optic transceivers.
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <div>
              <div className="text-xs text-slate-200 font-medium">Pre-Existing Cable?</div>
              <div className="text-[10px] text-slate-400">Already laid in conduit (0 new expense)</div>
            </div>
            <input
              type="checkbox"
              checked={isExisting}
              onChange={(e) => setIsExisting(e.target.checked)}
              className="w-4 h-4 rounded text-sky-500 bg-slate-800 border-slate-700 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/60 rounded-xl border border-rose-900/50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Route</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveEdgeForEdit(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-lg shadow-sky-600/30 transition flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
