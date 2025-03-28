import React, { useState } from 'react';
import { VideoPlayer } from './VideoPlayer';
import authStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import Sidebar from "./Sidebar";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

function LandingPage() {
  const [videoError, setVideoError] = useState({});
  const { isLoggedIn } = authStore();
  const navigate = useNavigate();

  // Function to handle video loading errors
  const handleVideoError = (videoId) => {
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

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Högskoleprovet utan bullshit, bara resultat
            </h1>
            <div className="space-y-2">
              <p className="text-xl text-gray-600">
                Din tid är viktig. HPGrind ser till att varje minut läggs på att förbättra dina resultat:
              </p>
              <ul className="text-xl text-gray-600 list-none">
                <li>- Genvägar på matten istället för långa genomgångar</li>
                <li>- Personligt anpassade uppgifter för att maximera resultat</li>
                <li>- Förklaringar utan onödigt svåra ord</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDemoClick}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Testa demo
              </button>
              <button
                onClick={handleHowItWorksClick}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hur fungerar HPGrind
              </button>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            {videoError['intro'] ? (
              <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-center p-4">
                  Introduktionsvideo kommer snart
                </p>
              </div>
            ) : (
              <VideoPlayer
                src="/videos/FractionDivision.mp4"
                poster="/images/intro-poster.jpg"
                autoPlay={true}
                loop={true}
                muted={true}
                controls={false}
                className="w-full aspect-video"
                onError={() => handleVideoError('intro')}
              />
            )}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Hur HPGrind hjälper dig
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Se hur våra verktyg och metoder kan hjälpa dig att nå dina mål på högskoleprovet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {videoError['feature1'] ? (
              <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-center p-4">
                  Video om personlig träningsplan
                </p>
              </div>
            ) : (
              <VideoPlayer
                src="/videos/FractionMultiplication.mp4"
                poster="/images/feature1-poster.jpg"
                muted={true}
                autoPlay={true}
                loop={true}
                controls={false}
                className="w-full aspect-video"
                onError={() => handleVideoError('feature1')}
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">
                Personlig träningsplan
              </h3>
              <p className="mt-2 text-gray-600">
                Få en skräddarsydd träningsplan baserad på dina styrkor och svagheter.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {videoError['feature2'] ? (
              <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-center p-4">
                  Video om detaljerad feedback
                </p>
              </div>
            ) : (
              <VideoPlayer
                src="/videos/FractionAddition.mp4"
                poster="/images/feature2-poster.jpg"
                muted={true}
                autoPlay={true}
                loop={true}
                controls={false}
                className="w-full aspect-video"
                onError={() => handleVideoError('feature2')}
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">
                Detaljerad feedback
              </h3>
              <p className="mt-2 text-gray-600">
                Få detaljerad feedback på dina svar för att förstå dina misstag och förbättra dig.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {videoError['feature3'] ? (
              <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-center p-4">
                  Video om provsimuleringar
                </p>
              </div>
            ) : (
              <VideoPlayer
                src="/videos/feature3.mp4"
                poster="/images/feature3-poster.jpg"
                muted={true}
                autoPlay={true}
                loop={true}
                controls={false}
                className="w-full aspect-video"
                onError={() => handleVideoError('feature3')}
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">
                Realistiska provsimuleringar
              </h3>
              <p className="mt-2 text-gray-600">
                Öva under realistiska förhållanden med tidsbegränsade provsimuleringar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white scroll-mt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Hur fungerar HPGrind?
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            HPGrind använder avancerad teknik för att ge dig en personlig träningsupplevelse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Diagnostisering</h3>
            <p>Vi analyserar dina styrkor och svagheter genom anpassade övningar.</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">Personlig plan</h3>
            <p>Baserat på din profil skapar vi en skräddarsydd träningsplan.</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Kontinuerlig förbättring</h3>
            <p>Systemet anpassar sig efter dina framsteg för att maximera resultatet.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-blue-50 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-lg overflow-hidden shadow-xl">
            {videoError['testimonial'] ? (
              <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-center p-4">
                  Användarberättelse kommer snart
                </p>
              </div>
            ) : (
              <VideoPlayer
                src="/videos/testimonial.mp4"
                poster="/images/testimonial-poster.jpg"
                muted={true}
                autoPlay={true}
                loop={true}
                controls={false}
                className="w-full aspect-video"
                onError={() => handleVideoError('testimonial')}
              />
            )}
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Börja din resa mot ett bättre resultat
            </h2>
            <p className="text-xl text-gray-600">
              Anslut dig till tusentals andra studenter som redan har förbättrat sina resultat med HPGrind.
            </p>
            <button
              onClick={handleLoginClick}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kom igång nu
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
