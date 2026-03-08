import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const getTimeOfDay = () => {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
};

export default function Home({ lang, setLang }) {
  const { tableNo } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("welcome"); // welcome | talking | buttons
  const [ariaText, setAriaText] = useState("");
  const [dots, setDots] = useState("");
  const time = getTimeOfDay();

  // Dots animation
  useEffect(() => {
    if (status !== "talking") return;
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(interval);
  }, [status]);

  const speak = (text, l, onEnd) => {
  window.speechSynthesis.cancel();

  const voices = window.speechSynthesis.getVoices();
  const hindiVoice = voices.find(v => v.lang === "hi-IN");
  const indianVoice = voices.find(v =>
    v.name.includes("Heera") || v.name.includes("Ravi")
  );
  const ariaVoice = voices.find(v => v.name.includes("Aria Online"));

  // Split into small sentences so browser doesn't cut off
  const sentences = text.match(/[^।|.!?]+[।.!?]*/g) || [text];
  let index = 0;

  const speakNext = () => {
    if (index >= sentences.length) {
      if (onEnd) onEnd();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(sentences[index].trim());

    if (l === "hi") {
      utterance.voice = hindiVoice || indianVoice || null;
      utterance.lang = hindiVoice ? "hi-IN" : "en-IN";
    } else {
      utterance.voice = ariaVoice || null;
      utterance.lang = "en-US";
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.onend = () => {
      index++;
      speakNext();
    };
    window.speechSynthesis.speak(utterance);
  };

  speakNext();
};

  // Called when user taps the screen
  const handleStart = () => {
    const greetMap = {
      morning: "Good Morning",
      afternoon: "Good Afternoon",
      evening: "Good Evening",
    };
    const greet = `${greetMap[time]}! Welcome to Our Restaurant, Table ${tableNo}. I am Aria, your AI waiter. Which language do you prefer — English or Hindi?`;
    setAriaText(greet);
    setStatus("talking");

    // Wait for voices to load on mobile
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        setTimeout(trySpeak, 200);
        return;
      }
      speak(greet, "en", () => setStatus("buttons"));
    };
    trySpeak();
  };

  const handleLangSelect = (l) => {
    setLang(l);
    setStatus("confirmed");

    if (l === "hi") {
      const text = `बढ़िया! हमारे रेस्टोरेंट में आपका स्वागत है, टेबल ${tableNo}। मैं Aria हूं, आज आपकी AI वेटर। आइए मेनू देखें!`;
      setAriaText(text);
      speak(text, "hi", () => navigate(`/menu/${tableNo}`));
    } else {
      const text = `Great! Welcome to Our Restaurant, Table ${tableNo}. I am Aria, your AI waiter today. Let us explore the menu!`;
      setAriaText(text);
      speak(text, "en", () => navigate(`/menu/${tableNo}`));
    }
  };

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
        position: "absolute", width: 500, height: 500,
        borderRadius: "50%", background: "#FF6B35",
        left: -150, top: -150,
        filter: "blur(140px)", opacity: 0.1,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 400, height: 400,
        borderRadius: "50%", background: "#9B59B6",
        right: -100, bottom: -100,
        filter: "blur(120px)", opacity: 0.08,
        pointerEvents: "none",
      }} />

      {/* Restaurant name */}
      <div style={{
        position: "absolute", top: 32,
        left: 0, right: 0, textAlign: "center",
      }}>
        <div style={{
          fontSize: 11, letterSpacing: 4,
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
        }}>
          Our Restaurant · Table {tableNo}
        </div>
      </div>

      {/* Aria Avatar */}
      <div style={{
        width: 110, height: 110, borderRadius: "50%",
        background: "linear-gradient(135deg, #FF6B35, #FF8E53)",
        display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 52,
        marginBottom: 28,
        boxShadow: status === "talking"
          ? "0 0 0 16px rgba(255,107,53,0.15), 0 0 0 32px rgba(255,107,53,0.07)"
          : "0 8px 40px rgba(255,107,53,0.35)",
        transition: "box-shadow 0.4s",
      }}>
        🤖
      </div>

      {/* Aria name */}
      <div style={{
        fontSize: 13, letterSpacing: 3,
        color: "#FF6B35", textTransform: "uppercase",
        fontWeight: 700, marginBottom: 8,
      }}>
        Aria · AI Waiter
      </div>

      {/* Welcome screen — tap to start */}
      {status === "welcome" && (
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 20,
        }}>
          <p style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 15, textAlign: "center", lineHeight: 1.7,
          }}>
            Tap below to meet Aria,<br />your AI waiter 👋
          </p>
          <button
            onClick={handleStart}
            style={{
              background: "linear-gradient(135deg, #FF6B35, #FF8E53)",
              border: "none", color: "#fff",
              borderRadius: 20, padding: "18px 40px",
              fontWeight: 800, fontSize: 17,
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(255,107,53,0.45)",
            }}
          >
            👋 Say Hello to Aria
          </button>
        </div>
      )}

      {/* Talking state */}
      {status === "talking" && (
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 16,
        }}>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, padding: "16px 20px",
            maxWidth: 320, textAlign: "center",
            color: "rgba(255,255,255,0.85)",
            fontSize: 15, lineHeight: 1.7,
          }}>
            {ariaText}
          </div>
          <div style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: 13,
          }}>
            Aria is speaking{dots}
          </div>
        </div>
      )}

      {/* Language buttons */}
      {(status === "buttons" || status === "confirmed") && (
        <div style={{
          display: "flex", flexDirection: "column",
          gap: 14, width: "100%", maxWidth: 320,
        }}>
          {/* Aria speech bubble */}
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, padding: "14px 18px",
            textAlign: "center",
            color: "rgba(255,255,255,0.8)",
            fontSize: 14, lineHeight: 1.7,
            marginBottom: 8,
          }}>
            {ariaText || "Which language do you prefer?"}
          </div>

          {[
            { code: "en", label: "🇬🇧 English", sub: "Continue in English" },
            { code: "hi", label: "🇮🇳 हिंदी", sub: "हिंदी में जारी रखें" },
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => handleLangSelect(l.code)}
              disabled={status === "confirmed"}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16, padding: "16px 24px",
                color: "#fff", fontSize: 17,
                fontWeight: 700, cursor: "pointer",
                textAlign: "left",
                opacity: status === "confirmed" ? 0.5 : 1,
              }}
            >
              {l.label}
              <div style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                fontWeight: 400, marginTop: 3,
              }}>
                {l.sub}
              </div>
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
      `}</style>

    </div>
  );
}