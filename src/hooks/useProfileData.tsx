
import { useProfile } from "./useProfile";

export function useProfileData() {
  const { name, avatarUrl, loading, initialLoading, fetchProfile } = useProfile();
  
  return {
    profileData: {
      name,
      avatarUrl
    },
    loading,
    initialLoading,
    fetchProfile
  };
}
