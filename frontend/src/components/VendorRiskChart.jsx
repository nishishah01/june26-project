import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

function VendorRiskChart({ data }) {

  return (

    <BarChart
      width={600}
      height={300}
      data={data}
    >

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

      <Bar dataKey="count" />

    </BarChart>

  );
}

export default VendorRiskChart;