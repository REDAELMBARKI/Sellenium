import { useState } from "react";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import StoreConfigProvider from "@/contextProvoders/StoreConfigProvider";
import { Order, ShippingZone, TrackOrderProps } from "@/types/orders/trackordertypes";
import { ThemePalette } from "@/types/ThemeTypes";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
  "  " +
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const fmtDateLong = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

const toNum = (v: unknown) => Number(v) || 0;

const stringToColor = (str: string) => {
  const palette = ["#5B8DEF","#8B5CF6","#EC4899","#F59E0B","#10B981","#06B6D4","#EF4444","#6366F1"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
};

const STATUS_COLOR: Record<string, string> = {
  pending:          "#E8A838",
  confirmed:        "#4C9EE8",
  out_for_delivery: "#A878E8",
  delivered:        "#4CAF7D",
  canceled:         "#E85C5C",
  returned:         "#E85C5C",
  delivery_failed:  "#E85C5C",
};

const TIMELINE_STEPS = [
  { status: "pending",          label: "Placed"     },
  { status: "confirmed",        label: "Confirmed"  },
  { status: "out_for_delivery", label: "On the Way" },
  { status: "delivered",        label: "Delivered"  },
];

// ─────────────────────────────────────────────────────────────
// ROOT EXPORTS
// ─────────────────────────────────────────────────────────────
export default function OrderTrackMaster({ order, shipping }: TrackOrderProps) {
  return (
    <StoreConfigProvider>
      <OrderTrack order={order} shipping={shipping} />
    </StoreConfigProvider>
  );
}
// ─────────────────────────────────────────────────────────────
// SHARED TINY COMPONENTS
// ─────────────────────────────────────────────────────────────
export function Avatar({ src, name, size = 48 }: { src: string | null; name: string; size?: number }) {
  const [broken, setBroken] = useState(false);
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
  const bg = stringToColor(name);
  if (src && !broken) {
    return (
      <img src={src} alt={name} onError={() => setBroken(true)}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: bg, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 700, flexShrink: 0, userSelect: "none",
    }}>
      {initials}
    </div>
  );
}

