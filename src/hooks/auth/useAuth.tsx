
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./useLogin";
import { useRegister } from "./useRegister";
import { usePasswordReset } from "./usePasswordReset";
import { useLogout } from "./useLogout";
import { OperationResult } from "@/lib/error-utils";

interface UseAuthOptions {
  redirectTo?: string;
}

export const useAuth = (options: UseAuthOptions = {}) => {
  const { redirectTo = "/map" } = options;
  const { login, loginWithGoogle, loading: loginLoading, error: loginError } = useLogin({ redirectTo });
  const { register, loading: registerLoading, error: registerError } = useRegister();
  const { resetPassword, loading: resetLoading, error: resetError } = usePasswordReset();
  const { logout, loading: logoutLoading } = useLogout();

  // Combine loading states and errors
  const loading = loginLoading || registerLoading || resetLoading || logoutLoading;
  const error = loginError || registerError || resetError;

  return {
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    loading,
    error,
  };
};

export default useAuth;
