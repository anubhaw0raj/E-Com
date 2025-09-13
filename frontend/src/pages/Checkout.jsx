import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState("Home");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // In the future: fetch addresses from user profile API
  const availableAddresses = [
    { label: "Home", value: "221B Baker Street, Near City Library, London" },
    { label: "Work", value: "14 Tech Park Avenue, 5th Floor, Downtown Business Hub" },
    { label: "Ad1", value: "77 Maple Heights, Opposite Greenfield Mall, Springfield" },
  ];

  // Payment methods array
  const paymentMethods = [
    { label: "Credit / Debit Card", value: "Credit/Debit Card" },
    { label: "UPI (Google Pay, PhonePe, Paytm)", value: "UPI" },
    { label: "Cash on Delivery", value: "Cash On Delivery" },
    { label: "Net Banking", value: "NetBanking" },
    { label: "PayPal", value: "Paypal" },
    { label: "Gift Card / Voucher", value: "Giftcard" },
    { label: "Buy Now, Pay Later (BNPL)", value: "BNPL" },
    { label: "Wallet", value: "Wallet" },
  ];

  // Fetch cart items from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cart");
        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const delivery = cartItems.length > 0 ? 10 : 0;
  const total = subtotal + tax + delivery;

  // Place order using checkout API
  const handlePlaceOrder = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          address: selectedAddress,
          paymentMethod,
        }),
      });

      if (!res.ok) throw new Error("Failed to place order");
      const data = await res.json();

      alert("Order placed successfully!");
      console.log("Order Response:", data);

      // Redirect to Orders page
      navigate("/orders");
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Something went wrong while placing your order.");
    }
  };

  if (loading) {
    return <div className="text-white p-10">Loading checkout...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-10 grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
      {/* Left - Address & Payment */}
      <div>
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">Checkout</h1>

        {/* Delivery Address */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            className="w-full p-3 rounded-lg text-black"
          >
            {availableAddresses.map((addr, idx) => (
              <option key={idx} value={addr.value}>
                {addr.label} - {addr.value}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map((method, idx) => (
              <label key={idx} className="flex items-center space-x-3">
                <input
                  type="radio"
                  value={method.value}
                  checked={paymentMethod === method.value}
                  onChange={() => setPaymentMethod(method.value)}
                />
                <span>{method.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Order Summary */}
      <div className="bg-gray-800 p-6 rounded-lg h-fit">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <ul className="space-y-2 mb-4">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between text-gray-300">
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="flex justify-between text-gray-300">
          <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
        </p>
        <p className="flex justify-between text-gray-300">
          <span>Tax (8%):</span> <span>${tax.toFixed(2)}</span>
        </p>
        <p className="flex justify-between text-gray-300">
          <span>Delivery:</span> <span>${delivery.toFixed(2)}</span>
        </p>
        <hr className="border-gray-600 my-2" />
        <p className="flex justify-between text-xl font-bold text-cyan-400">
          <span>Total:</span> <span>${total.toFixed(2)}</span>
        </p>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-cyan-500 text-black px-6 py-3 mt-6 rounded-lg font-semibold shadow-lg hover:bg-cyan-400 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default Checkout;
