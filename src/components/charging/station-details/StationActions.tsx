
import { ActionButtons } from "./action-buttons/ActionButtons";
import { SuggestStationButton } from "./action-buttons/SuggestStationButton";

interface StationActionsProps {
  onShowRating: () => void;
  onStartCharging?: () => void;
  onCompleteCharging?: () => void;
  isCharging?: boolean;
  stationId?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (isFavorite: boolean) => void;
  onShare?: () => void;
  onNavigate?: () => void;
}

export const StationActions = (props: StationActionsProps) => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-2 justify-between items-start pt-4">
        <ActionButtons {...props} />
      </div>

      <div className="border-t pt-4 mt-4">
        <SuggestStationButton />
      </div>
    </>
  );
};
