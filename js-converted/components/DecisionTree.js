"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionTree = void 0;
var react_1 = require("react");
var AuthContext_1 = require("../contexts/AuthContext");
var initialTree = {
    id: 'root',
    title: 'Totala skills',
    description: 'Klicka här för att hitta specifika skills att träna på',
    children: [
        {
            id: 'kvantitativ',
            title: 'Kvantitativ del',
            description: 'Träna på matematiken',
            children: [
                {
                    id: 'basics',
                    title: 'Grunderna',
                    description: 'Grunderna i matematiken som behövs för att kunna sätta igång',
                    children: [
                        {
                            id: 'basics-operations_order',
                            title: 'Räkneordning',
                            description: 'Räknereordning för de olika räknesätten',
                            children: []
                        },
                        {
                            id: 'basics-fraktioner',
                            title: 'Fraktioner',
                            description: 'Fraktioner och hur de fungerar',
                            children: [
                                {
                                    id: 'basics-fraktioner-förlänga',
                                    title: 'Förlänga',
                                    description: 'Förlänga en fraktion',
                                    children: []
                                },
                                {
                                    id: 'basics-fraktioner-förkorta',
                                    title: 'Förkorta',
                                    description: 'Förkorta en fraktion',
                                    children: []
                                },
                                {
                                    id: 'basics-fraktioner-addera',
                                    title: 'Addera',
                                    description: 'Addera en fraktion',
                                    children: []
                                },
                                {
                                    id: 'basics-fraktioner-multiplicera',
                                    title: 'Multiplicera',
                                    description: 'Multiplicera en fraktion',
                                    children: []
                                }
                            ]
                        },
                        {
                            id: 'basics-ekvationslösning',
                            title: 'Ekvationslösning',
                            description: 'Grunderna i att lösa ekvationer',
                            children: [
                                {
                                    id: 'basics-ekvationslösning-division',
                                    title: 'Dela för att lösa ekvationer',
                                    description: 'Om en ekvation har ett gångertal i sig kan man dela båda sidor för att få fram x',
                                    children: []
                                },
                                {
                                    id: 'basics-ekvationslösning-multiplikation',
                                    title: 'Multiplicera för att lösa ekvationer',
                                    description: 'Om en ekvation har ett delat tal i sig kan man multiplicera båda sidor för att få fram x',
                                    children: []
                                },
                                {
                                    id: 'basics-ekvationslösning-addition',
                                    title: 'Addera för att lösa ekvationer',
                                    description: 'Om en ekvation har ett subtraherat tal i sig kan man addera båda sidor för att få fram x',
                                    children: []
                                },
                                {
                                    id: 'basics-ekvationslösning-subtraktion',
                                    title: 'Subtrahera för att lösa ekvationer',
                                    description: 'Om en ekvation har ett adderat tal i sig kan man subtrahera båda sidor för att få fram x',
                                    children: []
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'formelblad',
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
};
var DecisionTree = function (_a) {
    var onBack = _a.onBack;
    var _b = (0, react_1.useState)(initialTree), tree = _b[0], setTree = _b[1];
    var _c = (0, AuthContext_1.useAuth)(), token = _c.token, isLoggedIn = _c.isLoggedIn;
    var getNodeColor = function (progress) {
        if (!progress)
            return 'bg-gray-200 text-gray-600';
        var isCompleted = progress.total_attempts >= 10;
        var isFast = progress.average_time < 60;
        var isAccurate = progress.correct_percentage > 70;
        if (isCompleted && isFast && isAccurate) {
            return 'bg-green-100 text-green-800';
        }
        else if (isCompleted && isAccurate) {
            return 'bg-yellow-100 text-yellow-800';
        }
        else {
            return 'bg-red-100 text-red-800';
        }
    };
    var getNodeStatus = function (progress) {
        if (!progress)
            return 'none';
        var isCompleted = progress.total_attempts >= 10;
        var isFast = progress.average_time < 60;
        var isAccurate = progress.correct_percentage > 70;
        if (isCompleted && isFast && isAccurate)
            return 'green';
        if (isCompleted && isAccurate)
            return 'yellow';
        return 'red';
    };
    var countChildrenStatus = function (node) {
        var counts = { none: 0, green: 0, yellow: 0, red: 0 };
        var countNode = function (n) {
            if (n.children.length === 0) {
                counts[getNodeStatus(n.progress)]++;
            }
            else {
                n.children.forEach(countNode);
            }
        };
        node.children.forEach(countNode);
        return counts;
    };
    var fetchProgress = function (nodeId) { return __awaiter(void 0, void 0, void 0, function () {
        var response, progress, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isLoggedIn || !token)
                        return [2];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4, fetch("".concat(import.meta.env.VITE_API_URL, "/api/user/stats/").concat(nodeId), {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Accept': 'application/json',
                            },
                            credentials: 'include',
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3, 4];
                    return [4, response.json()];
                case 3:
                    progress = _a.sent();
                    updateNodeProgress(nodeId, progress);
                    _a.label = 4;
                case 4: return [3, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error fetching progress:', error_1);
                    return [3, 6];
                case 6: return [2];
            }
        });
    }); };
    var updateNodeProgress = function (nodeId, progress) {
        var updateNode = function (node) {
            if (node.id === nodeId) {
                return __assign(__assign({}, node), { progress: progress });
            }
            return __assign(__assign({}, node), { children: node.children.map(updateNode) });
        };
        setTree(updateNode(tree));
    };
    (0, react_1.useEffect)(function () {
        var fetchAllProgress = function (node) {
            if (node.children.length === 0) {
                fetchProgress(node.id);
            }
            else {
                node.children.forEach(fetchAllProgress);
            }
        };
        if (isLoggedIn) {
            fetchAllProgress(tree);
        }
    }, [isLoggedIn, tree.id]);
    var toggleNode = function (nodeId) {
        var updateNode = function (node) {
            if (node.id === nodeId) {
                return __assign(__assign({}, node), { isExpanded: !node.isExpanded });
            }
            return __assign(__assign({}, node), { children: node.children.map(updateNode) });
        };
        setTree(updateNode(tree));
    };
    var renderNode = function (node, level) {
        if (level === void 0) { level = 0; }
        var hasChildren = node.children.length > 0;
        var isRoot = level === 0;
        var nodeColor = hasChildren ? (isRoot ? 'bg-blue-600 text-white' : 'bg-white/80 backdrop-blur-sm') : getNodeColor(node.progress);
        var statusCounts = hasChildren ? countChildrenStatus(node) : null;
        return (react_1.default.createElement("div", { key: node.id, className: "\n          ".concat(level > 0 ? 'ml-8' : '', " \n          relative\n        ") },
            level > 0 && (react_1.default.createElement("div", { className: "absolute -left-6 top-1/2 w-6 h-px bg-blue-300", style: { transform: 'translateY(-50%)' } })),
            react_1.default.createElement("div", { className: "\n            relative p-4 rounded-lg mb-4 cursor-pointer\n            transition-all duration-300 transform hover:scale-102\n            ".concat(nodeColor, "\n            border border-blue-200 shadow-lg\n            ").concat(hasChildren ? 'hover:shadow-xl' : '', "\n          "), onClick: function () { return hasChildren && toggleNode(node.id); } },
                react_1.default.createElement("h3", { className: "text-lg font-bold ".concat(isRoot ? 'text-white' : '') }, node.title),
                react_1.default.createElement("p", { className: "text-sm ".concat(isRoot ? 'text-blue-100' : '') }, node.description),
                hasChildren && statusCounts && (react_1.default.createElement("div", { className: "mt-2 text-sm flex gap-3" },
                    react_1.default.createElement("span", { className: "font-medium" }, "Delmoment:"),
                    statusCounts.green > 0 && (react_1.default.createElement("span", { className: "text-green-600" },
                        "\u2713 ",
                        statusCounts.green)),
                    statusCounts.yellow > 0 && (react_1.default.createElement("span", { className: "text-yellow-600" },
                        "\u26A0 ",
                        statusCounts.yellow)),
                    statusCounts.red > 0 && (react_1.default.createElement("span", { className: "text-red-600" },
                        "\u2717 ",
                        statusCounts.red)),
                    statusCounts.none > 0 && (react_1.default.createElement("span", { className: "text-gray-400" },
                        "? ",
                        statusCounts.none)))),
                !hasChildren && node.progress && (react_1.default.createElement("div", { className: "mt-2 text-sm" },
                    react_1.default.createElement("p", null,
                        "Antal klarade \u00F6vningar: ",
                        Math.floor((node.progress.correct_percentage * node.progress.total_attempts) / 100)),
                    react_1.default.createElement("p", null,
                        "Totalt antal f\u00F6rs\u00F6k: ",
                        node.progress.total_attempts),
                    react_1.default.createElement("p", null,
                        "Genomsnittlig tid: ",
                        Math.round(node.progress.average_time),
                        "s"))),
                hasChildren && (react_1.default.createElement("div", { className: "absolute right-4 top-1/2 transform -translate-y-1/2" },
                    react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 transition-transform duration-300 ".concat(node.isExpanded ? 'rotate-180' : ''), fill: "none", viewBox: "0 0 24 24", stroke: isRoot ? 'white' : 'currentColor' },
                        react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }))))),
            hasChildren && node.isExpanded && (react_1.default.createElement("div", { className: "space-y-4 relative" },
                react_1.default.createElement("div", { className: "absolute left-0 top-0 bottom-0 w-px bg-blue-300" }),
                node.children.map(function (child) { return renderNode(child, level + 1); })))));
    };
    return (react_1.default.createElement("div", { className: "w-full max-w-6xl p-8" },
        react_1.default.createElement("button", { onClick: onBack, className: "fixed top-4 left-4 px-4 py-2 bg-blue-600 text-white \n                 rounded-lg hover:bg-blue-700 transition-colors z-50" }, "Tillbaka"),
        react_1.default.createElement("div", { className: "mt-16 space-y-6" }, renderNode(tree))));
};
exports.DecisionTree = DecisionTree;
