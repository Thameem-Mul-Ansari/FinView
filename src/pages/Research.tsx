import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { SearchBar } from '../components/SearchBar';
import { Sidebar } from '../components/Sidebar';
import { Brain, TrendingUp, AlertCircle, Loader2, XCircle } from 'lucide-react';


interface AnalysisResult {
  result: string;
}

interface AnalysisState {
  loading: boolean;
  error: string | null;
  result: string | null;
  progress: string[];
}

const useStockAnalysis = () => {
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    error: null,
    result: null,
    progress: []
  });

  const socket = io('http://localhost:5000', {
    transports: ['websocket'],
    autoConnect: false
  });

  useEffect(() => {
    socket.on('analysis_progress', (message: string) => {
      setState(prev => ({
        ...prev,
        progress: [...prev.progress, message]
      }));
    });

    socket.on('analysis_complete', (result: string) => {
      setState(prev => ({
        ...prev,
        loading: false,
        result
      }));
    });

    socket.on('analysis_error', (error: string) => {
      setState(prev => ({
        ...prev,
        loading: false,
        error
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const analyzeStock = async (symbol: string) => {
    setState({
      loading: true,
      error: null,
      result: null,
      progress: []
    });

    try {
      socket.connect();
      const response = await fetch('http://localhost:5000/run_financial_analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company: symbol }),
      });

      if (!response.ok) {
        throw new Error('Analysis request failed');
      }

      const data = await response.json() as AnalysisResult;
      setState(prev => ({
        ...prev,
        loading: false,
        result: data.result
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'An error occurred'
      }));
    } finally {
      socket.disconnect();
    }
  };

  return { ...state, analyzeStock };
};

const AnalysisProgress = ({ messages }: { messages: string[] }) => (
  <div className="mt-4 space-y-2">
    {messages.map((message, index) => (
      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <span>{message}</span>
      </div>
    ))}
  </div>
);

const Research = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const { loading, error, result, progress, analyzeStock } = useStockAnalysis();

  const handleStockSelect = async (symbol: string) => {
    setSelectedStock(symbol);
    await analyzeStock(symbol);
  };

  const AnalysisSection = () => {
    if (!selectedStock) return null;

    if (loading) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <p className="text-gray-600">Analyzing {selectedStock}...</p>
            </div>
            <AnalysisProgress messages={progress} />
          </div>
        </div>
      );
    }

    if (result) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Analysis Results for {selectedStock}
          </h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-600">{result}</div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            System Two Thinking Researcher
          </h1>
          <p className="text-gray-600">
            Make informed investment decisions with our AI-powered stock analysis tool
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Stock Analysis
            </h2>
            <SearchBar onStockSelect={handleStockSelect} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <Brain className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="font-semibold text-gray-800">Deep Analysis</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Our system performs comprehensive fundamental and technical analysis
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="font-semibold text-gray-800">Market Trends</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Get insights into market trends and potential opportunities
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-orange-500 mr-2" />
              <h3 className="font-semibold text-gray-800">Risk Assessment</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Understand potential risks and volatility factors
            </p>
          </div>
        </div>

        <AnalysisSection />
      </div>
    </div>
  );
};

export default Research;