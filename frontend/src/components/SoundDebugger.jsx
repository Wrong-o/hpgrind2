import React, { useState, useEffect } from 'react';
import { useSound } from '../contexts/SoundContext';
import { validateAllSoundPacks, playWithFallback } from '../utils/soundUtils';

/**
 * Component for debugging sound issues
 * Can be temporarily added to any page to diagnose sound problems
 */
const SoundDebugger = () => {
  const { soundPacks } = useSound();
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [expandedResults, setExpandedResults] = useState(true);
  
  const runValidation = async () => {
    setIsValidating(true);
    try {
      const results = await validateAllSoundPacks(soundPacks);
      setValidationResults(results);
    } catch (err) {
      console.error('Error validating sound packs:', err);
    } finally {
      setIsValidating(false);
    }
  };
  
  const playTestSound = async (packId, soundType) => {
    const soundPath = soundPacks[packId]?.sounds[soundType];
    if (soundPath) {
      const success = await playWithFallback(soundPath);
      console.log(`Test play ${packId}/${soundType}: ${success ? 'Success' : 'Failed'}`);
    } else {
      console.error(`Sound not found: ${packId}/${soundType}`);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50 border border-gray-300">
      <div 
        className="bg-blue-500 text-white p-2 flex justify-between items-center cursor-pointer"
        onClick={() => setExpandedResults(!expandedResults)}
      >
        <h3 className="font-medium">Sound Debugger</h3>
        <span>{expandedResults ? '▼' : '▲'}</span>
      </div>
      
      {expandedResults && (
        <div className="p-3">
          <div className="mb-3">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full" 
              onClick={runValidation}
              disabled={isValidating}
            >
              {isValidating ? 'Validating...' : 'Validate All Sound Files'}
            </button>
          </div>
          
          {validationResults && (
            <div className="mt-2 text-xs">
              <h4 className="font-medium mb-2">Validation Results:</h4>
              <div className="max-h-60 overflow-auto border rounded p-2">
                {Object.entries(validationResults).map(([packId, results]) => (
                  <div key={packId} className="mb-2">
                    <div className={`font-bold ${results.valid ? 'text-green-600' : 'text-red-600'}`}>
                      {packId}: {results.valid ? '✓' : '✗'}
                    </div>
                    
                    {/* Show test play buttons for each sound type */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.keys(soundPacks[packId]?.sounds || {}).map(soundType => (
                        <button
                          key={soundType}
                          onClick={() => playTestSound(packId, soundType)}
                          className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300"
                        >
                          Play {soundType}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-3 text-xs text-gray-500">
            <p>Common issues:</p>
            <ul className="list-disc pl-4 mt-1">
              <li>Incorrect file paths in SoundContext.jsx</li>
              <li>Missing sound files in public folder</li>
              <li>Server not configured to serve audio files correctly</li>
              <li>Mixed content issues (HTTP/HTTPS)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundDebugger; 