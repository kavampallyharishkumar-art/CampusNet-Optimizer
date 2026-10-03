import { DSU } from './dsu.js';

/**
 * Kruskal's Minimum Spanning Tree algorithm adapted for campus network expansion.
 * Can be run in browser or Node.js.
 */
export function solveCampusMST({ nodes = [], edges = [], budget = null }) {
  if (!nodes || nodes.length === 0) {
    return {
      success: true,
      selectedEdges: [],
      redundantEdges: [],
      existingEdges: [],
      totalCost: 0,
      totalProposedCost: 0,
      costSavings: 0,
      savingsPercentage: 0,
      isConnected: true,
      isolatedNodes: [],
      components: [],
      budgetStatus: { budget, isOverBudget: false, deficit: 0, warning: null }
    };
  }

  const nodeIds = nodes.map(n => n.id);
  const dsu = new DSU(nodeIds);

  // Group existing nodes by cluster (e.g., "North Campus", "South Campus")
  const clusterMap = new Map();
  for (const node of nodes) {
    if (node.isExisting || node.data?.isExisting) {
      const cluster = node.networkCluster || node.data?.networkCluster || 'default-existing';
      if (!clusterMap.has(cluster)) {
        clusterMap.set(cluster, []);
      }
      clusterMap.get(cluster).push(node.id);
    }
  }

  // Pre-union nodes within the same existing cluster
  for (const [cluster, members] of clusterMap.entries()) {
    if (members.length > 1) {
      const first = members[0];
      for (let i = 1; i < members.length; i++) {
        dsu.union(first, members[i]);
      }
    }
  }

  // Separate pre-existing cables from proposed expansion cables
  const existingEdges = [];
  const proposedEdges = [];

  for (const edge of edges) {
    const cost = Number(edge.cost ?? edge.data?.cost) || 0;
    const isExisting = Boolean(edge.isExisting || edge.data?.isExisting);
    const formattedEdge = {
      ...edge,
      cost,
      source: String(edge.source),
      target: String(edge.target),
      isExisting
    };

    if (isExisting) {
      existingEdges.push(formattedEdge);
      dsu.union(formattedEdge.source, formattedEdge.target);
    } else {
      proposedEdges.push(formattedEdge);
    }
  }

  // Sort proposed candidate edges by cost ascending
  proposedEdges.sort((a, b) => a.cost - b.cost);

  const selectedEdges = [];
  const redundantEdges = [];
  let totalCost = 0;
  let totalProposedCost = 0;

  for (const edge of proposedEdges) {
    totalProposedCost += edge.cost;

    if (!dsu.isConnected(edge.source, edge.target)) {
      dsu.union(edge.source, edge.target);
      selectedEdges.push({
        ...edge,
        isOptimal: true
      });
      totalCost += edge.cost;
    } else {
      redundantEdges.push({
        ...edge,
        isOptimal: false,
        isRedundant: true
      });
    }
  }

  // Check component connectivity
  const componentMap = dsu.getComponents();
  const components = Array.from(componentMap.values());
  const isConnected = components.length <= 1;

  let isolatedNodes = [];
  let mainComponent = [];

  if (!isConnected) {
    let maxComp = [];
    for (const comp of components) {
      if (comp.length > maxComp.length) {
        maxComp = comp;
      }
    }
    mainComponent = maxComp;
    isolatedNodes = nodeIds.filter(id => !mainComponent.includes(id));
  }

  // Budget status evaluation
  let isOverBudget = false;
  let deficit = 0;
  let expensiveEdges = [];

  if (budget !== null && budget !== undefined && budget > 0) {
    if (totalCost > budget) {
      isOverBudget = true;
      deficit = totalCost - budget;
      expensiveEdges = [...selectedEdges]
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 3);
    }
  }

  const costSavings = Math.max(0, totalProposedCost - totalCost);
  const savingsPercentage = totalProposedCost > 0
    ? Math.round((costSavings / totalProposedCost) * 100)
    : 0;

  return {
    success: true,
    selectedEdges,
    redundantEdges,
    existingEdges,
    totalCost,
    totalProposedCost,
    costSavings,
    savingsPercentage,
    isConnected,
    isolatedNodes,
    components,
    mainComponent,
    warning: !isConnected
      ? `Disconnected Network: ${isolatedNodes.length} building(s) [${isolatedNodes.join(', ')}] cannot be reached. Please add additional cable routes.`
      : null,
    budgetStatus: {
      budget: budget || null,
      isOverBudget,
      deficit,
      expensiveEdges,
      warning: isOverBudget
        ? `Budget exceeded by $${deficit.toLocaleString()}! MST Total: $${totalCost.toLocaleString()} (Cap: $${budget.toLocaleString()}).`
        : null
    }
  };
}
