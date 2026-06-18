import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import Alerts from "./pages/Alerts";
import RiskGraph from "./pages/RiskGraph";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/vendors"
          element={<Vendors />}
        />

        <Route
          path="/alerts"
          element={<Alerts />}
        />

        <Route
          path="/graph"
          element={<RiskGraph />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;