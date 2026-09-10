import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, Cargo } from '../types';
import { login, LoginResponseDTO } from '../services/api';

interface ContextoAutenticacao {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => void;
  trocarCargo: (cargo: Cargo) => void;
}

export const AutenticacaoContext = createContext<ContextoAutenticacao | undefined>(undefined);

/**
 * Converte a resposta do login da API para o formato Usuario do frontend
 */
function converterUsuarioApi(usuarioApi: LoginResponseDTO, token: string): Usuario {
  return {
    id: usuarioApi.usuarioId,
    nomeCompleto: usuarioApi.nome,
    email: '', // O backend não retorna email no login, teríamos que buscar separadamente
    telefone: '',
    cargo: usuarioApi.papel as Cargo || 'administrador',
    lojaId: '', // Será preenchido quando buscarmos os dados da loja
  };
}

export const ProvedorAutenticacao: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('@nhac:usuario');
    const tokenSalvo = localStorage.getItem('@nhac:token');
    
    if (usuarioSalvo && tokenSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setCarregando(false);
  }, []);

  const entrar = async (email: string, senha: string): Promise<void> => {
    setCarregando(true);
    try {
      const resposta = await login({ email, senha });
      
      // Salva token
      localStorage.setItem('@nhac:token', resposta.token);
      
      // Converte e salva usuário
      const usuarioFormatado = converterUsuarioApi(resposta, resposta.token);
      setUsuario(usuarioFormatado);
      localStorage.setItem('@nhac:usuario', JSON.stringify(usuarioFormatado));
      
    } catch (erro: any) {
      throw new Error(erro.message || 'E-mail ou senha incorretos.');
    } finally {
      setCarregando(false);
    }
  };

  const sair = () => {
    setUsuario(null);
    localStorage.removeItem('@nhac:usuario');
    localStorage.removeItem('@nhac:token');
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
