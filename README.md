# Tridev Jewellers — Heritage Luxury Jewellery Website

College mini-project: a polished, premium multi-page jewellery storefront for
**Tridev Jewellers, Golbazar-4, Siraha, Madhesh Pradesh, Nepal**.

- `CLIENT_BRIEF.md` — official client brief & authorization
- `PRD.md` — product requirements & architecture notes
- `test_credentials.md` — demo logins for viva/testing
- `app/` — the runnable project (frontend + optional backend stub)

## Quickstart

```bash
cd app/frontend
npm install
npm start        # http://localhost:3000
npm run build    # production bundle
```

## Demo accounts

- Customer: `customer@example.com` / `Customer@123`
- Admin: `admin@tridevjewellers.com` / `Tridev@123` (protected `/admin`)

New visitors can also **create an account** from sign-in — accounts persist in
the browser with their own bag, wishlist, profile and order history.

## Structure

```text
app/
├── frontend/src/
│   ├── App.js            # routes, store, pages, admin dashboard
│   ├── data.js           # 24 products (NPR demo prices), collections, journal
│   ├── constants/testIds # stable selectors for tests/demos
│   └── components/ hooks/ lib/
├── frontend/public/      # index.html (SEO), manifest
├── backend/server.py     # optional FastAPI health stub (not required)
└── tests/ test_reports/ memory/
```

## Notes for GitHub

- `node_modules/` and `build/` are git-ignored — run `npm install` after cloning.
- No secrets in the repo; all demo state lives in browser `localStorage`.
- Nothing has been pushed anywhere from this folder.
