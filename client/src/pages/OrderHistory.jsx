import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { FiDownload } from "react-icons/fi";

const statusColors = {
  Placed: "bg-blue-500/15 text-blue-400",
  Confirmed: "bg-indigo-500/15 text-indigo-400",
  Packed: "bg-purple-500/15 text-purple-400",
  Shipped: "bg-amber-500/15 text-amber-400",
  Delivered: "bg-green-500/15 text-green-400",
  Cancelled: "bg-red-500/15 text-red-400",
  Returned: "bg-gray-500/15 text-gray-400",
};

export default function OrderHistory() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data));
  }, []);

  if (!orders) return <Loader label="Loading your orders..." />;

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h2 className="section-title mb-4">No orders yet</h2>
        <p className="text-gray-500">Your order history will show up here.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-8 py-10">
      <h1 className="section-title mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-heading font-semibold text-white">{o.orderNumber}</p>
                <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s)</p>
              </div>
              <span className={`badge ${statusColors[o.orderStatus]}`}>{o.orderStatus}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-accent font-bold">₹{o.total.toFixed(2)}</p>
              <div className="flex items-center gap-3">
                {o.pointsEarned > 0 && <span className="text-xs text-gray-500">+{o.pointsEarned} points earned</span>}
                {o.invoiceUrl && (
                  <a href={o.invoiceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-accent hover:underline">
                    <FiDownload size={12} /> Invoice
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
