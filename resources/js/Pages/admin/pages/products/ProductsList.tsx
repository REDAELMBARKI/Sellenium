import { useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Pencil, Trash2, Image as ImageIcon, Star, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { formatCurrency } from "@/admin/utils/helpers";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { ImagePreviewItem } from "@/types/mediaTypes";
import { Cover } from "@/types/inventoryTypes";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { useColorsCtx } from "@/contextHooks/useColorsCtx";
import { SectionHeader } from "@/admin/components/layout/SectionHeader";
import { PaginationSlide } from "@/components/ui/PaginationSlide";
import CustomSelect from "@/components/ui/CustomSelect";
import CustomSelectForObject from "@/components/ui/CustomSelectForObject";

// ===================== TYPES =====================
export interface ProductListItem {
  id: string;
  name: string;
  brand?: string;
  price: string;
  compareAtPrice?: string;
  stockQuantity?: number;
  sku?: string;
  thumbnail?: Cover | ImagePreviewItem | null;
  category: { id: string; name: string }[];
  isFeatured?: boolean;
  status: "active" | "draft" | "inactive";
}


interface ProductsResponse {
  data: ProductListItem[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: { url: string | null; label: string; active: boolean }[];
}




// ===================== PLACEHOLDER DATA =====================
const MOCK_PRODUCTS: ProductListItem[] = [
  {
    id: "1",
    name: "Basic White T‑Shirt",
    brand: "Essential",
    price: "19.99",
    stockQuantity: 34,
    sku: "TSH-WHT-001",
    status: "active",
    isFeatured: true,
    thumbnail: null,
    category: [{ id: "1", name: "Tops" }, { id: "4", name: "Casual" }],
  },
  {
    id: "2",
    name: "Slim Fit Jeans",
    brand: "Urban Wear",
    price: "59.00",
    stockQuantity: 6,
    sku: "JNS-BLK-021",
    status: "active",
    isFeatured: false,
    thumbnail: null,
    category: [{ id: "2", name: "Bottoms" }],
  },
  {
    id: "3",
    name: "Oversized Hoodie",
    brand: "StreetLab",
    price: "79.90",
    stockQuantity: 0,
    sku: "HD-OVR-332",
    status: "draft",
    isFeatured: true,
    thumbnail: null,
    category: [{ id: "3", name: "Hoodies" }, { id: "5", name: "Winter" }],
  },
];

// ===================== COMPONENT =====================
export default function ProductsList({ response }: { response?: ProductsResponse }) {

  const products = response ? response?.data  : MOCK_PRODUCTS; 
  const {currentTheme : theme} = useColorsCtx();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const deleteProduct = () => {
    if (!deleteId) return;
    setDeleteId(null);
  };

  return (
    <div 
      className="space-y-6 p-6 min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.bgSecondary} 100%)`,
      }}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full -top-[250px] -right-[250px] animate-pulse"
          style={{
            background: `radial-gradient(circle, ${theme.accent}10 0%, transparent 70%)`,
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full -bottom-[200px] -left-[200px] animate-pulse"
          style={{
            background: `radial-gradient(circle, ${theme.info}10 0%, transparent 70%)`,
            animationDelay: '2s',
          }}
        />
      </div>

      <div>
       
        <SectionHeader title="Products" description="Manage your product inventory with precision" Icon={Package} >
          <Button 
          onClick={() => router.visit("/products/create")}
          className="hover:scale-105 transition-transform"
          style={{
            background: `linear-gradient(135deg, ${theme.buttonPrimary} 0%, ${theme.accentHover} 100%)`,
            boxShadow: `0 4px 15px ${theme.accent}40`,
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
        </SectionHeader>
        
      </div>

      <Card 
        className="overflow-hidden"
        style={{
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: theme.borderRadius,
          boxShadow: theme.shadowLg,
        }}
      >
        <CardHeader style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search 
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" 
                style={{ color: theme.textMuted }}
              />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="transition-all focus:scale-[1.02]"
                style={{
                  border: `2px solid ${theme.border}`,
                }}
              >
                <Search size={16} />
              </Input>
            </div>
           
            <CustomSelectForObject
            label="Filter by Status"
            value={{value: statusFilter , label : statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) }}
            onChange={(option : {value:string , label:string}) => setStatusFilter(option.value)} 
            options={[{label : "All Status" , value : "all" } ,
            {label : "Active" , value : "active" } ,
            {label : "Draft" , value : "draft" } ,
            {label : "Inactive" , value : "inactive"}
            ]}

             />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredProducts.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ background: theme.bgSecondary, borderBottom: `2px solid ${theme.border}` }}>
                      <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Product</TableHead>
                      <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Categories</TableHead>
                      <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>SKU</TableHead>
                      <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Price</TableHead>
                      <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Stock</TableHead>
                      <TableHead style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Status</TableHead>
                      <TableHead className="text-right" style={{ color: theme.textSecondary, fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow 
                        key={product.id}
                        className="hover:bg-opacity-50 transition-colors"
                        style={{ 
                          borderBottom: `1px solid ${theme.border}`,
                          background: theme.bg,
                        }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {product.thumbnail ? (
                              <img
                                src={(product.thumbnail as any).url}
                                alt={product.name}
                                className="h-14 w-14 rounded-lg object-cover"
                                style={{ border: `2px solid ${theme.border}` }}
                              />
                            ) : (
                              <div 
                                className="flex h-14 w-14 items-center justify-center rounded-lg"
                                style={{
                                  background: `linear-gradient(135deg, ${theme.gray100} 0%, ${theme.gray200} 100%)`,
                                  border: `2px solid ${theme.border}`,
                                }}
                              >
                                <ImageIcon className="h-6 w-6" style={{ color: theme.textMuted }} />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold" style={{ color: theme.text }}>
                                  {product.name}
                                </p>
                                {product.isFeatured && (
                                  <Star 
                                    size={14} 
                                    style={{ color: theme.warning }} 
                                    fill={theme.warning}
                                  />
                                )}
                              </div>
                              {product.brand && (
                                <p className="text-sm" style={{ color: theme.textMuted }}>
                                  {product.brand}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {product.category.map((cat) => (
                              <span
                                key={cat.id}
                                className="px-2 py-1 rounded-md text-xs font-semibold"
                                style={{
                                  background: `${theme.info}15`,
                                  color: theme.info,
                                  border: `1px solid ${theme.info}30`,
                                }}
                              >
                                {cat.name}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span 
                            className="font-mono text-sm px-2 py-1 rounded"
                            style={{
                              background: theme.gray100,
                              color: theme.textSecondary,
                            }}
                          >
                            {product.sku ?? "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold" style={{ color: theme.text }}>
                            {formatCurrency(product.price)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {product.stockQuantity !== undefined && product.stockQuantity < 10 ? (
                            <Badge 
                              variant="destructive"
                              className="font-semibold"
                              style={{
                                background: `${theme.error}15`,
                                color: theme.error,
                                border: `1px solid ${theme.error}30`,
                              }}
                            >
                              Low: {product.stockQuantity}
                            </Badge>
                          ) : (
                            <span style={{ color: theme.textSecondary, fontWeight: '500' }}>
                              {product.stockQuantity ?? "—"}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className="capitalize font-semibold"
                            style={{
                              background: product.status === 'active' 
                                ? `${theme.success}15`
                                : product.status === 'draft'
                                ? `${theme.warning}15`
                                : `${theme.textMuted}15`,
                              color: product.status === 'active'
                                ? theme.success
                                : product.status === 'draft'
                                ? theme.warning
                                : theme.textMuted,
                              border: `1px solid ${
                                product.status === 'active'
                                  ? theme.success
                                  : product.status === 'draft'
                                  ? theme.warning
                                  : theme.textMuted
                              }30`,
                            }}
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.visit(`/products/${product.id}/edit`)}
                              className="hover:scale-110 transition-transform"
                              style={{
                                border: `1px solid ${theme.border}`,
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(product.id)}
                              className="hover:scale-110 transition-transform"
                              style={{
                                border: `1px solid ${theme.border}`,
                                color: theme.error,
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}

              {(response && response.current_page && response.last_page > 1) && (
             <PaginationSlide
             currentPage={response?.current_page}
             totalPages={response?.last_page}
             pages={( response?.links ?? [])
             .filter(link => link.url)
             .map(link => link.label === "Previous" || link.label === "Next" ? null : parseInt(link.label))
             .filter(Boolean) as number[]}
              onPageChange={(page) => router.get("/products", { page })}
               />

             )}

            </>
          ) : (
            <div className="py-16 text-center flex flex-col items-center gap-6">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center animate-bounce"
                style={{
                  background: `linear-gradient(135deg, ${theme.gray100} 0%, ${theme.gray200} 100%)`,
                  boxShadow: theme.shadowMd,
                }}
              >
                <Package size={56} style={{ color: theme.textMuted }} />
              </div>
              <div>
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ color: theme.text }}
                >
                  No Products Found
                </h3>
                <p 
                  className="text-base mb-6"
                  style={{ color: theme.textMuted }}
                >
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your filters or search term'
                    : 'Get started by adding your first product'}
                </p>
                <Button
                  onClick={() => router.visit("/products/create")}
                  className="hover:scale-105 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, ${theme.buttonPrimary} 0%, ${theme.accentHover} 100%)`,
                    boxShadow: `0 4px 15px ${theme.accent}40`,
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {deleteId && (
        <DeleteConfirmationModal
          name={"with id: " + deleteId}
          entityType="product"
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={deleteProduct}
        />
      )}
    </div>
  );
}

ProductsList.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;