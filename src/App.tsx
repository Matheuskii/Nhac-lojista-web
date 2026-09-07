import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProvedorAutenticacao } from './contexts/AutenticacaoContext';
import RotaProtegida from './components/compartilhados/RotaProtegida';

// Páginas de autenticação
import PaginaLogin from './pages/autenticacao/PaginaLogin';
import PaginaCadastro from './pages/autenticacao/PaginaCadastro';

// Páginas do dashboard
import PaginaPainel from './pages/painel/PaginaPainel';
import PaginaListaProdutos from './pages/produtos/PaginaListaProdutos';
import PaginaFormularioProduto from './pages/produtos/PaginaFormularioProduto';
import PaginaListaFuncionarios from './pages/funcionarios/PaginaListaFuncionarios';
import PaginaFormularioFuncionario from './pages/funcionarios/PaginaFormularioFuncionario';
import PaginaChat from './pages/chat/PaginaChat';
import PaginaFinanceiro from './pages/financeiro/PaginaFinanceiro';
import PaginaListaPedidos from './pages/pedidos/PaginaListaPedidos';
import PaginaDetalhePedido from './pages/pedidos/PaginaDetalhePedido';
import PaginaInformacaoLoja from './pages/configuracoes/PaginaInformacaoLoja';
import PaginaEditarInfoLoja from './pages/configuracoes/PaginaEditarInfoLoja';
import PaginaConfiguracoesConta from './pages/configuracoes/PaginaConfiguracoesConta';
import PaginaEnderecoLoja from './pages/configuracoes/PaginaEnderecoLoja';
import PaginaFormasPagamento from './pages/configuracoes/PaginaFormasPagamento';
import PaginaRecuperarSenha from './pages/autenticacao/PaginaRecuperarSenha';

function App() {
  return (
    <ProvedorAutenticacao>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/cadastro" element={<PaginaCadastro />} />
          <Route path="/recuperar-senha" element={<PaginaRecuperarSenha />} />

          {/* Rotas protegidas */}
          <Route
            path="/"
            element={
              <RotaProtegida cargosPermitidos={['administrador', 'gerente']}>
                <PaginaPainel />
              </RotaProtegida>
            }
          />

          <Route
            path="/produtos"
            element={
              <RotaProtegida cargosPermitidos={['administrador', 'gerente']}>
                <PaginaListaProdutos />
              </RotaProtegida>
            }
          />
          <Route
            path="/produtos/novo"
            element={
              <RotaProtegida cargosPermitidos={['administrador', 'gerente']}>
                <PaginaFormularioProduto />
              </RotaProtegida>
            }
          />
          <Route
            path="/produtos/:id"
            element={
              <RotaProtegida cargosPermitidos={['administrador', 'gerente']}>
                <PaginaFormularioProduto />
              </RotaProtegida>
            }
          />

          <Route
            path="/funcionarios"
            element={
              <RotaProtegida cargosPermitidos={['administrador']}>
                <PaginaListaFuncionarios />
              </RotaProtegida>
            }
          />
          <Route
            path="/funcionarios/novo"
            element={
              <RotaProtegida cargosPermitidos={['administrador']}>
                <PaginaFormularioFuncionario />
              </RotaProtegida>
            }
          />

          <Route
            path="/chat"
            element={
              <RotaProtegida cargosPermitidos={['administrador', 'gerente', 'atendente']}>
                <PaginaChat />
              </RotaProtegida>
            }
          />

          <Route
            path="/pedidos"
            element={
              <RotaProtegida cargosPermitidos={['administrador', 'gerente', 'atendente']}>
                <PaginaListaPedidos />
              </RotaProtegida>
            }
          />
          <Route
            path="/pedidos/:id"
            element={
              <RotaProtegida cargosPermitidos={['administrador', 'gerente', 'atendente']}>
                <PaginaDetalhePedido />
              </RotaProtegida>
            }
          />

          <Route
            path="/configuracoes"
            element={
              <RotaProtegida cargosPermitidos={['administrador']}>
                <PaginaInformacaoLoja />
              </RotaProtegida>
            }
          />
          <Route
            path="/configuracoes/editar"
            element={
              <RotaProtegida cargosPermitidos={['administrador']}>
                <PaginaEditarInfoLoja />
              </RotaProtegida>
            }
          />
          <Route
            path="/configuracoes/conta"
            element={
              <RotaProtegida cargosPermitidos={['administrador']}>
                <PaginaConfiguracoesConta />
              </RotaProtegida>
            }
          />
          <Route
            path="/configuracoes/endereco"
            element={
              <RotaProtegida cargosPermitidos={['administrador']}>
                <PaginaEnderecoLoja />
              </RotaProtegida>
            }
          />
          <Route
            path="/configuracoes/pagamentos"
            element={
              <RotaProtegida cargosPermitidos={['administrador']}>
                <PaginaFormasPagamento />
              </RotaProtegida>
            }
          />

          <Route
            path="/financeiro"
            element={
              <RotaProtegida cargosPermitidos={['administrador']}>
                <PaginaFinanceiro />
              </RotaProtegida>
            }
          />

          {/* Rota padrão — redireciona para login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ProvedorAutenticacao>
  );
}

export default App;
