import React, { ReactNode, useState } from 'react';
import BarraLateral from './BarraLateral';
import BarraSuperior from './BarraSuperior';
import NavegacaoMobile from './NavegacaoMobile';
import estilos from './LayoutPagina.module.css';

interface LayoutPaginaProps {
  titulo: string;
  children: ReactNode;
}

const LayoutPagina: React.FC<LayoutPaginaProps> = ({ titulo, children }) => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [sidebarRecolhida, setSidebarRecolhida] = useState(false);

  return (
    <div className={estilos.layout}>
      <BarraLateral 
        abertaMobile={menuAberto} 
        onFechar={() => setMenuAberto(false)}
        recolhida={sidebarRecolhida}
        onToggleRecolher={() => setSidebarRecolhida(v => !v)}
      />
      
      {menuAberto && (
        <div 
          className={estilos.overlay} 
          onClick={() => setMenuAberto(false)}
        />
      )}
      
      <div className={`${estilos.conteudoPrincipal} ${sidebarRecolhida ? estilos.conteudoPrincipalRecolhido : ''}`}>
        <BarraSuperior 
          titulo={titulo} 
          onAbrirMenu={() => {
            setMenuAberto(true);
            setSidebarRecolhida(false);
          }} 
          recolhida={sidebarRecolhida}
        />
        
        <main className={estilos.main}>
          {children}
        </main>
      </div>

      <NavegacaoMobile />
    </div>
  );
};

export default LayoutPagina;
