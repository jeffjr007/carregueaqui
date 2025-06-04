import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UsersPanelProps {
  adminMessage: string;
}

export const UsersPanel = ({ adminMessage }: UsersPanelProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin.users_management")}</CardTitle>
        <CardDescription>
          {t("admin.in_development")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-400" />
          <p className="text-sm text-gray-500">
            {t("admin.users_management_coming_soon")}
          </p>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          {adminMessage || t("admin.status_message_placeholder")}
        </p>
      </CardContent>
    </Card>
  );
};
