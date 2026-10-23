import { Map as MapIcon, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import DriverCard from '../components/DriverCard';

const Dashboard = () => {
  const drivers = [
    { id: 1, name: 'John Doe', status: 'Active', score: 15, location: 'San Francisco, CA' },
    { id: 2, name: 'Jane Smith', status: 'Warning', score: 65, location: 'Oakland, CA' },
    { id: 3, name: 'Mike Ross', status: 'Danger', score: 92, location: 'San Jose, CA' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">Fleet Overview</h1>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <div className="flex min-w-0 items-center gap-2 rounded-lg bg-gray-800 p-3 text-sm sm:text-base">
            <Users className="shrink-0 text-blue-400" />
            <span>Active Drivers: 24</span>
          </div>
          <div className="flex min-w-0 items-center gap-2 rounded-lg bg-gray-800 p-3 text-sm sm:text-base">
            <AlertTriangle className="shrink-0 text-red-400" />
            <span>High Risk: 3</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {drivers.map(driver => (
          <DriverCard key={driver.id} driver={driver} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-lg sm:p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 text-indigo-400" />
            Fatigue Trends
          </h2>
          <div className="flex h-48 items-center justify-center rounded-lg border border-gray-700 bg-gray-900 px-4 text-center sm:h-64">
            <p className="text-gray-500 italic">Chart will be rendered here (Recharts)</p>
          </div>
        </div>
        
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-lg sm:p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MapIcon className="mr-2 text-green-400" />
            Live Fleet Map
          </h2>
          <div className="flex h-48 items-center justify-center rounded-lg border border-gray-700 bg-gray-900 px-4 text-center sm:h-64">
            <p className="text-gray-500 italic">Google Maps integration placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
