import Link from "next/link";

export default function MarketingPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "5rem 1.5rem" }}>
      <section
        style={{
          maxWidth: "44rem",
          margin: "0 auto",
          background: "var(--panel)",
          border: "1px solid var(--border)",
          padding: "3rem 2rem",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "3rem",
            height: "2px",
            background: "var(--accent)",
            marginBottom: "1.25rem",
          }}
        />
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>Architect&apos;s Study</h1>
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </div>
      </section>
    </main>
  );
}
