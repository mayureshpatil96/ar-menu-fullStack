import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { placeOrder } from "../api";

export default function Cart({ lang, cart, removeFromCart, clearCart }) {
  const { tableNo } = useParams();
  const navigate = useNavigate();

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const speak = (text, l) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = l === "hi" ? "hi-IN" : "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const text =
      lang === "hi"
        ? `आपके कार्ट में ${cartCount} आइटम हैं। कुल राशि ${total} रुपये है।`
        : `You have ${cartCount} items in your cart. Total is ${total} rupees.`;
    const t = setTimeout(() => speak(text, lang), 500);
    return () => clearTimeout(t);
  }, []);

  const handlePlaceOrder = async () => {
  try {
    await placeOrder(cart, tableNo, lang);
    clearCart();
    navigate(`/confirm/${tableNo}`);
  } catch (err) {
    console.error("Order failed:", err);
    alert(lang === "hi" ? "ऑर्डर देने में समस्या हुई!" : "Failed to place order!");
  }
};

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0F",
      paddingBottom: 140,
    }}>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,10,15,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}>
        <button
          onClick={() => navigate(`/menu/${tableNo}`)}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "none", color: "#fff",
            borderRadius: 12, padding: "8px 14px",
            cursor: "pointer", fontSize: 18,
          }}
        >
          ←
        </button>
        <div>
          <div style={{
            fontSize: 10, letterSpacing: 3,
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
          }}>
            Table {tableNo}
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22, color: "#fff", fontWeight: 700,
          }}>
            {lang === "hi" ? "आपका ऑर्डर" : "Your Order"}
          </h2>
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>

        {/* Empty cart */}
        {cart.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 0",
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <div style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 16, marginBottom: 24,
            }}>
              {lang === "hi" ? "कार्ट खाली है" : "Your cart is empty"}
            </div>
            <button
              onClick={() => navigate(`/menu/${tableNo}`)}
              style={{
                background: "linear-gradient(135deg, #FF6B35, #FF8E53)",
                border: "none", color: "#fff",
                borderRadius: 14, padding: "14px 28px",
                fontWeight: 700, cursor: "pointer", fontSize: 15,
              }}
            >
              {lang === "hi" ? "मेनू देखें" : "Browse Menu"}
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20, overflow: "hidden",
              marginBottom: 20,
            }}>
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14, padding: "16px 20px",
                    borderBottom: index < cart.length - 1
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                  }}
                >
                  {/* Emoji */}
                  <div style={{
                    fontSize: 36,
                    filter: `drop-shadow(0 4px 8px ${item.color}44)`,
                  }}>
                    {item.emoji}
                  </div>

                  {/* Name & price */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: "#fff", fontWeight: 600, fontSize: 15,
                    }}>
                      {lang === "hi" ? item.name_hi : item.name}
                    </div>
                    <div style={{
                      color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2,
                    }}>
                      ₹{item.price} × {item.qty}
                    </div>
                  </div>

                  {/* Item total */}
                  <div style={{
                    color: "#FF6B35", fontWeight: 700, fontSize: 16,
                    marginRight: 12,
                  }}>
                    ₹{item.price * item.qty}
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      background: "rgba(255,59,48,0.15)",
                      border: "none", color: "#FF3B30",
                      borderRadius: 10, padding: "6px 10px",
                      cursor: "pointer", fontSize: 16,
                    }}
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20, padding: "20px",
              marginBottom: 20,
            }}>
              <div style={{
                fontSize: 11, letterSpacing: 3,
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase", marginBottom: 16,
              }}>
                {lang === "hi" ? "बिल विवरण" : "Bill Summary"}
              </div>

              <div style={{
                display: "flex", justifyContent: "space-between",
                marginBottom: 10,
              }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                  {lang === "hi" ? "उप-योग" : "Subtotal"}
                </span>
                <span style={{ color: "#fff", fontSize: 14 }}>₹{total}</span>
              </div>

              <div style={{
                display: "flex", justifyContent: "space-between",
                marginBottom: 10,
              }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                  {lang === "hi" ? "GST (5%)" : "GST (5%)"}
                </span>
                <span style={{ color: "#fff", fontSize: 14 }}>
                  ₹{Math.round(total * 0.05)}
                </span>
              </div>

              <div style={{
                height: 1,
                background: "rgba(255,255,255,0.07)",
                margin: "14px 0",
              }} />

              <div style={{
                display: "flex", justifyContent: "space-between",
              }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>
                  {lang === "hi" ? "कुल राशि" : "Total"}
                </span>
                <span style={{
                  color: "#FF6B35", fontWeight: 800, fontSize: 22,
                }}>
                  ₹{total + Math.round(total * 0.05)}
                </span>
              </div>
            </div>

            {/* Aria note */}
            <div style={{
              background: "rgba(255,107,53,0.08)",
              border: "1px solid rgba(255,107,53,0.15)",
              borderRadius: 14, padding: "12px 16px",
              display: "flex", gap: 10, alignItems: "center",
              marginBottom: 24,
            }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <span style={{
                color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.5,
              }}>
                {lang === "hi"
                  ? "आपका ऑर्डर सही है? Place Order दबाएं और हम तुरंत तैयार करना शुरू करेंगे!"
                  : "Looks good? Press Place Order and we will start preparing right away!"}
              </span>
            </div>

            {/* Add More & Place Order buttons */}
            <button
              onClick={() => navigate(`/menu/${tableNo}`)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                borderRadius: 16, padding: "15px 32px",
                fontWeight: 600, cursor: "pointer",
                fontSize: 15, width: "100%", marginBottom: 12,
              }}
            >
              {lang === "hi" ? "+ और आइटम जोड़ें" : "+ Add More Items"}
            </button>

            <button
              onClick={handlePlaceOrder}
              style={{
                background: "linear-gradient(135deg, #FF6B35, #FF8E53)",
                border: "none", color: "#fff",
                borderRadius: 16, padding: "18px 32px",
                fontWeight: 800, cursor: "pointer",
                fontSize: 16, width: "100%",
                boxShadow: "0 8px 32px rgba(255,107,53,0.4)",
              }}
            >
              {lang === "hi" ? "✅ ऑर्डर दें" : "✅ Place Order"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}