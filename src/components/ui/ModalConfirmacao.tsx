import React from 'react';
import Botao from './Botao';
import estilos from './ModalConfirmacao.module.css';

interface ModalConfirmacaoProps {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  textoBotaoConfirmar?: string;
  varianteBotaoConfirmar?: 'primario' | 'perigo' | 'secundario';
  aoConfirmar: () => void;
  aoCancelar: () => void;
}

const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({
  aberto,
  titulo,
  mensagem,
  textoBotaoConfirmar = 'Confirmar',
  varianteBotaoConfirmar = 'perigo',
  aoConfirmar,
  aoCancelar,
}) => {
  if (!aberto) return null;

  return (
    <div className={estilos.overlay} onClick={aoCancelar}>
      <div className={estilos.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={estilos.titulo}>{titulo}</h2>
        <p className={estilos.mensagem}>{mensagem}</p>
        <div className={estilos.acoes}>
          <Botao variante="secundario" onClick={aoCancelar}>
            Cancelar
          </Botao>
          <Botao variante={varianteBotaoConfirmar} onClick={aoConfirmar}>
            {textoBotaoConfirmar}
          </Botao>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;
