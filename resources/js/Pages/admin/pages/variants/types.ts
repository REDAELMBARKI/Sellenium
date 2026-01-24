// Core types for attribute management

export type DisplayType = 'radio' | 'checkbox' | 'buttons' | 'dropdown' | 'color-swatches';

export interface Attribute {
  id: string;
  name: string;
  displayType: DisplayType;
}

export interface AttributeValue {
  id: string;
  attributeId: string;
  name: string;
  hexColor?: string;
}
