// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Setup_Pc1 from "../assets/Img/Gaming1.jpg";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // check localStorage and update state
  const readUser = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    readUser(); // initial read

    // when other tab changes localStorage
    const onStorage = (e) => {
      if (e.key === "user") readUser();
    };

    // custom event for same-tab updates
    const onUserChanged = () => readUser();

    window.addEventListener("storage", onStorage);
    window.addEventListener("userChanged", onUserChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("userChanged", onUserChanged);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    // notify other listeners (same tab)
    window.dispatchEvent(new Event("userChanged"));
    setUser(null);
    navigate("/login");
  };

  return (
    <nav
      className="relative text-white px-6 py-6 flex justify-between items-center shadow-md fixed top-0 w-full z-50 bg-cover bg-center"
      style={{ backgroundImage: `url(${Setup_Pc1})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative flex items-center justify-between w-full px-10">
        <Link
          to="/"
          className="font-Audiowide text-2xl font-extrabold 
               bg-gradient-to-r from-sky-900 via-cyan-400 to-white
               bg-clip-text text-transparent 
               tracking-[0.1em] animate-slideInLeft"
        >
          CyberLoot
        </Link>

        {/* Middle */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-cyan-400 transition">Home</Link>
          <Link to="/products" className="hover:text-cyan-400 transition">Products</Link>

          {user && (
            <>
              <Link to="/cart" className="hover:text-cyan-400 transition">Cart</Link>
              <Link to="/orders" className="hover:text-cyan-400 transition">Orders</Link>
            </>
          )}
        </div>

        {/* Left side (auth) */}
        <div className="flex space-x-4">
          {!user ? (
            <Link to="/login" className="hover:text-cyan-400 transition">Login</Link>
          ) : (
            <>
              <Link to="/profile" className="hover:text-cyan-400 transition">
                {user.username || "Profile"}
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
