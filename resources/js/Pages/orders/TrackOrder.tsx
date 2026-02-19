import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

// ── Helpers ────────────────────────────────────────────
const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
  "  " +
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const fmtDateLong = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

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
  { status: "pending",          label: "Order placed"      },
  { status: "confirmed",        label: "Order confirmed"   },
  { status: "out_for_delivery", label: "Out for delivery"  },
  { status: "delivered",        label: "Delivered"         },
];

// ── Mock order – swap with your Inertia page prop ─────
const mockOrder = {
  order_number: "ORD-20260219-00042",
  status: "out_for_delivery",
  created_at: "2026-02-17T14:32:00Z",
  payment_method: "cod",
  subtotal: 340.0,
  discount_amount: 34.0,
  shipping_cost: 25.0,
  tax: 0,
  total_amount: 331.0,
  coupon_code: "SAVE10",
  estimated_days: { min: 1, max: 3 },
  customer: {
    name: "Yassine Amrani",
    phone: "+212 6 12 34 56 78",
    email: "yassine@example.ma",
  },
  address: {
    street: "12 Rue Mohammed V",
    city: "Casablanca",
    region: "Casablanca-Settat",
    zip: "20000",
  },
  shipping_company: "Amana",
  tracking_number: "AMA-2026-88421",
  items: [
    { id: 1, name: "Djellaba Premium",    variant: "Size L / Beige",   quantity: 2, unit_price: 120, image: "https://placehold.co/44x44/C8A96E/1A1A2E?text=DJ" },
    { id: 2, name: "Babouche Artisanale", variant: "Size 42 / Brown",  quantity: 1, unit_price: 100, image: "https://placehold.co/44x44/A87040/0D0D1A?text=BB" },
  ],
  status_history: [
    { status: "pending",          at: "2026-02-17T14:32:00Z" },
    { status: "confirmed",        at: "2026-02-17T16:10:00Z" },
    { status: "out_for_delivery", at: "2026-02-19T08:45:00Z" },
  ],
};

// ── Component ──────────────────────────────────────────
interface Props {
  order?: typeof mockOrder;
}

