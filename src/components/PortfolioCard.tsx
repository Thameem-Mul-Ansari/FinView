import React from 'react';

interface PortfolioCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ title, value, icon, change }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-semibold mt-1">{value}</p>
          </div>
        </div>
        {change && (
          <span className="text-sm text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export default PortfolioCard;