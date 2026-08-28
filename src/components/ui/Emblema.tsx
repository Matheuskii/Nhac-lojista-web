import React, { ReactNode } from 'react';
import estilos from './Emblema.module.css';

export interface PropsEmblema {
  variante?: 'sucesso' | 'erro' | 'aviso' | 'info' | 'neutro';
  children: ReactNode;
  className?: string;
}

const Emblema = ({ variante = 'neutro', children, className = '' }: PropsEmblema) => {
  return (
    <span className={`${estilos.emblema} ${estilos[variante]} ${className}`}>
      {children}
    </span>
  );
};

export default Emblema;
