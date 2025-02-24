import React from 'react';
import Logo from '../assets/favicon.svg?react';

export const Header = () => {
  return (
    <header className="flex justify-between items-center p-5 bg-gray-100 border-b border-gray-300">
      <div className="flex items-center gap-8">
        <Logo className="w-12 h-12" />
        <div className="flex flex-col">
          <span className="font-normal">Regular Text</span>
          <span className="font-medium">Medium Text</span>
          <span className="font-bold">Bold Text</span>
        </div>
      </div>
    </header>
  );
};

