interface ChargingSession {
  date: string;
  user: string;
  duration: string;
  carModel: string;
}

interface StationActivityProps {
  recentSessions: ChargingSession[];
}

export const StationActivity = ({ recentSessions }: StationActivityProps) => {
  return (
    <div className="border-t pt-4">
      <h3 className="font-semibold mb-2">Atividades Recentes</h3>
      <div className="space-y-2">
        {recentSessions.map((session, index) => (
          <div key={index} className="text-sm">
            <div className="flex justify-between">
              <span>{session.date}</span>
              <span>{session.duration}</span>
            </div>
            <div className="text-muted-foreground">
              {session.user} - {session.carModel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};