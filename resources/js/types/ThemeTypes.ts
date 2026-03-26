export type Themes =  Record<ThemeStyle ,Record<ThemeMode , ThemePalette>>


  export type ThemeStyle  =  "luxuryNoir" | "softPastel" | "orangeNight"
  export type ThemePalette = {
  // -------------------------
  // SURFACES / BACKGROUNDS
  // -------------------------
  bg: string            // Main background of pages (store admin main content, app background)
  bgSecondary: string   // Secondary background (cards, panels, modals, side panels if not sidebar)
  card: string          // Card backgrounds (product cards, info cards)
  modal: string         // Modal backgrounds
  overlay: string       // Overlays, modals backdrop, dimming effects
 
  // side bar
  sidebarBg: string
  sidebarFg: string
  sidebarBorder: string
  sidebarHover: string
  sidebarMuted: string
  sidebarMutedFg: string
  sidebarActive: string
  sidebarActiveFg: string
 
  // -------------------------
  // TEXT
  // -------------------------
  text: string          // Default primary text
  textSecondary: string // Secondary text (less important labels, metadata)
  textMuted: string     // Muted text (disabled, placeholder, faint info)
  textInverse: string   // Text on dark backgrounds (white/light text)
 
  // -------------------------
  // BUTTONS / ACCENTS
  // -------------------------
  primary: string       // Primary buttons, main call-to-actions
  primaryHover: string  // Hover state for primary buttons
  secondary: string     // Secondary buttons, less important actions
  secondaryHover: string// Hover for secondary buttons
  accent: string        // Small UI accents, highlights, badges, status
  accentHover: string   // Hover for accents (interactive badges/buttons)
 
  // -------------------------
  // BORDERS
  // -------------------------
  border: string        // General borders (cards, inputs, panels)
  borderHover: string   // Border highlight on hover/focus
  borderRadius: string
 
  // -------------------------
  // LINKS
  // -------------------------
  link: string          // Link text
  linkHover: string     // Link hover color
 
  // -------------------------
  // SHADOWS
  // -------------------------
  shadow: string        // Small shadows for cards/elements
  shadowMd: string      // Medium shadows (modals, dropdowns)
  shadowLg: string      // Large shadows (dialogs, popups, important layers)
 
  // badge
  badge: string
 
  // states
  success: string
  info: string
  error: string
  warning: string
 
  // -------------------------
  // PRODUCT PAGE SPECIFIC
  // -------------------------
  priceText: string     // Big price number — pops more than default text
  priceStrike: string   // Strikethrough original/compare price color
  dealBg: string        // Deal box surface background
  starColor: string     // Review/rating star color (gold tone)

  // promotions
  
  promotionBg: {
    percentage: string    // e.g. orange for discount deals
    fixed: string         // e.g. deep blue for fixed amount off
    free_shipping: string // e.g. green for free shipping
    text: string          // text color on top of promo backgrounds
    badge: string         // the yellow threshold badge background
    badgeText: string     // text on the badge
 }
};
 

export type ThemeMode = "dark" | "light"