import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  UserPlus,
  CalendarIcon,
  Send,
  Mail,
  MessageCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const adultBelts = [
  { value: "branca", label: "⚪ Branca", color: "bg-white border border-border" },
  { value: "azul", label: "🔵 Azul", color: "bg-blue-600" },
  { value: "roxa", label: "🟣 Roxa", color: "bg-purple-700" },
  { value: "marrom", label: "🟤 Marrom", color: "bg-amber-800" },
  { value: "preta", label: "⚫ Preta", color: "bg-black border border-border" },
];

const kidsBelts = [
  { value: "branca", label: "⚪ Branca", color: "bg-white border border-border" },
  { value: "cinza", label: "⚫ Cinza", color: "bg-gray-500" },
  { value: "amarela", label: "🟡 Amarela", color: "bg-yellow-400" },
  { value: "laranja", label: "🟠 Laranja", color: "bg-orange-500" },
  { value: "verde", label: "🟢 Verde", color: "bg-green-600" },
];

const graus = ["0", "1", "2", "3", "4"];

interface RegisteredStudent {
  nome: string;
  email: string;
  whatsapp: string;
  canal: "email" | "whatsapp";
}

const StudentRegistration = () => {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date>();
  const [faixa, setFaixa] = useState("");
  const [grau, setGrau] = useState("0");
  const [modalidades, setModalidades] = useState<string[]>([]);
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [canalEnvio, setCanalEnvio] = useState<"email" | "whatsapp">("email");
  const [recentRegistrations, setRecentRegistrations] = useState<RegisteredStudent[]>([]);

  const isKid = dataNascimento
    ? new Date().getFullYear() - dataNascimento.getFullYear() < 16
    : false;

  const belts = isKid ? kidsBelts : adultBelts;

  const toggleModalidade = (mod: string) => {
    setModalidades((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const isFormValid =
    nome.trim() &&
    dataNascimento &&
    faixa &&
    modalidades.length > 0 &&
    (canalEnvio === "email" ? email.trim() : whatsapp.trim());

  const handleSubmit = () => {
    if (!isFormValid) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    const newStudent: RegisteredStudent = {
      nome,
      email,
      whatsapp,
      canal: canalEnvio,
    };

    setRecentRegistrations((prev) => [newStudent, ...prev.slice(0, 4)]);

    const contato = canalEnvio === "email" ? email : whatsapp;
    toast.success(
      `Cadastro criado! Link de convite enviado via ${canalEnvio === "email" ? "e-mail" : "WhatsApp"} para ${contato}`
    );

    // Reset form
    setNome("");
    setDataNascimento(undefined);
    setFaixa("");
    setGrau("0");
    setModalidades([]);
    setWhatsapp("");
    setEmail("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-primary-foreground" />
          </div>
          Cadastro de Alunos
        </h1>
        <p className="text-muted-foreground mt-1">
          Cadastre novos alunos e envie o convite para finalizar o registro na plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-lg">
                Novo Aluno
              </CardTitle>
              <CardDescription>
                Preencha os dados do aluno. Após o cadastro, ele receberá um link para completar o registro.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome Completo */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-foreground">
                  Nome Completo *
                </Label>
                <Input
                  id="nome"
                  placeholder="Ex: João Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="bg-muted border-border"
                />
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-2">
                <Label className="text-foreground">Data de Nascimento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-muted border-border",
                        !dataNascimento && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataNascimento
                        ? format(dataNascimento, "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })
                        : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataNascimento}
                      onSelect={setDataNascimento}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      captionLayout="dropdown-buttons"
                      fromYear={1950}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
                {isKid && dataNascimento && (
                  <p className="text-xs text-primary font-medium">
                    👦 Sistema infantil (menor de 16 anos)
                  </p>
                )}
              </div>

              {/* Faixa e Grau */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Faixa Atual *</Label>
                  <Select value={faixa} onValueChange={setFaixa}>
                    <SelectTrigger className="bg-muted border-border">
                      <SelectValue placeholder="Selecione a faixa" />
                    </SelectTrigger>
                    <SelectContent>
                      {belts.map((belt) => (
                        <SelectItem key={belt.value} value={belt.value}>
                          {belt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Grau</Label>
                  <Select value={grau} onValueChange={setGrau}>
                    <SelectTrigger className="bg-muted border-border">
                      <SelectValue placeholder="Grau" />
                    </SelectTrigger>
                    <SelectContent>
                      {graus.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g === "0" ? "Sem grau" : `${g}º grau`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Modalidades */}
              <div className="space-y-3">
                <Label className="text-foreground">Modalidades *</Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: "jiujitsu", label: "🥋 Jiu-Jítsu" },
                    { id: "muaythai", label: "🥊 Muay Thai" },
                  ].map((mod) => (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => toggleModalidade(mod.id)}
                      className={cn(
                        "px-4 py-2.5 rounded-lg text-sm font-medium transition-all border",
                        modalidades.includes(mod.id)
                          ? "bg-primary/15 border-primary text-primary"
                          : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                      )}
                    >
                      {modalidades.includes(mod.id) && (
                        <Check className="w-3.5 h-3.5 inline mr-1.5" />
                      )}
                      {mod.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contato */}
              <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border">
                <Label className="text-foreground font-semibold">
                  Contato e Canal de Envio *
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-muted-foreground text-xs">
                      E-mail
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="aluno@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-background border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-muted-foreground text-xs">
                      WhatsApp
                    </Label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="whatsapp"
                        placeholder="(11) 99999-9999"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="pl-10 bg-background border-border"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">
                    Enviar convite por:
                  </Label>
                  <RadioGroup
                    value={canalEnvio}
                    onValueChange={(v) => setCanalEnvio(v as "email" | "whatsapp")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="canal-email" />
                      <Label htmlFor="canal-email" className="text-foreground cursor-pointer">
                        E-mail
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="whatsapp" id="canal-whatsapp" />
                      <Label htmlFor="canal-whatsapp" className="text-foreground cursor-pointer">
                        WhatsApp
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="w-full gradient-gold text-primary-foreground font-semibold h-12 text-base"
              >
                <Send className="w-4 h-4 mr-2" />
                Cadastrar e Enviar Convite
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Registrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-lg">
                Cadastros Recentes
              </CardTitle>
              <CardDescription>
                Últimos alunos cadastrados nesta sessão
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentRegistrations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Nenhum cadastro ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentRegistrations.map((student, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                        {student.nome
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {student.nome}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          {student.canal === "email" ? (
                            <Mail className="w-3 h-3" />
                          ) : (
                            <MessageCircle className="w-3 h-3" />
                          )}
                          Convite enviado
                        </p>
                      </div>
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentRegistration;
