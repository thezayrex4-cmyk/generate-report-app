import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Delegacion {
  id: string;
  nombre: string;
}

interface DelegacionContextType {
  delegacion: Delegacion;
  setDelegacion: (delegacion: Delegacion) => void;
}

const DelegacionContext = createContext<DelegacionContextType | undefined>(undefined);

interface DelegacionProviderProps {
  children: ReactNode;
}

export const DelegacionProvider: React.FC<DelegacionProviderProps> = ({ children }) => {
  const [delegacion, setDelegacion] = useState<Delegacion>({
    id: '3248000004',
    nombre: 'C.O. MADRID J25'
  });

  return (
    <DelegacionContext.Provider value={{ delegacion, setDelegacion }}>
      {children}
    </DelegacionContext.Provider>
  );
};

export const useDelegacion = (): DelegacionContextType => {
  const context = useContext(DelegacionContext);
  if (context === undefined) {
    throw new Error('useDelegacion must be used within a DelegacionProvider');
  }
  return context;
};