import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Plus,
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
  Check,
  Swords,
  Shield,
  Eye,
  UserPlus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface Championship {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  categories: string[];
  maxParticipants: number;
  enrollmentDeadline: string;
  status: "aberto" | "encerrado" | "em_andamento";
  enrolledStudents: EnrolledStudent[];
  createdAt: string;
}

interface EnrolledStudent {
  id: string;
  name: string;
  belt: string;
  category: string;
  weight: string;
  enrolledAt: string;
}

const beltColors: Record<string, string> = {
  Branca: "bg-white border border-border",
  Azul: "bg-blue-600",
  Roxa: "bg-purple-700",
  Marrom: "bg-amber-800",
  Preta: "bg-black border border-muted-foreground",
};

const statusConfig: Record<string, { label: string; class: string }> = {
  aberto: { label: "Inscrições Abertas", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  encerrado: { label: "Encerrado", class: "bg-red-500/20 text-red-400 border-red-500/30" },
  em_andamento: { label: "Em Andamento", class: "bg-primary/20 text-primary border-primary/30" },
};

const categoryOptions = [
  "Galo", "Pluma", "Pena", "Leve", "Médio", "Meio-Pesado", "Pesado", "Super-Pesado", "Pesadíssimo", "Absoluto",
];

const mockChampionships: Championship[] = [
  {
    id: "1",
    name: "Copa Black Ace Invitational",
    date: "2026-04-15",
    location: "Ginásio Municipal - São Paulo, SP",
    description: "Campeonato interno da academia com premiação para os 3 primeiros de cada categoria. Evento aberto para todas as faixas.",
    categories: ["Galo", "Pluma", "Pena", "Leve", "Médio", "Meio-Pesado", "Pesado", "Absoluto"],
    maxParticipants: 64,
    enrollmentDeadline: "2026-04-10",
    status: "aberto",
    enrolledStudents: [
      { id: "s1", name: "Carlos Silva", belt: "Azul", category: "Leve", weight: "76kg", enrolledAt: "2026-03-10" },
      { id: "s2", name: "Ana Rodrigues", belt: "Roxa", category: "Pluma", weight: "58kg", enrolledAt: "2026-03-11" },
      { id: "s3", name: "Pedro Santos", belt: "Branca", category: "Médio", weight: "82kg", enrolledAt: "2026-03-12" },
      { id: "s4", name: "Lucas Oliveira", belt: "Azul", category: "Pesado", weight: "94kg", enrolledAt: "2026-03-12" },
      { id: "s5", name: "Mariana Costa", belt: "Roxa", category: "Pena", weight: "64kg", enrolledAt: "2026-03-13" },
    ],
    createdAt: "2026-03-01",
  },
  {
    id: "2",
    name: "Circuito Regional de Jiu-Jítsu",
    date: "2026-05-20",
    location: "Arena Combat - Rio de Janeiro, RJ",
    description: "Etapa regional do circuito estadual. Pontuação válida para ranking FJJR.",
    categories: ["Galo", "Pluma", "Pena", "Leve", "Médio", "Pesado", "Absoluto"],
    maxParticipants: 128,
    enrollmentDeadline: "2026-05-15",
    status: "aberto",
    enrolledStudents: [
      { id: "s6", name: "Rafael Mendes", belt: "Marrom", category: "Pena", weight: "70kg", enrolledAt: "2026-03-08" },
      { id: "s7", name: "Thiago Alves", belt: "Preta", category: "Meio-Pesado", weight: "88kg", enrolledAt: "2026-03-09" },
    ],
    createdAt: "2026-03-05",
  },
  {
    id: "3",
    name: "Open Black Ace 2025",
    date: "2026-02-10",
    location: "Ginásio da Academia - São Paulo, SP",
    description: "Campeonato interno encerrado. Resultados disponíveis no ranking.",
    categories: ["Leve", "Médio", "Pesado", "Absoluto"],
    maxParticipants: 32,
    enrollmentDeadline: "2026-02-05",
    status: "encerrado",
    enrolledStudents: [
      { id: "s8", name: "Bruno Faria", belt: "Azul", category: "Médio", weight: "82kg", enrolledAt: "2026-01-20" },
      { id: "s9", name: "Julia Ramos", belt: "Roxa", category: "Leve", weight: "68kg", enrolledAt: "2026-01-22" },
      { id: "s10", name: "Diego Costa", belt: "Marrom", category: "Pesado", weight: "100kg", enrolledAt: "2026-01-25" },
    ],
    createdAt: "2026-01-10",
  },
];


const Championships = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [championships, setChampionships] = useState<Championship[]>(mockChampionships);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEnrollDialog, setShowEnrollDialog] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [viewEnrolled, setViewEnrolled] = useState<string | null>(null);

  // Create form state
  const [newChamp, setNewChamp] = useState({
    name: "", date: "", location: "", description: "",
    categories: [] as string[], maxParticipants: 64, enrollmentDeadline: "",
  });

  // Enroll form state
  const [enrollForm, setEnrollForm] = useState({ category: "", weight: "" });

  const filtered = filterStatus === "todos"
    ? championships
    : championships.filter(c => c.status === filterStatus);

  const handleCreate = () => {
    if (!newChamp.name || !newChamp.date || !newChamp.location) return;
    const champ: Championship = {
      id: Date.now().toString(),
      ...newChamp,
      status: "aberto",
      enrolledStudents: [],
      createdAt: new Date().toISOString().split("T")[0],
    };
    setChampionships(prev => [champ, ...prev]);
    setShowCreateDialog(false);
    setNewChamp({ name: "", date: "", location: "", description: "", categories: [], maxParticipants: 64, enrollmentDeadline: "" });
  };

  const handleEnroll = (champId: string) => {
    if (!enrollForm.category || !enrollForm.weight) return;
    setChampionships(prev => prev.map(c => {
      if (c.id !== champId) return c;
      const student: EnrolledStudent = {
        id: Date.now().toString(),
        name: "Aluno Faixa Azul",
        belt: "Azul",
        category: enrollForm.category,
        weight: enrollForm.weight,
        enrolledAt: new Date().toISOString().split("T")[0],
      };
      return { ...c, enrolledStudents: [...c.enrolledStudents, student] };
    }));
    setShowEnrollDialog(null);
    setEnrollForm({ category: "", weight: "" });
  };

  const handleDelete = (id: string) => {
    setChampionships(prev => prev.filter(c => c.id !== id));
  };

  const toggleCategory = (cat: string) => {
    setNewChamp(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const formatDate = (d: string) => {
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  };

  const daysUntil = (d: string) => {
    const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            Campeonatos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin ? "Gerencie campeonatos e inscrições" : "Veja os campeonatos e inscreva-se"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Role toggle (demo) */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdmin(!isAdmin)}
            className="text-xs border-border"
          >
            <Shield className="w-3.5 h-3.5 mr-1" />
            {isAdmin ? "Visão Admin" : "Visão Aluno"}
          </Button>
          {isAdmin && (
            <Button onClick={() => setShowCreateDialog(true)} className="gradient-gold text-primary-foreground font-semibold shadow-gold">
              <Plus className="w-4 h-4 mr-1" /> Novo Campeonato
            </Button>
          )}
        </div>
      </div>

      {/* Stats (Admin) */}
      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", value: championships.length, icon: Trophy, color: "text-primary" },
            { label: "Abertos", value: championships.filter(c => c.status === "aberto").length, icon: Calendar, color: "text-emerald-400" },
            { label: "Inscritos Total", value: championships.reduce((a, c) => a + c.enrolledStudents.length, 0), icon: Users, color: "text-blue-400" },
            { label: "Em Andamento", value: championships.filter(c => c.status === "em_andamento").length, icon: Swords, color: "text-orange-400" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl p-4 border border-border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
                <s.icon className={`w-5 h-5 ${s.color} opacity-50`} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {["todos", "aberto", "em_andamento", "encerrado"].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              filterStatus === s
                ? "gradient-gold text-primary-foreground shadow-gold"
                : "bg-card text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            {s === "todos" ? "Todos" : statusConfig[s]?.label || s}
          </button>
        ))}
      </div>

      {/* Championship Cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((champ, i) => {
            const isExpanded = expandedId === champ.id;
            const isAlreadyEnrolled = champ.enrolledStudents.some(s => s.name === "Aluno Faixa Azul");
            const spotsLeft = champ.maxParticipants - champ.enrolledStudents.length;
            const deadline = daysUntil(champ.enrollmentDeadline);

            return (
              <motion.div
                key={champ.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className="p-5 cursor-pointer hover:bg-card-elevated transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : champ.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Trophy className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-foreground">{champ.name}</h3>
                          <Badge variant="outline" className={statusConfig[champ.status].class}>
                            {statusConfig[champ.status].label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {formatDate(champ.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {champ.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {champ.enrolledStudents.length}/{champ.maxParticipants}
                          </span>
                          {champ.status === "aberto" && (
                            <span className="flex items-center gap-1 text-primary">
                              <Clock className="w-3.5 h-3.5" /> {deadline} dias restantes
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isAdmin && champ.status === "aberto" && (
                        isAlreadyEnrolled ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            <Check className="w-3 h-3 mr-1" /> Inscrito
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); setShowEnrollDialog(champ.id); }}
                            className="gradient-gold text-primary-foreground font-semibold shadow-gold"
                          >
                            <UserPlus className="w-3.5 h-3.5 mr-1" /> Inscrever-se
                          </Button>
                        )
                      )}
                      {isAdmin && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); setViewEnrolled(champ.id); }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); handleDelete(champ.id); }}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>

                  {/* Capacity bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Vagas preenchidas</span>
                      <span>{spotsLeft} vagas restantes</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full gradient-gold rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(champ.enrolledStudents.length / champ.maxParticipants) * 100}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
                        <p className="text-sm text-muted-foreground">{champ.description}</p>

                        <div>
                          <p className="text-xs font-medium text-foreground mb-2">Categorias</p>
                          <div className="flex flex-wrap gap-2">
                            {champ.categories.map(cat => (
                              <Badge key={cat} variant="outline" className="text-xs border-border text-muted-foreground">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Enrolled preview */}
                        <div>
                          <p className="text-xs font-medium text-foreground mb-2">
                            Inscritos ({champ.enrolledStudents.length})
                          </p>
                          <div className="flex -space-x-2">
                            {champ.enrolledStudents.slice(0, 8).map((s) => (
                              <div
                                key={s.id}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-card ${beltColors[s.belt] || "bg-muted"} ${
                                  s.belt === "Branca" || s.belt === "Preta" ? "text-muted-foreground" : "text-white"
                                }`}
                                title={`${s.name} - ${s.belt}`}
                              >
                                {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </div>
                            ))}
                            {champ.enrolledStudents.length > 8 && (
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground border-2 border-card">
                                +{champ.enrolledStudents.length - 8}
                              </div>
                            )}
                          </div>
                        </div>

                        {!isAdmin && champ.status === "aberto" && !isAlreadyEnrolled && (
                          <Button
                            onClick={() => setShowEnrollDialog(champ.id)}
                            className="w-full gradient-gold text-primary-foreground font-semibold shadow-gold"
                          >
                            <UserPlus className="w-4 h-4 mr-2" /> Inscrever-se neste Campeonato
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum campeonato encontrado</p>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" /> Novo Campeonato
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Preencha os dados para criar um novo campeonato
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground">Nome do Campeonato</label>
              <Input
                value={newChamp.name}
                onChange={e => setNewChamp(p => ({ ...p, name: e.target.value }))}
                placeholder="Ex: Copa Black Ace 2026"
                className="mt-1 bg-muted border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground">Data</label>
                <Input
                  type="date"
                  value={newChamp.date}
                  onChange={e => setNewChamp(p => ({ ...p, date: e.target.value }))}
                  className="mt-1 bg-muted border-border"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Prazo Inscrição</label>
                <Input
                  type="date"
                  value={newChamp.enrollmentDeadline}
                  onChange={e => setNewChamp(p => ({ ...p, enrollmentDeadline: e.target.value }))}
                  className="mt-1 bg-muted border-border"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Local</label>
              <Input
                value={newChamp.location}
                onChange={e => setNewChamp(p => ({ ...p, location: e.target.value }))}
                placeholder="Endereço do evento"
                className="mt-1 bg-muted border-border"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Descrição</label>
              <Textarea
                value={newChamp.description}
                onChange={e => setNewChamp(p => ({ ...p, description: e.target.value }))}
                placeholder="Detalhes sobre o campeonato..."
                className="mt-1 bg-muted border-border"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Máx. Participantes</label>
              <Input
                type="number"
                value={newChamp.maxParticipants}
                onChange={e => setNewChamp(p => ({ ...p, maxParticipants: Number(e.target.value) }))}
                className="mt-1 bg-muted border-border"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">Categorias</label>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      newChamp.categories.includes(cat)
                        ? "gradient-gold text-primary-foreground border-primary/30 shadow-gold"
                        : "bg-muted text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="border-border">
              Cancelar
            </Button>
            <Button onClick={handleCreate} className="gradient-gold text-primary-foreground font-semibold shadow-gold">
              Criar Campeonato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enroll Dialog */}
      <Dialog open={!!showEnrollDialog} onOpenChange={() => setShowEnrollDialog(null)}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" /> Inscrição
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Escolha sua categoria e peso para se inscrever
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground">Categoria de Peso</label>
              <Select value={enrollForm.category} onValueChange={v => setEnrollForm(p => ({ ...p, category: v }))}>
                <SelectTrigger className="mt-1 bg-muted border-border">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {showEnrollDialog && championships.find(c => c.id === showEnrollDialog)?.categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Peso (kg)</label>
              <Input
                value={enrollForm.weight}
                onChange={e => setEnrollForm(p => ({ ...p, weight: e.target.value }))}
                placeholder="Ex: 76kg"
                className="mt-1 bg-muted border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnrollDialog(null)} className="border-border">
              Cancelar
            </Button>
            <Button
              onClick={() => showEnrollDialog && handleEnroll(showEnrollDialog)}
              className="gradient-gold text-primary-foreground font-semibold shadow-gold"
            >
              Confirmar Inscrição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Enrolled Dialog (Admin) */}
      <Dialog open={!!viewEnrolled} onOpenChange={() => setViewEnrolled(null)}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Inscritos
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {viewEnrolled && championships.find(c => c.id === viewEnrolled)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {viewEnrolled && championships.find(c => c.id === viewEnrolled)?.enrolledStudents.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${beltColors[s.belt] || "bg-muted"} ${
                    s.belt === "Branca" || s.belt === "Preta" ? "text-muted-foreground" : "text-white"
                  }`}>
                    {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {s.belt} · {s.category} · {s.weight}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">{formatDate(s.enrolledAt)}</span>
              </motion.div>
            ))}
            {viewEnrolled && championships.find(c => c.id === viewEnrolled)?.enrolledStudents.length === 0 && (
              <p className="text-center py-8 text-sm text-muted-foreground">Nenhum inscrito ainda</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Championships;
