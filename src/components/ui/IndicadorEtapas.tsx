import React from 'react';
import { Check } from 'lucide-react';
import estilos from './IndicadorEtapas.module.css';

export interface PropsIndicadorEtapas {
  etapas: string[];
  etapaAtual: number;
  aoClicarEtapa?: (indice: number) => void;
  className?: string;
}

const IndicadorEtapas = ({ etapas, etapaAtual, aoClicarEtapa, className = '' }: PropsIndicadorEtapas) => {
  return (
    <div className={`${estilos.container} ${className}`}>
      {etapas.map((etapa, indice) => {
        const completa = indice < etapaAtual;
        const ativa = indice === etapaAtual;
        const pendente = indice > etapaAtual;
        
        return (
          <React.Fragment key={etapa}>
            <div 
              className={`${estilos.etapaWrapper} ${aoClicarEtapa && completa ? estilos.clicavel : ''}`}
              onClick={() => (aoClicarEtapa && completa) ? aoClicarEtapa(indice) : undefined}
            >
              <div className={`
                ${estilos.circulo} 
                ${completa ? estilos.completa : ''} 
                ${ativa ? estilos.ativa : ''} 
                ${pendente ? estilos.pendente : ''}
              `}>
                {completa ? <Check size={16} strokeWidth={3} /> : (indice + 1)}
              </div>
              <span className={`
                ${estilos.rotulo}
                ${ativa ? estilos.rotuloAtivo : ''}
                ${pendente ? estilos.rotuloPendente : ''}
              `}>
                {etapa}
              </span>
            </div>
            
            {indice < etapas.length - 1 && (
              <div className={`${estilos.linha} ${indice < etapaAtual ? estilos.linhaCompleta : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default IndicadorEtapas;
