"use client";
import { useState, useEffect, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/* ============================================================
   NAV
   ============================================================ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-brand">Small Town Big Stage</div>
      <ul className="nav-links">
        <li><a href="#artists">Artists</a></li>
        <li><a href="#tickets">Tickets</a></li>
        <li><a href="#seating">Seating Map</a></li>
        <li><a href="#sponsors">Sponsors</a></li>
      </ul>
    </nav>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow" />
      <div className="hero-content">
        <div className="headline-sponsor-hero">
          <span className="hs-label">Presented by</span>
          <a href="https://www.axiombiolabs.org" target="_blank" rel="noopener noreferrer" className="hs-link">Axiom BioLabs</a>
        </div>
        <p className="hero-date">May 30, 2026 &bull; Gates 5:30 PM &bull; Show 6:30 PM</p>
        <h1 className="hero-title">Small Town<span>Big Stage</span></h1>
        <p className="hero-artists">
          <strong>Cody McCarver</strong> &bull;{" "}
          <strong>John Schneider</strong> &bull;{" "}
          <strong>Mike Neff &amp; Friends</strong>
        </p>
        <p className="hero-venue">Vermilion High School &mdash; Sailor Stadium</p>
        <a href="#tickets" className="hero-cta">Get Tickets &rarr;</a>
      </div>
      <div className="hero-scroll-indicator">Scroll<span style={{ fontSize: "1.2rem" }}>&#8964;</span></div>
    </section>
  );
}

/* ============================================================
   ARTISTS SECTION — full bios + gallery
   ============================================================ */
function ArtistsSection() {
  const [expanded, setExpanded] = useState(null);

  const artists = [
    {
      id: "cody",
      name: "Cody McCarver",
      role: "Headliner",
      image: "/cody-mccarver-headshot.png",
      accent: "/cody-mccarver-album.png",
      accentAlt: "Cody McCarver - Hymn & Me album cover",
      youtube: "https://www.youtube.com/@CodyMcCarver",
      bio: `Born and raised in Dunlap, Tennessee, Cody McCarver's musical journey began at age nine playing piano in his home church. He went on to spend over a decade as keyboardist for multi-platinum country super-group Confederate Railroad before launching a solo career that earned him three #1 videos on CMT Pure Country and Music Row Magazine's Independent Artist of the Year for three consecutive years.

Cody's solo music has featured collaborations with Colt Ford, Richard Sterban of The Oak Ridge Boys, and John Anderson. He has shared the stage with legends including Charlie Daniels, David Allan Coe, and Merle Haggard. His music career also led to acting — he has starred alongside John Schneider in multiple films.

After a transformative experience in 2013, Cody turned his powerful voice toward Christian country music, earning a #1 single with "Rise Up" on the Christian Country chart. Today he tours with a message of faith, redemption, and the raw honesty that has always defined his music.`,
    },
    {
      id: "john",
      name: "John Schneider",
      role: "Special Guest",
      image: "/cody-john-live.png",
      accent: "/john-schneider-live.png",
      accentAlt: "John Schneider performing live on stage",
      youtube: "https://www.youtube.com/@JohnSchneiderStudios",
      bio: `John Schneider is an American icon — actor, singer, filmmaker, and entertainer. Best known worldwide as Bo Duke on the classic CBS series The Dukes of Hazzard (1979–1985), Schneider won the role at just 18 years old by showing up to the audition with a borrowed pickup truck, a cowboy hat, and a cold beer.

Beyond Hazzard County, Schneider starred as Jonathan Kent on Smallville for a decade, appeared in Tyler Perry's The Haves and the Have Nots, and has written, directed, and produced dozens of independent films from his own studio in Louisiana.

His country music career launched in the early 1980s with four #1 country singles including "I've Been Around Enough to Know" and "Country Girls." His 1981 cover of "It's Now or Never" remains one of the highest-charting Elvis covers of all time. A close friend and collaborator of Cody McCarver, the two have recorded music and starred in films together, making this concert a true reunion of friends.`,
    },
    {
      id: "mike",
      name: "Mike Neff & Friends",
      role: "Opening Act",
      image: "/mike-neff-live.png",
      accent: "/mike-neff-logo.jpg",
      accentAlt: "Mike Neff logo",
      bio: `A Vermilion, Ohio hometown favorite, Mike Neff brings raw energy and genuine heart to every performance. Armed with his guitar and an infectious love for great music, Mike delivers a set packed with country hits and acoustic favorites that get the crowd on their feet.

As the opening act for Small Town Big Stage, Mike Neff & Friends will set the tone for an unforgettable evening right here on the home turf of Sailor Stadium. This is small-town pride on a big stage.`,
    },
  ];

  return (
    <section id="artists" className="section">
      <div className="section-header">
        <p className="section-label">The Lineup</p>
        <h2 className="section-title">Meet the Artists</h2>
      </div>

      <div className="artists-grid">
        {artists.map((a) => (
          <div key={a.id} className="artist-card" onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
            <div className="artist-img-wrapper">
              <img src={a.image} alt={a.name} className="artist-img" />
              {a.accent && <img src={a.accent} alt={a.accentAlt} className="artist-logo" />}
            </div>
            <div className="artist-info">
              <div className="artist-role">{a.role}</div>
              <h3 className="artist-name">{a.name}</h3>
              <p className="artist-tap-hint">Tap to read bio</p>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded bio panel */}
      {expanded && (() => {
        const a = artists.find((x) => x.id === expanded);
        if (!a) return null;
        return (
          <div className="artist-bio-panel" key={a.id}>
            <div className="artist-bio-header">
              <div>
                <div className="artist-role">{a.role}</div>
                <h3 className="artist-bio-name">{a.name}</h3>
              </div>
              <button className="seat-picker-close" onClick={() => setExpanded(null)}>&times;</button>
            </div>
            <div className="artist-bio-text">
              {a.bio.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {a.youtube && (
                <a href={a.youtube} target="_blank" rel="noopener noreferrer" className="artist-yt-link">
                  ▶ Watch on YouTube
                </a>
              )}
            </div>
          </div>
        );
      })()}

      {/* Gallery strip — backstage & live shots */}
      <div className="artist-gallery">
        <img src="/cody-john-backstage.png" alt="Cody McCarver and John Schneider backstage" />
        <img src="/cody-john-live.png" alt="Cody McCarver and John Schneider performing live together" />
        <img src="/john-schneider-live.png" alt="John Schneider and Cody McCarver on stage" />
      </div>
    </section>
  );
}

/* ============================================================
   SEAT PICKERS
   ============================================================ */
function OnstageSeatPicker({ seats, selected, onToggle, onClose, onAddToCart }) {
  const leftSeats = seats.filter((s) => s.section === "left");
  const rightSeats = seats.filter((s) => s.section === "right");
  const renderSection = (sectionSeats, label) => (
    <div className="onstage-section">
      <div className="onstage-section-label">{label}</div>
      {[1, 2].map((row) => (
        <div key={row} className="seat-row">
          {sectionSeats.filter((s) => s.row === row).sort((a, b) => a.seat - b.seat).map((s) => {
            const isSel = selected.includes(s.id);
            return (
              <div key={s.id} className={`seat ${isSel ? "selected" : s.status}`}
                onClick={() => { if (s.status === "available" || isSel) onToggle(s.id); }}
                title={`${label} Row ${s.row} Seat ${s.seat}`}>{s.seat}</div>
            );
          })}
        </div>
      ))}
    </div>
  );
  return (
    <div className="seat-picker-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="seat-picker-modal">
        <div className="seat-picker-header"><h2>On Stage Seating &mdash; $325</h2><button className="seat-picker-close" onClick={onClose}>&times;</button></div>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1rem", fontSize: "0.9rem" }}>Select your seats on stage. Includes free General Lee photo op &amp; lanyard.</p>
        <div className="seat-legend">
          <div className="seat-legend-item"><div className="seat-legend-dot" style={{ background: "var(--seat-available)" }} /> Available</div>
          <div className="seat-legend-item"><div className="seat-legend-dot" style={{ background: "var(--seat-selected)" }} /> Selected</div>
          <div className="seat-legend-item"><div className="seat-legend-dot" style={{ background: "var(--seat-sold)" }} /> Sold</div>
        </div>
        <div className="onstage-layout">{renderSection(leftSeats, "Left Side")}<div className="onstage-stage-label">STAGE</div>{renderSection(rightSeats, "Right Side")}</div>
        {selected.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <p style={{ marginBottom: "1rem", color: "var(--gold)", fontFamily: "Oswald, sans-serif", fontSize: "1.2rem" }}>{selected.length} seat{selected.length > 1 ? "s" : ""} &mdash; ${selected.length * 325}</p>
            <button className="btn-checkout" onClick={onAddToCart}>Add to Cart</button>
          </div>
        )}
      </div>
    </div>
  );
}

function VipSeatPicker({ seats, selected, onToggle, onClose, onAddToCart }) {
  const rows = [...new Set(seats.map((s) => s.row))].sort((a, b) => a - b);
  return (
    <div className="seat-picker-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="seat-picker-modal">
        <div className="seat-picker-header"><h2>VIP Seating &mdash; $125</h2><button className="seat-picker-close" onClick={onClose}>&times;</button></div>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1rem", fontSize: "0.9rem" }}>Rows 1&ndash;12 closest to the stage. Includes lanyard &amp; $10 off General Lee photo op.</p>
        <div className="seat-legend">
          <div className="seat-legend-item"><div className="seat-legend-dot" style={{ background: "var(--seat-available)" }} /> Available</div>
          <div className="seat-legend-item"><div className="seat-legend-dot" style={{ background: "var(--seat-selected)" }} /> Selected</div>
          <div className="seat-legend-item"><div className="seat-legend-dot" style={{ background: "var(--seat-sold)" }} /> Sold</div>
        </div>
        <div style={{ textAlign: "center", marginBottom: "0.75rem", fontFamily: "Barlow Condensed, sans-serif", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)" }}>← STAGE →</div>
        <div className="vip-seat-grid">
          {rows.map((row) => (
            <div key={row} className="vip-row-container">
              <div className="vip-row-label">Row {row}</div>
              <div className="vip-seats">
                {seats.filter((s) => s.row === row).sort((a, b) => a.seat - b.seat).map((s) => {
                  const isSel = selected.includes(s.id);
                  return <div key={s.id} className={`seat vip-seat ${isSel ? "selected" : s.status}`} onClick={() => { if (s.status === "available" || isSel) onToggle(s.id); }} title={`Row ${s.row} Seat ${s.seat}`} />;
                })}
              </div>
            </div>
          ))}
        </div>
        {selected.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <p style={{ marginBottom: "1rem", color: "var(--gold)", fontFamily: "Oswald, sans-serif", fontSize: "1.2rem" }}>{selected.length} seat{selected.length > 1 ? "s" : ""} &mdash; ${selected.length * 125}</p>
            <button className="btn-checkout" onClick={onAddToCart}>Add to Cart</button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuantityPicker({ ticket, available, onAddToCart, onClose }) {
  const [qty, setQty] = useState(1);
  const priceEach = ticket.price / 100;
  return (
    <div className="seat-picker-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="seat-picker-modal" style={{ maxWidth: 480 }}>
        <div className="seat-picker-header"><h2>{ticket.name} &mdash; {ticket.displayPrice}</h2><button className="seat-picker-close" onClick={onClose}>&times;</button></div>
        <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem", fontSize: "0.9rem" }}>{ticket.description}</p>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.85rem" }}>{available.toLocaleString()} tickets remaining &bull; First come, first serve</p>
        <div className="qty-picker" style={{ justifyContent: "center" }}>
          <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <span className="qty-value">{qty}</span>
          <button className="qty-btn" onClick={() => setQty((q) => Math.min(available, Math.min(10, q + 1)))}>+</button>
        </div>
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <p style={{ marginBottom: "1rem", color: "var(--gold)", fontFamily: "Oswald, sans-serif", fontSize: "1.2rem" }}>{qty} ticket{qty > 1 ? "s" : ""} &mdash; ${(qty * priceEach).toFixed(0)}</p>
          <button className="btn-checkout" onClick={() => onAddToCart(qty)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SPONSORS
   ============================================================ */
const SPONSORS = [
  { tier: "Banner Packages", items: [
    { name: "Platinum Banner", price: "$8,000", avail: "3 available", desc: "Prime fencing perimeter placement of 3′×5′ poster, 30-second scoreboard rotation, name on sponsor page, 4 VIP tickets, social media mentions" },
    { name: "Gold Banner", price: "$4,500", avail: "6 available", desc: "Prime fencing perimeter placement of 3′×5′ poster, scoreboard slide rotation, 2 VIP tickets, name on sponsor page" },
    { name: "Silver Banner", price: "$1,500", avail: "25 available", desc: "Standard fencing perimeter placement of 3′×5′ poster, name on sponsor page, 2 GA Tier 1 tickets" },
  ]},
  { tier: "Premium Sponsorships", items: [
    { name: "Gate Sponsorship", price: "$3,000", avail: "2 available", desc: "Decorate an archway over the entry gate for advertisement" },
    { name: "Photo Backdrop", price: "$8,000", avail: "1 available", desc: "Your business advertisement in the background of every General Lee photo op" },
    { name: "Lanyard Sponsor", price: "$4,000", avail: "1 available", desc: "Business name and logo on all event lanyards given to On Stage and VIP ticket holders" },
    { name: "Digital QR Sponsor", price: "$5,000", avail: "1 available", desc: "Main advertisement displayed when attendees scan event QR codes" },
    { name: "Exclusive Advertising", price: "$5,000", avail: "Add-on", desc: "Prevent competitors from advertising. Requires Gold or Platinum Banner purchase." },
  ]},
];

function SponsorSection() {
  return (
    <section id="sponsors" className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="section-header">
        <p className="section-label">Partnerships</p>
        <h2 className="section-title">Sponsorship Opportunities</h2>
        <p className="section-subtitle">Put your brand in front of thousands. Contact us for details.</p>
      </div>

      {/* Headline Sponsor Feature */}
      <div className="headline-sponsor">
        <div className="hs-badge">★ Headline Sponsor ★</div>
        <div className="hs-content">
          <a href="https://www.axiombiolabs.org" target="_blank" rel="noopener noreferrer" className="hs-name">Axiom BioLabs</a>
          <p className="hs-desc">
            Small Town Big Stage is proudly presented by{" "}
            <a href="https://www.axiombiolabs.org" target="_blank" rel="noopener noreferrer">Axiom BioLabs</a>,
            a leading cancer research organization specializing in CAR-T cell development
            and life science research. Founded by CEO{" "}
            <strong>Dr. John White</strong> — a Vermilion High School graduate and
            Vermilion native — Axiom BioLabs is dedicated to advancing the fight against
            cancer at the intersection of biology, chemistry, and physics.
          </p>
          <a href="https://www.axiombiolabs.org" target="_blank" rel="noopener noreferrer" className="hs-visit">
            Visit axiombiolabs.org &rarr;
          </a>
          <p className="hs-dedication">
            With love and gratitude to my wife Anya, and our children Robert and Anastasia — none of this happens without you.
          </p>
        </div>
      </div>

      {SPONSORS.map((g) => (
        <div key={g.tier} style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", color: "var(--gold)", marginBottom: "1rem", letterSpacing: "0.08em" }}>{g.tier}</h3>
          <div className="sponsor-grid">
            {g.items.map((sp) => (
              <div key={sp.name} className="sponsor-card">
                <div className="sponsor-card-name">{sp.name}</div>
                <div className="sponsor-card-price">{sp.price}</div>
                <div className="sponsor-card-desc">{sp.desc}</div>
                <div className="sponsor-card-avail">{sp.avail}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <a href="mailto:info@smalltownbigstage.org" className="hero-cta" style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}>Inquire About Sponsorship</a>
      </div>
    </section>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function HomePage() {
  const [onstageSeats, setOnstageSeats] = useState([]);
  const [vipSeats, setVipSeats] = useState([]);
  const [inventory, setInventory] = useState({});
  const [activePicker, setActivePicker] = useState(null);
  const [selectedOnstage, setSelectedOnstage] = useState([]);
  const [selectedVip, setSelectedVip] = useState([]);
  const [cart, setCart] = useState([]);
  const [checkingOut, setCheckingOut] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [o, v, i] = await Promise.all([
        fetch(`${API}/api/seats/onstage`).then(r => r.json()),
        fetch(`${API}/api/seats/vip`).then(r => r.json()),
        fetch(`${API}/api/inventory`).then(r => r.json()),
      ]);
      setOnstageSeats(o.seats || []);
      setVipSeats(v.seats || []);
      setInventory(i || {});
    } catch (e) { console.error("Fetch error:", e); }
  }, []);

  useEffect(() => { fetchData(); const id = setInterval(fetchData, 15000); return () => clearInterval(id); }, [fetchData]);

  const toggleOnstage = (id) => setSelectedOnstage(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleVip = (id) => setSelectedVip(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const addOnstageToCart = () => { if (!selectedOnstage.length) return; setCart(p => [...p.filter(c => c.type !== "onstage"), { type: "onstage", seatIds: [...selectedOnstage], quantity: selectedOnstage.length, priceEach: 325 }]); setActivePicker(null); };
  const addVipToCart = () => { if (!selectedVip.length) return; setCart(p => [...p.filter(c => c.type !== "vip"), { type: "vip", seatIds: [...selectedVip], quantity: selectedVip.length, priceEach: 125 }]); setActivePicker(null); };
  const addGaToCart = (type, qty) => { const prices = { ga_tier1: 85, ga_tier2: 65, bleacher: 50 }; setCart(p => [...p.filter(c => c.type !== type), { type, quantity: qty, priceEach: prices[type] }]); setActivePicker(null); };
  const removeFromCart = (type) => { if (type === "onstage") setSelectedOnstage([]); if (type === "vip") setSelectedVip([]); setCart(p => p.filter(c => c.type !== type)); };

  const cartTotal = cart.reduce((s, c) => s + c.quantity * c.priceEach, 0);

  const handleCheckout = async () => {
    if (!cart.length || checkingOut) return;
    setCheckingOut(true);
    try {
      const items = cart.map(c => (c.type === "onstage" || c.type === "vip") ? { type: c.type, seatIds: c.seatIds } : { type: c.type, quantity: c.quantity });
      const res = await fetch(`${API}/api/checkout`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url; else alert(data.error || "Unable to start checkout.");
    } catch { alert("Something went wrong. Please try again."); }
    setCheckingOut(false);
  };

  const ticketCards = [
    { key: "onstage", name: "On Stage", price: "$325", desc: "Premium on-stage seating with free photo op with the General Lee and event lanyard", perks: ["On-stage seating", "Free General Lee photo op", "Event lanyard"], color: "var(--tier-onstage)", available: onstageSeats.filter(s => s.status === "available").length, total: 20, type: "seat-pick" },
    { key: "vip", name: "VIP", price: "$125", desc: "First 12 rows with event lanyard and $10 off General Lee photo op", perks: ["Rows 1–12, closest to stage", "Event lanyard", "$10 off General Lee photo op"], color: "var(--tier-vip)", available: vipSeats.filter(s => s.status === "available").length, total: 828, type: "seat-pick" },
    { key: "ga_tier1", name: "GA Tier 1", price: "$85", desc: "Rows 13–24, great sightlines to the stage", perks: ["Rows 13–24", "Great sightlines"], color: "var(--tier-ga1)", available: inventory.ga_tier1?.available ?? 828, total: 828, type: "qty" },
    { key: "ga_tier2", name: "GA Tier 2", price: "$65", desc: "On-field seating behind Tier 1", perks: ["On-field seating", "Full stage view"], color: "var(--tier-ga2)", available: inventory.ga_tier2?.available ?? 5190, total: 5190, type: "qty" },
    { key: "bleacher", name: "Bleacher", price: "$50", desc: "Stadium bleacher seating with elevated view", perks: ["Bleacher seating", "Elevated view"], color: "var(--tier-bleacher)", available: inventory.bleacher?.available ?? 4100, total: 4100, type: "qty" },
  ];
  const TICKET_CONFIGS = {
    ga_tier1: { id: "ga_tier1", name: "General Admission Tier 1", price: 8500, displayPrice: "$85", description: "Rows 13–24, great sightlines to the stage" },
    ga_tier2: { id: "ga_tier2", name: "General Admission Tier 2", price: 6500, displayPrice: "$65", description: "On-field seating behind Tier 1" },
    bleacher: { id: "bleacher", name: "Bleacher Seating", price: 5000, displayPrice: "$50", description: "Stadium bleacher seating" },
  };

  return (
    <>
      <Nav />
      <Hero />
      <ArtistsSection />

      {/* TICKETS */}
      <section id="tickets" className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="section-header">
          <p className="section-label">Tickets</p>
          <h2 className="section-title">Choose Your Experience</h2>
          <p className="section-subtitle">From on-stage premium seats to bleacher views — find the perfect spot.</p>
        </div>
        <div className="ticket-grid">
          {ticketCards.map(tc => {
            const inCart = cart.find(c => c.type === tc.key);
            return (
              <div key={tc.key} className="ticket-card" style={{ "--card-accent": tc.color }}>
                <div className="ticket-card-name">{tc.name}</div>
                <div className="ticket-card-price">{tc.price}</div>
                <div className="ticket-card-desc">{tc.desc}</div>
                <ul className="ticket-card-perks">{tc.perks.map(p => <li key={p}>{p}</li>)}</ul>
                <div className="ticket-card-availability">{tc.available > 0 ? `${tc.available.toLocaleString()} of ${tc.total.toLocaleString()} available` : "SOLD OUT"}</div>
                {tc.available > 0 ? (
                  <button className="btn-select" onClick={() => setActivePicker(tc.key)}>{inCart ? `✓ In Cart (${inCart.quantity})` : tc.type === "seat-pick" ? "Select Seats" : "Select Quantity"}</button>
                ) : (
                  <button className="btn-select" disabled style={{ opacity: 0.4 }}>Sold Out</button>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "3rem" }}>
          <div className="section-header" style={{ marginBottom: "1.5rem" }}><p className="section-label">Photo Opportunity</p></div>
          <div className="general-lee-feature">
            <div className="general-lee-img-wrapper">
              <img src="/general-lee.png" alt="The General Lee — 1969 Dodge Charger" className="general-lee-img" />
              <img src="/general-lee-2.png" alt="The General Lee — Front Angle" className="general-lee-img gl-img-2" />
            </div>
            <div className="general-lee-info">
              <h3 style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>General Lee Photo Op</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                Get your photo taken with the iconic General Lee — the legendary 1969 Dodge Charger
                from The Dukes of Hazzard. A once-in-a-lifetime opportunity for fans of all ages.
              </p>
              <div className="general-lee-pricing">
                <div className="gl-price-row"><span className="gl-price-label">General Admission</span><span className="gl-price-amount">$40</span></div>
                <div className="gl-price-row"><span className="gl-price-label">With VIP Ticket</span><span className="gl-price-amount">$30</span><span className="gl-price-save">Save $10</span></div>
                <div className="gl-price-row"><span className="gl-price-label">With On Stage Ticket</span><span className="gl-price-amount free">FREE</span><span className="gl-price-save">Included</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEATING MAP */}
      <section id="seating" className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="section-header">
          <p className="section-label">Venue</p>
          <h2 className="section-title">Seating Map</h2>
          <p className="section-subtitle">Vermilion Sailor Stadium — on-field seating with the stage on the east end</p>
        </div>
        <div className="seating-map-container"><img src="/seating-map.png" alt="Sailor Stadium seating map" className="seating-map-img" /></div>
      </section>

      <SponsorSection />

      <footer className="footer">
        <div className="footer-brand">Small Town Big Stage</div>
        <p>Proudly presented by <a href="https://www.axiombiolabs.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>Axiom BioLabs</a></p>
        <p style={{ marginTop: "0.5rem" }}>May 30, 2026 &bull; Gates 5:30 PM &bull; Show 6:30 PM</p>
        <p>Vermilion Sailor Stadium &bull; Vermilion, Ohio</p>
        <p style={{ marginTop: "0.5rem" }}>&copy; 2026 Small Town Big Stage. All rights reserved.</p>
      </footer>

      {/* SEAT PICKERS */}
      {activePicker === "onstage" && <OnstageSeatPicker seats={onstageSeats} selected={selectedOnstage} onToggle={toggleOnstage} onClose={() => setActivePicker(null)} onAddToCart={addOnstageToCart} />}
      {activePicker === "vip" && <VipSeatPicker seats={vipSeats} selected={selectedVip} onToggle={toggleVip} onClose={() => setActivePicker(null)} onAddToCart={addVipToCart} />}
      {["ga_tier1", "ga_tier2", "bleacher"].includes(activePicker) && <QuantityPicker ticket={TICKET_CONFIGS[activePicker]} available={inventory[activePicker]?.available ?? 0} onAddToCart={(qty) => addGaToCart(activePicker, qty)} onClose={() => setActivePicker(null)} />}

      {/* CHECKOUT BAR */}
      <div className={`checkout-bar ${cart.length > 0 ? "visible" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <span className="checkout-bar-info">{cart.reduce((s, c) => s + c.quantity, 0)} ticket{cart.reduce((s, c) => s + c.quantity, 0) !== 1 ? "s" : ""}</span>
          {cart.map(c => (
            <span key={c.type} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", padding: "0.25rem 0.75rem", fontSize: "0.8rem", fontFamily: "Barlow Condensed, sans-serif", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              {c.type === "onstage" ? "On Stage" : c.type === "vip" ? "VIP" : c.type === "ga_tier1" ? "GA Tier 1" : c.type === "ga_tier2" ? "GA Tier 2" : "Bleacher"} ×{c.quantity}
              <button onClick={() => removeFromCart(c.type)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1rem", padding: 0 }}>&times;</button>
            </span>
          ))}
          <span className="checkout-bar-total">${cartTotal}</span>
        </div>
        <button className="btn-checkout" onClick={handleCheckout} disabled={checkingOut}>{checkingOut ? <span className="spinner" /> : "Checkout →"}</button>
      </div>
    </>
  );
}
