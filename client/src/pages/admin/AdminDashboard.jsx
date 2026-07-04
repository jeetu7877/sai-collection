import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler } from "chart.js";
import api from "../../services/api";
import Loader from "../../components/Loader";
import { FiTrendingUp, FiDollarSign, FiPackage, FiUsers, FiAlertTriangle, FiClock } from "react-icons/fi";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

const StatCard = ({ icon: Icon, label, value, sub }) => (
  <div className="glass rounded-2xl p-5">
    <div className="flex items-center justify-between mb-3">
      <Icon className="text-accent" size={20} />
    </div>
    <p className="text-2xl font-heading font-bold text-white">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
    {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
  </div>
);

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [graph, setGraph] = useState([]);

  useEffect(() => {
    api.get("/dashboard/summary").then((res) => setSummary(res.data));
    api.get("/dashboard/revenue-graph").then((res) => setGraph(res.data));
  }, []);

  if (!summary) return <Loader label="Loading dashboard..." />;

  const chartData = {
    labels: graph.map((g) => g._id.slice(5)),
    datasets: [
      {
        label: "Revenue",
        data: graph.map((g) => g.revenue),
        borderColor: "#ff6b00",
        backgroundColor: "rgba(255,107,0,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#6b7280", maxTicksLimit: 8 } },
      y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#6b7280" } },
    },
  };

  return (
    <div>
      <h1 className="section-title mb-1">Dashboard Overview</h1>
      <p className="text-gray-500 text-sm mb-8">Real-time snapshot of your store's performance.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FiDollarSign} label="Today's Sales" value={`₹${summary.todaySales.total.toFixed(0)}`} sub={`${summary.todaySales.count} orders`} />
        <StatCard icon={FiTrendingUp} label="This Week" value={`₹${summary.weekSales.total.toFixed(0)}`} sub={`${summary.weekSales.count} orders`} />
        <StatCard icon={FiPackage} label="This Month" value={`₹${summary.monthSales.total.toFixed(0)}`} sub={`${summary.monthSales.count} orders`} />
        <StatCard icon={FiDollarSign} label="Est. Profit (Month)" value={`₹${summary.profit.toFixed(0)}`} sub={`Expenses: ₹${summary.expenses.toFixed(0)}`} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FiAlertTriangle} label="Low Stock Items" value={summary.lowStockCount} />
        <StatCard icon={FiClock} label="Pending Orders" value={summary.pendingOrders} />
        <StatCard icon={FiUsers} label="Top Customer" value={summary.topCustomers[0]?.name || "—"} sub={summary.topCustomers[0] ? `₹${summary.topCustomers[0].totalSpending}` : ""} />
        <StatCard icon={FiPackage} label="Best Seller" value={summary.mostSold[0]?.name?.slice(0, 16) || "—"} sub={summary.mostSold[0] ? `${summary.mostSold[0].purchaseCount} sold` : ""} />
      </div>

      <div className="glass rounded-2xl p-6 mb-6">
        <h3 className="font-heading font-semibold text-white mb-4">Revenue — Last 30 Days</h3>
        {graph.length > 0 ? <Line data={chartData} options={chartOptions} /> : <p className="text-gray-500 text-sm">No revenue data yet. Place some orders to see this chart.</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-heading font-semibold text-white mb-4">Top Customers</h3>
          <div className="space-y-3">
            {summary.topCustomers.map((c, i) => (
              <div key={c._id || i} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{c.name}</span>
                <span className="text-accent font-medium">₹{c.totalSpending}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-heading font-semibold text-white mb-4">Most Sold Products</h3>
          <div className="space-y-3">
            {summary.mostSold.map((p) => (
              <div key={p._id} className="flex items-center justify-between text-sm">
                <span className="text-gray-300 truncate pr-2">{p.name}</span>
                <span className="text-accent font-medium shrink-0">{p.purchaseCount} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
