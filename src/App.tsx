import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DelegacionProvider } from './contexts/DelegacionContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import TemplateList from './components/TemplateList';
import TemplateEditor from './components/TemplateEditor';
import ContractTypeManager from './components/ContractTypeManager';
import { Template, TemplatePreview, ContractType } from './types/template';

function App() {
  // Estados para manejar los datos (en producción vendrían de una API/MongoDB)
  const [templates, setTemplates] = useState<TemplatePreview[]>([
    {
      id: '1',
      name: 'Contrato de Trabajo Estándar',
      contractTypeName: 'Contrato Laboral',
      lastModified: '2024-01-15T10:30:00Z',
      isActive: true,
    },
    {
      id: '2',
      name: 'Contrato de Servicios Profesionales',
      contractTypeName: 'Contrato de Servicios',
      lastModified: '2024-01-10T14:20:00Z',
      isActive: true,
    }
  ]);

  const [contractTypes, setContractTypes] = useState<ContractType[]>([
    {
      id: 'ct1',
      name: 'Contrato Laboral',
      description: 'Contratos de trabajo para empleados',
      placeholders: [
        {
          id: 'ph1',
          name: 'nombre_empleado',
          label: 'Nombre del Empleado',
          type: 'text',
          required: true
        },
        {
          id: 'ph2',
          name: 'fecha_inicio',
          label: 'Fecha de Inicio',
          type: 'date',
          required: true
        },
        {
          id: 'ph3',
          name: 'salario',
          label: 'Salario',
          type: 'number',
          required: true
        }
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'ct2',
      name: 'Contrato de Servicios',
      description: 'Contratos para prestación de servicios',
      placeholders: [
        {
          id: 'ph4',
          name: 'nombre_proveedor',
          label: 'Nombre del Proveedor',
          type: 'text',
          required: true
        },
        {
          id: 'ph5',
          name: 'descripcion_servicio',
          label: 'Descripción del Servicio',
          type: 'textarea',
          required: true
        },
        {
          id: 'ph6',
          name: 'valor_contrato',
          label: 'Valor del Contrato',
          type: 'number',
          required: true
        }
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [currentView, setCurrentView] = useState<'list' | 'editor' | 'contract-types'>('list');
  const [editingTemplate, setEditingTemplate] = useState<Template | undefined>();

  // Handlers para plantillas
  const handleCreateNew = () => {
    setEditingTemplate(undefined);
    setCurrentView('editor');
  };

  const handleEdit = (templateId: string) => {
    // En producción, aquí harías una llamada a la API para obtener el template completo
    console.log('Editando template:', templateId);
    setCurrentView('editor');
  };

  const handlePreview = (templateId: string) => {
    console.log('Vista previa del template:', templateId);
    // Implementar vista previa
  };

  const handleDuplicate = (templateId: string) => {
    console.log('Duplicando template:', templateId);
    // Implementar duplicación
  };

  const handleDelete = (templateId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) {
      setTemplates(templates.filter(t => t.id !== templateId));
    }
  };

  const handleSaveTemplate = (templateData: Partial<Template>) => {
    console.log('Guardando template:', templateData);
    // En producción, aquí harías una llamada a la API para guardar en MongoDB
    
    if (templateData.id) {
      // Actualizar template existente
      setTemplates(templates.map(t => 
        t.id === templateData.id 
          ? {
              ...t,
              name: templateData.name!,
              contractTypeName: contractTypes.find(ct => ct.id === templateData.contractTypeId)?.name || '',
              lastModified: new Date().toISOString(),
              isActive: templateData.isActive!
            }
          : t
      ));
    } else {
      // Crear nuevo template
      const newTemplate: TemplatePreview = {
        id: `t_${Date.now()}`,
        name: templateData.name!,
        contractTypeName: contractTypes.find(ct => ct.id === templateData.contractTypeId)?.name || '',
        lastModified: new Date().toISOString(),
        isActive: templateData.isActive!
      };
      setTemplates([...templates, newTemplate]);
    }
    
    setCurrentView('list');
  };

  // Handlers para tipos de contrato
  const handleSaveContractType = (contractTypeData: Partial<ContractType>) => {
    console.log('Guardando tipo de contrato:', contractTypeData);
    
    if (contractTypeData.id && contractTypes.find(ct => ct.id === contractTypeData.id)) {
      // Actualizar existente
      setContractTypes(contractTypes.map(ct => 
        ct.id === contractTypeData.id ? { ...ct, ...contractTypeData } as ContractType : ct
      ));
    } else {
      // Crear nuevo
      setContractTypes([...contractTypes, contractTypeData as ContractType]);
    }
  };

  const handleDeleteContractType = (contractTypeId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este tipo de contrato?')) {
      setContractTypes(contractTypes.filter(ct => ct.id !== contractTypeId));
    }
  };

  return (
    <DelegacionProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={
                <div className="app-container">
                  {/* Navegación */}
                  <div className="app-navigation">
                    <button 
                      className={`nav-btn ${currentView === 'list' ? 'active' : ''}`}
                      onClick={() => setCurrentView('list')}
                    >
                      Plantillas
                    </button>
                    <button 
                      className={`nav-btn ${currentView === 'contract-types' ? 'active' : ''}`}
                      onClick={() => setCurrentView('contract-types')}
                    >
                      Tipos de Contrato
                    </button>
                  </div>

                  {/* Contenido principal */}
                  <main className="app-content">
                    {currentView === 'list' && (
                      <TemplateList
                        templates={templates}
                        contractTypes={contractTypes}
                        onCreateNew={handleCreateNew}
                        onEdit={handleEdit}
                        onPreview={handlePreview}
                        onDuplicate={handleDuplicate}
                        onDelete={handleDelete}
                      />
                    )}
                    
                    {currentView === 'editor' && (
                      <TemplateEditor
                        template={editingTemplate}
                        contractTypes={contractTypes}
                        onSave={handleSaveTemplate}
                        onBack={() => setCurrentView('list')}
                      />
                    )}
                    
                    {currentView === 'contract-types' && (
                      <ContractTypeManager
                        contractTypes={contractTypes}
                        onSave={handleSaveContractType}
                        onDelete={handleDeleteContractType}
                      />
                    )}
                  </main>
                </div>
              } />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </DelegacionProvider>
  );
}

export default App;