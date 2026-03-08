export default function Loader() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0F",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
    }}>
      {/* Logo */}
      <div style={{ fontSize: 64 }}>🍽️</div>

      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 28, color: "#fff", fontWeight: 800,
      }}>
        Our Restaurant
      </div>

      {/* Loading bar */}
      <div style={{
        width: 120, height: 3,
        background: "rgba(255,255,255,0.1)",
        borderRadius: 10, overflow: "hidden",
        marginTop: 8,
      }}>
        <div style={{
          height: "100%",
          background: "linear-gradient(90deg, #FF6B35, #FF8E53)",
          borderRadius: 10,
          animation: "load 1.5s ease infinite",
        }} />
      </div>

      <div style={{
        fontSize: 12, letterSpacing: 3,
        color: "rgba(255,255,255,0.3)",
        textTransform: "uppercase",
      }}>
        Loading Menu...
      </div>

      <style>{`
        @keyframes load {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 80%; margin-left: 10%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}