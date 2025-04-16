import React, { useState } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import authStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import Demo from '../components/Demo';
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 w-full overflow-x-hidden">
      <section className="relative py-10 sm:py-20 px-4 sm:px-6 lg:px-8 mx-auto w-full">
        <div className="max-w-7xl mx-auto w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Text Content */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight break-words">
                Högskoleprovet utan bullshit, bara resultat
              </h1>
              <div className="space-y-2">
                <p className="text-lg sm:text-xl text-gray-600 break-words">
                  Din tid är viktig. HPGrind ser till att varje minut läggs på att förbättra dina resultat:
                </p>
                <ul className="text-lg sm:text-xl text-gray-600 list-none space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0">-</span>
                    <span className="break-words flex-1">Genvägar på matten istället för långa genomgångar</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0">-</span>
                    <span className="break-words flex-1">Tydliga delmoment för fokuserad träning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0">-</span>
                    <span className="break-words flex-1">Personligt anpassade uppgifter för att maximera resultat</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0">-</span>
                    <span className="break-words flex-1">Förklaringar utan onödigt svåra ord</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Video Container - Simplified */}
            <div className="rounded-lg overflow-hidden shadow-xl w-full">
              {videoError['intro'] ? (
                <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500 text-center p-4">
                    Introduktionsvideo kommer snart
                  </p>
                </div>
              ) : (
                <div className="relative w-full aspect-video"> {/* Aspect ratio container */}
                  <VideoPlayer
                    src="/videos/FractionDivision.mp4"
                    poster="/images/intro-poster.jpg"
                    autoPlay={true}
                    loop={true}
                    muted={true}
                    controls={false}
                    className="absolute inset-0 w-full h-full object-contain" /* Fit within container */
                    onError={() => handleVideoError('intro')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-10 sm:py-20 px-4 sm:px-6 lg:px-8 mx-auto w-full">
        <div className="max-w-7xl mx-auto w-full overflow-hidden">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
              Spara tid utan att tumma på resultatet
            </h2>
            <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto break-words">
              HPGrind knäcker bland annat dom här tidstjuvar som inte ger bättre resultat, men tar upp mycket tid:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
              {videoError['feature1'] ? (
                <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500 text-center p-4">Video om att träningsplan</p>
                </div>
              ) : (
                <div className="relative w-full aspect-video"> {/* Aspect ratio container */}
                  <VideoPlayer
                    src="/videos/FractionMultiplication.mp4"
                    poster="/images/feature1-poster.jpg"
                    muted={true}
                    autoPlay={true}
                    loop={true}
                    controls={false}
                    className="absolute inset-0 w-full h-full object-contain" /* Fit within container */
                    onError={() => handleVideoError('feature1')}
                  />
                </div>
              )}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                  Lära dig vad du behöver lära dig
                </h3>
                <p className="mt-2 text-sm sm:text-base text-gray-600 break-words">
                  Med HPGrind behöver du inte leta på forum och fråga kompisar vad du ska lära dig, allt finns här. Lägg tiden på att faktiskt lära dig istället!
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
              {videoError['feature2'] ? (
                <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500 text-center p-4">Video om att leta reda på material</p>
                </div>
              ) : (
                <div className="relative w-full aspect-video"> {/* Aspect ratio container */}
                  <VideoPlayer
                    src="/videos/FractionAddition.mp4"
                    poster="/images/feature2-poster.jpg"
                    muted={true}
                    autoPlay={true}
                    loop={true}
                    controls={false}
                    className="absolute inset-0 w-full h-full object-contain" /* Fit within container */
                    onError={() => handleVideoError('feature2')}
                  />
                </div>
              )}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                  Hitta RÄTT uppgifter
                </h3>
                <p className="mt-2 text-sm sm:text-base text-gray-600 break-words">
                  Det tar tid att ladda ner gamla prov, och träningen blir spretig. HPGrind genererar uppgifter skapta för det du tränar på, mindre tid för samma resultat.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
              {videoError['feature3'] ? (
                <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500 text-center p-4">Video om verktyg</p>
                </div>
              ) : (
                <div className="relative w-full aspect-video"> {/* Aspect ratio container */}
                  <VideoPlayer
                    src="/videos/FractionDivision.mp4"
                    poster="/images/feature3-poster.jpg"
                    muted={true}
                    autoPlay={true}
                    loop={true}
                    controls={false}
                    className="absolute inset-0 w-full h-full object-contain" /* Fit within container */
                    onError={() => handleVideoError('feature3')}
                  />
                </div>
              )}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                  Verktyg precis där dom behövs 
                </h3>
                <p className="mt-2 text-sm sm:text-base text-gray-600 break-words">
                  Vid fokusträning ska du ha tillgång till rätt information och verktyg. När du tränar får du alltid relevanta verktyg direkt i provet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto w-full overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 break-words">Demo</h2>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-gray-600 break-words">
            Här kan du testa en liten variant av HPGrind: Våra verktyg, våra uppgifter och en visualisering av hur HPGrind håller koll på dig och dina resultat.
          </p>
        </div>
      </div>

      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto w-full overflow-hidden">
          <Demo />
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
