import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useOwner } from '../../context/OwnerContext';
import { c, shadow } from '../../styles/theme';

const PERIODS = [
  { key: 'week',  label: 'Last 7 Days' },
  { key: 'month', label: 'Last 30 Days' },
  { key: 'year',  label: 'Last Year' },
];

export default function OwnerAnalytics() {
  const { salon } = useOwner();
  const [period, setPeriod] = useState('month');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!salon) return;
    setLoading(true);
    api.get(`/salons/${salon.id}/analytics/?period=${period}`)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [salon, period]);

  return (
    <div>
      <div style={s.header} className="fade-up">
        <div>
          <div style={s.eyebrow}>Insights</div>
          <h2 style={s.title}>Analytics</h2>
          <p style={s.sub}>Business performance overview</p>
        </div>
        <div style={s.periodToggle}>
          {PERIODS.map(p => (
            <button
              key={p.key}
              style={{ ...s.periodBtn, ...(period === p.key ? s.periodBtnActive : {}) }}
              onClick={() => setPeriod(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={s.loadGrid}>
          {[1,2,3,4].map(i => <div key={i} style={s.skeleton} className="shimmer" />)}
        </div>
      )}

      {!loading && data && (
        <>
          {/* KPI Cards */}
          <div style={s.kpiGrid} className="fade-up">
            <KpiCard label="Total Revenue" value={`LKR ${Number(data.total_revenue).toLocaleString()}`} icon="💰" color="#7C3AED" bg="#F5F3FF" />
            <KpiCard label="Product Sales" value={`LKR ${Number(data.product_sales_revenue).toLocaleString()}`} icon="🛍" color="#0284C7" bg="#E0F2FE" />
            <KpiCard label="Total Bookings" value={data.total_bookings} icon="📋" color="#059669" bg="#ECFDF5" />
            <KpiCard label="Cancellation Rate" value={`${data.cancellation_rate}%`} icon="⚠" color={data.cancellation_rate > 20 ? '#DC2626' : '#D97706'} bg={data.cancellation_rate > 20 ? '#FEF2F2' : '#FFFBEB'} />
          </div>

          {/* Revenue Chart */}
          {data.revenue_by_day?.length > 0 && (
            <div style={s.card} className="fade-up d1">
              <div style={s.cardTitle}>Revenue Over Time</div>
              <RevenueChart data={data.revenue_by_day} />
            </div>
          )}

          <div style={s.twoCol}>
            {/* Top Services */}
            {data.top_services?.length > 0 && (
              <div style={s.card} className="fade-up d2">
                <div style={s.cardTitle}>Top Services</div>
                <TopServicesChart data={data.top_services} />
              </div>
            )}

            {/* Busiest Hours */}
            {data.busiest_slots?.length > 0 && (
              <div style={s.card} className="fade-up d3">
                <div style={s.cardTitle}>Busiest Hours</div>
                <BusiestHoursChart data={data.busiest_slots} />
              </div>
            )}
          </div>

          {/* Booking status breakdown */}
          <div style={s.card} className="fade-up d4">
            <div style={s.cardTitle}>Booking Breakdown</div>
            <div style={s.breakdownRow}>
              {[
                { label: 'Completed', value: data.completed_bookings, color: '#059669', bg: '#ECFDF5' },
                { label: 'Cancelled', value: data.cancelled_bookings, color: '#DC2626', bg: '#FEF2F2' },
                { label: 'Other', value: data.total_bookings - data.completed_bookings - data.cancelled_bookings, color: '#6B7280', bg: '#F3F4F6' },
              ].map(b => (
                <div key={b.label} style={{ ...s.breakdownCard, background: b.bg, border: `1px solid ${b.color}20` }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: b.color }}>{b.value}</div>
                  <div style={{ fontSize: 12, color: b.color, fontWeight: 600, marginTop: 4 }}>{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!loading && !data && (
        <div style={s.empty} className="scale-in">
          <div style={{ fontSize: 40, marginBottom: 12, opacity: .4 }}>◱</div>
          <p style={{ color: c.textMuted }}>No analytics data available yet.</p>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, icon, color, bg }) {
  return (
    <div style={{ ...s.kpiCard, background: bg, border: `1px solid ${color}20` }} className="lift-sm">
      <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color, lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 12, color: c.textMuted, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function RevenueChart({ data }) {
  const W = 600, H = 160, PAD = { top: 16, right: 16, bottom: 28, left: 60 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const revenues = data.map(d => d.revenue);
  const maxRev = Math.max(...revenues, 1);
  const points = data.map((d, i) => {
    const x = PAD.left + (i / Math.max(data.length - 1, 1)) * innerW;
    const y = PAD.top + innerH - (d.revenue / maxRev) * innerH;
    return { x, y, ...d };
  });

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');
  const area = `M${points[0]?.x},${PAD.top + innerH} ` +
    points.map(p => `L${p.x},${p.y}`).join(' ') +
    ` L${points[points.length - 1]?.x},${PAD.top + innerH} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => ({ value: Math.round(maxRev * f), y: PAD.top + innerH - f * innerH }));

  const showEvery = Math.max(1, Math.floor(data.length / 6));
  const xLabels = data.filter((_, i) => i % showEvery === 0 || i === data.length - 1);

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block' }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map(t => (
          <g key={t.value}>
            <line x1={PAD.left} x2={W - PAD.right} y1={t.y} y2={t.y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,4" />
            <text x={PAD.left - 6} y={t.y + 4} textAnchor="end" fill="#9CA3AF" fontSize="9">
              {t.value >= 1000 ? `${(t.value / 1000).toFixed(0)}k` : t.value}
            </text>
          </g>
        ))}

        {/* Area fill */}
        {points.length > 1 && <path d={area} fill="url(#revGrad)" />}

        {/* Line */}
        {points.length > 1 && (
          <polyline points={polyline} fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#7C3AED" stroke="#fff" strokeWidth="2" />
        ))}

        {/* X labels */}
        {xLabels.map((d, i) => {
          const idx = data.indexOf(d);
          const x = PAD.left + (idx / Math.max(data.length - 1, 1)) * innerW;
          return (
            <text key={i} x={x} y={H - 6} textAnchor="middle" fill="#9CA3AF" fontSize="8.5">
              {d.date.slice(5)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function TopServicesChart({ data }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((svc, i) => {
        const pct = (svc.count / maxCount) * 100;
        const hue = [280, 300, 260, 320, 240][i % 5];
        return (
          <div key={svc.service_name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: c.text }}>{svc.service_name}</span>
              <span style={{ fontSize: 12, color: c.textMuted }}>{svc.count} bookings · LKR {svc.revenue.toLocaleString()}</span>
            </div>
            <div style={{ height: 8, background: c.bg, borderRadius: 4, overflow: 'hidden', border: `1px solid ${c.border}` }}>
              <div style={{ width: `${pct}%`, height: '100%', borderRadius: 4, background: `hsl(${hue}, 70%, 55%)`, transition: 'width .5s ease' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BusiestHoursChart({ data }) {
  const sorted = [...data].sort((a, b) => a.hour - b.hour);
  const maxCount = Math.max(...sorted.map(d => d.count), 1);
  const W = 300, H = 120, barW = 24, gap = 10;
  const totalW = sorted.length * (barW + gap) - gap;
  const startX = (W - totalW) / 2;

  const fmt = h => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}${ampm}`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', margin: '0 auto' }}>
      {sorted.map((d, i) => {
        const barH = (d.count / maxCount) * 70;
        const x = startX + i * (barW + gap);
        const y = 90 - barH;
        return (
          <g key={d.hour}>
            <rect x={x} y={y} width={barW} height={barH} rx="4" fill="url(#barGrad)" />
            <text x={x + barW / 2} y={88} textAnchor="middle" fill="#9CA3AF" fontSize="8">
              {fmt(d.hour)}
            </text>
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fill="#7C3AED" fontSize="9" fontWeight="700">
              {d.count}
            </text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  eyebrow: { fontSize: 10, fontWeight: 700, color: '#A78BFA', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 5 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: c.text, margin: '0 0 4px' },
  sub: { color: c.textMuted, fontSize: 13, margin: 0 },
  periodToggle: {
    display: 'flex', background: c.bg, borderRadius: 10,
    border: `1px solid ${c.border}`, overflow: 'hidden', flexShrink: 0,
  },
  periodBtn: { padding: '8px 16px', border: 'none', background: 'transparent', color: c.textMuted, cursor: 'pointer', fontSize: 12, fontWeight: 500 },
  periodBtnActive: { background: '#7C3AED', color: '#fff', fontWeight: 700 },

  loadGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  skeleton: { height: 120, borderRadius: 14 },

  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 20 },
  kpiCard: {
    borderRadius: 16, padding: '20px 22px',
    transition: 'transform .2s ease, box-shadow .2s ease',
  },

  card: { background: c.surface, borderRadius: 16, padding: '20px 22px', border: `1px solid ${c.border}`, boxShadow: shadow.sm, marginBottom: 20 },
  cardTitle: { fontSize: 13, fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 18 },

  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 0 },

  breakdownRow: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  breakdownCard: { flex: 1, minWidth: 120, borderRadius: 12, padding: '16px 20px', textAlign: 'center' },

  empty: { textAlign: 'center', padding: '80px 40px', color: c.textMuted },
};
