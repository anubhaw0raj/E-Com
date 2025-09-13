import React from "react";
import { Link } from "react-router-dom";
import Setup_Pc1 from "../assets/Img/Gaming1.jpg";

function Navbar() {

  // AUTH  here only 
  // check kro localStorage me user object hai ya nhi
  // const [userData] = useState(window.localStorage.getItem("user"));

  // logout funvtion -> localStorage se user hata do aur login page pe redirect krdo

  return (
    
    <nav
      className="relative text-white px-6 py-6 flex justify-between items-center shadow-md fixed top-0 w-full z-50 bg-cover bg-center"
      style={{ backgroundImage: `url(${Setup_Pc1})` }}
    >
      
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative flex items-center justify-between w-full px-10">
        {/* Logo Text */}
        <Link
          to="/"
          className="font-Audiowide text-2xl font-extrabold 
               bg-gradient-to-r from-sky-900 via-cyan-400 to-white
               bg-clip-text text-transparent 
               tracking-[0.1em] animate-slideInLeft"
        >
          CyberLoot
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-cyan-400 transition">
            Home
          </Link>
          <Link to="/products" className="hover:text-cyan-400 transition">
            Products
          </Link>
          <Link to="/cart" className="hover:text-cyan-400 transition">
            Cart
          </Link>
          <Link to="/orders" className="hover:text-cyan-400 transition">
            Orders
          </Link>
        </div>

        {/* Cart / Login */}
        {/* agar user Data hai to in dono ke jagah profile aur logout dikha do -> logout me logic me localStorage se user hata do autr login me redirect krdo */}
        {/* user data nhi hai to register and login dikhao */}
        <div className="flex space-x-4">
          <Link to="/profile" className="hover:text-cyan-400 transition">
            Profile
          </Link>
          <Link to="/register" className="hover:text-cyan-400 transition">
            Register
          </Link>
          <Link to="/login" className="hover:text-cyan-400 transition">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );

}
export default Navbar;