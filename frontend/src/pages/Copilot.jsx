import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { 
  Send, 
  Brain, 
  Terminal, 
  Activity, 
  CheckCircle, 
  Server, 
  BookOpen, 
  Cpu, 
  ShieldAlert, 
  HelpCircle,
  Clock,
  Calendar,
  AlertTriangle,
  Play
} from "lucide-react";

// Helper to parse the LLM's structured report
function parseReport(text) {
  const sections = [
    "Executive Summary",
    "Evidence",
    "Root Cause Analysis",
    "Enterprise Dependency Analysis",
    "Risk Propagation",
    "Critical Applications",
    "Critical APIs",
    "Affected Business Units",
    "Immediate Actions (0-24 hrs)",
    "Short-Term Actions (7 Days)",
    "Long-Term Actions (30 Days)",
    "Priority",
    "Confidence"
  ];
  
  const result = {};
  let currentSection = "Introduction";
  let currentContent = [];
  
  const lines = text.split("\n");
  for (let line of lines) {
    let matchedSection = null;
    const cleanLine = line.trim().replace(/^[-*#\s:]+|[-*#\s:]+$/g, '');
    
    for (let sec of sections) {
      if (cleanLine.toLowerCase() === sec.toLowerCase() || 
          cleanLine.toLowerCase().startsWith(sec.toLowerCase() + ":") ||
          line.trim().startsWith("### " + sec) ||
          line.trim().startsWith("**" + sec + "**")) {
        matchedSection = sec;
        break;
      }
    }
    
    if (matchedSection) {
      if (currentContent.length > 0) {
        result[currentSection] = currentContent.join("\n").trim();
      }
      currentSection = matchedSection;
      currentContent = [];
      
      // Extract content if colon exists on the header line
      if (line.includes(":")) {
        const afterColon = line.split(":").slice(1).join(":").trim();
        if (afterColon) {
          currentContent.push(afterColon);
        }
      }
    } else {
      currentContent.push(line);
    }
  }
  
  if (currentContent.length > 0) {
    result[currentSection] = currentContent.join("\n").trim();
  }
  
  return result;
}

function Copilot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [generating, setGenerating] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch suggested questions on mount
    api.get("/ai/suggested/")
      .then((res) => setSuggestedQuestions(res.data || []))
      .catch((err) => console.error("Error fetching suggestions:", err));

    // Fetch system stats on mount
    api.get("/ai/status/")
      .then((res) => setSystemStats(res.data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  // Scroll to bottom whenever messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, generating]);

  const handleSend = async (textToSend) => {
    if (!textToSend.trim() || generating) return;

    const userMessage = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setGenerating(true);

    try {
      const response = await api.post("/ai/ask/", { question: textToSend });
      const botMessage = {
        sender: "assistant",
        text: response.data.answer || "No response received.",
        intent: response.data.intent
      };
      setMessages((prev) => [...prev, botMessage]);

      // Refresh system status as new queries might change active/FAISS counts
      api.get("/ai/status/")
        .then((res) => setSystemStats(res.data))
        .catch((err) => console.error(err));
    } catch (error) {
      console.error("Error communicating with AI:", error);
      setMessages((prev) => [
        ...prev,
        { 
          sender: "assistant", 
          text: `An error occurred while generating report: ${error.response?.data?.error || error.message}` 
        }
      ]);
    } finally {
      setGenerating(false);
    }
  };

  const getConfidenceBadgeClass = (conf) => {
    switch (conf?.toLowerCase()?.trim()) {
      case "high":
      case "very high":
        return "badge-high-conf";
      case "medium":
        return "badge-med-conf";
      default:
        return "badge-low-conf";
    }
  };

  const renderReportDashboard = (text) => {
    const reportData = parseReport(text);
    const sectionsExist = Object.keys(reportData).some(key => key !== "Introduction" && key !== "General");

    if (!sectionsExist) {
      return (
        <div style={{ whiteSpace: "pre-line" }}>
          {text}
        </div>
      );
    }

    // Extract Priority & Confidence
    const priority = reportData["Priority"] || "Medium";
    const confidence = reportData["Confidence"] || "High";

    return (
      <div className="structured-report">
        <div className="report-title">
          <Brain size={24} className="logo-glow" />
          <span>Risk Intelligence Analysis Report</span>
        </div>

        {/* Top Badges Area */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div className="report-badge" style={{ background: "var(--bg-pill)", border: "1px solid var(--border-color)" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>Priority:</span>
            <span style={{ 
              fontWeight: 700, 
              marginLeft: "4px",
              color: priority.toLowerCase().includes("high") || priority.toLowerCase().includes("critical") ? "var(--danger)" : "var(--warning)"
            }}>{priority}</span>
          </div>

          <div className={`report-badge ${getConfidenceBadgeClass(confidence)}`}>
            <span>Confidence: {confidence}</span>
          </div>
        </div>

        {/* Executive Summary Section */}
        {reportData["Executive Summary"] && (
          <div className="report-section" style={{ borderLeft: "4px solid var(--primary)", background: "rgba(139, 92, 246, 0.03)" }}>
            <div className="report-section-title" style={{ color: "var(--primary-hover)" }}>Executive Summary</div>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: 500 }}>{reportData["Executive Summary"]}</p>
          </div>
        )}

        {/* Two Column Grid for Evidence & Root Cause */}
        <div className="grid-2" style={{ marginBottom: "16px" }}>
          {reportData["Evidence"] && (
            <div className="report-section" style={{ margin: 0 }}>
              <div className="report-section-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldAlert size={14} className="text-warning" />
                Evidence & Findings
              </div>
              <div style={{ whiteSpace: "pre-line" }}>{reportData["Evidence"]}</div>
            </div>
          )}

          {reportData["Root Cause Analysis"] && (
            <div className="report-section" style={{ margin: 0 }}>
              <div className="report-section-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <AlertTriangle size={14} className="text-danger" />
                Root Cause Analysis
              </div>
              <div style={{ whiteSpace: "pre-line" }}>{reportData["Root Cause Analysis"]}</div>
            </div>
          )}
        </div>

        {/* Propagation & Dependencies */}
        {(reportData["Enterprise Dependency Analysis"] || reportData["Risk Propagation"]) && (
          <div className="report-section">
            <div className="report-section-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Activity size={14} className="text-success" />
              Risk Propagation & Downstream Impact
            </div>
            {reportData["Risk Propagation"] && (
              <div style={{ marginBottom: "12px", whiteSpace: "pre-line" }}>
                {reportData["Risk Propagation"]}
              </div>
            )}
            {reportData["Enterprise Dependency Analysis"] && (
              <div style={{ fontSize: "13px", padding: "10px", background: "var(--bg-app)", borderRadius: "8px", border: "1px solid var(--border-color)", fontFamily: "var(--mono)" }}>
                {reportData["Enterprise Dependency Analysis"]}
              </div>
            )}
          </div>
        )}

        {/* Affected Entities */}
        {(reportData["Critical Applications"] || reportData["Critical APIs"] || reportData["Affected Business Units"]) && (
          <div className="report-section">
            <div className="report-section-title">Downstream Vulnerability Mapping</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {reportData["Critical Applications"] && (
                <div>
                  <strong>Applications:</strong> <span style={{ color: "var(--text-secondary)" }}>{reportData["Critical Applications"]}</span>
                </div>
              )}
              {reportData["Critical APIs"] && (
                <div>
                  <strong>APIs Affected:</strong> <span style={{ color: "var(--text-secondary)" }}>{reportData["Critical APIs"]}</span>
                </div>
              )}
              {reportData["Affected Business Units"] && (
                <div>
                  <strong>Affected BUs:</strong> <span style={{ color: "var(--text-secondary)" }}>{reportData["Affected Business Units"]}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mitigation Actions */}
        {(reportData["Immediate Actions (0-24 hrs)"] || reportData["Short-Term Actions (7 Days)"] || reportData["Long-Term Actions (30 Days)"]) && (
          <div className="report-section">
            <div className="report-section-title">Recommended Mitigation Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "8px" }}>
              {reportData["Immediate Actions (0-24 hrs)"] && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ color: "var(--danger)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Clock size={16} />
                    <span style={{ fontSize: "9px", fontWeight: "bold", marginTop: "2px" }}>24h</span>
                  </div>
                  <div>
                    <strong style={{ color: "var(--text-primary)" }}>Immediate Actions:</strong>
                    <div style={{ whiteSpace: "pre-line", color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>{reportData["Immediate Actions (0-24 hrs)"]}</div>
                  </div>
                </div>
              )}

              {reportData["Short-Term Actions (7 Days)"] && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ color: "var(--warning)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Calendar size={16} />
                    <span style={{ fontSize: "9px", fontWeight: "bold", marginTop: "2px" }}>7d</span>
                  </div>
                  <div>
                    <strong style={{ color: "var(--text-primary)" }}>Short-Term Actions:</strong>
                    <div style={{ whiteSpace: "pre-line", color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>{reportData["Short-Term Actions (7 Days)"]}</div>
                  </div>
                </div>
              )}

              {reportData["Long-Term Actions (30 Days)"] && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ color: "var(--success)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <CheckCircle size={16} />
                    <span style={{ fontSize: "9px", fontWeight: "bold", marginTop: "2px" }}>30d</span>
                  </div>
                  <div>
                    <strong style={{ color: "var(--text-primary)" }}>Long-Term Actions:</strong>
                    <div style={{ whiteSpace: "pre-line", color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>{reportData["Long-Term Actions (30 Days)"]}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getInputIntentIcon = (intent) => {
    switch (intent) {
      case "analytics":
        return <Terminal size={14} className="text-success" />;
      case "simulation":
        return <Activity size={14} className="text-danger" />;
      default:
        return <Brain size={14} className="text-primary" />;
    }
  };

  return (
    <div className="analyst-grid">
      {/* Left Sidebar Info Panel */}
      <div className="analyst-panel">
        {/* Suggested Queries Card */}
        <div className="analyst-card">
          <div className="analyst-card-title">
            <HelpCircle size={16} style={{ color: "var(--primary)" }} />
            Suggested Scenarios
          </div>
          <div className="suggested-list">
            {suggestedQuestions.map((q, idx) => (
              <button 
                key={idx}
                className="suggested-btn"
                onClick={() => handleSend(q)}
                disabled={generating}
              >
                <Play size={10} style={{ color: "var(--primary)" }} />
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* System Knowledge Base Stats Card */}
        {systemStats && (
          <div className="analyst-card">
            <div className="analyst-card-title">
              <Server size={16} style={{ color: "var(--accent-cyan)" }} />
              Analyst Knowledge Base
            </div>
            <div className="system-status-grid">
              <div className="status-metric-box">
                <div className="status-metric-val">{systemStats["Vendor Records"] || 0}</div>
                <div className="status-metric-label">Vendors</div>
              </div>
              <div className="status-metric-box">
                <div className="status-metric-val">{systemStats["APIs"] || 0}</div>
                <div className="status-metric-label">Active APIs</div>
              </div>
              <div className="status-metric-box">
                <div className="status-metric-val">{systemStats["Applications"] || 0}</div>
                <div className="status-metric-label">Apps</div>
              </div>
              <div className="status-metric-box">
                <div className="status-metric-val">{systemStats["News Articles"] || 0}</div>
                <div className="status-metric-label">News Articles</div>
              </div>
            </div>
            
            <div style={{ marginTop: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><BookOpen size={12} /> FAISS Docs: {systemStats["FAISS Documents"] || 0}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Cpu size={12} /> Gemini-2.5-Flash</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Premium Chat panel */}
      <div className="chat-panel">
        <div className="chat-header">
          <div className="chat-header-title">
            <Brain size={22} className="logo-glow" style={{ color: "var(--primary)" }} />
            <div>
              <h3 style={{ margin: 0 }}>Enterprise Risk AI Analyst</h3>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>RAG & Graph Risk Intelligence Service</span>
            </div>
          </div>
          <div className="status-indicator">
            <span className="pulse-dot"></span>
            <span>Online</span>
          </div>
        </div>

        {/* Messages List Area */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="loading-overlay">
              <Brain size={60} className="logo-glow" style={{ color: "var(--primary)", opacity: 0.15, marginBottom: "20px" }} />
              <h3 style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "18px", marginBottom: "8px" }}>
                Enterprise Risk Analysis Dashboard
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", textAlign: "center", maxWidth: "420px", lineHeight: "1.5" }}>
                Query the knowledge base for vendor risk posture, API vulnerabilities, compliance metrics, or run simulated breach cascades to preview downstream impacts.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`chat-message-bubble ${msg.sender === "user" ? "message-user" : "message-assistant"}`}
              >
                {msg.sender === "user" ? (
                  <div>{msg.text}</div>
                ) : (
                  <div>
                    {msg.intent && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }}>
                        {getInputIntentIcon(msg.intent)}
                        <span>AI Intent Detected: {msg.intent}</span>
                      </div>
                    )}
                    {renderReportDashboard(msg.text)}
                  </div>
                )}
              </div>
            ))
          )}
          
          {generating && (
            <div className="chat-message-bubble message-assistant" style={{ padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Brain size={18} className="logo-glow animate-pulse-slow" style={{ color: "var(--primary)" }} />
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Risk Analyst is calculating cascades and compiling intelligence...</span>
                <div className="typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Text Form */}
        <div className="chat-input-area">
          <form 
            className="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
          >
            <input 
              type="text" 
              className="chat-input"
              placeholder="Ask about a vendor, compliant posture, API security, or simulate breach cascades..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={generating}
            />
            <button 
              type="submit" 
              className="chat-send-btn"
              disabled={!inputValue.trim() || generating}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Copilot;
