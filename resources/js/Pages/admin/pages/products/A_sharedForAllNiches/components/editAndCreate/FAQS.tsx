import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { Plus, Trash2, HelpCircle, GripVertical } from 'lucide-react';
import React, { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type Faq = {
  question: string;
  answer: string;
};

// ─── Single FAQ Item ──────────────────────────────────────────────────────────
function FaqItem({
  faq,
  index,
  currentTheme,
  onChange,
  onRemove,
}: {
  faq: Faq;
  index: number;
  currentTheme: any;
  onChange: (index: number, field: 'question' | 'answer', value: string) => void;
  onRemove: (index: number) => void;
}) {
  const [focused, setFocused] = useState<'question' | 'answer' | null>(null);

  return (
    <div
      className="rounded-xl p-4 mb-3 group transition-all duration-200"
      style={{
        backgroundColor: currentTheme.bg,
        border: `1.5px solid ${currentTheme.border}`,
        boxShadow: currentTheme.shadow,
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-2 mb-3">
        <GripVertical
          size={14}
          className="opacity-30 cursor-grab"
          style={{ color: currentTheme.textMuted }}
        />
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: currentTheme.textMuted }}
        >
          FAQ #{index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 rounded-lg"
          style={{ color: currentTheme.error }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Question */}
      <div className="mb-3">
        <label
          className="block text-xs font-semibold mb-1 uppercase tracking-wide"
          style={{ color: currentTheme.textSecondary }}
        >
          Question
        </label>
        <input
          type="text"
          value={faq.question}
          placeholder="e.g. What material is this made of?"
          onFocus={() => setFocused('question')}
          onBlur={() => setFocused(null)}
          onChange={(e) => onChange(index, 'question', e.target.value)}
          className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150"
          style={{
            backgroundColor: currentTheme.bgSecondary,
            color: currentTheme.text,
            borderWidth: '1.5px',
            borderStyle: 'solid',
            borderColor: focused === 'question' ? currentTheme.primary : currentTheme.border,
            outline: 'none',
          }}
        />
      </div>

      {/* Answer */}
      <div>
        <label
          className="block text-xs font-semibold mb-1 uppercase tracking-wide"
          style={{ color: currentTheme.textSecondary }}
        >
          Answer
        </label>
        <textarea
          value={faq.answer}
          placeholder="Write a clear, helpful answer..."
          onFocus={() => setFocused('answer')}
          onBlur={() => setFocused(null)}
          onChange={(e) => onChange(index, 'answer', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg text-sm font-medium resize-none transition-all duration-150"
          style={{
            backgroundColor: currentTheme.bgSecondary,
            color: currentTheme.text,
            borderWidth: '1.5px',
            borderStyle: 'solid',
            borderColor: focused === 'answer' ? currentTheme.primary : currentTheme.border,
            outline: 'none',
          }}
        />
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyFaqs({ currentTheme }: { currentTheme: any }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-10 rounded-xl"
      style={{
        border: `2px dashed ${currentTheme.border}`,
        backgroundColor: currentTheme.bg,
      }}
    >
      <HelpCircle size={32} className="mb-3 opacity-30" style={{ color: currentTheme.textMuted }} />
      <p className="text-sm font-medium mb-1" style={{ color: currentTheme.textMuted }}>
        No FAQs yet
      </p>
      <p className="text-xs opacity-60" style={{ color: currentTheme.textMuted }}>
        Add questions customers commonly ask about this product
      </p>
    </div>
  );
}

// ─── Main FAQs Section ────────────────────────────────────────────────────────
function FaqsSection() {
  const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();
  const {
    state: { currentTheme },
  } = useStoreConfigCtx();

  const faqs: Faq[] = basicInfoForm.faqs ?? [];

  const addFaq = () => {
    setBasicInfoForm({
      ...basicInfoForm,
      faqs: [...faqs, { question: '', answer: '' }],
    });
  };

  const removeFaq = (index: number) => {
    setBasicInfoForm({
      ...basicInfoForm,
      faqs: faqs.filter((_, i) => i !== index),
    });
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = faqs.map((faq, i) =>
      i === index ? { ...faq, [field]: value } : faq
    );
    setBasicInfoForm({ ...basicInfoForm, faqs: updated });
  };

  return (
    <div className="p-5">
      {/* FAQ count badge */}
      {faqs.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-xs font-bold px-2 py-1 rounded-full"
            style={{
              backgroundColor: currentTheme.accent + '20',
              color: currentTheme.accent,
            }}
          >
            {faqs.length} FAQ{faqs.length !== 1 ? 's' : ''}
          </span>
          <span className="text-xs" style={{ color: currentTheme.textMuted }}>
            Shown as accordion on product page
          </span>
        </div>
      )}

      {/* FAQ list or empty state */}
      {faqs.length === 0 ? (
        <EmptyFaqs currentTheme={currentTheme} />
      ) : (
        faqs.map((faq, index) => (
          <FaqItem
            key={index}
            faq={faq}
            index={index}
            currentTheme={currentTheme}
            onChange={updateFaq}
            onRemove={removeFaq}
          />
        ))
      )}

      {/* Add FAQ button */}
      <button
        type="button"
        onClick={addFaq}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-150"
        style={{
          backgroundColor: 'transparent',
          color: currentTheme.primary,
          border: `1.5px dashed ${currentTheme.primary}`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = currentTheme.primary + '10';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
        }}
      >
        <Plus size={16} />
        Add FAQ
      </button>
    </div>
  );
}

export default FaqsSection;