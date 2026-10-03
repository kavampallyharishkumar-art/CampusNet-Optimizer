import { solveCampusMST } from '../algorithms/kruskal.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Executes MST optimization using either the Backend API or Client-side DSU engine.
 * 
 * @param {Object} params
 * @param {Array} params.nodes
 * @param {Array} params.edges
 * @param {number} params.budget
 * @param {'backend' | 'client'} [params.engine='client']
 */
export async function optimizeNetwork({ nodes, edges, budget, engine = 'client' }) {
  if (engine === 'client') {
    // Pure client-side zero-latency computation
    return solveCampusMST({ nodes, edges, budget });
  }

  // Attempt backend API call
  try {
    const response = await fetch(`${API_BASE_URL}/optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nodes: nodes.map(n => ({
          id: n.id,
          name: n.data?.label || n.id,
          isExisting: Boolean(n.data?.isExisting),
          networkCluster: n.data?.networkCluster || 'default'
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          cost: Number(e.data?.cost || 0),
          isExisting: Boolean(e.data?.isExisting)
        })),
        budget: Number(budget) || null
      })
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Backend API request failed, seamlessly falling back to client-side DSU engine:', error);
    // Graceful fallback to client-side engine with fallback flag
    const clientResult = solveCampusMST({ nodes, edges, budget });
    return {
      ...clientResult,
      fallbackUsed: true,
      backendError: error.message
    };
  }
}

/**
 * Checks if the backend API server is online.
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}
