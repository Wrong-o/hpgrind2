import React, { useState } from 'react';
import { VideoPlayer } from '../VideoPlayer';
import { Calculator } from './Calculator';
import DrawingPad from './DrawingPad';

const QuizAssistant = ({ VideoName }) => {
    const [videoShowing, setVideoShowing] = useState(false);
    const [calculatorShowing, setCalculatorShowing] = useState(false);
    const [drawingPadShowing, setDrawingPadShowing] = useState(false);
    const handleVideoToggle = () => {
        setVideoShowing(!videoShowing);
    };

    const handleCalculatorToggle = () => {
        setCalculatorShowing(!calculatorShowing);
    };

    const handleDrawingPadToggle = () => {
        setDrawingPadShowing(!drawingPadShowing);
    };

    return (
        <div className="relative">
            <div className="flex gap-2">
                <button
                    onClick={handleVideoToggle}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    {videoShowing ? (
                        <>
                            <span>Stäng video</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </>
                    ) : (
                        <>
                            <span>Video exempel</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                        </>
                    )}
                </button>
                <button
                    onClick={handleCalculatorToggle}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    {calculatorShowing ? (
                        <>
                            <span>Stäng kalkylator</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </>
                    ) : (
                        <>
                            <span>Kalkylator</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
                            </svg>
                        </>
                    )}
                </button>
                <button
                    onClick={handleDrawingPadToggle}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    {drawingPadShowing ? (
                        <>
                            <span>Stäng ritning</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </>
                    ) : (
                        <>
                            <span>Rita</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </>
                    )}
                </button>
            </div>

            {/* Video player container */}
            {videoShowing && VideoName && (
                <div className="absolute top-14 right-0 w-64 aspect-video rounded-lg overflow-hidden shadow-lg z-10">
                    <VideoPlayer
                        autoPlay={true}
                        loop={true}
                        controls={true}
                        src={`${import.meta.env.BASE_URL}videos/${VideoName}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Calculator container */}
            {calculatorShowing && (
                <div className="absolute top-14 right-0 w-[300px] rounded-lg overflow-hidden shadow-lg z-20">
                    <Calculator />
                </div>
            )}

            {/* Drawing Pad container */}
            {drawingPadShowing && (
                <div 
                    className="absolute top-14 right-0 rounded-lg overflow-hidden shadow-lg z-30"
                    style={{ width: '400px', height: '600px' }}
                >
                    <DrawingPad />
                </div>
            )}
        </div>
    );
};

export default QuizAssistant;