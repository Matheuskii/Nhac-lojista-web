import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutPagina from '../../components/layout/LayoutPagina';
import Cartao from '../../components/ui/Cartao';
import InputTexto from '../../components/ui/InputTexto';
import Toggle from '../../components/ui/Toggle';
import Botao from '../../components/ui/Botao';
import { Mail, Phone, Lock, Eye, EyeOff, Bell } from 'lucide-react';
import estilos from './PaginaConfiguracoesConta.module.css';

const PaginaConfiguracoesConta = () => {
  const navigate = useNavigate();

  // Dados da conta (mock)
  const [email, setEmail] = useState('joao@burguermania.com.br');
  const [telefone, setTelefone] = useState('(11) 99999-0000');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [editandoEmail, setEditandoEmail] = useState(false);
  const [editandoTelefone, setEditandoTelefone] = useState(false);
  const [editandoSenha, setEditandoSenha] = useState(false);

  // Notificações
  const [notifNovoPedido, setNotifNovoPedido] = useState(true);
  const [notifMensagens, setNotifMensagens] = useState(true);
  const [notifAvaliacoes, setNotifAvaliacoes] = useState(false);
  const [notifNovidades, setNotifNovidades] = useState(false);

  const handleSalvarEmail = () => {
    setEditandoEmail(false);
  };

  const handleSalvarTelefone = () => {
    setEditandoTelefone(false);
  };

  const handleSalvarSenha = () => {
    setSenha('');
    setEditandoSenha(false);
  };

  return (
    <LayoutPagina titulo="Configurações da conta">
      <div className={estilos.container}>
        {/* Dados de acesso */}
        <Cartao className={estilos.secao}>
          <h3 className={estilos.tituloSecao}>Dados de acesso</h3>

          {/* E-mail */}
          <div className={estilos.itemConta}>
            <div className={estilos.itemInfo}>
              <Mail size={18} className={estilos.icone} />
              <div className={estilos.itemTextos}>
                <span className={estilos.itemRotulo}>E-mail</span>
                {editandoEmail ? (
                  <InputTexto rotulo="" valor={email} aoMudar={setEmail} tipo="email" />
                ) : (
                  <span className={estilos.itemValor}>{email}</span>
                )}
              </div>
            </div>
            <div className={estilos.itemAcoes}>
              {editandoEmail ? (
                <>
                  <Botao variante="fantasma" tamanho="pequeno" onClick={() => setEditandoEmail(false)}>Cancelar</Botao>
                  <Botao variante="primario" tamanho="pequeno" onClick={handleSalvarEmail}>Salvar</Botao>
                </>
              ) : (
                <Botao variante="secundario" tamanho="pequeno" onClick={() => setEditandoEmail(true)}>Editar</Botao>
              )}
            </div>
          </div>

          <div className={estilos.divisor} />

          {/* Telefone */}
          <div className={estilos.itemConta}>
            <div className={estilos.itemInfo}>
              <Phone size={18} className={estilos.icone} />
              <div className={estilos.itemTextos}>
                <span className={estilos.itemRotulo}>Telefone</span>
                {editandoTelefone ? (
                  <InputTexto rotulo="" valor={telefone} aoMudar={setTelefone} />
                ) : (
                  <span className={estilos.itemValor}>{telefone}</span>
                )}
              </div>
            </div>
            <div className={estilos.itemAcoes}>
              {editandoTelefone ? (
                <>
                  <Botao variante="fantasma" tamanho="pequeno" onClick={() => setEditandoTelefone(false)}>Cancelar</Botao>
                  <Botao variante="primario" tamanho="pequeno" onClick={handleSalvarTelefone}>Salvar</Botao>
                </>
              ) : (
                <Botao variante="secundario" tamanho="pequeno" onClick={() => setEditandoTelefone(true)}>Editar</Botao>
              )}
            </div>
          </div>

          <div className={estilos.divisor} />

          {/* Senha */}
          <div className={estilos.itemConta}>
            <div className={estilos.itemInfo}>
              <Lock size={18} className={estilos.icone} />
              <div className={estilos.itemTextos}>
                <span className={estilos.itemRotulo}>Senha</span>
                {editandoSenha ? (
                  <div style={{ position: 'relative' }}>
                    <InputTexto
                      rotulo=""
                      tipo={mostrarSenha ? 'text' : 'password'}
                      valor={senha}
                      aoMudar={setSenha}
                      placeholder="Nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      style={{ position: 'absolute', right: '1rem', top: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nhac-texto-claro)' }}
                    >
                      {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                ) : (
                  <span className={estilos.itemValor}>••••••••</span>
                )}
              </div>
            </div>
            <div className={estilos.itemAcoes}>
              {editandoSenha ? (
                <>
                  <Botao variante="fantasma" tamanho="pequeno" onClick={() => setEditandoSenha(false)}>Cancelar</Botao>
                  <Botao variante="primario" tamanho="pequeno" onClick={handleSalvarSenha}>Salvar</Botao>
                </>
              ) : (
                <Botao variante="secundario" tamanho="pequeno" onClick={() => setEditandoSenha(true)}>Alterar</Botao>
              )}
            </div>
          </div>
        </Cartao>

        {/* Notificações */}
        <Cartao className={estilos.secao}>
          <div className={estilos.secaoTitulo}>
            <Bell size={18} className={estilos.icone} />
            <h3 className={estilos.tituloSecao}>Notificações</h3>
          </div>

          <div className={estilos.listaToggles}>
            <Toggle rotulo="Novos pedidos" ativo={notifNovoPedido} aoMudar={setNotifNovoPedido} />
            <div className={estilos.divisor} />
            <Toggle rotulo="Mensagens de clientes" ativo={notifMensagens} aoMudar={setNotifMensagens} />
            <div className={estilos.divisor} />
            <Toggle rotulo="Avaliações" ativo={notifAvaliacoes} aoMudar={setNotifAvaliacoes} />
            <div className={estilos.divisor} />
            <Toggle rotulo="Novidades e promoções da Nhac" ativo={notifNovidades} aoMudar={setNotifNovidades} />
          </div>
        </Cartao>

        <div className={estilos.acoesRodape}>
          <Botao variante="fantasma" onClick={() => navigate('/configuracoes')}>
            Voltar
          </Botao>
        </div>
      </div>
    </LayoutPagina>
  );
};

export default PaginaConfiguracoesConta;
