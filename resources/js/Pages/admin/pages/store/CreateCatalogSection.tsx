import React, { useState } from 'react';
import { 
  MoreVertical, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, 
  Plus, Trash2, Save, Edit2, CheckCircle, XCircle 
} from 'lucide-react';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';

// --- Types ---
type FilterField = 'discount' | 'price' | 'stock' | 'category_id' | 'brand_id';
type FilterOperator = '=' | '!=' | '>' | '>=' | '<' | '<=';

interface Filter {
  id: string;
  field: FilterField;
  operator: FilterOperator;
  value: string;
}

interface CatalogSection {
  id: number;
  name: string;
  active: boolean;
  filters: Filter[];
}

const ALLOWED_FIELDS: FilterField[] = ['discount', 'price', 'stock', 'category_id', 'brand_id'];
const OPERATORS: FilterOperator[] = ['=', '!=', '>', '>=', '<', '<='];

// --- Initial Data (Mimicking your Seeder) ---
const INITIAL_DATA: CatalogSection[] = [
  { 
    id: 1, name: 'Top Deals', active: true, 
    filters: [
      { id: 'f1', field: 'discount', operator: '>=', value: '20' },
      { id: 'f2', field: 'price', operator: '<', value: '100' }
    ]
  },
  { 
    id: 2, name: 'Picked For You', active: true, 
    filters: [
      { id: 'f3', field: 'stock', operator: '>', value: '0' },
      { id: 'f4', field: 'category_id', operator: '=', value: '3' }
    ]
  },
  { 
    id: 3, name: 'Featured', active: true, 
    filters: [
      { id: 'f5', field: 'brand_id', operator: '=', value: '5' }
    ]
  },
];

