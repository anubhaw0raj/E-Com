import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types";

function Profile() {
  const { user: storedUser, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get<User>("/api/auth/me")
      .then(setProfile)
      .catch((err) => console.error("Error fetching profile:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <Spinner label="Loading profile..." />
      </div>
    );
  }

  const user = profile ?? storedUser;
  if (!user) return null;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-10 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-cyan-400 mb-8">My Profile</h1>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Avatar header */}
          <div className="bg-gradient-to-r from-sky-900 via-cyan-600 to-cyan-400 p-8 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center text-3xl font-bold text-cyan-400 uppercase">
              {user.username.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.fullName || user.username}</h2>
              <p className="text-cyan-100">@{user.username}</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-8 space-y-4">
            <div className="flex justify-between border-b border-gray-700 pb-3">
              <span className="text-gray-400">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-3">
              <span className="text-gray-400">Member since</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-3">
              <span className="text-gray-400">Role</span>
              <span className="capitalize">{user.role}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Link
                to="/orders"
                className="bg-gray-700 rounded-lg p-6 text-center hover:bg-gray-600 transition"
              >
                <p className="text-3xl font-bold text-cyan-400">{user.orderCount ?? 0}</p>
                <p className="text-gray-300">Orders</p>
              </Link>
              <Link
                to="/cart"
                className="bg-gray-700 rounded-lg p-6 text-center hover:bg-gray-600 transition"
              >
                <p className="text-3xl font-bold text-cyan-400">{user.cartCount ?? 0}</p>
                <p className="text-gray-300">Items in Cart</p>
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-4 bg-red-500/20 text-red-400 py-3 rounded-lg font-semibold hover:bg-red-500/30 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
