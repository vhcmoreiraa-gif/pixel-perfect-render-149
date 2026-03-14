import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, Crown, Medal, TrendingUp, ChevronUp, ChevronDown, Minus, Zap } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// --- Data ---

type Period = "diario" | "mensal" | "trimestral" | "anual" | "geral";

const rankingData = [
  { pos: 1, name: "Aluno Faixa Preta", initials: "AF", belt: "Preta", presences: 2, lastDate: "14/03/2026", meta: true, trend: 0 },
  { pos: 2, name: "Aluno Roxa A", initials: "AR", belt: "Roxa", presences: 2, lastDate: "14/03/2026", meta: true, trend: 1 },
  { pos: 3, name: "Aluno Azul Evolução", initials: "AA", belt: "Azul", presences: 1, lastDate: "14/03/2026", meta: false, trend: 2 },
  { pos: 4, name: "Aluno Azul Iniciante", initials: "AA", belt: "Azul", presences: 1, lastDate: "14/03/2026", meta: false, trend: -3 },
  { pos: 5, name: "Aluno Azul Senior 🏆", initials: "AA", belt: "Azul", presences: 1, lastDate: "14/03/2026", meta: true, trend: 0 },
  { pos: 6, name: "Aluno Branca 0 Grau", initials: "AB", belt: "Branca", presences: 1, lastDate: "14/03/2026", meta: false, trend: -1 },
  { pos: 7, name: "Aluno Branca 1 Grau A", initials: "AB", belt: "Branca", presences: 1, lastDate: "14/03/2026", meta: false, trend: 0 },
  { pos: 8, name: "Aluno Branca 2 Graus", initials: "AB", belt: "Branca", presences: 1, lastDate: "14/03/2026", meta: false, trend: 3 },
  { pos: 9, name: "Aluno Marrom B", initials: "AM", belt: "Marrom", presences: 1, lastDate: "14/03/2026", meta: false, trend: -2 },
  { pos: 10, name: "Aluno Roxa B", initials: "AR", belt: "Roxa", presences: 1, lastDate: "14/03/2026", meta: false, trend: 1 },
];

const beltColorMap: Record<string, string> = {
  Preta: "bg-foreground text-background",
  Marrom: "bg-amber-800 text-white",
  Roxa: "bg-purple-600 text-white",
  Azul: "bg-blue-500 text-white",
  Branca: "bg-white text-background",
};

const myPosition = { pos: 12, total: 24, name: "Aluno Faixa Azul" };

// --- Sub-components ---

const PageHeader = () => (
  <motion.div variants={fadeUp}>
    <h1 className="text-3xl font-display font-bold text-foreground tracking-wider">
      Ranking da Modalidade
    </h1>
    <p className="text-muted-foreground mt-1">
      Hierarquia técnica e assiduidade da turma para acompanhar evolução no tatame.
    </p>
  </motion.div>
);

const MyPositionCard = () => (
  <motion.div
    variants={fadeUp}
    className="rounded-2xl gradient-card border border-border p-5 shadow-card relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    <div className="flex items-center gap-3 relative">
      <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
        <Crown className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <h3 className="font-display text-base font-bold text-foreground tracking-wide">
          Minha posição
        </h3>
        <p className="text-sm text-muted-foreground">
          Você é o <span className="text-primary font-semibold">{myPosition.pos}º</span> aluno com mais presenças de hoje no Jiu-Jítsu.
        </p>
      </div>
    </div>
  </motion.div>
);