export default function CreateCatalogSection() {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  
  const [sections, setSections] = useState<CatalogSection[]>(INITIAL_DATA);
  const [editingSection, setEditingSection] = useState<CatalogSection | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // --- Handlers ---

  const handleOrderChange = async (id: number, action: 'up' | 'down' | 'top' | 'bottom') => {
    // Logic for PATCH request simulation
    console.log(`PATCH: section.order.patch | ID: ${id} | Action: ${action}`);

    const newSections = [...sections];
    const index = newSections.findIndex(s => s.id === id);
    if (index === -1) return;

    const [removed] = newSections.splice(index, 1);

    if (action === 'top') newSections.unshift(removed);
    else if (action === 'bottom') newSections.push(removed);
    else if (action === 'up') newSections.splice(Math.max(0, index - 1), 0, removed);
    else if (action === 'down') newSections.splice(Math.min(newSections.length, index + 1), 0, removed);
    
    setSections(newSections);
    setOpenMenuId(null);
  };

  const handleSave = () => {
    if (!editingSection) return;
    if (editingSection.id === 0) {
      setSections([...sections, { ...editingSection, id: Date.now() }]);
    } else {
      setSections(sections.map(s => s.id === editingSection.id ? editingSection : s));
    }
    setEditingSection(null);
  };

  const addFilterRow = () => {
    if (!editingSection) return;
    const newFilter: Filter = { id: crypto.randomUUID(), field: 'price', operator: '=', value: '' };
    setEditingSection({ ...editingSection, filters: [...editingSection.filters, newFilter] });
  };

  const updateFilter = (filterId: string, key: keyof Filter, value: string) => {
    if (!editingSection) return;
    const updatedFilters = editingSection.filters.map(f => 
      f.id === filterId ? { ...f, [key]: value } : f
    );
    setEditingSection({ ...editingSection, filters: updatedFilters });
  };

  const removeFilter = (filterId: string) => {
    if (!editingSection) return;
    setEditingSection({
      ...editingSection,
      filters: editingSection.filters.filter(f => f.id !== filterId)
    });
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh' }} className="p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Section Management</h1>
          <button 
            onClick={() => setEditingSection({ id: 0, name: '', active: true, filters: [] })}
            style={{ backgroundColor: theme.primary, color: theme.textInverse, borderRadius: theme.borderRadius }}
            className="px-5 py-2.5 flex items-center gap-2 font-medium hover:opacity-90 transition shadow-sm"
          >
            <Plus size={20} /> Create New Section
          </button>
        </header>

        {/* --- Table Section --- */}
        <div style={{ backgroundColor: theme.bgSecondary, borderRadius: theme.borderRadius, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }} className="overflow-hidden mb-12">
          <table className="w-full text-left">
            <thead style={{ backgroundColor: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-wider" style={{ color: theme.textSecondary }}>Section Name</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider" style={{ color: theme.textSecondary }}>Status</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-right" style={{ color: theme.textSecondary }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: theme.border }}>
              {sections.map((section) => (
                <tr key={section.id} style={{ backgroundColor: theme.card }} className="group">
                  <td className="px-6 py-4 font-semibold">{section.name}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-sm" style={{ color: section.active ? theme.success : theme.textMuted }}>
                      {section.active ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {section.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === section.id ? null : section.id)}
                      style={{ color: theme.textSecondary }}
                      className="p-2 hover:bg-black/5 rounded-full"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {/* Ordering Menu */}
                    {openMenuId === section.id && (
                      <div 
                        style={{ backgroundColor: theme.modal, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadius, boxShadow: theme.shadowLg }}
                        className="absolute right-8 top-12 w-52 z-50 p-1.5"
                      >
                        <OrderAction theme={theme} icon={<ArrowUp size={16}/>} label="Move Up" onClick={() => handleOrderChange(section.id, 'up')} />
                        <OrderAction theme={theme} icon={<ArrowDown size={16}/>} label="Move Down" onClick={() => handleOrderChange(section.id, 'down')} />
                        <OrderAction theme={theme} icon={<ChevronsUp size={16}/>} label="Move to Top" onClick={() => handleOrderChange(section.id, 'top')} />
                        <OrderAction theme={theme} icon={<ChevronsDown size={16}/>} label="Move to Bottom" onClick={() => handleOrderChange(section.id, 'bottom')} />
                        <div style={{ borderTop: `1px solid ${theme.border}`, margin: '6px 0' }} />
                        <OrderAction theme={theme} icon={<Edit2 size={16}/>} label="Edit Section" onClick={() => { setEditingSection(section); setOpenMenuId(null); }} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Dynamic Form Panel --- */}
        {editingSection && (
          <div 
            style={{ backgroundColor: theme.bgSecondary, border: `2px solid ${theme.primary}`, borderRadius: theme.borderRadius, boxShadow: theme.shadowLg }}
            className="p-8 animate-in slide-in-from-top-2 duration-300"
          >
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-xl font-bold">Configuring: {editingSection.name || 'New Section'}</h2>
              <button onClick={() => setEditingSection(null)} style={{ color: theme.textMuted }}>
                <XCircle size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-2">
                <label className="text-sm font-bold" style={{ color: theme.textSecondary }}>Section Display Name</label>
                <input 
                  type="text"
                  value={editingSection.name}
                  onChange={(e) => setEditingSection({...editingSection, name: e.target.value})}
                  placeholder="e.g. Summer Sale"
                  style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: theme.borderRadius }}
                  className="w-full p-3 focus:outline-none focus:ring-2 focus:ring-offset-2 ring-indigo-500"
                />
              </div>
              <div className="flex items-center gap-4 pt-8">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={editingSection.active}
                    onChange={(e) => setEditingSection({...editingSection, active: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  <span className="ml-3 text-sm font-medium">Status: {editingSection.active ? 'Active' : 'Hidden'}</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: theme.border }}>
                <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: theme.textSecondary }}>Filter Rules</h3>
                <button 
                  onClick={addFilterRow}
                  style={{ color: theme.link }} 
                  className="flex items-center gap-1 text-sm font-bold hover:underline"
                >
                  <Plus size={16} /> Add Rule
                </button>
              </div>

              {editingSection.filters.map((filter) => (
                <div key={filter.id} className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-black/5 p-3 rounded-lg">
                  <div className="flex-1 min-w-[150px]">
                    <select 
                      value={filter.field}
                      onChange={(e) => updateFilter(filter.id, 'field', e.target.value)}
                      style={{ backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadius }}
                      className="w-full p-2 text-sm"
                    >
                      {ALLOWED_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>

                  <div className="w-24">
                    <select 
                      value={filter.operator}
                      onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                      style={{ backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadius }}
                      className="w-full p-2 text-sm"
                    >
                      {OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[100px]">
                    <input 
                      type="text"
                      placeholder="Value..."
                      value={filter.value}
                      onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                      style={{ backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadius }}
                      className="w-full p-2 text-sm"
                    />
                  </div>

                  <button 
                    onClick={() => removeFilter(filter.id)}
                    style={{ color: theme.error }}
                    className="p-2 hover:bg-red-50 rounded-md transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              {editingSection.filters.length === 0 && (
                <div className="py-8 text-center text-sm" style={{ color: theme.textMuted }}>
                  No filters defined. This section will show all products.
                </div>
              )}
            </div>

            <div className="mt-10 flex justify-end gap-4 border-t pt-6" style={{ borderColor: theme.border }}>
              <button 
                onClick={() => setEditingSection(null)}
                style={{ color: theme.textSecondary }}
                className="px-6 py-2 hover:underline font-medium"
              >
                Discard
              </button>
              <button 
                onClick={handleSave}
                style={{ backgroundColor: theme.primary, color: theme.textInverse, borderRadius: theme.borderRadius }}
                className="px-8 py-2.5 font-bold flex items-center gap-2 shadow-md hover:brightness-110 transition"
              >
                <Save size={18} /> Update Catalog
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderAction({ theme, icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      style={{ color: theme.text, borderRadius: '6px' }}
      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-black/5 transition-colors"
    >
      <span style={{ color: theme.primary }}>{icon}</span>
      {label}
    </button>
  );
}
CreateCatalogSection.layout = (page : any) => <AdminLayout >{page}</AdminLayout>