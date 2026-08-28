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

function App() {
  return (
    <ProvedorAutenticacao>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/cadastro" element={<PaginaCadastro />} />

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
