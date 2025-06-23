
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Rastreamentos from '@/pages/Rastreamentos';
import CriarRastreamento from '@/pages/CriarRastreamento';
import EditarRastreamento from '@/pages/EditarRastreamento';
import DetalhesRastreamento from '@/pages/DetalhesRastreamento';
import ModelosEntrega from '@/pages/ModelosEntrega';
import Indicacoes from '@/pages/Indicacoes';
import Integracoes from '@/pages/Integracoes';
import AutomacaoEnvios from '@/pages/AutomacaoEnvios';
import Configuracoes from '@/pages/Configuracoes';
import Planos from '@/pages/Planos';
import OrderBump from '@/pages/OrderBump';
import RastreamentoPublico from '@/pages/RastreamentoPublico';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/cadastro" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/rastreamentos" element={
              <ProtectedRoute>
                <Rastreamentos />
              </ProtectedRoute>
            } />
            <Route path="/rastreamentos/criar" element={
              <ProtectedRoute>
                <CriarRastreamento />
              </ProtectedRoute>
            } />
            <Route path="/rastreamentos/:id/editar" element={
              <ProtectedRoute>
                <EditarRastreamento />
              </ProtectedRoute>
            } />
            <Route path="/rastreamentos/:id" element={
              <ProtectedRoute>
                <DetalhesRastreamento />
              </ProtectedRoute>
            } />
            <Route path="/modelos" element={
              <ProtectedRoute>
                <ModelosEntrega />
              </ProtectedRoute>
            } />
            <Route path="/indicacoes" element={
              <ProtectedRoute>
                <Indicacoes />
              </ProtectedRoute>
            } />
            <Route path="/integracoes" element={
              <ProtectedRoute>
                <Integracoes />
              </ProtectedRoute>
            } />
            <Route path="/automacao-envios" element={
              <ProtectedRoute>
                <AutomacaoEnvios />
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute>
                <Configuracoes />
              </ProtectedRoute>
            } />
            <Route path="/planos" element={
              <ProtectedRoute>
                <Planos />
              </ProtectedRoute>
            } />
            <Route path="/orderbump" element={
              <ProtectedRoute>
                <OrderBump />
              </ProtectedRoute>
            } />
            
            {/* Public Routes */}
            <Route path="/r/:slug" element={<RastreamentoPublico />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
