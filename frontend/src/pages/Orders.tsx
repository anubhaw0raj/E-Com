import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, ApiError } from "../api/client";
import Spinner from "../components/Spinner";
import { useToast } from "../context/ToastContext";
import type { Order, OrderStatus } from "../types";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  shipped: "bg-blue-500/20 text-blue-400",
  delivered: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-red-500/20 text-red-400",
};

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    api.get<Order[]>("/api/orders")
      .then(setOrders)
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId: number) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await api.put(`/api/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
      );
      showToast("Order cancelled successfully", "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not cancel order", "error");
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <Spinner label="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-10">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div>
          <p className="text-gray-400 mb-4">You have no orders yet.</p>
          <Link to="/products" className="text-cyan-400 hover:underline">
            Start shopping →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              {/* Order Header */}
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
                {order.status === "pending" && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition"
                  >
                    Cancel Order
                  </button>
                )}
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center bg-gray-700 p-4 rounded-lg transition ${
                      item.id ? "cursor-pointer hover:bg-gray-600" : ""
                    }`}
                    onClick={() => item.id && navigate(`/product/${item.id}`)}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg mr-4"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-300">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-cyan-400 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="mt-4 text-gray-300 grid gap-1 sm:grid-cols-2">
                <p>
                  <span className="font-semibold">Address:</span> {order.address}
                </p>
                <p>
                  <span className="font-semibold">Payment:</span> {order.payment_method}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <p className="text-cyan-400 font-bold">
                  Total: ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
