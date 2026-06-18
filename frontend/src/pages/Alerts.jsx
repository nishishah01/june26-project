import { useEffect, useState } from "react";
import api from "../services/api";

function Alerts() {

    const [vendors, setVendors] = useState([]);
    const [alerts, setAlerts] = useState([]);

    const [selectedVendor, setSelectedVendor] = useState("");
    const [selectedSeverity, setSelectedSeverity] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {

        api.get("/vendors/")
            .then((res) => {
                setVendors(res.data);
            })
            .catch((err) => {
                console.error(err);
            });

    }, []);

    useEffect(() => {

        if (!selectedVendor) {
            setAlerts([]);
            return;
        }

        api.get(`/alerts/${selectedVendor}/`)
            .then((res) => {
                setAlerts(res.data);
            })
            .catch((err) => {
                console.error(err);
            });

    }, [selectedVendor]);

    const getSeverityColor = (severity) => {

        switch (severity?.toLowerCase()) {

            case "critical":
                return "#ff4d4f";

            case "high":
                return "#fa541c";

            case "medium":
                return "#faad14";

            case "low":
                return "#52c41a";

            default:
                return "#d9d9d9";
        }
    };

    const filteredAlerts = alerts.filter((alert) => {

        const severityMatch =
            selectedSeverity === "All" ||
            alert.severity === selectedSeverity;

        const categoryMatch =
            selectedCategory === "All" ||
            alert.category === selectedCategory;

        return severityMatch && categoryMatch;
    });

    const categories = [
        "All",
        ...new Set(
            alerts
                .map((alert) => alert.category)
                .filter(Boolean)
        )
    ];

    return (

        <div style={{ padding: "20px" }}>

            <h1>Vendor Intelligence Dashboard</h1>

            <br />

            {/* Vendor Dropdown */}

            <label>
                Vendor:
            </label>

            <br />

            <select
                value={selectedVendor}
                onChange={(e) =>
                    setSelectedVendor(e.target.value)
                }
                style={{
                    padding: "10px",
                    minWidth: "250px"
                }}
            >

                <option value="">
                    Select Vendor
                </option>

                {vendors.map((vendor) => (

                    <option
                        key={vendor.id}
                        value={vendor.name}
                    >

                        {vendor.name}

                    </option>

                ))}

            </select>

            <br />
            <br />

            {/* Severity Filter */}

            <label>
                Severity:
            </label>

            <br />

            <select
                value={selectedSeverity}
                onChange={(e) =>
                    setSelectedSeverity(e.target.value)
                }
                style={{
                    padding: "10px",
                    minWidth: "250px"
                }}
            >

                <option value="All">
                    All Severities
                </option>

                <option value="Critical">
                    Critical
                </option>

                <option value="High">
                    High
                </option>

                <option value="Medium">
                    Medium
                </option>

                <option value="Low">
                    Low
                </option>

            </select>

            <br />
            <br />

            {/* Category Filter */}

            <label>
                Category:
            </label>

            <br />

            <select
                value={selectedCategory}
                onChange={(e) =>
                    setSelectedCategory(e.target.value)
                }
                style={{
                    padding: "10px",
                    minWidth: "250px"
                }}
            >

                {categories.map((category) => (

                    <option
                        key={category}
                        value={category}
                    >

                        {category}

                    </option>

                ))}

            </select>

            <br />
            <br />

            {selectedVendor && (

                <h2>
                    Alerts for {selectedVendor}
                </h2>

            )}

            <br />

            {filteredAlerts.length === 0 &&
                selectedVendor && (

                    <p>
                        No alerts found.
                    </p>

                )}

            {filteredAlerts.map((alert) => (

                <div
                    key={alert.id}
                    style={{
                        borderLeft:
                            `8px solid ${getSeverityColor(alert.severity)}`,
                        padding: "15px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        boxShadow:
                            "0px 2px 6px rgba(0,0,0,0.1)"
                    }}
                >

                    <h3>
                        {alert.title}
                    </h3>

                    <p>
                        <strong>Category:</strong>{" "}
                        {alert.category}
                    </p>

                    <p>
                        <strong>Severity:</strong>{" "}
                        {alert.severity}
                    </p>

                </div>

            ))}

        </div>
    );
}

export default Alerts;