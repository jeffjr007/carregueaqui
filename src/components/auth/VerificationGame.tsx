import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

interface VerificationGameProps {
  onVerificationComplete: () => void;
  onClose: () => void;
}

interface Position {
  x: number;
  y: number;
}

type Difficulty = 'easy' | 'medium' | 'hard';

export const VerificationGame = ({ onVerificationComplete, onClose }: VerificationGameProps) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [car, setCar] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [energy, setEnergy] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<'RIGHT' | 'LEFT' | 'UP' | 'DOWN'>('RIGHT');
  const [isVerified, setIsVerified] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number>();
  const { toast } = useToast();

  // Configurações do jogo
  const GRID_SIZE = 20;
  const CELL_SIZE = 20;
  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 300;

  // Velocidades e pontuação necessária baseadas na dificuldade
  const GAME_SPEEDS = {
    easy: 300,
    medium: 200,
    hard: 150
  };

  const REQUIRED_SCORES = {
    easy: 2,
    medium: 4,
    hard: 8
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setCar([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    spawnEnergy();
  };

  const spawnEnergy = () => {
    const maxX = Math.floor(GAME_WIDTH / CELL_SIZE) - 2;
    const maxY = Math.floor(GAME_HEIGHT / CELL_SIZE) - 2;
    
    let newEnergy: Position;
    do {
      newEnergy = {
        x: Math.floor(Math.random() * (maxX - 2)) + 2,
        y: Math.floor(Math.random() * (maxY - 2)) + 2
      };
    } while (
      car.some(segment => segment.x === newEnergy.x && segment.y === newEnergy.y)
    );
    
    setEnergy(newEnergy);
  };

  const moveCar = () => {
    setCar(prevCar => {
      const head = { ...prevCar[0] };
      
      switch (direction) {
        case 'RIGHT':
          head.x += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
      }

      // Verificar colisão com as paredes
      if (
        head.x < 0 || 
        head.x >= GAME_WIDTH / CELL_SIZE || 
        head.y < 0 || 
        head.y >= GAME_HEIGHT / CELL_SIZE
      ) {
        setGameOver(true);
        return prevCar;
      }

      // Verificar colisão com o próprio carro
      if (prevCar.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevCar;
      }

      const newCar = [head, ...prevCar];

      // Verificar se coletou energia
      if (head.x === energy.x && head.y === energy.y) {
        setScore(prev => {
          const newScore = prev + 1;
          if (newScore >= REQUIRED_SCORES[difficulty]) {
            setIsVerified(true);
            toast({
              title: "Verificação concluída!",
              description: "Você não é um robô!",
            });
            onVerificationComplete();
          }
          return newScore;
        });
        spawnEnergy();
      } else {
        // Permite crescimento normal em todos os modos
        newCar.pop();
      }

      return newCar;
    });
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    gameLoopRef.current = window.setInterval(moveCar, GAME_SPEEDS[difficulty]);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, direction, difficulty]);

  return (
    <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Verificação de Segurança</h2>
        <p className="text-gray-600 mb-4">
          {!gameStarted 
            ? `Colete ${REQUIRED_SCORES[difficulty]} energias para completar a verificação. Na versão web, use as setas do teclado. Em dispositivos móveis, use os botões na tela.`
            : `Pontuação: ${score}/${REQUIRED_SCORES[difficulty]}`}
        </p>

        {!gameStarted && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Escolha a dificuldade:</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={difficulty === 'easy' ? 'default' : 'outline'}
                onClick={() => setDifficulty('easy')}
                className="flex-1"
              >
                🙂 Fácil
                <span className="text-xs ml-1">({REQUIRED_SCORES.easy} energias)</span>
              </Button>
              <Button
                variant={difficulty === 'medium' ? 'default' : 'outline'}
                onClick={() => setDifficulty('medium')}
                className="flex-1"
              >
                😐 Médio
                <span className="text-xs ml-1">({REQUIRED_SCORES.medium} energias)</span>
              </Button>
              <Button
                variant={difficulty === 'hard' ? 'default' : 'outline'}
                onClick={() => setDifficulty('hard')}
                className="flex-1"
              >
                😠 Difícil
                <span className="text-xs ml-1">({REQUIRED_SCORES.hard} energias)</span>
              </Button>
            </div>
          </div>
        )}
        
        <div 
          ref={gameAreaRef}
          className="relative w-full h-[300px] bg-gray-800 rounded-lg mb-4 overflow-hidden"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Flickering Grid Background */}
          <FlickeringGrid
            className="absolute inset-0 z-0 size-full"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.3}
            flickerChance={0.1}
            height={GAME_HEIGHT}
            width={GAME_WIDTH}
          />

          {/* Grade de fundo (mantida para visualização da área) */}
          {/* Removida a renderização visual da grade para não sobrepor o FlickeringGrid */}
          {/* {Array.from({ length: 20 }).map((_, i) =>
              Array.from({ length: 15 }).map((_, j) => (
                <div
                  key={`${i}-${j}`}
                  className="border border-gray-700"
                />
              ))
            )} */}

          {/* Carro */}
          {car.map((segment, index) => (
            <div
              key={index}
              className="absolute bg-blue-500 rounded-lg flex items-center justify-center"
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                transform: index === 0 ? 'scale(1.2)' : 'scale(1)',
                zIndex: car.length - index + 1 // Aumentar zIndex para ficar acima do grid
              }}
            >
              {index === 0 && <span className="text-white text-sm">🚗</span>}
            </div>
          ))}

          {/* Energia */}
          <div
            className="absolute bg-yellow-400 rounded-full flex items-center justify-center animate-pulse"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: energy.x * CELL_SIZE,
              top: energy.y * CELL_SIZE,
              zIndex: car.length + 2 // Aumentar zIndex para ficar acima do carro e do grid
            }}
          >
            <span className="text-white text-sm">⚡</span>
          </div>

          {/* Game Over ou Start */}
          {!gameStarted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <Button onClick={startGame}>
                Iniciar Jogo
              </Button>
            </div>
          )}
          
          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="text-center">
                <p className="text-white text-xl mb-4">Game Over!</p>
                <Button onClick={startGame}>
                  Tentar Novamente
                </Button>
              </div>
            </div>
          )}

          {/* Botões de Controle */}
          {gameStarted && !gameOver && (
            <div className="absolute bottom-2 right-2 flex flex-col items-center gap-1 z-10">
              {/* Botão Up */}
              <button
                onClick={() => direction !== 'DOWN' && setDirection('UP')}
                className="w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              
              {/* Botões Left/Right */}
              <div className="flex gap-1">
                <button
                  onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}
                  className="w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}
                  className="w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Botão Down */}
              <button
                onClick={() => direction !== 'UP' && setDirection('DOWN')}
                className="w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={onVerificationComplete}
            disabled={!isVerified}
          >
            Continuar
          </Button>
        </div>
      </div>
    </Card>
  );
}; 