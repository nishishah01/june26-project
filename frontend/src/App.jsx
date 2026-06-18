import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import Alerts from "./pages/Alerts";

function App() {

  return (

    <BrowserRouter>

      <Layout>

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

        </Routes>

      </Layout>

    </BrowserRouter>

  );
}

export default App;