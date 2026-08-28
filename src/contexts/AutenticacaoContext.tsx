import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, Cargo } from '../types';

interface ContextoAutenticacao {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<boolean>;
  sair: () => void;
  trocarCargo: (cargo: Cargo) => void;
}

export const AutenticacaoContext = createContext<ContextoAutenticacao | undefined>(undefined);

const mockUsuarios: Record<string, Usuario> = {
  'admin@nhac.com': {
    id: 'user-001',
    nomeCompleto: 'Carlos Eduardo Silva',
    email: 'admin@nhac.com',
    telefone: '11998765432',
    cargo: 'administrador',
    lojaId: 'loja-001',
  },
  'gerente@nhac.com': {
    id: 'user-002',
    nomeCompleto: 'Ana Julia Pereira',
    email: 'gerente@nhac.com',
    telefone: '11987654321',
    cargo: 'gerente',
    lojaId: 'loja-001',
  },
  'atendente@nhac.com': {
    id: 'user-003',
    nomeCompleto: 'Lucas Souza',
    email: 'atendente@nhac.com',
    telefone: '11976543210',
    cargo: 'atendente',
    lojaId: 'loja-001',
  }
};

export const ProvedorAutenticacao: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('@nhac:usuario');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setCarregando(false);
  }, []);

  const entrar = async (email: string, senha: string): Promise<boolean> => {
    setCarregando(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        if (senha === '123456' && mockUsuarios[email]) {
          const user = mockUsuarios[email];
          setUsuario(user);
          localStorage.setItem('@nhac:usuario', JSON.stringify(user));
          setCarregando(false);
          resolve(true);
        } else {
          setCarregando(false);
          resolve(false);
        }
      }, 800);
    });
  };

  const sair = () => {
    setUsuario(null);
    localStorage.removeItem('@nhac:usuario');
  };

  const trocarCargo = (cargo: Cargo) => {
    if (usuario) {
      const novoUsuario = { ...usuario, cargo };
      setUsuario(novoUsuario);
      localStorage.setItem('@nhac:usuario', JSON.stringify(novoUsuario));
    }
  };

  return (
    <AutenticacaoContext.Provider value={{ usuario, carregando, entrar, sair, trocarCargo }}>
      {children}
    </AutenticacaoContext.Provider>
  );
};
