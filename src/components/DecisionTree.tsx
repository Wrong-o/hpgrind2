import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface Progress {
  total_attempts: number
  correct_percentage: number
  average_time: number
  skipped_percentage: number
}

interface TreeNode {
  id: string
  title: string
  description: string
  children: TreeNode[]
  isExpanded?: boolean
  progress?: Progress
}

interface DecisionTreeProps {
  onBack: () => void
}

const initialTree: TreeNode = {
  id: 'root',
  title: 'Vad vill du öva på?',
  description: 'Välj den väg som passar dig bäst',
  children: [
    {
      id: 'kvant',
      title: 'Kvantitativ del',
      description: 'Träna på mattematiken',
      children: [
        {
          id: 'xyz',
          title: 'Formelbladet',
          description: 'De olika komponenterna i formelbladet',
          children: [
            {
              id: 'Medelvärde, Median, Typvärde',
              title: 'Medelvärde, Median och Typvärde',
              description: 'Hitta och beräkna medelvärdet, medianen och typvärdet',
              children: [
                {
                  id: 'medelvarde',
                  title: 'Medelvärde',
                  description: 'Beräkna medelvärdet av en uppsättning tal',
                  children: [
                    {
                      id: 'medelvarde-jämnt',
                      title: 'Medelvärde: Jämnt antal tal',
                      description: 'Beräkna medelvärdet av en uppsättning tal',
                      children: []
                    },
                    {
                      id: 'medelvarde-udda',
                      title: 'Medelvärde: Udda antal tal',
                      description: 'Beräkna medelvärdet av en uppsättning tal',
                      children: []
                    },
                    {
                      id: 'medelvarde-negativa',
                      title: 'Medelvärde: Negativa tal',
                      description: 'Beräkna medelvärdet av en uppsättning tal',
                      children: []
                    }
                  ]
                },
                {
                  id: 'median',
                  title: 'Median',
                  description: 'Hitta medianen av en uppsättning tal',
                  children: [
                    {
                      id: 'median-udda',
                      title: 'Median: Udda antal tal',
                      description: 'Hitta medianen av en uppsättning tal',
                      children: []
                    },
                    {
                      id: 'median-jämnt',
                      title: 'Median: Jämnt antal tal',
                      description: 'Hitta medianen av en uppsättning tal',
                      children: []
                    }
                  ]
                },
                {
                  id: 'typvärde',
                  title: 'Typvärde',
                  description: 'Hitta det vanligaste värdet i en uppsättning tal',
                  children: []
                }
              ]
            },
            {
              id: 'ekvationer',
              title: 'Ekvationer',
              description: 'Lös för x',
              children: [
                {
                  id: 'ekvationer-linjer',
                  title: 'Räta linjer',
                  description: 'Grafer, punkter och lutning',
                  children: [
                    {
                      id: 'ekvationer-linjer-ekvation',
                      title: 'Linjära ekvationer',
                      description: 'Om redan har ekvationen, hitta x eller y',
                      children: [
                        {
                          id: 'ekvationer-linjer-ekvation-x',
                          title: 'Hitta x',
                          description: 'Om du har ekvationen och y, hitta x',
                          children: []
                        },
                        {
                          id: 'ekvationer-linjer-ekvation-y',
                          title: 'Hitta y',
                          description: 'Om du har ekvationen och x, hitta y',
                          children: []
                        }
                      ]
                    },
                    {
                      id: 'ekvationer-linjer-punkter',
                      title: 'Punkter och grafer',
                      description: 'Om du har två punkter eller graf, hitta ekvationen',
                      children: [
                        {
                          id: 'ekvationer-linjer-punkter-punkter',
                          title: 'Ekvation från två punkter',
                          description: 'Om du har två punkter, hitta ekvationen',
                          children: []
                        },
                        {
                          id: 'ekvationer-linjer-punkter-graf',
                          title: 'Ekvation från graf',
                          description: 'Om du har en graf, hitta ekvationen',
                          children: []
                        }
                      ]
                    },
                    {
                      id: 'ekvationer-linjer-lutning',
                      title: 'Lutning - Parallella och vinkelräta linjer',
                      description: 'Bestäm om 2 linjer är parallella eller vinkelräta',
                      children: [
                        {
                          id: 'ekvationer-linjer-lutning-parallella',
                          title: 'Parallella linjer',
                          description: 'Bestäm om 2 linjer är parallella',
                          children: []
                        },
                        {
                          id: 'ekvationer-linjer-lutning-vinkelräta',
                          title: 'Vinkelräta linjer',
                          description: 'Bestäm om 2 linjer är vinkelräta',
                          children: []
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 'ekvationer-paranteser',
                  title: 'Paranteser',
                  description: 'Lös ekvationer med paranteser',
                  children: [
                    {
                      id: 'ekvationer-paranteser-konjugatregeln',
                      title: 'Konjugatregeln',
                      description: 'Lös ekvationer med konjugatregeln',
                      children: []
                    },
                    {
                      id: 'ekvationer-paranteser-kvadreringsregeln',
                      title: 'Kvadreringsregeln',
                      description: 'Lös ekvationer med kvadreringsregeln',
                      children: [
                        {
                          id: 'ekvationer-paranteser-kvadreringsregeln-positiv',
                          title: 'Kvadreringsregeln (positiv)',
                          description: 'Paranteser med +',
                          children: []
                        },
                        {
                          id: 'ekvationer-paranteser-kvadreringsregeln-negativ',
                          title: 'Kvadreringsregeln (negativ)',
                          description: 'Paranteser med -',
                          children: []
                        }
                      ]
                    },
                    {
                      id: 'ekvationer-paranteser-steg',
                      title: 'Steg för steg',
                      description: 'Lös paranteser steg för steg',
                      children: [
                        {
                          id: 'ekvationer-paranteser-steg-fler',
                          title: 'Flera paranteser',
                          description: 'Lös ekvationer med flera paranteser',
                          children: []
                        },
                        {
                          id: 'ekvationer-paranteser-steg-större',
                          title: 'Större ekvationer',
                          description: 'Lös ekvationer med större paranteser',
                          children: []
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: 'sannolikhet',
              title: 'Sannolikhet',
              description: 'Beräkna sannolikheter',
              children: [
                {
                  id: 'sannolikhet-återläggning',
                  title: 'Återläggning',
                  description: 'Beräkna sannolikheter med återläggning',
                  children: []
                },
                {
                  id: 'sannolikhet-ejåterläggning',
                  title: 'Ej återläggning',
                  description: 'Beräkna sannolikheter utan återläggning',
                  children: []
                },
                {
                  id: 'sannolikhet-kombinationer',
                  title: 'Kombinationer',
                  description: 'Beräkna kombinationer',
                  children: [
                    {
                      id: 'sannolikhet-kombinationer-återläggning ',
                      title: 'Återläggning',
                      description: 'Beräkna kombinationer med återläggning',
                      children: []
                    },
                    {
                      id: 'sannolikhet-kombinationer-ejåterläggning',
                      title: 'Ej återläggning',
                      description: 'Beräkna kombinationer utan återläggning',
                      children: []
                    }
                  ]
                }
              ]
            },
            {
              id: 'trianglar',
              title: 'Trianglar',
              description: 'Typer av trianglar, vinkelsumma och pytagoras sats',
              children: [
                {
                  id: 'trianglar-typer',
                  title: 'Typer av trianglar',
                  description: 'Rätvinkliga, liksidiga och likbenta',
                  children: [
                    {
                      id: 'trianglar-typer-rätvinkliga',
                      title: 'Rätvinkliga trianglar',
                      description: 'Lös ekvationer med rätvinkliga trianglar',
                      children: [
                        {
                          id: 'trianglar-typer-rätvinkliga-pytagoras',
                          title: 'Pytagoras sats',
                          description: 'Lös ekvationer med pytagoras sats',
                          children: [
                            {
                              id: 'trianglar-typer-rätvinkliga-pytagoras-katet',
                              title: 'Katet',
                              description: 'Lös ekvationer med pytagoras sats när katet saknas',
                              children: []
                            },
                            {
                              id: 'trianglar-typer-rätvinkliga-pytagoras-hypotenusa',
                              title: 'Hypotenusa',
                              description: 'Lös ekvationer med pytagoras sats när hypotenusa saknas',
                              children: []
                            },
                            {
                              id: 'trianglar-typer-rätvinkliga-pytagoras-avståndsformel',
                              title: 'Avståndsformel',
                              description: 'Använd pytagoras sats för att beräkna avståndet mellan två punkter',
                              children: []
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: 'trianglar-typer-liksidiga',
                      title: 'Liksidiga trianglar',
                      description: 'Lös ekvationer med liksidiga trianglar',
                      children: []
                    },
                    {
                      id: 'trianglar-typer-likbenta',
                      title: 'Likbenta trianglar',
                      description: 'Lös ekvationer med likbenta trianglar',
                      children: []
                    }

                  ]
                },
                {
                  id: 'trianglar-vinkelsumma',
                  title: 'Vinkelsumma',
                  description: 'Beräkna vinkelsumman i en triangel',
                  children: []
                },
                {
                  id: 'trianglar-area',
                  title: 'Area',
                  description: 'Beräkna arean av en triangel',
                  children: []
                }
                
              ]
            },
            {
              id: 'cirklar',
              title: 'Cirklar',
              description: 'Beräkna omkrets och area av en cirkel',
              children: [
                {
                  id: 'cirklar-omkrets',
                  title: 'Omkrets',
                  description: 'Beräkna omkretsen av en cirkel eller en cirkelbåge',
                  children: [
                    {
                      id: 'cirklar-omkrets-cirkel',
                      title: 'Cirkel',
                      description: 'Beräkna omkretsen av en cirkel',
                      children: []
                    },
                    {
                      id: 'cirklar-omkrets-cirkelbåge',
                      title: 'Cirkelbåge',
                      description: 'Beräkna omkretsen av en cirkelbåge',
                      children: []
                    }

                  ]
                },
                {
                  id: 'cirklar-area',
                  title: 'Area',
                  description: 'Beräkna arean av en cirkel eller en cirkelbåge',
                  children: [
                    {
                      id: 'cirklar-area-cirkel',
                      title: 'Cirkel',
                      description: 'Beräkna arean av en cirkel',
                      children: []
                    },
                    {
                      id: 'cirklar-area-cirkelbåge',
                      title: 'Cirkelbåge',
                      description: 'Beräkna arean av en cirkelbåge',
                      children: []
                    }

                  ]
                }
              ]
            },
            {
              id: 'vinklar',
              title: 'Vinklar',
              description: 'Använd vinklar för att hitta andra vinklar',
              children: [
                {
                  id: 'vinklar-relationer',
                  title: 'Relationer mellan vinklar',
                  description: 'Använd relationer mellan vinklar för att hitta andra vinklar',
                  children: []
                },
                {
                  id: 'vinklar-raka-linjer',
                  title: 'Antaganden om raka linjer',
                  description: 'Använd antaganden om raka linjer för att hitta andra vinklar',
                  children: [
                    {
                      id: 'vinklar-raka-linjer-180',
                      title: '180 grader',
                      description: 'Använd 180 grader för att hitta andra vinklar',
                      children: []
                    },
                    {
                      id: 'vinklar-raka-linjer-360',
                      title: '360 grader',
                      description: 'Använd 360 grader för att hitta andra vinklar',
                      children: []
                    }
                  ]
                }
              ]
            },
            {
              id: 'volym',
              title: '3d former',
              description: 'Beräkna volymen av en kropp',
              children: [
                {
                  id: 'volym-klot',
                  title: 'Klot',
                  description: 'Beräkna volymen av en klot',
                  children: []
                },
                {
                  id: 'volym-pyramid',
                  title: 'Pyramid',
                  description: 'Beräkna volymen av en pyramid',
                  children: []
                },
                {
                  id: 'volym-cylinder',
                  title: 'Cylinder',
                  description: 'Beräkna volym, mantelarea och begränsningsarea av en cylinder',
                  children: [
                    {
                      id: 'volym-cylinder-volym',
                      title: 'Volym',
                      description: 'Beräkna volymen av en cylinder',
                      children: []
                    },
                    {
                      id: 'volym-cylinder-mantelarea',
                      title: 'Mantelarea',
                      description: 'Beräkna mantelarean av en cylinder',
                      children: []
                    },
                    {
                      id: 'volym-cylinder-begränsningsarea',
                      title: 'Begränsningsarea',
                      description: 'Beräkna begränsningsarean av en cylinder',
                      children: []
                    }
                  ]
                },
                {
                  id: 'volym-kub',
                  title: 'Kub',
                  description: 'Beräkna volymen av en kub',
                  children: []
                }

              ]
            },
            {
              id: 'fyrkanter',
              title: 'Fyrkanter',
              description: 'Beräkna omkrets och area av olika fyrkanter',
              children: [
                {
                  id: 'fyrkanter-rektangel',
                  title: 'Rektangel',
                  description: 'Beräkna omkrets och area av en rektangel',
                  children: [
                    {
                      id: 'fyrkanter-rektangel-omkrets',
                      title: 'Omkrets',
                      description: 'Beräkna omkretsen av en rektangel',
                      children: []
                    },
                    {
                      id: 'fyrkanter-rektangel-area',
                      title: 'Area',
                      description: 'Beräkna arean av en rektangel',
                      children: []
                    }
                  ]
                },
                {
                  id: 'fyrkanter-kvadrat',
                  title: 'Kvadrat',
                  description: 'Beräkna omkrets och area av en kvadrat',
                  children: [
                    {
                      id: 'fyrkanter-kvadrat-omkrets',
                      title: 'Omkrets',
                      description: 'Beräkna omkretsen av en kvadrat',
                      children: []
                    },
                    {
                      id: 'fyrkanter-kvadrat-area',
                      title: 'Area',
                      description: 'Beräkna arean av en kvadrat',
                      children: []
                    }
                  ]
                },
                {
                  id: 'fyrkanter-parallellogram',
                  title: 'Parallellogram',
                  description: 'Beräkna omkrets och area av en parallellogram',
                  children: [
                    {
                      id: 'fyrkanter-parallellogram-omkrets',
                      title: 'Omkrets',
                      description: 'Beräkna omkretsen av en parallellogram',
                      children: []
                    },
                    {
                      id: 'fyrkanter-parallellogram-area',
                      title: 'Area',
                      description: 'Beräkna arean av en parallellogram',
                      children: []
                    }
                  ]
                },
                {
                  id: 'fyrkanter-parallelltrapets',
                  title: 'Parallelltrapets',
                  description: 'Beräkna omkrets och area av en parallelltrapets',
                  children: [
                    {
                      id: 'fyrkanter-parallelltrapets-omkrets',
                      title: 'Omkrets',
                      description: 'Beräkna omkretsen av en parallelltrapets',
                      children: []
                    },
                    {
                      id: 'fyrkanter-parallelltrapets-area',
                      title: 'Area',
                      description: 'Beräkna arean av en parallelltrapets',
                      children: []
                    }
                  ]
                }
              ]
            },
            {
              id: 'potenser',
              title: 'Potenser',
              description: 'Beräkna potenser',
              children: [
                {
                  id: 'potenser-rotenur',
                  title: 'Roten ur',
                  description: 'Beräkna roten ur',
                  children: [
                    {
                      id: 'potenser-rotenur-upphöjt',
                      title: 'Roten ur upphöjt',
                      description: 'Beräkna roten ur upphöjt',
                      children: []
                    },
                    {
                      id: 'potenser-rotenur-gångerrotenur',
                      title: 'Roten ur gånger roten ur',
                      description: 'Beräkna roten ur gånger roten ur',
                      children: []
                    }
                  ]
                },
                {
                  id: 'potenser-upphöjt',
                  title: 'Upphöjt',
                  description: 'Beräkna upphöjt i kvadrat, kubik och negativt tal',
                  children: [
                    {
                      id: 'potenser-upphöjt-kvadrat',
                      title: 'Kvadrat',
                      description: 'Beräkna kvadraten av ett tal',
                      children: []
                    },
                    {
                      id: 'potenser-upphöjt-kubik',
                      title: 'Kubik',
                      description: 'Beräkna kubiken av ett tal',
                      children: []
                    },
                    {
                      id: 'potenser-upphöjt-negativ',
                      title: 'Negativ',
                      description: 'Beräkna negativt tal',
                      children: []
                    }
                  ]
                },
                {
                  id: 'potenser-potenslagar',
                  title: 'Potenslagar',
                  description: 'Beräkna potenslagar',
                  children: [
                    {
                      id: 'potenser-potenslagar-multiplikation',
                      title: 'Multiplikation',
                      description: 'Beräkna multiplikation',
                      children: []
                    },
                    {
                      id: 'potenser-potenslagar-division',
                      title: 'Division',
                      description: 'Beräkna division',
                      children: []
                    },
                    {
                      id: 'potenser-potenslagar-basbyte',
                      title: 'Basbyte',
                      description: 'Beräkna basbyte',
                      children: []
                    }
                  ]
                }
              ]
            }
            
            
          ]
        },
        {
          id: 'nog',
          title: 'NOG - Numerisk och grafisk problemlösning',
          description: 'Grafer, tabeller och numeriska problem',
          children: [
            {
              id: 'nog-graphs',
              title: 'Grafanalys',
              description: 'Tolka och analysera grafer',
              children: []
            },
            {
              id: 'nog-tables',
              title: 'Tabellanalys',
              description: 'Tolka och analysera tabeller',
              children: []
            }
          ]
        }
      ]
    },
    {
      id: 'kval',
      title: 'Kvalitativ del',
      description: 'Läsförståelse och analytiskt tänkande',
      children: [
        {
          id: 'pro',
          title: 'PRO - Problemlösning',
          description: 'Logiska problem och resonemang',
          children: [
            {
              id: 'pro-logic',
              title: 'Logiska resonemang',
              description: 'Träna på logiskt tänkande',
              children: []
            },
            {
              id: 'pro-complex',
              title: 'Komplexa problem',
              description: 'Flera steg och samband',
              children: []
            }
          ]
        },
        {
          id: 'dtk',
          title: 'DTK - Diagram, tabeller och kartor',
          description: 'Tolka visuell information',
          children: [
            {
              id: 'dtk-diagrams',
              title: 'Diagramtolkning',
              description: 'Förstå och analysera diagram',
              children: []
            },
            {
              id: 'dtk-maps',
              title: 'Kartor och skalor',
              description: 'Arbeta med kartor och skalor',
              children: []
            }
          ]
        }
      ]
    }
  ]
}

export const DecisionTree: React.FC<DecisionTreeProps> = ({ onBack }) => {
  const [tree, setTree] = useState<TreeNode>(initialTree)
  const { token, isLoggedIn } = useAuth()

  const getNodeColor = (progress?: Progress): string => {
    if (!progress) return 'bg-gray-200 text-gray-600' // No data
    
    const isCompleted = progress.total_attempts >= 10 // Consider "completed" if at least 10 attempts
    const isFast = progress.average_time < 60 // Less than 60 seconds average
    const isAccurate = progress.correct_percentage > 70 // More than 70% correct

    if (isCompleted && isFast && isAccurate) {
      return 'bg-green-100 text-green-800' // Done
    } else if (isCompleted && isAccurate) {
      return 'bg-yellow-100 text-yellow-800' // Too slow
    } else {
      return 'bg-red-100 text-red-800' // Not completed or not accurate enough
    }
  }

  const getNodeStatus = (progress?: Progress): 'none' | 'green' | 'yellow' | 'red' => {
    if (!progress) return 'none'
    
    const isCompleted = progress.total_attempts >= 10
    const isFast = progress.average_time < 60
    const isAccurate = progress.correct_percentage > 70

    if (isCompleted && isFast && isAccurate) return 'green'
    if (isCompleted && isAccurate) return 'yellow'
    return 'red'
  }

  const countChildrenStatus = (node: TreeNode): { none: number; green: number; yellow: number; red: number } => {
    const counts = { none: 0, green: 0, yellow: 0, red: 0 }
    
    const countNode = (n: TreeNode) => {
      if (n.children.length === 0) {
        // This is a leaf node, count its status
        counts[getNodeStatus(n.progress)]++
      } else {
        // Recursively count children
        n.children.forEach(countNode)
      }
    }

    node.children.forEach(countNode)
    return counts
  }

  const fetchProgress = async (nodeId: string) => {
    if (!isLoggedIn || !token) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/stats/${nodeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        credentials: 'include',
      })

      if (response.ok) {
        const progress = await response.json()
        updateNodeProgress(nodeId, progress)
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
    }
  }

  const updateNodeProgress = (nodeId: string, progress: Progress) => {
    const updateNode = (node: TreeNode): TreeNode => {
      if (node.id === nodeId) {
        return { ...node, progress }
      }
      return {
        ...node,
        children: node.children.map(updateNode)
      }
    }
    setTree(updateNode(tree))
  }

  useEffect(() => {
    const fetchAllProgress = (node: TreeNode) => {
      if (node.children.length === 0) {
        fetchProgress(node.id)
      } else {
        node.children.forEach(fetchAllProgress)
      }
    }

    if (isLoggedIn) {
      fetchAllProgress(tree)
    }
  }, [isLoggedIn, tree.id])

  const toggleNode = (nodeId: string) => {
    const updateNode = (node: TreeNode): TreeNode => {
      if (node.id === nodeId) {
        return { ...node, isExpanded: !node.isExpanded }
      }
      return {
        ...node,
        children: node.children.map(updateNode)
      }
    }
    setTree(updateNode(tree))
  }

  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children.length > 0
    const isRoot = level === 0
    const nodeColor = hasChildren ? (isRoot ? 'bg-blue-600 text-white' : 'bg-white/80 backdrop-blur-sm') : getNodeColor(node.progress)

    // Get status counts for nodes with children
    const statusCounts = hasChildren ? countChildrenStatus(node) : null

    return (
      <div
        key={node.id}
        className={`
          ${level > 0 ? 'ml-8' : ''} 
          relative
        `}
      >
        {/* Connection lines */}
        {level > 0 && (
          <div 
            className="absolute -left-6 top-1/2 w-6 h-px bg-blue-300"
            style={{ transform: 'translateY(-50%)' }}
          />
        )}
        
        {/* Node content */}
        <div 
          className={`
            relative p-4 rounded-lg mb-4 cursor-pointer
            transition-all duration-300 transform hover:scale-102
            ${nodeColor}
            border border-blue-200 shadow-lg
            ${hasChildren ? 'hover:shadow-xl' : ''}
          `}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          <h3 className={`text-lg font-bold ${isRoot ? 'text-white' : ''}`}>
            {node.title}
          </h3>
          <p className={`text-sm ${isRoot ? 'text-blue-100' : ''}`}>
            {node.description}
          </p>
          
          {/* Status summary for parent nodes */}
          {hasChildren && statusCounts && (
            <div className="mt-2 text-sm flex gap-3">
              <span className="font-medium">Delmoment:</span>
              {statusCounts.green > 0 && (
                <span className="text-green-600">✓ {statusCounts.green}</span>
              )}
              {statusCounts.yellow > 0 && (
                <span className="text-yellow-600">⚠ {statusCounts.yellow}</span>
              )}
              {statusCounts.red > 0 && (
                <span className="text-red-600">✗ {statusCounts.red}</span>
              )}
              {statusCounts.none > 0 && (
                <span className="text-gray-400">? {statusCounts.none}</span>
              )}
            </div>
          )}

          {/* Progress info for leaf nodes */}
          {!hasChildren && node.progress && (
            <div className="mt-2 text-sm">
              <p>Antal klarade övningar: {Math.floor((node.progress.correct_percentage * node.progress.total_attempts) / 100)}</p>
              <p>Totalt antal försök: {node.progress.total_attempts}</p>
              <p>Genomsnittlig tid: {Math.round(node.progress.average_time)}s</p>
            </div>
          )}

          {hasChildren && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transition-transform duration-300 ${node.isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke={isRoot ? 'white' : 'currentColor'}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && node.isExpanded && (
          <div className="space-y-4 relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-300" />
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl p-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed top-4 left-4 px-4 py-2 bg-blue-600 text-white 
                 rounded-lg hover:bg-blue-700 transition-colors z-50"
      >
        Tillbaka
      </button>

      {/* Tree container */}
      <div className="mt-16 space-y-6">
        {renderNode(tree)}
      </div>
    </div>
  )
} 