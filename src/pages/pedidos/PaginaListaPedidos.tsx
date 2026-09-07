import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutPagina from '../../components/layout/LayoutPagina';
import Cartao from '../../components/ui/Cartao';
import Emblema from '../../components/ui/Emblema';
import { pedidosMock } from '../../dados/pedidos';
import { StatusPedido } from '../../types';
import { formatarMoeda, formatarHora, STATUS_PEDIDO_INFO } from '../../utils/formatacao';
import { Bell, ChevronRight } from 'lucide-react';
import estilos from './PaginaListaPedidos.module.css';

interface FiltroTag {
  valor: StatusPedido | 'todos';
  rotulo: string;
}

const FILTROS: FiltroTag[] = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'pendente', rotulo: 'Confirmar' },
  { valor: 'preparando', rotulo: 'Em preparo' },
  { valor: 'saiu_entrega', rotulo: 'A caminho' },
  { valor: 'entregue', rotulo: 'Entregue' },
];

const PaginaListaPedidos = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState<FiltroTag['valor']>('todos');

  const contagemPorFiltro = (valor: FiltroTag['valor']) =>
    valor === 'todos' ? pedidosMock.length : pedidosMock.filter(p => p.status === valor).length;

  const pedidosFiltrados = pedidosMock
    .filter(p => filtro === 'todos' || p.status === filtro)
    .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());

  return (
    <LayoutPagina titulo="Pedidos">
      <div className={estilos.container}>
        <header className={estilos.cabecalho}>
          <h2 className={estilos.titulo}>Pedidos</h2>
          <button className={estilos.botaoSino} aria-label="Notificações">
            <Bell size={20} />
          </button>
        </header>

        <div className={estilos.filtros}>
          {FILTROS.map(f => (
            <button
              key={f.valor}
              className={`${estilos.filtroTag} ${filtro === f.valor ? estilos.filtroAtivo : ''}`}
              onClick={() => setFiltro(f.valor)}
            >
              {f.rotulo}
              <span className={estilos.filtroContagem}>{contagemPorFiltro(f.valor)}</span>
            </button>
          ))}
        </div>

        {pedidosFiltrados.length === 0 ? (
          <div className={estilos.vazio}>
            <p>Nenhum pedido nesse status.</p>
          </div>
        ) : (
          <div className={estilos.lista}>
            {pedidosFiltrados.map(pedido => {
              const statusInfo = STATUS_PEDIDO_INFO[pedido.status];
              const totalItens = pedido.itens.reduce((soma, item) => soma + item.quantidade, 0);
              return (
                <Cartao
                  key={pedido.id}
                  className={estilos.cartaoPedido}
                  onClick={() => navigate(`/pedidos/${pedido.id}`)}
                >
                  <div className={estilos.infoPrincipal}>
                    <div className={estilos.linhaTopo}>
                      <span className={estilos.codigo}>#{pedido.numeroPedido}</span>
                      <Emblema variante={statusInfo.variante}>{statusInfo.rotulo}</Emblema>
                    </div>
                    <span className={estilos.cliente}>{pedido.clienteNome}</span>
                    <span className={estilos.detalhe}>
                      {totalItens} {totalItens === 1 ? 'item' : 'itens'} · {formatarMoeda(pedido.valorTotal)} · {formatarHora(pedido.dataCriacao)}
                    </span>
                  </div>
                  <ChevronRight size={20} className={estilos.seta} />
                </Cartao>
              );
            })}
          </div>
        )}
      </div>
    </LayoutPagina>
  );
};

export default PaginaListaPedidos;
