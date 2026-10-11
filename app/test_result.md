# Test Results

## 2026-10-11 — Production audit: every file read, bugs fixed

**Frontend bugs fixed:** dead `Mail` import removed; dead `giftFee` variable
removed; new `Img` component with branded SVG fallback now backs product cards,
gallery, thumbs, bag and order thumbnails — real catalogue URLs swap in freely.
**Assets:** brand `favicon.svg` created (was 404), manifest fixed, Siraha SEO
copy in title/meta.
**Backend rewritten:** the Emergent Mongo template crashed on boot without
`MONGO_URL` and its requirements didn't match — replaced with a dependency-free
stub (`/api/health`, `/api/store`, file-backed `/api/inquiries`), modern
lifespan, matching requirements, plus 4 pytest tests.
**package.json pruned:** ~40 unused deps removed (radix set, date-fns, axios,
recharts, external tarballs, conflicting eslint 9…) — fresh `npm install`
works with no flags (1328 pkgs), build green, favicon in bundle.
**Verify:** `npm run build` green · dev server HTTP 200 + favicon served ·
`pytest` 4/4 pass · live API boot test (health/store/inquiry roundtrip) green.

## 2026-10-11 — New address, protected orders, multi-user isolation (verified loop 1)

- **Address/contact:** `Golbazar-4, Siraha, Madhesh Pradesh, Nepal` ·
  `avaysoni123@gmail.com` · `+977 9829770284` (tel/WhatsApp links + map query
  follow automatically; story copy, timeline, city list and sample data aligned;
  no old address/phone/email remains in app copy). Spelling corrected from
  "Sirha/Golbazzar/nepla" — say the word if you want it verbatim.
- **Orders protected:** `/orders` now requires sign-in (`RequireCustomer`) —
  guests get a sign-in prompt, admin sessions get a dashboard pointer, and only
  the signed-in email's orders ever render.
- **Multi-user investigation (found it):** the single global `tridev-profile`
  survived logout, and every login kept it (`prev.email ? prev : seed`) — so
  signing in as a different user still displayed the previous user's name, and
  the bag/wishlist were shared across accounts on one browser.
- **Fix:** per-account buckets — `tridev-carts`, `tridev-wishlists`,
  `tridev-profiles` keyed by email (`guest`/`admin` otherwise); profile email
  locked to the session (account-identity field read-only); one-time migration
  imports legacy single-user saves, then drops the old keys; reset-demo clears
  all buckets.
- **Verify loop 1:** build green; dev server HTTP 200 + compiled; 6/6
  multi-user isolation simulation pass (empty start, no leaks, intact return);
  10/10 static checks pass. No second loop needed.

## 2026-10-11 — Self-registration ("Create an account")

- Shared `AuthForm` (Sign in ⇄ Create account tabs) powers both `/login` and
  the header/account modal — same theme, same validation, stable test IDs
  (`auth-tab-signin/create`, `register-name/email/password`, `register-submit`).
- Registration validates name, email format and min-6-char passwords; demo
  emails and existing accounts can't collide ("already exists — sign in").
- New accounts persist (`tridev-registered`), start a customer session, seed
  the profile, and scope orders/wishlist to their email like any account.
  Sign-in accepts demo + registered users with distinct wrong-password vs
  unknown-email messages. Reset-demo clears registrations to baseline.
- `npm run build`: **Compiled successfully**. Dev server (port 3005):
  **webpack compiled successfully**, root HTTP 200.

## 2026-10-11 — Orders-admin dashboard + account separation

- **Orders-admin (Admin → Orders):** stats row (total revenue, processing,
  shipped, delivered), live search (id/customer/email/phone), status pill
  filters, sort (newest/oldest/highest value), click-to-open detail panel with
  item images + `Qty × price = line`, totals, delivery + gift-wrap, customer
  contact + address + atelier note, and a **status timeline** (Processing →
  Shipped → Delivered/Cancelled) updated with history on every change. Delete
  per order. Same ivory/emerald/gold theme, serif headings, existing
  `admin-panel`/`order-row`/`status-pill` language.
- **No user collisions:** one shared `ORDER_STATUSES` flow; checkout and
  profile emails normalized (trim + lowercase) so orders always match their
  account; migration heals old saves (numeric items, mixed-case emails, missing
  history, unknown statuses); sessions exclusive (customer ⇄ admin); storefront
  `/orders` scoped strictly to the signed-in email (admin sessions see a
  dashboard pointer, never customer orders); **guest checkout claims its own
  session** from the order email so the new order is visible immediately.
- Seeds enriched: item thumbnails, phone/address/notes, delivery + gift flags,
  and full status histories (totals match line items).
- `npm run build`: **Compiled successfully**. Dev server (port 3004):
  **webpack compiled successfully**, root HTTP 200.

## 2026-10-11 — WhatsApp, map, FAQ, profile, contact cards, mobile CSS

- **WhatsApp:** floating green button (bottom-right, all pages) with expandable
  chat card (atelier greeting, reply-hours, Start-chat deep link `wa.me` +
  call fallback). Test IDs `whatsapp-float`, `whatsapp-card`, `whatsapp-start-chat`.
- **Google Map:** new `MapSection` (atelier address/hours/phone, WhatsApp +
  directions links, lazy `output=embed` iframe, no API key) on Contact (full),
  Home (compact) and FAQ (compact).
- **FAQs:** dedicated `/faq` page with 4 grouped categories (12 Q&As), linked
  from footer + Contact FAQ ("View all FAQs").
- **Account profile:** "Customise my info" edits name/email/phone/address/city/
  occasion/newsletter, persisted (`tridev-profile`), seeded on customer login,
  shown on the account card, and prefilled into checkout.
