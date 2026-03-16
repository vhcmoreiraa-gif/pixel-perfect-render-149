import { useLocation, Link } from "react-router-dom";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardCheck,
  GraduationCap,
  TrendingUp,
  Trophy,
  Users,
  Settings,
  LogOut,
  Sun,
  Spade,
  ScanEye,
  Gamepad2,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: ClipboardCheck, label: "Check-ins", path: "/check-ins" },
  { icon: GraduationCap, label: "Grade", path: "/grade" },
  { icon: TrendingUp, label: "Ranking", path: "/ranking" },
  { icon: Trophy, label: "Campeonatos", path: "/campeonatos" },
  { icon: Users, label: "Comunidade", path: "/comunidade" },
  { icon: LayoutDashboard, label: "Admin", path: "/admin" },
  { icon: ScanEye, label: "Visão 360", path: "/visao-360" },
  { icon: Users, label: "Cadastro", path: "/cadastro" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 flex flex-col border-r border-border bg-sidebar z-50">
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
            <Spade className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold tracking-wider text-foreground leading-tight">
              BLACK ACE ♠️
            </h1>
            <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
              Jiu-Jítsu Academy
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative block"
            >
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? "text-primary bg-primary/10"
                    : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
                  }`}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full gradient-gold"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-card">
          <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-xs font-bold text-primary-foreground">
            AF
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">Aluno Faixa Azul</p>
            <p className="text-xs text-muted-foreground">Aluno</p>
          </div>
        </div>
        <div className="mt-2 flex gap-1">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors">
            <Sun className="w-3.5 h-3.5" />
            Modo claro
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-sidebar-accent transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
