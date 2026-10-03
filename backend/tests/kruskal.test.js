import assert from 'node:assert';
import { solveCampusMST } from '../src/algorithms/kruskal.js';

console.log('🧪 Starting Kruskal & DSU algorithm test suite...\n');

// Test 1: Simple Triangle Graph
{
  const nodes = [
    { id: 'A', name: 'Admin', isExisting: false },
    { id: 'B', name: 'Library', isExisting: false },
    { id: 'C', name: 'Dorm', isExisting: false }
  ];
  const edges = [
    { id: 'e1', source: 'A', target: 'B', cost: 100 },
    { id: 'e2', source: 'B', target: 'C', cost: 150 },
    { id: 'e3', source: 'A', target: 'C', cost: 200 }
  ];

  const result = solveCampusMST({ nodes, edges });
  assert.strictEqual(result.totalCost, 250, 'Total cost should be 100 + 150 = 250');
  assert.strictEqual(result.selectedEdges.length, 2, 'Should pick exactly 2 edges for 3 nodes');
  assert.strictEqual(result.redundantEdges.length, 1, 'Should have 1 redundant edge');
  assert.strictEqual(result.isConnected, true, 'Graph should be connected');
  assert.strictEqual(result.costSavings, 200, 'Savings should be 200 (200 - redundant e3)');
  console.log('✅ Test 1: Simple Triangle Graph passed!');
}

// Test 2: Existing Network Nodes (Pre-Union)
{
  const nodes = [
    { id: 'A', name: 'Admin', isExisting: true },
    { id: 'B', name: 'Library', isExisting: true },
    { id: 'C', name: 'New Science Hall', isExisting: false }
  ];
  // A and B already connected, proposed edges to C
  const edges = [
    { id: 'e1', source: 'A', target: 'B', cost: 500, isExisting: true },
    { id: 'e2', source: 'A', target: 'C', cost: 120 },
    { id: 'e3', source: 'B', target: 'C', cost: 80 }
  ];

  const result = solveCampusMST({ nodes, edges });
  // Since A and B are already connected, we only need to connect C to B (cost 80)
  assert.strictEqual(result.totalCost, 80, 'Only new edge to C should be counted');
  assert.strictEqual(result.selectedEdges.length, 1, 'Should select only 1 edge (B->C)');
  assert.strictEqual(result.selectedEdges[0].id, 'e3', 'Should select cheapest edge e3');
  assert.strictEqual(result.isConnected, true, 'All 3 nodes should be connected');
  console.log('✅ Test 2: Existing Network Pre-Union passed!');
}

// Test 3: Disconnected / Isolated Node Edge Case
{
  const nodes = [
    { id: 'A', name: 'Admin', isExisting: false },
    { id: 'B', name: 'Library', isExisting: false },
    { id: 'Isolated', name: 'Far Observatory', isExisting: false }
  ];
  const edges = [
    { id: 'e1', source: 'A', target: 'B', cost: 100 }
    // No edges to 'Isolated'
  ];

  const result = solveCampusMST({ nodes, edges });
  assert.strictEqual(result.isConnected, false, 'Graph should be marked disconnected');
  assert.strictEqual(result.isolatedNodes.length, 1, 'Should detect 1 isolated node');
  assert.strictEqual(result.isolatedNodes[0], 'Isolated', 'Isolated node should be "Isolated"');
  assert.ok(result.warning.includes('Isolated'), 'Warning should mention Isolated building');
  console.log('✅ Test 3: Disconnected Node Detection passed!');
}

// Test 4: Multiple Existing Clusters (e.g. North and South Campus)
{
  const nodes = [
    { id: 'N1', name: 'North Admin', isExisting: true, networkCluster: 'North' },
    { id: 'N2', name: 'North Lab', isExisting: true, networkCluster: 'North' },
    { id: 'S1', name: 'South Hall', isExisting: true, networkCluster: 'South' },
    { id: 'S2', name: 'South Gym', isExisting: true, networkCluster: 'South' }
  ];
  const edges = [
    { id: 'bridge1', source: 'N2', target: 'S1', cost: 300 },
    { id: 'bridge2', source: 'N1', target: 'S2', cost: 450 }
  ];

  const result = solveCampusMST({ nodes, edges });
  assert.strictEqual(result.selectedEdges.length, 1, 'Should select exactly one bridge between clusters');
  assert.strictEqual(result.selectedEdges[0].id, 'bridge1', 'Should select cheaper bridge');
  assert.strictEqual(result.totalCost, 300, 'Cost should be 300');
  assert.strictEqual(result.isConnected, true, 'Both clusters should now be connected');
  console.log('✅ Test 4: Multi-Cluster Pre-Union passed!');
}

// Test 5: Budget Constraint Evaluation
{
  const nodes = [
    { id: 'A', name: 'Admin' },
    { id: 'B', name: 'Science' },
    { id: 'C', name: 'Arts' }
  ];
  const edges = [
    { id: 'e1', source: 'A', target: 'B', cost: 600 },
    { id: 'e2', source: 'B', target: 'C', cost: 800 }
  ];
  const budget = 1000;

  const result = solveCampusMST({ nodes, edges, budget });
  assert.strictEqual(result.totalCost, 1400);
  assert.strictEqual(result.budgetStatus.isOverBudget, true);
  assert.strictEqual(result.budgetStatus.deficit, 400);
  assert.strictEqual(result.budgetStatus.expensiveEdges[0].id, 'e2');
  console.log('✅ Test 5: Budget Constraint Detection passed!');
}

console.log('\n🎉 ALL KRUSKAL ALGORITHM & DSU TESTS PASSED SUCCESSFULLY!');
