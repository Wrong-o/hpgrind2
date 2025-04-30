import React, { useState, useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import Latex from '@matejmazur/react-katex';

const QuestionBox = ({ latexString }) => {
  const [fontSize, setFontSize] = useState('text-5xl');
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const adjustFontSize = () => {
      if (!containerRef.current || !contentRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const contentWidth = contentRef.current.scrollWidth;
      
      // Reset font size first to properly measure content at largest size
      setFontSize('text-5xl');
      
      // Check if content overflows and reduce size incrementally
      setTimeout(() => {
        if (contentWidth > containerWidth * 0.95) {
          setFontSize('text-4xl');
          
          setTimeout(() => {
            const updatedContentWidth = contentRef.current.scrollWidth;
            if (updatedContentWidth > containerWidth * 0.95) {
              setFontSize('text-3xl');
              
              setTimeout(() => {
                const finalContentWidth = contentRef.current.scrollWidth;
                if (finalContentWidth > containerWidth * 0.95) {
                  setFontSize('text-2xl');
                  
                  setTimeout(() => {
                    if (contentRef.current.scrollWidth > containerWidth * 0.95) {
                      setFontSize('text-xl');
                    }
                  }, 0);
                }
              }, 0);
            }
          }, 0);
        }
      }, 0);
    };

    // Run after render to measure sizes
    adjustFontSize();
    
    // Also run on window resize
    window.addEventListener('resize', adjustFontSize);
    return () => window.removeEventListener('resize', adjustFontSize);
  }, [latexString]);

  return (
    <div ref={containerRef} className="p-8 rounded-lg w-full text-center bg-sky-200 overflow-hidden">
      <div ref={contentRef} className={`inline-block ${fontSize}`}>
        <Latex className="text-black">{latexString}</Latex>
      </div>
    </div>
  );
};

export default QuestionBox;