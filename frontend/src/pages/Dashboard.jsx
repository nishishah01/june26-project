import { useEffect, useState } from "react";

import api from "../services/api";

import RiskCard from "../components/RiskCard";

function Dashboard() {

    const [dashboard, setDashboard] = useState({});

    useEffect(() => {

        api
            .get("/dashboard/")
            .then((res) => {

                setDashboard(res.data);
            });

    }, []);

    return (

        <div>

            <h1>Enterprise Risk Radar</h1>

            <div>

                <RiskCard
                    title="Enterprise Score"
                    value={dashboard.enterprise_score}
                />

                <RiskCard
                    title="Vendors"
                    value={dashboard.vendors}
                />

                <RiskCard
                    title="APIs"
                    value={dashboard.apis}
                />

                <RiskCard
                    title="Critical Alerts"
                    value={dashboard.critical_alerts}
                />
                <VendorRiskChart
                    data={dashboard.risk_distribution}
                />

            </div>

        </div>
    );
}

export default Dashboard;