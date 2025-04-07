import React, { useRef, useEffect, useState } from 'react';

export const DrawingBoard = ({
  question,
  onClose,
  currentQuestion
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [lastPosition, setLastPosition] = useState({
    x: 0,
    y: 0
  });
  const [color, setColor] = useState('white');
  const [lineWidth, setLineWidth] = useState(2);
  const [isMinimized, setIsMinimized] = useState(false);
  useEffect(() => {
    initCanvas();
  }, []);
  useEffect(() => {
    clearCanvas();
  }, [currentQuestion]);
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    setContext(ctx);
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);
  const startDrawing = e => {
    if (!context) return;
    setIsDrawing(true);
    const pos = getMousePos(e);
    setLastPosition(pos);
  };
  const draw = e => {
    if (!isDrawing || !context) return;
    const pos = getMousePos(e);
    context.beginPath();
    context.moveTo(lastPosition.x, lastPosition.y);
    context.lineTo(pos.x, pos.y);
    context.stroke();
    setLastPosition(pos);
  };
  const getMousePos = e => {
    const canvas = canvasRef.current;
    if (!canvas) return {
      x: 0,
      y: 0
    };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };
  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.fillStyle = '#1a1a1a';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };
  const handleBackgroundClick = e => {
    if (e.target === e.currentTarget) {
      setIsMinimized(true);
    }
  };
  return React.createElement('div', {
    className: `fixed inset-x-0 bottom-0 bg-black/90 z-50
                 rounded-t-3xl shadow-2xl transform transition-all duration-300
                 border-t border-white/20 ${isMinimized ? 'h-16 cursor-pointer' : 'h-[80vh]'}`,
    onClick: isMinimized ? () => setIsMinimized(false) : handleBackgroundClick
  }, isMinimized ? 
    React.createElement('div', {
      className: 'flex items-center justify-between px-4 h-full'
    }, [
      React.createElement('p', {
        className: 'text-white text-sm truncate',
        key: 'text'
      }, question),
      React.createElement('span', {
        className: 'text-white/50 text-sm',
        key: 'hint'
      }, 'Klicka för att öppna')
    ]) :
    [
      React.createElement('div', {
        className: 'absolute top-4 left-0 right-0 px-4 flex justify-between items-start',
        key: 'controls'
      }, [
        React.createElement('div', {
          className: 'bg-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20 transition-colors max-w-md',
          onClick: onClose,
          key: 'question'
        }, 
          React.createElement('p', {
            className: 'text-white text-sm'
          }, question)
        ),
        React.createElement('div', {
          className: 'flex gap-2',
          key: 'tools'
        }, [
          ['white', '#ff4444', '#44ff44', '#4444ff', '#ffff44'].map(c =>
            React.createElement('button', {
              onClick: () => setColor(c),
              className: `w-8 h-8 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`,
              style: { backgroundColor: c },
              key: c
            })
          ),
          React.createElement('select', {
            value: lineWidth,
            onChange: e => setLineWidth(Number(e.target.value)),
            className: 'bg-white/10 text-white rounded px-2',
            key: 'lineWidth'
          }, [
            React.createElement('option', { value: '2', key: 'thin' }, 'Thin'),
            React.createElement('option', { value: '4', key: 'medium' }, 'Medium'),
            React.createElement('option', { value: '8', key: 'thick' }, 'Thick')
          ]),
          React.createElement('button', {
            onClick: clearCanvas,
            className: 'px-4 py-2 bg-red-500/50 text-white rounded hover:bg-red-500/70 transition-colors',
            key: 'clear'
          }, 'Rensa')
        ])
      ]),
      React.createElement('div', {
        className: 'flex justify-center items-center h-full pt-16',
        key: 'canvas-container'
      },
        React.createElement('canvas', {
          ref: canvasRef,
          onMouseDown: startDrawing,
          onMouseMove: draw,
          onMouseUp: () => setIsDrawing(false),
          onMouseLeave: () => setIsDrawing(false),
          className: 'rounded-lg border border-white/10'
        })
      )
    ]
  );
};
