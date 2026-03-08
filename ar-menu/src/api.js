const BASE_URL = "http://localhost:8080/api";

// ── Menu ──────────────────────────────
export const getMenu = async () => {
  const res = await fetch(`${BASE_URL}/menu`);
  return res.json();
};

export const getMenuByCategory = async (category) => {
  const res = await fetch(`${BASE_URL}/menu/category/${category}`);
  return res.json();
};

// ── Orders ────────────────────────────
export const placeOrder = async (cartItems, tableNo, lang) => {
  const items = cartItems.map((item) => ({
    itemName: item.name,
    itemNameHindi: item.name_hi,
    emoji: item.emoji,
    quantity: item.qty,
    price: item.price,
    specialInstructions: item.specialInstructions || "",
  }));

  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableNo: parseInt(tableNo), language: lang, items }),
  });
  return res.json();
};