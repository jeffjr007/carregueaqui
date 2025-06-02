import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Car, BatteryCharging, Zap } from "lucide-react";

const LoadingScreen = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            navigate("/login");
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/20 to-green-500/20 p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="relative flex justify-center">
            <Car className="w-16 h-16 text-primary animate-pulse" />
            <div className="absolute -right-2 top-0">
              <BatteryCharging className="w-8 h-8 text-green-500 animate-bounce" />
            </div>
            <div className="absolute -left-2 bottom-0">
              <Zap className="w-8 h-8 text-yellow-500 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900">Carregue Aqui</h1>
          <p className="text-gray-600 text-lg">Estamos carregando sua jornada...</p>
          
          <div className="space-y-2">
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-sm text-gray-500">{progress}%</p>
          </div>
        </div>

        <div className="text-center animate-pulse">
          <p className="text-sm text-gray-500">
            Conectando você aos melhores pontos de carregamento
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;