
import { useState, useEffect } from "react";
import { useMapState } from "@/contexts/MapStateContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, X, Save, RotateCcw, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/ui/language-selector";

interface UserSettingsProps {
  onClose: () => void;
}

export const UserSettings = ({ onClose }: UserSettingsProps) => {
  const { isDayMode, setIsDayMode } = useMapState();
  const [darkMode, setDarkMode] = useState(!isDayMode);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleSave = () => {
    setIsDayMode(!darkMode);
    toast({
      title: t("common.success"),
      description: darkMode 
        ? t("profile.dark_mode_enabled") 
        : t("profile.light_mode_enabled"),
    });
    onClose();
  };

  const handleReset = () => {
    setDarkMode(!isDayMode);
  };

  return (
    <Card className="absolute left-0 top-0 w-full h-full md:left-4 md:top-16 md:w-80 p-4 z-30 bg-white/95 backdrop-blur-sm md:h-auto overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t("profile.settings")}</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="tap-highlight-none">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-medium">{t("common.appearance")}</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sun className="h-5 w-5" />
              <Label htmlFor="theme-mode" className="cursor-pointer">{t("profile.dark_mode")}</Label>
            </div>
            <Switch 
              id="theme-mode" 
              checked={darkMode}
              onCheckedChange={handleToggleTheme}
            />
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2">
            <div className="flex items-center space-x-2">
              <Moon className={`h-5 w-5 ${darkMode ? 'text-primary' : 'text-gray-500'}`} />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t("profile.dark_mode_description")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">{t("profile.language")}</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <Label htmlFor="language" className="cursor-pointer">{t("profile.select_language")}</Label>
            </div>
            <LanguageSelector className="w-32" />
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("common.cancel")}
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {t("common.save")}
          </Button>
        </div>
      </div>
    </Card>
  );
};
