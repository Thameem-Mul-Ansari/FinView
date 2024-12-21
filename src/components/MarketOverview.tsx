import { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

const finnhubApiKey="ct0rak9r01qkfpo5sd1gct0rak9r01qkfpo5sd20"; 

interface StockData {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export function MarketOverview() {
  const [marketData, setMarketData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll functionality
  useEffect(() => {
    if (!marketData.length) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const nextIndex = (currentIndex + 1) % marketData.length;
        const cardWidth = 280; // Width of each card
        const gap = 16; // Gap between cards (4 in rem = 16px)
        
        scrollRef.current.scrollTo({
          left: nextIndex * (cardWidth + gap),
          behavior: 'smooth'
        });
        
        setCurrentIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, marketData.length]);

  // Fetch user ID from Supabase auth
  const fetchUserId = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) throw new Error('User not authenticated');
      return data.user.id;
    } catch (err: any) {
      setError('Failed to fetch user ID.');
      console.error(err);
      return null;
    }
  };

  // Fetch watchlist data from Supabase
  const fetchWatchlist = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_watchlists')
        .select('watchlist1, watchlist2, watchlist3, watchlist4, watchlist5')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      const symbols = [
        data.watchlist1,
        data.watchlist2,
        data.watchlist3,
        data.watchlist4,
        data.watchlist5
      ].filter(Boolean);

      return symbols;
    } catch (err: any) {
      setError('Failed to fetch watchlist.');
      console.error(err);
      return [];
    }
  };

  // Fetch stock data from Finnhub
  const fetchStockData = async (symbols: string[]) => {
    try {
      const stockPromises = symbols.map(async (symbol) => {
        const [quoteResponse, companyResponse] = await Promise.all([
          fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`),
          fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${finnhubApiKey}`)
        ]);

        const quoteData = await quoteResponse.json();
        const companyData = await companyResponse.json();

        if (quoteData.c && companyData.name) {
          const change = ((quoteData.c - quoteData.pc) / quoteData.pc) * 100;
          return {
            name: companyData.name,
            value: quoteData.c.toFixed(2),
            change: `${change.toFixed(2)}%`,
            isPositive: change >= 0
          };
        }
        return null;
      });

      const stocks = await Promise.all(stockPromises);
      return stocks.filter((stock): stock is StockData => stock !== null);
    } catch (err) {
      setError('Failed to fetch stock data.');
      console.error(err);
      return [];
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const userId = await fetchUserId();
        if (!userId) return;

        const watchlistSymbols = await fetchWatchlist(userId);
        const stocks = await fetchStockData(watchlistSymbols);
        setMarketData(stocks);
      } catch {
        setMarketData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-hide"
        onScroll={(e) => {
          const element = e.currentTarget;
          const cardWidth = 280 + 16; // card width + gap
          const newIndex = Math.round(element.scrollLeft / cardWidth);
          if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
          }
        }}
      >
        {marketData.map((item) => (
          <div 
            key={item.name} 
            className="flex-none w-[280px] snap-start bg-white rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{item.name}</span>
              {item.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="mt-2">
              <span className="text-xl font-semibold text-gray-900">${item.value}</span>
              <span
                className={`ml-2 text-sm ${
                  item.isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}