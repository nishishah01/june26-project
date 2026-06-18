import { useEffect, useState } from "react";
import api from "../services/api";

function Vendors() {

  const [vendors, setVendors] = useState([]);

  useEffect(() => {

    api.get("/vendors/")
      .then((response) => {
        setVendors(response.data);
      });

  }, []);

  return (

    <div>

      <h1>Vendor Risk Rankings</h1>

      <table border="1">

        <thead>

          <tr>
            <th>Vendor</th>
            <th>Risk Score</th>
            <th>Risk Level</th>
          </tr>

        </thead>

        <tbody>

          {vendors.map((vendor) => (

            <tr key={vendor.id}>

              <td>{vendor.name}</td>

              <td>{vendor.risk_score}</td>

              <td>{vendor.risk_level}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Vendors;