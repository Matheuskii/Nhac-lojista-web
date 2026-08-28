import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LayoutPagina from '../../components/layout/LayoutPagina';
import InputTexto from '../../components/ui/InputTexto';
import Seletor from '../../components/ui/Seletor';
import Botao from '../../components/ui/Botao';
import Cartao from '../../components/ui/Cartao';
import Toggle from '../../components/ui/Toggle';
import { funcionariosMock } from '../../dados/funcionarios';
import estilos from './PaginaFormularioFuncionario.module.css';

const PaginaFormularioFuncionario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ehEdicao = !!id && id !== 'novo';

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('');
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    if (ehEdicao) {
      const func = funcionariosMock.find(f => f.id === id);
      if (func) {
        setNome(func.nomeCompleto);
        setEmail(func.email);
        setTelefone(func.telefone || '');
        setCargo(func.cargo);
        setAtivo(func.ativo);
      }
    }
  }, [ehEdicao, id]);

  const opcoesCargo = [
    { valor: '', rotulo: 'Selecione um cargo' },
    { valor: 'Administrador', rotulo: 'Administrador' },
    { valor: 'Gerente', rotulo: 'Gerente' },
    { valor: 'Atendente', rotulo: 'Atendente' }
  ];

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Funcionário salvo com sucesso!');
    navigate('/funcionarios');
  };

  return (
    <LayoutPagina titulo={ehEdicao ? 'Editar Funcionário' : 'Novo Funcionário'}>
      <form onSubmit={handleSalvar} className={estilos.form}>
        <Cartao className={estilos.cartao}>
          <h3 className={estilos.tituloSecao}>Dados do Funcionário</h3>
          
          <div className={estilos.grid}>
            <InputTexto rotulo="Nome Completo" valor={nome} aoMudar={setNome} obrigatorio />
            <InputTexto rotulo="E-mail" tipo="email" valor={email} aoMudar={setEmail} obrigatorio />
            <InputTexto rotulo="Telefone" valor={telefone} aoMudar={setTelefone} placeholder="(00) 00000-0000" />
            <Seletor rotulo="Cargo" valor={cargo} aoMudar={setCargo} opcoes={opcoesCargo} obrigatorio />
            
            <div className={estilos.toggleWrapper}>
              <Toggle ativo={ativo} aoMudar={setAtivo} rotulo="Conta Ativa" />
            </div>
          </div>
        </Cartao>

        <div className={estilos.acoes}>
          <Botao type="button" variante="fantasma" onClick={() => navigate('/funcionarios')}>Cancelar</Botao>
          <Botao type="submit" variante="primario">Salvar</Botao>
        </div>
      </form>
    </LayoutPagina>
  );
};

export default PaginaFormularioFuncionario;
