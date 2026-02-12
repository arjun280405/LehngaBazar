import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import intentsData from "../data/botIntents.json";
import lehngaData from "../data/lehngaDataset.json";
import lehngaMehndi from "../data/lehngaMehndi.json";
import lehngaHaldi from "../data/lehngaHaldi.json";

export default function SoniAssistant() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi — I'm your Assistant Vadhu. Say 'vadhu' to wake me, or type a request. Ask about lehengas or say 'help' for examples.",
    },
  ]);
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const listenModeRef = useRef("off");
  const openRef = useRef(false);
  const wakeRegex = /\bvadhu\b/i;

  const startRecognition = () => {
    const r = recognitionRef.current;
    if (!r) return;
    try {
      r.start();
      setListening(true);
    } catch (err) {
      // ignore start errors
    }
  };

  const stopRecognition = () => {
    const r = recognitionRef.current;
    if (!r) return;
    try {
      r.stop();
    } catch (err) {
      // ignore stop errors
    }
    setListening(false);
  };

  useEffect(() => {
    // Setup SpeechRecognition if available
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const r = new SpeechRecognition();
      r.lang = "en-US";
      r.interimResults = false;
      r.maxAlternatives = 1;
      r.onresult = (e) => {
        const transcript = (e.results[0][0].transcript || "").trim();
        if (!transcript) return;

        if (listenModeRef.current === "wake") {
          if (!wakeRegex.test(transcript)) return;
          const cleaned = transcript.replace(wakeRegex, "").trim();
          setOpen(true);
          listenModeRef.current = "command";
          if (cleaned) {
            handleSend(cleaned);
          } else {
            pushMessage({
              from: "bot",
              text: "Yes? Tell me what you want to see.",
            });
          }
          return;
        }

        const cleaned = transcript.replace(wakeRegex, "").trim();
        if (!cleaned) return;
        setValue(cleaned);
        handleSend(cleaned);
      };
      // On end, restart in wake mode or while panel is open
      r.onend = () => {
        setListening(false);
        if (
          listenModeRef.current === "wake" ||
          (listenModeRef.current === "command" && openRef.current)
        ) {
          startRecognition();
        }
      };
      recognitionRef.current = r;
    }
  }, []);

  // Start / stop recognition when assistant opens/closes
  useEffect(() => {
    const r = recognitionRef.current;
    if (!r) return;
    openRef.current = open;
    if (open) {
      listenModeRef.current = "command";
      startRecognition();
    } else {
      listenModeRef.current = "wake";
      startRecognition();
    }
  }, [open]);

  const pushMessage = (m) => setMessages((s) => [...s, m]);
  // Messages container ref for auto-scroll
  const messagesContainerRef = useRef(null);
  // Auto-scroll to the bottom whenever messages change or the panel opens
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    // small timeout ensures images/layout have settled
    const t = setTimeout(() => {
      try {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      } catch (err) {
        el.scrollTop = el.scrollHeight;
      }
    }, 50);
    return () => clearTimeout(t);
  }, [messages, open]);
  // Attempt to load custom assistant image (place file in src/assets/soni_assistant.png or assistant_logo.png)
  const assistantImg = (() => {
    try {
      return new URL("../assets/icons/BotImage.png", import.meta.url).href;
    } catch (err) {
      try {
        return new URL("../assets/icons/BotImage.png", import.meta.url).href;
      } catch (e) {
        return null;
      }
    }
  })();

  const normalizeInput = (text) => text.toLowerCase().trim();

  const getRouteFromText = (text) => {
    const t = normalizeInput(text);
    const isNav = /\b(go to|open|show|take me|navigate|visit)\b/.test(t);
    const isAdmin = /\badmin\b/.test(t);
    const wantsOrders =
      /\b(my orders|my order|order history|purchase history)\b/.test(t);
    if (/\bhaldi\b/.test(t)) return "/occasion/haldi";
    if (/\bmehndi\b/.test(t)) return "/occasion/mehndi";
    if (/\b(bridal|wedding)\b/.test(t)) return "/occasion/wedding";
    if (/\breception\b/.test(t)) return "/occasion/reception";
    if (isAdmin && /\b(login|log in|sign in|panel|admin panel)\b/.test(t))
      return "/admin/login";
    if (isAdmin && /\b(dashboard|admin home|admin main)\b/.test(t))
      return "/admin/dashboard";
    if (isAdmin && /\b(add product|new product|create product)\b/.test(t))
      return "/admin/products/add";
    if (isAdmin && /\b(products|product list|inventory)\b/.test(t))
      return "/admin/products";
    if (isAdmin && /\b(orders|order list)\b/.test(t)) return "/admin/orders";
    if (isAdmin && /\b(create owner|add owner|new owner)\b/.test(t))
      return "/admin/owners/create";
    if (isNav && /\b(explore|shop|catalog|products|all products)\b/.test(t))
      return "/explore";
    if (isNav && /\b(try\s*on|tryon|virtual)\b/.test(t)) return "/tryon";
    if (isNav && /\b(wishlist|saved|favorites)\b/.test(t)) return "/wishlist";
    if ((isNav && /\borders\b/.test(t)) || wantsOrders) return "/my-orders";
    if (isNav && /\b(login|log in|sign in)\b/.test(t)) return "/login";
    if (isNav && /\b(sign up|signup|register|create account)\b/.test(t))
      return "/signup";
    if (isNav && /\b(home|main page|homepage)\b/.test(t)) return "/";
    if (isNav && /\b(cart|bag|basket)\b/.test(t)) return "/cart";
    if (/\b(cart|bag|basket)\b/.test(t)) return "/cart";
    if (/\b(wishlist|saved|favorites)\b/.test(t)) return "/wishlist";
    if (wantsOrders) return "/my-orders";
    return null;
  };

  const formatPrice = (value, currency) => {
    if (value === undefined || value === null || value === "") return "";
    if (typeof value === "number") {
      return currency === "USD" ? `$${value}` : `₹${value}`;
    }
    return value;
  };

  const normalizeCatalogItem = (item) => ({
    id: item.id || item._id,
    product_title: item.product_title || item.name || "",
    brand: item.brand || "Lehenga Bazar",
    price: formatPrice(item.price, item.currency),
    image_url: item.image_url || item.imageUrl || "",
    description: item.description || "",
  });

  const catalog = [
    ...lehngaData.map(normalizeCatalogItem),
    ...lehngaHaldi.map(normalizeCatalogItem),
    ...lehngaMehndi.map(normalizeCatalogItem),
  ];

  const findIntent = (text) => {
    const normalized = text.toLowerCase();
    const directRoute = getRouteFromText(text);
    if (directRoute) {
      return {
        tag: "navigate_any",
        action: "navigate",
        route: directRoute,
        responses: ["Opening that page for you."],
      };
    }
    // exact pattern / keyword matching
    for (const it of intentsData.intents) {
      for (const p of it.patterns) {
        const pattern = p.replace(/\*/g, "");
        if (normalized.includes(pattern)) return it;
      }
    }
    // fallback to simple searches: price, id, color, design
    if (/under|below|less than|<\s*\d+/i.test(text))
      return { tag: "price_search", action: "price_search" };
    if (/lh\d+/i.test(text)) return { tag: "id_search", action: "id_search" };
    if (/go to|open|show.*cart|main page|home/i.test(text)) {
      const navIntent =
        intentsData.intents.find(
          (i) => i.tag === "navigate_cart" && /cart/i.test(text),
        ) ||
        intentsData.intents.find(
          (i) => i.tag === "navigate_home" && /home|main/i.test(text),
        );
      if (navIntent) return navIntent;
    }
    return intentsData.intents.find((i) => i.tag === "fallback");
  };

  const handleActions = (intent, text) => {
    if (!intent) return;
    // Navigation
    if (intent.action === "navigate" && intent.route) {
      pushMessage({ from: "bot", text: intent.responses[0] });
      setTimeout(() => navigate(intent.route), 400);
      return;
    }

    if (intent.action === "search" || intent.action === "price_search") {
      // simple keyword search: look for numbers or keywords
      const q = text.toLowerCase();
      const priceMatch = q.match(/(under|below|less than)\s*(\d+)/i);
      let results = [];
      const isFancy = /\bfancy\b/.test(q);
      const fancyKeywords = [
        "bridal",
        "premium",
        "velvet",
        "silk",
        "zari",
        "luxury",
        "royal",
        "regal",
        "embroidered",
        "designer",
      ];
      const toText = (item) =>
        `${item.product_title} ${item.brand} ${item.description}`
          .toLowerCase()
          .trim();

      if (priceMatch) {
        const price = parseInt(priceMatch[2], 10);
        results = catalog.filter((p) => {
          const v = p.price ? p.price.replace(/[^0-9]/g, "") : "";
          return v && parseInt(v, 10) <= price;
        });
        if (!results.length)
          pushMessage({ from: "bot", text: `No items found under ₹${price}.` });
        else
          pushMessage({
            from: "bot",
            text: `Found ${results.length} items under ₹${price}. Showing top 3:`,
          });
      } else if (/lh\d+/i.test(q)) {
        const id = q.match(/(lh\d+)/i)[1];
        const item = catalog.find(
          (p) => p.id && p.id.toLowerCase() === id.toLowerCase(),
        );
        if (item) {
          pushMessage({
            from: "bot",
            text: `Found ${item.product_title}. Opening product page...`,
          });
          setTimeout(
            () => navigate(`/product/${item.id}`, { state: item }),
            400,
          );
          return;
        } else
          pushMessage({ from: "bot", text: `No product found with id ${id}.` });
      } else if (isFancy) {
        results = catalog.filter((p) => {
          const price = p.price ? p.price.replace(/[^0-9]/g, "") : "";
          const priceValue = price ? parseInt(price, 10) : null;
          const haystack = toText(p);
          return (
            fancyKeywords.some((k) => haystack.includes(k)) ||
            (priceValue !== null && priceValue >= 15000)
          );
        });
        if (!results.length)
          pushMessage({
            from: "bot",
            text: "No fancy items found. Try a specific color or price range.",
          });
        else
          pushMessage({
            from: "bot",
            text: `Found ${results.length} fancy items. Showing top 3:`,
          });
      } else {
        // keyword search by color/brand/title
        const tokens = q.split(/\s+/).filter(Boolean);
        results = catalog.filter((p) => {
          const haystack = toText(p);
          return tokens.some((t) => haystack.includes(t));
        });
        if (!results.length)
          pushMessage({
            from: "bot",
            text: `No matching items found for "${text}".`,
          });
        else
          pushMessage({
            from: "bot",
            text: `Found ${results.length} matching items. Showing top 3:`,
          });
      }

      // show up to 3 product cards as messages
      const top = results.slice(0, 3);
      top.forEach((it) => pushMessage({ from: "bot", product: it }));

      const shouldOpenExplore =
        isFancy || /\b(show|list|explore|browse)\b/.test(q);
      if (results.length && shouldOpenExplore) {
        pushMessage({
          from: "bot",
          text: "Opening the full list in Explore.",
        });
        setTimeout(
          () => navigate("/explore", { state: { searchQuery: text } }),
          500,
        );
      }
      return;
    }

    // default response
    pushMessage({
      from: "bot",
      text: intent.responses[
        Math.floor(Math.random() * intent.responses.length)
      ],
    });
  };

  const handleSend = (textRaw) => {
    const text = (textRaw || value || "").trim();
    if (!text) return;
    pushMessage({ from: "user", text });
    setValue("");

    const intent = findIntent(text);
    handleActions(intent, text);
  };

  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/64x88?text=Lehenga";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    const normalized = imageUrl.startsWith("/Frontend/src/")
      ? imageUrl.replace("/Frontend/src/", "../")
      : imageUrl;
    try {
      return new URL(normalized.trim(), import.meta.url).href;
    } catch (err) {
      return "https://via.placeholder.com/64x88?text=Lehenga";
    }
  };

  return (
    <div className="soni-wrap">
      <style>{`
        @keyframes soniFloat { 0% { transform: translateY(0) } 50% { transform: translateY(-12px) } 100% { transform: translateY(0) } }
        .soni-wrap { position: fixed; right: 18px; bottom: 18px; z-index: 9999; }
        .soni-button { width:98px; height:98px; border-radius:50%; overflow:hidden; cursor:pointer; box-shadow:0 14px 34px rgba(0,0,0,0.22); background:#fff; display:flex; align-items:center; justify-content:center; animation: soniFloat 3.8s ease-in-out infinite; }
        .soni-button img{ width:100%; height:100%; object-fit:cover; display:block }
        .soni-panel { position:absolute; right:0; bottom:90px; width:360px; max-height:520px; box-shadow:0 10px 40px rgba(0,0,0,0.12); border-radius:12px; overflow:hidden; background:#fff; transform-origin:left bottom }
        .soni-messages { height: 380px; }
        .soni-input { font-size: 0.95rem; }
        .soni-send { font-size: 0.9rem; }

        @media (max-width: 640px) {
          .soni-wrap { right: 12px; left: 12px; bottom: 12px; }
          .soni-button { width:64px; height:64px; }
          .soni-panel { position: fixed; left: 12px; right: 12px; bottom: 90px; width: auto; max-height: calc(100vh - 140px); }
          .soni-messages { height: calc(100vh - 290px); }
          .soni-input { font-size: 0.85rem; padding: 8px; }
          .soni-send { font-size: 0.85rem; padding: 8px 10px; }
        }
      `}</style>

      <div
        className="soni-panel"
        style={{
          transform: open
            ? "translateX(0) scale(1)"
            : "translateX(-6px) scale(.98)",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transition:
            "transform .28s cubic-bezier(.2,.9,.2,1), opacity .28s, visibility .28s",
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden={!open}
      >
        <div
          style={{
            padding: "12px 16px",
            background: "#4A0E0E",
            color: "#fff",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>Soni Assistant</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              aria-hidden="true"
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                background: listening ? "#34D399" : "#8b8b8b",
                boxShadow: listening ? "0 0 8px rgba(52,211,153,0.6)" : "none",
                transition: "all .25s",
              }}
            />
          </div>
        </div>
        <div
          ref={messagesContainerRef}
          className="soni-messages"
          role="log"
          aria-live="polite"
          style={{
            padding: 12,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.from === "bot" ? "flex-start" : "flex-end",
                background: m.from === "bot" ? "#f9f9f9" : "#4A0E0E",
                color: m.from === "bot" ? "#000" : "#fff",
                padding: 10,
                borderRadius: 8,
                maxWidth: "85%",
              }}
            >
              {m.text && (
                <div style={{ marginBottom: m.product ? 8 : 0 }}>{m.text}</div>
              )}
              {m.product && (
                <div
                  style={{ display: "flex", gap: 8, cursor: "pointer" }}
                  onClick={() => {
                    navigate(`/product/${m.product.id}`, { state: m.product });
                  }}
                >
                  <img
                    src={resolveImageUrl(m.product.image_url)}
                    alt={m.product.product_title}
                    style={{
                      width: 64,
                      height: 88,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {m.product.product_title}
                    </div>
                    <div style={{ color: "#666" }}>{m.product.price}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: 12,
            borderTop: "1px solid #eee",
          }}
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me (e.g., fancy lehnga, haldi lehnga, go to cart)"
            className="soni-input"
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #eee",
            }}
          />
          <button
            onClick={() => handleSend()}
            className="soni-send"
            style={{
              background: "#4A0E0E",
              color: "#fff",
              border: "none",
              padding: "8px 10px",
              borderRadius: 8,
            }}
          >
            Send
          </button>
        </div>
      </div>

      <button
        onClick={() => setOpen((s) => !s)}
        className="soni-button"
        aria-label="Toggle Soni Assistant"
        style={{
          border: open
            ? "3px solid rgba(243,209,192,0.95)"
            : "3px solid transparent",
          transition: "all .18s",
        }}
      >
        {assistantImg ? (
          <img src={assistantImg} alt="Soni Assistant" />
        ) : (
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>
            {open ? "×" : "S"}
          </span>
        )}
      </button>
    </div>
  );
}
