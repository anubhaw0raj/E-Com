import { useState, useEffect } from "react";
import { Link,useSearchParams} from "react-router-dom";


function Products() {
  // AUTH  here only 
  // check kro localStorage me user object hai ya nhi
  // const [userData] = useState(window.localStorage.getItem("user"));
  // agar nhi hai -> to login page redirect krdo
  
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products?category=${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, [selectedCategory]);

  const categories = ["All", "Monitor", "Keyboard", "Mouse", "CPU", "Headset", "Laptop"];


  return (
    <div className="bg-gray-900 text-white min-h-screen grid grid-cols-[20%_80%]">
      {/* Sidebar */}
      <aside className="bg-gray-800 p-6 border-r border-gray-700">
        <h2 className="text-xl font-bold mb-4">Categories</h2>

        {/* Dropdown (mobile) */}
        <select
          className="w-full p-2 rounded-lg bg-gray-700 text-white mb-6 md:hidden"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Category List (desktop) */}
        <ul className="space-y-3 hidden md:block">
          {categories.map((cat, i) => (
            <li
              key={i}
              className={`cursor-pointer p-2 rounded-lg ${
                selectedCategory === cat
                  ? "bg-cyan-500 text-black font-bold"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Product Grid */}
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-cyan-400">
          {selectedCategory === "All"
            ? "All Products"
            : `${selectedCategory} Products`}
        </h1>

        {products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition block"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-400 capitalize">{product.category}</p>
                <p className="text-cyan-400 font-bold">${product.price}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Products;