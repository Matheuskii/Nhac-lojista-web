import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutPagina from '../../components/layout/LayoutPagina';
import Botao from '../../components/ui/Botao';
import Cartao from '../../components/ui/Cartao';
import Avatar from '../../components/ui/Avatar';
import Emblema from '../../components/ui/Emblema';
import { funcionariosMock } from '../../dados/funcionarios';
import { formatarData } from '../../utils/formatacao';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import estilos from './PaginaListaFuncionarios.module.css';

const PaginaListaFuncionarios = () => {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState(funcionariosMock);

  const getCorCargo = (cargo: string) => {
    switch (cargo.toLowerCase()) {
      case 'administrador': return 'info';
      case 'gerente': return 'aviso';
      default: return 'neutro';
    }
  };

  const handleExcluir = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      setFuncionarios(funcionarios.filter(f => f.id !== id));
    }
  };

  return (
    <LayoutPagina titulo="Funcionários">
      <div className={estilos.container}>
        <header className={estilos.cabecalho}>
          <h2 className={estilos.titulo}>Equipe</h2>
          <Botao onClick={() => navigate('/funcionarios/novo')} icone={<Plus size={20} />}>
            Novo funcionário
          </Botao>
        </header>

        <Cartao className={estilos.tabelaCartao}>
          <div className={estilos.responsivoTabela}>
            <table className={estilos.tabela}>
              <thead>
                <tr>
                  <th>Funcionário</th>
                  <th>Contato</th>
                  <th>Cargo</th>
                  <th>Status</th>
                  <th>Data de Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {funcionarios.map(func => (
                  <tr key={func.id}>
                    <td>
                      <div className={estilos.infoUsuario}>
                        <Avatar nome={func.nomeCompleto} fotoUrl={func.fotoUrl} tamanho="pequeno" />
                        <span className={estilos.nome}>{func.nomeCompleto}</span>
                      </div>
                    </td>
                    <td>
                      <div className={estilos.contato}>
                        <span className={estilos.email}>{func.email}</span>
                        <span className={estilos.telefone}>{func.telefone}</span>
                      </div>
                    </td>
                    <td>
                      <Emblema variante={getCorCargo(func.cargo) as any}>{func.cargo}</Emblema>
                    </td>
                    <td>
                      <Emblema variante={func.ativo ? 'sucesso' : 'erro'}>
                        {func.ativo ? 'Ativo' : 'Inativo'}
                      </Emblema>
                    </td>
                    <td>{formatarData(func.dataCadastro)}</td>
                    <td>
                      <div className={estilos.acoes}>
                        <Botao variante="fantasma" icone={<Edit2 size={18} />} onClick={() => navigate(`/funcionarios/${func.id}`)} />
                        <Botao variante="perigo" icone={<Trash2 size={18} />} onClick={() => handleExcluir(func.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className={estilos.listaMobile}>
            {funcionarios.map(func => (
              <div key={func.id} className={estilos.cartaoMobile}>
                <div className={estilos.cabecalhoMobile}>
                  <div className={estilos.infoUsuario}>
                    <Avatar nome={func.nomeCompleto} fotoUrl={func.fotoUrl} tamanho="medio" />
                    <div>
                      <div className={estilos.nome}>{func.nomeCompleto}</div>
                      <div className={estilos.email}>{func.email}</div>
                    </div>
                  </div>
                </div>
                <div className={estilos.corpoMobile}>
                  <div className={estilos.detalheMobile}>
                    <span className={estilos.rotulo}>Cargo:</span>
                    <Emblema variante={getCorCargo(func.cargo) as any}>{func.cargo}</Emblema>
                  </div>
                  <div className={estilos.detalheMobile}>
                    <span className={estilos.rotulo}>Status:</span>
                    <Emblema variante={func.ativo ? 'sucesso' : 'erro'}>{func.ativo ? 'Ativo' : 'Inativo'}</Emblema>
                  </div>
                  <div className={estilos.acoesMobile}>
                    <Botao variante="secundario" onClick={() => navigate(`/funcionarios/${func.id}`)}>Editar</Botao>
                    <Botao variante="perigo" onClick={() => handleExcluir(func.id)}>Excluir</Botao>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Cartao>
      </div>
    </LayoutPagina>
  );
};

export default PaginaListaFuncionarios;
