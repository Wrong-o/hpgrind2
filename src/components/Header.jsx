import React from 'react';
import { ReactComponent as Logo } from '/favicon.svg';
const Header = () => {
  return (
    <header className="flex justify-between items-center p-5 bg-gray-100 border-b border-gray-300">
      <Logo className="w-12 h-12" />
    </header>
  );
};

export default Header;
