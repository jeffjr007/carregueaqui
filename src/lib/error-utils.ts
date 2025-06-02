
/**
 * Utility functions for consistent error handling across the application
 */

import { toast } from "@/components/ui/use-toast";

interface ErrorWithMessage {
  message: string;
  code?: string | number;
}

/**
 * Extracts a user-friendly error message from different error types
 */
export const extractErrorMessage = (error: unknown, defaultMessage = "Ocorreu um erro inesperado"): string => {
  if (!error) return defaultMessage;
  
  // Handle standard Error objects and objects with message property
  if (typeof error === 'object' && error !== null) {
    const errorWithMessage = error as ErrorWithMessage;
    
    if (typeof errorWithMessage.message === 'string') {
      const message = errorWithMessage.message.toLowerCase();
      
      // Auth-specific error messages
      if (message.includes("invalid login credentials")) {
        return "Email ou senha incorretos";
      } else if (message.includes("email not confirmed")) {
        return "Por favor, confirme seu email antes de fazer login";
      } else if (message.includes("password should be at least 6 characters")) {
        return "A senha deve ter pelo menos 6 caracteres";
      } else if (message.includes("user already registered")) {
        return "Este email já está cadastrado";
      }
      
      // Return original message if we don't have a specific mapping
      return errorWithMessage.message;
    }
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  return defaultMessage;
};

/**
 * Shows an error toast with a user-friendly message
 */
export const showErrorToast = (error: unknown, title = "Erro"): void => {
  const message = extractErrorMessage(error);
  
  toast({
    title,
    description: message,
    variant: "destructive",
  });
};

/**
 * Shows a success toast
 */
export const showSuccessToast = (title: string, description?: string): void => {
  toast({
    title,
    description,
  });
};

/**
 * Types for operation results with consistent structure
 */
export interface OperationResult {
  success: boolean;
  message?: string;
}

/**
 * Creates a successful operation result
 */
export const successResult = (message?: string): OperationResult => ({
  success: true,
  message,
});

/**
 * Creates a failed operation result
 */
export const errorResult = (error: unknown): OperationResult => ({
  success: false,
  message: extractErrorMessage(error),
});
