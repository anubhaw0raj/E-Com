import { Link } from "react-router-dom";
import type { Product } from "../types";
import RatingStars from "./RatingStars";

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:scale-105 hover:shadow-cyan-500/20 transition block"
    >
      <img
        src={product.images[0]}
        alt={product.name}
        loading="lazy"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-cyan-400 mb-1">{product.category}</p>
        <h3 className="font-semibold text-white line-clamp-2">{product.name}</h3>
        <div className="my-2">
          <RatingStars rating={product.rating} size="text-sm" />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-cyan-400 font-bold text-lg">${product.price.toFixed(2)}</p>
          {product.stock === 0 ? (
            <span className="text-red-400 text-sm font-semibold">Out of stock</span>
          ) : product.stock <= 5 ? (
            <span className="text-amber-400 text-sm">Only {product.stock} left</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
