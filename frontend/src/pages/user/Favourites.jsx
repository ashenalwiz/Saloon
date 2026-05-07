import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const PALETTE = ['#7C3AED','#EC4899','#2563EB','#059669','#D97706','#DC2626'];

export default function UserFavourites() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/client/favourites/')
      .then(r => setSalons(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={s.header} className="fade-up">
        <div>
          <div style={s.eyebrow}>Saved Salons</div>
          <h2 style={s.title}>My Favourites</h2>
          <p style={s.sub}>{salons.length} saved salon{salons.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/salons" style={s.browseBtn} className="lift-sm">Browse Salons</Link>
      </div>

      {loading && (
        <div style={s.grid}>
          {[1,2,3].map(i => <div key={i} style={s.skeleton} className="shimmer" />)}
        </div>
      )}

      {!loading && salons.length === 0 && (
        <div style={s.empty} className="scale-in">
          <div style={s.emptyHeart}>♥</div>
          <h3 style={s.emptyTitle}>No favourites yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 28, lineHeight: 1.7 }}>
            Tap the heart on any salon page to save it here.
          </p>
          <Link to="/salons" style={s.browseBtn}>Browse Salons</Link>
        </div>
      )}

      {!loading && salons.length > 0 && (
        <div style={s.grid}>
          {salons.map((salon, i) => {
            const color = PALETTE[i % PALETTE.length];
            return (
              <div key={salon.id} style={s.card} className={`lift-sm lift-purple fade-up d${Math.min(i + 1, 5)}`}>
                <div style={{ ...s.cardBanner, background: `linear-gradient(145deg, ${color}18 0%, ${color}08 100%)` }}>
                  <div style={{ ...s.salonAvatar, background: `linear-gradient(145deg, ${color} 0%, ${color}CC 100%)`, boxShadow: `0 8px 24px ${color}40` }}>
                    {salon.name[0].toUpperCase()}
                  </div>
                  <div style={{ ...s.categoryDot, background: color, boxShadow: `0 0 8px ${color}80` }} />
                </div>
                <div style={s.cardBody}>
                  <h3 style={s.salonName}>{salon.name}</h3>
                  <div style={s.salonLoc}>
                    <span style={{ ...s.locDot, color }}>◎</span>
                    {salon.address_city}{salon.address_district ? `, ${salon.address_district}` : ''}
                  </div>
                  {salon.contact_number && (
                    <div style={s.contactChip}>
                      <span style={{ fontSize: 10 }}>📞</span> {salon.contact_number}
                    </div>
                  )}
                </div>
                <Link to={`/salons/${salon.id}`} style={{ ...s.viewBtn, color }}>
                  <span>Explore Salon</span>
                  <span style={s.arrow}>→</span>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 30, flexWrap: 'wrap', gap: 14,
  },
  eyebrow: {
    fontSize: 10, fontWeight: 700, color: '#A78BFA',
    letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6,
  },
  title: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 30, fontWeight: 700, color: 'var(--text)', margin: 0, marginBottom: 4,
    letterSpacing: '-0.01em',
  },
  sub: { color: 'var(--text-muted)', fontSize: 13, margin: 0 },
  browseBtn: {
    padding: '11px 24px',
    background: 'linear-gradient(135deg, #7C3AED 0%, #9B59E8 50%, #EC4899 100%)',
    color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 14,
    textDecoration: 'none', boxShadow: '0 6px 20px rgba(124,58,237,.35)',
    display: 'inline-block', alignSelf: 'flex-start',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 22 },
  skeleton: { height: 260, borderRadius: 22 },
  card: {
    background: 'var(--surface)', borderRadius: 22, overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(124,58,237,.07), 0 1px 4px rgba(0,0,0,.04)',
    border: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column',
    transition: 'border-color .2s ease',
  },
  cardBanner: { padding: '24px 24px 16px', position: 'relative' },
  salonAvatar: {
    width: 56, height: 56, borderRadius: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 24, fontWeight: 700, color: '#fff',
  },
  categoryDot: { width: 9, height: 9, borderRadius: '50%', position: 'absolute', top: 18, right: 18 },
  cardBody: { padding: '4px 24px 18px', flex: 1 },
  salonName: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 19, fontWeight: 700, color: 'var(--text)', marginBottom: 8,
    letterSpacing: '-0.01em',
  },
  salonLoc: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 13, color: 'var(--text-muted)', marginBottom: 10,
  },
  locDot: { fontSize: 11 },
  contactChip: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    fontSize: 12, color: 'var(--text-muted)',
    background: 'var(--surface2)', borderRadius: 20,
    padding: '4px 12px', border: '1px solid var(--border)',
  },
  viewBtn: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 24px', fontWeight: 600, fontSize: 14,
    borderTop: '1px solid var(--border)',
    transition: 'background .18s ease', textDecoration: 'none',
  },
  arrow: { fontSize: 16, transition: 'transform .2s ease' },

  empty: {
    textAlign: 'center', padding: '80px 40px',
    background: 'var(--surface)', borderRadius: 24,
    border: '1px solid var(--border)',
    boxShadow: '0 4px 20px rgba(124,58,237,.06)',
  },
  emptyHeart: {
    width: 72, height: 72, borderRadius: '50%', fontSize: 30,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
    background: 'linear-gradient(135deg, #EC4899 0%, #7C3AED 100%)',
    color: '#fff', boxShadow: '0 8px 24px rgba(236,72,153,.35)',
  },
  emptyTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: '0 0 10px',
  },
};
