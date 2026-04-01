import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { useAuthStore } from "../../stores/authStore";
import { cn } from "../../lib/utils";
import { Sun, Moon, Languages, LogOut, KeyRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

export function MobileTopBar() {
  const { t, i18n } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [showChangePwd, setShowChangePwd] = useState(false);

  const LANG_LABELS: Record<string, string> = {
    zh: "中文", "zh-TW": "繁體中文", en: "English", ja: "日本語", ko: "한국어", de: "Deutsch", fr: "Français",
  };
  const currentLangLabel = LANG_LABELS[i18n.language] ?? "English";

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 flex h-12 items-center justify-between backdrop-blur-xl px-4 border-b dark:bg-card/90 dark:border-border light:bg-card light:border-border"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        
        {/* Logo */}
        <img
          src="/logo.png"
          alt="RedClawOps"
          className="h-7 w-auto max-w-[96px] object-contain object-left"
        />

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            title={isDark ? t("common.lightMode") : t("common.darkMode")}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-border/60"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* User avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                title={user?.username}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white transition-colors border border-border"
              >
                {user?.username?.[0]?.toUpperCase() ?? "?"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card/95 border-border backdrop-blur-xl">
              {/* Username (non-clickable label) */}
              <div className={cn("px-2 py-1.5 text-xs dark:text-white light:text-foreground")}>
                {user?.username}
              </div>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="dark:text-white dark:hover:bg-muted dark:focus:bg-muted light:text-foreground light:hover:bg-muted light:focus:bg-muted">
                  <Languages className="mr-2 h-4 w-4" />{currentLangLabel}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="backdrop-blur-xl dark:bg-card/95 dark:border-border light:bg-card light:border-border">
                  {Object.entries(LANG_LABELS).map(([code, label]) => (
                    <DropdownMenuItem
                      key={code}
                      onClick={() => i18n.changeLanguage(code)}
                      className={i18n.language === code ? "font-semibold text-primary dark:bg-muted/60 light:bg-primary/10" : "dark:text-white dark:hover:bg-muted dark:focus:bg-muted light:text-foreground light:hover:bg-muted light:focus:bg-muted"}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={() => setShowChangePwd(true)} className="dark:text-white dark:hover:bg-muted dark:focus:bg-muted light:text-foreground light:hover:bg-muted light:focus:bg-muted">
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
      </header>

      <ChangePasswordDialog open={showChangePwd} onClose={() => setShowChangePwd(false)} />
    </>
  );
}
