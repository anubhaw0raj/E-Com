import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, ApiError } from "../api/client";
import RatingStars from "../components/RatingStars";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import type { Product, Review } from "../types";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notFound, setNotFound] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadProduct = useCallback(async () => {
    try {
      const data = await api.get<Product>(`/api/products/${id}`);
      setProduct(data);
      setSelectedImage(data.images[0] ?? null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setNotFound(true);
      console.error("Error fetching product:", err);
    }
  }, [id]);

  useEffect(() => {
    void loadProduct();
    api.get<Review[]>(`/api/products/${id}/reviews`)
      .then(setReviews)
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [id, loadProduct]);

  if (notFound) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-cyan-400 mb-4">Product not found</h1>
        <button onClick={() => navigate("/products")} className="text-cyan-400 hover:underline">
          Back to products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <Spinner label="Loading product..." />
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      showToast("Login required to add items to cart", "info");
      navigate("/login");
      return;
    }
    try {
      await addToCart(product.id, quantity);
      showToast("Product added to cart!", "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not add to cart", "error");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showToast("Login required to write a review", "info");
      navigate("/login");
      return;
    }
    setSubmittingReview(true);
    try {
      const updated = await api.post<Review[]>(`/api/products/${product.id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment.trim() || undefined,
      });
      setReviews(updated);
      setReviewComment("");
      showToast("Review submitted!", "success");
      void loadProduct(); // refresh aggregate rating
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not submit review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-10">
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10">
        {/* Left Side - Images */}
        <div className="flex flex-col items-center">
          <img
            src={selectedImage ?? product.images[0]}
            alt={product.name}
            className="w-full h-[400px] object-contain rounded-lg mb-4 bg-gray-800"
          />
          <div className="flex space-x-4">
            {product.images.map((img) => (
              <img
                key={img}
                src={img}
                alt="Thumbnail"
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  selectedImage === img ? "border-cyan-400" : "border-gray-700"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Info */}
        <div className="flex flex-col">
          <p className="text-sm uppercase tracking-wide text-cyan-400 mb-1">{product.category}</p>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="mb-4">
            <RatingStars rating={product.rating} />
            <span className="text-gray-400 ml-2 text-sm">({reviews.length} review{reviews.length === 1 ? "" : "s"})</span>
          </div>

          <p className="text-gray-300 mb-6">{product.description}</p>

          {/* Specs */}
          <table className="table-fixed text-left w-full mb-6">
            <tbody>
              {Object.entries(product.specs).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-800">
                  <td className="w-1/3 font-semibold py-2 uppercase text-gray-400">{key}</td>
                  <td className="w-2/3 py-2">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* About */}
          <h2 className="text-xl font-semibold mb-2">About this item</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {product.about.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          {/* Price + Stock */}
          <p className="text-3xl font-bold text-cyan-400 mt-6">${product.price.toFixed(2)}</p>
          <p className={`mt-1 ${product.stock > 0 ? "text-emerald-400" : "text-red-400"}`}>
            {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
          </p>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-gray-700 rounded-lg">
              <button
                className="px-4 py-2 text-cyan-400 hover:bg-gray-800 rounded-l-lg"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                className="px-4 py-2 text-cyan-400 hover:bg-gray-800 rounded-r-lg"
                onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-cyan-500 text-black px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-cyan-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6">Customer Reviews</h2>

        {/* Write a review */}
        <form onSubmit={handleSubmitReview} className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="font-semibold mb-3">Write a review</h3>
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                className={`text-2xl ${star <= reviewRating ? "text-yellow-400" : "text-gray-600"}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={3}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 mb-3"
          />
          <button
            type="submit"
            disabled={submittingReview}
            className="bg-cyan-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition disabled:opacity-50"
          >
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {/* Review list */}
        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="bg-gray-800 p-5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-cyan-400">{review.username}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <RatingStars rating={review.rating} size="text-sm" />
                {review.comment && <p className="text-gray-300 mt-2">{review.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default ProductDetails;
