
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  avatarUrl: string;
  loading: boolean;
  onClose: () => void;
}

export const ProfileHeader = ({ 
  username, 
  avatarUrl, 
  loading, 
  onClose, 
}: ProfileHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Avatar className="h-16 w-16 mr-3">
          {loading ? (
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
            </>
          )}
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold">{username}</h1>
          <p className="text-gray-500 text-sm">Motorista Elétrico</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};
