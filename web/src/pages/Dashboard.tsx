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
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fleet Overview</h1>
        <div className="flex space-x-4">
          <div className="bg-gray-800 p-3 rounded-lg flex items-center space-x-2">
            <Users className="text-blue-400" />
            <span>Active Drivers: 24</span>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg flex items-center space-x-2">
            <AlertTriangle className="text-red-400" />
            <span>High Risk: 3</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map(driver => (
          <DriverCard key={driver.id} driver={driver} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 text-indigo-400" />
            Fatigue Trends
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-gray-500 italic">Chart will be rendered here (Recharts)</p>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MapIcon className="mr-2 text-green-400" />
            Live Fleet Map
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-gray-500 italic">Google Maps integration placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
