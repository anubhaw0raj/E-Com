import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import type { Category, Product } from "../types";

type SortOption = "" | "price_asc" | "price_desc" | "rating";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "All";
  const search = searchParams.get("search") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sort, setSort] = useState<SortOption>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Category[]>("/api/products/categories")
      .then(setCategories)
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);

    api.get<Product[]>(`/api/products?${params.toString()}`)
      .then(setProducts)
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  const selectCategory = (slug: string) => {
    const next = new URLSearchParams(searchParams);
    if (slug === "All") next.delete("category");
    else next.set("category", slug);
    setSearchParams(next);
  };

  const categoryOptions = [{ id: 0, name: "All", slug: "All" }, ...categories];
  const activeCategory = categories.find((c) => c.slug === category)?.name ?? "All";

  return (
    <div className="bg-gray-900 text-white min-h-screen grid grid-cols-1 md:grid-cols-[20%_80%]">
      {/* Sidebar */}
      <aside className="bg-gray-800 p-6 border-r border-gray-700">
        <h2 className="text-xl font-bold mb-4">Categories</h2>

        {/* Dropdown (mobile) */}
        <select
          className="w-full p-2 rounded-lg bg-gray-700 text-white mb-6 md:hidden"
          value={category}
          onChange={(e) => selectCategory(e.target.value)}
        >
          {categoryOptions.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Category List (desktop) */}
        <ul className="space-y-3 hidden md:block">
          {categoryOptions.map((cat) => (
            <li
              key={cat.slug}
              className={`cursor-pointer p-2 rounded-lg ${
                category === cat.slug || (cat.slug === "All" && category === "All")
                  ? "bg-cyan-500 text-black font-bold"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => selectCategory(cat.slug)}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Product Grid */}
      <main className="p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-cyan-400">
            {search
              ? `Results for "${search}"`
              : activeCategory === "All"
                ? "All Products"
                : `${activeCategory} Products`}
          </h1>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="p-2 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            <option value="">Sort: Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {loading ? (
          <Spinner label="Loading products..." />
        ) : products.length === 0 ? (
          <p className="text-gray-400">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Products;
