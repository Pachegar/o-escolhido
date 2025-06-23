
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Plus, 
  Truck, 
  Users, 
  Settings, 
  CreditCard,
  FileText,
  Plug,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  onItemClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Rastreamentos', path: '/rastreamentos' },
    { icon: Plus, label: 'Criar Rastreamento', path: '/rastreamentos/criar' },
    { icon: Truck, label: 'Modelos de Entrega', path: '/modelos' },
    { icon: Plug, label: 'Integrações', path: '/integracoes' },
    { icon: Users, label: 'Indicações', path: '/indicacoes' },
    { icon: FileText, label: 'Order Bump', path: '/orderbump' },
    { icon: CreditCard, label: 'Planos', path: '/planos' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div className="w-80 h-full bg-card/90 backdrop-blur-lg border-r border-border/50 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-border/50">
        <Link to="/dashboard" onClick={handleItemClick}>
          <h1 className="text-2xl font-bold gradient-text">Pachegar</h1>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleItemClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-primary/10 ${
                isActive 
                  ? 'bg-primary/20 text-primary border border-primary/30' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-border/50">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
};
