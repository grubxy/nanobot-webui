import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sun, Moon, Languages, LogOut, KeyRound } from "lucide-react";
import { useState } from "react";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

export function Header() {
  const { t, i18n } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const user = useAuthStore((s) => s.user);
  const [showChangePwd, setShowChangePwd] = useState(false);

  const toggleLang = () => {
    const next = i18n.language === "zh" ? "en" : i18n.language === "en" ? "ja" : "zh";
    i18n.changeLanguage(next);
  };

  const langLabel = i18n.language === "zh" ? "中" : i18n.language === "ja" ? "日" : "En";

  return (
    <header className="flex h-12 items-center bg-card/80 backdrop-blur-xl border-b border-border px-4 relative">
      
      <div className="flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLang}
          title={t("common.language")}
          className="h-8 px-2 gap-1 text-xs font-medium transition-colors dark:text-white/70 dark:hover:text-white dark:hover:bg-muted/60 light:text-foreground/70 light:hover:text-foreground light:hover:bg-muted/60"
        >
          <Languages className="h-4 w-4" />
          {langLabel}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          title={resolvedTheme === "dark" ? t("common.lightMode") : t("common.darkMode")}
          className="h-8 w-8 transition-colors dark:text-white/70 dark:hover:text-white dark:hover:bg-muted/60 light:text-foreground/70 light:hover:text-foreground light:hover:bg-muted/60"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full border border-border hover:border-accent/50 hover:bg-border/60 transition-colors"
              title={t("auth.account")}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-white">
                {user?.username?.[0]?.toUpperCase() ?? "?"}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 bg-card/95 border-border backdrop-blur-xl">
            <DropdownMenuItem onClick={() => setShowChangePwd(true)} className="text-foreground hover:bg-border focus:bg-border">
              <KeyRound className="mr-2 h-4 w-4" />
              {t("auth.changePassword")}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={clearAuth}
              className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("auth.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ChangePasswordDialog
        open={showChangePwd}
        onClose={() => setShowChangePwd(false)}
      />
    </header>
  );
}
