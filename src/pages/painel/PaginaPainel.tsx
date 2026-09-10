import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutPagina from '../../components/layout/LayoutPagina';
import Cartao from '../../components/ui/Cartao';
import Botao from '../../components/ui/Botao';
import Emblema from '../../components/ui/Emblema';
import Toggle from '../../components/ui/Toggle';
import { resumoFinanceiroMock, faturamentoDiarioMock } from '../../dados/financeiro';
import { pedidosMock } from '../../dados/pedidos';
import { lojaMock } from '../../dados/loja';
import { formatarMoeda, formatarData, STATUS_PEDIDO_INFO } from '../../utils/formatacao';
import { DollarSign, ShoppingBag, TrendingUp, ChevronRight, Clock, Star, ChefHat, Bike, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import estilos from './PaginaPainel.module.css';

const PaginaPainel = () => {
  const navigate = useNavigate();
  const usuarioNome = "João";
  const pedidosRecentes = pedidosMock.slice(0, 5);

  const [lojaAberta, setLojaAberta] = useState(true);

  // Status de pedidos mock (você pode iterar pelos pedidos ou usar dados já definidos)
  const pedidosEmPreparo = pedidosMock.filter(p => p.status === 'PREPARANDO' || p.status === 'PENDENTE' || p.status === 'PAGO').length;
  const pedidosCaminho = pedidosMock.filter(p => p.status === 'SAIU_ENTREGA').length;
  const pedidosConcluidos = pedidosMock.filter(p => p.status === 'ENTREGUE').length;

  const faturamentoSemana = faturamentoDiarioMock.slice(-7);
  const variacaoDiaAnterior = 12.5; // Exemplo fixo de variação

  const formatoDataGrafico = (dataString: string) => {
    const data = new Date(dataString);
    return `${data.getDate()}/${data.getMonth() + 1}`;
  };

  return (
    <LayoutPagina titulo="Painel">
      <div className={estilos.container}>
        <header className={estilos.cabecalho}>
          <div className={estilos.cabecalhoTexto}>
            <h2 className={estilos.boasVindas}>Olá, {usuarioNome}! 👋</h2>
            <p className={estilos.subtitulo}>Aqui está o resumo da sua loja hoje.</p>
          </div>
          <div className={estilos.statusLoja}>
            <span className={estilos.statusTexto}>{lojaAberta ? 'Sua loja está aberta' : 'Sua loja está fechada'}</span>
            <Toggle rotulo="" ativo={lojaAberta} aoMudar={setLojaAberta} />
            <div className={`${estilos.statusBolinha} ${lojaAberta ? estilos.aberta : estilos.fechada}`} />
          </div>
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
          <Cartao className={estilos.cartaoKpi}>
            <div className={estilos.kpiIcone} style={{ backgroundColor: '#FFF8E1', color: '#FBC02D' }}>
              <Star size={24} />
            </div>
            <div className={estilos.kpiInfo}>
              <span className={estilos.kpiRotulo}>Avaliação da Loja</span>
              <div className={estilos.avaliacaoValor}>
                <span className={estilos.kpiValor}>{lojaMock.notaMedia}</span>
                <span className={estilos.avaliacaoEstrelas}>⭐</span>
              </div>
              <span className={estilos.avaliacaoTotal}>({lojaMock.totalAvaliacoes} avaliações)</span>
            </div>
          </Cartao>
        </section>

        <section className={estilos.statusPedidosGrid}>
          <Cartao className={`${estilos.cartaoStatus} ${estilos.statusAmarelo}`}>
            <ChefHat size={28} className={estilos.iconeStatus} />
            <div className={estilos.infoStatus}>
              <span className={estilos.valorStatus}>{pedidosEmPreparo}</span>
              <span className={estilos.rotuloStatus}>Em preparo</span>
            </div>
          </Cartao>
          <Cartao className={`${estilos.cartaoStatus} ${estilos.statusAzul}`}>
            <Bike size={28} className={estilos.iconeStatus} />
            <div className={estilos.infoStatus}>
              <span className={estilos.valorStatus}>{pedidosCaminho}</span>
              <span className={estilos.rotuloStatus}>A caminho</span>
            </div>
          </Cartao>
          <Cartao className={`${estilos.cartaoStatus} ${estilos.statusVerde}`}>
            <CheckCircle size={28} className={estilos.iconeStatus} />
            <div className={estilos.infoStatus}>
              <span className={estilos.valorStatus}>{pedidosConcluidos}</span>
              <span className={estilos.rotuloStatus}>Concluídos hoje</span>
            </div>
          </Cartao>
        </section>

        <div className={estilos.duasColunas}>
          <div className={estilos.colunaEsquerda}>
            <section className={estilos.graficoSecao}>
              <Cartao className={estilos.cartaoGrafico}>
                <div className={estilos.graficoHeader}>
                  <div className={estilos.graficoTitulos}>
                    <h3 className={estilos.secaoTitulo}>Faturamento (Últimos 7 dias)</h3>
                    <div className={estilos.graficoVariacao}>
                      <TrendingUp size={16} />
                      <span>+{variacaoDiaAnterior}% em relação a ontem</span>
                    </div>
                  </div>
                </div>
                <div className={estilos.areaGrafico}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={faturamentoSemana} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--nhac-borda)" />
                      <XAxis dataKey="data" tickFormatter={formatoDataGrafico} stroke="var(--nhac-texto-claro)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--nhac-texto-claro)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$ ${val}`} />
                      <Tooltip 
                        formatter={(value: any) => [formatarMoeda(Number(value) || 0), 'Faturamento']}
                        labelFormatter={(label: any) => formatoDataGrafico(String(label || ''))}
                        contentStyle={{ borderRadius: '8px', border: '1px solid var(--nhac-borda)' }}
                      />
                      <Line type="monotone" dataKey="valor" stroke="var(--nhac-primaria)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Cartao>
            </section>

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
                      <Emblema variante={pedido.status === 'ENTREGUE' ? 'sucesso' : pedido.status === 'CANCELADO' ? 'erro' : 'info'}>
                        {STATUS_PEDIDO_INFO[pedido.status]?.rotulo ?? pedido.status}
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
          </div>

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
