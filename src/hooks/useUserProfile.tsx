
import { useProfile } from "./useProfile";

export function useUserProfile() {
  const { username, avatarUrl, loading, fetchProfile } = useProfile();
  
  return {
    username,
    avatarUrl,
    loading,
    fetchProfile
  };
}
