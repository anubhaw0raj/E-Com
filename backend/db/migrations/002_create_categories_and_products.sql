-- Product catalog: categories + products
CREATE TABLE IF NOT EXISTS categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  rating      NUMERIC(2,1)  NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  description TEXT,
  images      TEXT[] NOT NULL DEFAULT '{}',
  about       TEXT[] NOT NULL DEFAULT '{}',
  specs       JSONB  NOT NULL DEFAULT '{}',
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin (to_tsvector('english', name));
