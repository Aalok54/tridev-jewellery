# Tridev Jewellers — Frontend (React + CRA)

Heritage-luxury demo storefront for a college mini-project. No backend required;
all demo state persists in `localStorage`.

## Quick start

```bash
cd app/frontend
npm install
npm start
```

- Dev server: http://localhost:3000
- Production build: `npm run build`
- Tests: `npm test`

## Demo credentials

- Customer: `customer@example.com` / `Customer@123`
- Admin: `admin@tridevjewellers.com` / `Tridev@123`

Admin dashboard is protected at `/admin` (requires admin login).

## Project structure

- `src/App.js` — routes, store (cart/wishlist/orders/inquiries), all pages + admin
- `src/data.js` — 24 hardcoded products (NPR demo prices), collections, journal, lookbook
- `src/constants/testIds/` — stable test IDs for automation/viva
- `src/components/`, `src/hooks/use-toast.js`, `src/lib/utils.js`
- `public/index.html` — SEO meta + title

## Demo data & persistence keys

- `tridev-products`, `tridev-categories`, `tridev-cart`, `tridev-wishlist`
- `tridev-user`, `tridev-admin`, `tridev-orders`, `tridev-inquiries`

Use **Admin → Reset demo data** to restore the viva baseline.

## Viva talking points

1. NPR pricing = weight × purity + making charges (clearly labelled demo).
2. React Router multi-page flows + protected `/admin` route.
3. Admin CRUD for products, categories, images (URL), orders, customers, inquiries.
4. Responsive ivory/emerald/champagne-gold theme with editorial serif headlines.
