import { useState } from "react";
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';

function RiskGraph() {

    const [nodes, setNodes] = useState([
        {
            id: "1",
            position: { x: 250, y: 0 },
            data: { label: "🟢 Okta (30)" },
            type: "input"
        },

        {
            id: "2",
            position: { x: 250, y: 150 },
            data: { label: "🟡 Identity Service (55)" }
        },

        {
            id: "3",
            position: { x: 250, y: 300 },
            data: { label: "🟠 Login API (75)" }
        },

        {
            id: "4",
            position: { x: 250, y: 450 },
            data: { label: "🔴 Customer Portal (90)" }
        }
    ]);
    const simulateBreach = () => {

        setNodes([
            {
                id: "1",
                position: { x: 250, y: 0 },
                data: { label: "🔴 Okta (90)" },
                type: "input"
            },

            {
                id: "2",
                position: { x: 250, y: 150 },
                data: { label: "🔴 Identity Service (82)" }
            },

            {
                id: "3",
                position: { x: 250, y: 300 },
                data: { label: "🔴 Login API (88)" }
            },

            {
                id: "4",
                position: { x: 250, y: 450 },
                data: { label: "🔴 Customer Portal (92)" }
            }
        ]);
    };


    const edges = [
        {
            id: "e1-2",
            source: "1",
            target: "2"
        },

        {
            id: "e2-3",
            source: "2",
            target: "3"
        },

        {
            id: "e3-4",
            source: "3",
            target: "4"
        }
    ];

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <button onClick={simulateBreach}>Simulate Vendor Breach</button>
            <ReactFlow
                nodes={nodes}
                edges={edges}
            />
        </div>
    );
}

export default RiskGraph;