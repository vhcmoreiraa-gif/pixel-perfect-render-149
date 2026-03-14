import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Image as ImageIcon,
  MoreHorizontal,
  Flame,
  Swords,
  Medal,
  Shield,
  X,
  ChevronDown,
  Tag,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Belt colors
const beltColors: Record<string, string> = {
  branca: "bg-white text-black",
  azul: "bg-blue-600 text-white",
  roxa: "bg-purple-600 text-white",
  marrom: "bg-amber-800 text-white",
  preta: "bg-black text-white border border-muted",
};

// Reaction icons for BJJ
const reactionTypes = [
  { id: "oss", icon: "🥋", label: "Oss!" },
  { id: "fogo", icon: "🔥", label: "Fogo" },
  { id: "tatame", icon: "🤼", label: "Tatame" },
  { id: "medal", icon: "🏅", label: "Medalha" },
  { id: "clap", icon: "👏", label: "Palmas" },
  { id: "muscle", icon: "💪", label: "Força" },
];

// Mock data
const mockPosts = [
  {
    id: 1,
    author: "Professor Carlos",
    initials: "PC",
    belt: "preta",
    role: "Professor",
    category: "Treino",
    timeAgo: "2h atrás",
    content: "Treino técnico de raspagem + passagens. Hoje foi dia de volume alto no tatame. Quem estava presente sabe o nível que foi! 🔥🥋",
    images: [],
    reactions: { oss: 12, fogo: 8, tatame: 3, medal: 2, clap: 5, muscle: 4 },
    comments: [
      { id: 1, author: "João", initials: "JM", content: "Aula sensacional, professor! 🔥", timeAgo: "1h" },
      { id: 2, author: "Maria", initials: "MS", content: "Raspagem de DLR ficou top!", timeAgo: "45min" },
    ],
    isPinned: false,
  },
  {
    id: 2,
    author: "Aluno Faixa Azul",
    initials: "AF",
    belt: "azul",
    role: "Aluno",
    category: "Conquista",
    timeAgo: "5h atrás",
    content: "Depois de 2 anos de treino, finalmente recebi minha faixa azul! Gratidão a todos os parceiros de treino e ao Professor Carlos por cada ensinamento. Oss! 🥋💙",
    images: [],
    reactions: { oss: 45, fogo: 22, tatame: 8, medal: 15, clap: 30, muscle: 12 },
    comments: [
      { id: 1, author: "Professor Carlos", initials: "PC", content: "Merecido demais! Continue evoluindo!", timeAgo: "4h" },
      { id: 2, author: "Ana", initials: "AS", content: "Parabéns parceiro! 💪", timeAgo: "3h" },
      { id: 3, author: "Lucas", initials: "LR", content: "Oss!! Muito merecido!", timeAgo: "2h" },
    ],
    isPinned: false,
  },
  {
    id: 3,
    author: "Maria Santos",
    initials: "MS",
    belt: "roxa",
    role: "Aluna",
    category: "Sparring",
    timeAgo: "1d atrás",
    content: "Dia de sparring pesado! Trabalhei bastante meu jogo de guarda e consegui aplicar o estrangulamento que vinha treinando. Evolução constante! 💜",
    images: [],
    reactions: { oss: 18, fogo: 14, tatame: 10, medal: 5, clap: 8, muscle: 7 },
    comments: [
      { id: 1, author: "Paulo", initials: "PF", content: "Tá voando demais!", timeAgo: "20h" },
    ],
    isPinned: false,
  },
  {
    id: 4,
    author: "Lucas Ribeiro",
    initials: "LR",
    belt: "branca",
    role: "Aluno",
    category: "Musculação",
    timeAgo: "2d atrás",
    content: "Treino de costas + cardio. Fechei o dia no limite. Complementando o Jiu-Jítsu com musculação pra ter mais resistência no tatame. 🏋️‍♂️",
    images: [],
    reactions: { oss: 8, fogo: 11, muscle: 15, clap: 6, tatame: 2, medal: 1 },
    comments: [],
    isPinned: false,
  },
];

