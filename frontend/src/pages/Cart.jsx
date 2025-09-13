import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Get logged in user
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user, redirect to login
  useEffect(() => {
    if (!user) {
      alert("Login required to access cart");
      navigate("/login");
      return;
    }

    // Fetch cart items for this user
    fetch(`http://localhost:5000/api/cart?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error("Error fetching cart:", err));
  }, [user]);

  //  Add or increase quantity
  const handleAdd = (productId) => {
    fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, productId, quantity: 1 }),
    })
      .then((res) => res.json())
      .then((data) => setCartItems(data));
  };

  // Decrease quantity or remove if <= 0
  const handleRemove = (productId, currentQty) => {
    if (currentQty > 1) {
      fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, quantity: currentQty - 1 }),
      })
        .then((res) => res.json())
        .then((data) => setCartItems(data));
    } else {
      fetch(`http://localhost:5000/api/cart/${productId}?userId=${user.id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => setCartItems(data));
    }
  };

  // Totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const delivery = cartItems.length > 0 ? 10 : 0;
  const total = subtotal + tax + delivery;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-10 grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
      {/* Cart Items */}
      <div>
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-gray-400">Price: ${item.price}</p>
                  <p className="text-gray-300">Quantity: {item.quantity}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex space-x-2 items-center">
                  <button
                    className="bg-cyan-500 text-black px-3 py-1 rounded-lg hover:bg-cyan-400 transition"
                    onClick={() => handleRemove(item.id, item.quantity)}
                  >
                    -
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    className="bg-cyan-500 text-black px-3 py-1 rounded-lg hover:bg-cyan-400 transition"
                    onClick={() => handleAdd(item.id)}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Order Summary */}
      {cartItems.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-fit">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-2 text-gray-300">
            <p className="flex justify-between">
              <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Tax (8%):</span> <span>${tax.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Delivery:</span> <span>${delivery.toFixed(2)}</span>
            </p>
            <hr className="border-gray-600 my-2" />
            <p className="flex justify-between text-xl font-bold text-cyan-400">
              <span>Total:</span> <span>${total.toFixed(2)}</span>
            </p>
          </div>

          {/* Checkout Button */}
          <Link
            to="/checkout"
            className="block bg-cyan-500 text-black text-center px-6 py-3 mt-6 rounded-lg font-semibold shadow-lg hover:bg-cyan-400 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;
