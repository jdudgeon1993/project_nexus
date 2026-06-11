import { useGtfsRt } from '../lib/useGtfsRt';
import TripPlanner from '../components/TripPlanner';

export default function PlanPage() {
  const { tripUpdates } = useGtfsRt();

  return (
    <div className="absolute inset-0 overflow-y-auto p-4 pb-6">
      <TripPlanner tripUpdates={tripUpdates} />
    </div>
  );
}
