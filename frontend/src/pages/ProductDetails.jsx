import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch product details from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.images[0]); // default first image
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="text-white p-10">Loading product...</div>;
  }

  // Add product to cart (via backend API)
  const handleAddToCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      await res.json();
      alert("✅ Product added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("❌ Could not add to cart.");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-10 grid grid-cols-[40%_60%] gap-10">
      {/* Left Side - Images */}
      <div className="flex flex-col items-center">
        {/* Main Image */}
        <img
          src={selectedImage}
          alt="Product"
          className="w-full h-[400px] object-contain rounded-lg mb-4"
        />

        {/* Thumbnails */}
        <div className="flex space-x-4">
          {product.images.map((img, idx) => (
            <img
              key={idx}
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

      {/* Right Side - Product Details */}
      <div className="flex flex-col justify-centre">
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-yellow-400 mb-4">⭐ {product.rating} / 5</p>

          {/* Specs Table */}
          <table className="table-fixed text-left w-full mb-6">
            <tbody>
              {Object.entries(product.specs).map(([key, value], idx) => (
                <tr key={idx}>
                  <td className="w-1/3 font-semibold">{key.toLocaleUpperCase()} :-</td>
                  <td className="w-2/3">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* About */}
          <h2 className="text-xl font-semibold mb-2">About this item</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {product.about.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>

          {/* Price */}
          <p className="text-2xl font-bold text-cyan-400 mt-6">
            ${product.price}
          </p>
        </div>

        {/* Add to Cart */}
        <div className="flex justify-end m-6">
          <button
            onClick={handleAddToCart}
            className="bg-cyan-500 text-black px-8 py-3 mr-40 rounded-lg font-semibold shadow-lg hover:bg-cyan-400 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
