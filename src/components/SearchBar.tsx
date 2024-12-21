import { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, X, Loader2 } from 'lucide-react';
import { searchStocks, YahooStock } from '../lib/yahooFinance';
import { useDebounce } from '../lib/useDebounce';

interface SearchBarProps {
  onStockSelect?: (symbol: string) => void;
}

export function SearchBar({ onStockSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<YahooStock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 1) {
        setSuggestions([]);
        setShowSuggestions(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await searchStocks(debouncedQuery);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setError('Failed to fetch suggestions. Please try again.');
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSubmit = (symbol: string) => {
    setShowSuggestions(false);
    setQuery(symbol);
    onStockSelect?.(symbol);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query) {
              handleSubmit(query);
            }
          }}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-sm"
          placeholder="Search stocks (e.g., AAPL, Tesla, MSFT)"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-12 flex items-center pr-2"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
        <button
          onClick={() => query && handleSubmit(query)}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <ArrowRight className="h-5 w-5 text-gray-400 hover:text-blue-500" />
        </button>
      </div>

      {error && (
        <div className="absolute mt-1 w-full bg-red-50 text-red-600 text-sm rounded-lg p-3 border border-red-200">
          {error}
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <ul className="py-1 max-h-96 overflow-auto">
            {suggestions.map((stock) => (
              <li
                key={stock.symbol}
                onClick={() => handleSubmit(stock.symbol)}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition duration-150"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">{stock.symbol}</span>
                    <span className="ml-2 text-sm text-gray-500">{stock.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">{stock.exchange}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}