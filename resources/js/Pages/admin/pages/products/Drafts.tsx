
import { Eye, Edit2, Upload, MoreVertical, Copy, Trash2, Image as ImageIcon, ShoppingCart, Heart, Star, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { Cover } from '@/types/inventoryTypes';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';




interface DraftRowProps {
  product: Product;
  onPreview: () => void;
  onEdit: () => void;
  onPublish: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}


// Fake product interface
interface Product {
  id: string;
  title: string;
  category: string;
  price?: number;
  covers: Cover[];
  thumbnail : Cover
  description?: string;
  variants?: Record<string, any>;
  updated_at: string;
}

// Example dummy data
const DUMMY_DRAFTS: Product[] = [
  {
    id: "1",
    title: "Vintage Brown Hoodie",
    category: "Hoodies",
    price: 39,
    covers: [],
    thumbnail : {id : '3' , url : '/images/perpel.jpg'} ,
    updated_at: "2025-01-02T12:22:00Z",
  },
  {
    id: "2",
    title: "Minimalist Necklace",
    category: "Jewelry",
    price: 18,
    covers: [

    ],
    thumbnail : {id : '1' , url : '/images/red.jpg'} ,
    updated_at: "2025-01-07T14:00:00Z",
    description: "A simple and elegant silver necklace.",
  },
];

export default function Drafts({drafts : backendDrafts} : any) {
  const [drafts, setDrafts] = useState<Product[]>(backendDrafts ?? DUMMY_DRAFTS);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const {state : {currentTheme}} = useStoreConfigCtx()
 
  const handlePublish = (id: string) => {
    setDrafts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDelete = (id: string) => {
    setDrafts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDuplicate = (product: Product) => {
    const newCopy = {
      ...product,
      id: String(Date.now()),
      title: product.title + " (Copy)",
      updated_at: new Date().toISOString(),
    };

    setDrafts((prev) => [newCopy, ...prev]);
  };

  return (
    <div className="min-h-screen " 
     style={{ 
      background : currentTheme.bgSecondary  ,
      color  : currentTheme.text 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Drafts</h1>
            <p className="text-gray-600">
              These products are saved as drafts. Complete them and publish whenever you're ready.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            Create Product
          </button>
        </div>

        {/* Drafts List */}
        {drafts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-lg mb-4">No drafts yet</p>
            <p className="text-gray-400">Create your first product to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <DraftRow
                key={draft.id}
                product={draft}
                onPreview={() => setPreviewProduct(draft)}
                onEdit={() => console.log("Edit", draft.id)}
                onPublish={() => handlePublish(draft.id)}
                onDelete={() => handleDelete(draft.id)}
                onDuplicate={() => handleDuplicate(draft)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {/* {previewProduct && (
        <PreviewModal product={previewProduct} onClose={() => setPreviewProduct(null)} /> // single product page component
      )} */}
    </div>
  );
}


Drafts.layout = (page : any) => <AdminLayout children={page} />


export function DraftRow({ product, onPreview, onEdit, onPublish, onDelete, onDuplicate }: DraftRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const {state : {currentTheme}} = useStoreConfigCtx()
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const updated = new Date(date);
    const diffInHours = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const days = Math.floor(diffInHours / 24);
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  };

  const getWarnings = () => {
    const warnings: string[] = [];
    if (!product.price) warnings.push('Missing price');
    if (!product.covers || product.covers.length === 0) warnings.push('No cover images added yet');
    if (!product.title || product.title.trim() === '') warnings.push('Missing title');
    if (!product.category || product.category.trim() === '') warnings.push('Missing category');
    return warnings;
  };

  const warnings = getWarnings();
  const isIncomplete = warnings.length > 0;
  const hasImages = product.covers && product.covers.length > 0;
  const coverImage = product.thumbnail || null ;

  return (
    <div className="rounded-lg border hover:shadow-md transition-shadow"
    style={{ 
      background : currentTheme.card ,
      borderColor : currentTheme.border
     }}
    >
      <div className="p-4 flex items-center gap-4">
        <div className="flex-shrink-0">
          {coverImage ? (
            <img
              src={coverImage.url}
              alt={product.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="text-gray-400" size={32} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {product.title || 'Untitled Product'}
              </h3>
              <p className="text-sm text-gray-600">
                {product.category || 'No category'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                Draft
              </span>
              {isIncomplete && (
                <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                  Incomplete
                </span>
              )}
              {!hasImages && (
                <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                  Missing images
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Last edited: {getTimeAgo(product.updated_at)}</span>
            {product.price && (
              <span className="font-medium text-gray-700">${product.price}</span>
            )}
          </div>

          {warnings.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {warnings.map((warning, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full border border-red-200"
                >
                  {warning}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onPreview}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye size={18} />
            Preview
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit2 size={18} />
            Edit
          </button>
          <button
            onClick={onPublish}
            disabled={isIncomplete}
            className={`inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors ${
              isIncomplete
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Upload size={18} />
            Publish
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MoreVertical size={18} />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={() => {
                      onDuplicate();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Copy size={16} />
                    Duplicate
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this draft?')) {
                        onDelete();
                      }
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


