import React, { useState, useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import Latex from '@matejmazur/react-katex';

const QuestionBox = ({ latexString }) => {
  // Adjusted font sizes (starting with smaller sizes)
  const fontSizes = ['text-4xl', 'text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm', 'text-xs'];
  // Start with medium size instead of largest
  const [fontSize, setFontSize] = useState(fontSizes[1]); // Start with text-3xl
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const animationFrameId = useRef(null);
  const isMounted = useRef(false); // Track mount status

  // Function to detect if text is actually LaTeX content
  const isLaTeXContent = (str) => {
    if (!str || typeof str !== 'string') return false;
    
    // Patterns that suggest the content is LaTeX
    const latexPatterns = [
      /\\\(.*\\\)/,     // Inline math \( ... \)
      /\\\[.*\\\]/,     // Display math \[ ... \]
      /\$\$.*\$\$/,     // Display math $$ ... $$
      /\$.*\$/,         // Inline math $ ... $
      /\\begin\{.*\}/,  // Environment \begin{...}
      /\\end\{.*\}/,    // Environment \end{...}
      /\\frac\{.*\}/,   // Fraction \frac{...}
      /\\sqrt\{.*\}/,   // Square root \sqrt{...}
      /\\text\{.*\}/,   // Text \text{...}
      /\\sum/,          // Sum symbol
      /\\int/,          // Integral
      /\\alpha|\\beta|\\gamma|\\delta|\\epsilon|\\zeta|\\eta|\\theta|\\iota|\\kappa|\\lambda|\\mu|\\nu|\\xi|\\omicron|\\pi|\\rho|\\sigma|\\tau|\\upsilon|\\phi|\\chi|\\psi|\\omega/, // Greek letters
      /\\left|\\right/, // Delimiters
      /\\times|\\div|\\cdot|\\pm/, // Operators
    ];
    
    // Common math expressions that should be treated as LaTeX
    if (str.match(/\d+\s*[-+/*]\s*\d+/)) return true; // Simple arithmetic
    if (str.match(/\^2/)) return true; // Exponents
    if (str.match(/\(x\)/)) return true; // Function notation
    
    // Check if any LaTeX pattern is found in the string
    return latexPatterns.some(pattern => pattern.test(str));
  };
  
  // Function to wrap long formula strings with line breaks
  const processLatexString = (str) => {
    if (!str || typeof str !== 'string') return str;
    
    // Don't process if the string already has LaTeX line break commands
    if (str.includes('\\\\') || str.includes('\\newline')) return str;
    
    // For very long strings without natural breaks, add potential break points
    if (str.length > 50) {
      // Create break opportunities at common math operators when not in LaTeX commands
      return str.replace(/([^\\])([\+\-\=])/g, '$1 $2 ');
    }
    
    return str;
  };
  
  // Process regular text to improve wrapping for non-LaTeX content
  const processPlainText = (str) => {
    if (!str || typeof str !== 'string') return str;
    
    // Don't process if very short
    if (str.length < 30) return str;
    
    // Add zero-width spaces after common word boundaries to help with breaking very long strings
    return str
      // Add potential break points after punctuation
      .replace(/([.,;:!?])/g, '$1\u200B')
      // Add breaks after long sequences of letters
      .replace(/([a-zA-Z]{6})/g, '$1\u200B');
  };

  // Check if content contains stacked fractions that need special handling
  const hasStackedFractions = (str) => {
    if (!str || typeof str !== 'string') return false;
    return str.includes('\\frac{\\frac');
  };

  useEffect(() => {
    isMounted.current = true;
    // Ensure cleanup runs on unmount
    return () => {
        isMounted.current = false;
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
    };
  }, []); // Run only on mount and unmount

  useEffect(() => {
    const cancelPendingFrame = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };

    const adjustFontSize = (sizeIndex = 1) => { // Start from index 1 (text-3xl)
      cancelPendingFrame();

      if (!isMounted.current || !containerRef.current || !contentRef.current) {
        return; // Abort if not mounted or refs not ready
      }

      // Start with a smaller size for complex stacked fractions
      if (hasStackedFractions(latexString) && sizeIndex === 1) {
        sizeIndex = 2; // Start with text-2xl for complex fractions
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
        adjustFontSize(); // Start adjustment from medium size
    }, 50); // 50ms delay - might need tuning

    // --- Resize Handling ---
    let resizeTimeoutId = null;
    const handleResize = () => {
        clearTimeout(resizeTimeoutId);
        cancelPendingFrame(); // Cancel any ongoing adjustment checks
        resizeTimeoutId = setTimeout(() => {
            adjustFontSize(); // Restart adjustment on resize
        }, 150); // Debounce resize checks
    };

    window.addEventListener('resize', handleResize);

    // --- Cleanup for this effect ---
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(adjustmentTimeoutId);
      clearTimeout(resizeTimeoutId);
      cancelPendingFrame();
    };

  }, [latexString]); // Rerun this whole effect ONLY when latexString changes

  // Determine if content should be rendered as LaTeX or regular text
  const shouldRenderAsLaTeX = isLaTeXContent(latexString);
  
  // Process the string to improve wrapping based on content type
  const processedLatexString = shouldRenderAsLaTeX 
    ? processLatexString(latexString) 
    : processPlainText(latexString);
    
  // Determine additional styles for stacked fractions
  const hasComplexFractions = hasStackedFractions(latexString);

  return (
    <div
      ref={containerRef}
      className="p-4 rounded-lg w-full text-center bg-sky-200"
      style={{
        minHeight: hasComplexFractions ? '120px' : '80px', // Increase height for complex fractions
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        key={latexString}
        ref={contentRef}
        className={`${fontSize} break-words break-all hyphens-auto`}
        style={{
          display: 'inline-block', // Crucial for scrollWidth measurement
          maxWidth: '100%',
          wordBreak: 'break-word', // Allow breaking long words/numbers
          overflowWrap: 'break-word', // Additional property for older browsers
          whiteSpace: 'pre-wrap', // Allow wrapping on whitespace
          wordWrap: 'break-word', // Legacy property for older browsers
          lineHeight: hasComplexFractions ? '1.6' : '1.3', // Increase line height for complex fractions
          verticalAlign: 'middle', // Helps alignment
          padding: hasComplexFractions ? '1rem' : '0.5rem', // More padding for complex fractions
          hyphens: 'auto' // Enable hyphenation for better text breaks
        }}
      >
        {/* Render as Latex or plain text based on content */}
        {processedLatexString && (
          <div className="text-black inline-block max-w-full">
            {shouldRenderAsLaTeX ? (
              <Latex>{processedLatexString}</Latex>
            ) : (
              <span style={{ wordBreak: 'break-word' }}>{processedLatexString}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBox;