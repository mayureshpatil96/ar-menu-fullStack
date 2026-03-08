import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import OrderConfirm from "./pages/OrderConfirm";
import Loader from "./components/Loader";
import Kitchen from "./pages/Kitchen";

export default function App() {
  const [lang, setLang] = useState("en");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate app loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((c) => c.id !== itemId));
  };

  const clearCart = () => setCart([]);

  if (loading) return <Loader />;

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route
          path="/table/:tableNo"
          element={<Home lang={lang} setLang={setLang} />}
        />
        <Route
          path="/menu/:tableNo"
          element={
            <Menu
              lang={lang}
              cart={cart}
              addToCart={addToCart}
            />
          }
        />
        <Route
          path="/cart/:tableNo"
          element={
            <Cart
              lang={lang}
              cart={cart}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
            />
          }
        />
        <Route
          path="/confirm/:tableNo"
          element={
            <OrderConfirm
              lang={lang}
              cart={cart}
            />
          }
        />
        <Route path="*" element={<Navigate to="/table/1" />} />
        <Route path="/kitchen" element={<Kitchen />} />
      </Routes>
    </BrowserRouter>
  );
}