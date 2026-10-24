import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Driver } from '../data/demoDrivers';

const DriverCard = ({ driver }: { driver: Driver }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400 bg-green-400/10';
      case 'Warning': return 'text-yellow-400 bg-yellow-400/10';
      case 'Danger': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getShieldIcon = (status: string) => {
    switch (status) {
      case 'Active': return <ShieldCheck className="w-8 h-8 text-green-400" />;
      case 'Warning': return <ShieldAlert className="w-8 h-8 text-yellow-400" />;
      case 'Danger': return <ShieldX className="w-8 h-8 text-red-400" />;
      default: return <ShieldCheck className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="driver-card rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-lg transition-all hover:border-indigo-500/50 sm:p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="p-2 bg-gray-900 rounded-lg">
            {getShieldIcon(driver.status)}
          </div>
          <div>
            <h3 className="truncate text-lg font-bold">{driver.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${getStatusColor(driver.status)}`}>
              {driver.status}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1 text-gray-400">
            <span>Drowsiness Score</span>
            <span className={driver.score > 80 ? 'text-red-400' : driver.score > 50 ? 'text-yellow-400' : 'text-green-400'}>
              {driver.score}%
            </span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                driver.score > 80 ? 'bg-red-500' : driver.score > 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${driver.score}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
          <span className="text-gray-400">Current Location</span>
          <span className="min-w-0 break-words text-right font-medium text-gray-300">{driver.location}</span>
        </div>
        
        <div className="mt-4">
          <Link to={`/drivers/${driver.id}`} className="flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 py-2 text-sm font-medium transition-colors hover:bg-indigo-700">
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DriverCard;
