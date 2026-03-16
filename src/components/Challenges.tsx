import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Star, Flame, Trophy, Target, CheckCircle2, Circle, Lock,
  TrendingUp, Award, Swords, Calendar, ChevronRight, Medal, Clock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

// --- MOCK DATA ---

const playerStats = {
  name: "Aluno Faixa Azul",
  level: 45,
  xp: 44160,
  xpNextLevel: 46000,
  xpThisWeek: 325,
  streak: 6,
  longestStreak: 9,
  totalChallengesCompleted: 28,
  totalMedals: 5,
  rank: 3,
};

const xpHistory = [
  { date: "Seg", xp: 50 },
  { date: "Ter", xp: 75 },
  { date: "Qua", xp: 0 },
  { date: "Qui", xp: 50 },
  { date: "Sex", xp: 100 },
  { date: "Sáb", xp: 50 },
  { date: "Dom", xp: 0 },
];

const weeklyChallenges = [
  { id: 1, text: "Treinar 3x na semana", xp: 50, done: true, icon: Calendar },
  { id: 2, text: "Completar 20 aulas no grau atual", xp: 100, done: true, icon: Target },
  { id: 3, text: "Manter streak de 4+ semanas", xp: 75, done: true, icon: Flame },
  { id: 4, text: "Ganhar medalha de ouro em campeonato", xp: 200, done: false, icon: Medal },
];

const monthlyChallenges = [
  { id: 5, text: "Frequentar 20 aulas no mês", xp: 300, progress: 14, total: 20, icon: Calendar },
  { id: 6, text: "Participar de 2 campeonatos", xp: 500, progress: 1, total: 2, icon: Trophy },
  { id: 7, text: "Executar 5 técnicas novas no sparring", xp: 250, progress: 3, total: 5, icon: Swords },
  { id: 8, text: "Manter streak de 8 semanas", xp: 400, progress: 6, total: 8, icon: Flame },
];

const specialChallenges = [
  { id: 9, text: "Mestre da Guarda — Domine 10 variações de guarda", xp: 1000, progress: 6, total: 10, icon: Award, locked: false },
  { id: 10, text: "Finalizador — Execute 20 finalizações em sparring", xp: 1500, progress: 8, total: 20, icon: Swords, locked: false },
  { id: 11, text: "Lenda da Academia — Complete 500 aulas", xp: 5000, progress: 220, total: 500, icon: Star, locked: false },
  { id: 12, text: "Guerreiro Supremo — Streak de 52 semanas", xp: 10000, progress: 6, total: 52, icon: Flame, locked: true },
];

const medals = [
  { name: "Primeira Aula", desc: "Completou a primeira aula", icon: "🥋", earned: true },
  { name: "Streak 4 Semanas", desc: "Manteve streak por 4 semanas", icon: "🔥", earned: true },
  { name: "Campeão Regional", desc: "Ouro em campeonato regional", icon: "🏆", earned: true },
  { name: "100 Aulas", desc: "Frequentou 100 aulas", icon: "💯", earned: true },
  { name: "Top 3 Ranking", desc: "Entrou no top 3 do ranking", icon: "⭐", earned: true },
  { name: "Streak 12 Semanas", desc: "Manter streak por 12 semanas", icon: "💎", earned: false },
  { name: "500 Aulas", desc: "Frequentar 500 aulas", icon: "🎖️", earned: false },
  { name: "Campeão Nacional", desc: "Ouro em campeonato nacional", icon: "👑", earned: false },
];

const leaderboard = [
  { rank: 1, name: "Carlos Silva", xp: 52400, level: 52, streak: 12 },
  { rank: 2, name: "Ana Santos", xp: 48200, level: 48, streak: 8 },
  { rank: 3, name: "Aluno Faixa Azul", xp: 44160, level: 45, streak: 6, isYou: true },
  { rank: 4, name: "Pedro Lima", xp: 41800, level: 42, streak: 5 },
  { rank: 5, name: "Maria Costa", xp: 38500, level: 39, streak: 4 },
];

// --- COMPONENTS ---

