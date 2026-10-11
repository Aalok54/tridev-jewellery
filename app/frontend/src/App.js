import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Box,
  ChevronDown,
  Clock,
  Gift,
  Heart,
  Images,
  Instagram,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Truck,
  UserRound,
  Users,
  ClipboardList,
  MessageSquare,
  X,
} from "lucide-react";
import {
  atelierTimeline,
  categories as baseCategories,
  collections,
  DEMO_CREDENTIALS,
  faqGroups,
  formatNpr,
  galleryFor,
  images,
  journalPosts,
  lookbookImages,
  mapEmbedSrc,
  ORDER_STATUSES,
  products as seedProducts,
  sampleCustomers,
  sampleOrders,
  STORE,
  testimonials,
  whatsappLink,
} from "./data";
import "@/App.css";

const getStore = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setStore = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
};

/* Orders changed shape during development (items was once a number).
   This keeps old browser saves from crashing the Orders page. */
const normalizeOrder = (o) => {
  if (!o || typeof o !== "object") return o;
  if (Array.isArray(o.items)) return o;
  if (typeof o.items === "number") {
    return { ...o, items: [], itemCount: o.items };
  }
  return { ...o, items: [] };
};

const normalizeOrders = (list) =>
  Array.isArray(list) ? list.map(normalizeOrder) : [];

const formatOrderItems = (o) => {
  if (Array.isArray(o.items) && o.items.length > 0) {
    return o.items.map((i) => `${i.name} × ${i.qty}`).join(" · ");
  }
  if (typeof o.itemCount === "number") return `${o.itemCount} items`;
  if (typeof o.items === "number") return `${o.items} items`;
  return "Items unavailable";
};

/* History always mirrors the live catalogue: same image/name as the product
   page today, plus availability so links never lie. */
const resolveOrderItem = (catalog, item) => {
  const live = Array.isArray(catalog) ? catalog.find((p) => p.id === item.id) : null;
  return {
    ...item,
    name: live?.name || item.name,
    image: live?.image || item.image,
    price: item.price,
    qty: item.qty,
    available: !!live,
    lowStock: live ? (live.stock ?? 5) <= 0 : false,
  };
};

function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => getStore(key, initial));
  useEffect(() => setStore(key, value), [key, value]);
  return [value, setValue];
}

/* ---------- shared chrome ---------- */

function Header({ cartCount, wishlistCount, user, isAdmin, onLogin, onLogout }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="announcement">
        <Sparkles size={13} /> Complimentary delivery across Nepal on orders
        over NPR 25,000{" "}
        <Link to="/shop">
          Explore the edit <ArrowRight size={12} />
        </Link>
      </div>
      <header className="site-header">
        <Link to="/" className="wordmark" data-testid="site-logo">
          TRIDEV <span>JEWELLERS</span>
        </Link>
        <nav
          className={`main-nav ${open ? "is-open" : ""}`}
          data-testid="main-navigation"
          aria-label="Primary"
        >
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/collections">Collections</NavLink>
          <NavLink to="/about">Our Story</NavLink>
          <NavLink to="/lookbook">Lookbook</NavLink>
          <NavLink to="/journal">Journal</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="header-actions">
          <Link to="/shop" aria-label="Search" data-testid="header-search">
            <Search size={19} />
          </Link>
          <Link to="/account" aria-label="Account" data-testid="header-account">
            <UserRound size={19} />
          </Link>
          <Link
            to="/wishlist"
            className="count-link"
            aria-label="Wishlist"
            data-testid="header-wishlist"
          >
            <Heart size={19} />
            {wishlistCount > 0 && <b>{wishlistCount}</b>}
          </Link>
          <Link
            to="/cart"
            className="count-link"
            aria-label="Cart"
            data-testid="header-cart"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && <b>{cartCount}</b>}
          </Link>
          {user || isAdmin ? (
            <button
              className="menu-toggle"
              style={{ display: "inline-flex" }}
              onClick={onLogout}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          ) : (
            <button
              onClick={onLogin}
              style={{
                border: "1px solid var(--gold)",
                background: "none",
                color: "var(--emerald)",
                fontSize: 10,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                padding: "8px 12px",
              }}
              data-testid="header-login"
            >
              Sign in
            </button>
          )}
          <button
            className="menu-toggle"
            onClick={() => setOpen(!open)}
            data-testid="mobile-menu-button"
            aria-label="Menu"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>
    </>
  );
}

function Footer({ onNewsletter }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <Link to="/" className="wordmark light">
            TRIDEV <span>JEWELLERS</span>
          </Link>
          <p>
            Jewellery for the moments
            <br />
            you will always remember.
          </p>
          <p style={{ marginTop: 12, fontSize: 12 }}>
            <MapPin size={12} style={{ verticalAlign: "-2px" }} /> {STORE.street}
            <br />
            <Clock size={12} style={{ verticalAlign: "-2px" }} /> {STORE.hours}
            <br />
            <Phone size={12} style={{ verticalAlign: "-2px" }} /> {STORE.phone}
          </p>
        </div>
        <div>
          <h4>Discover</h4>
          <Link to="/shop">Shop all pieces</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/lookbook">Lookbook</Link>
          <Link to="/journal">Journal</Link>
        </div>
        <div>
          <h4>At your service</h4>
          <Link to="/contact">Contact us</Link>
          <Link to="/faq">FAQs</Link>
          <Link to="/account">Your account</Link>
          <Link to="/orders">Order history</Link>
          <Link to="/cart">Your bag</Link>
        </div>
        <div>
          <h4>Stay in the know</h4>
          <p>
            Quiet notes on craft, culture
            <br />
            and new arrivals.
          </p>
          <form
            className="newsletter"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email) return;
              onNewsletter && onNewsletter(email);
              setDone(true);
              setEmail("");
            }}
          >
            <input
              placeholder="Your email address"
              data-testid="newsletter-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              aria-label="Email address"
            />
            <button data-testid="newsletter-submit" aria-label="Subscribe">
              <ArrowRight size={18} />
            </button>
          </form>
          {done && (
            <p style={{ fontSize: 12, color: "#d9b878" }}>
              Thank you — you are on the list.
            </p>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 Tridev Jewellers · Demo prices in NPR</span>
          <span>Made with care in Siraha, Nepal</span>
        <span>
          <Instagram size={15} /> @tridevjewellers
        </span>
      </div>
    </footer>
  );
}

function WhatsAppIcon({ size }) {
  return (
    <svg
      width={size || 28}
      height={size || 28}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.5L4 29l7.7-1.8c1.8 1 3.9 1.6 6.1 1.6h.2c6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4.6 1.1 1.1-4.4-.3-.4c-1-1.6-1.6-3.5-1.6-5.5C6.9 9.9 11 5.8 16 5.8S25.1 9.9 25.1 15 21 24.8 16 24.8zm5.4-7.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.1-.3 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.2-.8.7-.3.7-1 2.4-1 5.9s2.1 6.8 2.4 7.3c.3.5 4.1 6.3 10 8.8.1 0 2.4 1 3.9-.5 1.2-1.2 1.1-2.3 1-2.6-.1-.2-.4-.3-.7-.4z" />
    </svg>
  );
}

function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && (
        <div className="wa-card" data-testid="whatsapp-card">
          <div className="wa-card-head">
            <span className="wa-avatar">
              <Sparkles size={16} />
            </span>
            <div>
              <strong>Tridev Atelier</strong>
              <span>Typically replies within a day</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="wa-close">
              <X size={16} />
            </button>
          </div>
          <p className="wa-bubble">
            Namaste! Looking for a piece, a price, or an appointment? We reply{" "}
            {STORE.hours.toLowerCase()}.
          </p>
          <a
            className="wa-cta"
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            data-testid="whatsapp-start-chat"
          >
            <WhatsAppIcon size={18} /> Start WhatsApp chat
          </a>
          <a className="wa-alt" href={STORE.phoneHref}>
            Prefer to call? {STORE.phone}
          </a>
        </div>
      )}
      <button
        className="wa-float"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close WhatsApp chat" : "Chat with us on WhatsApp"}
        data-testid="whatsapp-float"
        title="Chat with us on WhatsApp"
      >
        {open ? <X size={26} /> : <WhatsAppIcon size={30} />}
      </button>
    </>
  );
}

function MapSection({ compact }) {
  return (
    <section className={compact ? "map-section compact" : "map-section"}>
      <div className="map-copy">
        <p className="eyebrow">VISIT THE ATELIER</p>
        <h2>
          Visit us in <em>Siraha.</em>
        </h2>
        <div className="map-details">
          <div>
            <MapPin size={16} />
            <div>
              <strong>{STORE.name}</strong>
              <p>{STORE.street}</p>
            </div>
          </div>
          <div>
            <Clock size={16} />
            <div>
              <strong>Atelier hours</strong>
              <p>{STORE.hours}</p>
            </div>
          </div>
          <div>
            <Phone size={16} />
            <div>
              <strong>{STORE.phone}</strong>
              <p>
                <a href={whatsappLink()} target="_blank" rel="noreferrer">
                  WhatsApp us
                </a>{" "}
                · <a href={`mailto:${STORE.email}`}>{STORE.email}</a>
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="button button-dark" to="/contact">
            Book an appointment <ArrowRight size={16} />
          </Link>
          <a
            className="button button-outline"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE.mapQuery)}`}
            target="_blank"
            rel="noreferrer"
          >
            Get directions <ArrowRight size={16} />
          </a>
        </div>
      </div>
      <div className="map-embed">
        <iframe
          title={`Map — ${STORE.name}, ${STORE.street}`}
          src={mapEmbedSrc()}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}

function ProductCard({ product, onWishlist, wishlisted, bagQty }) {
  return (
    <article
      className="product-card"
      data-testid={`product-card-${product.id}`}
    >
      <div className="product-image">
        <Img src={product.image} alt={product.name} loading="lazy" />
        <button
          className={`icon-button heart-button ${wishlisted ? "active" : ""}`}
          onClick={() => onWishlist(product.id)}
          aria-label="Add to wishlist"
          data-testid={`wishlist-${product.id}`}
        >
          <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
        </button>
        {product.badge && <span className="badge">{product.badge}</span>}
        {bagQty > 0 && (
          <span className="badge in-bag" data-testid={`in-bag-${product.id}`}>
            <ShoppingBag size={11} /> In bag{ bagQty > 1 ? ` · ${bagQty}` : ""}
          </span>
        )}
        <Link
          className="quick-view"
          to={`/product/${product.id}`}
          data-testid={`view-product-${product.id}`}
        >
          View piece <ArrowRight size={15} />
        </Link>
      </div>
      <div className="product-meta">
        <div>
          <p className="product-category">{product.category}</p>
          <h3>{product.name}</h3>
        </div>
        <strong>{formatNpr(product.price)}</strong>
      </div>
      <p className="price-note">Demo price · incl. taxes</p>
    </article>
  );
}

/* Shared bag lookup so every card/page reflects live bag state. */
const bagQtyOf = (cart, id) => {
  const found = Array.isArray(cart) ? cart.find((i) => i.id === id) : null;
  return found ? found.qty || 0 : 0;
};

/* Production-safe image: real catalogue URLs swap in freely — a broken URL
   degrades to a branded placeholder instead of a broken-image icon. */
const FALLBACK_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="740"><rect width="100%" height="100%" fill="#e8e4da"/><text x="50%" y="47%" font-family="Georgia,serif" font-size="72" letter-spacing="8" fill="#bb8a4a" text-anchor="middle">T</text><text x="50%" y="56%" font-family="Arial,sans-serif" font-size="20" letter-spacing="6" fill="#0e3028" text-anchor="middle">TRIDEV</text></svg>`
  );

function Img({ src, alt, ...rest }) {
  const [failed, setFailed] = useState(false);
  const shown = failed || !src ? FALLBACK_IMG : src;
  return (
    <img
      src={shown}
      alt={alt || "Tridev jewellery"}
      {...rest}
      onError={() => setFailed(true)}
    />
  );
}

/* ---------- pages ---------- */

function Home({ catalog, cart, onWishlist, wishlist }) {
  const featured = catalog.slice(0, 4);
  const bestsellers = catalog.filter((p) => p.badge === "Bestseller").slice(0, 4);
  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-image">
            <img src={images.hero} alt="Gold necklace editorial" />
          </div>
          <div className="hero-copy">
            <p className="eyebrow">THE HOUSE OF TRIDEV · EST. 1988</p>
            <h1>
              Jewellery
              <br />
              <em>with a past.</em>
            </h1>
            <p className="hero-lede">
              Modern heirlooms, rooted in the old-world craft of Nepal and made
              for your next chapter.
            </p>
            <Link
              className="button button-gold"
              to="/shop"
              data-testid="hero-shop-button"
            >
              Discover the collection <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-stamp">
            HANDCRAFTED
            <br />
            <span>in Nepal</span>
          </div>
        </section>
        <section className="intro section">
          <div className="intro-mark">✦</div>
          <p className="eyebrow">A QUIET KIND OF LUXURY</p>
          <h2>
            For the stories
            <br />
            <em>you carry forward.</em>
          </h2>
          <p className="intro-copy">
            Every Tridev piece begins with a sketch, a stone and a story worth
            keeping. Our makers blend centuries-old techniques with a distinctly
            contemporary point of view.
          </p>
          <Link className="text-link" to="/about">
            Meet the house <ArrowRight size={15} />
          </Link>
        </section>
        <section className="section featured-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE EDIT</p>
              <h2>Pieces to keep close</h2>
            </div>
            <Link className="text-link" to="/shop">
              View all pieces <ArrowRight size={15} />
            </Link>
          </div>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onWishlist={onWishlist}
                wishlisted={wishlist.includes(p.id)}
                bagQty={bagQtyOf(cart, p.id)}
              />
            ))}
          </div>
        </section>
        <section className="split-story">
          <div className="story-image">
            <img src={images.detail} alt="Tridev craftsmanship" />
          </div>
          <div className="story-copy">
            <p className="eyebrow">THE TRIDEV SIGNATURE</p>
            <h2>
              Old soul.
              <br />
              <em>New light.</em>
            </h2>
            <p>
              From the first hand-drawn line to the final polish, every detail
              is intentional. We use recycled gold, traceable stones and the
              patient hands of local artisans.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link className="button button-outline" to="/lookbook">
                See the lookbook <ArrowRight size={16} />
              </Link>
              <Link className="button button-dark" to="/collections">
                Our collections <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        {bestsellers.length > 0 && (
          <section className="section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">MOST LOVED</p>
                <h2>Bestsellers this season</h2>
              </div>
              <Link className="text-link" to="/shop">
                Shop bestsellers <ArrowRight size={15} />
              </Link>
            </div>
            <div className="product-grid">
              {bestsellers.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onWishlist={onWishlist}
                  wishlisted={wishlist.includes(p.id)}
                  bagQty={bagQtyOf(cart, p.id)}
                />
              ))}
            </div>
          </section>
        )}
        <section className="quote section">
          <p>
            “A jewel is not just worn.
            <br />
            <em>It becomes part of you.”</em>
          </p>
          <span>— Roshani Shrestha, Creative Director</span>
        </section>
        <section className="section featured-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE CHAPTERS</p>
              <h2>Shop by collection</h2>
            </div>
            <Link className="text-link" to="/collections">
              All collections <ArrowRight size={15} />
            </Link>
          </div>
          <div className="collection-grid" style={{ padding: 0 }}>
            {collections.map((c) => (
              <Link to="/shop" className="collection-tile" key={c.id}>
                <img src={c.image} alt={c.title} loading="lazy" />
                <div>
                  <p>{c.subtitle}</p>
                  <h2>{c.title}</h2>
                  <span>
                    Explore <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">WORN & LOVED</p>
              <h2>Collectors' words</h2>
            </div>
            <Link className="text-link" to="/journal">
              From the journal <ArrowRight size={15} />
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {testimonials.map((t) => (
              <figure
                key={t.name}
                style={{
                  margin: 0,
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  padding: 26,
                }}
              >
                <div style={{ display: "flex", gap: 3, color: "var(--gold)", marginBottom: 12 }}>
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} size={14} fill="currentColor" />
                  ))}
                </div>
                <blockquote
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: 19,
                    lineHeight: 1.5,
                    color: "var(--emerald)",
                    margin: "0 0 14px",
                  }}
                >
                  “{t.quote}”
                </blockquote>
                <figcaption style={{ fontSize: 12, color: "var(--muted)" }}>
                  <strong style={{ color: "var(--ink)" }}>{t.name}</strong>
                  <br />
                  {t.detail}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section className="section featured-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">HOUSE PROMISES</p>
              <h2>Bought once, kept for life</h2>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {[
              [<ShieldCheck key="s" size={22} />, "Hallmarked gold", "Weight, purity and origin guaranteed in writing on every piece."],
              [<Truck key="t" size={22} />, "Insured delivery", "Complimentary, gift-wrapped and fully insured across Nepal."],
              [<Award key="a" size={22} />, "Lifetime buyback", "Bring any Tridev piece home to us — always, at a fair value."],
              [<Gift key="g" size={22} />, "Ready to gift", "Signature box, hand-written note and 7-day easy exchange."],
            ].map(([icon, title, copy]) => (
              <div
                key={title}
                style={{
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  padding: 24,
                }}
              >
                <div style={{ color: "var(--gold)", marginBottom: 12 }}>{icon}</div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 19, margin: "0 0 8px", color: "var(--emerald)" }}>
                  {title}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>{copy}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="button button-dark" to="/contact">
              Book an atelier visit <ArrowRight size={16} />
            </Link>
            <Link className="button button-outline" to="/about">
              Our story since 1988 <ArrowRight size={16} />
            </Link>
          </div>
        </section>
        <MapSection compact />
      </main>
      <Footer />
    </>
  );
}

