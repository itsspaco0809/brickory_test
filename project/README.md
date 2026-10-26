# Brickory Store

Brickory is a separate ecommerce storefront built from an existing ecommerce foundation and redesigned for a curated building-brick reseller brand.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Supabase
- Stripe checkout through Supabase Edge Functions
- GSAP + Lenis
- Responsive desktop/mobile navigation
- Multi-currency storefront
- Customer accounts, orders, cart and admin dashboard

## Run locally

1. Copy `.env.example` to `.env`.
2. Add your Brickory Supabase URL and anon key.
3. Install dependencies:

```bash
npm install
```

4. Start Vite:

```bash
npm run dev
```

5. Verify the production build:

```bash
npm run build
```

## Supabase

Run the migrations in `supabase/migrations/` in order.

The supplied frontend expects these existing Supabase resources:

- `products`
- `orders`
- `order_items`
- `digital_files`
- `contact_messages`
- the existing checkout/contact Edge Functions used by the app

The original upload did not contain the deployed Edge Function source files, so those functions are intentionally not fabricated here. Deploy the same trusted checkout/contact functions to the new Brickory Supabase project and configure their secrets before accepting real payments.

The new `20261027000000_add_brickory_brand.sql` migration adds an optional `brand` field to `products`, allowing the admin catalogue to identify the original manufacturer/brand of reseller products.

## Branding

- Brand: Brickory
- Tagline: Where Bricks Become Models
- Primary concept: curated building sets from Asia, presented through a Hong Kong-based storefront
- Contact email placeholder: `hello@brickory.com`
- Default canonical domain in `index.html`: `https://brickory.com/`

Change the domain/email before launch if you choose a different domain or support address.

## Important

This project is designed as an independent Brickory brand. It does not include the previous store logo, tracking ID, social links, or brand copy.

Product images, brand names, trademarks and licensing information should be supplied by Brickory's authorised suppliers/manufacturers or created by Brickory itself.
