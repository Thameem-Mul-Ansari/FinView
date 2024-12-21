import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import BasicInfo from '../components/ProfileSetup/BasicInfo';
import WatchlistSetup from '../components/ProfileSetup/WatchlistSetup';
import InvestmentPreferences from '../components/ProfileSetup/InvestmentPreferences';

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signin');
        return;
      }
      setUserData(session.user);
    };

    checkSession();
  }, [navigate]);

  const handleBasicInfoComplete = (data: any) => {
    setStep(2);
  };

  const handlePreferencesComplete = (data: any) => {
    setStep(3);
  };

  const handleSetupComplete = (data: any) => {
    navigate('/dashboard');
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-center">
            <nav className="flex items-center space-x-4">
              {[1, 2, 3].map((number) => (
                <div
                  key={number}
                  className={`flex items-center ${
                    number !== 1 && 'ml-4'
                  }`}
                >
                  {number !== 1 && (
                    <div
                      className={`h-0.5 w-12 ${
                        step >= number ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= number
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {number}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {step === 1 && <BasicInfo onNext={handleBasicInfoComplete} userData={userData} />}
        {step === 2 && <InvestmentPreferences onNext={handlePreferencesComplete} userData={userData} />}
        {step === 3 && <WatchlistSetup onComplete={handleSetupComplete} userData={userData} finnhubApiKey="ct0rak9r01qkfpo5sd1gct0rak9r01qkfpo5sd20"/>}
      </div>
    </div>
  );
}