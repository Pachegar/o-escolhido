
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Rastreamentos from "./pages/Rastreamentos";
import CriarRastreamento from "./pages/CriarRastreamento";
import EditarRastreamento from "./pages/EditarRastreamento";
import DetalhesRastreamento from "./pages/DetalhesRastreamento";
import ModelosEntrega from "./pages/ModelosEntrega";
import Configuracoes from "./pages/Configuracoes";
import Planos from "./pages/Planos";
import RastreamentoPublico from "./pages/RastreamentoPublico";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/r/:slug" element={<RastreamentoPublico />} />
              
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
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
