
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import useAuth from "@/hooks/auth";
import { FormContainer } from "@/components/ui/form-container";
import { FormInput } from "@/components/ui/form-input";
import { FormButton } from "@/components/ui/form-button";
import AuthFooter from "./auth/AuthFooter";
import { Checkbox } from "@/components/ui/checkbox";
import { getEmailErrorMessage, getPasswordErrorMessage } from "@/lib/validation";
import { OptimizedImage } from "./ui/optimized-image";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { login, loginWithGoogle, loading, error, resetPassword } = useAuth();
  
  // Validar em tempo real quando o usuário digita
  useEffect(() => {
    if (email) {
      setEmailError(getEmailErrorMessage(email));
    }
    
    if (password) {
      setPasswordError(password ? null : "A senha é obrigatória");
    }
  }, [email, password]);

  // Validar campos quando o usuário envia o formulário
  useEffect(() => {
    if (formSubmitted) {
      validateForm();
    }
  }, [email, password, formSubmitted]);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/map');
      }
    };
    
    checkSession();
  }, [navigate]);

  const validateForm = () => {
    setEmailError(getEmailErrorMessage(email));
    setPasswordError(password ? null : "A senha é obrigatória");
    
    return !getEmailErrorMessage(email) && password.length > 0;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (!validateForm()) {
      return;
    }
    
    // Simular verificação de captcha em ambiente de desenvolvimento
    if (!captchaVerified) {
      setCaptchaVerified(true);
      return;
    }
    
    // Sanitizar email antes de enviar
    const sanitizedEmail = email.trim().toLowerCase();
    
    await login(sanitizedEmail, password, rememberMe);
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };
  
  const handleForgotPassword = async () => {
    if (!email) {
      setEmailError("Digite seu email para redefinir a senha");
      return;
    }
    
    if (getEmailErrorMessage(email)) {
      setEmailError("Email inválido");
      return;
    }
    
    await resetPassword(email.trim().toLowerCase());
  };

  // Ícone personalizado do aplicativo
  const appIcon = (
    <div className="h-14 w-14 text-primary">
      <OptimizedImage 
        src="/app-logo.png"
        alt="Logo do Aplicativo"
        width={56}
        height={56}
        className="h-14 w-14"
        placeholderSrc="/placeholder.svg"
        onError={() => console.log("Erro ao carregar o logo")}
      />
    </div>
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormContainer
      title="Bem-vindo de volta"
      subtitle="Entre para encontrar pontos de carregamento próximos"
      icon={appIcon}
      error={error}
      onSubmit={handleEmailLogin}
    >
      <div className="space-y-4">
        <FormInput
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={<Mail className="h-5 w-5" />}
          error={emailError}
        />
        
        <div className="relative">
          <FormInput
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<Lock className="h-5 w-5" />}
            error={passwordError}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember-me" 
              checked={rememberMe} 
              onCheckedChange={(checked) => setRememberMe(checked === true)} 
            />
            <label htmlFor="remember-me" className="text-sm text-gray-600 cursor-pointer">
              Lembrar-me
            </label>
          </div>
          
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Esqueci minha senha
          </button>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {!captchaVerified ? (
          <div className="bg-gray-100 border border-gray-300 rounded-md p-4 flex flex-col items-center justify-center text-sm">
            <div className="mb-2 text-gray-600">Verificação de segurança</div>
            <button
              type="button"
              onClick={() => setCaptchaVerified(true)}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
            >
              Não sou um robô
            </button>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-300 rounded-md p-2 flex items-center justify-center text-sm text-green-700">
            ✓ Verificação concluída
          </div>
        )}

        <FormButton 
          type="submit" 
          loading={loading} 
          loadingText="Entrando..."
        >
          Entrar
        </FormButton>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">ou continue com</span>
          </div>
        </div>

        <FormButton
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={loading}
          icon={<img src="/google-icon.svg" alt="Google" className="w-5 h-5" />}
        >
          Google
        </FormButton>
      </div>

      <AuthFooter 
        message="Não tem uma conta?"
        linkText="Cadastre-se" 
        onLinkClick={handleRegisterClick} 
      />
    </FormContainer>
  );
};

export default LoginForm;
