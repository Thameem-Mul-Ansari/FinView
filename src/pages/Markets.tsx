import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, Filter, TrendingUp } from "lucide-react";
import { Sidebar } from "../components/Sidebar";

const TradingViewWidget = ({ symbol }) => {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${symbol}",
        "interval": "D",
        "timezone": "exchange",
        "theme": "light",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_advanced_chart"
      }`;
    container.current.innerHTML = "";
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="tradingview-widget-container h-full" ref={container}>
      <div id="tradingview_advanced_chart" className="tradingview-widget-container__widget h-full"></div>
    </div>
  );
};

const MarketSummary = ({ categoryData }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {categoryData.map((item, index) => (
      <div
        key={index}
        className="bg-white p-4 rounded-lg shadow border hover:shadow-lg transition-shadow"
      >
        <h3 className="font-semibold text-gray-900">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.symbol}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-bold">${item.price}</span>
          <span
            className={`text-sm font-medium ${
              item.change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {item.change >= 0 ? "+" : ""}
            {item.change}%
          </span>
        </div>
      </div>
    ))}
  </div>
);

const Markets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Indices");
  const [selectedSymbol, setSelectedSymbol] = useState("SP:SPX");

  // Mock Data (Replace with API data for real functionality)
  const mockData = {
    Indices: [
      { title: "S&P 500", symbol: "SP:SPX", price: "4,563.45", change: 0.87 },
      { title: "Dow Jones", symbol: "DJ:DJI", price: "34,029.87", change: -0.34 },
    ],
    Stocks: [
      { title: "Tesla", symbol: "NASDAQ:TSLA", price: "245.67", change: 3.45 },
      { title: "Apple", symbol: "NASDAQ:AAPL", price: "171.29", change: 1.56 },
    ],
    ETFs: [
      { title: "SPDR S&P 500", symbol: "ARCX:SPY", price: "450.89", change: 0.45 },
      { title: "Invesco QQQ", symbol: "NASDAQ:QQQ", price: "375.67", change: 0.67 },
    ],
    Crypto: [
      { title: "Bitcoin", symbol: "COINBASE:BTCUSD", price: "43,567.89", change: 2.34 },
      { title: "Ethereum", symbol: "COINBASE:ETHUSD", price: "2,345.67", change: -1.23 },
    ],
    Forex: [
      { title: "EUR/USD", symbol: "FX:EURUSD", price: "1.1956", change: 0.12 },
      { title: "USD/JPY", symbol: "FX:USDJPY", price: "109.45", change: -0.23 },
    ],
    Futures: [
      { title: "Gold", symbol: "COMEX:GC1!", price: "1,734.20", change: 0.56 },
      { title: "Crude Oil", symbol: "NYMEX:CL1!", price: "69.56", change: -1.34 },
    ],
    Bonds: [
      { title: "10-Year Bond", symbol: "US10Y", price: "1.75", change: 0.05 },
      { title: "30-Year Bond", symbol: "US30Y", price: "2.45", change: 0.03 },
    ],
  };

  const categoryData = mockData[activeTab] || [];

  const filteredData = categoryData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Sidebar/>
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search markets, symbols, or assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-gray-600" />
          </div>
        </div>
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          {Object.keys(mockData).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium ${
                activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
              }`}
              onClick={() => {
                setActiveTab(tab);
                setSelectedSymbol(mockData[tab][0]?.symbol || "");
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Market Summary */}
        <MarketSummary categoryData={filteredData} />

        {/* Chart */}
        <div className="mt-8 bg-white rounded-lg shadow-lg h-[calc(100vh-22rem)]">
          <TradingViewWidget symbol={selectedSymbol} />
        </div>
      </div>
    </div>
  );
};

export default Markets;