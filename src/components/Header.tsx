import React, { useState, useRef, useEffect } from 'react';
import { Truck, Building, ChevronDown, Search, X, User } from 'lucide-react';
import { useDelegacion } from '../contexts/DelegacionContext';
import { useAuth } from '../contexts/AuthContext';

// Lista completa de delegaciones disponibles
const delegaciones = [
  { id: '000301', nombre: 'C.O. ALICANTE V51' },
  { id: '000207', nombre: 'C.O. ALBACETE H42' },
  { id: '000002', nombre: 'Informática' },
  { id: '001522', nombre: 'C.O. SANTIAGO G52' },
  { id: '001423', nombre: 'C.O. CORDOBA A72' },
  { id: '001315', nombre: 'C.O. CIUDAD REAL R41' },
  { id: '001214', nombre: 'C.O. CASTELLON D10' },
  { id: '001130', nombre: 'C.O. ALGECIRAS A82' },
  { id: '001129', nombre: 'C.O. CADIZ A41' },
  { id: '001055', nombre: 'C.O. CACERES E32' },
  { id: '000912', nombre: 'C.O. BURGOS U91' },
  { id: '000908', nombre: 'C.O. VITORIA N00' },
  { id: '000818', nombre: 'C.O. BARCELONA B10' },
  { id: '000720', nombre: 'C.O. PALMA DE MALLORCA Y01' },
  { id: '002101', nombre: 'C.O. HUELVA A10' },
  { id: '002002', nombre: 'C.O. SAN SEBASTIAN N12' },
  { id: '001834', nombre: 'C.O. GRANADA A62' },
  { id: '001721', nombre: 'C.O. GERONA S11' },
  { id: '001605', nombre: 'C.O. CUENCA H41' },
  { id: '001534', nombre: 'C.O. CORUÑA G32' },
  { id: '000604', nombre: 'C.O. MERIDA E21' },
  { id: '000506', nombre: 'C.O. AVILA R61' },
  { id: '000421', nombre: 'C.O. ALMERIA A51' },
  { id: '002315', nombre: 'C.O. JAEN  A71' },
  { id: '002412', nombre: 'C.O. LEON G82' },
  { id: '002530', nombre: 'C.O. LLEIDA C91' },
  { id: '002611', nombre: 'C.O. LOGROÑO N32' },
  { id: '002712', nombre: 'C.O. LUGO G41' },
  { id: '002903', nombre: 'C.O. MALAGA A92' },
  { id: '003010', nombre: 'C.O. MURCIA L10' },
  { id: '003102', nombre: 'C.O. PAMPLONA N41' },
  { id: '001903', nombre: 'C.O. GUADALAJARA R51' },
  { id: '003911', nombre: 'C.O. SANTANDER X81' },
  { id: '004005', nombre: 'C.O. SEGOVIA R71' },
  { id: '004101', nombre: 'C.O. SEVILLA A01' },
  { id: '004202', nombre: 'C.O. SORIA R10' },
  { id: '004332', nombre: 'C.O. TARRAGONA C72' },
  { id: '004522', nombre: 'C.O. TOLEDO R22' },
  { id: '004638', nombre: 'C.O. VALENCIA M10' },
  { id: '002411', nombre: 'C.O. BIERZO G90' },
  { id: '003115', nombre: 'C.O. TUDELA Z12' },
  { id: '003326', nombre: 'C.O. ASTURIAS G62' },
  { id: '003403', nombre: 'C.O. PALENCIA R73 (003403) Sin servicios' },
  { id: '003631', nombre: 'C.O. PONTEVEDRA G22' },
  { id: '003708', nombre: 'C.O. SALAMANCA R62' },
  { id: '008280', nombre: 'C.O. MADRID J25' },
  { id: '004707', nombre: 'C.O. VALLADOLID R81' },
  { id: '004815', nombre: 'C.O. BILBAO K15' },
  { id: '004907', nombre: 'C.O. BENAVENTE G81' },
  { id: '000721', nombre: 'C.O. IBIZA' },
  { id: '002209', nombre: 'C.O. HUESCA' },
  { id: '005004', nombre: 'C.O. ZARAGOZA' },
  { id: '003709', nombre: 'C.O. SALAMANCA 2 R62 (Sin Servicios)' },
  { id: '003202', nombre: 'C.O. OURENSE' },
  { id: '008005', nombre: 'C.O. EGARA C21(sin servicios)' },
  { id: '003206', nombre: 'C.O. OURENSE G21 FRANQUICIA' },
  { id: '003628', nombre: 'VIGO G10(cliente)(003628)' },
  { id: '003405', nombre: 'C.O. PALENCIA R73 (003405)' },
  { id: '004407', nombre: 'C.O. TERUEL Z11' },
  { id: '000709', nombre: 'MENORCA(antigua agencia)' },
  { id: '000913', nombre: 'C.O. ARANDA' },
  { id: '000722', nombre: 'C.O. MENORCA' },
  { id: '8811775', nombre: '8811775_CDP 2425 MONTE REAL' },
  { id: '8811609', nombre: '8811609_CDP 2775 PAREDE' },
  { id: '5118317', nombre: 'CLDA - Centro de Logística e Distribuição Açores' },
  { id: '8818060', nombre: '8818060_CAD 9400 PORTO SANTO' },
  { id: '8811551', nombre: '8811551_CDP 2460 ALCOBAÇA' },
  { id: '8811597', nombre: '8811597_CDP 1500 LISBOA' },
  { id: '003513', nombre: 'C.O FUERTEVENTURA' },
  { id: '003633', nombre: 'VIGO G10(cliente)' },
  { id: 'RNAC', nombre: 'RUTASNACIONALES' },
  { id: 'RNA', nombre: 'C.O. RUTAS NACIONALES' },
  { id: '001106', nombre: 'MELILLA A91(C.O) DISTRIBUIDOR' },
  { id: 'xx', nombre: 'BADAJOZ - PROV (FACTURACIÓN)' },
  { id: '008281', nombre: 'CO PRUEBA' },
  { id: '000751', nombre: 'C.O. MENORCA(colaboradora)' },
  { id: '007935', nombre: 'CENTRO DE TRATAMIENTO ADUANERO' },
  { id: '002424', nombre: 'Prueba Propia' },
  { id: '003514', nombre: 'LANZAROTE Q01        (DISTRIBUIDORA)' },
  { id: '008290', nombre: 'C.O. VILLAVERDE' },
  { id: '008053', nombre: 'C.O. SANT BOI' },
  { id: '8810736', nombre: 'Loja Ajuda Lisboa' },
  { id: '003515', nombre: 'C.O. GRAN CANARIA' },
  { id: '003809', nombre: 'B2C TENERIFE' },
  { id: '008291', nombre: 'C.O. DEVOLUCIONES COSLADA' },
  { id: '003516', nombre: 'C.O. LANZAROTE' }
];

const Header: React.FC = () => {
  const { delegacion, setDelegacion } = useDelegacion();
  const { userEmail } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDelegaciones, setFilteredDelegaciones] = useState(delegaciones);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (showDropdown && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showDropdown]);
  
  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Filter delegaciones based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredDelegaciones(delegaciones);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = delegaciones.filter(deleg => 
      deleg.id.toLowerCase().includes(query) || 
      deleg.nombre.toLowerCase().includes(query)
    );
    
    setFilteredDelegaciones(filtered);
  }, [searchQuery]);

  const handleDelegacionChange = (deleg: typeof delegaciones[0]) => {
    setDelegacion(deleg);
    setShowDropdown(false);
    setSearchQuery('');
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleCloseWindow = () => {
    if (window.opener) {
      window.close();
    }
  };

  return (
    <header className="header-container">
      <div className="header-content">
        {/* Logo y título */}
        <div className="header-brand">
          <Truck size={24} className="header-icon" />
          <div>
            <h1 className="header-title">Gestión de Envíos</h1>
            <p className="header-subtitle">CTT Express - Sistema de gestión de envíos</p>
          </div>
        </div>
        
        {/* Controles del lado derecho */}
        <div className="header-controls">
          {/* Selector de delegación */}
          <div className="delegation-selector" ref={dropdownRef}>
            <button 
              className="delegation-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <Building size={16} />
              <span className="delegation-text">{delegacion.nombre}</span>
              <ChevronDown size={16} />
            </button>
            
            {showDropdown && (
              <div className="delegation-dropdown">
                <div className="dropdown-search">
                  <div className="search-input-container">
                    <Search size={14} className="search-icon" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Buscar por código o nombre..."
                      className="search-input"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        className="clear-search-button"
                        onClick={clearSearch}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="dropdown-list">
                  {filteredDelegaciones.length > 0 ? (
                    filteredDelegaciones.map((deleg) => (
                      <button
                        key={deleg.id}
                        className={`dropdown-item ${
                          delegacion.id === deleg.id ? 'dropdown-item-active' : ''
                        }`}
                        onClick={() => handleDelegacionChange(deleg)}
                      >
                        <div className="delegation-code">{deleg.id}</div>
                        <div className="delegation-name">{deleg.nombre}</div>
                      </button>
                    ))
                  ) : (
                    <div className="dropdown-empty">
                      No se encontraron delegaciones
                    </div>
                  )}
                </div>
                
                <div className="dropdown-footer">
                  {filteredDelegaciones.length} delegaciones {searchQuery && 'encontradas'}
                </div>
              </div>
            )}
          </div>
          
          {/* Información de usuario */}
          {userEmail && (
            <div className="user-info">
              <User size={16} className="user-icon" />
              <span className="user-email">{userEmail}</span>
            </div>
          )}
          
          {/* Botón para cerrar */}
          <button 
            onClick={handleCloseWindow}
            className="close-button"
            title="Cerrar aplicación"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;