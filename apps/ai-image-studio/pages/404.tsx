export default function Page404() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0d1014",
        color: "#f3f6fb",
        fontFamily: "'Segoe UI', sans-serif"
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p style={{ letterSpacing: "0.16em", fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase" }}>404</p>
        <h1 style={{ marginTop: "0.5rem", fontSize: "1.5rem" }}>Page not found</h1>
      </div>
    </main>
  );
}