function Shop({ catalog, cart, onWishlist, wishlist, allCategories }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [category, setCategory] = useState(() => {
    const c = searchParams.get("category");
    return c && allCategories.includes(c) ? c : "All pieces";
  });
  const [sort, setSort] = useState(() => searchParams.get("sort") || "Featured");
  const [maxPrice, setMaxPrice] = useState(() => {
    const m = Number(searchParams.get("max"));
    return Number.isFinite(m) && m > 0 ? m : 300000;
  });
  /* Keep the URL bar in sync so filtered views are shareable links. */
  useEffect(() => {
    const params = {};
    if (query) params.q = query;
    if (category !== "All pieces") params.category = category;
    if (sort !== "Featured") params.sort = sort;
    if (maxPrice !== 300000) params.max = String(maxPrice);
    setSearchParams(params, { replace: true });
  }, [query, category, sort, maxPrice, setSearchParams]);
  const visible = useMemo(
    () =>
      catalog
        .filter(
          (p) =>
            (category === "All pieces" || p.category === category) &&
            p.name.toLowerCase().includes(query.toLowerCase()) &&
            p.price <= maxPrice
        )
        .sort((a, b) =>
          sort === "Price: low to high"
            ? a.price - b.price
            : sort === "Price: high to low"
              ? b.price - a.price
              : 0
        ),
    [query, category, sort, maxPrice, catalog]
  );
  return (
    <>
      <main className="shop-page">
        <div className="page-intro">
          <p className="eyebrow">THE TRIDEV COLLECTION</p>
          <h1>
            Find your <em>forever piece.</em>
          </h1>
          <p>
            Thoughtful jewellery for everyday rituals and once-in-a-lifetime
            moments.
          </p>
        </div>
        <div className="shop-toolbar">
          <div className="category-pills">
            {allCategories.map((c) => (
              <button
                key={c}
                className={category === c ? "selected" : ""}
                onClick={() => setCategory(c)}
                data-testid={`filter-${c.toLowerCase().replace(" ", "-")}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="toolbar-right">
            <label className="search-input">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pieces"
                data-testid="shop-search-input"
                aria-label="Search pieces"
              />
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              data-testid="sort-select"
              aria-label="Sort products"
            >
              <option>Featured</option>
              <option>Price: low to high</option>
              <option>Price: high to low</option>
            </select>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            padding: "14px 7vw 0",
            fontSize: 12,
            color: "var(--muted)",
          }}
        >
          <label htmlFor="price-range">
            Up to <strong>{formatNpr(maxPrice)}</strong>
          </label>
          <input
            id="price-range"
            type="range"
            min={30000}
            max={300000}
            step={5000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            data-testid="price-filter"
            style={{ accentColor: "#0e3028" }}
          />
          <button
            onClick={() => {
              setQuery("");
              setCategory("All pieces");
              setSort("Featured");
              setMaxPrice(300000);
            }}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "1px solid var(--line)",
              padding: "6px 10px",
              fontSize: 11,
            }}
          >
            Reset filters
          </button>
        </div>
        <p className="results-count" data-testid="results-count">
          {visible.length} {visible.length === 1 ? "piece" : "pieces"} · NPR demo prices ·{" "}
          {category === "All pieces"
            ? "the full house collection"
            : category === "Rings"
              ? "solitaires, halos and bands"
              : category === "Necklaces"
                ? "pendants, chokers and bridal suites"
                : category === "Earrings"
                  ? "jhumkas, studs and drops"
                  : "cuffs, bangles and lines"}
        </p>
        <div className="product-grid shop-grid">
          {visible.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onWishlist={onWishlist}
              wishlisted={wishlist.includes(p.id)}
              bagQty={bagQtyOf(cart, p.id)}
            />
          ))}
        </div>
        {visible.length === 0 && (
          <div className="empty-state" style={{ paddingBottom: 80 }}>
            <Search size={28} />
            <h2>No pieces match those filters.</h2>
            <p>Try a different search or price range.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function Product({ catalog, cart, onAdd, onWishlist, wishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = catalog.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);
  if (!product) {
    return (
      <>
        <main className="cart-page">
          <div className="empty-state">
            <Box size={32} />
            <p className="eyebrow">OUT OF STOCK</p>
            <h2>This piece is no longer available.</h2>
            <p>It may have sold out or been retired from the collection.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <Link className="button button-dark" to="/shop">
                Browse available pieces <ArrowRight size={16} />
              </Link>
              <Link className="button button-outline" to="/orders">
                Back to orders <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  const inBag = Array.isArray(cart) && cart.some((i) => i.id === product.id);
  const shareLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const gallery = product.gallery && product.gallery.length ? product.gallery : [product.image];
  const related = catalog
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  return (
    <>
      <main className="product-page">
        <div className="breadcrumbs">
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>
        <div className="product-layout">
          <div>
            <div className="product-gallery">
              <Img
                src={gallery[activeImg]}
                alt={product.name}
                style={{ gridColumn: "1 / -1", aspectRatio: "1.1" }}
                data-testid="product-main-image"
              />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    border: i === activeImg ? "2px solid var(--gold)" : "1px solid var(--line)",
                    padding: 0,
                    background: "none",
                  }}
                  data-testid={`product-thumb-${i}`}
                  aria-label={`View image ${i + 1}`}
                >
                  <Img
                    src={src}
                    alt={`${product.name} view ${i + 1}`}
                    style={{ width: 72, height: 72, objectFit: "cover", display: "block" }}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="product-info">
            <p className="eyebrow">
              {product.category} · {product.id}
            </p>
            <h1>{product.name}</h1>
            <div className="product-price">
              {formatNpr(product.price)} <span>Demo price</span>
            </div>
            {product.rating && (
              <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 12px" }} data-testid="product-rating">
                {"★".repeat(Math.round(product.rating))}{" "}
                {product.rating.toFixed(1)} · {product.reviews ?? 0} collector reviews
              </p>
            )}
            <p className="product-description">{product.description}</p>
            <div className="detail-line">
              <span>Material</span>
              <strong>{product.material}</strong>
            </div>
            <div className="detail-line">
              <span>Approx. weight</span>
              <strong>{product.weight || "—"}</strong>
            </div>
            <div className="detail-line">
              <span>Availability</span>
              <strong>
                {(product.stock ?? 5) > 0
                  ? `In atelier · ${product.stock ?? 5} ready`
                  : "Made to order"}
              </strong>
            </div>
            <div className="detail-line">
              <span>Shipping</span>
              <strong>Complimentary across Nepal</strong>
            </div>
            <div className="purchase-row">
              <div className="quantity">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  data-testid="quantity-decrease"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span data-testid="quantity-value">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  data-testid="quantity-increase"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>
              <button
                className="button button-dark"
                onClick={() => {
                  if (inBag) {
                    navigate("/cart");
                  } else {
                    onAdd(product, qty);
                    setAdded(true);
                  }
                }}
                data-testid="add-to-cart-button"
              >
                {inBag ? (
                  <>In your bag — view it <ShoppingBag size={16} /></>
                ) : added ? (
                  <>Added to bag <BadgeCheck size={16} /></>
                ) : (
                  <>Add to bag <ShoppingBag size={16} /></>
                )}
              </button>
              <button
                className={`icon-button large ${wishlist.includes(product.id) ? "active" : ""}`}
                onClick={() => onWishlist(product.id)}
                data-testid="product-wishlist-button"
                aria-label="Toggle wishlist"
              >
                <Heart
                  size={19}
                  fill={wishlist.includes(product.id) ? "currentColor" : "none"}
                />
              </button>
              <button
                className="icon-button large"
                onClick={shareLink}
                data-testid="product-share-button"
                aria-label="Copy link to this piece"
                title="Copy link to this piece"
              >
                {copied ? <BadgeCheck size={19} /> : <Share2 size={19} />}
              </button>
            </div>
            {copied && (
              <p style={{ fontSize: 12, color: "var(--gold)" }} data-testid="share-copied">
                Link copied — share this piece anywhere.
              </p>
            )}
            <div className="accordions">
              <details open>
                <summary>
                  Details & materials <ChevronDown size={16} />
                </summary>
                <ul style={{ paddingLeft: 18, lineHeight: 1.8, fontSize: 14 }}>
                  {(product.details || [product.material]).map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </details>
              <details>
                <summary>
                  Care & delivery <ChevronDown size={16} />
                </summary>
                <p>
                  Your piece arrives gift-wrapped in our signature box, with
                  complimentary insured delivery across Nepal. 7-day easy
                  exchange and lifetime buyback, always.
                </p>
              </details>
              <details>
                <summary>
                  Sizing & appointments <ChevronDown size={16} />
                </summary>
                <p>
                  Complimentary resizing within 30 days. Prefer to try it on?
                  Book a private viewing at our Golbazar atelier — we will
                  have your shortlist waiting.
                </p>
              </details>
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="section-heading">
              <div>
                <p className="eyebrow">COLLECTOR NOTES</p>
                <h2>
                  Loved & worn · {product.rating ? product.rating.toFixed(1) : "5.0"} / 5
                </h2>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
                marginBottom: 60,
              }}
            >
              {[
                ["Prerana M.", "Wore it to my sister's wedding — strangers stopped me to ask about it. The finish is even lovelier in person."],
                ["Bibek R.", "Bought with full confidence. Weight, hallmark and paperwork all exactly as promised over the phone."],
                ["Sneha T.", "Delicate yet sturdy for daily wear. The box and hand-written note made it feel truly special."],
              ].map(([name, text]) => (
                <figure
                  key={name}
                  style={{
                    margin: 0,
                    background: "var(--paper)",
                    border: "1px solid var(--line)",
                    padding: 22,
                  }}
                >
                  <div style={{ display: "flex", gap: 3, color: "var(--gold)", marginBottom: 10 }}>
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <blockquote style={{ fontSize: 14, lineHeight: 1.7, margin: "0 0 10px", color: "#4d5d56" }}>
                    “{text}”
                  </blockquote>
                  <figcaption style={{ fontSize: 12, color: "var(--muted)" }}>
                    <strong style={{ color: "var(--ink)" }}>{name}</strong> · Verified collector
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="section-heading">
              <h2>You may also like</h2>
              <Link className="text-link" to="/shop">
                View all <ArrowRight size={15} />
              </Link>
            </div>
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onWishlist={onWishlist}
                  wishlisted={wishlist.includes(p.id)}
                  bagQty={bagQtyOf(cart, p.id)}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function Collections({ catalog }) {
  const countFor = (id) => {
    if (!Array.isArray(catalog)) return "";
    if (id === "heirloom") return catalog.filter((p) => p.category === "Necklaces").length;
    if (id === "new-moon") return catalog.filter((p) => p.category === "Rings").length;
    return catalog.length;
  };
  return (
    <>
      <main>
        <section className="page-intro collection-intro">
          <p className="eyebrow">A STUDY IN CONTRASTS</p>
          <h1>
            Collections with
            <br />
            <em>a point of view.</em>
          </h1>
          <p>Discover the chapters that make up the Tridev universe.</p>
        </section>
        <div className="collection-grid">
          {collections.map((c) => (
            <Link to="/shop" className="collection-tile" key={c.id}>
              <img src={c.image} alt={c.title} loading="lazy" />
              <div>
                <p>{c.subtitle}</p>
                <h2>{c.title}</h2>
                <p style={{ fontSize: 13, opacity: 0.85 }}>{c.description}</p>
                <p style={{ fontSize: 11, letterSpacing: ".14em", opacity: 0.75 }}>
                  {countFor(c.id)} PIECES
                </p>
                <span>
                  Explore <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <section className="section featured-section" style={{ marginTop: 20 }}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <p className="eyebrow">CAN'T DECIDE?</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 34, color: "var(--emerald)", margin: "0 0 12px" }}>
              Let the atelier guide you
            </h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.8, fontSize: 15 }}>
              Private viewings, bridal trials and custom commissions — tell us
              the occasion and we will curate a tray before you arrive.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
              <Link className="button button-dark" to="/contact">
                Book an appointment <ArrowRight size={16} />
              </Link>
              <Link className="button button-outline" to="/shop">
                Browse everything <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function SimplePage({ type }) {
  const navigate = useNavigate();
  const data = {
    about: [
      "THE HOUSE OF TRIDEV",
      "Jewellery with a past.\nMade for what comes next.",
      "Tridev began as a small family atelier in the heart of Siraha. Today, our house continues to pair old-world craft with a modern eye — creating pieces that feel personal from the very first wear.",
    ],
    lookbook: [
      "THE 2025 LOOKBOOK",
      "A little more\nlight in the world.",
      "An exercise in texture, movement and the quiet confidence of wearing something made just for you.",
    ],
    journal: [
      "FROM THE JOURNAL",
      "Notes from\nthe atelier.",
      "Stories of craft, culture and the people who make Tridev what it is.",
    ],
  }[type];
  return (
    <>
      <main className="editorial-page">
        <div className="editorial-hero">
          <div>
            <p className="eyebrow">{data[0]}</p>
            <h1>
              {data[1].split("\n").map((s, i) => (
                <span key={i}>
                  {s}
                  <br />
                </span>
              ))}
            </h1>
            <p>{data[2]}</p>
            {type === "about" && (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link className="button button-gold" to="/contact">
                  Visit the atelier <ArrowRight size={16} />
                </Link>
                <Link className="button button-outline" to="/shop">
                  Shop the icons <ArrowRight size={16} />
                </Link>
              </div>
            )}
            {type === "lookbook" && (
              <p style={{ fontSize: 12, color: "var(--muted)" }}>
                Shot on location in Patan · Styling notes in the gallery below.
              </p>
            )}
          </div>
          <img
            src={type === "lookbook" ? images.ring : images.necklace}
            alt={data[0]}
          />
        </div>
        {type === "lookbook" && (
          <div style={{ padding: "30px 7vw 90px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              {lookbookImages.map((g) => (
                <figure key={g.src + g.label} style={{ margin: 0 }}>
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    style={{ width: "100%", aspectRatio: ".85", objectFit: "cover" }}
                  />
                  <figcaption
                    style={{
                      fontSize: 11,
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      padding: "10px 2px",
                    }}
                  >
                    {g.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
        {type === "journal" ? (
          <div className="journal-list">
            {journalPosts.map((x) => (
              <article
                key={x.id}
                onClick={() => navigate(`/journal/${x.id}`)}
                style={{ cursor: "pointer" }}
                data-testid={`journal-${x.id}`}
              >
                <span>{x.index}</span>
                <div>
                  <p className="eyebrow">{x.tag}</p>
                  <h2>{x.title}</h2>
                  <p>{x.excerpt}</p>
                  <p>Read the story →</p>
                </div>
                <img src={x.image} alt={x.title} loading="lazy" />
              </article>
            ))}
          </div>
        ) : (
          type !== "lookbook" && (
            <div className="editorial-body">
              <h2>
                Made slowly.
                <br />
                <em>Meant to last.</em>
              </h2>
              <div>
                <p>
                  We believe the best jewellery is a conversation between the
                  person who makes it and the person who wears it. Our
                  collections are designed in Siraha and made in partnership
                  with skilled artisans who have devoted their lives to the
                  craft.
                </p>
                <p>
                  Each piece carries the small marks of its making — a softer
                  edge, a hand-finished surface, a stone set just so. These are
                  not imperfections. They are proof that someone cared.
                </p>
                <img
                  src={images.craft}
                  alt="Artisan hand-finishing a jewel at the Tridev atelier"
                  loading="lazy"
                  style={{ width: "100%", marginTop: 20, aspectRatio: "16/9", objectFit: "cover" }}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 16,
                    marginTop: 28,
                  }}
                >
                  {[
                    ["1988", "Atelier founded"],
                    ["24", "Signature pieces"],
                    ["100%", "Hallmarked gold"],
                  ].map(([n, l]) => (
                    <div
                      key={l}
                      style={{
                        borderTop: "1px solid var(--line)",
                        paddingTop: 12,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--serif)",
                          fontSize: 28,
                          color: "var(--emerald)",
                        }}
                      >
                        {n}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 36 }}>
                  <p className="eyebrow">OUR TIMELINE</p>
                  <div style={{ display: "grid", gap: 0 }}>
                    {atelierTimeline.map(([year, title, copy]) => (
                      <div
                        key={year}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "70px 1fr",
                          gap: 16,
                          padding: "16px 0",
                          borderTop: "1px solid var(--line)",
                        }}
                      >
                        <strong
                          style={{
                            fontFamily: "var(--serif)",
                            fontSize: 20,
                            color: "var(--gold)",
                          }}
                        >
                          {year}
                        </strong>
                        <div>
                          <strong style={{ fontSize: 14 }}>{title}</strong>
                          <p style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0 0", lineHeight: 1.7 }}>
                            {copy}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </main>
      <Footer />
    </>
  );
}

function JournalDetail() {
  const { id } = useParams();
  const post = journalPosts.find((p) => p.id === id) || journalPosts[0];
  const related = journalPosts.filter((p) => p.id !== post.id);
  return (
    <>
      <main className="editorial-page">
        <div className="editorial-hero">
          <div>
            <p className="eyebrow">
              {post.tag} · {post.readTime || "5 min read"}
            </p>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            <Link className="text-link" to="/journal">
              ← Back to journal
            </Link>
          </div>
          <img src={post.image} alt={post.title} />
        </div>
        <div className="editorial-body">
          <h2>
            From the bench,
            <br />
            <em>with patience.</em>
          </h2>
          <div>
            {(post.body || []).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <Link className="button button-outline" to="/shop" style={{ marginTop: 12 }}>
              Shop the pieces <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        {related.length > 0 && (
          <div className="journal-list" style={{ paddingTop: 0 }}>
            <p className="eyebrow">KEEP READING</p>
            {related.map((x) => (
              <Link key={x.id} to={`/journal/${x.id}`} style={{ textDecoration: "none" }}>
                <article data-testid={`journal-${x.id}`}>
                  <span>{x.index}</span>
                  <div>
                    <p className="eyebrow">{x.tag}</p>
                    <h2>{x.title}</h2>
                    <p>{x.excerpt}</p>
                    <p>Read the story →</p>
                  </div>
                  <img src={x.image} alt={x.title} loading="lazy" />
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function FaqPage() {
  const [openGroup, setOpenGroup] = useState(0);
  return (
    <>
      <main>
        <div className="page-intro">
          <p className="eyebrow">GOOD TO KNOW</p>
          <h1>
            Questions, <em>answered.</em>
          </h1>
          <p>
            Everything about delivery, gold, exchange and appointments. Still
            curious?{" "}
            <Link to="/contact" style={{ textDecoration: "underline" }}>
              Ask the atelier
            </Link>
            .
          </p>
        </div>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 7vw 30px" }}>
          <div className="category-pills" style={{ justifyContent: "center", marginBottom: 26 }}>
            {faqGroups.map((g, i) => (
              <button
                key={g.title}
                className={openGroup === i ? "selected" : ""}
                onClick={() => setOpenGroup(i)}
                data-testid={`faq-group-${i}`}
              >
                {g.title}
              </button>
            ))}
          </div>
          <div className="accordions" data-testid="faq-list">
            {faqGroups[openGroup].faqs.map(([q, a]) => (
              <details key={q} open={false}>
                <summary>
                  {q} <ChevronDown size={16} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
        <MapSection compact />
      </main>
      <Footer />
    </>
  );
}

function Contact({ onInquiry }) {
  const [sent, setSent] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", topic: "General enquiry", message: "" });
  return (
    <>
      <main className="contact-page">
        <div>
          <p className="eyebrow">WE WOULD LOVE TO HEAR FROM YOU</p>
          <h1>
            Come say
            <br />
            <em>hello.</em>
          </h1>
          <p>
            For appointments, custom enquiries or simply to share a story, our
            team is here.
          </p>
          <div className="contact-details">
            <div>
              <span>Visit</span>
              <strong>
                {STORE.name}
                <br />
                {STORE.street.split(",").slice(0, 2).join(",")}
              </strong>
            </div>
            <div>
              <span>Write</span>
              <strong>
                {STORE.email}
                <br />
                {STORE.phone}
              </strong>
            </div>
            <div>
              <span>Hours</span>
              <strong>{STORE.hours}</strong>
            </div>
          </div>
        </div>
        <form
          className="inquiry-form"
          onSubmit={(e) => {
            e.preventDefault();
            const ref = onInquiry(form);
            setSent(ref);
          }}
        >
          <p className="eyebrow">SEND AN ENQUIRY</p>
          <label>
            Your name
            <input
              required
              placeholder="How should we call you?"
              data-testid="contact-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            Email address
            <input
              required
              type="email"
              placeholder="you@example.com"
              data-testid="contact-email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            What can we help with?
            <select
              data-testid="contact-topic"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
            >
              <option>General enquiry</option>
              <option>Book an appointment</option>
              <option>Custom design</option>
              <option>Aftercare</option>
            </select>
          </label>
          <label>
            Message
            <textarea
              rows="4"
              placeholder="Tell us a little more..."
              data-testid="contact-message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </label>
          <button
            className="button button-dark"
            type="submit"
            data-testid="contact-submit"
          >
            {sent ? "Thank you — we'll be in touch" : "Send enquiry"}{" "}
            <ArrowRight size={16} />
          </button>
          {sent && (
            <p data-testid="contact-success" style={{ fontSize: 13 }}>
              <BadgeCheck size={14} style={{ verticalAlign: "-2px" }} /> Enquiry{" "}
              <strong>{sent}</strong> saved in this browser. Our demo admin can
              review it under Admin → Inquiries.
            </p>
          )}
        </form>
      </main>
      <MapSection />
      <section className="section featured-section">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p className="eyebrow" style={{ textAlign: "center" }}>GOOD TO KNOW</p>
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: 34,
              textAlign: "center",
              color: "var(--emerald)",
              margin: "0 0 26px",
            }}
          >
            Frequently asked
          </h2>
          <div className="accordions">
            {[
              ["Do I need an appointment to visit?", "Walk-ins are welcome Sun–Fri, 10am–6pm. For bridal and custom design, an appointment reserves a private viewing with your shortlist ready."],
              ["How is the NPR price calculated?", "Every demo price reflects gold weight × purity plus the artisan's making charge — hallmarked and explained in writing before you decide."],
              ["Do you deliver outside Siraha?", "Yes — complimentary insured delivery across Nepal on orders over NPR 25,000, gift-wrapped with tracking."],
              ["What about exchange and buyback?", "7-day easy exchange on unworn pieces and lifetime buyback on all Tridev jewellery, at fair transparent value."],
              ["Can you restore my old jewellery?", "Gladly. Bring heirloom pieces to the atelier for assessment — restoration and re-setting are a house speciality."],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q} <ChevronDown size={16} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 22 }}>
            <Link className="text-link" to="/faq">
              View all FAQs <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function Cart({ cart, onRemove, onUpdate, catalog, onAdd, onWishlist, wishlist }) {
  const total = cart.reduce((sum, x) => sum + x.price * x.qty, 0);
  const count = cart.reduce((sum, x) => sum + x.qty, 0);
  const suggestions = (catalog || [])
    .filter((p) => !cart.some((i) => i.id === p.id))
    .slice(0, 2);
  return (
    <>
      <main className="cart-page">
        <div className="page-intro compact">
          <p className="eyebrow">YOUR SELECTION</p>
          <h1>
            Your <em>bag.</em>
          </h1>
          {cart.length > 0 && (
            <p>
              {count} {count === 1 ? "piece" : "pieces"} · gift-wrapped & insured
            </p>
          )}
        </div>
        {cart.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={32} />
            <h2>Your bag is waiting.</h2>
            <p>Start with something that feels like you.</p>
            <Link className="button button-dark" to="/shop">
              Explore pieces <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-layout">
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <Img src={item.image} alt={item.name} />
                    <div>
                      <p className="product-category">{item.category}</p>
                      <h3>{item.name}</h3>
                      <p>
                        {formatNpr(item.price)} each · Qty {item.qty} ·{" "}
                        <strong>{formatNpr(item.price * item.qty)}</strong>
                      </p>
                      <div className="quantity">
                        <button
                          onClick={() => onUpdate(item.id, Math.max(1, item.qty - 1))}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span data-testid={`qty-${item.id}`}>{item.qty}</span>
                        <button
                          onClick={() => onUpdate(item.id, item.qty + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      className="icon-button"
                      style={{ border: "1px solid var(--line)" }}
                      onClick={() => onRemove(item.id)}
                      data-testid={`remove-${item.id}`}
                      aria-label={`Remove ${item.name} from bag`}
                      title="Remove from bag"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <aside className="order-summary">
                <p className="eyebrow">ORDER SUMMARY</p>
                <div>
                  <span>Subtotal ({count} items)</span>
                  <strong>{formatNpr(total)}</strong>
                </div>
                <div>
                  <span>Delivery</span>
                  <strong>Complimentary</strong>
                </div>
                <div>
                  <span>Gift wrap & note</span>
                  <strong>Included</strong>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <strong>{formatNpr(total)}</strong>
                </div>
                <Link
                  className="button button-dark full"
                  to="/checkout"
                  data-testid="checkout-button"
                >
                  Proceed to checkout <ArrowRight size={16} />
                </Link>
                <small>
                  <Truck size={12} style={{ verticalAlign: "-2px" }} /> Insured
                  delivery across Nepal · 7-day exchange · Demo checkout, no
                  payment is processed
                </small>
              </aside>
            </div>
            {suggestions.length > 0 && (
              <section className="section" style={{ paddingTop: 0 }}>
                <div className="section-heading">
                  <h2>Complete the look</h2>
                  <Link className="text-link" to="/shop">
                    View all <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="product-grid">
                  {suggestions.map((p) => (
                    <div key={p.id}>
                      <ProductCard
                        product={p}
                        onWishlist={onWishlist}
                        wishlisted={(wishlist || []).includes(p.id)}
                        bagQty={bagQtyOf(cart, p.id)}
                      />
                      <button
                        className="button button-outline"
                        style={{ marginTop: 10, width: "100%" }}
                        onClick={() => onAdd(p, 1)}
                        data-testid={`upsell-add-${p.id}`}
                      >
                        Add to bag <ShoppingBag size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

function Checkout({ cart, user, profile, onPlaceOrder }) {
  const navigate = useNavigate();
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const count = cart.reduce((s, x) => s + x.qty, 0);
  const [form, setForm] = useState({
    name: profile?.name || user?.name || "",
    email: profile?.email || user?.email || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    note: "",
  });
  const [delivery, setDelivery] = useState("standard");
  const [giftWrap, setGiftWrap] = useState(true);
  const [error, setError] = useState("");
  const deliveryFee = delivery === "express" ? 950 : 0;
  const total = subtotal + deliveryFee;
  if (cart.length === 0) {
    return (
      <>
        <main className="cart-page">
          <div className="empty-state">
            <Box size={30} />
            <h2>Nothing to check out yet.</h2>
            <Link className="button button-dark" to="/shop">
              Browse pieces <ArrowRight size={16} />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  return (
    <>
      <main className="cart-page">
        <div className="page-intro compact">
          <p className="eyebrow">ALMOST YOURS</p>
          <h1>
            Demo <em>checkout.</em>
          </h1>
          <p>No real payment — an order is created in your browser.</p>
        </div>
        <div className="cart-layout">
          <form
            className="inquiry-form"
            style={{ margin: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.name || !form.email || !form.address) {
                setError("Please add your name, email and delivery address.");
                return;
              }
              const order = onPlaceOrder(
                { ...form, delivery, giftWrap },
                total
              );
              navigate("/orders", { state: { newOrder: order.id } });
            }}
          >
            <label>
              Full name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                data-testid="checkout-name"
                placeholder="Your name"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                data-testid="checkout-email"
                placeholder="you@example.com"
              />
            </label>
            <label>
              Phone
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+977-…"
                data-testid="checkout-phone"
              />
            </label>
            <label>
              Delivery address
              <textarea
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street, city"
                data-testid="checkout-address"
              />
            </label>
            <div style={{ display: "grid", gap: 8, margin: "4px 0 14px" }}>
              <p className="eyebrow" style={{ margin: 0 }}>DELIVERY</p>
              {[
                ["standard", "Standard · Complimentary", "Insured, gift-wrapped · 3–5 days across Nepal"],
                ["express", "Express · NPR 950", "Priority atelier dispatch · 1–2 days in the valley"],
              ].map(([value, title, copy]) => (
                <label
                  key={value}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    border: delivery === value ? "1px solid var(--gold)" : "1px solid var(--line)",
                    background: "#fff",
                    padding: "10px 12px",
                    cursor: "pointer",
                    margin: 0,
                  }}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={value}
                    checked={delivery === value}
                    onChange={() => setDelivery(value)}
                    data-testid={`delivery-${value}`}
                    style={{ width: "auto", margin: "4px 0 0" }}
                  />
                  <span style={{ fontSize: 13 }}>
                    <strong>{title}</strong>
                    <br />
                    <span style={{ color: "var(--muted)" }}>{copy}</span>
                  </span>
                </label>
              ))}
              <label
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  fontSize: 13,
                  margin: 0,
                }}
              >
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  data-testid="gift-wrap"
                  style={{ width: "auto", margin: 0 }}
                />
                <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                  <Gift size={14} /> Signature gift wrap & hand-written note (complimentary)
                </span>
              </label>
            </div>
            <label>
              Note for the atelier <span style={{ color: "var(--muted)" }}>(optional)</span>
              <textarea
                rows={2}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Ring size, occasion date, gift message…"
                data-testid="checkout-note"
              />
            </label>
            {error && (
              <p style={{ color: "#9d2c2c", fontSize: 13 }} data-testid="checkout-error">
                {error}
              </p>
            )}
            <button className="button button-dark full" type="submit" data-testid="place-order-button">
              Place demo order · {formatNpr(total)} <ArrowRight size={16} />
            </button>
          </form>
          <aside className="order-summary">
            <p className="eyebrow">YOUR ITEMS · {count} {count === 1 ? "PIECE" : "PIECES"}</p>
            {cart.map((i) => (
              <div key={i.id} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
                <Img src={i.image} alt={i.name} style={{ width: 52, height: 52, objectFit: "cover" }} />
                <div style={{ fontSize: 13, flex: 1 }}>
                  <div>{i.name}</div>
                  <div style={{ color: "var(--muted)" }}>
                    Qty {i.qty} × {formatNpr(i.price)}
                  </div>
                </div>
                <strong style={{ fontSize: 13 }}>{formatNpr(i.price * i.qty)}</strong>
              </div>
            ))}
            <div>
              <span>Subtotal</span>
              <strong>{formatNpr(subtotal)}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>{deliveryFee === 0 ? "Complimentary" : formatNpr(deliveryFee)}</strong>
            </div>
            <div>
              <span>Gift wrap</span>
              <strong>{giftWrap ? "Included" : "—"}</strong>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatNpr(total)}</strong>
            </div>
            <small>
              <ShieldCheck size={12} style={{ verticalAlign: "-2px" }} /> Demo
              checkout · no payment is processed
            </small>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Account({ user, isAdmin, orders, wishlist, catalog, profile, onSaveProfile, onLoginOpen, onLogout }) {
  const myOrders = user ? orders.filter((o) => o.email === user.email) : [];
  const saved = catalog.filter((p) => wishlist.includes(p.id)).slice(0, 3);
  const [editing, setEditing] = useState(false);
  const [savedNote, setSavedNote] = useState(false);
  const [draft, setDraft] = useState(null);
  const startEdit = () => {
    setDraft({
      name: profile?.name || user?.name || "",
      email: profile?.email || user?.email || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      city: profile?.city || "Golbazar",
      occasion: profile?.occasion || "Everyday",
      newsletter: profile?.newsletter !== false,
    });
    setEditing(true);
    setSavedNote(false);
  };
  const lifetime = myOrders
    .filter((o) => o.status !== "Cancelled")
    .reduce((s, o) => s + (o.total || 0), 0);
  const points = Math.floor(lifetime / 1000);
  const tier = lifetime >= 300000 ? "Heirloom Circle" : lifetime >= 100000 ? "Gold Circle" : "Welcome Circle";
  const nextTierAt = lifetime >= 300000 ? null : lifetime >= 100000 ? 300000 : 100000;
  return (
    <>
      <main className="account-page">
        <div className="page-intro compact">
          <p className="eyebrow">YOUR TRIDEV</p>
          <h1>
            Welcome <em>home.</em>
          </h1>
        </div>
        {user || isAdmin ? (
          <div className="account-grid">
            <div className="account-card">
              <span className="avatar">{(user?.name || "Admin")[0]}</span>
              <p className="eyebrow">{isAdmin ? "ADMIN SESSION" : "MEMBER"}</p>
              <h2>{profile?.name || user?.name || "Tridev Admin"}</h2>
              <p>{profile?.email || user?.email || "admin@tridevjewellers.com"}</p>
              {!isAdmin && (profile?.phone || profile?.address || profile?.city) && (
                <p style={{ fontSize: 13, color: "var(--muted)" }}>
                  {[profile?.phone, profile?.address, profile?.city].filter(Boolean).join(" · ")}
                </p>
              )}
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
                <Link className="text-link" to="/orders">
                  View order history <ArrowRight size={15} />
                </Link>
                {!isAdmin && (
                  <button
                    onClick={startEdit}
                    className="icon-button"
                    style={{ border: "1px solid var(--line)", borderRadius: "50%" }}
                    data-testid="edit-profile-button"
                    aria-label="Customise my info"
                    title="Customise my info"
                  >
                    <Settings size={17} />
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="icon-button"
                  style={{ border: "1px solid var(--line)", borderRadius: "50%" }}
                  data-testid="logout-button"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut size={17} />
                </button>
              </div>
              {isAdmin && (
                <Link className="button button-dark" to="/admin" style={{ marginTop: 16 }}>
                  Open admin dashboard <ArrowRight size={15} />
                </Link>
              )}
            </div>
            {!isAdmin && editing && draft && (
              <div className="account-card">
                <p className="eyebrow">PERSONAL DETAILS</p>
                <h2>Make it yours</h2>
                <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                  <label style={{ fontSize: 12 }}>
                    Full name
                    <input
                      style={inputStyle}
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      data-testid="profile-name"
                    />
                  </label>
                  <label style={{ fontSize: 12 }}>
                    Email (account identity — can't be changed)
                    <input
                      style={{ ...inputStyle, opacity: 0.6 }}
                      type="email"
                      value={draft.email}
                      disabled
                      data-testid="profile-email"
                    />
                  </label>
                  <label style={{ fontSize: 12 }}>
                    Phone
                    <input
                      style={inputStyle}
                      value={draft.phone}
                      onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                      placeholder="+977-…"
                      data-testid="profile-phone"
                    />
                  </label>
                  <label style={{ fontSize: 12 }}>
                    Delivery address
                    <input
                      style={inputStyle}
                      value={draft.address}
                      onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                      placeholder="Street, tole"
                      data-testid="profile-address"
                    />
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <label style={{ fontSize: 12 }}>
                      City
                      <select
                        style={inputStyle}
                        value={draft.city}
                        onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                        data-testid="profile-city"
                      >
                        {["Golbazar", "Siraha", "Lahan", "Janakpur", "Biratnagar", "Kathmandu", "Lalitpur", "Pokhara", "Other"].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                    <label style={{ fontSize: 12 }}>
                      Shopping for
                      <select
                        style={inputStyle}
                        value={draft.occasion}
                        onChange={(e) => setDraft({ ...draft, occasion: e.target.value })}
                        data-testid="profile-occasion"
                      >
                        {["Everyday", "Wedding / Bridal", "Festive gifting", "Heirloom restoration", "Just browsing"].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label style={{ fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={draft.newsletter}
                      onChange={(e) => setDraft({ ...draft, newsletter: e.target.checked })}
                      data-testid="profile-newsletter"
                      style={{ width: "auto" }}
                    />
                    Quiet notes on craft & new arrivals
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      className="button button-dark"
                      onClick={() => {
                        onSaveProfile(draft);
                        setEditing(false);
                        setSavedNote(true);
                      }}
                      data-testid="profile-save"
                    >
                      Save details <ArrowRight size={15} />
                    </button>
                    <button className="button button-outline" onClick={() => setEditing(false)}>
                      Cancel
                    </button>
                  </div>
                  {savedNote && (
                    <p style={{ fontSize: 13 }} data-testid="profile-saved">
                      <BadgeCheck size={14} style={{ verticalAlign: "-2px" }} /> Saved —
                      checkout will remember these details.
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="account-card">
              <p className="eyebrow">ORDERS · {myOrders.length}</p>
              {myOrders.length === 0 ? (
                <p>No orders yet — your demo checkout will appear here and in Orders.</p>
              ) : (
                myOrders.slice(0, 3).map((o) => (
                  <div key={o.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
                    <span>#{o.id}</span>
                    <span>{formatNpr(o.total)}</span>
                    <span className="status-pill">{o.status}</span>
                  </div>
                ))
              )}
              <p style={{ marginTop: 12, fontSize: 13 }}>Saved pieces: {wishlist.length}</p>
              {saved.length > 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  {saved.map((s) => (
                    <Link key={s.id} to={`/product/${s.id}`} title={s.name}>
                      <img
                        src={s.image}
                        alt={s.name}
                        style={{ width: 56, height: 56, objectFit: "cover" }}
                        loading="lazy"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="account-card">
              <p className="eyebrow" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <Award size={14} /> {tier.toUpperCase()}
              </p>
              <h2>{points} points</h2>
              <p>
                {formatNpr(lifetime)} lifetime ·{" "}
                {nextTierAt
                  ? `${formatNpr(nextTierAt - lifetime)} to the next circle`
                  : "our highest honour — private previews await"}
              </p>
              {nextTierAt && (
                <div style={{ background: "#eee9db", height: 8, marginTop: 10 }}>
                  <div
                    style={{
                      width: `${Math.min(100, Math.round((lifetime / nextTierAt) * 100))}%`,
                      background: "var(--gold)",
                      height: "100%",
                    }}
                  />
                </div>
              )}
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
                Earn 1 point per NPR 1,000 · redeemable for atelier services in-store.
              </p>
            </div>
          </div>
        ) : (
          <div className="login-card">
            <Sparkles size={24} />
            <h2>Your pieces, all in one place.</h2>
            <p>
              Save favourites, follow your orders and receive private notes from
              the house.
            </p>
            <button
              className="button button-dark"
              onClick={onLoginOpen}
              data-testid="account-login-button"
            >
              Sign in to your account <ArrowRight size={16} />
            </button>
            <p className="demo-note">
              Demo customer: {DEMO_CREDENTIALS.customer.email} / {DEMO_CREDENTIALS.customer.password}
              <br />
              Demo admin: {DEMO_CREDENTIALS.admin.email} / {DEMO_CREDENTIALS.admin.password}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function OrdersPage({ user, isAdmin, orders, catalog, onReorder }) {
  const navigate = useNavigate();
  /* Strict per-account scoping: an admin session never inherits customer
     orders on the storefront — those live in Admin → Orders. */
  const visible = user ? orders.filter((o) => o.email === user.email) : [];
  const totalSpent = visible
    .filter((o) => o.status !== "Cancelled")
    .reduce((s, o) => s + (o.total || 0), 0);
  const totalPieces = visible.reduce(
    (s, o) =>
      s +
      (Array.isArray(o.items)
        ? o.items.reduce((a, i) => a + (i.qty || 0), 0)
        : o.itemCount || 0),
    0
  );
  return (
    <>
      <main className="cart-page">
        <div className="page-intro compact">
          <p className="eyebrow">TRACK EVERYTHING</p>
          <h1>
            Order <em>history.</em>
          </h1>
          <p>{user ? `Showing orders for ${user.email}` : isAdmin ? "You are signed in as admin — customer orders live in the dashboard." : "Sign in to see your orders. Demo orders are stored per account in this browser."}</p>
          {visible.length > 0 && (
            <p style={{ marginTop: 8 }}>
              <strong>{visible.length}</strong> {visible.length === 1 ? "order" : "orders"} ·{" "}
              <strong>{totalPieces}</strong> {totalPieces === 1 ? "piece" : "pieces"} ·{" "}
              <strong>{formatNpr(totalSpent)}</strong> lifetime
            </p>
          )}
        </div>
        {visible.length === 0 ? (
          <div className="empty-state">
            <ClipboardList size={30} />
            <h2>No orders yet.</h2>
            <p>
              {isAdmin && !user
                ? "Admin sessions don't share customer bags — open Admin → Orders to manage every order."
                : "Complete a demo checkout and it will appear here."}
            </p>
            {isAdmin && !user ? (
              <Link className="button button-dark" to="/admin">
                Open order admin <ArrowRight size={16} />
              </Link>
            ) : (
              <Link className="button button-dark" to="/shop">
                Start shopping <ArrowRight size={16} />
              </Link>
            )}
          </div>
        ) : (
          <div style={{ padding: "0 7vw 90px", display: "grid", gap: 16 }}>
            {visible.map((o) => {
              const pieces = Array.isArray(o.items)
                ? o.items.reduce((a, i) => a + (i.qty || 0), 0)
                : o.itemCount || 0;
              return (
                <div key={o.id} className="admin-panel" data-testid={`order-${o.id}`}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                    <strong>
                      Order #{o.id} · {o.date} · {pieces} {pieces === 1 ? "piece" : "pieces"}
                    </strong>
                    <span className="status-pill">{o.status}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap",
                      marginTop: 12,
                      fontSize: 13,
                      color: "var(--muted)",
                    }}
                  >
                    {(o.address || o.phone) && (
                      <span style={{ display: "inline-flex", gap: 6, alignItems: "flex-start" }}>
                        <MapPin size={14} style={{ marginTop: 2 }} />
                        <span>
                          {o.customer}
                          {o.address ? <><br />{o.address}</> : null}
                          {o.phone ? <><br />{o.phone}</> : null}
                        </span>
                      </span>
                    )}
                    {!o.address && !o.phone && <span>{o.customer} · {o.email}</span>}
                    <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                      <Truck size={14} />
                      {o.delivery === "express"
                        ? "Express delivery · 1–2 days"
                        : o.status === "Delivered"
                          ? "Delivered with signature"
                          : "Insured delivery · 3–5 days"}
                    </span>
                    {o.giftWrap !== false && (
                      <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                        <Gift size={14} /> Gift wrapped
                      </span>
                    )}
                  </div>
                  {Array.isArray(o.items) && o.items.length > 0 ? (
                    <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                      {o.items.map((raw, idx) => {
                        const i = resolveOrderItem(catalog, raw);
                        const row = (
                          <>
                            {i.image && (
                              <Img
                                src={i.image}
                                alt={i.name}
                                style={{ width: 54, height: 54, objectFit: "cover" }}
                                loading="lazy"
                              />
                            )}
                            <div style={{ flex: 1, fontSize: 13 }}>
                              <div style={{ fontWeight: 600 }}>{i.name}</div>
                              <div style={{ color: "var(--muted)" }}>
                                Qty {i.qty} × {formatNpr(i.price)}
                              </div>
                              {!i.available && (
                                <span className="status-pill" style={{ marginTop: 4, display: "inline-block" }}>
                                  No longer available
                                </span>
                              )}
                            </div>
                            <strong style={{ fontSize: 13 }}>
                              {formatNpr((i.price || 0) * (i.qty || 0))}
                            </strong>
                          </>
                        );
                        return i.available ? (
                          <Link
                            key={`${o.id}-${i.id || idx}`}
                            to={`/product/${i.id}`}
                            style={{ display: "flex", gap: 12, alignItems: "center" }}
                            data-testid={`order-item-${o.id}-${i.id}`}
                          >
                            {row}
                          </Link>
                        ) : (
                          <div
                            key={`${o.id}-${i.id || idx}`}
                            style={{ display: "flex", gap: 12, alignItems: "center", opacity: 0.75 }}
                          >
                            {row}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>
                      {formatOrderItems(o)} — {o.customer}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 10,
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: "1px solid var(--line)",
                    }}
                  >
                    <strong>Order total · {formatNpr(o.total)}</strong>
                    {Array.isArray(o.items) && o.items.length > 0 && (
                      <button
                        className="button button-outline"
                        onClick={() => {
                          onReorder && onReorder(o);
                          navigate("/cart");
                        }}
                        data-testid={`reorder-${o.id}`}
                      >
                        Order again <ShoppingBag size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function Wishlist({ catalog, cart, wishlist, onWishlist, onAdd }) {
  const navigate = useNavigate();
  const items = catalog.filter((p) => wishlist.includes(p.id));
  const total = items.reduce((s, p) => s + p.price, 0);
  return (
    <>
      <main className="shop-page">
        <div className="page-intro compact">
          <p className="eyebrow">SAVED FOR LATER</p>
          <h1>
            Your <em>wishlist.</em>
          </h1>
          {items.length > 0 && (
            <p>
              {items.length} {items.length === 1 ? "piece" : "pieces"} ·{" "}
              {formatNpr(total)} total value
            </p>
          )}
        </div>
        {items.length ? (
          <>
            <div style={{ padding: "0 7vw 18px", display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                className="button button-dark"
                onClick={() => {
                  items.forEach((p) => {
                    onAdd(p, 1);
                    onWishlist(p.id);
                  });
                  navigate("/cart");
                }}
                data-testid="wishlist-add-all"
              >
                Move all to bag <ShoppingBag size={15} />
              </button>
              <Link className="text-link" to="/shop" style={{ alignSelf: "center" }}>
                Keep browsing <ArrowRight size={15} />
              </Link>
            </div>
            <div className="product-grid shop-grid">
            {items.map((p) => (
              <div key={p.id}>
                <ProductCard product={p} onWishlist={onWishlist} wishlisted bagQty={bagQtyOf(cart, p.id)} />
                <button
                  className="button button-outline"
                  style={{ marginTop: 10, width: "100%" }}
                  onClick={() => {
                    onAdd(p, 1);
                    onWishlist(p.id);
                  }}
                  data-testid={`wishlist-add-${p.id}`}
                >
                  Move to bag <ShoppingBag size={14} />
                </button>
              </div>
            ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <Heart size={32} />
            <h2>Nothing saved yet.</h2>
            <p>When a piece catches your eye, save it here.</p>
            <Link className="button button-dark" to="/shop">
              Browse the collection <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function AuthForm({ onLogin, onRegister, onSuccess, idPrefix }) {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(DEMO_CREDENTIALS.customer.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.customer.password);
  const [error, setError] = useState("");
  const tid = (n) => `${idPrefix || ""}${n}`;
  const submit = () => {
    const res =
      mode === "signin"
        ? onLogin(email, password)
        : onRegister(name, email, password);
    if (res.ok) {
      setError("");
      onSuccess && onSuccess(res);
    } else {
      setError(res.message);
    }
  };
  return (
    <div>
      <div className="category-pills" style={{ justifyContent: "center", marginBottom: 18 }}>
        {[
          ["signin", "Sign in"],
          ["create", "Create account"],
        ].map(([value, label]) => (
          <button
            key={value}
            className={mode === value ? "selected" : ""}
            onClick={() => {
              setMode(value);
              setError("");
            }}
            data-testid={tid(`auth-tab-${value}`)}
          >
            {label}
          </button>
        ))}
      </div>
      {mode === "create" && (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-testid={tid("register-name")}
          placeholder="Full name"
          aria-label="Full name"
        />
      )}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        data-testid={tid(mode === "create" ? "register-email" : "login-email")}
        placeholder="Email"
        aria-label="Email"
        type="email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        data-testid={tid(mode === "create" ? "register-password" : "login-password")}
        placeholder={mode === "create" ? "Create a password (min. 6 characters)" : "Password"}
        aria-label="Password"
      />
      {error && (
        <p style={{ color: "#9d2c2c", fontSize: 13 }} data-testid={tid("auth-error")}>
          {error}
        </p>
      )}
      <button
        className="button button-dark full"
        onClick={submit}
        data-testid={tid(mode === "create" ? "register-submit" : "login-submit")}
      >
        {mode === "create" ? "Create my account" : "Sign in"} <ArrowRight size={16} />
      </button>
      {mode === "create" && (
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
          Your account lives in this browser demo — orders, wishlist and profile
          stay linked to your email.
        </p>
      )}
    </div>
  );
}

function RequireCustomer({ user, isAdmin, onLogin, children }) {
  if (isAdmin && !user) {
    return (
      <>
        <main className="account-page">
          <div className="login-card" style={{ margin: "60px auto" }}>
            <ClipboardList size={24} />
            <h2>Admins, this way.</h2>
            <p>Customer order history lives under each signed-in account — manage every order in the dashboard.</p>
            <Link className="button button-dark" to="/admin">
              Open order admin <ArrowRight size={16} />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  if (!user) {
    return (
      <>
        <main className="account-page">
          <div className="login-card" style={{ margin: "60px auto" }}>
            <UserRound size={24} />
            <h2>Sign in to see your orders.</h2>
            <p>Order history is private to each account. Sign in or create an account — it takes seconds.</p>
            <button
              className="button button-dark"
              onClick={onLogin}
              data-testid="orders-login-button"
            >
              Sign in / Create account <ArrowRight size={16} />
            </button>
            <p className="demo-note">
              Demo customer: {DEMO_CREDENTIALS.customer.email} / {DEMO_CREDENTIALS.customer.password}
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  return children;
}

function RequireAdmin({ isAdmin, onLogin, children }) {
  if (!isAdmin) {
    return (
      <>
        <main className="account-page">
          <div className="login-card" style={{ margin: "60px auto" }}>
            <LayoutDashboard size={24} />
            <h2>Admins only.</h2>
            <p>
              This demo dashboard is protected. Sign in with the admin sample
              credentials.
            </p>
            <p className="demo-note">
              {DEMO_CREDENTIALS.admin.email} / {DEMO_CREDENTIALS.admin.password}
            </p>
            <button className="button button-dark" onClick={onLogin} data-testid="admin-login-button">
              Go to sign in <ArrowRight size={16} />
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  return children;
}

const inputStyle = {
  border: "1px solid var(--line)",
  background: "#fff",
  padding: "10px 12px",
  fontSize: 13,
  width: "100%",
};

function Admin({
  catalog,
  setCatalog,
  orders,
  setOrders,
  inquiries,
  setInquiries,
  allCategories,
  setCustomCategories,
  onResetDemo,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = ["Overview", "Products", "Orders", "Customers", "Inquiries", "Gallery"];
  const [tab, setTabState] = useState(() => {
    const t = searchParams.get("tab");
    return validTabs.includes(t) ? t : "Overview";
  });
  /* Shareable admin URLs: /admin?tab=Orders */
  const setTab = (t) => {
    setTabState(t);
    setSearchParams(t === "Overview" ? {} : { tab: t }, { replace: true });
  };
  const [editing, setEditing] = useState(null);
  const [orderQuery, setOrderQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState("All");
  const [orderSort, setOrderSort] = useState("Newest");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [draft, setDraft] = useState({ name: "", category: "Rings", price: "", image: "", material: "", stock: 5 });
  const [newCategory, setNewCategory] = useState("");

  const customers = useMemo(() => {
    const fromOrders = orders.map((o, i) => ({
      id: `O-${o.id}`,
      name: o.customer,
      email: o.email,
      phone: o.phone || "—",
      orders: 1,
      joined: o.date,
      _key: o.id + i,
    }));
    return [...sampleCustomers, ...fromOrders];
  }, [orders]);

  const startAdd = () => {
    setEditing("new");
    setDraft({ name: "", category: "Rings", price: "", image: images.gold, material: "18K Gold", stock: 5 });
  };
  const startEdit = (p) => {
    setEditing(p.id);
    setDraft({ ...p, price: String(p.price), stock: p.stock ?? 5 });
  };
  const saveDraft = () => {
    if (!draft.name || !draft.price) return;
    const price = Number(draft.price);
    if (editing === "new") {
      const id = `TD-C-${Date.now().toString().slice(-6)}`;
      setCatalog([
        ...catalog,
        {
          id,
          name: draft.name,
          category: draft.category,
          price,
          image: draft.image || images.gold,
          gallery: galleryFor(draft.category, draft.image || images.gold),
          material: draft.material,
          badge: "New",
          description: "Custom demo piece added from the admin dashboard.",
          details: ["Demo piece · admin-added", draft.material],
          stock: Number(draft.stock) || 1,
          rating: 5,
          reviews: 0,
        },
      ]);
    } else {
      setCatalog(
        catalog.map((p) =>
          p.id === editing
            ? {
                ...p,
                name: draft.name,
                category: draft.category,
                price,
                image: draft.image,
                gallery: galleryFor(draft.category, draft.image),
                material: draft.material,
                stock: Number(draft.stock) || 0,
              }
            : p
        )
      );
    }
    setEditing(null);
  };

  const totalSales = orders.reduce((s, o) => s + (o.status !== "Cancelled" ? o.total : 0), 0);

  const today = () => new Date().toISOString().slice(0, 10);

  const setOrderStatus = (id, status) => {
    setOrders(
      orders.map((o) =>
        o.id === id
          ? {
              ...o,
              status,
              history: [...(Array.isArray(o.history) ? o.history : []), { status, date: today() }],
            }
          : o
      )
    );
  };

  const filteredOrders = orders
    .filter(
      (o) =>
        (orderFilter === "All" || o.status === orderFilter) &&
        `${o.id} ${o.customer} ${o.email} ${o.phone || ""}`
          .toLowerCase()
          .includes(orderQuery.toLowerCase())
    )
    .sort((a, b) =>
      orderSort === "Oldest"
        ? String(a.date).localeCompare(String(b.date))
        : orderSort === "Highest value"
          ? (b.total || 0) - (a.total || 0)
          : String(b.date).localeCompare(String(a.date))
    );

  const activeOrder = orders.find((o) => o.id === selectedOrder) || null;
  const orderStats = {
    processing: orders.filter((o) => o.status === "Processing").length,
    shipped: orders.filter((o) => o.status === "Shipped").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
  };

  return (
    <main className="admin-page">
      <aside>
        <Link to="/" className="wordmark">
          TRIDEV <span>ADMIN</span>
        </Link>
        <p className="eyebrow">MANAGEMENT</p>
        {[
          ["Overview", <LayoutDashboard key="i" size={15} />],
          ["Products", <Box key="i" size={15} />],
          ["Orders", <ClipboardList key="i" size={15} />],
          ["Customers", <Users key="i" size={15} />],
          ["Inquiries", <MessageSquare key="i" size={15} />],
          ["Gallery", <Images key="i" size={15} />],
        ].map(([t, icon]) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
            data-testid={`admin-${t.toLowerCase()}-tab`}
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            {icon} {t}
          </button>
        ))}
        <button onClick={onResetDemo} style={{ marginTop: 12, fontSize: 12 }}>
          Reset demo data
        </button>
        <Link to="/" className="back-link">
          ← Back to store
        </Link>
      </aside>
      <section>
        <div className="admin-top">
          <div>
            <p className="eyebrow">TRIDEV DEMO WORKSPACE</p>
            <h1>{tab}</h1>
          </div>
          <span className="admin-user">
            A<span>Admin</span>
          </span>
        </div>

        {tab === "Overview" && (
          <>
            <div className="stat-grid">
              {[
                [formatNpr(totalSales), "Total sales", `${orders.length} demo orders`],
                [String(orders.length), "Orders", `${orders.filter((o) => o.status === "Processing").length} awaiting dispatch`],
                [String(customers.length), "Customers", "Sample + checkout names"],
                [String(inquiries.length), "Inquiries", `${inquiries.filter((i) => !i.read).length} unread`],
              ].map((x) => (
                <div className="stat-card" key={x[1]}>
                  <p>{x[1]}</p>
                  <h2>{x[0]}</h2>
                  <span>{x[2]}</span>
                </div>
              ))}
            </div>
            <div className="admin-panel">
              <div className="panel-heading">
                <h2>Recent orders</h2>
                <button onClick={() => setTab("Orders")}>
                  View all <ArrowRight size={14} />
                </button>
              </div>
              {orders.slice(0, 5).map((o) => (
                <div className="order-row" key={o.id}>
                  <span>#{o.id}</span>
                  <span>{o.customer}</span>
                  <span>{formatNpr(o.total)}</span>
                  <span className="status-pill">{o.status}</span>
                </div>
              ))}
              {orders.length === 0 && <p>No orders yet.</p>}
            </div>
            <div className="admin-panel">
              <div className="panel-heading">
                <h2>Latest inquiries</h2>
                <button onClick={() => setTab("Inquiries")}>
                  View all <ArrowRight size={14} />
                </button>
              </div>
              {inquiries.slice(0, 3).map((q) => (
                <div className="order-row" key={q.id}>
                  <span>{q.name}</span>
                  <span>{q.topic}</span>
                  <span>{q.email}</span>
                  <span className="status-pill">{q.read ? "Read" : "New"}</span>
                </div>
              ))}
              {inquiries.length === 0 && <p>No inquiries yet — use Contact page.</p>}
            </div>
            <div className="admin-panel">
              <div className="panel-heading">
                <h2>Needs attention</h2>
                <button onClick={() => setTab("Products")}>
                  Manage stock <ArrowRight size={14} />
                </button>
              </div>
              {catalog.filter((p) => (p.stock ?? 0) <= 4).slice(0, 4).map((p) => (
                <div className="order-row" key={p.id}>
                  <span>{p.name}</span>
                  <span>{p.category}</span>
                  <span>{formatNpr(p.price)}</span>
                  <span className="status-pill">
                    {(p.stock ?? 0) === 0 ? "Made to order" : `Only ${p.stock} left`}
                  </span>
                </div>
              ))}
              {catalog.filter((p) => (p.stock ?? 0) <= 4).length === 0 && (
                <p>All pieces well stocked.</p>
              )}
              {orders.filter((o) => o.delivery === "express" && o.status === "Processing").length > 0 && (
                <p style={{ marginTop: 8, fontSize: 13 }}>
                  <Truck size={13} style={{ verticalAlign: "-2px" }} />{" "}
                  {orders.filter((o) => o.delivery === "express" && o.status === "Processing").length}{" "}
                  express order(s) awaiting priority dispatch.
                </p>
              )}
            </div>
          </>
        )}

        {tab === "Products" && (
          <div className="admin-panel">
            <div className="panel-heading">
              <h2>Products · {catalog.length} (images editable)</h2>
              <button className="button button-dark" onClick={startAdd} data-testid="admin-add-product">
                Add new <Plus size={15} />
              </button>
            </div>
            {editing && (
              <div style={{ display: "grid", gap: 10, marginBottom: 18, background: "#faf9f5", padding: 14, border: "1px solid var(--line)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <input style={inputStyle} placeholder="Piece name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} data-testid="product-name-input" />
                  <select style={inputStyle} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                    {allCategories.filter((c) => c !== "All pieces").map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <input style={inputStyle} placeholder="Price (NPR)" type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} data-testid="product-price-input" />
                  <input style={inputStyle} placeholder="Stock" type="number" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} />
                  <input style={{ ...inputStyle, gridColumn: "1 / -1" }} placeholder="Image URL" value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} data-testid="product-image-input" />
                  <input style={{ ...inputStyle, gridColumn: "1 / -1" }} placeholder="Material, e.g. 18K Gold • Diamond" value={draft.material} onChange={(e) => setDraft({ ...draft, material: e.target.value })} />
                </div>
                {draft.image && (
                  <img src={draft.image} alt="preview" style={{ width: 120, height: 120, objectFit: "cover" }} onError={(e) => (e.currentTarget.style.opacity = 0.3)} />
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="button button-dark" onClick={saveDraft} data-testid="product-save">Save piece</button>
                  <button className="button button-outline" onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </div>
            )}
            <div style={{ display: "grid", gap: 8 }}>
              {catalog.map((p) => (
                <div key={p.id} className="order-row" style={{ gridTemplateColumns: "48px 1fr auto auto auto" }} data-testid={`admin-product-${p.id}`}>
                  <img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: "cover" }} />
                  <span>{p.name} · {formatNpr(p.price)} · stock {p.stock ?? "—"}</span>
                  <button onClick={() => startEdit(p)}>Edit</button>
                  <button onClick={() => setCatalog(catalog.filter((x) => x.id !== p.id))} aria-label={`Delete ${p.id}`}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18 }}>
              <h3 style={{ fontSize: 13 }}>Categories</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0" }}>
                {allCategories.map((c) => (
                  <span key={c} className="status-pill">
                    {c}
                    {c !== "All pieces" && (
                      <button
                        onClick={() => setCustomCategories(allCategories.filter((x) => x !== c))}
                        style={{ marginLeft: 6, background: "none", border: 0 }}
                        aria-label={`Remove ${c}`}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  style={{ ...inputStyle, maxWidth: 240 }}
                  placeholder="New category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  data-testid="category-input"
                />
                <button
                  className="button button-outline"
                  onClick={() => {
                    if (newCategory && !allCategories.includes(newCategory)) {
                      setCustomCategories([...allCategories, newCategory]);
                      setNewCategory("");
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "Orders" && (
          <>
            <div className="stat-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
              {[
                [String(orders.length), "Total orders", formatNpr(totalSales) + " revenue"],
                [String(orderStats.processing), "Processing", "needs packing"],
                [String(orderStats.shipped), "Shipped", "in transit"],
                [String(orderStats.delivered), "Delivered", "with signature"],
              ].map((x) => (
                <div className="stat-card" key={x[1]}>
                  <p>{x[1]}</p>
                  <h2>{x[0]}</h2>
                  <span>{x[2]}</span>
                </div>
              ))}
            </div>
            <div className="admin-panel">
              <div className="panel-heading">
                <h2>Orders · {filteredOrders.length} of {orders.length}</h2>
                <select
                  value={orderSort}
                  onChange={(e) => setOrderSort(e.target.value)}
                  data-testid="orders-sort"
                  aria-label="Sort orders"
                  style={{ fontSize: 12, padding: 6 }}
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Highest value</option>
                </select>
              </div>
              <label className="search-input" style={{ marginBottom: 12 }}>
                <Search size={16} />
                <input
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="Search id, customer, email, phone…"
                  data-testid="orders-search"
                  aria-label="Search orders"
                  style={{ width: "100%" }}
                />
              </label>
              <div className="category-pills" style={{ marginBottom: 14 }}>
                {["All", ...ORDER_STATUSES].map((s) => (
                  <button
                    key={s}
                    className={orderFilter === s ? "selected" : ""}
                    onClick={() => setOrderFilter(s)}
                    data-testid={`orders-filter-${s.toLowerCase()}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {filteredOrders.map((o) => {
                const pieces = Array.isArray(o.items)
                  ? o.items.reduce((a, i) => a + (i.qty || 0), 0)
                  : o.itemCount || 0;
                return (
                  <div
                    key={o.id}
                    className="order-row"
                    style={{ gridTemplateColumns: "1fr auto auto", cursor: "pointer" }}
                    onClick={() => setSelectedOrder(o.id)}
                    data-testid={`admin-order-${o.id}`}
                  >
                    <span>
                      <strong>#{o.id}</strong> · {o.customer} · {pieces}{" "}
                      {pieces === 1 ? "pc" : "pcs"} · {formatNpr(o.total)}
                      <br />
                      <small style={{ color: "var(--muted)" }}>
                        {o.date} · {o.email}
                      </small>
                    </span>
                    <span className="status-pill">{o.status}</span>
                    <span style={{ display: "inline-flex", gap: 4, alignItems: "center", fontSize: 12 }}>
                      Details <ArrowRight size={14} />
                    </span>
                  </div>
                );
              })}
              {filteredOrders.length === 0 && (
                <p>No orders match — try a different search or filter.</p>
              )}
              {orders.length === 0 && <p>No orders — place a demo checkout from the store.</p>}
            </div>
            {activeOrder && (
              <div className="admin-panel" data-testid={`order-detail-${activeOrder.id}`}>
                <div className="panel-heading">
                  <h2>Order #{activeOrder.id}</h2>
                  <button onClick={() => setSelectedOrder(null)} aria-label="Close order details">
                    <X size={16} />
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginBottom: 14,
                  }}
                >
                  <span className="status-pill">{activeOrder.status}</span>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>
                    Placed {activeOrder.date}
                  </span>
                  <select
                    value={activeOrder.status}
                    onChange={(e) => setOrderStatus(activeOrder.id, e.target.value)}
                    data-testid={`order-status-${activeOrder.id}`}
                    aria-label="Update order status"
                    style={{ fontSize: 12, padding: 7, marginLeft: "auto" }}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
                  {(activeOrder.items || []).map((i, idx) => (
                    <div key={`${activeOrder.id}-${i.id || idx}`} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      {i.image && (
                        <img
                          src={i.image}
                          alt={i.name}
                          style={{ width: 54, height: 54, objectFit: "cover" }}
                          loading="lazy"
                        />
                      )}
                      <div style={{ flex: 1, fontSize: 13 }}>
                        <div style={{ fontWeight: 600 }}>{i.name}</div>
                        <div style={{ color: "var(--muted)" }}>
                          Qty {i.qty} × {formatNpr(i.price)}
                        </div>
                      </div>
                      <strong style={{ fontSize: 13 }}>
                        {formatNpr((i.price || 0) * (i.qty || 0))}
                      </strong>
                    </div>
                  ))}
                </div>
                <div className="detail-line">
                  <span>Order total</span>
                  <strong>{formatNpr(activeOrder.total)}</strong>
                </div>
                <div className="detail-line">
                  <span>Delivery</span>
                  <strong>
                    {activeOrder.delivery === "express" ? "Express · 1–2 days" : "Standard · 3–5 days"}
                    {activeOrder.giftWrap !== false ? " · Gift wrapped" : ""}
                  </strong>
                </div>
                <div className="detail-line">
                  <span>Customer</span>
                  <strong>{activeOrder.customer}</strong>
                </div>
                <div className="detail-line">
                  <span>Contact</span>
                  <strong>
                    {activeOrder.email}
                    {activeOrder.phone ? ` · ${activeOrder.phone}` : ""}
                  </strong>
                </div>
                {activeOrder.address && (
                  <div className="detail-line">
                    <span>Address</span>
                    <strong>{activeOrder.address}</strong>
                  </div>
                )}
                {activeOrder.note && (
                  <div className="detail-line">
                    <span>Atelier note</span>
                    <strong>{activeOrder.note}</strong>
                  </div>
                )}
                {Array.isArray(activeOrder.history) && activeOrder.history.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <p className="eyebrow">STATUS TIMELINE</p>
                    <div style={{ display: "grid", gap: 0 }}>
                      {activeOrder.history.map((h, i) => (
                        <div
                          key={`${h.status}-${h.date}-${i}`}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            padding: "8px 0",
                            borderTop: "1px solid var(--line)",
                            fontSize: 13,
                          }}
                        >
                          <BadgeCheck size={14} style={{ color: "var(--gold)" }} />
                          <strong>{h.status}</strong>
                          <span style={{ color: "var(--muted)" }}>{h.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button
                    className="button button-outline"
                    onClick={() => {
                      setOrders(orders.filter((x) => x.id !== activeOrder.id));
                      setSelectedOrder(null);
                    }}
                    data-testid={`order-delete-${activeOrder.id}`}
                  >
                    Delete order <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {tab === "Customers" && (
          <div className="admin-panel">
            <div className="panel-heading">
              <h2>Customers · {customers.length}</h2>
            </div>
            {customers.map((c) => (
              <div key={c._key || c.id} className="order-row">
                <span>{c.name}</span>
                <span>{c.email}</span>
                <span>{c.phone}</span>
                <span className="status-pill">{c.orders ?? 1} orders</span>
              </div>
            ))}
          </div>
        )}

        {tab === "Inquiries" && (
          <div className="admin-panel">
            <div className="panel-heading">
              <h2>Customer inquiries · {inquiries.length}</h2>
            </div>
            {inquiries.map((q) => (
              <div key={q.id} className="order-row" style={{ gridTemplateColumns: "1fr 1fr auto auto" }}>
                <span>
                  <strong>{q.name}</strong> · {q.topic} · {q.email}
                  <br />
                  <small>{q.message || "—"} · {q.date}</small>
                </span>
                <span className="status-pill">{q.read ? "Read" : "New"}</span>
                <button onClick={() => setInquiries(inquiries.map((x) => (x.id === q.id ? { ...x, read: !x.read } : x)))}>
                  {q.read ? "Mark new" : "Mark read"}
                </button>
                <button onClick={() => setInquiries(inquiries.filter((x) => x.id !== q.id))} aria-label={`Delete inquiry ${q.id}`}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {inquiries.length === 0 && <p>No inquiries yet — submit one from Contact.</p>}
          </div>
        )}

        {tab === "Gallery" && (
          <div className="admin-panel">
            <div className="panel-heading">
              <h2>Lookbook images · {lookbookImages.length}</h2>
            </div>
            <p style={{ fontSize: 13 }}>
              Demo gallery is hardcoded in <code>src/data.js → lookbookImages</code> using premium
              Unsplash jewellery photography. To manage images for your viva: edit product image
              URLs under Products (image management), or replace URLs in <code>data.js</code>.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginTop: 12 }}>
              {lookbookImages.map((g) => (
                <img key={g.src} src={g.src} alt={g.alt} style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} loading="lazy" />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

/* ---------- app root ---------- */

function LoginModal({ onClose, onLogin, onRegister }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <p className="eyebrow">WELCOME TO TRIDEV</p>
        <h2>Sign in or join us</h2>
        <AuthForm onLogin={onLogin} onRegister={onRegister} />
        <p className="demo-note">
          Demo customer: {DEMO_CREDENTIALS.customer.email} / {DEMO_CREDENTIALS.customer.password}
          <br />
          Demo admin: {DEMO_CREDENTIALS.admin.email} / {DEMO_CREDENTIALS.admin.password}
        </p>
      </div>
    </div>
  );
}

function App() {
  const [catalog, setCatalog] = usePersistentState("tridev-products-v2", seedProducts);
  const [customCategories, setCustomCategories] = usePersistentState(
    "tridev-categories",
    baseCategories
  );
  const [wishlistMaps, setWishlistMaps] = usePersistentState("tridev-wishlists", {});
  const [cartMaps, setCartMaps] = usePersistentState("tridev-carts", {});
  const [user, setUser] = usePersistentState("tridev-user", null);
  const [isAdmin, setIsAdmin] = usePersistentState("tridev-admin", false);
  const [orders, setOrders] = usePersistentState("tridev-orders", sampleOrders);
  const [inquiries, setInquiries] = usePersistentState("tridev-inquiries", []);
  const [profileMaps, setProfileMaps] = usePersistentState("tridev-profiles", {});
  const [registered, setRegistered] = usePersistentState("tridev-registered", []);
  const [loginOpen, setLoginOpen] = useState(false);

  /* Per-account scoping: each signed-in email owns its bag, wishlist and
     profile. Guests share the "guest" bucket, so switching users can never
     leak or freeze another account's data. */
  const accountKey = user?.email || (isAdmin ? "admin" : "guest");
  const readBucket = (map) =>
    map && typeof map === "object" && Array.isArray(map[accountKey]) ? map[accountKey] : [];
  const safeWishlist = readBucket(wishlistMaps);
  const safeCart = readBucket(cartMaps);
  const writeBucket = (setter) => (updater) =>
    setter((prev) => {
      const map = prev && typeof prev === "object" ? prev : {};
      const cur = Array.isArray(map[accountKey]) ? map[accountKey] : [];
      const next = typeof updater === "function" ? updater(cur) : updater;
      return { ...map, [accountKey]: next };
    });
  const setWishlist = writeBucket(setWishlistMaps);
  const setCart = writeBucket(setCartMaps);
  const safeProfile = user ? (profileMaps?.[user.email] || null) : null;
  const ensureProfile = (name, email) =>
    setProfileMaps((prev) => {
      const map = prev && typeof prev === "object" ? prev : {};
      if (map[email] && map[email].email) return prev;
      return {
        ...map,
        [email]: { name, email, phone: "", address: "", city: "Golbazar", occasion: "Everyday", newsletter: true },
      };
    });

  /* Heal corrupted saves (e.g. hand-edited localStorage) back to safe arrays. */
  const safeCatalog = Array.isArray(catalog) ? catalog : seedProducts;
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];
  const safeCategories = Array.isArray(customCategories) ? customCategories : baseCategories;

  /* One-time migration: heal orders saved by older builds (numeric items,
     mixed-case emails, missing history) so accounts never collide; import
     legacy single-user bag/wishlist/profile into per-account buckets once. */
  useEffect(() => {
    try {
      const legacyCart = JSON.parse(localStorage.getItem("tridev-cart") || "null");
      const legacyWish = JSON.parse(localStorage.getItem("tridev-wishlist") || "null");
      const legacyProfile = JSON.parse(localStorage.getItem("tridev-profile") || "null");
      if (Array.isArray(legacyCart) && legacyCart.length > 0) {
        setCartMaps((prev) => {
          const map = prev && typeof prev === "object" ? prev : {};
          if (Array.isArray(map.guest) && map.guest.length > 0) return prev;
          return { ...map, guest: legacyCart };
        });
      }
      if (Array.isArray(legacyWish) && legacyWish.length > 0) {
        setWishlistMaps((prev) => {
          const map = prev && typeof prev === "object" ? prev : {};
          if (Array.isArray(map.guest) && map.guest.length > 0) return prev;
          return { ...map, guest: legacyWish };
        });
      }
      if (legacyProfile && typeof legacyProfile.email === "string" && legacyProfile.email) {
        const em = legacyProfile.email.trim().toLowerCase();
        setProfileMaps((prev) => {
          const map = prev && typeof prev === "object" ? prev : {};
          if (map[em] && map[em].email) return prev;
          return { ...map, [em]: { ...legacyProfile, email: em } };
        });
      }
      localStorage.removeItem("tridev-cart");
      localStorage.removeItem("tridev-wishlist");
      localStorage.removeItem("tridev-profile");
    } catch {
      /* private mode etc. — demo still runs in memory */
    }
    setOrders((prev) => {
      const list = normalizeOrders(prev).map((o) => ({
        ...o,
        email: typeof o.email === "string" ? o.email.trim().toLowerCase() : o.email,
        status: ORDER_STATUSES.includes(o.status) ? o.status : "Processing",
        history: Array.isArray(o.history) && o.history.length > 0
          ? o.history
          : [{ status: o.status || "Processing", date: o.date || new Date().toISOString().slice(0, 10) }],
      }));
      return JSON.stringify(list) === JSON.stringify(prev) ? prev : list;
    });
  }, []);

  const allCategories = useMemo(
    () =>
      safeCategories.includes("All pieces")
        ? safeCategories
        : ["All pieces", ...safeCategories.filter((c) => c !== "All pieces")],
    [customCategories, safeCategories]
  );

  const onWishlist = (id) =>
    setWishlist((x) =>
      Array.isArray(x)
        ? x.includes(id)
          ? x.filter((y) => y !== id)
          : [...x, id]
        : [id]
    );
  const onAdd = (p, qty) =>
    setCart((x) => {
      const list = Array.isArray(x) ? x : [];
      const found = list.find((i) => i.id === p.id);
      /* Idempotent: repeat taps never stack — quantity only changes via
         the + / − controls. Takes the larger of bag vs selected qty. */
      return found
        ? list.map((i) => (i.id === p.id ? { ...i, qty: Math.max(i.qty, qty) } : i))
        : [...list, { ...p, qty }];
    });

  const safeRegistered = Array.isArray(registered) ? registered : [];

  const startCustomerSession = (name, email) => {
    const u = { name, email, role: "customer" };
    setUser(u);
    setIsAdmin(false);
    ensureProfile(name, email);
    setLoginOpen(false);
    return { ok: true, role: "customer" };
  };

  const handleLogin = (email, password) => {
    const e = (email || "").trim().toLowerCase();
    if (
      e === DEMO_CREDENTIALS.customer.email.toLowerCase() &&
      password === DEMO_CREDENTIALS.customer.password
    ) {
      return startCustomerSession("Roshani Shrestha", DEMO_CREDENTIALS.customer.email);
    }
    if (
      e === DEMO_CREDENTIALS.admin.email.toLowerCase() &&
      password === DEMO_CREDENTIALS.admin.password
    ) {
      setUser(null);
      setIsAdmin(true);
      setLoginOpen(false);
      return { ok: true, role: "admin" };
    }
    const match = safeRegistered.find((r) => r.email === e);
    if (match && match.password === password) {
      return startCustomerSession(match.name, match.email);
    }
    if (match) {
      return { ok: false, message: "That password doesn't match. Try again or create a new account." };
    }
    return { ok: false, message: "No account found for that email. Create an account to join Tridev." };
  };

  const handleRegister = (name, email, password) => {
    const cleanName = (name || "").trim();
    const e = (email || "").trim().toLowerCase();
    if (!cleanName) {
      return { ok: false, message: "Please tell us your name." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      return { ok: false, message: "Please enter a valid email address." };
    }
    if (!password || password.length < 6) {
      return { ok: false, message: "Please choose a password of at least 6 characters." };
    }
    const taken =
      e === DEMO_CREDENTIALS.customer.email.toLowerCase() ||
      e === DEMO_CREDENTIALS.admin.email.toLowerCase() ||
      safeRegistered.some((r) => r.email === e);
    if (taken) {
      return { ok: false, message: "An account already exists for that email — please sign in instead." };
    }
    setRegistered([...safeRegistered, { name: cleanName, email: e, password }]);
    return startCustomerSession(cleanName, e);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  const handleSaveProfile = (next) => {
    if (!user?.email) return;
    const clean = {
      ...next,
      name: (next.name || "").trim(),
      email: user.email,
    };
    setProfileMaps((prev) => ({ ...(prev || {}), [user.email]: clean }));
    setUser((prev) =>
      prev ? { ...prev, name: clean.name || prev.name } : prev
    );
  };

  const handleInquiry = (form) => {
    const ref = `INQ-${Date.now().toString().slice(-6)}`;
    const entry = {
      id: ref,
      ...form,
      date: new Date().toISOString().slice(0, 10),
      read: false,
    };
    setInquiries([entry, ...safeInquiries]);
    return ref;
  };

  const handleNewsletter = (email) => {
    handleInquiry({
      name: "Newsletter subscriber",
      email,
      topic: "Newsletter",
      message: "Please add me to the Tridev mailing list.",
    });
  };

  const handlePlaceOrder = (form, total) => {
    const existing = new Set(safeOrders.map((o) => o.id));
    let id = `TRI-${2413 + safeOrders.length}`;
    while (existing.has(id)) {
      id = `TRI-${Date.now().toString().slice(-6)}`;
      break;
    }
    const order = {
      id,
      customer: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone,
      address: form.address,
      note: form.note,
      delivery: form.delivery || "standard",
      giftWrap: form.giftWrap !== false,
      items: safeCart.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, image: i.image })),
      total,
      status: "Processing",
      date: new Date().toISOString().slice(0, 10),
      history: [{ status: "Processing", date: new Date().toISOString().slice(0, 10) }],
    };
    setOrders([order, ...safeOrders]);
    setCart([]);
    /* Guest checkout claims its own account view: the order email becomes the
       session, so accounts never see each other's orders. */
    if (!user && !isAdmin) {
      setUser({ name: order.customer, email: order.email, role: "customer" });
      ensureProfile(order.customer, order.email);
      setProfileMaps((prev) => {
        const map = prev && typeof prev === "object" ? prev : {};
        const cur = map[order.email] || {};
        return {
          ...map,
          [order.email]: {
            ...cur,
            name: order.customer,
            email: order.email,
            phone: order.phone || cur.phone || "",
            address: order.address || cur.address || "",
          },
        };
      });
    }
    return order;
  };

  const handleReorder = (order) => {
    if (!Array.isArray(order.items)) return;
    setCart((prev) => {
      const list = Array.isArray(prev) ? [...prev] : [];
      order.items.forEach((oi) => {
        const fresh = safeCatalog.find((p) => p.id === oi.id);
        const base = fresh || oi;
        const found = list.find((i) => i.id === oi.id);
        if (found) found.qty += oi.qty || 1;
        else list.push({ ...base, qty: oi.qty || 1 });
      });
      return list;
    });
  };

  const handleResetDemo = () => {
    setCatalog(seedProducts);
    setCustomCategories(baseCategories);
    setOrders(sampleOrders);
    setInquiries([]);
    setWishlist([]);
    setCart([]);
    setRegistered([]);
    setWishlistMaps({});
    setCartMaps({});
    setProfileMaps({});
  };

  return (
    <BrowserRouter>
      <Header
        cartCount={safeCart.reduce((a, x) => a + (x.qty || 0), 0)}
        wishlistCount={safeWishlist.length}
        user={user}
        isAdmin={isAdmin}
        onLogin={() => setLoginOpen(true)}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home catalog={safeCatalog} cart={safeCart} onWishlist={onWishlist} wishlist={safeWishlist} />} />
        <Route
          path="/shop"
          element={<Shop catalog={safeCatalog} cart={safeCart} onWishlist={onWishlist} wishlist={safeWishlist} allCategories={allCategories} />}
        />
        <Route path="/collections" element={<Collections catalog={safeCatalog} />} />
        <Route
          path="/product/:id"
          element={<Product catalog={safeCatalog} cart={safeCart} onAdd={onAdd} onWishlist={onWishlist} wishlist={safeWishlist} />}
        />
        <Route path="/about" element={<SimplePage type="about" />} />
        <Route path="/lookbook" element={<SimplePage type="lookbook" />} />
        <Route path="/journal" element={<SimplePage type="journal" />} />
        <Route path="/journal/:id" element={<JournalDetail />} />
        <Route path="/contact" element={<Contact onInquiry={handleInquiry} />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route
          path="/cart"
          element={
            <Cart
              cart={safeCart}
              onRemove={(id) => setCart((x) => (Array.isArray(x) ? x.filter((i) => i.id !== id) : []))}
              onUpdate={(id, qty) =>
                setCart((x) => (Array.isArray(x) ? x.map((i) => (i.id === id ? { ...i, qty } : i)) : []))
              }
              catalog={safeCatalog}
              onAdd={onAdd}
              onWishlist={onWishlist}
              wishlist={safeWishlist}
            />
          }
        />
        <Route
          path="/checkout"
          element={<Checkout cart={safeCart} user={user} profile={safeProfile} onPlaceOrder={handlePlaceOrder} />}
        />
        <Route
          path="/account"
          element={
            <Account
              user={user}
              isAdmin={isAdmin}
              orders={safeOrders}
              wishlist={safeWishlist}
              catalog={safeCatalog}
              profile={safeProfile}
              onSaveProfile={handleSaveProfile}
              onLoginOpen={() => setLoginOpen(true)}
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="/orders"
          element={
            <RequireCustomer user={user} isAdmin={isAdmin} onLogin={() => setLoginOpen(true)}>
              <OrdersPage user={user} isAdmin={isAdmin} orders={safeOrders} catalog={safeCatalog} onReorder={handleReorder} />
            </RequireCustomer>
          }
        />
        <Route
          path="/wishlist"
          element={<Wishlist catalog={safeCatalog} cart={safeCart} wishlist={safeWishlist} onWishlist={onWishlist} onAdd={onAdd} />}
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin isAdmin={isAdmin} onLogin={() => setLoginOpen(true)}>
              <Admin
                catalog={safeCatalog}
                setCatalog={setCatalog}
                orders={safeOrders}
                setOrders={setOrders}
                inquiries={safeInquiries}
                setInquiries={setInquiries}
                allCategories={allCategories}
                setCustomCategories={setCustomCategories}
                onResetDemo={handleResetDemo}
              />
            </RequireAdmin>
          }
        />
        <Route path="*" element={<Home catalog={safeCatalog} cart={safeCart} onWishlist={onWishlist} wishlist={safeWishlist} />} />
      </Routes>
      {loginOpen && !user && !isAdmin && (
        <LoginModal onClose={() => setLoginOpen(false)} onLogin={handleLogin} onRegister={handleRegister} />
      )}
      <WhatsAppFloat />
    </BrowserRouter>
  );
}
export default App;
