import React, { useState } from 'react';
import { VideoPlayer } from '../VideoPlayer';
import { Calculator } from './Calculator';
import DrawingPad from './DrawingPad';
import AIChatWindow from './AIChatWindow';
import { PlayCircleIcon, CalculatorIcon, PencilIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';

const QuizAssistant = ({ VideoName, Question }) => {
    // Replace multiple state variables with a single activeHelp state
    const [activeHelp, setActiveHelp] = useState(null); // 'video', 'calculator', 'drawing', 'chat', or null
    const { getThemeClasses, themeData } = useTheme();

    // Single toggle function to handle all help types
    const toggleHelp = (helpType) => {
        if (activeHelp === helpType) {
            // If clicking the active help, turn it off
            setActiveHelp(null);
        } else {
            // Otherwise, switch to the clicked help
            setActiveHelp(helpType);
        }
    };

    // Helper function to check if a help type is active
    const isActive = (helpType) => activeHelp === helpType;

    // Get active button class based on current theme
    const getActiveButtonClass = () => {
        return `bg-${themeData.primary}-500 text-white`;
    };

    return (
        <div className="relative">
            {/* Single bar with 4 icons */}
            <div className={`${getThemeClasses('card')} rounded-lg shadow-md p-2 flex justify-between gap-2`}>
                <button 
                    onClick={() => toggleHelp('video')}
                    className={`p-2 rounded-full flex items-center justify-center transition-colors ${
                        isActive('video') 
                            ? getActiveButtonClass()
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Video exempel"
                >
                    <PlayCircleIcon className="w-6 h-6" />
                </button>

                <button 
                    onClick={() => toggleHelp('calculator')}
                    className={`p-2 rounded-full flex items-center justify-center transition-colors ${
                        isActive('calculator') 
                            ? getActiveButtonClass()
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Kalkylator"
                >
                    <CalculatorIcon className="w-6 h-6" />
                </button>

                <button 
                    onClick={() => toggleHelp('drawing')}
                    className={`p-2 rounded-full flex items-center justify-center transition-colors ${
                        isActive('drawing') 
                            ? getActiveButtonClass()
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Rita"
                >
                    <PencilIcon className="w-6 h-6" />
                </button>

                <button 
                    onClick={() => toggleHelp('chat')}
                    className={`p-2 rounded-full flex items-center justify-center transition-colors ${
                        isActive('chat') 
                            ? getActiveButtonClass()
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="AI chat"
                >
                    <ChatBubbleLeftIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Component display area */}
            <div className="absolute top-16 right-0 flex flex-col gap-4">
                {/* Video player */}
                {isActive('video') && VideoName && (
                    <div className={`w-[400px] rounded-lg overflow-hidden shadow-lg mt-4 ${getThemeClasses('card')}`}>
                        <VideoPlayer
                            autoPlay={true}
                            loop={true}
                            controls={true}
                            src={`${import.meta.env.BASE_URL}videos/${VideoName}`}
                            className="w-full aspect-video"
                            isDraggable={true}
                        />
                    </div>
                )}

                {/* Calculator */}
                {isActive('calculator') && (
                    <div className={`w-[300px] rounded-lg overflow-hidden shadow-lg mt-4 ${getThemeClasses('card')}`}>
                        <Calculator />
                    </div>
                )}

                {/* Drawing Pad */}
                {isActive('drawing') && (
                    <div 
                        className={`rounded-lg overflow-hidden shadow-lg mt-4 ${getThemeClasses('card')}`}
                        style={{ width: '400px', height: '400px' }}
                    >
                        <DrawingPad />
                    </div>
                )}

                {/* AI Chat Window */}
                {isActive('chat') && (
                    <div className="mt-4">
                        <AIChatWindow Question={Question} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizAssistant;