import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
  image: string;
  name: string;
  count: number;
  badge?: 'New' | 'Hot' | 'Sale';
  slug: string;
}

const CATEGORIES: Category[] = [
  {
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Womenswear',
    count: 1240,
    badge: 'New',
    slug: 'women',
  },
  {
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Menswear',
    count: 840,
    slug: 'men',
  },
  {
    image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Beauty',
    count: 560,
    badge: 'Hot',
    slug: 'beauty',
  },
  {
    image: 'https://images.pexels.com/photos/2422276/pexels-photo-2422276.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Jewelry',
    count: 320,
    slug: 'jewelry',
  },
  {
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Footwear',
    count: 490,
    slug: 'footwear',
  },
  {
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Accessories',
    count: 720,
    badge: 'Sale',
    slug: 'accessories',
  },
  {
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Kids',
    count: 380,
    slug: 'kids',
  },
  {
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
    name: 'Home',
    count: 610,
    slug: 'home',
  },
];

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  New: { bg: '#fff', color: '#111' },
  Hot: { bg: 'var(--currenththeme-accent)', color: '#fff' },
  Sale: { bg: '#c0392b', color: '#fff' },
};

const CategoryCard: React.FC<{ cat: Category }> = ({ cat }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '0 0 200px',
        height: 290,
        borderRadius: 'var(--currenththeme-border-radius, 8px)',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        border: '1px solid var(--currenththeme-border)',
      }}
    >
      <img
        src={cat.image}
        alt={cat.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.5s ease',
          transform: hovered ? 'scale(1.09)' : 'scale(1)',
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 60%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '1.1rem',
          opacity: hovered ? 1 : 0.88,
          transition: 'opacity 0.3s',
        }}
      >
        <p
          style={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#fff',
            marginBottom: 3,
          }}
        >
          {cat.name}
        </p>
        <p
          style={{
            fontSize: 11,
            color: 'var(--currenththeme-accent)',
            letterSpacing: '0.05em',
          }}
        >
          {cat.count.toLocaleString()} items
        </p>
      </div>

      {/* Badge */}
      {cat.badge && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: BADGE_COLORS[cat.badge]?.bg ?? '#fff',
            color: BADGE_COLORS[cat.badge]?.color ?? '#111',
            fontSize: 9,
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: 3,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {cat.badge}
        </div>
      )}
    </div>
  );
};

const CategorySlider: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    sliderRef.current?.scrollBy({ left: dir * 226, behavior: 'smooth' });
  };

  return (
    <section style={{ padding: '4rem 0 0' }}>
      {/* Header */}
      <div
        style={{
          padding: '0 5vw',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '1.8rem',
        }}
      >
        <div>
          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--currenththeme-accent)',
              marginBottom: 4,
            }}
          >
            Browse
          </p>
          <h2
            style={{
              fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
              fontSize: '2.2rem',
              fontWeight: 600,
              color: 'var(--currenththeme-text)',
              lineHeight: 1.1,
            }}
          >
            Shop by Category
          </h2>
        </div>

        {/* Arrow buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {([{ dir: -1, icon: <ChevronLeft size={16} /> }, { dir: 1, icon: <ChevronRight size={16} /> }] as const).map(
            ({ dir, icon }) => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  border: '1px solid var(--currenththeme-border)',
                  background: 'transparent',
                  color: 'var(--currenththeme-textMuted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'var(--currenththeme-accent)';
                  (e.currentTarget as HTMLButtonElement).style.color =
                    'var(--currenththeme-accent)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'var(--currenththeme-border)';
                  (e.currentTarget as HTMLButtonElement).style.color =
                    'var(--currenththeme-textMuted)';
                }}
              >
                {icon}
              </button>
            )
          )}
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={sliderRef}
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          padding: '0 5vw 4px',
          scrollBehavior: 'smooth',
        }}
      >
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.slug} cat={cat} />
        ))}
      </div>
      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
};

export default CategorySlider;