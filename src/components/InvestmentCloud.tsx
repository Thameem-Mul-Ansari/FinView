import { TrendingUp, Wallet, LineChart } from 'lucide-react';

interface InvestmentCloudProps {
  investments: string[];
  selectedPreferences: string[];
  onSelect: (investment: string) => void;
}

const getIcon = (index: number) => {
  const icons = [TrendingUp, Wallet, LineChart];
  const Icon = icons[index % icons.length];
  return <Icon className="w-4 h-4" />;
};

export default function InvestmentCloud({ investments, selectedPreferences, onSelect }: InvestmentCloudProps) {
  return (
    <div className="relative h-[500px] w-full bg-[#0A0F1C] rounded-3xl p-8 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500/10 animate-pulse"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 4 + 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Investment Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-4 h-full">
        {investments.map((investment, index) => {
          const isSelected = selectedPreferences.includes(investment);
          const order = selectedPreferences.indexOf(investment) + 1;

          return (
            <button
              key={investment}
              onClick={() => onSelect(investment)}
              className={`
                group relative overflow-hidden
                rounded-xl transition-all duration-300
                ${isSelected 
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 scale-105 shadow-xl shadow-blue-500/20'
                  : 'bg-white/5 hover:bg-white/10'
                }
              `}
            >
              {/* Background Animation */}
              <div className="absolute inset-0 opacity-50">
                <div 
                  className={`
                    absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                    transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000
                  `}
                />
              </div>

              {/* Content */}
              <div className="relative p-4 h-full flex flex-col items-center justify-center text-center gap-3">
                <div className={`
                  p-3 rounded-full 
                  ${isSelected ? 'bg-white/20' : 'bg-white/5'}
                `}>
                  {getIcon(index)}
                </div>
                
                <span className={`
                  font-medium transition-colors duration-300
                  ${isSelected ? 'text-white' : 'text-gray-300'}
                `}>
                  {investment}
                </span>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 
                    flex items-center justify-center text-sm font-bold text-white">
                    {order}
                  </div>
                )}
              </div>

              {/* Hover Effect */}
              <div className={`
                absolute inset-0 border-2 rounded-xl transition-colors duration-300
                ${isSelected 
                  ? 'border-white/20' 
                  : 'border-transparent group-hover:border-white/10'
                }
              `} />
            </button>
          );
        })}
      </div>
    </div>
  );
}