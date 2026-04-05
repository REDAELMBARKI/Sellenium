import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { ProductClient } from '@/types/homeEditorType';

interface ProductCardProps {
  product: ProductClient;
  isEditor : boolean ,
  /** 'standard' = portrait card | 'featured' = wide 2-col editorial card */
  variant?: 'standard' | 'featured';
}

const BADGE_MAP: Record<string, { label: string; bg: string; color: string }> = {
  new: { label: 'New', bg: 'var(--currenththeme-text)', color: 'var(--currenththeme-bg)' },
  sale: { label: 'Sale', bg: '#c0392b', color: '#fff' },
  hot: { label: 'Hot', bg: 'var(--currenththeme-accent)', color: '#fff' },
};

function getBadge(product: ProductClient) {
  if (product.badge) return BADGE_MAP[product.badge];
  if (product.compare_price && product.compare_price > (product.price ?? 0)) return BADGE_MAP.sale;
  return null;
}

function discountPct(original: number, current: number) {
  return Math.round(((original - current) / original) * 100);
}

const Stars: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={10}
          fill={i <= Math.round(rating) ? 'var(--currenththeme-starColor, #bfa36f)' : 'none'}
          color={
            i <= Math.round(rating)
              ? 'var(--currenththeme-starColor, #bfa36f)'
              : 'var(--currenththeme-border)'
          }
        />
      ))}
    </span>
  );
};

export const ProductCardMaster: React.FC<ProductCardProps> = ({
  product,
  isEditor = false ,
  variant = 'standard',
}) => {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const badge = getBadge(product);
  if (variant === 'featured') {
    return (
      <div
        style={{
          userSelect : "none" ,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--currenththeme-bgSecondary)',
          borderRadius: 'var(--currenththeme-border-radius, 8px)',
          overflow: 'hidden',
          border: '1px solid var(--currenththeme-border)',
          cursor : isEditor ? "none" : "pointer"
        }}
      >
        {/* Image side */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 360 }}>
          <img
            src={product.thumbnail.url}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.55s ease',
            }}
          />
          {badge && (
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                background: badge.bg,
                color: badge.color,
                fontSize: 9,
                fontWeight: 600,
                padding: '3px 9px',
                borderRadius: 3,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {badge.label}
            </div>
          )}
        </div>

        {/* Info side */}
        <div
          style={{
            padding: '2rem 1.8rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <p
            style={{
              fontSize: 9,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--currenththeme-accent)',
              marginBottom: 6,
            }}
          >
            Featured Pick
          </p>
          <h3
            style={{
              fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
              fontSize: '1.9rem',
              fontWeight: 600,
              color: 'var(--currenththeme-text)',
              lineHeight: 1.18,
              marginBottom: 10,
            }}
          >
            {product.name}
          </h3>
         
          <div style={{ marginBottom: '1.2rem' }}>
            <Stars rating={product.rating_average ?? 0} />
            <span
              style={{
                fontSize: 11,
                color: 'var(--currenththeme-textMuted)',
                marginLeft: 6,
              }}
            >
              ({product.reviews})
            </span>
          </div>
          <p
            style={{
              fontSize: '1.5rem',
              fontWeight: 500,
              color: 'var(--currenththeme-priceText)',
              marginBottom: '1.2rem',
            }}
          >
            {product.compare_price && (
              <span
                style={{
                  fontSize: '1rem',
                  color: 'var(--currenththeme-priceStrike)',
                  textDecoration: 'line-through',
                  marginRight: 8,
                  fontWeight: 400,
                }}
              >
                ${product.compare_price.toFixed(2)}
              </span>
            )}
             {product.price && typeof product.price === 'number' && product.price.toFixed(2)}

          </p>
          <button
            style={{
              background: 'var(--currenththeme-accent)',
              color: '#fff',
              border: 'none',
              padding: '11px 22px',
              borderRadius: 'var(--currenththeme-border-radius, 8px)',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              width: 'fit-content',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    );
  }


  return (
    <div
       onMouseEnter={() => !isEditor && setHovered(true)}
       onMouseLeave={() => !isEditor && setHovered(false)}
      style={{
        background: 'var(--currenththeme-card)',
        borderRadius: 'var(--currenththeme-border-radius, 8px)',
        overflow: 'hidden',
        border: '1px solid var(--currenththeme-border)',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        boxShadow: hovered
          ? 'var(--currenththeme-shadowMd)'
          : 'var(--currenththeme-shadow)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Image */}
      <div
        style={{
          aspectRatio: '3/4',
          overflow: 'hidden',
          position: 'relative',
          background: 'var(--currenththeme-bgSecondary)',
        }}
      >
        <img
          src={product.thumbnail.url}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.5s ease',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
          }}
        />

        {/* Badge */}
        {badge && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: badge.bg,
              color: badge.color,
              fontSize: 9,
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: 3,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              zIndex: 2,
            }}
          >
            {badge.label}
          </div>
        )}

        {/* Discount badge */}
        {product.compare_price && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'var(--currenththeme-dealBg)',
              color: 'var(--currenththeme-accent)',
              fontSize: 9,
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: 3,
              letterSpacing: '0.06em',
              zIndex: 2,
            }}
          >
            −{discountPct(product.compare_price, product.price ?? 0)}%
          </div>
        )}

        {/* Hover action layer */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '10px',
            gap: 6,
            zIndex: 3,
          }}
        >
          <button
            style={{
              width: '100%',
              padding: '9px 0',
              background: 'var(--currenththeme-accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--currenththeme-border-radius, 8px)',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              transform: hovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'transform 0.3s ease 0.05s',
            }}
          >
            <ShoppingCart size={13} />
            Add to Cart
          </button>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={(e) => { e.stopPropagation(); }}
              style={{
                flex: 1,
                padding: '8px 0',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(6px)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 'var(--currenththeme-border-radius, 8px)',
                fontSize: 11,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                transform: hovered ? 'translateY(0)' : 'translateY(8px)',
                transition: 'transform 0.3s ease 0.1s',
              }}
            >
              <Eye size={12} />
              Quick View
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setWishlisted((w) => !w); }}
              style={{
                width: 36,
                flexShrink: 0,
                background: wishlisted
                  ? 'var(--currenththeme-accent)'
                  : 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(6px)',
                color: '#fff',
                border: wishlisted
                  ? '1px solid var(--currenththeme-accent)'
                  : '1px solid rgba(255,255,255,0.3)',
                borderRadius: 'var(--currenththeme-border-radius, 8px)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: hovered ? 'translateY(0)' : 'translateY(8px)',
                transition: 'transform 0.3s ease 0.12s, background 0.2s',
              }}
            >
              <Heart size={13} fill={wishlisted ? '#fff' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px' }}>
        <p
          style={{
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--currenththeme-textMuted)',
            marginBottom: 3,
          }}
        >
          {product.brand ?? product.category.name}
        </p>
        <p
          style={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontSize: '1.05rem',
            color: 'var(--currenththeme-text)',
            marginBottom: 7,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {product.name}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {product.compare_price && (
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--currenththeme-priceStrike)',
                  textDecoration: 'line-through',
                  marginRight: 6,
                }}
              >
                ${product.compare_price.toFixed(2)}
              </span>
            )}
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--currenththeme-priceText)',
              }}
            >
              {product.price && typeof product.price === 'number' && product.price.toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Stars rating={product.rating_average ?? 0} />
            <span style={{ fontSize: 10, color: 'var(--currenththeme-textMuted)' }}>
              ({product.reviews})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardMaster;