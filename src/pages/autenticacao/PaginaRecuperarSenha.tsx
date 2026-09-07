import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import estilos from './PaginaRecuperarSenha.module.css';
import { Botao, InputTexto, Cartao } from '../../components/ui';

type Etapa = 'email' | 'codigo' | 'nova-senha';

export default function PaginaRecuperarSenha() {
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState<Etapa>('email');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [concluido, setConcluido] = useState(false);

  const enviarEmail = () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setErros({ email: 'Digite um e-mail válido' });
      return;
    }
    setErros({});
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      setEtapa('codigo');
    }, 1000);
  };

  const verificarCodigo = () => {
    if (codigo.length < 6) {
      setErros({ codigo: 'Digite o código de 6 dígitos' });
      return;
    }
    setErros({});
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      setEtapa('nova-senha');
    }, 800);
  };

  const redefinirSenha = () => {
    const novosErros: Record<string, string> = {};
    if (novaSenha.length < 6) novosErros.novaSenha = 'A senha deve ter pelo menos 6 caracteres';
    if (novaSenha !== confirmarSenha) novosErros.confirmarSenha = 'As senhas não coincidem';
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }
    setErros({});
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      setConcluido(true);
    }, 1000);
  };

  if (concluido) {
    return (
      <div className={estilos.container}>
        <Cartao className={estilos.cartao}>
          <div className={estilos.sucessoWrapper}>
            <div className={estilos.circuloSucesso}>
              <CheckCircle size={36} />
            </div>
            <h2 className={estilos.titulo}>Senha redefinida!</h2>
            <p className={estilos.subtitulo}>Sua senha foi atualizada com sucesso. Faça login para continuar.</p>
            <Botao variante="primario" larguraTotal onClick={() => navigate('/login')}>
              Ir para o login
            </Botao>
          </div>
        </Cartao>
      </div>
    );
  }

  return (
    <div className={estilos.container}>
      <Cartao className={estilos.cartao}>
        <div className={estilos.cabecalho}>
          <h1 className={estilos.logo}>Nhac</h1>
          <p className={estilos.subtituloCabecalho}>Lojas</p>
        </div>

        {/* ETAPA 1 — E-mail */}
        {etapa === 'email' && (
          <div className={estilos.corpo}>
            <h2 className={estilos.titulo}>Recuperar senha</h2>
            <p className={estilos.subtitulo}>
              Informe o e-mail cadastrado e enviaremos um código de verificação.
            </p>
            <InputTexto
              rotulo="E-mail"
              tipo="email"
              valor={email}
              aoMudar={setEmail}
              placeholder="seu@email.com"
              icone={<Mail size={18} />}
              erro={erros.email}
              obrigatorio
            />
            <Botao variante="primario" larguraTotal carregando={carregando} onClick={enviarEmail}>
              Enviar código
            </Botao>
          </div>
        )}

        {/* ETAPA 2 — Código */}
        {etapa === 'codigo' && (
          <div className={estilos.corpo}>
            <h2 className={estilos.titulo}>Verifique seu e-mail</h2>
            <p className={estilos.subtitulo}>
              Enviamos um código de 6 dígitos para <strong>{email}</strong>. Verifique sua caixa de entrada.
            </p>
            <div className={estilos.inputCodigo}>
              <input
                type="text"
                maxLength={6}
                className={estilos.campoCodigo}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
              />
              {erros.codigo && <span className={estilos.erro}>{erros.codigo}</span>}
            </div>
            <Botao variante="primario" larguraTotal carregando={carregando} onClick={verificarCodigo}>
              Verificar código
            </Botao>
            <button
              type="button"
              className={estilos.linkReenviar}
              onClick={() => { setCarregando(true); setTimeout(() => setCarregando(false), 800); }}
            >
              Reenviar código
            </button>
          </div>
        )}

        {/* ETAPA 3 — Nova senha */}
        {etapa === 'nova-senha' && (
          <div className={estilos.corpo}>
            <h2 className={estilos.titulo}>Nova senha</h2>
            <p className={estilos.subtitulo}>
              Escolha uma senha forte com pelo menos 6 caracteres.
            </p>
            <div style={{ position: 'relative' }}>
              <InputTexto
                rotulo="Nova senha"
                tipo={mostrarSenha ? 'text' : 'password'}
                valor={novaSenha}
                aoMudar={setNovaSenha}
                icone={<Lock size={18} />}
                erro={erros.novaSenha}
                obrigatorio
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                style={{ position: 'absolute', right: '1rem', bottom: erros.novaSenha ? '2rem' : '0.9rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nhac-texto-claro)' }}
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <InputTexto
                rotulo="Confirmar nova senha"
                tipo={mostrarConfirmar ? 'text' : 'password'}
                valor={confirmarSenha}
                aoMudar={setConfirmarSenha}
                icone={<Lock size={18} />}
                erro={erros.confirmarSenha}
                obrigatorio
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                style={{ position: 'absolute', right: '1rem', bottom: erros.confirmarSenha ? '2rem' : '0.9rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nhac-texto-claro)' }}
              >
                {mostrarConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Botao variante="primario" larguraTotal carregando={carregando} onClick={redefinirSenha}>
              Redefinir senha
            </Botao>
          </div>
        )}

        <div className={estilos.rodape}>
          <Link to="/login" className={estilos.linkVoltar}>
            <ArrowLeft size={16} />
            Voltar para o login
          </Link>
        </div>
      </Cartao>
    </div>
  );
}
