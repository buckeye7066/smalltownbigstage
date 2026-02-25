require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { TICKET_TYPES, ADDONS, SPONSOR_PACKAGES } = require("./config/tickets");

const app = express();
const PORT = process.env.PORT || 3001;

// --- In-Memory Store (replace with DB in production) ---
// Seat maps for assigned seating (On Stage + VIP)
const seatMaps = {
  onstage: {},
  vip: {},
};

// Initialize On Stage seats: 4 groups of 5 (left-row1, left-row2, right-row1, right-row2)
const onstageSections = ["left", "right"];
const onstageRows = [1, 2];
for (const section of onstageSections) {
  for (const row of onstageRows) {
    for (let seat = 1; seat <= 5; seat++) {
      const id = `onstage-${section}-R${row}-S${seat}`;
      seatMaps.onstage[id] = { id, section, row, seat, status: "available" };
    }
  }
}

// Initialize VIP seats: rows 1-12, assume 69 seats per row = 828 total
const VIP_SEATS_PER_ROW = 69;
for (let row = 1; row <= 12; row++) {
  for (let seat = 1; seat <= VIP_SEATS_PER_ROW; seat++) {
    const id = `vip-R${row}-S${seat}`;
    seatMaps.vip[id] = { id, row, seat, status: "available" };
  }
}

// GA / Bleacher inventory (quantity-based)
const gaInventory = {
  ga_tier1: { sold: 0, total: 828 },
  ga_tier2: { sold: 0, total: 5190 },
  bleacher: { sold: 0, total: 4100 },
};

// Temporary holds (expire after 10 min)
const holds = {};
const HOLD_DURATION_MS = 10 * 60 * 1000;

function cleanExpiredHolds() {
  const now = Date.now();
  for (const [holdId, hold] of Object.entries(holds)) {
    if (now - hold.createdAt > HOLD_DURATION_MS) {
      // Release seats
      if (hold.seatIds) {
        for (const seatId of hold.seatIds) {
          const type = seatId.startsWith("onstage") ? "onstage" : "vip";
          if (seatMaps[type][seatId]) {
            seatMaps[type][seatId].status = "available";
          }
        }
      }
      if (hold.ticketType && gaInventory[hold.ticketType]) {
        gaInventory[hold.ticketType].sold -= hold.quantity || 0;
      }
      delete holds[holdId];
    }
  }
}
setInterval(cleanExpiredHolds, 30000);

// --- Middleware ---
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "https://www.smalltownbigstage.org",
  "https://smalltownbigstage.org",
  "https://smalltownbigstage.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(null, true); // permissive for now
      }
    },
    credentials: true,
  })
);

// Stripe webhook needs raw body
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook sig verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const holdId = session.metadata?.holdId;
      if (holdId && holds[holdId]) {
        // Mark seats as sold permanently
        if (holds[holdId].seatIds) {
          for (const seatId of holds[holdId].seatIds) {
            const type = seatId.startsWith("onstage") ? "onstage" : "vip";
            if (seatMaps[type][seatId]) {
              seatMaps[type][seatId].status = "sold";
            }
          }
        }
        // GA inventory stays decremented (already counted)
        holds[holdId].confirmed = true;
        console.log(`Order confirmed: ${holdId}`);
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const holdId = session.metadata?.holdId;
      if (holdId && holds[holdId]) {
        // Release hold
        if (holds[holdId].seatIds) {
          for (const seatId of holds[holdId].seatIds) {
            const type = seatId.startsWith("onstage") ? "onstage" : "vip";
            if (seatMaps[type][seatId]) {
              seatMaps[type][seatId].status = "available";
            }
          }
        }
        if (holds[holdId].ticketType && gaInventory[holds[holdId].ticketType]) {
          gaInventory[holds[holdId].ticketType].sold -=
            holds[holdId].quantity || 0;
        }
        delete holds[holdId];
      }
    }

    res.json({ received: true });
  }
);

app.use(express.json());

// --- Routes ---

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Get all ticket info
app.get("/api/tickets", (req, res) => {
  res.json({
    tickets: TICKET_TYPES,
    addons: ADDONS,
    sponsors: SPONSOR_PACKAGES,
  });
});

