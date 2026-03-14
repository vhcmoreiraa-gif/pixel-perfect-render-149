import { motion } from "framer-motion";
import { Flame, Trophy, Zap, Star, Calendar, ChevronRight, CheckCircle2, Circle, Medal, Clock } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

// --- Sub-components ---

const ProfileHeader = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-6 shadow-card relative overflow-hidden">
    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    <div className="flex items-start justify-between relative">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center text-xl font-bold text-primary-foreground shadow-gold">
            AF
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border-2 border-primary flex items-center justify-center text-[10px] font-bold text-primary">
            2
          </div>
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-foreground tracking-wide">Aluno Faixa Azul</h2>
          <p className="text-sm text-muted-foreground">@aluno2</p>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Faixa AZUL
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-primary">
        <Flame className="w-5 h-5" />
        <span className="font-display font-bold text-lg">6 semanas</span>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4 mt-6">
      {[
        { label: "XP Total", value: "44.160", icon: Zap, color: "text-primary" },
        { label: "Nível", value: "45", icon: Star, color: "text-blue-400" },
        { label: "Streak", value: "6", icon: Flame, color: "text-orange-400" },
      ].map((stat) => (
        <div key={stat.label} className="text-center p-3 rounded-xl bg-secondary/50 border border-border">
          <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className={`text-lg font-display font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>

    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
      <Trophy className="w-4 h-4 text-primary" />
      <span className="text-xs font-semibold text-primary">Campeão</span>
    </div>
  </motion.div>
);

const ProgressCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <h3 className="font-display text-base font-bold text-foreground tracking-wide mb-4">Progresso para o próximo grau</h3>
    <div className="flex gap-2 mb-3">
      {[100, 100, 60, 0].map((pct, i) => (
        <div key={i} className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full gradient-gold"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
          />
        </div>
      ))}
    </div>
    <p className="text-sm text-muted-foreground">
      Faltam <span className="text-primary font-semibold">8 aulas</span> para o próximo grau
    </p>
  </motion.div>
);

const challenges = [
  { text: "Treinar 3x na semana", xp: "+50 XP", done: true },
  { text: "Completar 20 aulas no grau atual", xp: "+100 XP", done: true },
  { text: "Manter streak de 4+ semanas", xp: "+75 XP", done: true },
  { text: "Ganhar medalha de ouro", xp: "+200 XP", done: false },
];

const ChallengesCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display text-base font-bold text-foreground tracking-wide">Desafios Semanais</h3>
      <span className="text-xs text-muted-foreground font-medium">Weekly Wins</span>
    </div>
    <div className="space-y-3">
      {challenges.map((c, i) => (
        <motion.div
          key={i}
          className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
            c.done ? "bg-success/5 border-success/20" : "bg-secondary/30 border-border"
          }`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
        >
          {c.done ? (
            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
          )}
          <span className={`flex-1 text-sm ${c.done ? "text-foreground" : "text-muted-foreground"}`}>{c.text}</span>
          <span className={`text-xs font-bold ${c.done ? "text-primary" : "text-muted-foreground"}`}>{c.xp}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const calendarDays = [
  [null, 1, 2, 3, 4, 5, 6, 7],
  [null, 8, 9, 10, 11, 12, 13, 14],
  [null, 15, 16, 17, 18, 19, 20, 21],
  [null, 22, 23, 24, 25, 26, 27, 28],
  [null, 29, 30, 31, null, null, null, null],
];
const activeDays = [2, 4, 6, 9, 11, 13, 16, 18, 20, 23, 25];

const CalendarCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display text-base font-bold text-foreground tracking-wide">Calendário Mensal</h3>
      <span className="text-sm text-muted-foreground">Março 2026</span>
    </div>
    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
      {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
        <span key={d} className="text-muted-foreground font-medium py-1">{d}</span>
      ))}
    </div>
    <div className="grid grid-cols-7 gap-1 text-center text-xs">
      {calendarDays.flat().slice(1).map((day, i) => (
        <div key={i} className="py-1">
          {day ? (
            <span
              className={`inline-flex w-7 h-7 items-center justify-center rounded-full font-medium transition-all ${
                activeDays.includes(day)
                  ? "gradient-gold text-primary-foreground font-bold shadow-gold"
                  : day === 14
                  ? "ring-2 ring-primary/50 text-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {day}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  </motion.div>
);

const activities = [
  { text: "Treino confirmado - 12 treinos este mês", date: "14/03/2026", color: "bg-primary" },
  { text: "Progresso: 22/30 aulas no grau", date: "12/03/2026", color: "bg-blue-500" },
  { text: "Streak alcançado: 6 semanas consecutivas!", date: "07/03/2026", color: "bg-success" },
  { text: "Medalha de Ouro conquistada!", date: "28/02/2026", color: "bg-primary" },
];

const ActivitiesCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <h3 className="font-display text-base font-bold text-foreground tracking-wide mb-4">Atividades Recentes</h3>
    <div className="space-y-3">
      {activities.map((a, i) => (
        <motion.div
          key={i}
          className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border hover:border-primary/20 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
        >
          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${a.color}`} />
          <div>
            <p className="text-sm text-foreground">{a.text}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{a.date}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const QuickActionsCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <h3 className="font-display text-base font-bold text-foreground tracking-wide mb-4">Ações Rápidas</h3>
    <motion.button
      className="w-full py-4 rounded-xl gradient-gold text-primary-foreground font-display font-bold text-sm tracking-widest uppercase shadow-gold hover:shadow-[0_0_30px_hsl(43_96%_56%/0.3)] transition-shadow"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Confirmar Presença Hoje
    </motion.button>
  </motion.div>
);

const events = [
  { name: "Campeonato Regional", date: "15/03/2026 - 14:00" },
  { name: "Avaliação de Faixa", date: "20/03/2026 - 19:00" },
];

const EventsCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display text-base font-bold text-foreground tracking-wide">Próximos Eventos</h3>
      <Calendar className="w-4 h-4 text-muted-foreground" />
    </div>
    <div className="space-y-3">
      {events.map((e, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border hover:border-primary/20 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{e.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {e.date}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      ))}
    </div>
  </motion.div>
);

const trophies = [
  { name: "Open BLACK ACE JIU-JÍTSU ACADEMY", year: "2026", cat: "Meio-Pesado", medal: "OURO" },
  { name: "Copa Regional Muay Thai", year: "2025", cat: "Meio-Pesado", medal: "PRATA" },
];

const TrophiesCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display text-base font-bold text-foreground tracking-wide">Sala de Troféus</h3>
      <span className="text-xs text-muted-foreground">2 conquista(s)</span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {trophies.map((t, i) => (
        <motion.div
          key={i}
          className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all group cursor-pointer"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Medal className="w-6 h-6 text-primary" />
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                t.medal === "OURO"
                  ? "bg-primary/20 text-primary"
                  : "bg-gray-400/20 text-gray-400"
              }`}
            >
              {t.medal}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground leading-tight">{t.name}</p>
          <p className="text-xs text-muted-foreground mt-1">{t.year} · {t.cat}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// --- Main Dashboard ---

const Dashboard = () => {
  return (
    <motion.div
      className="space-y-5"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 space-y-5">
          <ProgressCard />
          <ChallengesCard />
          <ActivitiesCard />
        </div>
        <div className="lg:col-span-1 space-y-5">
          <CalendarCard />
          <TrophiesCard />
        </div>
        <div className="lg:col-span-1 space-y-5">
          <QuickActionsCard />
          <EventsCard />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
