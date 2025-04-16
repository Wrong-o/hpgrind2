import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/favicon.svg?react';
import authStore from '../store/authStore';
import SmallButton from './SmallButton';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = authStore((state) => state.isLoggedIn);
  const logout = authStore((state) => state.logout);
  const initializeAuth = authStore((state) => state.initializeAuth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isPremium = authStore((state) => state.isPremium);

  useEffect(() => {
    try {
      initializeAuth();
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    }
  }, [initializeAuth]);

  // Close sidebar when changing routes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

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
      const featuresSection = document.querySelector('#demo');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  const vilkaViArClick = () => {
    if (location.pathname !== '/') {
      navigate('/vilka-vi-ar');
    }
  };
  const handleHowItWorksClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const howItWorksSection = document.querySelector('#features');
        if (howItWorksSection) {
          howItWorksSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const howItWorksSection = document.querySelector('#features');
      if (howItWorksSection) {
        howItWorksSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleUserStatsClick = () => {
    if (location.pathname !== '/') {
      navigate('/user_stats');
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
  const handleMainMenuClick = () => {
    navigate('/main-menu');
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Navigation items based on login status
  const navItems = !isLoggedIn ? (
    <>
      <li className="mb-2 md:mb-0">
        <SmallButton
          text="Testa demo"
          onClick={handleDemoClick}
          className="w-full md:w-auto bg-teal-600 hover:bg-gray-800 text-white hover:text-white"
        />
      </li>
      <li className="mb-2 md:mb-0">
        <SmallButton
          text="Hur fungerar HPGrind"
          onClick={handleHowItWorksClick}
          className="w-full md:w-auto bg-teal-600 hover:bg-gray-800 text-white hover:text-white"
        />
      </li>
      <li className="mb-2 md:mb-0">
        <SmallButton
          text="Logga in"
          onClick={() => navigate('/login')}
          className="w-full md:w-auto bg-purple-600 hover:bg-gray-800 text-white hover:text-white border border-white animate-pulse shadow-[0_0_150px_rgba(255,0,0,0.2)]"
        />
      </li>
    </>
  ) : (
    <>
      <li className="mb-2 md:mb-0">
        <SmallButton
          text="Huvudmeny"
          onClick={handleMainMenuClick}
          className="w-full md:w-auto bg-white-500 hover:bg-gray-800 text-white hover:text-white"
        />
      </li>
      <li className="mb-2 md:mb-0">
        <SmallButton
          text="Din profil"
          onClick={handleUserStatsClick}
          className="w-full md:w-auto bg-transparent hover:bg-blue-500 text-white border border-white"
          icon={<UserCircleIcon className="w-5 h-5" />}
        />
      </li>
      <li className="mb-2 md:mb-0">
        <SmallButton
          text="Logga ut"
          onClick={logoutUser}
          className="w-full md:w-auto bg-transparent hover:bg-blue-500 text-white border border-white"
        />
      </li>
    </>
  );

  return (
    <>
      {/* Main header always visible */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo className="h-8 w-auto mr-3 fill-current text-white" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex flex-wrap justify-center gap-3">
              {navItems}
            </ul>
          </nav>
          {/* Mobile Menu Toggle Button */}
          <SmallButton
            onClick={toggleSidebar}
            text="Meny"
            className="md:hidden p-2 rounded-lg hover:bg-blue-500 focus:outline-none"
            aria-label="Toggle menu"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            }
          />
        </div>
      </header>

      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={toggleSidebar}>
      </div>
      
      <div className={`fixed top-0 right-0 w-64 h-full bg-gradient-to-b from-blue-600 to-blue-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <Link to="/" className="flex items-center" onClick={() => setIsSidebarOpen(false)}>
              <Logo className="h-8 w-auto fill-current text-white" />
            </Link>
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-blue-500 focus:outline-none"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav>
            <ul className="flex flex-col space-y-4">
              {navItems}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
