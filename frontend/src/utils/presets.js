export const PRESETS = {
  standard: {
    name: 'Engineering & Sciences Quad',
    description: 'Core campus quad with dense redundant loops. Perfect for showing 40%+ cable cost savings.',
    budget: 1500,
    nodes: [
      {
        id: 'node-admin',
        type: 'buildingNode',
        position: { x: 250, y: 100 },
        data: { label: 'Main Admin & Data Center', isExisting: true, networkCluster: 'Main Quad', icon: 'server' }
      },
      {
        id: 'node-library',
        type: 'buildingNode',
        position: { x: 100, y: 280 },
        data: { label: 'Central Library', isExisting: true, networkCluster: 'Main Quad', icon: 'book' }
      },
      {
        id: 'node-cs',
        type: 'buildingNode',
        position: { x: 450, y: 260 },
        data: { label: 'Computer Science Complex', isExisting: false, networkCluster: 'New Expansion', icon: 'laptop' }
      },
      {
        id: 'node-biotech',
        type: 'buildingNode',
        position: { x: 220, y: 440 },
        data: { label: 'Biotech Innovation Labs', isExisting: false, networkCluster: 'New Expansion', icon: 'flask' }
      },
      {
        id: 'node-dorms',
        type: 'buildingNode',
        position: { x: 500, y: 450 },
        data: { label: 'Student Residence Hall A', isExisting: false, networkCluster: 'New Expansion', icon: 'home' }
      }
    ],
    edges: [
      { id: 'e-admin-lib', source: 'node-admin', target: 'node-library', type: 'cableEdge', data: { cost: 120, isExisting: true } },
      { id: 'e-admin-cs', source: 'node-admin', target: 'node-cs', type: 'cableEdge', data: { cost: 240, isExisting: false } },
      { id: 'e-lib-cs', source: 'node-library', target: 'node-cs', type: 'cableEdge', data: { cost: 380, isExisting: false } },
      { id: 'e-lib-bio', source: 'node-library', target: 'node-biotech', type: 'cableEdge', data: { cost: 200, isExisting: false } },
      { id: 'e-cs-dorms', source: 'node-cs', target: 'node-dorms', type: 'cableEdge', data: { cost: 190, isExisting: false } },
      { id: 'e-bio-dorms', source: 'node-biotech', target: 'node-dorms', type: 'cableEdge', data: { cost: 290, isExisting: false } },
      { id: 'e-admin-bio', source: 'node-admin', target: 'node-biotech', type: 'cableEdge', data: { cost: 420, isExisting: false } }
    ]
  },

  bifurcated: {
    name: 'Dual Campus Bridge (North & South)',
    description: 'Two pre-existing clusters across a highway. Tests finding the cheapest high-speed bridge link.',
    budget: 1200,
    nodes: [
      {
        id: 'n-north-hub',
        type: 'buildingNode',
        position: { x: 140, y: 120 },
        data: { label: 'North Campus Hub', isExisting: true, networkCluster: 'North Hub', icon: 'server' }
      },
      {
        id: 'n-north-eng',
        type: 'buildingNode',
        position: { x: 140, y: 320 },
        data: { label: 'North Engineering', isExisting: true, networkCluster: 'North Hub', icon: 'laptop' }
      },
      {
        id: 'n-south-admin',
        type: 'buildingNode',
        position: { x: 550, y: 120 },
        data: { label: 'South Administration', isExisting: true, networkCluster: 'South Hub', icon: 'server' }
      },
      {
        id: 'n-south-med',
        type: 'buildingNode',
        position: { x: 550, y: 320 },
        data: { label: 'South Medical School', isExisting: true, networkCluster: 'South Hub', icon: 'flask' }
      },
      {
        id: 'n-new-stadium',
        type: 'buildingNode',
        position: { x: 350, y: 460 },
        data: { label: 'New Athletics Pavilion', isExisting: false, networkCluster: 'New Expansion', icon: 'trophy' }
      }
    ],
    edges: [
      { id: 'e-north-internal', source: 'n-north-hub', target: 'n-north-eng', type: 'cableEdge', data: { cost: 100, isExisting: true } },
      { id: 'e-south-internal', source: 'n-south-admin', target: 'n-south-med', type: 'cableEdge', data: { cost: 100, isExisting: true } },
      { id: 'e-bridge-top', source: 'n-north-hub', target: 'n-south-admin', type: 'cableEdge', data: { cost: 850, isExisting: false } },
      { id: 'e-bridge-mid', source: 'n-north-eng', target: 'n-south-med', type: 'cableEdge', data: { cost: 620, isExisting: false } },
      { id: 'e-eng-stadium', source: 'n-north-eng', target: 'n-new-stadium', type: 'cableEdge', data: { cost: 350, isExisting: false } },
      { id: 'e-med-stadium', source: 'n-south-med', target: 'n-new-stadium', type: 'cableEdge', data: { cost: 280, isExisting: false } }
    ]
  },

  disconnected: {
    name: 'Stranded Node Edge-Case Demo',
    description: 'An isolated Observatory building with no cable path drawn. Demonstrates proactive error trapping.',
    budget: 900,
    nodes: [
      {
        id: 'iso-hall-a',
        type: 'buildingNode',
        position: { x: 180, y: 150 },
        data: { label: 'Arts & Humanities', isExisting: true, networkCluster: 'Central', icon: 'book' }
      },
      {
        id: 'iso-hall-b',
        type: 'buildingNode',
        position: { x: 420, y: 150 },
        data: { label: 'Social Sciences', isExisting: false, networkCluster: 'Central', icon: 'building' }
      },
      {
        id: 'iso-remote',
        type: 'buildingNode',
        position: { x: 620, y: 350 },
        data: { label: 'Hilltop Observatory (Isolated)', isExisting: false, networkCluster: 'Remote', icon: 'satellite' }
      }
    ],
    edges: [
      { id: 'e-arts-soc', source: 'iso-hall-a', target: 'iso-hall-b', type: 'cableEdge', data: { cost: 220, isExisting: false } }
    ]
  }
};
