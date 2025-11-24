
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  FolderTree,
  MessageSquare,
  BarChart3,
  Ship,
  Shield,
  Settings,
  Palette,
  Box,
  Projector,
  Plus,
  ChevronDown,
  Pencil,
  Trash,
  List,
  TrendingUp,
  Zap,
  Upload,
  Star,
  Ruler,
  GitBranch,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Crown,
  AlertTriangle,
  Warehouse,
  Flag,
  Megaphone,
  Mail,
  Percent,
  FileText,
  DollarSign,
  PieChart,
  Truck,
  Navigation,
  BookOpen,
  Sliders,
  CreditCard,
  Receipt,
  Store,
  Search,
  Bell,
  Grid,
} from "lucide-react";


export const menuItems = [
  { 
    title: "Dashboard", 
    icon: LayoutDashboard, 
    href: "/admin",
    subLinks: [
      { title: "Overview", icon: TrendingUp, href: "/admin/overview" },
      { title: "Analytics", icon: BarChart3, href: "/admin/analytics" },
      { title: "Quick Stats", icon: Zap, href: "/admin/stats" }
    ]
  },
  { 
    title: "Products", 
    icon: Package, 
    href: "/products",
    subLinks: [
      { title: "All Products", icon: List, href: "/products" },
      { title: "Add Product", icon: Plus, href: "/products/create" },
      { title: "Edit Product", icon: Pencil, href: "/products/edit" },
      { title: "Delete Product", icon: Trash, href: "/products/delete" },
      { title: "Bulk Upload", icon: Upload, href: "/products/bulk-upload" },
      { title: "Featured Products", icon: Star, href: "/products/featured" }
    ]
  },
  { 
    title: "Variants", 
    icon: Palette, 
    href: "/admin/variants",
    subLinks: [
      { title: "All Variants", icon: List, href: "/variants" },
      { title: "Add Variant", icon: Plus, href: "/variants/add" },
      { title: "Edit Variant", icon: Pencil, href: "/variants/edit" },
      { title: "Delete Variant", icon: Trash, href: "/variants/delete" },
      { title: "Size Manager", icon: Ruler, href: "/variants/sizes" },
      { title: "Color Manager", icon: Palette, href: "/variants/colors" }
    ]
  },
  { 
    title: "Categories", 
    icon: FolderTree, 
    href: "/admin/categories",
    subLinks: [
      { title: "All Categories", icon: List, href: "/categories" },
      { title: "Add Category", icon: Plus, href: "/categories/add" },
      { title: "Edit Category", icon: Pencil, href: "/categories/edit" },
      { title: "Delete Category", icon: Trash, href: "/categories/delete" },
      { title: "Category Tree", icon: GitBranch, href: "/categories/tree" }
    ]
  },
  { 
    title: "Collections", 
    icon: Grid, 
    href: "/admin/collections",
    subLinks: [
      { title: "All Collections", icon: List, href: "/collections" },
      { title: "New Collection", icon: Plus, href: "/collections/create" },
      { title: "Seasonal Collections", icon: Calendar, href: "/collections/seasonal" },
      { title: "Trending Collections", icon: TrendingUp, href: "/collections/trending" }
    ]
  },
  { 
    title: "Orders", 
    icon: ShoppingCart, 
    href: "/admin/orders",
    subLinks: [
      { title: "All Orders", icon: List, href: "/orders" },
      { title: "Pending Orders", icon: Clock, href: "/orders/pending" },
      { title: "Processing", icon: Package, href: "/orders/processing" },
      { title: "Shipped", icon: Ship, href: "/orders/shipped" },
      { title: "Completed", icon: CheckCircle, href: "/orders/completed" },
      { title: "Cancelled", icon: XCircle, href: "/orders/cancelled" },
      { title: "Returns", icon: RotateCcw, href: "/orders/returns" }
    ]
  },
  { 
    title: "Customers", 
    icon: Users, 
    href: "/admin/customers",
    subLinks: [
      { title: "All Customers", icon: List, href: "/customers" },
      { title: "VIP Customers", icon: Crown, href: "/customers/vip" },
      { title: "Customer Groups", icon: Users, href: "/customers/groups" },
      { title: "Customer Analytics", icon: BarChart3, href: "/customers/analytics" }
    ]
  },
  { 
    title: "Coupons", 
    icon: Tag, 
    href: "/admin/coupons",
    subLinks: [
      { title: "All Coupons", icon: List, href: "/coupons" },
      { title: "Create Coupon", icon: Plus, href: "/coupons/create" },
      { title: "Active Coupons", icon: CheckCircle, href: "/coupons/active" },
      { title: "Expired Coupons", icon: XCircle, href: "/coupons/expired" }
    ]
  },
  { 
    title: "Inventory", 
    icon: Box, 
    href: "/admin/inventory",
    subLinks: [
      { title: "Stock Levels", icon: BarChart3, href: "/inventory/stock" },
      { title: "Low Stock Alert", icon: AlertTriangle, href: "/inventory/low-stock" },
      { title: "Stock History", icon: History, href: "/inventory/history" },
      { title: "Warehouses", icon: Warehouse, href: "/inventory/warehouses" }
    ]
  },
  { 
    title: "Reviews", 
    icon: MessageSquare, 
    href: "/admin/reviews",
    subLinks: [
      { title: "All Reviews", icon: List, href: "/reviews" },
      { title: "Pending Approval", icon: Clock, href: "/reviews/pending" },
      { title: "Approved", icon: CheckCircle, href: "/reviews/approved" },
      { title: "Reported Reviews", icon: Flag, href: "/reviews/reported" }
    ]
  },
  { 
    title: "Marketing", 
    icon: Megaphone, 
    href: "/admin/marketing",
    subLinks: [
      { title: "Email Campaigns", icon: Mail, href: "/marketing/email" },
      { title: "Banners", icon: Image, href: "/marketing/banners" },
      { title: "Promotions", icon: Percent, href: "/marketing/promotions" },
      { title: "Newsletter", icon: FileText, href: "/marketing/newsletter" }
    ]
  },
  { 
    title: "Reports", 
    icon: BarChart3, 
    href: "/admin/reports",
    subLinks: [
      { title: "Sales Report", icon: DollarSign, href: "/reports/sales" },
      { title: "Product Performance", icon: TrendingUp, href: "/reports/products" },
      { title: "Customer Insights", icon: Users, href: "/reports/customers" },
      { title: "Financial Reports", icon: PieChart, href: "/reports/financial" }
    ]
  },
  { 
    title: "Shipping", 
    icon: Ship, 
    href: "/admin/shipping",
    subLinks: [
      { title: "Shipping Zones", icon: Map, href: "/shipping/zones" },
      { title: "Shipping Rates", icon: DollarSign, href: "/shipping/rates" },
      { title: "Carriers", icon: Truck, href: "/shipping/carriers" },
      { title: "Track Shipments", icon: Navigation, href: "/shipping/tracking" }
    ]
  },
  { 
    title: "Content", 
    icon: FileText, 
    href: "/admin/content",
    subLinks: [
      { title: "Blog Posts", icon: BookOpen, href: "/content/blog" },
      { title: "Pages", icon: File, href: "/content/pages" },
      { title: "Media Library", icon: Image, href: "/content/media" },
      { title: "Style Guide", icon: Palette, href: "/content/style-guide" }
    ]
  },
  { 
    title: "Admins", 
    icon: Shield, 
    href: "/admin/admins",
    subLinks: [
      { title: "All Admins", icon: List, href: "/admins" },
      { title: "Add Admin", icon: Plus, href: "/admins/create" },
      { title: "Roles & Permissions", icon: Lock, href: "/admins/roles" },
      { title: "Activity Log", icon: History, href: "/admins/activity" }
    ]
  },
  { 
    title: "Settings", 
    icon: Settings, 
    href: "/admin/settings",
    subLinks: [
      { title: "General Settings", icon: Sliders, href: "/settings/general" },
      { title: "Payment Methods", icon: CreditCard, href: "/settings/payments" },
      { title: "Tax Settings", icon: Receipt, href: "/settings/tax" },
      { title: "Store Settings", icon: Store, href: "/settings/store" },
      { title: "SEO Settings", icon: Search, href: "/settings/seo" },
      { title: "Notifications", icon: Bell, href: "/settings/notifications" }
    ]
  }
];