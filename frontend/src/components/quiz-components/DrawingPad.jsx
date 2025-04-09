import React, { useState, useEffect, useRef } from 'react';

const DrawingPad = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Optional: Set canvas dimensions dynamically or fixed
    canvas.width = 500; // Example width
    canvas.height = 300; // Example height

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
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseMove={draw}
      onMouseLeave={stopDrawing} // Stop drawing if mouse leaves canvas
      style={{ border: '1px solid grey' }} // Optional: add border for visibility
    />
  );
};

export default DrawingPad;
