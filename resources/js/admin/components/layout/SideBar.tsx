import { menuItems } from '@/admin/data/adminNavigationsLinks';
import { Link, router, usePage } from '@inertiajs/react';
import {
  Home,
  LayoutDashboard,
  Layers,
  List,
  FileText,
  Table,
  MapPin,
  BarChart3,
  Monitor,
  FileCode,
  Menu as MenuIcon,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Settings,
  Bell,
  Image,
  Type,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { useState} from 'react';

// Types
interface SubLink {
  title: string;
  href: string;
  icon: typeof Home;
}

interface MenuItem {
  title: string;
  icon: typeof Home;
  href?: string;
  badge?: string | number;
  badgeColor?: string;
  subLinks?: SubLink[];
  section?: boolean;
  sectionTitle?: string;
}


// Color Palette
const colors = {
  sidebarBg: '#1e293b',
  sidebarFg: '#cbd5e1',
  sidebarBorder: '#334155',
  sidebarHover: '#334155',
  sidebarMuted: '#475569',
  sidebarMutedFg: '#94a3b8',
  sidebarActive: '#6366f1',
  sidebarActiveFg: '#ffffff',
  badgeSuccess: '#10b981',
  badgeInfo: '#3bf670ff',
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>('Dashboard');
  const {url} = usePage()
  const toggleExpanded = (itemTitle: string) => {
    if (expandedItem === itemTitle) {
      setExpandedItem(null);
    } else {
      setExpandedItem(itemTitle);
    }
  };
  
  

  return (
    <div
      style={{
        backgroundColor: colors.sidebarBg,
        color: colors.sidebarFg,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${colors.sidebarBorder}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        width: collapsed ? '80px' : '256px',
        overflow: 'hidden',
      }}
    >
      {/* Logo Header */}
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${colors.sidebarBorder}`,
          backgroundColor: colors.sidebarBg,
        }}
      >
        {!collapsed && (
          <div
            style={{
              color: colors.sidebarFg,
              fontWeight: 700,
              fontSize: '1.25rem',
              letterSpacing: '-0.025em',
            }}
          >
            Ecom
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              color: colors.sidebarMutedFg,
              padding: '0.5rem',
              borderRadius: '0.375rem',
              transition: 'all 0.2s',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.sidebarFg;
              e.currentTarget.style.backgroundColor = colors.sidebarHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.sidebarMutedFg;
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          {!collapsed && (
            <>
              <button
                title="Toggle menu"
                style={{
                  color: colors.sidebarMutedFg,
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.sidebarFg;
                  e.currentTarget.style.backgroundColor = colors.sidebarHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.sidebarMutedFg;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <MenuIcon size={20} />
              </button>
              <button
                title="More options"
                style={{
                  color: colors.sidebarMutedFg,
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.sidebarFg;
                  e.currentTarget.style.backgroundColor = colors.sidebarHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.sidebarMutedFg;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <MoreVertical size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div
        className="sidebar-scroll"
        style={{
        
          flex: 1,
          overflowY: 'auto',
          paddingTop: '1rem',
          paddingBottom: '1rem',
         
        }}
      >
        <nav style={{ paddingBlock: '0 0.75rem' }}>
          {menuItems.map((item, index) => {
            // Section Header
            if (item.section) {
              return (
                <div
                  key={`section-${index}`}
                  style={{
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    paddingLeft: '0.5rem',
                    paddingRight: '0.5rem',
                    marginTop: index > 0 ? '1rem' : '0',
                  }}
                >
                  {!collapsed && (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <div
                          style={{
                            height: '1px',
                            flex: 1,
                            backgroundColor: colors.sidebarBorder,
                          }}
                        />
                      </div>
                      <h4
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: colors.sidebarMutedFg,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          paddingLeft: '0.5rem',
                        }}
                      >
                        {item.sectionTitle}
                      </h4>
                    </>
                  )}
                  {collapsed && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '9999px',
                          backgroundColor: colors.sidebarMuted,
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            }

            const Icon = item.icon;
            const isExpanded = expandedItem === item.title;
            const hasActiveChild = item.subLinks?.some((sub) => sub.href === url);

            return (
              <div
                key={item.title}
                style={{
                   

                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  backgroundColor: isExpanded && !collapsed ? `${colors.sidebarHover}80` : 'transparent',
                  marginBottom: '0.25rem',
                 
                }}
              >
                <button
                  onClick={() => {
                    if (item.subLinks) {
                      toggleExpanded(item.title);
                    }
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                 
                    transition: 'all 0.2s',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor:
                      isExpanded || hasActiveChild
                        ? colors.sidebarActive
                        : 'transparent',
                    color:
                      isExpanded || hasActiveChild
                        ? colors.sidebarActiveFg
                        : colors.sidebarFg,
                  }}
                  onMouseEnter={(e) => {
                    if (!isExpanded && !hasActiveChild) {
                      e.currentTarget.style.backgroundColor = colors.sidebarHover;
                      e.currentTarget.style.color = colors.sidebarFg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded && !hasActiveChild) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = colors.sidebarFg;
                    }
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      minWidth: 0,
                    }}
                  >
                    <Icon
                      size={20}
                      style={{
                        flexShrink: 0,
                        transition: 'transform 0.2s',
                        transform: isExpanded || hasActiveChild ? 'scale(1.1)' : 'scale(1)',
                      }}
                    />
                    {!collapsed && (
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.title}
                      </span>
                    )}
                  </div>

                  {!collapsed && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flexShrink: 0,
                      }}
                    >
                      {item.badge && (
                        <span
                          style={{
                            backgroundColor: item.badgeColor || colors.badgeSuccess,
                            color: '#ffffff',
                            fontSize: '0.75rem',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                            fontWeight: 500,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.subLinks && (
                        <ChevronDown
                          size={16}
                          style={{
                            transition: 'transform 0.3s',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      )}
                    </div>
                  )}
                </button>

                {/* Sub  links */}
                {item.subLinks && isExpanded && !collapsed && (
                  <div
                    style={{
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      animation: 'fadeIn 0.3s ease-out',
                    }}
                  >
                    {item.subLinks.map((subLink, subIndex) => {
                      const SubIcon = subLink.icon;
                      const isSubActive = url === subLink.href;

                      return (
                        <Link
                          key={subLink.href}
                          href={subLink.href}
                         
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.625rem 1rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            transition: 'all 0.2s ease-out',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            backgroundColor: isSubActive
                              ? colors.sidebarActive
                              : 'transparent',
                            color: isSubActive
                              ? colors.sidebarActiveFg
                              : colors.sidebarMutedFg,
                            animationDelay: `${subIndex * 30}ms`,
                            marginBottom: '0.25rem',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor = colors.sidebarHover;
                              e.currentTarget.style.color = colors.sidebarFg;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = colors.sidebarMutedFg;
                            }
                          }}
                        >
                          <div
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '9999px',
                              transition: 'all 0.2s',
                              backgroundColor: isSubActive
                                ? colors.sidebarActiveFg
                                : colors.sidebarMuted,
                              transform: isSubActive ? 'scale(1.25)' : 'scale(1)',
                            }}
                          />
                          <SubIcon
                            size={16}
                            style={{
                              flexShrink: 0,
                              transition: 'transform 0.2s',
                              transform: isSubActive ? 'scale(1.1)' : 'scale(1)',
                            }}
                          />
                          <span
                            style={{
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {subLink.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .sidebar-scroll::-webkit-scrollbar {
            width: 4px;
          }
          
          .sidebar-scroll::-webkit-scrollbar-track {
            background: ${colors.sidebarBg};
          }
          
          .sidebar-scroll::-webkit-scrollbar-thumb {
            background: ${colors.sidebarMuted};
            border-radius: 2px;
          }
          
          .sidebar-scroll::-webkit-scrollbar-thumb:hover {
            background: ${colors.sidebarMutedFg};
          }
        `}
      </style>
    </div>
  );
}
