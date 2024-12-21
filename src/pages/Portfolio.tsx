import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { DayPicker, DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Sidebar } from '../components/Sidebar';
import { DollarSign, TrendingUp, ShieldAlert, Shield, Brain, Sparkles, ChartLine, Workflow } from 'lucide-react';
import { supabase } from '../lib/supabase';
import APIForm from '../components/APIForm';
import PortfolioCard from '../components/PortfolioCard';
import 'react-day-picker/dist/style.css';

interface AccountInfo {
  portfolio_value: number;
  buying_power: number;
  initial_margin: number;
  maintenance_margin: number;
}

interface AlpacaCredentials {
  alpaca_api_key: string;
  alpaca_api_secret: string;
  alpaca_base_url: string;
}

interface TradingStrategy {
  name: string;
  icon: JSX.Element;
  description: string;
}

function Portfolio() {
  const [isConnected, setIsConnected] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

  const tradingStrategies: TradingStrategy[] = [
    {
      name: "Sentiment Analysis",
      icon: <Brain className="h-5 w-5" />,
      description: "Trade based on market sentiment and news analysis"
    },
    {
      name: "Reinforcement Learning",
      icon: <Sparkles className="h-5 w-5" />,
      description: "AI-powered trading decisions using RL algorithms"
    },
    {
      name: "Technical Analysis",
      icon: <ChartLine className="h-5 w-5" />,
      description: "Trade using technical indicators and patterns"
    },
    {
      name: "Mean Reversion",
      icon: <Workflow className="h-5 w-5" />,
      description: "Capitalize on price deviations from historical average"
    }
  ];

  useEffect(() => {
    checkExistingCredentials();
  }, []);

  const checkExistingCredentials = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('alpaca_api_key, alpaca_api_secret, alpaca_base_url')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data && data.alpaca_api_key) {
        setIsConnected(true);
        await fetchAccountInfo(data as AlpacaCredentials);
      }
    } catch (error) {
      console.error('Error checking credentials:', error);
    }
  };

  const fetchAccountInfo = async (credentials: AlpacaCredentials) => {
    try {
      const response = await fetch(`${credentials.alpaca_base_url}/v2/account`, {
        headers: {
          'APCA-API-KEY-ID': credentials.alpaca_api_key,
          'APCA-API-SECRET-KEY': credentials.alpaca_api_secret,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch account info');

      const data = await response.json();
      setAccountInfo({
        portfolio_value: parseFloat(data.portfolio_value),
        buying_power: parseFloat(data.buying_power),
        initial_margin: parseFloat(data.initial_margin),
        maintenance_margin: parseFloat(data.maintenance_margin),
      });
    } catch (error) {
      console.error('Error fetching account info:', error);
    }
  };

  const handleAPISuccess = async (credentials: {
    apiKey: string;
    apiSecret: string;
    baseUrl: string;
  }) => {
    setIsConnected(true);
    await fetchAccountInfo({
      alpaca_api_key: credentials.apiKey,
      alpaca_api_secret: credentials.apiSecret,
      alpaca_base_url: credentials.baseUrl,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Sidebar />
      
      <div className="ml-64 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Your Portfolio</h1>
        
        {!isConnected ? (
          <APIForm onSuccess={handleAPISuccess} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <PortfolioCard
                title="Portfolio Value"
                value={accountInfo ? formatCurrency(accountInfo.portfolio_value) : '$0.00'}
                icon={<DollarSign className="h-5 w-5 text-blue-600" />}
              />
              <PortfolioCard
                title="Buying Power"
                value={accountInfo ? formatCurrency(accountInfo.buying_power) : '$0.00'}
                icon={<TrendingUp className="h-5 w-5 text-green-600" />}
              />
              <PortfolioCard
                title="Initial Margin"
                value={accountInfo ? formatCurrency(accountInfo.initial_margin) : '$0.00'}
                icon={<ShieldAlert className="h-5 w-5 text-orange-600" />}
              />
              <PortfolioCard
                title="Maintenance Margin"
                value={accountInfo ? formatCurrency(accountInfo.maintenance_margin) : '$0.00'}
                icon={<Shield className="h-5 w-5 text-purple-600" />}
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Select Date Range</h2>
                <div className="flex flex-col items-center">
                  <DayPicker
                    mode="range"
                    selected={selectedRange}
                    onSelect={setSelectedRange}
                    className="border rounded-lg p-4"
                  />
                  <div className="mt-4 text-center">
                    <p className="text-gray-600">
                      {selectedRange?.from ? (
                        <>
                          <span>Start: {format(selectedRange.from, 'PPP')}</span>
                          {selectedRange.to && (
                            <span className="ml-4">End: {format(selectedRange.to, 'PPP')}</span>
                          )}
                        </>
                      ) : (
                        'Please select a date range'
                      )}
                    </p>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => console.log('Backtesting...', selectedRange)}
                    >
                      Backtesting
                    </button>
                    <button
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => console.log('Starting trade...', selectedRange)}
                    >
                      Start Trading
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/3 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Trading Strategies</h2>
                <div className="space-y-4">
                  {tradingStrategies.map((strategy, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      onClick={() => console.log(`Selected ${strategy.name}`)}
                    >
                      <div className="p-2 bg-gray-100 rounded-full">
                        {strategy.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">{strategy.name}</h3>
                        <p className="text-sm text-gray-600">{strategy.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Portfolio;