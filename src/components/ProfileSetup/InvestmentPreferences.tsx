import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowRight } from 'lucide-react';
import InvestmentCloud from '../InvestmentCloud';

const INVESTMENT_TYPES = [
  'Equities',
  'Bonds',
  'Mutual Funds',
  'Exchange Traded Funds',
  'Segregated Funds',
  'GICs',
  'Alternative Investments'
];

interface InvestmentPreferencesProps {
  onNext: (data: any) => void;
  userData: any;
}

export default function InvestmentPreferences({ onNext, userData }: InvestmentPreferencesProps) {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const handlePreferenceClick = (preference: string) => {
    setSelectedPreferences(prev => {
      if (prev.includes(preference)) {
        return prev.filter(p => p !== preference);
      }
      if (prev.length < 3) {
        return [...prev, preference];
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    try {
      const preferences = {
        user_id: userData.id,
        pref1: selectedPreferences[0] || '',
        pref2: selectedPreferences[1] || '',
        pref3: selectedPreferences[2] || ''
      };

      const { error } = await supabase
        .from('user_preferences')
        .insert([preferences]);

      if (error) throw error;
      
      onNext(preferences);
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
            Investment Preferences
          </h2>
          <p className="text-gray-400 text-lg">
            Choose up to 3 investment types that align with your financial goals
          </p>
        </div>

        {/* Investment Selection */}
        <InvestmentCloud
          investments={INVESTMENT_TYPES}
          selectedPreferences={selectedPreferences}
          onSelect={handlePreferenceClick}
        />

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={selectedPreferences.length === 0}
            className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 
              rounded-xl font-medium text-white shadow-lg shadow-blue-500/25 
              hover:shadow-blue-500/40 transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2">
              {selectedPreferences.length === 0 
                ? 'Select Your Preferences'
                : `Continue with ${selectedPreferences.length} Selection${selectedPreferences.length !== 1 ? 's' : ''}`
              }
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {selectedPreferences.length > 0 && (
            <p className="text-gray-500 text-sm animate-fade-in">
              Click on a selected investment again to remove it
            </p>
          )}
        </div>
      </div>
    </div>
  );
}