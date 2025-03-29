
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, CheckSquare, Calendar, Settings, List, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const NavigationMenu = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const routes = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Scheduled', path: '/scheduled', icon: Calendar },
    { name: 'Categories', path: '/categories', icon: List },
    { name: 'AI Assistant', path: '/ai-assistant', icon: Brain },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const navItems = routes.map((route) => {
    const isActive = location.pathname === route.path;
    return (
      <Link 
        key={route.path} 
        to={route.path}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full flex items-center justify-start gap-3 transition-all hover:bg-secondary",
            isActive && "bg-secondary font-medium"
          )}
        >
          <route.icon className="h-5 w-5" />
          <span>{route.name}</span>
        </Button>
      </Link>
    );
  });

  if (isMobile) {
    return (
      <>
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-40 p-2 flex justify-around">
          {routes.slice(0, 5).map((route) => {
            const isActive = location.pathname === route.path;
            return (
              <Link key={route.path} to={route.path} className="flex flex-col items-center p-1">
                <route.icon className={cn("h-6 w-6", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-xs", isActive ? "text-primary" : "text-muted-foreground")}>
                  {route.name}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="h-16"></div> {/* Spacer for mobile navigation */}
      </>
    );
  }

  return (
    <nav className="hidden md:flex flex-col p-4 gap-2 border-r h-screen sticky top-0 w-56">
      <div className="mb-6 flex items-center">
        <div className="h-8 w-8 bg-primary rounded-full mr-2"></div>
        <h2 className="text-lg font-bold">TaskTamer</h2>
      </div>
      {navItems}
    </nav>
  );
};

export default NavigationMenu;
