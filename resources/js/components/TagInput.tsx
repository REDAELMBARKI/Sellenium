import { useState, useRef, useEffect } from 'react';
import { Plus, Tag, TagIcon } from 'lucide-react';
import SelectedChip from './ui/SelectedChip';
import { Button } from './ui/button';
import { useColorsCtx } from '@/contextHooks/useColorsCtx';


interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagSection: React.FC<TagInputProps> = ({ tags, onTagsChange}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const suggestions = ["Luxury", "Summer", "Floral", "Woody", "Fresh", "Evening", "Citrus", "Spicy", "Oriental", "Casual"];
   const { currentTheme } = useColorsCtx();
 
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
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTag(inputValue);
    } else {
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If there are filtered suggestions, add the first one
      if (filteredSuggestions.length > 0) {
        addTag(filteredSuggestions[0]);
      } else if (inputValue.trim()) {
        // Otherwise, add what the user typed
        addTag(inputValue);
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-4">
      <style>{`
        .search-box {
          display: flex;
          max-width: 100%;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          border-radius: 0.375rem;
          position: relative;
          background: ${currentTheme.bg};
          border: 2px solid ${currentTheme.border};
        }
        
        .search-button {
          color: white;
          position: absolute;
          right: 4px;
          width: 44px;
          height: 44px;
          border-radius: 0.375rem;
          background: ${currentTheme.buttonPrimary};
          border: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
          cursor: pointer;
        }
        
        .search-button:hover {
          background-color: ${currentTheme.buttonHover};
          box-shadow: rgba(0, 0, 0, 0.3) 0 10px 20px;
          transform: translateY(-3px);
        }
        
        .search-button:active {
          box-shadow: none;
          transform: translateY(0);
        }
        
        .search-input {
          border: none;
          background: none;
          outline: none;
          color: ${currentTheme.text};
          font-size: 15px;
          padding: 16px 60px 16px 20px;
          width: 100%;
          font-weight: 500;
          border-radius: 0.375rem;
        }
        
        .search-input::placeholder {
          color: ${currentTheme.text};
          opacity: 0.5;
        }

        .suggestion-tag {
          transition: all 200ms cubic-bezier(.23, 1, 0.32, 1);
        }

        .suggestion-tag:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div className="relative">
        <div className="search-box">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a tag..."
            className="search-input"
          />
          <button
            type="button"
            onClick={handleAddClick}
            className="search-button"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-2 rounded-md shadow-lg overflow-hidden"
            style={{
              backgroundColor: currentTheme.bg,
              borderWidth: '2px',
              borderColor: currentTheme.border,
            }}
          >
            <div className="max-h-48 overflow-y-auto">
              {filteredSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  onClick={() => addTag(suggestion)}
                  className="w-full px-5 py-3 text-left hover:bg-gray-100 transition-colors font-medium"
                  style={{ color: currentTheme.text }}
                >
                  {suggestion} 
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className="rounded-md p-6 min-h-32"
        style={{ backgroundColor: '#f3f4f6', borderWidth: '2px', borderColor: currentTheme.border }}
      >
        {tags.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Tag className="w-12 h-12 text-gray-400 mb-3" />
            <div className="text-gray-500 font-medium text-lg">No tags</div>
            <div className="text-gray-400 text-sm mt-1">Add tags to organize your product</div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <SelectedChip key={tag} label={tag} onRemove={() => removeTag(tag)} removable />
            ))}
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div 
          className="rounded-md p-6 space-y-4"
          style={{ 
            backgroundColor: '#e5e7eb',
            borderWidth: '2px',
            borderColor: currentTheme.border 
          }}
        >
          <h4 
            className="text-sm font-bold uppercase tracking-wide" 
            style={{ color: currentTheme.text }}
          >
            Tag Suggestions (Recently Used)
          </h4>
          <div className="flex flex-wrap gap-2">
            {suggestions
              .filter((s) => !tags.includes(s))
              .slice(0, 10)
              .map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  onClick={() => addTag(suggestion)}
                  className="suggestion-tag px-4 py-2 rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: currentTheme.bg,
                    color: currentTheme.text,
                    borderWidth: '2px',
                    borderColor: currentTheme.border,
                  }}
                >
                  <TagIcon />
                  {suggestion}

                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSection;