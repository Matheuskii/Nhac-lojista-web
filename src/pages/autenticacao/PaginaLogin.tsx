import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import estilos from './PaginaLogin.module.css';
import { Botao, InputTexto, Cartao } from '../../components/ui';
import { useAutenticacao } from '../../hooks/useAutenticacao';

export default function PaginaLogin() {
  const navigate = useNavigate();
  const { entrar } = useAutenticacao();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const lidarComSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    
    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    setCarregando(true);
    try {
      await entrar(email, senha);
      navigate('/');
    } catch (err: any) {
      setErro(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setCarregando(false);
    }
  };

  const alternarVisualizacaoSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  return (
    <div className={estilos.container}>
      <Cartao className={estilos.cartao}>
        <div className={estilos.cabecalho}>
          <h1 className={estilos.logo}>Nhac</h1>
          <p className={estilos.subtitulo}>Lojas</p>
        </div>

        {erro && <div className={estilos.erro}>{erro}</div>}

        <form className={estilos.formulario} onSubmit={lidarComSubmit}>
          <InputTexto
            rotulo="E-mail"
            tipo="email"
            valor={email}
            aoMudar={setEmail}
            placeholder="seu@email.com"
            icone={<Mail size={18} />}
            obrigatorio
          />
          
          <div style={{ position: 'relative' }}>
            <InputTexto
              rotulo="Senha"
              tipo={mostrarSenha ? 'text' : 'password'}
              valor={senha}
              aoMudar={setSenha}
              placeholder="Sua senha"
              icone={<Lock size={18} />}
              obrigatorio
            />
            <button
              type="button"
              className={estilos.toggleSenha}
              onClick={alternarVisualizacaoSenha}
              style={{ bottom: '0.9rem', position: 'absolute' }}
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className={estilos.opcoes}>
            <button type="button" className={estilos.link}>Esqueci minha senha</button>
          </div>

          <Botao 
            type="submit" 
            variante="primario" 
            larguraTotal 
            carregando={carregando}
          >
            Entrar
          </Botao>
        </form>

        <div className={estilos.rodape}>
          Não tem uma conta?{' '}
          <Link to="/cadastro" className={estilos.link}>
            Cadastre-se
          </Link>
        </div>
      </Cartao>
    </div>
  );
}
