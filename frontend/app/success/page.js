export default function SuccessPage() {
  return (
    <div className="success-page">
      <div className="success-icon">🎶</div>
      <h1>You're Going!</h1>
      <p>
        Your tickets to Small Town Big Stage have been confirmed. Check your email
        for your receipt and ticket details. See you May 30th at Sailor Stadium!
      </p>
      <a href="/" className="hero-cta" style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}>
        Back to Home
      </a>
    </div>
  );
}
