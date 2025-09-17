import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { ContractType, Placeholder } from '../types/template';

interface ContractTypeManagerProps {
  contractTypes: ContractType[];
  onSave: (contractType: Partial<ContractType>) => void;
  onDelete: (contractTypeId: string) => void;
}

const ContractTypeManager: React.FC<ContractTypeManagerProps> = ({
  contractTypes,
  onSave,
  onDelete
}) => {
  const [editingType, setEditingType] = useState<ContractType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<ContractType>>({
    name: '',
    description: '',
    placeholders: []
  });

  const handleEdit = (contractType: ContractType) => {
    setEditingType(contractType);
    setFormData(contractType);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingType(null);
    setFormData({
      name: '',
      description: '',
      placeholders: []
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingType(null);
    setIsCreating(false);
    setFormData({
      name: '',
      description: '',
      placeholders: []
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const contractTypeData: Partial<ContractType> = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    if (!editingType) {
      contractTypeData.id = `ct_${Date.now()}`;
      contractTypeData.createdAt = new Date().toISOString();
    } else {
      contractTypeData.id = editingType.id;
    }

    onSave(contractTypeData);
    handleCancel();
  };

  const addPlaceholder = () => {
    const newPlaceholder: Placeholder = {
      id: `ph_${Date.now()}`,
      name: '',
      label: '',
      type: 'text',
      required: false
    };

    setFormData({
      ...formData,
      placeholders: [...(formData.placeholders || []), newPlaceholder]
    });
  };

  const updatePlaceholder = (index: number, field: keyof Placeholder, value: any) => {
    const updatedPlaceholders = [...(formData.placeholders || [])];
    updatedPlaceholders[index] = {
      ...updatedPlaceholders[index],
      [field]: value
    };
    setFormData({
      ...formData,
      placeholders: updatedPlaceholders
    });
  };

  const removePlaceholder = (index: number) => {
    const updatedPlaceholders = [...(formData.placeholders || [])];
    updatedPlaceholders.splice(index, 1);
    setFormData({
      ...formData,
      placeholders: updatedPlaceholders
    });
  };

  return (
    <div className="contract-type-manager">
      <div className="manager-header">
        <h2>Tipos de Contrato</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus size={16} />
          Nuevo Tipo
        </button>
      </div>

      {(isCreating || editingType) && (
        <div className="contract-form">
          <div className="form-header">
            <h3>{isCreating ? 'Crear Nuevo Tipo de Contrato' : 'Editar Tipo de Contrato'}</h3>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={handleCancel}>
                <X size={16} />
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={16} />
                Guardar
              </button>
            </div>
          </div>

          <div className="form-content">
            <div className="form-group">
              <label>Nombre del Tipo de Contrato *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Contrato de Trabajo, Contrato de Servicios..."
              />
            </div>

            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del tipo de contrato..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <div className="placeholders-header">
                <label>Placeholders</label>
                <button className="btn btn-secondary btn-sm" onClick={addPlaceholder}>
                  <Plus size={14} />
                  Agregar Placeholder
                </button>
              </div>

              <div className="placeholders-list">
                {(formData.placeholders || []).map((placeholder, index) => (
                  <div key={placeholder.id} className="placeholder-form">
                    <div className="placeholder-row">
                      <input
                        type="text"
                        placeholder="Nombre (ej: nombre_empleado)"
                        value={placeholder.name}
                        onChange={(e) => updatePlaceholder(index, 'name', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Etiqueta (ej: Nombre del Empleado)"
                        value={placeholder.label}
                        onChange={(e) => updatePlaceholder(index, 'label', e.target.value)}
                      />
                      <select
                        value={placeholder.type}
                        onChange={(e) => updatePlaceholder(index, 'type', e.target.value)}
                      >
                        <option value="text">Texto</option>
                        <option value="number">Número</option>
                        <option value="date">Fecha</option>
                        <option value="email">Email</option>
                        <option value="url">URL</option>
                        <option value="textarea">Texto Largo</option>
                        <option value="select">Selección</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={placeholder.required}
                          onChange={(e) => updatePlaceholder(index, 'required', e.target.checked)}
                        />
                        Requerido
                      </label>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removePlaceholder(index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="contract-types-list">
        {contractTypes.map(contractType => (
          <div key={contractType.id} className="contract-type-card">
            <div className="contract-type-info">
              <h3>{contractType.name}</h3>
              <p>{contractType.description}</p>
              <div className="placeholders-count">
                {contractType.placeholders.length} placeholders definidos
              </div>
            </div>
            <div className="contract-type-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleEdit(contractType)}
              >
                <Edit size={14} />
                Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(contractType.id)}
              >
                <Trash2 size={14} />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractTypeManager;