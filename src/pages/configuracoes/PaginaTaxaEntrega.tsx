import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutPagina from '../../components/layout/LayoutPagina';
import InputTexto from '../../components/ui/InputTexto';
import Botao from '../../components/ui/Botao';
import Cartao from '../../components/ui/Cartao';
import Toggle from '../../components/ui/Toggle';
import { lojaMock } from '../../dados/loja';
import { mascaraMoeda } from '../../utils/formatacao';
import { Bike, Target, DollarSign } from 'lucide-react';
import estilos from './PaginaTaxaEntrega.module.css';

type ModeloCobranca = 'fixa' | 'distancia';

const PaginaTaxaEntrega = () => {
  const navigate = useNavigate();
  const [modelo, setModelo] = useState<ModeloCobranca>('fixa');
  const [taxaEntrega, setTaxaEntrega] = useState(mascaraMoeda(String(lojaMock.entrega.taxaEntregaReais * 100)));
  const [raioMaximo, setRaioMaximo] = useState(String(lojaMock.entrega.raioEntregaKm));
  const [freteGratis, setFreteGratis] = useState(false);
  const [valorMinimoFrete, setValorMinimoFrete] = useState(mascaraMoeda('6000'));

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Taxas de entrega salvas com sucesso!');
    navigate('/configuracoes');
  };

  return (
    <LayoutPagina titulo="Taxas de entrega">
      <form onSubmit={handleSalvar} className={estilos.form}>
        <Cartao className={estilos.secao}>
          <div className={estilos.grupo}>
            <span className={estilos.rotuloGrupo}>Modelo de cobrança</span>
            <div className={estilos.modelos}>
              <button
                type="button"
                className={`${estilos.modeloBotao} ${modelo === 'fixa' ? estilos.modeloAtivo : ''}`}
                onClick={() => setModelo('fixa')}
              >
                Taxa fixa
              </button>
              <button
                type="button"
                className={`${estilos.modeloBotao} ${modelo === 'distancia' ? estilos.modeloAtivo : ''}`}
                onClick={() => setModelo('distancia')}
              >
                Por distância
              </button>
            </div>
          </div>

          <div className={`${estilos.grupo} ${freteGratis ? estilos.desabilitado : ''}`}>
            <InputTexto
              rotulo="Taxa de entrega"
              valor={taxaEntrega}
              aoMudar={(v) => setTaxaEntrega(mascaraMoeda(v))}
              icone={<Bike size={18} />}
              disabled={freteGratis}
            />
            <InputTexto
              rotulo="Raio máximo de entrega (km)"
              valor={raioMaximo}
              aoMudar={setRaioMaximo}
              tipo="number"
              icone={<Target size={18} />}
              disabled={freteGratis}
            />
          </div>

          <div className={estilos.linhaToggle}>
            <div>
              <span className={estilos.tituloToggle}>Frete grátis</span>
              <p className={estilos.legendaToggle}>Acima de um valor mínimo</p>
            </div>
            <Toggle ativo={freteGratis} aoMudar={setFreteGratis} />
          </div>

          <div className={`${estilos.grupo} ${!freteGratis ? estilos.desabilitado : ''}`}>
            <InputTexto
              rotulo="Valor mínimo para frete grátis"
              valor={valorMinimoFrete}
              aoMudar={(v) => setValorMinimoFrete(mascaraMoeda(v))}
              icone={<DollarSign size={18} />}
              disabled={!freteGratis}
            />
          </div>
        </Cartao>

        <div className={estilos.acoes}>
          <Botao type="button" variante="fantasma" onClick={() => navigate('/configuracoes')}>Cancelar</Botao>
          <Botao type="submit" variante="primario">Salvar alterações</Botao>
        </div>
      </form>
    </LayoutPagina>
  );
};

export default PaginaTaxaEntrega;
