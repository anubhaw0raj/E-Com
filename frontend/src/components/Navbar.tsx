import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Setup_Pc1 from "../assets/Img/Gaming1.jpg";

function Navbar() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const { cartCount } = useCart();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
    setSearch("");
  };

  return (
    <nav
      className="relative text-white px-6 py-4 shadow-md sticky top-0 w-full z-50 bg-cover bg-center"
      style={{ backgroundImage: `url(${Setup_Pc1})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      <div className="relative flex items-center justify-between w-full gap-4 px-4 md:px-10">
        <Link
          to="/"
          className="font-Audiowide text-2xl font-extrabold
               bg-gradient-to-r from-sky-900 via-cyan-400 to-white
               bg-clip-text text-transparent
               tracking-[0.1em] whitespace-nowrap"
        >
          CyberLoot
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gaming gear..."
            className="w-full px-4 py-2 rounded-l-lg bg-gray-800/80 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="bg-cyan-500 text-black px-4 rounded-r-lg font-semibold hover:bg-cyan-400 transition"
          >
            Search
          </button>
        </form>

        {/* Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-cyan-400 transition">Home</Link>
          <Link to="/products" className="hover:text-cyan-400 transition">Products</Link>
          {isLoggedIn && (
            <>
              <Link to="/cart" className="hover:text-cyan-400 transition relative">
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-cyan-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="hover:text-cyan-400 transition">Orders</Link>
            </>
          )}
        </div>

        {/* Auth */}
        <div className="flex space-x-4 items-center">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="hover:text-cyan-400 transition">Login</Link>
              <Link
                to="/register"
                className="bg-cyan-500 text-black px-4 py-1.5 rounded-lg font-semibold hover:bg-cyan-400 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="hover:text-cyan-400 transition">
                {user?.username ?? "Profile"}
              </Link>
              <button onClick={handleLogout} className="hover:text-red-400 transition">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