- **Contact strip:** loose flex row replaced with 3 proper cards
  (WhatsApp / Call / Email) with icons, labels and sub-text; details now driven
  by shared `STORE` constants (also used in footer + map).
- **Mobile CSS:** stacked map, 1-col contact cards, admin rows collapse
  (2-col → 1-col), account grid stacks, compact WhatsApp button, map heights
  tuned per breakpoint.
- `npm run build`: **Compiled successfully**. Dev server (port 3003):
  **webpack compiled successfully**, root HTTP 200. 15/15 feature checks pass.

## 2026-10-11 — Premium content pass (images skipped per request)

Image scraping skipped on request — existing photography kept; two verified
Unsplash photos added to the pool (temple bridal set, pearl gift box) for the
expanded 8-image lookbook.

### Cart / Orders / Checkout
- **Remove → icon:** cart line items now use a `Trash2` icon button with
  `remove-<id>` test IDs and product-name aria-labels (no more "Remove" text).
- **Cart:** piece count, per-line `Qty N × price = line total`, gift-wrap &
  insured-delivery summary rows, and a "Complete the look" upsell with quick add.
- **Order history:** rich cards — order id/date/status, piece counts, delivery
  address + phone, per-item thumbnails with **Qty × price = line total**
  (quantities match the bag exactly), delivery method, gift-wrap flag, order
  total, lifetime spend/piece summary header, and **Order again** (reorders into
  the bag and jumps to cart).
- **Checkout:** Standard (complimentary) vs Express (NPR 950) delivery options,
  gift-wrap toggle, atelier note field, and an itemised summary with quantities.
  Orders persist delivery/gift choices; admin flags express orders for priority.

### Every page enriched (ivory/emerald/champagne-gold theme kept)
- **Home:** shop-by-collection preview, 5-star collector testimonials, and a
  "House promises" band (hallmark, insured delivery, buyback, gifting) + CTAs.
- **Shop:** per-category blurbs in the results count (solitaires/halos…).
- **Product:** third accordion (sizing & appointments) + collector-notes review
  cards with rating summary.
- **About:** craft photo + full 1988→2025 atelier timeline.
- **Lookbook:** 8 captioned images.
- **Journal:** full 3-paragraph article bodies, read times, related-article links.
- **Collections:** live piece counts per collection + appointment CTA band.
- **Contact:** reply-time/phone/email strip + 5-question FAQ accordion.
- **Account:** loyalty tier (Welcome/Gold/Heirloom Circle) with points, progress
  bar and saved-piece thumbnails.
- **Wishlist:** total value summary + "Move all to bag".
- **Admin:** "Needs attention" panel (low stock, express orders awaiting dispatch).

### Verification
- `npm run build`: **Compiled successfully**.
- Dev server (port 3002): **webpack compiled successfully**, root HTTP 200.

## 2026-10-11 — Runtime crash fixed + full page audit

### Crash fix (`_o$items.map is not a function`, OrdersPage)
- **Root cause:** `sampleOrders` seeds stored `items` as a **number** (`items: 2`),
  while checkout-created orders store `items` as an **array**. `OrdersPage` called
  `o.items?.map(...)` — on a number, `.map` is `undefined` → TypeError. Old
  `localStorage` saves (`tridev-orders`) with the numeric shape crashed on every
  visit to `/orders`.
- **Fix:**
  - `data.js`: seeds now use real item arrays (e.g. Maya Temple Pendant × 1 =
    NPR 124,000 — totals match line items).
  - `App.js`: new `normalizeOrder` / `normalizeOrders` / `formatOrderItems`
    helpers; `OrdersPage` renders via `formatOrderItems(o)` (handles array,
    legacy number, and missing shapes — never crashes).
  - One-time migration effect heals old browser saves on first load.
  - Hardened all persisted arrays (`safeCatalog`, `safeCart`, `safeWishlist`,
    `safeOrders`, `safeInquiries`, `safeCategories`) + defensive cart/wishlist
    updaters so hand-edited `localStorage` can't crash any page.

### Page audit (sense-checked text, images, theme)
- All 8 Unsplash jewellery photos return HTTP 200; `images.craft` was dead —
  now used on the About page atelier section.
- `Navaja Cuff` (a knife name — nonsense for a bracelet) → `Newa Heritage Cuff`.
- Earring/bracelet products re-mapped to the correct photos (were reusing the
  generic detail shot); galleries now vary per category via `galleryFor`.
- Identical description on all 24 products → per-category descriptions.
- `Added to bag ✓` (text checkmark) → `BadgeCheck` lucide icon.
- About stat `24 Demo icons in NPR` (nonsense) → `24 Signature pieces`.
- Journal detail rewritten as a real editorial (was self-referential demo copy).
- Placeholder phones `+977-98XXXXXXXX` → realistic demo numbers.
- Wishlist `Move to bag` now actually moves (adds + removes from wishlist).
- Collision-proof IDs for admin products (`TD-C-<ts>`), inquiries
  (`INQ-<ts>`), orders (max+1 with timestamp fallback).
- Catalog storage bumped to `tridev-products-v2` so audit fixes reach browsers
  holding the old seed set; Admin → Reset demo restores baseline.

### Verification
- `npm run build`: **Compiled successfully** (96.55 kB JS gzip).
- Dev server (`npm start`, port 3001): **webpack compiled successfully**, root HTTP 200.
- Smoke script: legacy numeric orders render (`2 items`), new array orders render
  (`Maya Temple Pendant × 1`), no `o.items?.map` remains.
- `backend/server.py`: syntax OK (optional stub, not required for demo).

## 2026-10-11 (earlier) — Emergent import managed, build verified
- Added `src/data.js`, fixed `src/index.js`, `craco.config.js` `@` alias,
  `public/index.html` + manifest, `testIds`, rebuilt `App.js` flows, theme tokens.
