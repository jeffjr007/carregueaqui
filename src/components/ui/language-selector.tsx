
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { FC } from 'react';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: FC<LanguageSelectorProps> = ({ className }) => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
  };

  // Mapeamento de código de idioma para nome do idioma no próprio idioma
  const languageNames: Record<string, string> = {
    pt: 'Português',
    en: 'English',
    es: 'Español'
  };

  return (
    <div className="flex items-center">
      <Globe className="h-4 w-4 text-muted-foreground mr-2" />
      <Select
        value={i18n.language}
        onValueChange={changeLanguage}
      >
        <SelectTrigger className={`w-[130px] ${className}`}>
          <SelectValue placeholder={t('select_language', 'Selecionar idioma')} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languageNames).map(([code, name]) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
