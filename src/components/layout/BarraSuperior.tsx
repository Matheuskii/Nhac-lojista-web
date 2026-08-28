import React from 'react';
import { Menu } from 'lucide-react';
import { useAutenticacao } from '../../hooks/useAutenticacao';
import estilos from './BarraSuperior.module.css';

interface BarraSuperiorProps {
  titulo: string;
  onAbrirMenu: () => void;
}

const BarraSuperior: React.FC<BarraSuperiorProps> = ({ titulo, onAbrirMenu }) => {
  const { usuario } = useAutenticacao();

  return (
    <header className={estilos.barraSuperior}>
      <div className={estilos.esquerda}>
        <button className={estilos.botaoMenu} onClick={onAbrirMenu}>
          <Menu size={24} />
        </button>
        <h2 className={estilos.titulo}>{titulo}</h2>
      </div>
      
      {usuario && (
        <div className={estilos.direita}>
          <div className={estilos.avatar}>
            {usuario.nomeCompleto.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </header>
  );
};

export default BarraSuperior;
