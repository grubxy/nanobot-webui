import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useProviders, useUpdateProvider, getProviderLabel, getProviderDefaultBaseUrl } from "../../hooks/useProviders";
import { useAgentSettings, useUpdateAgentSettings } from "../../hooks/useConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AlertCircle, ArrowRight, ArrowLeft, CheckCircle2, Key, Sparkles } from "lucide-react";

export function SetupGuideDialog() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: providers } = useProviders();
  const { data: agentSettings } = useAgentSettings();
  const updateProvider = useUpdateProvider();
  const updateAgent = useUpdateAgentSettings();
  
  // 配置步骤：0=欢迎, 1=配置提供商, 2=配置代理
  const [step, setStep] = useState(0);
  
  // 提供商配置
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [apiBase, setApiBase] = useState("");
  
  // 代理配置
  const [agentProvider, setAgentProvider] = useState("");
  const [agentModel, setAgentModel] = useState("");

  // 使用 useMemo 计算是否应该显示引导
  const shouldShowGuide = useMemo(() => {
    // 等待数据加载完成
    if (!providers || !agentSettings) return false;

    // 检查是否有配置的提供商
    const hasConfiguredProvider = providers.some((p) => p.has_key);
    
    // 检查是否配置了代理设置（provider 和 model）
    const hasAgentConfig = agentSettings.provider && agentSettings.model;

    // 如果没有配置提供商或没有配置代理，显示引导
    return !hasConfiguredProvider || !hasAgentConfig;
  }, [providers, agentSettings]);

  const handleSaveProvider = async () => {
    if (!apiKey.trim()) {
      toast.error(t("providers.apiKeyRequired"));
      return;
    }

    try {
      await updateProvider.mutateAsync({
        name: selectedProvider,
        api_key: apiKey,
        api_base: apiBase || undefined,
      });
      toast.success(t("settings.saved"));
      setStep(2);
    } catch {
      toast.error(t("common.error"));
    }
  };

  const handleSaveAgent = async () => {
    if (!agentProvider || !agentModel.trim()) {
      toast.error(t("setupGuide.agentConfigRequired"));
      return;
    }

    try {
      await updateAgent.mutateAsync({
        provider: agentProvider,
        model: agentModel,
      });
      toast.success(t("setupGuide.setupComplete"));
      // 配置完成后跳转到仪表盘
      navigate("/dashboard");
    } catch {
      toast.error(t("common.error"));
    }
  };

  const handleClose = () => {
    // 只有在已经有配置的情况下才允许关闭
    const hasConfiguredProvider = providers?.some((p) => p.has_key) ?? false;
    const hasAgentConfig = agentSettings?.provider && agentSettings?.model;
    
    if (hasConfiguredProvider && hasAgentConfig) {
      navigate("/dashboard");
    } else {
      toast.warning(t("setupGuide.mustComplete"));
    }
  };

  if (!shouldShowGuide) return null;

  const hasConfiguredProvider = providers?.some((p) => p.has_key) ?? false;
  const configuredProvidersList = providers?.filter((p) => p.has_key).map((p) => p.name) ?? [];

  // 供选择的提供商列表（所有支持的提供商）
  const allProviders = [
    "openai",
    "anthropic", 
    "openrouter",
    "deepseek",
    "groq",
    "zhipu",
    "dashscope",
    "gemini",
    "moonshot",
    "minimax",
    "aihubmix",
    "siliconflow",
    "volcengine",
    "azure_openai",
    "vllm",
    "custom",
  ];

  return (
    <Dialog open={shouldShowGuide} onOpenChange={() => handleClose()}>
      <DialogContent 
        className="sm:max-w-lg" 
        onPointerDownOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
              {step === 0 && <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
              {step === 1 && <Key className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
              {step === 2 && <Sparkles className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
            </div>
            <DialogTitle>
              {step === 0 && t("setupGuide.title")}
              {step === 1 && t("setupGuide.step1Title")}
              {step === 2 && t("setupGuide.step2Title")}
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {step === 0 && t("setupGuide.description")}
            {step === 1 && t("setupGuide.step1Description")}
            {step === 2 && t("setupGuide.step2Description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 步骤0: 欢迎页面 */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center gap-3 rounded-lg border p-3 bg-orange-50/50 dark:bg-orange-950/20">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50">
                    <span className="text-sm font-semibold text-orange-600">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t("setupGuide.step1Title")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <span className="text-sm font-semibold text-muted-foreground">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t("setupGuide.step2Title")}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(hasConfiguredProvider ? 2 : 1)} className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  {t("setupGuide.startSetup")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* 步骤1: 配置提供商 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label>{t("settings.provider")}</Label>
                  <Select value={selectedProvider} onValueChange={(val) => {
                    setSelectedProvider(val);
                    setApiBase(getProviderDefaultBaseUrl(val) || "");
                  }}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {allProviders.map((p) => (
                        <SelectItem key={p} value={p}>
                          {getProviderLabel(p)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t("providers.apiKey")}</Label>
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={t("providers.apiKeyPlaceholder")}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>{t("providers.apiBase")}</Label>
                  <Input
                    value={apiBase}
                    onChange={(e) => setApiBase(e.target.value)}
                    placeholder={getProviderDefaultBaseUrl(selectedProvider) || ""}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(0)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("common.back")}
                </Button>
                <Button onClick={handleSaveProvider} disabled={updateProvider.isPending} className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  {updateProvider.isPending ? t("common.saving") : t("common.next")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* 步骤2: 配置代理 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label>{t("settings.provider")}</Label>
                  <Select 
                    value={agentProvider} 
                    onValueChange={setAgentProvider}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder={t("settings.selectProvider")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">auto</SelectItem>
                      {configuredProvidersList.map((p) => (
                        <SelectItem key={p} value={p}>
                          {getProviderLabel(p)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>  
                <div>
                  <Label>{t("settings.model")}</Label>
                  <Input
                    value={agentModel}
                    onChange={(e) => setAgentModel(e.target.value)}
                    placeholder="e.g. gpt-4o, claude-opus-4"
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(hasConfiguredProvider ? 0 : 1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("common.back")}
                </Button>
                <Button onClick={handleSaveAgent} disabled={updateAgent.isPending} className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  {updateAgent.isPending ? t("common.saving") : t("setupGuide.complete")}
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
