import React, { useEffect, useRef, useState } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import gjsPluginForms from 'grapesjs-plugin-forms';
import { Save, Eye, ArrowLeft, Settings, Code, Palette } from 'lucide-react';
import { Template, ContractType, Placeholder } from '../types/template';

interface TemplateEditorProps {
  template?: Template;
  contractTypes: ContractType[];
  onSave: (template: Partial<Template>) => void;
  onBack: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  contractTypes,
  onSave,
  onBack
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [templateName, setTemplateName] = useState(template?.name || '');
  const [templateDescription, setTemplateDescription] = useState(template?.description || '');
  const [selectedContractType, setSelectedContractType] = useState(template?.contractTypeId || '');
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;

    const grapesEditor = grapesjs.init({
      container: editorRef.current,
      height: '100%',
      width: 'auto',
      storageManager: false,
      plugins: [gjsPresetWebpage, gjsBlocksBasic, gjsPluginForms],
      pluginsOpts: {
        [gjsPresetWebpage]: {
          modalImportTitle: 'Importar',
          modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Pega aquí tu código HTML/CSS y haz clic en Importar</div>',
          modalImportContent: function(editor: Editor) {
            return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
          },
        },
      },
      canvas: {
        styles: [
          'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
        ],
      },
      blockManager: {
        appendTo: '.blocks-container',
      },
      styleManager: {
        appendTo: '.styles-container',
        sectors: [{
          name: 'Dimensiones',
          open: false,
          buildProps: ['width', 'min-height', 'padding'],
          properties: [{
            type: 'integer',
            name: 'El ancho',
            property: 'width',
            units: ['px', '%'],
            defaults: 'auto',
            min: 0,
          }]
        }, {
          name: 'Decoración',
          open: false,
          buildProps: ['color', 'background-color', 'border', 'border-radius'],
          properties: [{
            name: 'Color de fondo',
            property: 'background-color',
            type: 'color',
          }, {
            name: 'Color del texto',
            property: 'color',
            type: 'color',
          }]
        }],
      },
      layerManager: {
        appendTo: '.layers-container',
      },
      traitManager: {
        appendTo: '.traits-container',
      },
    });

    // Agregar bloques personalizados para placeholders
    grapesEditor.BlockManager.add('placeholder-text', {
      label: 'Placeholder Texto',
      content: '<span class="placeholder" data-placeholder="{{nombre}}">{{nombre}}</span>',
      category: 'Placeholders',
      attributes: { class: 'fa fa-text-width' }
    });

    grapesEditor.BlockManager.add('placeholder-date', {
      label: 'Placeholder Fecha',
      content: '<span class="placeholder" data-placeholder="{{fecha}}">{{fecha}}</span>',
      category: 'Placeholders',
      attributes: { class: 'fa fa-calendar' }
    });

    grapesEditor.BlockManager.add('placeholder-number', {
      label: 'Placeholder Número',
      content: '<span class="placeholder" data-placeholder="{{numero}}">{{numero}}</span>',
      category: 'Placeholders',
      attributes: { class: 'fa fa-hashtag' }
    });

    // Cargar contenido existente si hay un template
    if (template) {
      grapesEditor.setComponents(template.htmlContent);
      grapesEditor.setStyle(template.cssContent);
    }

    // Agregar estilos CSS para los placeholders
    grapesEditor.setStyle(`
      .placeholder {
        background-color: #e3f2fd;
        border: 2px dashed #2196f3;
        padding: 4px 8px;
        border-radius: 4px;
        color: #1976d2;
        font-weight: 500;
        display: inline-block;
        min-width: 60px;
        text-align: center;
      }
      .placeholder:hover {
        background-color: #bbdefb;
        border-color: #1976d2;
      }
    `);

    setEditor(grapesEditor);

    return () => {
      grapesEditor.destroy();
    };
  }, [template]);

  const handleSave = () => {
    if (!editor || !templateName || !selectedContractType) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const htmlContent = editor.getHtml();
    const cssContent = editor.getCss();
    
    // Extraer placeholders del HTML
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const placeholders: string[] = [];
    let match;
    
    while ((match = placeholderRegex.exec(htmlContent)) !== null) {
      if (!placeholders.includes(match[1])) {
        placeholders.push(match[1]);
      }
    }

    const templateData: Partial<Template> = {
      id: template?.id,
      name: templateName,
      description: templateDescription,
      contractTypeId: selectedContractType,
      htmlContent,
      cssContent,
      placeholders,
      isActive: true,
      updatedAt: new Date().toISOString(),
    };

    if (!template?.id) {
      templateData.createdAt = new Date().toISOString();
      templateData.createdBy = 'current-user'; // En producción vendría del contexto de auth
    }

    onSave(templateData);
  };

  const handlePreview = () => {
    if (!editor) return;
    
    const htmlContent = editor.getHtml();
    const cssContent = editor.getCss();
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Vista Previa - ${templateName}</title>
          <style>${cssContent}</style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `;
    
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(fullHtml);
      previewWindow.document.close();
    }
  };

  const selectedContractTypeData = contractTypes.find(ct => ct.id === selectedContractType);

  return (
    <div className="template-editor">
      {/* Toolbar superior */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <button className="btn btn-secondary" onClick={onBack}>
            <ArrowLeft size={16} />
            Volver
          </button>
          <div className="template-info">
            <input
              type="text"
              placeholder="Nombre de la plantilla"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="template-name-input"
            />
            <select
              value={selectedContractType}
              onChange={(e) => setSelectedContractType(e.target.value)}
              className="contract-type-select"
            >
              <option value="">Seleccionar tipo de contrato</option>
              {contractTypes.map(ct => (
                <option key={ct.id} value={ct.id}>{ct.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="toolbar-right">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={16} />
            Configuración
          </button>
          <button className="btn btn-secondary" onClick={handlePreview}>
            <Eye size={16} />
            Vista Previa
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            Guardar
          </button>
        </div>
      </div>

      {/* Panel de configuración */}
      {showSettings && (
        <div className="settings-panel">
          <div className="settings-content">
            <h3>Configuración de Plantilla</h3>
            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Descripción de la plantilla..."
                rows={3}
              />
            </div>
            
            {selectedContractTypeData && (
              <div className="form-group">
                <label>Placeholders Disponibles:</label>
                <div className="placeholders-list">
                  {selectedContractTypeData.placeholders.map(placeholder => (
                    <div key={placeholder.id} className="placeholder-item">
                      <code>{`{{${placeholder.name}}}`}</code>
                      <span className="placeholder-label">{placeholder.label}</span>
                      <span className={`placeholder-type ${placeholder.type}`}>{placeholder.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button 
              className="btn btn-secondary"
              onClick={() => setShowSettings(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Editor principal */}
      <div className="editor-container">
        {/* Panel lateral izquierdo */}
        <div className="editor-sidebar">
          <div className="sidebar-tabs">
            <div className="tab active">
              <Palette size={16} />
              Bloques
            </div>
          </div>
          <div className="blocks-container"></div>
        </div>

        {/* Canvas del editor */}
        <div className="editor-canvas">
          <div ref={editorRef} className="gjs-editor"></div>
        </div>

        {/* Panel lateral derecho */}
        <div className="editor-properties">
          <div className="properties-tabs">
            <div className="tab active">
              <Settings size={16} />
              Propiedades
            </div>
            <div className="tab">
              <Code size={16} />
              Capas
            </div>
          </div>
          <div className="styles-container"></div>
          <div className="traits-container"></div>
          <div className="layers-container"></div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;