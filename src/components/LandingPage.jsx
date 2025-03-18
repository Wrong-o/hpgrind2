import React, { useState } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from "./Sidebar";
//// Forstätt härifrån: sätt in sidebaren för att testa authentication 
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const LandingPage = ({
  onShowLogin
}) => {
  const [videoError, setVideoError] = useState({});
  const {
    isLoggedIn
  } = useAuth();

  // Function to handle video loading errors
  const handleVideoError = videoId => {
    setVideoError(prev => ({
      ...prev,
      [videoId]: true
    }));
  };
  const handleDemoClick = () => {
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  const handleHowItWorksClick = () => {
    const howItWorksSection = document.querySelector('#how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "min-h-screen bg-gradient-to-b from-gray-50 to-gray-100",
    children: [/*#__PURE__*/_jsx("section", {
      className: "relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
      children: /*#__PURE__*/_jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "space-y-6",
          children: [/*#__PURE__*/_jsx("h1", {
            className: "text-4xl sm:text-5xl font-bold text-gray-900",
            children: "H\xF6gskoleprovet utan bullshit, bara resultat"
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-xl text-gray-600",
            children: ["Din tid \xE4r viktig. HPGrind ser till att varje minut l\xE4ggs p\xE5 att f\xF6rb\xE4ttra dina resultat:", /*#__PURE__*/_jsxs("ul", {
              children: [/*#__PURE__*/_jsx("li", {
                children: "- Genv\xE4gar p\xE5 matten ist\xE4llet f\xF6r l\xE5nga genomg\xE5ngar"
              }), /*#__PURE__*/_jsx("li", {
                children: "- Personligt anpassade uppgifter f\xF6r att maximera resultat"
              }), /*#__PURE__*/_jsx("li", {
                children: "- F\xF6rklaringar utan on\xF6digt sv\xE5ra ord"
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex flex-col sm:flex-row gap-4",
            children: [/*#__PURE__*/_jsx("button", {
              onClick: handleDemoClick,
              className: "px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors",
              children: "Testa demo"
            }), /*#__PURE__*/_jsx("button", {
              onClick: handleHowItWorksClick,
              className: "px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors",
              children: "Hur fungerar HPGrind"
            })]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "rounded-lg overflow-hidden shadow-xl",
          children: videoError['intro'] ? /*#__PURE__*/_jsx("div", {
            className: "w-full aspect-video bg-gray-200 flex items-center justify-center",
            children: /*#__PURE__*/_jsx("p", {
              className: "text-gray-500 text-center p-4",
              children: "Introduktionsvideo kommer snart"
            })
          }) : /*#__PURE__*/_jsx(VideoPlayer, {
            src: "/videos/FractionDivision.mp4",
            poster: "/images/intro-poster.jpg",
            autoPlay: true,
            loop: true,
            muted: true,
            controls: false,
            className: "w-full aspect-video",
            onError: () => handleVideoError('intro')
          })
        })]
      })
    }), /*#__PURE__*/_jsxs("section", {
      id: "features",
      className: "py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "text-center mb-16",
        children: [/*#__PURE__*/_jsx("h2", {
          className: "text-3xl font-bold text-gray-900",
          children: "Hur HPGrind hj\xE4lper dig"
        }), /*#__PURE__*/_jsx("p", {
          className: "mt-4 text-xl text-gray-600 max-w-3xl mx-auto",
          children: "Se hur v\xE5ra verktyg och metoder kan hj\xE4lpa dig att n\xE5 dina m\xE5l p\xE5 h\xF6gskoleprovet."
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "bg-white rounded-lg shadow-md overflow-hidden",
          children: [videoError['feature1'] ? /*#__PURE__*/_jsx("div", {
            className: "w-full aspect-video bg-gray-100 flex items-center justify-center",
            children: /*#__PURE__*/_jsx("p", {
              className: "text-gray-500 text-center p-4",
              children: "Video om personlig tr\xE4ningsplan"
            })
          }) : /*#__PURE__*/_jsx(VideoPlayer, {
            src: "/videos/FractionMultiplication.mp4",
            poster: "/images/feature1-poster.jpg",
            muted: true,
            autoPlay: true,
            loop: true,
            controls: false,
            className: "w-full aspect-video",
            onError: () => handleVideoError('feature1')
          }), /*#__PURE__*/_jsxs("div", {
            className: "p-6",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "text-xl font-bold text-gray-900",
              children: "Personlig tr\xE4ningsplan"
            }), /*#__PURE__*/_jsx("p", {
              className: "mt-2 text-gray-600",
              children: "F\xE5 en skr\xE4ddarsydd tr\xE4ningsplan baserad p\xE5 dina styrkor och svagheter."
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "bg-white rounded-lg shadow-md overflow-hidden",
          children: [videoError['feature2'] ? /*#__PURE__*/_jsx("div", {
            className: "w-full aspect-video bg-gray-100 flex items-center justify-center",
            children: /*#__PURE__*/_jsx("p", {
              className: "text-gray-500 text-center p-4",
              children: "Video om detaljerad feedback"
            })
          }) : /*#__PURE__*/_jsx(VideoPlayer, {
            src: "/videos/FractionAddition.mp4",
            poster: "/images/feature2-poster.jpg",
            muted: true,
            autoPlay: true,
            loop: true,
            controls: false,
            className: "w-full aspect-video",
            onError: () => handleVideoError('feature2')
          }), /*#__PURE__*/_jsxs("div", {
            className: "p-6",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "text-xl font-bold text-gray-900",
              children: "Detaljerad feedback"
            }), /*#__PURE__*/_jsx("p", {
              className: "mt-2 text-gray-600",
              children: "F\xE5 detaljerad feedback p\xE5 dina svar f\xF6r att f\xF6rst\xE5 dina misstag och f\xF6rb\xE4ttra dig."
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "bg-white rounded-lg shadow-md overflow-hidden",
          children: [videoError['feature3'] ? /*#__PURE__*/_jsx("div", {
            className: "w-full aspect-video bg-gray-100 flex items-center justify-center",
            children: /*#__PURE__*/_jsx("p", {
              className: "text-gray-500 text-center p-4",
              children: "Video om provsimuleringar"
            })
          }) : /*#__PURE__*/_jsx(VideoPlayer, {
            src: "/videos/feature3.mp4",
            poster: "/images/feature3-poster.jpg",
            muted: true,
            autoPlay: true,
            loop: true,
            controls: false,
            className: "w-full aspect-video",
            onError: () => handleVideoError('feature3')
          }), /*#__PURE__*/_jsxs("div", {
            className: "p-6",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "text-xl font-bold text-gray-900",
              children: "Realistiska provsimuleringar"
            }), /*#__PURE__*/_jsx("p", {
              className: "mt-2 text-gray-600",
              children: "\xD6va under realistiska f\xF6rh\xE5llanden med tidsbegr\xE4nsade provsimuleringar."
            })]
          })]
        })]
      })]
    }), /*#__PURE__*/_jsxs("section", {
      id: "how-it-works",
      className: "py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white scroll-mt-20",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "text-center mb-16",
        children: [/*#__PURE__*/_jsx("h2", {
          className: "text-3xl font-bold text-gray-900",
          children: "Hur fungerar HPGrind?"
        }), /*#__PURE__*/_jsx("p", {
          className: "mt-4 text-xl text-gray-600 max-w-3xl mx-auto",
          children: "HPGrind anv\xE4nder avancerad teknik f\xF6r att ge dig en personlig tr\xE4ningsupplevelse."
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-8",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "bg-blue-50 p-6 rounded-lg",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold",
            children: "1"
          }), /*#__PURE__*/_jsx("h3", {
            className: "text-xl font-bold mb-2",
            children: "Diagnostisering"
          }), /*#__PURE__*/_jsx("p", {
            children: "Vi analyserar dina styrkor och svagheter genom anpassade \xF6vningar."
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "bg-blue-50 p-6 rounded-lg",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold",
            children: "2"
          }), /*#__PURE__*/_jsx("h3", {
            className: "text-xl font-bold mb-2",
            children: "Personlig plan"
          }), /*#__PURE__*/_jsx("p", {
            children: "Baserat p\xE5 din profil skapar vi en skr\xE4ddarsydd tr\xE4ningsplan."
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "bg-blue-50 p-6 rounded-lg",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold",
            children: "3"
          }), /*#__PURE__*/_jsx("h3", {
            className: "text-xl font-bold mb-2",
            children: "Kontinuerlig f\xF6rb\xE4ttring"
          }), /*#__PURE__*/_jsx("p", {
            children: "Systemet anpassar sig efter dina framsteg f\xF6r att maximera resultatet."
          })]
        })]
      })]
    }), /*#__PURE__*/_jsx("section", {
      className: "py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-blue-50 rounded-lg",
      children: /*#__PURE__*/_jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
        children: [/*#__PURE__*/_jsx("div", {
          className: "rounded-lg overflow-hidden shadow-xl",
          children: videoError['testimonial'] ? /*#__PURE__*/_jsx("div", {
            className: "w-full aspect-video bg-gray-100 flex items-center justify-center",
            children: /*#__PURE__*/_jsx("p", {
              className: "text-gray-500 text-center p-4",
              children: "Anv\xE4ndarber\xE4ttelse kommer snart"
            })
          }) : /*#__PURE__*/_jsx(VideoPlayer, {
            src: "/videos/testimonial.mp4",
            poster: "/images/testimonial-poster.jpg",
            muted: true,
            autoPlay: true,
            loop: true,
            controls: false,
            className: "w-full aspect-video",
            onError: () => handleVideoError('testimonial')
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "space-y-6",
          children: [/*#__PURE__*/_jsx("h2", {
            className: "text-3xl font-bold text-gray-900",
            children: "H\xF6r vad v\xE5ra anv\xE4ndare s\xE4ger"
          }), /*#__PURE__*/_jsx("blockquote", {
            className: "text-xl italic text-gray-600",
            children: "\"Tack vare HPGrind f\xF6rb\xE4ttrade jag mitt resultat fr\xE5n 0.8 till 1.6 p\xE5 bara tv\xE5 m\xE5nader. Jag kom in p\xE5 l\xE4karprogrammet p\xE5 f\xF6rsta f\xF6rs\xF6ket!\""
          }), /*#__PURE__*/_jsx("p", {
            className: "font-medium text-gray-900",
            children: "\u2014 Emma Johansson, L\xE4karstudent"
          })]
        })]
      })
    }), /*#__PURE__*/_jsxs("section", {
      className: "py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "text-3xl font-bold text-gray-900",
        children: "Redo att f\xF6rb\xE4ttra dina resultat?"
      }), /*#__PURE__*/_jsx("p", {
        className: "mt-4 text-xl text-gray-600 max-w-3xl mx-auto",
        children: "B\xF6rja din resa mot ett b\xE4ttre resultat p\xE5 h\xF6gskoleprovet idag."
      }), /*#__PURE__*/_jsx("div", {
        className: "mt-8",
        children: !isLoggedIn && /*#__PURE__*/_jsx("button", {
          onClick: onShowLogin,
          className: "px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-lg",
          children: "Skapa konto"
        })
      })]
    })]
  });
};
