import { useState } from 'react';
import LandingView from './components/LandingView';
import ItineraryResultView from './components/ItineraryResultView';
import { generateRealItinerary } from './utils/geminiEngine';

function App() {
  const [view, setView] = useState('form'); // 'form' or 'result'
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [itineraryData, setItineraryData] = useState(null);

  const handleGenerateItinerary = async (formData) => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Async call pointing to real Gemini API Engine
      const generatedData = await generateRealItinerary(formData);
      setItineraryData(generatedData);
      setView('result');
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurred while analyzing data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setView('form');
    setItineraryData(null);
  };

  return (
    <main className="w-full flex-grow relative overflow-x-hidden">
      {view === 'form' && (
        <LandingView 
          onSubmit={handleGenerateItinerary} 
          isLoading={isLoading} 
          errorMessage={errorMessage}
        />
      )}
      
      {view === 'result' && itineraryData && (
        <ItineraryResultView 
          data={itineraryData} 
          onStartOver={handleStartOver} 
        />
      )}
    </main>
  );
}

export default App;
