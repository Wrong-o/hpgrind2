import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/favicon.svg?react';
import authStore from '../store/authStore';

const Header = () => {
  const { token } = authStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!token;
  const logout = authStore((state) => state.logout);

  function logoutUser () {
    logout();
    navigate("/");
  }

  const handleDemoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const featuresSection = document.querySelector('#features');
        if (featuresSection) {
          featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const featuresSection = document.querySelector('#features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleHowItWorksClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const howItWorksSection = document.querySelector('#how-it-works');
        if (howItWorksSection) {
          howItWorksSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const howItWorksSection = document.querySelector('#how-it-works');
      if (howItWorksSection) {
        howItWorksSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="flex items-center">
            <Logo className="h-8 w-auto mr-3 fill-current text-white" />
            <h1 className="text-2xl font-bold">HPGrind</h1>
          </Link>
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
                <Link
                  to="/login"
                  className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors inline-block"
                >
                  Logga in
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <>
                <li>
                  <button
                    onClick={logoutUser}
                    className="px-4 py-2 bg-transparent hover:bg-blue-500 text-white border border-white rounded-lg transition-colors inline-block"
                  >
                    Logga ut
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
