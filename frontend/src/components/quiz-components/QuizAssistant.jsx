import React, { useState } from 'react';
import { VideoPlayer } from '../VideoPlayer';
import { Calculator } from './Calculator';
import DrawingPad from './DrawingPad';
import SmallButton from '../SmallButton';
import { PlayCircleIcon, CalculatorIcon, PencilIcon } from '@heroicons/react/24/outline';

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
            </div>

            {/* Components */}
            <div className="fixed top-28 right-10 flex flex-col gap-4 z-50">
                {/* Video player */}
                {videoShowing && VideoName && (
                    <VideoPlayer
                        autoPlay={true}
                        loop={true}
                        controls={true}
                        src={`${import.meta.env.BASE_URL}videos/${VideoName}`}
                        className="w-[400px] aspect-video"
                        isDraggable={true}
                    />
                )}

                {/* Calculator */}
                {calculatorShowing && (
                    <div className="w-[300px] rounded-lg overflow-hidden shadow-lg">
                        <Calculator />
                    </div>
                )}

                {/* Drawing Pad */}
                {drawingPadShowing && (
                    <div 
                        className="rounded-lg overflow-hidden shadow-lg"
                        style={{ width: '400px', height: '400px' }}
                    >
                        <DrawingPad />
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizAssistant;