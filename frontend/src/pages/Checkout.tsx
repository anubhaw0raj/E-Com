import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError } from "../api/client";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import type { Order } from "../types";
import { DELIVERY_FEE, TAX_RATE } from "./Cart";

const availableAddresses = [
  { label: "Home", value: "221B Baker Street, Near City Library, London" },
  { label: "Work", value: "14 Tech Park Avenue, 5th Floor, Downtown Business Hub" },
  { label: "Other", value: "77 Maple Heights, Opposite Greenfield Mall, Springfield" },
];

const paymentMethods = [
  { label: "Credit / Debit Card", value: "Credit/Debit Card" },
  { label: "UPI (Google Pay, PhonePe, Paytm)", value: "UPI" },
  { label: "Cash on Delivery", value: "Cash On Delivery" },
  { label: "Net Banking", value: "NetBanking" },
  { label: "PayPal", value: "Paypal" },
  { label: "Wallet", value: "Wallet" },
];

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, refreshCart } = useCart();
  const { showToast } = useToast();

  const [address, setAddress] = useState(availableAddresses[0].value);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].value);
  const [placing, setPlacing] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const delivery = cartItems.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + tax + delivery;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      await api.post<{ message: string; order: Order }>("/api/orders", {
        address,
        paymentMethod,
      });
      await refreshCart(); // server cleared the cart
      showToast("Order placed successfully!", "success");
      navigate("/orders");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not place order", "error");
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-cyan-400 mb-4">Your cart is empty</h1>
        <button onClick={() => navigate("/products")} className="text-cyan-400 hover:underline">
          Browse products →
        </button>
      </div>
    );
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
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            {availableAddresses.map((addr) => (
              <option key={addr.label} value={addr.value}>
                {addr.label} - {addr.value}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label key={method.value} className="flex items-center space-x-3 cursor-pointer">
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
          disabled={placing}
          className="w-full bg-cyan-500 text-black px-6 py-3 mt-6 rounded-lg font-semibold shadow-lg hover:bg-cyan-400 transition disabled:opacity-50"
        >
          {placing ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
