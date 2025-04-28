import React, { useState } from 'react';
import { VideoPlayer } from '../VideoPlayer';
import { Calculator } from './Calculator';
import DrawingPad from './DrawingPad';
import SmallButton from '../SmallButton';
import AIChatWindow from './AIChatWindow';
import { PlayCircleIcon, CalculatorIcon, PencilIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const QuizAssistant = ({ VideoName, Question }) => {
    const [videoShowing, setVideoShowing] = useState(false);
    const [calculatorShowing, setCalculatorShowing] = useState(false);
    const [drawingPadShowing, setDrawingPadShowing] = useState(false);
    const [chatShowing, setChatShowing] = useState(false);

    const handleVideoToggle = () => {
        setVideoShowing(!videoShowing);
    };

    const handleCalculatorToggle = () => {
        setCalculatorShowing(!calculatorShowing);
    };

    const handleDrawingPadToggle = () => {
        setDrawingPadShowing(!drawingPadShowing);
    };

    const handleChatToggle = () => {
        setChatShowing(!chatShowing);
    };

    return (
        <div className="relative">
            {/* Buttons stacked vertically */}
            <div className="flex flex-col gap-2">
                <SmallButton
                    text={videoShowing ? "Stäng video" : "Video exempel"}
                    onClick={handleVideoToggle}
                    icon={<PlayCircleIcon className="w-5 h-5" />}
                    className={videoShowing ? "bg-green-600 hover:bg-green-700" : ""}
                />
                <SmallButton
                    text={calculatorShowing ? "Stäng kalkylator" : "Kalkylator"}
                    onClick={handleCalculatorToggle}
                    icon={<CalculatorIcon className="w-5 h-5" />}
                    className={calculatorShowing ? "bg-green-600 hover:bg-green-700" : ""}
                />
                <SmallButton
                    text={drawingPadShowing ? "Stäng ritning" : "Rita"}
                    onClick={handleDrawingPadToggle}
                    icon={<PencilIcon className="w-5 h-5" />}
                    className={drawingPadShowing ? "bg-green-600 hover:bg-green-700" : ""}
                />
                <SmallButton
                    text={chatShowing ? "Stäng AI chat" : "AI chat"}
                    onClick={handleChatToggle}
                    icon={<ChatBubbleLeftIcon className="w-5 h-5" />}
                    className={chatShowing ? "bg-green-600 hover:bg-green-700" : ""}
                />
            </div>

            {/* Components stacked vertically */}
            <div className="absolute top-28 right-0 flex flex-col gap-4">
                {/* Video player container - top */}
                {videoShowing && VideoName && (
                    <div className="w-[400px] rounded-lg overflow-hidden shadow-lg mt-4">
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

                {/* Calculator container - middle */}
                {calculatorShowing && (
                    <div className="w-[300px] rounded-lg overflow-hidden shadow-lg mt-4">
                        <Calculator />
                    </div>
                )}

                {/* Drawing Pad container */}
                {drawingPadShowing && (
                    <div 
                        className="rounded-lg overflow-hidden shadow-lg mt-4"
                        style={{ width: '400px', height: '400px' }}
                    >
                        <DrawingPad />
                    </div>
                )}

                {/* AI Chat Window container */}
                {chatShowing && (
                    <div className="mt-4">
                        <AIChatWindow Question={Question} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizAssistant;