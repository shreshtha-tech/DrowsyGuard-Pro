import { LayoutDashboard, Users, History, AlertCircle, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Drivers', path: '/drivers' },
    { icon: AlertCircle, label: 'Incidents', path: '/incidents' },
    { icon: History, label: 'Trip History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-400">DrowsyGuard</h2>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Fleet Management</p>
      </div>
      
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-4 transition-colors ${
              location.pathname === item.path 
                ? 'bg-gray-700 text-indigo-400 border-r-4 border-indigo-400' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-6 border-t border-gray-700">
        <button className="flex items-center text-gray-400 hover:text-red-400 transition-colors w-full text-left">
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