export default function OrderDetail({ order = mockOrder }: Props) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();

  const statusColor  = STATUS_COLOR[order.status] ?? theme.primary;
  const activeIdx    = TIMELINE_STEPS.findIndex((s) => s.status === order.status);
  const totalQty     = order.items.reduce((a, i) => a + i.quantity, 0);
  const isFailed     = ["canceled", "returned", "delivery_failed"].includes(order.status);

  const estimatedBy = (() => {
    const d = new Date(order.created_at);
    d.setDate(d.getDate() + order.estimated_days.max);
    return fmtDateLong(d.toISOString());
  })();

  // ---- mini style helpers ----
  const card: React.CSSProperties = {
    background: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.borderRadius,
    marginBottom: "16px",
    overflow: "hidden",
  };
  const cardHead: React.CSSProperties = {
    padding: "13px 20px",
    fontSize: "13px", fontWeight: 600, color: theme.text,
    borderBottom: `1px solid ${theme.border}`,
    display: "flex", alignItems: "center", justifyContent: "space-between",
  };
  const cardBody: React.CSSProperties = { padding: "18px 20px" };
  const infoLabel: React.CSSProperties = {
    fontSize: "11px", fontWeight: 600, color: theme.textMuted,
    textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "3px",
  };
  const infoVal: React.CSSProperties = { fontSize: "13px", color: theme.text, lineHeight: "1.6" };
  const divider: React.CSSProperties = { height: "1px", background: theme.border, margin: "14px 0" };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.text, fontFamily: "'DM Sans','Segoe UI',sans-serif", fontSize: "14px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .btn-primary:hover  { opacity: 0.88; }
        .btn-secondary:hover{ border-color: ${theme.borderHover} !important; background: ${theme.secondaryHover} !important; }
        .icon-btn:hover     { background: ${theme.secondary} !important; }
        .tr-hover:hover td  { background: ${theme.bgSecondary} !important; }
        .back-btn:hover     { color: ${theme.text} !important; }
      `}</style>

      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "32px 20px" }}>

        {/* ── Back + heading ── */}
        <button className="back-btn" style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: "12px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
          ← Orders
        </button>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: theme.text, letterSpacing: "-0.3px", marginBottom: "3px" }}>
              {order.order_number}
            </h1>
            <div style={{ fontSize: "12px", color: theme.textMuted }}>
              {fmt(order.created_at)}
            </div>
          </div>

          {/* Action buttons + status */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            {/* Status badge */}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "12px", fontWeight: 600, color: statusColor,
              background: `${statusColor}18`, border: `1px solid ${statusColor}35`,
              padding: "5px 12px", borderRadius: "20px", textTransform: "capitalize",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: statusColor, display: "inline-block" }} />
              {order.status.replace(/_/g, " ")}
            </span>

            {/* COD badge */}
            <span style={{
              fontSize: "11px", fontWeight: 600, color: theme.textMuted,
              background: theme.badge, border: `1px solid ${theme.border}`,
              padding: "5px 10px", borderRadius: "20px",
            }}>
              COD
            </span>

            {/* Vertical divider */}
            <span style={{ width: "1px", height: "28px", background: theme.border, display: "inline-block" }} />

            <button className="icon-btn" style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: theme.borderRadius, padding: "7px 10px", cursor: "pointer", color: theme.textMuted, fontSize: "15px" }}>
              ⋯
            </button>

            <button className="btn-primary" style={{ background: theme.primary, color: theme.textInverse, border: "none", borderRadius: theme.borderRadius, padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>↓</span> Download Invoice
            </button>
          </div>
        </div>

        {/* ── Horizontal divider ── */}
        <div style={{ height: "1px", background: theme.border, marginBottom: "24px" }} />

        {/* ── Two-column grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px", alignItems: "start" }}>

          {/* LEFT */}
          <div>

            {/* Estimated delivery banner */}
            {!isFailed && (
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 16px", marginBottom: "16px",
                background: `${theme.primary}0d`,
                border: `1px solid ${theme.primary}22`,
                borderRadius: theme.borderRadius,
              }}>
                <div style={{ fontSize: "22px" }}>📦</div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: theme.text }}>
                    Estimated delivery in {order.estimated_days.min}–{order.estimated_days.max} days
                  </div>
                  <div style={{ fontSize: "12px", color: theme.textMuted }}>
                    Expected by {estimatedBy}
                    {order.tracking_number && (
                      <span style={{ marginLeft: "10px", color: theme.link, fontFamily: "monospace", fontSize: "11px" }}>
                        #{order.tracking_number}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Order items table */}
            <div style={card}>
              <div style={cardHead}>Order Details</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["ID", "Product name", "Qty", "Price", "Total"].map((h, i) => (
                      <th key={h} style={{
                        padding: "9px 14px", textAlign: i > 1 ? "right" : "left",
                        fontSize: "11px", fontWeight: 600, color: theme.textMuted,
                        textTransform: "uppercase", letterSpacing: "0.6px",
                        borderBottom: `1px solid ${theme.border}`,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => {
                    const last = idx === order.items.length - 1;
                    const tdStyle: React.CSSProperties = {
                      padding: "12px 14px",
                      borderBottom: last ? "none" : `1px solid ${theme.border}`,
                      verticalAlign: "middle",
                    };
                    return (
                      <tr key={item.id} className="tr-hover">
                        <td style={{ ...tdStyle, color: theme.textMuted, fontSize: "12px" }}>#{item.id}</td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img src={item.image} alt={item.name} style={{ width: "38px", height: "38px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: "13px", fontWeight: 500, color: theme.text }}>{item.name}</div>
                              <div style={{ fontSize: "11px", color: theme.textMuted }}>{item.variant}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, textAlign: "right", color: theme.textSecondary }}>×{item.quantity}</td>
                        <td style={{ ...tdStyle, textAlign: "right", color: theme.textSecondary }}>{item.unit_price.toFixed(2)} MAD</td>
                        <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600, color: theme.text }}>{(item.unit_price * item.quantity).toFixed(2)} MAD</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paid by customer */}
            <div style={card}>
              <div style={cardHead}>Paid by Customer</div>
              <div style={cardBody}>
                {[
                  { label: `Subtotal · ${totalQty} items`,                         val: `${order.subtotal.toFixed(2)} MAD`,         color: theme.text },
                  order.discount_amount > 0
                    ? { label: `Discount (${order.coupon_code || "coupon"})`,       val: `−${order.discount_amount.toFixed(2)} MAD`, color: theme.success }
                    : null,
                  { label: `Shipping · ${order.shipping_company}`,                 val: order.shipping_cost === 0 ? "Free" : `${order.shipping_cost.toFixed(2)} MAD`, color: theme.text },
                  order.tax > 0
                    ? { label: "TVA (20%)",                                         val: `${order.tax.toFixed(2)} MAD`,              color: theme.text }
                    : null,
                ].filter(Boolean).map((row: any, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "13px" }}>
                    <span style={{ color: theme.textSecondary }}>{row.label}</span>
                    <span style={{ fontWeight: 500, color: row.color }}>{row.val}</span>
                  </div>
                ))}
                <div style={{ height: "1px", background: theme.border, margin: "10px 0 8px" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 700 }}>
                  <span style={{ color: theme.text }}>Total paid by customer</span>
                  <span style={{ color: theme.primary }}>{order.total_amount.toFixed(2)} MAD</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div style={card}>
              <div style={cardHead}>Timeline</div>
              <div style={{ ...cardBody, paddingBottom: "8px" }}>
                {TIMELINE_STEPS.map((step, idx) => {
                  const hist      = order.status_history.find((h) => h.status === step.status);
                  const done      = idx <= activeIdx;
                  const active    = idx === activeIdx;
                  const isLast    = idx === TIMELINE_STEPS.length - 1;
                  const dotColor  = active ? statusColor : done ? theme.success : theme.border;

                  return (
                    <div key={step.status} style={{ display: "flex", gap: "14px", position: "relative" }}>
                      {/* Vertical connector line */}
                      {!isLast && (
                        <div style={{
                          position: "absolute", left: "11px", top: "26px", bottom: "-2px",
                          width: "2px",
                          background: done && idx < activeIdx ? theme.success : theme.border,
                          zIndex: 0,
                        }} />
                      )}

                      {/* Dot */}
                      <div style={{
                        width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "11px", fontWeight: 700,
                        zIndex: 1, position: "relative",
                        background: done ? `${dotColor}1a` : theme.bgSecondary,
                        border: `2px solid ${dotColor}`,
                        color: dotColor,
                        boxShadow: active ? `0 0 0 3px ${dotColor}22` : "none",
                        marginTop: "1px",
                      }}>
                        {done ? "✓" : "·"}
                      </div>

                      {/* Content */}
                      <div style={{ paddingBottom: isLast ? "4px" : "22px", flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: done ? 600 : 400, color: done ? theme.text : theme.textMuted }}>
                          {step.label}
                        </div>
                        <div style={{ fontSize: "12px", color: theme.textMuted, marginTop: "1px" }}>
                          {hist ? fmt(hist.at) : "Pending"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div>

            {/* Customer info */}
            <div style={card}>
              <div style={cardHead}>
                Customer Information
                <button className="icon-btn" style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: "14px", padding: "2px 4px", borderRadius: "4px" }}>✎</button>
              </div>
              <div style={cardBody}>
                <div style={{ marginBottom: "12px" }}>
                  <div style={infoLabel}>Name</div>
                  <div style={infoVal}>{order.customer.name}</div>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <div style={infoLabel}>Email</div>
                  <div style={{ ...infoVal, color: theme.link }}>{order.customer.email}</div>
                </div>
                <div>
                  <div style={infoLabel}>Phone</div>
                  <div style={{ ...infoVal, color: theme.link }}>{order.customer.phone}</div>
                </div>

                <div style={divider} />

                <div style={{ marginBottom: "12px" }}>
                  <div style={infoLabel}>Shipping address</div>
                  <div style={infoVal}>
                    {order.address.street}<br />
                    {order.address.city}, {order.address.region}<br />
                    {order.address.zip}
                  </div>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <div style={infoLabel}>Billing address</div>
                  <div style={{ ...infoVal, color: theme.textMuted }}>Same as shipping address</div>
                </div>

                <div style={divider} />

                <div>
                  <div style={infoLabel}>Payment</div>
                  <div style={infoVal}>Cash on Delivery</div>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div style={card}>
              <div style={cardHead}>Shipping</div>
              <div style={cardBody}>
                <div style={{ marginBottom: "12px" }}>
                  <div style={infoLabel}>Carrier</div>
                  <div style={infoVal}>{order.shipping_company}</div>
                </div>
                {order.tracking_number && (
                  <div style={{ marginBottom: "12px" }}>
                    <div style={infoLabel}>Tracking number</div>
                    <div style={{ ...infoVal, fontFamily: "monospace", fontSize: "12px", color: theme.link }}>
                      {order.tracking_number}
                    </div>
                  </div>
                )}
                <div>
                  <div style={infoLabel}>Estimated delivery</div>
                  <div style={infoVal}>
                    {order.estimated_days.min}–{order.estimated_days.max} days<br />
                    <span style={{ fontSize: "12px", color: theme.textMuted }}>by {estimatedBy}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}