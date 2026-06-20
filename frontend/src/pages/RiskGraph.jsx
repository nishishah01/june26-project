import React, { useState } from "react";
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, RotateCcw, AlertOctagon } from "lucide-react";

function RiskGraph() {
  const nodeStyle = (colorBorder, isDanger = false) => ({
    background: "var(--bg-card)",
    color: "var(--text-primary)",
    border: `1px solid ${colorBorder}`,
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "13px",
    fontWeight: "600",
    boxShadow: isDanger 
      ? "0 4px 12px rgba(239, 68, 68, 0.15)" 
      : "var(--shadow-sm)",
    transition: "all 0.3s ease",
    width: 200,
    textAlign: "center"
  });

  const getInitialNodes = () => [
    {
      id: "1",
      position: { x: 250, y: 30 },
      data: { label: "🟢 Stripe (Vendor) (Risk: 30)" },
      type: "input",
      style: nodeStyle("var(--success)")
    },
    {
      id: "2",
      position: { x: 250, y: 160 },
      data: { label: "🟡 Payment Service (Application) (Risk: 55)" },
      style: nodeStyle("var(--warning)")
    },
    {
      id: "3",
      position: { x: 250, y: 290 },
      data: { label: "🟡 Zombie API (Risk: 40)" },
      style: nodeStyle("var(--warning)")
    },
    {
      id: "4",
      position: { x: 250, y: 420 },
      data: { label: "🟢 Customer Portal (Business Unit) (Risk: 30)" },
      style: nodeStyle("var(--success)")
    }
  ];

  const [nodes, setNodes] = useState(getInitialNodes());
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateBreach = () => {
    setIsSimulating(true);
    setNodes([
      {
        id: "1",
        position: { x: 250, y: 30 },
        data: { label: "💥 Stripe (Vendor - Compromised) (Risk: 95)" },
        type: "input",
        style: nodeStyle("var(--danger)", true)
      },
      {
        id: "2",
        position: { x: 250, y: 160 },
        data: { label: "🔴 Payment Service (Risk: 80)" },
        style: nodeStyle("var(--danger)", true)
      },
      {
        id: "3",
        position: { x: 250, y: 290 },
        data: { label: "🔴 Shadow API Risk (Risk: 95)" },
        style: nodeStyle("var(--danger)", true)
      },
      {
        id: "4",
        position: { x: 250, y: 420 },
        data: { label: "🔴 Customer Portal (Risk: 72)" },
        style: nodeStyle("var(--danger)", true)
      }
    ]);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setNodes(getInitialNodes());
  };

  const edges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      style: { stroke: isSimulating ? "var(--danger)" : "var(--primary)", strokeWidth: 2 }
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      animated: true,
      style: { stroke: isSimulating ? "var(--danger)" : "var(--primary)", strokeWidth: 2 }
    },
    {
      id: "e3-4",
      source: "3",
      target: "4",
      animated: true,
      style: { stroke: isSimulating ? "var(--danger)" : "var(--primary)", strokeWidth: 2 }
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
      {/* Simulation Controls Header */}
      <div 
        className="panel-card" 
        style={{ 
          marginBottom: "20px", 
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertOctagon size={18} className={isSimulating ? "text-danger" : "text-primary"} />
            API Breach Cascade Simulator
          </h3>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Simulate how a compromise on an API or vendor propagates down the service dependencies.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {!isSimulating ? (
            <button className="simulation-btn" onClick={simulateBreach}>
              <Play size={14} /> Simulate API Breach
            </button>
          ) : (
            <button 
              className="simulation-btn" 
              onClick={resetSimulation} 
              style={{ background: "var(--bg-pill)", color: "var(--text-primary)", border: "1px solid var(--border-color)", boxShadow: "none" }}
            >
              <RotateCcw size={14} /> Reset Network
            </button>
          )}
        </div>
      </div>

      {/* Network Canvas */}
      <div 
        style={{ 
          flexGrow: 1, 
          background: "var(--bg-sidebar)", 
          borderRadius: "16px", 
          border: "1px solid var(--border-color)",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
        >
          <Background color="#1e293b" gap={16} size={1} />
          <Controls 
            style={{ 
              background: "var(--bg-card)", 
              border: "1px solid var(--border-color)", 
              borderRadius: "8px", 
              boxShadow: "var(--shadow-sm)",
              buttonColor: "var(--text-primary)"
            }} 
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export default RiskGraph;