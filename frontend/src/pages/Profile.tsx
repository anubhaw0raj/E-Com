import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../models";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  
  // Get logged in user from localStorage
  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

  // If no user, redirect to login
  useEffect(() => {
    if (!user) {
      alert("Login required to access profile");
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header Section */}
      <div className="bg-gray-800 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">My Profile</h1>
          <p className="text-gray-300">Manage your account and view your activity</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        {/* User Information Card */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-cyan-300 mb-6">Account Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Username</label>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-white font-medium">{user.username}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Email</label>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">User ID</label>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-gray-300">#{user.id}</p>
                </div>
              </div>
            </div>

            {/* Profile Avatar/Icon */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-sky-900 via-cyan-400 to-white rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-black">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-gray-300 text-center">Welcome back, {user.username}!</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-cyan-300 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* My Orders */}
            <Link
              to="/orders"
              className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors group"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-black font-bold">📦</span>
                </div>
                <h3 className="text-lg font-semibold group-hover:text-cyan-400">My Orders</h3>
              </div>
              <p className="text-gray-400 text-sm">View and track your order history</p>
            </Link>

            {/* Browse Products */}
            <Link
              to="/products"
              className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors group"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-black font-bold">🛍️</span>
                </div>
                <h3 className="text-lg font-semibold group-hover:text-cyan-400">Browse Products</h3>
              </div>
              <p className="text-gray-400 text-sm">Explore our gaming gear collection</p>
            </Link>

            {/* My Cart */}
            <Link
              to="/cart"
              className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors group"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-black font-bold">🛒</span>
                </div>
                <h3 className="text-lg font-semibold group-hover:text-cyan-400">My Cart</h3>
              </div>
              <p className="text-gray-400 text-sm">Review items in your cart</p>
            </Link>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-cyan-300 mb-6">Account Actions</h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/"
              className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition text-center"
            >
              Back to Home
            </Link>
            
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;