import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Flame,
  Trophy,
  Zap,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type AttendanceStatus = "confirmed" | "pending" | "available" | "unavailable";

interface DayData {
  day: number;
  status: AttendanceStatus;
  className?: string;
  time?: string;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

// Class days: Mon, Wed, Fri
const CLASS_DAYS = [1, 3, 5];

const statusConfig: Record<AttendanceStatus, { color: string; label: string; dotClass: string }> = {
  confirmed: { color: "text-success", label: "Confirmado", dotClass: "bg-success" },
  pending: { color: "text-primary", label: "Pendente", dotClass: "bg-primary" },
  available: { color: "text-blue-400", label: "Disponível", dotClass: "bg-blue-400" },
  unavailable: { color: "text-muted-foreground", label: "Sem aula", dotClass: "bg-muted-foreground/40" },
};

function generateMonthData(year: number, month: number): DayData[] {
  const today = new Date();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: DayData[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dow = date.getDay();
    const isClassDay = CLASS_DAYS.includes(dow);
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday = date.toDateString() === today.toDateString();

    let status: AttendanceStatus = "unavailable";
    if (isClassDay) {
      if (isPast) {
        status = Math.random() > 0.25 ? "confirmed" : "pending";
      } else if (isToday) {
        status = "pending";
      } else {
        status = "available";
      }
    }

    days.push({
      day: d,
      status,
      className: isClassDay ? "Jiu-Jítsu Fundamentals" : undefined,
      time: isClassDay ? "19:00" : undefined,
    });
  }
  return days;
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const CheckIns = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const monthData = useMemo(() => generateMonthData(currentYear, currentMonth), [currentYear, currentMonth]);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const selectedDayData = selectedDay ? monthData.find((d) => d.day === selectedDay) : null;
  const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const confirmedCount = monthData.filter((d) => d.status === "confirmed").length;
  const totalClassDays = monthData.filter((d) => d.status !== "unavailable").length;
  const streak = 5; // Mock

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  // Find next class
  const nextClass = useMemo(() => {
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      if (CLASS_DAYS.includes(d.getDay())) {
        return d;
      }
    }
    return null;
  }, []);

  const nextClassIsToday = nextClass?.toDateString() === today.toDateString();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-wide text-foreground">
          Check-ins
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Confirme sua presença nas aulas e acompanhe sua frequência.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-success/15 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{confirmedCount}</p>
            <p className="text-xs text-muted-foreground">Presenças este mês</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
            <Flame className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{streak} dias</p>
            <p className="text-xs text-muted-foreground">Sequência atual</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {totalClassDays > 0 ? Math.round((confirmedCount / totalClassDays) * 100) : 0}%
            </p>
            <p className="text-xs text-muted-foreground">Taxa de frequência</p>
          </div>
        </motion.div>
      </div>

      {/* Next Class Banner */}
      {nextClass && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
              <Clock className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wider">Próxima Aula</p>
              <p className="text-lg font-bold text-foreground">
                {nextClass.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 19:00
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Tatame Principal
                </span>
              </div>
            </div>
          </div>
          {nextClassIsToday && (
            <Button className="gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 gap-2">
              <Zap className="w-4 h-4" />
              Confirmar Presença
            </Button>
          )}
          {!nextClassIsToday && (
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              Em breve
            </span>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden"
        >
          {/* Calendar Header */}
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-bold text-foreground tracking-wide">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {!isCurrentMonth && (
                <button
                  onClick={() => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  Hoje
                </button>
              )}
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="px-5 pt-4 flex flex-wrap gap-4">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`w-2.5 h-2.5 rounded-full ${cfg.dotClass}`} />
                {cfg.label}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="p-5">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty cells for first day offset */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {monthData.map((dayData) => {
                const isToday = isCurrentMonth && dayData.day === today.getDate();
                const isSelected = dayData.day === selectedDay;
                const hasClass = dayData.status !== "unavailable";
                const cfg = statusConfig[dayData.status];

                return (
                  <motion.button
                    key={dayData.day}
                    onClick={() => setSelectedDay(dayData.day)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all text-sm
                      ${isSelected
                        ? "ring-2 ring-primary bg-primary/10"
                        : hasClass
                          ? "bg-muted/50 hover:bg-muted"
                          : "bg-transparent hover:bg-muted/30"
                      }
                      ${isToday ? "ring-2 ring-primary/50" : ""}
                    `}
                  >
                    <span className={`font-medium ${isToday ? "text-primary font-bold" : hasClass ? "text-foreground" : "text-muted-foreground/50"}`}>
                      {dayData.day}
                    </span>
                    {hasClass && (
                      <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                    )}
                    {dayData.status === "confirmed" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-success flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-3 h-3 text-success-foreground" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Sidebar - Day Detail */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {/* Selected Day Detail */}
          <AnimatePresence mode="wait">
            {selectedDayData && (
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {selectedDay} de {MONTH_NAMES[currentMonth]}
                  </h3>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    selectedDayData.status === "confirmed"
                      ? "bg-success/15 text-success"
                      : selectedDayData.status === "pending"
                        ? "bg-primary/15 text-primary"
                        : selectedDayData.status === "available"
                          ? "bg-blue-400/15 text-blue-400"
                          : "bg-muted text-muted-foreground"
                  }`}>
                    {statusConfig[selectedDayData.status].label}
                  </span>
                </div>

                {selectedDayData.status !== "unavailable" ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                      <p className="font-semibold text-foreground text-sm">{selectedDayData.className}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {selectedDayData.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" /> Tatame Principal
                        </span>
                      </div>
                    </div>

                    {selectedDayData.status === "available" && (
                      <Button className="w-full gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 gap-2">
                        <Zap className="w-4 h-4" />
                        Confirmar Presença
                      </Button>
                    )}
                    {selectedDayData.status === "pending" && (
                      <Button className="w-full gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 gap-2 animate-pulse-gold">
                        <Zap className="w-4 h-4" />
                        Confirmar Agora
                      </Button>
                    )}
                    {selectedDayData.status === "confirmed" && (
                      <div className="flex items-center gap-2 text-success text-sm font-medium justify-center py-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Presença confirmada!
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    Sem aula neste dia
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tips Card */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Como funciona</h3>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Confirme presença até 24h antes da aula
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Aulas: Segunda, Quarta e Sexta às 19:00
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Clique em um dia para ver detalhes
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Mantenha sua sequência para ganhar XP bônus
              </li>
            </ul>
          </div>

          {/* Monthly Summary */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-sm font-bold text-foreground mb-3">Resumo do Mês</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Presenças</span>
                <span className="text-sm font-bold text-foreground">{confirmedCount}/{totalClassDays}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${totalClassDays > 0 ? (confirmedCount / totalClassDays) * 100 : 0}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full gradient-gold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold text-success">{confirmedCount}</p>
                  <p className="text-[10px] text-muted-foreground">Confirmadas</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold text-primary">
                    {monthData.filter((d) => d.status === "pending").length}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckIns;
