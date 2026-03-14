import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Calendar,
  TrendingUp,
  Target,
  Award,
  Clock,
  Flame,
  ChevronRight,
  Star,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3,
  Activity,
  FileText,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Shield,
  Dumbbell,
  Swords,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Graduation rules based on Black Ace system
const graduationRules: Record<string, {
  label: string; next: string; lessonsNeeded: number; lessonsPerGrau: number;
  minMonths: string; totalGraus: number;
  color: string;
}> = {
  branca: { label: "Branca", next: "Azul", lessonsNeeded: 120, lessonsPerGrau: 30, minMonths: "12–18 meses", totalGraus: 4, color: "bg-white text-black" },
  azul: { label: "Azul", next: "Roxa", lessonsNeeded: 200, lessonsPerGrau: 50, minMonths: "18–24 meses", totalGraus: 4, color: "bg-blue-600 text-white" },
  roxa: { label: "Roxa", next: "Marrom", lessonsNeeded: 220, lessonsPerGrau: 55, minMonths: "18 meses", totalGraus: 4, color: "bg-purple-600 text-white" },
  marrom: { label: "Marrom", next: "Preta", lessonsNeeded: 180, lessonsPerGrau: 45, minMonths: "12 meses", totalGraus: 4, color: "bg-amber-800 text-white" },
  preta: { label: "Preta", next: "—", lessonsNeeded: 0, lessonsPerGrau: 0, minMonths: "—", totalGraus: 0, color: "bg-black text-white border border-muted" },
};

const beltMap = Object.fromEntries(
  Object.entries(graduationRules).map(([k, v]) => [k, { color: v.color, label: v.label, next: v.next, lessonsNeeded: v.lessonsNeeded, lessonsDone: 0 }])
) as Record<string, { color: string; label: string; next: string; lessonsNeeded: number; lessonsDone: number }>;

