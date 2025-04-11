import React, { useState, useEffect, useRef } from 'react';
import SmallButton from '../SmallButton';
import { TrashIcon } from '@heroicons/react/24/outline';

const DrawingPad = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Optional: Set canvas dimensions dynamically or fixed
    canvas.width = 400; // Example width
    canvas.height = 400; // Example height

    const context = canvas.getContext('2d');
    // Set background
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Set drawing styles
    context.strokeStyle = 'white';
    context.lineWidth = 2; // Example line width
    context.lineCap = 'round'; // Smoother lines
    contextRef.current = context;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    // Clear and reset to black background
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Reset drawing style
    context.strokeStyle = 'white';
    context.lineWidth = 2;
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseLeave={stopDrawing} // Stop drawing if mouse leaves canvas
        style={{ border: '1px solid grey' }} // Optional: add border for visibility
      />
      <div className="absolute top-2 right-2">
        <SmallButton
          text="Rensa"
          onClick={clearCanvas}
          icon={<TrashIcon className="w-5 h-5" />}
          className="bg-red-600 hover:bg-red-700"
        />
      </div>
    </div>
  );
};

export default DrawingPad;
