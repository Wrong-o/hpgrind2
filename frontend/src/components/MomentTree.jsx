import React, { useState, useEffect } from 'react';
import authStore from '../store/authStore';
import { VideoPlayer } from './VideoPlayer';

const initialTree = {
  id: 'root',
  title: 'Totala skills',
  description: 'Klicka här för att hitta specifika skills att träna på',
  children: [{
    id: 'kvantitativ',
    title: 'Kvantitativ del',
    description: 'Träna på matematiken',
    children: [{
      id: 'basics',
      title: 'Grunderna',
      description: 'Grunderna i matematiken som behövs för att kunna sätta igång',
      children: [{
        id: 'basics-operations_order',
        title: 'Räkneordning',
        description: 'Räknereordning för de olika räknesätten',
        children: []
      }, {
        id: 'basics-fraktioner',
        title: 'Fraktioner',
        description: 'Fraktioner och hur de fungerar',
        children: [{
          id: 'basics-fraktioner-förlänga',
          title: 'Förlänga',
          description: 'Förlänga en fraktion',
          children: []
        }, {
          id: 'basics-fraktioner-förkorta',
          title: 'Förkorta',
          description: 'Förkorta en fraktion',
          children: []
        }, {
          id: 'basics-fraktioner-addera',
          title: 'Addera',
          description: 'Addera en fraktion',
          children: [],
          videoUrl: 'FractionAddition.mp4'
        }, {
          id: 'basics-fraktioner-subtrahera',
          title: 'Subtrahera',
          description: 'Subtrahera en fraktion',
          children: [],
          videoUrl: 'FractionSubtraction.mp4'
        }, {
          id: 'basics-fraktioner-multiplicera',
          title: 'Multiplicera',
          description: 'Multiplicera en fraktion',
          children: [],
          videoUrl: 'FractionMultiplication.mp4'
        }, {
          id: 'basics-fraktioner-dividera',
          title: 'Dividera',
          description: 'Dividera en fraktion',
          children: [],
          videoUrl: 'FractionDivision.mp4'
        }]
      }, {
        id: 'basics-ekvationslösning',
        title: 'Ekvationslösning',
        description: 'Grunderna i att lösa ekvationer',
        children: [{
          id: 'basics-ekvationslösning-division',
          title: 'Dela för att lösa ekvationer',
          description: 'Om en ekvation har ett gångertal i sig kan man dela båda sidor för att få fram x',
          children: []
        }, {
          id: 'basics-ekvationslösning-multiplikation',
          title: 'Multiplicera för att lösa ekvationer',
          description: 'Om en ekvation har ett delat tal i sig kan man multiplicera båda sidor för att få fram x',
          children: []
        }, {
          id: 'basics-ekvationslösning-addition',
          title: 'Addera för att lösa ekvationer',
          description: 'Om en ekvation har ett subtraherat tal i sig kan man addera båda sidor för att få fram x',
          children: []
        }, {
          id: 'basics-ekvationslösning-subtraktion',
          title: 'Subtrahera för att lösa ekvationer',
          description: 'Om en ekvation har ett adderat tal i sig kan man subtrahera båda sidor för att få fram x',
          children: []
        }]
      }]
    }, {
      id: 'formelblad',
      title: 'Formelbladet',
      description: 'De olika komponenterna i formelbladet',
      children: [{
        id: 'Medelvärde, Median, Typvärde',
        title: 'Medelvärde, Median och Typvärde',
        description: 'Hitta och beräkna medelvärdet, medianen och typvärdet',
        children: [{
          id: 'medelvarde',
          title: 'Medelvärde',
          description: 'Beräkna medelvärdet av en uppsättning tal',
          children: [{
            id: 'medelvarde-jämnt',
            title: 'Medelvärde: Jämnt antal tal',
            description: 'Beräkna medelvärdet av en uppsättning tal',
            children: []
          }, {
            id: 'medelvarde-udda',
            title: 'Medelvärde: Udda antal tal',
            description: 'Beräkna medelvärdet av en uppsättning tal',
            children: []
          }, {
            id: 'medelvarde-negativa',
            title: 'Medelvärde: Negativa tal',
            description: 'Beräkna medelvärdet av en uppsättning tal',
            children: []
          }]
        }, {
          id: 'median',
          title: 'Median',
          description: 'Hitta medianen av en uppsättning tal',
          children: [{
            id: 'median-udda',
            title: 'Median: Udda antal tal',
            description: 'Hitta medianen av en uppsättning tal',
            children: []
          }, {
            id: 'median-jämnt',
            title: 'Median: Jämnt antal tal',
            description: 'Hitta medianen av en uppsättning tal',
            children: []
          }]
        }, {
          id: 'typvärde',
          title: 'Typvärde',
          description: 'Hitta det vanligaste värdet i en uppsättning tal',
          children: []
        }]
      }, {
        id: 'ekvationer',
        title: 'Ekvationer',
        description: 'Lös för x',
        children: [{
          id: 'ekvationer-linjer',
          title: 'Räta linjer',
          description: 'Grafer, punkter och lutning',
          children: [{
            id: 'ekvationer-linjer-ekvation',
            title: 'Linjära ekvationer',
            description: 'Om redan har ekvationen, hitta x eller y',
            children: [{
              id: 'ekvationer-linjer-ekvation-x',
              title: 'Hitta x',
              description: 'Om du har ekvationen och y, hitta x',
              children: []
            }, {
              id: 'ekvationer-linjer-ekvation-y',
              title: 'Hitta y',
              description: 'Om du har ekvationen och x, hitta y',
              children: []
            }]
          }, {
            id: 'ekvationer-linjer-punkter',
            title: 'Punkter och grafer',
            description: 'Om du har två punkter eller graf, hitta ekvationen',
            children: [{
              id: 'ekvationer-linjer-punkter-punkter',
              title: 'Ekvation från två punkter',
              description: 'Om du har två punkter, hitta ekvationen',
              children: []
            }, {
              id: 'ekvationer-linjer-punkter-graf',
              title: 'Ekvation från graf',
              description: 'Om du har en graf, hitta ekvationen',
              children: []
            }]
          }, {
            id: 'ekvationer-linjer-lutning',
            title: 'Lutning - Parallella och vinkelräta linjer',
            description: 'Bestäm om 2 linjer är parallella eller vinkelräta',
            children: [{
              id: 'ekvationer-linjer-lutning-parallella',
              title: 'Parallella linjer',
              description: 'Bestäm om 2 linjer är parallella',
              children: []
            }, {
              id: 'ekvationer-linjer-lutning-vinkelräta',
              title: 'Vinkelräta linjer',
              description: 'Bestäm om 2 linjer är vinkelräta',
              children: []
            }]
          }]
        }, {
          id: 'ekvationer-paranteser',
          title: 'Paranteser',
          description: 'Lös ekvationer med paranteser',
          children: [{
            id: 'ekvationer-paranteser-konjugatregeln',
            title: 'Konjugatregeln',
            description: 'Lös ekvationer med konjugatregeln',
            children: []
          }, {
            id: 'ekvationer-paranteser-kvadreringsregeln',
            title: 'Kvadreringsregeln',
            description: 'Lös ekvationer med kvadreringsregeln',
            children: [{
              id: 'ekvationer-paranteser-kvadreringsregeln-positiv',
              title: 'Kvadreringsregeln (positiv)',
              description: 'Paranteser med +',
              children: []
            }, {
              id: 'ekvationer-paranteser-kvadreringsregeln-negativ',
              title: 'Kvadreringsregeln (negativ)',
              description: 'Paranteser med -',
              children: []
            }]
          }, {
            id: 'ekvationer-paranteser-steg',
            title: 'Steg för steg',
            description: 'Lös paranteser steg för steg',
            children: [{
              id: 'ekvationer-paranteser-steg-fler',
              title: 'Flera paranteser',
              description: 'Lös ekvationer med flera paranteser',
              children: []
            }, {
              id: 'ekvationer-paranteser-steg-större',
              title: 'Större ekvationer',
              description: 'Lös ekvationer med större paranteser',
              children: []
            }]
          }]
        }]
      }, {
        id: 'sannolikhet',
        title: 'Sannolikhet',
        description: 'Beräkna sannolikheter',
        children: [{
          id: 'sannolikhet-återläggning',
          title: 'Återläggning',
          description: 'Beräkna sannolikheter med återläggning',
          children: []
        }, {
          id: 'sannolikhet-ejåterläggning',
          title: 'Ej återläggning',
          description: 'Beräkna sannolikheter utan återläggning',
          children: []
        }, {
          id: 'sannolikhet-kombinationer',
          title: 'Kombinationer',
          description: 'Beräkna kombinationer',
          children: [{
            id: 'sannolikhet-kombinationer-återläggning ',
            title: 'Återläggning',
            description: 'Beräkna kombinationer med återläggning',
            children: []
          }, {
            id: 'sannolikhet-kombinationer-ejåterläggning',
            title: 'Ej återläggning',
            description: 'Beräkna kombinationer utan återläggning',
            children: []
          }]
        }]
      }, {
        id: 'trianglar',
        title: 'Trianglar',
        description: 'Typer av trianglar, vinkelsumma och pytagoras sats',
        children: [{
          id: 'trianglar-vinkelsumma',
          title: 'Vinkelsumma',
          description: 'Hitta vinklar i trianglar',
          children: []
        }, {
          id: 'trianglar-pythagoras',
          title: 'Pythagoras sats',
          description: 'Beräkna sidor i rätvinkliga trianglar',
          children: []
        }, {
          id: 'trianglar-area',
          title: 'Area',
          description: 'Beräkna arean av en triangel',
          children: []
        }]
      }, {
        id: 'procent',
        title: 'Procent',
        description: 'Räkna med procent',
        children: [{
          id: 'procent-grundläggande',
          title: 'Grundläggande',
          description: 'Grundläggande procenträkning',
          children: []
        }, {
          id: 'procent-förändring',
          title: 'Förändring',
          description: 'Beräkna procentuell förändring',
          children: []
        }, {
          id: 'procent-ränta',
          title: 'Ränta',
          description: 'Räkna med ränta',
          children: []
        }]
      }]
    }, {
      id: 'algebra',
      title: 'Algebra',
      description: 'Algebra och ekvationer',
      children: [{
        id: 'algebra-räkneregler',
        title: 'Räkneregler',
        description: 'Grundläggande räkneregler i algebra',
        children: [{
          id: 'algebra-räkneregler-konjugat',
          title: 'Konjugatregeln',
          description: 'Konjugatregeln för att multiplicera uttryck',
          children: []
        }, {
          id: 'algebra-räkneregler-kvadrering',
          title: 'Kvadreringsregeln',
          description: 'Kvadreringsregeln för att multiplicera uttryck',
          children: []
        }, {
          id: 'algebra-räkneregler-faktorisering',
          title: 'Faktorisering',
          description: 'Faktorisera uttryck',
          children: []
        }]
      }, {
        id: 'algebra-ekvationer',
        title: 'Ekvationer',
        description: 'Lösa ekvationer',
        children: [{
          id: 'algebra-ekvationer-förstagradsekvationer',
          title: 'Förstagradsekvationer',
          description: 'Linjära ekvationer',
          children: []
        }, {
          id: 'algebra-ekvationer-andragradsekvationer',
          title: 'Andragradsekvationer',
          description: 'Kvadratiska ekvationer',
          children: []
        }, {
          id: 'algebra-ekvationer-polynomekvationer',
          title: 'Polynomekvationer',
          description: 'Ekvationer av högre grad',
          children: []
        }]
      }, {
        id: 'algebra-funktioner',
        title: 'Funktioner',
        description: 'Förstå och arbeta med funktioner',
        children: [{
          id: 'algebra-funktioner-linjära',
          title: 'Linjära funktioner',
          description: 'Funktioner av första graden',
          children: []
        }, {
          id: 'algebra-funktioner-kvadratiska',
          title: 'Kvadratiska funktioner',
          description: 'Funktioner av andra graden',
          children: []
        }, {
          id: 'algebra-funktioner-exponentiella',
          title: 'Exponentiella funktioner',
          description: 'Funktioner som växer exponentiellt',
          children: []
        }]
      }]
    }]
  }, {
    id: 'verbal',
    title: 'Verbal del',
    description: 'Träna på den verbala delen av högskoleprovet',
    children: [{
      id: 'läsförståelse',
      title: 'Läsförståelse',
      description: 'Träna på att förstå och analysera texter',
      children: []
    }, {
      id: 'ordförståelse',
      title: 'Ordförståelse',
      description: 'Träna på att förstå och använda ord korrekt',
      children: []
    }, {
      id: 'meningskomplettering',
      title: 'Meningskomplettering',
      description: 'Träna på att komplettera meningar',
      children: []
    }]
  }]
};

const ProgressColors = {
  RED: '#ff6b6b',
  YELLOW: '#feca57',
  GREEN: '#1dd1a1'
};
//TODO: Gör den här snygg
const MomentTree = ({ onBack }) => {
  const [tree, setTree] = useState(initialTree);
  const [currentNode, setCurrentNode] = useState(initialTree);
  const [path, setPath] = useState([initialTree]);
  const [progress, setProgress] = useState({});
  const { token } = authStore();
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    // Fetch progress data from API
    const fetchProgress = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/general/category_stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          // Convert the data to a more usable format
          const progressMap = {};
          data.forEach(item => {
            progressMap[item.node_id] = {
              accuracy: item.accuracy,
              attempts: item.attempts,
              avgTime: item.avg_time
            };
          });
          setProgress(progressMap);
        }
      } catch (error) {
        console.error('Failed to fetch progress data:', error);
      }
    };

    if (token) {
      fetchProgress();
    } else {
      // Mock data for development
      setProgress({
        'root': { accuracy: 0.75, attempts: 100, avgTime: 45 },
        'kvantitativ': { accuracy: 0.8, attempts: 80, avgTime: 40 },
        'basics': { accuracy: 0.9, attempts: 40, avgTime: 30 },
        'basics-fraktioner': { accuracy: 0.85, attempts: 20, avgTime: 35 },
        'basics-fraktioner-förlänga': { accuracy: 0.7, attempts: 10, avgTime: 40 },
        'verbal': { accuracy: 0.6, attempts: 20, avgTime: 60 }
      });
    }
  }, [token]);

  const getProgressColor = (nodeId) => {
    const nodeProgress = progress[nodeId];
    if (!nodeProgress) return 'transparent';

    if (nodeProgress.accuracy >= 0.75 && nodeProgress.avgTime <= 30) {
      return ProgressColors.GREEN;
    } else if (nodeProgress.accuracy >= 0.75) {
      return ProgressColors.YELLOW;
    } else {
      return ProgressColors.RED;
    }
  };

  const updateNodeProgress = (nodeId, progress) => {
    // This would typically be called after completing exercises for a node
    setProgress(prev => ({
      ...prev,
      [nodeId]: progress
    }));
  };

  const navigateToNode = (node) => {
    setCurrentNode(node);
    setPath(prev => [...prev, node]);
  };

  const navigateBack = () => {
    if (path.length > 1) {
      const newPath = [...path];
      newPath.pop();
      setPath(newPath);
      setCurrentNode(newPath[newPath.length - 1]);
    }
  };

  const navigateToRoot = () => {
    setCurrentNode(initialTree);
    setPath([initialTree]);
  };

  const renderNode = (node, level = 0) => {
    const progressColor = getProgressColor(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isCurrentParent = currentNode.children && currentNode.children.includes(node);

    return (
      <div
        key={node.id}
        className={`relative p-4 rounded-lg mb-3 transition-all duration-300 
                  ${isCurrentParent ? 'bg-white shadow-lg' : 'bg-gray-50 hover:bg-white/80 hover:shadow-md'}`}
        onClick={() => hasChildren && navigateToNode(node)}
      >
        <div className="flex items-center">
          <div
            className="w-3 h-3 rounded-full mr-3"
            style={{ backgroundColor: progressColor }}
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{node.title}</h3>
            <p className="text-sm text-gray-600">{node.description}</p>
          </div>
          {hasChildren ? (
            <div className="ml-4 text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          ) : (
            <div className="flex items-center ml-4 space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Start exercises for ${node.id}`);
                }}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex-shrink-0"
              >
                Träna
              </button>
              {node.videoUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Show video: ${node.videoUrl} for ${node.id}`);
                    setVideoUrl(`/videos/${node.videoUrl}`); // Assuming videos are in public/videos/
                    setShowVideo(true);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0"
                >
                  Video
                </button>
              )}
            </div>
          )}
        </div>

        {progress[node.id] && (
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-500">
            <div>
              <span className="font-medium">Accuracy: </span>
              {Math.round(progress[node.id].accuracy * 100)}%
            </div>
            <div>
              <span className="font-medium">Attempts: </span>
              {progress[node.id].attempts}
            </div>
            <div>
              <span className="font-medium">Avg Time: </span>
              {progress[node.id].avgTime}s
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
        >
          Tillbaka
        </button>

        <div className="flex items-center overflow-x-auto py-2 flex-1">
          <button
            onClick={navigateToRoot}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex-shrink-0"
          >
            Hem
          </button>

          {path.slice(1).map((pathNode, index) => (
            <div key={pathNode.id} className="flex items-center flex-shrink-0">
              <span className="mx-2 text-gray-400">/</span>
              <button
                onClick={() => {
                  const newPath = path.slice(0, index + 2);
                  setPath(newPath);
                  setCurrentNode(newPath[newPath.length - 1]);
                }}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {pathNode.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Current Node Information */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{currentNode.title}</h2>
        <p className="text-gray-600">{currentNode.description}</p>
      </div>

      {/* Children Nodes */}
      <div className="space-y-2">
        {currentNode.children && currentNode.children.length > 0 ? (
          currentNode.children.map(childNode => renderNode(childNode))
        ) : (
          <div className="p-6 bg-blue-50 rounded-lg text-center">
            <p className="text-lg text-blue-700">
              Du har nått en slutnod! Här kan du träna på specifika övningar.
            </p>
            <button
              onClick={() => console.log(`Start exercises for ${currentNode.id}`)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Börja träna
            </button>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {showVideo && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowVideo(false)} // Close on backdrop click
        >
          <div 
            className="bg-white p-4 rounded-lg shadow-xl max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the player box
          >
            <button 
              onClick={() => setShowVideo(false)} 
              className="absolute top-2 right-2 text-black bg-white/50 rounded-full p-1 hover:bg-white/80"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <VideoPlayer src={videoUrl} controls autoPlay />
          </div>
        </div>
      )}
    </div>
  );
};

export default MomentTree;