const TopThreePodium = () => {
  const top3 = rankingData.slice(0, 3);
  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd
  const heights = ["h-28", "h-36", "h-24"];
  const sizes = ["w-14 h-14", "w-18 h-18", "w-14 h-14"];
  const medalColors = ["text-gray-400", "text-primary", "text-amber-700"];
  const medalIcons = [Medal, Trophy, Medal];

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl gradient-card border border-border p-6 shadow-card"
    >
      <div className="flex items-end justify-center gap-4 pt-4 pb-2">
        {podiumOrder.map((student, i) => {
          const MedalIcon = medalIcons[i];
          const isFirst = i === 1;
          return (
            <motion.div
              key={student.pos}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 300 }}
            >
              <div className="relative mb-2">
                {isFirst && (
                  <motion.div
                    className="absolute -top-5 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Crown className="w-6 h-6 text-primary drop-shadow-lg" />
                  </motion.div>
                )}
                <div
                  className={`${isFirst ? "w-[72px] h-[72px]" : "w-14 h-14"} rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg ${
                    isFirst
                      ? "gradient-gold text-primary-foreground shadow-gold ring-2 ring-primary/30"
                      : "bg-secondary border border-border text-foreground"
                  }`}
                >
                  {student.initials}
                </div>
              </div>
              <p className={`text-xs font-semibold text-center leading-tight max-w-[80px] ${isFirst ? "text-foreground" : "text-muted-foreground"}`}>
                {student.name}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <MedalIcon className={`w-3.5 h-3.5 ${medalColors[i]}`} />
                <span className={`text-xs font-bold ${medalColors[i]}`}>
                  {student.pos}º
                </span>
              </div>
              <div
                className={`mt-3 w-20 rounded-t-xl ${heights[i]} ${
                  isFirst
                    ? "gradient-gold shadow-gold"
                    : i === 0
                    ? "bg-secondary/80 border border-border"
                    : "bg-secondary/60 border border-border"
                } flex items-center justify-center`}
              >
                <span className={`text-2xl font-display font-bold ${isFirst ? "text-primary-foreground" : "text-muted-foreground"}`}>
                  {student.pos}º
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const TrendBadge = ({ trend }: { trend: number }) => {
  if (trend === 0) return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
  if (trend > 0)
    return (
      <span className="flex items-center gap-0.5 text-success text-xs font-semibold">
        <ChevronUp className="w-3.5 h-3.5" />+{trend}
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 text-destructive text-xs font-semibold">
      <ChevronDown className="w-3.5 h-3.5" />{trend}
    </span>
  );
};

const RankingRow = ({ student, index }: { student: typeof rankingData[0]; index: number }) => {
  const isTop3 = student.pos <= 3;
  return (
    <motion.div
      variants={fadeUp}
      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all hover:border-primary/20 ${
        isTop3
          ? "bg-primary/5 border-primary/10"
          : "bg-secondary/30 border-border"
      }`}
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Position */}
      <span
        className={`w-8 text-center font-display text-lg font-bold ${
          student.pos === 1
            ? "text-primary"
            : student.pos === 2
            ? "text-gray-400"
            : student.pos === 3
            ? "text-amber-700"
            : "text-muted-foreground"
        }`}
      >
        {student.pos}º
      </span>

      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
          student.pos === 1
            ? "gradient-gold text-primary-foreground shadow-gold"
            : "bg-secondary border border-border text-foreground"
        }`}
      >
        {student.initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground truncate">{student.name}</p>
          <TrendBadge trend={student.trend} />
        </div>
        <p className="text-xs text-muted-foreground">
          {student.presences} presença(s) · Última em {student.lastDate}
        </p>
      </div>

      {/* Belt badge */}
      <span
        className={`hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
          beltColorMap[student.belt] ?? "bg-secondary text-foreground"
        }`}
      >
        {student.belt}
      </span>

      {/* Meta badge */}
      {student.meta && (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
          <Flame className="w-3 h-3" />
          Meta 3x
        </span>
      )}
    </motion.div>
  );
};

const HighlightBanner = () => (
  <motion.div variants={fadeUp} className="flex items-center gap-2 text-sm">
    <TrendingUp className="w-4 h-4 text-success" />
    <span className="text-muted-foreground">
      Maior evolução na semana:{" "}
      <span className="text-foreground font-semibold">Aluno Azul Iniciante</span>
      <span className="text-success font-semibold"> (+11 posições)</span>
    </span>
  </motion.div>
);

// --- Main Component ---

const Ranking = () => {
  const [mainTab, setMainTab] = useState("assiduidade");
  const [period, setPeriod] = useState<Period>("diario");

  const periods: { value: Period; label: string }[] = [
    { value: "diario", label: "Diário" },
    { value: "mensal", label: "Mensal" },
    { value: "trimestral", label: "Trimestral" },
    { value: "anual", label: "Anual" },
    { value: "geral", label: "Geral" },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      <PageHeader />

      {/* Main tabs: Hierarquia / Assiduidade */}
      <motion.div variants={fadeUp}>
        <Tabs value={mainTab} onValueChange={setMainTab}>
          <TabsList className="bg-secondary/50 border border-border p-1 rounded-xl w-full max-w-md">
            <TabsTrigger
              value="hierarquia"
              className="flex-1 rounded-lg font-display text-sm tracking-wide data-[state=active]:gradient-gold data-[state=active]:text-primary-foreground data-[state=active]:shadow-gold"
            >
              Hierarquia
            </TabsTrigger>
            <TabsTrigger
              value="assiduidade"
              className="flex-1 rounded-lg font-display text-sm tracking-wide data-[state=active]:gradient-gold data-[state=active]:text-primary-foreground data-[state=active]:shadow-gold"
            >
              Assiduidade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hierarquia" className="mt-6 space-y-5">
            <motion.div
              variants={fadeUp}
              className="rounded-2xl gradient-card border border-border p-8 shadow-card text-center"
            >
              <Trophy className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-display text-xl font-bold text-foreground">Hierarquia Técnica</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Classificação por graduação e tempo de treino. Em breve!
              </p>
            </motion.div>
          </TabsContent>

          <TabsContent value="assiduidade" className="mt-6 space-y-5">
            <MyPositionCard />

            {/* Leões do Tatame section */}
            <motion.div variants={fadeUp} className="rounded-2xl gradient-card border border-border p-5 shadow-card space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground tracking-wide">
                  Leões do Tatame
                </h3>
              </div>

              {/* Period filter */}
              <div className="flex flex-wrap gap-2">
                {periods.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPeriod(p.value)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      period === p.value
                        ? "gradient-gold text-primary-foreground shadow-gold"
                        : "bg-secondary/60 text-muted-foreground border border-border hover:text-foreground hover:border-primary/20"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <HighlightBanner />

              {/* Top 3 Podium */}
              <TopThreePodium />

              {/* Full ranking list */}
              <motion.div className="space-y-2" variants={stagger} initial="initial" animate="animate">
                {rankingData.map((student, i) => (
                  <RankingRow key={student.pos} student={student} index={i} />
                ))}
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default Ranking;
