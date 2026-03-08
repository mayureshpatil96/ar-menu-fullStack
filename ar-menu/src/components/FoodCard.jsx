import { useState } from "react";

export default function FoodCard({ item, lang, onAdd }) {
  const [pressed, setPressed] = useState(false);

  const handleAdd = () => {
    setPressed(true);
    onAdd(item);
    setTimeout(() => setPressed(false), 600);
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 20, padding: 20,
      position: "relative", overflow: "hidden",
      transition: "border-color 0.3s",
    }}>

      {/* Top color line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
      }} />

      {/* Emoji */}
      <div style={{
        fontSize: 52, textAlign: "center", marginBottom: 10,
        filter: `drop-shadow(0 6px 12px ${item.color}55)`,
      }}>
        {item.emoji}
      </div>

      {/* Category */}
      <div style={{
        fontSize: 10, color: item.color,
        fontWeight: 700, letterSpacing: 2,
        textTransform: "uppercase", marginBottom: 4,
      }}>
        {item.category}
      </div>

      {/* Name */}
      <div style={{
        fontSize: 17, fontWeight: 700,
        color: "#fff", marginBottom: 4,
        fontFamily: "'Playfair Display', serif",
      }}>
        {lang === "hi" ? item.name_hi : item.name}
      </div>

      {/* Description */}
      <div style={{
        fontSize: 12, color: "rgba(255,255,255,0.45)",
        marginBottom: 14, lineHeight: 1.5,
      }}>
        {lang === "hi" ? item.desc_hi : item.desc}
      </div>

      {/* Price + Add Button */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
            ₹{item.price}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
            ⭐ {item.rating} · {item.time}
          </div>
        </div>

        <button
          onClick={handleAdd}
          style={{
            background: pressed
              ? "#fff"
              : `linear-gradient(135deg, ${item.color}, ${item.color}bb)`,
            border: "none",
            color: pressed ? item.color : "#fff",
            borderRadius: 12, padding: "10px 20px",
            fontWeight: 700, cursor: "pointer", fontSize: 14,
            boxShadow: `0 4px 16px ${item.color}44`,
            transition: "all 0.2s",
            transform: pressed ? "scale(0.95)" : "scale(1)",
          }}
        >
          {pressed
            ? "✓"
            : lang === "hi" ? "+ जोड़ें" : "+ Add"}
        </button>
      </div>

    </div>
  );
}