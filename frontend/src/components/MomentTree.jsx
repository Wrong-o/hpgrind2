import React, { useState, useEffect, useMemo } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { useDatabase } from '../contexts/DatabaseContext';
import FocusPractice from './FocusPractice';

const MomentTree = ({ onBack, stats }) => {
  const { isLoading, error, ProgressColors, getProgressColor } = useDatabase();
  
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
          id: 'basics_operations_order',
          title: 'Räkneordning',
          description: 'Räknereordning för de olika räknesätten',
          children: []
        }, {
          id: 'basics_fraktioner',
          title: 'Bråk',
          description: 'Bråk och hur de fungerar',
          children: [{
            id: 'basics_fraktioner_förlänga',
            title: 'Förlänga',
            description: 'Förlänga ett bråk',
            children: []
          }, {
            id: 'basics_fraktioner_förkorta',
            title: 'Förkorta',
            description: 'Förkorta ett bråk',
            children: []
          }, {
            id: 'basics_fraktioner_addera',
            title: 'Addera',
            description: 'Addera ett bråk med ett annat bråk',
            children: [],
            videoUrl: 'FractionAddition.mp4'
          }, {
            id: 'basics_fraktioner_subtrahera',
            title: 'Subtrahera',
            description: 'Subtrahera ett bråk med ett annat bråk',
            children: [],
            videoUrl: 'FractionSubtraction.mp4'
          }, {
            id: 'basics_fraktioner_multiplicera',
            title: 'Multiplicera',
            description: 'Multiplicera ett bråk med ett annat bråk',
            children: [],
            videoUrl: 'FractionMultiplication.mp4'
          }, {
            id: 'basics_fraktioner_dividera',
            title: 'Dividera',
            description: 'Dividera ett bråk med ett annat bråk',
            children: [],
            videoUrl: 'FractionDivision.mp4'
          }]
        }, {
          id: 'basics_ekvationslösning',
          title: 'Ekvationslösning',
          description: 'Grunderna i att lösa ekvationer',
          children: [{
            id: 'basics_ekvationslösning_division',
            title: 'Dela för att lösa ekvationer',
            description: 'Om en ekvation har ett gångertal i sig kan man dela båda sidor för att få fram x',
            children: []
          }, {
            id: 'basics_ekvationslösning_multiplikation',
            title: 'Multiplicera för att lösa ekvationer',
            description: 'Om en ekvation har ett delat tal i sig kan man multiplicera båda sidor för att få fram x',
            children: []
          }, {
            id: 'basics_ekvationslösning_addition',
            title: 'Addera för att lösa ekvationer',
            description: 'Om en ekvation har ett subtraherat tal i sig kan man addera båda sidor för att få fram x',
            children: []
          }, {
            id: 'basics_ekvationslösning_subtraktion',
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
          id: 'medelvärde_median_typvärde',
          title: 'Medelvärde, Median och Typvärde',
          description: 'Hitta och beräkna medelvärdet, medianen och typvärdet',
          children: [{
            id: 'medelvärde',
            title: 'Medelvärde',
            description: 'Beräkna medelvärdet av en uppsättning tal',
            children: [{
              id: 'medelvärde_jämnt',
              title: 'Medelvärde: Jämnt antal tal',
              description: 'Beräkna medelvärdet av en uppsättning tal',
              children: []
            }, {
              id: 'medelvärde_udda',
              title: 'Medelvärde: Udda antal tal',
              description: 'Beräkna medelvärdet av en uppsättning tal',
              children: []
            }, {
              id: 'medelvärde_negativa',
              title: 'Medelvärde: Negativa tal',
              description: 'Beräkna medelvärdet av en uppsättning tal',
              children: []
            }]
          }, {
            id: 'median',
            title: 'Median',
            description: 'Hitta medianen av en uppsättning tal',
            children: [{
              id: 'median_udda',
              title: 'Median: Udda antal tal',
              description: 'Hitta medianen av en uppsättning tal',
              children: []
            }, {
              id: 'median_jämnt',
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
            id: 'ekvationer_linjer',
            title: 'Räta linjer',
            description: 'Grafer, punkter och lutning',
            children: [{
              id: 'ekvationer_linjer_ekvation',
              title: 'Linjära ekvationer',
              description: 'Om redan har ekvationen, hitta x eller y',
              children: [{
                id: 'ekvationer_linjer_ekvation_x',
                title: 'Hitta x',
                description: 'Om du har ekvationen och y, hitta x',
                children: []
              }, {
                id: 'ekvationer_linjer_ekvation_y',
                title: 'Hitta y',
                description: 'Om du har ekvationen och x, hitta y',
                children: []
              }]
            }, {
              id: 'ekvationer_linjer_punkter',
              title: 'Punkter och grafer',
              description: 'Om du har två punkter eller graf, hitta ekvationen',
              children: [{
                id: 'ekvationer_linjer_punkter_punkter',
                title: 'Ekvation från två punkter',
                description: 'Om du har två punkter, hitta ekvationen',
                children: []
              }, {
                id: 'ekvationer_linjer_punkter_graf',
                title: 'Ekvation från graf',
                description: 'Om du har en graf, hitta ekvationen',
                children: []
              }]
            }, {
              id: 'ekvationer_linjer_lutning',
              title: 'Lutning - Parallella och vinkelräta linjer',
              description: 'Bestäm om 2 linjer är parallella eller vinkelräta',
              children: [{
                id: 'ekvationer_linjer_lutning_parallella',
                title: 'Parallella linjer',
                description: 'Bestäm om 2 linjer är parallella',
                children: []
              }, {
                id: 'ekvationer_linjer_lutning_vinkelräta',
                title: 'Vinkelräta linjer',
                description: 'Bestäm om 2 linjer är vinkelräta',
                children: []
              }]
            }]
          }, {
            id: 'ekvationer_paranteser',
            title: 'Paranteser',
            description: 'Lös ekvationer med paranteser',
            children: [{
              id: 'ekvationer_paranteser_konjugatregeln',
              title: 'Konjugatregeln',
              description: 'Lös ekvationer med konjugatregeln',
              children: []
            }, {
              id: 'ekvationer_paranteser_kvadreringsregeln',
              title: 'Kvadreringsregeln',
              description: 'Lös ekvationer med kvadreringsregeln',
              children: [{
                id: 'ekvationer_paranteser_kvadreringsregeln_positiv',
                title: 'Kvadreringsregeln (positiv)',
                description: 'Paranteser med +',
                children: []
              }, {
                id: 'ekvationer_paranteser_kvadreringsregeln_negativ',
                title: 'Kvadreringsregeln (negativ)',
                description: 'Paranteser med -',
                children: []
              }]
            }, {
              id: 'ekvationer_paranteser_steg',
              title: 'Steg för steg',
              description: 'Lös paranteser steg för steg',
              children: [{
                id: 'ekvationer_paranteser_steg_fler',
                title: 'Flera paranteser',
                description: 'Lös ekvationer med flera paranteser',
                children: []
              }, {
                id: 'ekvationer_paranteser_steg_större',
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
            id: 'sannolikhet_återläggning',
            title: 'Återläggning',
            description: 'Beräkna sannolikheter med återläggning',
            children: []
          }, {
            id: 'sannolikhet_ejåterläggning',
            title: 'Ej återläggning',
            description: 'Beräkna sannolikheter utan återläggning',
            children: []
          }, {
            id: 'sannolikhet_kombinationer',
            title: 'Kombinationer',
            description: 'Beräkna kombinationer',
            children: [{
              id: 'sannolikhet_kombinationer_återläggning',
              title: 'Återläggning',
              description: 'Beräkna kombinationer med återläggning',
              children: []
            }, {
              id: 'sannolikhet_kombinationer_ejåterläggning',
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
            id: 'trianglar_vinkelsumma',
            title: 'Vinkelsumma',
            description: 'Hitta vinklar i trianglar',
            children: []
          }, {
            id: 'trianglar_pythagoras',
            title: 'Pythagoras sats',
            description: 'Beräkna sidor i rätvinkliga trianglar',
            children: []
          }, {
            id: 'trianglar_area',
            title: 'Area',
            description: 'Beräkna arean av en triangel',
            children: []
          }]
        }, {
          id: 'procent',
          title: 'Procent',
          description: 'Räkna med procent',
          children: [{
            id: 'procent_grundläggande',
            title: 'Grundläggande',
            description: 'Grundläggande procenträkning',
            children: []
          }, {
            id: 'procent_förändring',
            title: 'Förändring',
            description: 'Beräkna procentuell förändring',
            children: []
          }, {
            id: 'procent_ränta',
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
          id: 'algebra_räkneregler',
          title: 'Räkneregler',
          description: 'Grundläggande räkneregler i algebra',
          children: [{
            id: 'algebra_räkneregler_konjugat',
            title: 'Konjugatregeln',
            description: 'Konjugatregeln för att multiplicera uttryck',
            children: []
          }, {
            id: 'algebra_räkneregler_kvadrering',
            title: 'Kvadreringsregeln',
            description: 'Kvadreringsregeln för att multiplicera uttryck',
            children: []
          }, {
            id: 'algebra_räkneregler_faktorisering',
            title: 'Faktorisering',
            description: 'Faktorisera uttryck',
            children: []
          }]
        }, {
          id: 'algebra_ekvationer',
          title: 'Ekvationer',
          description: 'Lösa ekvationer',
          children: [{
            id: 'algebra_ekvationer_förstagradsekvationer',
            title: 'Förstagradsekvationer',
            description: 'Linjära ekvationer',
            children: []
          }, {
            id: 'algebra_ekvationer_andragradsekvationer',
            title: 'Andragradsekvationer',
            description: 'Kvadratiska ekvationer',
            children: []
          }, {
            id: 'algebra_ekvationer_polynomekvationer',
            title: 'Polynomekvationer',
            description: 'Ekvationer av högre grad',
            children: []
          }]
        }, {
          id: 'algebra_funktioner',
          title: 'Funktioner',
          description: 'Förstå och arbeta med funktioner',
          children: [{
            id: 'algebra_funktioner_linjära',
            title: 'Linjära funktioner',
            description: 'Funktioner av första graden',
            children: []
          }, {
            id: 'algebra_funktioner_kvadratiska',
            title: 'Kvadratiska funktioner',
            description: 'Funktioner av andra graden',
            children: []
          }, {
            id: 'algebra_funktioner_exponentiella',
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

  const [tree, setTree] = useState(initialTree);
  const [currentNode, setCurrentNode] = useState(initialTree);
  const [path, setPath] = useState([initialTree]);
  const [activeVideoInfo, setActiveVideoInfo] = useState({ nodeId: null, url: null });
  const [selectedPracticeNode, setSelectedPracticeNode] = useState(null);

  const progressMap = useMemo(() => {
    if (!stats) return {};

    const aggregatedStats = {};
    stats.forEach(item => {
      const nodeId = item.moment;
      if (!nodeId) return;

      if (!aggregatedStats[nodeId]) {
        aggregatedStats[nodeId] = { total_answers: 0, correct: 0 };
      }
      aggregatedStats[nodeId].total_answers += item.total_answers || 0;
      aggregatedStats[nodeId].correct += item.correct || 0;
    });

    const map = {};
    for (const nodeId in aggregatedStats) {
      const nodeStats = aggregatedStats[nodeId];
      const accuracy = nodeStats.total_answers > 0 ? (nodeStats.correct / nodeStats.total_answers) : 0;
      map[nodeId] = {
        attempts: nodeStats.total_answers,
        accuracy: accuracy,
        classification: getProgressColor(accuracy)
      };
    }
    return map;
  }, [stats, getProgressColor]);

  const getNodeProgressColor = (nodeId) => {
    const nodeProgress = progressMap[nodeId];
    if (!nodeProgress || nodeProgress.attempts === 0) return 'transparent';
    return nodeProgress.classification;
  };

  const countChildColors = (node) => {
    const counts = {
      gray: 0,
      red: 0,
      yellow: 0,
      green: 0
    };

    const countNodeColors = (currentNode) => {
      if (!currentNode.children || currentNode.children.length === 0) {
        const color = getNodeProgressColor(currentNode.id);
        if (color === 'transparent') counts.gray++;
        else if (color === ProgressColors.RED) counts.red++;
        else if (color === ProgressColors.YELLOW) counts.yellow++;
        else if (color === ProgressColors.GREEN) counts.green++;
      } else {
        currentNode.children.forEach(child => countNodeColors(child));
      }
    };

    countNodeColors(node);
    return counts;
  };

  const getNodeStats = (nodeId) => {
    if (!stats) return null;
    return stats.find(stat => stat.moment === nodeId);
  };

  const navigateToNode = (node) => {
    setCurrentNode(node);
    setPath(prev => [...prev, node]);
    setActiveVideoInfo({ nodeId: null, url: null });
  };

  const navigateToRoot = () => {
    setCurrentNode(initialTree);
    setPath([initialTree]);
    setActiveVideoInfo({ nodeId: null, url: null });
  };

  const handleVideoClick = (e, node) => {
    e.stopPropagation();
    if (activeVideoInfo.nodeId === node.id) {
      setActiveVideoInfo({ nodeId: null, url: null });
    } else {
      setActiveVideoInfo({ 
        nodeId: node.id, 
        url: `/videos/${node.videoUrl}`  // Make sure this path matches where your videos are stored
      });
    }
  };

  const renderNode = (node, level = 0) => {
    const progressColor = getNodeProgressColor(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isCurrentParent = currentNode.children && currentNode.children.includes(node);
    const isVideoActive = activeVideoInfo.nodeId === node.id;
    
    const nodeStats = getNodeStats(node.id);
    const childColorCounts = hasChildren ? countChildColors(node) : null;

    return (
      <div
        key={node.id}
        className={`relative p-4 rounded-lg mb-3 transition-all duration-300 
                  ${isCurrentParent ? 'bg-neutral-300 shadow-lg' : 'bg-gray-50 hover:bg-white/80 hover:shadow-md'}`}
        onClick={() => hasChildren && navigateToNode(node)} 
        style={{ cursor: hasChildren ? 'pointer' : 'default' }}
      >
        <div className="flex items-center mb-2">
          <div
            className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
            style={{ backgroundColor: progressColor }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{node.title}</h3>
            <p className="text-sm text-gray-600">{node.description}</p>
            {nodeStats && (
              <div className="mt-2 text-sm">
                <p className="text-blue-600">
                  Svarat på: {nodeStats.total_answers} frågor
                </p>
                <p className="text-green-600">
                  Rätt: {nodeStats.correct} ({Math.round((nodeStats.correct / nodeStats.total_answers) * 100)}%)
                </p>
                <p className="text-gray-500">
                  Svårighetsgrad: {nodeStats.difficulty}
                </p>
              </div>
            )}
            {hasChildren && childColorCounts && (
              <div className="mt-2 flex items-center gap-3 text-sm">
                <span className="text-gray-500">Delmoment:</span>
                {childColorCounts.gray > 0 && (
                  <span className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mr-1"></div>
                    {childColorCounts.gray}
                  </span>
                )}
                {childColorCounts.red > 0 && (
                  <span className="flex items-center">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ProgressColors.RED, marginRight: '4px' }}></div>
                    {childColorCounts.red}
                  </span>
                )}
                {childColorCounts.yellow > 0 && (
                  <span className="flex items-center">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ProgressColors.YELLOW, marginRight: '4px' }}></div>
                    {childColorCounts.yellow}
                  </span>
                )}
                {childColorCounts.green > 0 && (
                  <span className="flex items-center">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ProgressColors.GREEN, marginRight: '4px' }}></div>
                    {childColorCounts.green}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center ml-4 flex-shrink-0 space-x-2">
            {hasChildren ? (
              <div className="text-blue-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ) : (
              <>
                {node.videoUrl && (
                  <button
                    onClick={(e) => handleVideoClick(e, node)}
                    className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${isVideoActive ? 'text-blue-500' : 'text-gray-400'}`}
                    aria-label="Show video"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPracticeNode(node);
                  }}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                  aria-label={`Träna ${node.title}`}
                >
                  Tre snabba 
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 text-center">
        Laddar statistik...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 text-center text-red-600">
        Fel vid hämtning av statistik: {error}
      </div>
    );
  }

  return (
    <div className="flex w-full h-full">
      {/* Node Tree */}
      <div className="w-1/2 overflow-y-auto px-8 py-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
              aria-label="Gå tillbaka"
            >
              Tillbaka
            </button>

            <div className="flex items-center overflow-x-auto py-2 flex-1 whitespace-nowrap">
              <button
                onClick={navigateToRoot}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex-shrink-0"
                aria-label="Gå till Hem"
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
                      setActiveVideoInfo({ nodeId: null, url: null });
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    aria-label={`Gå till ${pathNode.title}`}
                  >
                    {pathNode.title}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{currentNode.title}</h2>
            <p className="text-gray-600">{currentNode.description}</p>
          </div>

          <div className="space-y-2">
            {currentNode.children && currentNode.children.length > 0 ? (
              currentNode.children.map(childNode => renderNode(childNode))
            ) : (
              <div className="p-6 bg-gray-100 rounded-lg text-center border border-gray-200">
                <p className="text-lg text-gray-700">
                  Det här är en specifik skill.
                </p>
                <div className="mt-4 flex justify-center space-x-3">
                  <button
                    onClick={() => setSelectedPracticeNode(currentNode)}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    aria-label={`räna ${currentNode.title}`}
                  >
                    Börja träna
                  </button>
                  {currentNode.videoUrl && (
                    <button
                      onClick={(e) => handleVideoClick(e, currentNode)}
                      className={`px-6 py-2 text-white rounded-lg transition-colors 
                                ${activeVideoInfo.nodeId === currentNode.id ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                      aria-label={`${activeVideoInfo.nodeId === currentNode.id ? 'Stäng' : 'Visa'} video för ${currentNode.title}`}
                    >
                      {activeVideoInfo.nodeId === currentNode.id ? 'Stäng Video' : 'Visa Video'}
                    </button>
                  )}
                </div>
                {activeVideoInfo.nodeId === currentNode.id && (
                  <div className="mt-4 inline-block relative w-full max-w-md mx-auto"> 
                    <VideoPlayer 
                      src={activeVideoInfo.url} 
                      controls 
                      autoPlay
                      width="100%" 
                      className="rounded-md overflow-hidden shadow-lg"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Practice Area */}
      {selectedPracticeNode ? (
        <div className="w-1/2 h-screen sticky top-0 bg-white shadow-lg border-l border-gray-200">
          <FocusPractice 
            key={selectedPracticeNode.id}
            moment={selectedPracticeNode.id}
            onClose={() => setSelectedPracticeNode(null)}
          />
        </div>
      ) : (
        <div className="w-1/2 h-screen sticky top-0 bg-gray-50 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>Välj en skill att träna på</p>
          </div>
        </div>
      )}

      {/* Video player */}
      {activeVideoInfo.nodeId && activeVideoInfo.url && (
        <div className="fixed top-28 right-10">
          <div className="w-[400px] rounded-lg overflow-hidden shadow-lg bg-white">
            <VideoPlayer src={activeVideoInfo.url}
              controls={true}
              autoPlay={true}
              loop={true}
              isDraggable={true}
            />
            <button 
              onClick={() => setActiveVideoInfo({ nodeId: null, url: null })}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Stäng video
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MomentTree;