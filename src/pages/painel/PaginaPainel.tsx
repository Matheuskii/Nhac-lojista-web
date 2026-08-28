import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutPagina from '../../components/layout/LayoutPagina';
import Cartao from '../../components/ui/Cartao';
import Botao from '../../components/ui/Botao';
import Emblema from '../../components/ui/Emblema';
import { resumoFinanceiroMock } from '../../dados/financeiro';
import { pedidosMock } from '../../dados/pedidos';
import { formatarMoeda, formatarData } from '../../utils/formatacao';
import { DollarSign, ShoppingBag, TrendingUp, ChevronRight, Clock } from 'lucide-react';
import estilos from './PaginaPainel.module.css';

const PaginaPainel = () => {
  const navigate = useNavigate();
  const usuarioNome = "João"; // Mock
  const pedidosRecentes = pedidosMock.slice(0, 5);

  return (
    <LayoutPagina titulo="Painel">
      <div className={estilos.container}>
        <header className={estilos.cabecalho}>
          <h2 className={estilos.boasVindas}>Olá, {usuarioNome}! 👋</h2>
          <p className={estilos.subtitulo}>Aqui está o resumo da sua loja hoje.</p>
        </header>

        <section className={estilos.kpis}>
          <Cartao className={estilos.cartaoKpi}>
            <div className={estilos.kpiIcone} style={{ backgroundColor: 'var(--nhac-primaria-fundo)', color: 'var(--nhac-primaria)' }}>
              <DollarSign size={24} />
            </div>
            <div className={estilos.kpiInfo}>
              <span className={estilos.kpiRotulo}>Faturamento do Dia</span>
              <span className={estilos.kpiValor}>{formatarMoeda(resumoFinanceiroMock.faturamentoDia)}</span>
            </div>
          </Cartao>
          <Cartao className={estilos.cartaoKpi}>
            <div className={estilos.kpiIcone} style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}>
              <ShoppingBag size={24} />
            </div>
            <div className={estilos.kpiInfo}>
              <span className={estilos.kpiRotulo}>Pedidos do Dia</span>
              <span className={estilos.kpiValor}>{resumoFinanceiroMock.numeroPedidosDia}</span>
            </div>
          </Cartao>
          <Cartao className={estilos.cartaoKpi}>
            <div className={estilos.kpiIcone} style={{ backgroundColor: '#E8F5E9', color: '#388E3C' }}>
              <TrendingUp size={24} />
            </div>
            <div className={estilos.kpiInfo}>
              <span className={estilos.kpiRotulo}>Ticket Médio</span>
              <span className={estilos.kpiValor}>{formatarMoeda(resumoFinanceiroMock.ticketMedio)}</span>
            </div>
          </Cartao>
        </section>

        <div className={estilos.duasColunas}>
          <section className={estilos.pedidosRecentes}>
            <div className={estilos.secaoCabecalho}>
              <h3 className={estilos.secaoTitulo}>Pedidos Recentes</h3>
              <Botao variante="fantasma" onClick={() => navigate('/pedidos')}>Ver todos</Botao>
            </div>
            <div className={estilos.listaPedidos}>
              {pedidosRecentes.map(pedido => (
                <Cartao key={pedido.id} className={estilos.cartaoPedido}>
                  <div className={estilos.pedidoPrincipal}>
                    <span className={estilos.pedidoId}>#{pedido.numeroPedido}</span>
                    <span className={estilos.pedidoCliente}>{pedido.clienteNome}</span>
                  </div>
                  <div className={estilos.pedidoStatus}>
                    <Emblema variante={pedido.status === 'entregue' ? 'sucesso' : pedido.status === 'cancelado' ? 'erro' : 'info'}>
                      {pedido.status}
                    </Emblema>
                  </div>
                  <div className={estilos.pedidoTotal}>
                    {formatarMoeda(pedido.valorTotal)}
                  </div>
                  <div className={estilos.pedidoTempo}>
                    <Clock size={14} />
                    <span>{formatarData(pedido.dataCriacao)}</span>
                  </div>
                  <Botao variante="fantasma" onClick={() => navigate(`/pedidos/${pedido.id}`)} icone={<ChevronRight size={20} />} />
                </Cartao>
              ))}
            </div>
          </section>

          <section className={estilos.linksRapidos}>
            <h3 className={estilos.secaoTitulo}>Ações Rápidas</h3>
            <div className={estilos.gridLinks}>
              <Botao onClick={() => navigate('/produtos/novo')} variante="secundario" larguraTotal>
                Adicionar Produto
              </Botao>
              <Botao onClick={() => navigate('/funcionarios/novo')} variante="secundario" larguraTotal>
                Adicionar Funcionário
              </Botao>
              <Botao onClick={() => navigate('/financeiro')} variante="secundario" larguraTotal>
                Ver Relatórios
              </Botao>
            </div>
          </section>
        </div>
      </div>
    </LayoutPagina>
  );
};

export default PaginaPainel;
