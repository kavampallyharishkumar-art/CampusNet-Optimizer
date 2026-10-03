import express from 'express';
import { solveCampusMST } from '../algorithms/kruskal.js';

const router = express.Router();

/**
 * POST /api/optimize
 * Payload:
 * {
 *   nodes: [{ id: "A", name: "Admin", isExisting: true, networkCluster?: "North" }],
 *   edges: [{ id: "e1", source: "A", target: "B", cost: 150, isExisting?: false }],
 *   budget?: 1000
 * }
 */
router.post('/optimize', (req, res) => {
  try {
    const { nodes, edges, budget } = req.body;

    if (!nodes || !Array.isArray(nodes)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input: "nodes" must be an array.'
      });
    }

    if (!edges || !Array.isArray(edges)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input: "edges" must be an array.'
      });
    }

    const result = solveCampusMST({
      nodes,
      edges,
      budget: budget ? Number(budget) : null
    });

    return res.json(result);
  } catch (err) {
    console.error('Error calculating MST:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while computing network optimization.',
      details: err.message
    });
  }
});

export default router;
