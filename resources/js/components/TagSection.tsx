import { useState, useRef, useEffect } from 'react';
import { Plus, Tag, TagIcon, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { Input } from './ui/input';
import EmptyListSection from '@/admin/components/partials/EmptyListSection';

interface TagInputProps {
  tags: string[];
}

const TagSection: React.FC<TagInputProps> = ({ tags }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [suggestions, setSuggestions] = useState<string[]>(['winter', 'summer']);

  const { state: { currentTheme } } = useStoreConfigCtx();
  const { setValue } = useProductDataCtx();

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions.filter(
        (s) => s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions, tags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setValue('tags', [...tags, trimmed]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter((t) => t !== tagToRemove));
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inputValue.trim()) addTag(inputValue);
    else inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSuggestions.length > 0) addTag(filteredSuggestions[0]);
      else if (inputValue.trim()) addTag(inputValue);
    }
  };

  return (
    <div className="space-y-4">
      <style>{`
        .search-box { display:flex; max-width:100%; align-items:center; justify-content:space-between; gap:8px; border-radius:0.375rem; position:relative; background:${currentTheme.bg}; border:2px solid ${currentTheme.border}; }
        .search-button { color:white; position:absolute; right:4px; width:30px; height:35px; border-radius:0.375rem; background:${currentTheme.primary}; border:0; display:inline-flex; align-items:center; justify-content:center; transition: all 300ms cubic-bezier(.23,1,.32,1); cursor:pointer; }
        .search-button:hover { background-color:${currentTheme.primaryHover}; box-shadow: rgba(0,0,0,0.3) 0 10px 20px; transform: translateY(-3px); }
        .search-button:active { box-shadow:none; transform:translateY(0); }
        .search-input { border:none; background:none; outline:none; color:${currentTheme.text}; font-size:15px; padding:16px 60px 16px 20px; width:100%; font-weight:500; border-radius:0.375rem; }
        .search-input::placeholder { color:${currentTheme.text}; opacity:0.5; }
        .suggestion-tag { transition: all 200ms cubic-bezier(.23,1,.32,1); }
        .suggestion-tag:hover { transform: translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.15); }
        .themed-scroll { scrollbar-width: thin; scrollbar-color: ${currentTheme.accent} transparent; }
        .themed-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .themed-scroll::-webkit-scrollbar-track { background: transparent; }
        .themed-scroll::-webkit-scrollbar-thumb { background-color: ${currentTheme.accent}; border-radius: 999px; }
      `}</style>

      {/* Input */}
      <div className="relative">
        <div className="search-box">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a tag..."
            className="search-input"
          />
          <Button  type="button" onClick={handleAddClick} className="search-button">
            <Plus className="w-6 h-6" color={currentTheme.accent} />
          </Button>
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-2 rounded-md shadow-lg overflow-hidden"
            style={{ backgroundColor: currentTheme.bg, borderWidth: '2px', borderColor: currentTheme.border }}
          >
            <div className="max-h-48 overflow-y-auto themed-scroll">
              {filteredSuggestions.map((s) => (
                <Button
                  key={s}
                  type="button"
                  onClick={() => addTag(s)}
                  className="w-full px-5 py-3 text-left transition-colors font-medium"
                  style={{ color: currentTheme.textInverse, background: currentTheme.secondary }}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Tags */}
      <div
        className="rounded-md p-4 overflow-y-auto themed-scroll"
        style={{
          backgroundColor: currentTheme.bgSecondary,
          borderWidth: '2px',
          borderColor: currentTheme.border,
          maxHeight: '240px',
          minHeight: '80px',
        }}
      >
        {tags.length === 0 ? (
    
          <EmptyListSection 
          Icon={Tag} 
          description='Add tags to organize your product'
          />
        ) : (
          <div className="flex flex-col gap-1">
            {tags.map((tag) => (
              <div
                key={tag}
                className="w-full flex items-center justify-between px-3 py-2 text-sm"
                style={{
                  backgroundColor: `${currentTheme.accent}12`,
                  border: `1px solid ${currentTheme.accent}40`,
                  borderRadius: currentTheme.borderRadius,
                  color: currentTheme.text,
                }}
              >
                <span className="capitalize">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: currentTheme.error ?? '#ef4444' }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSection;