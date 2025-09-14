import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { productsApi } from "../models/api";
import { Product, Category } from "../models";

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Initialize selectedCategory from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productsApi.getCategories();
        setCategories([{ id: 0, name: "All", description: "All Products" }, ...data]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getProducts({ 
          category: selectedCategory === "All" ? undefined : selectedCategory 
        });
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Handle category change and update URL
  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    if (categoryName === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryName });
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen grid grid-cols-[20%_80%]">
      {/* Sidebar */}
      <aside className="bg-gray-800 p-6 border-r border-gray-700">
        <h2 className="text-xl font-bold mb-4">Categories</h2>

        {/* Dropdown (mobile) */}
        <select
          className="w-full p-2 rounded-lg bg-gray-700 text-white mb-6 md:hidden"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Category List (desktop) */}
        <ul className="space-y-3 hidden md:block">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={`cursor-pointer p-2 rounded-lg ${
                selectedCategory === cat.name
                  ? "bg-cyan-500 text-black font-bold"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => handleCategoryChange(cat.name)}
            >
              {cat.name}
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
                <p className="text-gray-400">{product.category}</p>
                <p className="text-cyan-400 font-bold">${product.price}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;