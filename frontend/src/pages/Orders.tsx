import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "../models/api";
import { Order, User } from "../models";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Get user from localStorage
  const userString = localStorage.getItem("user");
  const user: User | null = userString ? JSON.parse(userString) : null;

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      alert("Please login to view your orders");
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await ordersApi.getOrders({ userId: user.id.toString() });
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  // Cancel order
  const handleCancel = async (orderId: number) => {
    if (!user) {
      alert("Please login to cancel orders");
      navigate("/login");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const response = await ordersApi.cancelOrder(orderId, user.id.toString());
      alert(response.message);

      // Remove from state
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Something went wrong while cancelling the order.");
    }
  };

  if (loading) {
    return <div className="text-white p-10">Loading orders...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-10">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Order #{order.id} - {order.status}
                </h2>
                <button
                  onClick={() => handleCancel(order.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition"
                >
                  Cancel Order
                </button>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition"
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    <img
                      src={item.images?.[0] || "/placeholder.jpg"}
                      alt="Thumbnail"
                      className="w-20 h-20 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-300">
                        Price: ${item.price} | Total: ${item.total.toFixed(2)}
                      </p>
                      <p className="text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="mt-4 text-gray-300">
                <p>
                  <span className="font-semibold">Total Amount:</span>{" "}
                  ${order.totalAmount.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {typeof order.shippingAddress === 'string' 
                    ? order.shippingAddress 
                    : JSON.stringify(order.shippingAddress)}
                </p>
                <p>
                  <span className="font-semibold">Payment:</span>{" "}
                  {order.paymentMethod} ({order.paymentStatus})
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;