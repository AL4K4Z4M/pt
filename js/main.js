// --- 1. Global Variables & Constants ---


const API_URL = 'https://platetraits.com/api';


// State variables

let allReviewsData = [];

let aggregatedReviewsData = {};

let currentPlateReviews = [];

let currentReviewIndex = 0;

let userVotes = {}; // Holds the user's vote for each review_id: { [review_id]: 'up' | 'down' }

let lastViewedProfile = null; // To store the username for the "Back to Profile" button functionality


// Authentication state

let authToken = localStorage.getItem('token');

let currentUsername = localStorage.getItem('username');

let isAdmin = localStorage.getItem('isAdmin') === 'true';

let isAuthModalInLoginMode = true;


// --- 2. Data Definitions ---

// Static data for form dropdowns, comment construction, and content validation.


const commentBuilderData = {

    templates: [

        "_____.", "_____ _____.", "_____ _____ _____.", "_____ _____ _____ _____.",

        "Ignorance of _____.", "If only I had a _____.", "If only I had a _____, then _____.",

        "_____ ahead, therefore _____.", "Could this be a _____?", "Behold, _____!",

        "Offer _____.", "Praise the _____.", "Try _____.", "Beware of _____.", "Time for _____.",

        "_____ required ahead.", "No _____ here, move along.", "Watch for _____ ahead.",

        "Do not trust _____.", "Unexpected _____ incoming.", "Approach _____ with caution.",

        "Prepare for _____.", "Caution: _____ zone.", "Look out for _____.", "Expect _____ ahead.",

        "Proceed with _____.", "_____ detected, slow down.", "Immediate _____ recommended.",

        "_____ spotted nearby.", "Engage _____ mode.", "_____ is inevitable.", "May the _____ guide you.",

        "You must gather your _____ before venturing forth.", "Visions of _____...", "_____ awaits.",

        "_____, but _____.", "First _____, then _____.", "Look _____, O, look _____.", "Why is it always _____?"

    ],

    words: {

        people_archetypes: ["college kid", "cyclist", "driver", "fool", "hero", "impatient driver", "legend", "lost driver", "pedestrian", "police", "road rager", "slowpoke", "speeder", "student driver", "tailgater", "texter", "tourist", "villain"],

        vehicles: ["beater", "bus", "car", "convertible", "delivery truck", "farm equipment", "garbage truck", "mail truck", "motorcycle", "RV", "semi", "sports car", "SUV", "tractor", "truck"],

        road_features: ["blind spot", "construction", "crosswalk", "deer crossing", "detour", "dirt road", "exit ramp", "fire hydrant", "four-way stop", "gridlock", "merge lane", "oncoming lane", "one-lane bridge", "parking spot", "passing zone", "pothole", "railroad crossing", "road work", "roundabout", "school zone", "sharp curve", "speed bump", "speed trap", "steep hill", "traffic jam"],

        maneuvers_actions: ["accelerating", "braking", "changing lanes", "coasting", "decelerating", "drifting", "merging", "parallel parking", "parking", "passing", "perfect park", "signaling", "slowing down", "speeding", "speeding up", "three-point turn", "turning", "U-turn", "yielding"],

        driver_errors: ["bad parking", "blocking the lane", "brake checking", "cutting off", "distracted driving", "double parking", "erratic steering", "following too closely", "hesitation", "honking", "ignoring signs", "ignoring speed limit", "late braking", "no lights", "road rage", "rolling stop", "running a red light", "tailgating", "wide turn"],

        concepts_states: ["agony", "caution", "confusion", "despair", "doom", "faith", "focus", "frustration", "grace", "haste", "joy", "patience", "relief", "ruin", "skill", "urgency"],

        qualities_adjectives: ["aggressive", "cautious", "courteous", "erratic", "fast", "flawless", "good", "hesitant", "illegal", "inconsiderate", "lawful", "oblivious", "predictable", "questionable", "reckless", "skillful", "sloppy", "slow", "smooth", "steady", "sudden", "terrible", "unexpected", "unlawful", "unpredictable"],

        directions: ["adjacent", "ahead", "behind", "everywhere", "far", "left", "near", "oncoming", "right"],

        phrases: ["breaking the speed limit", "burning rubber", "close call", "dead end", "failure to yield", "fender bender", "heavy traffic", "last minute turn", "left lane camper", "moment of silence", "right-of-way", "sudden stop", "test of patience", "wrong turn"],

        conjunctions: ["all the more", "and", "and then", "but", "eventually", "except for", "if only", "in short", "in the end", "or", "therefore"],

        items_gestures: ["a head nod", "a shrug", "a wave", "angry stare", "brake lights", "hand gestures", "hazard lights", "headlights", "high beams", "horn", "middle finger", "thumbs-up", "turn signal"],

        modes_stances: ["autopilot", "beast mode", "cruise control", "defensive driving", "offensive driving", "stealth mode", "turtle mode", "zen mode"],

        guidance: ["common sense", "GPS", "intuition", "local knowledge", "muscle memory", "road signs", "streetlights", "the dotted line", "the North Star"]

    }

};


const vehicleMakes = [
    "Acura",
    "Alfa Romeo",
    "Aprilia",
    "Audi",
    "BMW",
    "Buell",
    "Buick",
    "Cadillac",
    "Can-Am",
    "Chevrolet",
    "Chrysler",
    "Dodge",
    "Ducati",
    "Fiat",
    "Ford",
    "Freightliner",
    "Genesis",
    "GMC",
    "Harley-Davidson",
    "Hino",
    "Honda",
    "Hummer",
    "Husqvarna",
    "Hyundai",
    "Indian",
    "Infiniti",
    "International",
    "Isuzu",
    "Jaguar",
    "Jeep",
    "Kawasaki",
    "Kenworth",
    "Kia",
    "KTM",
    "Land Rover",
    "Lexus",
    "Lincoln",
    "Lucid",
    "Mack",
    "Maserati",
    "Mazda",
    "Mercedes-Benz",
    "Mercury",
    "Mini",
    "Mitsubishi",
    "Mitsubishi Fuso",
    "Moto Guzzi",
    "MV Agusta",
    "Nissan",
    "Norton",
    "Peterbilt",
    "Piaggio",
    "Polestar",
    "Pontiac",
    "Porsche",
    "Ram",
    "Rivian",
    "Royal Enfield",
    "Saab",
    "Saturn",
    "Scion",
    "Subaru",
    "Suzuki",
    "Tesla",
    "Toyota",
    "Triumph",
    "Vespa",
    "Volkswagen",
    "Volvo",
    "Yamaha",
    "Zero Motorcycles",
    "Other"
];

const vehicleModels = {
    "Acura": ["CL", "ILX", "Integra", "Legend", "MDX", "NSX", "RDX", "RL", "RLX", "SLX", "TLX", "Vigor", "ZDX"],
    "Alfa Romeo": ["4C", "8C", "GTV-6", "Giulia", "Milano", "Spider", "Stelvio", "Tonale"],
    "Aprilia": ["RS 250", "RS 660", "RSV4", "Tuareg 660", "Tuono"],
    "Audi": ["100", "200", "4000", "5000", "80", "90", "A3", "A4", "A5", "A6", "A7", "A8", "Cabriolet", "Coupe Quattro", "e-tron", "e-tron GT", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "R8", "RS 3", "RS 5", "RS 6", "RS 7", "RS Q8", "S3", "S4", "S5", "S6", "S8", "SQ5", "SQ7", "SQ8", "TT", "TT RS"],
    "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series", "i3", "i4", "i7", "i8", "iX", "M2", "M3", "M4", "M5", "M6", "M8", "R 1250 GS", "S 1000 RR", "X1", "X2", "X3", "X3 M", "X4", "X4 M", "X5", "X5 M", "X6", "X6 M", "X7", "Z3", "Z4", "Z8"],
    "Buell": ["Blast", "Cyclone", "Firebolt", "Lightning", "Thunderbolt", "Ulysses"],
    "Buick": ["Allure", "Apollo", "Cascada", "Century", "Electra", "Enclave", "Encore", "Encore GX", "Envision", "Estate", "GS", "Invicta", "LaCrosse", "LeSabre", "Lucerne", "Park Avenue", "Rainier", "Reatta", "Regal", "Rendezvous", "Riviera", "Roadmaster", "Skyhawk", "Skylark", "Somerset", "Special", "Terraza", "Verano", "Wildcat"],
    "Cadillac": ["Allante", "ATS", "Brougham", "Celestiq", "Cimarron", "CT4", "CT5", "CT6", "CTS", "DeVille", "DTS", "Eldorado", "ELR", "Escalade", "Fleetwood", "Lyriq", "Seville", "SRX", "STS", "XLR", "XT4", "XT5", "XT6", "XTS"],
    "Can-Am": ["Defender", "Maverick", "Ryker", "Spyder"],
    "Chevrolet": ["Astro", "Avalanche", "Aveo", "Bel Air", "Beretta", "Biscayne", "Blazer", "Blazer EV", "Bolt EUV", "Bolt EV", "C/K Pickup", "Camaro", "Caprice", "Caprice Classic", "Captiva Sport", "Cavalier", "Celebrity", "Chevelle", "Chevette", "Chevy II / Nova", "Citation", "City Express", "Classic", "Cobalt", "Colorado", "Corsica", "Corvair", "Corvette", "Cruze", "El Camino", "Equinox", "Equinox EV", "Express", "HHR", "Impala", "Low Cab Forward", "Lumina", "LUV", "Malibu", "Metro", "Monte Carlo", "Monza", "Prizm", "S-10", "Silverado 1500", "Silverado 2500HD", "Silverado 3500HD", "Silverado 4500HD", "Silverado 5500HD", "Silverado 6500HD", "Silverado EV", "Sonic", "Spark", "Spectrum", "Sprint", "SSR", "Suburban", "Tahoe", "Tracker", "TrailBlazer", "Traverse", "Trax", "Uplander", "Vega", "Venture", "Volt"],
    "Chrysler": ["200", "300", "300M", "Aspen", "Cirrus", "Concorde", "Cordoba", "Crossfire", "Dynasty", "E-Class", "Executive", "Fifth Avenue", "Grand Voyager", "Imperial", "Laser", "LeBaron", "LHS", "New Yorker", "Newport", "Pacifica", "Prowler", "PT Cruiser", "Sebring", "TC by Maserati", "Town & Country", "Voyager"],
    "Dodge": ["400", "600", "Aries", "Aspen", "Attitude", "Avenger", "Caliber", "Caravan", "Challenger", "Challenger SRT Demon / 170", "Challenger SRT Hellcat", "Charger", "Charger Daytona", "Charger SRT Hellcat", "Colt", "Conquest", "Coronet", "Dakota", "Dart", "Daytona", "Diplomat", "Durango", "Durango SRT / Hellcat", "Dynasty", "Grand Caravan", "Hornet", "Intrepid", "Journey", "Lancer", "Magnum", "Mirada", "Monaco", "Neon / SRT-4", "Nitro", "Omni", "Raider", "Ram Van / B-series", "Rampage", "Shadow", "Spirit", "St. Regis", "Stealth", "Stratus", "Viper"],
    "Ducati": ["Diavel", "Hypermotard", "Monster", "Multistrada", "Panigale", "Scrambler", "Streetfighter", "SuperSport"],
    "Fiat": ["124 Spider", "500", "500L", "500X", "Brava", "Strada", "X1/9"],
    "Ford": ["Aerostar", "Aspire", "Bronco", "Bronco Sport", "C-Max", "Contour", "Crown Victoria", "E-Series", "E-Transit", "EcoSport", "Edge", "Escape", "Escort", "Escort ZX2", "Excursion", "Expedition", "Explorer", "EXP", "F-150", "F-150 Lightning", "F-250 Super Duty", "F-350 Super Duty", "F-450 Super Duty", "F-550 Super Duty", "F-650", "F-750", "Fairmont", "Festiva", "Fiesta", "Five Hundred", "Flex", "Focus", "Freestar", "Freestyle", "Fusion", "GT", "Granada", "LTD", "Maverick", "Mustang", "Mustang Mach-E", "Pinto", "Probe", "Ranger", "Taurus", "Taurus X", "Tempo", "Thunderbird", "Transit", "Transit Connect", "Windstar"],
    "Freightliner": ["108SD", "114SD", "122SD", "Cascadia", "Columbia", "Coronado", "EconicSD", "M2 106", "M2 112"],
    "Genesis": ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
    "GMC": ["Acadia", "C/K Pickup", "Caballero", "Canyon", "Envoy", "Envoy XUV", "Hummer EV", "Jimmy", "Rally", "Safari", "Savana", "Sierra 1500", "Sierra 2500HD", "Sierra 3500HD", "Sierra 4500HD", "Sierra 5500HD", "Sierra 6500HD", "Sonoma", "Syclone", "Terrain", "TopKick", "Typhoon", "Vandura", "Yukon", "Yukon XL"],
    "Harley-Davidson": ["CVO", "Dyna", "LiveWire", "Pan America", "Road Glide", "Softail", "Sportster", "Street Glide", "Trike", "V-Rod"],
    "Hino": ["155", "195", "238", "258", "268", "338", "L Series", "M Series", "XL Series"],
    "Honda": ["600", "Accord", "Accord Crosstour", "Accord Hybrid", "Africa Twin", "CBR Series", "Civic", "Civic Si", "Civic Type R", "Clarity", "CR-V", "CR-V Hybrid", "CR-Z", "CRF Series", "CRX", "Crosstour", "Del Sol", "Element", "EV Plus", "Fit", "Gold Wing", "Grom", "HR-V", "Insight", "Odyssey", "Passport", "Pilot", "Prelude", "Prologue", "Ridgeline", "S2000", "Shadow"],
    "Hummer": ["H1", "H2", "H3"],
    "Husqvarna": ["FC 450", "Norden 901", "Svartpilen", "Vitpilen"],
    "Hyundai": ["Accent", "Azera", "Elantra", "Entourage", "Equus", "Excel", "Genesis", "Genesis Coupe", "Ioniq 5", "Ioniq 6", "Kona", "Nexo", "Palisade", "Pony", "Santa Cruz", "Santa Fe", "Scoupe", "Sonata", "Stellar", "Tiburon", "Tucson", "Veloster", "Venue", "Veracruz", "XG300", "XG350"],
    "Indian": ["Challenger", "Chieftain", "Chief", "FTR", "Pursuit", "Roadmaster", "Scout", "Springfield"],
    "Infiniti": ["EX", "FX", "G20", "G35", "G37", "I30", "I35", "J30", "JX", "M", "M30", "Q40", "Q50", "Q60", "Q70", "QX", "QX30", "QX4", "QX50", "QX55", "QX60", "QX70", "QX80"],
    "International": ["CV Series", "DuraStar", "HV Series", "HX Series", "LoneStar", "LT Series", "MV Series", "ProStar", "RH Series", "WorkStar"],
    "Isuzu": ["Amigo", "Ascender", "Axiom", "D-Max", "F-Series", "Hombre", "i-Series", "i-Mark", "Impulse", "N-Series", "Oasis", "Pickup", "Rodeo", "Stylus", "Trooper", "VehiCROSS"],
    "Jaguar": ["E-PACE", "F-PACE", "F-TYPE", "I-PACE", "S-Type", "X-Type", "XE", "XF", "XJ", "XJ-S", "XJ6", "XJ8", "XJR", "XK", "XK8", "XKR"],
    "Jeep": ["Cherokee", "CJ", "Comanche", "Commander", "Compass", "Gladiator", "Grand Cherokee", "Grand Commander", "Grand Wagoneer", "Jeepster", "Liberty", "Patriot", "Renegade", "Wagoneer", "Wrangler", "Wrangler 4xe"],
    "Kawasaki": ["Concours", "Eliminator", "EX500", "GPZ", "KLR650", "Ninja", "Versys", "Voyager", "Vulcan", "Z Series", "ZX Series"],
    "Kenworth": ["C500", "K270", "K370", "T280", "T380", "T480", "T680", "T800", "T880", "W900", "W990"],
    "Kia": ["Amanti", "Borrego", "Cadenza", "Carnival", "EV6", "EV9", "Forte", "K5", "K900", "Magentis", "Niro", "Optima", "Rio", "Rondo", "Sedona", "Seltos", "Sephia", "Sorento", "Soul", "Spectra", "Spectra5", "Sportage", "Stinger", "Telluride"],
    "KTM": ["Adventure Series", "Duke Series", "EXC-F Series", "RC Series"],
    "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Freelander", "LR2", "LR3", "LR4", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"],
    "Lexus": ["CT", "ES", "GS", "GX", "HS", "IS", "LC", "LFA", "LS", "LX", "NX", "RC", "RX", "RZ", "SC", "TX"],
    "Lincoln": ["Aviator", "Blackwood", "Continental", "Corsair", "LS", "Mark LT", "Mark VII", "Mark VIII", "MKS", "MKT", "MKX", "MKZ", "Nautilus", "Navigator", "Town Car", "Versailles", "Zephyr"],
    "Lucid": ["Air"],
    "Mack": ["Anthem", "Granite", "LR", "MD Series", "Pinnacle", "TerraPro"],
    "Maserati": ["Biturbo", "Coupe", "Ghibli", "GranSport", "GranTurismo", "Grecale", "Levante", "MC20", "Quattroporte", "Spyder"],
    "Mazda": ["323", "626", "929", "B-Series", "CX-3", "CX-30", "CX-5", "CX-50", "CX-7", "CX-9", "CX-90", "GLC", "Mazda3", "Mazda5", "Mazda6", "Millenia", "MPV", "MX-3", "MX-5 Miata", "MX-6", "Navajo", "Protege", "Protege5", "RX-7", "RX-8", "Tribute"],
    "Mercedes-Benz": ["190-Class", "300-Class", "400-Class", "500-Class", "600-Class", "A-Class", "AMG GT", "B-Class", "C-Class", "CL-Class", "CLA", "CLK-Class", "CLS", "E-Class", "eSprinter", "EQB", "EQE", "EQS", "G-Class", "GL-Class", "GLA", "GLB", "GLC", "GLE", "GLK-Class", "GLS", "M-Class", "Metris", "R-Class", "S-Class", "SL-Class", "SLK-Class", "SLR McLaren", "SLS AMG", "Sprinter"],
    "Mercury": ["Bobcat", "Capri", "Comet", "Cougar", "Grand Marquis", "Lynx", "Marauder", "Mariner", "Marquis", "Milan", "Monarch", "Montego", "Mountaineer", "Mystique", "Sable", "Topaz", "Tracer", "Villager", "Zephyr"],
    "Mini": ["Clubman", "Convertible", "Countryman", "Hardtop"],
    "Mitsubishi": ["3000GT", "Cordia", "Diamante", "Eclipse", "Eclipse Cross", "Endeavor", "Expo", "Galant", "i-MiEV", "Lancer", "Mirage", "Mirage G4", "Montero", "Montero Sport", "Outlander", "Outlander PHEV", "Outlander Sport", "Precis", "Raider", "Sigma", "Starion", "Tredia"],
    "Mitsubishi Fuso": ["Canter", "eCanter", "FA/FI Series", "FE/FG Series"],
    "Moto Guzzi": ["V100 Mandello", "V7", "V85 TT", "V9"],
    "MV Agusta": ["Brutale", "Dragster", "F3", "Turismo Veloce"],
    "Nissan": ["200SX", "240SX", "280ZX", "300ZX", "350Z", "370Z", "Altima", "Ariya", "Armada", "Axxess", "Cube", "Frontier", "GT-R", "Juke", "Kicks", "Leaf", "Maxima", "Murano", "NV", "NV200", "NX", "Pathfinder", "Pulsar", "Quest", "Rogue", "Sentra", "Sentra SE-R", "Stanza", "Titan", "Titan XD", "Van", "Versa", "Xterra", "Z"],
    "Norton": ["Commando 961", "V4SV"],
    "Peterbilt": ["220", "325", "330", "337", "348", "365", "367", "389", "520", "536", "537", "548", "567", "579", "589"],
    "Piaggio": ["Beverly", "Liberty", "MP3"],
    "Polestar": ["Polestar 1", "Polestar 2", "Polestar 3"],
    "Pontiac": ["1000", "6000", "Astre", "Aztek", "Bonneville", "Catalina", "Fiero", "Firebird", "G3", "G5", "G6", "G8", "Grand Am", "Grand Prix", "GTO", "J2000 Sunbird", "LeMans", "Montana", "Parisienne", "Phoenix", "Safari", "Solstice", "Sunbird", "Sunfire", "T1000", "Tempest", "Torrent", "Trans Sport", "Vibe"],
    "Porsche": ["718 Boxster", "718 Cayman", "911", "912", "914", "918 Spyder", "924", "928", "944", "968", "Carrera GT", "Cayenne", "Macan", "Panamera", "Taycan"],
    "Ram": ["1500", "2500", "3500", "4500", "5500", "Chassis Cab", "ProMaster", "ProMaster City"],
    "Rivian": ["R1S", "R1T"],
    "Royal Enfield": ["Classic 350", "Continental GT", "Himalayan", "Interceptor 650"],
    "Saab": ["9-2X", "9-3", "9-4X", "9-5", "9-7X", "99", "900", "9000"],
    "Saturn": ["Astra", "Aura", "Ion", "L-Series", "Outlook", "Relay", "S-Series", "Sky", "Vue"],
    "Scion": ["FR-S", "iA", "iM", "iQ", "tC", "xA", "xB", "xD"],
    "Subaru": ["Ascent", "B9 Tribeca", "Baja", "BRZ", "Crosstrek", "DL", "Forester", "GL", "GL-10", "Impreza", "Justy", "Legacy", "Loyale", "Outback", "RX", "Solterra", "Standard", "SVX", "Tribeca", "WRX", "XT", "XT6"],
    "Suzuki": ["Aerio", "DR-Z400S", "Equator", "Esteem", "Forenza", "Forsa", "Grand Vitara", "GSX-R Series", "Hayabusa", "Katana", "Kizashi", "Reno", "Samurai", "Sidekick", "SJ410", "SJ413", "SV650", "Swift", "SX4", "V-Strom", "Verona", "Vitara", "X-90", "XL7"],
    "Tesla": ["Cybertruck", "Model 3", "Model S", "Model X", "Model Y", "Roadster", "Semi"],
    "Toyota": ["4Runner", "86", "Avalon", "bZ4X", "C-HR", "Camry", "Celica", "Corona", "Corolla", "Corolla Cross", "Corolla Hatchback", "Corolla iM", "Cressida", "Crown", "Echo", "FJ Cruiser", "GR Corolla", "GR Supra", "GR86", "Grand Highlander", "Highlander", "Land Cruiser", "Matrix", "Mirai", "MR2 / MR2 Spyder", "Paseo", "Previa", "Prius", "Prius Prime", "RAV4", "RAV4 Prime", "Sequoia", "Sienna", "Solara", "Starlet", "Supra", "T100", "Tacoma", "Tercel", "Tundra", "Van", "Venza", "Yaris"],
    "Triumph": ["Bonneville", "Daytona", "Rocket 3", "Scrambler", "Speed Four", "Speed Triple", "Sprint", "Street Triple", "Tiger", "Trident", "TT600"],
    "Vespa": ["GTS", "Primavera", "Sprint"],
    "Volkswagen": ["Arteon", "Atlas", "Atlas Cross Sport", "Beetle", "Cabrio", "CC", "Corrado", "Dasher", "Eos", "EuroVan", "Fox", "Golf", "Golf R", "GTI", "ID.4", "Jetta", "Jetta GLI", "New Beetle", "Passat", "Phaeton", "Quantum", "Rabbit", "Routan", "Scirocco", "Taos", "Thing", "Tiguan", "Touareg", "Vanagon"],
    "Volvo": ["240", "260", "740", "760", "780", "850", "940", "960", "C30", "C40 Recharge", "C70", "S40", "S60", "S70", "S80", "S90", "V40", "V50", "V60", "V70", "V90", "VHD", "VNL", "VNR", "XC40", "XC60", "XC70", "XC90"],
    "Yamaha": ["Bolt", "FZ Series", "FZR Series", "MT Series", "Radian", "Razz", "Riva", "Seca", "Super Ténéré", "Tracer 9", "TW200", "Virago", "VMAX", "V Star", "XSR Series", "YZF-R Series", "Zuma"],
    "Zero Motorcycles": ["DSR/X", "FXE", "SR/F", "SR/S"],
    "Other": ["Other"]
};

const vehicleType = {"Sedan": "Car",
    "Coupe": "Car",
    "Hatchback": "Car",
    "Convertible": "Car",
    "Wagon": "Car",
    "Sports Car": "Car",
    "Electric Car": "Car",
    "SUV": "SUV",
    "Electric SUV": "SUV",
    "Minivan": "Van",
    "Cargo Van": "Van",
    "Electric Van": "Van",
    "Pickup Truck": "Truck",
    "Electric Truck": "Truck",
    "Commercial Truck": "Truck",
    "Sport Bike": "Motorcycle",
    "Cruiser": "Motorcycle",
    "Touring Bike": "Motorcycle",
    "Adventure Bike": "Motorcycle",
    "Dual-Sport": "Motorcycle",
    "Standard Motorcycle": "Motorcycle",
    "Three-Wheeled Motorcycle": "Motorcycle",
    "Scooter": "Motorcycle",
    "Motocross/Off-road": "Motorcycle",
    "Electric Motorcycle": "Motorcycle",
    "UTV/Side-by-Side": "Other",
    "Other": "Other"};

const vehicleSubtype = {
    "Acura": {
        "CL": "Coupe",
        "ILX": "Sedan",
        "Integra": "Sedan",
        "Legend": "Sedan",
        "MDX": "SUV",
        "NSX": "Sports Car",
        "RDX": "SUV",
        "RL": "Sedan",
        "RLX": "Sedan",
        "SLX": "SUV",
        "TLX": "Sedan",
        "Vigor": "Sedan",
        "ZDX": "SUV"
    },
    "Alfa Romeo": {
        "4C": "Sports Car",
        "8C": "Sports Car",
        "GTV-6": "Coupe",
        "Giulia": "Sedan",
        "Milano": "Sedan",
        "Spider": "Convertible",
        "Stelvio": "SUV",
        "Tonale": "SUV"
    },
    "Aprilia": {
        "RS 250": "Sport Bike",
        "RS 660": "Sport Bike",
        "RSV4": "Sport Bike",
        "Tuareg 660": "Adventure Bike",
        "Tuono": "Standard Motorcycle"
    },
    "Audi": {
        "100": "Sedan",
        "200": "Sedan",
        "4000": "Sedan",
        "5000": "Sedan",
        "80": "Sedan",
        "90": "Sedan",
        "A3": "Sedan",
        "A4": "Sedan",
        "A5": "Coupe",
        "A6": "Sedan",
        "A7": "Sedan",
        "A8": "Sedan",
        "Cabriolet": "Convertible",
        "Coupe Quattro": "Coupe",
        "e-tron": "Electric SUV",
        "e-tron GT": "Electric Car",
        "Q3": "SUV",
        "Q4 e-tron": "Electric SUV",
        "Q5": "SUV",
        "Q7": "SUV",
        "Q8": "SUV",
        "R8": "Sports Car",
        "RS 3": "Sedan",
        "RS 5": "Coupe",
        "RS 6": "Wagon",
        "RS 7": "Sedan",
        "RS Q8": "SUV",
        "S3": "Sedan",
        "S4": "Sedan",
        "S5": "Coupe",
        "S6": "Sedan",
        "S8": "Sedan",
        "SQ5": "SUV",
        "SQ7": "SUV",
        "SQ8": "SUV",
        "TT": "Coupe",
        "TT RS": "Coupe"
    },
    "BMW": {
        "1 Series": "Coupe",
        "2 Series": "Coupe",
        "3 Series": "Sedan",
        "4 Series": "Coupe",
        "5 Series": "Sedan",
        "6 Series": "Coupe",
        "7 Series": "Sedan",
        "8 Series": "Coupe",
        "i3": "Electric Car",
        "i4": "Electric Car",
        "i7": "Electric Car",
        "i8": "Electric Car",
        "iX": "Electric SUV",
        "M2": "Coupe",
        "M3": "Sedan",
        "M4": "Coupe",
        "M5": "Sedan",
        "M6": "Coupe",
        "M8": "Coupe",
        "R 1250 GS": "Adventure Bike",
        "S 1000 RR": "Sport Bike",
        "X1": "SUV",
        "X2": "SUV",
        "X3": "SUV",
        "X3 M": "SUV",
        "X4": "SUV",
        "X4 M": "SUV",
        "X5": "SUV",
        "X5 M": "SUV",
        "X6": "SUV",
        "X6 M": "SUV",
        "X7": "SUV",
        "Z3": "Convertible",
        "Z4": "Convertible",
        "Z8": "Convertible"
    },
    "Buell": {
        "Blast": "Standard Motorcycle",
        "Cyclone": "Standard Motorcycle",
        "Firebolt": "Sport Bike",
        "Lightning": "Standard Motorcycle",
        "Thunderbolt": "Sport Bike",
        "Ulysses": "Adventure Bike"
    },
    "Buick": {
        "Allure": "Sedan",
        "Apollo": "Sedan",
        "Cascada": "Convertible",
        "Century": "Sedan",
        "Electra": "Sedan",
        "Enclave": "SUV",
        "Encore": "SUV",
        "Encore GX": "SUV",
        "Envision": "SUV",
        "Estate": "Wagon",
        "GS": "Coupe",
        "Invicta": "Sedan",
        "LaCrosse": "Sedan",
        "LeSabre": "Sedan",
        "Lucerne": "Sedan",
        "Park Avenue": "Sedan",
        "Rainier": "SUV",
        "Reatta": "Coupe",
        "Regal": "Sedan",
        "Rendezvous": "SUV",
        "Riviera": "Coupe",
        "Roadmaster": "Wagon",
        "Skyhawk": "Coupe",
        "Skylark": "Sedan",
        "Somerset": "Coupe",
        "Special": "Sedan",
        "Terraza": "Minivan",
        "Verano": "Sedan",
        "Wildcat": "Coupe"
    },
    "Cadillac": {
        "Allante": "Convertible",
        "ATS": "Sedan",
        "Brougham": "Sedan",
        "Celestiq": "Electric Car",
        "Cimarron": "Sedan",
        "CT4": "Sedan",
        "CT5": "Sedan",
        "CT6": "Sedan",
        "CTS": "Sedan",
        "DeVille": "Sedan",
        "DTS": "Sedan",
        "Eldorado": "Coupe",
        "ELR": "Coupe",
        "Escalade": "SUV",
        "Fleetwood": "Sedan",
        "Lyriq": "Electric SUV",
        "Seville": "Sedan",
        "SRX": "SUV",
        "STS": "Sedan",
        "XLR": "Convertible",
        "XT4": "SUV",
        "XT5": "SUV",
        "XT6": "SUV",
        "XTS": "Sedan"
    },
    "Can-Am": {
        "Defender": "UTV/Side-by-Side",
        "Maverick": "UTV/Side-by-Side",
        "Ryker": "Three-Wheeled Motorcycle",
        "Spyder": "Three-Wheeled Motorcycle"
    },
    "Chevrolet": {
        "Astro": "Cargo Van",
        "Avalanche": "Pickup Truck",
        "Aveo": "Sedan",
        "Bel Air": "Sedan",
        "Beretta": "Coupe",
        "Biscayne": "Sedan",
        "Blazer": "SUV",
        "Blazer EV": "Electric SUV",
        "Bolt EUV": "Electric SUV",
        "Bolt EV": "Electric Car",
        "C/K Pickup": "Pickup Truck",
        "Camaro": "Sports Car",
        "Caprice": "Sedan",
        "Caprice Classic": "Sedan",
        "Captiva Sport": "SUV",
        "Cavalier": "Sedan",
        "Celebrity": "Sedan",
        "Chevelle": "Coupe",
        "Chevette": "Hatchback",
        "Chevy II / Nova": "Coupe",
        "Citation": "Hatchback",
        "City Express": "Cargo Van",
        "Classic": "Sedan",
        "Cobalt": "Sedan",
        "Colorado": "Pickup Truck",
        "Corsica": "Sedan",
        "Corvair": "Coupe",
        "Corvette": "Sports Car",
        "Cruze": "Sedan",
        "El Camino": "Pickup Truck",
        "Equinox": "SUV",
        "Equinox EV": "Electric SUV",
        "Express": "Cargo Van",
        "HHR": "Wagon",
        "Impala": "Sedan",
        "Low Cab Forward": "Commercial Truck",
        "Lumina": "Sedan",
        "LUV": "Pickup Truck",
        "Malibu": "Sedan",
        "Metro": "Hatchback",
        "Monte Carlo": "Coupe",
        "Monza": "Coupe",
        "Prizm": "Sedan",
        "S-10": "Pickup Truck",
        "Silverado 1500": "Pickup Truck",
        "Silverado 2500HD": "Pickup Truck",
        "Silverado 3500HD": "Pickup Truck",
        "Silverado 4500HD": "Commercial Truck",
        "Silverado 5500HD": "Commercial Truck",
        "Silverado 6500HD": "Commercial Truck",
        "Silverado EV": "Electric Truck",
        "Sonic": "Sedan",
        "Spark": "Hatchback",
        "Spectrum": "Hatchback",
        "Sprint": "Hatchback",
        "SSR": "Pickup Truck",
        "Suburban": "SUV",
        "Tahoe": "SUV",
        "Tracker": "SUV",
        "TrailBlazer": "SUV",
        "Traverse": "SUV",
        "Trax": "SUV",
        "Uplander": "Minivan",
        "Vega": "Hatchback",
        "Venture": "Minivan",
        "Volt": "Hatchback"
    },
    "Chrysler": {
        "200": "Sedan",
        "300": "Sedan",
        "300M": "Sedan",
        "Aspen": "SUV",
        "Cirrus": "Sedan",
        "Concorde": "Sedan",
        "Cordoba": "Coupe",
        "Crossfire": "Coupe",
        "Dynasty": "Sedan",
        "E-Class": "Sedan",
        "Executive": "Sedan",
        "Fifth Avenue": "Sedan",
        "Grand Voyager": "Minivan",
        "Imperial": "Sedan",
        "Laser": "Coupe",
        "LeBaron": "Sedan",
        "LHS": "Sedan",
        "New Yorker": "Sedan",
        "Newport": "Sedan",
        "Pacifica": "Minivan",
        "Prowler": "Convertible",
        "PT Cruiser": "Wagon",
        "Sebring": "Sedan",
        "TC by Maserati": "Convertible",
        "Town & Country": "Minivan",
        "Voyager": "Minivan"
    },
    "Dodge": {
        "400": "Coupe",
        "600": "Sedan",
        "Aries": "Sedan",
        "Aspen": "Sedan",
        "Attitude": "Sedan",
        "Avenger": "Sedan",
        "Caliber": "Hatchback",
        "Caravan": "Minivan",
        "Challenger": "Sports Car",
        "Challenger SRT Demon / 170": "Sports Car",
        "Challenger SRT Hellcat": "Sports Car",
        "Charger": "Sports Car",
        "Charger Daytona": "Sports Car",
        "Charger SRT Hellcat": "Sports Car",
        "Colt": "Hatchback",
        "Conquest": "Sports Car",
        "Coronet": "Sedan",
        "Dakota": "Pickup Truck",
        "Dart": "Sedan",
        "Daytona": "Coupe",
        "Diplomat": "Sedan",
        "Durango": "SUV",
        "Durango SRT / Hellcat": "SUV",
        "Dynasty": "Sedan",
        "Grand Caravan": "Minivan",
        "Hornet": "SUV",
        "Intrepid": "Sedan",
        "Journey": "SUV",
        "Lancer": "Sedan",
        "Magnum": "Wagon",
        "Mirada": "Coupe",
        "Monaco": "Sedan",
        "Neon / SRT-4": "Sedan",
        "Nitro": "SUV",
        "Omni": "Hatchback",
        "Raider": "SUV",
        "Ram Van / B-series": "Cargo Van",
        "Rampage": "Pickup Truck",
        "Shadow": "Hatchback",
        "Spirit": "Sedan",
        "St. Regis": "Sedan",
        "Stealth": "Sports Car",
        "Stratus": "Sedan",
        "Viper": "Sports Car"
    },
    "Ducati": {
        "Diavel": "Cruiser",
        "Hypermotard": "Standard Motorcycle",
        "Monster": "Standard Motorcycle",
        "Multistrada": "Adventure Bike",
        "Panigale": "Sport Bike",
        "Scrambler": "Standard Motorcycle",
        "Streetfighter": "Standard Motorcycle",
        "SuperSport": "Sport Bike"
    },
    "Fiat": {
        "124 Spider": "Convertible",
        "500": "Hatchback",
        "500L": "Wagon",
        "500X": "SUV",
        "Brava": "Hatchback",
        "Strada": "Pickup Truck",
        "X1/9": "Sports Car"
    },
    "Ford": {
        "Aerostar": "Minivan",
        "Aspire": "Hatchback",
        "Bronco": "SUV",
        "Bronco Sport": "SUV",
        "C-Max": "Wagon",
        "Contour": "Sedan",
        "Crown Victoria": "Sedan",
        "E-Series": "Cargo Van",
        "E-Transit": "Electric Van",
        "EcoSport": "SUV",
        "Edge": "SUV",
        "Escape": "SUV",
        "Escort": "Sedan",
        "Escort ZX2": "Coupe",
        "Excursion": "SUV",
        "Expedition": "SUV",
        "Explorer": "SUV",
        "EXP": "Coupe",
        "F-150": "Pickup Truck",
        "F-150 Lightning": "Electric Truck",
        "F-250 Super Duty": "Pickup Truck",
        "F-350 Super Duty": "Pickup Truck",
        "F-450 Super Duty": "Commercial Truck",
        "F-550 Super Duty": "Commercial Truck",
        "F-650": "Commercial Truck",
        "F-750": "Commercial Truck",
        "Fairmont": "Sedan",
        "Festiva": "Hatchback",
        "Fiesta": "Hatchback",
        "Five Hundred": "Sedan",
        "Flex": "SUV",
        "Focus": "Sedan",
        "Freestar": "Minivan",
        "Freestyle": "SUV",
        "Fusion": "Sedan",
        "GT": "Sports Car",
        "Granada": "Sedan",
        "LTD": "Sedan",
        "Maverick": "Pickup Truck",
        "Mustang": "Sports Car",
        "Mustang Mach-E": "Electric SUV",
        "Pinto": "Hatchback",
        "Probe": "Coupe",
        "Ranger": "Pickup Truck",
        "Taurus": "Sedan",
        "Taurus X": "SUV",
        "Tempo": "Sedan",
        "Thunderbird": "Coupe",
        "Transit": "Cargo Van",
        "Transit Connect": "Cargo Van",
        "Windstar": "Minivan"
    },
    "Freightliner": {
        "108SD": "Commercial Truck",
        "114SD": "Commercial Truck",
        "122SD": "Commercial Truck",
        "Cascadia": "Commercial Truck",
        "Columbia": "Commercial Truck",
        "Coronado": "Commercial Truck",
        "EconicSD": "Commercial Truck",
        "M2 106": "Commercial Truck",
        "M2 112": "Commercial Truck"
    },
    "Genesis": {
        "G70": "Sedan",
        "G80": "Sedan",
        "G90": "Sedan",
        "GV60": "Electric SUV",
        "GV70": "SUV",
        "GV80": "SUV"
    },
    "GMC": {
        "Acadia": "SUV",
        "C/K Pickup": "Pickup Truck",
        "Caballero": "Pickup Truck",
        "Canyon": "Pickup Truck",
        "Envoy": "SUV",
        "Envoy XUV": "SUV",
        "Hummer EV": "Electric Truck",
        "Jimmy": "SUV",
        "Rally": "Cargo Van",
        "Safari": "Cargo Van",
        "Savana": "Cargo Van",
        "Sierra 1500": "Pickup Truck",
        "Sierra 2500HD": "Pickup Truck",
        "Sierra 3500HD": "Pickup Truck",
        "Sierra 4500HD": "Commercial Truck",
        "Sierra 5500HD": "Commercial Truck",
        "Sierra 6500HD": "Commercial Truck",
        "Sonoma": "Pickup Truck",
        "Syclone": "Pickup Truck",
        "Terrain": "SUV",
        "TopKick": "Commercial Truck",
        "Typhoon": "SUV",
        "Vandura": "Cargo Van",
        "Yukon": "SUV",
        "Yukon XL": "SUV"
    },
    "Harley-Davidson": {
        "CVO": "Touring Bike",
        "Dyna": "Cruiser",
        "LiveWire": "Electric Motorcycle",
        "Pan America": "Adventure Bike",
        "Road Glide": "Touring Bike",
        "Softail": "Cruiser",
        "Sportster": "Cruiser",
        "Street Glide": "Touring Bike",
        "Trike": "Three-Wheeled Motorcycle",
        "V-Rod": "Cruiser"
    },
    "Hino": {
        "155": "Commercial Truck",
        "195": "Commercial Truck",
        "238": "Commercial Truck",
        "258": "Commercial Truck",
        "268": "Commercial Truck",
        "338": "Commercial Truck",
        "L Series": "Commercial Truck",
        "M Series": "Commercial Truck",
        "XL Series": "Commercial Truck"
    },
    "Honda": {
        "600": "Hatchback",
        "Accord": "Sedan",
        "Accord Crosstour": "Wagon",
        "Accord Hybrid": "Sedan",
        "Africa Twin": "Adventure Bike",
        "CBR Series": "Sport Bike",
        "Civic": "Sedan",
        "Civic Si": "Sedan",
        "Civic Type R": "Hatchback",
        "Clarity": "Sedan",
        "CR-V": "SUV",
        "CR-V Hybrid": "SUV",
        "CR-Z": "Hatchback",
        "CRF Series": "Dual-Sport",
        "CRX": "Coupe",
        "Crosstour": "Wagon",
        "Del Sol": "Coupe",
        "Element": "SUV",
        "EV Plus": "Electric Car",
        "Fit": "Hatchback",
        "Gold Wing": "Touring Bike",
        "Grom": "Standard Motorcycle",
        "HR-V": "SUV",
        "Insight": "Sedan",
        "Odyssey": "Minivan",
        "Passport": "SUV",
        "Pilot": "SUV",
        "Prelude": "Coupe",
        "Prologue": "Electric SUV",
        "Ridgeline": "Pickup Truck",
        "S2000": "Convertible",
        "Shadow": "Cruiser"
    },
    "Hummer": {
        "H1": "SUV",
        "H2": "SUV",
        "H3": "SUV"
    },
    "Husqvarna": {
        "FC 450": "Motocross/Off-road",
        "Norden 901": "Adventure Bike",
        "Svartpilen": "Standard Motorcycle",
        "Vitpilen": "Standard Motorcycle"
    },
    "Hyundai": {
        "Accent": "Sedan",
        "Azera": "Sedan",
        "Elantra": "Sedan",
        "Entourage": "Minivan",
        "Equus": "Sedan",
        "Excel": "Sedan",
        "Genesis": "Sedan",
        "Genesis Coupe": "Coupe",
        "Ioniq 5": "Electric SUV",
        "Ioniq 6": "Electric Car",
        "Kona": "Electric SUV",
        "Nexo": "Electric SUV",
        "Palisade": "SUV",
        "Pony": "Hatchback",
        "Santa Cruz": "Pickup Truck",
        "Santa Fe": "SUV",
        "Scoupe": "Coupe",
        "Sonata": "Sedan",
        "Stellar": "Sedan",
        "Tiburon": "Coupe",
        "Tucson": "SUV",
        "Veloster": "Hatchback",
        "Venue": "SUV",
        "Veracruz": "SUV",
        "XG300": "Sedan",
        "XG350": "Sedan"
    },
    "Indian": {
        "Challenger": "Touring Bike",
        "Chieftain": "Touring Bike",
        "Chief": "Cruiser",
        "FTR": "Standard Motorcycle",
        "Pursuit": "Touring Bike",
        "Roadmaster": "Touring Bike",
        "Scout": "Cruiser",
        "Springfield": "Touring Bike"
    },
    "Infiniti": {
        "EX": "SUV",
        "FX": "SUV",
        "G20": "Sedan",
        "G35": "Sedan",
        "G37": "Coupe",
        "I30": "Sedan",
        "I35": "Sedan",
        "J30": "Sedan",
        "JX": "SUV",
        "M": "Sedan",
        "M30": "Coupe",
        "Q40": "Sedan",
        "Q50": "Sedan",
        "Q60": "Coupe",
        "Q70": "Sedan",
        "QX": "SUV",
        "QX30": "SUV",
        "QX4": "SUV",
        "QX50": "SUV",
        "QX55": "SUV",
        "QX60": "SUV",
        "QX70": "SUV",
        "QX80": "SUV"
    },
    "International": {
        "CV Series": "Commercial Truck",
        "DuraStar": "Commercial Truck",
        "HV Series": "Commercial Truck",
        "HX Series": "Commercial Truck",
        "LoneStar": "Commercial Truck",
        "LT Series": "Commercial Truck",
        "MV Series": "Commercial Truck",
        "ProStar": "Commercial Truck",
        "RH Series": "Commercial Truck",
        "WorkStar": "Commercial Truck"
    },
    "Isuzu": {
        "Amigo": "SUV",
        "Ascender": "SUV",
        "Axiom": "SUV",
        "D-Max": "Pickup Truck",
        "F-Series": "Commercial Truck",
        "Hombre": "Pickup Truck",
        "i-Series": "Pickup Truck",
        "i-Mark": "Sedan",
        "Impulse": "Coupe",
        "N-Series": "Commercial Truck",
        "Oasis": "Minivan",
        "Pickup": "Pickup Truck",
        "Rodeo": "SUV",
        "Stylus": "Sedan",
        "Trooper": "SUV",
        "VehiCROSS": "SUV"
    },
    "Jaguar": {
        "E-PACE": "SUV",
        "F-PACE": "SUV",
        "F-TYPE": "Sports Car",
        "I-PACE": "Electric SUV",
        "S-Type": "Sedan",
        "X-Type": "Sedan",
        "XE": "Sedan",
        "XF": "Sedan",
        "XJ": "Sedan",
        "XJ-S": "Coupe",
        "XJ6": "Sedan",
        "XJ8": "Sedan",
        "XJR": "Sedan",
        "XK": "Coupe",
        "XK8": "Coupe",
        "XKR": "Coupe"
    },
    "Jeep": {
        "Cherokee": "SUV",
        "CJ": "SUV",
        "Comanche": "Pickup Truck",
        "Commander": "SUV",
        "Compass": "SUV",
        "Gladiator": "Pickup Truck",
        "Grand Cherokee": "SUV",
        "Grand Commander": "SUV",
        "Grand Wagoneer": "SUV",
        "Jeepster": "SUV",
        "Liberty": "SUV",
        "Patriot": "SUV",
        "Renegade": "SUV",
        "Wagoneer": "SUV",
        "Wrangler": "SUV",
        "Wrangler 4xe": "SUV"
    },
    "Kawasaki": {
        "Concours": "Touring Bike",
        "Eliminator": "Cruiser",
        "EX500": "Sport Bike",
        "GPZ": "Sport Bike",
        "KLR650": "Dual-Sport",
        "Ninja": "Sport Bike",
        "Versys": "Adventure Bike",
        "Voyager": "Touring Bike",
        "Vulcan": "Cruiser",
        "Z Series": "Standard Motorcycle",
        "ZX Series": "Sport Bike"
    },
    "Kenworth": {
        "C500": "Commercial Truck",
        "K270": "Commercial Truck",
        "K370": "Commercial Truck",
        "T280": "Commercial Truck",
        "T380": "Commercial Truck",
        "T480": "Commercial Truck",
        "T680": "Commercial Truck",
        "T800": "Commercial Truck",
        "T880": "Commercial Truck",
        "W900": "Commercial Truck",
        "W990": "Commercial Truck"
    },
    "Kia": {
        "Amanti": "Sedan",
        "Borrego": "SUV",
        "Cadenza": "Sedan",
        "Carnival": "Minivan",
        "EV6": "Electric SUV",
        "EV9": "Electric SUV",
        "Forte": "Sedan",
        "K5": "Sedan",
        "K900": "Sedan",
        "Magentis": "Sedan",
        "Niro": "Electric SUV",
        "Optima": "Sedan",
        "Rio": "Sedan",
        "Rondo": "Wagon",
        "Sedona": "Minivan",
        "Seltos": "SUV",
        "Sephia": "Sedan",
        "Sorento": "SUV",
        "Soul": "Wagon",
        "Spectra": "Sedan",
        "Spectra5": "Hatchback",
        "Sportage": "SUV",
        "Stinger": "Sedan",
        "Telluride": "SUV"
    },
    "KTM": {
        "Adventure Series": "Adventure Bike",
        "Duke Series": "Standard Motorcycle",
        "EXC-F Series": "Dual-Sport",
        "RC Series": "Sport Bike"
    },
    "Land Rover": {
        "Defender": "SUV",
        "Discovery": "SUV",
        "Discovery Sport": "SUV",
        "Freelander": "SUV",
        "LR2": "SUV",
        "LR3": "SUV",
        "LR4": "SUV",
        "Range Rover": "SUV",
        "Range Rover Evoque": "SUV",
        "Range Rover Sport": "SUV",
        "Range Rover Velar": "SUV"
    },
    "Lexus": {
        "CT": "Hatchback",
        "ES": "Sedan",
        "GS": "Sedan",
        "GX": "SUV",
        "HS": "Sedan",
        "IS": "Sedan",
        "LC": "Coupe",
        "LFA": "Sports Car",
        "LS": "Sedan",
        "LX": "SUV",
        "NX": "SUV",
        "RC": "Coupe",
        "RX": "SUV",
        "RZ": "Electric SUV",
        "SC": "Convertible",
        "TX": "SUV"
    },
    "Lincoln": {
        "Aviator": "SUV",
        "Blackwood": "Pickup Truck",
        "Continental": "Sedan",
        "Corsair": "SUV",
        "LS": "Sedan",
        "Mark LT": "Pickup Truck",
        "Mark VII": "Coupe",
        "Mark VIII": "Coupe",
        "MKS": "Sedan",
        "MKT": "SUV",
        "MKX": "SUV",
        "MKZ": "Sedan",
        "Nautilus": "SUV",
        "Navigator": "SUV",
        "Town Car": "Sedan",
        "Versailles": "Sedan",
        "Zephyr": "Sedan"
    },
    "Lucid": {
        "Air": "Electric Car"
    },
    "Mack": {
        "Anthem": "Commercial Truck",
        "Granite": "Commercial Truck",
        "LR": "Commercial Truck",
        "MD Series": "Commercial Truck",
        "Pinnacle": "Commercial Truck",
        "TerraPro": "Commercial Truck"
    },
    "Maserati": {
        "Biturbo": "Coupe",
        "Coupe": "Coupe",
        "Ghibli": "Sedan",
        "GranSport": "Coupe",
        "GranTurismo": "Coupe",
        "Grecale": "SUV",
        "Levante": "SUV",
        "MC20": "Sports Car",
        "Quattroporte": "Sedan",
        "Spyder": "Convertible"
    },
    "Mazda": {
        "323": "Hatchback",
        "626": "Sedan",
        "929": "Sedan",
        "B-Series": "Pickup Truck",
        "CX-3": "SUV",
        "CX-30": "SUV",
        "CX-5": "SUV",
        "CX-50": "SUV",
        "CX-7": "SUV",
        "CX-9": "SUV",
        "CX-90": "SUV",
        "GLC": "Hatchback",
        "Mazda3": "Sedan",
        "Mazda5": "Minivan",
        "Mazda6": "Sedan",
        "Millenia": "Sedan",
        "MPV": "Minivan",
        "MX-3": "Coupe",
        "MX-5 Miata": "Convertible",
        "MX-6": "Coupe",
        "Navajo": "SUV",
        "Protege": "Sedan",
        "Protege5": "Wagon",
        "RX-7": "Sports Car",
        "RX-8": "Sports Car",
        "Tribute": "SUV"
    },
    "Mercedes-Benz": {
        "190-Class": "Sedan",
        "300-Class": "Sedan",
        "400-Class": "Sedan",
        "500-Class": "Sedan",
        "600-Class": "Sedan",
        "A-Class": "Sedan",
        "AMG GT": "Sports Car",
        "B-Class": "Hatchback",
        "C-Class": "Sedan",
        "CL-Class": "Coupe",
        "CLA": "Sedan",
        "CLK-Class": "Coupe",
        "CLS": "Sedan",
        "E-Class": "Sedan",
        "eSprinter": "Electric Van",
        "EQB": "Electric SUV",
        "EQE": "Electric Car",
        "EQS": "Electric Car",
        "G-Class": "SUV",
        "GL-Class": "SUV",
        "GLA": "SUV",
        "GLB": "SUV",
        "GLC": "SUV",
        "GLE": "SUV",
        "GLK-Class": "SUV",
        "GLS": "SUV",
        "M-Class": "SUV",
        "Metris": "Cargo Van",
        "R-Class": "Minivan",
        "S-Class": "Sedan",
        "SL-Class": "Convertible",
        "SLK-Class": "Convertible",
        "SLR McLaren": "Sports Car",
        "SLS AMG": "Sports Car",
        "Sprinter": "Cargo Van"
    },
    "Mercury": {
        "Bobcat": "Hatchback",
        "Capri": "Coupe",
        "Comet": "Sedan",
        "Cougar": "Coupe",
        "Grand Marquis": "Sedan",
        "Lynx": "Hatchback",
        "Marauder": "Sedan",
        "Mariner": "SUV",
        "Marquis": "Sedan",
        "Milan": "Sedan",
        "Monarch": "Sedan",
        "Montego": "Sedan",
        "Mountaineer": "SUV",
        "Mystique": "Sedan",
        "Sable": "Sedan",
        "Topaz": "Sedan",
        "Tracer": "Sedan",
        "Villager": "Minivan",
        "Zephyr": "Sedan"
    },
    "Mini": {
        "Clubman": "Wagon",
        "Convertible": "Convertible",
        "Countryman": "SUV",
        "Hardtop": "Hatchback"
    },
    "Mitsubishi": {
        "3000GT": "Sports Car",
        "Cordia": "Coupe",
        "Diamante": "Sedan",
        "Eclipse": "Sports Car",
        "Eclipse Cross": "SUV",
        "Endeavor": "SUV",
        "Expo": "Minivan",
        "Galant": "Sedan",
        "i-MiEV": "Electric Car",
        "Lancer": "Sedan",
        "Mirage": "Hatchback",
        "Mirage G4": "Sedan",
        "Montero": "SUV",
        "Montero Sport": "SUV",
        "Outlander": "SUV",
        "Outlander PHEV": "SUV",
        "Outlander Sport": "SUV",
        "Precis": "Hatchback",
        "Raider": "Pickup Truck",
        "Sigma": "Sedan",
        "Starion": "Sports Car",
        "Tredia": "Sedan"
    },
    "Mitsubishi Fuso": {
        "Canter": "Commercial Truck",
        "eCanter": "Electric Truck",
        "FA/FI Series": "Commercial Truck",
        "FE/FG Series": "Commercial Truck"
    },
    "Moto Guzzi": {
        "V100 Mandello": "Touring Bike",
        "V7": "Standard Motorcycle",
        "V85 TT": "Adventure Bike",
        "V9": "Cruiser"
    },
    "MV Agusta": {
        "Brutale": "Standard Motorcycle",
        "Dragster": "Standard Motorcycle",
        "F3": "Sport Bike",
        "Turismo Veloce": "Touring Bike"
    },
    "Nissan": {
        "200SX": "Coupe",
        "240SX": "Coupe",
        "280ZX": "Sports Car",
        "300ZX": "Sports Car",
        "350Z": "Sports Car",
        "370Z": "Sports Car",
        "Altima": "Sedan",
        "Ariya": "Electric SUV",
        "Armada": "SUV",
        "Axxess": "Minivan",
        "Cube": "Wagon",
        "Frontier": "Pickup Truck",
        "GT-R": "Sports Car",
        "Juke": "SUV",
        "Kicks": "SUV",
        "Leaf": "Electric Car",
        "Maxima": "Sedan",
        "Murano": "SUV",
        "NV": "Cargo Van",
        "NV200": "Cargo Van",
        "NX": "Coupe",
        "Pathfinder": "SUV",
        "Pulsar": "Hatchback",
        "Quest": "Minivan",
        "Rogue": "SUV",
        "Sentra": "Sedan",
        "Sentra SE-R": "Sedan",
        "Stanza": "Sedan",
        "Titan": "Pickup Truck",
        "Titan XD": "Pickup Truck",
        "Van": "Cargo Van",
        "Versa": "Sedan",
        "Xterra": "SUV",
        "Z": "Sports Car"
    },
    "Norton": {
        "Commando 961": "Standard Motorcycle",
        "V4SV": "Sport Bike"
    },
    "Peterbilt": {
        "220": "Commercial Truck",
        "325": "Commercial Truck",
        "330": "Commercial Truck",
        "337": "Commercial Truck",
        "348": "Commercial Truck",
        "365": "Commercial Truck",
        "367": "Commercial Truck",
        "389": "Commercial Truck",
        "520": "Commercial Truck",
        "536": "Commercial Truck",
        "537": "Commercial Truck",
        "548": "Commercial Truck",
        "567": "Commercial Truck",
        "579": "Commercial Truck",
        "589": "Commercial Truck"
    },
    "Piaggio": {
        "Beverly": "Scooter",
        "Liberty": "Scooter",
        "MP3": "Scooter"
    },
    "Polestar": {
        "Polestar 1": "Electric Car",
        "Polestar 2": "Electric Car",
        "Polestar 3": "Electric SUV"
    },
    "Pontiac": {
        "1000": "Hatchback",
        "6000": "Sedan",
        "Astre": "Wagon",
        "Aztek": "SUV",
        "Bonneville": "Sedan",
        "Catalina": "Sedan",
        "Fiero": "Sports Car",
        "Firebird": "Sports Car",
        "G3": "Hatchback",
        "G5": "Coupe",
        "G6": "Sedan",
        "G8": "Sedan",
        "Grand Am": "Sedan",
        "Grand Prix": "Sedan",
        "GTO": "Sports Car",
        "J2000 Sunbird": "Sedan",
        "LeMans": "Hatchback",
        "Montana": "Minivan",
        "Parisienne": "Sedan",
        "Phoenix": "Coupe",
        "Safari": "Wagon",
        "Solstice": "Convertible",
        "Sunbird": "Sedan",
        "Sunfire": "Sedan",
        "T1000": "Hatchback",
        "Tempest": "Sedan",
        "Torrent": "SUV",
        "Trans Sport": "Minivan",
        "Vibe": "Wagon"
    },
    "Porsche": {
        "718 Boxster": "Convertible",
        "718 Cayman": "Coupe",
        "911": "Sports Car",
        "912": "Coupe",
        "914": "Sports Car",
        "918 Spyder": "Sports Car",
        "924": "Sports Car",
        "928": "Sports Car",
        "944": "Sports Car",
        "968": "Coupe",
        "Carrera GT": "Sports Car",
        "Cayenne": "SUV",
        "Macan": "SUV",
        "Panamera": "Sedan",
        "Taycan": "Electric Car"
    },
    "Ram": {
        "1500": "Pickup Truck",
        "2500": "Pickup Truck",
        "3500": "Pickup Truck",
        "4500": "Commercial Truck",
        "5500": "Commercial Truck",
        "Chassis Cab": "Commercial Truck",
        "ProMaster": "Cargo Van",
        "ProMaster City": "Cargo Van"
    },
    "Rivian": {
        "R1S": "Electric SUV",
        "R1T": "Electric Truck"
    },
    "Royal Enfield": {
        "Classic 350": "Standard Motorcycle",
        "Continental GT": "Standard Motorcycle",
        "Himalayan": "Adventure Bike",
        "Interceptor 650": "Standard Motorcycle"
    },
    "Saab": {
        "9-2X": "Wagon",
        "9-3": "Sedan",
        "9-4X": "SUV",
        "9-5": "Sedan",
        "9-7X": "SUV",
        "99": "Sedan",
        "900": "Sedan",
        "9000": "Sedan"
    },
    "Saturn": {
        "Astra": "Hatchback",
        "Aura": "Sedan",
        "Ion": "Sedan",
        "L-Series": "Sedan",
        "Outlook": "SUV",
        "Relay": "Minivan",
        "S-Series": "Sedan",
        "Sky": "Convertible",
        "Vue": "SUV"
    },
    "Scion": {
        "FR-S": "Coupe",
        "iA": "Sedan",
        "iM": "Hatchback",
        "iQ": "Hatchback",
        "tC": "Coupe",
        "xA": "Hatchback",
        "xB": "Wagon",
        "xD": "Hatchback"
    },
    "Subaru": {
        "Ascent": "SUV",
        "B9 Tribeca": "SUV",
        "Baja": "Pickup Truck",
        "BRZ": "Coupe",
        "Crosstrek": "SUV",
        "DL": "Sedan",
        "Forester": "SUV",
        "GL": "Sedan",
        "GL-10": "Wagon",
        "Impreza": "Sedan",
        "Justy": "Hatchback",
        "Legacy": "Sedan",
        "Loyale": "Wagon",
        "Outback": "Wagon",
        "RX": "Coupe",
        "Solterra": "Electric SUV",
        "Standard": "Hatchback",
        "SVX": "Coupe",
        "Tribeca": "SUV",
        "WRX": "Sedan",
        "XT": "Coupe",
        "XT6": "Coupe"
    },
    "Suzuki": {
        "Aerio": "Sedan",
        "DR-Z400S": "Dual-Sport",
        "Equator": "Pickup Truck",
        "Esteem": "Sedan",
        "Forenza": "Sedan",
        "Forsa": "Hatchback",
        "Grand Vitara": "SUV",
        "GSX-R Series": "Sport Bike",
        "Hayabusa": "Sport Bike",
        "Katana": "Sport Bike",
        "Kizashi": "Sedan",
        "Reno": "Hatchback",
        "Samurai": "SUV",
        "Sidekick": "SUV",
        "SJ410": "SUV",
        "SJ413": "SUV",
        "SV650": "Standard Motorcycle",
        "Swift": "Hatchback",
        "SX4": "Hatchback",
        "V-Strom": "Adventure Bike",
        "Verona": "Sedan",
        "Vitara": "SUV",
        "X-90": "SUV",
        "XL7": "SUV"
    },
    "Tesla": {
        "Cybertruck": "Electric Truck",
        "Model 3": "Electric Car",
        "Model S": "Electric Car",
        "Model X": "Electric SUV",
        "Model Y": "Electric SUV",
        "Roadster": "Electric Car",
        "Semi": "Electric Truck"
    },
    "Toyota": {
        "4Runner": "SUV",
        "86": "Coupe",
        "Avalon": "Sedan",
        "bZ4X": "Electric SUV",
        "C-HR": "SUV",
        "Camry": "Sedan",
        "Celica": "Coupe",
        "Corona": "Sedan",
        "Corolla": "Sedan",
        "Corolla Cross": "SUV",
        "Corolla Hatchback": "Hatchback",
        "Corolla iM": "Hatchback",
        "Cressida": "Sedan",
        "Crown": "Sedan",
        "Echo": "Sedan",
        "FJ Cruiser": "SUV",
        "GR Corolla": "Hatchback",
        "GR Supra": "Sports Car",
        "GR86": "Coupe",
        "Grand Highlander": "SUV",
        "Highlander": "SUV",
        "Land Cruiser": "SUV",
        "Matrix": "Wagon",
        "Mirai": "Sedan",
        "MR2 / MR2 Spyder": "Sports Car",
        "Paseo": "Coupe",
        "Previa": "Minivan",
        "Prius": "Hatchback",
        "Prius Prime": "Hatchback",
        "RAV4": "SUV",
        "RAV4 Prime": "SUV",
        "Sequoia": "SUV",
        "Sienna": "Minivan",
        "Solara": "Coupe",
        "Starlet": "Hatchback",
        "Supra": "Sports Car",
        "T100": "Pickup Truck",
        "Tacoma": "Pickup Truck",
        "Tercel": "Sedan",
        "Tundra": "Pickup Truck",
        "Van": "Cargo Van",
        "Venza": "SUV",
        "Yaris": "Hatchback"
    },
    "Triumph": {
        "Bonneville": "Standard Motorcycle",
        "Daytona": "Sport Bike",
        "Rocket 3": "Cruiser",
        "Scrambler": "Standard Motorcycle",
        "Speed Four": "Sport Bike",
        "Speed Triple": "Standard Motorcycle",
        "Sprint": "Sport Bike",
        "Street Triple": "Standard Motorcycle",
        "Tiger": "Adventure Bike",
        "Trident": "Standard Motorcycle",
        "TT600": "Sport Bike"
    },
    "Vespa": {
        "GTS": "Scooter",
        "Primavera": "Scooter",
        "Sprint": "Scooter"
    },
    "Volkswagen": {
        "Arteon": "Sedan",
        "Atlas": "SUV",
        "Atlas Cross Sport": "SUV",
        "Beetle": "Hatchback",
        "Cabrio": "Convertible",
        "CC": "Sedan",
        "Corrado": "Coupe",
        "Dasher": "Sedan",
        "Eos": "Convertible",
        "EuroVan": "Minivan",
        "Fox": "Sedan",
        "Golf": "Hatchback",
        "Golf R": "Hatchback",
        "GTI": "Hatchback",
        "ID.4": "Electric SUV",
        "Jetta": "Sedan",
        "Jetta GLI": "Sedan",
        "New Beetle": "Hatchback",
        "Passat": "Sedan",
        "Phaeton": "Sedan",
        "Quantum": "Wagon",
        "Rabbit": "Hatchback",
        "Routan": "Minivan",
        "Scirocco": "Coupe",
        "Taos": "SUV",
        "Thing": "Convertible",
        "Tiguan": "SUV",
        "Touareg": "SUV",
        "Vanagon": "Cargo Van"
    },
    "Volvo": {
        "240": "Sedan",
        "260": "Sedan",
        "740": "Sedan",
        "760": "Sedan",
        "780": "Coupe",
        "850": "Sedan",
        "940": "Sedan",
        "960": "Sedan",
        "C30": "Hatchback",
        "C40 Recharge": "Electric SUV",
        "C70": "Convertible",
        "S40": "Sedan",
        "S60": "Sedan",
        "S70": "Sedan",
        "S80": "Sedan",
        "S90": "Sedan",
        "V40": "Wagon",
        "V50": "Wagon",
        "V60": "Wagon",
        "V70": "Wagon",
        "V90": "Wagon",
        "VHD": "Commercial Truck",
        "VNL": "Commercial Truck",
        "VNR": "Commercial Truck",
        "XC40": "SUV",
        "XC60": "SUV",
        "XC70": "Wagon",
        "XC90": "SUV"
    },
    "Yamaha": {
        "Bolt": "Cruiser",
        "FZ Series": "Standard Motorcycle",
        "FZR Series": "Sport Bike",
        "MT Series": "Standard Motorcycle",
        "Radian": "Standard Motorcycle",
        "Razz": "Scooter",
        "Riva": "Scooter",
        "Seca": "Standard Motorcycle",
        "Super Ténéré": "Adventure Bike",
        "Tracer 9": "Touring Bike",
        "TW200": "Dual-Sport",
        "Virago": "Cruiser",
        "VMAX": "Cruiser",
        "V Star": "Cruiser",
        "XSR Series": "Standard Motorcycle",
        "YZF-R Series": "Sport Bike",
        "Zuma": "Scooter"
    },
    "Zero Motorcycles": {
        "DSR/X": "Electric Motorcycle",
        "FXE": "Electric Motorcycle",
        "SR/F": "Electric Motorcycle",
        "SR/S": "Electric Motorcycle"
    },
    "Other": {
        "Other": "Other"
    }
};
const vehicleColors = ["Beige", "Black", "Blue", "Brown", "Burgundy", "Charcoal", "Dark Blue", "Dark Green", "Gold", "Gray", "Green", "Light Blue", "Orange", "Red", "Silver", "Tan", "White", "Yellow"].sort();

const usStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"].sort();

const veryGoodTraits = [
  "Alert & Aware",
  "Big Dick Energy",
  "Defensive Driving",
  "Patient with Pedestrians"
];

const goodTraits = [
  "Allowed Merge",
  "Excellent Parking",
  "Followed Signs",
  "Kept Right to Pass",
  "Proper Speed",
  "Respectful Distance",
  "Smooth Braking",
  "Stopped Fully",
  "Used Turn Signals",
  "Yielded Correctly"
];

const badTraits = [
  "Blocking Traffic",
  "Driving Too Slow",
  "Excessive Honking",
  "Ignoring Signs",
  "Improper U-Turn",
  "Lane Weaving",
  "No Turn Signals",
  "Poor Parking",
  "Rolling Stops",
  "Speeding",
  "Sudden Braking"
];

const veryBadTraits = [
  "Aggressive Driving",
  "Brake Checking",
  "Cut Off Others",
  "Distracted Driving",
  "Road Rage",
  "Running Red Light",
  "Small Dick Energy",
  "Tailgating"
];

const allTraits = [...new Set([...veryGoodTraits, ...goodTraits, ...badTraits, ...veryBadTraits])].sort();


// Text normalization and profanity filtering


const forbiddenWords = ['fuck','fuk','fck','fcuk','fuxk','phuck','phuk','shit','shyt','sht','sh1t','sh!t','asshole','azzhole','asshol','azzhol','azz','bitch','btch','b!tch','b1tch','bich','b!ch','cunt','kunt','cnt','c_nt','dick','dik','d!ck','d1ck','pussy','pssy','pussi','puzsy','pusy','nigger','nigga','nigg','nig','n!gger','n1gger','niga','n!ga','faggot','fagot','fag','f@g','f@ggot','retard','rtrd','ret@rd','r3tard','tard','whore','hor','wh0re','whor3','anal','an@l','arse','ar$e','bastard','basstard','bollocks','bollox','boner','clit','cl!t','cock','kok','kock','damn','dam','douche','douch','dyke','dike','felch','gook','handjob','hj','jizz','j!zz','kike','lesbo','lezbo','masturbate','masturb8','motherfucker','mf','mthrfckr','pedo','p3do','penis','pen!s','porn','prn','rape','r@pe','scrotum','slut','slutt','sl_t','smegma','sperm','tits','titt','t!ts','twat','tw@t','vagina','vag!na','wank','w@nk','wetback','nazi','naz!','n@zi','heil','h3il','hitler','h!tler','kkk','whitepower','whtpowr','whitepwr','supremacy','suprem@cy','islamist','jihadist','j!hadist','terrorist','terr0rist','communist','socialist','fascist','anarchist','antifa','zionist','racist','r@cist','sexist','s3xist','homophobe','homophob','transphobe','transphob','bigot','feminazi','mra','incel','sjw','pc','politicallycorrect','wokeism','cancelculture','triggered','triggred','safespace','microaggression','mansplain','manspread','whitesplaining','privilege','toxic','fragile','cis','hetero','cisgender','heteronormative','patriarchy','misogyny','misandry','bomb','bom','b0mb','kill','k!ll','k1ll','murder','murd3r','gang','g@ng','mafia','m@fia','crip','cr!p','blood','bl00d','terror','terr0r','explode','expl0de','shoot','sh00t','stab','st@b','gun','gn','knife','kn!fe','assault','ass@ult','execution','electricchair','gaschamber','lethalinjection','firingsquad','guillotine','lynch','hang','burn','brn','acid','ac!d','poison','p0ison','torture','t0rture','mutilate','mut!late','dismember','decapitate','drug','drg','coke','cok','heroin','her0in','meth','m3th','weed','w33d','we3d','drunk','drnk','dui','pot','high','stoned','alcoholic','junkie','junky','crackhead','stolen','st0len','illegal','ill3gal','contraband','smuggle','bribe','corrupt','criminal','felon','convict','prisoner','jail','prison','cop','police','pol!ce','pig','acab','idiot','id!ot','moron','m0ron','dumb','dum','stupid','stup!d','loser','l0ser','failure','useless','worthless','ugly','ugli','fat','f@t','skinny','short','tall','bald','hairy','smelly','dirty','gross','disgusting','filthy','nasty','sick','disease','cancer','aids','hiv','covid','c0vid','virus','v!rus','plague','epidemic','quarantine','mask','vaccine','v@ccine','jab','antivax','ant!vax','sheeple','normie','npc','boomer','zoomer','millennial','genz','okboomer','karen','chad','stacy','becky','brad','thot','simp','incel','virgin','cuck','soyboy','69','420','sex','s3x','s_x','naked','nak3d','nude','nud3','cult','sect','conspiracy','qanon','plandemic','hoax','fake','false','liar','cheat','fraud','scam','rip-off','ripoff','master','dom','sub','bdsm','fetish','kink','hentai','lolicon','shotacon','necrophilia','suicide','suic!de','selfharm','selfh@rm','cutting','cutt!ng','starve','anorexia','bulimia','proana','promia','thinspo']


// --- 3. DOM Manipulation & Rendering ---


/**

 * Injects the 'Add Review' modal HTML into the DOM.

 * This is done dynamically to keep the initial HTML file cleaner.

 */

const injectReviewModal = () => {
    const makeOptions = ['<option value="">Select Make</option>', ...vehicleMakes.map(make => `<option value="${make}">${make}</option>`)].join('');
    const colorOptions = ['<option value="">Select Color</option>', ...vehicleColors.map(color => `<option value="${color}">${color}</option>`)].join('');
    const stateOptions = ['<option value="">Select State</option>', ...usStates.map(state => `<option value="${state}">${state}</option>`)].join('');
    const templateOptions = commentBuilderData.templates.map((template, index) => `<option value="${index}" ${index === 0 ? 'selected' : ''}>${template}</option>`).join('');
    
    // Dynamically create trait chips HTML from the arrays
    const veryGoodChipsHtml = veryGoodTraits.map(trait => `<span class="trait-chip trait-very-good" data-value="${trait}">${trait}</span>`).join('');
    const goodChipsHtml = goodTraits.map(trait => `<span class="trait-chip trait-good" data-value="${trait}">${trait}</span>`).join('');
    const badChipsHtml = badTraits.map(trait => `<span class="trait-chip trait-bad" data-value="${trait}">${trait}</span>`).join('');
    const veryBadChipsHtml = veryBadTraits.map(trait => `<span class="trait-chip trait-very-bad" data-value="${trait}">${trait}</span>`).join('');

    const modalHtml = `
        <div id="reviewModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden">
            <div class="bg-secondary text-primary rounded-2xl shadow-xl w-11/12 lg:w-2/3 max-w-5xl max-h-[90vh] flex flex-col">
                <div class="flex justify-between items-center p-4 border-b border-color">
                    <h2 class="text-xl font-bold font-license-plate">Submit a Review</h2>
                    <button id="closeModalBtn" class="text-secondary text-2xl hover:text-primary">&times;</button>
                </div>
                <div class="p-6 overflow-y-auto no-scrollbar">
                    <form id="reviewForm">
                        <div class="bg-tertiary p-4 rounded-lg mb-6">
                            <h3 class="font-semibold mb-3 text-primary">License Plate Details</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div><label for="plate_number" class="text-sm font-medium text-secondary">Plate Number *</label><input type="text" id="plate_number" name="plate_number" required maxlength="8" class="w-full mt-1 px-3 py-2 bg-tertiary text-primary placeholder-tertiary border border-color rounded-md focus:ring-blue-500 focus:border-blue-500"></div>
                                <div><label for="vehicle_make" class="text-sm font-medium text-secondary">Make</label><select id="vehicle_make" name="vehicle_make" class="w-full mt-1 px-3 py-2 bg-tertiary text-primary border border-color rounded-md focus:ring-blue-500 focus:border-blue-500">${makeOptions}</select></div>
                                <div><label for="vehicle_model" class="text-sm font-medium text-secondary">Model</label><select id="vehicle_model" name="vehicle_model" class="w-full mt-1 px-3 py-2 bg-tertiary text-primary border border-color rounded-md focus:ring-blue-500 focus:border-blue-500" disabled><option value="">Select Model</option></select></div>
                                <div><label for="vehicle_color" class="text-sm font-medium text-secondary">Color</label><select id="vehicle_color" name="vehicle_color" class="w-full mt-1 px-3 py-2 bg-tertiary text-primary border border-color rounded-md focus:ring-blue-500 focus:border-blue-500">${colorOptions}</select></div>
                                <div class="col-span-2"><label for="incident_location" class="text-sm font-medium text-secondary">Incident State</label><select id="incident_location" name="incident_location" class="w-full mt-1 px-3 py-2 bg-tertiary text-primary border border-color rounded-md focus:ring-blue-500 focus:border-blue-500">${stateOptions}</select></div>
                            </div>
                        </div>
                        <div class="mb-6 text-center">
                            <h3 class="font-semibold mb-2 text-primary">Overall Rating *</h3>
                            <div class="modal-star-rating">
                                <input type="radio" id="star5" name="rating" value="5" required/><label for="star5" title="5 stars" class="text-tertiary">★</label>
                                <input type="radio" id="star4" name="rating" value="4"/><label for="star4" title="4 stars" class="text-tertiary">★</label>
                                <input type="radio" id="star3" name="rating" value="3"/><label for="star3" title="3 stars" class="text-tertiary">★</label>
                                <input type="radio" id="star2" name="rating" value="2"/><label for="star2" title="2 stars" class="text-tertiary">★</label>
                                <input type="radio" id="star1" name="rating" value="1"/><label for="star1" title="1 star" class="text-tertiary">★</label>
                            </div>
                        <div class="bg-tertiary p-4 rounded-lg mb-6">
                            <div class="flex justify-between items-center mb-3">
                                <h3 class="font-semibold text-primary">Construct a Comment</h3>
                                <div class="flex items-center">
                                    <input type="checkbox" id="no-comment-checkbox" class="h-4 w-4 rounded border-color bg-tertiary text-blue-600 focus:ring-blue-500">
                                    <label for="no-comment-checkbox" class="ml-2 block text-sm text-secondary">No Comment</label>
                                </div>
                            </div>
                            <div id="comment-builder-body" class="space-y-3">
                                <div>
                                    <label for="comment-template" class="text-sm font-medium text-secondary">Template</label>
                                    <select id="comment-template" name="comment_template" class="w-full mt-1 px-3 py-2 bg-tertiary text-primary border border-color rounded-md focus:ring-blue-500 focus:border-blue-500">${templateOptions}</select>
                                </div>
                                <div id="comment-words-container" class="space-y-3"></div>
                            </div>
                        </div>
                        <div class="mb-6">
                            <h3 class="font-semibold mb-2 text-primary">Select Traits</h3>
                            <div class="space-y-4">
                                <div>
                                    <h4 class="font-medium text-sm text-secondary mb-2">Very Good</h4>
                                    <div class="flex flex-wrap gap-2 justify-center">
                                        ${veryGoodChipsHtml}
                                    </div>
                                </div>
                                <div>
                                    <h4 class="font-medium text-sm text-secondary mb-2">Good</h4>
                                    <div class="flex flex-wrap gap-2 justify-center">
                                        ${goodChipsHtml}
                                    </div>
                                </div>
                                <div>
                                    <h4 class="font-medium text-sm text-secondary mb-2">Bad</h4>
                                    <div class="flex flex-wrap gap-2 justify-center">
                                        ${badChipsHtml}
                                    </div>
                                </div>
                                <div>
                                    <h4 class="font-medium text-sm text-secondary mb-2">Very Bad</h4>
                                    <div class="flex flex-wrap gap-2 justify-center">
                                        ${veryBadChipsHtml}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input type="hidden" id="tags" name="tags">
                        <div id="formMessage" class="mt-4 text-center"></div>
                    </form>
                </div>
                <div class="p-4 bg-dark-tertiary border-t border-dark rounded-b-2xl">
                    <button type="submit" form="reviewForm" class="w-full bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">Submit Review</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
};


/**

 * Renders a structured comment from JSON data into a readable HTML string.

 * @param {string|object} commentData - The comment data, either as a JSON string or an object.

 * @returns {string} The formatted HTML string for the comment.

 */

const renderStructuredComment = (commentData) => {

    try {

        const parsedComment = typeof commentData === 'string' ? JSON.parse(commentData) : commentData;


        if (!parsedComment || !Array.isArray(parsedComment.words) || parsedComment.words.length === 0) {

            return "No comment provided.";

        }


        const template = commentBuilderData.templates[parsedComment.template];


        if (!template) {

            // Fallback for old comments or data mismatch

            return parsedComment.words.map(word => `<strong class="text-blue-600 font-semibold">${word}</strong>`).join(' ');

        }


        let message = template;

        parsedComment.words.forEach(word => {

            message = message.replace('_____', `<strong class="text-blue-600 font-semibold">${word}</strong>`);

        });


        return message;

    } catch (e) {

        // Fallback for non-JSON comments

        return commentData || "No comment provided.";

    }

};


/**

 * Updates the content of the review detail modal with a specific review's data.

 * @param {object} review - The review object to display.

 */

const updateReviewDetailModalContent = (review) => {

    // Plate and vehicle info

    const plateImage = document.getElementById('detailPlateImage');

    plateImage.src = API_URL.replace('/api', '') + '/images/blankplate.png';

    document.getElementById('detailPlateNumberOverlay').textContent = review.plate_number.toUpperCase();

    document.getElementById('detailVehicleMake').textContent = review.vehicle_make || 'N/A';

    document.getElementById('detailVehicleModel').textContent = review.vehicle_model || 'N/A';

    document.getElementById('detailVehicleColor').textContent = review.vehicle_color || 'N/A';

    document.getElementById('detailComment').innerHTML = renderStructuredComment(review.comment);

    let subtype = 'N/A';

    if (review.vehicle_make && review.vehicle_model) {

        subtype = vehicleSubtype[review.vehicle_make]?.[review.vehicle_model] || 'N/A';

    }

    document.getElementById('detailVehicleType').textContent = subtype;


    // Reviewer info with profile link

    const detailUserIdSpan = document.getElementById('detailUserId');

    const username = review.user_id || 'Anonymous';

    detailUserIdSpan.innerHTML = '';

    if (username !== 'Anonymous') {

        const userProfileButton = document.createElement('button');

        userProfileButton.className = 'text-blue-400 hover:underline font-semibold';

        userProfileButton.textContent = username;

        userProfileButton.addEventListener('click', () => {

            document.getElementById('reviewDetailModal').classList.add('hidden');

            if (username === currentUsername) {

                showProfileModal();

            } else {

                showUserProfile(username);

            }

        });

        detailUserIdSpan.appendChild(userProfileButton);

    } else {

        detailUserIdSpan.textContent = username;

    }


    // Incident location and votes

    document.getElementById('detailIncidentLocation').textContent = review.incident_location || 'N/A';

    document.getElementById('upvotesCount').textContent = review.upvotes || 0;

    document.getElementById('downvotesCount').textContent = review.downvotes || 0;


    // Set active state for vote buttons

    const upvoteBtn = document.getElementById('upvoteBtn');

    const downvoteBtn = document.getElementById('downvoteBtn');

    const currentUserVote = userVotes[review.id];

    upvoteBtn.classList.toggle('active-up', currentUserVote === 'up');

    downvoteBtn.classList.toggle('active-down', currentUserVote === 'down');


    // Render rating stars

    const ratingStarsContainer = document.getElementById('detailRatingStars');

    ratingStarsContainer.innerHTML = '';

    for (let i = 1; i <= 5; i++) {

        const starSpan = document.createElement('span');

        starSpan.classList.add('star');

        if (i <= review.rating) starSpan.classList.add('filled');

        starSpan.textContent = '\u2605';

        ratingStarsContainer.prepend(starSpan);

    }


    // Render traits
    const detailTraitsContainer = document.getElementById('detailTraits');
    detailTraitsContainer.innerHTML = '';
    if (review.tags) {
        const tagsArray = review.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        tagsArray.forEach(tag => {
            const traitSpan = document.createElement('span');
            traitSpan.className = 'px-3 py-1 rounded-full text-sm font-medium text-white';

            let color = '#6b7280'; // Default gray
            if (veryGoodTraits.includes(tag)) {
                color = '#0ea5e9'; // sky-500
            } else if (goodTraits.includes(tag)) {
                color = '#22c55e'; // green-500
            } else if (badTraits.includes(tag)) {
                color = '#f97316'; // orange-500
            } else if (veryBadTraits.includes(tag)) {
                color = '#ef4444'; // red-500
            }

            traitSpan.style.backgroundColor = color;
            traitSpan.textContent = tag;
            detailTraitsContainer.appendChild(traitSpan);
        });
    } else {
        detailTraitsContainer.innerHTML = '<span class="text-light-secondary text-sm">No traits.</span>';
    }


    // Update navigation controls

    document.getElementById('detailReviewCount').textContent = `Review ${currentReviewIndex + 1} of ${currentPlateReviews.length}`;

    document.getElementById('prevReviewBtn').disabled = currentReviewIndex === 0;

    document.getElementById('nextReviewBtn').disabled = currentReviewIndex >= currentPlateReviews.length - 1;

};


/**

 * Sets the navigation mode of the review detail modal.

 * 'feed' mode shows next/previous buttons.

 * 'profile' mode shows a 'Back to Profile' button.

 * @param {'feed' | 'profile'} mode - The mode to set.

 * @param {string|null} username - The username associated with the profile, if in 'profile' mode.

 */

const setDetailModalMode = (mode, username = null) => {

    const feedNav = document.getElementById('detailNavFeed');

    const profileNav = document.getElementById('detailNavProfile');


    if (mode === 'profile') {

        feedNav.classList.add('hidden');

        profileNav.classList.remove('hidden');

        lastViewedProfile = username;

    } else { // Default to 'feed' mode

        feedNav.classList.remove('hidden');

        profileNav.classList.add('hidden');

        lastViewedProfile = null;

    }

};


/**

 * Displays the review detail modal for a given license plate.

 * @param {string} plateNumber - The license plate number to show reviews for.

 */

const showReviewDetail = (plateNumber) => {

    setDetailModalMode('feed'); // Reset to default feed navigation mode

    currentPlateReviews = aggregatedReviewsData[plateNumber].allReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    currentReviewIndex = 0;

    document.getElementById('reviewDetailModal').classList.remove('hidden');

    updateReviewDetailModalContent(currentPlateReviews[currentReviewIndex]);

};


/**

 * Navigates to the previous review in the detail modal.

 */

const showPreviousReview = () => {

    if (currentReviewIndex > 0) {

        currentReviewIndex--;

        updateReviewDetailModalContent(currentPlateReviews[currentReviewIndex]);

    }

};


/**

 * Navigates to the next review in the detail modal.

 */

const showNextReview = () => {

    if (currentReviewIndex < currentPlateReviews.length - 1) {

        currentReviewIndex++;

        updateReviewDetailModalContent(currentPlateReviews[currentReviewIndex]);

    }

};


/**

 * Renders the main review feed based on current filters.

 */

const renderReviews = () => {

    const reviewsContainer = document.getElementById('reviewsContainer');

    const normalizePlate = (plate) => plate.replace(/[\s-]/g, '').toLowerCase();

    const searchTerm = normalizePlate(document.getElementById('searchPlate').value.trim());

    const selectedState = document.getElementById('filterState').value;

    const selectedMake = document.getElementById('filterMake').value;

    const selectedType = document.getElementById('filterType').value;

    const selectedSubtype = document.getElementById('filterSubtype').value;

    const selectedTrait = document.getElementById('filterTrait').value;


    let filteredData = Object.values(aggregatedReviewsData).filter(data => {

        const plateMatch = normalizePlate(data.plate_number).includes(searchTerm);

        const stateMatch = !selectedState || data.allReviews.some(review => review.incident_location === selectedState);

        const makeMatch = !selectedMake || data.allReviews.some(review => review.vehicle_make === selectedMake);


        const typeMatch = !selectedType || data.allReviews.some(review => {

            if (!review.vehicle_make || !review.vehicle_model) return false;

            const subtype = vehicleSubtype[review.vehicle_make]?.[review.vehicle_model];

            const type = vehicleType[subtype];

            return type === selectedType;

        });


        const subtypeMatch = !selectedSubtype || data.allReviews.some(review => {

            if (!review.vehicle_make || !review.vehicle_model) return false;

            const subtype = vehicleSubtype[review.vehicle_make]?.[review.vehicle_model];

            return subtype === selectedSubtype;

        });


        const traitMatch = !selectedTrait || data.allReviews.some(review => review.tags && review.tags.includes(selectedTrait));


        return plateMatch && stateMatch && makeMatch && typeMatch && subtypeMatch && traitMatch;

    });


    const selectedSort = document.getElementById('sortReviews').value;

    const reviewsHeading = document.getElementById('reviewsHeading');


    // Sort the data

    filteredData.sort((a, b) => {

        switch (selectedSort) {

            case 'highest':

                return b.averageRating - a.averageRating;

            case 'lowest':

                return a.averageRating - b.averageRating;

            case 'oldest':

                return new Date(a.allReviews[0].created_at) - new Date(b.allReviews[0].created_at);

            case 'recent':

            default:

                return new Date(b.allReviews[0].created_at) - new Date(a.allReviews[0].created_at);

        }

    });


    // Update heading

    const sortOptions = {

        recent: 'newest Reviews',

        oldest: 'Oldest Reviews',

        highest: 'Highest-Rated Plates',

        lowest: 'Lowest-Rated Plates',

    };

    reviewsHeading.textContent = sortOptions[selectedSort] || 'Recent Reviews';


    reviewsContainer.innerHTML = '';

    if (filteredData.length === 0) {

        reviewsContainer.innerHTML = `<div class="text-center py-10"><p class="text-light-secondary">No reviews match the current filters.</p></div>`;

        return;

    }

    filteredData.forEach(data => {

        const ratingColor = data.averageRating >= 4 ? 'text-green-400' : data.averageRating >= 2 ? 'text-yellow-400' : 'text-red-400';

        const firstReview = data.allReviews[0];

        const commentHtml = firstReview.comment ? renderStructuredComment(firstReview.comment).replace(/<[^>]*>/g, '') : 'No comment';
        
        const vehicleTitle = firstReview.vehicle_make || 'Unknown Make';

        const reviewCardHtml = `

            <div class="bg-tertiary p-4 rounded-xl shadow-md flex items-center space-x-4 cursor-pointer review-card" data-plate-number="${data.plate_number}">

                <div class="plate-display relative w-24 h-12" style="background-image: url('/images/blankplate.png');">

                    <div class="plate-number-overlay text-lg">${data.plate_number.toUpperCase()}</div>

                </div>

                <div class="flex-grow">

                    <h3 class="font-bold text-primary">${vehicleTitle}</h3>

                    <p class="text-sm text-secondary">${commentHtml.substring(0, 40)}...</p>

                </div>

                <div class="flex items-center font-bold text-lg ${ratingColor}">

                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="mr-1"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>

                    <span>${parseFloat(data.averageRating).toFixed(1)}</span>

                </div>

            </div>`;

        reviewsContainer.insertAdjacentHTML('beforeend', reviewCardHtml);

    });

    document.querySelectorAll('.review-card').forEach(card => {

        card.addEventListener('click', (event) => showReviewDetail(event.currentTarget.dataset.plateNumber));

    });

};


/**

 * Renders badges in a given container, showing locked/unlocked state.

 * @param {Array} userBadges - Array of badge objects the user has earned.

 * @param {Array} allBadges - Array of all possible badge objects.

 * @param {HTMLElement} container - The container element to render badges into.

 * @param {number} [limit=0] - The maximum number of badges to display (0 for all).

 */

const renderProfileBadges = (userBadges, allBadges, container, limit = 0) => {

    if (!container) return;

    container.innerHTML = '';


    if (!allBadges || allBadges.length === 0) {

        container.innerHTML = '<p class="text-light-secondary text-sm">Could not load achievements.</p>';

        return;

    }


    const userBadgeIds = new Set(userBadges.map(b => b.badge_id));

    let badgesToDisplay;


    if (limit > 0) {

        // Sort for the preview: unlocked first, then by ID

        const sortedBadges = [...allBadges].sort((a, b) => {

            const aUnlocked = userBadgeIds.has(a.badge_id);

            const bUnlocked = userBadgeIds.has(b.badge_id);

            if (aUnlocked !== bUnlocked) {

                return aUnlocked ? -1 : 1;

            }

            return a.badge_id - b.badge_id;

        });

        badgesToDisplay = sortedBadges.slice(0, limit);

    } else {

        badgesToDisplay = allBadges; // For the "Show All" modal

    }


    badgesToDisplay.forEach(badge => {

        const isUnlocked = userBadgeIds.has(badge.badge_id);

        const badgeElement = document.createElement('div');

        badgeElement.className = 'badge-container cursor-pointer';


        const imgClass = isUnlocked ? '' : 'badge-locked';

        const lockIconHtml = isUnlocked ? '' : `

            <svg class="lock-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>

                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>

            </svg>

        `;


        badgeElement.innerHTML = `

            <img src="${badge.image_url || '/images/badges/default.png'}" alt="${badge.name}" class="w-16 h-16 transition-transform hover:scale-110 ${imgClass}">

            ${lockIconHtml}

        `;


        badgeElement.addEventListener('click', () => {

            if (container.id === 'allBadgesContainer') {

                document.getElementById('allBadgesModal').classList.add('hidden');

            }


            const detailImage = document.getElementById('badgeDetailImage');

            detailImage.src = badge.image_url || '/images/badges/default.png';

            detailImage.classList.toggle('badge-locked', !isUnlocked);

            document.getElementById('badgeDetailName').textContent = badge.name;

            document.getElementById('badgeDetailDescription').textContent = isUnlocked ? badge.description : 'This badge is locked. Keep using PlateTraits to discover how to unlock it!';

            document.getElementById('badgeDetailModal').classList.remove('hidden');

        });


        container.appendChild(badgeElement);

    });

};


/**

 * Renders a user's submitted reviews into their profile modal.

 * @param {HTMLElement} container - The container element to render reviews into.

 * @param {Array} reviews - An array of the user's review objects.

 * @param {string} profileUsername - The username of the profile being viewed.

 */

const renderProfileReviews = (container, reviews, profileUsername) => {

    container.innerHTML = '';

    if (reviews && reviews.length > 0) {

        reviews.forEach(review => {

            const ratingColor = review.rating >= 4 ? 'text-green-400' : review.rating >= 2 ? 'text-yellow-400' : 'text-red-400';

            const reviewCard = document.createElement('div');

            reviewCard.className = 'bg-tertiary p-3 rounded-lg cursor-pointer hover-bg-highlight';

            reviewCard.innerHTML = `

                <div class="flex justify-between items-start">

                    <div>

                        <p class="font-bold text-primary">${review.plate_number.toUpperCase()}</p>

                        <p class="text-xs text-secondary">${new Date(review.created_at).toLocaleString()}</p>

                    </div>

                    <div class="flex items-center font-bold text-md ${ratingColor}">

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="mr-1"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>

                        <span>${review.rating}.0</span>

                    </div>

                </div>

                <p class="text-sm italic mt-2 text-secondary">"${renderStructuredComment(review.comment).replace(/<[^>]*>/g, '')}"</p>

            `;


            reviewCard.addEventListener('click', () => {

                const fullReviewData = allReviewsData.find(r => r.id === review.id);

                if (fullReviewData) {

                    document.getElementById('profileModal').classList.add('hidden');

                    setDetailModalMode('profile', profileUsername);

                    document.getElementById('reviewDetailModal').classList.remove('hidden');

                    updateReviewDetailModalContent(fullReviewData);

                } else {

                    console.error("Could not find full review data for ID:", review.id);

                }

            });


            container.appendChild(reviewCard);

        });

    } else {

        const message = (profileUsername === currentUsername)

            ? 'You have not submitted any reviews yet.'

            : 'This user has not submitted any reviews yet.';

        container.innerHTML = `<p class="text-light-secondary">${message}</p>`;

    }

};


// --- 4. API & Data Fetching ---


/**

 * Fetches all reviews from the API and processes them.

 */

const fetchReviews = async () => {

    const loadingIndicator = document.getElementById('loadingReviews');

    try {
        const response = await fetch(`${API_URL}/reviews`);
        if (!response.ok) {
            // Since this is a general page load, we don't have a specific message element.
            // We can create a temporary one or log to console. For now, let's just update the loading indicator.
            const errorElement = document.createElement('div');
            await handleApiError(response, errorElement);
            if(loadingIndicator) loadingIndicator.innerHTML = `<p class="text-red-500 col-span-full">${errorElement.textContent}</p>`;
            return;
        }
        allReviewsData = await response.json();
        aggregatedReviewsData = {};
        allReviewsData.forEach(review => {
            const plate = review.plate_number.toUpperCase();
            if (!aggregatedReviewsData[plate]) {
                aggregatedReviewsData[plate] = { plate_number: plate, totalRating: 0, reviewCount: 0, averageRating: 0, allReviews: [] };
            }
            aggregatedReviewsData[plate].totalRating += review.rating;
            aggregatedReviewsData[plate].reviewCount++;
            aggregatedReviewsData[plate].averageRating = aggregatedReviewsData[plate].totalRating / aggregatedReviewsData[plate].reviewCount;
            aggregatedReviewsData[plate].allReviews.push(review);
        });
        renderReviews();
    } catch (error) {
        console.error("A critical error occurred during fetchReviews:", error);
        if(loadingIndicator) loadingIndicator.innerHTML = `<p class="text-red-500 col-span-full">A critical error occurred. Please check the console.</p>`;
    }

};


/**

 * Fetches the current user's votes on reviews.

 */

const fetchUserVotes = async () => {

    if (!authToken) {

        userVotes = {};

        return;

    }

    try {
        const response = await fetch(`${API_URL}/users/votes`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (!response.ok) {
            // Non-critical, so just log to console.
            console.error('Failed to fetch user votes. This may affect vote button states.');
            return;
        }
        const result = await response.json();
        if (result.success) {
            userVotes = result.votes.reduce((acc, vote) => {
                acc[vote.review_id] = vote.vote_type;
                return acc;
            }, {});
        }
    } catch (error) {
        console.error("A critical error occurred during fetchUserVotes:", error);
        userVotes = {}; // Reset on failure
    }

};


/**

 * Fetches all available badges from the API.

 * @returns {Promise<Array>} A promise that resolves to an array of all badge objects.

 */

const fetchAllBadges = async () => {

    try {

        const response = await fetch(`${API_URL}/badges`);

        if (!response.ok) {

            throw new Error('Could not fetch all badges.');

        }

        return await response.json();

    } catch (error) {

        console.error("Failed to fetch all badges:", error);

        return []; // Return empty array on error

    }

};


/**

 * Fetches and displays the profile for a given username.

 * @param {string} username - The username of the profile to display.

 */

const showUserProfile = async (username) => {

    const profileModal = document.getElementById('profileModal');

    const profileTitle = profileModal.querySelector('h2');

    const profileFirstNameEl = document.getElementById('profileFirstName');

    const profileUsernameEl = document.getElementById('profileUsername');

    const profileEmailContainer = document.getElementById('profileEmail').parentElement;

    const profileJoinDateContainer = document.getElementById('profileJoinDate').parentElement;

    const profileJoinDateEl = document.getElementById('profileJoinDate');

    const profileReviewsContainer = document.getElementById('profileReviewsContainer');

    const reviewsHeading = document.getElementById('profileReviewsHeading');

    const editProfileBtn = document.getElementById('editProfileBtn');

    const profileVehicle = document.getElementById('profileVehicle');

    const profileBio = document.getElementById('profileBio');

    const profileBadgesContainer = document.getElementById('profileBadgesContainer');

    const allBadgesContainer = document.getElementById('allBadgesContainer');


    profileReviewsContainer.innerHTML = '<p class="text-light-secondary">Loading profile...</p>';

    profileModal.classList.remove('hidden');


    try {
        const response = await fetch(`${API_URL}/users/profile/${username}`);
        if (!response.ok) {
            await handleApiError(response, profileReviewsContainer);
            return;
        }
        const { user, reviews, badges: userBadges } = await response.json();
        const allBadges = await fetchAllBadges();

        // Populate public profile view
        profileTitle.textContent = `${user.username}'s Profile`;
        reviewsHeading.textContent = `${user.username}'s Submitted Reviews`;
        profileFirstNameEl.textContent = user.first_name || 'N/A';
        profileUsernameEl.textContent = user.username;
        profileJoinDateEl.textContent = new Date(user.created_at).toLocaleDateString();
        profileEmailContainer.style.display = 'none';
        profileJoinDateContainer.style.display = 'block';
        editProfileBtn.classList.add('hidden');
        profileVehicle.textContent = (user.current_vehicle_make && user.current_vehicle_model)
            ? `${user.current_vehicle_color || ''} ${user.current_vehicle_year || ''} ${user.current_vehicle_make} ${user.current_vehicle_model}`.trim()
            : 'Not specified';

        profileBio.innerHTML = user.bio ? renderStructuredComment(user.bio) : 'No bio provided.';

        renderProfileBadges(userBadges, allBadges, profileBadgesContainer, 4);
        renderProfileBadges(userBadges, allBadges, allBadgesContainer);
        renderProfileReviews(profileReviewsContainer, reviews, user.username);

    } catch (error) {
        console.error(`A critical error occurred during showUserProfile for ${username}:`, error);
        profileReviewsContainer.innerHTML = `<p class="text-red-500">A critical error occurred. Please check the console.</p>`;
    }

};


/**

 * Fetches and displays the currently logged-in user's profile.

 */

const showProfileModal = async () => {

    if (!authToken) return;


    const profileModal = document.getElementById('profileModal');

    const profileTitle = profileModal.querySelector('h2');

    const profileEmailContainer = document.getElementById('profileEmail').parentElement;

    const profileJoinDateContainer = document.getElementById('profileJoinDate').parentElement;

    const profileReviewsContainer = document.getElementById('profileReviewsContainer');

    const reviewsHeading = document.getElementById('profileReviewsHeading');

    const editProfileBtn = document.getElementById('editProfileBtn');

    const profileVehicle = document.getElementById('profileVehicle');

    const profileBio = document.getElementById('profileBio');

    const profileBadgesContainer = document.getElementById('profileBadgesContainer');

    const allBadgesContainer = document.getElementById('allBadgesContainer');


    // Configure for "My Profile" view

    profileTitle.textContent = 'My Profile';

    reviewsHeading.textContent = 'My Submitted Reviews';

    profileEmailContainer.style.display = 'block';

    profileJoinDateContainer.style.display = 'block';

    editProfileBtn.classList.remove('hidden');


    profileReviewsContainer.innerHTML = '<p class="text-light-secondary">Loading your profile...</p>';

    profileModal.classList.remove('hidden');


    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) {
            await handleApiError(response, profileReviewsContainer);
            return;
        }

        const { user, reviews, badges: userBadges } = await response.json();
        const allBadges = await fetchAllBadges();

        // Populate display view
        document.getElementById('profileFirstName').textContent = user.first_name || 'N/A';
        document.getElementById('profileUsername').textContent = user.username;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profileJoinDate').textContent = new Date(user.created_at).toLocaleDateString();
        profileVehicle.textContent = (user.current_vehicle_make && user.current_vehicle_model)
            ? `${user.current_vehicle_color || ''} ${user.current_vehicle_year || ''} ${user.current_vehicle_make} ${user.current_vehicle_model}`.trim()
            : 'Not specified';

        profileBio.innerHTML = user.bio ? renderStructuredComment(user.bio) : 'No bio provided.';

        // Populate the edit form fields
        document.getElementById('profile_first_name').value = user.first_name || '';
        document.getElementById('profile_vehicle_year').value = user.current_vehicle_year || '';
        document.getElementById('profile_vehicle_make').value = user.current_vehicle_make || '';
        document.getElementById('profile_vehicle_make').dispatchEvent(new Event('change'));
        setTimeout(() => {
            document.getElementById('profile_vehicle_model').value = user.current_vehicle_model || '';
            document.getElementById('profile_vehicle_color').value = user.current_vehicle_color || '';
        }, 100);

        // Populate the bio edit form
        const bioTemplateSelect = document.getElementById('bio-template');
        if (user.bio && user.bio.template) {
            bioTemplateSelect.value = user.bio.template;
        }
        bioTemplateSelect.dispatchEvent(new Event('change'));
        setTimeout(() => {
            if (user.bio && user.bio.words) {
                const wordSelects = document.querySelectorAll('#bio-words-container select');
                wordSelects.forEach((select, index) => {
                    if (user.bio.words[index]) {
                        select.value = user.bio.words[index];
                    }
                });
            }
        }, 100);

        // Render dynamic content
        renderProfileBadges(userBadges, allBadges, profileBadgesContainer, 4);
        renderProfileBadges(userBadges, allBadges, allBadgesContainer);
        renderProfileReviews(profileReviewsContainer, reviews, user.username);

    } catch (error) {
        console.error("A critical error occurred during showProfileModal:", error);
        profileReviewsContainer.innerHTML = `<p class="text-red-500">A critical error occurred. Please check the console.</p>`;
    }

};



// --- 5. Authentication & User Actions ---


/**

 * Updates the UI based on the user's authentication status.

 */

const updateAuthUI = () => {

    const loginBtn = document.getElementById('loginBtn');

    const userInfo = document.getElementById('userInfo');

    const usernameDisplay = document.getElementById('usernameDisplay');

    const addReviewBtn = document.getElementById('addReviewBtn');
    const adminDashboardBtn = document.getElementById('adminDashboardBtn');

    if (authToken) {
        loginBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
        usernameDisplay.textContent = currentUsername;
        addReviewBtn.disabled = false;

        if (adminDashboardBtn) {
            adminDashboardBtn.style.display = isAdmin ? 'flex' : 'none';
        }
    } else {
        loginBtn.classList.remove('hidden');
        userInfo.classList.add('hidden');
        addReviewBtn.disabled = true;
        if (adminDashboardBtn) {
            adminDashboardBtn.style.display = 'none';
        }
    }

};


/**

 * Handles user logout.

 */

const handleLogout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('username');

    localStorage.removeItem('isAdmin');

    authToken = null;

    currentUsername = null;

    isAdmin = false;

    userVotes = {};

    updateAuthUI();

    document.getElementById('profileModal').classList.add('hidden');

};


/**

 * Toggles the authentication modal between 'Login' and 'Register' modes.

 */