const mockStudents = [
  {
    id: 1, name: "João Mendes", initials: "JM", belt: "azul", graus: 2, age: 24,
    phone: "(11) 99123-4567", email: "joao@email.com", since: "Mar 2023",
    plan: "Mensal", status: "Ativo",
    stats: {
      totalClasses: 142, monthClasses: 18, streak: 12, bestStreak: 22,
      frequency: 82, avgPerWeek: 4.2, rank: 3, xp: 2850,
      absences30d: 3, lateArrivals: 1,
      sparringWins: 28, sparringLosses: 14, sparringDraws: 8,
      competitions: 3, medals: { gold: 1, silver: 1, bronze: 0 },
      techniqueScore: 7.8, disciplineScore: 8.5, consistencyScore: 8.2,
    },
    monthlyPresence: [14, 16, 18, 12, 20, 15, 18, 22, 17, 19, 16, 18],
    recentClasses: [
      { date: "14/03", type: "Técnica", present: true },
      { date: "13/03", type: "Sparring", present: true },
      { date: "12/03", type: "Técnica", present: true },
      { date: "11/03", type: "Técnica", present: false },
      { date: "10/03", type: "Sparring", present: true },
      { date: "09/03", type: "Técnica", present: true },
      { date: "07/03", type: "Sparring", present: true },
      { date: "06/03", type: "Técnica", present: true },
    ],
    notes: [
      { date: "10/03", text: "Evoluindo muito na guarda De La Riva. Precisa melhorar passagem de guarda." },
      { date: "28/02", text: "Bom desempenho no campeonato interno. Medalha de ouro na categoria." },
    ],
  },
  {
    id: 2, name: "Maria Santos", initials: "MS", belt: "roxa", graus: 1, age: 28,
    phone: "(11) 98765-4321", email: "maria@email.com", since: "Jan 2021",
    plan: "Trimestral", status: "Ativo",
    stats: {
      totalClasses: 198, monthClasses: 22, streak: 30, bestStreak: 45,
      frequency: 94, avgPerWeek: 5.1, rank: 1, xp: 4200,
      absences30d: 1, lateArrivals: 0,
      sparringWins: 42, sparringLosses: 10, sparringDraws: 5,
      competitions: 7, medals: { gold: 4, silver: 2, bronze: 1 },
      techniqueScore: 9.1, disciplineScore: 9.5, consistencyScore: 9.8,
    },
    monthlyPresence: [18, 20, 22, 19, 24, 21, 22, 20, 23, 22, 21, 22],
    recentClasses: [
      { date: "14/03", type: "Técnica", present: true },
      { date: "13/03", type: "Sparring", present: true },
      { date: "12/03", type: "Técnica", present: true },
      { date: "11/03", type: "Técnica", present: true },
      { date: "10/03", type: "Sparring", present: true },
      { date: "09/03", type: "Técnica", present: true },
      { date: "07/03", type: "Sparring", present: true },
      { date: "06/03", type: "Técnica", present: true },
    ],
    notes: [
      { date: "12/03", text: "Performance excepcional nos sparrings. Pronta para campeonato estadual." },
      { date: "01/03", text: "Liderança natural na turma. Ajuda colegas mais novos." },
    ],
  },
  {
    id: 3, name: "Lucas Ribeiro", initials: "LR", belt: "branca", graus: 4, age: 19,
    phone: "(11) 91234-5678", email: "lucas@email.com", since: "Set 2024",
    plan: "Mensal", status: "Ativo",
    stats: {
      totalClasses: 85, monthClasses: 10, streak: 3, bestStreak: 15,
      frequency: 58, avgPerWeek: 2.8, rank: 12, xp: 980,
      absences30d: 8, lateArrivals: 4,
      sparringWins: 8, sparringLosses: 18, sparringDraws: 6,
      competitions: 1, medals: { gold: 0, silver: 0, bronze: 1 },
      techniqueScore: 5.5, disciplineScore: 5.0, consistencyScore: 4.8,
    },
    monthlyPresence: [8, 10, 12, 6, 14, 9, 10, 8, 11, 7, 10, 10],
    recentClasses: [
      { date: "14/03", type: "Técnica", present: true },
      { date: "13/03", type: "Sparring", present: false },
      { date: "12/03", type: "Técnica", present: false },
      { date: "11/03", type: "Técnica", present: true },
      { date: "10/03", type: "Sparring", present: false },
      { date: "09/03", type: "Técnica", present: true },
      { date: "07/03", type: "Sparring", present: false },
      { date: "06/03", type: "Técnica", present: false },
    ],
    notes: [
      { date: "08/03", text: "Frequência caindo. Conversar sobre motivação e compromisso." },
      { date: "20/02", text: "Bom potencial técnico mas falta regularidade nos treinos." },
    ],
  },
  {
    id: 4, name: "Ana Costa", initials: "AC", belt: "azul", graus: 0, age: 26,
    phone: "(11) 97654-3210", email: "ana@email.com", since: "Jun 2023",
    plan: "Semestral", status: "Ativo",
    stats: {
      totalClasses: 110, monthClasses: 16, streak: 8, bestStreak: 20,
      frequency: 76, avgPerWeek: 3.8, rank: 6, xp: 2100,
      absences30d: 4, lateArrivals: 2,
      sparringWins: 15, sparringLosses: 12, sparringDraws: 8,
      competitions: 2, medals: { gold: 0, silver: 1, bronze: 1 },
      techniqueScore: 7.2, disciplineScore: 7.8, consistencyScore: 7.5,
    },
    monthlyPresence: [12, 14, 16, 10, 18, 13, 16, 14, 15, 14, 16, 16],
    recentClasses: [
      { date: "14/03", type: "Técnica", present: true },
      { date: "13/03", type: "Sparring", present: true },
      { date: "12/03", type: "Técnica", present: false },
      { date: "11/03", type: "Técnica", present: true },
      { date: "10/03", type: "Sparring", present: true },
      { date: "09/03", type: "Técnica", present: true },
      { date: "07/03", type: "Sparring", present: false },
      { date: "06/03", type: "Técnica", present: true },
    ],
    notes: [
      { date: "11/03", text: "Melhorando consistência. Guarda fechada muito boa para o nível." },
    ],
  },
  {
    id: 5, name: "Pedro Alves", initials: "PA", belt: "marrom", graus: 1, age: 32,
    phone: "(11) 96543-2100", email: "pedro@email.com", since: "Fev 2019",
    plan: "Anual", status: "Ativo",
    stats: {
      totalClasses: 267, monthClasses: 20, streak: 18, bestStreak: 60,
      frequency: 90, avgPerWeek: 4.8, rank: 2, xp: 5100,
      absences30d: 2, lateArrivals: 0,
      sparringWins: 65, sparringLosses: 15, sparringDraws: 12,
      competitions: 12, medals: { gold: 6, silver: 3, bronze: 2 },
      techniqueScore: 9.4, disciplineScore: 9.2, consistencyScore: 9.0,
    },
    monthlyPresence: [20, 22, 18, 20, 22, 19, 20, 24, 21, 20, 18, 20],
    recentClasses: [
      { date: "14/03", type: "Técnica", present: true },
      { date: "13/03", type: "Sparring", present: true },
      { date: "12/03", type: "Técnica", present: true },
      { date: "11/03", type: "Técnica", present: true },
      { date: "10/03", type: "Sparring", present: true },
      { date: "09/03", type: "Técnica", present: true },
      { date: "07/03", type: "Sparring", present: true },
      { date: "06/03", type: "Técnica", present: false },
    ],
    notes: [
      { date: "13/03", text: "Candidato forte para faixa preta. Técnica e liderança exemplares." },
      { date: "01/03", text: "Ajudando a ministrar aulas para iniciantes. Excelente didática." },
    ],
  },
];

