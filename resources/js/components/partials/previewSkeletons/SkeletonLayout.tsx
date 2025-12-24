import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { LayoutStyle } from "@/types/StoreConfigTypes";
import { ThemePalette, ThemeStyle } from "@/types/ThemeTypes";
import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { getSkeletonColors } from "@/functions/getSkeletonColors";

const SkeletonLayout = ({
  previewLayoutStyle,
  previewThemeStyle,
}: {
  previewLayoutStyle: LayoutStyle;
  previewThemeStyle: ThemeStyle;
}) => {
  const {
    state: { currentThemeMode, currentTheme },
  } = useStoreConfigCtx();

  const [previewThemePalette, setPreviewThemePalette] =
    useState<ThemePalette>(currentTheme);

  // later: resolve ThemeStyle → ThemePalette
  useEffect(() => {
    setPreviewThemePalette(currentTheme);
  }, [previewThemeStyle, currentTheme]);

  const sk = getSkeletonColors(previewThemePalette, currentThemeMode);

  /* ---------------------------------- */
  /* Reusable blocks                     */
  /* ---------------------------------- */

  const SkeletonImage = ({ height = 140, showAccentTint = false }) => (
    <div
      style={{
        height,
        background: sk.image,
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {showAccentTint && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: sk.accentIconTint,
            borderRadius: "8px",
          }}
        />
      )}
      <Package size={32} color={sk.lineSoft} style={{ position: "relative" }} />
    </div>
  );

  const SkeletonLines = ({ includePrice = true }) => (
    <>
      <div
        style={{
          height: 14,
          width: "70%",
          background: sk.lineStrong,
          borderRadius: 4,
          marginBottom: 8,
        }}
      />
      <div
        style={{
          height: 12,
          width: "40%",
          background: sk.lineSoft,
          borderRadius: 4,
          marginBottom: includePrice ? 12 : 0,
        }}
      />
      {includePrice && (
        <div
          style={{
            height: 16,
            width: "30%",
            background: sk.lineStrong,
            borderRadius: 4,
          }}
        />
      )}
    </>
  );

  const CardBase = ({ children, horizontal = false, isHero = false }) => (
    <div
      style={{
        background: sk.card,
        borderRadius: sk.radius,
        boxShadow: sk.shadow,
        padding: isHero ? 20 : horizontal ? 16 : 14,
        display: horizontal ? "flex" : "block",
        gap: horizontal ? 16 : undefined,
        transition: "all 0.2s ease",
      }}
    >
      {children}
    </div>
  );

  /* ---------------------------------- */
  /* Layouts                            */
  /* ---------------------------------- */

  const GridLayout = () => (
    <div className="grid grid-cols-3 gap-5">
      {Array.from({ length: 9 }).map((_, i) => (
        <CardBase key={i}>
          <SkeletonImage height={160} />
          <div style={{ marginTop: 14 }}>
            <SkeletonLines />
          </div>
        </CardBase>
      ))}
    </div>
  );

  const ListLayout = () => (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardBase key={i} horizontal>
          <div style={{ flexShrink: 0, width: 120 }}>
            <SkeletonImage height={110} />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
            <SkeletonLines />
          </div>
        </CardBase>
      ))}
    </div>
  );

  const PremiumLayout = () => (
    <div className="flex flex-col gap-8">
      <CardBase isHero>
        <SkeletonImage height={280} showAccentTint />
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              height: 20,
              width: "55%",
              background: sk.lineStrong,
              borderRadius: 6,
              marginBottom: 12,
            }}
          />
          <div
            style={{
              height: 14,
              width: "35%",
              background: sk.lineSoft,
              borderRadius: 4,
              marginBottom: 16,
            }}
          />
          <div
            style={{
              height: 18,
              width: "25%",
              background: sk.lineStrong,
              borderRadius: 6,
            }}
          />
        </div>
      </CardBase>

      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardBase key={i}>
            <SkeletonImage height={140} />
            <div style={{ marginTop: 12 }}>
              <SkeletonLines />
            </div>
          </CardBase>
        ))}
      </div>
    </div>
  );

  /* ---------------------------------- */

  return (
    <div
      className="w-full min-h-screen"
      style={{
        background: sk.page,
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          height: 64,
          background: sk.surface,
          borderBottom: `1px solid ${sk.border}`,
          borderTop: `3px solid ${sk.accentRail}`,
          boxShadow: sk.shadow,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        {/* LEFT: Logo + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Logo */}
          <div
            style={{
              width: 36,
              height: 36,
              background: sk.card,
              borderRadius: 8,
            }}
          />

          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                width: 120,
                height: 12,
                background: sk.lineStrong,
                borderRadius: 4,
              }}
            />
            <div
              style={{
                width: 80,
                height: 8,
                background: sk.lineSoft,
                borderRadius: 4,
              }}
            />
          </div>
        </div>


        {/* RIGHT: Circle icon (profile / cart) */}
        <div
          style={{
            width: 36,
            height: 36,
            background: sk.card,
            borderRadius: "50%",
          }}
        />
      </nav>


      {/* CONTENT */}
      <main className="py-6">
        {/* HEADER BAR */}
        <div
          style={{
            height: 64,
            background: sk.surface,
            borderRadius: sk.radius,
            marginBottom: 32,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: sk.shadow,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                width: 200,
                height: 36,
                background: sk.image,
                borderRadius: sk.radius,
              }}
            />
            <div
              style={{
                width: 100,
                height: 36,
                background: sk.image,
                borderRadius: sk.radius,
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {[36, 36].map((size, i) => (
              <div
                key={i}
                style={{
                  width: size,
                  height: size,
                  background: sk.image,
                  borderRadius: sk.radius,
                }}
              />
            ))}
          </div>
        </div>

        {previewLayoutStyle === "grid" && <GridLayout />}
        {previewLayoutStyle === "list" && <ListLayout />}
        {previewLayoutStyle === "premium" && <PremiumLayout />}
      </main>
    </div>
  );
};

export default SkeletonLayout;
