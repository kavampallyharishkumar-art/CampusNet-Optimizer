/**
 * Exports current campus network topology and optimization results to a JSON file.
 */
export function exportTopologyJSON(nodes, edges, optimizationResult) {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    nodes,
    edges,
    optimizationResult
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `campusnet-topology-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Generates an itemized Bill of Materials (BOM) summary text for download.
 */
export function exportBOMReport(nodes, edges, optimizationResult) {
  if (!optimizationResult) return;

  const nodeMap = new Map(nodes.map(n => [n.id, n.data?.label || n.id]));
  const { selectedEdges, redundantEdges, totalCost, totalProposedCost, costSavings, budgetStatus } = optimizationResult;

  let report = `==========================================================\n`;
  report += `   CAMPUSNET OPTIMIZER - NETWORK EXPANSION REPORT        \n`;
  report += `==========================================================\n`;
  report += `Generated: ${new Date().toLocaleString()}\n\n`;

  report += `--- EXECUTIVE SUMMARY ---\n`;
  report += `Optimized MST Cable Cost: $${totalCost.toLocaleString()}\n`;
  report += `All Proposed Routes Cost: $${totalProposedCost.toLocaleString()}\n`;
  report += `Total Capital Savings:    $${costSavings.toLocaleString()} (${optimizationResult.savingsPercentage}% reduction)\n`;
  if (budgetStatus?.budget) {
    report += `Budget Limit:             $${budgetStatus.budget.toLocaleString()}\n`;
    report += `Budget Compliance:        ${budgetStatus.isOverBudget ? `OVER BUDGET by $${budgetStatus.deficit.toLocaleString()}` : 'WITHIN BUDGET'}\n`;
  }
  report += `\n`;

  report += `--- SELECTED OPTIMAL CABLE RUNS (${selectedEdges.length}) ---\n`;
  selectedEdges.forEach((edge, index) => {
    const src = nodeMap.get(edge.source) || edge.source;
    const tgt = nodeMap.get(edge.target) || edge.target;
    report += `${index + 1}. [RUN-${edge.id}] ${src} <---> ${tgt} : $${edge.cost.toLocaleString()}\n`;
  });
  report += `\n`;

  if (redundantEdges && redundantEdges.length > 0) {
    report += `--- DISCARDED REDUNDANT ROUTES (${redundantEdges.length}) ---\n`;
    redundantEdges.forEach((edge, index) => {
      const src = nodeMap.get(edge.source) || edge.source;
      const tgt = nodeMap.get(edge.target) || edge.target;
      report += `${index + 1}. [DISCARDED] ${src} <---> ${tgt} (Cost: $${edge.cost.toLocaleString()})\n`;
    });
    report += `\n`;
  }

  report += `==========================================================\n`;
  report += `End of Report - CampusNet Optimizer Engine\n`;

  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `campusnet-expansion-report-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