export function ItemThumb({ src, name }: { src: string | null; name: string }) {
  const [broken, setBroken] = useState(false);
  const bg = stringToColor(name);
  if (src && !broken) {
    return (
      <img src={src} alt={name} onError={() => setBroken(true)}
        style={{ width: 40, height: 40, borderRadius: "10px", objectFit: "cover", flexShrink: 0 }} />
    );
  }
  return (
    <div style={{
      width: 40, height: 40, borderRadius: "10px", flexShrink: 0,
      background: `${bg}20`, border: `1px solid ${bg}35`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 14, fontWeight: 700, color: bg,
    }}>
      {name.trim()[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CUSTOMER CARD
// ─────────────────────────────────────────────────────────────
export function CustomerCard({ order, theme }: { order: Order; theme: ThemePalette }) {
  const [expanded, setExpanded] = useState(false);
  const customerName = `${order.address.first_name} ${order.address.last_name}`;

  const lbl: React.CSSProperties = { fontSize: "10px", fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "3px" };
  const val: React.CSSProperties = { fontSize: "13px", color: theme.text, lineHeight: 1.55 };
  const divider: React.CSSProperties = { height: "1px", background: theme.border, margin: "12px 0" };

  return (
    <div>
      {/* Avatar + name + phone */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
        <Avatar src={order.customer_avatar} name={customerName} size={46} />
        <div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: theme.text }}>{customerName}</div>
          {order.address.phone && (
            <div style={{ fontSize: "12px", color: theme.link, marginTop: "2px" }}>{order.address.phone}</div>
          )}
        </div>
      </div>

      {/* Address — always visible */}
      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
        <span style={{ fontSize: "14px", marginTop: "1px", flexShrink: 0 }}>📍</span>
        <div style={{ fontSize: "12px", color: theme.textSecondary, lineHeight: 1.65 }}>
          {order.address.address_line1}
          {order.address.address_line2 ? `, ${order.address.address_line2}` : ""}
          <br />
          {order.address.city}{order.address.state ? `, ${order.address.state}` : ""}, {order.address.postal_code}
          <br />
          {order.address.country}
        </div>
      </div>

      {/* Expandable extras */}
      {expanded && (
        <div>
          <div style={divider} />
          {order.address.email && (
            <div style={{ marginBottom: "10px" }}>
              <div style={lbl}>Email</div>
              <div style={{ ...val, color: theme.link }}>{order.address.email}</div>
            </div>
          )}
          {order.address.company && (
            <div>
              <div style={lbl}>Company</div>
              <div style={val}>{order.address.company}</div>
            </div>
          )}
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          marginTop: "10px", background: "none", border: "none", cursor: "pointer",
          fontSize: "11px", fontWeight: 600, color: theme.primary,
          display: "flex", alignItems: "center", gap: "3px", padding: 0, opacity: 0.85,
        }}
      >
        {expanded ? "▲ Show less" : "▼ Show more"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ORDER SUMMARY CARD
// ─────────────────────────────────────────────────────────────
export function OrderSummaryCard({ order, shipping, theme }: { order: Order; shipping: ShippingZone; theme: ThemePalette }) {
  const totalQty = order.items.reduce((a, i) => a + toNum(i.quantity), 0);
  const subtotal = order.items.reduce((a, i) => a + toNum(i.subtotal), 0);

  const rows = [
    { label: `Subtotal · ${totalQty} item${totalQty !== 1 ? "s" : ""}`, value: `${subtotal} ${order.currency}`, color: theme.text },
    order.discount_amount && toNum(order.discount_amount) > 0
      ? { label: `Discount (${order.coupon?.code ?? "coupon"})`, value: `−${toNum(order.discount_amount)} ${order.currency}`, color: theme.success }
      : null,
    { label: `Shipping · ${shipping.name}`, value: !toNum(order.shipping_cost) ? "Free" : `${order.shipping_cost} ${order.currency}`, color: theme.text },
    toNum(order.tax) > 0
      ? { label: "Tax", value: `${order.tax} ${order.currency}`, color: theme.text }
      : null,
  ].filter(Boolean) as { label: string; value: string; color: string }[];

  return (
    <div>
      {rows.map((row, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: "13px" }}>
          <span style={{ color: theme.textSecondary }}>{row.label}</span>
          <span style={{ fontWeight: 500, color: row.color }}>{row.value}</span>
        </div>
      ))}

      <div style={{ height: "1px", background: theme.border, margin: "12px 0 10px" }} />

      {/* Total */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: 700 }}>
        <span style={{ color: theme.text }}>Total</span>
        <span style={{ color: theme.primary }}>{order.total_amount} {order.currency}</span>
      </div>

      <div style={{ height: "1px", background: theme.border, margin: "12px 0 10px" }} />

      {/* Payment method — moved here from customer card */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: theme.textSecondary }}>Payment</span>
        <span style={{
          fontSize: "11px", fontWeight: 600, color: theme.textMuted,
          background: theme.badge, border: `1px solid ${theme.border}`,
          padding: "3px 10px", borderRadius: "999px",
        }}>
          {order.payment_method === "cod" ? "Cash on Delivery" : order.payment_method.toUpperCase()}
        </span>
      </div>

      {/* Notes */}
      {order.notes && (
        <>
          <div style={{ height: "1px", background: theme.border, margin: "12px 0 8px" }} />
          <div style={{ fontSize: "10px", fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "4px" }}>Notes</div>
          <div style={{ fontSize: "12px", color: theme.textMuted, fontStyle: "italic", lineHeight: 1.5 }}>{order.notes}</div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ITEMS TABLE
// ─────────────────────────────────────────────────────────────
export function OrderItemsTable({ order, theme }: { order: Order; theme: ThemePalette }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {["", "Product", "Qty", "Unit Price", "Total"].map((h, i) => (
            <th key={i} style={{
              padding: "9px 14px", textAlign: i > 1 ? "right" : "left",
              fontSize: "10px", fontWeight: 600, color: theme.textMuted,
              textTransform: "uppercase", letterSpacing: "0.5px",
              borderBottom: `1px solid ${theme.border}`,
              width: i === 0 ? "52px" : undefined,
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {order.items.map((item, idx) => {
          const last = idx === order.items.length - 1;
          const td: React.CSSProperties = {
            padding: "12px 14px",
            borderBottom: last ? "none" : `1px solid ${theme.border}`,
            verticalAlign: "middle",
          };
          return (
            <tr key={item.id} className="tr-row">
              <td style={{ ...td, width: "52px" }}>
                <ItemThumb src={item.thumbnail} name={item.product_name} />
              </td>
              <td style={td}>
                <div style={{ fontSize: "13px", fontWeight: 500, color: theme.text }}>{item.product_name}</div>
                <div style={{ fontSize: "11px", color: theme.textMuted, marginTop: "2px" }}>ID #{item.id}</div>
              </td>
              <td style={{ ...td, textAlign: "right", color: theme.textSecondary, fontWeight: 500 }}>×{toNum(item.quantity)}</td>
              <td style={{ ...td, textAlign: "right", color: theme.textSecondary }}>{toNum(item.price_snapshot)} {order.currency}</td>
              <td style={{ ...td, textAlign: "right", fontWeight: 700, color: theme.text }}>{toNum(item.subtotal)} {order.currency}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─────────────────────────────────────────────────────────────
// TIMELINE + MAP (right panel)
// ─────────────────────────────────────────────────────────────
export function TrackingPanel({ order, shipping, theme }: { order: Order; shipping: ShippingZone; theme: ThemePalette }) {
  const statusColor = STATUS_COLOR[order.status] ?? theme.primary;
  const activeIdx   = TIMELINE_STEPS.findIndex(s => s.status === order.status);
  const progressPct = activeIdx <= 0 ? 0 : (activeIdx / (TIMELINE_STEPS.length - 1)) * 100;
  const estimatedBy = (() => {
    if (!shipping.estimated_days) return null;
    const d = new Date(order.created_at);
    d.setDate(d.getDate() + shipping.estimated_days);
    return fmtDateLong(d.toISOString());
  })();

  return (
    <div>
      {/* Banner */}
      <div style={{
        display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px",
        background: `linear-gradient(135deg, ${theme.primary}12, ${theme.accent}08)`,
        borderBottom: `1px solid ${theme.border}`,
      }}>
        <div style={{
          fontSize: "22px", width: "44px", height: "44px",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${theme.primary}18`, borderRadius: "12px", flexShrink: 0,
        }}>📦</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: theme.text, marginBottom: "2px" }}>
            Delivery within {shipping.estimated_days} day{shipping.estimated_days !== 1 ? "s" : ""}
          </div>
          {estimatedBy && (
            <div style={{ fontSize: "11px", color: theme.textMuted }}>Expected by {estimatedBy}</div>
          )}
        </div>
        <span style={{
          fontSize: "9px", fontWeight: 700, color: theme.success,
          background: `${theme.success}18`, border: `1px solid ${theme.success}30`,
          padding: "3px 8px", borderRadius: "999px", letterSpacing: "0.5px",
          display: "flex", alignItems: "center", gap: "4px",
        }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: theme.success }} />
          LIVE
        </span>
      </div>

      {/* Horizontal timeline */}
      <div style={{ padding: "20px 24px 18px", borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ position: "relative", display: "flex" }}>
          {/* Track bg */}
          <div style={{
            position: "absolute", top: "10px",
            left: `calc(100% / ${TIMELINE_STEPS.length * 2})`,
            right: `calc(100% / ${TIMELINE_STEPS.length * 2})`,
            height: "2px", background: theme.border, borderRadius: "99px", zIndex: 0,
          }} />
          {/* Track fill */}
          <div style={{
            position: "absolute", top: "10px",
            left: `calc(100% / ${TIMELINE_STEPS.length * 2})`,
            width: `calc(${progressPct}% * (1 - 1/${TIMELINE_STEPS.length}))`,
            height: "2px",
            background: `linear-gradient(90deg, ${theme.success}, ${statusColor})`,
            borderRadius: "99px", zIndex: 1,
          }} />
          {TIMELINE_STEPS.map((step, idx) => {
            const done   = idx <= activeIdx;
            const active = idx === activeIdx;
            const dot    = active ? statusColor : done ? theme.success : theme.border;
            return (
              <div key={step.status} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? dot : theme.card,
                  border: `2px solid ${dot}`, color: "#fff",
                  fontSize: "9px", fontWeight: 800,
                  boxShadow: active ? `0 0 0 4px ${dot}28` : "none",
                }}>
                  {done ? "✓" : ""}
                </div>
                <div style={{
                  marginTop: "7px", fontSize: "10px",
                  fontWeight: done ? 600 : 500,
                  color: done ? theme.text : theme.textMuted,
                  textAlign: "center",
                }}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="map-bg" style={{ height: "300px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "10px" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }} viewBox="0 0 400 300" preserveAspectRatio="none">
          <path d="M60,260 C120,190 180,220 200,150 C220,80 300,95 340,50"
            stroke={theme.primary} strokeWidth="3" fill="none" strokeDasharray="6,4" />
        </svg>
        <div style={{
          width: "40px", height: "40px",
          borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)",
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 6px 20px ${theme.primary}45`,
        }}>
          <span style={{ transform: "rotate(45deg)", fontSize: "15px" }}>📍</span>
        </div>
        <div style={{
          background: theme.card, border: `1px solid ${theme.border}`,
          borderRadius: "12px", padding: "8px 14px", textAlign: "center",
          boxShadow: theme.shadowMd,
        }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: theme.text, marginBottom: "2px" }}>Live Tracking</div>
          <div style={{ fontSize: "10px", color: theme.textMuted }}>Google Maps coming soon</div>
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "40px",
          background: `linear-gradient(to top, ${theme.card}cc, transparent)`,
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SHIPPING ZONE CARD
// ─────────────────────────────────────────────────────────────
export function ShippingZoneCard({ order, shipping, theme }: { order: Order; shipping: ShippingZone; theme: ThemePalette }) {
  const estimatedBy = (() => {
    if (!shipping.estimated_days) return null;
    const d = new Date(order.created_at);
    d.setDate(d.getDate() + shipping.estimated_days);
    return fmtDateLong(d.toISOString());
  })();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div>
          <div style={{ fontSize: "10px", fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "3px" }}>Zone</div>
          <div style={{ fontSize: "13px", color: theme.text }}>{shipping.name}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "3px" }}>Cost</div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: theme.primary }}>
            {!toNum(order.shipping_cost) ? "Free" : `${order.shipping_cost} ${order.currency}`}
          </div>
        </div>
      </div>
      {shipping.estimated_days && (
        <div style={{
          background: `${theme.primary}0d`, border: `1px solid ${theme.primary}20`,
          borderRadius: "10px", padding: "8px 12px", fontSize: "12px", color: theme.textSecondary,
        }}>
          🕐 Estimated: <strong style={{ color: theme.text }}>{shipping.estimated_days} day{shipping.estimated_days !== 1 ? "s" : ""}</strong>
          {estimatedBy && <span style={{ color: theme.textMuted }}> · by {estimatedBy}</span>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE HEADER
// ─────────────────────────────────────────────────────────────
export function OrderHeader({ order, theme }: { order: Order; theme: ThemePalette }) {
  const statusColor = STATUS_COLOR[order.status] ?? theme.primary;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px", flexWrap: "wrap", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", fontWeight: 500 }}>
          ← Orders
        </button>
        <span style={{ color: theme.border }}>|</span>
        <div>
          <span style={{ fontSize: "18px", fontWeight: 700, color: theme.text }}>{order.order_number}</span>
          <span style={{ marginLeft: "10px", fontSize: "11px", color: theme.textMuted }}>{fmt(order.created_at)}</span>
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          fontSize: "11px", fontWeight: 600, color: statusColor,
          background: `${statusColor}18`, border: `1px solid ${statusColor}30`,
          padding: "4px 11px", borderRadius: "999px", textTransform: "capitalize",
        }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: statusColor }} />
          {order.status.replace(/_/g, " ")}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button className="icon-btn" style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "6px 10px", cursor: "pointer", color: theme.textMuted, fontSize: "14px" }}>
          ⋯
        </button>
        <button className="btn-primary" style={{ background: theme.primary, color: theme.textInverse, border: "none", borderRadius: "10px", padding: "7px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
          ↓ Invoice
        </button>
      </div>
    </div>
  );
}



function OrderTrack({ order, shipping }: TrackOrderProps) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const isFailed = ["canceled", "returned", "delivery_failed"].includes(order.status);
  const statusColor = STATUS_COLOR[order.status] ?? theme.primary;

  const card: React.CSSProperties = {
    background: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: theme.shadow,
  };

  const cardHead: React.CSSProperties = {
    padding: "12px 18px",
    fontSize: "11px", fontWeight: 700, color: theme.textMuted,
    borderBottom: `1px solid ${theme.border}`,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    textTransform: "uppercase", letterSpacing: "0.6px",
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.text, fontFamily: "'DM Sans','Segoe UI',sans-serif", fontSize: "14px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .btn-primary:hover { opacity: 0.87; }
        .icon-btn:hover    { background: ${theme.bgSecondary} !important; }
        .tr-row:hover td   { background: ${theme.bgSecondary} !important; }
        .map-bg {
          background:
            repeating-linear-gradient(0deg,  transparent, transparent 30px, ${theme.border}40 30px, ${theme.border}40 31px),
            repeating-linear-gradient(90deg, transparent, transparent 30px, ${theme.border}40 30px, ${theme.border}40 31px),
            ${theme.bgSecondary};
        }
      `}</style>

      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "28px 24px" }}>
        {/*  login warning id guest */}
        <div>
             {!order.user_id && (
                  <div style={{
                    background: `${theme.warning}15`,
                    border: `1px solid ${theme.warning}40`,
                    borderRadius: "14px",
                    padding: "14px 18px",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}>
                    <span style={{ fontSize: "20px" }}>⚠️</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: theme.text, marginBottom: "3px" }}>
                        Save this page or you'll lose access
                      </div>
                      <div style={{ fontSize: "12px", color: theme.textMuted }}>
                        You're tracking as a guest. If you close this tab, 
                        you can recover your order using your phone number.
                      </div>
                    </div>
                    <a href="/register" style={{
                      fontSize: "12px", fontWeight: 600,
                      background: theme.primary, color: theme.textInverse,
                      padding: "6px 14px", borderRadius: "999px",
                      textDecoration: "none", whiteSpace: "nowrap",
                    }}>
                      Create account
                    </a>
                  </div>
                )}
        </div>
        {/* Header */}
        <OrderHeader order={order} theme={theme} />

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "18px", alignItems: "start" }}>

          {/* ── LEFT ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Row 1: Customer + Summary side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={card}>
                <div style={cardHead}>Customer</div>
                <div style={{ padding: "16px 18px" }}>
                  <CustomerCard order={order} theme={theme} />
                </div>
              </div>

              <div style={card}>
                <div style={cardHead}>Order Summary</div>
                <div style={{ padding: "16px 18px" }}>
                  <OrderSummaryCard order={order} shipping={shipping} theme={theme} />
                </div>
              </div>
            </div>

            {/* Row 2: Items table */}
            <div style={card}>
              <div style={cardHead}>Order Items</div>
              <OrderItemsTable order={order} theme={theme} />
            </div>
          </div>

          {/* ── RIGHT (sticky) ── */}
          <div style={{ position: "sticky", top: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Tracking card */}
            {!isFailed ? (
              <div style={card}>
                <TrackingPanel order={order} shipping={shipping} theme={theme} />
              </div>
            ) : (
              <div style={{ ...card, padding: "28px 20px", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "10px" }}>⚠️</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: statusColor, marginBottom: "6px" }}>
                  Order {order.status.replace(/_/g, " ")}
                </div>
                <div style={{ fontSize: "12px", color: theme.textMuted }}>
                  Contact support for assistance.
                </div>
              </div>
            )}

            {/* Shipping zone */}
            <div style={card}>
              <div style={cardHead}>Shipping Zone</div>
              <div style={{ padding: "16px 18px" }}>
                <ShippingZoneCard order={order} shipping={shipping} theme={theme} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}