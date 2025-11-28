import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, AlertTriangle } from 'lucide-react';
import { InventoryProduct } from '@/types/dashboardTypes';
import { mockInventory, reorderRecommendations, stockByCategoryData } from './fkData/mockData';
import { ReorderRecommendationsList } from './dashboardComponents/ReorderRecommendationsList';
import { StockByCategoryChart } from './dashboardComponents/StockByCategoryChart';
import { ProductDialog } from './dashboardComponents/ProductDialog';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';

export default function Inventory() {
  const [products, setProducts] = useState<InventoryProduct[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStock = stockFilter === 'all' || product.status === stockFilter;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEditProduct = (product: InventoryProduct) => {
    setSelectedProduct(product);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const getProductStatus = (stockQuantity: number): 'in-stock' | 'low-stock' | 'out-of-stock' => {
    if (stockQuantity === 0) return 'out-of-stock';
    if (stockQuantity < 20) return 'low-stock';
    return 'in-stock';
  };

  const handleSaveProduct = (formData: Omit<InventoryProduct, 'id' | 'status'>) => {
    const status = getProductStatus(formData.stockQuantity);
    
    if (dialogMode === 'add') {
      const newProduct: InventoryProduct = {
        ...formData,
        id: `PROD-${String(products.length + 1).padStart(3, '0')}`,
        status,
      };
      setProducts([...products, newProduct]);
    } else if (selectedProduct) {
      setProducts(products.map((p) =>
        p.id === selectedProduct.id ? { ...p, ...formData, status } : p
      ));
    }
  };

  const getStatusColor = (status: InventoryProduct['status']) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockByCategoryChart data={stockByCategoryData} />
        </div>
        <div>
          <ReorderRecommendationsList items={reorderRecommendations} />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Inventory Details</h3>
        </div>
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Reorder Point</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Turnover Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Last Restocked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stockQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.reorderPoint || 20}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                      {product.status === 'in-stock' ? 'In Stock' : product.status === 'low-stock' ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.turnoverRate?.toFixed(1)}x</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {product.lastRestocked ? new Date(product.lastRestocked).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No products found matching your criteria.
          </div>
        )}
      </div>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        onSave={handleSaveProduct}
        mode={dialogMode}
      />
    </div>
  );
}


Inventory.layout = (page:any) => <AdminLayout children={page} />
