import React, { useState, useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import Latex from '@matejmazur/react-katex';

const QuestionBox = ({ latexString }) => {
  // Added smaller font sizes
  const fontSizes = ['text-5xl', 'text-4xl', 'text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm', 'text-xs'];
  // Start with largest, but it will be quickly adjusted
  const [fontSize, setFontSize] = useState(fontSizes[0]);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const animationFrameId = useRef(null);
  const isMounted = useRef(false); // Track mount status

  useEffect(() => {
    isMounted.current = true;
    // Ensure cleanup runs on unmount
    return () => {
        isMounted.current = false;
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        // No need to remove resize listener here if it's added below
    };
  }, []); // Run only on mount and unmount

  useEffect(() => {
    const cancelPendingFrame = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };

    const adjustFontSize = (sizeIndex = 0) => {
      cancelPendingFrame();

      if (!isMounted.current || !containerRef.current || !contentRef.current) {
        return; // Abort if not mounted or refs not ready
      }

      if (sizeIndex >= fontSizes.length) {
         // Tried all sizes, stick with the smallest
         if (fontSize !== fontSizes[fontSizes.length - 1]) {
            setFontSize(fontSizes[fontSizes.length - 1]);
         }
         return;
      }

      const currentSizeClass = fontSizes[sizeIndex];
      // Set the font size state *before* measuring in the next frame
      setFontSize(currentSizeClass);

      animationFrameId.current = requestAnimationFrame(() => {
        if (!isMounted.current || !containerRef.current || !contentRef.current) {
          animationFrameId.current = null;
          return; // Check again inside rAF
        }

        const containerWidth = containerRef.current.clientWidth;
        // scrollWidth reflects the content's actual width, even if overflowing
        const contentWidth = contentRef.current.scrollWidth;
        const buffer = 1; // Small buffer for precision issues

        // console.log(`Check: ${currentSizeClass}, ContentW: ${contentWidth}, ContainerW: ${containerWidth}`);

        // If it overflows AND we have smaller sizes left, try the next one
        if (contentWidth > containerWidth - buffer && sizeIndex < fontSizes.length - 1) {
          adjustFontSize(sizeIndex + 1);
        } else {
          // Content fits OR it's the smallest size (even if overflowing)
          // The state is already set, so we stop.
          animationFrameId.current = null;
        }
      });
    };

    // --- Triggering Adjustment ---
    // Use a short timeout. This helps ensure that React has rendered the new latexString
    // and KaTeX has had a chance to process it before we start measuring.
    const adjustmentTimeoutId = setTimeout(() => {
        adjustFontSize(); // Start adjustment from largest size
    }, 50); // 50ms delay - might need tuning

    // --- Resize Handling ---
    let resizeTimeoutId = null;
    const handleResize = () => {
        clearTimeout(resizeTimeoutId);
        cancelPendingFrame(); // Cancel any ongoing adjustment checks
        resizeTimeoutId = setTimeout(() => {
            // console.log("Resize detected, re-adjusting.");
            adjustFontSize(); // Restart adjustment on resize
        }, 150); // Debounce resize checks
    };

    window.addEventListener('resize', handleResize);

    // --- Cleanup for this effect ---
    return () => {
      // console.log("Cleaning up effect for:", latexString);
      window.removeEventListener('resize', handleResize);
      clearTimeout(adjustmentTimeoutId);
      clearTimeout(resizeTimeoutId);
      cancelPendingFrame();
    };

  }, [latexString]); // Rerun this whole effect ONLY when latexString changes

  return (
    <div
      ref={containerRef}
      className="p-8 rounded-lg w-full text-center bg-sky-200 overflow-hidden" // Keep overflow hidden on container
    >
      {/* Add key={latexString} here: This forces React to treat this div and its
          children (Latex) as new elements whenever latexString changes.
          This ensures KaTeX reruns cleanly. */}
      <div
        key={latexString}
        ref={contentRef}
        className={`${fontSize} break-words`}
        style={{
          display: 'inline-block', // Crucial for scrollWidth measurement
          maxWidth: '100%',
          wordBreak: 'break-word', // Allow breaking long words/numbers if needed
          lineHeight: 'normal', // Ensure line height doesn't add unexpected space
          verticalAlign: 'middle', // Helps alignment
        }}
      >
        {/* Render Latex only if string is not empty */}
        {latexString && <Latex className="text-black">{latexString}</Latex>}
      </div>
    </div>
  );
};

export default QuestionBox;