const XpLevelHeader = () => {
  const progressPct = ((playerStats.xp - 44000) / (playerStats.xpNextLevel - 44000)) * 100;

  return (
    <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-6 shadow-card relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 relative">
        {/* Level Circle */}
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl gradient-gold flex items-center justify-center shadow-gold">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-primary-foreground">{playerStats.level}</p>
              <p className="text-[9px] font-bold text-primary-foreground/70 uppercase tracking-wider">Nível</p>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card border-2 border-success flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-success" />
          </div>
        </div>

        {/* XP Info */}
        <div className="flex-1">
          <h2 className="font-display text-2xl font-bold text-foreground tracking-wide mb-1">
            {playerStats.xp.toLocaleString()} XP
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Faltam <span className="text-primary font-semibold">{(playerStats.xpNextLevel - playerStats.xp).toLocaleString()} XP</span> para o nível {playerStats.level + 1}
          </p>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 lg:gap-4">
          {[
            { label: "XP Semanal", value: `+${playerStats.xpThisWeek}`, icon: Zap, color: "text-primary" },
            { label: "Streak", value: `${playerStats.streak} sem`, icon: Flame, color: "text-orange-400" },
            { label: "Rank", value: `#${playerStats.rank}`, icon: Trophy, color: "text-blue-400" },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 rounded-xl bg-secondary/50 border border-border">
              <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-lg font-display font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const XpBarChart = () => {
  const max = Math.max(...xpHistory.map((d) => d.xp), 1);

  return (
    <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-bold text-foreground tracking-wide">XP Semanal</h3>
        <span className="text-xs text-muted-foreground">Última semana</span>
      </div>
      <div className="flex items-end gap-2 h-32">
        {xpHistory.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-primary">{d.xp > 0 ? `+${d.xp}` : ""}</span>
            <motion.div
              className={`w-full rounded-t-lg ${d.xp > 0 ? "gradient-gold" : "bg-secondary"}`}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max((d.xp / max) * 100, 8)}%` }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            />
            <span className="text-[10px] text-muted-foreground font-medium">{d.date}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const StreakCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display text-base font-bold text-foreground tracking-wide">Sequência de Treinos</h3>
      <Flame className="w-5 h-5 text-orange-400" />
    </div>

    <div className="flex items-center gap-4 mb-4">
      <div className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex flex-col items-center justify-center">
        <Flame className="w-6 h-6 text-orange-400 mb-1" />
        <span className="text-2xl font-display font-bold text-orange-400">{playerStats.streak}</span>
      </div>
      <div>
        <p className="text-foreground font-semibold">semanas consecutivas</p>
        <p className="text-sm text-muted-foreground">Recorde: {playerStats.longestStreak} semanas</p>
      </div>
    </div>

    <div className="flex gap-1.5">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className={`flex-1 h-3 rounded-full ${
            i < playerStats.streak
              ? "gradient-gold shadow-gold"
              : i < playerStats.longestStreak
              ? "bg-orange-500/20 border border-orange-500/10"
              : "bg-secondary"
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.05 }}
        />
      ))}
    </div>
    <div className="flex justify-between mt-1.5">
      <span className="text-[10px] text-muted-foreground">1</span>
      <span className="text-[10px] text-muted-foreground">12 semanas</span>
    </div>
  </motion.div>
);

const ChallengesList = ({ challenges, type }: { challenges: typeof weeklyChallenges | typeof monthlyChallenges; type: "weekly" | "monthly" }) => (
  <div className="space-y-3">
    {challenges.map((c, i) => {
      const isProgressType = "progress" in c;
      const isDone = isProgressType ? (c as any).progress >= (c as any).total : (c as any).done;
      const progressPct = isProgressType ? ((c as any).progress / (c as any).total) * 100 : isDone ? 100 : 0;

      return (
        <motion.div
          key={c.id}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
            isDone ? "bg-success/5 border-success/20" : "bg-secondary/30 border-border hover:border-primary/20"
          }`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.08 }}
          whileHover={{ x: 4 }}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isDone ? "bg-success/10" : "bg-primary/10"
          }`}>
            <c.icon className={`w-5 h-5 ${isDone ? "text-success" : "text-primary"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${isDone ? "text-foreground" : "text-foreground"}`}>{c.text}</p>
            {isProgressType && !isDone && (
              <div className="flex items-center gap-2 mt-1.5">
                <Progress value={progressPct} className="h-1.5 flex-1" />
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {(c as any).progress}/{(c as any).total}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              isDone ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
            }`}>
              +{c.xp} XP
            </span>
            {isDone ? (
              <CheckCircle2 className="w-5 h-5 text-success" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </motion.div>
      );
    })}
  </div>
);

const SpecialChallengesCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display text-base font-bold text-foreground tracking-wide">Desafios Especiais</h3>
      <Award className="w-5 h-5 text-primary" />
    </div>
    <div className="space-y-3">
      {specialChallenges.map((c, i) => {
        const progressPct = (c.progress / c.total) * 100;
        return (
          <motion.div
            key={c.id}
            className={`p-4 rounded-xl border transition-all ${
              c.locked
                ? "bg-secondary/20 border-border/50 opacity-60"
                : "bg-secondary/30 border-border hover:border-primary/20"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                c.locked ? "bg-muted" : "bg-primary/10"
              }`}>
                {c.locked ? (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <c.icon className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-foreground">{c.text}</p>
                  <span className="text-xs font-bold text-primary ml-2 whitespace-nowrap">+{c.xp.toLocaleString()} XP</span>
                </div>
                {!c.locked && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <Progress value={progressPct} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {c.progress}/{c.total}
                    </span>
                  </div>
                )}
                {c.locked && (
                  <p className="text-xs text-muted-foreground mt-1">Desbloqueie completando outros desafios</p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);

const MedalsGrid = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display text-base font-bold text-foreground tracking-wide">Medalhas e Conquistas</h3>
      <span className="text-xs text-muted-foreground">{medals.filter((m) => m.earned).length}/{medals.length}</span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {medals.map((m, i) => (
        <motion.div
          key={i}
          className={`p-4 rounded-xl border text-center transition-all ${
            m.earned
              ? "bg-secondary/50 border-primary/20 hover:border-primary/40"
              : "bg-secondary/20 border-border/50 opacity-50"
          }`}
          whileHover={m.earned ? { y: -3, scale: 1.02 } : {}}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: m.earned ? 1 : 0.5, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.05 }}
        >
          <span className="text-3xl block mb-2">{m.earned ? m.icon : "🔒"}</span>
          <p className="text-xs font-semibold text-foreground leading-tight">{m.name}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{m.desc}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const LeaderboardCard = () => (
  <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display text-base font-bold text-foreground tracking-wide">Ranking XP</h3>
      <Trophy className="w-5 h-5 text-primary" />
    </div>
    <div className="space-y-2">
      {leaderboard.map((p, i) => (
        <motion.div
          key={i}
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
            p.isYou
              ? "bg-primary/5 border-primary/20"
              : "bg-secondary/30 border-border hover:border-border"
          }`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.08 }}
        >
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            p.rank === 1
              ? "gradient-gold text-primary-foreground shadow-gold"
              : p.rank === 2
              ? "bg-gray-400/20 text-gray-300"
              : p.rank === 3
              ? "bg-orange-800/20 text-orange-400"
              : "bg-secondary text-muted-foreground"
          }`}>
            {p.rank}
          </span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${p.isYou ? "text-primary" : "text-foreground"}`}>
              {p.name} {p.isYou && <span className="text-xs text-muted-foreground">(você)</span>}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs shrink-0">
            <span className="flex items-center gap-1 text-orange-400">
              <Flame className="w-3 h-3" />{p.streak}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              Lv.{p.level}
            </span>
            <span className="font-bold text-primary">{p.xp.toLocaleString()} XP</span>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// --- MAIN ---

const Challenges = () => {
  return (
    <motion.div className="space-y-5" variants={stagger} initial="initial" animate="animate">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-display font-bold text-foreground tracking-wide">
          Gamificação & Desafios
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Ganhe XP, desbloqueie medalhas e suba no ranking</p>
      </motion.div>

      <XpLevelHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Challenges Tabs */}
          <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card">
            <Tabs defaultValue="weekly">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-bold text-foreground tracking-wide">Desafios</h3>
                <TabsList className="bg-secondary/50">
                  <TabsTrigger value="weekly" className="text-xs">Semanais</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs">Mensais</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="weekly">
                <ChallengesList challenges={weeklyChallenges} type="weekly" />
              </TabsContent>
              <TabsContent value="monthly">
                <ChallengesList challenges={monthlyChallenges} type="monthly" />
              </TabsContent>
            </Tabs>
          </motion.div>

          <SpecialChallengesCard />
          <MedalsGrid />
        </div>

        <div className="space-y-5">
          <XpBarChart />
          <StreakCard />
          <LeaderboardCard />
        </div>
      </div>
    </motion.div>
  );
};

export default Challenges;