type Student = typeof mockStudents[0];

const ScoreRing = ({ score, label, size = 64 }: { score: number; label: string; size?: number }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;
  const color = score >= 8 ? "hsl(var(--success))" : score >= 6 ? "hsl(var(--primary))" : "hsl(var(--destructive))";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
          {score.toFixed(1)}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
    </div>
  );
};

const StudentView360 = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newNote, setNewNote] = useState("");

  const filtered = searchQuery.trim()
    ? mockStudents.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.belt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockStudents;

  const maxPresence = selectedStudent ? Math.max(...selectedStudent.monthlyPresence) : 1;
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-wider">
          Visão <span className="text-gradient-gold">360°</span> do Aluno
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Dossiê completo — selecione um aluno para visualizar todas as estatísticas.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Student List - Left Panel */}
        <div className="w-80 shrink-0 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar aluno..."
              className="pl-9 bg-card border-border h-10 text-sm"
            />
          </div>

          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-1 pr-2">
              {filtered.map((student) => {
                const belt = beltMap[student.belt];
                const isSelected = selectedStudent?.id === student.id;
                return (
                  <motion.button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      isSelected
                        ? "bg-primary/10 border border-primary/30 shadow-gold"
                        : "bg-card border border-border hover:border-primary/20 hover:bg-card/80"
                    }`}
                    whileHover={{ x: 2 }}
                  >
                    <div className="relative">
                      <Avatar className="w-10 h-10 border-2 border-border">
                        <AvatarFallback className="bg-secondary text-foreground font-bold text-xs">
                          {student.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card ${belt.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{student.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>Faixa {belt.label}</span>
                        <span>•</span>
                        <span>{student.graus} grau{student.graus !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-primary">{student.stats.frequency}%</p>
                      <p className="text-[10px] text-muted-foreground">freq.</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Student Detail - Right Panel */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {!selectedStudent ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[calc(100vh-220px)] flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">Selecione um aluno para ver o dossiê completo</p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedStudent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <ScrollArea className="h-[calc(100vh-220px)]">
                  <div className="space-y-5 pr-4">
                    {/* Profile Header */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar className="w-16 h-16 border-2 border-primary/30">
                            <AvatarFallback className="gradient-gold text-primary-foreground font-bold text-xl">
                              {selectedStudent.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-[8px] font-bold ${beltMap[selectedStudent.belt].color}`}>
                            {selectedStudent.graus}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold text-foreground">{selectedStudent.name}</h2>
                            <Badge className={`text-[10px] px-2 py-0.5 ${beltMap[selectedStudent.belt].color}`}>
                              Faixa {beltMap[selectedStudent.belt].label}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] border-success/40 text-success">
                              {selectedStudent.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                            <span>{selectedStudent.age} anos</span>
                            <span>{selectedStudent.phone}</span>
                            <span>{selectedStudent.email}</span>
                            <span>Desde {selectedStudent.since}</span>
                            <span>Plano: {selectedStudent.plan}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gradient-gold"># {selectedStudent.stats.rank}</p>
                          <p className="text-[10px] text-muted-foreground">Ranking geral</p>
                        </div>
                      </div>

                      {/* Belt Progress */}
                      {selectedStudent.belt !== "preta" && (
                        <div className="mt-4 p-3 rounded-lg bg-secondary/30">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground">
                              Progresso para Faixa {beltMap[selectedStudent.belt].next}
                            </span>
                            <span className="font-semibold text-primary">
                              {beltMap[selectedStudent.belt].lessonsDone}/{beltMap[selectedStudent.belt].lessonsNeeded} aulas
                            </span>
                          </div>
                          <Progress
                            value={(beltMap[selectedStudent.belt].lessonsDone / beltMap[selectedStudent.belt].lessonsNeeded) * 100}
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { icon: Calendar, label: "Total Aulas", value: selectedStudent.stats.totalClasses, color: "text-primary" },
                        { icon: Target, label: "Este Mês", value: selectedStudent.stats.monthClasses, color: "text-primary" },
                        { icon: Flame, label: "Streak Atual", value: `${selectedStudent.stats.streak}d`, color: "text-orange-400" },
                        { icon: Star, label: "XP Total", value: selectedStudent.stats.xp.toLocaleString(), color: "text-primary" },
                        { icon: TrendingUp, label: "Frequência", value: `${selectedStudent.stats.frequency}%`, color: selectedStudent.stats.frequency >= 75 ? "text-success" : "text-destructive" },
                        { icon: Clock, label: "Média/Semana", value: selectedStudent.stats.avgPerWeek.toFixed(1), color: "text-primary" },
                        { icon: AlertTriangle, label: "Faltas 30d", value: selectedStudent.stats.absences30d, color: selectedStudent.stats.absences30d > 5 ? "text-destructive" : "text-muted-foreground" },
                        { icon: Award, label: "Melhor Streak", value: `${selectedStudent.stats.bestStreak}d`, color: "text-primary" },
                      ].map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="rounded-xl border border-border bg-card p-3.5 text-center"
                        >
                          <stat.icon className={`w-4 h-4 mx-auto mb-1.5 ${stat.color}`} />
                          <p className="text-lg font-bold text-foreground">{stat.value}</p>
                          <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>

                    <Tabs defaultValue="overview" className="space-y-4">
                      <TabsList className="bg-card border border-border h-9">
                        <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                          Avaliação
                        </TabsTrigger>
                        <TabsTrigger value="presence" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                          Presença
                        </TabsTrigger>
                        <TabsTrigger value="combat" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                          Combate
                        </TabsTrigger>
                        <TabsTrigger value="notes" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                          Anotações
                        </TabsTrigger>
                      </TabsList>

                      {/* Evaluation Tab */}
                      <TabsContent value="overview">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Score Rings */}
                          <div className="rounded-xl border border-border bg-card p-5">
                            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-primary" /> Avaliação Técnica
                            </h3>
                            <div className="flex justify-around">
                              <ScoreRing score={selectedStudent.stats.techniqueScore} label="Técnica" size={72} />
                              <ScoreRing score={selectedStudent.stats.disciplineScore} label="Disciplina" size={72} />
                              <ScoreRing score={selectedStudent.stats.consistencyScore} label="Consistência" size={72} />
                            </div>
                            <div className="mt-4 p-3 rounded-lg bg-secondary/30 text-center">
                              <p className="text-[10px] text-muted-foreground mb-0.5">Nota Geral</p>
                              <p className="text-2xl font-bold text-gradient-gold">
                                {((selectedStudent.stats.techniqueScore + selectedStudent.stats.disciplineScore + selectedStudent.stats.consistencyScore) / 3).toFixed(1)}
                              </p>
                            </div>
                          </div>

                          {/* Competitions */}
                          <div className="rounded-xl border border-border bg-card p-5">
                            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                              <Award className="w-4 h-4 text-primary" /> Competições
                            </h3>
                            <div className="text-center mb-4">
                              <p className="text-3xl font-bold text-foreground">{selectedStudent.stats.competitions}</p>
                              <p className="text-xs text-muted-foreground">campeonatos</p>
                            </div>
                            <div className="flex justify-center gap-6">
                              {[
                                { label: "Ouro", count: selectedStudent.stats.medals.gold, emoji: "🥇" },
                                { label: "Prata", count: selectedStudent.stats.medals.silver, emoji: "🥈" },
                                { label: "Bronze", count: selectedStudent.stats.medals.bronze, emoji: "🥉" },
                              ].map((m) => (
                                <div key={m.label} className="text-center">
                                  <span className="text-2xl">{m.emoji}</span>
                                  <p className="text-lg font-bold text-foreground mt-1">{m.count}</p>
                                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Presence Tab */}
                      <TabsContent value="presence">
                        <div className="space-y-4">
                          {/* Monthly Chart */}
                          <div className="rounded-xl border border-border bg-card p-5">
                            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                              <Activity className="w-4 h-4 text-primary" /> Presença Mensal (últimos 12 meses)
                            </h3>
                            <div className="flex items-end gap-2 h-32">
                              {selectedStudent.monthlyPresence.map((val, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                  <span className="text-[10px] text-muted-foreground font-medium">{val}</span>
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(val / maxPresence) * 100}%` }}
                                    transition={{ delay: i * 0.05, duration: 0.5 }}
                                    className="w-full rounded-t-sm gradient-gold min-h-[4px]"
                                  />
                                  <span className="text-[9px] text-muted-foreground">{months[i]}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recent Classes */}
                          <div className="rounded-xl border border-border bg-card p-5">
                            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary" /> Últimas Aulas
                            </h3>
                            <div className="grid grid-cols-4 gap-2">
                              {selectedStudent.recentClasses.map((cls, i) => (
                                <div
                                  key={i}
                                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs ${
                                    cls.present
                                      ? "border-success/20 bg-success/5"
                                      : "border-destructive/20 bg-destructive/5"
                                  }`}
                                >
                                  {cls.present ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                                  ) : (
                                    <XCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
                                  )}
                                  <div>
                                    <p className="font-medium text-foreground">{cls.date}</p>
                                    <p className="text-[10px] text-muted-foreground">{cls.type}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Combat Tab */}
                      <TabsContent value="combat">
                        <div className="rounded-xl border border-border bg-card p-5">
                          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Swords className="w-4 h-4 text-primary" /> Desempenho em Sparring
                          </h3>
                          <div className="grid grid-cols-3 gap-4 mb-5">
                            {[
                              { label: "Vitórias", value: selectedStudent.stats.sparringWins, color: "text-success", icon: ArrowUpRight },
                              { label: "Derrotas", value: selectedStudent.stats.sparringLosses, color: "text-destructive", icon: ArrowDownRight },
                              { label: "Empates", value: selectedStudent.stats.sparringDraws, color: "text-muted-foreground", icon: Minus },
                            ].map((s) => (
                              <div key={s.label} className="text-center p-4 rounded-lg bg-secondary/30">
                                <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
                                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                              </div>
                            ))}
                          </div>
                          {/* Win Rate */}
                          <div className="p-4 rounded-lg bg-secondary/20">
                            <div className="flex justify-between items-center text-xs mb-2">
                              <span className="text-muted-foreground">Taxa de Vitória</span>
                              <span className="font-bold text-primary">
                                {(
                                  (selectedStudent.stats.sparringWins /
                                    (selectedStudent.stats.sparringWins + selectedStudent.stats.sparringLosses + selectedStudent.stats.sparringDraws)) *
                                  100
                                ).toFixed(0)}
                                %
                              </span>
                            </div>
                            <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                              <div
                                className="h-full bg-success rounded-l-full"
                                style={{
                                  width: `${(selectedStudent.stats.sparringWins / (selectedStudent.stats.sparringWins + selectedStudent.stats.sparringLosses + selectedStudent.stats.sparringDraws)) * 100}%`,
                                }}
                              />
                              <div
                                className="h-full bg-muted-foreground/30"
                                style={{
                                  width: `${(selectedStudent.stats.sparringDraws / (selectedStudent.stats.sparringWins + selectedStudent.stats.sparringLosses + selectedStudent.stats.sparringDraws)) * 100}%`,
                                }}
                              />
                              <div
                                className="h-full bg-destructive rounded-r-full"
                                style={{
                                  width: `${(selectedStudent.stats.sparringLosses / (selectedStudent.stats.sparringWins + selectedStudent.stats.sparringLosses + selectedStudent.stats.sparringDraws)) * 100}%`,
                                }}
                              />
                            </div>
                            <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success inline-block" /> Vitórias</span>
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground/30 inline-block" /> Empates</span>
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive inline-block" /> Derrotas</span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Notes Tab */}
                      <TabsContent value="notes">
                        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" /> Anotações do Professor
                          </h3>
                          {/* Add Note */}
                          <div className="flex gap-2">
                            <Input
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              placeholder="Adicionar anotação sobre o aluno..."
                              className="bg-secondary/50 border-border text-sm h-9"
                            />
                            <Button
                              size="sm"
                              className="gradient-gold text-primary-foreground shrink-0 h-9"
                              disabled={!newNote.trim()}
                              onClick={() => setNewNote("")}
                            >
                              Salvar
                            </Button>
                          </div>
                          <div className="space-y-3">
                            {selectedStudent.notes.map((note, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex gap-3 p-3 rounded-lg bg-secondary/20 border-l-2 border-primary/40"
                              >
                                <div className="shrink-0">
                                  <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
                                    {note.date}
                                  </Badge>
                                </div>
                                <p className="text-xs text-foreground/80 leading-relaxed">{note.text}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StudentView360;
