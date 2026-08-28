import React, { useState } from 'react';
import LayoutPagina from '../../components/layout/LayoutPagina';
import Cartao from '../../components/ui/Cartao';
import Botao from '../../components/ui/Botao';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  resumoFinanceiroMock, faturamentoDiarioMock, pedidosPorDiaMock, 
  vendasPorCategoriaMock, pedidosPorHoraMock, produtosMaisVendidosMock 
} from '../../dados/financeiro';
import { formatarMoeda } from '../../utils/formatacao';
import { DollarSign, ShoppingCart, TrendingDown, Percent, Activity } from 'lucide-react';
import estilos from './PaginaFinanceiro.module.css';

const PaginaFinanceiro = () => {
  const [periodo, setPeriodo] = useState('7 dias');
  
  const CORES_PIE = ['#FF6961', '#FF8A84', '#E85D56', '#5D201C', '#8B4944', '#D4A8A5'];

  return (
    <LayoutPagina titulo="Financeiro">
      <div className={estilos.container}>
        <div className={estilos.filtros}>
          {['Hoje', '7 dias', '30 dias'].map(p => (
            <Botao 
              key={p} 
              variante={periodo === p ? 'primario' : 'secundario'}
              onClick={() => setPeriodo(p)}
            >
              {p}
            </Botao>
          ))}
        </div>

        <div className={estilos.kpis}>
          <Cartao className={estilos.cartaoKpi}>
            <div className={estilos.iconeKpi} style={{ backgroundColor: 'var(--nhac-primaria-fundo)', color: 'var(--nhac-primaria)' }}><DollarSign size={24} /></div>
            <div className={estilos.infoKpi}>
              <span>Faturamento Dia</span>
              <strong>{formatarMoeda(resumoFinanceiroMock.faturamentoDia)}</strong>
            </div>
          </Cartao>
          <Cartao className={estilos.cartaoKpi}>
            <div className={estilos.iconeKpi} style={{ backgroundColor: '#E8F5E9', color: '#388E3C' }}><Activity size={24} /></div>
            <div className={estilos.infoKpi}>
              <span>Faturamento Mês</span>
              <strong>{formatarMoeda(resumoFinanceiroMock.faturamentoMes)}</strong>
            </div>
          </Cartao>
          <Cartao className={estilos.cartaoKpi}>
            <div className={estilos.iconeKpi} style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}><ShoppingCart size={24} /></div>
            <div className={estilos.infoKpi}>
              <span>Pedidos Mês</span>
              <strong>{resumoFinanceiroMock.numeroPedidosMes}</strong>
            </div>
          </Cartao>
          <Cartao className={estilos.cartaoKpi}>
            <div className={estilos.iconeKpi} style={{ backgroundColor: '#FFF3E0', color: '#F57C00' }}><Percent size={24} /></div>
            <div className={estilos.infoKpi}>
              <span>Ticket Médio</span>
              <strong>{formatarMoeda(resumoFinanceiroMock.ticketMedio)}</strong>
            </div>
          </Cartao>
          <Cartao className={estilos.cartaoKpi}>
            <div className={estilos.iconeKpi} style={{ backgroundColor: '#FFEBEE', color: '#D32F2F' }}><TrendingDown size={24} /></div>
            <div className={estilos.infoKpi}>
              <span>Taxa Cancel.</span>
              <strong>{resumoFinanceiroMock.taxaCancelamento}%</strong>
            </div>
          </Cartao>
        </div>

        <div className={estilos.gridGraficos}>
          <Cartao className={estilos.cartaoGrafico}>
            <h3 className={estilos.tituloGrafico}>Faturamento (Últimos dias)</h3>
            <div className={estilos.graficoWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={faturamentoDiarioMock}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--nhac-borda)" />
                  <XAxis dataKey="data" stroke="var(--nhac-texto-claro)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--nhac-texto-claro)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip formatter={(value: any) => [formatarMoeda(value), 'Faturamento']} />
                  <Line type="monotone" dataKey="valor" stroke="#FF6961" strokeWidth={3} dot={{ r: 4, fill: '#FF6961' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Cartao>

          <Cartao className={estilos.cartaoGrafico}>
            <h3 className={estilos.tituloGrafico}>Pedidos por Dia da Semana</h3>
            <div className={estilos.graficoWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pedidosPorDiaMock}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--nhac-borda)" />
                  <XAxis dataKey="dia" stroke="var(--nhac-texto-claro)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--nhac-texto-claro)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value: any) => [value, 'Pedidos']} cursor={{ fill: 'var(--nhac-fundo)' }} />
                  <Bar dataKey="quantidade" fill="#FF6961" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Cartao>

          <Cartao className={estilos.cartaoGrafico}>
            <h3 className={estilos.tituloGrafico}>Vendas por Categoria</h3>
            <div className={estilos.graficoWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vendasPorCategoriaMock}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="valor"
                  >
                    {vendasPorCategoriaMock.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CORES_PIE[index % CORES_PIE.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [formatarMoeda(value), 'Vendas']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Cartao>

          <Cartao className={estilos.cartaoGrafico}>
            <h3 className={estilos.tituloGrafico}>Pedidos por Horário</h3>
            <div className={estilos.graficoWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pedidosPorHoraMock}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--nhac-borda)" />
                  <XAxis dataKey="hora" stroke="var(--nhac-texto-claro)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--nhac-texto-claro)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value: any) => [value, 'Pedidos']} cursor={{ fill: 'var(--nhac-fundo)' }} />
                  <Bar dataKey="quantidade" fill="#FF8A84" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Cartao>
        </div>

        <Cartao className={estilos.tabelaCartao}>
          <h3 className={estilos.tituloGrafico} style={{ padding: '24px 24px 0 24px' }}>Produtos Mais Vendidos</h3>
          <div className={estilos.responsivoTabela}>
            <table className={estilos.tabela}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Produto</th>
                  <th>Qtd Vendida</th>
                  <th>Faturamento</th>
                </tr>
              </thead>
              <tbody>
                {produtosMaisVendidosMock.map((prod, idx) => (
                  <tr key={prod.posicao}>
                    <td>#{idx + 1}</td>
                    <td className={estilos.nomeProduto}>{prod.nome}</td>
                    <td>{prod.quantidadeVendida} un</td>
                    <td className={estilos.valorProduto}>{formatarMoeda(prod.faturamento)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Cartao>
      </div>
    </LayoutPagina>
  );
};

export default PaginaFinanceiro;
