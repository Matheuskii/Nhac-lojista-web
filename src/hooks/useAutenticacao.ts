import { useContext } from 'react';
import { AutenticacaoContext } from '../contexts/AutenticacaoContext';

export const useAutenticacao = () => {
  const contexto = useContext(AutenticacaoContext);
  
  if (contexto === undefined) {
    throw new Error('useAutenticacao deve ser usado dentro de um ProvedorAutenticacao');
  }
  
  return contexto;
};

export default useAutenticacao;
