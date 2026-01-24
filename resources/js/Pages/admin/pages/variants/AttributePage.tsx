// Main page component for attribute management

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AttributeSwitcher } from './AttributeSwitcher';
import { AttributeWorkspace } from './AttributeWorkspace';
import type { Attribute, AttributeValue } from './types';
import { AddAttributeModal } from './AddAttributeModal';
import { AddValueModal } from './AddValueModal';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';

const MOCK_ATTRIBUTES: Attribute[] = [
  { id: '1', name: 'Color', displayType: 'color-swatches' },
  { id: '2', name: 'Size', displayType: 'radio' },
  { id: '3', name: 'Material', displayType: 'dropdown' },
  { id: '4', name: 'Fit', displayType: 'buttons' },
];

const MOCK_VALUES: AttributeValue[] = [
  { id: 'v1', attributeId: '1', name: 'Red', hexColor: '#FF0000' },
  { id: 'v2', attributeId: '1', name: 'Blue', hexColor: '#0000FF' },
  { id: 'v3', attributeId: '1', name: 'Black', hexColor: '#000000' },
  { id: 'v4', attributeId: '2', name: 'S' },
  { id: 'v5', attributeId: '2', name: 'M' },
  { id: 'v6', attributeId: '2', name: 'L' },
  { id: 'v7', attributeId: '2', name: 'XL' },
];

 function AttributePage() {
  const [attributes, setAttributes] = useState<Attribute[]>(MOCK_ATTRIBUTES);
  const [values, setValues] = useState<AttributeValue[]>(MOCK_VALUES);
  const [activeAttributeId, setActiveAttributeId] = useState<string>(MOCK_ATTRIBUTES[0].id);
  const [isAddAttributeOpen, setIsAddAttributeOpen] = useState(false);
  const [isAddValueOpen, setIsAddValueOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [editingValue, setEditingValue] = useState<AttributeValue | null>(null);
  const {state : {currentTheme}} = useStoreConfigCtx(); // color all the page using this theme
  
  const activeAttribute = attributes.find((a) => a.id === activeAttributeId);

  const handleAddAttribute = (attribute: Omit<Attribute, 'id'>) => {
    const newAttribute: Attribute = {
      ...attribute,
      id: Math.random().toString(36).substr(2, 9),
    };
    setAttributes([...attributes, newAttribute]);
    setActiveAttributeId(newAttribute.id);
    setIsAddAttributeOpen(false);
    setEditingAttribute(null);
  };

  const handleUpdateAttribute = (id: string, updates: Partial<Attribute>) => {
    setAttributes(attributes.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    setIsAddAttributeOpen(false);
    setEditingAttribute(null);
  };

  const handleAddValue = (value: Omit<AttributeValue, 'id'>) => {
    const newValue: AttributeValue = {
      ...value,
      id: Math.random().toString(36).substr(2, 9),
    };
    setValues([...values, newValue]);
    setIsAddValueOpen(false);
    setEditingValue(null);
  };

  const handleUpdateValue = (id: string, updates: Partial<AttributeValue>) => {
    setValues(values.map((v) => (v.id === id ? { ...v, ...updates } : v)));
    setIsAddValueOpen(false);
    setEditingValue(null);
  };

  const handleDeleteValue = (id: string) => {
    setValues(values.filter((v) => v.id !== id));
  };

  const handleBulkDeleteValues = (ids: string[]) => {
    setValues(values.filter((v) => !ids.includes(v.id)));
  };

  const handleEditAttribute = (attribute: Attribute) => {
    setEditingAttribute(attribute);
    setIsAddAttributeOpen(true);
  };

  const handleEditValue = (value: AttributeValue) => {
    setEditingValue(value);
    setIsAddValueOpen(true);
  };

  const attributeValues = values.filter((v) => v.attributeId === activeAttributeId);

  return (
    <div className="min-h-screen p-6" style={{ background: currentTheme.bg, color: currentTheme.text }}>
      <Card className="mx-auto max-w-7xl" style={{ background: currentTheme.card, borderColor: currentTheme.border, color: currentTheme.text }}>
        <AttributeSwitcher
          attributes={attributes}
          values={values}
          activeAttributeId={activeAttributeId}
          onAttributeSelect={setActiveAttributeId}
          onAddAttribute={() => setIsAddAttributeOpen(true)}
          onEditAttribute={handleEditAttribute}
        />
        {activeAttribute && (
          <AttributeWorkspace
            attribute={activeAttribute}
            values={attributeValues}
            onAddValue={() => setIsAddValueOpen(true)}
            onEditValue={handleEditValue}
            onDeleteValue={handleDeleteValue}
            onBulkDeleteValues={handleBulkDeleteValues}
            onEditAttribute={() => handleEditAttribute(activeAttribute)}
          />
        )}
      </Card>

  <AddAttributeModal
        open={isAddAttributeOpen}
        onOpenChange={setIsAddAttributeOpen}
        onSubmit={(data) => {
          if (editingAttribute) {
            handleUpdateAttribute(editingAttribute.id, data);
          } else {
            handleAddAttribute(data);
          }
        }}
        initialData={editingAttribute || undefined}
      />

  {activeAttribute && (
        <AddValueModal
          open={isAddValueOpen}
          onOpenChange={setIsAddValueOpen}
          attribute={activeAttribute}
          onSubmit={(data) => {
            if (editingValue) {
              handleUpdateValue(editingValue.id, data);
            } else {
              handleAddValue(data);
            }
          }}
          initialData={editingValue || undefined}
        />

      )}
    </div>
  );
}

export default AttributePage ;

AttributePage.layout = (page : any) => <AdminLayout  children={page} />