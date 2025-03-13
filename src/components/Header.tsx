import React from 'react';
import Logo from '../assets/favicon.svg?react';
import { useAuth } from '../contexts/AuthContext';
import authStore from "../store/authStore";


interface HeaderProps {
  onShowLogin?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowLogin }) => {
  const { isLoggedIn } = useAuth();

  const handleDemoClick = () => {
    // Scroll to the features section or implement demo functionality
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHowItWorksClick = () => {
    // Scroll to the how it works section
    const howItWorksSection = document.querySelector('#how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Logo className="h-8 w-auto mr-3 fill-current text-white" />
          <h1 className="text-2xl font-bold">HPGrind</h1>
        </div>

        <nav>
          <ul className="flex flex-wrap justify-center gap-3">
            <li>
              <button
                onClick={handleDemoClick}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-colors"
              >
                Testa demo
              </button>
            </li>
            <li>
              <button
                onClick={handleHowItWorksClick}
                className="px-4 py-2 bg-transparent hover:bg-blue-500 text-white border border-white rounded-lg transition-colors"
              >
                Hur fungerar HPGrind
              </button>
            </li>
            {!isLoggedIn && (
              <li>
                <button
                  onClick={onShowLogin}
                  className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                >
                  Skapa konto
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;