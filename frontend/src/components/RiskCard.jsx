function RiskCard({ title, value }) {

  return (
    <div className="border p-5 rounded-lg">

      <h3>{title}</h3>

      <h1>{value}</h1>

    </div>
  );
}

export default RiskCard;