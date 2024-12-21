import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  TrendingUp,
  PieChart,
  Newspaper,
  Star,
  Settings,
  BookOpen,
  LogOut,
  ChevronDown
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: TrendingUp, label: 'Markets', path: '/markets' },
  { icon: PieChart, label: 'Portfolio', path: '/portfolio' },
  { icon: Newspaper, label: 'Forums', path: '/forums' },
  { icon: BookOpen, label: 'Research', path: '/research' },
  { icon: Star, label: 'Personal Advisor', path: '/personal' }
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    // Add any logout logic here (clear tokens, state, etc.)
    navigate('/signin');
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 fixed left-0 top-0">
      <div className="flex items-center space-x-2 px-6 py-4 border-b border-gray-200">
        <TrendingUp className="w-8 h-8 text-blue-600" />
        <span className="text-xl font-bold text-gray-900">FinView</span>
      </div>
      
      <nav className="mt-6 flex flex-col h-[calc(100%-4rem)] justify-between">
        <div>
          {menuItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors ${
                location.pathname === path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`w-full flex items-center justify-between px-6 py-3 transition-colors ${
                showSettings ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
            </button>

            {showSettings && (
              <div className="absolute bottom-full left-0 w-full bg-white border border-gray-100 rounded-t-lg shadow-lg">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-6 py-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}