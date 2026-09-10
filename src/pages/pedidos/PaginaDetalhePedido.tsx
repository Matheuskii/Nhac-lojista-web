import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LayoutPagina from '../../components/layout/LayoutPagina';
import Cartao from '../../components/ui/Cartao';
import Botao from '../../components/ui/Botao';
import Emblema from '../../components/ui/Emblema';
import { StatusPedido } from '../../types';
import { formatarMoeda, formatarDataHora, STATUS_PEDIDO_INFO, FLUXO_STATUS_PEDIDO } from '../../utils/formatacao';
import { ArrowLeft, User, Phone, MapPin, CreditCard, Check } from 'lucide-react';
import { buscarPedido, atualizarStatusPedido, PedidoDetalheDTO } from '../../services/api';
import estilos from './PaginaDetalhePedido.module.css';

const ROTULOS_ETAPA: Record<string, string> = {
  pendente: 'Recebido',
  aceito: 'Aceito',
  preparando: 'Em preparo',
  saiu_entrega: 'A caminho',
  entregue: 'Entregue',
};

const PaginaDetalhePedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<PedidoDetalheDTO | null>(null);
  const [status, setStatus] = useState<StatusPedido | undefined>(undefined);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarPedido();
  }, [id]);

  async function carregarPedido() {
    try {
      setCarregando(true);
      setErro(null);
      if (!id) return;
      const dados = await buscarPedido(id);
      setPedido(dados);
      setStatus(dados.status as StatusPedido);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar pedido');
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) {
    return (
      <LayoutPagina titulo="Pedido">
        <div className={estilos.naoEncontrado}>
          <p>Carregando pedido...</p>
        </div>
      </LayoutPagina>
    );
  }

  if (erro || !pedido) {
    return (
      <LayoutPagina titulo="Pedido">
        <div className={estilos.naoEncontrado}>
          <p>{erro || 'Pedido não encontrado.'}</p>
          <Botao variante="secundario" onClick={() => navigate('/pedidos')}>Voltar para pedidos</Botao>
        </div>
      </LayoutPagina>
    );
  }

  const statusInfo = STATUS_PEDIDO_INFO[status ?? pedido.status];
  const indiceAtual = FLUXO_STATUS_PEDIDO.indexOf((status ?? pedido.status) as typeof FLUXO_STATUS_PEDIDO[number]);
  const cancelado = status === 'cancelado';

  const handleSalvarStatus = async () => {
    try {
      if (!id || !status) return;
      await atualizarStatusPedido(id, status);
      alert(`Status do pedido #${pedido.numeroPedido} atualizado para "${STATUS_PEDIDO_INFO[status].rotulo}".`);
      navigate('/pedidos');
    } catch (err) {
      alert('Erro ao atualizar status do pedido');
    }
  };

  return (
    <LayoutPagina titulo={`Pedido #${pedido.numeroPedido}`}>
      <div className={estilos.container}>
        <header className={estilos.cabecalho}>
          <button className={estilos.botaoVoltar} onClick={() => navigate('/pedidos')} aria-label="Voltar">
            <ArrowLeft size={20} />
          </button>
          <h2 className={estilos.titulo}>Pedido #{pedido.numeroPedido}</h2>
          <Emblema variante={statusInfo.variante} className={estilos.emblemaTopo}>{statusInfo.rotulo}</Emblema>
        </header>

        <div className={estilos.colunas}>
          <div className={estilos.colunaPrincipal}>
            <section>
              <h3 className={estilos.tituloSecao}>Informações do cliente</h3>
              <Cartao className={estilos.cartaoInfo}>
                <div className={estilos.linhaInfo}>
                  <User size={18} className={estilos.iconeInfo} />
                  <span>{pedido.clienteNome}</span>
                </div>
                <div className={estilos.divisor} />
                <div className={estilos.linhaInfo}>
                  <Phone size={18} className={estilos.iconeInfo} />
                  <span>{pedido.clienteTelefone}</span>
                </div>
                <div className={estilos.divisor} />
                <div className={estilos.linhaInfo}>
                  <MapPin size={18} className={estilos.iconeInfo} />
                  <span>{pedido.enderecoEntrega}</span>
                </div>
              </Cartao>
            </section>

            <section>
              <h3 className={estilos.tituloSecao}>Itens do pedido</h3>
              <Cartao className={estilos.cartaoInfo}>
                {pedido.itens.map((item, idx) => (
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
                {pedido.observacoes && (
                  <>
                    <p className={estilos.observacoes}>Obs: {pedido.observacoes}</p>
                    <div className={estilos.divisor} />
                  </>
                )}
                <div className={estilos.linhaTotal}>
                  <span>Total</span>
                  <span>{formatarMoeda(pedido.valorTotal)}</span>
                </div>
              </Cartao>
            </section>

            <section>
              <h3 className={estilos.tituloSecao}>Pagamento</h3>
              <Cartao className={estilos.cartaoInfo}>
                <div className={estilos.linhaInfo}>
                  <CreditCard size={18} className={estilos.iconeInfo} />
                  <span>{pedido.formaPagamento} · {formatarDataHora(pedido.dataCriacao)}</span>
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
                  value={status ?? pedido.status}
                  onChange={(e) => setStatus(e.target.value as StatusPedido)}
                >
                  {FLUXO_STATUS_PEDIDO.map(etapa => (
                    <option key={etapa} value={etapa}>{ROTULOS_ETAPA[etapa]}</option>
                  ))}
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <Botao larguraTotal onClick={handleSalvarStatus}>Salvar status</Botao>
            </Cartao>
          </div>
        </div>
      </div>
    </LayoutPagina>
  );
};

export default PaginaDetalhePedido;
