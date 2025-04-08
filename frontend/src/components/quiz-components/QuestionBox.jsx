import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from '@matejmazur/react-katex';

const QuestionBox = ({ latexString }) => {
  return (
    <div className="p-8 rounded-lg w-full text-center mb-4">
      <Latex className="text-black text-5xl">{latexString}</Latex>
    </div>
  );
};

export default QuestionBox;