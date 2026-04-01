import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import api from "../lib/api";
import { useAuthStore } from "../stores/authStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { User, Lock, Languages } from "lucide-react";

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error(t("auth.fieldRequired"));
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      const { access_token, user } = res.data;
      setAuth(user, access_token);
      navigate("/dashboard");
    } catch {
      toast.error(t("auth.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const LANG_LABELS: Record<string, string> = {
    zh: "中文",
    "zh-TW": "繁體中文",
    en: "English",
    ja: "日本語",
    ko: "한국어",
    de: "Deutsch",
    fr: "Français",
  };

  const getLanguageLabel = () => LANG_LABELS[i18n.language] ?? "English";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted to-background px-4">
      {/* 科技感背景光效 */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]"></div>
      <div className="absolute inset-0 tech-grid-bg [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* 语言切换按钮 */}
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 backdrop-blur-sm bg-muted/50 border-primary/30 text-primary-foreground hover:bg-muted/60 hover:border-primary/50">
              <Languages className="h-4 w-4" />
              {getLanguageLabel()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card/95 border-primary/30 backdrop-blur-xl">
            <DropdownMenuItem onClick={() => changeLanguage("zh")} className="text-primary-foreground hover:bg-muted focus:bg-muted">
              简体中文
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("zh-TW")} className="text-primary-foreground hover:bg-muted focus:bg-muted">
              繁體中文
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("en")} className="text-primary-foreground hover:bg-muted focus:bg-muted">
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("ja")} className="text-primary-foreground hover:bg-muted focus:bg-muted">
              日本語
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("ko")} className="text-primary-foreground hover:bg-muted focus:bg-muted">
              한국어
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("de")} className="text-primary-foreground hover:bg-muted focus:bg-muted">
              Deutsch
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("fr")} className="text-primary-foreground hover:bg-muted focus:bg-muted">
              Français
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="w-full max-w-sm relative animate-in fade-in zoom-in duration-500 bg-card/80 border-primary/30 backdrop-blur-xl shadow-[0_0_40px_rgba(0,120,255,0.15)]">
        {/* 顶部光效 */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        
        <CardHeader className="text-center space-y-4 pb-6 pt-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl animate-pulse"></div>
              <img 
                src="/icon.png" 
                alt="RedClawOps" 
                className="relative h-16 w-16 rounded-xl shadow-lg border border-primary/30" 
              />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground tracking-wide">
              RedClawOps
            </CardTitle>
            <CardDescription className="text-primary/70 text-sm mt-2">{t("auth.login")}</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="px-6 pb-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground text-sm font-medium">
                {t("auth.username")}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="pl-10 h-11 bg-muted/60 border-primary/30 text-primary-foreground placeholder:text-primary/40 focus-visible:ring-primary/50 focus-visible:border-primary/60 rounded-lg"
                  placeholder={t("auth.username")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground text-sm font-medium">
                {t("auth.password")}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pl-10 h-11 bg-muted/60 border-primary/30 text-primary-foreground placeholder:text-primary/40 focus-visible:ring-primary/50 focus-visible:border-primary/60 rounded-lg"
                  placeholder={t("auth.password")}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 mt-6 bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 rounded-lg" 
              disabled={loading}
            >
              {loading ? t("common.loading") : t("auth.loginButton")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
