export interface ContractType {
  id: string;
  name: string;
  description: string;
  placeholders: Placeholder[];
  createdAt: string;
  updatedAt: string;
}

export interface Placeholder {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'url' | 'textarea' | 'select' | 'checkbox';
  required: boolean;
  defaultValue?: string;
  options?: string[]; // Para tipo select
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  contractTypeId: string;
  htmlContent: string;
  cssContent: string;
  placeholders: string[]; // Array de nombres de placeholders usados en el template
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface TemplatePreview {
  id: string;
  name: string;
  contractTypeName: string;
  thumbnail?: string;
  lastModified: string;
  isActive: boolean;
}