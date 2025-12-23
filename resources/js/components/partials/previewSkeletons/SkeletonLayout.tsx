import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { getSkeletonColors } from '@/functions/getSkeletonColors';
import { LayoutStyle } from '@/types/StoreConfigTypes';
import { ThemePalette, ThemeStyle } from '@/types/ThemeTypes';
import { useEffect, useState } from 'react';
const SkeletonLayout = ({previewLayoutStyle , previewThemeStyle} : {previewLayoutStyle : LayoutStyle  , previewThemeStyle : ThemeStyle}) => {
  const {state : {currentThemeMode , currentTheme}} = useStoreConfigCtx()
  const [previewThemePallete , setpreviewThemePallete] = useState<ThemePalette>(currentTheme) ;

  useEffect(() => {
     
  }, [previewThemeStyle]);

  const skTheme = getSkeletonColors( previewThemePallete, currentThemeMode)
  
  return (
    <div
       className='w-full'
      style={{
          background: skTheme.accent,

        // background: skTheme.bg,
        minHeight: '100vh',
        maxWidth : '100%'
      }}
    >
      {/* NAVBAR */}
      <nav
        className='w-full '
        style={{
        
          borderBottom: `1px solid ${skTheme.border}`,
          boxShadow: skTheme.shadow,
        }}
      >
        {/* Logo skeleton */}
        <div
          style={{
            height: '36px',
            background: skTheme.card,
          }}
        />
      </nav>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
       
        {/* MAIN CONTENT */}
        <main style={{ flex: 1, padding: '0px' }}>
          {/* HEADER BAR */}
          <div style={{ marginBottom: '24px' }}>
           
            {/* Sort / chips */}
            <div style={{ display: 'flex', gap: '8px' ,  width: '100%',
                    height: '15vh',
                    background: skTheme.card }} 
            />
                
          </div>

          {/* GRID SKELETON */}
          <section  className='p-4'>
             <div
           className={
              previewLayoutStyle === "grid" ? "grid grid-cols-3 gap-3" : 
              previewLayoutStyle === "list" ? "flex flex-col gap-3" :
              //premium layout fallback
              "grid grid-cols-4 gap-3"
            }
           
           >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className=''
                style={{
                  background: skTheme.card,
                  borderRadius: skTheme.borderRadius,
                  boxShadow: skTheme.shadow,
                  padding: '12px',
                }}
              >
                {/* Image */}
                <div
                  style={{
                    height: '150px',
                    background: skTheme.gray200,
                    borderRadius: '8px',
                    marginBottom: '12px',
                  }}
                />

                {/* Title */}
                <div
                  style={{
                    height: '14px',
                    width: '70%',
                    background: skTheme.gray300,
                    borderRadius: '4px',
                    marginBottom: '8px',
                  }}
                />

                {/* Price */}
                <div
                  style={{
                    height: '12px',
                    width: '40%',
                    background: skTheme.gray200,
                    borderRadius: '4px',
                  }}
                />
              </div>
            ))}
          </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SkeletonLayout;
