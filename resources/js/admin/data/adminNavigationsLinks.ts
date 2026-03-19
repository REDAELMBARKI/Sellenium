import { 
  LayoutDashboard, BarChart3, TrendingUp, Zap, Package, List, Plus, Pencil,
  Trash, Upload, Star, Palette, Ruler, FolderTree, GitBranch, MessageSquare,
  ShoppingCart, Clock, CheckCircle, XCircle, RotateCcw, Users, Crown, Tag,
  Box, AlertTriangle, History as HistoryIcon, Warehouse, Flag, Megaphone,
  Mail, Image as ImageIcon, Percent, FileText, DollarSign, PieChart, Ship,
  Map as MapIcon, Truck, Navigation, Shield, Lock as LockIcon, Settings,
  Sliders, CreditCard, Receipt, Store, Search, Bell, Settings2, FolderGit,
} from 'lucide-react';

interface SubLink {
  title: string;
  icon: React.ElementType;
  href: string;         // route name — resolve with route(href) in sidebar
  disabled?: boolean;   // true = route not yet defined in Laravel
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  badge?: number;
  badgeColor?: string;
  subLinks?: SubLink[];
  section?: boolean;
  sectionTitle?: string;
}

export const menuItems: MenuItem[] = [

  // ── ANALYTICS & OVERVIEW ────────────────────────────────────────────────────
  { section: true, sectionTitle: "Analytics & Overview", icon: BarChart3, title: 'analytics' },

  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "dashboard",
    subLinks: [
      { title: "Sales",     icon: BarChart3,  href: "",     disabled: true },
      { title: "Customers", icon: TrendingUp, href: "", disabled: true },
      { title: "Inventory", icon: Zap,        href: "", disabled: true },
    ]
  },
  {
    title: "Reports",
    icon: BarChart3,
    subLinks: [
      { title: "Sales Report",         icon: DollarSign, href: "", disabled: true },
      { title: "Product Performance",  icon: TrendingUp, href: "", disabled: true },
      { title: "Customer Insights",    icon: Users,      href: "", disabled: true },
      { title: "Financial Reports",    icon: PieChart,   href: "", disabled: true },
    ]
  },

  // ── CATALOG MANAGEMENT ───────────────────────────────────────────────────────
  { section: true, sectionTitle: "Catalog Management", icon: Package, title: 'catalog' },

  {
    title: "Products",
    icon: Package,
    subLinks: [
      { title: "Drafts",            icon: FolderGit, href: "drafts.index"    },  // ✅
      { title: "All Products",      icon: List,      href: "products"        },  // ✅
      { title: "Add Product",       icon: Plus,      href: "products.create" },  // ✅
      { title: "Bulk Upload",       icon: Upload,    href: "", disabled: true },
      { title: "Featured Products", icon: Star,      href: "", disabled: true },
    ]
  },
  {
    title: "Variants",
    icon: Palette,
    subLinks: [
      { title: "Manage Attributes", icon: Ruler, href: "get.attributes" },  // ✅
    ]
  },
  {
    title: "Categories",
    icon: FolderTree,
    subLinks: [
      { title: "All Categories", icon: List,       href: "categories.index"  }, 
      { title: "Add Category",   icon: Plus,       href: "categories.create" },  // ✅
      { title: "Category Tree",  icon: GitBranch,  href: "", disabled: true  },  // ⚠ route commented out
    ]
  },
  {
    title: "Inventory",
    icon: Box,
    subLinks: [
      { title: "Stock Levels",    icon: BarChart3,    href: "", disabled: true },
      { title: "Low Stock Alert", icon: AlertTriangle, href: "", disabled: true },
      { title: "Stock History",   icon: HistoryIcon,  href: "", disabled: true },
      { title: "Warehouses",      icon: Warehouse,    href: "", disabled: true },
    ]
  },

  // ── SALES & ORDERS ───────────────────────────────────────────────────────────
  { section: true, sectionTitle: "Sales & Orders", icon: ShoppingCart, title: 'sales' },

  {
    title: "Orders",
    icon: ShoppingCart,
    subLinks: [
      { title: "All Orders",     icon: List,       href: "orders.index" },  // ✅
      { title: "Pending Orders", icon: Clock,      href: "", disabled: true },
      { title: "Processing",     icon: Package,    href: "", disabled: true },
      { title: "Shipped",        icon: Ship,       href: "", disabled: true },
      { title: "Completed",      icon: CheckCircle,href: "", disabled: true },
      { title: "Cancelled",      icon: XCircle,    href: "", disabled: true },
      { title: "Returns",        icon: RotateCcw,  href: "", disabled: true },
    ]
  },
  {
    title: "Shipping",
    icon: Ship,
    subLinks: [
      { title: "Shipping Cities", icon: MapIcon,   href: "shipping.cities.get" },  // ✅
      { title: "Shipping Rates",  icon: DollarSign,href: "", disabled: true },
      { title: "Carriers",        icon: Truck,     href: "", disabled: true },
      { title: "Track Shipments", icon: Navigation, href: "", disabled: true },
    ]
  },

  // ── CUSTOMERS & COMMUNICATIONS ───────────────────────────────────────────────
  { section: true, sectionTitle: "Customers & Communications", icon: Users, title: 'customers' },

  {
    title: "Customers",
    icon: Users,
    subLinks: [
      { title: "All Customers",      icon: List,      href: "", disabled: true },  // ⚠ no name on route
      { title: "VIP Customers",      icon: Crown,     href: "", disabled: true },
      { title: "Customer Groups",    icon: Users,     href: "", disabled: true },
      { title: "Customer Analytics", icon: BarChart3, href: "", disabled: true },
    ]
  },
  {
    title: "Messages",
    icon: MessageSquare,
    badge: 5,
    badgeColor: 'bg-red-500',
    subLinks: [
      { title: "Messages", icon: List, href: "", disabled: true },  // ⚠ no route name
    ]
  },
  {
    title: "Reviews",
    icon: MessageSquare,
    badge: 12,
    badgeColor: 'bg-orange-500',
    subLinks: [
      { title: "All Reviews",      icon: List,        href: "", disabled: true },
      { title: "Pending Approval", icon: Clock,       href: "", disabled: true },
      { title: "Approved",         icon: CheckCircle, href: "", disabled: true },
      { title: "Reported Reviews", icon: Flag,        href: "", disabled: true },
    ]
  },

  // ── MARKETING & PROMOTIONS ───────────────────────────────────────────────────
  { section: true, sectionTitle: "Marketing & Promotions", icon: Megaphone, title: 'marketing' },

  {
    title: "Marketing",
    icon: Megaphone,
    subLinks: [
      { title: "Promotions",       icon: Percent,  href: "get.promotions" },  // ✅
      { title: "Email Campaigns",  icon: Mail,     href: "", disabled: true },
      { title: "Banners",          icon: ImageIcon,href: "", disabled: true },
      { title: "Newsletter",       icon: FileText, href: "", disabled: true },
    ]
  },
  {
    title: "Coupons",
    icon: Tag,
    subLinks: [
      { title: "All Coupons",     icon: List,        href: "get.coupons" },  // ✅
      { title: "Create Coupon",   icon: Plus,        href: "", disabled: true },
      { title: "Active Coupons",  icon: CheckCircle, href: "", disabled: true },
      { title: "Expired Coupons", icon: XCircle,     href: "", disabled: true },
    ]
  },

  // ── CONFIGURATIONS ───────────────────────────────────────────────────────────
  { section: true, sectionTitle: "Configurations", icon: Settings2, title: 'configurations' },

  {
    title: "Admins",
    icon: Shield,
    subLinks: [
      { title: "All Admins",          icon: List,        href: "", disabled: true },  // ⚠ no route name
      { title: "Add Admin",           icon: Plus,        href: "", disabled: true },
      { title: "Roles & Permissions", icon: LockIcon,    href: "", disabled: true },
      { title: "Activity Log",        icon: HistoryIcon, href: "", disabled: true },
    ]
  },
  {
    title: "Settings",
    icon: Settings,
    subLinks: [
      { title: "Configure Store",  icon: Sliders,  href: "store"              },  // ✅
      { title: "Payment Methods",  icon: CreditCard,href: "", disabled: true  },
      { title: "Tax Settings",     icon: Receipt,  href: "", disabled: true   },
      { title: "Store Settings",   icon: Store,    href: "", disabled: true   },
      { title: "SEO Settings",     icon: Search,   href: "", disabled: true   },
      { title: "Notifications",    icon: Bell,     href: "", disabled: true   },
    ]
  },
];