// Get seat map for on-stage seating
app.get("/api/seats/onstage", (req, res) => {
  cleanExpiredHolds();
  const seats = Object.values(seatMaps.onstage).map((s) => ({
    id: s.id,
    section: s.section,
    row: s.row,
    seat: s.seat,
    status: s.status === "held" ? "held" : s.status,
  }));
  res.json({ seats, price: TICKET_TYPES.onstage.price, displayPrice: TICKET_TYPES.onstage.displayPrice });
});

// Get VIP seat map
app.get("/api/seats/vip", (req, res) => {
  cleanExpiredHolds();
  const seats = Object.values(seatMaps.vip).map((s) => ({
    id: s.id,
    row: s.row,
    seat: s.seat,
    status: s.status === "held" ? "held" : s.status,
  }));
  res.json({ seats, price: TICKET_TYPES.vip.price, displayPrice: TICKET_TYPES.vip.displayPrice });
});

// Get GA / Bleacher availability
app.get("/api/inventory", (req, res) => {
  cleanExpiredHolds();
  const result = {};
  for (const [key, inv] of Object.entries(gaInventory)) {
    result[key] = {
      available: inv.total - inv.sold,
      total: inv.total,
      price: TICKET_TYPES[key].price,
      displayPrice: TICKET_TYPES[key].displayPrice,
    };
  }
  res.json(result);
});

// Create checkout session
app.post("/api/checkout", async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(503).json({
        error: "Payment processing is not yet configured. Check back soon!",
      });
    }

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const { items } = req.body;
    // items: [{ type: "onstage"|"vip"|"ga_tier1"|"ga_tier2"|"bleacher"|"addon", seatIds?: string[], quantity?: number }]

    if (!items || !items.length) {
      return res.status(400).json({ error: "No items provided" });
    }

    const holdId = require("uuid").v4();
    const lineItems = [];
    const holdData = { createdAt: Date.now(), seatIds: [], items: [] };

    for (const item of items) {
      // Assigned seating (onstage, vip)
      if (
        (item.type === "onstage" || item.type === "vip") &&
        item.seatIds?.length
      ) {
        for (const seatId of item.seatIds) {
          const seat = seatMaps[item.type]?.[seatId];
          if (!seat || seat.status !== "available") {
            return res.status(409).json({
              error: `Seat ${seatId} is no longer available`,
            });
          }
        }
        // Hold seats
        for (const seatId of item.seatIds) {
          seatMaps[item.type][seatId].status = "held";
          holdData.seatIds.push(seatId);
        }
        const ticketConfig = TICKET_TYPES[item.type];
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: `${ticketConfig.name} Ticket`,
              description: item.seatIds.join(", "),
            },
            unit_amount: ticketConfig.price,
          },
          quantity: item.seatIds.length,
        });
      }

      // GA / Bleacher (quantity-based)
      if (["ga_tier1", "ga_tier2", "bleacher"].includes(item.type)) {
        const qty = parseInt(item.quantity) || 1;
        const inv = gaInventory[item.type];
        if (inv.sold + qty > inv.total) {
          return res.status(409).json({
            error: `Not enough ${TICKET_TYPES[item.type].name} tickets available`,
          });
        }
        inv.sold += qty;
        holdData.ticketType = item.type;
        holdData.quantity = qty;

        const ticketConfig = TICKET_TYPES[item.type];
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: `${ticketConfig.name} Ticket`,
            },
            unit_amount: ticketConfig.price,
          },
          quantity: qty,
        });
      }

      // Addon (photo op)
      if (item.type === "addon" && item.addonId) {
        const addon = ADDONS[item.addonId];
        if (addon) {
          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: addon.name,
                description: addon.description,
              },
              unit_amount: addon.price,
            },
            quantity: parseInt(item.quantity) || 1,
          });
        }
      }
    }

    if (!lineItems.length) {
      return res.status(400).json({ error: "No valid items" });
    }

    holds[holdId] = holdData;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/tickets`,
      metadata: { holdId },
      expires_at: Math.floor(Date.now() / 1000) + 600, // 10 min
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Sponsor inquiry (no payment, just a form submission placeholder)
app.post("/api/sponsor-inquiry", (req, res) => {
  const { name, email, company, packageId, message } = req.body;
  // In production, send email or store in DB
  console.log("Sponsor inquiry:", { name, email, company, packageId, message });
  res.json({ success: true, message: "Thank you! We will contact you soon." });
});

app.listen(PORT, () => {
  console.log(`Small Town Big Stage API running on port ${PORT}`);
});
