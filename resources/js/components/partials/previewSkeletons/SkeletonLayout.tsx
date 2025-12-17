import { useColorsCtx } from '@/contextHooks/useColorsCtx';
import React, { useState } from 'react';
export type LayoutStyle = "grid" | "list" | "mansonry" | "premium" ;
const SkeletonLayout = ({previewLayoutId : layoutStyle} : {previewLayoutId : LayoutStyle}) => {
  const { currentTheme } = useColorsCtx();
  return (
    <div
       className='w-full'
      style={{
          background: currentTheme.accent,

        // background: currentTheme.bg,
        minHeight: '100vh',
        maxWidth : '100%'
      }}
    >
      {/* NAVBAR */}
      <nav
        className='w-full '
        style={{
        
          borderBottom: `1px solid ${currentTheme.border}`,
          padding: '16px 24px',
          boxShadow: currentTheme.shadow,
        }}
      >
        {/* Logo skeleton */}
        <div
          style={{
            height: '36px',
            borderRadius: currentTheme.borderRadius,
            background: currentTheme.card,
          }}
        />
      </nav>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
       
        {/* MAIN CONTENT */}
        <main style={{ flex: 1, padding: '24px' }}>
          {/* HEADER BAR */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '160px',
                  height: '26px',
                  borderRadius: '6px',
                  background: currentTheme.card,
                }}
              />

          
            </div>

            {/* Sort / chips */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '90px',
                    height: '30px',
                    borderRadius: '6px',
                    background: currentTheme.gray200,
                  }}
                />
              ))}
            </div>
          </div>

          {/* GRID SKELETON */}
          <div
           className='grid grid-cols-3'
            style={{
              display: 'grid',
              // gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px',
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className=''
                style={{
                  background: currentTheme.card,
                  borderRadius: currentTheme.borderRadius,
                  boxShadow: currentTheme.shadow,
                  padding: '12px',
                }}
              >
                {/* Image */}
                <div
                  style={{
                    height: '150px',
                    background: currentTheme.gray200,
                    borderRadius: '8px',
                    marginBottom: '12px',
                  }}
                />

                {/* Title */}
                <div
                  style={{
                    height: '14px',
                    width: '70%',
                    background: currentTheme.gray300,
                    borderRadius: '4px',
                    marginBottom: '8px',
                  }}
                />

                {/* Price */}
                <div
                  style={{
                    height: '12px',
                    width: '40%',
                    background: currentTheme.gray200,
                    borderRadius: '4px',
                  }}
                />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SkeletonLayout;
