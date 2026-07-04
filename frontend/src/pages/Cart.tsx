import { Link } from "react-router-dom";
import { ApiError } from "../api/client";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export const TAX_RATE = 0.08;
export const DELIVERY_FEE = 10;

function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();

  const changeQuantity = async (productId: number, quantity: number) => {
    try {
      await updateQuantity(productId, quantity);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not update cart", "error");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const delivery = cartItems.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + tax + delivery;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-10 grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
      {/* Cart Items */}
      <div>
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div>
            <p className="text-gray-400 mb-4">Your cart is empty.</p>
            <Link to="/products" className="text-cyan-400 hover:underline">
              Browse products →
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center gap-4"
              >
                <Link to={`/product/${item.id}`} className="flex items-center gap-4 flex-1">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="font-semibold hover:text-cyan-400 transition">{item.name}</h2>
                    <p className="text-gray-400">${item.price.toFixed(2)} each</p>
                    <p className="text-cyan-400 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </Link>

                {/* Quantity Controls */}
                <div className="flex space-x-2 items-center">
                  <button
                    className="bg-cyan-500 text-black px-3 py-1 rounded-lg hover:bg-cyan-400 transition"
                    onClick={() => changeQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    className="bg-cyan-500 text-black px-3 py-1 rounded-lg hover:bg-cyan-400 transition disabled:opacity-40"
                    disabled={item.quantity >= item.stock}
                    onClick={() => changeQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300 ml-3 text-sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
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
