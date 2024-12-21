import React, { useState, FormEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

// Components (Card, Button, Textarea, etc.) remain the same as before
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const Button: React.FC<{
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}> = ({ children, className = '', disabled, type = 'button' }) => (
  <button
    type={type}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 ${className}`}
  >
    {children}
  </button>
);

const Textarea: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  className?: string;
  rows?: number;
}> = ({ value, onChange, placeholder, className = '', rows = 1 }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={`flex min-h-[80px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  />
);

const Personal: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Updated handleSubmit function for the Personal component
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    setIsLoading(true);
    setError(null);
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
  
    try {
      const response = await fetch('http://localhost:5020/get_answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setMessages(prev => [...prev, { type: 'bot', content: data.answer }]);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to get response. Please try again.');
      setMessages(prev => prev.filter(msg => msg.content !== userMessage)); // Remove the failed message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
        </div>

        <div className="space-y-6">
          {/* Welcome Card */}
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Welcome to Your Financial Assistant</h2>
                  <p className="text-blue-50">Ask me anything about personal finance, investments, or budgeting.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="bg-red-50 border-red-200">
              <CardContent>
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Messages Container */}
          <div className="space-y-4">
            {messages.map((message, index) => (
              <Card key={index} className={`${
                message.type === 'user' 
                  ? 'bg-blue-50 ml-12' 
                  : 'bg-white mr-12'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100'
                    }`}>
                      {message.type === 'user' ? 'U' : 'AI'}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="sticky bottom-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your financial question..."
                    className="flex-1 resize-none"
                    rows={1}
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !input.trim()} 
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Personal;