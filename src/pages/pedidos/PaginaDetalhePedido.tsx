import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LayoutPagina from '../../components/layout/LayoutPagina';
import Cartao from '../../components/ui/Cartao';
import Botao from '../../components/ui/Botao';
import Emblema from '../../components/ui/Emblema';
import { StatusPedido } from '../../types';
import { formatarMoeda, formatarDataHora, STATUS_PEDIDO_INFO, FLUXO_STATUS_PEDIDO } from '../../utils/formatacao';
import { ArrowLeft, User, Phone, MapPin, CreditCard, Check } from 'lucide-react';
import { pedidosMock } from '../../dados/pedidos';
import estilos from './PaginaDetalhePedido.module.css';

const ROTULOS_ETAPA: Record<string, string> = {
  PENDENTE: 'Recebido',
  PAGO: 'Pago',
  PREPARANDO: 'Em preparo',
  SAIU_ENTREGA: 'A caminho',
  ENTREGUE: 'Entregue',
};

const AVISO_BACKEND =
  'O detalhe de pedido para o lojista ainda não existe no backend (GET /pedidos/{id} só autoriza o cliente). Esta tela está mockada até haver um endpoint de lojista.';

const PaginaDetalhePedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pedidoMock = pedidosMock.find(p => p.id === id) ?? null;
  const [status, setStatus] = useState<StatusPedido | undefined>(pedidoMock?.status);

  useEffect(() => {
    setStatus(pedidoMock?.status);
  }, [id, pedidoMock?.status]);

  if (!pedidoMock) {
    return (
      <LayoutPagina titulo="Pedido">
        <div className={estilos.naoEncontrado}>
          <p>{AVISO_BACKEND}</p>
          <Botao variante="secundario" onClick={() => navigate('/pedidos')}>Voltar para pedidos</Botao>
        </div>
      </LayoutPagina>
    );
  }

  const statusAtual = status ?? pedidoMock.status;
  const statusInfo = STATUS_PEDIDO_INFO[statusAtual] ?? { rotulo: statusAtual, variante: 'neutro' as const };
  const indiceAtual = FLUXO_STATUS_PEDIDO.indexOf(statusAtual as typeof FLUXO_STATUS_PEDIDO[number]);
  const cancelado = statusAtual === 'CANCELADO';

  return (
    <LayoutPagina titulo={`Pedido #${pedidoMock.numeroPedido}`}>
      <div className={estilos.container}>
        <p className={estilos.avisoBloqueio}>{AVISO_BACKEND}</p>

        <header className={estilos.cabecalho}>
          <button className={estilos.botaoVoltar} onClick={() => navigate('/pedidos')} aria-label="Voltar">
            <ArrowLeft size={20} />
          </button>
          <h2 className={estilos.titulo}>Pedido #{pedidoMock.numeroPedido}</h2>
          <Emblema variante={statusInfo.variante} className={estilos.emblemaTopo}>{statusInfo.rotulo}</Emblema>
        </header>

        <div className={estilos.colunas}>
          <div className={estilos.colunaPrincipal}>
            <section>
              <h3 className={estilos.tituloSecao}>Informações do cliente</h3>
              <Cartao className={estilos.cartaoInfo}>
                <div className={estilos.linhaInfo}>
                  <User size={18} className={estilos.iconeInfo} />
                  <span>{pedidoMock.clienteNome}</span>
                </div>
                <div className={estilos.divisor} />
                <div className={estilos.linhaInfo}>
                  <Phone size={18} className={estilos.iconeInfo} />
                  <span>{pedidoMock.clienteTelefone}</span>
                </div>
                <div className={estilos.divisor} />
                <div className={estilos.linhaInfo}>
                  <MapPin size={18} className={estilos.iconeInfo} />
                  <span>{pedidoMock.enderecoEntrega}</span>
                </div>
              </Cartao>
            </section>

            <section>
              <h3 className={estilos.tituloSecao}>Itens do pedido</h3>
              <Cartao className={estilos.cartaoInfo}>
                {pedidoMock.itens.map((item, idx) => (
                  <React.Fragment key={`${item.produtoId}-${idx}`}>
                    <div className={estilos.linhaItem}>
                      <div className={estilos.infoItem}>
                        <span className={estilos.nomeItem}>{item.quantidade}x {item.nomeProduto}</span>
                        {item.adicionais && item.adicionais.length > 0 && (
                          <span className={estilos.adicionaisItem}>{item.adicionais.join(', ')}</span>
                        )}
                      </div>
                      <span className={estilos.precoItem}>{formatarMoeda(item.precoUnitario * item.quantidade)}</span>
                    </div>
                    <div className={estilos.divisor} />
                  </React.Fragment>
                ))}
                {pedidoMock.observacoes && (
                  <>
                    <p className={estilos.observacoes}>Obs: {pedidoMock.observacoes}</p>
                    <div className={estilos.divisor} />
                  </>
                )}
                <div className={estilos.linhaTotal}>
                  <span>Total</span>
                  <span>{formatarMoeda(pedidoMock.valorTotal)}</span>
                </div>
              </Cartao>
            </section>

            <section>
              <h3 className={estilos.tituloSecao}>Pagamento</h3>
              <Cartao className={estilos.cartaoInfo}>
                <div className={estilos.linhaInfo}>
                  <CreditCard size={18} className={estilos.iconeInfo} />
                  <span>{pedidoMock.formaPagamento} · {formatarDataHora(pedidoMock.dataCriacao)}</span>
                </div>
              </Cartao>
            </section>
          </div>

          <div className={estilos.colunaLateral}>
            <h3 className={estilos.tituloSecao}>Andamento do pedido</h3>
            <Cartao className={estilos.cartaoAndamento}>
              {cancelado ? (
                <p className={estilos.mensagemCancelado}>Este pedido foi cancelado.</p>
              ) : (
                <div className={estilos.etapas}>
                  {FLUXO_STATUS_PEDIDO.map((etapa, idx) => {
                    const completa = idx < indiceAtual;
                    const ativa = idx === indiceAtual;
                    return (
                      <div key={etapa} className={estilos.etapa}>
                        <div className={`${estilos.marcador} ${completa ? estilos.marcadorCompleto : ''} ${ativa ? estilos.marcadorAtivo : ''}`}>
                          {completa ? <Check size={14} strokeWidth={3} /> : idx + 1}
                        </div>
                        <span className={`${estilos.rotuloEtapa} ${ativa ? estilos.rotuloEtapaAtivo : ''}`}>
                          {ROTULOS_ETAPA[etapa]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className={estilos.selecaoStatus}>
                <label className={estilos.rotuloSelecao} htmlFor="status-pedido">Alterar status para</label>
                <select
                  id="status-pedido"
                  className={estilos.select}
                  value={statusAtual}
                  onChange={(e) => setStatus(e.target.value as StatusPedido)}
                  disabled
                >
                  {FLUXO_STATUS_PEDIDO.map(etapa => (
                    <option key={etapa} value={etapa}>{ROTULOS_ETAPA[etapa]}</option>
                  ))}
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>

              <Botao larguraTotal disabled>Salvar status</Botao>
            </Cartao>
          </div>
        </div>
      </div>
    </LayoutPagina>
  );
};

export default PaginaDetalhePedido;
