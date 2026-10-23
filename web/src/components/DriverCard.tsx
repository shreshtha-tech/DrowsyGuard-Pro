import { MoreVertical, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface Driver {
  id: number;
  name: string;
  status: string;
  score: number;
  location: string;
}

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
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:border-indigo-500/50 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-gray-900 rounded-lg">
            {getShieldIcon(driver.status)}
          </div>
          <div>
            <h3 className="font-bold text-lg">{driver.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${getStatusColor(driver.status)}`}>
              {driver.status}
            </span>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white">
          <MoreVertical className="w-5 h-5" />
        </button>
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
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Current Location</span>
          <span className="text-gray-300 font-medium truncate ml-4">{driver.location}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm font-medium transition-colors">
            Contact
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm font-medium transition-colors">
            View Live
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverCard;
