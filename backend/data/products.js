const products = [
  {
    id: 1,
    name: "Amazon Basics 27 inch Monitor",
    category: "monitor",
    price: 199.99,
    rating: 4.5,
    description: "Crystal clear 1080P monitor with built-in speakers",
    images: [
      "https://via.placeholder.com/600x400?text=Monitor+Main",
      "https://via.placeholder.com/150?text=Monitor+Side+1",
      "https://via.placeholder.com/150?text=Monitor+Side+2",
      "https://via.placeholder.com/150?text=Monitor+Side+3"
    ],
    about: [
      "27-inch IPS display with stunning color accuracy.",
      "Full HD 1080p resolution for crisp visuals.",
      "Built-in speakers for convenient audio.",
      "VESA mount compatibility for flexible setup."
    ],
    specs: {
      brand: "Amazon Basics",
      screenSize: "27 Inches",
      resolution: "FHD 1080p",
      aspectRatio: "16:9",
      surface: "Glossy"
    }
  },
  {
    id: 2,
    name: "Corsair K95 RGB Mechanical Keyboard",
    category: "keyboard",
    price: 129.99,
    rating: 4.7,
    description: "RGB Mechanical Keyboard with Cherry MX switches",
    images: [
      "https://via.placeholder.com/600x400?text=Keyboard+Main",
      "https://via.placeholder.com/150?text=Keyboard+Side+1",
      "https://via.placeholder.com/150?text=Keyboard+Side+2",
      "https://via.placeholder.com/150?text=Keyboard+Side+3"
    ],
    about: [
      "Cherry MX Blue switches for precise keystrokes.",
      "Per-key customizable RGB backlighting.",
      "Dedicated macro keys for pro gamers.",
      "Aircraft-grade aluminum frame for durability."
    ],
    specs: {
      brand: "Corsair",
      type: "Mechanical",
      switch: "Cherry MX Blue",
      backlight: "RGB"
    }
  },
  {
    id: 3,
    name: "Logitech G502 Hero Gaming Mouse",
    category: "mouse",
    price: 59.99,
    rating: 4.6,
    description: "High-performance gaming mouse with customizable weights",
    images: [
      "https://via.placeholder.com/600x400?text=Mouse+Main",
      "https://via.placeholder.com/150?text=Mouse+Side+1",
      "https://via.placeholder.com/150?text=Mouse+Side+2",
      "https://via.placeholder.com/150?text=Mouse+Side+3"
    ],
    about: [
      "16,000 DPI HERO sensor for ultra-precise tracking.",
      "11 programmable buttons for custom controls.",
      "Adjustable weights for personalized balance.",
      "Durable braided cable for long-lasting use."
    ],
    specs: {
      brand: "Logitech",
      dpi: "16,000",
      buttons: 11,
      connectivity: "Wired"
    }
  },
  {
    id: 4,
    name: "Intel Core i9 12900K CPU",
    category: "cpu",
    price: 549.99,
    rating: 4.8,
    description: "High-end 12th Gen Intel processor for gaming and productivity",
    images: [
      "https://via.placeholder.com/600x400?text=CPU+Main",
      "https://via.placeholder.com/150?text=CPU+Side+1",
      "https://via.placeholder.com/150?text=CPU+Side+2",
      "https://via.placeholder.com/150?text=CPU+Side+3"
    ],
    about: [
      "16 cores and 24 threads for extreme multitasking.",
      "Boost clock up to 5.2 GHz for peak performance.",
      "Unlocked for overclocking enthusiasts.",
      "Compatible with DDR5 and PCIe 5.0 platforms."
    ],
    specs: {
      brand: "Intel",
      cores: 16,
      threads: 24,
      baseClock: "3.2 GHz",
      boostClock: "5.2 GHz"
    }
  },
  {
    id: 5,
    name: "HyperX Cloud II Gaming Headset",
    category: "headset",
    price: 99.99,
    rating: 4.5,
    description: "Surround sound gaming headset with noise-cancelling mic",
    images: [
      "https://via.placeholder.com/600x400?text=Headset+Main",
      "https://via.placeholder.com/150?text=Headset+Side+1",
      "https://via.placeholder.com/150?text=Headset+Side+2",
      "https://via.placeholder.com/150?text=Headset+Side+3"
    ],
    about: [
      "53mm drivers for immersive sound quality.",
      "Virtual 7.1 surround sound experience.",
      "Detachable noise-cancelling microphone.",
      "Memory foam ear cushions for long comfort."
    ],
    specs: {
      brand: "HyperX",
      drivers: "53mm",
      surround: "Virtual 7.1",
      connectivity: "USB / 3.5mm"
    }
  },
  {
    id: 6,
    name: "ASUS ROG Zephyrus G14 Gaming Laptop",
    category: "laptop",
    price: 1499.99,
    rating: 4.9,
    description: "High-performance gaming laptop with Ryzen 9 and RTX 3060",
    images: [
      "https://via.placeholder.com/600x400?text=Laptop+Main",
      "https://via.placeholder.com/150?text=Laptop+Side+1",
      "https://via.placeholder.com/150?text=Laptop+Side+2",
      "https://via.placeholder.com/150?text=Laptop+Side+3"
    ],
    about: [
      "AMD Ryzen 9 processor for blazing-fast speeds.",
      "NVIDIA RTX 3060 GPU with ray tracing.",
      "QHD 120Hz display for smooth gaming visuals.",
      "Lightweight design with long battery life."
    ],
    specs: {
      brand: "ASUS",
      screenSize: "14 Inches",
      cpu: "AMD Ryzen 9",
      gpu: "NVIDIA RTX 3060",
      ram: "16GB",
      storage: "1TB SSD"
    }
  }
];

module.exports = products;