const categories = ["Todos", "Treino", "Sparring", "Conquista", "Musculação", "Dica", "Evento"];

interface Post {
  id: number;
  author: string;
  initials: string;
  belt: string;
  role: string;
  category: string;
  timeAgo: string;
  content: string;
  images: string[];
  reactions: Record<string, number>;
  comments: { id: number; author: string; initials: string; content: string; timeAgo: string }[];
  isPinned: boolean;
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState("");
  const [newTags, setNewTags] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [showReactions, setShowReactions] = useState<number | null>(null);
  const [userReactions, setUserReactions] = useState<Record<string, Set<string>>>({});

  const filteredPosts = selectedCategory === "Todos"
    ? posts
    : posts.filter((p) => p.category === selectedCategory);

  const handlePost = () => {
    if (!newPost.trim()) return;
    const newEntry: Post = {
      id: Date.now(),
      author: "Aluno Faixa Azul",
      initials: "AF",
      belt: "azul",
      role: "Aluno",
      category: newTags.split(",")[0]?.trim() || "Treino",
      timeAgo: "agora",
      content: newPost,
      images: [],
      reactions: {},
      comments: [],
      isPinned: false,
    };
    setPosts([newEntry, ...posts]);
    setNewPost("");
    setNewTags("");
  };

  const toggleReaction = (postId: number, reactionId: string) => {
    const key = `${postId}`;
    setUserReactions((prev) => {
      const set = new Set(prev[key] || []);
      if (set.has(reactionId)) set.delete(reactionId);
      else set.add(reactionId);
      return { ...prev, [key]: set };
    });
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const current = p.reactions[reactionId] || 0;
        const hasReacted = userReactions[key]?.has(reactionId);
        return {
          ...p,
          reactions: { ...p.reactions, [reactionId]: hasReacted ? current - 1 : current + 1 },
        };
      })
    );
    setShowReactions(null);
  };

  const addComment = (postId: number) => {
    const text = commentText[postId];
    if (!text?.trim()) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [
            ...p.comments,
            { id: Date.now(), author: "Aluno Faixa Azul", initials: "AF", content: text, timeAgo: "agora" },
          ],
        };
      })
    );
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
  };

  const totalReactions = (r: Record<string, number>) => Object.values(r).reduce((a, b) => a + b, 0);
  const topReactions = (r: Record<string, number>) =>
    Object.entries(r)
      .filter(([, v]) => v > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-wider">
          Comunidade <span className="text-gradient-gold">BLACK ACE</span> ♠️
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compartilhe treinos, conquistas e evolua junto com a equipe.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat
                ? "gradient-gold text-primary-foreground shadow-gold"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Create Post */}
      <motion.div
        className="rounded-xl border border-border bg-card p-5 space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
            AF
          </div>
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Como foi seu treino hoje? 🥋"
            className="min-h-[80px] bg-secondary/50 border-border resize-none text-sm"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1.5 text-xs">
              <ImageIcon className="w-4 h-4" /> Foto
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1.5 text-xs">
              <Tag className="w-4 h-4" /> Tags
            </Button>
          </div>
          <Button
            onClick={handlePost}
            disabled={!newPost.trim()}
            size="sm"
            className="gradient-gold text-primary-foreground font-semibold gap-1.5 shadow-gold hover:opacity-90"
          >
            <Send className="w-3.5 h-3.5" /> Publicar
          </Button>
        </div>
      </motion.div>

      {/* Posts Feed */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-5 pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-11 h-11 border-2 border-border">
                        <AvatarFallback className="bg-secondary text-foreground font-bold text-sm">
                          {post.initials}
                        </AvatarFallback>
                      </Avatar>
                      {/* Belt indicator dot */}
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card ${beltColors[post.belt]}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{post.author}</span>
                        {post.role === "Professor" && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/40 text-primary">
                            Professor
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-1.5 py-0.5 rounded bg-secondary/80 text-[10px] font-medium">
                          {post.category}
                        </span>
                        <span>•</span>
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Post Content */}
                <p className="mt-4 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* Reactions Bar */}
              <div className="px-5 py-3">
                {totalReactions(post.reactions) > 0 && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex -space-x-1">
                      {topReactions(post.reactions).map(([id]) => {
                        const r = reactionTypes.find((rt) => rt.id === id);
                        return (
                          <span
                            key={id}
                            className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] border border-card"
                          >
                            {r?.icon}
                          </span>
                        );
                      })}
                    </div>
                    <span className="text-xs text-muted-foreground">{totalReactions(post.reactions)}</span>
                    {post.comments.length > 0 && (
                      <>
                        <span className="text-muted-foreground mx-1">•</span>
                        <span className="text-xs text-muted-foreground">
                          {post.comments.length} comentário{post.comments.length > 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                  </div>
                )}

                <Separator className="mb-2" />

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {/* Reaction button with popup */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary gap-1.5 text-xs h-9"
                        onClick={() => setShowReactions(showReactions === post.id ? null : post.id)}
                      >
                        🥋 Reagir
                      </Button>
                      <AnimatePresence>
                        {showReactions === post.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 8 }}
                            className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-xl p-2 flex gap-1 shadow-elevated z-50"
                          >
                            {reactionTypes.map((r) => {
                              const isActive = userReactions[`${post.id}`]?.has(r.id);
                              return (
                                <motion.button
                                  key={r.id}
                                  whileHover={{ scale: 1.3 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => toggleReaction(post.id, r.id)}
                                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-colors ${
                                    isActive ? "bg-primary/20 ring-1 ring-primary" : "hover:bg-secondary"
                                  }`}
                                  title={r.label}
                                >
                                  {r.icon}
                                </motion.button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground gap-1.5 text-xs h-9"
                      onClick={() => {
                        const s = new Set(expandedComments);
                        s.has(post.id) ? s.delete(post.id) : s.add(post.id);
                        setExpandedComments(s);
                      }}
                    >
                      <MessageCircle className="w-4 h-4" /> Comentar
                    </Button>
                  </div>

                  {/* Quick reactions display */}
                  <div className="flex items-center gap-1">
                    {topReactions(post.reactions).map(([id, count]) => {
                      const r = reactionTypes.find((rt) => rt.id === id);
                      const isActive = userReactions[`${post.id}`]?.has(id);
                      return (
                        <motion.button
                          key={id}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleReaction(post.id, id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                            isActive
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          <span className="text-sm">{r?.icon}</span>
                          <span className="font-medium">{count}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {expandedComments.has(post.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 space-y-3">
                      <Separator />
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2.5">
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className="bg-secondary text-foreground text-[10px] font-bold">
                              {comment.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-secondary/50 rounded-lg px-3 py-2">
                              <span className="text-xs font-semibold text-foreground">{comment.author}</span>
                              <p className="text-xs text-foreground/80 mt-0.5">{comment.content}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground ml-3">{comment.timeAgo}</span>
                          </div>
                        </div>
                      ))}
                      {/* New Comment Input */}
                      <div className="flex gap-2 items-center mt-2">
                        <Avatar className="w-7 h-7">
                          <AvatarFallback className="bg-secondary text-foreground text-[10px] font-bold gradient-gold text-primary-foreground">
                            AF
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Input
                            value={commentText[post.id] || ""}
                            onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && addComment(post.id)}
                            placeholder="Escreva um comentário..."
                            className="h-8 text-xs bg-secondary/50 border-border"
                          />
                          <Button
                            onClick={() => addComment(post.id)}
                            size="icon"
                            className="h-8 w-8 gradient-gold text-primary-foreground shrink-0"
                            disabled={!commentText[post.id]?.trim()}
                          >
                            <Send className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Community;
