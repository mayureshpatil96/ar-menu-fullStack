import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8080/api";

const statusColors = {
  PENDING: { bg: "rgba(255,193,7,0.15)", border: "rgba(255,193,7,0.4)", color: "#FFC107", label: "⏳ Pending" },
  PREPARING: { bg: "rgba(33,150,243,0.15)", border: "rgba(33,150,243,0.4)", color: "#2196F3", label: "👨‍🍳 Preparing" },
  SERVED: { bg: "rgba(46,204,113,0.15)", border: "rgba(46,204,113,0.4)", color: "#2ECC71", label: "✅ Served" },
  CANCELLED: { bg: "rgba(255,59,48,0.15)", border: "rgba(255,59,48,0.4)", color: "#FF3B30", label: "❌ Cancelled" },
};

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [lastCount, setLastCount] = useState(0);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/orders`);
      const data = await res.json();
      // Play sound if new order comes in
      if (lastCount > 0 && data.length > lastCount) {
        playNotification();
      }
      setLastCount(data.length);
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Play notification sound for new orders
  const playNotification = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.value = 800;
    gain.gain.value = 0.3;
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
  };

  // Auto refresh every 5 seconds
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await fetch(`${BASE_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredOrders = filter === "ALL"
    ? orders
    : orders.filter(o => o.status === filter);

  const pendingCount = orders.filter(o => o.status === "PENDING").length;
  const preparingCount = orders.filter(o => o.status === "PREPARING").length;

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0F",
      paddingBottom: 40,
    }}>

      {/* Header */}
      <div style={{
        background: "rgba(10,10,15,0.98)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "16px 24px",
        position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(20px)",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}>
          <div>
            <div style={{
              fontSize: 11, letterSpacing: 3,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase", marginBottom: 4,
            }}>
              Our Restaurant
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 24, color: "#fff", fontWeight: 700,
            }}>
              Kitchen Dashboard 👨‍🍳
            </h1>
          </div>

          {/* Live indicator */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(46,204,113,0.1)",
            border: "1px solid rgba(46,204,113,0.3)",
            borderRadius: 20, padding: "8px 16px",
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#2ECC71",
              animation: "pulse 1.5s infinite",
            }} />
            <span style={{ color: "#2ECC71", fontSize: 13, fontWeight: 600 }}>
              Live
            </span>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: 12, marginBottom: 16,
        }}>
          {[
            { label: "Pending", count: pendingCount, color: "#FFC107" },
            { label: "Preparing", count: preparingCount, color: "#2196F3" },
            { label: "Total Today", count: orders.length, color: "#FF6B35" },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14, padding: "12px 16px",
              textAlign: "center",
            }}>
              <div style={{
                fontSize: 24, fontWeight: 800,
                color: stat.color,
              }}>
                {stat.count}
              </div>
              <div style={{
                fontSize: 11, color: "rgba(255,255,255,0.4)",
                marginTop: 2,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {["ALL", "PENDING", "PREPARING", "SERVED", "CANCELLED"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "#FF6B35" : "rgba(255,255,255,0.06)",
                border: "none",
                color: filter === f ? "#fff" : "rgba(255,255,255,0.5)",
                borderRadius: 20, padding: "8px 16px",
                cursor: "pointer", fontWeight: 600,
                fontSize: 12, whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {f === "ALL" ? "All Orders" : statusColors[f].label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>

        {loading ? (
          <div style={{
            textAlign: "center", padding: "60px 0",
            color: "rgba(255,255,255,0.4)",
          }}>
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 0",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 15 }}>
              No orders yet
            </div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16,
          }}>
            {filteredOrders.map(order => {
              const s = statusColors[order.status];
              return (
                <div key={order.id} style={{
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  borderRadius: 20, padding: 20,
                  position: "relative",
                }}>

                  {/* Order header */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}>
                    <div>
                      <div style={{
                        fontSize: 20, fontWeight: 800,
                        color: "#fff",
                      }}>
                        Table {order.tableNo}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.4)",
                        marginTop: 2,
                      }}>
                        Order #{order.id} · {formatTime(order.createdAt)}
                      </div>
                    </div>
                    <div style={{
                      background: s.bg,
                      border: `1px solid ${s.border}`,
                      borderRadius: 20, padding: "6px 14px",
                      color: s.color, fontSize: 12, fontWeight: 700,
                    }}>
                      {s.label}
                    </div>
                  </div>

                  {/* Order items */}
                  <div style={{
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: 14, padding: 14,
                    marginBottom: 16,
                  }}>
                    {order.items && order.items.map((item, i) => (
                      <div key={i} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "6px 0",
                        borderBottom: i < order.items.length - 1
                          ? "1px solid rgba(255,255,255,0.06)"
                          : "none",
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center", gap: 8,
                        }}>
                          <span style={{ fontSize: 20 }}>{item.emoji}</span>
                          <div>
                            <div style={{
                              color: "#fff", fontSize: 14, fontWeight: 600,
                            }}>
                              {item.itemName}
                            </div>
                            {item.specialInstructions && (
                              <div style={{
                                color: "#FFC107", fontSize: 11, marginTop: 2,
                              }}>
                                📝 {item.specialInstructions}
                              </div>
                            )}
                          </div>
                        </div>
                        <div style={{
                          background: "rgba(255,255,255,0.1)",
                          borderRadius: 8, padding: "4px 10px",
                          color: "#fff", fontWeight: 700, fontSize: 13,
                        }}>
                          ×{item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}>
                    <span style={{
                      color: "rgba(255,255,255,0.5)", fontSize: 13,
                    }}>
                      Total (incl. GST)
                    </span>
                    <span style={{
                      color: "#FF6B35", fontWeight: 800, fontSize: 18,
                    }}>
                      ₹{order.finalAmount}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 8 }}>
                    {order.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => updateStatus(order.id, "PREPARING")}
                          style={{
                            flex: 1,
                            background: "linear-gradient(135deg, #2196F3, #1976D2)",
                            border: "none", color: "#fff",
                            borderRadius: 12, padding: "12px",
                            fontWeight: 700, cursor: "pointer", fontSize: 13,
                          }}
                        >
                          👨‍🍳 Start Preparing
                        </button>
                        <button
                          onClick={() => updateStatus(order.id, "CANCELLED")}
                          style={{
                            background: "rgba(255,59,48,0.2)",
                            border: "1px solid rgba(255,59,48,0.3)",
                            color: "#FF3B30", borderRadius: 12,
                            padding: "12px 16px",
                            fontWeight: 700, cursor: "pointer", fontSize: 13,
                          }}
                        >
                          ❌
                        </button>
                      </>
                    )}
                    {order.status === "PREPARING" && (
                      <button
                        onClick={() => updateStatus(order.id, "SERVED")}
                        style={{
                          flex: 1,
                          background: "linear-gradient(135deg, #2ECC71, #27AE60)",
                          border: "none", color: "#fff",
                          borderRadius: 12, padding: "12px",
                          fontWeight: 700, cursor: "pointer", fontSize: 14,
                        }}
                      >
                        ✅ Mark as Served
                      </button>
                    )}
                    {order.status === "SERVED" && (
                      <div style={{
                        flex: 1, textAlign: "center",
                        color: "#2ECC71", fontWeight: 600, fontSize: 13,
                        padding: "12px",
                      }}>
                        🎉 Order Completed!
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}