import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productsApi, cartApi } from "../models/api";
import { Product, User } from "../models";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch product details from backend
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const data = await productsApi.getProductById(parseInt(id));
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

  // Add product to cart (with login check & userId)
  const handleAddToCart = async () => {
    const userString = localStorage.getItem("user");
    const user: User | null = userString ? JSON.parse(userString) : null;

    if (!user) {
      alert("Login required to add items to cart");
      navigate("/login");
      return;
    }

    try {
      await cartApi.addToCart({
        userId: user.id.toString(),
        productId: product.id,
        quantity: 1,
      });

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
        <img
          src={selectedImage || product.images[0]}
          alt="Product"
          className="w-full h-[400px] object-contain rounded-lg mb-4"
        />
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

      {/* Right Side */}
      <div className="flex flex-col justify-centre">
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-300 mb-2">Category: <span className="text-cyan-400">{product.category}</span></p>
          <p className="text-yellow-400 mb-4">⭐ {product.rating} / 5</p>

          {/* Specs */}
          <table className="table-fixed text-left w-full mb-6">
            <tbody>
              {Object.entries(product.specs).map(([key, value], idx) => (
                <tr key={idx}>
                  <td className="w-1/3 font-semibold">
                    {key.toLocaleUpperCase()} :-
                  </td>
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
};

export default ProductDetails;
