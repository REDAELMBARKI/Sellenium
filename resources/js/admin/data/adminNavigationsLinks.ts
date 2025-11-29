
import { 
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Zap,
  Package,
  List,
  Plus,
  Pencil,
  Trash,
  Upload,
  Star,
  Palette,
  Ruler,
  FolderTree,
  GitBranch,
  MessageSquare,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Users,
  Crown,
  Tag,
  Box,
  AlertTriangle,
  History as HistoryIcon,
  Warehouse,
  Flag,
  Megaphone,
  Mail,
  Image as ImageIcon,
  Percent,
  FileText,
  DollarSign,
  PieChart,
  Ship,
  Map as MapIcon,
  Truck,
  Navigation,
  BookOpen,
  File as FileIcon,
  Shield,
  Lock as LockIcon,
  Settings,
  Sliders,
  CreditCard,
  Receipt,
  Store,
  Search,
  Bell,
  Layers,
  Settings2,
  
} from 'lucide-react';

interface SubLink {
  title: string;
  icon: React.ElementType;
  href: string;
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  badge?: number;
  badgeColor?: string;
  subLinks?: SubLink[];
  section?:boolean ; 
  sectionTitle? : string 
}


export const menuItems: MenuItem[] = [
  // ANALYTICS & OVERVIEW
  {
    section: true,
    sectionTitle: "Analytics & Overview",
    icon: BarChart3,
    title: 'analytics'
  },
  { 
    title: "Dashboard", 
    icon: LayoutDashboard, 
    href: "/dashboard",
    subLinks: [
      { title: "sales", icon: BarChart3, href: "/dashboard/sales_analytics" },
      { title: "customers", icon: TrendingUp, href: "/dashboard/customers_analytics" },
      { title: "inventory", icon: Zap, href: "/dashboard/inventory_analytics" }
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

  // CATALOG MANAGEMENT
  {
    section: true,
    sectionTitle: "Catalog Management",
    icon: Package,
    title: 'catalog'
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
      { title: "Color Manager", icon: Palette, href: "/variants/colors" }, 
      { title: "Fit Manager", icon: Palette, href: "/variants/fits" }, 
      { title: "Material Manager", icon: Palette, href: "/variants/materials" }, 
      { title: "Size Manager", icon: Ruler, href: "/variants/sizes" },
    ]
  },
  { 
    title: "Categories", 
    icon: FolderTree, 
    href: "",
    subLinks: [
      { title: "All Categories", icon: List, href: "/categories" },
      { title: "Add Category", icon: Plus, href: "/categories/add" },
      { title: "Edit Category", icon: Pencil, href: "/categories/edit" },
      { title: "Delete Category", icon: Trash, href: "/categories/delete" },
      { title: "Category Tree", icon: GitBranch, href: "/categories/tree" }
    ]
  },
  { 
    title: "Inventory", 
    icon: Box, 
    href: "/admin/inventory",
    subLinks: [
      { title: "Stock Levels", icon: BarChart3, href: "/inventory/stock" },
      { title: "Low Stock Alert", icon: AlertTriangle, href: "/inventory/low-stock" },
      { title: "Stock History", icon: HistoryIcon, href: "/inventory/history" },
      { title: "Warehouses", icon: Warehouse, href: "/inventory/warehouses" }
    ]
  },

  // SALES & ORDERS
  {
    section: true,
    sectionTitle: "Sales & Orders",
    icon: ShoppingCart,
    title: 'sales'
  },
  { 
    title: "Orders", 
    icon: ShoppingCart, 
    href: "/orders",
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
    title: "Shipping", 
    icon: Ship, 
    href: "/admin/shipping",
    subLinks: [
      { title: "Shipping Zones", icon: MapIcon, href: "/shipping/zones" },
      { title: "Shipping Rates", icon: DollarSign, href: "/shipping/rates" },
      { title: "Carriers", icon: Truck, href: "/shipping/carriers" },
      { title: "Track Shipments", icon: Navigation, href: "/shipping/tracking" }
    ]
  },

  // CUSTOMERS & COMMUNICATIONS
  {
    section: true,
    sectionTitle: "Customers & Communications",
    icon: Users,
    title: 'customers'
  },
  { 
    title: "Customers", 
    icon: Users, 
    href: "",
    subLinks: [
      { title: "All Customers", icon: List, href: "/customers" },
      { title: "VIP Customers", icon: Crown, href: "/customers/vip" },
      { title: "Customer Groups", icon: Users, href: "/customers/groups" },
      { title: "Customer Analytics", icon: BarChart3, href: "/customers/analytics" }
    ]
  },
  { 
    title: "Messages", 
    icon: MessageSquare, 
    href: "/messages",
    badge: 5,
    badgeColor: 'bg-red-500',
    subLinks: [
      { title: "Messages", icon: List, href: "/messages" },
    ]
  },
  { 
    title: "Reviews", 
    icon: MessageSquare, 
    href: "/admin/reviews",
    badge: 12,
    badgeColor: 'bg-orange-500',
    subLinks: [
      { title: "All Reviews", icon: List, href: "/reviews" },
      { title: "Pending Approval", icon: Clock, href: "/reviews/pending" },
      { title: "Approved", icon: CheckCircle, href: "/reviews/approved" },
      { title: "Reported Reviews", icon: Flag, href: "/reviews/reported" }
    ]
  },

  // MARKETING & PROMOTIONS
  {
    section: true,
    sectionTitle: "Marketing & Promotions",
    icon: Megaphone,
    title: 'marketing'
  },
  { 
    title: "Marketing", 
    icon: Megaphone, 
    href: "/admin/marketing",
    subLinks: [
      { title: "Email Campaigns", icon: Mail, href: "/marketing/email" },
      { title: "Banners", icon: ImageIcon, href: "/marketing/banners" },
      { title: "Promotions", icon: Percent, href: "/marketing/promotions" },
      { title: "Newsletter", icon: FileText, href: "/marketing/newsletter" }
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

  // CONFIGURATIONS
  {
    section: true,
    sectionTitle: "Configurations",
    icon: Settings2,
    title: 'configurations'
  },
  { 
    title: "Admins", 
    href: '', 
    icon: Shield, 
    subLinks: [
      { title: "All Admins", icon: List, href: "/admins" },
      { title: "Add Admin", icon: Plus, href: "/admins/create" },
      { title: "Roles & Permissions", icon: LockIcon, href: "/admins/roles" },
      { title: "Activity Log", icon: HistoryIcon, href: "/admins/activity" }
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
