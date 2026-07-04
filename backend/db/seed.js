// Seeds categories and the product catalog. Safe to re-run: it wipes and
// re-inserts catalog data (products/categories) but never touches users,
// carts or orders unless they reference deleted products.
// Usage: npm run seed
const { pool } = require("./index");

const img = (text, size = "600x400") =>
  `https://placehold.co/${size}/111827/22d3ee?text=${encodeURIComponent(text)}`;

const productImages = (label) => [
  img(label),
  img(`${label} Side`, "300x300"),
  img(`${label} Back`, "300x300"),
  img(`${label} Detail`, "300x300"),
];

const categories = ["Monitor", "Keyboard", "Mouse", "CPU", "Headset", "Laptop"];

const products = [
  {
    name: "Amazon Basics 27 inch Monitor",
    category: "Monitor",
    price: 199.99,
    rating: 4.5,
    stock: 25,
    description: "Crystal clear 1080P monitor with built-in speakers",
    images: productImages("Monitor"),
    about: [
      "27-inch IPS display with stunning color accuracy.",
      "Full HD 1080p resolution for crisp visuals.",
      "Built-in speakers for convenient audio.",
      "VESA mount compatibility for flexible setup.",
    ],
    specs: { brand: "Amazon Basics", screenSize: "27 Inches", resolution: "FHD 1080p", aspectRatio: "16:9", surface: "Glossy" },
  },
  {
    name: "LG UltraGear 32 inch QHD 165Hz",
    category: "Monitor",
    price: 349.99,
    rating: 4.7,
    stock: 18,
    description: "QHD gaming monitor with 165Hz refresh rate and 1ms response",
    images: productImages("UltraGear"),
    about: [
      "32-inch QHD (2560x1440) VA panel.",
      "165Hz refresh rate with 1ms response time.",
      "AMD FreeSync Premium for tear-free gaming.",
      "HDR10 support with 95% DCI-P3 coverage.",
    ],
    specs: { brand: "LG", screenSize: "32 Inches", resolution: "QHD 1440p", refreshRate: "165Hz", panel: "VA" },
  },
  {
    name: "Corsair K95 RGB Mechanical Keyboard",
    category: "Keyboard",
    price: 129.99,
    rating: 4.7,
    stock: 40,
    description: "RGB Mechanical Keyboard with Cherry MX switches",
    images: productImages("Keyboard"),
    about: [
      "Cherry MX Blue switches for precise keystrokes.",
      "Per-key customizable RGB backlighting.",
      "Dedicated macro keys for pro gamers.",
      "Aircraft-grade aluminum frame for durability.",
    ],
    specs: { brand: "Corsair", type: "Mechanical", switch: "Cherry MX Blue", backlight: "RGB" },
  },
  {
    name: "Keychron K8 Wireless Mechanical Keyboard",
    category: "Keyboard",
    price: 89.99,
    rating: 4.6,
    stock: 35,
    description: "Hot-swappable wireless mechanical keyboard for Mac and Windows",
    images: productImages("Keychron"),
    about: [
      "Bluetooth 5.1 connects up to 3 devices.",
      "Hot-swappable Gateron switches.",
      "White LED backlight with 15 effects.",
      "4000mAh battery lasts weeks per charge.",
    ],
    specs: { brand: "Keychron", type: "Mechanical", switch: "Gateron Red", connectivity: "Bluetooth / USB-C" },
  },
  {
    name: "Logitech G502 Hero Gaming Mouse",
    category: "Mouse",
    price: 59.99,
    rating: 4.6,
    stock: 60,
    description: "High-performance gaming mouse with customizable weights",
    images: productImages("Mouse"),
    about: [
      "16,000 DPI HERO sensor for ultra-precise tracking.",
      "11 programmable buttons for custom controls.",
      "Adjustable weights for personalized balance.",
      "Durable braided cable for long-lasting use.",
    ],
    specs: { brand: "Logitech", dpi: "16,000", buttons: "11", connectivity: "Wired" },
  },
  {
    name: "Razer DeathAdder V3 Pro Wireless",
    category: "Mouse",
    price: 149.99,
    rating: 4.8,
    stock: 30,
    description: "Ultra-lightweight wireless esports mouse with 30K sensor",
    images: productImages("DeathAdder"),
    about: [
      "63g ultra-lightweight ergonomic design.",
      "Focus Pro 30K optical sensor.",
      "90-hour battery life on a single charge.",
      "Optical mouse switches rated for 90M clicks.",
    ],
    specs: { brand: "Razer", dpi: "30,000", weight: "63g", connectivity: "HyperSpeed Wireless" },
  },
  {
    name: "Intel Core i9 12900K CPU",
    category: "CPU",
    price: 549.99,
    rating: 4.8,
    stock: 15,
    description: "High-end 12th Gen Intel processor for gaming and productivity",
    images: productImages("CPU"),
    about: [
      "16 cores and 24 threads for extreme multitasking.",
      "Boost clock up to 5.2 GHz for peak performance.",
      "Unlocked for overclocking enthusiasts.",
      "Compatible with DDR5 and PCIe 5.0 platforms.",
    ],
    specs: { brand: "Intel", cores: "16", threads: "24", baseClock: "3.2 GHz", boostClock: "5.2 GHz" },
  },
  {
    name: "AMD Ryzen 7 7800X3D CPU",
    category: "CPU",
    price: 449.99,
    rating: 4.9,
    stock: 20,
    description: "The ultimate gaming CPU with 3D V-Cache technology",
    images: productImages("Ryzen"),
    about: [
      "8 cores and 16 threads with 3D V-Cache.",
      "104MB total cache for massive gaming gains.",
      "Boost clock up to 5.0 GHz.",
      "AM5 socket with DDR5 and PCIe 5.0 support.",
    ],
    specs: { brand: "AMD", cores: "8", threads: "16", boostClock: "5.0 GHz", cache: "104MB" },
  },
  {
    name: "HyperX Cloud II Gaming Headset",
    category: "Headset",
    price: 99.99,
    rating: 4.5,
    stock: 45,
    description: "Surround sound gaming headset with noise-cancelling mic",
    images: productImages("Headset"),
    about: [
      "53mm drivers for immersive sound quality.",
      "Virtual 7.1 surround sound experience.",
      "Detachable noise-cancelling microphone.",
      "Memory foam ear cushions for long comfort.",
    ],
    specs: { brand: "HyperX", drivers: "53mm", surround: "Virtual 7.1", connectivity: "USB / 3.5mm" },
  },
  {
    name: "SteelSeries Arctis Nova 7 Wireless",
    category: "Headset",
    price: 179.99,
    rating: 4.6,
    stock: 22,
    description: "Multi-platform wireless headset with 38-hour battery",
    images: productImages("Arctis"),
    about: [
      "Simultaneous 2.4GHz and Bluetooth audio.",
      "38-hour battery life with fast charging.",
      "AI-powered noise-cancelling microphone.",
      "Comfortable ski-goggle suspension headband.",
    ],
    specs: { brand: "SteelSeries", battery: "38 hours", connectivity: "2.4GHz + Bluetooth", mic: "Retractable ClearCast Gen 2" },
  },
  {
    name: "ASUS ROG Zephyrus G14 Gaming Laptop",
    category: "Laptop",
    price: 1499.99,
    rating: 4.9,
    stock: 10,
    description: "High-performance gaming laptop with Ryzen 9 and RTX 3060",
    images: productImages("Laptop"),
    about: [
      "AMD Ryzen 9 processor for blazing-fast speeds.",
      "NVIDIA RTX 3060 GPU with ray tracing.",
      "QHD 120Hz display for smooth gaming visuals.",
      "Lightweight design with long battery life.",
    ],
    specs: { brand: "ASUS", screenSize: "14 Inches", cpu: "AMD Ryzen 9", gpu: "NVIDIA RTX 3060", ram: "16GB", storage: "1TB SSD" },
  },
  {
    name: "Lenovo Legion 5 Pro Gaming Laptop",
    category: "Laptop",
    price: 1299.99,
    rating: 4.7,
    stock: 12,
    description: "16-inch WQXGA gaming laptop with RTX 4060",
    images: productImages("Legion"),
    about: [
      "16-inch WQXGA 165Hz display with G-Sync.",
      "NVIDIA RTX 4060 with 8GB GDDR6.",
      "AMD Ryzen 7 7745HX processor.",
      "Legion ColdFront 5.0 thermal system.",
    ],
    specs: { brand: "Lenovo", screenSize: "16 Inches", cpu: "AMD Ryzen 7", gpu: "NVIDIA RTX 4060", ram: "16GB", storage: "512GB SSD" },
  },
];

const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Reset catalog tables (cascades to cart_items/reviews referencing them)
    await client.query("TRUNCATE products RESTART IDENTITY CASCADE");
    await client.query("TRUNCATE categories RESTART IDENTITY CASCADE");

    const categoryIds = {};
    for (const name of categories) {
      const { rows } = await client.query(
        "INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id",
        [name, slugify(name)]
      );
      categoryIds[name] = rows[0].id;
    }

    for (const p of products) {
      await client.query(
        `INSERT INTO products (name, category_id, price, rating, description, images, about, specs, stock)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [p.name, categoryIds[p.category], p.price, p.rating, p.description, p.images, p.about, p.specs, p.stock]
      );
    }

    await client.query("COMMIT");
    console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
