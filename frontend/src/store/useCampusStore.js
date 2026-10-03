import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import { PRESETS } from '../utils/presets.js';
import { optimizeNetwork, checkBackendHealth } from '../utils/api.js';
import confetti from 'canvas-confetti';

export const useCampusStore = create((set, get) => ({
  // Graph State
  nodes: PRESETS.standard.nodes,
  edges: PRESETS.standard.edges,
  budget: PRESETS.standard.budget,

  // Optimization State
  isOptimized: false,
  isOptimizing: false,
  optimizationResult: null,
  engine: 'client', // 'client' | 'backend'
  isBackendOnline: false,

  // Modals & Active Selections
  activeEdgeForEdit: null,
  isCostModalOpen: false,
  isBOMModalOpen: false,
  errorBanner: null,

  // Backend status check
  checkBackend: async () => {
    const online = await checkBackendHealth();
    set({ isBackendOnline: online });
    return online;
  },

  setEngine: (engine) => set({ engine }),

  setBudget: (budget) => {
    set({ budget });
    // Re-evaluate budget status if already optimized
    const { isOptimized } = get();
    if (isOptimized) {
      get().runOptimization(false);
    }
  },

  // React Flow Handlers
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    // Check if edge already exists between these nodes
    const existing = get().edges.find(
      (e) =>
        (e.source === connection.source && e.target === connection.target) ||
        (e.source === connection.target && e.target === connection.source)
    );

    if (existing) {
      set({ errorBanner: 'A cable connection already exists between these two buildings.' });
      setTimeout(() => set({ errorBanner: null }), 3500);
      return;
    }

    const defaultCost = 150;
    const newEdge = {
      ...connection,
      id: `e-${connection.source}-${connection.target}-${Date.now()}`,
      type: 'cableEdge',
      data: {
        cost: defaultCost,
        isExisting: false,
        isOptimal: false,
        isRedundant: false
      }
    };

    set({
      edges: addEdge(newEdge, get().edges),
      isOptimized: false,
      optimizationResult: null
    });
  },

  // Node Mutations
  addBuilding: ({ label, isExisting = false, networkCluster = 'Main Campus', icon = 'building', position }) => {
    const id = `node-${Date.now()}`;
    const defaultPos = position || {
      x: 200 + Math.random() * 200,
      y: 150 + Math.random() * 200
    };

    const newNode = {
      id,
      type: 'buildingNode',
      position: defaultPos,
      data: {
        label: label || `Building ${get().nodes.length + 1}`,
        isExisting,
        networkCluster: networkCluster || (isExisting ? 'Existing Quad' : 'New Expansion'),
        icon
      }
    };

    set({
      nodes: [...get().nodes, newNode],
      isOptimized: false,
      optimizationResult: null
    });
    return newNode;
  },

  updateBuilding: (id, partialData) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...partialData } } : n
      ),
      isOptimized: false,
      optimizationResult: null
    });
  },

  removeBuilding: (id) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      isOptimized: false,
      optimizationResult: null
    });
  },

  // Edge Mutations
  updateCable: (id, partialData) => {
    set({
      edges: get().edges.map((e) =>
        e.id === id ? { ...e, data: { ...e.data, ...partialData } } : e
      ),
      isOptimized: false,
      optimizationResult: null,
      activeEdgeForEdit: null
    });
  },

  removeCable: (id) => {
    set({
      edges: get().edges.filter((e) => e.id !== id),
      isOptimized: false,
      optimizationResult: null
    });
  },

  setActiveEdgeForEdit: (edge) => set({ activeEdgeForEdit: edge }),
  setIsBOMModalOpen: (isOpen) => set({ isBOMModalOpen: isOpen }),
  clearErrorBanner: () => set({ errorBanner: null }),

  // Optimization Execution
  runOptimization: async (triggerConfetti = true) => {
    const { nodes, edges, budget, engine } = get();

    if (nodes.length < 2) {
      set({ errorBanner: 'Please add at least 2 buildings to optimize the campus network.' });
      setTimeout(() => set({ errorBanner: null }), 3500);
      return;
    }

    set({ isOptimizing: true, errorBanner: null });

    try {
      const result = await optimizeNetwork({ nodes, edges, budget, engine });

      // Build lookup map for optimal and redundant edge status
      const optimalIds = new Set(result.selectedEdges.map((e) => e.id));
      const redundantIds = new Set(result.redundantEdges.map((e) => e.id));
      const expensiveIds = new Set(
        (result.budgetStatus?.expensiveEdges || []).map((e) => e.id)
      );

      // Update edges with visual styling tags
      const updatedEdges = edges.map((edge) => {
        const isOpt = optimalIds.has(edge.id);
        const isRed = redundantIds.has(edge.id);
        const isExp = expensiveIds.has(edge.id) && result.budgetStatus?.isOverBudget;
        return {
          ...edge,
          data: {
            ...edge.data,
            isOptimal: isOpt,
            isRedundant: isRed,
            isOverBudget: isExp
          }
        };
      });

      // Update nodes to flag isolated ones
      const isolatedSet = new Set(result.isolatedNodes || []);
      const updatedNodes = nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isIsolated: isolatedSet.has(node.id)
        }
      }));

      set({
        nodes: updatedNodes,
        edges: updatedEdges,
        optimizationResult: result,
        isOptimized: true,
        isOptimizing: false,
        errorBanner: result.warning || null
      });

      // Fire celebratory confetti if fully connected and within budget
      if (triggerConfetti && result.isConnected && !result.budgetStatus?.isOverBudget) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
      set({
        isOptimizing: false,
        errorBanner: `Optimization failed: ${err.message}`
      });
    }
  },

  // Reset or Load Presets
  resetNetwork: () => {
    set({
      nodes: [],
      edges: [],
      isOptimized: false,
      optimizationResult: null,
      errorBanner: null
    });
  },

  loadPreset: (presetKey) => {
    const preset = PRESETS[presetKey] || PRESETS.standard;
    set({
      nodes: preset.nodes.map((n) => ({ ...n, data: { ...n.data, isIsolated: false } })),
      edges: preset.edges.map((e) => ({
        ...e,
        data: { ...e.data, isOptimal: false, isRedundant: false, isOverBudget: false }
      })),
      budget: preset.budget,
      isOptimized: false,
      optimizationResult: null,
      errorBanner: null
    });
  },

  importTopology: (importedData) => {
    try {
      if (!importedData.nodes || !importedData.edges) {
        throw new Error('Invalid JSON format: missing nodes or edges.');
      }
      set({
        nodes: importedData.nodes,
        edges: importedData.edges,
        budget: importedData.budget || 2000,
        isOptimized: false,
        optimizationResult: null,
        errorBanner: null
      });
    } catch (err) {
      set({ errorBanner: `Failed to import topology: ${err.message}` });
    }
  }
}));
