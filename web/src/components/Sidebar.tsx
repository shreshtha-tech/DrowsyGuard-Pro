import { LayoutDashboard, Users, History, AlertCircle, Settings } from 'lucide-react';
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
    <aside className="fixed inset-x-0 bottom-0 z-20 flex w-full border-t border-gray-700 bg-gray-800 md:relative md:inset-auto md:w-64 md:flex-col md:border-r md:border-t-0">
      <div className="hidden p-6 md:block">
        <h2 className="text-2xl font-bold text-indigo-400">DrowsyGuard</h2>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Fleet Management</p>
      </div>
      
      <nav className="flex w-full justify-around overflow-x-auto md:mt-6 md:flex-1 md:flex-col md:justify-start">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-center transition-colors md:flex-row md:justify-start md:gap-0 md:px-6 md:py-4 md:text-left ${
              location.pathname === item.path || (item.path === '/drivers' && location.pathname.startsWith('/drivers/'))
                ? 'border-b-2 border-indigo-400 bg-gray-700 text-indigo-400 md:border-b-0 md:border-r-4'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5 shrink-0 md:mr-3" />
            <span className="truncate text-[10px] font-medium sm:text-xs md:text-base">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="hidden border-t border-gray-700 p-6 md:block">
        <p className="text-xs leading-relaxed text-gray-500">Prototype dashboard · sample driver data</p>
      </div>
    </aside>
  );
};

export default Sidebar;
