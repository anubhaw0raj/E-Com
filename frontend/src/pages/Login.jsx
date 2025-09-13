// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      setError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-cyan-400">Login</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg text-black"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg text-black"
        />

        <button
          type="submit"
          className="w-full bg-cyan-500 text-black py-3 rounded-lg font-semibold hover:bg-cyan-400 transition"
        >
          Login
        </button>

        <p className="mt-4 text-gray-400 text-center">
          New here?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
