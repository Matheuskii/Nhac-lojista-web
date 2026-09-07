import React from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutPagina from '../../components/layout/LayoutPagina';
import Cartao from '../../components/ui/Cartao';
import Avatar from '../../components/ui/Avatar';
import { lojaMock } from '../../dados/loja';
import { useAutenticacao } from '../../hooks/useAutenticacao';
import { Store, Bike, CreditCard, MapPin, Settings, LogOut, ChevronRight } from 'lucide-react';
import estilos from './PaginaInformacaoLoja.module.css';

interface ItemAtalho {
  icone: React.ElementType;
  rotulo: string;
  caminho?: string;
}

const ITENS_LOJA: ItemAtalho[] = [
  { icone: Store, rotulo: 'Nome, categoria e descrição', caminho: '/configuracoes/editar' },
  { icone: Bike, rotulo: 'Taxas de entrega', caminho: '/configuracoes/taxa-entrega' },
  { icone: CreditCard, rotulo: 'Formas de pagamento' },
  { icone: MapPin, rotulo: 'Endereço da loja' },
  { icone: Settings, rotulo: 'Configurações da conta' },
];

const PaginaInformacaoLoja = () => {
  const navigate = useNavigate();
  const { sair } = useAutenticacao();

  return (
    <LayoutPagina titulo="Informações da loja">
      <div className={estilos.container}>
        <div className={estilos.perfil}>
          <Avatar nome={lojaMock.nome} fotoUrl={lojaMock.fotoUrl} tamanho="grande" />
          <h2 className={estilos.nomeLoja}>{lojaMock.nome}</h2>
          <p className={estilos.categoriaLoja}>Cozinha · {lojaMock.categoria}</p>
        </div>

        <Cartao className={estilos.cartaoLista}>
          {ITENS_LOJA.map((item, idx) => {
            const Icone = item.icone;
            return (
              <React.Fragment key={item.rotulo}>
                <button
                  className={estilos.itemLista}
                  onClick={() => item.caminho && navigate(item.caminho)}
                  disabled={!item.caminho}
                >
                  <Icone size={20} className={estilos.iconeItem} />
                  <span className={estilos.rotuloItem}>{item.rotulo}</span>
                  <ChevronRight size={18} className={estilos.setaItem} />
                </button>
                {idx < ITENS_LOJA.length - 1 && <div className={estilos.divisor} />}
              </React.Fragment>
            );
          })}
        </Cartao>

        <Cartao className={estilos.cartaoLista}>
          <button className={estilos.itemLista} onClick={sair}>
            <LogOut size={20} className={estilos.iconeItem} />
            <span className={estilos.rotuloItem}>Sair da conta</span>
            <ChevronRight size={18} className={estilos.setaItem} />
          </button>
        </Cartao>
      </div>
    </LayoutPagina>
  );
};

export default PaginaInformacaoLoja;
