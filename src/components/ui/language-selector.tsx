import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Globe } from 'lucide-react';
import WorldFlag from 'react-world-flags';
import { useToast } from '@/hooks/use-toast';

interface LanguageSelectorProps {
  className?: string;
}

const languageOptions = [
  { code: 'pt', name: 'Português', country: 'BR' },
  { code: 'en', name: 'English', country: 'US' },
  { code: 'es', name: 'Español', country: 'ES' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const { i18n, t } = useTranslation();
  const { toast } = useToast();

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
    const lang = languageOptions.find(l => l.code === value)?.name || value;
    toast({
      title: t('language.changed'),
      description: t('language.changed_description') + ` ${lang}.`,
      duration: 2500,
    });
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Globe className="h-3 w-3 text-muted-foreground mr-1" />
      <Select
        value={i18n.language}
        onValueChange={changeLanguage}
      >
        <SelectTrigger className="w-[120px] rounded-lg border border-gray-300 bg-white shadow-sm hover:border-primary focus:border-primary transition-all px-3 py-2 min-h-[40px] cursor-pointer">
          <SelectValue>
            <div className="flex items-center gap-2">
              <WorldFlag code={languageOptions.find(l => l.code === i18n.language)?.country || 'BR'} height="20" width="28" className="rounded-md border object-cover" style={{minWidth: 28, maxWidth: 28}} />
              <span className="font-medium text-gray-700 truncate">
                {languageOptions.find(l => l.code === i18n.language)?.name || i18n.language}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="z-[99999] bg-white shadow-lg">
          {languageOptions.map(({ code, name, country }) => (
            <SelectItem key={code} value={code} className="hover:bg-gray-100">
              <div className="flex items-center gap-2">
                <WorldFlag code={country} height="20" width="28" className="rounded-md border object-cover" style={{minWidth: 28, maxWidth: 28}} />
                <span>{name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
