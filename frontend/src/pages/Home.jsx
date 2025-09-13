import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Setup_Pc from "../assets/Img/Gaming.jpg";

function Home() {
  const [showInfo, setShowInfo] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch all products from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const categories = ["Monitor", "Keyboard", "Mouse", "CPU", "Headset", "Laptop"];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-900 p-4">
        <section
          className="relative w-full h-[95vh] bg-cover bg-center flex items-center justify-center rounded-xl overflow-hidden"
          style={{ backgroundImage: `url(${Setup_Pc})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="relative z-10 text-center max-w-2xl px-6">
            <h1
              className="text-6xl font-Audiowide font-extrabold py-6 
                          bg-gradient-to-r from-sky-900 via-cyan-400 to-white
                          bg-clip-text text-transparent 
                          animate-slideInLeft tracking-[0.2em]"
            >
              CyberLoot
            </h1>
            <p className="text-gray-300 text-lg mb-6 py-2 animate-slideInRight">
              The ultimate gaming gear store – Unlock your power with the best
              monitors, keyboards, headsets, and more.
            </p>
            <Link
              to="/products"
              className="bg-gradient-to-r from-sky-900 via-cyan-400 to-white text-black px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-cyan-400 transition"
            >
              Shop Now
            </Link>
          </div>
        </section>
      </div>

      {/* Categories Section */}
      <section className="px-10 py-16 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12 text-cyan-300">
          Our Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => navigate(`/products?category=${cat}`)}
              className="bg-gray-800 p-6 rounded-xl flex flex-col items-center hover:scale-105 transition cursor-pointer"
            >
              <img
                src="https://via.placeholder.com/120"
                alt={cat}
                className="rounded-lg mb-3"
              />
              <p className="font-semibold text-gray-200">{cat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="px-10 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-cyan-300">
          Popular Products
        </h2>
        {products.length === 0 ? (
          <p className="text-center text-gray-400">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-gray-800 rounded-xl shadow-lg p-4 hover:scale-105 transition cursor-pointer"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="rounded-lg mb-3 w-full h-48 object-cover"
                />
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-400">${product.price}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Gaming Quote with Dropdown */}
      <section className="px-10 py-16 bg-gray-900 text-center">
        <h2 className="text-2xl italic font-semibold text-cyan-300 mb-6">
          "Gamers don’t die, they respawn."
        </h2>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="bg-cyan-500 text-black px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-cyan-400 transition"
        >
          {showInfo ? "Hide Info" : "About Our Store"}
        </button>
        {showInfo && (
          <div className="mt-6 p-6 bg-gray-800 rounded-xl shadow-lg max-w-2xl mx-auto">
            <p className="text-gray-300">
              CyberLoot is your one-stop shop for top-tier gaming gear. We
              deliver premium quality, lightning-fast shipping, and unbeatable
              support for gamers everywhere.
            </p>
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section className="px-10 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-cyan-300">
          What Gamers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <p className="italic text-gray-300">
              "CyberLoot upgraded my setup! The monitor quality is insane, and
              delivery was super quick."
            </p>
            <h4 className="mt-4 font-bold text-cyan-400">– Alex</h4>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <p className="italic text-gray-300">
              "Best gaming gear store ever. My new keyboard feels amazing while
              playing competitive matches."
            </p>
            <h4 className="mt-4 font-bold text-cyan-400">– Sam</h4>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <p className="italic text-gray-300">
              "I’ve bought my headset and mouse from CyberLoot, and both are
              top-notch quality."
            </p>
            <h4 className="mt-4 font-bold text-cyan-400">– Jordan</h4>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 p-6 text-center text-gray-400">
        <p>© 2025 CyberLoot. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;