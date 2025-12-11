
import { Eye, Edit2, Upload, MoreVertical, Copy, Trash2, Image as ImageIcon, ShoppingCart, Heart, Star, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';




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
  images: string[];
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
    images: [],
    updated_at: "2025-01-02T12:22:00Z",
  },
  {
    id: "2",
    title: "Minimalist Necklace",
    category: "Jewelry",
    price: 18,
    images: [
      "https://placehold.co/400x400?text=Necklace",
      "https://placehold.co/400x400?text=Img+2",
    ],
    updated_at: "2025-01-07T14:00:00Z",
    description: "A simple and elegant silver necklace.",
  },
];

export default function Drafts() {
  const [drafts, setDrafts] = useState<Product[]>(DUMMY_DRAFTS);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

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
    <div className="min-h-screen bg-gray-50">
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
      {previewProduct && (
        <PreviewModal product={previewProduct} onClose={() => setPreviewProduct(null)} />
      )}
    </div>
  );
}


Drafts.layout = (page : any) => <AdminLayout children={page} />


export function DraftRow({ product, onPreview, onEdit, onPublish, onDelete, onDuplicate }: DraftRowProps) {
  const [showMenu, setShowMenu] = useState(false);

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
    if (!product.images || product.images.length === 0) warnings.push('No cover images added yet');
    if (!product.title || product.title.trim() === '') warnings.push('Missing title');
    if (!product.category || product.category.trim() === '') warnings.push('Missing category');
    return warnings;
  };

  const warnings = getWarnings();
  const isIncomplete = warnings.length > 0;
  const hasImages = product.images && product.images.length > 0;
  const coverImage = hasImages ? product.images[0] : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4 flex items-center gap-4">
        <div className="flex-shrink-0">
          {coverImage ? (
            <img
              src={coverImage}
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


interface PreviewModalProps {
  product: Product;
  onClose: () => void;
}

export function PreviewModal({ product, onClose }: PreviewModalProps) {
  const hasImages = product.images && product.images.length > 0;
  const mainImage = hasImages ? product.images[0] : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">Product Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {mainImage ? (
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={mainImage}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {product.images.slice(0, 5).map((image, index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 cursor-pointer transition-colors"
                        >
                          <img
                            src={image}
                            alt={`${product.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">No image available</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.title || 'Untitled Product'}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className="text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(248 reviews)</span>
                </div>
                {product.price && (
                  <p className="text-4xl font-bold text-gray-900">
                    ${product.price}
                  </p>
                )}
              </div>

              {product.category && (
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>
              )}

              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {product.variants && Object.keys(product.variants).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Options
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(product.variants).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm font-medium text-gray-700 mb-2 capitalize">
                          {key}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(value) ? (
                            value.map((option, index) => (
                              <button
                                key={index}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                              >
                                {option}
                              </button>
                            ))
                          ) : (
                            <span className="text-gray-600">{String(value)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart size={20} />
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                <p>Free shipping on orders over $50</p>
                <p>30-day return policy</p>
                <p>Secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
