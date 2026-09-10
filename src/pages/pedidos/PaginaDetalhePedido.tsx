import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LayoutPagina from "../../components/layout/LayoutPagina";
import Cartao from "../../components/ui/Cartao";
import Botao from "../../components/ui/Botao";
import Emblema from "../../components/ui/Emblema";
import ModalConfirmacao from "../../components/ui/ModalConfirmacao";
import { StatusPedido } from "../../types";
import {
  formatarMoeda,
  formatarDataHora,
  STATUS_PEDIDO_INFO,
  FLUXO_STATUS_PEDIDO,
} from "../../utils/formatacao";
import {
  podeTransicionar,
  ehStatusFinal,
  podeCancelar,
  ROTULO_ACAO_STATUS,
} from "../../validators/statusPedido";
import { atualizarStatusPedido } from "../../services/api";
import { tratarErroApi } from "../../utils/errosApi";
import { useToast } from "../../contexts/ToastContext";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  CreditCard,
  Check,
  Ban,
} from "lucide-react";
import { pedidosMock } from "../../dados/pedidos";
import estilos from "./PaginaDetalhePedido.module.css";

const ROTULOS_ETAPA: Record<string, string> = {
  PENDENTE: "Recebido",
  PAGO: "Pago",
  PREPARANDO: "Em preparo",
  SAIU_ENTREGA: "A caminho",
  ENTREGUE: "Entregue",
};

const AVISO_BACKEND =
  "O detalhe de pedido para o lojista ainda não existe no backend (GET /pedidos/{id} só autoriza o cliente). Esta tela está mockada até haver um endpoint de lojista.";

const PaginaDetalhePedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mostrarToast } = useToast();
  const pedidoMock = pedidosMock.find((p) => p.id === id) ?? null;
  const [status, setStatus] = useState<StatusPedido | undefined>(
    pedidoMock?.status,
  );
  const [salvandoStatus, setSalvandoStatus] = useState(false);
  const [confirmacaoCancelamento, setConfirmacaoCancelamento] = useState(false);
  const [confirmacaoAvanco, setConfirmacaoAvanco] =
    useState<StatusPedido | null>(null);

  useEffect(() => {
    setStatus(pedidoMock?.status);
  }, [id, pedidoMock?.status]);

  if (!pedidoMock) {
    return (
      <LayoutPagina titulo="Pedido">
        <div className={estilos.naoEncontrado}>
          <p>{AVISO_BACKEND}</p>
          <Botao variante="secundario" onClick={() => navigate("/pedidos")}>
            Voltar para pedidos
          </Botao>
        </div>
      </LayoutPagina>
    );
  }

  const statusAtual = status ?? pedidoMock.status;
  const statusInfo = STATUS_PEDIDO_INFO[statusAtual] ?? {
    rotulo: statusAtual,
    variante: "neutro" as const,
  };
  const indiceAtual = FLUXO_STATUS_PEDIDO.indexOf(
    statusAtual as (typeof FLUXO_STATUS_PEDIDO)[number],
  );
  const cancelado = statusAtual === "CANCELADO";

  // Bloqueio de transições inválidas no UI — só exibir ações permitidas pelo backend
  const podeCancelarAgora = podeCancelar(statusAtual);
  const statusFinal = ehStatusFinal(statusAtual);

  /** Avança para o próximo status natural do fluxo (se permitido). */
  const avancarFluxo = () => {
    const proximoNatural = FLUXO_STATUS_PEDIDO[indiceAtual + 1];
    if (!proximoNatural || !podeTransicionar(statusAtual, proximoNatural))
      return;
    setConfirmacaoAvanco(proximoNatural);
  };

  const aplicarTransicao = async (novoStatus: StatusPedido) => {
    // Guarda dupla: transição bloqueada localmente antes de chamar a API
    if (!podeTransicionar(statusAtual, novoStatus)) {
      mostrarToast("Transição de status inválida.");
      return;
    }
    setSalvandoStatus(true);
    try {
      await atualizarStatusPedido(pedidoMock.id, novoStatus);
      setStatus(novoStatus);
      mostrarToast(
        `Pedido atualizado para "${ROTULOS_ETAPA[novoStatus] ?? novoStatus}".`,
      );
    } catch (err) {
      const tratado = tratarErroApi(err);
      if (tratado.transicaoInvalida) {
        // 409 do backend → toast + "refetch" (volta ao status do mock/local)
        mostrarToast(tratado.mensagemGeral ?? "Transição de status inválida.");
        setStatus(pedidoMock.status);
      } else {
        mostrarToast(tratado.mensagemGeral ?? "Erro ao atualizar status.");
      }
    } finally {
      setSalvandoStatus(false);
      setConfirmacaoAvanco(null);
      setConfirmacaoCancelamento(false);
    }
  };

  return (
    <LayoutPagina titulo={`Pedido #${pedidoMock.numeroPedido}`}>
      <div className={estilos.container}>
        <p className={estilos.avisoBloqueio}>{AVISO_BACKEND}</p>

        <header className={estilos.cabecalho}>
          <button
            className={estilos.botaoVoltar}
            onClick={() => navigate("/pedidos")}
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className={estilos.titulo}>Pedido #{pedidoMock.numeroPedido}</h2>
          <Emblema
            variante={statusInfo.variante}
            className={estilos.emblemaTopo}
          >
            {statusInfo.rotulo}
          </Emblema>
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
                        <span className={estilos.nomeItem}>
                          {item.quantidade}x {item.nomeProduto}
                        </span>
                        {item.adicionais && item.adicionais.length > 0 && (
                          <span className={estilos.adicionaisItem}>
                            {item.adicionais.join(", ")}
                          </span>
                        )}
                      </div>
                      <span className={estilos.precoItem}>
                        {formatarMoeda(item.precoUnitario * item.quantidade)}
                      </span>
                    </div>
                    <div className={estilos.divisor} />
                  </React.Fragment>
                ))}
                {pedidoMock.observacoes && (
                  <>
                    <p className={estilos.observacoes}>
                      Obs: {pedidoMock.observacoes}
                    </p>
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
                  <span>
                    {pedidoMock.formaPagamento} ·{" "}
                    {formatarDataHora(pedidoMock.dataCriacao)}
                  </span>
                </div>
              </Cartao>
            </section>
          </div>

          <div className={estilos.colunaLateral}>
            <h3 className={estilos.tituloSecao}>Andamento do pedido</h3>
            <Cartao className={estilos.cartaoAndamento}>
              {cancelado ? (
                <p className={estilos.mensagemCancelado}>
                  Este pedido foi cancelado.
                </p>
              ) : (
                <div className={estilos.etapas}>
                  {FLUXO_STATUS_PEDIDO.map((etapa, idx) => {
                    const completa = idx < indiceAtual;
                    const ativa = idx === indiceAtual;
                    return (
                      <div key={etapa} className={estilos.etapa}>
                        <div
                          className={`${estilos.marcador} ${completa ? estilos.marcadorCompleto : ""} ${ativa ? estilos.marcadorAtivo : ""}`}
                        >
                          {completa ? (
                            <Check size={14} strokeWidth={3} />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <span
                          className={`${estilos.rotuloEtapa} ${ativa ? estilos.rotuloEtapaAtivo : ""}`}
                        >
                          {ROTULOS_ETAPA[etapa]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {statusFinal ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    color: "var(--nhac-texto-claro)",
                  }}
                >
                  Este pedido está em status final — não aceita mais alterações.
                </p>
              ) : (
                <>
                  <Botao
                    larguraTotal
                    carregando={salvandoStatus}
                    disabled={
                      !FLUXO_STATUS_PEDIDO[indiceAtual + 1] ||
                      !podeTransicionar(
                        statusAtual,
                        FLUXO_STATUS_PEDIDO[indiceAtual + 1],
                      )
                    }
                    onClick={avancarFluxo}
                  >
                    {ROTULO_ACAO_STATUS[statusAtual]}
                  </Botao>

                  {/* Cancelamento bloqueado quando EM_ENTREGA (SAIU_ENTREGA) ou posterior */}
                  {podeCancelarAgora && (
                    <Botao
                      larguraTotal
                      variante="perigo"
                      disabled={salvandoStatus}
                      icone={<Ban size={16} />}
                      onClick={() => setConfirmacaoCancelamento(true)}
                    >
                      Cancelar pedido
                    </Botao>
                  )}
                </>
              )}
            </Cartao>
          </div>
        </div>
      </div>

      <ModalConfirmacao
        aberto={confirmacaoAvanco !== null}
        titulo="Alterar status"
        mensagem={`Confirmar alteração do pedido para "${ROTULOS_ETAPA[confirmacaoAvanco ?? ""] ?? confirmacaoAvanco}"?`}
        textoBotaoConfirmar="Confirmar"
        aoConfirmar={() =>
          confirmacaoAvanco && aplicarTransicao(confirmacaoAvanco)
        }
        aoCancelar={() => setConfirmacaoAvanco(null)}
      />

      <ModalConfirmacao
        aberto={confirmacaoCancelamento}
        titulo="Cancelar pedido"
        mensagem="Tem certeza que deseja cancelar este pedido? Essa ação não pode ser desfeita."
        textoBotaoConfirmar="Cancelar pedido"
        varianteBotaoConfirmar="perigo"
        aoConfirmar={() => aplicarTransicao("CANCELADO")}
        aoCancelar={() => setConfirmacaoCancelamento(false)}
      />
    </LayoutPagina>
  );
};

export default PaginaDetalhePedido;
