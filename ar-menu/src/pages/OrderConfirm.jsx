import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function OrderConfirm({ lang, cart }) {
  const { tableNo } = useParams();
  const navigate = useNavigate();

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const gst = Math.round(total * 0.05);

  const speak = (text, l) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    if (l === "hi") {
      const hindiVoice = voices.find(v => v.lang === "hi-IN");
      const indianVoice = voices.find(v => v.name.includes("Heera") || v.name.includes("Ravi"));
      utterance.voice = hindiVoice || indianVoice || null;
      utterance.lang = hindiVoice ? "hi-IN" : "en-IN";
    } else {
      const ariaVoice = voices.find(v => v.name.includes("Aria Online"));
      utterance.voice = ariaVoice || null;
      utterance.lang = "en-US";
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const text =
      lang === "hi"
        ? `शुक्रिया! आपका ऑर्डर मिल गया है। टेबल ${tableNo} पर जल्द ही सर्व किया जाएगा।`
        : `Thank you! Your order has been placed. It will be served at Table ${tableNo} shortly.`;
    const t = setTimeout(() => speak(text, lang), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0F",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 28,
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background glows */}
      <div style={{
        position: "absolute", width: 400, height: 400,
        borderRadius: "50%", background: "#FF6B35",
        left: -100, top: -100,
        filter: "blur(130px)", opacity: 0.1,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300,
        borderRadius: "50%", background: "#2ECC71",
        right: -80, bottom: 0,
        filter: "blur(110px)", opacity: 0.08,
        pointerEvents: "none",
      }} />

      {/* Success icon */}
      <div style={{
        width: 100, height: 100, borderRadius: "50%",
        background: "linear-gradient(135deg, #2ECC71, #27AE60)",
        display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 48,
        marginBottom: 20,
        boxShadow: "0 8px 40px rgba(46,204,113,0.35)",
      }}>
        ✅
      </div>

      {/* Title */}
      <div style={{
        fontSize: 11, letterSpacing: 3,
        color: "#2ECC71", textTransform: "uppercase",
        fontWeight: 700, marginBottom: 8,
      }}>
        {lang === "hi" ? "ऑर्डर दिया गया" : "Order Placed"}
      </div>

      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 32, color: "#fff",
        fontWeight: 800, marginBottom: 8,
        textAlign: "center",
      }}>
        {lang === "hi" ? "शुक्रिया! 🙏" : "Thank You!"}
      </h2>

      <p style={{
        color: "rgba(255,255,255,0.4)",
        fontSize: 14, marginBottom: 32,
        textAlign: "center", lineHeight: 1.7,
      }}>
        {lang === "hi"
          ? `टेबल ${tableNo} पर आपका ऑर्डर मिल गया है।`
          : `Your order for Table ${tableNo} is confirmed.`}
      </p>

      {/* Aria message */}
      <div style={{
        background: "rgba(255,107,53,0.08)",
        border: "1px solid rgba(255,107,53,0.15)",
        borderRadius: 16, padding: "14px 18px",
        display: "flex", gap: 10, alignItems: "center",
        marginBottom: 24, width: "100%", maxWidth: 360,
      }}>
        <span style={{ fontSize: 22 }}>🤖</span>
        <span style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: 13, lineHeight: 1.6,
        }}>
          {lang === "hi"
            ? "आपका ऑर्डर हमारे शेफ को मिल गया है। थोड़ा इंतज़ार करें! 😊"
            : "Your order has reached our chef. Sit back and relax! 😊"}
        </span>
      </div>

      {/* Order summary */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20, padding: 20,
        width: "100%", maxWidth: 360,
        marginBottom: 24,
      }}>
        <div style={{
          fontSize: 11, letterSpacing: 3,
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase", marginBottom: 16,
        }}>
          {lang === "hi" ? "ऑर्डर सारांश" : "Order Summary"}
        </div>

        {cart.map((item) => (
          <div key={item.id} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
            <span style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 14,
            }}>
              {item.emoji} {lang === "hi" ? item.name_hi : item.name} ×{item.qty}
            </span>
            <span style={{ color: "#fff", fontSize: 14 }}>
              ₹{item.price * item.qty}
            </span>
          </div>
        ))}

        {/* GST */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          padding: "10px 0",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
            GST (5%)
          </span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
            ₹{gst}
          </span>
        </div>

        {/* Total */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          paddingTop: 12,
        }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
            {lang === "hi" ? "कुल राशि" : "Total"}
          </span>
          <span style={{
            color: "#FF6B35", fontWeight: 800, fontSize: 22,
          }}>
            ₹{total + gst}
          </span>
        </div>
      </div>

      {/* Estimated time */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        color: "rgba(255,255,255,0.3)", fontSize: 13,
        marginBottom: 32,
      }}>
        <span>⏱️</span>
        {lang === "hi"
          ? "अनुमानित समय: 20-30 मिनट"
          : "Estimated time: 20–30 mins"}
      </div>

      {/* Order again button */}
      <button
        onClick={() => navigate(`/table/${tableNo}`)}
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.6)",
          borderRadius: 16, padding: "14px 32px",
          fontWeight: 600, cursor: "pointer",
          fontSize: 14, width: "100%", maxWidth: 360,
        }}
      >
        {lang === "hi" ? "🔄 नया ऑर्डर करें" : "🔄 Start New Order"}
      </button>

    </div>
  );
}