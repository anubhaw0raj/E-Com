const products = require("../data/products");

const getProducts = (req, res) => {
  const category = req.query.category;
  if (category && category.toLowerCase() !== "all") {
    return res.json(products.filter(p => p.category.toLowerCase() === category.toLowerCase()));
  }
  if(category && category.toLowerCase() === "all"){
    return res.json(products);
  }
  res.json(products);
};

const getProductById = (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

module.exports = { getProducts, getProductById };