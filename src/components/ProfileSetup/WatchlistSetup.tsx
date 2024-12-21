import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Star, AlertCircle, X, Link } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Type definitions
interface Stock {
  symbol: string;
  name: string;
  price?: number;
  change?: number;
  industry?: string;
}

interface WatchlistSetupProps {
  onComplete: (watchlist: WatchlistData) => void;
  userData: {
    id: string;
  };
  finnhubApiKey: string;
}

interface WatchlistData {
  user_id: string;
  stocks: {
    symbol: string;
    added_at: string;
  }[];
}

const POPULAR_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NFLX', 'NVDA'];

const WatchlistSetup: React.FC<WatchlistSetupProps> = ({ onComplete, userData, finnhubApiKey }) => {
  const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [popularStocks, setPopularStocks] = useState<Stock[]>([]);
  const [similarStocks, setSimilarStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [error, setError] = useState('');

  // Fetch stock data from Finnhub
  const fetchStockData = async (symbol: string): Promise<Stock | null> => {
    try {
      const [quoteResponse, companyResponse] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`),
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${finnhubApiKey}`)
      ]);

      const quoteData = await quoteResponse.json();
      const companyData = await companyResponse.json();

      if (quoteData.c && companyData.name) {
        return {
          symbol,
          name: companyData.name,
          price: quoteData.c,
          change: ((quoteData.c - quoteData.pc) / quoteData.pc) * 100,
          industry: companyData.finnhubIndustry
        };
      }
      return null;
    } catch (err) {
      console.error(`Error fetching data for ${symbol}:`, err);
      return null;
    }
  };

  // Fetch similar stocks based on peer companies
  const fetchSimilarStocks = async (symbol: string) => {
    setLoadingSimilar(true);
    try {
      // Get peer companies
      const peersResponse = await fetch(
        `https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${finnhubApiKey}`
      );
      const peers = await peersResponse.json();
      
      // Get data for up to 4 peer companies
      const peerPromises = peers
        .filter((peer: string) => peer !== symbol)
        .slice(0, 4)
        .map((peer: string) => fetchStockData(peer));
      
      const peerStocks = await Promise.all(peerPromises);
      const validPeerStocks = peerStocks.filter((stock): stock is Stock => stock !== null);
      setSimilarStocks(validPeerStocks);
    } catch (err) {
      console.error('Error fetching similar stocks:', err);
    } finally {
      setLoadingSimilar(false);
    }
  };

  // Update similar stocks when selected stocks change
  useEffect(() => {
    if (selectedStocks.length > 0) {
      // Get the most recently added stock
      const lastStock = selectedStocks[selectedStocks.length - 1];
      fetchSimilarStocks(lastStock.symbol);
    } else {
      setSimilarStocks([]);
    }
  }, [selectedStocks]);

  // Rest of the existing functions...
  const fetchPopularStocks = async () => {
    setLoading(true);
    try {
      const stockPromises = POPULAR_SYMBOLS.map(symbol => fetchStockData(symbol));
      const stocks = await Promise.all(stockPromises);
      const validStocks = stocks.filter((stock): stock is Stock => stock !== null);
      setPopularStocks(validStocks);
    } catch (err) {
      setError('Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularStocks();
  }, [finnhubApiKey]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/search?q=${query}&token=${finnhubApiKey}`
      );
      const data = await response.json();
      
      const stockPromises = data.result
        .slice(0, 5)
        .map((result: { symbol: string }) => fetchStockData(result.symbol));
      
      const stocks = await Promise.all(stockPromises);
      const validStocks = stocks.filter((stock): stock is Stock => stock !== null);
      setSearchResults(validStocks);
    } catch (err) {
      setError('Search failed. Please try again.');
    }
  };

  const handleStockSelect = (stock: Stock) => {
    setSelectedStocks(prev => {
      if (prev.find(s => s.symbol === stock.symbol)) {
        return prev.filter(s => s.symbol !== stock.symbol);
      }
      if (prev.length < 5) {
        return [...prev, stock];
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedStocks.length === 0) {
        setError('Please select at least one stock to save your watchlist.');
        return;
      }
  
      const { error } = await supabase.from('user_watchlists').insert({
        user_id: userData.id,
        watchlist1: selectedStocks[0]?.symbol || null,
        watchlist2: selectedStocks[1]?.symbol || null,
        watchlist3: selectedStocks[2]?.symbol || null,
        watchlist4: selectedStocks[3]?.symbol || null,
        watchlist5: selectedStocks[4]?.symbol || null,
      });
  
      if (error) {
        console.error('Error inserting watchlist:', error);
        setError('Failed to save watchlist. Please try again.');
        return;
      }
  
      onComplete({
        user_id: userData.id,
        stocks: selectedStocks.map(stock => ({
          symbol: stock.symbol,
          added_at: new Date().toISOString(),
        })),
      });
  
      setError(''); // Clear error if any
    } catch (err) {
      console.error('Unexpected error saving watchlist:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // Stock Card Component
  const StockCard = ({ stock, selected = false }: { stock: Stock; selected?: boolean }) => (
    <button
      onClick={() => handleStockSelect(stock)}
      className={`p-4 rounded-lg border transition-all ${
        selected
          ? 'border-indigo-600 bg-indigo-50'
          : 'border-gray-200 hover:border-indigo-600 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{stock.symbol}</div>
          <div className="text-sm text-gray-600 truncate">
            {stock.name}
          </div>
          {stock.industry && (
            <div className="text-xs text-gray-500 mt-1">{stock.industry}</div>
          )}
        </div>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <div className="font-medium">${stock.price?.toFixed(2)}</div>
        <div className={`text-sm ${stock.change && stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stock.change?.toFixed(2)}%
        </div>
      </div>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
      {/* Header and search sections remain the same */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">Create Your Watchlist</h2>
        </div>
        <p className="text-gray-600">
          Select up to 5 stocks to track their performance
        </p>
      </div>

      <div className="p-6">
        {error && (
          <div className="p-4 rounded-lg flex items-center gap-2 bg-red-50 text-red-700 mb-6">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Search Section */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search stocks by symbol or company name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                {searchResults.map(stock => (
                  <button
                    key={stock.symbol}
                    onClick={() => handleStockSelect(stock)}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <div className="font-semibold">{stock.symbol}</div>
                      <div className="text-sm text-gray-600">{stock.name}</div>
                      {stock.industry && (
                        <div className="text-xs text-gray-500">{stock.industry}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${stock.price?.toFixed(2)}</div>
                      <div className={`text-sm ${stock.change && stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change?.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Stocks */}
          {selectedStocks.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Selected Stocks ({selectedStocks.length}/5)</h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {selectedStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{stock.symbol}</div>
                        <div className="text-sm text-gray-600">{stock.name}</div>
                        {stock.industry && (
                          <div className="text-xs text-gray-500">{stock.industry}</div>
                        )}
                      </div>
                      <button
                        onClick={() => handleStockSelect(stock)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Stocks */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold">Popular Stocks</h3>
            </div>
            
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-100 h-24 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {popularStocks.map(stock => (
                  <StockCard 
                    key={stock.symbol} 
                    stock={stock} 
                    selected={selectedStocks.some(s => s.symbol === stock.symbol)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Similar Stocks Section */}
          {selectedStocks.length > 0 && similarStocks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Link className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold">Similar Stocks</h3>
                <span className="text-sm text-gray-600">
                  Based on {selectedStocks[selectedStocks.length - 1].name}
                </span>
              </div>
              
              {loadingSimilar ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-100 h-24 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {similarStocks.map(stock => (
                    <StockCard 
                      key={stock.symbol} 
                      stock={stock} 
                      selected={selectedStocks.some(s => s.symbol === stock.symbol)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={selectedStocks.length === 0}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200"
            >
              Complete Setup ({selectedStocks.length}/5 Selected)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchlistSetup;