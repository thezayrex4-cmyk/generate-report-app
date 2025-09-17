import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Copy, Trash2, Filter } from 'lucide-react';
import { TemplatePreview, ContractType } from '../types/template';

interface TemplateListProps {
  templates: TemplatePreview[];
  contractTypes: ContractType[];
  onCreateNew: () => void;
  onEdit: (templateId: string) => void;
  onPreview: (templateId: string) => void;
  onDuplicate: (templateId: string) => void;
  onDelete: (templateId: string) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  contractTypes,
  onCreateNew,
  onEdit,
  onPreview,
  onDuplicate,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContractType, setSelectedContractType] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.contractTypeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContractType = !selectedContractType ||
      contractTypes.find(ct => ct.id === selectedContractType)?.name === template.contractTypeName;
    const matchesActive = !showActiveOnly || template.isActive;

    return matchesSearch && matchesContractType && matchesActive;
  });

  return (
    <div className="template-list">
      {/* Header */}
      <div className="list-header">
        <div className="header-title">
          <h1>Plantillas HTML</h1>
          <p>Gestiona las plantillas para diferentes tipos de contratos</p>
        </div>
        <button className="btn btn-primary" onClick={onCreateNew}>
          <Plus size={16} />
          Nueva Plantilla
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-controls">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar plantillas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={selectedContractType}
            onChange={(e) => setSelectedContractType(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los tipos de contrato</option>
            {contractTypes.map(ct => (
              <option key={ct.id} value={ct.id}>{ct.name}</option>
            ))}
          </select>

          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
            />
            Solo activas
          </label>
        </div>
      </div>

      {/* Lista de plantillas */}
      <div className="templates-grid">
        {filteredTemplates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No hay plantillas</h3>
            <p>
              {searchTerm || selectedContractType || showActiveOnly
                ? 'No se encontraron plantillas que coincidan con los filtros'
                : 'Comienza creando tu primera plantilla HTML'
              }
            </p>
            {!searchTerm && !selectedContractType && !showActiveOnly && (
              <button className="btn btn-primary" onClick={onCreateNew}>
                <Plus size={16} />
                Crear Primera Plantilla
              </button>
            )}
          </div>
        ) : (
          filteredTemplates.map(template => (
            <div key={template.id} className="template-card">
              <div className="template-thumbnail">
                {template.thumbnail ? (
                  <img src={template.thumbnail} alt={template.name} />
                ) : (
                  <div className="thumbnail-placeholder">
                    <span>📄</span>
                  </div>
                )}
                <div className="template-status">
                  <span className={`status-badge ${template.isActive ? 'active' : 'inactive'}`}>
                    {template.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>

              <div className="template-info">
                <h3 className="template-name">{template.name}</h3>
                <p className="template-contract-type">{template.contractTypeName}</p>
                <p className="template-date">
                  Modificado: {new Date(template.lastModified).toLocaleDateString('es-ES')}
                </p>
              </div>

              <div className="template-actions">
                <button
                  className="action-btn edit"
                  onClick={() => onEdit(template.id)}
                  title="Editar"
                >
                  <Edit size={14} />
                </button>
                <button
                  className="action-btn preview"
                  onClick={() => onPreview(template.id)}
                  title="Vista previa"
                >
                  <Eye size={14} />
                </button>
                <button
                  className="action-btn duplicate"
                  onClick={() => onDuplicate(template.id)}
                  title="Duplicar"
                >
                  <Copy size={14} />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => onDelete(template.id)}
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TemplateList;