const switchAuthMode = () => {

    isAuthModalInLoginMode = !isAuthModalInLoginMode;

    const authTitle = document.getElementById('authTitle');

    const authPrompt = document.getElementById('authPrompt');

    const switchAuthModeBtn = document.getElementById('switchAuthModeBtn');

    const emailField = document.getElementById('email-field-container');

    const confirmPasswordField = document.getElementById('confirm-password-container');

    const firstNameField = document.getElementById('first-name-field-container');

    const emailInput = document.getElementById('email');

    const confirmPasswordInput = document.getElementById('confirmPassword');

    const firstNameInput = document.getElementById('first_name');


    if (isAuthModalInLoginMode) {

        authTitle.textContent = 'Login';

        authPrompt.textContent = "Don't have an account?";

        switchAuthModeBtn.textContent = 'Register';

        emailField.classList.add('hidden');

        confirmPasswordField.classList.add('hidden');

        firstNameField.classList.add('hidden');

        emailInput.required = false;

        confirmPasswordInput.required = false;

        firstNameInput.required = false;

    } else {

        authTitle.textContent = 'Register';

        authPrompt.textContent = "Already have an account?";

        switchAuthModeBtn.textContent = 'Login';

        emailField.classList.remove('hidden');

        confirmPasswordField.classList.remove('hidden');

        firstNameField.classList.remove('hidden');

        emailInput.required = true;

        confirmPasswordInput.required = true;

        firstNameInput.required = true;

    }

    document.getElementById('authMessage').textContent = '';

    document.getElementById('authForm').reset();

};


/**

 * Handles a user's vote action (upvote or downvote).

 * @param {'up' | 'down'} clickedVoteType - The type of vote being cast.

 */

