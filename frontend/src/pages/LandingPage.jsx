import React, { useState } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import authStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import Demo from '../components/Demo';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import SmallButton from '../components/SmallButton';

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
                <li>- Tydliga delmoment för fokuserad träning</li>
                <li>- Personligt anpassade uppgifter för att maximera resultat</li>
                <li>- Förklaringar utan onödigt svåra ord</li>
              </ul>
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
            Spara tid utan att tumma på resultatet
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            HPGrind knäcker bland annat dom här tidstjuvar som inte ger bättre resultat, men tar upp mycket tid:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {videoError['feature1'] ? (
              <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-center p-4">
                  Video om att träningsplan
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
                Lära dig vad du behöver lära dig
              </h3>
              <p className="mt-2 text-gray-600">
                Med HPGrind behöver du inte leta på forum och fråga kompisar vad du ska lära dig, allt finns här. Lägg tiden på att faktiskt lära dig istället!
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {videoError['feature2'] ? (
              <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-center p-4">
                  Video om att leta reda på material 
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
                Hitta RÄTT uppgifter
              </h3>
              <p className="mt-2 text-gray-600">
                Det tar tid att ladda ner gamla prov, och träningen blir spretig. HPGrind genererar uppgifter skapta för det du tränar på, mindre tid för samma resultat.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {videoError['feature3'] ? (
              <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-center p-4">
                  Video om verktyg 
                </p>
              </div>
            ) : (
              <VideoPlayer
                src="/videos/FractionDivision.mp4"
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
                Verktyg precis där dom behövs 
              </h3>
              <p className="mt-2 text-gray-600">
                Vid fokusträning ska du ha tillgång till rätt information och verktyg. När du tränar får du alltid relevanta verktyg direkt i provet.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="text-center py-12">
        <h2 className="text-4xl font-bold text-gray-900">Demo</h2>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Här kan du testa en liten variant av HPGrind: Våra verktyg, våra uppgifter och en visualisering av hur HPGrind håller koll på dig och dina resultat.
        </p>
      </div>

      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <Demo />
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
