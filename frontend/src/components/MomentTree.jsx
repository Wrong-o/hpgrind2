import React, { useState, useEffect, useMemo } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { useDatabase } from '../contexts/DatabaseContext';
import FocusPractice from './FocusPractice';

const MomentTree = ({ onBack, stats }) => {
  const { isLoading, error, ProgressColors, getProgressColor, userHistory, getMomentHistory, refreshUserData } = useDatabase();
  
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
          children: [
          {
            id: 'basics_fraktioner_förkorta',
            title: 'Förkorta',
            description: 'Förkorta ett bråk',
            children: [],
            videoUrl: 'FractionShortening.mp4'
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
            id: 'sannolikhet_enskild',
            title: 'Enskild sannolikhet',
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
              id: 'sannolikhet_kombinationer_ej_återläggning',
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
  const [currentNode, setCurrentNode] = useState(null);
  const [path, setPath] = useState([]);
  const [activeVideoInfo, setActiveVideoInfo] = useState({ nodeId: null, url: null });
  const [selectedPracticeNode, setSelectedPracticeNode] = useState(null);
  const [selectedHistoryNode, setSelectedHistoryNode] = useState(null);

  useEffect(() => {
    setCurrentNode(initialTree);
    setPath([initialTree]);
  }, []);

  // Cache the node ID from path to restore position after refresh
  const [lastNavigationState, setLastNavigationState] = useState({
    pathIds: [],
    currentNodeId: 'root'
  });

  // Store navigation state when it changes
  useEffect(() => {
    if (path.length && currentNode) {
      setLastNavigationState({
        pathIds: path.map(node => node.id),
        currentNodeId: currentNode.id
      });
    }
  }, [path, currentNode]);

  // Helper function to find a node by ID in the tree
  const findNodeById = (nodeId, searchNode = initialTree) => {
    if (searchNode.id === nodeId) {
      return searchNode;
    }
    
    if (searchNode.children) {
      for (const child of searchNode.children) {
        const found = findNodeById(nodeId, child);
        if (found) return found;
      }
    }
    
    return null;
  };

  // Restore navigation after tree updates
  useEffect(() => {
    // Skip on initial render
    if (path.length <= 1 || !lastNavigationState.pathIds.length) return;
    
    // If the current node ID doesn't match our last navigation state,
    // try to restore the navigation path
    if (currentNode?.id !== lastNavigationState.currentNodeId) {
      console.log('Attempting to restore navigation state...');
      
      const restoredPath = [];
      let success = true;
      
      // Rebuild the path using the cached IDs
      for (const nodeId of lastNavigationState.pathIds) {
        const node = findNodeById(nodeId);
        if (node) {
          restoredPath.push(node);
        } else {
          success = false;
          console.log(`Could not find node with ID: ${nodeId}`);
          break;
        }
      }
      
      // If we successfully rebuilt the path, restore it
      if (success && restoredPath.length) {
        console.log('Successfully restored navigation path');
        setPath(restoredPath);
        setCurrentNode(restoredPath[restoredPath.length - 1]);
      } else {
        console.log('Failed to restore navigation path');
      }
    }
  }, [stats, userHistory, lastNavigationState]);

  // Helper to preserve the selected history node after data refresh
  useEffect(() => {
    if (!selectedHistoryNode) return;
    
    // After stats are refreshed, restore the selected history node
    const node = findNodeById(selectedHistoryNode.id);
    if (node) {
      setSelectedHistoryNode(node);
    }
  }, [userHistory]);

  const progressMap = useMemo(() => {
    if (!stats) return {};
    
    return stats.reduce((map, stat) => {
      map[stat.moment] = {
        total_answers: stat.total_answers,
        correct: stat.correct,
        accuracy: stat.accuracy,
        classification: stat.classification
      };
      return map;
    }, {});
  }, [stats]);

  // Get the color for a specific node based on its progress and children's progress
  const getNodeProgressColor = (nodeId, node) => {
    // Direct stats for this node
    const nodeProgress = progressMap[nodeId];
    
    // If this node has stats, use its classification
    if (nodeProgress && nodeProgress.total_answers > 0) {
      return nodeProgress.classification;
    }
    
    // If this node has no stats but has children, calculate aggregate stats from children
    if (node && node.children && node.children.length > 0) {
      let totalAnswers = 0;
      let totalCorrect = 0;
      let childClassifications = [];
      
      // Function to recursively collect stats from all descendants
      const collectChildStats = (childNode) => {
        const childStats = progressMap[childNode.id];
        if (childStats) {
          if (childStats.total_answers > 0) {
            totalAnswers += childStats.total_answers;
            totalCorrect += childStats.correct;
          }
          if (childStats.classification !== ProgressColors.TRANSPARENT) {
            childClassifications.push(childStats.classification);
          }
        }
        
        if (childNode.children && childNode.children.length > 0) {
          childNode.children.forEach(grandchild => collectChildStats(grandchild));
        }
      };
      
      // Collect stats from all children
      node.children.forEach(child => collectChildStats(child));
      
      // If we found stats in children, determine an aggregate classification
      if (childClassifications.length > 0) {
        // If any child is red, the parent is red
        if (childClassifications.includes(ProgressColors.RED)) {
          return ProgressColors.RED;
        }
        // If any child is yellow and none are red, the parent is yellow
        if (childClassifications.includes(ProgressColors.YELLOW)) {
          return ProgressColors.YELLOW;
        }
        // If all children with classifications are green, the parent is green
        if (childClassifications.every(c => c === ProgressColors.GREEN)) {
          return ProgressColors.GREEN;
        }
        // Default to transparent if no clear classification
        return ProgressColors.TRANSPARENT;
      }
    }
    
    // If no stats found for node or children, return transparent
    return ProgressColors.TRANSPARENT;
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
        const color = getNodeProgressColor(currentNode.id, currentNode);
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

  const getNodeStats = (nodeId, node) => {
    // First check for direct stats
    if (stats) {
      const directStat = stats.find(stat => stat.moment === nodeId);
      if (directStat) return directStat;
    }

    // If no direct stats but node has children, aggregate from children
    if (node && node.children && node.children.length > 0) {
      let totalAnswers = 0;
      let totalCorrect = 0;
      
      // Function to recursively collect stats from all descendants
      const collectChildStats = (childNode) => {
        const childStats = progressMap[childNode.id];
        if (childStats && childStats.total_answers > 0) {
          totalAnswers += childStats.total_answers;
          totalCorrect += childStats.correct;
        }
        
        if (childNode.children && childNode.children.length > 0) {
          childNode.children.forEach(grandchild => collectChildStats(grandchild));
        }
      };
      
      // Collect stats from all children
      node.children.forEach(child => collectChildStats(child));
      
      // If we found stats in children, return aggregated stats
      if (totalAnswers > 0) {
        return {
          moment: nodeId,
          total_answers: totalAnswers,
          correct: totalCorrect,
          accuracy: totalCorrect / totalAnswers,
          classification: getProgressColor(totalCorrect / totalAnswers),
          isAggregated: true // Flag that these are aggregated stats
        };
      }
    }
    
    return null;
  };

  const navigateToNode = (node) => {
    setCurrentNode(node);
    setPath(prev => [...prev, node]);
    setActiveVideoInfo({ nodeId: null, url: null });
    // Don't reset selectedHistoryNode when navigating
  };

  const navigateToRoot = () => {
    setCurrentNode(initialTree);
    setPath([initialTree]);
    setActiveVideoInfo({ nodeId: null, url: null });
    // Don't reset selectedHistoryNode when navigating to root
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
    const progressColor = getNodeProgressColor(node.id, node);
    const hasChildren = node.children && node.children.length > 0;
    const isCurrentParent = currentNode && currentNode.children && currentNode.children.includes(node);
    const isVideoActive = activeVideoInfo.nodeId === node.id;
    const isHistoryActive = selectedHistoryNode && selectedHistoryNode.id === node.id;
    
    const nodeStats = getNodeStats(node.id, node);
    const childColorCounts = hasChildren ? countChildColors(node) : null;
    const nodeHistory = getMomentHistory ? getMomentHistory(node.id) : [];
    const hasHistory = nodeHistory && nodeHistory.length > 0;

    // Get performance status text based on color
    const getPerformanceStatus = (color) => {
      if (color === ProgressColors.GREEN) return "Snabb och korrekt";
      if (color === ProgressColors.YELLOW) return "Korrekt men långsam";
      if (color === ProgressColors.RED) return "Behöver övas mer";
      return "Inte tillräckligt med data";
    };

    // Calculate performance metrics for display
    const getPerformanceMetrics = () => {
      if (!hasHistory || nodeHistory.length < 1) return null;
      
      // Get last 10 questions
      const recentQuestions = nodeHistory
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
      
      const correctCount = recentQuestions.filter(q => q.correct).length;
      const totalTime = recentQuestions.reduce((sum, q) => sum + q.time_spent, 0);
      const avgTime = recentQuestions.length > 0 ? 
        Math.round((totalTime / recentQuestions.length) * 10) / 10 : 0;
      
      return {
        recentCount: recentQuestions.length,
        correctCount,
        avgTime,
        isComplete: recentQuestions.length >= 10
      };
    };

    const performanceMetrics = getPerformanceMetrics();

    return (
      <div
        key={node.id}
        className={`relative p-4 rounded-lg mb-3 transition-all duration-300 
                  ${isCurrentParent ? 'bg-neutral-300 shadow-lg' : 'bg-gray-50 hover:bg-white/80 hover:shadow-md'}
                  ${isHistoryActive ? 'ring-2 ring-blue-500' : ''}`}
        onClick={() => {
          if (hasChildren) {
            navigateToNode(node);
          } else if (!isHistoryActive && hasHistory) {
            setSelectedHistoryNode(node);
          }
        }} 
        style={{ cursor: (hasChildren || hasHistory) ? 'pointer' : 'default' }}
      >
        <div className="flex items-center mb-2">
          {hasChildren && childColorCounts ? (
            // For parent nodes, show color distribution instead of a single color
            <div className="flex-shrink-0 mr-3 w-auto flex items-center">
              <div className="flex flex-col">
                <div 
                  className="h-4 flex rounded-full overflow-hidden shadow-sm border border-gray-200" 
                  style={{ width: '40px' }}
                  title={`Distribution: ${childColorCounts.gray} ej tränade, ${childColorCounts.red} behöver övas, ${childColorCounts.yellow} långsamma, ${childColorCounts.green} bemästrade`}
                >
                  {childColorCounts.gray > 0 && (
                    <div 
                      className="h-full bg-gray-300" 
                      style={{ 
                        width: `${(childColorCounts.gray / (childColorCounts.gray + childColorCounts.red + childColorCounts.yellow + childColorCounts.green)) * 40}px`,
                        minWidth: childColorCounts.gray > 0 ? '3px' : '0'
                      }}
                    ></div>
                  )}
                  {childColorCounts.red > 0 && (
                    <div 
                      style={{ 
                        backgroundColor: ProgressColors.RED,
                        width: `${(childColorCounts.red / (childColorCounts.gray + childColorCounts.red + childColorCounts.yellow + childColorCounts.green)) * 40}px`,
                        minWidth: childColorCounts.red > 0 ? '3px' : '0'
                      }}
                    ></div>
                  )}
                  {childColorCounts.yellow > 0 && (
                    <div 
                      style={{ 
                        backgroundColor: ProgressColors.YELLOW,
                        width: `${(childColorCounts.yellow / (childColorCounts.gray + childColorCounts.red + childColorCounts.yellow + childColorCounts.green)) * 40}px`,
                        minWidth: childColorCounts.yellow > 0 ? '3px' : '0'
                      }}
                    ></div>
                  )}
                  {childColorCounts.green > 0 && (
                    <div 
                      style={{ 
                        backgroundColor: ProgressColors.GREEN,
                        width: `${(childColorCounts.green / (childColorCounts.gray + childColorCounts.red + childColorCounts.yellow + childColorCounts.green)) * 40}px`,
                        minWidth: childColorCounts.green > 0 ? '3px' : '0'
                      }}
                    ></div>
                  )}
                </div>
                <div className="text-xs text-gray-500 text-center" style={{ fontSize: '9px', marginTop: '1px' }}>
                  {childColorCounts.gray + childColorCounts.red + childColorCounts.yellow + childColorCounts.green} delmoment
                </div>
              </div>
            </div>
          ) : (
            // For leaf nodes, continue showing a single color indicator
            <div
              className="w-4 h-4 rounded-full mr-3 flex-shrink-0 transition-all duration-300"
              style={{ 
                backgroundColor: progressColor,
                boxShadow: progressColor !== ProgressColors.TRANSPARENT ? '0 0 6px ' + progressColor : 'none'
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{node.title}</h3>
            <p className="text-sm text-gray-600">{node.description}</p>
            {nodeStats && (
              <div className="mt-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">
                    Svarat på: {nodeStats.total_answers} frågor
                    {nodeStats.isAggregated && <span className="text-xs text-gray-500 ml-1">(inkl. delmoment)</span>}
                  </span>
                  {!hasChildren && progressColor !== ProgressColors.TRANSPARENT && (
                    <span className="px-2 py-0.5 rounded text-white text-xs font-medium"
                         style={{ backgroundColor: progressColor }}>
                      {getPerformanceStatus(progressColor)}
                    </span>
                  )}
                </div>
                {performanceMetrics && (
                  <div className="mt-1 text-xs text-gray-600">
                    {performanceMetrics.isComplete ? 
                      <p>Senaste 10 frågorna: {performanceMetrics.correctCount} rätt, {performanceMetrics.avgTime}s genomsnitt</p> : 
                      <p>Senaste {performanceMetrics.recentCount} frågorna: {performanceMetrics.correctCount} rätt</p>
                    }
                  </div>
                )}
                <p className="text-green-600">
                  Rätt: {nodeStats.correct} ({Math.round((nodeStats.correct / nodeStats.total_answers) * 100)}% totalt)
                </p>
                {hasHistory && (
                  <p className="text-gray-500 text-xs mt-1 cursor-pointer hover:text-blue-500" 
                     onClick={(e) => {
                       e.stopPropagation();
                       setSelectedHistoryNode(isHistoryActive ? null : node);
                     }}>
                    {isHistoryActive ? 'Dölj historik ▲' : 'Visa historik ▼'}
                  </p>
                )}
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
        
        {/* History panel */}
        {isHistoryActive && nodeHistory && nodeHistory.length > 0 && (
          <div className="mt-3 p-3 bg-gray-100 rounded-lg max-h-72 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700 text-sm">Historik för detta moment</h4>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // Prevent resetting navigation by using a local refresh function instead of directly calling refreshUserData
                  const refreshHistoryData = async () => {
                    try {
                      await refreshUserData();
                    } catch (error) {
                      console.error("Error refreshing data:", error);
                    }
                  };
                  refreshHistoryData();
                }}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Uppdatera
              </button>
            </div>
            <div className="space-y-2">
              {nodeHistory.slice(0, 10).map((entry, index) => {
                const date = new Date(entry.timestamp);
                const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                
                return (
                  <div key={index} className="flex items-center gap-2 text-sm p-2 bg-white rounded border border-gray-200">
                    <div 
                      className={`w-3 h-3 rounded-full ${entry.correct ? 'bg-green-500' : 'bg-red-500'}`}
                      title={entry.correct ? 'Rätt svar' : 'Fel svar'}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-gray-700">
                          {entry.skipped ? 'Hoppade över' : (entry.correct ? 'Rätt svar' : 'Fel svar')}
                        </p>
                        <p className="text-gray-500 text-xs">{formattedDate}</p>
                      </div>
                      <p className="text-xs text-gray-500">Tid: {entry.time_spent} sekunder • Svårighetsgrad: {entry.difficulty}</p>
                    </div>
                  </div>
                );
              })}
              {nodeHistory.length > 10 && (
                <p className="text-xs text-center text-gray-500 mt-2">
                  Visar de 10 senaste av totalt {nodeHistory.length} aktiviteter
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Count all nodes by color status across the entire tree
  const countAllNodeColors = () => {
    const counts = {
      gray: 0,
      red: 0,
      yellow: 0,
      green: 0,
      total: 0
    };

    const countNodesRecursively = (node) => {
      // Only count leaf nodes (nodes without children)
      if (!node.children || node.children.length === 0) {
        counts.total++;
        const color = getNodeProgressColor(node.id, node);
        if (color === ProgressColors.TRANSPARENT) counts.gray++;
        else if (color === ProgressColors.RED) counts.red++;
        else if (color === ProgressColors.YELLOW) counts.yellow++;
        else if (color === ProgressColors.GREEN) counts.green++;
      } else {
        // Recursively count children
        node.children.forEach(child => countNodesRecursively(child));
      }
    };

    // Start counting from the root
    countNodesRecursively(initialTree);
    return counts;
  };

  // Get the total counts
  const totalColorCounts = useMemo(() => countAllNodeColors(), [stats, userHistory]);

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
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Totala skills
              </button>
              
              {path.slice(1).map((node, i) => (
                <React.Fragment key={node.id}>
                  <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <button 
                    onClick={() => {
                      const newPath = path.slice(0, i + 2);
                      setPath(newPath);
                      setCurrentNode(newPath[newPath.length - 1]);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {node.title}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Total Tally Summary */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Total Framsteg</h3>
            <div className="grid grid-cols-5 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">{totalColorCounts.total}</div>
                <div className="text-xs text-gray-500">Totalt</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
                  <div className="text-2xl font-bold text-gray-500">{totalColorCounts.gray}</div>
                </div>
                <div className="text-xs text-gray-500">Ej tränade</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: ProgressColors.RED }}></div>
                  <div className="text-2xl font-bold" style={{ color: ProgressColors.RED }}>{totalColorCounts.red}</div>
                </div>
                <div className="text-xs text-gray-500">Behöver övas</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: ProgressColors.YELLOW }}></div>
                  <div className="text-2xl font-bold" style={{ color: ProgressColors.YELLOW }}>{totalColorCounts.yellow}</div>
                </div>
                <div className="text-xs text-gray-500">Långsamma</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: ProgressColors.GREEN }}></div>
                  <div className="text-2xl font-bold" style={{ color: ProgressColors.GREEN }}>{totalColorCounts.green}</div>
                </div>
                <div className="text-xs text-gray-500">Bemästrade</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="flex h-full rounded-full overflow-hidden">
                <div className="bg-gray-300 h-full" style={{ width: `${(totalColorCounts.gray / totalColorCounts.total) * 100}%` }}></div>
                <div style={{ backgroundColor: ProgressColors.RED, width: `${(totalColorCounts.red / totalColorCounts.total) * 100}%` }}></div>
                <div style={{ backgroundColor: ProgressColors.YELLOW, width: `${(totalColorCounts.yellow / totalColorCounts.total) * 100}%` }}></div>
                <div style={{ backgroundColor: ProgressColors.GREEN, width: `${(totalColorCounts.green / totalColorCounts.total) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">{currentNode?.title || 'Loading...'}</h2>
              <p className="text-gray-600">{currentNode?.description}</p>
            </div>
            
            <div className="mb-4 flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Färgkodning (baserat på senaste 10 frågorna):</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
                  <span className="text-xs text-gray-600">Mindre än 10 frågor</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: ProgressColors.RED }}></div>
                  <span className="text-xs text-gray-600">Mindre än 8 rätt svar</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: ProgressColors.YELLOW }}></div>
                  <span className="text-xs text-gray-600">Minst 8 rätt, genomsnitt över 15s</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: ProgressColors.GREEN }}></div>
                  <span className="text-xs text-gray-600">Minst 8 rätt, genomsnitt under 15s</span>
                </div>
              </div>
            </div>
            
            {currentNode && currentNode.children && currentNode.children.map(node => renderNode(node))}
          </div>
        </div>
      </div>

      {/* Right Panel - Video or Practice */}
      <div className="w-1/2 bg-gray-100 p-4 overflow-y-auto">
        {activeVideoInfo.nodeId && activeVideoInfo.url ? (
          <div className="p-4">
            <VideoPlayer src={activeVideoInfo.url} />
            <button
              onClick={() => setActiveVideoInfo({ nodeId: null, url: null })}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Stäng video
            </button>
          </div>
        ) : selectedPracticeNode ? (
          <FocusPractice 
            moment={selectedPracticeNode.id} 
            onClose={() => setSelectedPracticeNode(null)} 
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Välj en aktivitet
              </h3>
              <p className="text-gray-600">
                Klicka på en video eller "Tre snabba" för att öva på ett specifikt moment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MomentTree;