import './Stats.css'
function Stats() {
  return (
    <div className="cards">
      <div className="card">
        <p>Total Tasks</p>
        <h2>12</h2>
      </div>
      <div className="card">
        <p>Completed</p>
        <h2>7</h2>
      </div>
      <div className="card">
        <p>Remaining</p>
        <h2>5</h2>
      </div>
    </div>
  );
}
export default Stats;
