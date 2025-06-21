
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

export const Sidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">Pachegar</h1>
        <p className="text-sm text-muted-foreground">Plataforma de Rastreamento</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover-button",
              location.pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-destructive hover:text-destructive-foreground hover-button"
        >
          <span className="text-lg">🚪</span>
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
};