const handleVote = async (clickedVoteType) => {

    if (!authToken) {

        alert('You must be logged in to vote.');

        return;

    }


    const review = currentPlateReviews[currentReviewIndex];

    const currentVote = userVotes[review.id];

    let newVoteType = (clickedVoteType === currentVote) ? 'none' : clickedVoteType;


    // Optimistic UI Update

    if (currentVote === 'up') review.upvotes--;

    if (currentVote === 'down') review.downvotes--;

    if (newVoteType === 'up') review.upvotes++;

    if (newVoteType === 'down') review.downvotes++;

    if (newVoteType === 'none') delete userVotes[review.id];

    else userVotes[review.id] = newVoteType;


    updateReviewDetailModalContent(review);


    try {
        const response = await fetch(`${API_URL}/reviews/${review.id}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ voteType: newVoteType }),
        });

        if (!response.ok) {
            // Since we can't easily show an error in the modal without adding a new element,
            // we'll use an alert for now and then revert the data.
            const errorElement = document.createElement('div');
            await handleApiError(response, errorElement);
            alert(`Error: ${errorElement.textContent}`);
            fetchReviews(); // Re-fetch to get the correct state from the server.
        }
    } catch (error) {
        console.error('A critical error occurred during handleVote:', error);
        alert('A critical error occurred while voting. Reverting changes.');
        fetchReviews(); // Re-fetch to get the correct state from the server
    }

};


// --- 6. Event Listeners & Initialization ---


/**

 * Attaches event listeners to the 'Add Review' modal elements after it's injected.

 */

const reassignModalElements = () => {
    const closeModalBtn = document.getElementById('closeModalBtn');
    const reviewForm = document.getElementById('reviewForm');
    const formMessage = document.getElementById('formMessage');
    const tagsInput = document.getElementById('tags');
    const traitChips = document.querySelectorAll('.trait-chip');
    const addReviewBtn = document.getElementById('addReviewBtn');
    const reviewModal = document.getElementById('reviewModal');
    const authModal = document.getElementById('authModal');
    const plateNumberInput = document.getElementById('plate_number');
    const vehicleMakeSelect = document.getElementById('vehicle_make');
    const vehicleModelSelect = document.getElementById('vehicle_model');
    const commentTemplateSelect = document.getElementById('comment-template');
    const commentWordsContainer = document.getElementById('comment-words-container');
    const noCommentCheckbox = document.getElementById('no-comment-checkbox');
    const commentBuilderBody = document.getElementById('comment-builder-body');

    plateNumberInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\s/g, '-').toUpperCase();
    });

    noCommentCheckbox.addEventListener('change', () => {
        commentBuilderBody.style.display = noCommentCheckbox.checked ? 'none' : 'block';
    });

    const updateCommentBuilder = () => {
        const templateIndex = commentTemplateSelect.value;
        const selectedTemplate = commentBuilderData.templates[templateIndex];
        const placeholders = selectedTemplate.match(/_____/g) || [];

        commentWordsContainer.innerHTML = '';
        placeholders.forEach((_, i) => {
            const wordSelectHtml = `
    <div>
        <label class="text-sm font-medium text-secondary">Word ${i + 1}</label>
        <select name="comment_word_${i}" class="w-full mt-1 px-3 py-2 bg-tertiary text-primary border border-color rounded-md focus:ring-blue-500 focus:border-blue-500">
            <optgroup label="People">${commentBuilderData.words.people_archetypes.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Vehicles">${commentBuilderData.words.vehicles.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Road Features">${commentBuilderData.words.road_features.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Maneuvers & Actions">${commentBuilderData.words.maneuvers_actions.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Driver Errors">${commentBuilderData.words.driver_errors.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Items & Gestures">${commentBuilderData.words.items_gestures.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Concepts & States">${commentBuilderData.words.concepts_states.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Modes & Stances">${commentBuilderData.words.modes_stances.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Guidance">${commentBuilderData.words.guidance.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Qualities & Adjectives">${commentBuilderData.words.qualities_adjectives.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Directions">${commentBuilderData.words.directions.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Phrases">${commentBuilderData.words.phrases.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Conjunctions">${commentBuilderData.words.conjunctions.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
        </select>
    </div>
`;
            commentWordsContainer.insertAdjacentHTML('beforeend', wordSelectHtml);
        });
    };
    commentTemplateSelect.addEventListener('change', updateCommentBuilder);
    updateCommentBuilder();

    if (vehicleMakeSelect) {
        vehicleMakeSelect.addEventListener('change', () => {
            const selectedMake = vehicleMakeSelect.value;
            const models = vehicleModels[selectedMake] || vehicleModels['Other'];
            vehicleModelSelect.innerHTML = '<option value="">Select Model</option>' + models.map(model => `<option value="${model}">${model}</option>`).join('');
            vehicleModelSelect.disabled = !selectedMake;
        });
    }

    addReviewBtn.addEventListener('click', () => {
        if (authToken) reviewModal.classList.remove('hidden');
        else authModal.classList.remove('hidden');
    });
    closeModalBtn.addEventListener('click', () => reviewModal.classList.add('hidden'));

    let selectedTraits = new Set();
    traitChips.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            const traitValue = chip.dataset.value;
            if (selectedTraits.has(traitValue)) selectedTraits.delete(traitValue);
            else selectedTraits.add(traitValue);
            tagsInput.value = Array.from(selectedTraits).join(', ');
        });
    });

    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formMessage.textContent = '';

        const formData = new FormData(reviewForm);
        const data = Object.fromEntries(formData.entries());

        const errors = [];
        if (!data.plate_number.trim()) errors.push("Plate number is required.");
        if (!data.rating) errors.push("A star rating is required.");

        if (errors.length > 0) {
            formMessage.innerHTML = errors.join('<br>');
            formMessage.className = 'mt-4 text-center text-red-600';
            return;
        }

        formMessage.textContent = 'Submitting...';
        formMessage.className = 'mt-4 text-center text-gray-500';

        if (noCommentCheckbox.checked) {
            data.comment = null;
        } else {
            const selectedWords = Array.from(formData.keys()).filter(k => k.startsWith('comment_word_')).map(k => formData.get(k));
            data.comment = { template: formData.get('comment_template'), words: selectedWords };
        }

        data.rating = Number(data.rating);

        if (forbiddenWords.some(word => data.plate_number.toLowerCase().includes(word))) {
            formMessage.textContent = 'Error: Plate number contains forbidden words.';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                await handleApiError(response, formMessage);
                if (response.status === 401 || response.status === 403) {
                    setTimeout(() => {
                        reviewModal.classList.add('hidden');
                        handleLogout();
                        document.getElementById('authModal').classList.remove('hidden');
                    }, 2500);
                }
                return;
            }

            formMessage.textContent = 'Review submitted successfully!';
            formMessage.className = 'mt-4 text-center text-green-500';
            setTimeout(() => {
                reviewModal.classList.add('hidden');
                reviewForm.reset();
                updateCommentBuilder();
                traitChips.forEach(c => c.classList.remove('active'));
                selectedTraits.clear();
                formMessage.textContent = '';
            }, 1500);
            fetchReviews();

        } catch (error) {
             console.error("A critical error occurred while submitting a review:", error);
             formMessage.textContent = 'A critical error occurred. Please check the console.';
             formMessage.className = 'mt-4 text-center text-red-600';
        }
    });
};

/**
 * Main application initialization function.
 */
function initApp() {
    // --- Element Selectors ---
    const reviewDetailModal = document.getElementById('reviewDetailModal');
    const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
    const prevReviewBtn = document.getElementById('prevReviewBtn');
    const nextReviewBtn = document.getElementById('nextReviewBtn');
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
    const switchAuthModeBtn = document.getElementById('switchAuthModeBtn');
    const authForm = document.getElementById('authForm');
    const showPasswordToggle = document.getElementById('showPasswordToggle');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const upvoteBtn = document.getElementById('upvoteBtn');
    const downvoteBtn = document.getElementById('downvoteBtn');
    const filterStateSelect = document.getElementById('filterState');
    const filterMakeSelect = document.getElementById('filterMake');
    const filterTypeSelect = document.getElementById('filterType');
    const filterSubtypeSelect = document.getElementById('filterSubtype');
    const filterTraitSelect = document.getElementById('filterTrait');
    const sortReviewsSelect = document.getElementById('sortReviews');
    const toggleFiltersBtn = document.getElementById('toggleFiltersBtn');
    const filtersContainer = document.getElementById('filtersContainer');
    const profileBtn = document.getElementById('profileBtn');
    const profileModal = document.getElementById('profileModal');
    const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
    const backToProfileBtn = document.getElementById('backToProfileBtn');
    const badgeDetailModal = document.getElementById('badgeDetailModal');
    const closeBadgeDetailModalBtn = document.getElementById('closeBadgeDetailModalBtn');
    const allBadgesModal = document.getElementById('allBadgesModal');
    const showAllBadgesBtn = document.getElementById('showAllBadgesBtn');
    const closeAllBadgesModalBtn = document.getElementById('closeAllBadgesModalBtn');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const profileDisplayView = document.getElementById('profile-display-view');
    const profileEditView = document.getElementById('profile-edit-view');
    const cancelEditProfileBtn = document.getElementById('cancelEditProfileBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const profileMakeSelect = document.getElementById('profile_vehicle_make');
    const profileModelSelect = document.getElementById('profile_vehicle_model');
    const profileColorSelect = document.getElementById('profile_vehicle_color');
    const profileYearSelect = document.getElementById('profile_vehicle_year');
    const profileEditMessage = document.getElementById('profileEditMessage');
    const bioTemplateSelect = document.getElementById('bio-template');
    const bioWordsContainer = document.getElementById('bio-words-container');

    // --- Theme Management ---
    const themeSelector = document.getElementById('theme-selector');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;

    const applyTheme = (theme) => {
        localStorage.setItem('theme', theme);

        if (theme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark-theme', systemPrefersDark);
            document.documentElement.classList.toggle('light-theme', !systemPrefersDark);
        } else {
            document.documentElement.classList.toggle('dark-theme', theme === 'dark');
            document.documentElement.classList.toggle('light-theme', theme === 'light');
        }

        themeButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.theme === theme);
        });
    };

    // --- Initial Setup ---
    injectReviewModal();
    updateAuthUI();
    if (authToken) {
        fetchUserVotes();
    }
    reassignModalElements();

    // --- Event Listeners ---
    themeSelector.addEventListener('click', (event) => {
        const selectedTheme = event.target.dataset.theme;
        if (selectedTheme) {
            applyTheme(selectedTheme);
        }
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'system') {
            applyTheme('system');
        }
    });

    // Initial theme is set by inline script in <head>
    // We just need to sync the button state
    const savedTheme = localStorage.getItem('theme') || 'system';
    themeButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.theme === savedTheme);
    });

    const stateOptions = ['<option value="">All States</option>', ...usStates.map(state => `<option value="${state}">${state}</option>`)].join('');
    filterStateSelect.innerHTML = stateOptions;
    const makeOptions = ['<option value="">All Makes</option>', ...vehicleMakes.map(make => `<option value="${make}">${make}</option>`)].join('');
    filterMakeSelect.innerHTML = makeOptions;
    profileMakeSelect.innerHTML = makeOptions;
    const uniqueVehicleTypes = [...new Set(Object.values(vehicleType))].sort();
    const typeOptions = ['<option value="">All Types</option>', ...uniqueVehicleTypes.map(type => `<option value="${type}">${type}</option>`)].join('');
    filterTypeSelect.innerHTML = typeOptions;
    const allSubtypes = Object.values(vehicleSubtype).flatMap(models => Object.values(models));
    const uniqueVehicleSubtypes = [...new Set(allSubtypes)].sort();
    const subtypeOptions = ['<option value="">All Subtypes</option>', ...uniqueVehicleSubtypes.map(subtype => `<option value="${subtype}">${subtype}</option>`)].join('');
    filterSubtypeSelect.innerHTML = subtypeOptions;
    const traitOptions = ['<option value="">All Traits</option>', ...allTraits.map(trait => `<option value="${trait}">${trait}</option>`)].join('');
    filterTraitSelect.innerHTML = traitOptions;
    const colorOptions = ['<option value="">Select Color</option>', ...vehicleColors.map(color => `<option value="${color}">${color}</option>`)].join('');
    profileColorSelect.innerHTML = colorOptions;
    const yearOptions = ['<option value="">Select Year</option>'];
    const endYear = new Date().getFullYear() + 1;
    for (let year = endYear; year >= 1900; year--) {
        yearOptions.push(`<option value="${year}">${year}</option>`);
    }
    profileYearSelect.innerHTML = yearOptions.join('');
    const bioTemplateOptions = commentBuilderData.templates.map((template, index) => `<option value="${index}">${template}</option>`).join('');
    bioTemplateSelect.innerHTML = bioTemplateOptions;

    const sortOptions = [
        { value: 'recent', text: 'Newest' },
        { value: 'oldest', text: 'Oldest' },
        { value: 'highest', text: 'Highest Rated' },
        { value: 'lowest', text: 'Lowest Rated' },
    ];
    sortReviewsSelect.innerHTML = sortOptions.map(option => `<option value="${option.value}">${option.text}</option>`).join('');

    // --- Event Listeners ---

    // Auth Modal
    loginBtn.addEventListener('click', () => authModal.classList.remove('hidden'));
    logoutBtn.addEventListener('click', handleLogout);
    closeAuthModalBtn.addEventListener('click', () => authModal.classList.add('hidden'));
    switchAuthModeBtn.addEventListener('click', switchAuthMode);

    // Contact Modal
    const contactModal = document.getElementById('contactModal');
    const contactBtn = document.getElementById('contactBtn');
    const closeContactModalBtn = document.getElementById('closeContactModalBtn');
    contactBtn.addEventListener('click', () => {
        contactModal.classList.remove('hidden');
        if (authToken && currentUsername) {
            fetch(`${API_URL}/users/profile`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            })
            .then(response => response.json())
            .then(data => {
                if (data.user) {
                    document.getElementById('contact-name').value = data.user.first_name || '';
                    document.getElementById('contact-email').value = data.user.email || '';
                }
            })
            .catch(error => console.error('Error fetching user profile:', error));
        }
    });
    closeContactModalBtn.addEventListener('click', () => contactModal.classList.add('hidden'));
    showPasswordToggle.addEventListener('change', () => {
        const isChecked = showPasswordToggle.checked;
        passwordInput.type = isChecked ? 'text' : 'password';
        confirmPasswordInput.type = isChecked ? 'text' : 'password';
    });
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const authMessage = document.getElementById('authMessage');
        authMessage.textContent = 'Processing...';
        authMessage.className = 'text-center text-secondary';
        const formData = new FormData(authForm);
        const data = Object.fromEntries(formData.entries());
        if (!isAuthModalInLoginMode && data.password !== data.confirmPassword) {
            authMessage.textContent = 'Passwords do not match.';
            return;
        }
        const endpoint = isAuthModalInLoginMode ? '/users/login' : '/users/register';
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                await handleApiError(response, authMessage);
                return;
            }

            const result = await response.json();
            if (isAuthModalInLoginMode) {
                authToken = result.accessToken;
                currentUsername = result.username;
                localStorage.setItem('token', authToken);
                localStorage.setItem('username', currentUsername);

                isAdmin = !!(result.isAdmin || result.username === 'admin');
                localStorage.setItem('isAdmin', isAdmin);

                authMessage.textContent = 'Login successful!';
                authMessage.className = 'text-center text-green-500';
                await fetchUserVotes();
                setTimeout(() => { authModal.classList.add('hidden'); updateAuthUI(); }, 500);
            } else {
                authMessage.textContent = 'Registration successful! Please log in.';
                authMessage.className = 'text-center text-green-500';
                switchAuthMode();
            }
        } catch (error) {
            console.error("A critical error occurred during authentication:", error);
            authMessage.textContent = 'A critical error occurred. Please check the console.';
            authMessage.className = 'text-center text-red-500';
        }
    });

    // Review Detail Modal
    const goBackToProfile = () => {
        if (lastViewedProfile) {
            reviewDetailModal.classList.add('hidden');
            if (lastViewedProfile === currentUsername) {
                showProfileModal();
            } else {
                showUserProfile(lastViewedProfile);
            }
            setDetailModalMode('feed'); // Reset mode
        }
    };
    closeDetailModalBtn.addEventListener('click', () => {
        if (lastViewedProfile) {
            goBackToProfile();
        } else {
            reviewDetailModal.classList.add('hidden');
            setDetailModalMode('feed');
        }
    });
    prevReviewBtn.addEventListener('click', showPreviousReview);
    nextReviewBtn.addEventListener('click', showNextReview);
    upvoteBtn.addEventListener('click', () => handleVote('up'));
    downvoteBtn.addEventListener('click', () => handleVote('down'));

    // Profile Modal
    profileBtn.addEventListener('click', showProfileModal);
    closeProfileModalBtn.addEventListener('click', () => profileModal.classList.add('hidden'));
    backToProfileBtn.addEventListener('click', goBackToProfile);

    // Badge Modals
    closeBadgeDetailModalBtn.addEventListener('click', () => badgeDetailModal.classList.add('hidden'));
    showAllBadgesBtn.addEventListener('click', () => allBadgesModal.classList.remove('hidden'));
    closeAllBadgesModalBtn.addEventListener('click', () => allBadgesModal.classList.add('hidden'));

    // Filters
    document.getElementById('searchPlate').addEventListener('input', renderReviews);
    filterStateSelect.addEventListener('change', renderReviews);
    filterMakeSelect.addEventListener('change', renderReviews);
    // Create a mapping from type to its subtypes for the filter logic
    const typesToSubtypes = {};
    for (const subtype in vehicleType) {
        const type = vehicleType[subtype];
        if (!typesToSubtypes[type]) {
            typesToSubtypes[type] = [];
        }
        typesToSubtypes[type].push(subtype);
    }
    
    filterTypeSelect.addEventListener('change', () => {
        const selectedType = filterTypeSelect.value;
        const relevantSubtypes = selectedType ? (typesToSubtypes[selectedType] || []).sort() : uniqueVehicleSubtypes;
        
        const newSubtypeOptions = ['<option value="">All Subtypes</option>', ...relevantSubtypes.map(subtype => `<option value="${subtype}">${subtype}</option>`)].join('');
        filterSubtypeSelect.innerHTML = newSubtypeOptions;
        
        renderReviews();
    });
    filterSubtypeSelect.addEventListener('change', renderReviews);
    filterTraitSelect.addEventListener('change', renderReviews);
    sortReviewsSelect.addEventListener('change', renderReviews);
    toggleFiltersBtn.addEventListener('click', () => {
        filtersContainer.classList.toggle('hidden');
    });

    // Profile Edit
    editProfileBtn.addEventListener('click', () => {
        profileDisplayView.classList.add('hidden');
        profileEditView.classList.remove('hidden');
        editProfileBtn.classList.add('hidden');
    });
    cancelEditProfileBtn.addEventListener('click', () => {
        profileDisplayView.classList.remove('hidden');
        profileEditView.classList.add('hidden');
        editProfileBtn.classList.remove('hidden');
        profileEditMessage.textContent = '';
    });
    profileMakeSelect.addEventListener('change', () => {
        const selectedMake = profileMakeSelect.value;
        const models = vehicleModels[selectedMake] || vehicleModels['Other'];
        profileModelSelect.innerHTML = '<option value="">Select Model</option>' + models.map(model => `<option value="${model}">${model}</option>`).join('');
        profileModelSelect.disabled = !selectedMake;
    });
    const updateBioBuilder = () => {
        const templateIndex = bioTemplateSelect.value;
        const selectedTemplate = commentBuilderData.templates[templateIndex];
        const placeholders = selectedTemplate.match(/_____/g) || [];

        bioWordsContainer.innerHTML = '';
        placeholders.forEach((_, i) => {
            const wordSelectHtml = `
    <div>
        <label class="text-sm font-medium text-light-secondary">Word ${i + 1}</label>
        <select name="bio_word_${i}" class="w-full mt-1 px-3 py-2 bg-dark-tertiary text-light-primary border border-dark rounded-md focus:ring-blue-500 focus:border-blue-500">
            <optgroup label="People">${commentBuilderData.words.people_archetypes.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Vehicles">${commentBuilderData.words.vehicles.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Road Features">${commentBuilderData.words.road_features.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Maneuvers & Actions">${commentBuilderData.words.maneuvers_actions.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Driver Errors">${commentBuilderData.words.driver_errors.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Items & Gestures">${commentBuilderData.words.items_gestures.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Concepts & States">${commentBuilderData.words.concepts_states.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Modes & Stances">${commentBuilderData.words.modes_stances.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Guidance">${commentBuilderData.words.guidance.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Qualities & Adjectives">${commentBuilderData.words.qualities_adjectives.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Directions">${commentBuilderData.words.directions.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Phrases">${commentBuilderData.words.phrases.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
            <optgroup label="Conjunctions">${commentBuilderData.words.conjunctions.map(w => `<option value="${w}">${w}</option>`).join('')}</optgroup>
        </select>
    </div>
`;
            bioWordsContainer.insertAdjacentHTML('beforeend', wordSelectHtml);
        });
    };
    bioTemplateSelect.addEventListener('change', updateBioBuilder);
    updateBioBuilder(); // Initial population
    saveProfileBtn.addEventListener('click', async () => {
        const firstName = document.getElementById('profile_first_name').value;
        const vehicleData = {
            make: profileMakeSelect.value,
            model: profileModelSelect.value,
            color: profileColorSelect.value,
            year: profileYearSelect.value
        };
        const bioWords = Array.from(document.querySelectorAll('#bio-words-container select')).map(select => select.value);
        const bioData = {
            template: bioTemplateSelect.value,
            words: bioWords
        };

        profileEditMessage.textContent = 'Saving...';
        profileEditMessage.className = 'text-center text-sm mt-4 text-gray-500';

        try {
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ first_name: firstName, vehicle: vehicleData, bio: bioData })
            });

            if (!response.ok) {
                await handleApiError(response, profileEditMessage);
                return;
            }

            profileEditMessage.textContent = 'Saved successfully!';
            profileEditMessage.className = 'text-center text-sm mt-4 text-green-500';

            // Update the display view with new data
            document.getElementById('profileFirstName').textContent = firstName || 'N/A';
            document.getElementById('profileVehicle').textContent = (vehicleData.make && vehicleData.model)
                ? `${vehicleData.year || ''} ${vehicleData.color || ''} ${vehicleData.make} ${vehicleData.model}`.trim()
                : 'Not specified';
            document.getElementById('profileBio').innerHTML = renderStructuredComment(bioData);

            setTimeout(() => {
                profileDisplayView.classList.remove('hidden');
                profileEditView.classList.add('hidden');
                editProfileBtn.classList.remove('hidden');
                profileEditMessage.textContent = '';
            }, 1500);

        } catch (error) {
            console.error("A critical error occurred while saving the profile:", error);
            profileEditMessage.textContent = `A critical error occurred. Please check the console.`;
            profileEditMessage.className = 'text-center text-sm mt-4 text-red-500';
        }
    });

    // --- Initial Data Fetch ---
    fetchReviews();
}

/**
 * Fetches and displays the community statistics.
 */
const fetchAndDisplayStats = async () => {
    const totalUsersEl = document.getElementById('stats-total-users');
    if (!totalUsersEl) return;

    try {
        const response = await fetch(`${API_URL}/stats`);
        if (!response.ok) {
            totalUsersEl.textContent = 'N/A';
            return;
        }
        const stats = await response.json();
        if (stats.success) {
            totalUsersEl.textContent = stats.totalUsers;
        }
    } catch (error) {
        console.error("Failed to fetch community stats:", error);
        totalUsersEl.textContent = 'N/A';
    }
};

// --- App Entry Point ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    fetchAndDisplayStats(); // Initial fetch
    setInterval(fetchAndDisplayStats, 30000); // Refresh every 30 seconds
});
