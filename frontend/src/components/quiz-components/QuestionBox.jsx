import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from '@matejmazur/react-katex';

const QuestionBox = ({ latexString }) => {
  return (
    <div className="bg-white/10 p-6 rounded-lg w-full shadow-lg border border-white/20 text-center mb-4">
      <Latex className="text-black text-xl">{latexString}</Latex>
    </div>
  );
};

export default QuestionBox;