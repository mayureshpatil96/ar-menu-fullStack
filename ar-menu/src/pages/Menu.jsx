import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FoodCard from "../components/FoodCard";
import { getMenu } from "../api";

const categories = ["All", "Starters", "Main Course", "Bread", "Drinks", "Desserts"];

export default function Menu({ lang, cart, addToCart }) {
  const { tableNo } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [ariaText, setAriaText] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((i) => i.category === activeCategory);

  const speak = (text, l) => {
    window.speechSynthesis.cancel();
    const voices = window.speechSynthesis.getVoices();
    const sentences = text.match(/[^।|.!?]+[।.!?]*/g) || [text];
    let index = 0;
    const speakNext = () => {
      if (index >= sentences.length) return;
      const utterance = new SpeechSynthesisUtterance(sentences[index].trim());
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
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onend = () => { index++; speakNext(); };
      window.speechSynthesis.speak(utterance);
    };
    speakNext();
  };

  // Load menu from backend
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await getMenu();
        // Map backend fields to frontend fields
        const mapped = data.map(item => ({
          ...item,
          name_hi: item.nameHindi,
          desc: item.description,
          desc_hi: item.descriptionHindi,
          time: item.prepTime,
        }));
        setMenuItems(mapped);
      } catch (err) {
        console.error("Failed to load menu:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, []);

  // Aria greets on menu page
  useEffect(() => {
    const text =
      lang === "hi"
        ? "यह हमारा मेनू है! कोई भी डिश चुनें और Add दबाएं।"
        : "Here is our menu! Tap Add on anything you would like to order.";
    setAriaText(text);
    const t = setTimeout(() => speak(text, lang), 600);
    return () => clearTimeout(t);
  }, [lang]);

  const handleAddToCart = (item) => {
    addToCart(item);
    const text =
      lang === "hi"
        ? `${item.name_hi} कार्ट में जोड़ा गया!`
        : `${item.name} added to your order!`;
    setAriaText(text);
    speak(text, lang);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0A0A0F",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16,
      }}>
        <div style={{ fontSize: 48 }}>🍽️</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
          {lang === "hi" ? "मेनू लोड हो रहा है..." : "Loading menu..."}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", paddingBottom: 120 }}>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,10,15,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 20px",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 14,
        }}>
          <div>
            <div style={{
              fontSize: 10, letterSpacing: 3,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase", marginBottom: 4,
            }}>
              Table {tableNo}
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22, color: "#fff", fontWeight: 700,
            }}>
              {lang === "hi" ? "हमारा मेनू" : "Our Menu"}
            </h2>
          </div>

          <button
            onClick={() => navigate(`/cart/${tableNo}`)}
            style={{
              background: cartCount > 0
                ? "linear-gradient(135deg, #FF6B35, #FF8E53)"
                : "rgba(255,255,255,0.08)",
              border: "none", color: "#fff",
              borderRadius: 14, padding: "10px 18px",
              fontWeight: 700, cursor: "pointer", fontSize: 14,
              boxShadow: cartCount > 0 ? "0 4px 20px rgba(255,107,53,0.4)" : "none",
              transition: "all 0.3s",
            }}
          >
            🛒 {cartCount} · ₹{cartTotal}
          </button>
        </div>

        {/* Aria bubble */}
        {ariaText !== "" && (
          <div style={{
            background: "rgba(255,107,53,0.08)",
            border: "1px solid rgba(255,107,53,0.2)",
            borderRadius: 12, padding: "10px 14px",
            marginBottom: 14,
            display: "flex", gap: 8, alignItems: "center",
          }}>
            <span style={{ fontSize: 18 }}>🤖</span>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.5 }}>
              {ariaText}
            </span>
          </div>
        )}

        {/* Category Filter */}
        <div style={{
          display: "flex", gap: 8,
          overflowX: "auto", paddingBottom: 4,
          scrollbarWidth: "none",
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? "#FF6B35" : "rgba(255,255,255,0.06)",
                border: "none",
                color: activeCategory === cat ? "#fff" : "rgba(255,255,255,0.5)",
                borderRadius: 20, padding: "8px 16px",
                cursor: "pointer", fontWeight: 600,
                fontSize: 13, whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {lang === "hi"
                ? { All: "सब", Starters: "स्टार्टर", "Main Course": "मुख्य", Bread: "रोटी", Drinks: "पेय", Desserts: "मिठाई" }[cat]
                : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div style={{
        padding: "20px 16px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
      }}>
        {filteredItems.map((item) => (
          <FoodCard
            key={item.id}
            item={item}
            lang={lang}
            onAdd={handleAddToCart}
          />
        ))}
      </div>

    </div>
  );
}