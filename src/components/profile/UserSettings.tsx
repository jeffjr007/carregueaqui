import { useState, useEffect } from "react";
import { useMapState } from "@/contexts/MapStateContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Save, RotateCcw, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/ui/language-selector";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface UserSettingsProps {
  onClose: () => void;
}

export const UserSettings = ({ onClose }: UserSettingsProps) => {
  const { isDayMode, setIsDayMode, distanceUnit, setDistanceUnit } = useMapState();
  const [darkMode, setDarkMode] = useState(!isDayMode);
  const [localDistanceUnit, setLocalDistanceUnit] = useState(distanceUnit);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleSave = () => {
    setIsDayMode(!darkMode);
    setDistanceUnit(localDistanceUnit);
    
    let description = '';
    if (darkMode !== !isDayMode) {
      description += darkMode
        ? t('Agora você está usando o modo escuro. Aproveite uma experiência mais confortável para os olhos!')
        : t('Agora você está usando o modo claro.');
    }
    
    if (localDistanceUnit !== distanceUnit) {
      description += (description ? '\n' : '') + t('Unidade de distância alterada para') + 
        (localDistanceUnit === 'km' ? t('quilômetros') : t('milhas')) + '.';
    }
    
    description = (description ? description + '\n' : '') + t('Suas preferências foram salvas com sucesso!');
    
    toast({
      title: t('Configurações atualizadas!'),
      description,
      duration: 3000,
    });
    
    onClose();
  };

  const handleReset = () => {
    setDarkMode(!isDayMode);
    setLocalDistanceUnit(distanceUnit);
    toast({
      title: t('Configurações resetadas'),
      description: t('Suas alterações foram descartadas.'),
      duration: 2000,
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-medium">{t("profile.appearance")}</h3>
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
              {t("profile.dark_mode_description", "Altere o modo de cor do aplicativo.")}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 relative z-[9999]">
        <h3 className="text-lg font-medium">{t("profile.language")}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <Label htmlFor="language" className="cursor-pointer">{t("profile.select_language")}</Label>
          </div>
          <LanguageSelector className="w-32" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium">{t("profile.distance_unit")}</h3>
        <RadioGroup value={localDistanceUnit} onValueChange={setLocalDistanceUnit} className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="km" id="km" />
            <Label htmlFor="km">{t("profile.kilometers")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mi" id="mi" />
            <Label htmlFor="mi">{t("profile.miles")}</Label>
          </div>
        </RadioGroup>
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
  );
};
