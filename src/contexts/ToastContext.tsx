import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';

interface ToastContextType {
  mostrarToast: (mensagem: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ProvedorToast: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mensagem, setMensagem] = useState<string | null>(null);

  const mostrarToast = useCallback((texto: string) => {
    setMensagem(texto);
    window.setTimeout(() => setMensagem(null), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      {mensagem && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 'var(--z-toast, 500)',
            background: 'var(--nhac-texto, #1a1a1a)',
            color: '#fff',
            padding: '0.875rem 1.25rem',
            borderRadius: 'var(--raio-cartao, 8px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxWidth: '320px',
            fontSize: '0.875rem',
          }}
        >
          {mensagem}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast deve ser usado dentro de ProvedorToast');
  }
  return ctx;
}
