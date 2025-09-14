import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6 text-center md:text-left">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold text-cyan-400 mb-4">CyberLoot</h3>
          <p>
            Your ultimate gaming store. We provide top-quality gear to power up
            your gameplay.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold text-cyan-400 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-cyan-400">Home</Link></li>
            <li><Link to="/products" className="hover:text-cyan-400">Products</Link></li>
            <li><Link to="/about" className="hover:text-cyan-400">About</Link></li>
            <li><Link to="/contact" className="hover:text-cyan-400">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold text-cyan-400 mb-4">Contact</h3>
          <p>Email: support@cyberloot.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>

      <div className="mt-10 text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} CyberLoot. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;