export const PLACEMENT_QUESTIONS = {
    English: [
        // A1 (1-6)
        { question: "Select the correct greeting.", options: ["Good morning", "Good sleep", "Good bed", "Good house"], correct: 0 },
        { question: "I ___ a student.", options: ["is", "am", "are", "be"], correct: 1 },
        { question: "She ___ to school every day.", options: ["go", "goes", "going", "gone"], correct: 1 },
        { question: "What time ___ it?", options: ["is", "are", "am", "be"], correct: 0 },
        { question: "They ___ playing soccer.", options: ["is", "am", "are", "be"], correct: 2 },
        { question: "This is ___ book.", options: ["my", "I", "me", "mine"], correct: 0 },
        // A2 (7-12)
        { question: "Yesterday, I ___ to the park.", options: ["go", "went", "gone", "going"], correct: 1 },
        { question: "Have you ___ been to Paris?", options: ["ever", "never", "always", "yet"], correct: 0 },
        { question: "I would like ___ coffee, please.", options: ["some", "any", "a", "an"], correct: 0 },
        { question: "He is ___ than his brother.", options: ["tall", "taller", "tallest", "more tall"], correct: 1 },
        { question: "If it rains, I ___ stay at home.", options: ["will", "would", "am", "do"], correct: 0 },
        { question: "She enjoys ___ books.", options: ["read", "reading", "to read", "reads"], correct: 1 },
        // B1 (13-16)
        { question: "I haven't seen him ___ last year.", options: ["for", "since", "ago", "during"], correct: 1 },
        { question: "The book ___ was written by J.K. Rowling.", options: ["who", "which", "where", "whose"], correct: 1 },
        { question: "I look forward to ___ you.", options: ["see", "seeing", "saw", "seen"], correct: 1 },
        { question: "If I ___ you, I would study harder.", options: ["was", "were", "am", "be"], correct: 1 },
        // B2 (17-18)
        { question: "By this time next year, I ___ graduated.", options: ["will have", "will be", "have", "had"], correct: 0 },
        { question: "He is accused ___ stealing the money.", options: ["of", "for", "with", "about"], correct: 0 },
        // C1 (19-20)
        { question: "Seldom ___ such a beautiful sunset.", options: ["I have seen", "have I seen", "I saw", "seen I have"], correct: 1 },
        { question: "It's high time we ___ home.", options: ["go", "went", "gone", "going"], correct: 1 }
    ],
    Spanish: [
        // A1
        { question: "¿Cómo se dice 'Hello'?", options: ["Hola", "Adiós", "Gracias", "Por favor"], correct: 0 },
        { question: "Yo ___ estudiante.", options: ["soy", "estoy", "tengo", "hago"], correct: 0 },
        { question: "Ella ___ en Madrid.", options: ["vive", "vives", "vivo", "viven"], correct: 0 },
        { question: "¿___ hora es?", options: ["Qué", "Cuál", "Cómo", "Dónde"], correct: 0 },
        { question: "Nosotros ___ amigos.", options: ["somos", "estamos", "tenemos", "hacemos"], correct: 0 },
        { question: "Me gusta ___ fútbol.", options: ["el", "la", "los", "las"], correct: 0 },
        // A2
        { question: "Ayer ___ al cine.", options: ["fui", "voy", "iré", "iba"], correct: 0 },
        { question: "¿Has ___ paella alguna vez?", options: ["comido", "comiendo", "comes", "comí"], correct: 0 },
        { question: "Quiero ___ agua, por favor.", options: ["un poco de", "mucho", "algunos", "varios"], correct: 0 },
        { question: "Él es más alto ___ tú.", options: ["que", "de", "como", "cual"], correct: 0 },
        { question: "Si llueve, no ___ al parque.", options: ["iré", "fui", "voy", "iba"], correct: 0 },
        { question: "Me duele ___ cabeza.", options: ["la", "el", "los", "las"], correct: 0 },
        // B1
        { question: "Cuando ___ mayor, seré médico.", options: ["sea", "soy", "fui", "seré"], correct: 0 },
        { question: "Busco una persona que ___ hablar inglés.", options: ["sepa", "sabe", "sabía", "sabrá"], correct: 0 },
        { question: "Llevo dos años ___ español.", options: ["estudiando", "estudiar", "estudiado", "estudio"], correct: 0 },
        { question: "Ojalá ___ buen tiempo mañana.", options: ["haga", "hace", "hizo", "hará"], correct: 0 },
        // B2
        { question: "No creo que ___ verdad.", options: ["sea", "es", "fuese", "será"], correct: 0 },
        { question: "A no ser que ___ prisa, podemos ir andando.", options: ["tengas", "tienes", "tuvieras", "tendrás"], correct: 0 },
        // C1
        { question: "Si lo ___ sabido, habría venido antes.", options: ["hubiera", "habría", "hube", "había"], correct: 0 },
        { question: "Es imprescindible que ___ los documentos.", options: ["traigas", "traes", "traerás", "traerías"], correct: 0 }
    ],
    Korean: [
        // A1
        { question: "'Hello' in Korean?", options: ["Annyeonghaseyo", "Gamsahamnida", "Mianhamnida", "Jal gayo"], correct: 0 },
        { question: "Which is a vowel?", options: ["ㅏ", "ㄱ", "ㄴ", "ㄷ"], correct: 0 },
        { question: "I ___ American.", options: ["miguk saram-ieyo", "miguk saram-i", "miguk saram-eul", "miguk saram-e"], correct: 0 },
        { question: "This ___ water.", options: ["mul-ieyo", "mul-juseyo", "mul-iss-eoyo", "mul-eops-eoyo"], correct: 0 },
        { question: "Where ___ the bathroom?", options: ["hwajangsil-i eodi-yeyo?", "hwajangsil-i isseoyo?", "hwajangsil-i eops-eoyo?", "hwajangsil-i mwo-yeyo?"], correct: 0 },
        { question: "Thank you.", options: ["Gamsahamnida", "Sillyehamnida", "Joesonghamnida", "Annyeonghi gyeseyo"], correct: 0 },
        // A2
        { question: "Yesterday I ___ pizza.", options: ["meogeosseoyo", "meogeoyo", "meogeul geoyeyo", "meokgo isseoyo"], correct: 0 },
        { question: "I want to ___ a movie.", options: ["bogo sipeoyo", "bwayo", "basseoyo", "bol geoyeyo"], correct: 0 },
        { question: "It is ___ hot.", options: ["neomu", "an", "mot", "jal"], correct: 0 },
        { question: "Please ___ me some water.", options: ["juseyo", "jueoyo", "jul geoyeyo", "jugo isseoyo"], correct: 0 },
        { question: "I go ___ school.", options: ["hakgyo-e", "hakgyo-eseo", "hakgyo-reul", "hakgyo-ga"], correct: 0 },
        { question: "Do you have time?", options: ["sigan isseoyo?", "sigan eopseoyo?", "sigan mwoyeyo?", "sigan eodiyeyo?"], correct: 0 },
        // B1
        { question: "I have ___ been to Korea.", options: ["gaboneun jeogi isseoyo", "gayo", "gasseoyo", "gal geoyeyo"], correct: 0 },
        { question: "Because it rained, I ___ go.", options: ["mot gasseoyo", "an gasseoyo", "gaji anhayo", "gal su eopseoyo"], correct: 0 },
        { question: "Please try ___ this.", options: ["meogeo boseyo", "meogeuseyo", "meokji maseyo", "meogeul su isseoyo"], correct: 0 },
        { question: "It seems to be ___.", options: ["chuun geot gatayo", "chupda", "chuwosseoyo", "chuul geoyeyo"], correct: 0 },
        // B2
        { question: "I heard that ___.", options: ["ganda-go deureosseoyo", "ganda", "gasseoyo", "gal geoyeyo"], correct: 0 },
        { question: "Even though I studied, ___.", options: ["siheom-eul mangchyeosseoyo", "siheom-eul jal bwasseoyo", "siheom-i swiwosseoyo", "siheom-i eoryeowosseoyo"], correct: 0 },
        // C1
        { question: "As soon as I arrived, ___.", options: ["baro jam-i deureosseoyo", "jam-i deul geoyeyo", "jam-i deulgo sipeoyo", "jam-i deul su isseoyo"], correct: 0 },
        { question: "It is worth ___.", options: ["gal manhada", "ganda", "gasseoyo", "gal geoyeyo"], correct: 0 }
    ],
    Italian: [
        // A1
        { question: "Come si dice 'Hello'?", options: ["Ciao", "Arrivederci", "Grazie", "Prego"], correct: 0 },
        { question: "Io ___ italiano.", options: ["sono", "ho", "sto", "faccio"], correct: 0 },
        { question: "Lui ___ a Roma.", options: ["abita", "abiti", "abito", "abitano"], correct: 0 },
        { question: "Che ora ___?", options: ["è", "sono", "ha", "fa"], correct: 0 },
        { question: "Noi ___ studenti.", options: ["siamo", "stiamo", "abbiamo", "facciamo"], correct: 0 },
        { question: "Mi piace ___ pizza.", options: ["la", "il", "lo", "i"], correct: 0 },
        // A2
        { question: "Ieri ___ al cinema.", options: ["sono andato", "vado", "andrò", "andavo"], correct: 0 },
        { question: "Hai ___ mangiato?", options: ["già", "ancora", "mai", "sempre"], correct: 0 },
        { question: "Vorrei ___ acqua.", options: ["dell'", "del", "della", "dei"], correct: 0 },
        { question: "Lui è più alto ___ te.", options: ["di", "che", "da", "a"], correct: 0 },
        { question: "Se piove, non ___.", options: ["esco", "uscirò", "uscivo", "uscii"], correct: 0 },
        { question: "Mi fa male ___ testa.", options: ["la", "il", "lo", "le"], correct: 0 },
        // B1
        { question: "Penso che lui ___ ragione.", options: ["abbia", "ha", "aveva", "avrà"], correct: 0 },
        { question: "Cerco un libro che ___ interessante.", options: ["sia", "è", "era", "sarà"], correct: 0 },
        { question: "Studio italiano ___ due anni.", options: ["da", "per", "tra", "fra"], correct: 0 },
        { question: "Spero che ___ bel tempo.", options: ["faccia", "fa", "faceva", "farà"], correct: 0 },
        // B2
        { question: "Non credo che ___ vero.", options: ["sia", "è", "fosse", "sarà"], correct: 0 },
        { question: "A meno che non ___ fretta.", options: ["abbia", "hai", "avessi", "avrai"], correct: 0 },
        // C1
        { question: "Se lo ___ saputo, sarei venuto.", options: ["avessi", "avrei", "ebbi", "avevo"], correct: 0 },
        { question: "È necessario che tu ___.", options: ["venga", "vieni", "verrai", "venissi"], correct: 0 }
    ],
    French: [
        // A1
        { question: "Comment dit-on 'Hello'?", options: ["Bonjour", "Au revoir", "Merci", "S'il vous plaît"], correct: 0 },
        { question: "Je ___ étudiant.", options: ["suis", "ai", "vais", "fais"], correct: 0 },
        { question: "Il ___ à Paris.", options: ["habite", "habites", "habitent", "habitons"], correct: 0 },
        { question: "Quelle heure ___?", options: ["est-il", "a-t-il", "fait-il", "va-t-il"], correct: 0 },
        { question: "Nous ___ amis.", options: ["sommes", "avons", "allons", "faisons"], correct: 0 },
        { question: "J'aime ___ fromage.", options: ["le", "la", "les", "l'"], correct: 0 },
        // A2
        { question: "Hier, je ___ au cinéma.", options: ["suis allé", "vais", "irai", "allais"], correct: 0 },
        { question: "As-tu ___ mangé?", options: ["déjà", "encore", "jamais", "toujours"], correct: 0 },
        { question: "Je voudrais ___ eau.", options: ["de l'", "du", "de la", "des"], correct: 0 },
        { question: "Il est plus grand ___ toi.", options: ["que", "de", "comme", "ce"], correct: 0 },
        { question: "S'il pleut, je ne ___ pas.", options: ["sortirai", "sors", "sortais", "suis sorti"], correct: 0 },
        { question: "J'ai mal à ___ tête.", options: ["la", "le", "les", "l'"], correct: 0 },
        // B1
        { question: "Il faut que tu ___.", options: ["viennes", "viens", "viendras", "venais"], correct: 0 },
        { question: "Je cherche quelqu'un qui ___ parler anglais.", options: ["sache", "sait", "savait", "saura"], correct: 0 },
        { question: "J'étudie le français ___ deux ans.", options: ["depuis", "pendant", "pour", "il y a"], correct: 0 },
        { question: "J'espère qu'il ___ beau.", options: ["fera", "fasse", "fait", "faisait"], correct: 0 },
        // B2
        { question: "Je ne pense pas qu'il ___ raison.", options: ["ait", "a", "avait", "aura"], correct: 0 },
        { question: "Bien que je ___ fatigué, je travaille.", options: ["sois", "suis", "étais", "serai"], correct: 0 },
        // C1
        { question: "Si je l'___ su, je serais venu.", options: ["avais", "aurais", "eus", "ai"], correct: 0 },
        { question: "Il est temps que nous ___.", options: ["partions", "partons", "partirons", "partions"], correct: 0 }
    ],
    German: [
        // A1
        { question: "Wie sagt man 'Hello'?", options: ["Hallo", "Tschüss", "Danke", "Bitte"], correct: 0 },
        { question: "Ich ___ Student.", options: ["bin", "habe", "werde", "mache"], correct: 0 },
        { question: "Er ___ in Berlin.", options: ["wohnt", "wohnst", "wohnen", "wohne"], correct: 0 },
        { question: "Wie spät ___ es?", options: ["ist", "hat", "macht", "geht"], correct: 0 },
        { question: "Wir ___ Freunde.", options: ["sind", "haben", "werden", "machen"], correct: 0 },
        { question: "Das ist ___ Buch.", options: ["mein", "meine", "meinen", "meinem"], correct: 0 },
        // A2
        { question: "Gestern ___ ich ins Kino gegangen.", options: ["bin", "habe", "werde", "war"], correct: 0 },
        { question: "Hast du ___ gegessen?", options: ["schon", "noch", "nie", "immer"], correct: 0 },
        { question: "Ich möchte ___ Wasser.", options: ["etwas", "viel", "kein", "alle"], correct: 0 },
        { question: "Er ist größer ___ du.", options: ["als", "wie", "von", "zu"], correct: 0 },
        { question: "Wenn es regnet, ___ ich zu Hause.", options: ["bleibe", "bleibst", "bleiben", "geblieben"], correct: 0 },
        { question: "Ich habe ___ Kopfschmerzen.", options: ["keine", "nicht", "nichts", "nie"], correct: 0 },
        // B1
        { question: "Ich weiß nicht, ob er ___.", options: ["kommt", "komme", "kam", "gekommen ist"], correct: 0 },
        { question: "Das ist der Mann, ___ ich gesehen habe.", options: ["den", "der", "dem", "dessen"], correct: 0 },
        { question: "Ich freue mich ___ den Urlaub.", options: ["auf", "über", "an", "in"], correct: 0 },
        { question: "Wenn ich Zeit hätte, ___ ich kommen.", options: ["würde", "werde", "wurde", "war"], correct: 0 },
        // B2
        { question: "Er tut so, als ob er alles ___.", options: ["wüsste", "weiß", "gewusst hat", "wissen würde"], correct: 0 },
        { question: "Je mehr ich lerne, ___ mehr weiß ich.", options: ["desto", "umso", "je", "als"], correct: 0 },
        // C1
        { question: "Hätte ich das gewusst, ___ ich gekommen.", options: ["wäre", "hätte", "würde", "sei"], correct: 0 },
        { question: "Es ist wichtig, dass du pünktlich ___.", options: ["bist", "seist", "wärst", "gewesen bist"], correct: 0 }
    ]
};
