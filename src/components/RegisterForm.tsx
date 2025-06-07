import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import useAuth from "@/hooks/auth";
import { FormContainer } from "@/components/ui/form-container";
import { FormInput } from "@/components/ui/form-input";
import { FormButton } from "@/components/ui/form-button";
import AuthFooter from "./auth/AuthFooter";
import { getEmailErrorMessage, getPasswordErrorMessage, getNameErrorMessage } from "@/lib/validation";
import { OptimizedImage } from "./ui/optimized-image";
import { VerificationGame } from "./auth/VerificationGame";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { register, loading, error: authError } = useAuth({ redirectTo: "/login" });

  // Validação em tempo real enquanto o usuário digita
  useEffect(() => {
    if (name) {
      const error = getNameErrorMessage(name);
      setNameError(error || "");
    }
    
    if (email) {
      const error = getEmailErrorMessage(email);
      setEmailError(error || "");
    }
    
    if (password) {
      const error = getPasswordErrorMessage(password);
      setPasswordError(error || "");
    }
  }, [name, email, password]);

  // Validar campos quando o usuário envia o formulário ou modifica valores
  useEffect(() => {
    if (formSubmitted) {
      validateForm();
    }
  }, [name, email, password, formSubmitted]);

  const validateForm = () => {
    const nameErrorMsg = getNameErrorMessage(name);
    const emailErrorMsg = getEmailErrorMessage(email);
    const passwordErrorMsg = getPasswordErrorMessage(password);
    
    setNameError(nameErrorMsg || "");
    setEmailError(emailErrorMsg || "");
    setPasswordError(passwordErrorMsg || "");
    
    return !nameErrorMsg && !emailErrorMsg && !passwordErrorMsg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (!validateForm()) {
      return;
    }
    
    if (!captchaVerified) {
      setShowVerification(true);
      return;
    }
    
    // Sanitizar entradas antes de enviar
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    
    const result = await register(sanitizedEmail, password, sanitizedName);
    
    if (result.success) {
      // Don't navigate immediately, let user see the success message
      setTimeout(() => navigate("/login"), 2000);
    }
  };
  
  const handleLoginClick = () => {
    navigate("/login");
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
      title="Crie sua conta"
      subtitle="Comece a carregar seu veículo em minutos"
      icon={appIcon}
      error={authError || undefined}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <FormInput
          id="name"
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          icon={<User className="h-5 w-5" />}
          error={nameError}
        />
        
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
            placeholder="Senha (letras e números, mínimo 6 caracteres)"
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
        
        <div className="mt-4">
          {!captchaVerified ? (
            <div className="bg-gray-100 border border-gray-300 rounded-md p-4 flex flex-col items-center justify-center text-sm">
              <div className="mb-2 text-gray-600">Verificação de segurança</div>
              <button
                type="button"
                onClick={() => setShowVerification(true)}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
              >
                Verificar que não sou um robô
              </button>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-300 rounded-md p-2 flex items-center justify-center text-sm text-green-700">
              ✓ Verificação concluída
            </div>
          )}
        </div>
      </div>

      <FormButton
        type="submit"
        loading={loading}
        loadingText="Cadastrando..."
        className="mt-6"
      >
        Cadastrar
      </FormButton>

      <AuthFooter 
        message="Já tem uma conta?"
        linkText="Entre aqui" 
        onLinkClick={handleLoginClick} 
      />

      {showVerification && (
        <VerificationGame
          onVerificationComplete={() => {
            setCaptchaVerified(true);
            setShowVerification(false);
          }}
          onClose={() => setShowVerification(false)}
        />
      )}
    </FormContainer>
  );
};

export default RegisterForm;
