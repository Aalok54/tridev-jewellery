# Tridev Jewellers — App

Heritage-luxury jewellery demo storefront (college mini-project, viva-ready).
React (CRA + Craco) frontend, no required backend — all demo state lives in
browser `localStorage`.

## Run it

```bash
cd app/frontend
npm install
npm start        # http://localhost:3000
npm run build    # production bundle in build/
```

Backend (optional — the storefront runs without it):

```bash
cd app/backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8000   # /api/health, /api/store, /api/inquiries
python -m pytest ../tests                  # backend tests
```

## Demo logins

- Customer: `customer@example.com` / `Customer@123`
- Admin: `admin@tridevjewellers.com` / `Tridev@123` → protected `/admin`

## Where things live

- `frontend/src/App.js` — routes + store + pages + admin dashboard
- `frontend/src/data.js` — 24 products (NPR demo prices), collections, journal, lookbook
- `frontend/src/constants/testIds/` — stable selectors for tests/viva demos
- `frontend/public/index.html` — SEO meta, title, theme color
- `backend/server.py` — optional FastAPI API (`/api/health`, `/api/store`, `/api/inquiries`)

## Viva checklist

1. Home → Shop (search, category pills, price slider, sort) → Product (gallery, qty).
2. Wishlist + Cart → Checkout (demo form) → Orders history.
3. Contact inquiry → Admin → Inquiries (mark read/delete).
4. Admin → Products (add/edit price, stock, image URL, delete), Categories, Orders (status), Customers, Gallery.
5. Admin → Reset demo data restores the baseline.
