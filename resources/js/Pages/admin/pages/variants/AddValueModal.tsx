// Context-aware modal for adding/editing attribute values

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Attribute   , AttributeValue} from './types';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';

interface AddValueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attribute: Attribute;
  onSubmit: (data: Omit<AttributeValue, 'id'>) => void;
  initialData?: AttributeValue;
}

export function AddValueModal(props: Readonly<AddValueModalProps>) {
  const { open, onOpenChange, attribute, onSubmit, initialData } = props;
  const [name, setName] = useState('');
  const [hexColor, setHexColor] = useState('#000000');

  const isColorAttribute = attribute.displayType === 'color-swatches';

  useEffect(() => {
    if (open && initialData) {
      setName(initialData.name);
      setHexColor(initialData.hexColor || '#000000');
    } else if (open) {
      setName('');
      setHexColor('#000000');
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data: Omit<AttributeValue, 'id'> = {
      attributeId: attribute.id,
      name: name.trim(),
    };

    if (isColorAttribute) {
      data.hexColor = hexColor;
    }

    onSubmit(data);
  };
  const {state : {currentTheme}} = useStoreConfigCtx();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ background: currentTheme.modal, color: currentTheme.text }}>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add'} {attribute.name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="value-name">Value Name</Label>
              <Input
                id="value-name"
                placeholder={isColorAttribute ? 'e.g. Red' : 'e.g. XL'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            {isColorAttribute && (
                <div className="space-y-2">
                  <Label htmlFor="color-picker">Color</Label>
                  <div className="flex gap-2">
                    <input
                      id="color-picker"
                      type="color"
                      value={hexColor}
                      onChange={(e) => setHexColor(e.target.value)}
                      className="h-10 w-20 cursor-pointer rounded border"
                    />
                    <Input
                      placeholder="#000000"
                      value={hexColor}
                      onChange={(e) => setHexColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
            )}
          </div>
          <DialogFooter style={{ background: currentTheme.bgSecondary }}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} style={{ borderColor: currentTheme.border, color: currentTheme.text }}>
              Cancel
            </Button>
            <Button type="submit" style={{ background: currentTheme.primary, color: currentTheme.textInverse }}>{initialData ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
