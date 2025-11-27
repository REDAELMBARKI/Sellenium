import React, {JSX ,  useState } from 'react';
import { Edit2, Trash2, Eye, Plus, Check, X, ChevronDown, Copy, MoreVertical, Search } from 'lucide-react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import SelectByRadix from '@/components/ui/SelectByRadix';
import { SectionHeader } from '@/admin/components/layout/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MoreOptions from '@/components/ui/moreOptions';

interface Size {
  id: number;
  value: string;
  categories: string[];
  count: number;
  status: 'active' | 'inactive';
  notes: string;
}

interface SizeFormData {
  value: string;
  categories: string[];
  status: 'active' | 'inactive';
  notes: string;
}

const ManageSizes: React.FC & { layout?: (page: any) => JSX.Element } = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSizeModal, setShowSizeModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const categories: string[] = ['all', 'topwear', 'bottomwear', 'footwear', 'underwear'];
  const categoryLabels: Record<string, string> = {
    all: 'All Categories',
    topwear: 'Topwear',
    bottomwear: 'Bottomwear',
    footwear: 'Footwear',
    underwear: 'Underwear'
  };
  
  const [sizes, setSizes] = useState<Size[]>([
    { id: 1, value: 'XS', categories: ['topwear', 'bottomwear'], count: 12, status: 'active', notes: '' },
    { id: 2, value: 'S', categories: ['topwear', 'bottomwear'], count: 28, status: 'active', notes: '' },
    { id: 3, value: 'M', categories: ['topwear', 'bottomwear'], count: 45, status: 'active', notes: '' },
    { id: 4, value: 'L', categories: ['topwear', 'bottomwear'], count: 38, status: 'active', notes: '' },
    { id: 5, value: 'XL', categories: ['topwear', 'bottomwear'], count: 22, status: 'active', notes: '' },
    { id: 6, value: '2XL', categories: ['topwear', 'bottomwear'], count: 15, status: 'active', notes: '' },
    { id: 7, value: '3XL', categories: ['topwear'], count: 8, status: 'active', notes: '' },
    { id: 8, value: '28', categories: ['bottomwear'], count: 8, status: 'active', notes: 'Waist size' },
    { id: 9, value: '30', categories: ['bottomwear'], count: 14, status: 'active', notes: 'Waist size' },
    { id: 10, value: '32', categories: ['bottomwear'], count: 19, status: 'active', notes: 'Waist size' },
    { id: 11, value: '34', categories: ['bottomwear'], count: 16, status: 'inactive', notes: 'Waist size' },
    { id: 12, value: '36', categories: ['bottomwear'], count: 12, status: 'active', notes: 'Waist size' },
    { id: 13, value: '38', categories: ['bottomwear'], count: 9, status: 'inactive', notes: 'Waist size' },
    { id: 14, value: '7', categories: ['footwear'], count: 10, status: 'active', notes: 'US Size' },
    { id: 15, value: '8', categories: ['footwear'], count: 15, status: 'active', notes: 'US Size' },
    { id: 16, value: '9', categories: ['footwear'], count: 18, status: 'active', notes: 'US Size' },
    { id: 17, value: '10', categories: ['footwear'], count: 12, status: 'active', notes: 'US Size' },
    { id: 18, value: '11', categories: ['footwear'], count: 14, status: 'inactive', notes: 'US Size' },
    { id: 19, value: '12', categories: ['footwear'], count: 11, status: 'active', notes: 'US Size' },
    { id: 20, value: 'S/M', categories: ['underwear'], count: 20, status: 'active', notes: '' },
    { id: 21, value: 'L/XL', categories: ['underwear'], count: 18, status: 'active', notes: '' },
  ]);

  const [formData, setFormData] = useState<SizeFormData>({
    value: '',
    categories: [],
    status: 'active',
    notes: ''
  });

  const filteredSizes: Size[] = sizes.filter(size => {
    const matchesCategory = selectedCategory === 'all' || size.categories.includes(selectedCategory);
    const matchesStatus = selectedStatus === 'all' || size.status === selectedStatus;
    const matchesSearch = size.value.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleSelectAll = (): void => {
    if (selectedSizes.length === filteredSizes.length) {
      setSelectedSizes([]);
      setShowBulkActions(false);
    } else {
      setSelectedSizes(filteredSizes.map(s => s.id));
      setShowBulkActions(true);
    }
  };

  const handleSelectSize = (id: number): void => {
    const newSelected = selectedSizes.includes(id)
      ? selectedSizes.filter(sId => sId !== id)
      : [...selectedSizes, id];
    
    setSelectedSizes(newSelected);
    setShowBulkActions(newSelected.length > 0);
  };

  const handleBulkActivate = (): void => {
    setSizes(sizes.map(s => selectedSizes.includes(s.id) ? { ...s, status: 'active' } : s));
    setSelectedSizes([]);
    setShowBulkActions(false);
  };

  const handleBulkDeactivate = (): void => {
    setSizes(sizes.map(s => selectedSizes.includes(s.id) ? { ...s, status: 'inactive' } : s));
    setSelectedSizes([]);
    setShowBulkActions(false);
  };

  const handleBulkDelete = (): void => {
    if (window.confirm(`Delete ${selectedSizes.length} sizes?`)) {
      setSizes(sizes.filter(s => !selectedSizes.includes(s.id)));
      setSelectedSizes([]);
      setShowBulkActions(false);
    }
  };

  const handleAddSize = (): void => {
    setSelectedSize(null);
    setFormData({ value: '', categories: [], status: 'active', notes: '' });
    setShowSizeModal(true);
  };

  const handleEditSize = (size: Size): void => {
    setSelectedSize(size);
    setFormData({
      value: size.value,
      categories: size.categories,
      status: size.status,
      notes: size.notes
    });
    setShowSizeModal(true);
    setOpenDropdown(null);
  };

  const handleDuplicateSize = (size: Size): void => {
    const newSize: Size = {
      ...size,
      id: Date.now(),
      value: `${size.value} Copy`,
      count: 0
    };
    setSizes([...sizes, newSize]);
    setOpenDropdown(null);
  };

  const handleDeleteSize = (size: Size): void => {
    setSelectedSize(size);
    setShowDeleteModal(true);
    setOpenDropdown(null);
  };

  const confirmDelete = (): void => {
    if (selectedSize) {
      setSizes(sizes.filter(s => s.id !== selectedSize.id));
    }
    setShowDeleteModal(false);
    setSelectedSize(null);
  };

  const handleSaveSize = (): void => {
    if (selectedSize) {
      setSizes(sizes.map(s => s.id === selectedSize.id ? { ...s, ...formData } : s));
    } else {
      setSizes([...sizes, { ...formData, id: Date.now(), count: 0 }]);
    }
    setShowSizeModal(false);
  };

  const toggleCategory = (category: string): void => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleDropdown = (id: number): void => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <SectionHeader title='Manage Sizes'  description="Organize and manage all your fashion sizes">
           <Button>
                 <Plus size={18} />
                 Create size
           </Button>
        </SectionHeader>
        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-200">
          <div className="flex flex-wrap gap-3 items-center">
            

            <SelectByRadix value={selectedCategory} setter={setSelectedCategory}   elements={categories}/>
            

            {/* // active / inactive */}
            
            <SelectByRadix value={selectedStatus} setter={setSelectedStatus}   elements={['all' , 'Active Only' , 'Inactive Only']}/>

         
            <Input 
               type="text"
              placeholder="Search sizes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1  rounded-lg  bg-white text-gray-900 placeholder-gray-400 text-sm transition-all"
            >
            
              <Search size={18}  />
            </Input>

            <div className="text-sm text-gray-600">
              {filteredSizes.length} {filteredSizes.length === 1 ? 'size' : 'sizes'}
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-blue-900">
                {selectedSizes.length} selected
              </span>
              <button
                onClick={() => {
                  setSelectedSizes([]);
                  setShowBulkActions(false);
                }}
                className="text-sm text-blue-700 hover:text-blue-900 underline"
              >
                Clear selection
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBulkActivate}
                className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Activate
              </button>
              <button
                onClick={handleBulkDeactivate}
                className="px-4 py-1.5 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Deactivate
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedSizes.length === filteredSizes.length && filteredSizes.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Categories</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSizes.map(size => (
                <tr 
                  key={size.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedSizes.includes(size.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size.id)}
                      onChange={() => handleSelectSize(size.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                        <span className="text-base font-bold text-blue-700">{size.value}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{size.value}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {size.categories.map(cat => (
                        <span key={cat} className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200 capitalize">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{size.count}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                      size.status === 'active' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {size.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{size.notes || '—'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditSize(size)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => alert(`View products with size ${size.value}`)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Products"
                      >
                        <Eye size={16} />
                      </button>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleDropdown(size.id)
                          }}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="More"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openDropdown === size.id && (
                           <MoreOptions >
                            <button
                                onClick={() => handleDuplicateSize(size)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Copy size={14} />
                                Duplicate
                              </button>
                              <button
                                onClick={() => handleDeleteSize(size)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                           </MoreOptions>                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSizes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium mb-1">No sizes found</p>
              <p className="text-sm">Try adjusting your filters or add a new size</p>
            </div>
          )}
        </div>

        {/* Size Modal */}
        {showSizeModal && (
          <SizeModal
            size={selectedSize}
            formData={formData}
            setFormData={setFormData}
            toggleCategory={toggleCategory}
            onClose={() => setShowSizeModal(false)}
            onSave={handleSaveSize}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedSize && (
          <DeleteConfirmationModal
            name={selectedSize.value}
            onConfirm={confirmDelete}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedSize(null);
            }}
            isOpen={showDeleteModal}
          />
        )}
      </div>
    </div>
  );
};

interface SizeModalProps {
  size: Size | null;
  formData: SizeFormData;
  setFormData: React.Dispatch<React.SetStateAction<SizeFormData>>;
  toggleCategory: (category: string) => void;
  onClose: () => void;
  onSave: () => void;
}

function SizeModal({ size, formData, setFormData, toggleCategory, onClose, onSave }: SizeModalProps) {
  const productCategories: string[] = ['topwear', 'bottomwear', 'footwear', 'underwear'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
          <h2 className="text-2xl font-bold text-white">
            {size ? 'Edit Size' : 'Add New Size'}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {size ? 'Update size details' : 'Create a new size for your products'}
          </p>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Size Value
            </label>
            <input
              type="text"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="e.g., M, 32, 8"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {productCategories.map(cat => {
                const isSelected = formData.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    type="button"
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center gap-2 capitalize ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            type="button"
            className="flex-1 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            type="button"
            className="flex-1 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
          >
            {size ? 'Update Size' : 'Add Size'}
          </button>
        </div>
      </div>
    </div>
  );
}

ManageSizes.layout = (page: any) => <AdminLayout children={page} />;

export default ManageSizes;