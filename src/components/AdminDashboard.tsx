import { motion } from "framer-motion";
import {
  Users, GraduationCap, ClipboardCheck, TrendingUp, AlertTriangle,
  Calendar, UserCheck, UserX, Clock, Activity, ChevronRight,
  Flame, Award, Bell, BarChart3, ArrowUpRight, ArrowDownRight
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// --- Stat Card ---
const StatCard = ({ icon: Icon, label, value, sub, color, trend }: {
  icon: any; label: string; value: string; sub?: string; color: string; trend?: { value: string; up: boolean };
}) => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card relative overflow-hidden group hover:border-primary/20 transition-colors">
    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
    <div className="flex items-start justify-between relative">
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-display font-bold text-foreground mt-1">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    {trend && (
      <div className={`flex items-center gap-1 mt-3 text-xs font-semibold ${trend.up ? "text-success" : "text-destructive"}`}>
        {trend.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
        {trend.value} vs mês anterior
      </div>
    )}
  </motion.div>
);

// --- Students needing attention ---
const alertStudents = [
  { name: "Carlos Mendes", belt: "Branca", issue: "Sem check-in há 14 dias", severity: "high" },
  { name: "Fernanda Lima", belt: "Azul", issue: "Sem check-in há 10 dias", severity: "high" },
  { name: "Pedro Alves", belt: "Branca", issue: "Streak quebrado - era 8 semanas", severity: "medium" },
  { name: "Ana Souza", belt: "Amarela", issue: "Sem check-in há 7 dias", severity: "medium" },
];

const AttentionCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-primary" />
        <h3 className="font-display text-base font-bold text-foreground tracking-wide">Alunos que precisam de atenção</h3>
      </div>
      <span className="text-xs px-2.5 py-1 rounded-full bg-destructive/15 text-destructive font-semibold">{alertStudents.length} alertas</span>
    </div>
    <div className="space-y-2.5">
      {alertStudents.map((s, i) => (
        <motion.div
          key={i}
          className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer group ${
            s.severity === "high" ? "bg-destructive/5 border-destructive/20 hover:border-destructive/40" : "bg-primary/5 border-primary/15 hover:border-primary/30"
          }`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.08 }}
        >
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
            {s.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
            <p className="text-xs text-muted-foreground">{s.issue}</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium shrink-0">{s.belt}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// --- Today's classes ---
const todayClasses = [
  { time: "06:30", name: "Jiu-Jítsu Manhã", instructor: "Prof. Ricardo", confirmed: 8, capacity: 15, status: "active" },
  { time: "10:00", name: "Kids Jiu-Jítsu", instructor: "Prof. Ana", confirmed: 12, capacity: 12, status: "full" },
  { time: "18:00", name: "Jiu-Jítsu Avançado", instructor: "Prof. Ricardo", confirmed: 6, capacity: 20, status: "upcoming" },
  { time: "19:30", name: "Muay Thai", instructor: "Prof. Marcos", confirmed: 10, capacity: 18, status: "upcoming" },
  { time: "20:30", name: "Jiu-Jítsu Noturno", instructor: "Prof. Ricardo", confirmed: 4, capacity: 20, status: "upcoming" },
];

const TodayClassesCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="font-display text-base font-bold text-foreground tracking-wide">Aulas de Hoje</h3>
      </div>
      <span className="text-xs text-muted-foreground font-medium">Sex, 14 Mar 2026</span>
    </div>
    <div className="space-y-2.5">
      {todayClasses.map((c, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border hover:border-primary/20 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 + i * 0.06 }}
        >
          <div className="text-center min-w-[48px]">
            <p className="text-sm font-display font-bold text-foreground">{c.time}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.instructor}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{c.confirmed}/{c.capacity}</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              c.status === "active" ? "bg-success animate-pulse" : c.status === "full" ? "bg-primary" : "bg-muted-foreground"
            }`} />
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// --- Recent Check-ins Feed ---
const recentCheckins = [
  { name: "João Silva", time: "06:35", class: "Jiu-Jítsu Manhã" },
  { name: "Maria Santos", time: "06:33", class: "Jiu-Jítsu Manhã" },
  { name: "Lucas Pereira", time: "06:32", class: "Jiu-Jítsu Manhã" },
  { name: "Rafaela Costa", time: "06:30", class: "Jiu-Jítsu Manhã" },
  { name: "Bruno Oliveira", time: "06:28", class: "Jiu-Jítsu Manhã" },
];

const RecentCheckinsCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-success" />
        <h3 className="font-display text-base font-bold text-foreground tracking-wide">Check-ins em Tempo Real</h3>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-xs text-success font-medium">ao vivo</span>
      </div>
    </div>
    <div className="space-y-2">
      {recentCheckins.map((c, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/40 transition-colors"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.06 }}
        >
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-foreground">
            {c.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground truncate">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.class}</p>
          </div>
          <span className="text-xs text-muted-foreground font-mono">{c.time}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// --- Belt Distribution ---
const beltData = [
  { belt: "Branca", count: 5, color: "bg-white/80", pct: 42 },
  { belt: "Azul", count: 3, color: "bg-blue-500", pct: 25 },
  { belt: "Roxa", count: 2, color: "bg-purple-500", pct: 17 },
  { belt: "Marrom", count: 1, color: "bg-amber-800", pct: 8 },
  { belt: "Preta", count: 1, color: "bg-foreground", pct: 8 },
];

const BeltDistributionCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-primary" />
        <h3 className="font-display text-base font-bold text-foreground tracking-wide">Distribuição de Faixas</h3>
      </div>
    </div>
    <div className="space-y-3">
      {beltData.map((b, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${b.color} shrink-0`} />
          <span className="text-sm text-foreground w-16">{b.belt}</span>
          <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${b.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${b.pct}%` }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
            />
          </div>
          <span className="text-sm font-bold text-foreground w-6 text-right">{b.count}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

// --- Upcoming Graduations ---
const upcomingGrads = [
  { name: "João Silva", from: "Branca", to: "Azul", lessons: "112/120", pct: 93 },
  { name: "Maria Santos", from: "Azul", to: "Roxa", lessons: "180/200", pct: 90 },
  { name: "Pedro Alves", from: "Marrom", to: "Preta", lessons: "160/180", pct: 89 },
];

const GraduationsCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-primary" />
        <h3 className="font-display text-base font-bold text-foreground tracking-wide">Próximas Graduações</h3>
      </div>
    </div>
    <div className="space-y-3">
      {upcomingGrads.map((g, i) => (
        <motion.div
          key={i}
          className="p-3 rounded-xl bg-secondary/30 border border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-foreground">
                {g.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{g.name}</p>
                <p className="text-xs text-muted-foreground">{g.from} → {g.to}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-primary">{g.lessons}</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-gold"
              initial={{ width: 0 }}
              animate={{ width: `${g.pct}%` }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// --- Monthly Performance ---
const weeklyData = [
  { week: "Sem 1", checkins: 42, trend: "up" },
  { week: "Sem 2", checkins: 38, trend: "down" },
  { week: "Sem 3", checkins: 51, trend: "up" },
  { week: "Sem 4", checkins: 45, trend: "up" },
];

const PerformanceCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="font-display text-base font-bold text-foreground tracking-wide">Check-ins por Semana</h3>
      </div>
      <span className="text-xs text-muted-foreground">Março 2026</span>
    </div>
    <div className="flex items-end gap-3 h-32">
      {weeklyData.map((w, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-bold text-foreground">{w.checkins}</span>
          <motion.div
            className="w-full rounded-t-lg gradient-gold"
            initial={{ height: 0 }}
            animate={{ height: `${(w.checkins / 55) * 100}%` }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
          />
          <span className="text-[10px] text-muted-foreground mt-1">{w.week}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

// --- Quick Notifications ---
const notifications = [
  { text: "3 alunos completaram requisitos para graduação", time: "2h", icon: GraduationCap, color: "text-primary" },
  { text: "Mensalidade pendente: 2 alunos", time: "5h", icon: Bell, color: "text-destructive" },
  { text: "Novo aluno cadastrado: Rafael Costa", time: "1d", icon: UserCheck, color: "text-success" },
];

const NotificationsCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary" />
        <h3 className="font-display text-base font-bold text-foreground tracking-wide">Notificações</h3>
      </div>
      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold">{notifications.length}</span>
    </div>
    <div className="space-y-2.5">
      {notifications.map((n, i) => (
        <motion.div
          key={i}
          className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border hover:border-primary/20 transition-colors cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.08 }}
        >
          <n.icon className={`w-4 h-4 mt-0.5 shrink-0 ${n.color}`} />
          <p className="text-sm text-foreground flex-1">{n.text}</p>
          <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// --- Main Admin Dashboard ---
const AdminDashboard = () => (
  <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
    {/* Header */}
    <motion.div variants={fadeUp}>
      <h1 className="text-2xl font-display font-bold text-foreground tracking-wide">Dashboard do Professor</h1>
      <p className="text-sm text-muted-foreground mt-1">Visão geral da sua academia e alunos</p>
    </motion.div>

    {/* Stats Row */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Users} label="Alunos Ativos" value="12" sub="2 novos este mês" color="bg-blue-500/15 text-blue-400" trend={{ value: "+20%", up: true }} />
      <StatCard icon={ClipboardCheck} label="Check-ins Hoje" value="8" sub="de 5 aulas" color="bg-success/15 text-success" trend={{ value: "+12%", up: true }} />
      <StatCard icon={UserX} label="Alunos Inativos" value="3" sub="sem check-in 7+ dias" color="bg-destructive/15 text-destructive" />
      <StatCard icon={Flame} label="Frequência Média" value="78%" sub="últimos 30 dias" color="bg-primary/15 text-primary" trend={{ value: "+5%", up: true }} />
    </div>

    {/* Main Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        <AttentionCard />
        <TodayClassesCard />
        <PerformanceCard />
      </div>
      <div className="space-y-5">
        <RecentCheckinsCard />
        <BeltDistributionCard />
        <GraduationsCard />
        <NotificationsCard />
      </div>
    </div>
  </motion.div>
);

export default AdminDashboard;
