import { Eye, Edit2, Upload, MoreVertical, Copy, Trash2, Image as ImageIcon, Plus, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Category } from '@/types/inventoryTypes';
import { isEmpty } from 'lodash';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Variant {
  id: string;
  price: number;
  compare_price?: number;
  stock: number;
  sku?: string;
  is_default: boolean;
  attrs: Record<string, any>;
}

interface Media {
  id: string;
  url: string;
  collection: string;
  media_type: string;
}

interface Product {
  id: string;
  name: string;
  brand?: string;
  description : string , 
  nich_category?: Category;
  sub_categories : Category[] ,
  thumbnail?: Media | null;
  updated_at: string;
  quality_score: number;
  ready_to_publish: boolean;
  variants : Variant[]
  status: 'draft' | 'published';
}

interface DraftRowProps {
  draft: Product;
  onPreview: () => void;
  onEdit: () => void;
  onPublish: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDefaultVariant(variants?: Variant[]): Variant | null {
  if (!variants || variants.length === 0) return null;
  return variants.find((v) => v.is_default) ?? variants[0];
}

function getMinPrice(variants?: Variant[]): number | null {
  if (!variants || variants.length === 0) return null;
  const prices = variants.map((v) => v.price).filter((p) => p > 0);
  return prices.length > 0 ? Math.min(...prices) : null;
}

function getWarnings(draft: Product): string[] {
  const warnings: string[] = [];
  if (!draft.name || draft.name.trim() === '')   warnings.push('Missing name');
  if (!draft.description || draft.name.trim() === '')   warnings.push('Missing description');
  if (!draft.thumbnail)                           warnings.push('Missing thumbnail');
  if (!draft.nich_category || isEmpty(draft.nich_category)) warnings.push('Missing category');
  if (draft.sub_categories.length < 1)                       warnings.push('Missing sub categories');
  return warnings;
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  return `${days}d ago`;
}

// ─── Score Bar ────────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 75 ? '#22c55e' :
    score >= 50 ? '#f59e0b' :
                  '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-xs font-medium" style={{ color }}>
        {score}%
      </span>
    </div>
  );
}

// ─── Draft Row ────────────────────────────────────────────────────────────────

export function DraftRow({ draft, onPreview, onEdit, onPublish, onDelete, onDuplicate }: DraftRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { state: { currentTheme } } = useStoreConfigCtx();

  const warnings      = getWarnings(draft);
  const isIncomplete  = warnings.length > 0;
  const minPrice      = getMinPrice(draft.variants);
  const variantCount  = draft.variants?.length ?? 0;
  const coverImage    = draft.thumbnail?.url ?? null;

  return (
    <div
      className="rounded-xl border transition-all hover:shadow-md"
      style={{ background: currentTheme.card, borderColor: currentTheme.border, color: currentTheme.text }}
    >
      <div className="p-4 flex items-center gap-4">

        {/* Thumbnail */}
        <div className="flex-shrink-0">
          {coverImage ? (
            <img src={coverImage} alt={draft.name} className="w-20 h-20 object-cover rounded-lg" />
          ) : (
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="text-gray-400" size={28} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-1.5">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold truncate">
                {draft.name || 'Untitled Product'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                
                {draft.brand && ` · ${draft.brand}`}
              </p>
              <div>
                  <p>Niche : {draft.nich_category?.name ?? 'No category'}</p>
                   <p>Sub Categories : {draft.sub_categories.map(c => c.name).join(',') ?? 'No category'}</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="px-2.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                Draft
              </span>
              {isIncomplete && (
                <span className="px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                  Incomplete
                </span>
              )}
              {draft.ready_to_publish && !isIncomplete && (
                <span className="px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  Ready
                </span>
              )}
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
            <span>Edited {getTimeAgo(draft.updated_at)}</span>

            {/* Price from variants */}
            {minPrice !== null && (
              <span className="font-semibold text-gray-700">
                {variantCount > 1 ? `From $${minPrice}` : `$${minPrice}`}
              </span>
            )}

            {/* Variant count */}
            {variantCount > 0 && (
              <span>{variantCount} variant{variantCount !== 1 ? 's' : ''}</span>
            )}

            {/* Quality score */}
            <ScoreBar score={draft.quality_score} />
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {warnings.map((w, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs font-medium bg-red-50 text-red-500 rounded-full border border-red-200"
                >
                  {w}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onPreview}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye size={15} /> Preview
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit2 size={15} /> Edit
          </button>
          <button
            onClick={onPublish}
            disabled={isIncomplete}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isIncomplete
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Upload size={15} /> Publish
          </button>

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MoreVertical size={16} />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={() => { onDuplicate(); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Copy size={14} /> Duplicate
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this draft?')) onDelete(); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Delete
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Drafts({ drafts: backendDrafts }: { drafts: Product[] }) {
  const [drafts, setDrafts] = useState<Product[]>(backendDrafts ?? []);
  const { state: { currentTheme } } = useStoreConfigCtx();
  const handlePublish = (id: string) =>
    setDrafts((prev) => prev.filter((p) => p.id !== id));
  const handleDelete = (id: string) =>
    setDrafts((prev) => prev.filter((p) => p.id !== id));

  const handleDuplicate = (product: Product) => {
    const copy: Product = {
      ...product,
      id: String(Date.now()),
      name: product.name + ' (Copy)',
      updated_at: new Date().toISOString(),
      status: 'draft',
      ready_to_publish: false,
      quality_score: 0,
      thumbnail: null,
    };
    setDrafts((prev) => [copy, ...prev]);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: currentTheme.bgSecondary, color: currentTheme.text }}
    >
      <div className="max-w-100% mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Drafts</h1>
            <p className="text-sm text-gray-500">
              {drafts.length} product{drafts.length !== 1 ? 's' : ''} saved as draft
            </p>
          </div>
          <button
            onClick={() => router.visit(route('products.storeDraft'), { method: 'post' })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> New Product
          </button>
        </div>

        {/* List */}
        {drafts.length === 0 ? (
          <div className="text-center py-20 rounded-xl border-2 border-dashed border-gray-200">
            <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium mb-1">No drafts yet</p>
            <p className="text-gray-400 text-sm">Create your first product to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map((draft) => (
              <DraftRow
                key={draft.id}
                draft={draft}
                onPreview={() => {}}
                onEdit={() => router.visit(route('product.edit', draft.id))}
                onPublish={() => handlePublish(draft.id)}
                onDelete={() => handleDelete(draft.id)}
                onDuplicate={() => handleDuplicate(draft)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Drafts.layout = (page: any) => <AdminLayout children={page} />;