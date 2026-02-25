const TICKET_TYPES = {
  onstage: {
    id: "onstage",
    name: "On Stage",
    price: 32500, // cents
    displayPrice: "$325",
    description: "Premium on-stage seating with free photo op with the General Lee and event lanyard",
    totalSeats: 20,
    perks: [
      "On-stage seating",
      "Free photo op with the General Lee",
      "Event lanyard"
    ],
    color: "#D4AF37"
  },
  vip: {
    id: "vip",
    name: "VIP",
    price: 12500,
    displayPrice: "$125",
    description: "First 12 rows with event lanyard and $10 off General Lee photo op",
    totalSeats: 828,
    perks: [
      "Rows 1–12 closest to stage",
      "Event lanyard",
      "$10 off General Lee photo op"
    ],
    color: "#1E90FF"
  },
  ga_tier1: {
    id: "ga_tier1",
    name: "General Admission Tier 1",
    price: 8500,
    displayPrice: "$85",
    description: "Rows 13–24, great sightlines to the stage",
    totalSeats: 828,
    perks: [
      "Rows 13–24",
      "Great sightlines"
    ],
    color: "#DC3545"
  },
  ga_tier2: {
    id: "ga_tier2",
    name: "General Admission Tier 2",
    price: 6500,
    displayPrice: "$65",
    description: "On-field seating behind Tier 1",
    totalSeats: 5190,
    perks: [
      "On-field seating",
      "Full stage view"
    ],
    color: "#6C757D"
  },
  bleacher: {
    id: "bleacher",
    name: "Bleacher Seating",
    price: 5000,
    displayPrice: "$50",
    description: "Stadium bleacher seating",
    totalSeats: 4100,
    perks: [
      "Stadium bleacher seating",
      "Elevated view"
    ],
    color: "#28A745"
  }
};

const ADDONS = {
  general_lee_photo: {
    id: "general_lee_photo",
    name: "General Lee Photo Op",
    price: 4000,
    displayPrice: "$40",
    description: "Photo opportunity with the General Lee"
  }
};

const SPONSOR_PACKAGES = {
  platinum_banner: {
    id: "platinum_banner",
    name: "Platinum Banner",
    price: 800000,
    displayPrice: "$8,000",
    totalAvailable: 3,
    description: "Prime fencing perimeter placement of 3' x 5' poster, 30 second scoreboard rotation, name on sponsor page under Platinum Category, 4 VIP tickets, social media mentions",
    perks: [
      "Prime fencing perimeter placement (3' x 5' poster)",
      "30 second scoreboard rotation",
      "Name on sponsor page (Platinum)",
      "4 VIP tickets included",
      "Social media mentions"
    ]
  },
  gold_banner: {
    id: "gold_banner",
    name: "Gold Banner",
    price: 450000,
    displayPrice: "$4,500",
    totalAvailable: 6,
    description: "Prime fencing perimeter placement of 3' x 5' poster, scoreboard slide rotation, 2 VIP tickets, name on sponsor page under Gold Category",
    perks: [
      "Prime fencing perimeter placement (3' x 5' poster)",
      "Scoreboard slide rotation",
      "2 VIP tickets included",
      "Name on sponsor page (Gold)"
    ]
  },
  silver_banner: {
    id: "silver_banner",
    name: "Silver Banner",
    price: 150000,
    displayPrice: "$1,500",
    totalAvailable: 25,
    description: "Standard fencing perimeter placement of 3' x 5' poster, name on sponsor page, 2 GA Tier 1 tickets",
    perks: [
      "Standard fencing perimeter placement (3' x 5' poster)",
      "Name on sponsor page (Silver)",
      "2 GA Tier 1 tickets included"
    ]
  },
  gate_sponsorship: {
    id: "gate_sponsorship",
    name: "Gate Sponsorship",
    price: 300000,
    displayPrice: "$3,000",
    totalAvailable: 2,
    description: "Decorate an archway over the entry gate for advertisement"
  },
  photo_backdrop: {
    id: "photo_backdrop",
    name: "Photo Backdrop Sponsorship",
    price: 800000,
    displayPrice: "$8,000",
    totalAvailable: 1,
    description: "Your business advertisement in the background of every General Lee photo op"
  },
  lanyard_sponsor: {
    id: "lanyard_sponsor",
    name: "Lanyard Sponsorship",
    price: 400000,
    displayPrice: "$4,000",
    totalAvailable: 1,
    description: "Business name and logo displayed on all event lanyards (given to On Stage and VIP ticket holders)"
  },
  exclusive_advertising: {
    id: "exclusive_advertising",
    name: "Exclusive Advertising Add-On",
    price: 500000,
    displayPrice: "$5,000",
    totalAvailable: null,
    description: "Prevent competitors from advertising. Requires Gold or Platinum Banner purchase."
  },
  digital_qr: {
    id: "digital_qr",
    name: "Digital QR Sponsorship",
    price: 500000,
    displayPrice: "$5,000",
    totalAvailable: 1,
    description: "Main advertisement displayed when attendees scan QR codes (replaces traditional programs)"
  }
};

module.exports = { TICKET_TYPES, ADDONS, SPONSOR_PACKAGES };
