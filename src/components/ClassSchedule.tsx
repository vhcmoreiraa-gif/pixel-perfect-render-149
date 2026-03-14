import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  BookOpen,
  Clock,
  Trash2,
  Edit2,
  ChevronRight,
  GraduationCap,
  Users,
  X,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface ClassLesson {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
  targetBelts: string[];
  instructor: string;
  time: string;
}

const categories = [
  { value: "guarda", label: "Guarda", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "passagem", label: "Passagem de Guarda", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { value: "raspagem", label: "Raspagem", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { value: "finalizacao", label: "Finalização", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { value: "defesa", label: "Defesa Pessoal", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { value: "takedown", label: "Takedown", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { value: "especial", label: "Aula Especial", color: "bg-primary/20 text-primary border-primary/30" },
];

const beltOptions = [
  { value: "branca", label: "Branca", dot: "bg-white" },
  { value: "azul", label: "Azul", dot: "bg-blue-500" },
  { value: "roxa", label: "Roxa", dot: "bg-purple-500" },
  { value: "marrom", label: "Marrom", dot: "bg-amber-800" },
  { value: "preta", label: "Preta", dot: "bg-gray-900 border border-white/30" },
  { value: "todas", label: "Todas as faixas", dot: "gradient-gold" },
];

const initialLessons: ClassLesson[] = [
  {
    id: "1",
    date: "2026-03-16",
    title: "Guarda Fechada — Controle e Quebra de Postura",
    description: "Fundamentos da guarda fechada: como manter o controle, quebrar a postura do oponente e preparar ataques. Drill de retenção e transições.",
    category: "guarda",
    targetBelts: ["branca", "azul"],
    instructor: "Prof. Ricardo",
    time: "19:00",
  },
  {
    id: "2",
    date: "2026-03-18",
    title: "Passagem de Guarda — Toreando e Pressão",
    description: "Técnicas de passagem com pressão: toreando clássico, variação com controle de quadril. Combinações e timing de entrada.",
    category: "passagem",
    targetBelts: ["todas"],
    instructor: "Prof. Ricardo",
    time: "19:00",
  },
  {
    id: "3",
    date: "2026-03-19",
    title: "Raspagem de Gancho (Butterfly Sweep)",
    description: "Mecânica da raspagem de gancho, controle de underhook, variações quando o oponente resiste. Combinação com X-guard.",
    category: "raspagem",
    targetBelts: ["azul", "roxa"],
    instructor: "Prof. Ricardo",
    time: "19:00",
  },
  {
    id: "4",
    date: "2026-03-20",
    title: "Triângulo do Fechamento ao Finish",
    description: "Setup de triângulo da guarda fechada e aberta. Ajustes de ângulo, controle do braço e finalizações encadeadas (armbar, omoplata).",
    category: "finalizacao",
    targetBelts: ["branca", "azul", "roxa"],
    instructor: "Prof. Ricardo",
    time: "19:00",
  },
  {
    id: "5",
    date: "2026-03-23",
    title: "Defesa Pessoal — Agarramentos e Clinch",
    description: "Situações de rua: defesa contra agarramentos frontais, laterais e por trás. Trabalho de clinch e derrubar com segurança.",
    category: "defesa",
    targetBelts: ["todas"],
    instructor: "Prof. Ricardo",
    time: "19:00",
  },
  {
    id: "6",
    date: "2026-03-25",
    title: "Single Leg e Double Leg — Entradas e Acabamentos",
    description: "Quedas fundamentais: single leg com variações de acabamento, double leg com setup de jab. Defesas e re-tomadas.",
    category: "takedown",
    targetBelts: ["azul", "roxa", "marrom"],
    instructor: "Prof. Ricardo",
    time: "20:00",
  },
];

const getCategoryStyle = (cat: string) =>
  categories.find((c) => c.value === cat)?.color ?? "bg-muted text-muted-foreground border-border";

const getCategoryLabel = (cat: string) =>
  categories.find((c) => c.value === cat)?.label ?? cat;

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T12:00:00");
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return {
    dayOfWeek: days[d.getDay()],
    day: d.getDate(),
    month: months[d.getMonth()],
    full: `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`,
  };
};

const isUpcoming = (dateStr: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr + "T12:00:00") >= today;
};

const emptyLesson: Omit<ClassLesson, "id"> = {
  date: "",
  title: "",
  description: "",
  category: "",
  targetBelts: [],
  instructor: "Prof. Ricardo",
  time: "19:00",
};

const ClassSchedule = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [lessons, setLessons] = useState<ClassLesson[]>(initialLessons);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<ClassLesson | null>(null);
  const [form, setForm] = useState<Omit<ClassLesson, "id">>(emptyLesson);
  const [selectedLesson, setSelectedLesson] = useState<ClassLesson | null>(null);

  const upcomingLessons = lessons
    .filter((l) => isUpcoming(l.date))
    .sort((a, b) => a.date.localeCompare(b.date));

  const pastLessons = lessons
    .filter((l) => !isUpcoming(l.date))
    .sort((a, b) => b.date.localeCompare(a.date));

  const openCreate = () => {
    setEditingLesson(null);
    setForm(emptyLesson);
    setDialogOpen(true);
  };

  const openEdit = (lesson: ClassLesson) => {
    setEditingLesson(lesson);
    setForm({
      date: lesson.date,
      title: lesson.title,
      description: lesson.description,
      category: lesson.category,
      targetBelts: lesson.targetBelts,
      instructor: lesson.instructor,
      time: lesson.time,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title || !form.date || !form.category) {
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }

    if (editingLesson) {
      setLessons((prev) =>
        prev.map((l) => (l.id === editingLesson.id ? { ...l, ...form } : l))
      );
      toast({ title: "Aula atualizada com sucesso! ✅" });
    } else {
      const newLesson: ClassLesson = {
        ...form,
        id: Date.now().toString(),
      };
      setLessons((prev) => [...prev, newLesson]);
      toast({ title: "Aula cadastrada com sucesso! ✅" });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
    toast({ title: "Aula removida" });
  };

  const toggleBelt = (belt: string) => {
    if (belt === "todas") {
      setForm((f) =>
        f.targetBelts.includes("todas")
          ? { ...f, targetBelts: [] }
          : { ...f, targetBelts: ["todas"] }
      );
    } else {
      setForm((f) => {
        const filtered = f.targetBelts.filter((b) => b !== "todas");
        return {
          ...f,
          targetBelts: filtered.includes(belt)
            ? filtered.filter((b) => b !== belt)
            : [...filtered, belt],
        };
      });
    }
  };

  const renderBeltBadges = (belts: string[]) =>
    belts.map((b) => {
      const opt = beltOptions.find((o) => o.value === b);
      if (!opt) return null;
      return (
        <span key={b} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
          {opt.label}
        </span>
      );
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground tracking-wide flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            Grade de Aulas
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {isAdmin ? "Gerencie os temas das próximas aulas" : "Confira o que você vai aprender nas próximas aulas"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              isAdmin
                ? "gradient-gold text-primary-foreground shadow-gold"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {isAdmin ? "👨‍🏫 Visão Professor" : "🥋 Visão Aluno"}
          </button>
          {isAdmin && (
            <Button onClick={openCreate} className="gradient-gold text-primary-foreground shadow-gold gap-2">
              <Plus className="w-4 h-4" />
              Nova Aula
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{upcomingLessons.length}</p>
              <p className="text-xs text-muted-foreground">Aulas programadas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {new Set(upcomingLessons.map((l) => l.category)).size}
              </p>
              <p className="text-xs text-muted-foreground">Categorias cobertas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {upcomingLessons.filter((l) => l.targetBelts.includes("todas")).length}
              </p>
              <p className="text-xs text-muted-foreground">Aulas para todas as faixas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Timeline */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <ChevronRight className="w-5 h-5 text-primary" />
          Próximas Aulas
        </h3>

        {upcomingLessons.length === 0 ? (
          <Card className="bg-card border-border border-dashed">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhuma aula programada ainda</p>
              {isAdmin && (
                <Button onClick={openCreate} variant="outline" className="mt-4 gap-2">
                  <Plus className="w-4 h-4" /> Cadastrar primeira aula
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {upcomingLessons.map((lesson, i) => {
                const date = formatDate(lesson.date);
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card
                      className="bg-card border-border hover:border-primary/30 transition-all cursor-pointer group"
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      <CardContent className="p-0">
                        <div className="flex items-stretch">
                          {/* Date column */}
                          <div className="w-24 flex-shrink-0 flex flex-col items-center justify-center p-4 border-r border-border bg-muted/30 rounded-l-lg">
                            <span className="text-xs text-muted-foreground font-medium uppercase">
                              {date.dayOfWeek.slice(0, 3)}
                            </span>
                            <span className="text-2xl font-bold text-foreground">{date.day}</span>
                            <span className="text-xs text-muted-foreground">{date.month}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] font-semibold border ${getCategoryStyle(lesson.category)}`}
                                  >
                                    {getCategoryLabel(lesson.category)}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {lesson.time}
                                  </span>
                                </div>
                                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {lesson.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                  {lesson.description}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  {renderBeltBadges(lesson.targetBelts)}
                                </div>
                              </div>

                              {isAdmin && (
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEdit(lesson);
                                    }}
                                    className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(lesson.id);
                                    }}
                                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lesson Detail Dialog */}
      <Dialog open={!!selectedLesson} onOpenChange={() => setSelectedLesson(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          {selectedLesson && (() => {
            const date = formatDate(selectedLesson.date);
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold border ${getCategoryStyle(selectedLesson.category)}`}
                    >
                      {getCategoryLabel(selectedLesson.category)}
                    </Badge>
                  </div>
                  <DialogTitle className="text-foreground text-lg">
                    {selectedLesson.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {date.dayOfWeek}, {date.full}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {selectedLesson.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <GraduationCap className="w-4 h-4" />
                    {selectedLesson.instructor}
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      O que você vai aprender
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed">
                      {selectedLesson.description}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Faixas indicadas
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {renderBeltBadges(selectedLesson.targetBelts)}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingLesson ? "Editar Aula" : "Nova Aula"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Data *</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Horário</label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  className="bg-muted border-border"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Título da Aula *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ex: Guarda Fechada — Controle e Quebra de Postura"
                className="bg-muted border-border"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Categoria *</label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger className="bg-muted border-border">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Descrição</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Descreva o conteúdo da aula..."
                className="bg-muted border-border resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Instrutor</label>
              <Input
                value={form.instructor}
                onChange={(e) => setForm((f) => ({ ...f, instructor: e.target.value }))}
                placeholder="Nome do professor"
                className="bg-muted border-border"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Faixas indicadas</label>
              <div className="flex flex-wrap gap-2">
                {beltOptions.map((belt) => {
                  const selected = form.targetBelts.includes(belt.value);
                  return (
                    <button
                      key={belt.value}
                      onClick={() => toggleBelt(belt.value)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selected
                          ? "bg-primary/15 border-primary/40 text-primary"
                          : "bg-muted border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${belt.dot}`} />
                      {belt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="gradient-gold text-primary-foreground gap-2">
              <Save className="w-4 h-4" />
              {editingLesson ? "Salvar Alterações" : "Cadastrar Aula"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassSchedule;
