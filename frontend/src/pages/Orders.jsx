// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      alert("Please login to view your orders");
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const res = await fetch(`http://localhost:5000/api/checkout?userId=${user.id}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  // Cancel order
  const handleCancel = async (orderId) => {
    if (!user) {
      alert("Please login to cancel orders");
      navigate("/login");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/checkout/${orderId}?userId=${user.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to cancel order");
      const data = await res.json();
      alert(data.message);

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
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <img
                      src={item.images[0]}
                      alt= "Thumbnail"
                      className="w-20 h-20 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-300">
                        Price: ${item.price} | Rating: ⭐ {item.rating}
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
                  <span className="font-semibold">Address:</span>{" "}
                  {order.address}
                </p>
                <p>
                  <span className="font-semibold">Payment:</span>{" "}
                  {order.paymentMethod}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(order.date).toLocaleString()}
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