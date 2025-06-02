
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface StationPhotosProps {
  photos: string[];
}

export const StationPhotos = ({ photos }: StationPhotosProps) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const openFullscreen = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeFullscreen = () => {
    setSelectedPhotoIndex(null);
  };

  const navigatePhotos = (direction: 'next' | 'prev') => {
    if (selectedPhotoIndex === null) return;
    
    if (direction === 'next') {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
    } else {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Fotos</h3>
      
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <div 
            key={index} 
            className="aspect-video rounded-md overflow-hidden cursor-pointer"
            onClick={() => openFullscreen(index)}
          >
            <img 
              src={photo} 
              alt={`Foto ${index + 1} da estação`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={selectedPhotoIndex !== null} onOpenChange={() => closeFullscreen()}>
        <DialogContent className="sm:max-w-[90vw] p-0 bg-black overflow-hidden">
          <div className="relative w-full h-full">
            <Button 
              onClick={closeFullscreen} 
              className="absolute top-3 right-3 z-10 rounded-full w-8 h-8 p-0 bg-black/50 hover:bg-black/80"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>

            {selectedPhotoIndex !== null && (
              <div className="flex flex-col items-center justify-center h-[80vh]">
                <img 
                  src={photos[selectedPhotoIndex]} 
                  alt={`Foto ${selectedPhotoIndex + 1} em tela cheia`} 
                  className="max-h-full max-w-full object-contain"
                />
                
                <div className="flex justify-between w-full absolute bottom-4 px-4">
                  <Button 
                    onClick={() => navigatePhotos('prev')} 
                    className="rounded-full bg-black/50 hover:bg-black/80"
                    size="sm"
                  >
                    Anterior
                  </Button>
                  <span className="text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                    {selectedPhotoIndex + 1} / {photos.length}
                  </span>
                  <Button 
                    onClick={() => navigatePhotos('next')} 
                    className="rounded-full bg-black/50 hover:bg-black/80"
                    size="sm"
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
