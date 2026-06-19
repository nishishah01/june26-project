import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Search, ShieldAlert, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/vendors/")
      .then((response) => {
        setVendors(response.data || []);
      })
      .catch((err) => console.error("Error loading vendors:", err))
      .finally(() => setLoading(false));
  }, []);

  const getRiskBadgeClass = (level) => {
    switch (level?.toLowerCase()) {
      case "critical": return "badge-danger";
      case "high": return "badge-warning";
      case "medium": return "badge-warning";
      default: return "badge-success";
    }
  };

  const getRiskIcon = (level) => {
    switch (level?.toLowerCase()) {
      case "critical": return <ShieldAlert size={16} className="text-danger" />;
      case "high": return <AlertTriangle size={16} className="text-warning" />;
      case "medium": return <AlertTriangle size={16} className="text-warning" />;
      default: return <ShieldCheck size={16} className="text-success" />;
    }
  };

  const filteredVendors = vendors.filter((vendor) => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <div className="pulse-dot" style={{ width: "24px", height: "24px" }}></div>
        <span style={{ marginLeft: "16px", color: "var(--text-secondary)" }}>Loading vendor risk database...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar / Header Control */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "28px",
          gap: "16px"
        }}
      >
        <div style={{ position: "relative", flexGrow: 1, maxWidth: "400px" }}>
          <Search 
            size={18} 
            style={{ 
              position: "absolute", 
              left: "14px", 
              top: "50%", 
              transform: "translateY(-50%)", 
              color: "var(--text-muted)" 
            }} 
          />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              padding: "12px 16px 12px 42px",
              borderRadius: "10px",
              color: "var(--text-primary)",
              fontFamily: "var(--sans)",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
          />
        </div>
        <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
          Showing <strong>{filteredVendors.length}</strong> of {vendors.length} vendors
        </div>
      </div>

      {/* Vendors Table */}
      <div className="table-container">
        {filteredVendors.length === 0 ? (
          <div className="empty-state">
            <p>No vendors found matching "{searchTerm}"</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th style={{ textAlign: "center" }}>Risk Score</th>
                <th>Risk Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {getRiskIcon(vendor.risk_level)}
                      {vendor.name}
                    </div>
                  </td>
                  <td style={{ textAlign: "center", fontWeight: 700 }}>
                    <span style={{ 
                      color: vendor.risk_score > 70 ? "var(--danger)" : vendor.risk_score > 40 ? "var(--warning)" : "var(--success)"
                    }}>
                      {vendor.risk_score}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "normal" }}>/100</span>
                  </td>
                  <td>
                    <span className={`badge ${getRiskBadgeClass(vendor.risk_level)}`}>
                      {vendor.risk_level}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link 
                      to={`/alerts?vendor=${encodeURIComponent(vendor.name)}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "var(--primary)",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: 600,
                        transition: "color 0.2s"
                      }}
                      className="vendor-action-link"
                    >
                      Investigate <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Vendors;