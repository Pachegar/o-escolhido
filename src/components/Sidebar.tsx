import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: '📊'
  },
  {
    title: 'Rastreamentos',
    href: '/rastreamentos',
    icon: '📦'
  },
  {
    title: 'Modelos de Entrega',
    href: '/modelos',
    icon: '🚛'
  },
  {
    title: 'Indique e Ganhe',
    href: '/indicacoes',
    icon: '💰'
  },
  {
    title: 'Configurações',
    href: '/configuracoes',
    icon: '⚙️'
  },
  {
    title: 'Planos',
    href: '/planos',
    icon: '💎'
  }
];

interface SidebarProps {
  onItemClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const location = useLocation();
  const { signOut } = useAuth();

  const handleItemClick = () => {
    if (onItemClick) onItemClick();
  };

  const handleSignOut = () => {
    signOut();
    if (onItemClick) onItemClick();
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/4abe2cf8-daf0-4fdb-ad47-074c17544f3c.png" 
            alt="Pachegar" 
            className="h-8 w-auto"
          />
          <div>
            <h1 className="text-2xl font-bold text-primary">Pachegar</h1>
            <p className="text-sm text-muted-foreground">Plataforma de Rastreamento</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={handleItemClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg group",
              location.pathname === item.href
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "hover:bg-accent hover:shadow-md"
            )}
          >
            <span className="text-lg group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
            <span className="font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground hover:scale-105 hover:shadow-lg group"
        >
          <span className="text-lg group-hover:scale-110 transition-transform duration-200">🚪</span>
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
};
