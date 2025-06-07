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

  const GRID_SIZE = 20;
  const [gameWidth, setGameWidth] = useState(400);
  const [gameHeight, setGameHeight] = useState(300);
  const [cellSize, setCellSize] = useState(20);

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
    const maxX = Math.floor(gameWidth / cellSize) - 2;
    const maxY = Math.floor(gameHeight / cellSize) - 2;
    
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

      if (
        head.x < 0 || 
        head.x >= gameWidth / cellSize || 
        head.y < 0 || 
        head.y >= gameHeight / cellSize
      ) {
        setGameOver(true);
        return prevCar;
      }

      if (prevCar.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevCar;
      }

      const newCar = [head, ...prevCar];

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

  useEffect(() => {
    const handleResize = () => {
      if (gameAreaRef.current) {
        const containerWidth = gameAreaRef.current.offsetWidth;
        const calculatedCellSize = Math.min(20, Math.floor(containerWidth / GRID_SIZE));
        setCellSize(calculatedCellSize);
        setGameWidth(calculatedCellSize * GRID_SIZE);
        setGameHeight(calculatedCellSize * Math.floor(300 / 20));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [GRID_SIZE]);

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
          className="relative w-full bg-gray-800 rounded-lg mb-4 overflow-hidden"
          style={{ 
            aspectRatio: '4/3',
            maxWidth: '100%',
            margin: '0 auto'
          }}
        >
          <FlickeringGrid
            className="absolute inset-0 z-0"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.3}
            flickerChance={0.1}
            height={Number(gameHeight)}
            width={Number(gameWidth)}
          />

          {car.map((segment, index) => (
            <div
              key={index}
              className="absolute bg-blue-500 rounded-lg flex items-center justify-center"
              style={{
                width: cellSize,
                height: cellSize,
                left: segment.x * cellSize,
                top: segment.y * cellSize,
                transform: index === 0 ? 'scale(1.2)' : 'scale(1)',
                zIndex: car.length - index + 1
              }}
            >
              {index === 0 && <span className="text-white text-sm">🚗</span>}
            </div>
          ))}

          <div
            className="absolute bg-yellow-400 rounded-full flex items-center justify-center animate-pulse"
            style={{
              width: cellSize,
              height: cellSize,
              left: energy.x * cellSize,
              top: energy.y * cellSize,
              zIndex: car.length + 2
            }}
          >
            <span className="text-white text-sm">⚡</span>
          </div>

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

          {gameStarted && !gameOver && (
            <div className="absolute bottom-2 left-2 flex flex-col items-center gap-1 z-10">
              <button
                onClick={() => direction !== 'DOWN' && setDirection('UP')}
                className="w-8 h-8 bg-white/50 hover:bg-white/70 rounded-full flex items-center justify-center shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              
              <div className="flex gap-1">
                <button
                  onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}
                  className="w-8 h-8 bg-white/50 hover:bg-white/70 rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}
                  className="w-8 h-8 bg-white/50 hover:bg-white/70 rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <button
                onClick={() => direction !== 'UP' && setDirection('DOWN')}
                className="w-8 h-8 bg-white/50 hover:bg-white/70 rounded-full flex items-center justify-center shadow-lg"
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