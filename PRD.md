# Tridev Jewellers

## Original problem statement

Build Tridev Jewellers as a polished, premium multi-page React website using React and Vite with heritage-luxury styling, 20–30 hardcoded jewellery products, shopping flows, demo login, admin pages, browser persistence, and viva-ready setup.

## Architecture decisions

- React single-page experience with React Router routes and reusable card/header/footer components.
- Product catalog, categories and editorial imagery live in `frontend/src/data.js`.
- Cart, wishlist, customer session, admin session and inquiries persist through browser localStorage.
- No backend is required for this demo-first college project; checkout is intentionally a demo interaction.

## Implemented

- Home, Shop, Collections, Product Details, About, Lookbook, Journal, Contact, Account, Orders, Wishlist, Cart and protected Admin routes.
- 24 jewellery products with NPR demo prices, search, filters, sorting, product galleries, quantity controls, cart and wishlist.
- Validated customer and admin demo credentials, contact inquiry persistence, admin inquiry overview, responsive layouts and accessible data test IDs.

## Prioritized backlog

- P0: Connect a real database/API if the project later needs multi-device data.
- P1: Replace demo checkout with an order-confirmation flow and printable receipt.
- P1: Add image upload and full CRUD forms to admin management tabs.
- P2: Add richer blog article detail routes and appointment calendar.
