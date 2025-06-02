
/**
 * Utilitário para validação de entradas do usuário
 */

/**
 * Validação de email
 * Verifica se o formato do email é válido 
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.length > 0 && emailRegex.test(email);
};

/**
 * Validação de senha
 * Verifica se a senha tem pelo menos minLength caracteres
 * e se contém pelo menos um número e uma letra
 */
export const isValidPassword = (password: string, minLength = 6): boolean => {
  if (password.length < minLength) return false;
  
  // Pelo menos um número e uma letra
  const hasNumber = /[0-9]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  
  return hasNumber && hasLetter;
};

/**
 * Validação de nome
 * Verifica se o nome tem entre 2 e 100 caracteres
 * e não contém caracteres especiais perigosos
 */
export const isValidName = (name: string): boolean => {
  if (name.length < 2 || name.length > 100) return false;
  
  // Evitar caracteres que possam ser usados para injeção
  const dangerousChars = /[<>{}]/;
  return !dangerousChars.test(name);
};

/**
 * Retorna mensagem de erro para email inválido
 */
export const getEmailErrorMessage = (email: string): string | null => {
  if (!email.trim()) return "O email é obrigatório";
  if (!isValidEmail(email)) return "Formato de email inválido";
  return null;
};

/**
 * Retorna mensagem de erro para senha inválida
 */
export const getPasswordErrorMessage = (password: string, minLength = 6): string | null => {
  if (!password) return "A senha é obrigatória";
  if (password.length < minLength) return `A senha deve ter pelo menos ${minLength} caracteres`;
  if (!/[0-9]/.test(password)) return "A senha deve conter pelo menos um número";
  if (!/[a-zA-Z]/.test(password)) return "A senha deve conter pelo menos uma letra";
  return null;
};

/**
 * Retorna mensagem de erro para nome inválido
 */
export const getNameErrorMessage = (name: string): string | null => {
  if (!name.trim()) return "O nome é obrigatório";
  if (name.trim().length < 2) return "O nome deve ter pelo menos 2 caracteres";
  if (name.length > 100) return "O nome não pode ter mais de 100 caracteres";
  if (/[<>{}]/.test(name)) return "O nome contém caracteres inválidos";
  return null;
};
