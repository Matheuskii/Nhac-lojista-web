import React from 'react';
import { Check } from 'lucide-react';
import estilos from './Checkbox.module.css';

export interface PropsCheckbox {
  marcado: boolean;
  aoMudar: (marcado: boolean) => void;
  rotulo?: string;
  desabilitado?: boolean;
}

const Checkbox = ({ marcado, aoMudar, rotulo, desabilitado = false }: PropsCheckbox) => {
  return (
    <label className={`${estilos.container} ${desabilitado ? estilos.desabilitado : ''}`}>
      <div className={estilos.inputWrapper}>
        <input
          type="checkbox"
          className={estilos.inputOculto}
          checked={marcado}
          onChange={(e) => aoMudar(e.target.checked)}
          disabled={desabilitado}
        />
        <div className={`${estilos.caixa} ${marcado ? estilos.marcado : ''}`}>
          {marcado && <Check size={14} className={estilos.icone} strokeWidth={3} />}
        </div>
      </div>
      {rotulo && <span className={estilos.rotulo}>{rotulo}</span>}
    </label>
  );
};

export default Checkbox;
