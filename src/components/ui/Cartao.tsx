import React, { ReactNode } from 'react';
import estilos from './Cartao.module.css';

export interface PropsCartao {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  destaque?: boolean;
}

const Cartao = ({ children, className = '', onClick, destaque = false }: PropsCartao) => {
  const classes = [
    estilos.cartao,
    onClick ? estilos.clicavel : '',
    destaque ? estilos.destaque : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default Cartao;
