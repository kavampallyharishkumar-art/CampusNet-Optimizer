import React from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Canvas } from './components/Canvas.jsx';
import { EdgeModal } from './components/EdgeModal.jsx';
import { CostBreakdownModal } from './components/CostBreakdownModal.jsx';

export default function App() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#070b14] text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Workspace: Sidebar + Canvas */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 h-full relative">
          <Canvas />
        </main>
      </div>

      {/* Interactive Modals */}
      <EdgeModal />
      <CostBreakdownModal />
    </div>
  );
}
