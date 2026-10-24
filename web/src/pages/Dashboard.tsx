import { Map as MapIcon, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import DriverCard from '../components/DriverCard';
import { demoDrivers } from '../data/demoDrivers';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const activeCount = demoDrivers.filter((driver) => driver.status === 'Active').length;
  const highRiskCount = demoDrivers.filter((driver) => driver.score >= 80).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Fleet Overview</h1>
          <p className="mt-1 text-xs text-amber-300">Demo data · not live fleet telemetry</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <div className="flex min-w-0 items-center gap-2 rounded-lg bg-gray-800 p-3 text-sm sm:text-base">
            <Users className="shrink-0 text-blue-400" />
            <span>Active Drivers: {activeCount}</span>
          </div>
          <div className="flex min-w-0 items-center gap-2 rounded-lg bg-gray-800 p-3 text-sm sm:text-base">
            <AlertTriangle className="shrink-0 text-red-400" />
            <span>High Risk: {highRiskCount}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {demoDrivers.map(driver => (
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
            <div className="text-center">
              <p className="font-medium text-gray-300">No fatigue history yet</p>
              <p className="mt-1 text-sm text-gray-500">Trip and detection history is not connected to this dashboard.</p>
              <Link to="/history" className="mt-3 inline-block text-sm text-indigo-300 hover:text-indigo-200">Open trip history</Link>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-lg sm:p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MapIcon className="mr-2 text-green-400" />
            Live Fleet Map
          </h2>
          <div className="flex h-48 items-center justify-center rounded-lg border border-gray-700 bg-gray-900 px-4 text-center sm:h-64">
            <p className="max-w-sm text-gray-400">Live map is unavailable until drivers share live location data.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
