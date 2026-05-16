-- The legacy saas_apps and templates tables remain for backward compatibility;
-- new products should be created in this unified products table.

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL DEFAULT '',
  product_type text NOT NULL CHECK (product_type IN ('saas', 'template', 'custom')),
  price integer NOT NULL DEFAULT 0, -- stored in cents
  is_subscription boolean DEFAULT false,
  billing_interval text CHECK (billing_interval IN ('month', 'year')),
  image_url text NOT NULL,
  demo_url text,
  demo_video_url text,
  stripe_price_id text,
  stripe_link text,
  features jsonb DEFAULT '[]'::jsonb,
  category text NOT NULL DEFAULT 'general',
  category_id uuid,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  file_url text,
  file_path text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active products" ON products;
CREATE POLICY "Public can view active products"
ON products
FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Admins can insert products" ON products;
CREATE POLICY "Admins can insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM admin_users
    WHERE admin_users.user_id = (select auth.uid())
  )
);

DROP POLICY IF EXISTS "Admins can update products" ON products;
CREATE POLICY "Admins can update products"
ON products
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM admin_users
    WHERE admin_users.user_id = (select auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM admin_users
    WHERE admin_users.user_id = (select auth.uid())
  )
);

DROP POLICY IF EXISTS "Admins can delete products" ON products;
CREATE POLICY "Admins can delete products"
ON products
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM admin_users
    WHERE admin_users.user_id = (select auth.uid())
  )
);

CREATE INDEX IF NOT EXISTS products_type_active_featured_order_idx
ON products (product_type, is_active, is_featured, order_index);

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION generate_product_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_product_slug ON products;
CREATE TRIGGER set_product_slug
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION generate_product_slug();
