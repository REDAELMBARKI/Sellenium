import React, { useState } from 'react';
import { Grid, List, Edit2, Trash2, Eye, Plus, Check, ChevronDown } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';

const placeholderColors = [
  { id: 1, name: 'Navy Blue', code: '#001F3F', types: ['Shirts', 'Jackets'], count: 12, status: 'active', texture: '', image: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Dusty Pink', code: '#D7A9A3', types: ['Hoodies'], count: 4, status: 'inactive', texture: '', image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Forest Green', code: '#228B22', types: ['Pants', 'Jackets'], count: 8, status: 'active', texture: '', image: 'https://via.placeholder.com/50' },
  { id: 4, name: 'Sunset Orange', code: '#FF6347', types: ['Shirts'], count: 6, status: 'active', texture: '', image: 'https://via.placeholder.com/50' },
];

export default function ManageColors() {
  const [view, setView] = useState('table');
  const [colors, setColors] = useState(placeholderColors);
  const [selectedColor, setSelectedColor] = useState<typeof placeholderColors | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Manage Colors</h1>
            <p className="text-gray-600">Organize and manage your product color palette</p>
          </div>
          <button 
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5"
            onClick={() => { setSelectedColor(null); setIsModalOpen(true); }}
          >
            <Plus size={20} />
            Add Color
          </button>
        </div>

        {/* Filters and View Toggle */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            <Select.Root defaultValue="all">
              <Select.Trigger className="inline-flex items-center justify-between gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-40">
                <Select.Value placeholder="All Types" />
                <Select.Icon>
                  <ChevronDown size={16} />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <Select.Viewport className="p-1">
                    <Select.Item value="all" className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900 hover:bg-blue-50 hover:text-blue-700 cursor-pointer outline-none">
                      <Select.ItemText>All Types</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="shirts" className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900 hover:bg-blue-50 hover:text-blue-700 cursor-pointer outline-none">
                      <Select.ItemText>Shirts</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="pants" className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900 hover:bg-blue-50 hover:text-blue-700 cursor-pointer outline-none">
                      <Select.ItemText>Pants</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="jackets" className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900 hover:bg-blue-50 hover:text-blue-700 cursor-pointer outline-none">
                      <Select.ItemText>Jackets</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="hoodies" className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900 hover:bg-blue-50 hover:text-blue-700 cursor-pointer outline-none">
                      <Select.ItemText>Hoodies</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
            
            <input 
              type="text" 
              placeholder="Search colors..." 
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-64"
            />
            
            <div className="ml-auto flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setView('grid')} 
                className={`p-2 rounded-md transition-all duration-200 ${view === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Grid size={20} />
              </button>
              <button 
                onClick={() => setView('table')} 
                className={`p-2 rounded-md transition-all duration-200 ${view === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {view === 'grid' ? (
          <ColorGrid 
            colors={colors} 
            onEdit={(c) => { setSelectedColor(c); setIsModalOpen(true); }} 
            onDelete={(c) => { setSelectedColor(c); setIsDeleteModalOpen(true); }} 
          />
        ) : (
          <ColorTable 
            colors={colors} 
            onEdit={(c) => { setSelectedColor(c); setIsModalOpen(true); }} 
            onDelete={(c) => { setSelectedColor(c); setIsDeleteModalOpen(true); }} 
          />
        )}

        {/* Modals */}
        {isModalOpen && (
          <ColorModal 
            color={selectedColor} 
            onClose={() => { setSelectedColor(null); setIsModalOpen(false); }} 
            onSave={(colorData) => {
              // Handle save logic here
              console.log('Saving color:', colorData);
              setIsModalOpen(false);
              setSelectedColor(null);
            }}
          />
        )}
        
        {isDeleteModalOpen && selectedColor && (
          <DeleteConfirmationModal
            name={selectedColor.name}
            isOpen={isDeleteModalOpen}
            onConfirm={() => {
              setColors(colors.filter(c => c.id !== selectedColor.id));
              setIsDeleteModalOpen(false);
              setSelectedColor(null);
            }}
            onClose={() => { 
              setIsDeleteModalOpen(false); 
              setSelectedColor(null); 
            }}
          />
        )}
      </div>
    </div>
  );
}

ManageColors.layout = (page:any) => <AdminLayout children={page} />

function ColorGrid({ colors, onEdit, onDelete }) {
 

  const handleViewProducts = (color) => {
    alert(`Show products using ${color.name}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen " 
    
    style={{paddingInline:'20px'}}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Color Grid</h1>
        
        {/* GRID CONTAINER - Responsive grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 " >
          {colors.map(c => (
            <div 
              key={c.id} style={{padding:'12px'}}
              className="bg-white  rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              {/* [FLEX CONTAINER] - Contains color preview and text */}
              <div className="flex gap-3 items-center mb-4">
                {/* [COLOR BOX] - This is the color preview that may not be appearing */}
                <div 
                  className="rounded-xl border-2 border-gray-200 shadow-inner shrink-0" 
                  style={{ 
                    width: 'clamp(3rem, 10vw, 4rem)',
                    height: 'clamp(3rem, 10vw, 4rem)',
                    padding: '0.5rem',
                    backgroundColor: c.code
                  }} 
                />
                
                {/* Color Name and Code */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{c.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">{c.code}</p>
                </div>
              </div>
              
              {/* Product Types Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {c.types.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                    {t}
                  </span>
                ))}
              </div>
              
              {/* Product Count and Status */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{c.count}</span> products
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {c.status}
                </span>
              </div>
              
              {/* Edit and Delete Buttons */}
              <div className="flex gap-2">
                <button 
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                  onClick={() => onEdit(c)}
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button 
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors duration-200 border border-red-200"
                  onClick={() => onDelete(c)}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
              
              {/* View Products Button */}
              <button 
                className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                onClick={() => handleViewProducts(c)}
              >
                <Eye size={14} />
                View Products
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ColorTable({ colors, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Preview</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Types</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Products</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">View Products</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {colors.map(c => (
            <tr key={c.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4">
                <div 
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm flex-shrink-0" 
                  style={{ 
                    backgroundColor: c.code,
                    backgroundImage: c.texture ? `url(${c.texture})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} 
                />
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-medium text-gray-900">{c.name}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-mono text-gray-600">{c.code}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2 flex-wrap">
                  {c.types.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                      {t}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-900 font-medium">{c.count}</span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${c.status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {c.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                    onClick={() => onEdit(c)}
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors duration-200 border border-red-200"
                    onClick={() => onDelete(c)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </td>
              <td className="px-6 py-4">
                <button 
                  className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => alert(`Show products using ${c.name}`)}
                >
                  <Eye size={14} />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ColorModal({ color, onClose, onSave }) {
  const [colorValue, setColorValue] = useState(color?.code || '#3B82F6');
  const [colorName, setColorName] = useState(color?.name || '');
  const [altNames, setAltNames] = useState('');
  const [selectedTypes, setSelectedTypes] = useState(color?.types || []);

  const productTypes = ['Shirts', 'Pants', 'Jackets', 'Hoodies', 'Shoes'];

  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSave = () => {
    onSave({
      name: colorName,
      code: colorValue,
      altNames,
      types: selectedTypes
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
          <h2 className="text-2xl font-bold text-white">
            {color ? 'Edit Color' : 'Add New Color'}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {color ? 'Update color details' : 'Create a new color for your palette'}
          </p>
        </div>
        
        <div className="p-6 space-y-5">
          {/* Color Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Color Preview
            </label>
            <div className="flex gap-4 items-center">
              <div className="relative">
                <input 
                  type="color" 
                  value={colorValue}
                  onChange={(e) => setColorValue(e.target.value)}
                  className="w-24 h-24 rounded-xl border-4 border-gray-200 cursor-pointer shadow-inner"
                />
              </div>
              <div className="flex-1">
                <input 
                  type="text"
                  value={colorValue}
                  onChange={(e) => setColorValue(e.target.value)}
                  placeholder="#HEX Code" 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Color Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Color Name
            </label>
            <input 
              type="text"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="e.g., Navy Blue" 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Alternative Names */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Alternative Names <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input 
              type="text"
              value={altNames}
              onChange={(e) => setAltNames(e.target.value)}
              placeholder="e.g., Dark Blue, Midnight Blue" 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Product Types */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Types
            </label>
            <div className="flex flex-wrap gap-2">
              {productTypes.map(type => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button 
                    key={type}
                    onClick={() => toggleType(type)}
                    type="button"
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3">
          <button 
            onClick={onClose}
            type="button"
            className="flex-1 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            type="button"
            className="flex-1 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
          >
            {color ? 'Update Color' : 'Add Color'}
          </button>
        </div>
      </div>
    </div>
  );
}