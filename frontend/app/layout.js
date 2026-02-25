import "./globals.css";

export const metadata = {
  title: "Small Town Big Stage | May 30, 2026 | Vermilion, OH",
  description:
    "Live concert featuring Cody McCarver, John Schneider, and Mike Neff & Friends at Vermilion Sailor Stadium. Gates open 5:30 PM, show at 6:30 PM. Get your tickets now!",
  openGraph: {
    title: "Small Town Big Stage",
    description:
      "Live concert May 30, 2026 at Vermilion Sailor Stadium featuring Cody McCarver, John Schneider, Mike Neff & Friends",
    url: "https://www.smalltownbigstage.org",
    siteName: "Small Town Big Stage",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
