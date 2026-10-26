/*
  Brickory product metadata

  Adds an optional manufacturer/brand field so the storefront can clearly
  identify the original building-brick brand for reseller products.
*/
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS brand text;

CREATE INDEX IF NOT EXISTS idx_products_brand
  ON public.products (brand);
